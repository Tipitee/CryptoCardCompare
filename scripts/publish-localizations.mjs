#!/usr/bin/env node
/**
 * Publie TOUS les brouillons restants (les 38 localisations DE/IT/ES oubliées),
 * avec la DATE DU JOUR (échelonnée pour un ordre propre en tête de blog).
 *
 * Sécurité : re-vérifie la langue du contenu et SAUTE tout post dont le texte
 * ne correspond pas à sa langue déclarée (évite de publier de l'anglais mal rangé).
 *
 *   set -a && source .env && set +a
 *   node scripts/publish-localizations.mjs             # DRY-RUN (montre, n'écrit rien)
 *   node scripts/publish-localizations.mjs --confirm   # publie pour de vrai
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');

// --- garde-fou langue (mêmes marqueurs que audit-blog-posts.mjs) ---
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
  for (const [lang, w] of Object.entries(MARKERS)) s[lang] = w.reduce((a, x) => a + (t.split(x).length - 1), 0);
  return s;
}
function wrongLang(p) {
  const expected = { be: 'fr', at: 'de' }[p.lang] ?? p.lang;
  const s = scores(p.content);
  const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [guessed, g] = ranked[0];
  const e = s[expected] ?? 0;
  return guessed !== expected && g >= 8 && g >= 2 * e ? guessed : null;
}

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, published, content')
  .eq('published', false);
if (error) { console.error('✗', error.message); process.exit(1); }

const toPublish = [];
const skipped = [];
for (const p of data) {
  const bad = wrongLang(p);
  if (bad) { skipped.push({ ...p, bad }); continue; }
  toPublish.push(p);
}

console.log(`\n${data.length} brouillons trouvés.`);
console.log(`✅ à publier : ${toPublish.length}`);
console.log(`⏭️  sautés (langue suspecte) : ${skipped.length}`);
skipped.forEach(p => console.log(`   [${p.lang}→${p.bad}] ${p.slug}`));

// Dates échelonnées : le 1er = maintenant, puis -1 min à chaque suivant → ordre stable en tête.
const now = Date.now();
console.log(`\n${CONFIRM ? '=== PUBLICATION ===' : '=== DRY-RUN (rien écrit) ==='}`);
let done = 0;
for (let i = 0; i < toPublish.length; i++) {
  const p = toPublish[i];
  const created = new Date(now - i * 60_000).toISOString();
  if (CONFIRM) {
    const { error: e } = await sb.from('blog_posts')
      .update({ published: true, created_at: created }).eq('id', p.id);
    if (e) { console.log(`   ✗ ${p.slug} : ${e.message}`); continue; }
    done++;
  }
  console.log(`   [${p.lang}] ${p.slug}  →  publié @ ${created.slice(0, 16).replace('T', ' ')}`);
}

if (CONFIRM) {
  console.log(`\n✓ ${done}/${toPublish.length} publiés avec la date du jour.`);
  console.log(`Ensuite : node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: publie localisations DE/IT/ES manquantes" && git push`);
} else {
  console.log(`\nDRY-RUN terminé. Pour publier : node scripts/publish-localizations.mjs --confirm`);
}
