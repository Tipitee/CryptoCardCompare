-- ─────────────────────────────────────────────────────────────────────────────
-- add-bingx-card.sql
-- Ajoute les DEUX cartes BingX (marque 'bingx', propulsées par Wirex) dans cards.
--   • bingx-virtual-card — carte virtuelle (VIP 1), 2 % cashback (plafond 50 $/mois)
--   • bingx-metal-card   — carte metal physique (VIP 3), 5 % cashback (plafond 120 $/mois)
-- Cashback versé en USDT · Visa · +1 % promo réservation · 1 €/mois (≈ 12 €/an)
-- Dispo EEE (FR/BE/DE/AT/ES/IT/PT) — restreinte UK/US/Pays-Bas · non MiCA.
-- À exécuter dans le SQL Editor de Supabase.
-- ⚠️ Uploader ensuite les visuels (real_card_image) : bingx-virtual-card.png / bingx-metal-card.png
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO cards (
  id, name, issuer, cashback_base, cashback_no_staking, cashback_premium,
  annual_fees, staking_required, cryptos, available_france, available_eu, card_network,
  daily_limit, free_withdrawals, extras, affiliate_link, badge,
  color_primary, color_secondary, image_alt, markets, status, virtual_only,
  market_restrictions, trust_score, founded_year, regulation_level, trustpilot_score,
  aum_tier, trust_breakdown, brand_id, tier_rank, tier_label
) VALUES
-- ── BingX Virtual Card (VIP 1) ──────────────────────────────────────────────
(
  'bingx-virtual-card', 'BingX Virtual Card', 'BingX',
  2.0, 2.0, 2.0,
  12, 0, ARRAY['BTC','ETH','USDT','USDC','BNB'], true, true, 'Visa',
  10000, true, ARRAY['apple_pay','google_pay','virtual_card'],
  'https://bingxdao.com/partner/TopCryptoCards/', 'Virtuelle · Cashback USDT',
  '#2354E6', '#0D1B3E', 'BingX Virtual Card — carte Visa crypto virtuelle (Wirex)',
  ARRAY['fr','be','de','at','es','it','pt'], 'active', true,
  NULL::jsonb, 40, 2018, 'offshore', 4.0, 'large',
  '{"regulation": 1, "track_record": 3, "transparency": 2, "security": 3, "user_base": 4}'::jsonb,
  'bingx', 1, 'Virtual (VIP 1)'
),
-- ── BingX Metal Card (VIP 3) ────────────────────────────────────────────────
(
  'bingx-metal-card', 'BingX Metal Card', 'BingX',
  5.0, 5.0, 5.0,
  12, 0, ARRAY['BTC','ETH','USDT','USDC','BNB'], true, true, 'Visa',
  15000, true, ARRAY['apple_pay','google_pay'],
  'https://bingxdao.com/partner/TopCryptoCards/', 'Metal · 5 % en USDT',
  '#2354E6', '#0D1B3E', 'BingX Metal Card — carte Visa metal crypto (Wirex)',
  ARRAY['fr','be','de','at','es','it','pt'], 'active', false,
  NULL::jsonb, 40, 2018, 'offshore', 4.0, 'large',
  '{"regulation": 1, "track_record": 3, "transparency": 2, "security": 3, "user_base": 4}'::jsonb,
  'bingx', 2, 'Metal (VIP 3)'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, issuer = EXCLUDED.issuer,
  cashback_base = EXCLUDED.cashback_base, cashback_no_staking = EXCLUDED.cashback_no_staking,
  cashback_premium = EXCLUDED.cashback_premium, annual_fees = EXCLUDED.annual_fees,
  staking_required = EXCLUDED.staking_required, cryptos = EXCLUDED.cryptos,
  available_france = EXCLUDED.available_france, available_eu = EXCLUDED.available_eu,
  card_network = EXCLUDED.card_network, daily_limit = EXCLUDED.daily_limit,
  free_withdrawals = EXCLUDED.free_withdrawals, extras = EXCLUDED.extras,
  affiliate_link = EXCLUDED.affiliate_link, badge = EXCLUDED.badge,
  color_primary = EXCLUDED.color_primary, color_secondary = EXCLUDED.color_secondary,
  image_alt = EXCLUDED.image_alt, markets = EXCLUDED.markets, status = EXCLUDED.status,
  virtual_only = EXCLUDED.virtual_only, market_restrictions = EXCLUDED.market_restrictions,
  trust_score = EXCLUDED.trust_score, founded_year = EXCLUDED.founded_year,
  regulation_level = EXCLUDED.regulation_level, trustpilot_score = EXCLUDED.trustpilot_score,
  aum_tier = EXCLUDED.aum_tier, trust_breakdown = EXCLUDED.trust_breakdown,
  brand_id = EXCLUDED.brand_id, tier_rank = EXCLUDED.tier_rank, tier_label = EXCLUDED.tier_label;

-- Vérification
SELECT id, name, cashback_base, virtual_only, tier_label, markets
FROM cards WHERE brand_id = 'bingx' ORDER BY tier_rank;
