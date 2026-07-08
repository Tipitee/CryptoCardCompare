/**
 * Reads sitemap-cards-fr.xml (the canonical source of card slugs),
 * regenerates all 7 card sitemaps (fr/be/de/at/es/it/en) with full hreflang,
 * and creates sitemap-cards-be.xml + sitemap-cards-at.xml.
 *
 * Card detail URL segments per lang:
 *   fr → cartes   be → cartes
 *   de → karten   at → karten
 *   es → tarjetas
 *   it → carte
 *   en → cards
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
const BASE = 'https://topcryptocards.eu';
const TODAY = new Date().toISOString().slice(0, 10);

// Card URL segments per lang
const SEG = { fr: 'cartes', be: 'cartes', de: 'karten', at: 'karten', es: 'tarjetas', it: 'carte', en: 'cards' };
const LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en'];

// Extract card slugs from sitemap-cards-fr.xml
const frXml = readFileSync(join(PUBLIC, 'sitemap-cards-fr.xml'), 'utf8');
const slugRegex = /\/fr\/cartes\/([^<]+)<\/loc>/g;
const slugs = [];
let m;
while ((m = slugRegex.exec(frXml)) !== null) slugs.push(m[1]);

console.log(`Found ${slugs.length} card slugs`);

// Generate one sitemap per lang
for (const targetLang of LANGS) {
  const seg = SEG[targetLang];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  for (const slug of slugs) {
    const hreflangs = LANGS.map(l =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}/${l}/${SEG[l]}/${slug}"/>`
    ).join('\n');

    xml += `  <url>
    <loc>${BASE}/${targetLang}/${seg}/${slug}</loc>
${hreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/fr/cartes/${slug}"/>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }
  xml += `</urlset>`;

  const filename = `sitemap-cards-${targetLang}.xml`;
  writeFileSync(join(PUBLIC, filename), xml, 'utf8');
  console.log(`✓ ${filename} — ${slugs.length} URLs`);
}
