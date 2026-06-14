import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const BASE = 'https://topcryptocards.eu';
const TODAY = new Date().toISOString().slice(0, 10);
const LANG_SEGMENTS = {
  fr: 'cartes',
  de: 'karten',
  es: 'tarjetas',
  it: 'carte',
  en: 'cards',
};
const ROUTE_TRANSLATIONS = {
  fr: { compare: 'comparer', simulator: 'simulateur', recommendation: 'recommandation', favorites: 'favoris', blog: 'blog' },
  de: { compare: 'vergleich', simulator: 'simulator', recommendation: 'empfehlung', favorites: 'favoriten', blog: 'blog' },
  es: { compare: 'comparar', simulator: 'simulador', recommendation: 'recomendacion', favorites: 'favoritos', blog: 'blog' },
  it: { compare: 'confronto', simulator: 'simulatore', recommendation: 'raccomandazione', favorites: 'preferiti', blog: 'blog' },
  en: { compare: 'compare', simulator: 'simulator', recommendation: 'recommendation', favorites: 'favorites', blog: 'blog' },
};

async function generate() {
  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('id')
    .neq('status', 'discontinued');

  if (cardsError) {
    console.warn('⚠️  Supabase unavailable — generating sitemap without dynamic cards:', cardsError.message);
  }

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, lang')
    .eq('published', true);

  const cardIds = (cards || []).map((c) => c.id);
  const urls = [];

  // Home pages
  for (const lang of Object.keys(LANG_SEGMENTS)) {
    urls.push({ loc: `${BASE}/${lang}`, priority: '1.0', freq: 'daily' });
  }

  // Named routes per language
  for (const [lang, routes] of Object.entries(ROUTE_TRANSLATIONS)) {
    for (const [, seg] of Object.entries(routes)) {
      urls.push({ loc: `${BASE}/${lang}/${seg}`, priority: '0.7', freq: 'weekly' });
    }
  }

  // Card detail pages
  for (const lang of Object.keys(LANG_SEGMENTS)) {
    const seg = LANG_SEGMENTS[lang];
    for (const id of cardIds) {
      urls.push({ loc: `${BASE}/${lang}/${seg}/${id}`, priority: '0.8', freq: 'monthly' });
    }
  }

  // Blog posts
  for (const post of posts || []) {
    urls.push({ loc: `${BASE}/${post.lang}/blog/${post.slug}`, priority: '0.6', freq: 'monthly' });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  mkdirSync('public', { recursive: true });
  writeFileSync('public/sitemap.xml', xml);
  console.log(`sitemap.xml generated: ${urls.length} URLs`);
}

generate().catch((err) => {
  console.warn('⚠️  Sitemap generation failed (non-fatal):', err.message);
  // Write a minimal fallback sitemap so the build doesn't fail
  mkdirSync('public', { recursive: true });
  const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${'https://topcryptocards.eu'}/fr</loc><priority>1.0</priority></url>
</urlset>`;
  writeFileSync('public/sitemap.xml', fallback);
  console.log('Fallback sitemap written. Build will continue.');
  // exit 0 so Netlify/Vite build continues
});
