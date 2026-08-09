# A13 — Rapport fraîcheur cartes — 2026-08-08

Lot vérifié (8, `lastChecked` null) : Bitpanda, MetaMask, OKX, Ledger/Baanx, Brighty, Bleap, KuCoin, Plutus.
Écarts : **4 CHANGÉ** (3 cartes) · **1 INCERTAIN** (KuCoin) · **1 nuance** (MetaMask) · + dérive GEO llms-full.txt.

> ⚠️ Contrainte : les fiches live `/en/cards/<slug>` n'ont pas pu être chargées (réseau/provenance bloqués). Source « site » utilisée = **CARDS_TABLE de `llms-full.txt`** (« table auto-générée depuis la base » → proxy fidèle des valeurs DB). Prose de `llms-full.txt` = contrôle GEO secondaire.

| Carte | Champ | Site (CARDS_TABLE) | Réalité (source) | Statut | Marché |
|-------|-------|--------------------|------------------|--------|--------|
| Bleap Crypto Card | réseau | Visa | **Mastercard** (bleap.finance officiel) | CHANGÉ | tous |
| Ledger CL Card | cashback | Up to 2% | **1%** BTC/USDC (2% = frais de dépense, spendnode/ueex) | CHANGÉ | tous |
| Plutus Card | frais annuels | €0 | **plan payant mini £6.99/mois** (tier gratuit supprimé 2026, spendnode) | CHANGÉ | tous |
| Plutus Card | cashback max | Up to 8% | **Up to 9%** (tier G.O.A.T, spendnode/cardpilled) | CHANGÉ | tous |
| MetaMask Card | frais annuels | €199 | €199 = tier Metal ; carte virtuelle **€0 / 1%** (coincodecap) | INCERTAIN (nuance tier) | tous |
| KuCoin Card | présence | absente de la table | **KuCard actif**, Visa, EEE (pas UK) — non listée (cryptowisser/IBSI) | INCERTAIN (couverture) | EEE |
| Bitpanda | cashback / dispo | Up to 2%, dispo FR | Up to 2% asset au choix, **dispo FR OK** (spendnode) | OK | — |
| OKX Card | tout | 5%, Mastercard, EEE, pas UK | conforme (Mastercard, EEE, USDG ≤5%, coincodecap) | OK | — |
| Brighty Card | cashback | Up to 1.75% | conforme (0.5% gratuit → 1.75% payant, fintechmagazine) | OK | — |

## À corriger cette semaine (CHANGÉ, par trafic)
1. **Plutus** — `annual_fees` €0 → payant (tier gratuit supprimé 2026, mini £6.99/mois) + `cashback_premium` 8→9. Carte à trafic (page alternatives dédiée).
2. **Ledger CL Card** — `cashback_base` 2→1 % (le 2% affiché est le frais de dépense, pas le cashback). Vérifier quelle fiche (Ledger CL vs CryptoLife).
3. **Bleap** — `card_network` Visa → Mastercard.

## Dérive GEO (`llms-full.txt`, prose statique périmée — la table est OK)
- Section France : « Not available: Bitpanda » ❌ — Bitpanda **est** dispo en France (contredit la table qui liste FR). À corriger.
- FAQ/recos : « Bleap 2% BTC », « Brighty 1% BTC », « Ledger 2% BTC » périmés (réalité : Bleap 20% USDC/Mastercard, Brighty 1.75% USDC, Ledger 1%).
- MetaMask listée « €0 » en FAQ mais « €199 » en table → clarifier tier gratuit vs Metal.

## UNE action prioritaire (< 4 h)
Corriger **Plutus** en base via l'admin : `annual_fees` (tier gratuit supprimé — n'est plus €0). C'est l'écart le plus trompeur : carte annoncée gratuite alors qu'un abonnement est désormais obligatoire.

*Lecture seule. Mise à jour Supabase + régénération `llms-full.txt` = étapes humaines (`node scripts/apply-card-updates.mjs --confirm`).*
