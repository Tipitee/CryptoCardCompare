# PLAN BOOST — octobre 2026

## Contexte
La récupération post-crash est **confirmée** (GSC 27/10) : octobre = 78 clics / 7 255 impressions, soit ×8 clics et ×5 impressions vs septembre. Le site sort de la pénalité de migration. **168 pages sont en « striking distance » (position 5-20) mais à ~0 clic** → il y a un énorme réservoir de trafic à convertir *sans* attendre l'autorité.

Le plan commence par ce qui rapporte le plus vite (CTR / titres-métas), puis enchaîne par ordre de priorité décroissante en impact/effort.

---

## PHASE 1 — CTR : titres & méta-descriptions (PRIORITÉ, cette semaine)

**Pourquoi d'abord :** ces pages rankent déjà en page 1-2. Réécrire leur `<title>` et `meta description` capte des clics sur des positions **déjà acquises** — effet en 1-2 semaines, zéro dépendance aux backlinks.

### Les 25 plus gros gisements (pos 5-20, triés par impressions, ~0 clic)

| Impr | Pos | Page | Cluster |
|-----:|----:|------|---------|
| 443 | 8.6 | /en/cards/kardpay-card | Carte |
| 353 | 13.3 | /en/reviews/kraken-card | **Kraken** |
| 324 | 19.9 | /en/crypto-card-no-fees (12 clics ✓) | Thématique |
| 273 | 8.9 | /en/cards/kraken-krak-card | **Kraken** |
| 227 | 10.7 | /en/brands/kraken | **Kraken** |
| 135 | 15.8 | /en/cards/avalanche-card | Carte |
| 122 | 18.0 | /en/brands/crypto-com | **Crypto.com** |
| 118 | 11.5 | /en/cards/crypto-com-midnight-blue | **Crypto.com** |
| 112 | 18.8 | /en/cards/kast-card | Carte |
| 106 | 15.9 | /de/karten/kraken-krak-card | **Kraken** |
| 104 | 9.8 | /en/cards/crypto-com-jade-green | **Crypto.com** |
| 102 | 9.2 | /en/cards/tria-card | Carte |
| 86 | 13.7 | /en/cards/uphold-card | Carte |
| 83 | 17.8 | /en/blog/best-crypto-card-digital-nomads-expats-2026 | Blog |
| 68 | 7.1 | /en/cards/solid-card (3 clics ✓) | Carte |
| 58 | 7.2 | /en/brands/deblock | Marque |
| 51 | 13.4 | /en/cards/crypto-com-ruby-steel | **Crypto.com** |
| 51 | 16.4 | /en/cards/gnosis-pay-card | Carte |
| 49 | 9.0 | /en/blog/crypto-card-atm-withdrawal-2026 | Blog |
| 48 | 14.3 | /es/tarjetas/kraken-krak-card | **Kraken** |
| 41 | 8.4 | /es/blog/tarjeta-binance-europa-fin-alternativas | Blog ES |
| 41 | 10.9 | /en/blog/crypto-card-with-no-annual-fees-our-2026-selection | Blog |
| 40 | 18.0 | /en/blog/best-crypto-cards-high-cashback-2026-comparison | Blog |
| 39 | 9.6 | /en/cards/deblock-card | Carte |
| 38 | 9.4 | /es/tarjetas/bleap-crypto-card | Carte ES |

(Liste complète : 168 pages — export GSC Pages.csv, filtre position 5-20.)

### Diagnostic du « 0 clic »
À position 8-16 avec des centaines d'impressions mais 0 clic, le problème est **le snippet** (title + description) qui ne se démarque pas des concurrents, OU des requêtes de marque où le site officiel capte le clic. Levier : titres orientés bénéfice + chiffre + différenciateur + année.

### Formule gagnante par type de page

