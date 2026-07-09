# Audit v5 — SEO, Qualité, Accessibilité, Localisation
## Plan d'action détaillé — topcryptocards.eu

**Date :** 6 juillet 2026 · Vérifié en direct (HTTP brut + rendu), code source, base Supabase. 7 marchés : FR, BE, DE, AT, ES, IT, EN.

---

## ✅ Ce qui est maintenant en production (énorme progrès)

Le déploiement GitHub Actions est passé — vérifié aujourd'hui :

- **Prerender actif** : `/fr` brut = 180 Ko de HTML localisé complet (title, meta, canonical, JSON-LD, contenu) — fini la coquille vide
- **Vrais 404** : les URLs invalides renvoient HTTP 404
- **Redirection racine serveur** : `/` → `/fr` (302, règles forcées)
- **Badge bolt.new supprimé**, sitemap-compare allégé (1 736 → 122), `rel="sponsored"` présent sur les fiches cartes
- **hreflang 7 marchés correct** : `fr`, `fr-BE`, `de`, `de-AT`, `es`, `it`, `en-GB`, x-default — mapping BCP 47 propre
- **Hook `useHreflang` consolidé**, page 404 localisée dans le code, fichiers i18n JSON **100 % complets** (331+88+41 clés × 5 langues, zéro clé manquante)
- **Accessibilité structurelle solide** : 0 image sans alt, 0 bouton/lien sans nom accessible, hiérarchie de titres correcte, landmarks présents, 0 tabindex positif, noopener partout, dimensions d'images définies, lazy loading
- Console sans erreur, FAQ des 30 paires A-vs-B traduites ×5 langues

**Score santé : 72/100** (54 au dernier audit). Le reste ci-dessous.

---

## 🔴 P0 — Bugs de localisation découverts (corriger cette semaine)

