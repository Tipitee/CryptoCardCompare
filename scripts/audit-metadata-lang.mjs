#!/usr/bin/env node
/**
 * Audit CHAMP PAR CHAMP : détecte les articles dont le titre / excerpt / meta / slug
 * sont dans une autre langue que celle déclarée (bug de localisation : contenu traduit
 * mais métadonnées restées en FR). Signale aussi les hero images manquantes.
 *
 *   set -a && source .env && set +a
 *   node scripts/audit-metadata-lang.mjs                 # rapport (+ seo/state/metadata-lang-report.md)
 *   node scripts/audit-metadata-lang.mjs --published     # publiés seulement (priorité live)
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const ONLY_PUB = process.argv.includes('--published');
const dbLang = l => ({ be: 'fr', at: 'de' }[l] ?? l);

// Mots-clés discriminants. Mots piégés retirés : 'guide' (FR+EN), 'card/cards'
// (dans tous les noms de marque, toutes langues), 'review', 'free'.
const KW = {
  fr: ['meilleure', 'meilleur', 'meilleures', 'sans', 'frais', 'voyage', 'notre', 'votre', 'avis', 'comment', 'pourquoi', 'selection', 'sélection', 'testee', 'testée', 'gratuite', 'gratuit', 'comparatif', 'disponible', 'depenser', 'dépenser', 'securite', 'sécurité', 'choisir', 'cette', 'pour', 'avec', 'quelle', 'faut', 'declarer', 'déclarer', 'etranger', 'étranger'],
  it: ['migliore', 'migliori', 'senza', 'viaggi', 'viaggiare', 'viaggio', 'recensione', 'perche', 'perché', 'gratuita', 'gratuito', 'confronto', 'disponibili', 'spendere', 'sicurezza', 'scegliere', 'commissioni', 'della', 'come', 'che', 'più', 'questa', 'quale', 'estero', 'duello'],
  de: ['beste', 'besten', 'ohne', 'gebuhren', 'gebühren', 'reisen', 'vergleich', 'sicherheit', 'wahlen', 'wählen', 'ausgeben', 'verfugbar', 'verfügbar', 'welche', 'fur', 'für', 'und', 'testbericht', 'erfahrungen', 'bewertung', 'kampf', 'giganten', 'nutzen', 'direkt'],
  es: ['mejor', 'mejores', 'tarjeta', 'tarjetas', 'comisiones', 'viajar', 'viaje', 'reseña', 'resena', 'comparativa', 'gratis', 'gastar', 'seguridad', 'elegir', 'sin', 'para', 'mas', 'más', 'como', 'opinion', 'opiniones', 'disponibilidad', 'espana', 'españa'],
  en: ['best', 'without', 'fees', 'travel', 'comparison', 'available', 'spend', 'security', 'choose', 'which', 'with', 'your', 'spends', 'directly', 'wallet', 'battle', 'giants', 'complete', 'beginner'],
};

function scoresOf(text) {
  const t = ' ' + (text || '').toLowerCase().replace(/[-_/]+/g, ' ').replace(/[^\p{L}\s]/gu, ' ').replace(/\s+/g, ' ') + ' ';
  const s = {};
  for (const [lang, words] of Object.entries(KW)) {
    s[lang] = words.reduce((a, w) => a + (t.includes(' ' + w + ' ') ? 1 : 0), 0);
  }
  return s;
}
// Un champ est "en mauvaise langue" seulement s'il ressemble NETTEMENT à une autre
// langue que celle attendue (contenu) : ≥2 mots-clés étrangers ET l'emportant de ≥2.
function fieldMismatch(text, expected) {
  const s = scoresOf(text);
  const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [l1, v1] = ranked[0];
  const exp = s[expected] ?? 0;
  if (l1 !== expected && v1 >= 2 && v1 >= exp + 2) return l1;
  return null;
}

let q = sb.from('blog_posts').select('id, lang, slug, title, excerpt, meta_title, meta_description, content, image_hero, published');
if (ONLY_PUB) q = q.eq('published', true);
const { data, error } = await q;
if (error) { console.error('✗', error.message); process.exit(1); }

const FIELDS = ['title', 'excerpt', 'meta_title', 'meta_description', 'slug'];
const flagged = [];
let noHero = 0;

for (const p of data) {
  const expected = dbLang(p.lang);
  const bad = [];
  for (const f of FIELDS) {
    const got = fieldMismatch(p[f], expected);
    if (got) bad.push({ field: f, got, val: (p[f] || '').slice(0, 70) });
  }
  const heroMissing = !p.image_hero || /og-default/.test(p.image_hero);
  if (heroMissing) noHero++;
  if (bad.length) flagged.push({ ...p, expected, bad, heroMissing });
}

// Résumé
const byLang = flagged.reduce((m, p) => ((m[p.lang] = (m[p.lang] || 0) + 1), m), {});
const byField = {};
flagged.forEach(p => p.bad.forEach(b => (byField[b.field] = (byField[b.field] || 0) + 1)));

console.log(`\n${data.length} posts analysés${ONLY_PUB ? ' (publiés seulement)' : ''}.`);
console.log(`🟥 MÉTADONNÉES EN MAUVAISE LANGUE : ${flagged.length} articles`);
console.log(`   par langue déclarée :`, byLang);
console.log(`   par champ touché    :`, byField);
console.log(`🖼️  hero image manquante (tous posts) : ${noHero}`);

const pubFlagged = flagged.filter(p => p.published);
console.log(`\n⚠️  dont PUBLIÉS (visibles sur le site) : ${pubFlagged.length}`);

let out = `# Audit métadonnées — langue déclarée ≠ champ\n\n`;
out += `${data.length} posts · ${flagged.length} avec métadonnées en mauvaise langue · ${pubFlagged.length} publiés\n`;
out += `Par langue : ${JSON.stringify(byLang)} · Par champ : ${JSON.stringify(byField)}\n\n---\n`;

for (const p of flagged.sort((a, b) => Number(b.published) - Number(a.published))) {
  out += `\n### [${p.lang}] ${p.slug} ${p.published ? '★ PUBLIÉ' : '(brouillon)'}${p.heroMissing ? ' · 🖼️ sans hero' : ''}\n`;
  p.bad.forEach(b => { out += `- **${b.field}** → ${b.got.toUpperCase()} : « ${b.val} »\n`; });
}
mkdirSync('seo/state', { recursive: true });
writeFileSync('seo/state/metadata-lang-report.md', out);

// Aperçu console des 25 premiers publiés
console.log(`\n=== APERÇU (publiés en priorité) ===`);
for (const p of flagged.sort((a, b) => Number(b.published) - Number(a.published)).slice(0, 25)) {
  console.log(`\n[${p.lang}] ${p.slug} ${p.published ? '★PUBLIÉ' : 'brouillon'}${p.heroMissing ? ' · sans hero' : ''}`);
  p.bad.forEach(b => console.log(`   ${b.field} → ${b.got.toUpperCase()}: ${b.val}`));
}
console.log(`\n📄 Rapport complet : seo/state/metadata-lang-report.md`);
