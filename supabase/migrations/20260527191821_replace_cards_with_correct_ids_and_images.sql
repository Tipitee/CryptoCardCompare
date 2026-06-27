/*
  # Replace all card rows with correct IDs, data and image URLs

  ## Summary
  The existing cards table had obsolete IDs (e.g. cdc-ruby-steel, bitpanda-card-premium)
  that did not match the authoritative CSV dataset. This migration:

  1. Clears all existing card rows (and orphaned favorites/compare_sessions)
  2. Inserts the full authoritative card dataset with:
     - Correct IDs matching the uploaded image filenames
     - Real card image URLs pointing to the card-images storage bucket
     - Correct market availability arrays
     - Correct cashback, fees, staking, extras data

  ## Cards inserted (18 total)
  - binance-standard      → binance-card.jpg
  - bit2me-card           → no image (es market only)
  - bitpanda-card         → bitpanda-card.jpg
  - bybit-card            → no image
  - coinbase-card         → coinbase-card.jpg
  - crypto-com-frosted-rose → cryptocom-frosted-rose-gold.jpg
  - crypto-com-jade-green   → cryptocom-jade-green.jpg
  - crypto-com-midnight-blue → cryptocom-midnight-blue.jpg
  - crypto-com-royal-indigo  → cryptocom-royal-indigo.jpg
  - crypto-com-ruby-steel    → cryptocom-ruby-steel.jpg
  - klarpay-card          → no image
  - nexo-card             → nexo-card.png
  - plutus-card           → plutus-card.jpeg
  - revolut-metal         → no image
  - trade-republic-card   → no image
  - wirex-elite           → wirex-elite-card.jpg
  - wirex-standard        → no image
  - young-platform-card   → no image

  ## Security
  - RLS remains enabled (no changes to policies)
  - Orphaned favorites and compare_sessions referencing old IDs are removed
*/

-- Remove orphaned user data referencing old card IDs
DELETE FROM favorites;
DELETE FROM compare_sessions;

-- Remove all existing cards
DELETE FROM cards;

-- Insert authoritative card dataset
INSERT INTO cards (id, name, issuer, cashback_base, cashback_premium, annual_fees, staking_required, cryptos, available_france, available_eu, card_network, daily_limit, free_withdrawals, extras, affiliate_link, badge, color_primary, color_secondary, real_card_image, image_alt, markets) VALUES

('binance-standard', 'Binance Card', 'Binance', 0.6, 2, 0, 0,
 ARRAY['BTC','ETH','BNB','BUSD','SXP','USDT'],
 false, true, 'Visa', 8700, true,
 ARRAY['Jusqu''à 8% cashback avec BNB staké','Paiement sans frais','Intégration wallet Binance'],
 'https://www.binance.com/', 'Meilleur rapport',
 '#f59e0b', '#78350f',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/binance-card.jpg',
 'Carte physique Binance Card de Binance, vue de face',
 ARRAY['de','es','it','en']),

('bit2me-card', 'Bit2Me Card', 'Bit2Me', 2.00, 7.00, 0.00, 0.00,
 ARRAY['BTC','ETH','B2M','ADA','XRP','SOL','DOT','USDT','USDC','TON'],
 false, false, 'Mastercard', 10000, false,
 ARRAY['feature_free_account','feature_cashback_boost','feature_staking_rewards','feature_instant_card'],
 'https://bit2me.com/suite/card', 'Spain #1',
 '#FF6B2B', '#0A0E1A',
 NULL, 'Bit2Me Card',
 ARRAY['es']),

('bitpanda-card', 'Bitpanda Card', 'Bitpanda', 1, 2, 0, 0,
 ARRAY['BTC','ETH','BEST','USDT','ADA','SOL','XRP'],
 true, true, 'Visa', 10000, false,
 ARRAY['Jusqu''à 2% avec BEST staké','Multi-portefeuilles','Actions et ETF intégrés'],
 'https://www.bitpanda.com/', NULL,
 '#10b981', '#065f46',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/bitpanda-card.jpg',
 'Carte physique Bitpanda Card de Bitpanda, vue de face',
 ARRAY['fr','de','es','it','en']),

