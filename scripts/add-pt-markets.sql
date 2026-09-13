-- ============================================================
-- TopCryptoCards — Ajouter le Portugal (pt) au champ markets
-- ============================================================
-- Contexte : la régénération de llms-full.txt (sept. 2026) montre que 'pt'
-- est DÉJÀ présent sur ~79/80 cartes. Ce script est un TOP-UP idempotent :
-- il n'ajoute 'pt' qu'aux cartes pan-UE qui en manqueraient encore, sans
-- toucher aux cartes FR/UK-only (ex. Deblock) qui ne servent pas le Portugal.
--
-- Règle : le Portugal suit le même régime MiCA/EEE que les autres marchés
-- d'Europe continentale. On tague donc 'pt' dès qu'une carte est disponible
-- dans AU MOINS UN marché continental hors FR-seul (be/de/at/es/it) — ce qui
-- exclut volontairement les cartes uniquement FR+UK.
-- Idempotent : NOT ('pt' = ANY(markets)) → relançable sans effet de bord.
-- ============================================================

-- 0. Diagnostic AVANT : quelles cartes actives n'ont pas encore 'pt' ?
SELECT id, name, markets
FROM cards
WHERE status != 'discontinued'
  AND NOT ('pt' = ANY(markets))
ORDER BY name;

-- 1. Top-up : ajouter 'pt' aux cartes pan-UE (présentes sur be/de/at/es/it)
--    NB : on n'utilise PAS 'fr' seul comme déclencheur, pour ne pas taguer
--    par erreur des cartes FR+UK-only (Deblock) qui ne couvrent pas le PT.
UPDATE cards
SET markets = array_append(markets, 'pt')
WHERE status != 'discontinued'
  AND NOT ('pt' = ANY(markets))
  AND (
        'be' = ANY(markets) OR 'de' = ANY(markets) OR 'at' = ANY(markets)
     OR 'es' = ANY(markets) OR 'it' = ANY(markets)
  );

-- 2. Filet EU-wide : cartes marquées 'eu' (sentinelle) sans 'pt'
UPDATE cards
SET markets = array_append(markets, 'pt')
WHERE status != 'discontinued'
  AND 'eu' = ANY(markets)
  AND NOT ('pt' = ANY(markets));

-- 3. (OPTIONNEL) Deblock est actuellement FR + UK. Si tu confirmes qu'elle est
--    disponible au Portugal, décommente pour l'ajouter explicitement :
-- UPDATE cards SET markets = array_append(markets, 'pt')
-- WHERE name = 'Deblock Card' AND NOT ('pt' = ANY(markets));

-- 4. Vérification APRÈS : couverture 'pt' sur les cartes actives
SELECT
  count(*) FILTER (WHERE 'pt' = ANY(markets))       AS avec_pt,
  count(*) FILTER (WHERE NOT ('pt' = ANY(markets))) AS sans_pt,
  count(*)                                          AS total_actives
FROM cards
WHERE status != 'discontinued';

-- Détail des cartes actives encore SANS 'pt' (doit se limiter aux FR/UK-only) :
SELECT id, name, markets
FROM cards
WHERE status != 'discontinued'
  AND NOT ('pt' = ANY(markets))
ORDER BY name;
