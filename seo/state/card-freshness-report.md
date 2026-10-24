# A13 — Fraîcheur cartes — 2026-10-24
Lot : Bitpanda, MetaMask, OKX, Ledger/Baanx, Bybit, Crypto.com, Binance, Nexo. Écarts : 2 CHANGÉ/ARRÊTÉ (JSON), 3 INCERTAIN.
Note : slugs /en/cards/ de OKX, Ledger, Crypto.com, Binance renvoient la home -> lus via /en/reviews/<slug>.

| carte | champ | fiche live dit | réalité (source) | statut | marché |
|---|---|---|---|---|---|
| Binance | status | dispo EEE, jusqu'à 8% BNB, Visa | arrêtée EEE 20/12/2023 (Blockworks) ; EEE sans MiCA, inscriptions bloquées 01/07/2026 | ARRÊTÉ (haute) | EEE/FR |
| Bybit | dispo | EU sauf France | EEE sauf Malte, France incluse (Bybit EU, 19/01/2026) | CHANGÉ (medium) | FR |
| Bybit | réseau | Mastercard (tableau) / Visa (texte) | Mastercard | CHANGÉ (incohérence interne) | tous |
| Bybit | cashback | base 2% / prem. 10% | 2-10% en BTC (promo nouveaux jusqu'à 10%, plafonné 150 €) | OK | - |
| MetaMask | frais annuels | fiche "Free" vs texte 199 € | virtuelle 0 $, Metal 199 $/an (SpendNode) | INCERTAIN (par variante) | tous |
| Bitpanda | marchés | UE + UK | commande réservée résidents zone euro (bitpanda.com) | INCERTAIN | UK |
| Ledger | cashback max | 1% BTC, max 2% LDG | 1% BTC/USDT confirmé ; 2% LDG non vérifié ; frais 2% crypto / FX 1,75% non affichés | INCERTAIN | - |
| OKX | cashback | 2% base, jusqu'à 5% USDG | idem (OKX Learn) ; EU + Norvège | OK | - |
| Crypto.com | tiers/réseau/frais | 0-5%, Visa, 0 € | idem | OK | - |
| Nexo | cashback/frais | 0,5-2% NEXO, 0 €, Mastercard | idem ; Bulgarie/Estonie restreintes (non vérifié) | OK | - |

## À corriger cette semaine
1. Binance Card -> status=discontinued (HAUTE : produit arrêté encore listé, risque désinformation/SEO).
2. Bybit Card -> available_france=true, card_network=Mastercard.

## Dérive llms-full.txt (GEO)
- Binance : absente du fichier (cohérent avec l'arrêt) alors que la fiche live la présente active.
- Bybit : marchés sans FR/BE, alors que la page recommande Bybit pour FR/BE. OKX : "OKB" -> réalité USDG. Ledger : max "BTC ou LDG" vs fiche "LDG".
- Fiche live fait foi ; fichier statique à régénérer.

**Action prioritaire (< 4 h) :** passer Binance Card en discontinued via apply-card-updates.mjs.
Lecture seule : aucune écriture en base.
