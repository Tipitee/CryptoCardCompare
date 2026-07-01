# Audit Technique — TopCryptoCards — Juillet 2026

> Audit réalisé par inspection du code source + fetch live du site topcryptocards.eu.
> Fixes appliqués en ligne là où c'était possible sans intervention.

---

## ✅ Points solides

| Élément | Statut |
|---------|--------|
| Canonical tags | ✅ `useSeoMeta` gère le canonical sur toutes les 18 pages SEO — URL courante sans query/hash |
| Noindex | ✅ Uniquement sur pages légales (Datenschutz, Privacy, Impressum, AffiliateDisclosure, RiskSummary) — aucune page utile bloquée |
| HTTPS / mixed content | ✅ Aucun `src="http://` en dur dans le code |
| Robots.txt | ✅ Seuls `/admin/`, `/api/`, params `?sort=`/`?filter=`/`?page=` bloqués — propre |
| Code splitting | ✅ Toutes les pages sont lazy-loaded dans App.tsx — excellent temps de chargement initial |
| Lazy loading images | ✅ Blog, BlogPost (RelatedCard), ThematicPage, SmartCardImage — tous corrects |
| Meta descriptions | ✅ Toutes les pages ont une meta description localisée (5 langues) |
| Sitemaps | ✅ 12 sitemaps indexés, 3 300+ URLs totales |
| Hreflang sitemaps | ✅ sitemap-blog.xml : hreflang + x-default correct par groupe d'articles |
| sitemap-thematic.xml | ✅ 55 entrées x-default présentes |
| GA4 | ✅ Déjà installé (G-HGWKLHZTET) dans index.html |
| 404 handling | ✅ SPA fallback Netlify (`_redirects` `/* /index.html 200`) + NotFound component |

---

## 🔴 CRITIQUE — Action requise

### P1 — logo.png = 2,1 MB (performance catastrophique)

**Impact** : LCP, CLS, score PageSpeed mobile — logo utilisé dans la navbar sur toutes les pages  
**Cause** : `/public/logo.png` fait 2,1 Mo — c'est 10-20× trop lourd pour un logo  
**Fix** (à faire dans ton Terminal) :

```bash
# Option 1 — sips (macOS natif, sans installation)
sips -Z 400 public/logo.png --out public/logo-small.png

# Option 2 — si tu as ffmpeg
ffmpeg -i public/logo.png -vf scale=400:-1 public/logo-small.png

# Option 3 — convertir en WebP avec cwebp
cwebp public/logo.png -o public/logo.webp -q 85
```

Ensuite dans `index.html` et `Layout.tsx` remplacer `/logo.png` par `/logo-small.png` (ou `.webp`).  
**Objectif** : < 30 KB.

---

### P2 — Favicon manquant (seulement logo.png référencé)

