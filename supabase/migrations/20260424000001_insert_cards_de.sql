-- ============================================================
-- CryptoCardCompare – Cartes crypto disponibles en Allemagne
-- Migration : 20260424_insert_cards_de.sql
-- Sources vérifiées en avril 2026
-- ============================================================
-- Statut des cartes recherchées :
--   ✅ Trade Republic Card       → disponible DE
--   ✅ Bitpanda Card             → disponible DE (BaFin)
--   ✅ Crypto.com (3 niveaux)    → disponible DE
--   ✅ Bybit Card                → disponible DE
--   ❌ Binance Card              → retirée DE (Visa/MC ont rompu le partenariat)
--   ❌ Nuri / Bitwala            → relaunch en cours, DE "coming soon" non confirmé
--   ❌ DKB Krypto Card           → non lancée en 2026
--   ❌ Scalable Capital Card     → pas de carte crypto avec cashback en 2026
-- ============================================================

-- Trade Republic Card (Visa Debit)
-- Cashback "Saveback" : 1 % réinvesti en ETF/actions, max 15 €/mois (sur 1 500 €)
-- Pas de staking requis. Retrait ATM gratuit si >= 100 €.
-- Disponible dans toute l'UE + UK.
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'trade-republic-card',
  'Trade Republic Card',
  'Trade Republic',
  1.00, 1.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','ETF'],
  true, true,
  'Visa', 5000,
  true,
  ARRAY['feature_cashback_boost','feature_free_account','feature_instant_card'],
  'https://traderepublic.com/de-de/karte',
  'Popular',
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ----------------------------------------------------------------
-- Bitpanda Card (Visa Debit) – niveau Standard (sans BEST staking)
-- Cashback : 0 % sans BEST, 0,5 % à partir de 5 000 BEST (~500 €),
--            1 % à partir de 10 000 BEST (~1 000 €),
--            2 % à partir de 50 000 BEST (~5 000 €)
-- BaFin régulée. Limite journalière : 10 000 €.
-- ----------------------------------------------------------------
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'bitpanda-card-standard',
  'Bitpanda Card (Standard)',
  'Bitpanda',
  0.50, 2.00,
  0.00, 500.00,
  ARRAY['BTC','ETH','BEST','XRP','SOL','ADA','LINK','DOT'],
  true, true,
  'Visa', 10000,
  false,
  ARRAY['feature_free_account','feature_instant_card'],
  'https://www.bitpanda.com/en/card',
  NULL,
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ----------------------------------------------------------------
-- Bitpanda Card PREMIUM (50 000 BEST stakés, ~5 000 €)
-- Cashback 2 % sur toutes les dépenses crypto
-- ----------------------------------------------------------------
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'bitpanda-card-premium',
  'Bitpanda Card (Premium 2%)',
  'Bitpanda',
  2.00, 2.00,
  0.00, 5000.00,
  ARRAY['BTC','ETH','BEST','XRP','SOL','ADA','LINK','DOT'],
  true, true,
  'Visa', 10000,
  false,
  ARRAY['feature_free_account','feature_cashback_boost','feature_staking_rewards'],
  'https://www.bitpanda.com/en/card',
  'Best Cashback DE',
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ----------------------------------------------------------------
-- Crypto.com Midnight Blue (sans staking)
-- 0 % cashback – carte d'entrée gratuite
-- ----------------------------------------------------------------
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'cdc-midnight-blue',
  'Crypto.com Midnight Blue',
  'Crypto.com',
  0.00, 0.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','CRO','USDT','LTC','XRP'],
  true, true,
  'Visa', 10000,
  false,
  ARRAY['feature_free_account','feature_instant_card'],
  'https://crypto.com/de/cards',
  NULL,
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ----------------------------------------------------------------
-- Crypto.com Ruby Steel (staking 450 € CRO, 6 mois)
-- 1 % cashback en CRO, 1 ATM gratuit/mois
-- ----------------------------------------------------------------
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'cdc-ruby-steel',
  'Crypto.com Ruby Steel',
  'Crypto.com',
  1.00, 1.00,
  0.00, 450.00,
  ARRAY['BTC','ETH','CRO','USDT','LTC','XRP'],
  true, true,
  'Visa', 10000,
  true,
  ARRAY['feature_staking_rewards','feature_cashback_boost'],
  'https://crypto.com/de/cards',
  NULL,
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ----------------------------------------------------------------
-- Crypto.com Royal Indigo / Jade Green (staking 4 500 € CRO, 6 mois)
-- 2 % cashback en CRO, Spotify offert, accès lounge airport
-- ----------------------------------------------------------------
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'cdc-royal-indigo',
  'Crypto.com Royal Indigo',
  'Crypto.com',
  2.00, 2.00,
  0.00, 4500.00,
  ARRAY['BTC','ETH','CRO','USDT','LTC','XRP'],
  true, true,
  'Visa', 10000,
  true,
  ARRAY['feature_lounge_access','feature_staking_rewards','feature_cashback_boost','feature_insurance'],
  'https://crypto.com/de/cards',
  'Premium',
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ----------------------------------------------------------------
-- Bybit Card (Visa / Mastercard)
-- 2 % cashback de base, jusqu'à 10 % (effectif ~2-4 % selon VIP)
-- Disponible en DE, FR, ES, IT, UK. Pas de staking requis.
-- ----------------------------------------------------------------
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'bybit-card',
  'Bybit Card',
  'Bybit',
  2.00, 10.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','USDT','USDC','XRP','SOL'],
  true, true,
  'Visa', 10000,
  false,
  ARRAY['feature_free_account','feature_cashback_boost','feature_instant_card'],
  'https://www.bybit.eu/de-EU/cards/',
  NULL,
  ARRAY['fr','de','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ----------------------------------------------------------------
-- Binance Card – NON DISPONIBLE EN ALLEMAGNE
-- Visa et Mastercard ont mis fin au partenariat.
-- Binance a fermé ses opérations DE. Carte insérée sans 'de' dans markets.
-- ----------------------------------------------------------------
INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos, available_france, available_eu,
  card_network, daily_limit,
  free_withdrawals, extras,
  affiliate_link, badge, markets
) VALUES (
  'binance-card',
  'Binance Card',
  'Binance',
  0.10, 8.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','BNB','USDT','ADA','DOT','XRP'],
  true, false,
  'Visa', 8700,
  false,
  ARRAY['feature_cashback_boost','feature_staking_rewards'],
  'https://www.binance.com/en/cards',
  NULL,
  ARRAY['fr','es','it','en']
)
ON CONFLICT (id) DO UPDATE SET
  cashback_base      = EXCLUDED.cashback_base,
  cashback_premium   = EXCLUDED.cashback_premium,
  annual_fees        = EXCLUDED.annual_fees,
  staking_required   = EXCLUDED.staking_required,
  cryptos            = EXCLUDED.cryptos,
  available_france   = EXCLUDED.available_france,
  available_eu       = EXCLUDED.available_eu,
  card_network       = EXCLUDED.card_network,
  daily_limit        = EXCLUDED.daily_limit,
  free_withdrawals   = EXCLUDED.free_withdrawals,
  extras             = EXCLUDED.extras,
  affiliate_link     = EXCLUDED.affiliate_link,
  badge              = EXCLUDED.badge,
  markets            = EXCLUDED.markets;

-- ============================================================
-- Cartes exclues (non disponibles / non lancées en DE en 2026)
-- ============================================================
-- ❌ Nuri / Bitwala  : relaunch en cours, pas de carte DE confirmée
-- ❌ DKB Krypto Card : aucun lancement annoncé pour 2026
-- ❌ Scalable Capital: pas de carte crypto avec cashback en 2026
-- ============================================================
