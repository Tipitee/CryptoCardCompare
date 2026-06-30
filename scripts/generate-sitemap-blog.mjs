/**
 * generate-sitemap-blog.mjs
 * Génère public/sitemap-blog.xml à partir des articles publiés dans Supabase.
 * Usage : node scripts/generate-sitemap-blog.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Lire les env vars depuis .env ─────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, '.env'), 'utf8');
    const env = {};
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv();
const SUPABASE_URL  = env.VITE_SUPABASE_URL  || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY   = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env');
  process.exit(1);
}

// ── Fetch tous les articles publiés ──────────────────────────────────────────
async function fetchAllPosts() {
  const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=lang,slug,topic_key,created_at&published=eq.true&order=lang,slug&limit=2000`;
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase error ${res.status}: ${txt}`);
  }
  return res.json();
}

// ── Générer le XML ────────────────────────────────────────────────────────────
function generateSitemap(posts) {
  const BASE  = 'https://topcryptocards.eu';
  const LANGS = ['fr', 'de', 'es', 'it', 'en'];

  // Grouper par topic_key
  const byTopic = {};
  for (const p of posts) {
    const key = p.topic_key || `__solo_${p.lang}_${p.slug}`;
    if (!byTopic[key]) byTopic[key] = {};
    byTopic[key][p.lang] = {
      slug: p.slug,
      date: p.created_at?.slice(0, 10) || '2026-06-30',
    };
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const langMap of Object.values(byTopic)) {
    const availLangs = LANGS.filter(l => langMap[l]);
    const xdefaultLang = langMap['fr'] ? 'fr' : availLangs[0];
    const xdefaultSlug = langMap[xdefaultLang].slug;

    for (const lang of availLangs) {
      const { slug, date } = langMap[lang];
      xml += `  <url>\n`;
      xml += `    <loc>${BASE}/${lang}/blog/${slug}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      for (const hl of availLangs) {
        xml += `    <xhtml:link rel="alternate" hreflang="${hl}" href="${BASE}/${hl}/blog/${langMap[hl].slug}"/>\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/${xdefaultLang}/blog/${xdefaultSlug}"/>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>\n`;
  return xml;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('🔍  Récupération des articles depuis Supabase...');
const posts = await fetchAllPosts();
console.log(`✅  ${posts.length} articles trouvés`);

const byLang = posts.reduce((acc, p) => {
  acc[p.lang] = (acc[p.lang] || 0) + 1;
  return acc;
}, {});
console.log('   Par langue:', byLang);

const xml = generateSitemap(posts);
const urlCount = (xml.match(/<url>/g) || []).length;
console.log(`📄  ${urlCount} URLs générées`);

const outPath = join(ROOT, 'public', 'sitemap-blog.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`✅  Fichier écrit : ${outPath}`);
console.log(`\n⚠️  N'oublie pas de commit et push ce fichier !`);
