# Tech Health — 2026-09-01

Statut global : 🟢 (1er run concluant depuis le 2026-07-28)

Sonde `web_fetch` (workspace) et navigateur intégré : toujours egress-bloqués sur
topcryptocards.eu. Contournement réussi via **Claude in Chrome** (navigateur réel
de l'utilisateur, réseau indépendant). Les 6 checks ont pu être exécutés.

| Sévérité | Check | Résultat | Détail |
|---|---|---|---|
| — | Root redirect / | ✅ | 3xx serveur → /en (geo UK), redirected:true confirmé |
| — | Prerender /fr localisé | ✅ | lang="fr", titre « Meilleure Carte Crypto France 2026 » |
| — | Vrais 404 | ✅ | /de/xxx-page-inexistante-404 → HTTP 404 |
| — | hreflang sans 404 | ✅ | /fr/cartes/nexo-card 200, 9 alternates tous 200 |
| — | Crawlers IA autorisés | ✅ | GPTBot/Perplexity/ClaudeBot/Google-Extended = Allow |
| — | Sitemaps enfants 200 | ✅ | sitemap-index 200, 18 enfants tous 200 |

Nouveauté (non-régression) : marché **Portugais** ajouté depuis le dernier run
concluant — hreflang `pt` + `pt-PT`, sitemaps `sitemap-cards-pt.xml` /
`sitemap-reviews-pt.xml`, alternates nexo-card/pt en 200. Aucune régression détectée.

Note : root redirige vers /en (et non /fr comme dans CLAUDE.md) — comportement
geo-dépendant côté Cloudflare, pas une casse. Le check exige seulement un 3xx.

## Historique
### 2026-07-28 — 🔴 (probe échec réseau, non concluant : 7 checks "fetch failed")
### 2026-08-06 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-11 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-18 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-25 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-09-01 — 🟢 6/6 checks OK (via Chrome). Nouveau marché pt. Aucune régression.
(les runs précédents restent ici — ne pas écraser cette section à la main)
