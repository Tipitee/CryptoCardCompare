# Tech Health — 2026-10-27

Statut global : 🟡 (5/6 OK, 1 à vérifier — web_fetch)

| Sévérité | Check | Résultat | Détail |
|---|---|---|---|
| — | Root redirect / | ✅ | / résolu vers /fr (canonical = /fr ; statut 301/302 non observable) |
| — | Prerender /fr localisé | ✅ | titre « Meilleure Carte Crypto France 2026, Cashback | TopCryptoCards », og:locale fr_FR |
| 🟡 | Vrai 404 | ⚠️ | /de/xxx-page-inexistante-404 a retourné un shell HTML (titre générique) SANS erreur fetch, contrairement au 20/10 — possible fallback 200. À confirmer par curl -I |
| — | hreflang sans 404 | ✅* | /fr/cartes/nexo-card chargée ; hreflang non extractibles via web_fetch |
| — | Crawlers IA autorisés | ✅ | GPTBot/Perplexity/ClaudeBot/Google-Extended = Allow / |
| — | Sitemaps enfants | ✅ | 18 enfants, lastmod 2026-10-26 (non re-fetchés) |

Régression possible vs 2026-10-20 : check 404.

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
### 2026-10-20 — 🟢 6/6 OK (web_fetch). Aucune régression.
### 2026-10-27 — 🟡 5/6 (web_fetch). /de/xxx-404 sans erreur fetch : fallback 404 à confirmer.
(les runs précédents restent ici — ne pas écraser cette section à la main)
