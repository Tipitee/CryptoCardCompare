/*
  # CryptoCardCompare – Card deduplication and market updates

  ## Summary
  Cleanup of duplicate French market cards, update of Plutus and Wirex Elite specs,
  migration of legacy favorites/compare_sessions references to canonical IDs,
  and deletion of obsolete French-original duplicate cards.

  ## Changes

  ### Deleted Cards
  - `klarpay-card` — Rebranded to Bivial AG (Dec 2024), now B2B only, no consumer card

  ### Updated/Inserted Cards
  - `plutus-card` — Updated: 3–8% cashback, £83.88/yr, ETH+PLU, Visa, markets: fr/de/es/it/en
  - `wirex-elite` — Updated: 4–8% cashback, €306/yr, 20+ cryptos, Visa, markets: fr/de/es/it/en

  ### ID Migrations (favorites + compare_sessions)
  - binance-standard → binance-card
  - bitpanda-card → bitpanda-card-standard
  - coinbase-card → coinbase-card-eu
  - wirex-standard → wirex-card-standard
  - crypto-com-midnight* → cdc-midnight-blue
  - crypto-com-ruby* → cdc-ruby-steel
  - crypto-com-jade* / crypto-com-indigo* → cdc-royal-indigo
  - any remaining crypto-com-* → cdc-royal-indigo

  ### Deleted Duplicate Cards
  - binance-standard, bitpanda-card, coinbase-card, wirex-standard, crypto-com-*

  ### Sync
  - available_france and available_eu synced from markets array for all cards
*/

-- ============================================================
-- STEP 1 — Remove klarpay-card
-- ============================================================

DELETE FROM favorites WHERE card_id = 'klarpay-card';

UPDATE compare_sessions
SET card_ids = array_remove(card_ids, 'klarpay-card')
WHERE 'klarpay-card' = ANY(card_ids);

DELETE FROM compare_sessions
WHERE card_ids = '{}'::text[] OR array_length(card_ids, 1) IS NULL;

DELETE FROM cards WHERE id = 'klarpay-card';


-- ============================================================
-- STEP 2 — Upsert plutus-card
-- ============================================================

INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'plutus-card',
  'Plutus Card',
  'Plutus',
  3.00, 8.00,
  83.88, 0.00,
  ARRAY['ETH','PLU'],
  true, true,
  'Visa', 5000,
  false,
  ARRAY['feature_cashback_boost','feature_staking_rewards','feature_free_account'],
  'https://plutus.it/referral',
  NULL,
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  issuer           = EXCLUDED.issuer,
  cashback_base    = EXCLUDED.cashback_base,
  cashback_premium = EXCLUDED.cashback_premium,
  annual_fees      = EXCLUDED.annual_fees,
  staking_required = EXCLUDED.staking_required,
  cryptos          = EXCLUDED.cryptos,
  available_france = EXCLUDED.available_france,
  available_eu     = EXCLUDED.available_eu,
  card_network     = EXCLUDED.card_network,
  daily_limit      = EXCLUDED.daily_limit,
  free_withdrawals = EXCLUDED.free_withdrawals,
  extras           = EXCLUDED.extras,
  affiliate_link   = EXCLUDED.affiliate_link,
  badge            = EXCLUDED.badge,
  markets          = EXCLUDED.markets;


-- ============================================================
-- STEP 3 — Upsert wirex-elite
-- ============================================================

INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'wirex-elite',
  'Wirex Card (Elite)',
  'Wirex',
  4.00, 8.00,
  306.00, 0.00,
  ARRAY['BTC','ETH','WXT','USDT','USDC','XRP','LTC','DAI','ADA','SOL',
        'DOT','MATIC','LINK','AVAX','ATOM','DOGE','TRX','UNI','AAVE','MKR'],
  true, true,
  'Visa', 30000,
  true,
  ARRAY['feature_cashback_boost','feature_staking_rewards','feature_instant_card'],
  'https://wirexapp.com/card',
  'Best Cashback',
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  issuer           = EXCLUDED.issuer,
  cashback_base    = EXCLUDED.cashback_base,
  cashback_premium = EXCLUDED.cashback_premium,
  annual_fees      = EXCLUDED.annual_fees,
  staking_required = EXCLUDED.staking_required,
  cryptos          = EXCLUDED.cryptos,
  available_france = EXCLUDED.available_france,
  available_eu     = EXCLUDED.available_eu,
  card_network     = EXCLUDED.card_network,
  daily_limit      = EXCLUDED.daily_limit,
  free_withdrawals = EXCLUDED.free_withdrawals,
  extras           = EXCLUDED.extras,
  affiliate_link   = EXCLUDED.affiliate_link,
  badge            = EXCLUDED.badge,
  markets          = EXCLUDED.markets;


-- ============================================================
-- STEP 4 — Migrate favorites (old FR IDs → canonical IDs)
-- ============================================================

