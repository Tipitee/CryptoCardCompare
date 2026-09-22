-- ─────────────────────────────────────────────────────────────────────────────
-- update-affiliate-links.sql
-- Met à jour cards.affiliate_link avec les liens de parrainage TopCryptoCards.
-- À exécuter dans le SQL Editor de Supabase.
-- (Le lien affiliate_link alimente le bouton "Obtenir la carte" sur les fiches.)
-- ─────────────────────────────────────────────────────────────────────────────

-- BingX
UPDATE cards SET affiliate_link = 'https://bingxdao.com/partner/TopCryptoCards/'
WHERE id = 'bingx-card';

-- OKX
UPDATE cards SET affiliate_link = 'https://my.okx.com/en-eu/join/38568052'
WHERE id = 'okx-card';

-- Ether.fi
UPDATE cards SET affiliate_link = 'https://www.ether.fi/@b1d879e2'
WHERE id = 'ether-fi-cash';

-- CEX.IO
UPDATE cards SET affiliate_link = 'https://aff.cex.io/click?o=1&a=166026&c=1'
WHERE id = 'cex-io-card';

-- Crypto.com (toutes les cartes de la marque)
UPDATE cards SET affiliate_link = 'https://cryptocom.sjv.io/c/7394525/2051372/25666'
WHERE id LIKE 'crypto-com%';

-- Vérification
SELECT id, name, affiliate_link
FROM cards
WHERE id = 'bingx-card' OR id = 'okx-card' OR id = 'ether-fi-cash'
   OR id = 'cex-io-card' OR id LIKE 'crypto-com%'
ORDER BY id;
