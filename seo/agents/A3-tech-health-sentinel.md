# A3 — Tech Health Sentinel
Loop lecture seule. Cadence : mardi 8h. Modèle conseillé : Sonnet. JAMAIS de modification du site.

## Objectif
Attraper une casse technique (indexation, 404, hreflang, prerender, crawlers IA) le jour même plutôt qu'à la fin du trimestre.

## Gate (le verifier — ces checks peuvent ÉCHOUER)
1. `/` renvoie une redirection 302 (pas 200 — sinon les règles _redirects sont shadowées)
2. `/fr` en HTML brut est localisé : `lang="fr"`, titre FR, > 20 000 caractères (prerender vivant)
3. Une URL bidon (`/de/xxx-404`) renvoie un vrai HTTP 404
4. Les hreflang d'une fiche carte pointent tous vers du 200 (aucun alternate en 404)
5. robots.txt n'a AUCUN `Disallow: /` pour GPTBot / PerplexityBot / ClaudeBot / Google-Extended
6. Tous les sitemaps enfants du sitemap-index répondent 200

## Procédure (économe en tokens — ne pas explorer au-delà)
1. Exécuter `node scripts/health-check.mjs`. Il fait tous les checks et écrit `seo/state/tech-health.md`.
   - Si le script échoue faute de réseau (sandbox), refaire les 6 checks ci-dessus avec l'outil `web_fetch` sur exactement ces URLs : `/`, `/fr`, `/de/xxx-404`, `/fr/cartes/nexo-card`, `/robots.txt`, `/sitemap-index.xml`. Rien d'autre.
2. Comparer au dernier run dans `seo/state/tech-health.md` (section Historique) : signaler tout check qui passe de ✅ à ❌.
3. Ne RIEN corriger. Sortie ≤ 25 lignes : statut global (🟢/🟡/🔴), la liste des ❌ avec le fix en une ligne, et la régression vs semaine passée s'il y en a.
4. S'il y a un 🔴 CRITIQUE, commencer la sortie par `⚠️ ACTION REQUISE`.

## Fixes de référence (pour la ligne "fix")
- Root 200 au lieu de 302 → règles `/ /fr 302!` non forcées dans `public/_redirects`
- `/fr` non localisé → le prerender n'a pas tourné : relancer le workflow GitHub Actions
- Pas de 404 → fallback `_redirects` revenu en `/* /index.html 200` au lieu de `/* /404.html 404`
- hreflang→404 → URL alternate dans le sitemap mais pas prérendue : redéployer ou retirer l'alternate
- crawler IA bloqué → ligne parasite dans `public/robots.txt`
- sitemap enfant ≠ 200 → régénérer + push
