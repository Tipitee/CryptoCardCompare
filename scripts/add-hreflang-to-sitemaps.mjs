#!/usr/bin/env node
/**
 * add-hreflang-to-sitemaps.mjs
 *
 * Adds <xhtml:link rel="alternate" hreflang="..."> to 6 sitemaps:
 *   sitemap-blog.xml, sitemap-pages.xml, sitemap-reviews.xml,
 *   sitemap-compare.xml, sitemap-brands.xml, sitemap-cryptos.xml
 *
 * Grouping strategies per sitemap:
 *   - reviews, compare, brands(individual), cryptos(individual):
 *       group by last URL segment (card-id / crypto-id / brand-id are
 *       identical across all 5 languages)
 *   - blog:
 *       group by consecutive blocks (slugs differ per language, but the
 *       sitemap lists fr/de/es/it/en variants back-to-back)
 *   - pages:
 *       uses a route-equivalence table for the localized tool pages
 *       (comparer/vergleich/comparar/confronto/compare etc.)
 *
 * Usage:
 *   node scripts/add-hreflang-to-sitemaps.mjs            # process all
 *   node scripts/add-hreflang-to-sitemaps.mjs --dry-run  # show changes, don't write
 *   node scripts/add-hreflang-to-sitemaps.mjs sitemap-blog.xml  # single file
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const DRY_RUN  = process.argv.includes('--dry-run');
const FILE_ARG = process.argv.find(a => a.endsWith('.xml'));
const LANGS    = ['fr', 'de', 'es', 'it', 'en'];

/* ── Route equivalence map for sitemap-pages.xml ───────────────────────── */
const ROUTE_CANONICAL = {
  '': 'home',
  'comparer': 'compare', 'vergleich': 'compare', 'comparar': 'compare',
  'confronto': 'compare', 'compare': 'compare',
  'simulateur': 'simulator', 'simulator': 'simulator',
  'simulador': 'simulator', 'simulatore': 'simulator',
  'recommandation': 'recommendation', 'empfehlung': 'recommendation',
  'recomendacion': 'recommendation', 'raccomandazione': 'recommendation',
  'recommendation': 'recommendation',
  'favoris': 'favorites', 'favoriten': 'favorites', 'favoritos': 'favorites',
  'preferiti': 'favorites', 'favorites': 'favorites',
  'blog': 'blog',
  'cryptos': 'cryptos',
  'marques': 'brands-list', 'marken': 'brands-list', 'marcas': 'brands-list',
  'marche': 'brands-list', 'brands': 'brands-list',
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function extractLang(url) {
  const path = url.replace('https://topcryptocards.eu', '');
  const parts = path.split('/').filter(Boolean);
  return LANGS.includes(parts[0]) ? parts[0] : null;
}

function buildHreflangLines(group) {
  const lines = group.map(({ url, lang }) =>
    `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`
  );
  const frEntry = group.find(g => g.lang === 'fr');
  if (frEntry) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${frEntry.url}"/>`);
  }
  return lines.join('\n');
}

function ensureXmlnsXhtml(xml) {
  if (xml.includes('xmlns:xhtml')) return xml;
  return xml.replace(/<urlset([^>]*)>/, '<urlset$1\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">');
}

/* ── Grouping ────────────────────────────────────────────────────────────── */

// Group by last URL segment (same across langs: card-id, brand-id, crypto-id)
function groupBySuffix(urls) {
  const map = new Map();
  for (const url of urls) {
    const lang = extractLang(url);
    if (!lang) continue;
    const parts = url.replace('https://topcryptocards.eu', '').split('/').filter(Boolean);
    const suffix = parts[parts.length - 1];
    if (!map.has(suffix)) map.set(suffix, []);
    map.get(suffix).push({ url, lang });
  }
  return [...map.values()].filter(g => g.length > 1);
}

// Group consecutive blocks — when a lang repeats, start a new group
// Used for blog (slugs differ per lang but variants are back-to-back)
function groupByConsecutive(urls) {
  const groups = [];
  let current = [];
  const seenLangs = new Set();

  for (const url of urls) {
    const lang = extractLang(url);
    if (!lang) continue;

    if (seenLangs.has(lang)) {
      if (current.length > 1) groups.push(current);
      current = [];
      seenLangs.clear();
    }
    current.push({ url, lang });
    seenLangs.add(lang);
  }
  if (current.length > 1) groups.push(current);
  return groups;
}

