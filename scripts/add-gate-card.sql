-- ─────────────────────────────────────────────────────────────────────────────
-- add-gate-card.sql
-- Ajoute la Gate Card (Gate.io) dans la table cards
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO cards (
  id,
  name,
  issuer,
  cashback_base,
  cashback_no_staking,
  cashback_premium,
  annual_fees,
  staking_required,
  cryptos,
  available_france,
  available_eu,
  card_network,
  daily_limit,
  free_withdrawals,
  extras,
  affiliate_link,
  badge,
  color_primary,
  color_secondary,
  image_alt,
  markets,
  status,
  virtual_only,
  market_restrictions,
  trust_score,
  founded_year,
  regulation_level,
  trustpilot_score,
  aum_tier,
  trust_breakdown
)
VALUES (
  'gate-card',
  'Gate Card',
  'Gate.io',
  -- cashback_base : ~1% en GT (variable selon campagnes)
  1.0,
  -- cashback_no_staking : même cashback sans staking requis
  1.0,
  -- cashback_premium : jusqu'à ~5% pour les comptes VIP (estimé)
  5.0,
  -- annual_fees
  0,
  -- staking_required (numeric: 0 = non requis)
  0,
  -- cryptos acceptées
  ARRAY['BTC', 'ETH', 'GT', 'USDT', 'USDC'],
  -- available_france
  true,
  -- available_eu
  true,
  -- card_network
  'Visa',
  -- daily_limit (€)
  10000,
  -- free_withdrawals (boolean)
  true,
  -- extras (text[])
  ARRAY['apple_pay', 'google_pay', 'virtual_card'],
  -- affiliate_link
  'https://www.gate.io/card',
  -- badge
  'Exchange historique',
  -- color_primary
  '#0B0E11',
  -- color_secondary
  '#1C1E23',
  -- image_alt
  'Gate Card — Carte Visa Gate.io',
  -- markets : tous les marchés EEA + UK
  ARRAY['fr', 'be', 'de', 'at', 'es', 'it', 'en'],
  -- status
  'active',
  -- virtual_only
  false,
  -- market_restrictions
  NULL::jsonb,
  -- trust_score (0–10) : -1.5 pour absence de régulation EU
  5,
  -- founded_year
  2013,
  -- regulation_level : offshore
  'offshore',
  -- trustpilot_score
  3.5,
  -- aum_tier : large exchange
  'large',
  -- trust_breakdown
  '{"regulation": 1, "track_record": 3, "transparency": 2, "security": 2, "user_base": 3}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name              = EXCLUDED.name,
  issuer            = EXCLUDED.issuer,
  cashback_base     = EXCLUDED.cashback_base,
  cashback_no_staking = EXCLUDED.cashback_no_staking,
  cashback_premium  = EXCLUDED.cashback_premium,
  annual_fees       = EXCLUDED.annual_fees,
  staking_required  = EXCLUDED.staking_required,
  cryptos           = EXCLUDED.cryptos,
  available_france  = EXCLUDED.available_france,
  available_eu      = EXCLUDED.available_eu,
  card_network      = EXCLUDED.card_network,
  daily_limit       = EXCLUDED.daily_limit,
  free_withdrawals  = EXCLUDED.free_withdrawals,
  extras            = EXCLUDED.extras,
  affiliate_link    = EXCLUDED.affiliate_link,
  badge             = EXCLUDED.badge,
  color_primary     = EXCLUDED.color_primary,
  color_secondary   = EXCLUDED.color_secondary,
  image_alt         = EXCLUDED.image_alt,
  markets           = EXCLUDED.markets,
  status            = EXCLUDED.status,
  virtual_only      = EXCLUDED.virtual_only,
  market_restrictions = EXCLUDED.market_restrictions,
  trust_score       = EXCLUDED.trust_score,
  founded_year      = EXCLUDED.founded_year,
  regulation_level  = EXCLUDED.regulation_level,
  trustpilot_score  = EXCLUDED.trustpilot_score,
  aum_tier          = EXCLUDED.aum_tier,
  trust_breakdown   = EXCLUDED.trust_breakdown;

-- Vérification
SELECT id, name, issuer, markets, trust_score FROM cards WHERE id = 'gate-card';
