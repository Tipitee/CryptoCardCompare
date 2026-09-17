# A13 — Rapport fraîcheur cartes · 2026-09-12

**Lot vérifié (8) :** Ether.Fi Cash, Revolut Metal, Young Platform Card, Trade Republic Card, Bybit Card, Crypto.com Visa, Binance Card, Nexo Card.
**Écarts :** 1 ARRÊTÉ · 3 CHANGÉ · 2 INCERTAIN · 2 OK.

> ⚠️ **Limite de ce run :** fiches live inaccessibles (pane navigateur refusé + `web_fetch` bloqué par provenance sur `/en/cards/*`). « Ce que le site dit » provient donc de `llms-full.txt` (contrôle secondaire), PAS de la fiche live. Impossible de distinguer « fiche live erronée » de « seul llms-full.txt périmé ». Le relecteur humain DOIT confronter chaque écart à la fiche live / base avant d'appliquer.

| Carte | Champ | Site dit (llms-full.txt) | Réalité (source) | Statut | Marché |
|---|---|---|---|---|---|
| Binance Card | status | (absente du tableau) | Carte EEE arrêtée 20/12/2023 (financemagnates, Binance Support) | ARRÊTÉ | EEE |
| Bybit Card | cashback base | 2 % (jusqu'à 10 %) | Base non-VIP UE ramenée à 1 % fixe dès 04/08/2026 ; 2-10 % désormais réservé aux paliers VIP (prnewswire 08/2026) | CHANGÉ | UE/EEE |
| Revolut Metal | frais annuels | 203,88 € | Base UE 13,99 €/mois ≈ 167,88 €/an ; DE relevé à 15,99 €/mois dès 05/2026 (revolut.com) | CHANGÉ | par marché |
| Nexo Card | dispo UK | UK marché plein | UK : plus de cashback (phase-out régulatoire), carte utilisable pour payer (cryptoslate, bleap) | CHANGÉ | UK |
| Ether.Fi Cash | cashback + dispo | 2 % (jusqu'à 3 %), 8 marchés | 3 % sur 1ers 2 000 $/mois puis 1 %/0,5 % ; NON uniforme EEE, indispo NL + divers (spendnode, cardpilled) | INCERTAIN | EEE partiel |
| Crypto.com Visa | paliers CRO | 3 % (jusqu'à 5 %), staking | Programme « Level Up » restructuré 2025-26 ; paliers/stakes modifiés, chiffres divergents selon sources | INCERTAIN | UE |
| Young Platform Card | — | absente du tableau | Carte réelle : jusqu'à 3,6 % en YNG, 0 €, Visa, Italie, déploiement encore restreint (theblock, youngplatform) | OK (dérive GEO) | IT |
| Trade Republic Card | cashback | 1 % Saveback ETF, pas UK | 1 % Saveback ✓ ; +2 % Saveback sur achats financés en crypto depuis 11/2025 (bonus) | OK | hors UK |

## À corriger cette semaine (CHANGÉ/ARRÊTÉ, par priorité)
1. **Binance Card — ARRÊTÉ (HAUTE).** Produit retiré de l'EEE depuis 20/12/2023. Si une fiche/ligne base existe encore en `active`, passer en `discontinued` (désinformation + mauvais SEO).
2. **Bybit Card — cashback base.** UE non-VIP = 1 % fixe depuis 08/2026 (et non 2 %). Le « jusqu'à 10 % » ne vaut plus que pour les paliers VIP — bien distinguer base vs marketing.
3. **Revolut Metal — frais annuels.** 203,88 € paraît périmé (base UE ≈ 167,88 €/an ; DE ≈ 191,88 €). À confirmer par marché sur la fiche live.
4. **Nexo Card — restriction UK.** Ajouter note marché : pas de cashback au UK (phase-out), carte toujours utilisable.

## Dérive `llms-full.txt` (GEO)
- **Young Platform** absente du tableau principal alors qu'elle est recommandée pour l'Italie → les IA la rateront. À réintégrer au tableau.
- **Incohérence interne** : tableau Revolut = 203,88 € mais FAQ = 13,99 €/mois (167,88 €) → fichier statique non régénéré.
- `llms-full.txt` daté « September 2026 » mais ne reflète ni la coupe Bybit (08/2026) ni les frais Revolut à jour.

## UNE action prioritaire (< 4 h)
Vérifier la fiche live **Binance Card** : si encore listée `active`, la passer en `discontinued` via l'admin (produit EEE mort depuis 12/2023).

*Lecture seule. Mise à jour Supabase + régénération `llms-full.txt` = étapes humaines. Fiches live non atteintes ce run : tout écart à reconfirmer avant application.*
