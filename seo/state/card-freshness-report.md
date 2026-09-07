# A13 — Rapport fraîcheur cartes · 2026-09-05

**Lot vérifié (8) :** Bitpanda, MetaMask, OKX, Ledger CL (Baanx), Brighty, Bleap, KuCoin, Plutus
**Écarts :** 2 CHANGÉ (contenu), 1 CHANGÉ (base, medium), 3 INCERTAIN, 2 OK. Aucun produit ARRÊTÉ confirmé.

| Carte | Champ | Fiche live dit | Réalité (source) | Statut | Marché |
|---|---|---|---|---|---|
| MetaMask | frais annuels | boîte data = Free ; **texte+meta = 199 €/an** | Gratuit, pas de frais annuels (Consensys/Baanx, Mastercard) | CHANGÉ (contenu) | tous |
| OKX | cashback premium | 5 % (VIP) | jusqu'à **10 %** VIP4+ EEE depuis 03/2026 (okx.com) | CHANGÉ (base) | EEE |
| OKX | note cashback base | « standard = 0 % » | non-VIP = 2 % **plafonné 10 €/mois** (okx.com) | CHANGÉ (contenu) | EEE |
| Plutus | frais annuels | texte « gratuit / aucun frais » ; data 98 € | **palier gratuit supprimé en 2026** → abo 6,99–19,99 £/mois + 2,5 % FX (spendnode, cardpilled) | CHANGÉ (contenu) | UK/EEE |
| Plutus | staking pour 9 % | 500 € | ~40 000 PLU (~5–6 k€) pour le palier 9 % | INCERTAIN (PLU volatil) | — |
| Bleap | réseau | texte « Visa » ; data Mastercard | **Mastercard** (bleap.finance) | data OK / texte faux | — |
| Ledger CL | fiche entière | page live **vide (non rendue)** | 1 % BTC/USDC, 0 €, Visa, actif (spendnode) | INCERTAIN (prerender KO) | — |
| KuCoin | fiche | **introuvable sur le site** | KuCard actif EEE, 0,5–3 % KCS, 9,99 € émission ; **pas de licence EMI UE, MiCA en attente → risque** | INCERTAIN | EEE |
| Bitpanda | cashback/frais/réseau | 1 %/2 %, 0 €, Visa | 1 % (crypto) + 2 % BEST, 0 €, Visa, actif | OK | — |
| Brighty | cashback | 0,5 %/1,75 % | 0,5–1,75 % en USDC, 0 €, actif | OK | — |

## À corriger cette semaine (par trafic)
1. **MetaMask** — le corps de la review affiche « 199 €/an » alors que la carte est gratuite (contredit sa propre donnée). Désinformation sur une carte à fort trafic.
2. **Plutus** — texte « complètement gratuit / aucun frais annuel » : le palier gratuit a été supprimé en 2026 (abonnement mensuel payant obligatoire + 2,5 % FX). À réécrire.
3. **OKX** — passer le cashback premium 5 % → 10 % (VIP4+ EEE) et retirer la mention « standard = 0 % » (désormais 2 % plafonné 10 €/mois).
4. **Bleap** — texte dit « Visa » partout ; le réseau réel est **Mastercard** (la donnée structurée est déjà correcte).

## Dérive llms-full.txt (GEO, fichier statique périmé)
- MetaMask : llms = 199 € vs réalité/data = gratuit.
- OKX : llms = « jusqu'à 5 % / OKB » vs réalité = 2–10 % en USDG.
- Plutus : llms = 0 € / 8 % vs réalité = abo payant / 9 %.
- Bleap : llms = Visa vs réalité = Mastercard.
- Bitpanda : llms se contredit (ligne « non dispo France » vs table FR incluse) — à trancher manuellement.
- Ledger CL & KuCoin absents de la table llms-full.

## Action prioritaire (< 4 h)
Corriger le corps de la review **MetaMask Card** : supprimer la mention « 199 €/an » (meta-description + texte) — la carte est gratuite, ce que confirme déjà son propre champ *Annual Fees: Free*. C'est la correction la plus rentable (fort trafic, contradiction interne, risque de confiance).

*Lecture seule. MAJ Supabase + régénération llms-full.txt = étapes humaines. Note : le bloc « Availability » (Available in UK / EU / Free ATM / No staking) est identique sur toutes les fiches → template statique non fiable, disponibilité par marché lue via llms-full + éditeur.*
