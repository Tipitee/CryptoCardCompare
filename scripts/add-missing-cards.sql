-- ─── Ajout des 5 cartes manquantes ───────────────────────────────────────────
-- À exécuter dans Supabase > SQL Editor

INSERT INTO cards (
  id, name, issuer, cashback_base, cashback_no_staking, cashback_premium,
  annual_fees, staking_required, cryptos, available_france, available_eu,
  card_network, daily_limit, free_withdrawals, extras, affiliate_link, badge,
  color_primary, color_secondary, real_card_image, image_alt, markets, status,
  virtual_only, market_restrictions, category_rates, trust_score, founded_year,
  regulation_level, trustpilot_score, aum_tier, trust_breakdown
)
VALUES

-- ─── REVOLUT ─────────────────────────────────────────────────────────────────
(
  'revolut-card', 'Revolut Crypto Card', 'Revolut',
  0, 0, 0,          -- pas de cashback crypto (RevPoints uniquement Premium+)
  0, 0,             -- gratuit en Standard, 0 staking
  ARRAY['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'LTC', 'ADA', 'DOT', 'MATIC', 'LINK', 'USDC', 'USDT'],
  true, true, 'Visa', 3000, false,
  ARRAY['apple_pay', 'google_pay', 'virtual_card', 'multi_currency', 'instant_transfer'],
  'https://revolut.com/referral', 'Carte physique 2026',
  '#191C1F', '#0075EB', NULL,
  'Carte Revolut Visa crypto, néobanque internationale avec paiement en cryptomonnaies',
  ARRAY['fr', 'de', 'es', 'it', 'en'], 'active', false,
  NULL, '{}'::jsonb,
  80, 2015, 'banking', 4.3, 'very_large',
  '{"regulation":"banking","aum":"very_large","fca":true,"emi":true,"founded":2015}'::jsonb
),

-- ─── BLEAP ───────────────────────────────────────────────────────────────────
(
  'bleap-card', 'Bleap Card', 'Bleap',
  2, 2, 20,          -- 2% base USDC, jusqu'à 20% sur catégories spécifiques
  0, 0,
  ARRAY['BTC', 'ETH', 'USDC', 'USDT', 'SOL', 'MATIC'],
  true, true, 'Mastercard', 5000, false,
  ARRAY['apple_pay', 'google_pay', 'virtual_card', 'self_custody', 'no_fx_fees'],
  'https://bleap.finance', 'Self-custody USDC',
  '#0F1117', '#6366F1', NULL,
  'Carte Bleap Mastercard self-custody, cashback en USDC jusqu''à 20%',
  ARRAY['fr', 'de', 'es', 'it', 'en'], 'active', false,
  NULL, '{}'::jsonb,
  55, 2023, 'standard', NULL, 'small',
  '{"regulation":"standard","aum":"small","self_custody":true,"founded":2023}'::jsonb
),

-- ─── PLUTUS ──────────────────────────────────────────────────────────────────
(
  'plutus-card', 'Plutus Card', 'Plutus',
  3, 3, 9,           -- 3% sans staking PLU (Starter), jusqu'à 9% avec staking max
  84, 1500,          -- 6.99€/mois Starter = ~84€/an ; staking Everyday = ~1500€ PLU
  ARRAY['BTC', 'ETH', 'PLU', 'USDC'],
  true, true, 'Visa', 5000, false,
  ARRAY['apple_pay', 'google_pay', 'perks_cashback'],
  'https://plutus.it', '3-9% cashback PLU',
  '#0D0D0D', '#E040FB', NULL,
  'Carte Plutus Visa, cashback jusqu''à 9% en PLU avec perks Netflix Spotify Amazon',
  ARRAY['fr', 'de', 'es', 'it', 'en'], 'active', false,
  NULL, '{}'::jsonb,
  60, 2015, 'standard', 3.8, 'small',
  '{"regulation":"standard","aum":"small","founded":2015}'::jsonb
),

-- ─── GNOSIS PAY ──────────────────────────────────────────────────────────────
(
  'gnosis-pay-card', 'Gnosis Pay Card', 'Gnosis',
  1, 1, 5,           -- 1% avec 0.1 GNO, jusqu'à 5% avec 100+ GNO + OG NFT
  0, 0,              -- pas de frais annuels (30€ one-time émission), 0.1 GNO ≈ 0
  ARRAY['GNO', 'USDC', 'USDT', 'EURE', 'ETH'],
  true, true, 'Visa', 5000, false,
  ARRAY['apple_pay', 'google_pay', 'self_custody', 'on_chain'],
  'https://gnosispay.com', 'On-chain Visa',
  '#00212A', '#04D4A0', NULL,
  'Carte Gnosis Pay Visa directement connectée à la blockchain Gnosis, self-custody',
  ARRAY['fr', 'de', 'es', 'it', 'en'], 'active', false,
  NULL, '{}'::jsonb,
  65, 2017, 'standard', NULL, 'medium',
  '{"regulation":"standard","aum":"medium","on_chain":true,"self_custody":true,"founded":2017}'::jsonb
),

-- ─── TRADE REPUBLIC ──────────────────────────────────────────────────────────
(
  'trade-republic-card', 'Trade Republic Card', 'Trade Republic',
  1, 1, 2,           -- 1% Saveback en ETF/actions, 2% en payant avec crypto
  0, 0,
  ARRAY['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT'],
  true, true, 'Visa', 1500, false,
  ARRAY['apple_pay', 'google_pay', 'iban_de', 'saveback'],
  'https://traderepublic.com', '1% Saveback ETF',
  '#1A1A2E', '#00C897', NULL,
  'Carte Trade Republic Visa, 1% Saveback automatique en ETF ou crypto sur chaque achat',
  ARRAY['fr', 'de', 'es', 'it', 'en'], 'active', false,
  NULL, '{}'::jsonb,
  75, 2015, 'banking', 4.0, 'large',
  '{"regulation":"banking","aum":"large","bafin":true,"founded":2015}'::jsonb
)

ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  trust_score  = EXCLUDED.trust_score,
  status       = EXCLUDED.status;
