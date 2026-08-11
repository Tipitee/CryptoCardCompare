# SEO + AI Visibility Dashboard — les KPIs, une page
Mis à jour chaque semaine par les automations. C'est LE fichier à ouvrir.

---

## Cette semaine — 2026-08-10

> ✅ Export GSC frais (2026-08-04). Snapshot archivé dans `gsc-data/history/` → comparaison W/W possible dès le 2026-08-17 (cette semaine : pas de baseline, donc pas de gagnants/perdants). Rapport complet : `reporting/weekly-2026-08-10.md`.

| Métrique | Cette semaine | Semaine passée | Tendance | Source |
|---|---|---|---|---|
| Clics organiques (28j) — total | 42 | — (placeholder) | 🆕 baseline | gsc-data/pages |
| Impressions (28j) — total | 13 542 | — | 🆕 baseline | gsc-data/pages |
| Clics EN / ES / FR / IT / DE / AT / BE | 19 / 10 / 5 / 4 / 1 / 2 / 0 | — | 🆕 | gsc-data/ (path) |
| Position moyenne (money pages présentes) | pos 20–70 | — | 🆕 | gsc-data/ + keywords.csv |
| Prisonniers page 2 (pos 11–20, >100 imp) | 1 (`/en/cards/okx-card`) | — | 🆕 | gsc-data/ |
| Duplication trailing-slash (cannibalisation) | ~centaines d'URLs | — | 🔴 critique | gsc-data/pages |
| Score visibilité IA (25 requêtes) | | | | ai-visibility/citations.md |
| Domaines référents | ≈ 0 | ≈ 0 | ➡️ | Ahrefs Webmaster Tools |

## Lire le dashboard
- Clics ↑ + visibilité IA plate = SEO classique fonctionne, AI SEO en retard → construire les pages comparaison/alternatives.
- Clics plats + visibilité ↑ = l'AI SEO compose de façon invisible au rank tracker → tenir le cap.
- Un marché ↑ et un autre ↓ = aller voir le weekly report segmenté avant de conclure.

## Focus de la semaine
**Forcer une seule forme d'URL (sans slash final) site-wide (< 4 h).** — L'export GSC révèle que presque chaque page est indexée en double (`/x` ET `/x/`), ce qui coupe impressions + position en deux (ex. `/en/crypto-card-cashback` 450+254 imp ; `/es` 612+493). Correctif : redirection 301 `/*/ → /*` dans `netlify.toml` + `<link rel="canonical">` sans slash dans le prerender. Un seul changement consolide des centaines de paires. Re-vérifier au prochain export (2026-08-17). _(Semaine du 2026-08-10 — confirmé A12 : CRITIQUE tech prime sur decay/striking-distance/gap, ces files étant vides ou sans candidate.)_

> Ensuite : optimiser le title/meta de `/en/cards/okx-card` (seul prisonnier page 2, pos 12, 0 clic — variantes dans le weekly report), puis contenu **`/…/crypto-card-apple-pay`** (gap FR total).
