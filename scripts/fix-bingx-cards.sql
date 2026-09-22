-- fix-bingx-cards.sql
-- Corrige 2 problèmes constatés sur la page marque BingX :
--   1) Une 3e carte fantôme « BingX Card » (5 %, sans tier) subsiste en base :
--      reliquat d'un ancien insert mono-carte. On ne garde que les 2 cartes
--      officielles (bingx-virtual-card, bingx-metal-card).
--   2) Les visuels uploadés ne s'affichent pas car real_card_image est NULL :
--      on relie les images du bucket Storage « card-images ».
--
-- À exécuter dans Supabase → SQL Editor.

-- 1) INSPECTION — voir l'état actuel des lignes BingX avant modification
SELECT id, name, cashback_base, tier_rank, tier_label, real_card_image
FROM cards WHERE brand_id = 'bingx' ORDER BY tier_rank;

-- 2) SUPPRESSION de la/les carte(s) fantôme(s) : tout ce qui n'est pas
--    l'une des 2 cartes officielles.
DELETE FROM cards
WHERE brand_id = 'bingx'
  AND id NOT IN ('bingx-virtual-card', 'bingx-metal-card');

-- 3) LIER LES IMAGES (adapter l'extension .png/.jpg au nom réel des fichiers
--    uploadés dans le bucket « card-images »).
UPDATE cards
SET real_card_image = 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/bingx-virtual-card.png'
WHERE id = 'bingx-virtual-card';

UPDATE cards
SET real_card_image = 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/bingx-metal-card.png'
WHERE id = 'bingx-metal-card';

-- 4) VÉRIFICATION — il ne doit rester que 2 lignes, avec real_card_image renseigné
SELECT id, name, cashback_base, tier_label, real_card_image
FROM cards WHERE brand_id = 'bingx' ORDER BY tier_rank;
