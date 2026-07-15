-- detect-stale-posts.sql
-- Posts blog non mis à jour depuis 6+ mois, triés par priorité SEO.
-- Coller dans Supabase SQL Editor et exécuter.

SELECT
  id,
  lang,
  category,
  slug,
  title,
  topic_key,
  COALESCE(updated_at, created_at)::date AS last_updated,
  DATE_PART('month', AGE(NOW(), COALESCE(updated_at, created_at)))::int
    + DATE_PART('year',  AGE(NOW(), COALESCE(updated_at, created_at)))::int * 12
    AS age_months,

  -- Score de priorité : lang + catégorie (à trier DESC)
  CASE lang
    WHEN 'fr' THEN 10 WHEN 'es' THEN 9 WHEN 'de' THEN 8
    WHEN 'it' THEN 7  WHEN 'en' THEN 6 WHEN 'be' THEN 5 WHEN 'at' THEN 4
    ELSE 3
  END
  +
  CASE category
    WHEN 'review'     THEN 20 WHEN 'comparison' THEN 18 WHEN 'thematic' THEN 15
    WHEN 'crypto'     THEN 12 WHEN 'guide'      THEN 10
    ELSE 5
  END
  AS priority

FROM blog_posts
WHERE COALESCE(updated_at, created_at) < NOW() - INTERVAL '6 months'

ORDER BY priority DESC, age_months DESC
LIMIT 50;
