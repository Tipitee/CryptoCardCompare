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

// Mots très fréquents et quasi exclusifs à chaque langue (pour deviner la langue réelle du texte)
const MARKERS = {
  en: [' the ', ' with ', ' your ', ' and ', ' for ', ' fees', ' cashback', ' without ', ' best ', ' card '],
  fr: [' le ', ' la ', ' les ', ' avec ', ' votre ', ' des ', ' sans ', ' cartes', ' frais', ' meilleure'],
  de: [' der ', ' die ', ' und ', ' mit ', ' ohne ', ' Karte', ' Gebühren', ' beste'],
  es: [' el ', ' la ', ' con ', ' sin ', ' tarjeta', ' mejores', ' comisiones'],
  it: [' il ', ' la ', ' con ', ' senza ', ' carta', ' migliori', ' commissioni'],
};
function guessLang(text) {
  const t = (' ' + (text || '').toLowerCase() + ' ').slice(0, 2000);
  let best = null, bestScore = 0;
  for (const [lang, words] of Object.entries(MARKERS)) {
    const score = words.reduce((a, w) => a + (t.split(w).length - 1), 0);
    if (score > bestScore) { bestScore = score; best = lang; }
  }
  return bestScore >= 3 ? best : null; // pas assez de signal → on ne juge pas
}

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, published, content')
  .order('created_at', { ascending: false });
if (error) { console.error('✗', error.message); process.exit(1); }

const emptyTitle = [];
const langMismatch = [];
for (const p of data) {
  if (!p.title || !p.title.trim()) { emptyTitle.push(p); continue; }
  const guessed = guessLang(p.content);
  // be→fr, at→de pour la comparaison
  const expected = { be: 'fr', at: 'de' }[p.lang] ?? p.lang;
  if (guessed && guessed !== expected) langMismatch.push({ ...p, guessed, expected });
}

console.log(`\n${data.length} posts au total.`);
console.log(`\n🟥 TITRE VIDE : ${emptyTitle.length}`);
emptyTitle.slice(0, 30).forEach(p => console.log(`   [${p.lang}] ${p.slug} ${p.published ? '(PUBLIÉ)' : '(brouillon)'}`));

console.log(`\n🟧 MAUVAISE LANGUE (contenu ≠ lang) : ${langMismatch.length}`);
langMismatch.slice(0, 40).forEach(p => console.log(`   [${p.lang}, texte semble ${p.guessed}] ${p.slug} ${p.published ? '(PUBLIÉ)' : '(brouillon)'} — ${p.title.slice(0,45)}`));

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
