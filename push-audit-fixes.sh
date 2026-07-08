#!/bin/bash
set -e
cd /Users/thomaspetit/CryptoCardCompare
rm -f .git/HEAD.lock .git/index.lock

git add \
  src/pages/Home.tsx \
  src/pages/Compare.tsx \
  src/store/useAppStore.ts \
  scripts/add-en-market.sql \
  scripts/fix-markets-post-audit.sql

git commit -m "fix: audit marchés post-MiCA juillet 2026 + filtrage par market

CODE (bugs de filtrage) :
  BUG #2 (Home): filter_france → card.markets.includes(selectedMarket ?? lang)
  BUG #3 (Home): topBalanced supprime le check availableFrance hardcodé
  BUG #4 (Store): message d'erreur neutre 'Loading error'
  BUG #5 (Compare): franceOnly → c.markets.includes(lang)

DB (scripts SQL) :
  scripts/add-en-market.sql — DÉPRÉCIÉ, remplacé par fix-markets-post-audit.sql
  scripts/fix-markets-post-audit.sql — audit complet 24 émetteurs :
    DISCONTINUED : Binance (no MiCA, exit EU 1/07/2026), Bitget (no MiCA,
      suspendu FR mars 2026), Coinbase Card (US-only), KuCoin (opérations
      interdites FMA), Wirex (crypto désactivé EEA 30/06/2026), Ledger/Baanx
      (no CASP), Young Platform (bêta fermée)
    DEBLOCK : FR uniquement (expansion BE/NL non encore déployée)
    EU-WIDE : ajout marché 'en' à toutes les cartes actives ayant fr ou de"

git push origin main
rm -f /Users/thomaspetit/CryptoCardCompare/push-audit-fixes.sh
echo "✅ Done — audit fixes pushed to main"
