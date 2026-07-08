/**
 * generate-sitemap-thematic.mjs
 * Regenerates public/sitemap-thematic.xml with all 7 markets (fr/be/de/at/es/it/en).
 * Run: node scripts/generate-sitemap-thematic.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://topcryptocards.eu';

// All 14 themes with their slugs per market
const THEMES = {
  best: {
    fr: 'meilleure-carte-crypto',    be: 'meilleure-carte-crypto',
    de: 'beste-krypto-karte',        at: 'beste-krypto-karte',
    es: 'mejor-tarjeta-cripto',      it: 'migliore-carta-cripto',
    en: 'best-crypto-card',
    priority: '0.9', changefreq: 'weekly',
  },
  cashback: {
    fr: 'carte-crypto-cashback',     be: 'carte-crypto-cashback',
    de: 'krypto-karte-cashback',     at: 'krypto-karte-cashback',
    es: 'tarjeta-cripto-cashback',   it: 'carta-cripto-cashback',
    en: 'crypto-card-cashback',
    priority: '0.9', changefreq: 'weekly',
  },
  'no-fees': {
    fr: 'carte-crypto-sans-frais',   be: 'carte-crypto-sans-frais',
    de: 'krypto-karte-ohne-jahresgebuehr', at: 'krypto-karte-ohne-jahresgebuehr',
    es: 'tarjeta-cripto-sin-comisiones',   it: 'carta-cripto-senza-commissioni',
    en: 'crypto-card-no-fees',
    priority: '0.8', changefreq: 'weekly',
  },
  'no-staking': {
    fr: 'carte-crypto-sans-staking', be: 'carte-crypto-sans-staking',
    de: 'krypto-karte-ohne-staking', at: 'krypto-karte-ohne-staking',
    es: 'tarjeta-cripto-sin-staking', it: 'carta-cripto-senza-staking',
    en: 'crypto-card-no-staking',
    priority: '0.8', changefreq: 'weekly',
  },
  france: {
    fr: 'cartes-crypto-france',      be: 'cartes-crypto-france',
    de: 'krypto-karten-deutschland', at: 'krypto-karten-deutschland',
    es: 'tarjetas-crypto-espana',    it: 'carte-crypto-italia',
    en: 'crypto-cards-europe',
    priority: '0.8', changefreq: 'weekly',
  },
  virtual: {
    fr: 'carte-crypto-virtuelle',    be: 'carte-crypto-virtuelle',
    de: 'virtuelle-krypto-karte',    at: 'virtuelle-krypto-karte',
    es: 'tarjeta-crypto-virtual',    it: 'carta-crypto-virtuale',
    en: 'virtual-crypto-card',
    priority: '0.8', changefreq: 'weekly',
  },
  physical: {
    fr: 'carte-crypto-physique',     be: 'carte-crypto-physique',
    de: 'physische-krypto-karte',    at: 'physische-krypto-karte',
    es: 'tarjeta-crypto-fisica',     it: 'carta-crypto-fisica',
    en: 'physical-crypto-card',
    priority: '0.8', changefreq: 'weekly',
  },
  beginner: {
    fr: 'cartes-crypto-debutant',    be: 'cartes-crypto-debutant',
    de: 'krypto-karten-einsteiger',  at: 'krypto-karten-einsteiger',
    es: 'tarjetas-crypto-principiante', it: 'carte-crypto-principiante',
    en: 'beginner-crypto-cards',
    priority: '0.8', changefreq: 'weekly',
  },
  'no-kyc': {
    fr: 'carte-crypto-sans-kyc',     be: 'carte-crypto-sans-kyc',
    de: 'krypto-karte-ohne-kyc',     at: 'krypto-karte-ohne-kyc',
    es: 'tarjeta-crypto-sin-kyc',    it: 'carta-cripto-senza-kyc',
    en: 'crypto-card-no-kyc',
    priority: '0.7', changefreq: 'weekly',
  },
  '2026': {
    fr: 'carte-crypto-2026',         be: 'carte-crypto-2026',
    de: 'krypto-karte-2026',         at: 'krypto-karte-2026',
    es: 'tarjeta-cripto-2026',       it: 'carta-cripto-2026',
    en: 'best-crypto-card-2026',
    priority: '0.9', changefreq: 'weekly',
  },
  travel: {
    fr: 'carte-crypto-voyage',       be: 'carte-crypto-voyage',
    de: 'krypto-karte-reise',        at: 'krypto-karte-reise',
    es: 'tarjeta-cripto-viaje',      it: 'carta-cripto-viaggio',
    en: 'crypto-card-travel',
    priority: '0.8', changefreq: 'weekly',
  },
  rewards: {
    fr: 'carte-crypto-recompenses',  be: 'carte-crypto-recompenses',
    de: 'krypto-karte-praemien',     at: 'krypto-karte-praemien',
    es: 'tarjeta-cripto-recompensas', it: 'carta-cripto-premi',
    en: 'crypto-card-rewards',
    priority: '0.8', changefreq: 'weekly',
  },
  belgium: {
    fr: 'carte-crypto-belgique',     be: 'carte-crypto-belgique',
    de: 'krypto-karte-belgien',      at: 'krypto-karte-belgien',
    es: 'tarjeta-crypto-belgica',    it: 'carta-crypto-belgio',
    en: 'crypto-card-belgium',
    priority: '0.8', changefreq: 'weekly',
  },
  austria: {
    fr: 'carte-crypto-autriche',     be: 'carte-crypto-autriche',
    de: 'krypto-karte-oesterreich',  at: 'krypto-karte-oesterreich',
    es: 'tarjeta-crypto-austria',    it: 'carta-crypto-austria',
    en: 'crypto-card-austria',
    priority: '0.8', changefreq: 'weekly',
  },
};

const LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en'];
const TODAY = new Date().toISOString().slice(0, 10);

function urlBlock(theme, locLang, slugs) {
  const loc = `${BASE}/${locLang}/${slugs[locLang]}`;
  const hreflangs = LANGS.map(l =>
    `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}/${l}/${slugs[l]}"/>`
  ).join('\n');
  const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/fr/${slugs.fr}"/>`;

  return `  <url>
    <loc>${loc}</loc>
${hreflangs}
${xdefault}
    <lastmod>${TODAY}</lastmod>
    <changefreq>${slugs.changefreq}</changefreq>
    <priority>${slugs.priority}</priority>
  </url>`;
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

for (const [theme, slugs] of Object.entries(THEMES)) {
  for (const lang of LANGS) {
    xml += urlBlock(theme, lang, slugs) + '\n';
  }
}

xml += `</urlset>`;

const outPath = join(__dirname, '..', 'public', 'sitemap-thematic.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`✓ sitemap-thematic.xml written — ${LANGS.length * Object.keys(THEMES).length} URLs`);
