#!/usr/bin/env node
/**
 * fix-article-formatting.mjs
 *
 * Two targeted fixes for blog_posts.content:
 *
 * FIX 1 — Headings: Only applied to articles that have NO ## headings at all.
 *   Converts standalone short lines (likely section titles written as plain text)
 *   into ## headings. Heuristics for a "heading line":
 *     - Surrounded by blank lines (or at start/end of content)
 *     - 10–120 characters long
 *     - Does not start with markdown syntax (-, *, #, |, >, `)
 *     - Does not end with a period (.) — headings rarely end with periods
 *     - The following block is notably longer (actual content, not another title)
 *
 * FIX 2 — Dates: Remove exact day number from dates.
 *   "25 juin 2026" → "juin 2026"
 *   Only when a day number precedes a known month name.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/fix-article-formatting.mjs --dry-run
 *   node scripts/fix-article-formatting.mjs
 *   node scripts/fix-article-formatting.mjs --slug carte-crypto-voyage-guide-complet
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');
const SLUG_ARG = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1]
  || (process.argv.includes('--slug') ? process.argv[process.argv.indexOf('--slug') + 1] : null);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Month names in all 5 languages
const MONTH_PATTERN = [
  'janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre',
  'january','february','march','april','may','june','july','august','september','october','november','december',
  'januar','februar','märz','april','mai','juni','juli','august','september','oktober','november','dezember',
  'enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre',
  'gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre',
].join('|');

const EXACT_DATE_RE = new RegExp(
  `\\b(\\d{1,2}(?:er|ème)?)\\s+(${MONTH_PATTERN})\\s+(\\d{4})\\b`,
  'gi'
);

// Fix 2: strip exact day from dates
function fixDates(content) {
  return content.replace(EXACT_DATE_RE, (_m, _day, month, year) => `${month} ${year}`);
}

// Fix 1: promote standalone short lines to ## headings
// Only applied when the article has no ## at all
function hasHeadings(content) {
  return /^#{1,4}\s/m.test(content);
}

function looksLikeHeading(line, nextBlock) {
  const trimmed = line.trim();
  if (trimmed.length < 10 || trimmed.length > 130) return false;
  // Skip lines that already start with markdown syntax
  if (/^[-*#|>`\d]/.test(trimmed)) return false;
  // Skip lines ending with period (sentence, not a heading)
  if (trimmed.endsWith('.')) return false;
  // Skip lines that are very short and might just be fragments
  // A heading usually has at least 2 words
  if (trimmed.split(/\s+/).length < 2) return false;
  // The next block should exist and be longer (it's actual content, not another potential title)
  if (!nextBlock || nextBlock.trim().length < trimmed.length) return false;
  return true;
}

function promoteHeadings(content) {
  // Split on double (or more) newlines to get blocks
  const blocks = content.split(/\n{2,}/);
  const result = [];
  let promoted = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const trimmed = block.trim();
    const nextBlock = blocks[i + 1]?.trim() ?? '';

    // Single-line block = candidate for heading
    if (!trimmed.includes('\n') && looksLikeHeading(trimmed, nextBlock)) {
      result.push(`## ${trimmed}`);
      promoted++;
    } else {
      result.push(block);
    }
  }

  return { content: result.join('\n\n'), promoted };
}

function fixContent(content, title) {
  const changes = [];

  // Fix 2: dates (always applied)
  const afterDates = fixDates(content);
  if (afterDates !== content) changes.push('stripped exact day from dates');
  let fixed = afterDates;

  // Fix 1: headings (only if article has NO existing headings)
  if (!hasHeadings(fixed)) {
    const { content: afterHeadings, promoted } = promoteHeadings(fixed);
    if (promoted > 0) {
      fixed = afterHeadings;
      changes.push(`promoted ${promoted} plain lines → ## headings`);
    }
  }

  return { fixed, changes };
}

async function main() {
  console.log(`\n✏️  fix-article-formatting.mjs${DRY_RUN ? ' (DRY RUN)' : ''}${SLUG_ARG ? ` [slug: ${SLUG_ARG}]` : ''}\n`);

  let query = supabase
    .from('blog_posts')
    .select('id, slug, lang, title, content')
    .not('content', 'is', null)
    .order('lang')
    .order('slug');

  if (SLUG_ARG) query = query.eq('slug', SLUG_ARG);

  const { data: posts, error } = await query;

  if (error) {
    console.error('❌ Query error:', error.message);
    process.exit(1);
  }

  console.log(`Found ${posts.length} articles\n`);

  let changed = 0, unchanged = 0, failed = 0;

  for (const post of posts) {
    const { fixed, changes } = fixContent(post.content, post.title);

    if (fixed === post.content) {
      unchanged++;
      continue;
    }

    console.log(`[${post.lang}] ${post.slug}`);
    for (const c of changes) console.log(`  → ${c}`);

    if (DRY_RUN) {
      // Show a preview of the first promoted heading
      const firstNew = fixed.match(/^## .+/m)?.[0];
      if (firstNew) console.log(`  preview: "${firstNew}"`);
      changed++;
      continue;
    }

    const { error: updateErr } = await supabase
      .from('blog_posts')
      .update({ content: fixed })
      .eq('id', post.id);

    if (updateErr) {
      console.error(`  ❌ ${updateErr.message}`);
      failed++;
    } else {
      changed++;
    }
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'}: ${changed} | Unchanged: ${unchanged}${failed ? ` | Failed: ${failed}` : ''}`);
  if (DRY_RUN) console.log('Run without --dry-run to apply.');
}

main();
