# A13 — Card Data Freshness Sentinel
Sentinelle. Web en lecture seule. Cadence : hebdo. Raccourci : `/freshness`. Modèle économe.

## Objectif
Vérifier chaque semaine que les données cartes affichées **sur le site** (cashback, frais annuels, staking, réseau, disponibilité par marché, et surtout « le produit existe-t-il encore ») sont **à jour vs la réalité** chez l'émetteur. On NE modifie jamais la base : on produit une liste de corrections à faire à la main. Rotation par lot pour ne pas re-vérifier 90 cartes chaque semaine (coûteux).

## Contraintes d'environnement
- La tâche **ne peut pas joindre Supabase** (réseau bloqué). La source « ce que le site annonce » = **LA FICHE LIVE de la carte** (donnée Supabase réelle rendue), PAS `llms-full.txt` :
  - `web_fetch` la fiche EN `https://topcryptocards.eu/en/cards/<slug>` pour le cœur des champs (cashback, frais, staking, réseau). Slug = nom en kebab-case (« Bybit Card » → `bybit-card`) ; si 404, trouver le slug via `https://topcryptocards.eu/sitemap-reviews.xml` ou la liste `/en/cards`.
  - **Disponibilité par marché** : vérifier sur 1-2 fiches de marché (`/es/tarjetas/<slug>`, `/de/karten/<slug>`, `/it/carte/<slug>`…) ou la mention de disponibilité affichée.
  - `llms-full.txt` sert **uniquement de contrôle secondaire** pour la dérive GEO (voir vérifs spéciales), jamais comme vérité du site.
- La « réalité » vient de **WebSearch** sur le site officiel de l'émetteur (1-2 recherches max par carte).

## Entrées
- `seo/state/card-freshness-rotation.json` : liste `{ card, issuer, lastChecked }`. S'il n'existe pas, le créer à partir de la table de `llms-full.txt` (lastChecked = null).
- `llms-full.txt` (site), sites émetteurs (WebSearch).

## Procédure (économe en tokens)
1. **Choisir le lot** : lire la rotation, prendre les **8 cartes au `lastChecked` le plus ancien** (null d'abord). C'est le lot de la semaine → couverture complète des ~20 cartes majeures en ~3 semaines.
2. **Pour chaque carte du lot** :
   a. Relever ce que le site annonce depuis **la fiche live** de la carte (cashback, frais, staking, réseau, dispo par marché). Comparer aussi à `llms-full.txt` pour détecter la dérive GEO.
   b. 1-2 WebSearch sur l'émetteur officiel : cashback %, frais annuels, staking requis, **disponibilité par marché** (FR/BE/DE/AT/ES/IT/UK), et **le produit est-il toujours proposé**.
   c. Comparer champ par champ.
3. **Classer chaque écart** : `OK` / `CHANGÉ` (site → réalité) / `ARRÊTÉ` (produit retiré, ex. carte Binance en EEE) / `INCERTAIN` (non confirmable).
4. **Mettre à jour** `lastChecked` du lot dans la rotation (date du jour).

## Vérifs spéciales
- **Produit arrêté encore listé** = priorité haute (risque de désinformation + mauvais SEO).
- **Changement de disponibilité par pays** (une carte entre/sort d'un marché) → flag par marché, jamais global.
- **Dérive de `llms-full.txt`** : si la fiche live et `llms-full.txt` se contredisent pour une carte du lot, `llms-full.txt` est périmé (fichier statique, non régénéré) → le noter, il alimente les IA (GEO).
- Ne jamais confondre un taux marketing « jusqu'à X% » avec le taux de base réel : comparer les deux.

## Sortie (≤ 40 lignes) — écrire `seo/state/card-freshness-report.md` (ÉCRASER)
- En-tête : date, lot vérifié (8 cartes), nb écarts.
- Table : `carte | champ | site dit | réalité (source) | statut | marché`.
- Section **« À corriger cette semaine »** : uniquement `CHANGÉ`/`ARRÊTÉ`, triées par importance (cartes à trafic d'abord).
- Note dérive `llms-full.txt` si détectée.
- Finir par **UNE action** : la carte + champ le plus important à corriger en base (via l'admin), sous 4 h.
- Rappel : lecture seule. La mise à jour Supabase et la régénération de `llms-full.txt` restent des étapes humaines.

## Sortie machine — `seo/state/card-freshness-changes.json` (ÉCRASER)
En plus du rapport lisible, écrire un JSON de changements PROPOSÉS (uniquement `CHANGÉ`/`ARRÊTÉ`, confiance `high`/`medium` — jamais `INCERTAIN`). Ce fichier est appliqué à la table `cards` par un humain via `node scripts/apply-card-updates.mjs` (revue + `--confirm`). Ne jamais écrire en base toi-même.

Forme :
```json
{ "generated": "YYYY-MM-DD", "changes": [
  { "card": "Binance Card", "match": { "name": "Binance Card" },
    "set": { "status": "discontinued" },
    "reason": "Carte EEE arrêtée 20/12/2023", "source": "financemagnates", "confidence": "high" }
]}
```
`match` : `{ "name": "<nom EXACT tel qu'affiché sur la fiche>" }` (le script prévient si 0 ou plusieurs cartes correspondent).
Colonnes autorisées dans `set` (⚠️ uniquement celles-ci, sinon le script refuse) :
- `status` : `"active"` | `"discontinued"` | `"coming_soon"` (produit retiré → `discontinued`)
- `cashback_base`, `cashback_no_staking`, `cashback_premium` : nombres en % (1 = 1 %)
- `annual_fees` : nombre €/an · `staking_required` : 0 ou montant
- `card_network` : `"Visa"` | `"Mastercard"` | `"Visa/Mastercard"`
- `available_france`, `available_eu`, `virtual_only`, `free_withdrawals` : booléens
- `markets` : tableau de codes `["fr","be","de","at","es","it","en"]`
- `market_restrictions` : objet `{ "<marché>": "note" }` · `daily_limit` : nombre · `cryptos`/`extras` : tableaux
N'inclure QUE les champs qui changent réellement, avec leur `source` et `confidence`.
