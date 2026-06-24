-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 1 — Structure marques & tiers
-- Ajoute brand_id, tier_rank, tier_label à la table cards
-- À exécuter APRÈS step0-corrections.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Ajout des colonnes ───────────────────────────────────────────────────────
ALTER TABLE cards
  ADD COLUMN IF NOT EXISTS brand_id    text,
  ADD COLUMN IF NOT EXISTS tier_rank   integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS tier_label  text;

-- ─── CRYPTO.COM (5 tiers connus en DB) ───────────────────────────────────────
UPDATE cards SET brand_id = 'crypto-com', tier_rank = 1, tier_label = 'Midnight Blue'
  WHERE id = 'crypto-com-midnight-blue';
UPDATE cards SET brand_id = 'crypto-com', tier_rank = 2, tier_label = 'Ruby Steel'
  WHERE id = 'crypto-com-ruby-steel';
UPDATE cards SET brand_id = 'crypto-com', tier_rank = 3, tier_label = 'Jade Green / Royal Indigo'
  WHERE id IN ('crypto-com-jade-green', 'crypto-com-royal-indigo', 'crypto-com-jade');
UPDATE cards SET brand_id = 'crypto-com', tier_rank = 4, tier_label = 'Frosted Rose Gold / Icy White'
  WHERE id IN ('crypto-com-rose-gold', 'crypto-com-icy-white', 'crypto-com-frosted');
UPDATE cards SET brand_id = 'crypto-com', tier_rank = 5, tier_label = 'Obsidian'
  WHERE id IN ('crypto-com-obsidian', 'crypto-com-black');
-- Fallback : toute carte Crypto.com non encore assignée
UPDATE cards SET brand_id = 'crypto-com', tier_rank = 1
  WHERE issuer = 'Crypto.com' AND brand_id IS NULL;

-- ─── WIREX (tiers : Standard / Premium / Elite) ───────────────────────────────
UPDATE cards SET brand_id = 'wirex', tier_rank = 1, tier_label = 'Standard'
  WHERE id IN ('wirex-card', 'wirex-standard');
UPDATE cards SET brand_id = 'wirex', tier_rank = 2, tier_label = 'Premium'
  WHERE id = 'wirex-premium';
UPDATE cards SET brand_id = 'wirex', tier_rank = 3, tier_label = 'Elite'
  WHERE id = 'wirex-elite';
-- Fallback Wirex
UPDATE cards SET brand_id = 'wirex', tier_rank = 1
  WHERE issuer = 'Wirex' AND brand_id IS NULL;

-- ─── NEXO (tiers par loyalty : Base / Silver / Gold / Platinum) ──────────────
-- Pour l'instant 1 seule carte dans la DB — on la place en "Gold" (représentatif)
UPDATE cards SET brand_id = 'nexo', tier_rank = 3, tier_label = 'Gold (représentatif)'
  WHERE issuer = 'Nexo' AND brand_id IS NULL;

-- ─── BINANCE ─────────────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'binance', tier_rank = 1, tier_label = 'Binance Card'
  WHERE issuer = 'Binance' AND brand_id IS NULL;

-- ─── BYBIT ───────────────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'bybit', tier_rank = 1, tier_label = 'Bybit Card'
  WHERE issuer = 'Bybit' AND brand_id IS NULL;

-- ─── OKX ─────────────────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'okx', tier_rank = 1, tier_label = 'OKX Card'
  WHERE issuer = 'OKX' AND brand_id IS NULL;

-- ─── COINBASE ────────────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'coinbase', tier_rank = 1, tier_label = 'Coinbase Card'
  WHERE issuer = 'Coinbase' AND brand_id IS NULL;

-- ─── BITPANDA ────────────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'bitpanda', tier_rank = 1, tier_label = 'Bitpanda Card'
  WHERE issuer = 'Bitpanda' AND brand_id IS NULL;

-- ─── LEDGER (Baanx) ──────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'ledger', tier_rank = 1, tier_label = 'CL Card (Baanx)'
  WHERE issuer ILIKE '%ledger%' AND brand_id IS NULL;

-- ─── KRAK / KRAKEN ───────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'kraken', tier_rank = 1, tier_label = 'Krak Card'
  WHERE issuer ILIKE '%krak%' OR issuer ILIKE '%kraken%' AND brand_id IS NULL;

-- ─── DEBLOCK (3 plans : Standard / Premium / Native) ─────────────────────────
-- Pour l'instant 1 seule entrée — on la marque comme "représentatif"
UPDATE cards SET brand_id = 'deblock', tier_rank = 1, tier_label = 'Standard / Premium'
  WHERE issuer = 'Deblock' AND brand_id IS NULL;

-- ─── REVOLUT (Standard / Premium / Metal / Ultra) ────────────────────────────
UPDATE cards SET brand_id = 'revolut', tier_rank = 1, tier_label = 'Standard / Premium'
  WHERE issuer = 'Revolut' AND brand_id IS NULL;

-- ─── BLEAP ───────────────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'bleap', tier_rank = 1, tier_label = 'Bleap Card'
  WHERE issuer = 'Bleap' AND brand_id IS NULL;

-- ─── PLUTUS (Starter / Everyday / Premium / Hero / Veteran / Legend) ─────────
UPDATE cards SET brand_id = 'plutus', tier_rank = 1, tier_label = 'Starter → Legend'
  WHERE issuer = 'Plutus' AND brand_id IS NULL;

-- ─── GNOSIS PAY ──────────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'gnosis', tier_rank = 1, tier_label = 'Gnosis Pay Card'
  WHERE issuer = 'Gnosis' AND brand_id IS NULL;

-- ─── TRADE REPUBLIC ──────────────────────────────────────────────────────────
UPDATE cards SET brand_id = 'trade-republic', tier_rank = 1, tier_label = 'Trade Republic Card'
  WHERE issuer = 'Trade Republic' AND brand_id IS NULL;

-- ─── Vérification finale ─────────────────────────────────────────────────────
SELECT id, name, issuer, brand_id, tier_rank, tier_label, markets
FROM cards
ORDER BY brand_id, tier_rank;
