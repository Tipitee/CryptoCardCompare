#!/usr/bin/env node
/**
 * prune-discontinued-brands-sitemap.mjs
 * Removes <url> blocks for discontinued brands from public/sitemap-brands.xml.
 * Those brand pages render noindex (0 cards), so advertising them in the sitemap
 * sends Google a contradictory signal ("indexing issues detected" in GSC).
 * Idempotent. Run from repo root:  node scripts/prune-discontinued-brands-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FP = path.resolve(__dirname, '..', 'public', 'sitemap-brands.xml');
const DISCONTINUED = ['binance', 'wirex', 'brighty'];

let xml = fs.readFileSync(FP, 'utf-8');
const before = (xml.match(/<url>/g) || []).length;

// Remove each <url>…</url> block whose <loc> ends in a discontinued brand slug.
const slug = DISCONTINUED.join('|');
const re = new RegExp(`[ \\t]*<url><loc>https://topcryptocards\\.eu/[a-z]{2}/[a-z]+/(?:${slug})</loc>[\\s\\S]*?</url>\\n?`, 'g');
xml = xml.replace(re, '');

const after = (xml.match(/<url>/g) || []).length;
fs.writeFileSync(FP, xml, 'utf-8');
console.log(`Removed ${before - after} <url> blocks (${before} → ${after}) for: ${DISCONTINUED.join(', ')}`);

// Sanity: no residual references to the discontinued brand slugs.
const residual = DISCONTINUED.filter(b => new RegExp(`/${b}[<"/]`).test(xml));
console.log(residual.length ? `⚠️  residual refs still present: ${residual.join(', ')}` : 'No residual references. Clean.');
