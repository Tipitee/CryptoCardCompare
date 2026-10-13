# Audit qualité TopCryptoCards — 13 oct. 2026
Axes : contenu, données cartes, localisation, accessibilité, fraîcheur. Priorités P0 (crédibilité/risque) → P2.

---

## 1. Contenu des fiches cartes — ⚠️ P0 (le point le plus important)

Les sections des fiches cartes (« Cashback & Rewards », « Fees & Conditions », « Regulation & Security », « Our verdict ») viennent d'**articles générés par IA stockés en Supabase** (`blog_posts`, un par carte × langue, rendus via `article.content`). Sur les cartes sans avis éditorial (54 des 80), ces articles **sur-vendent et contiennent des inexactitudes**. Exemple réel, `/en/cards/kardpay-card` (base 0 % cashback) :

- « You're **profitable from the very first euro** spent » → **faux** : la base est 0 %.
- FAQ : « provides an **8% cashback rate** on eligible purchases » → survend le **maximum conditionnel** comme s'il était le taux réel.
- Verdict : « an excellent choice… **Highly recommended** for 2026 » → recommandation systématique, non crédible, **casse le positionnement comparateur indépendant** (E-E-A-T).
- Régulation : « basic registration regulated operator. Founded in 2022, the company has **significant industry experience** » (contradiction) + « verify the issuer's **FCA registration** » alors que Kardpay FZCO est un émetteur de **Dubaï** (pas FCA).

**Pourquoi c'est P0** : en niche YMYL (finance), Google et les utilisateurs pénalisent la survente et l'imprécision. C'est aussi un risque de conformité (claims trompeurs sur un produit financier). À l'inverse, le **générateur FR dans `src/utils/cardContent.ts` est honnête** (il distingue base/premium/staking : « cashback de X% réservé aux utilisateurs ayant staké… sans staking, pas de remboursement »). Le problème est dans les **articles Supabase**, pas dans ce util.

**Action** : régénérer les articles de fiches cartes avec un template honnête (ou corriger le script `scripts/generate-card-reviews.mjs` qui les a produits) :
- cashback = « jusqu'à X% (base Y%, premium sous conditions) », jamais « 8% » sec si base 0 % ;
- supprimer « profitable dès le premier euro » quand base = 0 % ;
- verdict nuancé par profil, pas « highly recommended » partout ;
- régulation factuelle (juridiction réelle de l'émetteur, pas de renvoi FCA générique).

## 2. Données cartes — ⚠️ P1

- **80 cartes, 37 à 0 % cashback.** Ces fiches restent indexées (elles captent du long-tail de marque, cf. audit GSC), mais leur donnée est pauvre. Pour chacune : vérifier qu'au moins l'émetteur, la juridiction, le réseau, la dispo et les frais réels sont exacts.
- **Couverture avis éditoriaux : 26/80.** Les 54 autres ne reposent que sur l'article généré (cf. P0). Prioriser un vrai avis court sur les cartes qui montrent des impressions GSC (kardpay, avalanche, kast, solid, uphold…).
- Champ « cashback premium » parfois trompeur (max conditionnel affiché comme taux) — à refléter honnêtement partout (fiches + tableaux + titres).

## 3. Localisation (i18n) — ✅ bon, 1 trou

- ✅ Locales complètes et équilibrées : **460 clés × 6 langues** (be→fr, at→de par alias, par design).
- ✅ `<html lang>` synchronisé par marché via `Layout.tsx` (mapping BCP 47).
- ✅ Aucune chaîne FR en dur détectée dans les composants.
- ⚠️ **P1 — l'avis `gate-card` n'est pas traduit** : pas d'entrée `gate-card__en/de/es/it/pt` dans `cardReviewsI18n.ts` (25 traduits sur 26). Résultat : la page avis Gate affiche le **texte FR** sur /en, /de, /es, /it, /pt. Traduire les 5 langues.

## 4. Accessibilité — ⚠️ P2

- ✅ Peu d'`<img>` sans `alt`, `alt=""` uniquement décoratif, `html lang` correct.
- ⚠️ ~39 `<button>` sans `aria-label` (vs 18 avec). La majorité sont dans l'**admin** (non indexé), mais vérifier les boutons **icône publics** (favori ★, sélecteur de pays, fermeture de modale) → ajouter `aria-label`.
- ⚠️ À valider par un **Lighthouse a11y** (thème sombre) : contraste des textes secondaires (`text-slate-400/500` sur fond sombre), visibilité du focus clavier, ordre des titres (un seul `<h1>` par page). Non vérifiable en statique — lancer Lighthouse sur home + fiche + money-page.

## 5. Contenu éditorial / blog — ⚠️ P1

- **523 URLs blog**, dont une part < 500 mots (désormais noindex auto). Refresh ciblé des articles proches du top 10 (voir annexe GSC de l'audit technique) plutôt que du neuf.
- Money-pages « best » et « rewards » déjà passées en **réponse directe** (fait cette semaine).
- Cluster Krak/Kraken enrichi EN+DE (fait).

## 6. Fraîcheur / cohérence — ✅

- Dates « vérifié [mois] 2026 » présentes sur les pages clés.
- `llms-full.txt` régénéré au déploiement (nocturne). Vérifier que le cron tourne.

---

## Priorités d'exécution

1. **P0 — Assainir les articles de fiches cartes** (survente + inexactitudes). Le plus gros risque crédibilité/YMYL. → corriger le générateur + régénérer, ou script de nettoyage.
2. **P1 — Traduire l'avis `gate-card`** (EN/DE/ES/IT/PT).
3. **P1 — Avis courts sur les cartes à impressions GSC** sans avis (kardpay, avalanche, kast, solid, uphold).
4. **P1 — Refresh blog** des articles striking-distance < 500 mots.
5. **P2 — a11y** : `aria-label` boutons icône publics + passe Lighthouse.
