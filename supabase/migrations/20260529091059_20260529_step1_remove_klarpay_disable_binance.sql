/*
  # Etape 1 — Suppression et desactivation de cartes invalides

  ## Cartes concernees

  ### Klarpay Crypto (klarpay-card)
  - Produit B2B uniquement (Klarpay AG rebrandé Bivial AG)
  - N'a pas sa place dans un comparateur grand public
  - Action : suppression complete

  ### Binance Card (binance-standard)
  - Programme EEA entierement ferme le 20 decembre 2023
  - Aucun marche europeen valide
  - Action : desactivation (markets vide, badge "Programme arrete")
  - Conservation de la ligne pour historique
*/

DELETE FROM cards WHERE id = 'klarpay-card';

UPDATE cards SET
  available_france = false,
  available_eu     = false,
  markets          = '{}',
  badge            = 'Programme arrêté'
WHERE id = 'binance-standard';
