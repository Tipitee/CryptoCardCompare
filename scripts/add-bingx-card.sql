-- ─────────────────────────────────────────────────────────────────────────────
-- add-bingx-card.sql
-- Ajoute la BingX Card (BingX, propulsée par Wirex) dans la table cards.
-- À exécuter dans le SQL Editor de Supabase.
--
-- Sources (specs vérifiées sept. 2026) :
--   • Visa, propulsée par Wirex — bingx.com/card, coinlaw.io (lancement Visa/Wirex)
--   • Virtual (VIP1) 2 % cashback (cap 50 $/mois), Metal (VIP3) 5 % (cap 120 $/mois),
--     +1 % promo réservation ; cashback versé en USDT
--   • Frais : 1 €/mois (≈ 12 €/an), pas de frais d'émission ; ATM gratuit ≤ 200 $/mois
--   • Dispo EEE (FR/BE/DE/AT/ES/IT/PT) — RESTREINTE : UK, US, Pays-Bas, etc.
--   • Non licenciée MiCA à ce jour
-- ⚠️ À personnaliser avant prod : affiliate_link (ton lien), trustpilot_score (à vérifier),
--    et uploader une image de carte (real_card_image) via /admin/generate-hero-images ou le bucket.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_no_staking, cashback_premium,
  annual_fees, staking_required, cryptos,
  available_france, available_eu, card_network,
  daily_limit, free_withdrawals, extras, affiliate_link, badge,
  color_primary, color_secondary, image_alt,
  markets, status, virtual_only, market_restrictions,
  trust_score, founded_year, regulation_level, trustpilot_score, aum_tier,
  trust_breakdown, brand_id
)
VALUES (
  'bingx-card',
  'BingX Card',
  'BingX',
  -- cashback_base : Virtual Card (VIP1), 2 % en USDT (plafond 50 $/mois)
  2.0,
  -- cashback_no_staking : pas de staking de token requis (statut VIP = volume, pas blocage)
  2.0,
  -- cashback_premium : Metal Card (VIP3), 5 % en USDT (plafond 120 $/mois)
  5.0,
  -- annual_fees : 1 €/mois de frais de tenue ≈ 12 €/an (pas de frais d'émission)
  12,
  -- staking_required (0 = pas de token à bloquer)
  0,
  -- cryptos acceptées (cashback versé en USDT)
  ARRAY['BTC', 'ETH', 'USDT', 'USDC', 'BNB'],
  -- available_france
  true,
  -- available_eu
  true,
  -- card_network
  'Visa',
  -- daily_limit (€) — limites élevées via l'infrastructure Wirex
  10000,
  -- free_withdrawals (ATM gratuit ≤ 200 $/mois)
  true,
  -- extras
  ARRAY['apple_pay', 'google_pay', 'virtual_card'],
  -- affiliate_link (lien de parrainage TopCryptoCards)
  'https://bingxdao.com/partner/TopCryptoCards/',
  -- badge
  'Cashback jusqu''à 5 %',
  -- color_primary (bleu BingX)
  '#2354E6',
  -- color_secondary
  '#0D1B3E',
  -- image_alt
  'BingX Card — carte Visa crypto propulsée par Wirex',
  -- markets : EEE uniquement (PAS d'UK → pas de marché 'en')
  ARRAY['fr', 'be', 'de', 'at', 'es', 'it', 'pt'],
  -- status
  'active',
  -- virtual_only (false : carte metal physique disponible en VIP3)
  false,
  -- market_restrictions
  NULL::jsonb,
  -- trust_score (0–100) : grand exchange offshore, non MiCA (≈ pair de Bybit)
  40,
  -- founded_year
  2018,
  -- regulation_level
  'offshore',
  -- trustpilot_score (⚠️ à vérifier)
  4.0,
  -- aum_tier : grand exchange (10M+ utilisateurs)
  'large',
  -- trust_breakdown
  '{"regulation": 1, "track_record": 3, "transparency": 2, "security": 3, "user_base": 4}'::jsonb,
  -- brand_id (rattache la carte au hub marque /marques/bingx)
  'bingx'
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
  brand_id = EXCLUDED.brand_id;

-- Vérification
SELECT id, name, issuer, markets, cashback_base, cashback_premium, trust_score
FROM cards WHERE id = 'bingx-card';
