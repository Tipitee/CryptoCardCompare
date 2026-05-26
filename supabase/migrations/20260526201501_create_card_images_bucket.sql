/*
  # Create card-images storage bucket

  Creates a public storage bucket for card images with:
  - Public access for reading images
  - File size limit of 10MB
  - Allowed image MIME types only
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'card-images',
  'card-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for card images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'card-images');
