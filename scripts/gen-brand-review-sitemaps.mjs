/**
 * gen-brand-review-sitemaps.mjs  (Supabase-driven, market-aware, UNION/ADDITIF)
 *
 * But : toute NOUVELLE carte/marque apparaît automatiquement dans
 * sitemap-brands.xml et sitemap-reviews.xml, sans édition manuelle — tout en
 * garantissant ZÉRO régression sur ce qui est déjà indexé.
 *
 * Mode UNION (et non « régénération totale ») choisi délibérément :
 *   • On PRÉSERVE verbatim chaque bloc <url> déjà présent dans le fichier.
 *   • On AJOUTE uniquement les marques (hub /{m}/{seg}/{brandId}) et les avis
 *     (/{m}/{seg}/{reviewSlug}) qui NE sont PAS encore dans le sitemap.
 * Pourquoi : certains avis légitimes (binance, coinbase, wirex, brighty…) ont une
 * page 200 rendue depuis des données statiques (CARD_REVIEWS / cardReviewsI18n)
 * alors que leur carte n'a pas de brand_id en base. Une régénération totale
 * pilotée par brand_id les effacerait à tort. L'union ne peut jamais les perdre.
 *
 *   - sitemap-brands  : un hub par marché où fetchCardsByBrand(brandId) renvoie
 *                       ≥1 carte active (markets des cartes de la marque) — aligné
 *                       exactement sur la condition d'indexation de BrandPage.tsx.
 *   - sitemap-reviews : slug d'avis lu dans BRAND_REVIEW_SLUG (BrandPage.tsx),
 *                       sur les marchés où la marque a une carte active.
 * hreflang market-aware (uniquement les marchés dispo) + x-default fr.
 *
 * Non bloquant : si Supabase est injoignable, on laisse les fichiers intacts et
 * on sort en succès (un aléa nocturne ne doit pas casser le déploiement).
 *
 * Usage : set -a && source .env && set +a && node scripts/gen-brand-review-sitemaps.mjs
 * Env : SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY / ANON.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const BASE = 'https://topcryptocards.eu';
const TODAY = new Date().toISOString().slice(0, 10);

const SURL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SKEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!SURL || !SKEY) { console.error('❌ env manquant : SUPABASE_URL + (SERVICE ou ANON) key'); process.exit(1); }
const sb = createClient(SURL, SKEY);

const LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en', 'pt'];
const BCP47 = { fr: 'fr', be: 'fr-BE', de: 'de', at: 'de-AT', es: 'es', it: 'it', en: 'en-GB', pt: 'pt-PT' };
const BRAND_SEG = { fr: 'marques', be: 'marques', de: 'marken', at: 'marken', es: 'marcas', it: 'marche', en: 'brands', pt: 'marcas' };
const REVIEW_SEG = { fr: 'avis', be: 'avis', de: 'bewertungen', at: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews', pt: 'analises' };

const HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Un bloc <url> market-aware : hreflang uniquement vers les marchés dispo.
function urlBlock(seg, slug, markets) {
  const avail = LANGS.filter(l => markets.has(l));
  const xdefault = avail.includes('fr') ? 'fr' : avail[0];
  return avail.map(l => {
    const hl = avail.map(a => `    <xhtml:link rel="alternate" hreflang="${BCP47[a]}" href="${BASE}/${a}/${seg[a]}/${slug}"/>`).join('\n');
    return `  <url>
    <loc>${BASE}/${l}/${seg[l]}/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
${hl}
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/${xdefault}/${seg[xdefault]}/${slug}"/>
  </url>
`;
  }).join('');
}

// Lit la map BRAND_REVIEW_SLUG (brandId → reviewSlug) depuis BrandPage.tsx,
// pour rester la seule source de vérité (pas de duplication).
function readBrandReviewSlugs() {
  const src = readFileSync(join(ROOT, 'src/pages/BrandPage.tsx'), 'utf8');
  const m = src.match(/const BRAND_REVIEW_SLUG[^=]*=\s*\{([\s\S]*?)\};/);
  if (!m) throw new Error('BRAND_REVIEW_SLUG introuvable dans BrandPage.tsx');
  const map = {};
  for (const pair of m[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) map[pair[1]] = pair[2];
  return map;
}

// Parse un sitemap existant : renvoie les blocs <url> verbatim + l'ensemble des
// <loc> déjà présents (pour ne jamais dupliquer ni retirer).
function parseExisting(file) {
  let xml;
  try { xml = readFileSync(join(PUBLIC, file), 'utf8'); }
  catch { return { blocks: [], locs: new Set() }; }
  const blocks = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map(m => m[0]);
  const locs = new Set();
  for (const b of blocks) {
    const m = b.match(/<loc>([^<]+)<\/loc>/);
    if (m) locs.add(m[1]);
  }
  return { blocks, locs };
}

// Reconstruit le fichier : blocs existants (verbatim) + nouveaux blocs.
function writeUnion(file, existingBlocks, extra) {
  const body = existingBlocks.join('\n') + (extra ? '\n' + extra : '\n');
  writeFileSync(join(PUBLIC, file), HEADER + body + '</urlset>\n');
}

async function main() {
  const { data, error } = await sb.from('cards').select('brand_id, markets, status').neq('status', 'discontinued');
  if (error) {
    console.warn(`⚠ Supabase injoignable — sitemaps brands/reviews laissés intacts : ${error.message}`);
    return; // non bloquant
  }

  // brandId → Set(marchés dispo, d'après les cartes actives de la marque)
  const brandMarkets = new Map();
  for (const c of data || []) {
    if (!c.brand_id) continue;
    const mk = (c.markets || []).filter(m => LANGS.includes(m));
    if (!brandMarkets.has(c.brand_id)) brandMarkets.set(c.brand_id, new Set());
    mk.forEach(m => brandMarkets.get(c.brand_id).add(m));
  }
  if (brandMarkets.size === 0) {
    console.warn('⚠ 0 marque avec brand_id renvoyée — sitemaps laissés intacts (données suspectes).');
    return;
  }

  // ── sitemap-brands (union) ──
  const brandsExisting = parseExisting('sitemap-brands.xml');
  let brandsExtra = '';
  let brandsAdded = 0;
  for (const [bid, markets] of [...brandMarkets].sort()) {
    if (markets.size === 0) continue;
    // Marque déjà présente (au moins un de ses marchés) → on ne touche pas.
    const present = LANGS.some(l => markets.has(l) && brandsExisting.locs.has(`${BASE}/${l}/${BRAND_SEG[l]}/${bid}`));
    if (present) continue;
    brandsExtra += urlBlock(BRAND_SEG, bid, markets);
    brandsAdded++;
    console.log(`  + marque : ${bid} (${[...markets].sort().join(',')})`);
  }
  if (brandsAdded) writeUnion('sitemap-brands.xml', brandsExisting.blocks, brandsExtra);
  console.log(`✓ sitemap-brands.xml — ${brandsAdded} marque(s) ajoutée(s) (${brandsExisting.blocks.length} conservée(s))`);

  // ── sitemap-reviews (union) ──
  const reviewSlugs = readBrandReviewSlugs();
  const reviewsExisting = parseExisting('sitemap-reviews.xml');
  let reviewsExtra = '';
  let reviewsAdded = 0;
  for (const [bid, slug] of Object.entries(reviewSlugs)) {
    const markets = brandMarkets.get(bid);
    if (!markets || markets.size === 0) continue; // marque sans carte active → pas d'avis ajouté
    const present = LANGS.some(l => markets.has(l) && reviewsExisting.locs.has(`${BASE}/${l}/${REVIEW_SEG[l]}/${slug}`));
    if (present) continue;
    reviewsExtra += urlBlock(REVIEW_SEG, slug, markets);
    reviewsAdded++;
    console.log(`  + avis : ${slug} (${[...markets].sort().join(',')})`);
  }
  if (reviewsAdded) writeUnion('sitemap-reviews.xml', reviewsExisting.blocks, reviewsExtra);
  console.log(`✓ sitemap-reviews.xml — ${reviewsAdded} avis ajouté(s) (${reviewsExisting.blocks.length} conservé(s))`);
}

main();
