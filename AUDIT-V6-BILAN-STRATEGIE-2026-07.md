# Audit v6 — Bilan des améliorations + Stratégie SEO/Contenu top niveau
**Date :** 7 juillet 2026 · Tout vérifié en direct (prod + Supabase). **Score santé : 82/100** (72 → 82).

---

## 1. Bilan — ce qui a été corrigé depuis v5 ✅

| Point v5 | État vérifié aujourd'hui |
|---|---|
| L1 `lang="be"/"at"` invalides | ✅ `lang="fr-BE"` en prod |
| L2 Fiches cartes BE/AT en anglais | ✅ « Nexo Card Avis 2026… » en FR sur /be |
| L3 `/be/blog` → 404 depuis la nav | ✅ 200 |
| L4 hreflang vers reviews BE/AT 404 | ✅ `/be/avis/crypto-com-card` = 200 |
| L5 404.html corrompu (mi-home FR/EN) | ✅ « 404 — Page introuvable » propre |
| L7 sitemap-blog en retard | ✅ 541 URLs (base : 551 posts — les 10 manquants = les 2×5 topics incomplets, cohérent) |
| Excerpts FR faibles ×39 | ✅ **0** excerpt faible (1 résiduel EN/DE/IT) |
| Posts orphelins ES/IT | ✅ résolus |
| Code splitting | ✅ 4 vendor chunks servis (176+123+349+55 Ko) |
| GEO llms.txt / llms-full.txt | ✅ 200 en prod |

Base de contenu : **551 posts** (+8), 7 marchés fonctionnels, prerender + 404 réels + hreflang 7 locales stables.

## Reste ouvert (reliquat v5 — à finir avant la stratégie)

| # | Point | Effort |
|---|---|---|
| R1 | Thème IBAN : sections ES/IT toujours manquantes (FR 5 h2, ES/IT 4) | 1 h |
| R2 | Skip-link toujours absent + focus clavier `outline:none` | 1,5 h |
| R3 | 3 reviews (Gnosis Pay, Brighty, MetaMask) toujours DE+EN seulement → 9 pages FR/ES/IT à créer | 2 h script |
| R4 | Contrastes gris/sombre (~4.0:1) non retouchés | 2 h |
| R5 | Pages légales non localisées ; GA toujours en head | 4 h |
| R6 | `index.js` = 511 Ko à lui seul (les données éditoriales ×7 marchés sont bundlées) → lazy-load des data files par route, recharts (349 Ko) chargé sur la home sans graphique visible → import dynamique | ½ j |

---

## 2. Stratégie « top niveau » — SEO + Contenu

La technique est maintenant saine. Ce qui sépare le site d'un leader de niche, c'est **la profondeur, la preuve, et l'autorité**. Ton avantage structurel unique : une **base de données de 90+ cartes × 7 marchés** que ni les médias crypto ni les blogs de vendors ne maintiennent. Toute la stratégie découle de ça : *transformer la DB en contenu que personne ne peut copier sans la DB*.

### Pilier A — Data-as-Content (ton fossé concurrentiel)

