#!/usr/bin/env node
/**
 * Régénère public/sitemap-compare.xml pour les 7 marchés (fr, be, de, at, es, it, en).
 * Préserve exactement les paires déjà présentes (allowlistées) — extrait les slugs
 * des <loc> existants, puis réémet 7 entrées <url> par paire avec le cluster
 * hreflang complet (fr, fr-BE, de, de-AT, es, it, en-GB, x-default→fr).
 *
 * Aucun réseau requis. Idempotent. Lancer : node scripts/regen-sitemap-compare.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('../public/sitemap-compare.xml', import.meta.url);
const BASE = 'https://topcryptocards.eu';
const TODAY = new Date().toISOString().slice(0, 10);

// Segment d'URL "comparer" par marché (be→comparer comme fr, at→vergleichen comme de)
const SEG = { fr: 'comparer', be: 'comparer', de: 'vergleichen', at: 'vergleichen', es: 'comparar', it: 'confrontare', en: 'compare' };
// Code hreflang BCP 47 par marché
const HL = { fr: 'fr', be: 'fr-BE', de: 'de', at: 'de-AT', es: 'es', it: 'it', en: 'en-GB' };
const LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en'];

const xml = readFileSync(FILE, 'utf8');

// Extrait les slugs de paires uniques depuis tous les <loc>
const pairs = new Set();
for (const m of xml.matchAll(/<loc>https:\/\/topcryptocards\.eu\/[a-z]+\/[a-z]+\/([a-z0-9-]+-vs-[a-z0-9-]+)<\/loc>/g)) {
  pairs.add(m[1]);
}
const sorted = [...pairs].sort();

const alt = (slug) =>
  LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${HL[l]}" href="${BASE}/${l}/${SEG[l]}/${slug}"/>`).join('\n') +
  `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/fr/${SEG.fr}/${slug}"/>`;

let body = '';
for (const slug of sorted) {
  for (const l of LANGS) {
    body += `  <url>
    <loc>${BASE}/${l}/${SEG[l]}/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
${alt(slug)}
  </url>
`;
  }
}

const out = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}</urlset>
`;

writeFileSync(FILE, out);
console.log(`sitemap-compare.xml régénéré : ${sorted.length} paires × ${LANGS.length} marchés = ${sorted.length * LANGS.length} URLs`);
