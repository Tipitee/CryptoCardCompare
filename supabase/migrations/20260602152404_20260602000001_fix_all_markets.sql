/*
  # Fix marchés pour toutes les cartes

  ## Corrections appliquees
  - Bybit : fr retiré (AMF), en retiré (UK non supporté)
  - Coinbase : fr ajouté
  - Bitpanda : en retiré (UK exclu)
  - Trade Republic : en retiré (pas de licence FCA)
  - Bit2Me : étendue à fr, de, it (EEA)
  - Young Platform : it uniquement
  - Krak Card : tous marchés confirmés
  - OKX Card : EEA sans UK confirmé
  - Binance : discontinued et hors marchés confirmé
*/

-- Bybit : fr retiré (AMF), en retiré (UK non supporté)
UPDATE cards SET
  available_france = false,
  markets = ARRAY['de', 'es', 'it'],
  market_restrictions = '{"fr": "Non disponible — restrictions AMF"}'
WHERE id = 'bybit-card';

-- Coinbase : fr ajouté
UPDATE cards SET
  available_france = true,
  markets = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE id = 'coinbase-card';

-- Bitpanda : en retiré (UK exclu)
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE id = 'bitpanda-card';

-- Trade Republic : en retiré (pas de licence FCA)
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE id = 'trade-republic-card';

-- Bit2Me : étendue à fr, de, it (EEA)
UPDATE cards SET
  available_france = true,
  available_eu = true,
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE id = 'bit2me-card';

-- Young Platform : it uniquement
UPDATE cards SET
  available_france = false,
  available_eu = false,
  markets = ARRAY['it']
WHERE id = 'young-platform-card';

-- Krak Card : tous marchés
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it', 'en']
WHERE id = 'kraken-krak-card';

-- OKX Card : EEA sans UK
UPDATE cards SET
  markets = ARRAY['fr', 'de', 'es', 'it']
WHERE id = 'okx-card';

-- S'assurer que Binance est bien discontinued et hors marchés
UPDATE cards SET
  status = 'discontinued',
  markets = '{}'
WHERE id = 'binance-standard';
