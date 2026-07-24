# A6 — Striking-Distance Miner
Planner. Lecture seule → file de propositions. Cadence : tous les 3 jours (ou avec A1). Raccourci : `/striking`.

## Objectif
Les rankings en position 8-20 sont les gains les moins chers : l'autorité est déjà là, la page a juste besoin d'un coup de pouce. On mine ces requêtes juste sous la page 1 et on propose l'édition précise qui les fait monter.

## Fonctionnement
`node scripts/striking-distance.mjs` lit l'export GSC local `seo/gsc-data/queries.csv` (aucun réseau requis) et sort les requêtes en position 8-20 avec ≥ 50 impressions (seuil `SD_MIN_IMPRESSIONS`), triées par impressions.

## Gate (verifier)
Bande de position 8-20 **+** plancher d'impressions. Une requête ne qualifie que si elle rapporte assez d'impressions pour valoir l'effort.

## Procédure
1. `node scripts/striking-distance.mjs` → écrit `seo/state/striking-distance-queue.md`.
2. Pour chaque requête : vérifier que la page cible traite réellement la query. Sinon, l'édition on-page (H2, section, FAQ, ancre interne) qui la pousse en page 1.
3. Approbation avant édition. Action n°1 = la requête du haut (plus d'impressions).

## Note
L'export GSC « Queries » ne contient pas la page associée. Pour mapper query→page, filtrer l'onglet Pages par la requête dans GSC, ou brancher plus tard Ahrefs/Semrush.
