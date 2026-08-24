#!/usr/bin/env node
/**
 * add-be-at-crypto-sitemap.mjs
 *
 * Same failure class as the brand sitemap: CryptoPage's useHreflang emits
 * fr-BE (/be/cryptos/…) and de-AT (/at/cryptos/…) alternates for every crypto
 * page, but those Belgian/Austrian URLs were never prerendered, so Cloudflare
 * returned 404 (GSC "Not found (404)": /be/cryptos/ada, /at/cryptos/sol, …).
 *
 * Adds the missing /be/cryptos/<id> and /at/cryptos/<id> <loc> entries so
 * prerender.mjs generates real HTML. CryptoPage now resolves be→fr and at→de
 * content (displayLang fallback), so /be pages are French and /at pages German.
 *
 * Idempotent. Usage: node scripts/add-be-at-crypto-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'public', 'sitemap-cryptos.xml');
const BASE = 'https://topcryptocards.eu';
const SLUG = 'cryptos'; // uniform across all 7 markets

let xml = readFileSync(FILE, 'utf-8');

if (xml.includes(`<loc>${BASE}/be/cryptos/`)) {
  console.log('be/at crypto <loc> entries already present, nothing to do.');
  process.exit(0);
}

const ids = [...xml.matchAll(new RegExp(`<loc>${BASE}/fr/cryptos/([^<]+)</loc>`, 'g'))].map(m => m[1]);
if (ids.length === 0) { console.error('No fr crypto locs found, aborting.'); process.exit(1); }
console.log(`Found ${ids.length} cryptos.`);

const today = new Date().toISOString().slice(0, 10);

function hreflangLines(id) {
  return [
    `    <xhtml:link rel="alternate" hreflang="fr" href="${BASE}/fr/${SLUG}/${id}"/>`,
    `    <xhtml:link rel="alternate" hreflang="fr-BE" href="${BASE}/be/${SLUG}/${id}"/>`,
    `    <xhtml:link rel="alternate" hreflang="de" href="${BASE}/de/${SLUG}/${id}"/>`,
    `    <xhtml:link rel="alternate" hreflang="de-AT" href="${BASE}/at/${SLUG}/${id}"/>`,
    `    <xhtml:link rel="alternate" hreflang="es" href="${BASE}/es/${SLUG}/${id}"/>`,
    `    <xhtml:link rel="alternate" hreflang="it" href="${BASE}/it/${SLUG}/${id}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en-GB" href="${BASE}/en/${SLUG}/${id}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/fr/${SLUG}/${id}"/>`,
  ].join('\n');
}

function urlBlock(market, id) {
  return `  <url><loc>${BASE}/${market}/${SLUG}/${id}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority>\n${hreflangLines(id)}\n  </url>`;
}

const additions = [];
for (const id of ids) {
  additions.push(urlBlock('be', id));
  additions.push(urlBlock('at', id));
}

xml = xml.replace('</urlset>', additions.join('\n') + '\n</urlset>');
writeFileSync(FILE, xml, 'utf-8');
console.log(`Added ${additions.length} <loc> entries (${ids.length} be + ${ids.length} at).`);
