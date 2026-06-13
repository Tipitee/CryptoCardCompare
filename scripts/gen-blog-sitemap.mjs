import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: posts, error } = await supabase
  .from('blog_posts')
  .select('slug, lang, updated_at, created_at')
  .eq('published', true)
  .order('created_at', { ascending: false });

if (error) { console.error(error); process.exit(1); }
console.log(`Found ${posts.length} published posts`);

const entries = posts.map(p => {
  const lang = p.lang ?? 'fr';
  const lastmod = (p.updated_at || p.created_at || '').split('T')[0];
  return `  <url>\n    <loc>https://topcryptocards.eu/${lang}/blog/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;

writeFileSync('./public/sitemap-blog.xml', xml);
console.log('Written public/sitemap-blog.xml');
