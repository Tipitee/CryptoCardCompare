ALTER TABLE cards ADD COLUMN IF NOT EXISTS category_rates JSONB DEFAULT '{}';

-- Plutus: entertainment-oriented perks
UPDATE cards SET category_rates = '{"streaming": 8, "restaurants": 6, "online": 4}'::jsonb WHERE id = 'plutus-card';

-- Tria Card: travel-first card with annual fee
UPDATE cards SET category_rates = '{"travel": 6, "transport": 3, "restaurants": 2}'::jsonb WHERE id = 'tria-card';

-- COCA Visa: e-commerce and travel bonuses
UPDATE cards SET category_rates = '{"online": 8, "travel": 5, "misc": 2}'::jsonb WHERE id = 'coca-visa-card';

-- Cardano Card: everyday spending bonuses
UPDATE cards SET category_rates = '{"supermarket": 8, "transport": 4, "misc": 4}'::jsonb WHERE id = 'cardano-card';

-- Bit2Me: online commerce focused
UPDATE cards SET category_rates = '{"online": 7, "misc": 4}'::jsonb WHERE id = 'bit2me-card';

-- Solid Card: everyday staples
UPDATE cards SET category_rates = '{"supermarket": 5, "transport": 4, "misc": 3}'::jsonb WHERE id = 'solid-card';

-- Wirex Elite: premium all-category card (high fees offset by broad coverage)
UPDATE cards SET category_rates = '{"online": 8, "travel": 8, "restaurants": 6, "supermarket": 5, "transport": 4, "streaming": 4}'::jsonb WHERE id = 'wirex-elite';

-- Tap Card: transport and supermarket focus
UPDATE cards SET category_rates = '{"transport": 5, "supermarket": 4, "misc": 2}'::jsonb WHERE id = 'tap-card';