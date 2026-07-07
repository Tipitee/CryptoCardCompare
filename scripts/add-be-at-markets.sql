-- ============================================================
-- TopCryptoCards — Ajouter Belgique (be) et Autriche (at)
-- dans le champ markets des cartes éligibles
-- ============================================================
-- Logique :
--   BE = même règles MiCA/EEE que FR → ajouter 'be' aux cartes ayant 'fr'
--   AT = même règles MiCA/EEE que DE → ajouter 'at' aux cartes ayant 'de'
--
-- Sources : Crypto.com Help Center, Spendnode.io, Bleap blog (BE),
--           FMA.gv.at, Bitpanda support
-- ============================================================

-- État avant
SELECT id, name, markets
FROM cards
WHERE status != 'discontinued'
ORDER BY name;

-- 1. Ajouter 'be' (Belgique) aux cartes disponibles en France (même EEE/MiCA)
UPDATE cards
SET markets = array_append(markets, 'be')
WHERE 'fr' = ANY(markets)
  AND NOT ('be' = ANY(markets))
  AND status != 'discontinued';

-- 2. Ajouter 'at' (Autriche) aux cartes disponibles en Allemagne (même EEE/MiCA)
UPDATE cards
SET markets = array_append(markets, 'at')
WHERE 'de' = ANY(markets)
  AND NOT ('at' = ANY(markets))
  AND status != 'discontinued';

-- 3. Vérification : cartes qui n'auraient pas de 'fr' ni 'de' mais sont EEE-wide
--    → ajouter 'be' et 'at' aux cartes EU-wide qui pourraient en manquer
UPDATE cards
SET markets = array_append(array_append(markets, 'be'), 'at')
WHERE 'eu' = ANY(markets)
  AND NOT ('be' = ANY(markets))
  AND NOT ('at' = ANY(markets))
  AND status != 'discontinued';

-- État après
SELECT id, name, markets
FROM cards
WHERE status != 'discontinued'
ORDER BY name;
