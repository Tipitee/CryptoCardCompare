#!/usr/bin/env node
/**
 * fix-broken-image-urls.mjs
 *
 * Replaces old Supabase project ID in blog_posts.image_hero URLs.
 * Old: https://zulquoqrtmafwxfbjele.supabase.co/...
 * New: https://pnrwskzladqibjqngxem.supabase.co/...
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/fix-broken-image-urls.mjs --dry-run
 *   node scripts/fix-broken-image-urls.mjs
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');
const OLD_ID = 'zulquoqrtmafwxfbjele';
const NEW_ID = 'pnrwskzladqibjqngxem';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log(`\n🔧 fix-broken-image-urls.mjs${DRY_RUN ? ' (DRY RUN)' : ''}`);

  // 1. Find all posts with old URL
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, lang, image_hero')
    .like('image_hero', `%${OLD_ID}%`);

  if (error) {
    console.error('❌ Query error:', error.message);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('✅ No posts with old Supabase URL found — nothing to fix.');
    return;
  }

  console.log(`\nFound ${posts.length} posts with old URL:\n`);
  for (const p of posts) {
    console.log(`  [${p.lang}] ${p.slug}`);
    console.log(`       old: ${p.image_hero}`);
    const newUrl = p.image_hero.replace(OLD_ID, NEW_ID);
    console.log(`       new: ${newUrl}`);

    if (!DRY_RUN) {
      const { error: updateErr } = await supabase
        .from('blog_posts')
        .update({ image_hero: newUrl })
        .eq('id', p.id);
      if (updateErr) {
        console.error(`  ❌ Update failed: ${updateErr.message}`);
      } else {
        console.log(`  ✅ Updated`);
      }
    }
  }

  if (DRY_RUN) {
    console.log('\n(Dry run — no changes made)');
  } else {
    console.log(`\n✅ Done. ${posts.length} posts updated.`);
    console.log('\nNote: if images still appear broken (404), regenerate them');
    console.log('from /admin/generate-hero-images or run upload-hero-images.mjs.');
  }
}

main();
