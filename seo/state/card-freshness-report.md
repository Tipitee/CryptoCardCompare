# A13 — Rapport fraîcheur cartes — 2026-08-05

**Lot vérifié (8) :** Bybit, Crypto.com Visa, Binance, Nexo, Bit2Me, Coinbase, Gnosis Pay, Wirex.
**Écarts détectés : 8** (1 ARRÊTÉ, 6 CHANGÉ, 1 carte OK). Source « site » = llms-full.txt (maj juillet 2026). Réalité = sites/émetteurs via WebSearch, daté ci-dessous.

| Carte | Champ | Site dit | Réalité (source, 2026) | Statut | Marché |
|-------|-------|----------|------------------------|--------|--------|
| Binance | produit | actif, 0,1-8% BNB | Carte EEE **arrêtée le 20/12/2023** (financemagnates, pymnts) | **ARRÊTÉ** | FR/BE/DE/AT/ES/IT |
| Coinbase | cashback | 1-2% crypto | Cashback **US-only** ; EU/UK = 0 récompense (bitdegree, sweepbase) | CHANGÉ | tous EU + UK |
| Bybit | cashback | jusqu'à 10% MNT | Base EU = **1% illimité** ; 10-20% = promo/hors-EU (cryptonomist, prnewswire) | CHANGÉ | tous EU + UK |
| Bybit | réseau | Visa | **Mastercard** dans l'EEE (Bybit Wiki) | CHANGÉ | EU |
| Nexo | cashback | jusqu'à 2% BTC/NEXO | **UK = 0 cashback** (FCA, oct. 2023) ; carte physique en pause depuis janv. 2025 (cryptoslate, spendnode) | CHANGÉ | UK |
| Bit2Me | réseau | Visa | **Mastercard** (bitcoinist, Binance Square, UPay) | CHANGÉ | tous |
| Crypto.com | paliers | Ruby Steel €0, 0-5% CRO | Programme **« Level Up »** depuis sept. 2025 ; Basic gratuit = 0%, palier via abo OU lockup CRO (cryptoslate, skrumble) | CHANGÉ | tous |
| Gnosis Pay | dispo | FR/BE/DE/AT/ES/IT (pas UK) | **UK disponible** (+32 pays EEE, AR, BR) ; prog. cashback intérimaire finit 30/09/2026 (spendnode, cardpilled) | CHANGÉ | +UK |
| Wirex | — | jusqu'à 8% WXT, Visa/MC, base €0 | Conforme (8% = plan payant ; base gratuite 0,5%) (cryptoslate) | OK | — |

## À corriger cette semaine (trié par importance / trafic)
1. **Binance** — retirer/marquer « arrêté » : produit mort encore listé comme achetable = désinformation + mauvais SEO/GEO.
2. **Coinbase** — supprimer le cashback 1-2% pour tous les marchés EU/UK (récompenses réservées aux US).
3. **Bybit** (carte phare) — cashback EU = 1% (pas 10%) et réseau Mastercard en EEE (le 10-20% n'est que promo/hors-EU).
4. **Nexo** — flag UK : 0 cashback (FCA) ; noter la pause carte physique.
5. **Crypto.com** — remplacer paliers/naming Ruby Steel par « Level Up » (Basic gratuit = 0%).
6. **Bit2Me** — réseau Visa → Mastercard.
7. **Gnosis Pay** — ajouter le marché UK.

**Dérive llms-full.txt (GEO) :** fichier statique (maj juillet 2026), non régénéré ; 7 des 8 cartes du lot ont dérivé de la réalité émetteur. Il alimente les IA → régénération à prévoir après corrections en base. (Comparaison faite sur llms-full.txt uniquement ; fiches live non re-fetchées ce cycle.)

## Action unique (< 4 h)
Via l'admin, **marquer la Binance Card comme arrêtée / la dépublier** (retirée de l'EEE depuis déc. 2023). C'est la seule correction empêchant d'orienter des utilisateurs vers un produit inexistant.

_Lecture seule : aucune modif base/site effectuée. Mise à jour Supabase + régénération llms-full.txt = étapes humaines._
