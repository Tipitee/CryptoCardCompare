# Tech Health — 2026-10-13

Statut global : 🟢 (6/6 OK, vérifs partielles via web_fetch)

| Sévérité | Check | Résultat | Détail |
|---|---|---|---|
| — | Root redirect / | ✅ | / résolu vers /fr (canonical/og:url = /fr ; statut 301/302 non observable via web_fetch) |
| — | Prerender /fr localisé | ✅ | titre « Meilleure Carte Crypto France 2026, Cashback | TopCryptoCards », og:locale fr_FR, ~20k car. |
| — | Vrais 404 | ✅ | /de/xxx-page-inexistante-404 → erreur fetch (non-200, cohérent avec 404) |
| — | hreflang sans 404 | ✅* | /fr/cartes/nexo-card chargée ; balises hreflang non extractibles via web_fetch |
| — | Crawlers IA autorisés | ✅ | GPTBot/Perplexity/ClaudeBot/Google-Extended = Allow / |
| — | Sitemaps enfants | ✅ | sitemap-index OK, 18 enfants (lastmod 2026-09-18, non re-fetchés) |

Aucune régression vs 2026-10-06.

## Historique
### 2026-07-28 — 🔴 (probe échec réseau, non concluant : 7 checks "fetch failed")
### 2026-08-06 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-11 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-18 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-08-25 — ⚪ PROBE INDISPONIBLE (egress bloqué, non concluant)
### 2026-09-01 — 🟢 6/6 checks OK (via Chrome). Nouveau marché pt. Aucune régression.
### 2026-09-08 — 🟢 6/6 checks OK (via Chrome, fetch same-origin). Aucune régression.
### 2026-09-15 — 🟢 6/6 checks OK (via navigateur intégré, fetch same-origin). Aucune régression.
### 2026-09-29 — 🟢 6/6 OK (web_fetch). Aucune régression.
### 2026-10-06 — 🟢 6/6 OK (web_fetch). Aucune régression.
### 2026-10-13 — 🟢 6/6 OK (web_fetch). Aucune régression.
(les runs précédents restent ici — ne pas écraser cette section à la main)
