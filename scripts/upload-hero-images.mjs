#!/usr/bin/env node
/**
 * upload-hero-images.mjs
 *
 * Uploads local image files to Supabase Storage (blog-hero-images bucket)
 * and updates blog_posts.image_hero for all language variants sharing the same topic_key.
 *
 * Convention: image filename (without extension) = blog_posts.slug (FR)
 * Supported formats: .jpg, .jpeg, .png, .webp
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/upload-hero-images.mjs                        # default: ~/Desktop/New
 *   node scripts/upload-hero-images.mjs /path/to/folder        # custom folder
 *   node scripts/upload-hero-images.mjs --dry-run              # preview only
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { homedir } from 'os';

const DRY_RUN = process.argv.includes('--dry-run');
const FOLDER_ARG = process.argv.slice(2).find(a => !a.startsWith('-'));
const FOLDER = FOLDER_ARG || join(homedir(), 'Desktop', 'New');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MIME = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
};

async function main() {
  console.log(`\n🖼  upload-hero-images.mjs${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log(`📁 Folder: ${FOLDER}\n`);

  // 1. List image files
  let entries;
  try {
    entries = await readdir(FOLDER);
  } catch (e) {
    console.error(`❌ Cannot read folder: ${FOLDER}\n   ${e.message}`);
    process.exit(1);
  }

  const images = entries.filter(f => Object.keys(MIME).includes(extname(f).toLowerCase()));

  if (images.length === 0) {
    console.log('No image files found (jpg/jpeg/png/webp).');
    process.exit(0);
  }

  console.log(`Found ${images.length} image(s)\n`);

  let ok = 0, skipped = 0, failed = 0;

  for (const filename of images) {
    const ext  = extname(filename).toLowerCase();
    const raw  = basename(filename, ext);
    // Strip trailing timestamp suffix e.g. "-1781795347715" (13-digit epoch ms)
    const slug = raw.replace(/-\d{13}$/, '');
    const mime = MIME[ext];
    const filepath = join(FOLDER, filename);

    // 2. Find the blog_post (FR) by slug
    const { data: post, error: fetchErr } = await supabase
      .from('blog_posts')
      .select('id, slug, lang, topic_key, image_hero')
      .eq('slug', slug)
      .eq('lang', 'fr')
      .maybeSingle();

    if (fetchErr) {
      console.error(`  ❌ [${slug}] DB error: ${fetchErr.message}`);
      failed++;
      continue;
    }

    if (!post) {
      // Try without lang filter (some slugs may not be lang-specific)
      const { data: postAny } = await supabase
        .from('blog_posts')
        .select('id, slug, lang, topic_key, image_hero')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle();

      if (!postAny) {
        console.log(`  ⚠  [${slug}] — no matching blog_post found, skipping`);
        skipped++;
        continue;
      }
    }

    const targetPost = post || (await supabase
      .from('blog_posts')
      .select('id, slug, lang, topic_key, image_hero')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle()).data;

    // 3. Upload to Supabase Storage
    const storageFilename = `${slug}-${Date.now()}${ext}`;

    if (DRY_RUN) {
      console.log(`  (dry) [${slug}]`);
      console.log(`        → upload: blog-hero-images/${storageFilename}`);
      console.log(`        → topic_key: ${targetPost.topic_key || '(none)'}`);
      ok++;
      continue;
    }

    const fileBuffer = await readFile(filepath);

    const { error: uploadErr } = await supabase
      .storage
      .from('blog-hero-images')
      .upload(storageFilename, fileBuffer, { contentType: mime, upsert: false });

    if (uploadErr) {
      console.error(`  ❌ [${slug}] Upload failed: ${uploadErr.message}`);
      failed++;
      continue;
    }

    // 4. Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('blog-hero-images')
      .getPublicUrl(storageFilename);

    // 5. Update the target post
    const { error: updateErr } = await supabase
      .from('blog_posts')
      .update({ image_hero: publicUrl })
      .eq('id', targetPost.id);

    if (updateErr) {
      console.error(`  ❌ [${slug}] DB update failed: ${updateErr.message}`);
      failed++;
      continue;
    }

    // 6. Propagate to all language variants via topic_key
    let propagated = 0;
    if (targetPost.topic_key) {
      const { error: propErr, count } = await supabase
        .from('blog_posts')
        .update({ image_hero: publicUrl })
        .eq('topic_key', targetPost.topic_key)
        .neq('id', targetPost.id);

      if (propErr) {
        console.warn(`  ⚠  [${slug}] Propagation error: ${propErr.message}`);
      } else {
        propagated = count ?? 0;
      }
    }

    console.log(`  ✅ [${slug}]`);
    console.log(`      → ${publicUrl}`);
    if (targetPost.topic_key) {
      console.log(`      → propagated to all [${targetPost.topic_key}] variants`);
    }
    ok++;
  }

  console.log(`\n✅ Done. ${ok} uploaded, ${skipped} skipped, ${failed} failed.`);
  if (DRY_RUN) console.log('(Dry run — no changes made)');
}

main();
