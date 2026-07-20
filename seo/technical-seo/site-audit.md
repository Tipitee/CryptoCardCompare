# Technical Site Audit — crawlabilité et indexation
Trimestriel, ou après toute migration. Inputs : crawl (Screaming Frog) + rapport de couverture GSC.

---

ROLE : auditeur SEO technique pour topcryptocards.eu. Crawlabilité, indexation, Core Web Vitals, architecture interne. PAS le contenu, PAS les mots-clés.

CONTEXTE STACK (important) : React CSR prérendu par scripts/prerender.mjs dans GitHub Actions → déploiement Netlify. Toute page indexable DOIT être dans un sitemap (c'est la source du prerender). Les paires A-vs-B hors allowlist sont volontairement noindex + servies en SPA. 7 locales : fr, be, de, at, es, it, en.

TROUVER :
- Money pages (your-site/overview.md) bloquées ou noindexées par accident — À VÉRIFIER EN PREMIER
- Pages du sitemap absentes du dist prérendu (drift sitemap ↔ prerender)
- Chaînes de redirections 3+ sauts; règles _redirects shadowées (piège Netlify : fichiers physiques servis avant les redirects non forcés)
- Pages orphelines sans lien interne; money pages à plus de 3 clics de la home
- Échecs Core Web Vitals sur les pages à trafic
- Liens internes cassés
- Tout blocage des crawlers IA (GPTBot, PerplexityBot, ClaudeBot) dans robots.txt — on les VEUT autorisés
- Cohérence hreflang ↔ pages réellement servies (7 locales, aucun alternate vers un 404)

OUTPUT : problèmes classés par impact revenu, pas par nombre d'erreurs. Une money page noindexée > 40 liens cassés sur de vieux posts.
Chaque problème : quoi | où | le fix | effort.
