-- ============================================================
-- Markets & Extras Normalization Migration
-- ============================================================
-- 1. Populates the `markets` array per card (real-world availability, May 2026)
-- 2. Normalizes `extras` from raw strings to feature_* translation keys
-- 3. Syncs available_france / available_eu from markets
-- 4. Sets per-card feature extras based on research
-- ============================================================

-- ── STEP 1: Market availability per card ────────────────────

UPDATE cards
SET markets = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE LOWER(name) LIKE '%crypto.com%'
   OR LOWER(issuer) LIKE '%crypto.com%';

UPDATE cards
SET markets = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE LOWER(name) LIKE '%coinbase%'
   OR LOWER(issuer) LIKE '%coinbase%';

UPDATE cards
SET markets = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE LOWER(name) LIKE '%nexo%'
   OR LOWER(issuer) LIKE '%nexo%';

UPDATE cards
SET markets = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE LOWER(name) LIKE '%wirex%'
   OR LOWER(issuer) LIKE '%wirex%';

UPDATE cards
SET markets = ARRAY['fr', 'de', 'es', 'it']
WHERE LOWER(name) LIKE '%vivid%'
   OR LOWER(issuer) LIKE '%vivid%';

UPDATE cards
SET markets = ARRAY['de', 'es', 'it']
WHERE LOWER(name) LIKE '%bybit%'
   OR LOWER(issuer) LIKE '%bybit%';

-- Binance Card: discontinued — mark with empty markets
UPDATE cards
SET markets = ARRAY[]::text[]
WHERE LOWER(name) LIKE '%binance%'
   OR LOWER(issuer) LIKE '%binance%';

-- Fallback: any unmatched card gets all markets
UPDATE cards
SET markets = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE markets IS NULL OR markets = ARRAY[]::text[];


-- ── STEP 2: Normalize extras to feature_ translation keys ───

UPDATE cards SET extras = array_replace(extras, 'Airport Lounge',      'feature_lounge_access');
UPDATE cards SET extras = array_replace(extras, 'Lounge Access',        'feature_lounge_access');
UPDATE cards SET extras = array_replace(extras, 'Priority Pass',        'feature_lounge_access');
UPDATE cards SET extras = array_replace(extras, 'Travel Insurance',     'feature_insurance');
UPDATE cards SET extras = array_replace(extras, 'Insurance',            'feature_insurance');
UPDATE cards SET extras = array_replace(extras, 'Assurance voyage',     'feature_insurance');
UPDATE cards SET extras = array_replace(extras, 'Concierge',            'feature_concierge');
UPDATE cards SET extras = array_replace(extras, 'Private Concierge',    'feature_concierge');
UPDATE cards SET extras = array_replace(extras, 'Conciergerie',         'feature_concierge');
UPDATE cards SET extras = array_replace(extras, 'Cashback Boost',       'feature_cashback_boost');
UPDATE cards SET extras = array_replace(extras, 'Boost cashback',       'feature_cashback_boost');
UPDATE cards SET extras = array_replace(extras, 'Cashback boost',       'feature_cashback_boost');
UPDATE cards SET extras = array_replace(extras, 'Staking Rewards',      'feature_staking_rewards');
UPDATE cards SET extras = array_replace(extras, 'Staking rewards',      'feature_staking_rewards');
UPDATE cards SET extras = array_replace(extras, 'Récompenses staking',  'feature_staking_rewards');
UPDATE cards SET extras = array_replace(extras, 'Free Account',         'feature_free_account');
UPDATE cards SET extras = array_replace(extras, 'No annual fee',        'feature_free_account');
UPDATE cards SET extras = array_replace(extras, 'Compte gratuit',       'feature_free_account');
UPDATE cards SET extras = array_replace(extras, 'Instant Card',         'feature_instant_card');
UPDATE cards SET extras = array_replace(extras, 'Virtual Card',         'feature_instant_card');
UPDATE cards SET extras = array_replace(extras, 'Carte instantanée',    'feature_instant_card');


-- ── STEP 3: Sync available_eu / available_france from markets ─

