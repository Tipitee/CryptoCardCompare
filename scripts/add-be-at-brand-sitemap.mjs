#!/usr/bin/env node
/**
 * add-be-at-brand-sitemap.mjs
 *
 * The brand sitemap only listed <loc> entries for fr/de/es/it/en, yet every
 * entry declared fr-BE (/be/marques/…) and de-AT (/at/marken/…) hreflang
 * alternates. Those Belgian and Austrian URLs were never prerendered, so
 * Cloudflare returned 404 (seen in GSC "Not found (404)": /be/marques/bybit,
 * /at/marken/nexo, …). Google read the wall of 404s as instability.
 *
 * This adds the missing /be/marques/<brand> and /at/marken/<brand> <loc>
 * entries so prerender.mjs generates real HTML for them. BrandPage renders
 * identically across markets (fetchCardsByBrand ignores market for the card
 * list and only applies per-card overrides), so these pages have full content.
 *
 * Idempotent: re-running does nothing once the entries exist.
 *
 * Usage: node scripts/add-be-at-brand-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'public', 'sitemap-brands.xml');
const BASE = 'https://topcryptocards.eu';

// Brand-list route slug per market
const SLUG = { fr: 'marques', be: 'marques', de: 'marken', at: 'marken', es: 'marcas', it: 'marche', en: 'brands' };

let xml = readFileSync(FILE, 'utf-8');

if (xml.includes('/be/marques/') && xml.includes('<loc>' + BASE + '/be/marques/')) {
  console.log('be/at brand <loc> entries already present, nothing to do.');
  process.exit(0);
}

// Extract brand ids from the fr <loc> entries (identical suffix across markets)
const brands = [...xml.matchAll(new RegExp(`<loc>${BASE}/fr/marques/([^<]+)</loc>`, 'g'))].map(m => m[1]);
if (brands.length === 0) { console.error('No fr brand locs found, aborting.'); process.exit(1); }
console.log(`Found ${brands.length} brands.`);

const today = new Date().toISOString().slice(0, 10);

function hreflangLines(brand) {
  return [
    `    <xhtml:link rel="alternate" hreflang="fr" href="${BASE}/fr/${SLUG.fr}/${brand}"/>`,
    `    <xhtml:link rel="alternate" hreflang="fr-BE" href="${BASE}/be/${SLUG.be}/${brand}"/>`,
    `    <xhtml:link rel="alternate" hreflang="de" href="${BASE}/de/${SLUG.de}/${brand}"/>`,
    `    <xhtml:link rel="alternate" hreflang="de-AT" href="${BASE}/at/${SLUG.at}/${brand}"/>`,
    `    <xhtml:link rel="alternate" hreflang="es" href="${BASE}/es/${SLUG.es}/${brand}"/>`,
    `    <xhtml:link rel="alternate" hreflang="it" href="${BASE}/it/${SLUG.it}/${brand}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en-GB" href="${BASE}/en/${SLUG.en}/${brand}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/fr/${SLUG.fr}/${brand}"/>`,
  ].join('\n');
}

function urlBlock(market, brand) {
  return `  <url><loc>${BASE}/${market}/${SLUG[market]}/${brand}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>\n${hreflangLines(brand)}\n  </url>`;
}

const additions = [];
for (const brand of brands) {
  additions.push(urlBlock('be', brand));
  additions.push(urlBlock('at', brand));
}

xml = xml.replace('</urlset>', additions.join('\n') + '\n</urlset>');
writeFileSync(FILE, xml, 'utf-8');
console.log(`Added ${additions.length} <loc> entries (${brands.length} be + ${brands.length} at).`);
