-- ============================================================
-- CryptoCardCompare – Cartes crypto disponibles en Espagne
-- Migration : 20260424_insert_cards_es.sql
-- Sources vérifiées en avril 2026
-- ============================================================
-- Statut des cartes recherchées :
--   ✅ Bit2Me Card              → disponible ES (CNMV / MiCA)
--   ✅ Wirex Card               → disponible ES (EEA, Standard gratuit)
--   ✅ Nexo Card                → disponible ES (EEA, Mastercard dual mode)
--   ✅ Coinbase Card            → disponible ES (EU) – cashback US uniquement
--   ✅ Crypto.com (3 niveaux)   → déjà insérés, UPDATE markets += 'es'
--   ✅ Bybit Card               → déjà inséré,  UPDATE markets += 'es'
--   ✅ Binance Card             → déjà inséré,  UPDATE markets += 'es'
--   ❌ 2gether Card             → fermée depuis juillet 2022 (insolvabilité)
-- ============================================================

-- ============================================================
-- PARTIE 1 — UPDATE cartes communes déjà insérées
-- Ajoute 'es' au tableau markets si absent (idempotent)
-- ============================================================

-- Crypto.com Midnight Blue
UPDATE cards
SET markets = array_append(markets, 'es')
WHERE id = 'cdc-midnight-blue'
  AND NOT (markets @> ARRAY['es']);

-- Crypto.com Ruby Steel
UPDATE cards
SET markets = array_append(markets, 'es')
WHERE id = 'cdc-ruby-steel'
  AND NOT (markets @> ARRAY['es']);

-- Crypto.com Royal Indigo
UPDATE cards
SET markets = array_append(markets, 'es')
WHERE id = 'cdc-royal-indigo'
  AND NOT (markets @> ARRAY['es']);

-- Bybit Card
UPDATE cards
SET markets = array_append(markets, 'es')
WHERE id = 'bybit-card'
  AND NOT (markets @> ARRAY['es']);

-- Binance Card (disponible ES, non disponible DE)
UPDATE cards
SET markets = array_append(markets, 'es')
WHERE id = 'binance-card'
  AND NOT (markets @> ARRAY['es']);

-- Trade Republic Card (disponible ES via EEA)
UPDATE cards
SET markets = array_append(markets, 'es')
WHERE id = 'trade-republic-card'
  AND NOT (markets @> ARRAY['es']);

-- ============================================================
-- PARTIE 2 — INSERT cartes nouvelles / exclusives Espagne
-- ============================================================

-- ----------------------------------------------------------------
-- Bit2Me Card (Mastercard Debit)
-- Premier exchange espagnol régulé CNMV + MiCA.
-- Cashback : 2 % de base en B2M, jusqu'à 7 % avec Space Center.
-- Réseau Mastercard. Cryptos : B2M, BTC, ETH, ADA, XRP, SOL,
--   DOT, USDT, USDC, TON, EURT (13+ altcoins).
-- Pas de frais annuels. Limite ~10 000 €/jour estimée.
-- Marché : Espagne principalement (MiCA en cours d'extension EU)
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
  'bit2me-card',
  'Bit2Me Card',
  'Bit2Me',
  2.00, 7.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','B2M','ADA','XRP','SOL','DOT','USDT','USDC','TON','EURT'],
  false, false,
  'Mastercard', 10000,
  false,
  ARRAY['feature_free_account','feature_cashback_boost','feature_staking_rewards','feature_instant_card'],
  'https://bit2me.com/suite/card',
  'Spain #1',
  ARRAY['es']
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
-- Wirex Card Standard (Mastercard / Visa, EEA)
-- Plan Standard gratuit : 0,5 % Cryptoback en WXT.
-- Plans payants (Enhanced, Premium) : jusqu'à 8 % avec staking WXT.
-- Limite dépenses : 30 000 €/jour. ATM gratuit : 200 €/mois.
-- Multidevise nativement : EUR, GBP, USD, CAD + 150 cryptos.
-- Disponible dans tout l'EEA (hors Chypre, Liechtenstein).
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
  'wirex-card-standard',
  'Wirex Card (Standard)',
  'Wirex',
  0.50, 8.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','WXT','USDT','USDC','XRP','LTC','DAI','ADA','SOL'],
  true, true,
  'Mastercard', 30000,
  true,
  ARRAY['feature_free_account','feature_instant_card','feature_cashback_boost'],
  'https://wirexapp.com/card',
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
-- Nexo Card (Mastercard, dual mode Credit / Debit)
-- Mode Credit : dépense sans vendre ses cryptos (collatéral).
-- Mode Debit  : dépense directe depuis le wallet.
-- Cashback en NEXO : Base 0,5% → Silver 0,7% → Gold 1% → Platinum 2%.
-- Pas de frais annuels. ATM gratuit jusqu'à 2 000 €/mois.
-- Disponible dans tout l'EEA + UK. Limite : 10 000 €/jour.
-- Staking NEXO requis pour tiers supérieurs (pas de montant fixe).
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
  'nexo-card',
  'Nexo Card',
  'Nexo',
  0.50, 2.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','NEXO','USDT','USDC','XRP','ADA','BNB','SOL','DOT'],
  true, true,
  'Mastercard', 10000,
  true,
  ARRAY['feature_free_account','feature_cashback_boost','feature_staking_rewards','feature_instant_card'],
  'https://nexo.com/crypto-card',
  'Credit Mode',
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
-- Coinbase Card (Visa Debit, EU)
-- Disponible en Espagne et 29 pays européens.
-- ⚠ IMPORTANT : le cashback (1-4 % en BTC/ETH) est réservé aux
-- utilisateurs US. Les utilisateurs EU/ES ont la carte sans cashback.
-- Insérée avec cashback_base=0 pour refléter la réalité EU.
-- Pas de frais annuels. Limite estimée ~10 000 €/jour.
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
  'coinbase-card-eu',
  'Coinbase Card (EU)',
  'Coinbase',
  0.00, 0.00,
  0.00, 0.00,
  ARRAY['BTC','ETH','USDC','SOL','ADA','XRP','MATIC','DOT','LINK','LTC'],
  true, true,
  'Visa', 10000,
  false,
  ARRAY['feature_free_account','feature_instant_card'],
  'https://www.coinbase.com/card',
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

-- ============================================================
-- Cartes exclues
-- ============================================================
-- ❌ 2gether Card : plateforme fermée en juillet 2022 (insolvabilité),
--    ~100 000 utilisateurs espagnols affectés, pas de relance confirmée.
-- ============================================================
