/*
# Add cashback_no_staking column

## Summary
Adds a `cashback_no_staking` column to the `cards` table that stores the real cashback rate
obtainable WITHOUT any staking requirement. This is distinct from `cashback_base`, which
represents the rate achievable AT the staking tier specified in `staking_required`.

## Why this matters
Cards like Plutus and all Crypto.com tier cards (Ruby, Jade, Royal Indigo, Frosted Rose Gold)
give 0% cashback if you do not lock the required tokens. Their `cashback_base` field (1–3%) is
only achievable with the full staking commitment. Without staking you get a prepaid card with
no rewards.

Conversely, cards with `staking_required = 0` (Bit2Me, Ether.fi, Solid Card, KAST, etc.)
already give their published rate without any staking — so their `cashback_no_staking` equals
`cashback_base`.

## Changes
1. New column `cashback_no_staking NUMERIC(5,2) NOT NULL DEFAULT 0` on `cards`.
2. For all cards with `staking_required = 0`: set `cashback_no_staking = cashback_base`
   (the published rate is already the base rate, no staking required).
3. For Bybit Card and Gnosis Pay Card (staking_required = 1, nominal): same treatment as 0-staking.
4. For the 5 cards that gate cashback behind real staking:
   - plutus-card (500 PLU staking required) → 0%
   - crypto-com-ruby-steel (400 CRO) → 0%
   - crypto-com-jade-green (4000 CRO) → 0%
   - crypto-com-royal-indigo (4000 CRO) → 0%
   - crypto-com-frosted-rose (40000 CRO) → 0%

## Security
No RLS changes — existing policies on `cards` already cover this column.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'cashback_no_staking'
  ) THEN
    ALTER TABLE cards ADD COLUMN cashback_no_staking NUMERIC(5,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

-- All cards with staking_required = 0 → no-staking rate equals their published base rate
UPDATE cards
SET cashback_no_staking = cashback_base
WHERE staking_required = 0;

-- Bybit and Gnosis Pay have nominal staking (1 unit) → treat as no real staking requirement
UPDATE cards
SET cashback_no_staking = cashback_base
WHERE id IN ('bybit-card', 'gnosis-pay-card');

-- The 5 cards that require real token locking for any cashback → 0% without staking
UPDATE cards
SET cashback_no_staking = 0
WHERE id IN (
  'plutus-card',
  'crypto-com-ruby-steel',
  'crypto-com-jade-green',
  'crypto-com-royal-indigo',
  'crypto-com-frosted-rose'
);
