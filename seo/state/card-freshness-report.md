# A13 — Rapport fraîcheur cartes · 2026-08-15

Lot vérifié (8, les + anciens/nulls) : Bybit, Crypto.com Visa, Binance, Nexo, Ether.Fi Cash, Revolut Metal, Young Platform, Trade Republic.
Écarts : **1 ARRÊTÉ**, **2 CHANGÉ**, 1 flag INCERTAIN (Nexo), 2 non vérifiables (fiche hors provenance). Source « site » = fiche live `/en/cards/<slug>` (fallback review page si fiche blanche).

| Carte | Champ | Fiche live dit | Réalité (source) | Statut | Marché |
|---|---|---|---|---|---|
| Binance Card | statut | fiche blanche mais **review page active** « up to 8% BNB, Visa, EU+UK incl. FR » | Carte EEE **arrêtée 20/12/2023** ; Binance a stoppé ses services EEE le 01/07/2026 (financemagnates, binance) | **ARRÊTÉ** | EEE/UK |
| Bybit Card | card_network | **Visa** | **Mastercard** (cryptoslate, bybit wiki ; llms+review disent aussi Mastercard) | **CHANGÉ** | tous |
| Bybit Card | cashback_base | 2 % | base UE = 1 % illimité, paliers 2–10 % (cryptonomist 06/2026) — ambigu | INCERTAIN | UE |
| Bybit Card | dispo France | non dispo FR | sources contradictoires (EEE incl. FR vs excl. FR) | INCERTAIN | fr |
| Trade Republic | cashback_premium | 1 % | **2 % en payant en crypto** (investingintheweb ; review du site dit aussi 2 %) | **CHANGÉ** | tous |
| Nexo Card | cashback_premium | 0 % (base 0,5 %) | jusqu'à 2 % (Platinum) — la review du site dit « max 2% » | INCERTAIN* | UE |
| Crypto.com Visa | cashback max | up to 5 % (Obsidian) | max 5 % Obsidian toujours valable ; dérive paliers (Ruby 1→2 %) | OK | tous |
| Nexo Card | réseau/dispo/virtuelle | Mastercard, virtuelle, UE+FR, UK cashback désactivé | conforme (défycard, kkinvesting) | OK | tous |
| Ether.Fi Cash | (fiche hors provenance) | llms : 3 %, Visa, €0, 7 marchés | 3 % (1er $2k), Visa, non-custodial, UE ; UK après FCA 09/2026 | OK (via llms) | UK pending |
| Revolut (Crypto Card) | annual_fees / cashback | €0 Standard, pas de cashback crypto, Visa | conforme (fiche = carte gratuite, pas la Metal) | OK | tous |
| Young Platform | (fiche hors provenance) | absent de llms-full.txt | Visa, sans frais, cashback 0,1–3,6 % par palier, MiCA en attente | INCERTAIN | it/UE |

\*Nexo : incohérence interne (fiche numérique premium 0 % vs « max 2 % » affiché ailleurs) — à clarifier côté colonnes, hors JSON.

## À corriger cette semaine (par trafic)
1. **Binance Card — ARRÊTÉ** : produit mort depuis 12/2023, mais la review page le présente encore comme actif (8% BNB). Marque à fort trafic → risque désinformation + SEO. Passer `status=discontinued` et dé-lister/retirer la review.
2. **Bybit Card — réseau Visa→Mastercard** : la fiche/DB dit Visa alors que la réalité (et llms + review) = Mastercard. Corriger `card_network`.
3. **Trade Republic — cashback_premium 1→2 %** : 2 % confirmé sur paiement en crypto.

## Dérive llms-full.txt (GEO — secondaire)
- **Bybit** : llms = Mastercard (correct) alors que la **fiche live = Visa** → ici c'est la DB/fiche qui a dérivé, pas llms. Inversion à surveiller.
- **Revolut Metal** : llms = €179.88/an ; prix UE réel ≈ €15.99/mo (annuel €155). Périmé.
- **Young Platform** : totalement **absent** du tableau llms-full.txt alors qu'elle est suivie (trou GEO).
- **Binance** : correctement absente du tableau llms ; le problème est la review page statique.

## Action prioritaire (< 4 h)
Passer **Binance Card en `discontinued`** en base et retirer/dé-lister sa review page — carte arrêtée depuis 12/2023 encore affichée comme active avec 8 % de cashback.

_Lecture seule. La mise à jour Supabase et la régénération de llms-full.txt restent des étapes humaines (`node scripts/apply-card-updates.mjs --confirm`)._
