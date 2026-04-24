/*
  # Add real card image + accessibility alt text to cards

  1. Changes
    - Add `real_card_image` (text, nullable) to `cards` table
      - Stores the public URL (typically from Supabase Storage) of an official
        or very realistic photo of the physical card
    - Add `image_alt` (text, nullable) to `cards` table
      - Human-readable description used as the `alt` attribute for accessibility

  2. Security
    - Existing RLS policies on `cards` already cover all columns (SELECT granted
      to anon/authenticated). Nothing additional required because:
        - New columns inherit the table-level policies
        - Both new columns are nullable by default, no data loss risk
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'real_card_image'
  ) THEN
    ALTER TABLE cards ADD COLUMN real_card_image text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'image_alt'
  ) THEN
    ALTER TABLE cards ADD COLUMN image_alt text;
  END IF;
END $$;
