-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: add topic_key column to blog_posts
-- topic_key groups language variants of the same article so one hero image
-- generation propagates automatically to all language variants.
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Add column + index
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS topic_key TEXT;
CREATE INDEX IF NOT EXISTS idx_blog_posts_topic_key ON blog_posts (topic_key);

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 2: Travel guide articles (5 languages, same image)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE blog_posts SET topic_key = 'guide-travel-crypto-card'
WHERE slug IN (
  'carte-crypto-voyage-guide-complet',
  'krypto-karte-reise-kompletter-guide',
  'tarjeta-crypto-viaje-guia-completa',
  'carta-crypto-viaggio-guida-completa',
  'crypto-card-travel-complete-guide'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 3: Rewards guide articles (5 languages, same image)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE blog_posts SET topic_key = 'guide-rewards-crypto-card'
WHERE slug IN (
  'carte-crypto-recompenses-avantages-guide',
  'krypto-karte-praemien-vorteile-guide',
  'tarjeta-crypto-recompensas-ventajas-guia',
  'carta-crypto-premi-vantaggi-guida',
  'crypto-card-rewards-benefits-guide'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 4: Comparison articles (regex-based)
-- FR: comparatif-X  /  DE: vergleich-X  /  ES: comparativa-X
-- IT: confronto-X   /  EN: comparison-X
-- Shared topic_key = cmp-{pair}  (e.g. cmp-binance-card-vs-wirex-elite-2026)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE blog_posts
SET topic_key = 'cmp-' ||
  REGEXP_REPLACE(slug, '^(comparatif|vergleich|comparativa|confronto|comparison)-', '')
WHERE slug ~ '^(comparatif|vergleich|comparativa|confronto|comparison)-'
  AND topic_key IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 5: Review / avis articles (regex-based)
-- FR: avis-X  /  DE: testbericht-X  /  ES: opinion-X
-- IT: recensione-X  /  EN: review-X
-- Shared topic_key = rev-{card}  (e.g. rev-gnosis-pay)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE blog_posts
SET topic_key = 'rev-' ||
  REGEXP_REPLACE(slug, '^(avis|testbericht|opinion|recensione|review)-', '')
WHERE slug ~ '^(avis|testbericht|opinion|recensione|review)-'
  AND topic_key IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verify: check how many articles got a topic_key
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT topic_key, count(*) AS nb, array_agg(lang ORDER BY lang) AS langs
-- FROM blog_posts
-- WHERE topic_key IS NOT NULL
-- GROUP BY topic_key
-- ORDER BY topic_key;
