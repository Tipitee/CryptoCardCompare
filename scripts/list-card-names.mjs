#!/usr/bin/env node
/**
 * Liste les noms EXACTS de la table `cards` (colonne `name`), filtrés par un mot-clé.
 * Sert à retrouver le `name` exact attendu par apply-card-updates.mjs (match par name).
 *
 *   set -a && source .env && set +a
 *   node scripts/list-card-names.mjs wirex
 *   node scripts/list-card-names.mjs            # tout lister
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const filter = (process.argv[2] || '').toLowerCase();
let q = sb.from('cards').select('name, status, markets').order('name');
if (filter) q = q.ilike('name', `%${filter}%`);
const { data, error } = await q;
if (error) { console.error('✗', error.message); process.exit(1); }
if (!data.length) { console.log(`Aucune carte pour « ${filter} ».`); process.exit(0); }
for (const r of data) console.log(`${JSON.stringify(r.name)}  · status=${r.status ?? '?'} · markets=${JSON.stringify(r.markets)}`);
