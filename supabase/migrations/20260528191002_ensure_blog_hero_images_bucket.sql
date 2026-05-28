/*
  # Ensure blog-hero-images storage bucket exists

  Creates the blog-hero-images bucket if it doesn't already exist,
  with public access so images can be served directly to users.
  Also ensures RLS policies allow public read and service role write.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-hero-images',
  'blog-hero-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Allow public to read files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'blog-hero-images public read'
  ) THEN
    CREATE POLICY "blog-hero-images public read"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'blog-hero-images');
  END IF;
END $$;

-- Allow service role to insert/update/delete
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'blog-hero-images service insert'
  ) THEN
    CREATE POLICY "blog-hero-images service insert"
      ON storage.objects FOR INSERT
      TO service_role
      WITH CHECK (bucket_id = 'blog-hero-images');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'blog-hero-images service update'
  ) THEN
    CREATE POLICY "blog-hero-images service update"
      ON storage.objects FOR UPDATE
      TO service_role
      USING (bucket_id = 'blog-hero-images');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'blog-hero-images service delete'
  ) THEN
    CREATE POLICY "blog-hero-images service delete"
      ON storage.objects FOR DELETE
      TO service_role
      USING (bucket_id = 'blog-hero-images');
  END IF;
END $$;