// Group pages by route equivalence table
function groupByEquivalence(urls) {
  const map = new Map();
  for (const url of urls) {
    const lang = extractLang(url);
    const parts = url.replace('https://topcryptocards.eu', '').split('/').filter(Boolean);

    let canonical;
    if (parts.length === 0) continue; // root /
    if (parts.length === 1) {
      canonical = 'home'; // /fr /de etc.
    } else if (parts.length === 2) {
      canonical = ROUTE_CANONICAL[parts[1]] ?? `unique:${parts[1]}`;
    } else {
      canonical = parts[parts.length - 1]; // deep pages: group by last segment
    }

    if (!lang || !canonical) continue;
    if (!map.has(canonical)) map.set(canonical, []);
    map.get(canonical).push({ url, lang });
  }
  return [...map.values()].filter(g => g.length > 1);
}

/* ── Core: inject hreflang into each matching <url> block ───────────────── */
function applyHreflangToXml(xml, groups) {
  // Build a lookup: url → group
  const urlToGroup = new Map();
  for (const group of groups) {
    for (const entry of group) urlToGroup.set(entry.url, group);
  }

  let injected = 0;

  // Process each <url>…</url> block independently (no cross-block regex)
  xml = xml.replace(/(<url>[\s\S]*?<\/url>)/g, (block) => {
    const locMatch = block.match(/<loc>(https?:\/\/[^<]+)<\/loc>/);
    if (!locMatch) return block;

    const url = locMatch[1];
    const group = urlToGroup.get(url);
    if (!group) return block;
    if (block.includes('xhtml:link')) return block; // already done

    injected++;
    const hreflang = buildHreflangLines(group);
    return block.replace('</url>', `${hreflang}\n  </url>`);
  });

  return { xml, injected };
}

/* ── Process one sitemap ─────────────────────────────────────────────────── */
function processSitemap(filename, strategy) {
  const filepath = join(PUBLIC, filename);
  let xml = readFileSync(filepath, 'utf-8');

  const urls = [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);
  if (urls.length === 0) { console.log(`  ${filename}: no URLs found`); return; }

  let groups;
  switch (strategy) {
    case 'suffix':      groups = groupBySuffix(urls);      break;
    case 'consecutive': groups = groupByConsecutive(urls);  break;
    case 'pages':       groups = groupByEquivalence(urls);  break;
    default: throw new Error(`Unknown strategy: ${strategy}`);
  }

  console.log(`  ${filename}: ${urls.length} URLs → ${groups.length} groups`);

  xml = ensureXmlnsXhtml(xml);
  const { xml: newXml, injected } = applyHreflangToXml(xml, groups);

  console.log(`    → ${injected} URL blocks tagged (out of ${groups.reduce((n, g) => n + g.length, 0)} total in groups)`);

  if (!DRY_RUN && injected > 0) {
    writeFileSync(filepath, newXml, 'utf-8');
    console.log(`    → written`);
  }
}

/* ── Main ────────────────────────────────────────────────────────────────── */
const SITEMAPS = [
  { file: 'sitemap-reviews.xml',  strategy: 'suffix'      },
  { file: 'sitemap-brands.xml',   strategy: 'suffix'      },
  { file: 'sitemap-cryptos.xml',  strategy: 'suffix'      },
  { file: 'sitemap-compare.xml',  strategy: 'suffix'      },
  { file: 'sitemap-blog.xml',     strategy: 'consecutive' },
  { file: 'sitemap-pages.xml',    strategy: 'pages'       },
];

console.log(`\n🌐 add-hreflang-to-sitemaps.mjs${DRY_RUN ? ' (DRY RUN — no files written)' : ''}\n`);

for (const { file, strategy } of SITEMAPS) {
  if (FILE_ARG && FILE_ARG !== file) continue;
  try {
    processSitemap(file, strategy);
  } catch (err) {
    console.error(`  ❌ ${file}: ${err.message}`);
  }
}

console.log(`\n${DRY_RUN ? 'Dry run complete — run without --dry-run to write files.' : 'Done.'}\n`);
