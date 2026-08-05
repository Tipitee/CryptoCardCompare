#!/usr/bin/env node
/**
 * Trouve où une carte est citée en PROSE FIGÉE (chiffres non reliés à la DB) :
 * articles de blog (blog_posts.content) + fichiers éditoriaux src/data/*.ts.
 * Sert à corriger la prose quand une carte change (les pages structurées, elles,
 * se mettent à jour seules via la table `cards`).
 *
 *   set -a && source .env && set +a
 *   node scripts/find-card-mentions.mjs "Binance"
 *   node scripts/find-card-mentions.mjs "Bybit Card" "Bybit"   # plusieurs termes
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const terms = process.argv.slice(2).filter(Boolean);
if (!terms.length) { console.error('Usage: node scripts/find-card-mentions.mjs "<terme>" ["<terme2>"...]'); process.exit(1); }
const rx = new RegExp(terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Articles de blog
console.log(`\n=== ARTICLES BLOG citant : ${terms.join(' / ')} ===`);
const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, content, published');
if (error) { console.error('✗', error.message); process.exit(1); }
const hits = (data || []).filter(p => rx.test(`${p.title}\n${p.content || ''}`));
if (!hits.length) console.log('  (aucun)');
hits.sort((a, b) => Number(b.published) - Number(a.published)).forEach(p => {
  const n = ((p.content || '').match(new RegExp(rx.source, 'gi')) || []).length;
  console.log(`  [${p.lang}] ${p.published ? 'PUBLIÉ ' : 'draft  '} ${p.slug}  (${n} mention${n > 1 ? 's' : ''})`);
});
console.log(`  → ${hits.length} article(s). Corrige-les via l'admin (le contenu est du texte figé).`);

// 2. Fichiers éditoriaux figés
console.log(`\n=== FICHIERS src/data/*.ts citant : ${terms.join(' / ')} ===`);
const dir = 'src/data';
let fileHits = 0;
for (const f of readdirSync(dir).filter(f => f.endsWith('.ts'))) {
  const lines = readFileSync(join(dir, f), 'utf8').split(/\r?\n/);
  const matched = lines.map((l, i) => ({ l, i: i + 1 })).filter(x => rx.test(x.l));
  if (matched.length) {
    fileHits++;
    console.log(`  ${dir}/${f}  (${matched.length} ligne${matched.length > 1 ? 's' : ''}) ex. L${matched[0].i}`);
  }
}
if (!fileHits) console.log('  (aucun)');

console.log(`\nRappel : les fiches carte, tarifs, comparatifs et thématiques lisent la table \`cards\` en direct → déjà à jour après apply-card-updates. Ici on ne liste que la PROSE à corriger à la main.`);
