# A13 — Fraîcheur cartes — 2026-10-17
Lot (8) : Ether.Fi Cash, Revolut Metal, Young Platform, Trade Republic, Bit2Me, Coinbase, Gnosis Pay, Wirex. Écarts : 1 CHANGÉ, 3 INCERTAIN prioritaires (+3 non vérifiables).

| carte | champ | fiche live dit | réalité (source) | statut | marché |
|---|---|---|---|---|---|
| Revolut Metal | frais annuels | 179,88 € (corps) / 204 € (spec) | 18,99 €/mois = 227,88 €/an (185 € annuel) depuis 09/07/26 (revoptimize, tiers, 08/09) | CHANGÉ | FR (autres marchés non confirmés) |
| Revolut Metal | cashback | base 0,1 % / premium 1 % (FAQ contradictoire) | pas de cashback crypto perso, RevPoints seulement (revoptimize) | INCERTAIN | tous |
| Coinbase Card | disponibilité | fiche live non lisible (rendu vide) ; llms-full la liste FCA/UK | « US uniquement », AT/FR/DE/IT/ES/PT/UK restreints (spendnode, 12/10/26, tiers) | INCERTAIN (possible ARRÊTÉ) | FR/DE/AT/ES/IT/UK |
| Ether.Fi Cash | cashback | 2 % base / 3 % premium | 3 % sur 1ers 2 000 $/mois, payé en ETHFI ; EUR : 0,1 % au-delà de 1 500 $ (cryptocardhub, 05/10, tiers) | INCERTAIN | EU |
| Ether.Fi Cash | marchés | FR+EU+UK | NL, EE, FI, HU restreints (tiers, août 26) | INCERTAIN | NL/EE/FI/HU |
| Gnosis Pay | cashback/staking | 1 % base, 5 % premium ; staking min 1 € GNO | paliers 1–4 % selon 0,1/1/10/100 GNO, +1 % NFT OG = max 5 % ; plafonds hebdo (help.gnosispay.com) | OK (staking min 0,1 GNO vs « 1 € » : INCERTAIN) | tous |
| Trade Republic | cashback/frais | 1 %, 0 €, Visa | 1 % plafonné 15 €/mois, plan d'épargne ≥50 €/mois requis (bankdaten, tiers) ; conditions absentes de la fiche | OK (nuance) | UK : fiche dit dispo, llms-full dit non, non vérifié |
| Young Platform | tout | fiche EN introuvable (pas dans sitemap-reviews) | carte MiCA lancée (The Block) ; détails 2026 non confirmés | INCERTAIN | IT |
| Bit2Me | tout | fiche non lue (fetch KO) | recherche non concluante | INCERTAIN | ES/EU |
| Wirex | tout | fiche non lue (rendu vide) | recherche non concluante | INCERTAIN | UK/EU |

## À corriger cette semaine
1. Revolut Metal — annual_fees → 227,88 € (medium, voir JSON) ; harmoniser corps/spec box ; reformuler cashback (RevPoints).
Aucun ARRÊTÉ confirmé.

## Dérive llms-full.txt (GEO)
Revolut Metal 203,88 € / « 13,99 €/mois » (réel 18,99) ; Gnosis « 2 % GNO », staking « Optional » ; Trade Republic « pas au UK » vs fiche live « UK » ; Coinbase cité comme option UK/FCA.
Limites : fetch des fiches live échoué (Young, Bit2Me, Coinbase, Wirex) ; sources émetteur directes souvent indisponibles, tiers utilisés (confiance medium max).

**Action prioritaire (<4 h)** : vérifier à la main la fiche Coinbase Card (dispo FR/DE/AT/ES/IT/UK) ; si arrêtée, passer en discontinued par marché ; puis corriger Revolut Metal annual_fees.
