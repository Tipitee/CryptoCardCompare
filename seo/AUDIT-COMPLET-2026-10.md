# Audit complet TopCryptoCards — 12 oct. 2026

État : site **pré-traction, techniquement sain** après la remédiation GSC (0 lien cassé, 0 soft-404, 0 redirect-error en live). Ce qui bloque la croissance n'est plus technique — c'est **l'autorité + la pertinence du contenu sur les requêtes gagnables**. Priorités notées P0 (fort ROI / fondation) → P2 (nice-to-have).

Chiffres de référence : ~2 276 URLs au sitemap, dont ~1 017 en `noindex` (prune qualité volontaire) → **cœur indexable ≈ 1 260**. Bundle JS total ≈ 3,8 Mo non-compressé. GSC (dernière lecture) : ~5 clics / 8 500 impressions, CTR 0,06 %, positions page 3+.

---

## 1. Technique / indexabilité

**Fait (cette session)** — catch-all SPA 200 + suppression du `404.html` (qui masquait le fallback), `noindex` fiable sur tous les états « introuvable » (Blog/Review/Card/Comparison/Brand/NotFound), filtrage allowlist des comparatifs, `_redirects` durci. Résultat : plus aucune 404 sur du contenu réel.

- **P1 — Sitemaps listent encore ~1 017 URLs `noindex`.** C'est voulu pour accélérer la désindexation du prune, mais c'est un warning GSC « Exclue par noindex ». **Action** : dans ~3-4 semaines (quand GSC montre ces URLs sorties de l'index), régénérer les sitemaps en **excluant les pages noindex** (cryptos, be/at dupliqués, cartes sans avis, blog < 500 mots). Cible : sitemaps = uniquement le cœur indexable (~800-900 URLs réellement de qualité).
- **P1 — `sitemap-blog.xml` = 523 URLs** dont une part notable est noindex (< 500 mots). Même traitement : régénérer à partir des seuls posts publiés ≥ 500 mots.
- **P2 — `llms-full.txt` daté « September 2026 »** : régénéré au déploiement, donc OK, mais vérifier que le cron nocturne tourne bien (sinon forcer un build).

## 2. Performance (Core Web Vitals) — P1, sous-estimé

Le bundle est lourd, ce qui pèse sur LCP/TBT mobile (facteur de ranking + conversion) :

| Chunk | Taille (non-gz) |
|---|---|
| `index` (bundle principal) | 664 Ko |
| `ThematicPage` | 520 Ko |
| `cardReviewsI18n` (données d'avis) | 416 Ko |
| `vendor-charts` | 352 Ko |
| `ComparisonPage` | 316 Ko |
| **Total JS** | **≈ 3,8 Mo** |

**Vérification (12 oct.)** : les gros chunks sont déjà **code-splittés par route** (36 routes lazy). `vendor-charts` (recharts) n'est importé que par `Simulator.tsx` → chargé uniquement sur le simulateur. `cardReviewsI18n` (416 Ko) n'est chargé que sur les routes avis/marques. **Donc le point perf était sur-estimé : la situation est adéquate.**
- Seul coût toujours chargé : le bundle `index` (~664 Ko brut ≈ ~200 Ko gzip) — acceptable, rien de pathologique dedans.
- **Micro-optimisation possible, faible priorité** : splitter `cardReviewsI18n` par carte (réduit le poids des pages avis/marques). ROI faible vs contenu — à faire seulement si Lighthouse mobile montre un TBT problématique.

## 3. Contenu — LE levier n°1 (ta propre stratégie du 29 sept.)

- **P0 — Format des money-pages.** Les pages qui font l'argent (`/fr/meilleure-carte-crypto`, `/fr/carte-crypto-cashback`, `/de/beste-krypto-karte`, `/en/best-crypto-card`, `/es/mejor-tarjeta-cripto`, `/it/migliore-carta-cripto`, `/pt/melhor-cartao-crypto`) doivent toutes suivre le format gagnant SERP : **réponse directe (100 premiers mots) + tableau comparatif daté « vérifié [mois] 2026 » + top 3 détaillé + critères par profil + fiscalité du marché + FAQ + méthodo/divulgation**. À auditer une par une contre `seo/content-strategy/CONTENT-PLAYBOOK.md`.
- **P1 — 55 % des ~560 posts < 500 mots** (maintenant noindex). Bon pour la qualité du domaine, mais c'est du potentiel gâché. **Refresh > new** : approfondir les posts sous 500 mots qui ciblent une vraie intention (dater, tableau, FAQ, schema) pour les repasser au-dessus du seuil et les ré-indexer. Prioriser ceux qui étaient en striking distance.
- **P1 — Mesurer avant de produire plus.** On a ajouté ~79 pages long-tail/comparatifs cette session. **Laisser 2-3 semaines**, voir lesquelles captent impressions/positions, puis itérer sur les gagnantes — plutôt qu'empiler.

## 4. Données structurées (rich snippets) — P1

Socle solide (FAQPage, BreadcrumbList, ItemList, Dataset, Organization, Offer). Opportunités de CTR :

- **Review + AggregateRating sur CHAQUE fiche carte et page avis** (étoiles en SERP). Vérifier que le schema `Review`/`AggregateRating` est bien émis par page (il n'apparaît qu'une fois dans le code source = composant dynamique — à confirmer en live via Rich Results Test).
- **Product / Offer** sur les fiches cartes (prix annuel, cashback) → éligibilité aux rich results produit.
- Garder la cohérence `inLanguage` + hreflang sur les variantes.

## 5. GEO / visibilité IA — P1 (ton avantage réel)

Tu es absent de 227/231 buyer queries suivies mais **déjà n°1 Perplexity** sur « meilleur cashback sans staking ». Ton format honnête + data datée est exactement ce que citent les IA.

- **Action** : répliquer le format « réponse directe + tableau daté + FAQ » sur les pages des requêtes gagnables ; maintenir `llms-full.txt` frais ; suivre les citations (`seo/ai-visibility/`). C'est du trafic là où les médias sont absents.

## 6. Maillage interne — P1

Après le prune, beaucoup de pages sont `noindex,follow`. Elles passent le jus, mais Google réduit leur crawl avec le temps.

- **Action** : s'assurer que chaque money-page reçoit des liens **depuis des pages indexées** (autres money-pages, articles money récents — déjà fait en partie cette session via les cross-links). Éviter les money-pages qui ne seraient liées que depuis des pages noindex.
- Vérifier l'absence de pages indexables **orphelines** (dans le sitemap mais sans lien entrant interne) — le crawler `scripts/audit-links.mjs --crawl-links` peut le lister.

## 7. Off-site / autorité — P2 (réaliste)

- Pas de presse top-tier (ce sont tes concurrents : Cryptoast, JdC…). 
- **PR réactif** (Qwoted, Featured, Source of Sources, #JournoRequest) : 15 min/jour, réponses d'expert « cartes crypto / cashback » avec ta data. Rendement 5-10× le cold outreach.
- L'étude 2026 = aimant à citations IA + argument d'autorité, pas produit d'appel pour cold pitch.

## 8. Mesure / pilotage — P0 (ce qui manque le plus)

- **`seo/your-site/overview.md` a les positions money-pages vides (« GSC à remplir »).** Sans ça, on pilote à l'aveugle. **Action** : remplir les positions actuelles, isoler les requêtes en **striking distance (pos 8-20)** — ce sont les gains les plus rapides, à pousser en priorité (refresh ciblé + maillage).
- Suivi mensuel via les playbooks existants (`/audit`, `/report`, `/visibility`).

---

## Plan 30 jours (par ROI)

1. **Semaine 1** — Valider les 3 correctifs dans GSC. Remplir les positions money-pages + lister les requêtes striking-distance (P0 mesure).
2. **Semaine 1-2** — Auditer et aligner les 7 money-pages « meilleure carte » au format gagnant + schema Review/AggregateRating (P0/P1).
3. **Semaine 2** — Perf : lazy-load `vendor-charts` + alléger `cardReviewsI18n` (P1).
4. **Semaine 3** — Refresh des posts striking-distance < 500 mots (P1 contenu).
5. **Semaine 3-4** — Quand le prune est désindexé : régénérer les sitemaps sans les noindex (P1 technique).
6. **Continu** — PR réactif 15 min/jour (P2) ; mesurer les ~79 nouvelles pages et itérer sur les gagnantes.

**Règle d'or** (ta stratégie) : le domaine est jeune en niche YMYL — c'est un jeu de **mois qui composent**. La fondation technique est maintenant propre ; le moteur de croissance, ce sont les money-pages au format gagnant + le long-tail mesuré + les citations IA.

---

## ANNEXE — Données GSC (90 j, au 12 oct. 2026) + priorisation

**Progression réelle** : 73 clics / 11 325 impressions / CTR 0,64 % (vs ~5 clics en sept.). Mobile porte tout (52 clics, pos 22) ; desktop traîne (20 clics, pos 42). Pays : FR 9, ES 8, IT 7, DE 6, PT/BE 3.

**Constat n°1 — le prune cartes était trop agressif (corrigé).** Les fiches de cartes « obscures » portent l'essentiel des impressions en striking distance et on les avait noindexées :
- `/en/cards/kardpay-card` : 274 impr, **pos 8,9** (était noindex)
- `/en/cards/kraken-krak-card` : 193 impr, pos 9,1
- `/en/cards/avalanche-card` : 105 impr, pos 15,5, **3 clics** (était noindex)
- `/en/cards/kast-card`, `/en/cards/trustee-plus-card` : 100+ impr (étaient noindex)
→ **Fait** : CardDetail ré-indexe désormais toute fiche d'une carte disponible (be/at restent noindex). Récupère ce long-tail de marque peu concurrentiel.

**Constat n°2 — le cluster « Krak Card » (Kraken) = la plus grosse opportunité.** 15+ requêtes pos 5-13, EN + DE :
`krak card vs kraken card`, `is krak card free` / `ist die krak karte kostenlos`, `krak gebühren`, `krak card review/test/erfahrung`, `does krak card work internationally`, `foreign transaction fees`, `kraken card cashback/benefits`, `krak vs n26`.
→ **À faire (prochaine action contenu)** : enrichir l'avis Kraken (`kraken-card`) avec une FAQ répondant EXACTEMENT à ces questions (gratuité, frais FX, international, Krak vs Kraken, cashback, benefits) en EN + DE. Pousse 3 pages déjà classées (carte pos 9,1 / avis 12,6 / marque 13,4) vers la page 1.

**Constat n°3 — quasi page 1 (pos 5-10) à pousser** : `solid card` (7,8), `kraken card cashback` (6,9), `is krak card free` (6,2), `uphold cards` (6,2), `top tarjetas crypto con recompensas en españa` (6,0), `baanx` (6,5). Petits efforts (FAQ + titre) = clics rapides.

**Constat n°4 — CTR 0 malgré pos 8-9** (ex. kardpay 188 impr/0 clic) : titres/meta peu incitatifs OU pages en cours de phase-out noindex. À re-mesurer après ré-indexation + revoir les `<title>` des fiches cartes (ajouter le bénéfice : cashback %, « sans frais », année).

**Priorité d'exécution (data-driven)** :
1. ✅ Ré-indexer les fiches cartes (fait) — débloque kardpay/avalanche/kast/trustee…
2. Enrichir le cluster Krak/Kraken (FAQ EN+DE) — gros volume, pos 5-13.
3. Titres/meta des fiches cartes à fort impression mais 0 CTR.
4. Pousser les « quasi page 1 » (solid, uphold, baanx, ES recompensas).
5. Money-pages : intros réponse directe (fait) ; mesurer dans 2-3 sem.
