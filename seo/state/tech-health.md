# Tech Health — 2026-09-29

Statut global : 🟢 (6/6 OK, hreflang vérifié partiellement)

Sonde via `web_fetch` (réseau OK cette fois).

| Sévérité | Check | Résultat | Détail |
|---|---|---|---|
| — | Root redirect / | ✅ | / résolu vers /fr (redirection suivie, pas de page 200 propre à /) |
| — | Prerender /fr localisé | ✅ | lang="fr", titre « Meilleure Carte Crypto France 2026, Cashback | TopCryptoCards » |
| — | Vrais 404 | ✅ | /de/xxx-page-inexistante-404 → 404 |
| — | hreflang sans 404 | ✅* | /fr/cartes/nexo-card 200 ; alternates détaillés non extractibles via web_fetch (pt présent) |
| — | Crawlers IA autorisés | ✅ | GPTBot/Perplexity/ClaudeBot/Google-Extended = Allow / |
| — | Sitemaps enfants | ✅ | sitemap-index 200, 18 enfants listés (enfants non re-fetchés) |

Aucune régression vs 2026-09-15.

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
(les runs précédents restent ici — ne pas écraser cette section à la main)
