-- Migration: add category column to blog_posts
-- Run once in Supabase SQL Editor

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'card';

-- Tag existing card articles
UPDATE blog_posts SET category = 'card' WHERE category = 'card';

-- Index for fast filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_lang ON blog_posts(category, lang);