**Impact** : Onglets navigateur affichent un logo flou 2,1 Mo, pas de favicon.ico standard  
**Actuel** :
```html
<link rel="icon" type="image/png" href="/logo.png" />
<link rel="apple-touch-icon" href="/logo.png" />
```
**Fix** : Générer des favicons avec [realfavicongenerator.net](https://realfavicongenerator.net) → placer `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png` dans `/public/` et mettre à jour `index.html`.

---

### P3 — sitemap.xml = doublon de sitemap-index.xml

**Impact** : Google voit 2 sitemaps index identiques — confusion possible  
**Actuel** : `/public/sitemap.xml` et `/public/sitemap-index.xml` ont un contenu identique  
**Fix** : Supprimer `sitemap.xml` ou le faire rediriger vers `sitemap-index.xml`. Ne soumettre que `sitemap-index.xml` dans GSC.

---

## 🟠 ÉLEVÉ — Améliorations SEO

### P4 — og:image générique sur la majorité des pages

**Impact** : Partage social peu attractif sur Home, Blog, CryptoList, ReviewList, Simulator, Compare, BrandList, ThematicPage  
**Actuel** : Ces pages utilisent toutes `og-default.jpg` (77 KB, image générique)  
**Pages avec og:image perso** : CardDetail (carte), ReviewPage (carte), BrandPage (logo), BlogPost (hero)  
**Fix recommandé** : Créer des og:images thématiques par type de page (ex: une image "Comparer les cartes" pour Compare, une "Meilleures cartes crypto" pour Home, etc.)

### P5 — inLanguage manquant dans plusieurs schemas

**Déjà fixé dans cette session** : BrandPage (ItemList + FAQPage), CardDetail (FinancialProduct), ReviewPage (Review), ComparisonPage (FAQPage).

---

## 🟡 MOYEN — À surveiller

### P6 — PageSpeed Score inconnu

L'API Google PageSpeed Insights n'est pas accessible depuis le sandbox. À tester manuellement :
- [PageSpeed mobile — Homepage](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Ftopcryptocards.eu%2Ffr)
- [PageSpeed mobile — CardDetail](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Ftopcryptocards.eu%2Ffr%2Fcartes%2Fcrypto-com-card-ruby)

**Hypothèse** : score mobile probablement < 60 à cause du logo.png 2,1 Mo. Après fix → devrait monter à 80+.

### P7 — Rich Results Test non automatisable

À vérifier manuellement :
- [Test CardDetail](https://search.google.com/test/rich-results?url=https://topcryptocards.eu/fr/cartes/crypto-com-card-ruby)
- [Test BrandPage](https://search.google.com/test/rich-results?url=https://topcryptocards.eu/fr/marques/crypto-com)
- [Test ThematicPage](https://search.google.com/test/rich-results?url=https://topcryptocards.eu/fr/meilleure-carte-crypto)

---

## 📊 Sitemaps — Inventaire

| Sitemap | URLs | Statut |
|---------|------|--------|
| sitemap-pages.xml | 46 | ✅ |
| sitemap-thematic.xml | 55 | ✅ x-default OK |
| sitemap-blog.xml | 533 | ✅ hreflang OK |
| sitemap-cards-fr/de/es/it/en.xml | 91 × 5 = 455 | ✅ |
| sitemap-compare.xml | 1 725 | ✅ |
| sitemap-cryptos.xml | 55 | ✅ |
| sitemap-reviews.xml | 130 | ✅ |
| sitemap-brands.xml | 80 | ✅ |
| **TOTAL** | **~3 079 URLs** | ✅ |

---

## 🛠️ Schema.org — État final

| Page | Schemas présents | inLanguage |
|------|-----------------|------------|
| Home | WebSite, ItemList, SearchAction | ✅ |
| Blog | CollectionPage | ✅ |
| BlogPost | Article, WebPage | ✅ |
| CardDetail | FinancialProduct, FAQPage | ✅ fixé |
| ThematicPage | FAQPage, ItemList | ✅ |
| CryptoPage | FAQPage, WebPage | ✅ |
| CryptoList | CollectionPage, WebPage | ✅ |
| ComparisonPage | FAQPage | ✅ fixé |
| Compare | WebApplication | ✅ |
| ReviewPage | Review, Product | ✅ fixé |
| ReviewList | ItemList | ✅ |
| BrandPage | ItemList, FAQPage | ✅ fixé |
| BrandList | ItemList | ✅ |
| Simulator | SoftwareApplication | ✅ |
| Recommendation | WebPage | ✅ |

---

## 🚀 Actions restantes (toi)

| # | Action | Effort |
|---|--------|--------|
| 1 | **Optimiser logo.png** → `sips -Z 400 public/logo.png --out public/logo-small.png` + update Layout.tsx + index.html | 10 min |
| 2 | **Générer vrais favicons** sur realfavicongenerator.net | 15 min |
| 3 | **Supprimer sitemap.xml** (doublon) ou vérifier qu'il n'est pas soumis dans GSC | 5 min |
| 4 | **Tester PageSpeed** sur pagespeed.web.dev (mobile + desktop) | 5 min |
| 5 | **Tester Rich Results** sur search.google.com/test/rich-results | 5 min |
| 6 | **Soumettre sitemap-index.xml** dans Google Search Console | 5 min |
| 7 | **Vérifier crawl errors + Core Web Vitals** dans GSC (après déploiement) | ongoing |
| 8 | Lancer `node scripts/generate-review-translations.mjs` | ~10 min |
| 9 | Lancer `node scripts/fix-bybit-placeholders.mjs` | 2 min |
| 10 | Push + deploy Netlify (git push) | 2 min |

---

## Ce qui a été fixé dans cette session

- `inLanguage` ajouté : BrandPage (ItemList + FAQPage), CardDetail (FinancialProduct), ReviewPage (Review), ComparisonPage (FAQPage)
- TypeScript : clean (aucune erreur)
