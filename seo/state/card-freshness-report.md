# A13 — Rapport fraîcheur cartes · 2026-08-18 (rotation complète, 20 cartes)

**Vérifié :** les 8 du lot hebdo + les 12 restantes (check étendu demandé).
**Écarts majeurs :** 3 produits ARRÊTÉS encore listés (Wirex EEE, Binance EEE, Brighty) + 8 cartes CHANGÉ. 5 OK.

## Produits arrêtés encore listés — PRIORITÉ HAUTE
| Carte | Réalité (source) | Statut |
|-------|------------------|--------|
| **Wirex** | Volet crypto + Cryptoback fermés dans l'EEE le 30/06/2026 (reste UK/NZ/HK/TW) (cryptoslate) | ARRÊTÉ EEE — déjà `discontinued` en base ✓ ; prose statique corrigée |
| **Binance** | Carte arrêtée EEE 20/12/2023 ; Binance a quitté l'EEE (07/2026) (financemagnates, pymnts) | ARRÊTÉ — vérifier statut base |
| **Brighty** | Wireflexion (services crypto Brighty) ferme fin juin 2026, retrait des fonds conseillé (milkroad) | ARRÊTÉ — vérifier statut base |

## Cartes CHANGÉ (fiche → réalité)
| Carte | Champ | Fiche dit | Réalité (source) | Conf. |
|-------|-------|-----------|------------------|-------|
| OKX | cashback/token | 3 % en OKB | **2–5 % en USDG** selon VIP, dépenses USDG only (okx.com) | high |
| MetaMask | frais/token | 199 $ fixe, ETH | **base gratuite** (1 %), Metal 199 $ (3 %) ; **mUSD** (cardpilled) | medium |
| Ledger | cashback/token | 2 % BTC/LDG | **1 % en BTC ou USDT**, plus de palier LDG (ledger.com) | medium |
| Coinbase | format | physique+virtuelle | **carte physique suspendue** → virtuelle (cryptowisser) | medium |
| Bitpanda | token | 1 % en BEST | 1 % **dans la crypto de l'achat** (support.bitpanda) | medium |
| Nexo | format | physique+virtuelle | **physique en pause** depuis 01/2025 → virtuelle ; UK sans cashback (cardpilled) | medium |
| Plutus | frais/cashback | €0, up to 8 % | **plus de palier gratuit** (abo dès £6,99/mois), max **9 %**, FX 2,5 % (spendnode) | medium |
| Revolut Metal | frais | 179,88 €/an | **203,88 €/an** (16,99 €/mois) (cryptowisser) | medium |

## OK / points mineurs
Bit2Me (7 % B2M, EEE ✓), Gnosis Pay (5 % GNO ✓, prog. jusqu'au 30/09/2026), Ether.fi Cash (3 % wETH ✓), Young Platform (3,6 % YNG, **Italie only** ✓), Trade Republic (1 % Saveback, pas UK ✓), Crypto.com (0-8 % CRO, abo désormais alternative au staking), KuCoin (EEE only, licence gelée jan.–mai 2026 puis rétablie), Bleap (20 % OK, promo 2 % courses **terminée le 31/05/2026**).
**Bybit** — INCERTAIN : la réalité indique tout l'EEE (France incluse) ; la fiche liste DE/ES/IT/UK/AT sans FR/BE. À confirmer avant d'ajouter fr/be aux marchés.

## Dérive llms-full.txt (GEO)
- OKX : llms-full « up to 5 % » (proche réalité) vs fiche « 3 % » ; token « OKB » faux (réalité USDG).
- Bitpanda : llms-full le dit dispo UK/FCA ; réalité = Eurozone only, pas UK.
llms-full est régénéré depuis la base au déploiement → se corrige après application des changements.

## Action prioritaire (< 4 h)
Confirmer/forcer le statut **`discontinued`** de **Binance** et **Brighty** en base (comme Wirex) — 3 produits morts encore présentés comme disponibles = risque désinformation + SEO. Puis appliquer `card-freshness-changes.json`.

*Lecture seule. Changements proposés dans card-freshness-changes.json (revue humaine + `node scripts/apply-card-updates.mjs --confirm`). Prose statique Wirex/OKX/MetaMask/Ledger déjà corrigée dans src/data (typecheck OK).*
