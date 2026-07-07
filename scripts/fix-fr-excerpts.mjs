#!/usr/bin/env node
/**
 * fix-fr-excerpts.mjs
 * Identifies and fixes weak / missing excerpts on FR blog posts.
 *
 * "Weak" = excerpt is null, empty, < 80 chars, OR matches generic openers
 * (e.g. "Dans cet article", "Cet article", "Découvrez", "Introduction").
 *
 * Fix strategy: extract the first coherent sentence(s) from the markdown body
 * (skipping headings, code blocks, images, and markdown formatting) and trim
 * to 140-155 chars for SERP display.
 *
 * Usage:
 *   VITE_SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=sk-... node scripts/fix-fr-excerpts.mjs
 *   # Dry-run (no DB writes):
 *   DRY_RUN=1 VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/fix-fr-excerpts.mjs
 *
 * Load from .env.local:
 *   export $(grep -v '^#' .env.local | xargs) && node scripts/fix-fr-excerpts.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = !!process.env.DRY_RUN;
const TARGET = process.env.TARGET_SLUG; // optional: fix a single slug

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing env vars: VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Weak excerpt detection ────────────────────────────────────────────────────
const WEAK_OPENERS = [
  'dans cet article',
  'cet article',
  'introduction',
  'découvrez',
  'bienvenue',
  'nous allons voir',
  'ce guide',
  'dans ce guide',
  'sommaire',
  'voici',
  'dans ce tutoriel',
  'ce tutoriel',
  'dans cette page',
];

function isWeak(excerpt) {
  if (!excerpt || excerpt.trim().length < 80) return true;
  const lower = excerpt.trim().toLowerCase();
  return WEAK_OPENERS.some(op => lower.startsWith(op));
}

// ── Extract excerpt from markdown content ─────────────────────────────────────
function extractExcerpt(content, title) {
  if (!content) return title || '';

  const lines = content.split('\n');
  const paragraphs = [];
  let inCode = false;

  for (const raw of lines) {
    const line = raw.trim();
    // Toggle code block
    if (line.startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) continue;
    // Skip headings, horizontal rules, images, HTML tags, empty lines
    if (!line || line.startsWith('#') || line.startsWith('---') ||
        line.startsWith('===') || line.startsWith('![') ||
        line.startsWith('<') || line.startsWith('|') ||
        line.startsWith('>')) continue;
    // Strip markdown formatting (bold, italic, links)
    const clean = line
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/\[(.+?)\]\(.*?\)/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/~~(.+?)~~/g, '$1')
      .trim();
    if (clean.length > 40) paragraphs.push(clean);
    if (paragraphs.length >= 3) break;
  }

  if (paragraphs.length === 0) return title || '';

  // Build excerpt: join sentences up to 155 chars
  let excerpt = '';
  for (const para of paragraphs) {
    const candidate = excerpt ? `${excerpt} ${para}` : para;
    if (candidate.length <= 155) {
      excerpt = candidate;
    } else {
      // Trim at sentence boundary
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
      for (const sent of sentences) {
        const c = excerpt ? `${excerpt} ${sent.trim()}` : sent.trim();
        if (c.length <= 155) excerpt = c;
        else break;
      }
      break;
    }
  }

  // Last resort: truncate at word boundary to 155 chars
  if (!excerpt) {
    excerpt = paragraphs[0];
  }
  if (excerpt.length > 155) {
    excerpt = excerpt.slice(0, 152).replace(/\s+\S*$/, '') + '…';
  }

  return excerpt;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const query = supabase
  .from('blog_posts')
  .select('id, slug, title, excerpt, content')
  .eq('published', true)
  .eq('lang', 'fr');

if (TARGET) query.eq('slug', TARGET);

const { data: posts, error } = await query.order('created_at', { ascending: false });

if (error) { console.error('❌  Fetch error:', error.message); process.exit(1); }

console.log(`📋  Fetched ${posts.length} FR posts`);

const weak = posts.filter(p => isWeak(p.excerpt));
console.log(`🔍  Weak excerpts: ${weak.length}`);

if (weak.length === 0) {
  console.log('✅  No weak excerpts found — nothing to do.');
  process.exit(0);
}

let fixed = 0;
let skipped = 0;

for (const post of weak) {
  const newExcerpt = extractExcerpt(post.content, post.title);

  if (!newExcerpt || newExcerpt.length < 40) {
    console.log(`  ⚠️  ${post.slug} — could not extract a valid excerpt, skipping`);
    skipped++;
    continue;
  }

  console.log(`  ${DRY_RUN ? '🔵 [DRY]' : '✏️ '} ${post.slug}`);
  console.log(`    OLD: ${(post.excerpt || '').slice(0, 80)}`);
  console.log(`    NEW: ${newExcerpt}`);

  if (!DRY_RUN) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ excerpt: newExcerpt })
      .eq('id', post.id);

    if (updateError) {
      console.error(`    ❌  Update failed: ${updateError.message}`);
      skipped++;
    } else {
      fixed++;
    }
  } else {
    fixed++;
  }
}

console.log(`\n🎉  Done — ${fixed} fixed, ${skipped} skipped${DRY_RUN ? ' (dry-run, no DB writes)' : ''}`);
