#!/usr/bin/env node
/**
 * add-pt-market.mjs
 *
 * Opens the Portuguese market: adds 'pt' to the `markets` array of every card
 * currently available in Spain ('es'). Portugal is an EU/MiCA market with the
 * same card availability as Spain and Italy, so the ES set is the correct base.
 *
 * Idempotent: a card that already has 'pt' is skipped. Safe to re-run.
 *
 * Requires network + service key → run on YOUR machine, not the sandbox:
 *   set -a && source .env && set +a
 *   node scripts/add-pt-market.mjs            # dry run (shows what would change)
 *   node scripts/add-pt-market.mjs --write    # actually writes
 *
 * If later you want a card NOT available in Portugal, remove 'pt' from its
 * markets in the admin/DB; this script never removes, only adds.
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('❌ env manquant (SUPABASE_URL + SUPABASE_SERVICE_KEY)'); process.exit(1); }
const WRITE = process.argv.includes('--write');

const sb = createClient(URL, KEY);
const { data, error } = await sb.from('cards').select('id, name, markets, status');
if (error) { console.error('❌', error.message); process.exit(1); }

const toUpdate = [];
for (const c of data) {
  const m = Array.isArray(c.markets) ? c.markets : [];
  if (m.includes('es') && !m.includes('pt')) toUpdate.push({ id: c.id, name: c.name, markets: [...m, 'pt'] });
}

console.log(`${data.length} cartes au total. ${toUpdate.length} à passer disponibles au Portugal (ont 'es', pas encore 'pt') :`);
for (const c of toUpdate) console.log(`  + ${c.id} (${c.name})`);

if (!WRITE) { console.log('\nDry run. Relance avec --write pour appliquer.'); process.exit(0); }

let ok = 0;
for (const c of toUpdate) {
  const { error: e } = await sb.from('cards').update({ markets: c.markets }).eq('id', c.id);
  if (e) console.error(`  ❌ ${c.id}: ${e.message}`);
  else ok++;
}
console.log(`\n✅ ${ok}/${toUpdate.length} cartes mises à jour avec le marché 'pt'.`);
