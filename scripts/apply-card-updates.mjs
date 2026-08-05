#!/usr/bin/env node
/**
 * Applique à la table `cards` les changements proposés par l'agent A13
 * (seo/state/card-freshness-changes.json), APRÈS revue humaine.
 * Met à jour toutes les pages structurées d'un coup (elles lisent `cards` en direct).
 *
 *   set -a && source .env && set +a
 *   node scripts/apply-card-updates.mjs             # DRY-RUN : montre l'ancien → nouveau
 *   node scripts/apply-card-updates.mjs --confirm   # applique
 *
 * Format attendu de card-freshness-changes.json :
 * {
 *   "generated": "2026-08-05",
 *   "changes": [
 *     { "card": "Binance Card", "match": { "name": "Binance Card" },
 *       "set": { "status": "discontinued" },
 *       "reason": "Carte EEE arrêtée 20/12/2023", "source": "financemagnates", "confidence": "high" }
 *   ]
 * }
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');
const FILE = 'seo/state/card-freshness-changes.json';

// Colonnes autorisées à la mise à jour (sécurité : on refuse tout le reste).
const ALLOWED = new Set([
  'cashback_base', 'cashback_no_staking', 'cashback_premium', 'annual_fees',
  'staking_required', 'card_network', 'available_france', 'available_eu',
  'markets', 'status', 'virtual_only', 'market_restrictions', 'daily_limit',
  'free_withdrawals', 'cryptos', 'extras',
]);

if (!existsSync(FILE)) { console.error(`✗ ${FILE} introuvable (l'agent A13 le génère).`); process.exit(1); }
const { changes } = JSON.parse(readFileSync(FILE, 'utf8'));
if (!Array.isArray(changes) || !changes.length) { console.log('Aucun changement proposé.'); process.exit(0); }

console.log(`\n${CONFIRM ? '=== APPLICATION ===' : '=== DRY-RUN (rien écrit) ==='}  ${changes.length} changement(s)\n`);
let applied = 0, skipped = 0;

for (const ch of changes) {
  const label = ch.card || JSON.stringify(ch.match);
  // Valide les colonnes
  const badCols = Object.keys(ch.set || {}).filter(k => !ALLOWED.has(k));
  if (!ch.set || !Object.keys(ch.set).length) { console.log(`⏭️  ${label}: pas de champ 'set' → ignoré`); skipped++; continue; }
  if (badCols.length) { console.log(`⏭️  ${label}: colonnes non autorisées ${badCols.join(', ')} → ignoré`); skipped++; continue; }

  // Trouve la ligne
  let q = sb.from('cards').select('*');
  if (ch.match?.id) q = q.eq('id', ch.match.id);
  else if (ch.match?.name) q = q.eq('name', ch.match.name);
  else { console.log(`⏭️  ${label}: 'match' doit contenir id ou name → ignoré`); skipped++; continue; }
  const { data: rows, error } = await q;
  if (error) { console.log(`✗ ${label}: ${error.message}`); skipped++; continue; }
  if (!rows.length) { console.log(`⏭️  ${label}: aucune carte trouvée (match: ${JSON.stringify(ch.match)}) → ignoré`); skipped++; continue; }
  if (rows.length > 1) { console.log(`⏭️  ${label}: ${rows.length} cartes trouvées → trop ambigu, précise l'id → ignoré`); skipped++; continue; }
  const row = rows[0];

  console.log(`• ${label}  (${ch.confidence || '?'} · ${ch.source || 'sans source'})`);
  for (const [col, val] of Object.entries(ch.set)) {
    console.log(`    ${col}: ${JSON.stringify(row[col])}  →  ${JSON.stringify(val)}`);
  }
  if (ch.reason) console.log(`    raison: ${ch.reason}`);

  if (CONFIRM) {
    const { error: e } = await sb.from('cards').update(ch.set).eq('id', row.id);
    if (e) { console.log(`    ✗ ${e.message}`); skipped++; }
    else { console.log(`    ✓ appliqué`); applied++; }
  }
  console.log('');
}

if (CONFIRM) {
  console.log(`\n✓ ${applied} appliqué(s) · ⏭️ ${skipped} ignoré(s).`);
  console.log(`Les pages structurées (fiches, tarifs, comparatifs, thématiques…) reflètent déjà le changement.`);
  console.log(`Restent à corriger à la main : la prose figée (articles blog + src/data/*.ts). Lance :`);
  console.log(`  node scripts/find-card-mentions.mjs "<nom de carte>"`);
  console.log(`Puis régénère llms-full.txt et pense à re-déployer.`);
} else {
  console.log(`DRY-RUN terminé. Vérifie les lignes ci-dessus, puis : node scripts/apply-card-updates.mjs --confirm`);
}
