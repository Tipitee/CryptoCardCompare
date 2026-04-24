/*
  # Add card visual color columns

  1. Modified Tables
    - `cards`: add `color_primary` (text) and `color_secondary` (text) for
      per-card gradient backgrounds driving the visual mockups.
      Default values fall back to the brand accent palette.

  2. Notes
    - Columns are nullable with defaults, so existing rows keep working.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'color_primary'
  ) THEN
    ALTER TABLE cards ADD COLUMN color_primary text NOT NULL DEFAULT '#00D4FF';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'color_secondary'
  ) THEN
    ALTER TABLE cards ADD COLUMN color_secondary text NOT NULL DEFAULT '#0A0E1A';
  END IF;
END $$;
