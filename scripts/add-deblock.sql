-- ─── Ajout de Deblock dans la table cards ────────────────────────────────────
-- À exécuter dans Supabase > SQL Editor
-- Après upload de l'image : mettre à jour real_card_image avec l'URL Supabase Storage

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
  real_card_image,
  image_alt,
  markets,
  status,
  virtual_only,
  market_restrictions,
  category_rates,
  trust_score,
  founded_year,
  regulation_level,
  trustpilot_score,
  aum_tier,
  trust_breakdown
)
VALUES (
  'deblock-card',
  'Deblock Card',
  'Deblock',
  0,       -- cashback_base : 0% sur le plan Standard
  1,       -- cashback_no_staking : 1% sur le plan Premium (sans staking)
  1,       -- cashback_premium : 1% max
  0,       -- annual_fees : plan Standard gratuit
  0,       -- staking_required : aucun
  ARRAY['BTC', 'ETH', 'SOL', 'USDC', 'EURC', 'MATIC', 'LINK', 'UNI'],
  true,    -- available_france
  true,    -- available_eu
  'Visa',
  10000,   -- daily_limit (€)
  true,    -- free_withdrawals (100€/mois Standard, 1000€/mois Premium)
  ARRAY['apple_pay', 'google_pay', 'virtual_card', 'self_custody', 'iban_fr', 'instant_transfer'],
  'https://deblock.com/fr-FR',
  'IBAN français',
  '#1C1033',   -- color_primary  (indigo foncé — charte Deblock)
  '#7C3AED',   -- color_secondary (violet)
  NULL,        -- real_card_image — À METTRE À JOUR après upload (voir ci-dessous)
  'Carte Deblock Visa, néobanque française self-custody avec IBAN français',
  ARRAY['fr', 'de', 'es', 'it', 'en'],
  'active',
  false,   -- virtual_only : non, carte physique disponible
  NULL,    -- market_restrictions
  '{}'::jsonb, -- category_rates
  75,      -- trust_score
  2022,    -- founded_year
  'banking',   -- regulation_level : ACPR (EMI) = niveau bancaire
  4.1,     -- trustpilot_score
  'small', -- aum_tier
  '{
    "regulation": "banking",
    "aum": "small",
    "mica": true,
    "acpr": true,
    "amf": true,
    "iban_fr": true,
    "self_custody": true,
    "founded": 2022
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  cashback_base    = EXCLUDED.cashback_base,
  cashback_no_staking = EXCLUDED.cashback_no_staking,
  cashback_premium = EXCLUDED.cashback_premium,
  trust_score      = EXCLUDED.trust_score,
  status           = EXCLUDED.status;


-- ─── Après upload de l'image ──────────────────────────────────────────────────
-- Une fois l'image uploadée dans Supabase Storage (bucket "card-images"),
-- exécutez cette requête pour mettre à jour l'URL :
--
-- UPDATE cards
-- SET real_card_image = 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/deblock-card.png'
-- WHERE id = 'deblock-card';
--
-- OU si vous uploadez dans public/cards/ du projet :
-- UPDATE cards SET real_card_image = '/cards/deblock-card.png' WHERE id = 'deblock-card';
