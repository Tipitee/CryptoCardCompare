#!/usr/bin/env node
/**
 * Définit une surcharge par marché sur une carte (colonne cards.market_overrides).
 * La valeur globale reste le défaut ; on ne stocke que ce qui diffère pour ce marché.
 *
 *   set -a && source .env && set +a
 *   # DRY-RUN (montre l'avant/après) :
 *   node scripts/set-market-override.mjs --card="Nexo Card" --market=en cashbackNoStaking=0 cashbackPremium=0
 *   # Appliquer :
 *   node scripts/set-market-override.mjs --card="Nexo Card" --market=en cashbackNoStaking=0 cashbackPremium=0 --confirm
 *   # Effacer la surcharge d'un marché :
 *   node scripts/set-market-override.mjs --card="Nexo Card" --market=en --clear --confirm
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const args = process.argv.slice(2);
const CONFIRM = args.includes('--confirm');
const CLEAR = args.includes('--clear');
const getOpt = k => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : null; };
const CARD = getOpt('card');
const CARD_ID = getOpt('id');
const MARKET = getOpt('market');

const MARKETS = new Set(['fr', 'be', 'de', 'at', 'es', 'it', 'en']);
// Champs autorisés (camelCase CryptoCard, appliqués après mapping).
const ALLOWED = new Set([
  'cashbackBase', 'cashbackNoStaking', 'cashbackPremium', 'annualFees',
  'stakingRequired', 'cardNetwork', 'dailyLimit', 'freeWithdrawals',
  'virtualOnly', 'availableFrance', 'availableEU',
]);

if ((!CARD && !CARD_ID) || !MARKET) { console.error('Usage: --card="Nom" (ou --id=uuid) --market=en champ=valeur ...'); process.exit(1); }
if (!MARKETS.has(MARKET)) { console.error(`✗ marché invalide: ${MARKET} (attendu: ${[...MARKETS].join('/')})`); process.exit(1); }

// Parse les paires champ=valeur (hors options --).
const setPairs = {};
for (const a of args) {
  if (a.startsWith('--') || !a.includes('=')) continue;
  const [k, ...rest] = a.split('=');
  const raw = rest.join('=');
  if (!ALLOWED.has(k)) { console.error(`✗ champ non autorisé: ${k} (autorisés: ${[...ALLOWED].join(', ')})`); process.exit(1); }
  let v = raw;
  if (/^-?\d+(\.\d+)?$/.test(raw)) v = Number(raw);
  else if (raw === 'true' || raw === 'false') v = raw === 'true';
  setPairs[k] = v;
}
if (!CLEAR && !Object.keys(setPairs).length) { console.error('✗ aucun champ=valeur fourni (ou utilise --clear).'); process.exit(1); }

// Trouve la carte
let q = sb.from('cards').select('id, name, market_overrides');
q = CARD_ID ? q.eq('id', CARD_ID) : q.eq('name', CARD);
const { data: rows, error } = await q;
if (error) { console.error('✗', error.message); process.exit(1); }
if (!rows.length) { console.error(`✗ carte introuvable: ${CARD || CARD_ID}`); process.exit(1); }
if (rows.length > 1) { console.error(`✗ ${rows.length} cartes portent ce nom — précise --id=<uuid>.`); process.exit(1); }
const card = rows[0];

const current = card.market_overrides || {};
const next = { ...current };
if (CLEAR) delete next[MARKET];
else next[MARKET] = { ...(current[MARKET] || {}), ...setPairs };

console.log(`\nCarte : ${card.name} (${card.id})`);
console.log(`Marché: ${MARKET}`);
console.log(`Avant : ${JSON.stringify(current[MARKET] || {})}`);
console.log(`Après : ${JSON.stringify(next[MARKET] || {})}${CLEAR ? '  (surcharge effacée)' : ''}`);

if (!CONFIRM) { console.log(`\nDRY-RUN. Ajoute --confirm pour appliquer.`); process.exit(0); }
const { error: e } = await sb.from('cards').update({ market_overrides: next }).eq('id', card.id);
console.log(e ? `\n✗ ${e.message}` : `\n✓ Surcharge ${CLEAR ? 'effacée' : 'enregistrée'}. Les pages du marché ${MARKET} refléteront la valeur après re-déploiement (prérendu).`);
