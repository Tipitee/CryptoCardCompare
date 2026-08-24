#!/usr/bin/env node
/**
 * fix-static-pages-sitemap.mjs
 *
 * Gives the four language-agnostic static pages (about, contact,
 * virtual-vs-physical, fee index) complete and consistent sitemap coverage for
 * all 7 markets. Previously they were listed for only a subset of languages,
 * yet each page advertises all 7 via hreflang, so the missing variants 404'd.
 *
 * Each page has real localized content for every market (be reuses fr, at
 * reuses de; the fee index even ships dedicated BE/AT copy), so every URL here
 * resolves to a proper localized page, never English on a non-en URL.
 *
 * Strategy: drop any existing <url> block for these pages, then re-add a clean
 * 7-market block per page with self-consistent hreflang.
 *
 * Idempotent. Usage: node scripts/fix-static-pages-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'public', 'sitemap-pages.xml');
const B = 'https://topcryptocards.eu';
const MARKETS = [['fr', 'fr'], ['fr-BE', 'be'], ['de', 'de'], ['de-AT', 'at'], ['es', 'es'], ['it', 'it'], ['en-GB', 'en']];

const PAGES = [
  { key: 'about',    priority: '0.6', changefreq: 'monthly', slugs: { fr: 'a-propos', be: 'a-propos', de: 'ueber-uns', at: 'ueber-uns', es: 'sobre-nosotros', it: 'chi-siamo', en: 'about' } },
  { key: 'contact',  priority: '0.5', changefreq: 'monthly', slugs: { fr: 'contact', be: 'contact', de: 'kontakt', at: 'kontakt', es: 'contacto', it: 'contatti', en: 'contact' } },
  { key: 'vvp',      priority: '0.7', changefreq: 'monthly', slugs: { fr: 'carte-crypto-virtuelle-vs-physique', be: 'carte-crypto-virtuelle-vs-physique', de: 'virtuelle-vs-physische-krypto-karte', at: 'virtuelle-vs-physische-krypto-karte', es: 'tarjeta-crypto-virtual-vs-fisica', it: 'carta-crypto-virtuale-vs-fisica', en: 'virtual-vs-physical-crypto-card' } },
  { key: 'feeindex', priority: '0.8', changefreq: 'weekly',  slugs: { fr: 'frais-cartes-crypto', be: 'frais-cartes-crypto', de: 'krypto-karten-gebuehren', at: 'krypto-karten-gebuehren', es: 'tarifas-tarjetas-crypto', it: 'tariffe-carte-crypto', en: 'crypto-card-fees' } },
];

const today = new Date().toISOString().slice(0, 10);

// All target loc URLs (used both to purge old blocks and detect idempotency)
const targetLocs = new Set();
for (const p of PAGES) for (const [, m] of MARKETS) targetLocs.add(`${B}/${m}/${p.slugs[m]}`);

let xml = readFileSync(FILE, 'utf-8');

// Purge existing <url> blocks whose <loc> is one of the target URLs
let purged = 0;
xml = xml.replace(/[ \t]*<url>[\s\S]*?<\/url>\n?/g, (block) => {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (loc && targetLocs.has(loc)) { purged++; return ''; }
  return block;
});

function block(p) {
  const hl = MARKETS.map(([h, m]) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${B}/${m}/${p.slugs[m]}"/>`).join('\n')
    + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${B}/fr/${p.slugs.fr}"/>`;
  return MARKETS.map(([, m]) =>
    `  <url>\n    <loc>${B}/${m}/${p.slugs[m]}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n${hl}\n  </url>`
  ).join('\n');
}

const additions = PAGES.map(block).join('\n');
xml = xml.replace('</urlset>', additions + '\n</urlset>');
writeFileSync(FILE, xml, 'utf-8');
console.log(`Purged ${purged} old blocks, added ${PAGES.length * MARKETS.length} fresh (4 pages x 7 markets).`);
