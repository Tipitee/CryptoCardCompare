# SEO + AI Visibility Dashboard — les KPIs, une page
Mis à jour chaque semaine par les automations. C'est LE fichier à ouvrir.

---

## Cette semaine — 2026-08-03

> ⚠️ **Exports GSC manquants** — `gsc-data/queries.csv` et `pages.csv` sont encore des placeholders (dernière modif 2026-07-20, >7 j). Analyse gagnants/perdants, prisonniers page 2 et cannibalisation impossible cette semaine.
> **2 min pour débloquer :** GSC → Performance → Search results → 90 jours → Export → onglets **Queries** et **Pages** → écraser `seo/gsc-data/*.csv`.

| Métrique | Cette semaine | Semaine passée | Tendance | Source |
|---|---|---|---|---|
| Clics organiques (28j) — total | | | | gsc-data/ |
| Clics FR / DE / EN / ES / IT | | | | gsc-data/ (filtre path) |
| Position moyenne, mots-clés priority | | | | gsc-data/ + keywords.csv |
| Prisonniers page 2 (pos 11–20, >100 imp) | | | | gsc-data/ |
| Score visibilité IA (25 requêtes) | | | | ai-visibility/citations.md |
| Share of voice vs cryptocardindex.com | | | | competitors/share-of-voice.csv |
| Perception (sur 4 dimensions) | | | | ai-visibility/perception.md |
| Domaines référents | | | | Ahrefs Webmaster Tools |

## Lire le dashboard
- Clics ↑ + visibilité IA plate = SEO classique fonctionne, AI SEO en retard → construire les pages comparaison/alternatives.
- Clics plats + visibilité ↑ = l'AI SEO compose de façon invisible au rank tracker → tenir le cap.
- Un marché ↑ et un autre ↓ = aller voir le weekly report segmenté avant de conclure.

## Focus de la semaine
**Vérifier que le site répond (CRITIQUE tech).** — tech-health 2026-07-28 = 🔴 3 CRITIQUE, tous en « fetch failed » (root /, prerender /fr, vrais 404). Un site injoignable prime sur tout le reste : `curl -I` les 3 URLs pour trancher entre panne réelle et sonde cassée, puis re-lancer A1. _(Semaine du 2026-08-03.)_

> Ensuite seulement : **rafraîchir l'export GSC** (placeholders depuis le 2026-07-20 → analyse decay/striking à l'arrêt), puis priorité contenu **`/…/crypto-card-apple-pay`** (thématique Apple/Google Pay, gap FR total, tableau Supabase par marché).