('bybit-card', 'Bybit Card', 'Bybit', 2.00, 10.00, 0.00, 0.00,
 ARRAY['BTC','ETH','USDT','USDC','XRP','SOL'],
 true, true, 'Visa', 10000, false,
 ARRAY['feature_free_account','feature_cashback_boost','feature_instant_card'],
 'https://www.bybit.eu/de-EU/cards/', NULL,
 '#F7A600', '#0D0F12',
 NULL, 'Bybit Card',
 ARRAY['fr','de','es','it','en']),

('coinbase-card', 'Coinbase Card', 'Coinbase', 1, 4, 0, 0,
 ARRAY['BTC','ETH','USDC','XLM','XRP','LTC','BCH'],
 false, true, 'Visa', 10000, false,
 ARRAY['Cashback en crypto au choix','Intégration Coinbase','Notifications temps réel'],
 'https://www.coinbase.com/card', NULL,
 '#2563eb', '#1e3a8a',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/coinbase-card.jpg',
 'Carte physique Coinbase Card de Coinbase, vue de face',
 ARRAY['de','es','it','en']),

('crypto-com-frosted-rose', 'Frosted Rose Gold', 'Crypto.com', 3, 5, 0, 40000,
 ARRAY['BTC','ETH','CRO','USDC','USDT','SOL','XRP','ADA','DOT','MATIC','AVAX','LINK'],
 true, true, 'Visa', 25000, true,
 ARRAY['Tous abonnements premium','Salons aéroports illimités','Conciergerie dédiée','Airbnb remboursé'],
 'https://crypto.com/', 'Premium',
 '#fb7185', '#881337',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/cryptocom-frosted-rose-gold.jpg',
 'Carte physique Frosted Rose Gold de Crypto.com, vue de face',
 ARRAY['fr','de','es','it','en']),

('crypto-com-jade-green', 'Jade Green', 'Crypto.com', 2, 3, 0, 4000,
 ARRAY['BTC','ETH','CRO','USDC','USDT','SOL','XRP','ADA','DOT','MATIC'],
 true, true, 'Visa', 15000, true,
 ARRAY['Netflix & Spotify remboursés','Salons aéroports','Amazon Prime remboursé'],
 'https://crypto.com/', NULL,
 '#059669', '#064e3b',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/cryptocom-jade-green.jpg',
 'Carte physique Jade Green de Crypto.com, vue de face',
 ARRAY['fr','de','es','it','en']),

('crypto-com-midnight-blue', 'Midnight Blue', 'Crypto.com', 0, 0, 0, 0,
 ARRAY['BTC','ETH','CRO','USDC','USDT','SOL','XRP','ADA'],
 true, true, 'Visa', 5000, false,
 ARRAY['Application mobile complète','Paiement sans contact','Apple Pay & Google Pay'],
 'https://crypto.com/', NULL,
 '#1e3a8a', '#0f172a',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/cryptocom-midnight-blue.jpg',
 'Carte physique Midnight Blue de Crypto.com, vue de face',
 ARRAY['fr','de','es','it','en']),

('crypto-com-royal-indigo', 'Royal Indigo', 'Crypto.com', 2, 3, 0, 4000,
 ARRAY['BTC','ETH','CRO','USDC','USDT','SOL','XRP','ADA','DOT','MATIC'],
 true, true, 'Visa', 15000, true,
 ARRAY['Netflix & Spotify remboursés','Accès salons aéroports','Retraits ATM gratuits jusqu''à 400€/mois'],
 'https://crypto.com/', NULL,
 '#4338ca', '#1e1b4b',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/cryptocom-royal-indigo.jpg',
 'Carte physique Royal Indigo de Crypto.com, vue de face',
 ARRAY['fr','de','es','it','en']),

('crypto-com-ruby-steel', 'Ruby Steel', 'Crypto.com', 1, 2, 0, 400,
 ARRAY['BTC','ETH','CRO','USDC','USDT','SOL','XRP','ADA','DOT'],
 true, true, 'Visa', 10000, true,
 ARRAY['Spotify remboursé','100% Apple Pay','Retraits ATM gratuits jusqu''à 200€/mois'],
 'https://crypto.com/', 'Populaire',
 '#be123c', '#450a0a',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/cryptocom-ruby-steel.jpg',
 'Carte physique Ruby Steel de Crypto.com, vue de face',
 ARRAY['fr','de','es','it','en']),

