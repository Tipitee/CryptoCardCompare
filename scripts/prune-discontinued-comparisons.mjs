#!/usr/bin/env node
/**
 * prune-discontinued-comparisons.mjs
 * Comparison pages involving a discontinued card (binance/wirex/brighty) render a
 * thin "not found" state with no title/H1. This removes those pairs from the
 * prerender allowlist and their <url> blocks from sitemap-compare.xml.
 * (ComparisonPage also now noindexes any page where a card is missing.)
 * Idempotent. Run from repo root:  node scripts/prune-discontinued-comparisons.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ALLOW = path.join(ROOT, 'scripts', 'comparison-allowlist.json');
const SITEMAP = path.join(ROOT, 'public', 'sitemap-compare.xml');
const RE = /binance|wirex|brighty/;

// 1) Allowlist
const list = JSON.parse(fs.readFileSync(ALLOW, 'utf-8'));
const keptList = list.filter((s) => !RE.test(s));
fs.writeFileSync(ALLOW, JSON.stringify(keptList, null, 2) + '\n', 'utf-8');
console.log(`allowlist: ${list.length} → ${keptList.length} (removed ${list.length - keptList.length})`);

// 2) Sitemap: drop <url> blocks whose <loc> is a discontinued-card comparison
let xml = fs.readFileSync(SITEMAP, 'utf-8');
const before = (xml.match(/<url>/g) || []).length;
xml = xml.replace(
  /[ \t]*<url>\s*<loc>https:\/\/topcryptocards\.eu\/[a-z]{2}\/[a-z]+\/[a-z0-9-]*(?:binance|wirex|brighty)[a-z0-9-]*<\/loc>[\s\S]*?<\/url>\n?/g,
  ''
);
const after = (xml.match(/<url>/g) || []).length;
fs.writeFileSync(SITEMAP, xml, 'utf-8');
console.log(`sitemap-compare: ${before} → ${after} <url> blocks (removed ${before - after})`);

const residual = (xml.match(/<loc>[^<]*(binance|wirex|brighty)[^<]*<\/loc>/g) || []).length;
console.log(residual ? `⚠️  ${residual} residual <loc> still reference discontinued cards` : 'No residual discontinued <loc>. Clean.');
