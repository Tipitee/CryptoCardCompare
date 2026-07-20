# seo/ — le système AI SEO de TopCryptoCards
Adapté du « AI SEO Setup — 7 Configs » (Amadora), pré-rempli pour ce projet le 16/07/2026.
Principe : contexte écrit + workflows répétables + planning. L'IA lit ces fichiers à chaque session — zéro re-briefing.

## Carte du dossier
| Dossier | Rôle | Qui remplit |
|---|---|---|
| your-site/ | Le cerveau : overview, keywords, brand voice | ✅ pré-rempli — relire et ajuster |
| gsc-data/ | Vérité terrain : exports GSC hebdo | ⬜ toi, chaque lundi (2 min) |
| technical-seo/ | Playbooks : audit technique, schema | ✅ prêts — se lancent tels quels |
| ai-visibility/ | Le Search Console de l'IA : 25 buyer queries, citations, perception | ✅ queries pré-remplies |
| competitors/ | Qui gagne chaque réponse IA + pages à construire | ✅ prêt, le log grandit seul |
| content-strategy/ | Gaps + briefs | ✅ prêts |
| reporting/ | Dashboard + rapport hebdo | rempli par les automations |
| automations/ | Lundi ranking · Mercredi citations · Vendredi brief | à planifier dans Cowork |
| settings.json | Seuils + raccourcis (/audit, /visibility, /report…) | ✅ adapté |

## Première semaine
- [ ] Jour 1 — Relire your-site/ (3 fichiers, pré-remplis — 10 min de validation)
- [ ] Jour 1 — Relire ai-visibility/buyer-queries.csv, remplacer ce qui ne colle pas à tes vrais prospects
- [ ] Jour 2 — Lancer `/visibility` : la BASELINE. S'attendre à < 20 %.
- [ ] Jour 2 — Export GSC → gsc-data/ → lancer `/report`. Livrer les 3 réécritures de titles le jour même.
- [ ] Jour 3 — Copier le bloc "shortcuts" de settings.json dans les instructions projet (CLAUDE.md — déjà référencé)
- [ ] Jour 4 — Planifier les automations lundi + mercredi dans Cowork
- [ ] Jour 5 — Livrer LA correction recommandée par la baseline

## Règles multi-marchés (spécifique à nous)
Toujours segmenter par langue; une réponse FR ne couvre pas la requête DE; be/at héritent de fr/de mais ont leur fiscalité propre.
