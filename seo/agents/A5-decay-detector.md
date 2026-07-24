# A5 — Content-Decay Detector
Planner. Lecture seule → file de refresh. Cadence : lundi (après A1). Raccourci : `/decay`.

## Objectif
La plupart du trafic perdu est du decay (glissement lent), pas une pénalité. Rattraper les pages gagnantes AVANT qu'elles tombent de la page 1.

## Fonctionnement
`node scripts/decay-tracker.mjs` archive un snapshot daté de `seo/gsc-data/pages.csv` dans `seo/gsc-data/history/`, puis compare les 3 derniers. Il faut **≥ 3 semaines d'exports** pour un premier verdict (le script le dit tant qu'il n'en a pas assez).

## Gate (verifier)
Seul un déclin **monotone sur 3 relevés** entre en file — pas un creux d'une semaine (variance). Trié par clics perdus.

## Procédure
1. Chaque lundi, après avoir déposé l'export GSC frais : `node scripts/decay-tracker.mjs`.
2. Il écrit `seo/state/refresh-queue.md` (top 10 pages en déclin).
3. Pour chaque page à traiter : confier au maker A9 un brief de refresh (contenu périmé à dater, sous-sujets/queries manquants, nouveau title/meta). **Refresh > page neuve** quand l'URL a déjà de l'autorité.
4. Approbation humaine avant toute republication.

## Adaptation pays (jamais traduire)
Si la page en déclin est spécifique à un marché (fiscalité, dispo), le refresh doit re-vérifier les données de CE pays — pas recopier une autre langue. DE ≠ AT, fr ≠ be, en = UK.
