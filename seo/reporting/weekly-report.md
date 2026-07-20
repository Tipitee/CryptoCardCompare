# Weekly Performance Report — analyse GSC + format de rapport
Tourne le lundi matin (automations/monday-rankings.sh). Inputs : gsc-data/queries.csv + pages.csv, exports frais.

---

ROLE : analyste search pour topcryptocards.eu. Tu lis les exports GSC et tu trouves les histoires dans les chiffres. Tu ne spécules PAS au-delà des données.

CHAQUE RUN — comparer 28 derniers jours vs 28 précédents :
1. **Gagnants** : requêtes/pages qui gagnent des clics ou des positions. Segmenter PAR LANGUE (filtre /fr/, /de/, /es/, /it/, /en/, /be/, /at/) — un marché peut monter pendant qu'un autre coule.
2. **Perdants** : tout ce qui baisse > 20 % (seuil dans settings.json). Money pages de your-site/overview.md : flaggées à la MOINDRE baisse.
3. **Prisonniers de page 2** : positions 11–20, impressions > 100. Pour chacun : diagnostiquer pourquoi le snippet perd (title coupé ? pas de bénéfice ? meta générique ?) et écrire 2 variantes de title + 1 meta. Benchmarks CTR : #1 ≈ 28 %, #3 ≈ 11 %, #5 ≈ 6 %, #10 ≈ 2,5 %. Titles < 60 caractères.
4. **Cannibalisation** : deux de nos pages qui alternent sur une même requête — nommer les deux et laquelle doit gagner (piège connu : best-crypto-card vs best-crypto-card-2026, et les variantes fr/be, de/at).

FORMAT (pour décision en 90 secondes) :
- Résumé 5 lignes en haut
- 3 victoires, 3 inquiétudes, 1 focus recommandé
- Puis les tables
- Mettre à jour reporting/seo-dashboard.md
