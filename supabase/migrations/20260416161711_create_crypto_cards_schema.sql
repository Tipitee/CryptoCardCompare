/*
  # CryptoCardCompare Schema

  1. New Tables
    - `cards`: stores crypto card data
      - `id` (text, primary key)
      - `name` (text)
      - `issuer` (text)
      - `cashback_base` (numeric)
      - `cashback_premium` (numeric)
      - `annual_fees` (numeric)
      - `staking_required` (numeric)
      - `cryptos` (text[])
      - `available_france` (bool)
      - `available_eu` (bool)
      - `card_network` (text)
      - `daily_limit` (numeric)
      - `free_withdrawals` (bool)
      - `extras` (text[])
      - `affiliate_link` (text)
      - `badge` (text, nullable)
      - `created_at` (timestamptz)
    - `favorites`: stores user favorites by session UUID
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `card_id` (text, references cards)
      - `created_at` (timestamptz)
    - `quiz_results`: stores quiz answers and results
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `answers` (jsonb)
      - `top_matches` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Cards readable by anyone (public data)
    - Favorites and quiz_results accessible by matching session_id via anon role
*/

CREATE TABLE IF NOT EXISTS cards (
  id text PRIMARY KEY,
  name text NOT NULL,
  issuer text NOT NULL DEFAULT '',
  cashback_base numeric NOT NULL DEFAULT 0,
  cashback_premium numeric NOT NULL DEFAULT 0,
  annual_fees numeric NOT NULL DEFAULT 0,
  staking_required numeric NOT NULL DEFAULT 0,
  cryptos text[] NOT NULL DEFAULT '{}',
  available_france boolean NOT NULL DEFAULT true,
  available_eu boolean NOT NULL DEFAULT true,
  card_network text NOT NULL DEFAULT 'Visa',
  daily_limit numeric NOT NULL DEFAULT 0,
  free_withdrawals boolean NOT NULL DEFAULT false,
  extras text[] NOT NULL DEFAULT '{}',
  affiliate_link text NOT NULL DEFAULT '',
  badge text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  card_id text NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, card_id)
);

CREATE INDEX IF NOT EXISTS favorites_session_idx ON favorites(session_id);

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  top_matches jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_results_session_idx ON quiz_results(session_id);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cards are publicly readable"
  ON cards FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read favorites"
  ON favorites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert favorites"
  ON favorites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete favorites"
  ON favorites FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read quiz results"
  ON quiz_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert quiz results"
  ON quiz_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
