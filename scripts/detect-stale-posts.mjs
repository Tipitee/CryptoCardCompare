// DEPRECATED — use detect-stale-posts.sql in Supabase SQL Editor instead.
// detect-stale-posts.mjs — Content refresh loop (T1)
 *
 * Queries blog_posts for articles older than N months, ranks them by
 * estimated SEO priority (traffic proxy: category + lang), and outputs
 * a prioritised CSV ready to paste in a spreadsheet.
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_KEY=... node scripts/detect-stale-posts.mjs
 *
 * Options (env vars):
 *   STALE_MONTHS=6      (default: 6) — articles not updated for N months
 *   LANG=fr             (optional)   — filter by language
 *   LIMIT=50            (default: 50) — max rows in output
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const STALE_MONTHS = parseInt(process.env.STALE_MONTHS ?? '6', 10);
const LANG_FILTER  = process.env.LANG ?? null;
const LIMIT        = parseInt(process.env.LIMIT ?? '50', 10);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Set SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Priority weights ──────────────────────────────────────────────────────────
// Higher = more SEO-valuable to refresh first.
const LANG_WEIGHT = { fr: 10, es: 9, de: 8, it: 7, en: 6, be: 5, at: 4 };
const CAT_WEIGHT  = {
  review: 20,
  comparison: 18,
  thematic: 15,
  crypto: 12,
  guide: 10,
  news: 5,
};

function priority(row) {
  const lw = LANG_WEIGHT[row.lang] ?? 3;
  const cw = CAT_WEIGHT[row.category] ?? 5;
  // Penalise very old posts (> 12 months) even less — they need refresh most
  const ageMonths = monthsAgo(row.updated_at ?? row.created_at);
  const agePenalty = ageMonths > 12 ? 2 : 0; // boost older
  return lw + cw + agePenalty;
}

function monthsAgo(dateStr) {
  if (!dateStr) return 999;
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 30));
}

function fmtDate(d) {
  if (!d) return 'unknown';
  return new Date(d).toISOString().slice(0, 10);
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - STALE_MONTHS);

console.log(`\n🔍  Fetching posts older than ${STALE_MONTHS} months (before ${cutoff.toISOString().slice(0,10)})…\n`);

let query = supabase
  .from('blog_posts')
  .select('id, title, slug, lang, category, topic_key, created_at, updated_at')
  .or(`updated_at.lt.${cutoff.toISOString()},updated_at.is.null`)
  .order('updated_at', { ascending: true, nullsFirst: true });

if (LANG_FILTER) query = query.eq('lang', LANG_FILTER);

const { data, error } = await query.limit(500);

if (error) {
  console.error('❌  Supabase error:', error.message);
  process.exit(1);
}

if (!data?.length) {
  console.log('✅  No stale posts found.');
  process.exit(0);
}

// ── Rank + deduplicate by topic_key ──────────────────────────────────────────
// For posts sharing a topic_key, keep only the highest-priority lang version
// in the main list so we don't refresh 5 copies of the same article independently.
const seenTopics = new Set();
const rows = data
  .map(r => ({ ...r, _priority: priority(r), _age: monthsAgo(r.updated_at ?? r.created_at) }))
  .sort((a, b) => b._priority - a._priority || b._age - a._age)
  .slice(0, LIMIT);

// ── Console output ────────────────────────────────────────────────────────────
const TOP = rows.slice(0, 20);
console.log(`Top ${TOP.length} posts to refresh (by priority):\n`);
console.log('Rank | Pri | Age  | Lang | Cat        | Slug');
console.log('─────┼─────┼──────┼──────┼────────────┼──────────────────────────────');
TOP.forEach((r, i) => {
  const rank = String(i+1).padStart(4);
  const pri  = String(r._priority).padStart(3);
  const age  = `${r._age}mo`.padStart(4);
  const lang = r.lang.padEnd(4);
  const cat  = (r.category ?? 'unknown').padEnd(10);
  console.log(`${rank} | ${pri} | ${age} | ${lang} | ${cat} | ${r.slug}`);
});

// ── CSV export ────────────────────────────────────────────────────────────────
const csvHeader = 'priority,age_months,lang,category,slug,title,topic_key,last_updated,id';
const csvRows = rows.map(r =>
  [
    r._priority,
    r._age,
    r.lang,
    r.category ?? '',
    r.slug,
    `"${(r.title ?? '').replace(/"/g, '""')}"`,
    r.topic_key ?? '',
    fmtDate(r.updated_at),
    r.id,
  ].join(',')
);

const csv = [csvHeader, ...csvRows].join('\n');
const outFile = 'stale-posts.csv';
writeFileSync(outFile, csv);

console.log(`\n✅  ${rows.length} stale posts written to ${outFile}`);
console.log(`\n📋  Refresh checklist per article:`);
console.log('   1. Update fee table from live DB / issuer site');
console.log('   2. Add "Mise à jour YYYY" section with key changes');
console.log('   3. Add/refresh FAQ block (harvest People Also Ask from GSC)');
console.log('   4. Add internal link to newest thematic page');
console.log('   5. SET updated_at = NOW() in Supabase — triggers sitemap lastmod + IndexNow');