**Fiches cartes** (`article.meta_title` Supabase, sinon `TITLE_TPL` dans `CardDetail.tsx`)
- Avec cashback réel : `[Carte] : [X]% cashback, [gratuite/Y€], [atout] — Avis 2026`
- Sans cashback / 0% base (honnête mais cliquable) : `[Carte] : frais, limites et pour qui ? — Avis 2026`
- Ex. kardpay : `Kardpay Card : frais, cashback réel et verdict — Avis 2026` (au lieu d'un titre générique).

**Avis** (`cardReviewsI18n.metaTitle` / `cardReviews.metaTitle`)
- `[Carte] Avis 2026 : cashback réel, frais et pour qui ? | TopCryptoCards`

**Marques** (`brandConfig.seo.title`)
- `Cartes [Marque] 2026 : toutes les cartes comparées, frais & cashback`

**Thématiques** (`ThematicPage`)
- Déjà orientées réponse directe ; ajouter le chiffre gagnant dans le title (ex. no-fees : `Cartes crypto sans frais 2026 : 12 cartes 0€ comparées`).

**Blog** (`blog_posts.title` Supabase)
- Garder le mot-clé en tête + année + angle (ex. « digital nomads » : `Meilleure carte crypto nomade 2026 : 0% de frais à l'étranger`).

### Méta-descriptions
Formule : **hook chiffré + indépendance + CTA**. Ex. : « Cashback réel, frais annuels et disponibilité de [X] cartes, vérifiés à la main. Comparatif indépendant. »

### Qui fait quoi
- **Moi (code) :** réécrire `TITLE_TPL` + `brandConfig.seo.title` + `cardReviewsI18n/cardReviews.metaTitle` des pages prioritaires, et améliorer le **prompt meta_title** du générateur de fiches (puis tu régénères).
- **Toi :** régénérer les fiches (`generate-card-reviews.mjs`) après màj du prompt ; pour le blog, ajuster les titres dans Supabase.
- **Mesure :** re-check CTR dans GSC à J+14.

---

## PHASE 2 — Cluster Kraken (le plus gros gisement unique)
`/en/reviews/kraken-card` (353) + `/en/cards/kraken-krak-card` (273) + `/en/brands/kraken` (227) + versions de/es/fr ≈ **1 000+ impressions à pos 8-16, ~0 clic**.
- Titres/métas dédiés orientés « Krak Card » (requête réelle), FAQ enrichie (déjà fait en partie).
- Vérifier qu'il n'y a pas de cannibalisation entre `/reviews/kraken-card` (ancien slug ?) et `/cards/kraken-krak-card` : canonical + maillage vers une seule page cible.
- Maillage interne : depuis les money-pages EN vers la Krak Card.

---

## PHASE 3 — Marché ES sous-exploité
ES = **976 impressions, position 25, CTR 1 %** (2e marché en impressions, le pire en position). Fort potentiel.
- Prioriser l'optimisation titres/métas ES (déjà des pages en striking distance : /es/tarjetas/bleap, /es/blog/tarjeta-binance-europa…).
- Renforcer le maillage interne ES et 2-3 contenus money ES ciblés sur les requêtes qui impriment déjà.

---

## PHASE 4 — Nettoyage qualité contenu (aide aussi la dedup)
Supprimer/mettre à jour les mentions de **cartes abandonnées ou inexistantes** encore indexées et qui impriment (`/en/reviews/kraken-card` ancien slug, `kucard`, `young-platform-card`, `wirex-card`, `coinbase-card`, `binance-card`, `revolut-card`) : soit rediriger vers la carte réelle, soit noindex propre. Réduit le « Duplicate canonical » (273) et la confusion.

---

## PHASE 5 — Maillage interne vers les pages striking-distance
Depuis les pages qui rankent (money-pages, home, blog performants) vers les 168 pages pos 5-20, avec ancres riches. Pousse 2-3 positions → fait passer de la page 2 à la page 1.

---

## PHASE 6 — Autorité / outreach (le plafond, long terme)
Pour les têtes de requête (« crypto card » pos 76, « crypto card for travel » pos 61), seul l'**autorité externe** débloquera. Exécuter le kit existant (`EMAILS-OUTREACH.md`, étude 95 cartes) + Reddit/Trustpilot déjà lancés. Rituel hebdo.

---

## PHASE 7 — Mesure
Re-check GSC à J+14 puis J+30 : CTR des pages Phase 1, positions ES, validations 404/soft/redirect passées, nombre de pages indexées. Logger dans `seo/ai-visibility/`.

---

## Ordre d'exécution résumé
1. **Phase 1 (CTR titres/métas)** — moi en code cette semaine, impact rapide.
2. **Phase 2 (Kraken)** — dans la foulée.
3. **Phase 3 (ES)** + **Phase 5 (maillage)** — semaine suivante.
4. **Phase 4 (nettoyage cartes abandonnées)** — en parallèle.
5. **Phase 6 (outreach)** — continu, côté toi.
6. **Phase 7 (mesure)** — J+14 / J+30.
