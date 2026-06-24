-- ═══════════════════════════════════════════════════════════════════════════════
-- ÉTAPE 0 — Corrections urgentes DB
-- À exécuter dans Supabase > SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. COINBASE — 0% cashback en EU/UK (rewards US-only) ────────────────────
UPDATE cards SET
  cashback_base        = 0,
  cashback_no_staking  = 0,
  cashback_premium     = 0,
  market_restrictions  = '{
    "note_fr": "Le programme de récompenses crypto de Coinbase Card est disponible aux États-Unis uniquement. Les utilisateurs EU/UK bénéficient de la fonctionnalité de paiement mais sans cashback.",
    "note_en": "Coinbase Card crypto rewards are US-only. EU/UK users get payment functionality only, with 0% cashback.",
    "cashback_eu": false,
    "cashback_uk": false
  }'::jsonb
WHERE issuer = 'Coinbase';

-- ─── 2. OKX — cashback uniquement pour les VIP (100K$+ d'actifs) ─────────────
-- Le cashback 2-5% ne s'applique qu'aux VIP OKX. Utilisateur standard ≈ 0%.
UPDATE cards SET
  cashback_base        = 0,
  cashback_no_staking  = 0,
  cashback_premium     = 5,
  market_restrictions  = '{
    "note_fr": "Cashback 2-5% en USDG réservé aux utilisateurs VIP OKX (seuil VIP1 : 100 000$ d''actifs ou 5M$ de volume 30j). Utilisateurs standards : 0% de cashback.",
    "note_en": "2-5% USDG cashback applies to OKX VIP users only (VIP1: $100K assets or $5M 30-day volume). Standard users earn 0% cashback.",
    "vip_only": true,
    "cashback_standard": 0
  }'::jsonb
WHERE issuer = 'OKX';

-- ─── 3. BINANCE — non disponible au UK ───────────────────────────────────────
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE issuer = 'Binance';

-- ─── 4. BITPANDA — EU uniquement, pas UK ─────────────────────────────────────
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE issuer = 'Bitpanda';

-- ─── 5. TRADE REPUBLIC — EU uniquement, pas UK ───────────────────────────────
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE issuer = 'Trade Republic';

-- ─── 6. NEXO — cashback désactivé au UK (régulation) ─────────────────────────
-- + cashback conditionnel : min $5 000 de portefeuille pour y avoir droit en EU
UPDATE cards SET
  market_restrictions = '{
    "note_fr": "UK : cashback désactivé pour raisons réglementaires (carte fonctionnelle uniquement). EU : cashback disponible uniquement avec un portefeuille Nexo ≥ 5 000$.",
    "note_en": "UK: cashback disabled due to regulatory restrictions (card works for spending only). EU: cashback requires minimum $5,000 Nexo portfolio.",
    "cashback_uk": false,
    "min_portfolio_eur": 5000
  }'::jsonb
WHERE issuer = 'Nexo';

-- ─── 7. DEBLOCK — disponible dans toute l'EEA mais marchés actifs FR+DE+Benelux
UPDATE cards SET
  market_restrictions = '{
    "note_fr": "Lancé en France en avril 2024. Expansion active vers l''Allemagne et le Benelux (2025-2026). Disponible techniquement dans toute l''EEA via licence ACPR/MiCA.",
    "note_en": "Launched in France April 2024. Actively expanding to Germany and Benelux. Technically available across EEA via ACPR/MiCA licence."
  }'::jsonb
WHERE issuer = 'Deblock';

-- Vérification post-corrections
SELECT issuer, cashback_base, cashback_no_staking, cashback_premium,
       markets, market_restrictions
FROM cards
WHERE issuer IN ('Coinbase', 'OKX', 'Binance', 'Bitpanda', 'Trade Republic', 'Nexo', 'Deblock')
ORDER BY issuer;
