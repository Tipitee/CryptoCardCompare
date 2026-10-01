# A13 — Rapport fraîcheur cartes · 2026-09-26

**Lot vérifié (8) :** Bit2Me Card, Coinbase Card, Gnosis Pay, Wirex Card, Bitpanda Card, MetaMask Card, OKX Card, Ledger/Baanx Card.
**Écarts :** 3 CHANGÉ · 1 INCERTAIN · 4 OK.

| Carte | Champ | Fiche live dit | Réalité (source) | Statut | Marché |
|---|---|---|---|---|---|
| OKX Card | cashback | 1-3 % en OKB, staking OKB optionnel | Depuis 01/09/2026 : 2 % (non-VIP) à 10 % (VIP4+), payé en **USDG**, paliers basés sur activité/solde OKX (pas OKB) ; carte virtuelle uniquement (okx.com/en-eu) | CHANGÉ | EU + Norvège (hors Islande/Liechtenstein) |
| MetaMask Card | cashback + frais | 1-3 % en ETH, 199 $/an | Carte virtuelle par défaut : 1 % en **mUSD**, 0 $/an ; carte Metal (optionnelle) : 3 % puis 1 %, 199 $/an (support.metamask.io) | CHANGÉ | FR/EU (US/UK : nouvelles inscriptions en pause) |
| Ledger/Baanx Card | cashback premium | 1 % BTC base + palier premium 2 % en « LDG » | 1 % cashback flat en BTC/USDC/USDT ; aucun palier premium ni token LDG trouvé (shop.ledger.com, blog Ledger) | CHANGÉ | EU (FR) |
| Coinbase Card | cashback | 4 % XLM / 1 % BTC | Structure non confirmée sur les sources officielles actuelles ; reviews tierces évoquent une restructuration (dont un produit US séparé jusqu'à 4 % BTC) | INCERTAIN | EU/UK |
| Wirex Card | statut/dispo | Crypto arrêté EEE/Australie depuis 30/06/2026 (déjà affiché) | Confirmé (cryptoslate, bleap.finance) — fiche déjà à jour | OK | EEE |
| Bit2Me Card | cashback | 2 % (jusqu'à 7 %) en B2M | Cohérent (support.bit2me.com, bit2me.com/suite/card) | OK | ES (surtout) |
| Gnosis Pay | cashback | 1-5 % en GNO selon palier GNO détenu | Cohérent (bleap.finance, cardpilled) | OK | EU + UK |
| Bitpanda Card | cashback | jusqu'à 1 % en BEST | Cohérent (spendnode) ; `llms-full.txt` dit « jusqu'à 2 % » (dérive) | OK | AT/DE/ES/FR/EU |

## À corriger cette semaine (par priorité)
1. **OKX Card (HAUTE, fort trafic).** Cashback totalement restructuré il y a 3 semaines : OKB→USDG, staking OKB→activité VIP, 1-3 %→2-10 %. Fiche live ET `llms-full.txt` obsolètes.
2. **MetaMask Card.** Clarifier : la carte virtuelle par défaut est gratuite (0 $/an, 1 % mUSD) ; 199 $/an ne concerne que la carte Metal optionnelle.
3. **Ledger/Baanx Card.** Vérifier/retirer le palier « 2 % LDG » : aucune source officielle ne confirme ce token ; structure réelle = 1 % flat.

## Dérive `llms-full.txt` (GEO)
- Coinbase Card et Wirex Card sont **absentes** du tableau principal de `llms-full.txt` (aucune ligne) → angle mort pour les IA.
- OKX Card : `llms-full.txt` dit « 2 % (jusqu'à 5 %) en OKB » — également périmé (voir ci-dessus).
- Bitpanda Card : `llms-full.txt` dit « jusqu'à 2 % », la fiche live dit « jusqu'à 1 % » — à harmoniser.

## UNE action prioritaire (< 4 h)
Corriger le cashback **OKX Card** en base (2 %→10 % selon VIP, payé en USDG, non lié à l'OKB) : carte à plus fort trafic du lot, écart le plus important et le plus récent (effectif depuis le 01/09/2026).

*Lecture seule. Mise à jour Supabase + régénération `llms-full.txt` = étapes humaines. Ledger/Baanx : pas de suppression de champ possible en JSON, à vérifier manuellement en base.*
