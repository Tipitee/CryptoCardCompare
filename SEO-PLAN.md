# Plan SEO Complet — topcryptocards.eu
_Mise à jour : Juin 2026_

---

## 🔴 URGENCES (faire cette semaine)

### 1. Corriger sitemap-index.xml dans Bolt
Le fichier dans Bolt contient encore les marqueurs de conflit git (`<<<<<<< HEAD`), ce qui provoque une erreur de parsing ligne 3 dans Google Search Console → 0 pages découvertes.

**Action** : Ouvre l'éditeur Bolt → trouve `public/sitemap-index.xml` → remplace tout le contenu par le XML propre ci-dessous → Publish → Google Search Console → Sitemaps → Resubmit.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://topcryptocards.eu/sitemap-pages.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-thematic.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-blog.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-cards-fr.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-cards-de.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-cards-es.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-cards-it.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-cards-en.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-compare.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
  <sitemap><loc>https://topcryptocards.eu/sitemap-cryptos.xml</loc><lastmod>2026-06-15</lastmod></sitemap>
</sitemapindex>
```

### 2. Déployer la Edge Function corrigée
La fonction actuelle génère des images Bitcoin pour des articles Ethereum/Solana.

**Action depuis ton terminal** :
```bash
supabase functions deploy generate-hero-image
```

Puis dans AdminHeroImages, regénère les articles crypto concernés.

### 3. Choisir un seul workflow git
Bolt et GitHub sont en conflit permanent. Chaque publication Bolt écrase les changements GitHub.

**Recommandation** : Abandonne l'éditeur Bolt. Utilise uniquement terminal + `git push`. Bolt détecte automatiquement les nouveaux commits GitHub et se met à jour.

---

## ✅ CE QUI EST DÉJÀ FAIT (inventaire complet)

### Technique
- Sitemap XML dynamique multi-lingue (10 sous-sitemaps, ~15 000 URLs)
- Hreflang sur toutes les pages (fr/de/es/it/en)
- robots.txt (bloque `?sort=`, `?filter=`, `?page=`, `/api/`)
- Canonical tags sur toutes les pages
- Redirects SPA (`/*` → `/index.html`)

### Meta & Social
- `useSeoMeta` hook centralisé : title, description, OG, Twitter Cards
- OpenGraph : og:title, og:description, og:image, og:type, og:site_name
- Twitter Cards : summary_large_image
- Images hero générées automatiquement (420 articles × 1360×768)

### Schema.org (données structurées)
- `WebSite` + `SearchAction` (home)
- `ItemList` + `ListItem` (ReviewList, CryptoList)
- `Article` + `BreadcrumbList` (BlogPost)
- `FAQPage` (CardDetail, CryptoPage, ThematicPage)
- `AggregateRating` (CardDetail)
- `ReviewList` (ReviewPage)
- `WebPage` (ComparisonPage, ThematicPage)
- `BreadcrumbList` sur toutes les pages profondes

### Contenu
- 420 articles blog (84 cartes × 5 langues), publiés en base
- 53 articles guides FR sur requêtes précises
- ~30 avis cartes structurés (ReviewPage)
- 10 pages crypto (BTC, ETH, SOL, BNB, XRP, ADA, AVAX, DOGE, USDT, USDC)
- Pages thématiques SEO : cashback, no-kyc, staking, DeFi, sécurité, impôts, Europe, etc.
- Pages A vs B (ComparisonPage) — template créé, contenu statique à étoffer (#67)
- Breadcrumbs visuels sur toutes les pages profondes

### Analytics
- Google Analytics 4 + conversion tracking

---

## 🟡 QUICK WINS (1-2 semaines)

### 4. Contenu ComparisonPage (#67)
Les pages `/fr/comparer/nexo-vs-crypto-com` etc. ont un template mais peu de contenu différencié. Google les voit comme du contenu mince.

**Action** : Pour chaque paire A vs B, écrire 400 mots de contenu unique dans `src/data/comparisonContent.ts` :
- Tableau comparatif (frais, cashback, KYC, cryptos supportées)
- "Pour qui choisir X", "Pour qui choisir Y"
- Verdict avec AggregateRating pour chaque carte
- FAQ spécifique à la comparaison

Priorité : les 20 paires les plus fréquentes (Nexo vs Crypto.com, Wirex vs Bybit, etc.)

### 5. Enrichir les pages thématiques
Les ThematicPages sont bien structurées mais le contenu intro peut être plus long (Google préfère 600+ mots pour les pages de catégorie).

**Action** : Pour chaque thème, ajouter dans `ThematicPage.tsx` une section "Guide rapide" avec 300-400 mots d'intro avant les cartes.

### 6. Ajouter ReviewPage à l'index sitemap
Vérifie que `sitemap-pages.xml` contient les URLs `/fr/avis/[card-slug]` etc.

**Action** : Mettre à jour `generate-sitemap.mjs` pour inclure les routes ReviewPage dans toutes les langues.

### 7. Consolider Layout.tsx / App.tsx (#72)
ReviewList et ReviewPage ne sont peut-être pas dans la nav.

**Action** : Vérifier que "Avis" apparaît dans le menu Guides de `Layout.tsx`.

---

## 🟢 MOYEN TERME (1-2 mois)

### 8. Core Web Vitals

**LCP (Largest Contentful Paint)** — objectif < 2.5s
- Précharger les images hero avec `<link rel="preload">` dans `index.html`
- Utiliser `loading="lazy"` sur toutes les images sous la fold
- Passer les hero images en WebP (économie ~30% de poids)
- Vérifier que Supabase Storage a un CDN activé (sinon activer)

**CLS (Cumulative Layout Shift)** — objectif < 0.1
- Toutes les images doivent avoir `width` et `height` explicites
- Les cartes de carte doivent avoir une hauteur fixe pour éviter le décalage au chargement

**FID/INP (Interaction to Next Paint)** — objectif < 200ms
- Lazy-load les composants lourds (tableau comparatif, simulateur) avec `React.lazy()`
- Vérifier que la liste de cartes principale utilise de la pagination ou du virtual scroll

**Comment mesurer** : Google Search Console → Core Web Vitals → voir les URLs en rouge. Aussi : `lighthouse https://topcryptocards.eu/fr` dans ton terminal.

### 9. Featured Snippets (position zéro)

Pour capter les extraits enrichis Google, les FAQs et définitions doivent être formatées précisément.

**Pages à optimiser en priorité** :
- "Qu'est-ce qu'une carte crypto ?" → répondre en 40-60 mots dans l'intro Home
- "Quelle est la meilleure carte crypto en 2026 ?" → répondre en 2-3 phrases + liste
- "Comment fonctionne le cashback crypto ?" → paragraphe de définition + exemple chiffré
- "Carte crypto sans KYC" → définition + liste des options dans ThematicPage

**Format** : La réponse courte doit être dans le premier paragraphe visible, avant tout sous-titre.

### 10. Maillage interne renforcé

Le script `inject-thematic-links.mjs` existe mais vérifier :
- Chaque article blog renvoie vers la page carte correspondante (CardDetail)
- Chaque CryptoPage renvoie vers les articles blog pertinents
- Chaque ReviewPage renvoie vers la ThematicPage correspondante
- Pages orphelines : vérifier via `scripts/fix-internal-links.mjs`

### 11. Balises title optimisées pour le CTR

Format actuel : `"Carte crypto XYZ | TopCryptoCards"`
Format cible : intégrer la proposition de valeur + l'année.

Exemples :
- ❌ `Nexo Card | TopCryptoCards`
- ✅ `Nexo Card 2026 : jusqu'à 8% cashback, avis et test complet`
- ❌ `Carte crypto cashback | TopCryptoCards`
- ✅ `Meilleures cartes crypto cashback 2026 : comparatif complet`

---

## 🔵 LONG TERME — AUTORITÉ & E-E-A-T (3-6 mois)

### 12. Signaux E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

Google valorise de plus en plus les signaux de confiance pour les sujets YMYL (finance).

**À créer** :
- Page "À propos" avec la méthode d'évaluation des cartes (critères, processus de test)
- Page "Équipe" ou "Auteurs" avec bio + expertise crypto
- Mentions légales complètes (Impressum.tsx existe → vérifier qu'il est complet)
- Politique de divulgation des affiliés renforcée (AffiliateDisclosurePage.tsx → lier depuis chaque avis)
- Date de dernière mise à jour visible sur chaque article et page carte

**Schema.org à ajouter** :
- `Person` ou `Organization` dans le footer
- `dateModified` sur tous les `Article` et `WebPage`

### 13. Stratégie de backlinks

Les backlinks restent le principal facteur d'autorité Google. Cibles prioritaires :

**Backlinks éditoriaux** (valeur maximale) :
- Médias crypto francophones : JournalDuCoin, CryptoFrance, CoinAcademy, BFM Crypto
- Médias finance personnelle : MoneyVox, Le Revenu, Capital — section "paiements crypto"
- Blogs Reddit/Discord francophone crypto : partager les guides dans r/CryptoFR, r/Bitcoin_fr

**Backlinks par contenu** :
- Créer 2-3 études de données originales (ex : "Comparatif des frais de change 2026 sur 84 cartes crypto") → format citable
- Infographies partageables (cashback comparatif visuel, timeline réglementation MiCA)
- Répondre aux journalistes via HARO France / Qwoted

**Backlinks partenariats** :
- Proposer des pages partenaires aux émetteurs de cartes (Nexo, Wirex, Bybit) — lien "Avis indépendant sur TopCryptoCards"
- Annuaires spécialisés crypto : CoinGecko partners, CryptoCompare listings

### 14. Internationalisation renforcée

Tu as 5 langues mais le trafic hors FR reste faible. Pour accélérer DE/ES/IT/EN :

- Vérifier que Google Search Console a des propriétés séparées pour chaque langue
- Créer des pages thématiques équivalentes en DE/ES/IT/EN (actuellement surtout FR)
- Adapter les meta titles aux requêtes locales (ex: "Krypto Kreditkarte Vergleich 2026" en DE)
- Cibler les sous-marchés : Suisse (CH) pour DE, DACH en général, Amérique latine pour ES

---

## 📊 MONITORING (permanent)

### Google Search Console — vérifier chaque semaine
- Couverture d'index : URLs valides vs erreurs
- Performances : CTR, position moyenne, impressions
- Core Web Vitals : URLs en rouge
- Sitemaps : statut soumis

### Rank Tracking — mettre en place
Outils gratuits : Google Search Console (limité). Outils payants recommandés : Semrush, Ahrefs, ou Sistrix (fort sur Europe francophone).

Requêtes prioritaires à suivre :
- "meilleure carte crypto 2026"
- "carte crypto cashback"
- "carte crypto sans KYC"
- "carte crypto Ethereum"
- "carte crypto France"
- "Nexo Card avis"
- "Crypto.com Card avis"
- "carte crypto comparatif"

### Contenu — cadence recommandée
- 2 articles blog FR/semaine (requêtes longue traîne, questions utilisateurs)
- 1 mise à jour d'article existant/semaine (rafraîchir les dates, données 2026)
- 1 nouvelle page thématique/mois

---

## 📋 RÉSUMÉ PRIORISÉ

| Priorité | Action | Impact | Effort |
|----------|--------|--------|--------|
| 🔴 Critique | Fix sitemap-index.xml dans Bolt | Débloquer l'indexation | 5 min |
| 🔴 Critique | Déployer edge function crypto-priority | Images correctes | 2 min |
| 🔴 Critique | Un seul workflow git (terminal uniquement) | Éviter futurs conflits | Décision |
| 🟡 Semaine 1 | Contenu ComparisonPage (#67) | Contenu unique vs thin | 2-3h |
| 🟡 Semaine 1 | ReviewPage dans sitemap | Pages indexées | 30 min |
| 🟡 Semaine 1 | Layout.tsx nav update (#72) | UX + crawlability | 30 min |
| 🟢 Mois 1 | Core Web Vitals (LCP, CLS) | Ranking + UX | 1 jour |
| 🟢 Mois 1 | Featured snippet optimization | Position zéro | 2h |
| 🟢 Mois 1 | Title tags CTR optimization | +20-30% CTR | 2h |
| 🔵 Mois 2 | E-E-A-T (À propos, auteurs, dates) | Confiance Google | 1 semaine |
| 🔵 Mois 3+ | Backlinks éditoriaux | Autorité domaine | Continu |
| 🔵 Mois 3+ | Internationalisation DE/ES/EN | Nouveau trafic | Continu |
