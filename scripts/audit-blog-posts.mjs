#!/usr/bin/env node
/**
 * Audit + nettoyage des blog_posts mal formés.
 * Détecte : titre vide, et contenu dans la MAUVAISE langue (ex. anglais sous lang=fr).
 *
 *   set -a && source .env && set +a
 *   node scripts/audit-blog-posts.mjs                 # rapport seul (rien supprimé)
 *   node scripts/audit-blog-posts.mjs --delete-empty  # supprime les posts au titre vide
 *   node scripts/audit-blog-posts.mjs --unpublish-mismatch  # dépublie les posts en mauvaise langue
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const DELETE_EMPTY = process.argv.includes('--delete-empty');
const UNPUBLISH_MISMATCH = process.argv.includes('--unpublish-mismatch');

// Mots-fonction EXCLUSIFS à chaque langue (articles/prépositions/verbes courants).
// On évite les mots du domaine (cashback, card, fees...) qui existent dans plusieurs langues.
const MARKERS = {
  en: [' the ', ' with ', ' your ', ' and ', ' for ', ' without ', ' which ', ' this ', ' you ', ' are ', ' is ', ' of the ', ' offers '],
  fr: [' le ', ' les ', ' avec ', ' votre ', ' des ', ' sans ', ' est ', ' vous ', ' une ', ' qui ', ' pour ', ' dans ', ' cette '],
  de: [' der ', ' die ', ' und ', ' mit ', ' ohne ', ' ist ', ' für ', ' eine ', ' den ', ' das ', ' sie ', ' auch ', ' nicht '],
  es: [' el ', ' con ', ' sin ', ' una ', ' para ', ' los ', ' que ', ' del ', ' por ', ' más ', ' como '],
  it: [' il ', ' con ', ' senza ', ' una ', ' per ', ' che ', ' della ', ' più ', ' come ', ' sono ', ' questa '],
};
function scores(text) {
  const t = (' ' + (text || '').toLowerCase() + ' ').replace(/\s+/g, ' ');
  const s = {};
  for (const [lang, words] of Object.entries(MARKERS)) {
    s[lang] = words.reduce((a, w) => a + (t.split(w).length - 1), 0);
  }
  return s;
}

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, published, content')
  .order('created_at', { ascending: false });
if (error) { console.error('✗', error.message); process.exit(1); }

const snippet = (s) => (s || '').replace(/[#>*_`\-\|\n\r]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);

const emptyTitle = [];
const langMismatch = [];
for (const p of data) {
  if (!p.title || !p.title.trim()) { emptyTitle.push(p); continue; }
  // be→fr, at→de pour la comparaison
  const expected = { be: 'fr', at: 'de' }[p.lang] ?? p.lang;
  const s = scores(p.content);
  const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [guessed, gScore] = ranked[0];
  const eScore = s[expected] ?? 0;
  // On ne flag QUE si une autre langue gagne NETTEMENT sur la langue attendue :
  // signal fort (≥8) ET au moins 2× le score de la langue attendue.
  if (guessed !== expected && gScore >= 8 && gScore >= 2 * eScore) {
    langMismatch.push({ ...p, guessed, gScore, expected, eScore });
  }
}

console.log(`\n${data.length} posts au total.`);
console.log(`\n🟥 TITRE VIDE : ${emptyTitle.length}`);
emptyTitle.slice(0, 30).forEach(p => console.log(`   [${p.lang}] ${p.slug} ${p.published ? '(PUBLIÉ)' : '(brouillon)'}`));

console.log(`\n🟧 MAUVAISE LANGUE (contenu ≠ lang, signal fort) : ${langMismatch.length}`);
langMismatch.slice(0, 40).forEach(p => {
  console.log(`\n   [${p.lang} → semble ${p.guessed}  (${p.guessed}:${p.gScore} vs ${p.expected}:${p.eScore})] ${p.published ? '★ PUBLIÉ' : 'brouillon'}`);
  console.log(`   ${p.slug}`);
  console.log(`   « ${snippet(p.content)} »`);
});

if (DELETE_EMPTY && emptyTitle.length) {
  const ids = emptyTitle.map(p => p.id);
  const { error: e } = await sb.from('blog_posts').delete().in('id', ids);
  console.log(e ? `\n✗ suppression : ${e.message}` : `\n✓ ${ids.length} posts au titre vide supprimés.`);
}
if (UNPUBLISH_MISMATCH && langMismatch.length) {
  const ids = langMismatch.filter(p => p.published).map(p => p.id);
  if (ids.length) {
    const { error: e } = await sb.from('blog_posts').update({ published: false }).in('id', ids);
    console.log(e ? `✗ dépublication : ${e.message}` : `✓ ${ids.length} posts en mauvaise langue dépubliés (repassés en brouillon).`);
  }
}

if (!DELETE_EMPTY && !UNPUBLISH_MISMATCH) {
  console.log(`\nRien supprimé (rapport seul). Pour agir :`);
  console.log(`   node scripts/audit-blog-posts.mjs --delete-empty        # supprime les titres vides`);
  console.log(`   node scripts/audit-blog-posts.mjs --unpublish-mismatch  # dépublie les mauvaises langues`);
  console.log(`Puis : node scripts/gen-blog-sitemap.mjs && commit + push.`);
}