1. **Fee Index mensuel** (l'actif de liens n°1). Page `/fr/indice-frais-cartes-crypto` ×7 marchés, générée depuis Supabase : coût réel moyen (émission + FX + retraits) par carte et par pays, évolution mois par mois, méthodo publique. C'est citable par les journalistes, les newsletters et les IA. Automatisable à 90 % (script existant `generate-*` comme modèle). Publier un communiqué trimestriel ×5 langues.
2. **Tracker MiCA** : tableau « émetteurs licenciés MiCA » (statut, pays, date) — requête montante en 2026, zéro concurrent structuré, mise à jour = 30 min/mois.
3. **Matrices de disponibilité par pays** : la donnée `availability by market` de la table `cards` → blocs « Disponible en Belgique : oui/non » sur chaque fiche + pages pays. Les requêtes « carte crypto Belgique/Autriche/Suisse » sont à intention maximale et faible concurrence.
4. **Changelog public par carte** : chaque modif de frais/cashback en base = entrée datée visible sur la fiche (« 15/06/2026 : cashback Nexo 2 % → 1,5 % »). Signal de fraîcheur inimitable + matière à posts « alerte » qui font des liens.

### Pilier B — Preuve de première main (E-E-A-T réel, pas déclaratif)

5. **Standard de review v2** — pour les 15 cartes principales, chaque review doit contenir : photo réelle de la carte, capture d'un paiement test avec les frais réels constatés (« nous avons payé 1,04 € de frais FX sur 100 € »), verdict « pour qui / pas pour qui », date de dernier test. C'est LE différenciateur vs les fermes d'affiliation — et ce que Google cible avec Helpful Content dans les niches YMYL.
6. **Page méthodologie ×7** (contenu déjà rédigé dans seo-fixes/methodology.json) + lien footer + `Organization.sameAs` vers les profils sociaux/LinkedIn de l'auteur. Compléter l'entité auteur (bio LinkedIn réelle sur AuthorPage).
7. **Transparence revenus** : encadré « comment on gagne de l'argent » sur les pages money (tu as déjà IndependentNotice — le généraliser).

### Pilier C — Architecture de contenu (passer de 551 posts à un graphe topique)

8. **Hub-and-spoke** : 6 hubs par marché (Cashback, Frais, Débutants, Fiscalité, Voyage, IBAN/SEPA) listant leurs articles + intro 300 mots + liens croisés. Profondeur de crawl ≤ 3 pour 100 % des posts (aujourd'hui 5+ clics pour les anciens).
9. **Programme profondeur** : 55 % des posts < 500 mots (inchangé depuis v4 — c'est maintenant le chantier n°1). Cadence réaliste : 2 topics/semaine approfondis à 1 200+ mots ×5 langues via le pipeline de traduction existant. Prioriser par la demande GSC dès que 4 semaines de données existent ; d'ici là : les 30 paires A-vs-B allowlistées + 15 reviews.
10. **Politique de fusion** : posts < 300 mots sans impressions à 90 jours → fusionner dans les hubs (redirect 301), viser ~400 posts costauds plutôt que 551 minces.
11. **Cannibalisation 2026** : `best-crypto-card-2026` = « ce qui a changé en 2026 » (angle actu, maj mensuelle) vs `best-crypto-card` = classement permanent. Cross-link explicite entre les deux.

### Pilier D — GEO / AI Search (ton llms.txt est en avance — capitalise)

12. **Blocs « Faits clés » extractibles** en haut de chaque review/thématique : `<table>` HTML simple (émission, FX, cashback, staking, IBAN, dispo pays, licence MiCA) avec `<caption>` datée. Les moteurs IA citent des faits structurés datés ; tu es désormais visible d'eux (prerender ✓, llms-full.txt ✓).
13. **Phrases-réponses** : les 2 premières phrases de chaque page thématique = réponse directe à la requête (« La meilleure carte crypto sans staking en juillet 2026 est X, avec Y % de cashback sans condition »). Format snippet + AI Overview.
14. **Set de mesure IA** : 10 requêtes test (FR/EN/DE) dans Perplexity, ChatGPT, Google AIO — relevé mensuel des citations. Objectif : cité sur ≥ 5/10 à J90.
15. **Stabilité des ancres** : ids HTML stables sur les sections clés (`#frais`, `#cashback`) pour que les citations IA pointent proprement.

### Pilier E — Autorité (le facteur limitant final)

16. **Exécuter les drafts dormants** : bitcointalk-post(-fr).md et medium-article.md sont dans le repo depuis des semaines → publier.
17. **Digital PR data-driven** : 1 étude/trimestre tirée de la DB (« Le coût caché des cartes crypto : 90 cartes analysées dans 27 pays »), pitch aux newsletters crypto FR (Cryptoast, JDC) et EN (Milk Road, Bankless) — l'étude est le seul format qui génère des liens éditoriaux dans cette niche.
18. **HARO/Featured/Qwoted** 30 min/jour en tant que « fondateur du comparateur de cartes crypto 7 marchés » ; cible : 2–5 liens DR 40+ par trimestre.
19. **Link gap mensuel** (Ahrefs Webmaster Tools gratuit) vs cryptocardindex.com et les listicles Koinly : récupérer les inclusions « resource pages ».

---

## 3. Séquencement

**Semaine 1 :** R1–R6 (reliquat) + publier les drafts (§16). → Score technique ≈ 90.
**Semaines 2–4 :** Standard review v2 sur 5 cartes phares ×5 langues (§5) + blocs Faits clés (§12) + phrases-réponses sur les 15 thématiques (§13) + hubs v1 (§8).
**Mois 2 :** Fee Index v1 (§1) + tracker MiCA (§2) + première étude PR (§17) + programme profondeur en rythme (§9) + set de mesure IA (§14).
**Mois 3 :** Pages pays/fiscalité (§3) + changelog cartes (§4) + fusion des posts morts (§10) + itération sur les données GSC.

**KPIs J90 :** ≥ 1 200 pages indexées Google · ≥ 600 Bing · 30 money pages ≥ 1 200 mots ×5 langues · ≥ 15 domaines référents · ≥ 5/10 requêtes IA avec citation · Lighthouse a11y ≥ 95 · % posts thin < 35 %.

---

*Notes de vérif : tous les checks L1–L7 refaits en HTTP direct aujourd'hui ; stats contenu recalculées sur les 551 posts en base ; chunks mesurés sur la prod. Seuls R1–R6 subsistent du plan v5 — l'équipe exécute vite.*
