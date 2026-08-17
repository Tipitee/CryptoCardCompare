# Ajouter BingX au site — inventaire complet

*Recherche août 2026. À lire avant toute insertion : la partie réglementaire change la façon de lister la carte.*

## 0. Décision préalable — statut réglementaire (important)

BingX **n'est pas conforme MiCA** : absente du registre CASP de l'ESMA (au 9/07/2026), donc **non autorisée à opérer dans l'UE/EEE**. Concrètement :

- **UK** : exclue (pas de licence FCA). → marché `en` : **non disponible**.
- **Espagne** : signalée par la CNMV. → `es` : **à risque / non recommandé**.
- **Pays-Bas** : restreinte (hors marchés, mais indicatif).
- **France (AMF), Italie (CONSOB), Allemagne/Autriche (BaFin/FMA)** : aucune autorisation ni enregistrement. Disponibilité **incertaine**, susceptible de changer.

**Recommandation** : on PEUT la référencer (le site liste bien des cartes discontinuées comme Binance, par honnêteté et intention de recherche), mais **de façon prudente** :
- `available_eu = false` (ou `true` uniquement là où c'est vérifié), `available_france` à vérifier.
- `trust_score` **bas** (ordre de 20-30/100) — pas de licence = faible fiabilité.
- Une `market_restrictions` par marché expliquant l'absence de licence MiCA/FCA.
- Ne PAS mettre de badge « recommandé » ni la classer haut dans les thématiques.

Cela protège l'E-E-A-T du site (tu ne mens pas sur la dispo) tout en captant les requêtes « bingx card ».

---

## 1. Les 2 fiches à créer (specs vérifiées)

| Champ | BingX Virtual Card | BingX Metal Card |
|---|---|---|
| `name` | BingX Virtual Card | BingX Metal Card |
| `cashback_base` / `cashback_no_staking` | 2 | 5 |
| `cashback_premium` | 2 (plafond ~50$/mois) | 6 (bonus pré-lancement ; plafond ~120$/mois) |
| `staking_required` | false | false |
| `card_network` | Mastercard | Mastercard |
| `annual_fees` | 0 (mais **1€/mois** de maintenance) | 0 (idem 1€/mois) |
| `virtual_only` | true | false (physique métal) |
| `status` | active (coming_soon si pré-lancement dans ton marché) | active |
| `issuer` | BingX (Mastercard) | BingX (Mastercard) |
| `brand_id` | bingx | bingx |

**Frais à documenter dans la fiche/avis** : 1€/mois maintenance, 1% dépôt, **0% FX dans l'EEE** / 2% hors EEE (min 0,60€), 1,50% de frais d'achat carte pour les cartes EEE. Cashback crédité instantanément, sans staking (le staking BingX = « BingX Wealth », un produit séparé, à ne pas confondre).

**Nuance réseau** : version **Visa émise par Wirex** en plus de la Mastercard. Si tu veux être précis, mentionne-le dans l'avis plutôt que de créer une 3e fiche.

**Couleurs suggérées** (`color_primary` / `color_secondary`) : bleu BingX (#2354E6 / #0A1F44) — à ajuster.

---

## 2. Disponibilité par marché (à renseigner)

| Marché | URL préfixe | Dispo réelle | Reco `market_restrictions` |
|---|---|---|---|
| 🇫🇷 fr | /fr | Incertaine (pas d'autorisation AMF) | « BingX n'est pas enregistrée auprès de l'AMF ni autorisée MiCA ; disponibilité non garantie. » |
| 🇧🇪 be | /be | Incertaine (FSMA) | idem, adapté FSMA |
| 🇩🇪 de | /de | Incertaine (BaFin) | idem, BaFin |
| 🇦🇹 at | /at | Incertaine (FMA) | idem, FMA |
| 🇪🇸 es | /es | **À risque** (CNMV a signalé) | « Signalée par la CNMV — à éviter » |
| 🇮🇹 it | /it | Incertaine (CONSOB) | idem, CONSOB |
| 🇬🇧 en | /en | **Non disponible** (pas FCA) | « Non disponible au Royaume-Uni (absence d'autorisation FCA) » |

Utilise `market_overrides` si le cashback/dispo diffère par marché (le système existe déjà).

---

## 3. Carte complète des points d'intégration

### A. Automatique — une seule ligne DB par fiche remplit tout ça
En insérant les 2 lignes dans la table **`cards`** (Supabase), ces pages se peuplent seules :

1. **Accueil** `/{marché}` — apparition dans la grille + filtres (×7 marchés).
2. **Fiche carte** `/{m}/cartes|karten|tarjetas|carte|cards/bingx-virtual-card` et `…/bingx-metal-card` (×7 chacune = **14 pages**).
3. **Pages thématiques** où elle qualifie (cashback, sans-staking, virtuelle pour la Virtual, physique pour la Metal, récompenses, 2026, voyage…) — filtrage auto sur les champs.
4. **Comparateur** `/{m}/comparer` — sélectionnable.
5. **Index des frais** `/{m}/frais-cartes-crypto` (& équivalents).
6. **llms-full.txt** + **schema Dataset** — régénérés au build.
7. **Sitemaps cartes** `sitemap-cards-{m}.xml` — après régénération (`scripts/gen-card-sitemaps.mjs`).

### B. Manuel — à ajouter dans le code/contenu

8. **Marque** — nouvelle entrée `bingx` dans `src/data/brandConfig.ts` → page marque `/{m}/marques/bingx` (×7) + copie SEO par langue. Ajouter aussi au **footer** (liste marques) et à **`AutoLinker.tsx`** (reconnaissance du nom « BingX »).
9. **Avis** — `src/data/cardReviews.ts` + `src/data/cardReviewsI18n.ts` → page avis `/{m}/avis|bewertungen|opiniones|recensioni|reviews/bingx-*-card` (×7 par fiche). Points forts / faibles / verdict par langue.
10. **Page alternatives** — si tu ajoutes `bingx` à `ALT_BRANDS` (`src/data/alternativesContent.ts`) → `/{m}/alternatives-bingx` (×7).
11. **Comparatifs A vs B** — copie éditoriale dans `src/data/comparisonContent.ts` (ex. BingX vs Bybit) + ajout des paires à `scripts/comparison-allowlist.json` pour les rendre indexables + régé `sitemap-compare`.
12. **Image + couleurs** — uploader `real_card_image` dans le bucket Supabase `card-images`, définir `color_primary`/`color_secondary`.
13. **Article de blog** (optionnel, money page) — « BingX Card : avis 2026 » par marché, ciblant « bingx card » (demande réelle) — avec l'angle réglementaire comme différenciateur.
14. **Agent A13** — ajouter BingX à `seo/state/card-freshness-rotation.json` pour le suivi hebdo.

### Récap volume de pages générées
- **14 fiches** (2 cartes × 7 marchés) + **7 pages marque** + **14 pages avis** + **7 pages alternatives** + présence dans ~5 thématiques × 7 marchés + comparatifs. Soit **~45-60 URLs** nouvelles, la plupart automatiques dès l'insert DB.

---

## 4. Ordre recommandé

1. **Valider la ligne éditoriale** (compte tenu du statut réglementaire : liste-t-on prudemment, ou pas du tout ?).
2. Récupérer/uploader l'**image** des 2 cartes.
3. **Insérer les 2 lignes `cards`** (script dédié, dry-run → confirm) avec dispo/trust/restrictions prudents.
4. Ajouter la **marque** (brandConfig) + **AutoLinker** + footer.
5. Rédiger les **2 avis** (cardReviews) — avec l'angle « pas de licence MiCA ».
6. Régénérer **sitemaps cartes** + (option) allowlist/comparatifs.
7. Build + vérif live d'une fiche + la page marque.
8. (Option) article de blog « avis BingX » par marché.

Quand tu veux, je te prépare le **script d'insertion des 2 fiches** + l'entrée marque + les 2 avis, dès que tu m'as confirmé la ligne éditoriale et fourni l'image.