UPDATE favorites SET card_id = 'binance-card'
WHERE card_id = 'binance-standard'
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'binance-card');
DELETE FROM favorites WHERE card_id = 'binance-standard';

UPDATE favorites SET card_id = 'bitpanda-card-standard'
WHERE card_id = 'bitpanda-card'
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'bitpanda-card-standard');
DELETE FROM favorites WHERE card_id = 'bitpanda-card';

UPDATE favorites SET card_id = 'coinbase-card-eu'
WHERE card_id = 'coinbase-card'
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'coinbase-card-eu');
DELETE FROM favorites WHERE card_id = 'coinbase-card';

UPDATE favorites SET card_id = 'wirex-card-standard'
WHERE card_id = 'wirex-standard'
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'wirex-card-standard');
DELETE FROM favorites WHERE card_id = 'wirex-standard';

UPDATE favorites SET card_id = 'cdc-midnight-blue'
WHERE card_id IN ('crypto-com-midnight-blue','crypto-com-midnight')
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'cdc-midnight-blue');
DELETE FROM favorites WHERE card_id IN ('crypto-com-midnight-blue','crypto-com-midnight');

UPDATE favorites SET card_id = 'cdc-ruby-steel'
WHERE card_id IN ('crypto-com-ruby-steel','crypto-com-ruby')
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'cdc-ruby-steel');
DELETE FROM favorites WHERE card_id IN ('crypto-com-ruby-steel','crypto-com-ruby');

UPDATE favorites SET card_id = 'cdc-royal-indigo'
WHERE card_id IN ('crypto-com-jade','crypto-com-jade-green','crypto-com-indigo','crypto-com-royal-indigo','crypto-com-jade-or-indigo')
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'cdc-royal-indigo');
DELETE FROM favorites WHERE card_id IN ('crypto-com-jade','crypto-com-jade-green','crypto-com-indigo','crypto-com-royal-indigo','crypto-com-jade-or-indigo');

UPDATE favorites SET card_id = 'cdc-royal-indigo'
WHERE card_id LIKE 'crypto-com-%'
  AND NOT EXISTS (SELECT 1 FROM favorites f2 WHERE f2.session_id = favorites.session_id AND f2.card_id = 'cdc-royal-indigo');
DELETE FROM favorites WHERE card_id LIKE 'crypto-com-%';


-- ============================================================
-- STEP 5 — Migrate compare_sessions card_ids arrays
-- ============================================================

UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'binance-standard', 'binance-card') WHERE 'binance-standard' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'bitpanda-card', 'bitpanda-card-standard') WHERE 'bitpanda-card' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'coinbase-card', 'coinbase-card-eu') WHERE 'coinbase-card' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'wirex-standard', 'wirex-card-standard') WHERE 'wirex-standard' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-midnight-blue', 'cdc-midnight-blue') WHERE 'crypto-com-midnight-blue' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-midnight', 'cdc-midnight-blue') WHERE 'crypto-com-midnight' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-ruby-steel', 'cdc-ruby-steel') WHERE 'crypto-com-ruby-steel' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-ruby', 'cdc-ruby-steel') WHERE 'crypto-com-ruby' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-jade', 'cdc-royal-indigo') WHERE 'crypto-com-jade' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-jade-green', 'cdc-royal-indigo') WHERE 'crypto-com-jade-green' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-indigo', 'cdc-royal-indigo') WHERE 'crypto-com-indigo' = ANY(card_ids);
UPDATE compare_sessions SET card_ids = array_replace(card_ids, 'crypto-com-royal-indigo', 'cdc-royal-indigo') WHERE 'crypto-com-royal-indigo' = ANY(card_ids);

UPDATE compare_sessions
SET card_ids = (SELECT array_agg(DISTINCT elem ORDER BY elem) FROM unnest(card_ids) AS elem)
WHERE array_length(card_ids, 1) != (SELECT count(DISTINCT elem) FROM unnest(card_ids) AS elem);

DELETE FROM compare_sessions
WHERE card_ids = '{}'::text[] OR array_length(card_ids, 1) IS NULL;


-- ============================================================
-- STEP 6 — Delete obsolete French duplicate cards
-- ============================================================

DELETE FROM cards WHERE id = 'binance-standard';
DELETE FROM cards WHERE id = 'bitpanda-card';
DELETE FROM cards WHERE id = 'coinbase-card';
DELETE FROM cards WHERE id = 'wirex-standard';
DELETE FROM cards WHERE id LIKE 'crypto-com-%';


-- ============================================================
-- STEP 7 — Sync available_france / available_eu from markets
-- ============================================================

UPDATE cards
SET
  available_france = ('fr' = ANY(markets)),
  available_eu     = (markets && ARRAY['de','es','it','fr'])
WHERE TRUE;