UPDATE cards
SET available_eu = (markets && ARRAY['fr', 'de', 'es', 'it']);

UPDATE cards
SET available_france = ('fr' = ANY(markets));


-- ── STEP 4: Per-card feature extras ─────────────────────────

-- Crypto.com Jade/Indigo and above: lounge access
UPDATE cards
SET extras = array_append(extras, 'feature_lounge_access')
WHERE (LOWER(name) LIKE '%crypto.com%' OR LOWER(issuer) LIKE '%crypto.com%')
  AND (LOWER(name) LIKE '%jade%' OR LOWER(name) LIKE '%indigo%'
    OR LOWER(name) LIKE '%icy%' OR LOWER(name) LIKE '%rose%'
    OR LOWER(name) LIKE '%obsidian%')
  AND NOT ('feature_lounge_access' = ANY(extras));

-- Crypto.com Icy/Rose/Obsidian: insurance
UPDATE cards
SET extras = array_append(extras, 'feature_insurance')
WHERE (LOWER(name) LIKE '%crypto.com%' OR LOWER(issuer) LIKE '%crypto.com%')
  AND (LOWER(name) LIKE '%icy%' OR LOWER(name) LIKE '%rose%' OR LOWER(name) LIKE '%obsidian%')
  AND NOT ('feature_insurance' = ANY(extras));

-- Crypto.com Obsidian: concierge
UPDATE cards
SET extras = array_append(extras, 'feature_concierge')
WHERE (LOWER(name) LIKE '%crypto.com%' OR LOWER(issuer) LIKE '%crypto.com%')
  AND LOWER(name) LIKE '%obsidian%'
  AND NOT ('feature_concierge' = ANY(extras));

-- Bybit Card: lounge access
UPDATE cards
SET extras = array_append(extras, 'feature_lounge_access')
WHERE (LOWER(name) LIKE '%bybit%' OR LOWER(issuer) LIKE '%bybit%')
  AND NOT ('feature_lounge_access' = ANY(extras));

-- Coinbase Card: free account + instant card
UPDATE cards
SET extras = ARRAY['feature_free_account', 'feature_instant_card']
WHERE (LOWER(name) LIKE '%coinbase%' OR LOWER(issuer) LIKE '%coinbase%')
  AND (extras IS NULL OR extras = ARRAY[]::text[]);

-- Nexo Card: cashback boost + free account
UPDATE cards
SET extras = array_append(extras, 'feature_cashback_boost')
WHERE (LOWER(name) LIKE '%nexo%' OR LOWER(issuer) LIKE '%nexo%')
  AND NOT ('feature_cashback_boost' = ANY(extras));

UPDATE cards
SET extras = array_append(extras, 'feature_free_account')
WHERE (LOWER(name) LIKE '%nexo%' OR LOWER(issuer) LIKE '%nexo%')
  AND NOT ('feature_free_account' = ANY(extras));

-- Wirex: cashback boost + instant card
UPDATE cards
SET extras = array_append(extras, 'feature_cashback_boost')
WHERE (LOWER(name) LIKE '%wirex%' OR LOWER(issuer) LIKE '%wirex%')
  AND NOT ('feature_cashback_boost' = ANY(extras));

UPDATE cards
SET extras = array_append(extras, 'feature_instant_card')
WHERE (LOWER(name) LIKE '%wirex%' OR LOWER(issuer) LIKE '%wirex%')
  AND NOT ('feature_instant_card' = ANY(extras));

-- Vivid Money: free account + staking rewards
UPDATE cards
SET extras = array_append(extras, 'feature_free_account')
WHERE (LOWER(name) LIKE '%vivid%' OR LOWER(issuer) LIKE '%vivid%')
  AND NOT ('feature_free_account' = ANY(extras));

UPDATE cards
SET extras = array_append(extras, 'feature_staking_rewards')
WHERE (LOWER(name) LIKE '%vivid%' OR LOWER(issuer) LIKE '%vivid%')
  AND NOT ('feature_staking_rewards' = ANY(extras));
