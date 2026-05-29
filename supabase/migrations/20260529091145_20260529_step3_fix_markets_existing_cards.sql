/*
  # Etape 3 — Correction des marches pour 6 cartes existantes

  ## Corrections appliquees

  ### Bybit Card (bybit-card)
  - Retire : fr (restriction AMF — pas d'enregistrement DASP)
  - Retire : en (UK jamais supporte par Bybit)
  - Reste : de, es, it (EEA via bybit.eu)

  ### Coinbase Card (coinbase-card)
  - Ajoute : fr (France incluse via licence e-money europeenne)
  - Reste : fr, de, es, it, en (EEA complet + UK)

  ### Bitpanda Card (bitpanda-card)
  - Retire : en (UK exclu — eurozone uniquement, pas tous les pays EEA)
  - Reste : fr, de, es, it

  ### Trade Republic Card (trade-republic-card)
  - Retire : en (UK exclu — Trade Republic n'a pas de licence FCA)
  - Reste : fr, de, es, it

  ### Bit2Me Card (bit2me-card)
  - Etend : ajout de fr, de, it (dispo dans tout l'EEA 30 pays)
  - UK non supporte
  - Cashback en B2M token ; DNI requis pour les Espagnols
  - Reste : fr, de, es, it

  ### Nexo Card (nexo-card)
  - Badge mis a jour : 'Virtuelle uniquement' (physique suspendue jan.2025)
  - virtual_only deja mis a true a l'etape 2
  - Markets inchanges (EEA + UK corrects)
  - Ajout de 'virtual_only' dans extras
*/

-- Bybit Card : retirer fr et en
UPDATE cards SET
  available_france = false,
  markets          = ARRAY['de', 'es', 'it']
WHERE id = 'bybit-card';

-- Coinbase Card : ajouter fr
UPDATE cards SET
  available_france = true,
  markets          = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE id = 'coinbase-card';

-- Bitpanda Card : retirer en (UK)
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE id = 'bitpanda-card';

-- Trade Republic Card : retirer en (UK)
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE id = 'trade-republic-card';

-- Bit2Me Card : etendre a toute l'EEA francophone/germanophone/italienne
UPDATE cards SET
  available_france = true,
  available_eu     = true,
  markets          = ARRAY['fr', 'de', 'es', 'it']
WHERE id = 'bit2me-card';

-- Nexo Card : mettre a jour le badge (virtual_only deja applique a l'etape 2)
UPDATE cards SET
  badge  = 'Virtuelle uniquement',
  extras = array_append(
    CASE WHEN 'virtual_only' = ANY(extras) THEN extras
    ELSE extras END,
    'virtual_only'
  )
WHERE id = 'nexo-card'
  AND NOT ('virtual_only' = ANY(extras));

UPDATE cards SET
  badge = 'Virtuelle uniquement'
WHERE id = 'nexo-card';
