/*
  # Etape 2 — Migrations de schema : 3 nouvelles colonnes

  ## Nouvelles colonnes ajoutees a la table `cards`

  ### 1. `status` (TEXT)
  - Valeurs possibles : 'active' | 'discontinued' | 'coming_soon'
  - Default : 'active'
  - Permet de marquer les programmes arretes sans supprimer la ligne

  ### 2. `virtual_only` (BOOLEAN)
  - Indique si la carte est disponible en version virtuelle uniquement
  - Default : false
  - Cas concrets : Nexo (physique suspendue jan.2025), OKX Card (jamais eu de physique)

  ### 3. `market_restrictions` (JSONB)
  - Restrictions specifiques par marche (ex: AMF pour Bybit en France)
  - Default : '{}'
  - Format : {"fr": "Raison de restriction", "en": "Reason"}

  ## Valeurs initiales appliquees
  - binance-standard → status = 'discontinued'
  - bybit-card → market_restrictions AMF France
  - nexo-card → virtual_only = true
*/

ALTER TABLE cards ADD COLUMN IF NOT EXISTS
  status TEXT DEFAULT 'active'
  CHECK (status IN ('active', 'discontinued', 'coming_soon'));

ALTER TABLE cards ADD COLUMN IF NOT EXISTS
  virtual_only BOOLEAN DEFAULT false;

ALTER TABLE cards ADD COLUMN IF NOT EXISTS
  market_restrictions JSONB DEFAULT '{}';

-- Appliquer les valeurs initiales
UPDATE cards SET status = 'discontinued' WHERE id = 'binance-standard';

UPDATE cards SET
  market_restrictions = '{"fr": "Non disponible — restrictions AMF"}'
WHERE id = 'bybit-card';

UPDATE cards SET virtual_only = true WHERE id = 'nexo-card';
