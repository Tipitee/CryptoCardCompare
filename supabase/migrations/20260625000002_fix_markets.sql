/*
  # Fix card market assignments

  ## Bug A — 10 cards missing 'fr' (have de/en/es/it but not fr)
  These EU-wide cards were inserted with ARRAY['de','es','it','en'] missing France.

  ## Bug B — 27 cards missing 'en' (have fr/de/es/it but not en)
  International exchange cards incorrectly excluded from the English-language market.
  Note: bybit, deblock, okx, bitpanda, trade-republic, bit2me, brighty intentionally
  exclude EN (no UK licence) and are NOT touched here.
*/

-- ─── BUG A: Add 'fr' to 10 cards that have de/en/es/it ────────────────────────
UPDATE cards
SET markets = array_append(markets, 'fr')
WHERE id IN (
  'amp-black-card',
  'chainscard',
  'coinw-card',
  'cryptocash-card',
  'laso-card',
  'mpcvault-card',
  'orbitx-card',
  'redotpay-card',
  'stables-card',
  'tevau-card'
)
AND NOT (markets @> ARRAY['fr']);

-- ─── BUG B: Add 'en' to international cards missing it ────────────────────────
-- These are globally available exchange/DeFi cards with no reason to exclude EN.
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id IN (
  -- Major exchange/DeFi cards
  'kucard',           -- KuCoin — global exchange
  'holyheld-card',    -- Holyheld — EU+UK
  'cex-io-card',      -- CEX.IO — global exchange
  'blackcatcard',     -- Blackcatcard — EU-wide
  'coinzoom-card',    -- CoinZoom — global
  'solid-card',       -- Solid — global
  'ugly-visa-card',   -- Ugly Visa — global
  'exodus-spend-card',-- Exodus — global wallet
  'spritz-card',      -- Spritz Finance — global
  'trastra-crypto-card', -- TRASTRA — EU-wide
  'utorg-crypto-card',-- UTORG — global
  'pexx-card',        -- PEXX — global
  'tonhub-card',      -- Tonhub — global TON ecosystem
  'xportal-card',     -- xPortal (MultiversX) — global
  'bitnob-virtual-card', -- Bitnob — Africa+global
  'bitrefill-card',   -- Bitrefill — global
  'avalanche-card',   -- Avalanche — global ecosystem
  'fuse-card',        -- Fuse — global
  'offramp-spend-card',  -- Offramp — global
  'trustee-plus-card',-- Trustee Plus — global
  'tuyo-card',        -- Tuyo — global
  'avici-card',       -- Avici — global
  'exa-card',         -- Exa — global
  'quicko-digital-card', -- Quicko — EU-wide
  'senturopay-card',  -- SentüroPay — EU-wide
  'coin98-fusion-card',  -- Coin98 — global
  'tria-card'         -- Tria (already added by 20260606, idempotent)
)
AND NOT (markets @> ARRAY['en']);
