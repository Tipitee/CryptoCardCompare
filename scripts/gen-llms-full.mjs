#!/usr/bin/env node
/**
 * Régénère la TABLE cartes de public/llms-full.txt depuis Supabase (chiffres frais)
 * + les notes éditoriales de seo/llms-card-notes.json (nuance conservée à la main).
 * Ne liste que les cartes status=active (les discontinued, ex. Binance, tombent).
 * Remplace uniquement le bloc entre <!-- CARDS_TABLE_START --> et <!-- CARDS_TABLE_END -->.
 *
 *   set -a && source .env && set +a
 *   node scripts/gen-llms-full.mjs           # DRY-RUN : affiche la table + résumé
 *   node scripts/gen-llms-full.mjs --write   # écrit dans public/llms-full.txt
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const WRITE = process.argv.includes('--write');
const FILE = 'public/llms-full.txt';
const NOTES = JSON.parse(readFileSync('seo/llms-card-notes.json', 'utf8')).notes || {};

const num = v => Number(v) || 0;
const maxCb = c => Math.max(num(c.cashback_base), num(c.cashback_no_staking), num(c.cashback_premium));
const marketLabel = m => (m === 'en' ? 'UK' : String(m).toUpperCase());

const { data, error } = await sb.from('cards')
  .select('id, name, issuer, brand_id, tier_rank, cashback_base, cashback_no_staking, cashback_premium, annual_fees, staking_required, card_network, markets, status');
if (error) { console.error('✗', error.message); process.exit(1); }

const active = (data || []).filter(c => c.status === 'active');
const dropped = (data || []).filter(c => c.status !== 'active');

// Un représentant par marque (brand_id sinon issuer) : le tier au meilleur cashback.
const byBrand = new Map();
for (const c of active) {
  const key = c.brand_id || c.issuer || c.name;
  const cur = byBrand.get(key);
  if (!cur || maxCb(c) > maxCb(cur)) byBrand.set(key, c);
}
const reps = [...byBrand.values()].sort((a, b) => maxCb(b) - maxCb(a));

const noNote = [];
const rows = reps.map(c => {
  const cb = maxCb(c);
  const cashback = cb > 0 ? `Up to ${cb}%` : '0% / none';
  const staking = num(c.staking_required) > 0 ? (num(c.cashback_no_staking) > 0 ? 'Optional' : 'Yes') : 'No';
  const fee = num(c.annual_fees) > 0 ? `€${c.annual_fees}` : '€0';
  const markets = (c.markets || []).map(marketLabel).join(', ');
  const note = NOTES[c.brand_id] || NOTES[c.issuer] || NOTES[c.name] || '';
  if (!note) noNote.push(c.issuer || c.name);
  return `| ${c.name} | ${c.issuer} | ${cashback} | ${staking} | ${fee} | ${c.card_network || ''} | ${markets} | ${note} |`;
});

const header = '| Card | Issuer | Cashback | Staking Required | Annual Fee | Networks | Markets | Note |\n' +
               '|------|--------|----------|-----------------|------------|---------|---------|------|';
const table = [header, ...rows].join('\n');

const now = new Date();
const month = now.toLocaleString('en-US', { month: 'long' });
const stamp = `${month} ${now.getFullYear()}`;

// Résumé
console.log(`\n${WRITE ? '=== ÉCRITURE ===' : '=== DRY-RUN ==='}`);
console.log(`${active.length} cartes actives → ${reps.length} marques listées. ${dropped.length} non-active exclues.`);
if (dropped.length) console.log(`Exclues (status): ${dropped.map(c => `${c.name}[${c.status}]`).join(', ')}`);
if (noNote.length) console.log(`⚠️ Sans note édito (ajoute-les dans seo/llms-card-notes.json) : ${[...new Set(noNote)].join(', ')}`);
console.log(`\n${table}\n`);

const raw = readFileSync(FILE, 'utf8');
const re = /(<!-- CARDS_TABLE_START[^\n]*-->\n)[\s\S]*?(\n<!-- CARDS_TABLE_END -->)/;
if (!re.test(raw)) { console.error(`✗ Repères CARDS_TABLE_START/END introuvables dans ${FILE}.`); process.exit(1); }
let out = raw.replace(re, `$1${table}$2`);
out = out.replace(/> Last updated: .*/, `> Last updated: ${stamp} (table auto-générée depuis la base)`);

if (WRITE) {
  writeFileSync(FILE, out);
  console.log(`✓ ${FILE} mis à jour (table + date ${stamp}).`);
  console.log(`Pense à commit + push pour publier.`);
} else {
  console.log(`DRY-RUN. Vérifie la table ci-dessus, puis : node scripts/gen-llms-full.mjs --write`);
}
