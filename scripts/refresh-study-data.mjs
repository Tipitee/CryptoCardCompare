#!/usr/bin/env node
/**
 * refresh-study-data.mjs
 * Recomputes ALL the metrics used in the "crypto cards study" pages
 * (public/etudes/*.html) from the live Supabase `cards` table, globally and per
 * market. Read-only. Prints a report you paste back so the HTML can be refreshed
 * with current numbers (honest "actualisation").
 *
 *   set -a && source .env && set +a
 *   node scripts/refresh-study-data.mjs            # human report
 *   node scripts/refresh-study-data.mjs --json     # machine-readable JSON
 *
 * Requires: SUPABASE_URL (or VITE_SUPABASE_URL) + a read key
 *           (SUPABASE_SERVICE_KEY / SUPABASE_SERVICE_ROLE_KEY / VITE_SUPABASE_ANON_KEY)
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
if (!URL || !KEY) { console.error('❌ Missing Supabase env'); process.exit(1); }
const sb = createClient(URL, KEY);
const JSON_OUT = process.argv.includes('--json');

const num = v => Number(v) || 0;
const realistic = c => Math.max(num(c.cashback_base), num(c.cashback_no_staking));         // sans staking
const advertised = c => Math.max(num(c.cashback_base), num(c.cashback_no_staking), num(c.cashback_premium)); // affiché max
const pct = (n, d) => d ? Math.round((n / d) * 100) : 0;
const MARKETS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en', 'pt'];
const MARKET_LABEL = { fr: 'France', be: 'Belgique', de: 'Allemagne', at: 'Autriche', es: 'Espagne', it: 'Italie', en: 'UK', pt: 'Portugal' };

const { data, error } = await sb.from('cards')
  .select('name, issuer, brand_id, cashback_base, cashback_no_staking, cashback_premium, annual_fees, staking_required, card_network, markets, status');
if (error) { console.error('✗', error.message); process.exit(1); }

const all = data || [];
const active = all.filter(c => c.status === 'active');
const discontinued = all.filter(c => c.status !== 'active');

// Global metrics (active cards)
const withAdv = active.filter(c => advertised(c) > 0);
const advertisedAvg = withAdv.length ? (withAdv.reduce((a, c) => a + advertised(c), 0) / withAdv.length) : 0;
const realAvg = withAdv.length ? (withAdv.reduce((a, c) => a + realistic(c), 0) / withAdv.length) : 0;
const realityIndex = withAdv.length ? Math.round((withAdv.reduce((a, c) => a + realistic(c) / advertised(c), 0) / withAdv.length) * 100) : 0;
const zeroBase = active.filter(c => realistic(c) === 0).length;
const free = active.filter(c => num(c.annual_fees) === 0).length;
const visa = active.filter(c => /visa/i.test(c.card_network || '')).length;
const mc = active.filter(c => /master/i.test(c.card_network || '')).length;
const stakingReq = active.filter(c => num(c.staking_required) > 0 && realistic(c) === 0).length;

const topGaps = withAdv
  .map(c => ({ name: c.name, adv: advertised(c), real: realistic(c), gap: +(advertised(c) - realistic(c)).toFixed(1), staking: num(c.staking_required) > 0 }))
  .sort((a, b) => b.gap - a.gap).slice(0, 12);

const honest = active
  .filter(c => realistic(c) >= 2 && advertised(c) - realistic(c) <= 1)
  .map(c => ({ name: c.name, adv: advertised(c), real: realistic(c) }))
  .sort((a, b) => b.real - a.real).slice(0, 8);

const perMarket = MARKETS.map(m => {
  const av = active.filter(c => (c.markets || []).includes(m));
  const avAdv = av.filter(c => advertised(c) > 0);
  const idx = avAdv.length ? Math.round((avAdv.reduce((a, c) => a + realistic(c) / advertised(c), 0) / avAdv.length) * 100) : 0;
  return { market: m, label: MARKET_LABEL[m], available: av.length, realityIndex: idx };
});

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  totals: { tracked: all.length, active: active.length, discontinued: discontinued.length },
  discontinued: discontinued.map(c => c.name),
  cashback: { advertisedAvg: +advertisedAvg.toFixed(2), realAvg: +realAvg.toFixed(2), realityIndexPct: realityIndex, cardsWithAdvertised: withAdv.length },
  zeroBase: { count: zeroBase, pct: pct(zeroBase, active.length) },
  free: { count: free, pct: pct(free, active.length) },
  network: { visa, mc, visaPct: pct(visa, active.length), mcPct: pct(mc, active.length) },
  stakingRequiredNoBase: { count: stakingReq, pct: pct(stakingReq, active.length) },
  topGaps, honest, perMarket,
};

if (JSON_OUT) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }

console.log(`\n═══ Étude cartes crypto — données au ${out.generatedAt} ═══`);
console.log(`Suivies: ${out.totals.tracked} | actives: ${out.totals.active} | discontinuées: ${out.totals.discontinued}`);
console.log(`Discontinuées: ${out.discontinued.join(', ') || '—'}`);
console.log(`\nCashback affiché moyen: ${out.cashback.advertisedAvg}%  |  réel (sans staking): ${out.cashback.realAvg}%  |  indice de réalité: ${out.cashback.realityIndexPct}%`);
console.log(`Cartes à 0% de base: ${out.zeroBase.count} (${out.zeroBase.pct}%)`);
console.log(`Sans frais annuels: ${out.free.count} (${out.free.pct}%)`);
console.log(`Réseau: Visa ${out.network.visaPct}% / Mastercard ${out.network.mcPct}%`);
console.log(`Staking requis (0% sinon): ${out.stakingRequiredNoBase.count} (${out.stakingRequiredNoBase.pct}%)`);
console.log(`\nTop écarts affiché→réel:`);
for (const g of out.topGaps) console.log(`  ${g.name}: ${g.adv}% → ${g.real}%  (−${g.gap}${g.staking ? ', staking' : ''})`);
console.log(`\nBons élèves (réel ≥ 2%, écart ≤ 1):`);
for (const h of out.honest) console.log(`  ${h.name}: affiché ${h.adv}%, réel ${h.real}%`);
console.log(`\nPar marché (cartes actives disponibles + indice de réalité):`);
for (const p of out.perMarket) console.log(`  ${p.label} (${p.market}): ${p.available} cartes, indice ${p.realityIndex}%`);
console.log(`\n→ Copie-colle ce bloc dans le chat pour que je mette à jour les 6 pages d'étude avec ces chiffres + la date du ${out.generatedAt}.`);
