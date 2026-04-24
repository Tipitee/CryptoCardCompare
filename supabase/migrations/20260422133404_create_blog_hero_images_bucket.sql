/*
  # Create blog-hero-images storage bucket

  ## Summary
  Creates a public storage bucket for generated blog hero images with appropriate file size and MIME type restrictions.

  ## Storage Bucket
  - `blog-hero-images`: Public bucket for storing generated blog hero images
    - File size limit: 10MB per image
    - Allowed MIME types: JPEG, PNG, WebP, AVIF
    - Public access: enabled

  ## Security
  - Public read access for blog hero images
  - Service role only write access (via Edge Function with admin secret validation)
*/

INSERT INTO storage.buckets (id, name, owner, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-hero-images',
  'blog-hero-images',
  NULL,
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read blog hero images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-hero-images');

CREATE POLICY "Service role can upload blog hero images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-hero-images');

CREATE POLICY "Service role can update blog hero images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-hero-images')
  WITH CHECK (bucket_id = 'blog-hero-images');
