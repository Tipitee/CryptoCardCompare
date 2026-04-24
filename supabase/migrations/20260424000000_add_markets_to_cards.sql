-- Ajoute un tableau de marchés à chaque carte
-- Valeurs possibles : 'fr', 'de', 'es', 'it', 'en'
ALTER TABLE cards ADD COLUMN IF NOT EXISTS markets text[] NOT NULL DEFAULT '{fr,de,es,it,en}';
-- Index pour les requêtes filtrées par marché
CREATE INDEX IF NOT EXISTS idx_cards_markets ON cards USING GIN (markets);
-- Mise à jour des cartes existantes :
-- Cartes universelles EU → tous les marchés (déjà fait par le DEFAULT)
-- Cartes spécifiques France uniquement
UPDATE cards SET markets = '{fr}'
WHERE available_france = true AND available_eu = false;
-- Cartes non disponibles en France mais EU
UPDATE cards SET markets = '{de,es,it,en}'
WHERE available_france = false AND available_eu = true;
