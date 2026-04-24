/*
  # Create blog_posts table

  ## Summary
  Creates a fully-featured blog posts table for the CryptoCardCompare blog system.

  ## New Tables
  - `blog_posts`
    - `id` (uuid, primary key)
    - `slug` (text, unique) — URL-friendly identifier
    - `title` (text) — Article title
    - `excerpt` (text) — Short summary for list pages
    - `content` (text) — Full Markdown content
    - `image_hero` (text, nullable) — Hero image URL
    - `tags` (text[]) — Array of tag strings
    - `meta_title` (text) — SEO title
    - `meta_description` (text) — SEO description
    - `published` (boolean, default false) — Draft vs published
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public SELECT policy for published articles only
  - No public write access (managed via Edge Function with admin secret)

  ## Indexes
  - Unique index on `slug`
  - Index on `published` for filtering
  - GIN index on `tags` for tag-based lookups
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_hero text,
  tags text[] NOT NULL DEFAULT '{}',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (published);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON blog_posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts (created_at DESC);
