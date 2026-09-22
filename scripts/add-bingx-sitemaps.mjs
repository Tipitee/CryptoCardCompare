/**
 * add-bingx-sitemaps.mjs
 * Ajoute les URL BingX (hub marque + avis) à sitemap-brands.xml et
 * sitemap-reviews.xml (statiques, non régénérés en CI). 7 marchés EEE — PAS 'en'
 * (BingX indisponible au UK). Idempotent : ne réinsère pas si déjà présent.
 * Puis lance regen-sitemap-compare.mjs pour les 3 comparatifs (depuis l'allowlist).
 *
 *   node scripts/add-bingx-sitemaps.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const BASE = 'https://topcryptocards.eu';
const TODAY = new Date().toISOString().slice(0, 10);

const MARKETS = ['fr', 'be', 'de', 'at', 'es', 'it', 'pt']; // EEE, pas 'en'
const BCP47 = { fr: 'fr', be: 'fr-BE', de: 'de', at: 'de-AT', es: 'es', it: 'it', pt: 'pt-PT' };
const BRAND_SEG = { fr: 'marques', be: 'marques', de: 'marken', at: 'marken', es: 'marcas', it: 'marche', pt: 'marcas' };
const REVIEW_SEG = { fr: 'avis', be: 'avis', de: 'bewertungen', at: 'bewertungen', es: 'opiniones', it: 'recensioni', pt: 'analises' };

function hreflangs(seg, slug) {
  const links = MARKETS.map(m =>
    `    <xhtml:link rel="alternate" hreflang="${BCP47[m]}" href="${BASE}/${m}/${seg[m]}/${slug}"/>`
  ).join('\n');
  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/fr/${seg.fr}/${slug}"/>`;
}

function urlBlock(m, seg, slug) {
  return `  <url><loc>${BASE}/${m}/${seg[m]}/${slug}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>
${hreflangs(seg, slug)}
  </url>\n`;
}

function inject(file, seg, slug) {
  const path = join(PUBLIC, file);
  let xml = readFileSync(path, 'utf8');
  if (xml.includes(`/${seg.fr}/${slug}</loc>`)) {
    console.log(`↷ ${file} : ${slug} déjà présent, saut.`);
    return;
  }
  const blocks = MARKETS.map(m => urlBlock(m, seg, slug)).join('');
  xml = xml.replace('</urlset>', blocks + '</urlset>');
  writeFileSync(path, xml);
  console.log(`✓ ${file} : +${MARKETS.length} URL pour ${slug}`);
}

inject('sitemap-brands.xml', BRAND_SEG, 'bingx');
inject('sitemap-reviews.xml', REVIEW_SEG, 'bingx-metal-card');

// Comparatifs : régénère depuis l'allowlist (inclut désormais les 3 paires BingX)
console.log('→ regen sitemap-compare depuis l\'allowlist…');
execSync('node scripts/regen-sitemap-compare.mjs', { cwd: join(PUBLIC, '..'), stdio: 'inherit' });
