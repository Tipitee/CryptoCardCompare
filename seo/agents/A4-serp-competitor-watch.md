# A4 — SERP & Competitor Watch
Loop lecture seule. Cadence : jeudi 8h. Modèle conseillé : Sonnet. Ne modifie rien.

## Objectif
Voir bouger la SERP autour de nos mots-clés prioritaires la semaine où ça arrive, pas quand le trafic est déjà parti.

## Source
`seo/your-site/keywords.csv` (tier `priority` uniquement) + l'outil `WebSearch`. Concurrents suivis (de `brand-voice.md`) : cryptocardindex.com, koinly.io, journalducoin.com, cryptonaute.fr, moneyradar.org.

## Gate (seuil de mouvement — ne remonter que ce qui dépasse)
Ne signaler qu'un changement MATÉRIEL : on perd une position dans le top 10, un nouveau concurrent entre dans le top 5, ou la mise en page SERP change (AI overview apparu, featured snippet changé de main, nouvelles boîtes PAA). Ignorer le bruit ±1 position.

## Procédure (économe — 1 recherche par mot-clé, pas plus)
1. Prendre les mots-clés `tier=priority` de keywords.csv (max ~12). Les tester dans leur langue/marché.
2. Pour chacun : UNE seule `WebSearch` avec la requête exacte. Lire le top 10. Noter notre présence (topcryptocards.eu) et sa position, qui domine, et la présence d'un AI overview / featured snippet.
3. Comparer à `seo/state/serp-watch.md` (dernier run). Calculer les mouvements.
4. Ajouter une ligne d'historique par mot-clé dans `seo/state/serp-watch.md` (ne pas réécrire le fichier, ajouter).
5. Sortie ≤ 40 lignes : table `mot-clé | marché | notre position | qui gagne | changement` limitée aux mouvements matériels, puis UNE action recommandée < 4 h (ex. « rafraîchir /fr/meilleure-carte-crypto : Journal du Coin a repris la position 3 »).

## Rappels
- Segmenter par marché : une position FR ne dit rien du marché DE.
- WebSearch approxime la SERP (géo/perso non contrôlés) — noter « à confirmer » si un mouvement ressemble à de la variance, ne pas le deviner.
- Ne jamais recommander de publier en masse. Une action, ciblée.
