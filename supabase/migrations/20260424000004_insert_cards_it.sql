-- ============================================================
-- CryptoCardCompare – Cartes crypto disponibles en Italie
-- Migration : 20260424_insert_cards_it.sql
-- Sources vérifiées en avril 2026
-- ============================================================
-- Statut des cartes recherchées :
--   ✅ Young Platform Card       → IT uniquement (OAM + MiCA, Torino)
--   ✅ Nexo Card                 → déjà inséré (ES), UPDATE markets += 'it'
--   ✅ Crypto.com (3 niveaux)    → déjà insérés (DE/ES), UPDATE markets += 'it'
--   ✅ Binance Card              → déjà inséré (DE/ES), UPDATE markets += 'it'
--   ✅ Bybit Card                → déjà inséré (DE/ES), UPDATE markets += 'it'
--   ✅ Wirex Card                → déjà inséré (ES), UPDATE markets += 'it'
--   ✅ Bitpanda Card             → déjà inséré (DE), UPDATE markets += 'it'
--   ✅ Coinbase Card EU          → déjà inséré (ES), UPDATE markets += 'it'
--   ❌ The Rock Trading Card     → exchange en faillite (fév. 2023),
--                                  fondateurs condamnés à 5 ans (oct. 2025),
--                                  66 M€ de préjudice, 18 000 clients lésés.
--   ❌ Conio Card                → PAS de carte de dépenses. Conio est un
--                                  wallet multi-sig Bitcoin uniquement (OAM ✅),
--                                  sans carte Visa/Mastercard de paiement.
-- ============================================================
-- Vérification réglementaire (IT) :
--   OAM obligatoire depuis 2022 → Young Platform ✅ | Nexo ✅ (EEA) |
--   Wirex ✅ (EEA) | Crypto.com ✅ | Bybit ✅ | Bitpanda ✅ (BaFin + MiCA)
--   Coinbase ✅ | Binance ✅ (hors DE)
-- ============================================================

-- ============================================================
-- PARTIE 1 — UPDATE cartes communes déjà insérées
-- Ajoute 'it' au tableau markets si absent (idempotent)
-- ============================================================

-- Crypto.com Midnight Blue
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'cdc-midnight-blue'
  AND NOT (markets @> ARRAY['it']);

-- Crypto.com Ruby Steel
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'cdc-ruby-steel'
  AND NOT (markets @> ARRAY['it']);

-- Crypto.com Royal Indigo
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'cdc-royal-indigo'
  AND NOT (markets @> ARRAY['it']);

-- Bybit Card (disponible IT confirmé)
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'bybit-card'
  AND NOT (markets @> ARRAY['it']);

-- Binance Card (disponible IT, non disponible DE)
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'binance-card'
  AND NOT (markets @> ARRAY['it']);

-- Nexo Card (EEA-wide, Italie incluse)
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'nexo-card'
  AND NOT (markets @> ARRAY['it']);

-- Wirex Card Standard (EEA-wide, Italie incluse)
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'wirex-card-standard'
  AND NOT (markets @> ARRAY['it']);

-- Bitpanda Card Standard (EEA-wide via BaFin/MiCA, Italie incluse)
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'bitpanda-card-standard'
  AND NOT (markets @> ARRAY['it']);

-- Bitpanda Card Premium
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'bitpanda-card-premium'
  AND NOT (markets @> ARRAY['it']);

-- Coinbase Card EU
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'coinbase-card-eu'
  AND NOT (markets @> ARRAY['it']);

-- Trade Republic Card (EEA-wide, Italie incluse)
UPDATE cards
SET markets = array_append(markets, 'it')
WHERE id = 'trade-republic-card'
  AND NOT (markets @> ARRAY['it']);

-- ============================================================
-- PARTIE 2 — INSERT carte exclusive Italie
-- ============================================================

-- ----------------------------------------------------------------
-- Young Platform Card (Visa Debit) — Italie uniquement
-- Startup italienne fondée à Turin. Première carte MiCA-compliant
-- de l'UE selon The Block (nov. 2025). Inscrite OAM.
--
-- Programme de cashback "Club YNG" (en tokens YNG) :
--   Essential : 0,1 % | Bronze : 0,3 % | Silver : 0,9 %
--   Gold : 1,8 %       | Platinum : 3,6 %
--
-- Staking YNG requis pour accéder aux Club supérieurs.
-- Cashback_base = tier Bronze (0,3 %) — accès standard.
-- Cashback_premium = tier Platinum (3,6 %).
--
-- Réseau : Visa. Support client : italien natif.
-- Apple Pay ✅ | Google Pay ✅ (standard Visa IT).
-- Limite dépôt : 1 500 €/jour | 30 000 €/mois.
-- Disponible uniquement pour résidents italiens (KYC IT obligatoire).
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
  'young-platform-card',
  'Young Platform Card',
  'Young Platform',
  0.30, 3.60,
  0.00, 0.00,
  ARRAY['BTC','ETH','YNG','SOL','ADA','XRP','DOT','MATIC','LINK','USDT'],
  false, false,
  'Visa', 1500,
  false,
  ARRAY['feature_free_account','feature_cashback_boost','feature_staking_rewards','feature_instant_card'],
  'https://youngplatform.com/token-yng/clubs/',
  'MiCA #1 IT',
  ARRAY['it']
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
-- ❌ The Rock Trading Card
--    Exchange historique IT fondé en 2007 (Malte/Italie).
--    Suspendu le 17 fév. 2023 (problèmes de liquidité).
--    Fondateurs Andrea Medri et Davide Barbieri arrêtés déc. 2024
--    pour banqueroute frauduleuse + fausses communications sociales.
--    Condamnés à 5 ans de prison le 22 oct. 2025 (Tribunal de Milan).
--    Préjudice : 66 M€, 18 000 clients lésés. Carte définitivement inactive.
--
-- ❌ Conio
--    Wallet Bitcoin multi-signature (2-de-3) inscrit OAM, actif en 2026.
--    N'émet PAS de carte Visa/Mastercard de dépenses.
--    Conio = outil de custody BTC uniquement, sans fonctionnalité de paiement.
--    À ne pas confondre avec une "crypto card".
-- ============================================================