### L1. `<html lang="be">` et `lang="at"` — codes invalides
Vérifié en prod : les pages BE/AT déclarent `lang="be"` (= biélorusse !) et `lang="at"` (n'existe pas). Google et les lecteurs d'écran s'y fient.
**Fix :** `Layout.tsx:136` — remplacer `document.documentElement.lang = lang` par le mapping BCP 47 déjà présent dans `useHreflang.ts` (`be`→`fr-BE`, `at`→`de-AT`, `en`→`en-GB`). 15 min.

### L2. Fiches cartes BE/AT en anglais
`/be/cartes/nexo-card` affiche « Nexo Card — Review 2026 » (fallback EN) alors que `/fr/cartes/nexo-card` = « Nexo Card Avis 2026… » et la home `/be` est bien en français. ~180 fiches × 2 marchés concernées.
**Fix :** dans le template de title/contenu de `CardDetail.tsx` (et probablement `cardContent.ts`), les switch sur `lang` n'ont pas de cas `be`/`at` → tombent sur `default: en`. Normaliser en amont : `const contentLang = {be:'fr', at:'de'}[lang] ?? lang`. Vérifier tous les fichiers avec un switch/objet par langue : `grep -rn "lang ===" src | grep -v "be\|at"`. 1–2 h.

### L3. Liens de navigation vers /be/blog et /at/blog → 404
La home BE contient 4 liens vers `/be/blog`, qui renvoie 404 (aucun article be/at n'existe — le blog est en 5 langues). Les visiteurs ET les crawlers du marché belge tombent sur des 404 depuis le menu principal.
**Fix (choisir) :**
- *Option A (recommandée, 2 h)* : route `/be/blog` → afficher les articles FR avec `canonical` vers `/fr/blog/...` (et `/at/blog` → DE). Zéro contenu dupliqué indexé, UX complète.
- *Option B (30 min)* : masquer Blog dans la nav pour be/at.

### L4. hreflang pointant vers des 404 (reviews BE/AT)
`sitemap-reviews.xml` référence `fr-BE → /be/avis/crypto-com-card` en alternate, mais cette URL renvoie **404 en prod** (pas encore prérendue — ajoutée après le dernier déploiement). Un cluster hreflang avec un membre 404 est ignoré par Google.
**Fix :** redéployer (le prerender les créera si elles sont en `<loc>`), puis vérifier : `curl -o /dev/null -w "%{http_code}" https://topcryptocards.eu/be/avis/crypto-com-card`. Si toujours 404 : les URLs be/at reviews sont en alternate sans être en loc → soit les ajouter en loc, soit les retirer des alternates. 30 min + déploiement.

### L5. 404.html cassé (contenu mi-home FR/EN)
La page 404 servie contient le title de la home FR + un H1 anglais tronqué (« The  ») — le prerender a photographié la home en cours de redirection au lieu de la page « introuvable » (l'URL de test `/definitely-not-a-real-page-404` n'a pas de préfixe langue → redirection pendant le rendu).
**Fix :** `scripts/prerender.mjs` — rendre `/fr/page-inexistante-xyz-404` à la place. 5 min + déploiement.

### L6. Thème IBAN : sections ES/IT manquantes
`THEME_SECTIONS.iban` (ThematicPage.tsx ~ligne 673) n'a que fr/de/en. Résultat vérifié : `/es/tarjeta-crypto-con-iban` = 4 h2 vs 5 en FR — contenu éditorial absent sur 2 marchés d'une page sitemappée.
**Fix :** ajouter les tableaux `es:` et `it:`. 1 h.

### L7. Base de contenu — retards connus
- `sitemap-blog.xml` : 533 URLs vs **543 posts** en base → `node scripts/gen-blog-sitemap.mjs` + l'intégrer au build
- 3 topics reviews (Gnosis Pay, Brighty, MetaMask) uniquement DE+EN → traduire FR/ES/IT (`translate-missing-articles.mjs`)
- 2 posts orphelins (1 ES, 1 IT) sans variantes → compléter ou fusionner
- **39 excerpts FR faibles/manquants** (= meta descriptions) → réécrire 140–155 caractères

---

## 🟠 P1 — Accessibilité (1–2 semaines)

État : structure excellente (voir ✅), il reste 4 chantiers ciblés :

| # | Problème | Détail vérifié | Fix | Effort |
|---|---|---|---|---|
| A1 | **Pas de skip-link** | Aucun `a[href="#main"]` — les utilisateurs clavier traversent toute la nav sur chaque page | `<a href="#main" class="sr-only focus:not-sr-only …">Aller au contenu</a>` en premier enfant du body, `id="main"` sur `<main>`, libellé traduit ×7 | 1 h |
| A2 | **Contrastes texte** | 57/297 échantillons sous le seuil sur la home. Réels : sous-titres gris (~4.0:1 vs 4.5 requis). Les mesures 1.0:1 (chips « Toutes », badges) = probablement faux positifs d'overlay — à confirmer | Auditer les tokens Tailwind `text-gray-400/500` sur fond sombre → passer un cran plus clair ; vérifier chips/badges avec Lighthouse (onglet Accessibility) | 2–3 h |
| A3 | **Focus non visible** | `outline: none` détecté sur les liens au focus programmatique | Ajouter un style global `:focus-visible { outline: 2px solid <accent>; outline-offset: 2px }` — ne pas laisser Tailwind reset sans remplacement | 30 min |
| A4 | **lang invalide be/at** | = L1 (impacte aussi les lecteurs d'écran) | voir L1 | — |

Bonus recommandé : `prefers-reduced-motion` sur les animations, et tester la navigation complète au clavier sur le simulateur/quiz (composants interactifs = risque principal restant).

---

## 🟡 P1 — Qualité & Performance (1–2 semaines)

| # | Point | État vérifié | Action |
|---|---|---|---|
| Q1 | GA4 en `<head>` | Charge tôt, concurrence le LCP | Charger gtag après `window.load` |
| Q2 | Code splitting | `manualChunks` est dans vite.config — **vérifier qu'ils sont bien servis en prod** après le dernier déploiement (avant : bundle unique 400 Ko) | `curl -s https://topcryptocards.eu/fr \| grep -o 'assets/[a-z-]*-[A-Za-z0-9_]*\.js'` — on doit voir vendor-react, vendor-charts, etc. |
| Q3 | Fraîcheur du prerender | Contenu Supabase figé entre déploiements | Le cron nightly du workflow y répond ✓ — vérifier qu'il tourne (onglet Actions) |
| Q4 | Pages légales | `/impressum`, `/datenschutz`, `/privacy` non localisées, hors arbre de langues | Suivre le modèle AffiliateDisclosurePage (déjà ×5) — 3 h |

---

## 🔵 P2 — SEO contenu & autorité (30–90 jours)

*(Détails complets dans SEO-AUDIT-V4 — rappel des chantiers avec chiffres re-validés)*

1. **Profondeur des money pages** — 55 % des 543 posts < 500 mots (FR 56/113, EN 63/109, DE 64/109, ES 58/106, IT 58/106). Top 30 topics → 1 200+ mots ×5 langues avec preuves de première main (photos cartes, relevés, « vérifié juillet 2026 »). C'est LE levier restant.
2. **Blocs « faits clés » GEO** sur reviews/thématiques : tableau HTML frais d'émission / frais FX / cashback / staking / dispo par pays — ce que les IA citent. Maintenant visible par GPTBot & co grâce au prerender.
3. **Hubs de catégories blog** ×7 marchés (profondeur de crawl ≤ 3, articles anciens à 5+ clics aujourd'hui).
4. **Cannibalisation** : `best-crypto-card-2026` vs `best-crypto-card` (×5 langues) → différencier l'intention ou canoniser.
5. **Autorité** : publier le « Fee Index » mensuel (agrégé depuis Supabase) + exécuter les drafts bitcointalk/Medium déjà dans le repo + HARO FR/EN. Objectif : 15 domaines référents à J90.
6. **BE/AT à finir proprement** : après L1–L4, envisager du contenu spécifique marché (fiscalité belge/autrichienne des cartes crypto = requêtes locales sans concurrence).

---

## 📋 Récapitulatif ordonné (checklist exécutable)

**Semaine 1 (bugs + redéploiement) :**
1. ☐ L1 — lang BCP 47 dans Layout.tsx (15 min)
2. ☐ L2 — fallback fr/de pour be/at sur CardDetail + grep global (2 h)
3. ☐ L5 — URL de test 404 avec préfixe langue dans prerender.mjs (5 min)
4. ☐ L3 — blog be/at (option A ou B) (2 h)
5. ☐ L6 — sections iban es/it (1 h)
6. ☐ L7 — régénérer sitemap-blog + traductions manquantes (3 h)
7. ☐ `npx tsc --noEmit` → 0 erreur → commit → push → **vérifier le run Actions** → re-tester L1–L5 en prod (commandes curl dans ce doc)
8. ☐ GSC : inspecter 1 URL par marché (7) + soumettre sitemap ; Bing WMT : idem

**Semaines 2–3 (a11y + qualité) :**
9. ☐ A1 skip-link ×7 · A2 contrastes · A3 focus-visible (1 j)
10. ☐ Q1 GA defer · Q2 vérifier chunks · Q4 pages légales (1 j)
11. ☐ 39 excerpts FR (2 h)

**Jours 30–90 (croissance) :**
12. ☐ 2 money pages approfondies / semaine ×5 langues
13. ☐ Blocs faits clés sur les 15 reviews principales
14. ☐ Hubs catégories + fix cannibalisation 2026
15. ☐ Fee Index v1 + première vague d'outreach
16. ☐ Mesure mensuelle : indexation GSC/Bing par marché, citations IA (10 requêtes test Perplexity/AIO), CWV lab (PSI avec clé API)

**KPIs J90 :** 1 000+ pages indexées Google · 500+ Bing · 0 hreflang vers 404 · Lighthouse Accessibility ≥ 95 · 15 domaines référents · ≥ 3 citations IA sur le set de test.

---

*Méthodo : chaque constat vérifié directement (curl HTTP brut, DOM rendu, requêtes Supabase, grep du code). Les bugs L1–L6 sont nouveaux depuis l'expansion BE/AT + thème IBAN (commits f905296, 2a47b16) — c'est la rançon d'une expansion rapide, rien de structurel.*
