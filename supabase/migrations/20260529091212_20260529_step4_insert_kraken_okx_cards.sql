/*
  # Etape 4 — Insertion des 2 nouvelles cartes

  ## 1. Kraken Krak Card
  - Lancee en novembre 2025
  - Reseau : Visa
  - Disponible : UK + EEA 30 pays (fr, de, es, it, en)
  - Cashback : 1% en KRAK token (pas de staking requis)
  - Gratuite (0€ de frais annuels)
  - Un des rares exchanges avec licence FCA (UK)

  ## 2. OKX Card
  - Lancee en janvier 2025
  - Reseau : Mastercard
  - Disponible : EEA 25 pays (fr, de, es, it) — UK exclu (hors EEA)
  - Virtuelle uniquement (jamais eu de carte physique)
  - Depenses en stablecoins uniquement (USDC, USDG)
  - Cashback 0.5% base / 2.0% premium (tiers a confirmer)
  - Gratuite (0€ de frais annuels)

  ## Couleurs
  - Kraken : orange/noir caracteristique de Kraken (#F7931A / #1A1A2E)
  - OKX : blanc/noir caracteristique d'OKX (#000000 / #FFFFFF)
*/

INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos,
  available_france, available_eu,
  card_network,
  daily_limit, free_withdrawals,
  extras,
  affiliate_link,
  badge,
  color_primary, color_secondary,
  markets,
  status, virtual_only, market_restrictions
) VALUES (
  'kraken-krak-card',
  'Krak Card',
  'Kraken',
  1.0,
  1.0,
  0,
  0,
  ARRAY['KRAK', 'BTC', 'ETH', 'USDC', 'DOT'],
  true,
  true,
  'Visa',
  500,
  true,
  ARRAY['no_staking_required', 'new_2025', 'fca_licensed'],
  '',
  'Nouveau',
  '#FF5500',
  '#1A1A2E',
  ARRAY['fr', 'de', 'es', 'it', 'en'],
  'active',
  false,
  '{}'
);

INSERT INTO cards (
  id, name, issuer,
  cashback_base, cashback_premium,
  annual_fees, staking_required,
  cryptos,
  available_france, available_eu,
  card_network,
  daily_limit, free_withdrawals,
  extras,
  affiliate_link,
  badge,
  color_primary, color_secondary,
  markets,
  status, virtual_only, market_restrictions
) VALUES (
  'okx-card',
  'OKX Card',
  'OKX',
  0.5,
  2.0,
  0,
  0,
  ARRAY['USDC', 'USDG', 'OKB', 'BTC', 'ETH'],
  true,
  true,
  'Mastercard',
  500,
  true,
  ARRAY['virtual_only', 'stablecoin_only', 'new_2025'],
  '',
  'Virtuelle uniquement',
  '#000000',
  '#FFFFFF',
  ARRAY['fr', 'de', 'es', 'it'],
  'active',
  true,
  '{"en": "Non disponible au Royaume-Uni (hors EEA)"}'
);
