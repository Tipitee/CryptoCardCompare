# A13 — Fraîcheur cartes — 2026-10-10
Lot : Brighty, Bleap, KuCoin, Plutus, Bybit, Crypto.com Visa, Binance, Nexo. Écarts : 1 CHANGÉ (2 champs), 4 INCERTAIN, 3 fiches live illisibles. Lecture seule.
Limite : WebFetch de la fiche EN a renvoyé des données pour Bleap/Plutus/Bybit/Nexo seulement ; Brighty/Crypto.com = métadonnées uniquement, Binance = erreur, KuCoin = pas de fiche (absent du sitemap-reviews).

| carte | champ | fiche live dit | réalité (source) | statut | marché |
|---|---|---|---|---|---|
| Bybit | réseau | Visa | Mastercard (communiqué Bybit EU 19/01/2026) | CHANGÉ | EEE |
| Bybit | dispo | « pas en France » | EEE sauf Malte, France incluse (idem) | CHANGÉ | FR |
| Bybit | staking | 1 € requis | communiqué ne mentionne aucun staking | INCERTAIN | tous |
| Bybit | cashback | 2% base / 10% max | 2-10% selon palier, en BTC/USDC (idem) | OK | - |
| Plutus | frais | 98 €/an (et « gratuit ») | abonnement mensuel £6.99/9.99/19.99 (spendnode, tiers) | INCERTAIN | tous |
| Plutus | staking | 500 € | solde PLU on-chain par palier, 1 PLU=3%, 40k PLU=9% (spendnode) | INCERTAIN | tous |
| Plutus | dispo UK | UK+EU | sources contradictoires sur le UK (spendnode, 28/09/2026) | INCERTAIN | UK |
| Bleap | cashback | 2% base, jusqu'à 20% | « jusqu'à 20% » USDC (site Bleap) ; base 2% non confirmé | INCERTAIN | - |
| Bleap | dispo | FR/DE/ES/IT/UK/BE/AT/PT | EEE + Amérique latine ; UK non cité (site Bleap) | INCERTAIN | UK |
| Nexo | cashback | 0.5% base (« jusqu'à 2% » en texte) | rien de vérifiable obtenu | INCERTAIN | - |
| Brighty, Crypto.com, Binance, KuCoin | tous | fiche illisible | voir ci-dessous | INCERTAIN | - |

## À corriger cette semaine
1. Bybit : réseau Visa → Mastercard ; France « non dispo » → dispo (JSON, confiance medium, à relire avant apply).
2. À vérifier à la main dans l'admin (fiche illisible côté fetch) : Binance Card doit être status=discontinued (EEE arrêtée 20/12/2023, Blockworks) — confirmer qu'elle l'est et n'est plus promue ; Crypto.com : réalité = Basic 0%, Plus 2%, Pro 3%, Private 4-5%, Prime 8%, CRO verrouillé 12 mois (spendnode 07/10/2026), vs llms « 3% jusqu'à 5% » ; Brighty : réalité 0.5% base (plan One), jusqu'à 1.75% ; promo x2 terminée le 18/01/2026.

## Dérive llms-full.txt (GEO)
Périmé : Brighty (1% BTC = promo doublée terminée), Bybit (Mastercard, dispo DE/ES/IT/UK/AT/PT sans FR/BE alors que EEE sauf Malte), Crypto.com (« Frosted Rose Gold » 3%→5%), Bleap (1% en tableau vs 2% en FAQ), Nexo (0.5% vs 2% en FAQ). KuCoin et Binance absents de llms-full.txt. KuCoin : carte active en EEE (0.5-3% en KCS selon stake, spendnode 06/10/2026) mais sans fiche sur le site — lacune de contenu.

## Action prioritaire (< 4 h)
Vérifier dans l'admin que Binance Card est bien status=discontinued, puis appliquer le JSON Bybit (réseau + France).
