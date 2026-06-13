/**
 * fix-slugs.mjs
 *
 * Generates language-appropriate slugs for non-French blog posts by
 * slugifying the article's own title (which is already in the correct language).
 *
 * Before: /de/blog/guide-choisir-carte-crypto   (French slug)
 * After:  /de/blog/kryptokarten-vergleich-guide  (German slug from title)
 *
 * Safety:
 *   - Only updates posts where the slug appears to be French
 *   - Skips if the generated slug already exists (unique constraint)
 *   - Use --dry-run to preview without writing
 *
 * Usage:
 *   node --env-file=.env scripts/fix-slugs.mjs --dry-run
 *   node --env-file=.env scripts/fix-slugs.mjs
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Slugify a title ──────────────────────────────────────────────────────────
// Handles French, German, Spanish, Italian, English accented chars

function slugify(title) {
  return title
    .toLowerCase()
    // Normalize accented characters
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    // German umlauts fallback (in case NFD doesn't catch them)
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    // Remove anything that's not alphanumeric or space/hyphen
    .replace(/[^a-z0-9\s-]/g, '')
    // Collapse whitespace to hyphens
    .replace(/[\s]+/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Max 80 chars
    .slice(0, 80)
    // Don't end mid-word — trim at last hyphen
    .replace(/-[^-]*$/, (m, offset, s) => offset > 40 ? '' : m);
}

// ─── Detect if a slug looks French ───────────────────────────────────────────
// French articles use French words in their slugs

const FR_SLUG_INDICATORS = [
  'carte', 'cartes', 'crypto', 'meilleure', 'sans', 'frais', 'cashback',
  'guide', 'choisir', 'staking', 'debutant', 'virtuelle', 'france',
  'comment', 'pourquoi', 'comparatif', 'comparaison', 'avis', 'test',
  'binance', 'crypto-com', 'coinbase', 'wirex', 'nexo', 'monolith',
];

function looksLikeFrenchSlug(slug) {
  const parts = slug.split('-');
  return FR_SLUG_INDICATORS.some(indicator =>
    parts.includes(indicator) || slug.includes(indicator)
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nfix-slugs.mjs ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  // Fetch all non-French posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, lang, title')
    .eq('published', true)
    .neq('lang', 'fr');

  if (error) { console.error('Fetch error:', error); process.exit(1); }
  console.log(`Found ${posts.length} non-French published posts.\n`);

  // Get all existing slugs per language to avoid collisions
  const { data: allSlugs } = await supabase
    .from('blog_posts')
    .select('slug, lang');

  const existingSlugs = new Set(
    (allSlugs ?? []).map(r => `${r.lang}::${r.slug}`)
  );

  const stats = { updated: 0, skipped: 0, alreadyOk: 0, collision: 0 };

  for (const post of posts) {
    if (!post.title) { stats.skipped++; continue; }

    // Skip if slug already looks like the right language
    if (!looksLikeFrenchSlug(post.slug)) {
      console.log(`  [${post.lang}] ${post.slug}  ✓ already translated`);
      stats.alreadyOk++;
      continue;
    }

    const newSlug = slugify(post.title);

    if (!newSlug || newSlug === post.slug) {
      stats.skipped++;
      continue;
    }

    // Check for collision
    const key = `${post.lang}::${newSlug}`;
    if (existingSlugs.has(key)) {
      console.log(`  [${post.lang}] ${post.slug}  ⚠ collision → ${newSlug} (skipped)`);
      stats.collision++;
      continue;
    }

    console.log(`  [${post.lang}] ${post.slug}`);
    console.log(`         →  ${newSlug}`);

    if (!DRY_RUN) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ slug: newSlug })
        .eq('id', post.id);

      if (updateError) {
        console.error(`    ❌ Error:`, updateError.message);
        stats.skipped++;
      } else {
        existingSlugs.add(key); // prevent future collision within this run
        stats.updated++;
      }
    } else {
      stats.updated++;
    }
  }

  console.log(`
Done.
  ${stats.updated}    slug(s) ${DRY_RUN ? 'would be' : ''} updated
  ${stats.alreadyOk} already translated
  ${stats.skipped}    skipped
  ${stats.collision} collision(s)
`);
  if (DRY_RUN) console.log('(Dry run — no changes written to DB)');
}

main();
