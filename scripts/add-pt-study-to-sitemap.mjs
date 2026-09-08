#!/usr/bin/env node
/**
 * add-pt-study-to-sitemap.mjs — idempotent, scoped strictly to /etudes/ blocks.
 * Adds pt-PT hreflang to each /etudes/ <url> block and appends a <url> for the PT
 * study page. Non-etudes blocks are left untouched.
 * Run from repo root:  node scripts/add-pt-study-to-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FP = path.resolve(__dirname, '..', 'public', 'sitemap-pages.xml');
const PT = 'https://topcryptocards.eu/etudes/cartoes-crypto-2026';
const PT_HL = `    <xhtml:link rel="alternate" hreflang="pt-PT" href="${PT}"/>`;

let xml = fs.readFileSync(FP, 'utf-8');

// Split into url blocks, keeping delimiters, and only edit /etudes/ ones.
const parts = xml.split(/(?=  <url>)/);
let added = 0;
const out = parts.map((block) => {
  const loc = block.match(/<loc>(https:\/\/topcryptocards\.eu\/etudes\/[^<]+)<\/loc>/);
  if (!loc) return block;                       // not an etudes block
  if (block.includes('hreflang="pt-PT"')) return block; // already done
  added++;
  return block.replace(
    /(    <xhtml:link rel="alternate" hreflang="x-default")/,
    `${PT_HL}\n$1`
  );
});
xml = out.join('');

// Append the PT study url block after the it (carte-crypto-2026) block, once.
if (!xml.includes(`<loc>${PT}</loc>`)) {
  const HL = [
    `    <xhtml:link rel="alternate" hreflang="fr" href="https://topcryptocards.eu/etudes/cartes-crypto-2026"/>`,
    `    <xhtml:link rel="alternate" hreflang="de" href="https://topcryptocards.eu/etudes/krypto-karten-2026"/>`,
    `    <xhtml:link rel="alternate" hreflang="es" href="https://topcryptocards.eu/etudes/tarjetas-cripto-2026"/>`,
    `    <xhtml:link rel="alternate" hreflang="it" href="https://topcryptocards.eu/etudes/carte-crypto-2026"/>`,
    PT_HL,
    `    <xhtml:link rel="alternate" hreflang="en-GB" href="https://topcryptocards.eu/etudes/crypto-cards-2026"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="https://topcryptocards.eu/etudes/cartes-crypto-2026"/>`,
  ].join('\n');
  const block = `  <url>\n    <loc>${PT}</loc>\n    <lastmod>2026-08-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>\n${HL}\n  </url>\n`;
  const anchor = /(  <url>\n    <loc>https:\/\/topcryptocards\.eu\/etudes\/carte-crypto-2026<\/loc>[\s\S]*?\n  <\/url>\n)/;
  xml = xml.replace(anchor, `$1${block}`);
}

fs.writeFileSync(FP, xml, 'utf-8');
console.log(`Done. etudes blocks given pt-PT: ${added}; PT url present: ${xml.includes(`<loc>${PT}</loc>`)}; total pt-PT: ${(xml.match(/hreflang="pt-PT"/g)||[]).length}`);
