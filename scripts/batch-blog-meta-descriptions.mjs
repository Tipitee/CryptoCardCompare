/**
 * batch-blog-meta-descriptions.mjs
 *
 * Audits all DE and EN blog posts from Supabase.
 * Finds posts with null or short meta_description (< 80 chars).
 * Auto-generates click-worthy meta descriptions from excerpt/title.
 * Batch updates them in Supabase.
 *
 * Usage:
 *   node --env-file=.env scripts/batch-blog-meta-descriptions.mjs --dry-run
 *   node --env-file=.env scripts/batch-blog-meta-descriptions.mjs
 *   node --env-file=.env scripts/batch-blog-meta-descriptions.mjs --lang=de
 *   node --env-file=.env scripts/batch-blog-meta-descriptions.mjs --lang=en
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');
const LANG_FILTER = process.argv.find(a => a.startsWith('--lang='))?.split('=')[1];
const MIN_LENGTH = 80; // posts with meta_description shorter than this are considered weak
const TARGET_LENGTH = 155;
const YEAR = new Date().getFullYear();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Meta description generator ───────────────────────────────────────────────

function truncateAtWord(text, maxLen) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '').replace(/[,;:—–]$/, '') + '…';
}

function generateMetaDesc(title, excerpt, lang) {
  const suffix = lang === 'de'
    ? ` — ${YEAR} ✓`
    : ` — ${YEAR} ✓`;

  // Strategy 1: excerpt is good → truncate + suffix
  if (excerpt && excerpt.trim().length > 80) {
    const clean = excerpt.trim().replace(/\s+/g, ' ');
    // Try to fit first sentence if it's a good length
    const firstSentenceMatch = clean.match(/^[^.!?]+[.!?]/);
    if (firstSentenceMatch) {
      const firstSentence = firstSentenceMatch[0].trim();
      if (firstSentence.length >= 60 && firstSentence.length <= TARGET_LENGTH - suffix.length) {
        return firstSentence + suffix;
      }
    }
    // Fall back to truncation
    const truncated = truncateAtWord(clean, TARGET_LENGTH - suffix.length);
    return truncated + suffix;
  }

  // Strategy 2: excerpt too short or null → title-based fallback
  const titleClean = title.trim();
  if (lang === 'de') {
    const fallback = `${titleClean}: vollständiger Leitfaden ${YEAR}. Geprüfte Daten, kostenloser Vergleich ✓`;
    return fallback.length > 160 ? truncateAtWord(fallback, 157) + '…' : fallback;
  } else {
    const fallback = `${titleClean}: complete guide ${YEAR}. Verified data, free comparison ✓`;
    return fallback.length > 160 ? truncateAtWord(fallback, 157) + '…' : fallback;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const langs = LANG_FILTER ? [LANG_FILTER] : ['de', 'en'];
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN 🔍' : 'LIVE 🚀'}`);
  console.log(`Languages: ${langs.join(', ')}`);
  console.log(`Threshold: meta_description < ${MIN_LENGTH} chars or NULL\n`);

  let totalNeedUpdate = 0;
  let totalUpdated = 0;
  let totalErrors = 0;

  for (const lang of langs) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Language: ${lang.toUpperCase()}`);
    console.log('═'.repeat(60));

    // Fetch all posts for this lang
    const { data: allPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, slug, lang, title, excerpt, meta_description')
      .eq('lang', lang)
      .order('slug');

    if (fetchError) {
      console.error(`  ✗ Fetch error for lang=${lang}:`, fetchError.message);
      continue;
    }

    console.log(`Total posts: ${allPosts.length}`);

    // Categorize
    const withGoodMeta = allPosts.filter(p => p.meta_description && p.meta_description.length >= MIN_LENGTH);
    const needsUpdate = allPosts.filter(p => !p.meta_description || p.meta_description.length < MIN_LENGTH);

    console.log(`  ✓ Good meta_description (≥${MIN_LENGTH} chars): ${withGoodMeta.length}`);
    console.log(`  ⚠ Needs update (null or <${MIN_LENGTH} chars): ${needsUpdate.length}`);

    totalNeedUpdate += needsUpdate.length;

    if (needsUpdate.length === 0) {
      console.log('  → Nothing to do.');
      continue;
    }

    // Generate and optionally update
    const updates = [];
    for (const post of needsUpdate) {
      const generated = generateMetaDesc(post.title, post.excerpt, lang);
      updates.push({ ...post, new_meta: generated });
    }

    // Print preview
    console.log(`\nPreview (first 5 of ${updates.length}):`);
    for (const u of updates.slice(0, 5)) {
      const currentStatus = u.meta_description ? `"${u.meta_description.slice(0, 40)}…" (${u.meta_description.length}c)` : 'NULL';
      console.log(`\n  [${u.slug}]`);
      console.log(`    current : ${currentStatus}`);
      console.log(`    new     : "${u.new_meta}" (${u.new_meta.length}c)`);
    }
    if (updates.length > 5) {
      console.log(`\n  ... and ${updates.length - 5} more.`);
    }

    if (DRY_RUN) {
      console.log(`\n  → Skipped all ${updates.length} updates (dry run).`);
      continue;
    }

    // Batch update (chunks of 50 to avoid timeout)
    console.log(`\nUpdating ${updates.length} posts...`);
    const CHUNK = 50;
    for (let i = 0; i < updates.length; i += CHUNK) {
      const chunk = updates.slice(i, i + CHUNK);
      for (const u of chunk) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ meta_description: u.new_meta })
          .eq('id', u.id);

        if (error) {
          console.error(`  ✗ ${u.slug}: ${error.message}`);
          totalErrors++;
        } else {
          totalUpdated++;
          process.stdout.write('.');
        }
      }
      console.log(` ${Math.min(i + CHUNK, updates.length)}/${updates.length}`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('Summary:');
  console.log(`  Posts needing update : ${totalNeedUpdate}`);
  if (!DRY_RUN) {
    console.log(`  Successfully updated : ${totalUpdated}`);
    console.log(`  Errors              : ${totalErrors}`);
  }
  console.log('Done.');
}

run().catch(console.error);
