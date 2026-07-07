#!/usr/bin/env node
/**
 * fix-fr-excerpts.mjs
 * Identifies and fixes weak / missing excerpts on blog posts (all languages).
 *
 * "Weak" = excerpt is null, empty, < 80 chars, OR matches generic openers per lang.
 *
 * Fix strategy: extract the first coherent sentence(s) from the markdown body
 * (skipping headings, code blocks, images, and markdown formatting) and trim
 * to 140-155 chars for SERP display.
 *
 * Usage:
 *   export $(grep -v '^#' .env.local | xargs)
 *   DRY_RUN=1 node scripts/fix-fr-excerpts.mjs          # dry-run FR only (default)
 *   LANG=all node scripts/fix-fr-excerpts.mjs            # all 5 languages
 *   LANG=de node scripts/fix-fr-excerpts.mjs             # German only
 *   LANG=fr TARGET_SLUG=mon-slug node scripts/fix-fr-excerpts.mjs  # single slug
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = !!process.env.DRY_RUN;
const TARGET = process.env.TARGET_SLUG; // optional: fix a single slug
const LANG_ARG = process.env.LANG || 'fr'; // 'all' | 'fr' | 'de' | 'es' | 'it' | 'en'

const ALL_LANGS = ['fr', 'de', 'es', 'it', 'en'];
const LANGS_TO_PROCESS = LANG_ARG === 'all' ? ALL_LANGS : [LANG_ARG];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing env vars: VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Weak excerpt detection ────────────────────────────────────────────────────
const WEAK_OPENERS_BY_LANG = {
  fr: [
    'dans cet article', 'cet article', 'introduction', 'découvrez', 'bienvenue',
    'nous allons voir', 'ce guide', 'dans ce guide', 'sommaire', 'voici',
    'dans ce tutoriel', 'ce tutoriel', 'dans cette page',
  ],
  de: [
    'in diesem artikel', 'dieser artikel', 'einführung', 'entdecke', 'willkommen',
    'wir werden sehen', 'dieser leitfaden', 'in diesem leitfaden', 'zusammenfassung',
    'hier ist', 'in diesem tutorial', 'dieses tutorial', 'auf dieser seite',
  ],
  es: [
    'en este artículo', 'este artículo', 'introducción', 'descubre', 'bienvenido',
    'vamos a ver', 'esta guía', 'en esta guía', 'resumen', 'aquí',
    'en este tutorial', 'este tutorial', 'en esta página',
  ],
  it: [
    'in questo articolo', 'questo articolo', 'introduzione', 'scopri', 'benvenuto',
    'vedremo', 'questa guida', 'in questa guida', 'sommario', 'ecco',
    'in questo tutorial', 'questo tutorial', 'in questa pagina',
  ],
  en: [
    'in this article', 'this article', 'introduction', 'discover', 'welcome',
    'we will see', 'this guide', 'in this guide', 'summary', 'here is',
    'in this tutorial', 'this tutorial', 'on this page',
  ],
};

function isWeak(excerpt, lang) {
  if (!excerpt || excerpt.trim().length < 80) return true;
  const lower = excerpt.trim().toLowerCase();
  const openers = WEAK_OPENERS_BY_LANG[lang] ?? WEAK_OPENERS_BY_LANG['en'];
  return openers.some(op => lower.startsWith(op));
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
console.log(`🌐  Languages: ${LANGS_TO_PROCESS.join(', ')}${DRY_RUN ? '  [DRY-RUN]' : ''}`);

let totalFixed = 0;
let totalSkipped = 0;

for (const lang of LANGS_TO_PROCESS) {
  let q = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content')
    .eq('published', true)
    .eq('lang', lang);

  if (TARGET) q = q.eq('slug', TARGET);

  const { data: posts, error } = await q.order('created_at', { ascending: false });

  if (error) { console.error(`❌  [${lang}] Fetch error: ${error.message}`); continue; }

  const weak = posts.filter(p => isWeak(p.excerpt, lang));
  console.log(`\n[${lang.toUpperCase()}]  ${posts.length} posts fetched — ${weak.length} weak excerpts`);

  if (weak.length === 0) {
    console.log(`  ✅  All ${lang.toUpperCase()} excerpts are healthy.`);
    continue;
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

  console.log(`  → ${fixed} fixed, ${skipped} skipped`);
  totalFixed += fixed;
  totalSkipped += skipped;
}

console.log(`\n🎉  Total — ${totalFixed} fixed, ${totalSkipped} skipped${DRY_RUN ? ' (dry-run, no DB writes)' : ''}`);
