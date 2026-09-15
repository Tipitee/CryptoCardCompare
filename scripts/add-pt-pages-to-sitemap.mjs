#!/usr/bin/env node
/**
 * add-pt-pages-to-sitemap.mjs
 * PT index/tool pages (comparar, simulador, blog, marcas, analises, …) are absent
 * from sitemap-pages.xml → not prerendered → HTTP 404 (catch-all) while the SPA
 * still renders them. This adds the missing PT <url> blocks (with full hreflang
 * built from ROUTE_TRANSLATIONS) so they prerender as 200, at parity with fr/de/es/it/en.
 * Idempotent. Run from repo root:  node scripts/add-pt-pages-to-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITEMAP = path.join(ROOT, 'public', 'sitemap-pages.xml');
const TYPES_TS = path.join(ROOT, 'src', 'i18n', 'types.ts');
const B = 'https://topcryptocards.eu';

// ── Parse ROUTE_TRANSLATIONS from types.ts ─────────────────────────────────
const ts = fs.readFileSync(TYPES_TS, 'utf-8');
const rtStart = ts.indexOf('ROUTE_TRANSLATIONS');
const rtBody = ts.slice(rtStart, ts.indexOf('\n};', rtStart));
const ROUTES = {};
const langRe = /(\b[a-z]{2}): \{([\s\S]*?)\}/g;
let lm;
while ((lm = langRe.exec(rtBody))) {
  const lang = lm[1], body = lm[2];
  const map = {};
  for (const km of body.matchAll(/(\w+):\s*'([^']*)'/g)) map[km[1]] = km[2];
  ROUTES[lang] = map;
}
const LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en', 'pt'];
const BCP47 = { fr: 'fr', be: 'fr-BE', de: 'de', at: 'de-AT', es: 'es', it: 'it', en: 'en-GB', pt: 'pt-PT' };

// ── Page types that PT is missing (index + tools), with sitemap priority ───
const PAGES = [
  { key: 'compare',            priority: '0.7', changefreq: 'weekly' },
  { key: 'simulator',          priority: '0.6', changefreq: 'monthly' },
  { key: 'recommendation',     priority: '0.6', changefreq: 'monthly' },
  { key: 'blog',               priority: '0.8', changefreq: 'daily' },
  { key: 'cryptos',            priority: '0.7', changefreq: 'weekly' },
  { key: 'brands',             priority: '0.7', changefreq: 'weekly' },
  { key: 'reviews',            priority: '0.7', changefreq: 'weekly' },
  { key: 'cashbackCalculator', priority: '0.6', changefreq: 'monthly' },
  { key: 'feeCalculator',      priority: '0.6', changefreq: 'monthly' },
  { key: 'tools',              priority: '0.6', changefreq: 'monthly' },
];

const url = (lang, key) => `${B}/${lang}/${ROUTES[lang]?.[key]}`;

let xml = fs.readFileSync(SITEMAP, 'utf-8');
const lastmod = new Date().toISOString().slice(0, 10);
let added = 0;
const blocks = [];

for (const pg of PAGES) {
  const ptSlug = ROUTES.pt?.[pg.key];
  if (!ptSlug) { console.log(`skip ${pg.key}: no pt slug`); continue; }
  const ptLoc = `${B}/pt/${ptSlug}`;
  if (xml.includes(`<loc>${ptLoc}</loc>`)) { console.log(`ok (present): /pt/${ptSlug}`); continue; }
  // Build hreflang across all langs that define this key.
  const hl = LANGS.filter(l => ROUTES[l]?.[pg.key])
    .map(l => `    <xhtml:link rel="alternate" hreflang="${BCP47[l]}" href="${url(l, pg.key)}"/>`)
    .join('\n');
  const block = `  <url>
    <loc>${ptLoc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${pg.changefreq}</changefreq>
    <priority>${pg.priority}</priority>
${hl}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url('fr', pg.key)}"/>
  </url>`;
  blocks.push(block);
  added++;
  console.log(`add: /pt/${ptSlug}`);
}

if (added) {
  xml = xml.replace('</urlset>', `${blocks.join('\n')}\n</urlset>`);
  fs.writeFileSync(SITEMAP, xml, 'utf-8');
}
console.log(`\nDone. ${added} PT <url> block(s) added.`);