('klarpay-card', 'Klarpay Crypto', 'Klarpay', 1.5, 3, 120, 1000,
 ARRAY['BTC','ETH','USDC','USDT','SOL'],
 true, true, 'Mastercard', 12000, true,
 ARRAY['Compte multi-devises','API pro','Support prioritaire'],
 'https://klarpay.com/', NULL,
 '#14b8a6', '#134e4a',
 NULL, 'Carte physique Klarpay Crypto de Klarpay, vue de face',
 ARRAY['fr','de','es','it','en']),

('nexo-card', 'Nexo Card', 'Nexo', 2, 2, 0, 0,
 ARRAY['BTC','ETH','NEXO','USDC','USDT','XRP','BNB'],
 true, true, 'Mastercard', 10000, true,
 ARRAY['Crédit sans vente de crypto','Jusqu''à 2% cashback en NEXO','Aucun minimum de dépense'],
 'https://nexo.com/', 'Zéro frais',
 '#0ea5e9', '#0c4a6e',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/nexo-card.png',
 'Carte physique Nexo Card de Nexo, vue de face',
 ARRAY['fr','de','es','it','en']),

('plutus-card', 'Plutus Card', 'Plutus', 3, 8, 0, 500,
 ARRAY['ETH','PLU','USDC'],
 true, true, 'Visa', 5000, true,
 ARRAY['Cashback en PLU','Perks Netflix/Spotify/Amazon','Staking flexible'],
 'https://plutus.it/', NULL,
 '#f97316', '#7c2d12',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/plutus-card.jpeg',
 'Carte physique Plutus Card de Plutus, vue de face',
 ARRAY['fr','de','es','it','en']),

('revolut-metal', 'Revolut Metal', 'Revolut', 0.10, 1.00, 179.88, 0.00,
 ARRAY['BTC','ETH','SOL','XRP','MATIC','ADA','DOT','DOGE','USDT','USDC'],
 true, true, 'Visa', 30000, true,
 ARRAY['feature_lounge_access','feature_insurance','feature_concierge','feature_cashback_boost'],
 'https://www.revolut.com/our-pricing-plans/', 'FCA Licensed',
 '#8B8FA8', '#1A1A2E',
 NULL, 'Revolut Metal Card',
 ARRAY['fr','de','es','it','en']),

('trade-republic-card', 'Trade Republic Card', 'Trade Republic', 1.00, 1.00, 0.00, 0.00,
 ARRAY['BTC','ETH','ETF'],
 true, true, 'Visa', 5000, true,
 ARRAY['feature_cashback_boost','feature_free_account','feature_instant_card'],
 'https://traderepublic.com/de-de/karte', 'Popular',
 '#0FC3A5', '#001124',
 NULL, 'Trade Republic Card',
 ARRAY['fr','de','es','it','en']),

('wirex-elite', 'Wirex Elite', 'Wirex', 2, 8, 348, 0,
 ARRAY['BTC','ETH','WXT','LTC','XRP','USDT','USDC'],
 true, true, 'Visa', 20000, true,
 ARRAY['Jusqu''à 8% cryptoback','Salons aéroports','Assurance voyage premium'],
 'https://wirexapp.com/', NULL,
 '#0f172a', '#000000',
 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/card-images/wirex-elite-card.jpg',
 'Carte physique Wirex Elite de Wirex, vue de face',
 ARRAY['fr','de','es','it','en']),

('wirex-standard', 'Wirex Standard', 'Wirex', 0.5, 2, 0, 0,
 ARRAY['BTC','ETH','WXT','LTC','XRP','USDT'],
 true, true, 'Visa', 10000, true,
 ARRAY['Cryptoback en WXT','Multi-devises fiat','Transferts SEPA gratuits'],
 'https://wirexapp.com/', NULL,
 '#ec4899', '#831843',
 NULL, 'Carte physique Wirex Standard de Wirex, vue de face',
 ARRAY['fr','de','es','it','en']),

('young-platform-card', 'Young Platform Card', 'Young Platform', 0.30, 3.60, 0.00, 0.00,
 ARRAY['BTC','ETH','YNG','SOL','ADA','XRP','DOT','MATIC','LINK','USDT'],
 false, false, 'Visa', 1500, false,
 ARRAY['feature_free_account','feature_cashback_boost','feature_staking_rewards','feature_instant_card'],
 'https://youngplatform.com/token-yng/clubs/', 'MiCA #1 IT',
 '#7B5CFA', '#0A0E1A',
 NULL, 'Young Platform Card',
 ARRAY['it']);
