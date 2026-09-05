#!/usr/bin/env node
/**
 * prune-stub-articles.mjs
 *
 * Removes "index bloat": thin blog stubs whose topic already has a dedicated
 * tool page — comparison stubs (duplicate /compare) and review stubs
 * (duplicate /reviews). Depublishing them (published=false) drops them from the
 * sitemap and concentrates crawl budget on the real pages.
 *
 * NO Anthropic API is used (only Supabase) — safe to run while the article
 * refresh is running.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/prune-stub-articles.mjs --dry-run              # list what would be pruned
 *   node scripts/prune-stub-articles.mjs                        # depublish the thin stubs
 *   node scripts/prune-stub-articles.mjs --min-words 500        # only stubs under N words (default 500)
 *   node scripts/prune-stub-articles.mjs --all                  # prune stubs regardless of length
 *   node scripts/prune-stub-articles.mjs --lang de              # one language
 *   node scripts/prune-stub-articles.mjs --redirects            # ALSO print _redirects 301 lines
 *                                                                 (append them to public/_redirects)
 *
 * Requires: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ Missing Supabase env'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const DRY_RUN   = process.argv.includes('--dry-run');
const ALL       = process.argv.includes('--all');
const REDIRECTS = process.argv.includes('--redirects');
const MIN_WORDS = parseInt(arg('--min-words', '500'));
const LANG      = arg('--lang', null);

const STUB_RE = /comparison-|comparatif-|vergleich-|comparativa-|confronto-|-vs-|-avis-|avis-|-review-|review-|testbericht|opinion-|opiniones-|recensione|recension/;
// Localized URL segments (must match ROUTE_TRANSLATIONS)
const COMPARE_SEG = { fr:'comparer', be:'comparer', de:'vergleich', at:'vergleich', es:'comparar', it:'confronto', en:'compare', pt:'comparar' };
const REVIEW_SEG  = { fr:'avis', be:'avis', de:'bewertungen', at:'bewertungen', es:'opiniones', it:'recensioni', en:'reviews', pt:'analises' };

function wordCount(md) {
  return (md || '').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`|\-]+/g, ' ').split(/\s+/).filter(Boolean).length;
}

/** Best-effort canonical target for a stub (for optional 301). Returns null if unsure. */
function redirectTarget(slug, lang) {
  const base = `https://topcryptocards.eu/${lang}`;
  const vs = slug.match(/([a-z0-9-]+)-vs-([a-z0-9-]+?)(?:-20\d\d)?$/);
  if (vs && /comparison-|comparatif-|vergleich-|comparativa-|confronto-|-vs-/.test(slug)) {
    // strip a leading comparison prefix if present
    const pair = slug.replace(/^(comparison|comparatif|vergleich|comparativa|confronto)-/, '').replace(/-20\d\d$/, '');
    return `${base}/${COMPARE_SEG[lang] || 'compare'}/${pair}`;
  }
  const rev = slug.match(/^([a-z0-9-]+?-card)(?:-(?:avis|review|opinion|opiniones|recensione|testbericht|erfahrungen))/);
  if (rev) return `${base}/${REVIEW_SEG[lang] || 'reviews'}/${rev[1]}`;
  return null;
}

const { data, error } = await supabase
  .from('blog_posts')
  .select('id, slug, lang, title, content, published')
  .eq('published', true);
if (error) { console.error('❌', error.message); process.exit(1); }

let stubs = data
  .filter(p => STUB_RE.test(p.slug))
  .map(p => ({ ...p, wc: wordCount(p.content) }))
  .filter(p => ALL || p.wc < MIN_WORDS)
  .filter(p => !LANG || p.lang === LANG)
  .sort((a, b) => a.lang.localeCompare(b.lang) || a.wc - b.wc);

console.log(`\n🧹 prune-stub-articles.mjs${DRY_RUN ? ' (DRY RUN)' : ''}`);
console.log(`   ${stubs.length} stub(s) to ${DRY_RUN ? 'prune' : 'depublish'}${ALL ? '' : ` (< ${MIN_WORDS} words)`}\n`);

const byLang = {};
for (const s of stubs) byLang[s.lang] = (byLang[s.lang] || 0) + 1;
console.log('   par langue:', byLang, '\n');

if (REDIRECTS) {
  console.log('# ── 301 pour les stubs (à coller dans public/_redirects, avant le catch-all) ──');
  for (const s of stubs) {
    const t = redirectTarget(s.slug, s.lang);
    if (t) console.log(`/${s.lang}/blog/${s.slug}\t${t.replace('https://topcryptocards.eu','')}\t301`);
  }
  console.log('');
}

if (DRY_RUN) {
  stubs.slice(0, 80).forEach(s => console.log(`  ${String(s.wc).padStart(4)}w  [${s.lang}] ${s.slug}`));
  if (stubs.length > 80) console.log(`  … +${stubs.length - 80} more`);
  console.log(`\nRun without --dry-run to depublish (published=false). Add --redirects to also get 301 lines.`);
  process.exit(0);
}

let ok = 0, fail = 0;
for (const s of stubs) {
  const { error: e } = await supabase.from('blog_posts')
    .update({ published: false, updated_at: new Date().toISOString() })
    .eq('id', s.id);
  if (e) { console.log(`  ❌ [${s.lang}] ${s.slug}: ${e.message}`); fail++; }
  else ok++;
}
console.log(`\nDepublished: ${ok} | Failed: ${fail}`);
console.log(`Next: run scripts/generate-sitemap-blog.mjs (they leave the sitemap), commit, redeploy.`);
console.log(`Tip: --redirects prints 301 lines so the stubs pass link equity to /compare and /reviews.\n`);
