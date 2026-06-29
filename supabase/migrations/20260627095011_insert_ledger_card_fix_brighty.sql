/*
  # Insert Ledger CL Card + fix Brighty brand_id

  ## Ledger CL Card
  - Issuer: Baanx (white-label for Ledger)
  - 1% cashback in BTC or 2% in LDG (Ledger token)
  - No staking required, no annual fees
  - Self-custody: funds stay in Ledger hardware wallet
  - Available EEA + UK → markets: fr, de, es, it, en

  ## Brighty fix
  - Card was inserted in 20260603 but brand_id was NULL
  - Set brand_id = 'brighty' so BrandPage can find it
*/

-- ─── Insert Ledger CL Card ────────────────────────────────────────────────────
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos,
  available_france, available_eu,
  card_network,
  daily_limit, free_withdrawals,
  extras,
  affiliate_link,
  badge,
  color_primary, color_secondary,
  real_card_image, image_alt,
  markets,
  status, virtual_only, market_restrictions,
  brand_id,
  cashback_no_staking,
  trust_score, founded_year, regulation_level, trustpilot_score, aum_tier,
  trust_breakdown
)
VALUES (
  'ledger-cl-card',
  'Ledger CL Card', 'Baanx',
  1.0, 2.0,
  0, 0,
  ARRAY['BTC','ETH','USDC','USDT','SOL','LDG'],
  true, true,
  'Visa',
  10000, true,
  ARRAY['self_custody','btc_cashback','no_fees','no_staking','hardware_wallet'],
  'https://buy.ledger.com/products/ledger-card',
  'self-custody',
  '#FF5722', '#1C1C1C',
  NULL, 'Ledger CL Card',
  ARRAY['fr','de','es','it','en'],
  'active', false, '{}',
  'ledger',
  1.0,
  82, 2014, 'mica_fca', 3.8, 'medium',
  '{"age":12,"regulation":"mica_fca","trustpilot":3.8,"aum":"medium"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ─── Fix Brighty brand_id (was NULL after 20260603 insert) ───────────────────
UPDATE cards SET brand_id = 'brighty' WHERE id = 'brighty-card' AND (brand_id IS NULL OR brand_id = '');

-- ─── Fix Gnosis Pay brand_id ─────────────────────────────────────────────────
UPDATE cards SET brand_id = 'gnosis' WHERE id = 'gnosis-pay-card' AND (brand_id IS NULL OR brand_id = '');

-- ─── Fix MetaMask brand_id ───────────────────────────────────────────────────
UPDATE cards SET brand_id = 'metamask' WHERE id = 'metamask-card' AND (brand_id IS NULL OR brand_id = '');
