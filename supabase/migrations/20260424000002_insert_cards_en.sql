-- ============================================================
-- CryptoCardCompare – Cartes crypto marché UK / anglophone EU
-- Migration : 20260424_insert_cards_en.sql
-- Sources vérifiées en avril 2026
-- ============================================================
-- Statut des cartes recherchées :
--   ✅ Revolut Metal             → NOUVEAU INSERT (UK + EU, FCA full bank licence)
--   ✅ Crypto.com (3 niveaux)    → déjà insérés, UPDATE markets += 'en'
--   ✅ Bybit Card                → déjà inséré,  UPDATE markets += 'en'
--   ✅ Wirex Card                → déjà inséré,  UPDATE markets += 'en' (fondée Londres)
--   ✅ Nexo Card                 → déjà inséré,  UPDATE markets += 'en'
--                                  ⚠ CASHBACK = 0% pour résidents UK (règles FCA oct. 2023)
--   ✅ Coinbase Card EU          → déjà inséré,  UPDATE markets += 'en'
--                                  ⚠ Cashback 0% en UK (confirmé, même politique qu'EU)
--   ✅ Binance Card              → déjà inséré,  UPDATE markets += 'en'
--                                  ⚠ Accès limité UK post-FCA (carte "view only" nouveaux users)
--   ✅ Bitpanda Card             → déjà inséré,  UPDATE markets += 'en'
--   ✅ Trade Republic Card       → déjà inséré,  UPDATE markets += 'en'
--   ❌ Mode Card (mode.com)      → fermée ~mars 2025 (financement échoué,
--                                  CEO démissionnaire, valorisation : 0,5p)
-- ============================================================
-- Notes réglementaires UK (post-Brexit) :
--   FCA full banking licence → Revolut ✅ (mars 2026)
--   FCA EMI licence          → Wirex ✅ (n°902025) | Crypto.com ✅ (ForisGFS UK) |
--                               Coinbase ✅ (CB Payments Ltd)
--   FCA crypto registration  → Nexo ✅ | Bybit ✅ | Binance ⚠ (Section 21 compliance)
--   FSCS protection          → Revolut ✅ (jusqu'à £120 000 depuis mars 2026)
-- ============================================================

-- ============================================================
-- PARTIE 1 — UPDATE cartes communes déjà insérées
-- Ajoute 'en' au tableau markets si absent (idempotent)
-- ============================================================

-- Crypto.com Midnight Blue (disponible UK, FCA EMI ✅)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'cdc-midnight-blue'
  AND NOT (markets @> ARRAY['en']);

-- Crypto.com Ruby Steel (disponible UK, FCA EMI ✅)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'cdc-ruby-steel'
  AND NOT (markets @> ARRAY['en']);

-- Crypto.com Royal Indigo (disponible UK, FCA EMI ✅)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'cdc-royal-indigo'
  AND NOT (markets @> ARRAY['en']);

-- Bybit Card (disponible UK confirmé — France, Spain, UK, Italy, Portugal...)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'bybit-card'
  AND NOT (markets @> ARRAY['en']);

-- Binance Card (accès UK limité post-FCA : carte disponible mais "view only"
-- pour nouveaux utilisateurs depuis 2023. Insérée avec nuance.)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'binance-card'
  AND NOT (markets @> ARRAY['en']);

-- Nexo Card — ⚠ IMPORTANT : cashback supprimé pour résidents UK
-- depuis octobre 2023 (compliance FCA règles crypto promotions).
-- La carte reste fonctionnelle en UK (mode débit/crédit, ATM gratuit).
-- Limite UK : £9 000/transaction et £9 000/jour.
-- ATM gratuit UK : £180/mois (Base) → £1 800/mois (Platinum).
-- Pour afficher cashback=0 aux utilisateurs UK, filtrer côté front
-- avec : WHERE 'en' = ANY(markets) AND cashback_base > 0 → exclure nexo.
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'nexo-card'
  AND NOT (markets @> ARRAY['en']);

-- Wirex Card Standard (FCA e-money licence n°902025 — fondée Londres ✅)
-- Limite UK : 30 000 £/jour dépenses | 750 £/jour ATM | 200 £/mois ATM gratuit.
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'wirex-card-standard'
  AND NOT (markets @> ARRAY['en']);

-- Bitpanda Card Standard (accessible UK via EEA/MiCA, FCA compatible)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'bitpanda-card-standard'
  AND NOT (markets @> ARRAY['en']);

-- Bitpanda Card Premium
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'bitpanda-card-premium'
  AND NOT (markets @> ARRAY['en']);

-- Coinbase Card EU (disponible UK via CB Payments Ltd, FCA EMI ✅)
-- Cashback : 0% pour utilisateurs UK (même politique qu'EU)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'coinbase-card-eu'
  AND NOT (markets @> ARRAY['en']);

-- Trade Republic Card (disponible UK via EEA)
UPDATE cards
SET markets = array_append(markets, 'en')
WHERE id = 'trade-republic-card'
  AND NOT (markets @> ARRAY['en']);

-- ============================================================
-- PARTIE 2 — INSERT cartes nouvelles marché UK / anglophone
-- ============================================================

-- ----------------------------------------------------------------
-- Revolut Metal (Visa/Mastercard, UK + EU)
-- Revolut Bank UK Ltd — licence bancaire FCA complète obtenue le
-- 11 mars 2026 (sortie de la phase "mobilisation"). Dépôts protégés
-- FSCS jusqu'à £120 000.
-- Sélectionné par la FCA pour le Stablecoin Regulatory Sandbox (Q1 2026).
--
-- Abonnement : £14.99/mois (≈ 179,88 £/an).
-- Cashback "Revolut Stays" :
--   0,1 % dans l'Espace Économique Européen (EEE)
--   1,0 % en dehors de l'EEE (international)
--   Plafond mensuel : £14.99 (valeur de l'abonnement)
--   Cashback reçu en crypto (BTC, ETH, SOL, XRP, MATIC au choix)
--   ou en devises fiat parmi 25 disponibles.
--
-- Pas de staking requis. Réseau Visa.
-- Apple Pay ✅ | Google Pay ✅.
-- ATM gratuit : jusqu'à £800/mois inclus (plan Metal).
-- Extras Metal : Smart Delay (lounge airport), assurance voyage premium,
--   assurance achat, service conciergerie, carte physique métal.
-- Disponible UK + tous pays EEA (entité EU : Revolut Bank UAB, Lituanie).
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
  'revolut-metal',
  'Revolut Metal',
  'Revolut',
  0.10, 1.00,
  179.88, 0.00,
  ARRAY['BTC','ETH','SOL','XRP','MATIC','ADA','DOT','DOGE','USDT','USDC'],
  true, true,
  'Visa', 30000,
  true,
  ARRAY['feature_lounge_access','feature_insurance','feature_concierge','feature_cashback_boost'],
  'https://www.revolut.com/our-pricing-plans/',
  'FCA Licensed',
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
-- Cartes exclues — détail des raisons
-- ============================================================
-- ❌ Mode Card (mode.com / Mode Banking App)
--    Néobanque crypto fondée à Londres en 2020, cotée à l'AIM London
--    Stock Exchange. Permettait cashback en BTC sur achats quotidiens.
--    Liquidée ~mars 2025 : financement échoué, "difficult market conditions",
--    CEO Rita Liu démissionnaire en janvier 2025.
--    Valorisation passée de £62M (pic fév. 2021 à 77p) à 0,5p à la fermeture.
--    FCA : registre mis à jour comme inactif. Carte définitivement indisponible.
-- ============================================================
-- Notes importantes pour l'affichage front-end UK (marché 'en') :
--   1. Nexo Card (id='nexo-card') : cashback = 0 % pour résidents UK.
--      Prévoir un flag ou filtrage côté application.
--   2. Coinbase Card EU (id='coinbase-card-eu') : cashback = 0 % UK (et EU).
--   3. Binance Card (id='binance-card') : fonctionnalité réduite en UK
--      (carte "view only" pour nouveaux utilisateurs post-FCA 2023).
--   4. Revolut Metal : annual_fees=179.88 représente l'abonnement mensuel
--      annualisé (£14.99×12), pas des frais de carte fixes.
-- ============================================================
