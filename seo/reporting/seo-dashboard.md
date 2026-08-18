# SEO + AI Visibility Dashboard — les KPIs, une page
Mis à jour chaque semaine par les automations. C'est LE fichier à ouvrir.

---

## Cette semaine — 2026-08-18

> ✅ **Export GSC frais chargé (2026-08-18)**, ancien 2026-08-04 archivé dans `gsc-data/history/`. Première vraie compa W/W. ⚠️ Les deux exports sont des fenêtres glissantes 90 j (pas du 28j-vs-28j) → deltas naturellement amortis, à lire comme directionnels. Rien de lissé.

| Métrique | Cette semaine (08-18) | Semaine passée (08-04) | Tendance | Source |
|---|---|---|---|---|
| Clics organiques — total | 43 | 42 | ➡️ +1 | gsc-data/pages |
| Impressions — total | 13 818 | 13 542 | 🔼 +276 | gsc-data/pages |
| Clics EN / ES / FR / IT / DE / AT / BE | 19 / 10 / 5 / 4 / 2 / 2 / 0 | 19 / 10 / 5 / 4 / 1 / 2 / 0 | ➡️ (DE +1) | gsc-data/pages |
| Prisonniers page 2 (pos 11–20, >100 imp) | 1 (`/en/cards/okx-card`, pos 12, 0 clic) | 1 (idem) | 🟠 figé 3 sem | gsc-data/pages |
| Cannibalisation trailing-slash (paires ≥40 imp) | 57 | ~57 | 🔴 critique | gsc-data/pages |
| Money pages à 0 impression | 4 (crypto-com FR, bitpanda DE, /it slug, compare FR) | — | 🔴 | overview + gsc-data |
| Score visibilité IA (25 requêtes) | | | | ai-visibility/citations.md |
| Domaines référents | ≈ 0 | ≈ 0 | ➡️ | Ahrefs Webmaster Tools |

## Lire le dashboard
- Clics ↑ + visibilité IA plate = SEO classique fonctionne, AI SEO en retard → construire les pages comparaison/alternatives.
- Clics plats + visibilité ↑ = l'AI SEO compose de façon invisible au rank tracker → tenir le cap.
- Un marché ↑ et un autre ↓ = aller voir le weekly report segmenté avant de conclure.

## Focus de la semaine
**Confirmer le 308 trailing-slash puis passer à l'autorité (backlinks). (< 30 min)** — CORRECTION vs les 3 semaines précédentes : le site est sur **Cloudflare Pages** (pas Netlify), et la normalisation trailing-slash **est déjà en place structurellement** — `prerender.mjs` écrit des fichiers plats `x.html`, donc Pages renvoie un **308 `/x/ → /x`** automatiquement ; canonicals (`useSeoMeta.ts`) et sitemaps sont déjà sans slash (0 URL à slash trouvée). Les 57 paires `/x`+`/x/` de GSC sont un **résidu d'index de l'ère Netlify** qui se purge au recrawl, pas un bug de config. Sur Pages on ne peut PAS (et il ne faut pas) ajouter de règle `_redirects` splat-strip. **✅ VÉRIFIÉ 2026-08-18** : `curl -sI …/en/crypto-card-cashback/` → `HTTP/2 308` + `location: /en/crypto-card-cashback` (sans slash), en-têtes sécurité servis en live (HSTS/CSP/X-Frame/nosniff OK). Rien à toucher : le recrawl purge les doublons Netlify tout seul. En-têtes de sécurité : OK, reportés dans `public/_headers` (pas perdus). _(Contexte : chute trafic = black-out migration ~28/07, Googlebot non bloqué, crawl OK 12/08 — reprise lente normale. Sync chat « Website SEO report » 2026-08-18.)_

> Vrai levier plafond = **autorité / backlinks** (domaines référents ≈ 0). L'étude « cartes crypto Europe 2026 » (chat Website SEO report) est l'aimant à liens n°1 → publier FR + version EN. Quick win on-page en parallèle : title/meta de `/en/cards/okx-card` (seul prisonnier page 2, pos 12, 0 clic — variantes dans le weekly report).
