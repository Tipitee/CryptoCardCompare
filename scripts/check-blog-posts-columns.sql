-- Vérifier les colonnes exactes de blog_posts
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;
