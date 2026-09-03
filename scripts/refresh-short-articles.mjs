#!/usr/bin/env node
/**
 * refresh-short-articles.mjs
 *
 * Finds thin blog_posts (word count below a threshold) and expands them into
 * fuller, more in-depth articles via the Claude API — same language, same topic,
 * same slug/topic_key/hero. Only the body (and optionally excerpt/meta) is updated.
 *
 * Naturally idempotent: once an article passes the threshold it is skipped on
 * re-runs.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/refresh-short-articles.mjs --dry-run            # list thin posts + word counts
 *   node scripts/refresh-short-articles.mjs                      # refresh all thin posts
 *   node scripts/refresh-short-articles.mjs --min-words 500      # threshold (default 500)
 *   node scripts/refresh-short-articles.mjs --limit 10           # process only N
 *   node scripts/refresh-short-articles.mjs --lang fr            # only one language
 *   node scripts/refresh-short-articles.mjs --target 800         # target word count (default 800)
 *
 * Requires: ANTHROPIC_API_KEY, SUPABASE_URL (or VITE_SUPABASE_URL),
 *           SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL  = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY);

const arg = (name, def) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : def; };
const DRY_RUN   = process.argv.includes('--dry-run');
const MIN_WORDS = parseInt(arg('--min-words', '500'));
const TARGET    = parseInt(arg('--target', '800'));
const LIMIT     = parseInt(arg('--limit', 'Infinity'));
const LANG      = arg('--lang', null);
// Slugs matching this regex are skipped (default: comparison + review stubs that
// duplicate the /compare and /reviews pages — expanding them cannibalises those).
const EXCLUDE   = arg('--exclude', 'comparison-|comparatif-|vergleich-|comparativa-|confronto-|-vs-|-avis-|avis-|-review-|review-|testbericht|opinion-|opiniones-|recensione|recension');
const EXCLUDE_RE = EXCLUDE ? new RegExp(EXCLUDE) : null;

const LANG_NAME = { fr: 'French', be: 'French', de: 'German', at: 'German', es: 'Spanish', it: 'Italian', en: 'English', pt: 'European Portuguese (pt-PT)' };

/** Rough word count on the markdown body (ignores markdown symbols). */
function wordCount(md) {
  return (md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`|\-]+/g, ' ')
    .split(/\s+/).filter(Boolean).length;
}

function buildPrompt(post) {
  const lang = LANG_NAME[post.lang] || 'English';
  return `You are a senior crypto-card expert and SEO editor for topcryptocards.eu (independent crypto-card comparison, EU market).

Expand and improve this THIN blog article. Write in ${lang}.

Hard rules:
- Keep the SAME topic, angle and target keyword as the title. Do NOT drift off-topic.
- Reach roughly ${TARGET} words (currently only ~${wordCount(post.content)}). Add genuine depth: concrete details, comparisons, criteria, a short worked example, and pitfalls — never filler or repetition.
- Structure with markdown: ## and ### headings, bullet lists where useful, and a short "FAQ" section (2-3 Q&A) at the end.
- Stay accurate and neutral (this is an independent comparator, not an ad). Keep crypto/card brand names in English (Nexo, Gnosis Pay, Crypto.com, Binance Card, MetaMask Card…).
- Do NOT invent a first-level # heading (the page renders the H1 from the title).
- Output ONLY the improved markdown body — no title, no JSON, no preamble.

TITLE: ${post.title}
CURRENT EXCERPT: ${post.excerpt || ''}

CURRENT BODY:
${post.content}`;
}

async function expand(post, attempt = 1) {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [{ role: 'user', content: buildPrompt(post) }],
    });
    return msg.content[0].text.trim();
  } catch (e) {
    if (attempt < 3) { await new Promise(r => setTimeout(r, attempt * 2000)); return expand(post, attempt + 1); }
    throw e;
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log(`\n📝 refresh-short-articles.mjs${DRY_RUN ? ' (DRY RUN)' : ''}  (threshold < ${MIN_WORDS} words, target ~${TARGET})\n`);

  let q = supabase.from('blog_posts')
    .select('id, slug, lang, title, excerpt, content, topic_key')
    .eq('published', true);
  if (LANG) q = q.eq('lang', LANG);
  const { data, error } = await q;
  if (error) { console.error('❌', error.message); process.exit(1); }

  const withWc = data.map(p => ({ ...p, wc: wordCount(p.content) }));
  const excluded = withWc.filter(p => p.wc < MIN_WORDS && EXCLUDE_RE && EXCLUDE_RE.test(p.slug));
  const thin = withWc
    .filter(p => p.wc < MIN_WORDS && !(EXCLUDE_RE && EXCLUDE_RE.test(p.slug)))
    .sort((a, b) => a.wc - b.wc);

  // distribution
  const buckets = { '<200': 0, '200-349': 0, '350-499': 0, '500+': 0 };
  for (const p of withWc) {
    if (p.wc < 200) buckets['<200']++; else if (p.wc < 350) buckets['200-349']++;
    else if (p.wc < 500) buckets['350-499']++; else buckets['500+']++;
  }
  console.log(`${data.length} published posts. Word-count distribution:`, buckets);
  console.log(`Thin (< ${MIN_WORDS}): ${thin.length + excluded.length}  →  ${thin.length} guides to expand, ${excluded.length} comparison/review stubs skipped (--exclude)\n`);

  if (DRY_RUN) {
    thin.slice(0, 60).forEach(p => console.log(`  ${String(p.wc).padStart(4)}w  [${p.lang}] ${p.slug}`));
    if (thin.length > 60) console.log(`  … +${thin.length - 60} more`);
    console.log(`\nRun without --dry-run to expand (start with --limit 5 to test).`);
    return;
  }

  const todo = thin.slice(0, LIMIT);
  let done = 0, ok = 0, fail = 0;
  for (const p of todo) {
    process.stdout.write(`  [${++done}/${todo.length}] ${p.wc}w → [${p.lang}] ${p.slug} … `);
    try {
      const body = await expand(p);
      const newWc = wordCount(body);
      if (newWc < p.wc + 100) { console.log(`↷ skipped (only ${newWc}w)`); continue; }
      const { error: upErr } = await supabase.from('blog_posts')
        .update({ content: body, updated_at: new Date().toISOString() })
        .eq('id', p.id);
      if (upErr) throw upErr;
      console.log(`✅ ${newWc}w`);
      ok++;
      await sleep(900);
    } catch (e) {
      console.log(`❌ ${e.message}`);
      fail++;
    }
  }
  console.log(`\nExpanded: ${ok} | Failed: ${fail}`);
  console.log(`Note: setting updated_at refreshes sitemap lastmod → re-crawl signal. Redeploy or wait for the nightly build.\n`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
