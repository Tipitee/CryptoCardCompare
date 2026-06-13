-- ══════════════════════════════════════════════════════════════
-- fix-blog-posts.sql
-- Colle ce SQL dans Supabase > SQL Editor et exécute-le.
-- ══════════════════════════════════════════════════════════════

-- 1. Réparer tous les articles avec tags NULL → tableau vide
UPDATE blog_posts
SET tags = '{}'::text[]
WHERE tags IS NULL;

-- 2. Réparer tous les articles avec excerpt NULL → chaîne vide
UPDATE blog_posts
SET excerpt = ''
WHERE excerpt IS NULL;

-- 3. Publier les 39 articles insérés manuellement
UPDATE blog_posts
SET published = true
WHERE lang = 'fr'
  AND slug IN (
    'meilleure-carte-crypto-cashback-bitcoin',
    'carte-crypto-sans-frais-annuels',
    'carte-crypto-sans-staking',
    'carte-crypto-debutant',
    'carte-crypto-france-disponible',
    'carte-crypto-apple-pay-google-pay',
    'comment-fonctionne-carte-crypto',
    'cashback-crypto-fonctionnement',
    'carte-crypto-etranger-frais',
    'carte-crypto-impots-france',
    'carte-crypto-sans-kyc',
    'carte-crypto-vs-carte-bancaire',
    'comment-choisir-carte-crypto',
    'carte-crypto-cashback-usdt',
    'carte-crypto-cashback-ethereum',
    'carte-crypto-cashback-solana',
    'carte-crypto-virtuelle',
    'carte-crypto-haut-cashback',
    'carte-crypto-cashback-sans-staking',
    'carte-crypto-cashback-bnb',
    'carte-crypto-defi',
    'carte-crypto-retrait-atm',
    'carte-crypto-staking-explique',
    'carte-crypto-limites-retrait-comparatif',
    'securite-carte-crypto',
    'carte-crypto-avantages-inconvenients',
    'carte-crypto-legale-france',
    'maximiser-cashback-carte-crypto',
    'carte-crypto-top-10-2026',
    'carte-crypto-cashback-2026-classement',
    'investir-crypto-via-carte',
    'carte-crypto-visa-vs-mastercard',
    'carte-crypto-paiement-sans-contact',
    'carte-crypto-cashback-impots',
    'carte-crypto-faillite-emetteur',
    'okx-card-avis',
    'bitpanda-card-avis',
    'wirex-card-avis',
    'carte-crypto-europe'
  );

-- Vérification : combien d'articles sont published ?
SELECT published, COUNT(*) FROM blog_posts GROUP BY published;
