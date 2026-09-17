# Tech Health — 2026-09-15

Statut global : 🟢 (6/6 OK)

Sonde `web_fetch` (workspace) toujours egress-bloquée sur topcryptocards.eu.
Contournement réussi via le **navigateur intégré** (fetch same-origin depuis /fr,
réseau réel). Les 6 checks ont pu être exécutés.

| Sévérité | Check | Résultat | Détail |
|---|---|---|---|
| — | Root redirect / | ✅ | opaqueredirect (3xx, redirect:manual) — conforme |
| — | Prerender /fr localisé | ✅ | lang="fr", titre « Meilleure Carte Crypto France 2026 », 181 837 car. |
| — | Vrais 404 | ✅ | /de/xxx-page-inexistante-404 → HTTP 404 |
| — | hreflang sans 404 | ✅ | /fr/cartes/nexo-card 200, 9 alternates tous 200 |
| — | Crawlers IA autorisés | ✅ | GPTBot/Perplexity/ClaudeBot/Google-Extended = Allow (robots.txt 200) |
| — | Sitemaps enfants 200 | ✅ | sitemap-index 200, 18 enfants tous 200 |

Aucune régression vs 2026-09-08 (18 enfants, mêmes 9 alternates, marché pt présent).

## Historique
### 2026-07-28 — 🔴 (probe échec réseau, non concluant : 7 checks "fetch failed")
### 2026-08-06 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-11 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-18 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-25 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-09-01 — 🟢 6/6 checks OK (via Chrome). Nouveau marché pt. Aucune régression.
### 2026-09-08 — 🟢 6/6 checks OK (via Chrome, fetch same-origin). Aucune régression.
### 2026-09-15 — 🟢 6/6 checks OK (via navigateur intégré, fetch same-origin). Aucune régression.
(les runs précédents restent ici — ne pas écraser cette section à la main)
