# SEO + AI Visibility Dashboard — les KPIs, une page
Mis à jour chaque semaine par les automations. C'est LE fichier à ouvrir.

---

## Cette semaine — 2026-09-08

> ✅ **Export GSC frais reçu (08/09, « Last 3 months »)** — blocage data levé après 3 sem.
> 🔴 **CRASH confirmé, non résorbé.** Trend quotidien (Chart.csv) : pic W30 (26/07–01/08) = 2 892 imp/sem → chute W31 (387) → 147 → 122 → 94 → 72 → **95** (W36). **−94 % imp / −100 % clics sur 28 j vs 28 j précédents**, 0 clic depuis 4 sem. Cassure = migration Cloudflare (~28/07) + déploiements août. **L'hypothèse « reprise 3–6 sem. » du 24/08 est INFIRMÉE** (6 sem., aucune remontée) → cause structurelle, pas un lag de recrawl. Détail : `reporting/weekly-2026-09-08.md`.

| Métrique | Cette semaine (09-08) | Réf. (08-18) | Tendance | Source |
|---|---|---|---|---|
| Impressions — 28 derniers j | **409** | ~6 388 (28 j préc.) | 🔴 −94 % | gsc-data/Chart |
| Clics — 28 derniers j | **0** | 28 | 🔴 −100 % | gsc-data/Chart |
| Clics organiques — total 3 mois | 43 | 43 | ➡️ (fenêtre glissante pré-crash) | gsc-data/pages |
| Impressions — total 3 mois | ~14 167 | 13 818 | ➡️ (traîne pré-crash) | gsc-data/pages |
| Clics EN / ES / FR / IT / DE / AT / BE / PT | 19 / 10 / 5 / 4 / 2 / 2 / 0 / 0 | 19/10/5/4/2/2/0 | ➡️ | gsc-data/pages |
| Prisonniers page 2 (pos 11–20, >100 imp) | **0** | 1 | 🔴 tombé de page 2 | gsc-data/queries |
| Positions requêtes money | pos **55–95** | idem | 🔴 jamais ranké | gsc-data/queries |
| Doublons trailing-slash (paires ≥40 imp) | encore visibles (`/es`+`/es/`…) | ~57 | 🟡 purge stoppée (recrawl tari) | gsc-data/pages |
| Domaines référents | ≈ 0 | ≈ 0 | ➡️ | Ahrefs WT |

## Lire le dashboard
- Clics ↑ + visibilité IA plate = SEO classique fonctionne, AI SEO en retard → construire les pages comparaison/alternatives.
- Clics plats + visibilité ↑ = l'AI SEO compose de façon invisible au rank tracker → tenir le cap.
- Un marché ↑ et un autre ↓ = aller voir le weekly report segmenté avant de conclure.

## Focus de la semaine (maj 2026-09-08)
**Action (< 4 h) : lancer l'outreach. J0 = envoyer l'exclu à The Big Whale (Grégory Raymond) + Journal du Coin, puis s'inscrire à Source of Sources et Qwoted, et logger chaque envoi dans `seo/backlinks-outreach.xlsx`.** Emails prêts dans `seo/EMAILS-OUTREACH.md`, cibles et accroches dans `seo/PITCH-PRESSE.md`, stratégie dans `seo/PLAN-BACKLINKS.md`. La page-étude (asset) a été renforcée le 08/09 : schema FAQPage + bloc « reprise presse » sur les 5 langues. _Verdict établi le 08/09 : test sur 4 money pages (pas de `noindex`, HTTP 200, 73 454 car. prérendus, indexées OK dans GSC) → cause technique écartée. Le crash = fin de l'échantillonnage « honeymoon » (site neuf, interrompu par la migration ~28/07) + domaines référents ≈ 0 → pages saines mais ran. pos 55–95, jamais affichées. Aucun gain on-page à portée. Seul levier : l'autorité. Brief complet : `reporting/handoff-outreach-2026-09-08.md`. À surveiller : bleap.finance top 5 / 6 marchés (SERP 03/09) ; mention IA FR « cashback sans staking » perdue._

<details><summary>Focus précédent (2026-09-07)</summary>

**Recharger un export GSC frais — dernier = 18/08, 20 j > seuil 7 j, BLOQUANT (3ᵉ sem.). < 15 min.** _Reçu le 08/09 → débloqué. Voir focus courant._

</details>

<details><summary>Focus précédent (2026-08-31)</summary>

**Recharger un export GSC frais — dernier = 18/08, 13 j > seuil 7 j, BLOQUANT. < 15 min.** _Data = verrou ; decay/striking gelés, sonde tech alors HS. Fallback prêt : title/meta `/en/cards/okx-card`. Surveiller bleap.finance (5 marchés) + 1 mention IA FR cashback sans staking._

</details>

<details><summary>Focus précédent (2026-08-24)</summary>

**Réécrire le title + meta de `/en/cards/okx-card` (seul prisonnier page 2, pos 12, 137 imp, 0 clic, figé 4 sem.) — < 30 min.** _Reconduit S+1 : aucun CRITIQUE tech (sonde ⚪ HS), files decay + striking-distance vides → cette page reste le seul gain on-page à portée. Prérequis données : recharger un export GSC frais (dernier = 18/08)._ C'est la seule page proche de la page 1 : ~28 % des clics sont sur le top 10, cette page frôle le seuil sans le franchir, et son snippet ne convertit pas (0 clic sur 137 imp). Un title/meta orienté « review + frais + cashback » est le seul gain on-page à portée cette semaine. Variantes fournies dans le weekly report. (Trailing-slash : **rien à faire** — 308 déjà en place sur Cloudflare Pages, vérifié 18/08 ; les ~57 paires sont un résidu Netlify qui se purge au recrawl.)

</details>

> Vrai levier plafond = **autorité / backlinks** (domaines référents ≈ 0) — hors périmètre « < 4 h » mais c'est LE chantier. L'étude « cartes crypto Europe 2026 » est en ligne (vérifié 23/08 dans le chat Website SEO report) : lancer l'outreach (Journal du Coin, The Big Whale) est la priorité stratégique parallèle. **Aussi : recharger un export GSC frais** (dernier = 08-18) pour que le prochain run ait de la vraie donnée W/W.
