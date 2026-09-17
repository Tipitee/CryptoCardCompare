/**
 * gen-card-sitemaps.mjs  (Supabase-driven, market-aware)
 *
 * Génère les 8 sitemaps de fiches cartes (fr/be/de/at/es/it/en/pt) en ne listant,
 * POUR CHAQUE MARCHÉ, que les cartes réellement disponibles dans ce marché
 * (cards.markets contient le code marché) ET non discontinuées (status ≠ discontinued).
 * Le hreflang de chaque carte ne pointe que vers les marchés où elle est dispo.
 *
 * → aligne le sitemap sur ce que le site rend réellement (200 + contenu),
 *   ce qui élimine les 404 / soft-404 "carte non dispo dans ce marché".
 *
 * Usage :
 *   set -a && source .env && set +a
 *   node scripts/gen-card-sitemaps.mjs
 *
 * Env : SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (ou ANON en secours).
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
const BASE = 'https://topcryptocards.eu';
const TODAY = new Date().toISOString().slice(0, 10);

const SURL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SKEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!SURL || !SKEY) { console.error('❌ env manquant : SUPABASE_URL + (SERVICE ou ANON) key'); process.exit(1); }
const sb = createClient(SURL, SKEY);

// Segment URL des fiches par marché + code hreflang BCP 47.
const SEG = { fr: 'cartes', be: 'cartes', de: 'karten', at: 'karten', es: 'tarjetas', it: 'carte', en: 'cards', pt: 'cartoes' };
const BCP47 = { fr: 'fr-FR', be: 'fr-BE', de: 'de-DE', at: 'de-AT', es: 'es-ES', it: 'it-IT', en: 'en-GB', pt: 'pt-PT' };
const LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en', 'pt'];

async function main() {
  const { data, error } = await sb
    .from('cards')
    .select('id, markets, status')
    .neq('status', 'discontinued');
  if (error) { console.error('Fetch error:', error.message); process.exit(1); }

  // Pour chaque marché : liste des slugs dispo. Et pour chaque slug : marchés dispo (hreflang).
  const byMarket = Object.fromEntries(LANGS.map(l => [l, []]));
  const marketsForSlug = new Map();

  for (const c of data || []) {
    const mk = Array.isArray(c.markets) ? c.markets.filter(m => LANGS.includes(m)) : [];
    if (mk.length === 0) continue; // carte sans marché → n'apparaît nulle part (évite les soft-404)
    marketsForSlug.set(c.id, mk);
    for (const m of mk) byMarket[m].push(c.id);
  }

  let totalUrls = 0;
  for (const lang of LANGS) {
    const slugs = byMarket[lang].sort();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
    for (const slug of slugs) {
      const avail = marketsForSlug.get(slug);            // marchés où la carte existe
      const hreflangs = avail
        .map(l => `    <xhtml:link rel="alternate" hreflang="${BCP47[l]}" href="${BASE}/${l}/${SEG[l]}/${slug}"/>`)
        .join('\n');
      const xdefault = avail.includes('fr') ? 'fr' : avail[0];
      xml += `  <url>
    <loc>${BASE}/${lang}/${SEG[lang]}/${slug}</loc>
${hreflangs}
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/${xdefault}/${SEG[xdefault]}/${slug}"/>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
    xml += `</urlset>`;
    writeFileSync(join(PUBLIC, `sitemap-cards-${lang}.xml`), xml, 'utf8');
    console.log(`✓ sitemap-cards-${lang}.xml — ${slugs.length} cartes`);
    totalUrls += slugs.length;
  }
  console.log(`\nTotal : ${totalUrls} URL de fiches sur ${LANGS.length} marchés.`);
}

main();
