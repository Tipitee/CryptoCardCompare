-- Surcharges par marché pour la table `cards`.
-- La valeur GLOBALE de la carte reste le défaut ; on ne stocke QUE ce qui DIFFÈRE
-- pour un marché donné. Clés = codes marché (fr/be/de/at/es/it/en).
-- Valeurs = champs camelCase de CryptoCard (cashbackBase, cashbackNoStaking,
-- cashbackPremium, annualFees, stakingRequired, cardNetwork, dailyLimit,
-- freeWithdrawals, virtualOnly, availableFrance, availableEU).
--
-- Exemple : Nexo ne donne pas de cashback au UK →
--   { "en": { "cashbackNoStaking": 0, "cashbackPremium": 0 } }
--
-- À exécuter dans Supabase → SQL Editor AVANT de déployer le code applicatif
-- (le code sélectionne cette colonne ; sans elle, le chargement des cartes échoue).

alter table cards
  add column if not exists market_overrides jsonb not null default '{}'::jsonb;
