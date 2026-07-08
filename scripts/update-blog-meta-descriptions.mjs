/**
 * update-blog-meta-descriptions.mjs
 *
 * Updates meta_description for specific high-priority blog posts.
 * Targets posts with good rankings (pos 5-15) but suboptimal CTR.
 *
 * Usage:
 *   node --env-file=.env scripts/update-blog-meta-descriptions.mjs --dry-run
 *   node --env-file=.env scripts/update-blog-meta-descriptions.mjs
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Posts to update ──────────────────────────────────────────────────────────
// Format: { slug, lang, meta_description }
const UPDATES = [
  {
    slug: 'mit-krypto-im-ausland-bezahlen-praktischer-leitfaden',
    lang: 'de',
    meta_description: `Praktischer Leitfaden: Mit Krypto im Ausland bezahlen in ${new Date().getFullYear()}. 0% Wechselgebühren, bis zu 5% Cashback, 200+ Länder. Crypto.com, Bybit, Nexo verglichen. Kostenlos ✓`,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  for (const update of UPDATES) {
    console.log(`\n[${update.lang}] ${update.slug}`);
    console.log(`  meta_description (${update.meta_description.length} chars):`);
    console.log(`  "${update.meta_description}"`);

    if (DRY_RUN) {
      console.log('  → skipped (dry run)');
      continue;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ meta_description: update.meta_description })
      .eq('slug', update.slug)
      .eq('lang', update.lang)
      .select('id, slug, lang, meta_description');

    if (error) {
      console.error(`  ✗ Error:`, error.message);
    } else if (!data || data.length === 0) {
      console.warn(`  ⚠ No row found for slug="${update.slug}" lang="${update.lang}"`);
    } else {
      console.log(`  ✓ Updated row id=${data[0].id}`);
    }
  }

  console.log('\nDone.');
}

run().catch(console.error);
