#!/usr/bin/env node
/**
 * prune-discontinued.mjs — DATA-DRIVEN cleanup of discontinued brands/cards.
 *
 * Reads the live Supabase `cards` table and derives:
 *   - dead brands  = brand_id with NO active card  → their /brands/<id> hub is empty (noindex)
 *   - dead cards   = card id that is not active     → any comparison touching it renders "not found"
 * Then removes the corresponding entries so the sitemaps never advertise a noindex/thin page:
 *   - public/sitemap-brands.xml     : <url> blocks for dead-brand hubs
 *   - public/sitemap-compare.xml    : <url> blocks whose slug uses a dead card
 *   - scripts/comparison-allowlist.json : pairs using a dead card
 * Card-detail and review pages are LEFT intact (they are rich, indexable content).
 * Warns if the footer nav (Layout.tsx) still lists a dead brand.
 * Idempotent. Read-only on Supabase; rewrites the 3 local files.
 *
 *   set -a && source .env && set +a
 *   node scripts/prune-discontinued.mjs --dry-run
 *   node scripts/prune-discontinued.mjs
 *
 * Requires: SUPABASE_URL (or VITE_SUPABASE_URL) + a read key.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');
const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
if (!URL || !KEY) { console.error('❌ Missing Supabase env'); process.exit(1); }
const sb = createClient(URL, KEY);

const { data, error } = await sb.from('cards').select('id, brand_id, name, status');
if (error) { console.error('✗', error.message); process.exit(1); }
const cards = data || [];

const activeIds = new Set(cards.filter(c => c.status === 'active').map(c => c.id));
const activeBrands = new Set(cards.filter(c => c.status === 'active' && c.brand_id).map(c => c.brand_id));
const allBrands = new Set(cards.filter(c => c.brand_id).map(c => c.brand_id));
const deadBrands = [...allBrands].filter(b => !activeBrands.has(b));

console.log(`\nActive cards: ${activeIds.size} | brands total: ${allBrands.size} | dead brands (no active card): ${deadBrands.length}`);
console.log(`Dead brands: ${deadBrands.join(', ') || '—'}`);

const isDeadComparisonSlug = (slug) => {
  const i = slug.indexOf('-vs-');
  if (i < 0) return false;
  const a = slug.slice(0, i), b = slug.slice(i + 4);
  return !activeIds.has(a) || !activeIds.has(b);
};

let touched = 0;
const write = (fp, next, before, label) => {
  if (next === before) { console.log(`  unchanged: ${label}`); return; }
  if (!DRY) fs.writeFileSync(fp, next, 'utf-8');
  touched++;
  console.log(`  ${DRY ? '(dry) would update' : 'updated'}: ${label}`);
};

// 1) sitemap-brands.xml — drop dead-brand hub blocks
{
  const fp = path.join(ROOT, 'public', 'sitemap-brands.xml');
  const xml = fs.readFileSync(fp, 'utf-8');
  const before = (xml.match(/<url>/g) || []).length;
  const kept = xml.split(/(?=\s*<url>)/).filter(block => {
    const loc = block.match(/<loc>https:\/\/topcryptocards\.eu\/[a-z]{2}\/[a-z]+\/([a-z0-9-]+)<\/loc>/);
    return !(loc && deadBrands.includes(loc[1]));
  }).join('');
  const after = (kept.match(/<url>/g) || []).length;
  console.log(`\nsitemap-brands.xml: ${before} → ${after} <url> (removed ${before - after})`);
  write(fp, kept, xml, 'sitemap-brands.xml');
}

// 2) sitemap-compare.xml — drop blocks whose slug uses a dead card
{
  const fp = path.join(ROOT, 'public', 'sitemap-compare.xml');
  const xml = fs.readFileSync(fp, 'utf-8');
  const before = (xml.match(/<url>/g) || []).length;
  const kept = xml.split(/(?=\s*<url>)/).filter(block => {
    const loc = block.match(/<loc>https:\/\/topcryptocards\.eu\/[a-z]{2}\/[a-z]+\/([a-z0-9-]+)<\/loc>/);
    return !(loc && isDeadComparisonSlug(loc[1]));
  }).join('');
  const after = (kept.match(/<url>/g) || []).length;
  console.log(`sitemap-compare.xml: ${before} → ${after} <url> (removed ${before - after})`);
  write(fp, kept, xml, 'sitemap-compare.xml');
}

// 3) comparison-allowlist.json — drop pairs using a dead card
{
  const fp = path.join(ROOT, 'scripts', 'comparison-allowlist.json');
  const list = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  const kept = list.filter(s => !isDeadComparisonSlug(s));
  console.log(`comparison-allowlist.json: ${list.length} → ${kept.length} (removed ${list.length - kept.length})`);
  write(fp, JSON.stringify(kept, null, 2) + '\n', JSON.stringify(list, null, 2) + '\n', 'comparison-allowlist.json');
}

// 4) Warn if footer nav (Layout.tsx) lists a dead brand
{
  const layout = fs.readFileSync(path.join(ROOT, 'src', 'components', 'Layout.tsx'), 'utf-8');
  const navIds = [...layout.matchAll(/\{\s*id:\s*'([a-z0-9-]+)'\s*,\s*name:/g)].map(m => m[1]);
  const deadInNav = navIds.filter(id => deadBrands.includes(id));
  if (deadInNav.length) console.log(`\n⚠️  Footer nav (Layout.tsx) lists dead brand(s): ${deadInNav.join(', ')} — replace with an active brand manually.`);
  else console.log(`\nFooter nav: no dead brand listed.`);
}

console.log(`\n${DRY ? 'DRY-RUN complete' : `Done. ${touched} file(s) updated`}.`);
console.log('Note: dead-brand hubs are already noindex; consider a 301 to their review (see _redirects for the binance/wirex/brighty pattern).');
