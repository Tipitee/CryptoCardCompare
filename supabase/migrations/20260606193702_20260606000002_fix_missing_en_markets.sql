-- Add 'en' market to high-value cards that were missing it.
-- These cards are available in EU but were incorrectly excluded from the 'en' locale,
-- causing English-language users to see an incomplete simulator ranking.

UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id IN (
  'bleap-crypto-card',   -- 20% premium
  'bybit-card',          -- 10% premium, 2% base (available_eu=true, available_france=false)
  'bit2me-card',         -- 7% premium, 2% base
  'tria-card',           -- 6% premium, 1.5% base
  'solid-card',          -- 5% premium, 2% base
  'coinzoom-card',       -- 5% premium
  'blackcatcard',        -- 5% premium
  'ugly-visa-card'       -- 4% premium
)
AND NOT (markets @> ARRAY['en']);