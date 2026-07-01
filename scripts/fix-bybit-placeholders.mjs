#!/usr/bin/env node
/**
 * fix-bybit-placeholders.mjs
 *
 * Fixes unresolved feature_* placeholders in the Bybit DE blog article.
 * Replaces literal "(feature_cashback_boost)" and "(feature_instant_card)"
 * with their correct German labels.
 *
 * Searches both blog_posts and card_articles tables.
 *
 * Usage:
 *   node scripts/fix-bybit-placeholders.mjs --dry-run   # preview changes
 *   node scripts/fix-bybit-placeholders.mjs              # apply fixes
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

// ── Load .env ─────────────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, '.env'), 'utf8');
    const env = {};
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    }
    return env;
  } catch { return {}; }
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Prefer': 'return=representation',
};

// Known placeholder → German label translations
const PLACEHOLDER_REPLACEMENTS = {
  '(feature_cashback_boost)': 'Cashback-Boost',
  '(feature_instant_card)':   'Sofortkarte',
  '(feature_free_account)':   'Kostenloses Konto',
  '(feature_staking_rewards)':'Staking-Prämien',
  '(feature_lounge_access)':  'Flughafen-Lounge-Zugang',
  '(feature_insurance)':      'Reiseversicherung',
  '(feature_concierge)':      'Concierge-Service',
};

function applyReplacements(text) {
  let result = text;
  for (const [placeholder, label] of Object.entries(PLACEHOLDER_REPLACEMENTS)) {
    if (result.includes(placeholder)) {
      result = result.replaceAll(placeholder, label);
    }
  }
  return result;
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase error ${res.status}: ${body}`);
  }
  return res.json();
}

async function fixTable(table, slugField, contentField) {
  console.log(`\n── Checking ${table} ──`);

  // Fetch all DE articles with "bybit" in slug
  const rows = await supabaseFetch(
    `/${table}?lang=eq.de&${slugField}=ilike.*bybit*&select=id,${slugField},${contentField}`
  );

  if (!rows.length) {
    console.log(`  No DE Bybit articles found in ${table}.`);
    return;
  }

  let fixed = 0;
  for (const row of rows) {
    const original = row[contentField] || '';
    const updated = applyReplacements(original);

    const foundPlaceholders = Object.keys(PLACEHOLDER_REPLACEMENTS).filter(p => original.includes(p));
    if (!foundPlaceholders.length) {
      console.log(`  ✓ ${row[slugField]} — no placeholders found`);
      continue;
    }

    console.log(`  ⚠️  ${row[slugField]} — found: ${foundPlaceholders.join(', ')}`);
    if (DRY_RUN) {
      console.log('  [dry-run] Would apply replacements');
      fixed++;
      continue;
    }

    await supabaseFetch(`/${table}?id=eq.${row.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ [contentField]: updated }),
    });
    console.log(`  ✅ Fixed`);
    fixed++;
  }

  console.log(`  ${fixed} row(s) ${DRY_RUN ? 'would be' : 'were'} updated in ${table}`);
}

// Also scan all DE articles for any stray feature_* placeholders
async function scanAll(table, slugField, contentField) {
  console.log(`\n── Scanning ALL DE articles in ${table} for any feature_* placeholders ──`);
  const rows = await supabaseFetch(
    `/${table}?lang=eq.de&select=id,${slugField},${contentField}&limit=500`
  );

  const affected = [];
  for (const row of rows) {
    const text = row[contentField] || '';
    const found = Object.keys(PLACEHOLDER_REPLACEMENTS).filter(p => text.includes(p));
    if (found.length) affected.push({ row, found });
  }

  if (!affected.length) {
    console.log('  ✓ No stray placeholders found');
    return;
  }

  for (const { row, found } of affected) {
    const updated = applyReplacements(row[contentField]);
    console.log(`  ⚠️  ${row[slugField]} — ${found.join(', ')}`);
    if (!DRY_RUN) {
      await supabaseFetch(`/${table}?id=eq.${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ [contentField]: updated }),
      });
      console.log(`     ✅ Fixed`);
    } else {
      console.log(`     [dry-run] Would fix`);
    }
  }
}

async function main() {
  console.log(`🔧 fix-bybit-placeholders.mjs ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'}`);

  await fixTable('blog_posts', 'slug', 'content');
  await scanAll('blog_posts', 'slug', 'content');

  // card_articles uses 'card_id' not a slug — scan all DE ones
  console.log(`\n── Scanning card_articles (DE) ──`);
  const cardRows = await supabaseFetch(
    `/card_articles?lang=eq.de&select=id,card_id,content&limit=500`
  );
  let cardFixed = 0;
  for (const row of cardRows) {
    const text = row.content || '';
    const found = Object.keys(PLACEHOLDER_REPLACEMENTS).filter(p => text.includes(p));
    if (!found.length) continue;
    const updated = applyReplacements(text);
    console.log(`  ⚠️  card_articles[${row.card_id}] — ${found.join(', ')}`);
    if (!DRY_RUN) {
      await supabaseFetch(`/card_articles?id=eq.${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: updated }),
      });
      console.log(`     ✅ Fixed`);
    } else {
      console.log(`     [dry-run] Would fix`);
    }
    cardFixed++;
  }
  if (!cardFixed) console.log('  ✓ No stray placeholders in card_articles (DE)');

  console.log('\n✅ Done');
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
