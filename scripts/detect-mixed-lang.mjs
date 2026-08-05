#!/usr/bin/env node
/**
 * Détecte les articles au contenu MIXTE (ex. paragraphes français dans un article italien).
 * Analyse paragraphe par paragraphe, sur les 560 posts, toutes langues.
 *
 *   set -a && source .env && set +a
 *   node scripts/detect-mixed-lang.mjs                 # rapport (écrit aussi seo/state/mixed-lang-report.md)
 *   node scripts/detect-mixed-lang.mjs --slug=xxx      # focus 1 article (montre chaque paragraphe classé)
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const slugArg = (process.argv.find(a => a.startsWith('--slug=')) || '').split('=')[1];

// Marqueurs discriminants (mots-fonction). Enrichis pour bien séparer FR vs IT.
const MARKERS = {
  en: [' the ', ' with ', ' your ', ' and ', ' for ', ' without ', ' which ', ' this ', ' you ', ' are ', ' is ', ' of the ', ' offers ', ' that ', ' from ', ' have ', ' will '],
  fr: [' les ', ' des ', ' avec ', ' votre ', ' vous ', ' sans ', ' est ', ' qui ', ' pour ', ' dans ', ' aux ', ' pas ', ' cette ', ' ne ', ' été ', ' aussi ', ' plus ', ' leur ', ' nos '],
  de: [' der ', ' die ', ' und ', ' mit ', ' ohne ', ' ist ', ' für ', ' eine ', ' den ', ' das ', ' sie ', ' auch ', ' nicht ', ' oder ', ' auf ', ' werden ', ' bei '],
  es: [' con ', ' sin ', ' una ', ' para ', ' los ', ' del ', ' por ', ' más ', ' como ', ' pero ', ' son ', ' este ', ' esta ', ' también ', ' que '],
  it: [' di ', ' che ', ' della ', ' delle ', ' gli ', ' nel ', ' nella ', ' con ', ' senza ', ' una ', ' per ', ' più ', ' come ', ' sono ', ' questa ', ' questo ', ' anche ', ' negli ', ' dei '],
};
function scoreLangs(text) {
  const t = (' ' + (text || '').toLowerCase() + ' ').replace(/\s+/g, ' ');
  const s = {};
  for (const [lang, w] of Object.entries(MARKERS)) s[lang] = w.reduce((a, x) => a + (t.split(x).length - 1), 0);
  return s;
}
// Classe un paragraphe : renvoie la langue si signal net, sinon null.
function classify(text) {
  const words = (text.match(/\S+/g) || []).length;
  if (words < 12) return null;                       // trop court → pas de verdict
  const s = scoreLangs(text);
  const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [l1, v1] = ranked[0];
  const v2 = ranked[1]?.[1] ?? 0;
  if (v1 >= 3 && v1 >= 1.6 * v2) return l1;           // gagnant net
  return null;                                       // ambigu → on ne juge pas
}
const dbLang = l => ({ be: 'fr', at: 'de' }[l] ?? l);
const clean = s => (s || '').replace(/[#>*_`|]+/g, ' ').replace(/\s+/g, ' ').trim();

let q = sb.from('blog_posts').select('id, lang, slug, title, published, content');
if (slugArg) q = q.eq('slug', slugArg);
const { data, error } = await q;
if (error) { console.error('✗', error.message); process.exit(1); }

// Mode focus 1 article : montre chaque paragraphe et sa langue détectée.
if (slugArg) {
  for (const p of data) {
    console.log(`\n=== [${p.lang}] ${p.slug} (attendu: ${dbLang(p.lang)}) ${p.published ? 'PUBLIÉ' : 'brouillon'} ===`);
    const paras = (p.content || '').split(/\n\s*\n/).map(clean).filter(Boolean);
    paras.forEach((para, i) => {
      const c = classify(para);
      const flag = c && c !== dbLang(p.lang) ? `  ⚠️ ${c.toUpperCase()}` : '';
      console.log(`\n[¶${i + 1} → ${c ?? '?'}]${flag}\n${para.slice(0, 200)}`);
    });
  }
  process.exit(0);
}

// Mode global : flag les articles mixtes.
const flagged = [];
for (const p of data) {
  const expected = dbLang(p.lang);
  const paras = (p.content || '').split(/\n\s*\n/).map(clean).filter(Boolean);
  const counts = {};
  const foreignSamples = [];
  for (const para of paras) {
    const c = classify(para);
    if (!c) continue;
    counts[c] = (counts[c] || 0) + 1;
    if (c !== expected) foreignSamples.push({ lang: c, text: para.slice(0, 160) });
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const foreign = total - (counts[expected] || 0);
  // Mixte si ≥2 paragraphes étrangers, OU ≥1 et ≥20% du contenu classé.
  if (total >= 2 && (foreign >= 2 || (foreign >= 1 && foreign / total >= 0.2))) {
    flagged.push({ ...p, expected, counts, total, foreign, foreignSamples });
  }
}

flagged.sort((a, b) => b.foreign - a.foreign);

const byLang = flagged.reduce((m, p) => ((m[p.lang] = (m[p.lang] || 0) + 1), m), {});
let out = `# Articles au contenu mixte (langue déclarée ≠ paragraphes)\n\n`;
out += `${data.length} posts analysés · **${flagged.length} articles mixtes**\n\n`;
out += `Par langue déclarée : ${JSON.stringify(byLang)}\n\n---\n`;

console.log(`\n${data.length} posts analysés.`);
console.log(`🟥 ARTICLES MIXTES : ${flagged.length}`);
console.log(`Par langue déclarée :`, byLang);

for (const p of flagged) {
  const line = `\n### [${p.lang}] ${p.slug} ${p.published ? '★ PUBLIÉ' : '(brouillon)'}\n` +
    `- paragraphes classés : ${JSON.stringify(p.counts)} (attendu ${p.expected}, étrangers ${p.foreign}/${p.total})\n` +
    p.foreignSamples.slice(0, 3).map(s => `- ⚠️ ${s.lang.toUpperCase()} : « ${s.text} »`).join('\n') + '\n';
  out += line;
  console.log(`\n[${p.lang}] ${p.slug} ${p.published ? '★ PUBLIÉ' : '(brouillon)'} — étrangers ${p.foreign}/${p.total} ${JSON.stringify(p.counts)}`);
  p.foreignSamples.slice(0, 2).forEach(s => console.log(`   ⚠️ ${s.lang.toUpperCase()}: ${s.text.slice(0, 110)}`));
}

mkdirSync('seo/state', { recursive: true });
writeFileSync('seo/state/mixed-lang-report.md', out);
console.log(`\n📄 Rapport complet écrit : seo/state/mixed-lang-report.md`);
console.log(`Pour inspecter 1 article paragraphe par paragraphe :`);
console.log(`   node scripts/detect-mixed-lang.mjs --slug=<slug>`);
