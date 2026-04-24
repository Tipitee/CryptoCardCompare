/*
  # Create compare_sessions table

  Track comparison sessions created by users so a "Recent comparisons" history
  can be shown inside the comparator page.

  1. New Tables
    - `compare_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text) — local browser session identifier
      - `card_ids` (text[]) — the IDs of cards being compared
      - `created_at` (timestamptz) — insertion time

  2. Security
    - Enable RLS on `compare_sessions`
    - Anonymous and authenticated users can insert their own sessions
    - Anyone can read sessions (history is scoped client side by session_id)

  3. Notes
    - No destructive operations. Uses IF NOT EXISTS.
*/

CREATE TABLE IF NOT EXISTS compare_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  card_ids text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compare_sessions_session_idx
  ON compare_sessions (session_id, created_at DESC);

ALTER TABLE compare_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'compare_sessions' AND policyname = 'Anyone can insert compare session'
  ) THEN
    CREATE POLICY "Anyone can insert compare session"
      ON compare_sessions
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'compare_sessions' AND policyname = 'Anyone can read compare sessions'
  ) THEN
    CREATE POLICY "Anyone can read compare sessions"
      ON compare_sessions
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
