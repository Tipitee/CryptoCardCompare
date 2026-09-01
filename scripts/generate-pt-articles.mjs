#!/usr/bin/env node
/**
 * generate-pt-articles.mjs
 *
 * Generates European-Portuguese (pt-PT) versions of the 10 PRIORITY French blog
 * articles, adapted for the Portuguese market (tax 28% / 365-day rule, Banco de
 * Portugal / MiCA, availability in Portugal), and inserts them into Supabase.
 *
 * The hero image is copied from the French article (same image_hero), and the
 * pt row shares the FR topic_key so future hero regenerations propagate to it.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/generate-pt-articles.mjs --dry-run    # show what would be generated
 *   node scripts/generate-pt-articles.mjs              # generate & insert
 *   node scripts/generate-pt-articles.mjs --limit 3    # only first N priority slugs
 *   node scripts/generate-pt-articles.mjs --force      # regenerate even if pt exists
 *
 * Requires in .env: ANTHROPIC_API_KEY, SUPABASE_URL (or VITE_SUPABASE_URL),
 *                   SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

/* ── Config ──────────────────────────────────────────────────────────────── */
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL  = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── Args ────────────────────────────────────────────────────────────────── */
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE   = process.argv.includes('--force');
const LIMIT   = (() => { const i = process.argv.indexOf('--limit'); return i >= 0 ? parseInt(process.argv[i + 1]) : Infinity; })();

/* ── The 10 priority FR slugs (head terms + Portugal fiscal relevance) ────── */
const PRIORITY_FR_SLUGS = [
  'meilleures-cartes-crypto-2026',          // best crypto cards (head term)
  'carte-crypto-cashback-2026-classement',  // cashback ranking (head term)
  'carte-crypto-impots-france',             // TAX — flagship for Portugal (28%/365d)
  'carte-crypto-bitcoin-2026',              // bitcoin card
  'carte-crypto-sans-frais-annuels',        // no annual fees
  'quelle-carte-crypto-choisir-2026',       // how to choose
  'cartes-crypto-guide-debutant',           // beginner guide
  'carte-crypto-voyage-guide-complet',      // travel
  'carte-crypto-sans-staking',              // no staking
  'carte-crypto-legale-france',             // legality/regulation — adapt to Banco de Portugal
];

/* ── Portugal market localisation guidance (injected into prompts) ───────── */
const PT_MARKET_NOTES = `PORTUGAL MARKET ADAPTATION (very important):
- Write in EUROPEAN Portuguese (pt-PT, Portugal), NEVER Brazilian. Use "cartão", "grátis", "comissões", "levantamento" (not "saque"), "detido", "telemóvel", "IVA", impersonal or "tu" (never "você").
- Replace any France/French-specific references (AMF, "en France", French tax rules, French availability) with the PORTUGUESE equivalents:
  * Regulator: Banco de Portugal (registo VASP/CASP) and the EU MiCA regime. Mention the AMF only if comparing.
  * Availability: "disponível em Portugal" instead of "disponible en France".
- TAX (crucial and unique to Portugal — weave it in wherever spending/selling crypto is discussed):
  * In Portugal, crypto capital gains on assets HELD LESS THAN 365 DAYS are taxed at 28% (IRS categoria G). Assets held 365 days or MORE are EXEMPT (0%).
  * Paying with crypto (or converting it) is a taxable disposal (alienação). So spending older coins (≥ 365 days) can be tax-efficient. This rule was unchanged in the 2026 budget.
  * If the source article is about French taxation, REWRITE the tax section entirely for Portugal (do not translate French tax rules literally).
- Keep the SEO structure (H2/H3, lists, bold) and depth. Keep crypto/card brand names in English (Binance Card, Gnosis Pay, MetaMask Card, Nexo, Crypto.com, etc.).`;

/* ── Prompts ─────────────────────────────────────────────────────────────── */
function buildMetaPrompt(frPost) {
  return `You are a professional crypto-card expert and SEO writer for topcryptocards.eu (crypto card comparison, European market).

Adapt these fields from French to EUROPEAN Portuguese (pt-PT) for the PORTUGUESE market.
${PT_MARKET_NOTES}

SOURCE (French):
Title: ${frPost.title}
Excerpt: ${frPost.excerpt || ''}

Return ONLY valid JSON (no markdown wrapper, no comments):
{
  "slug": "string (localized pt-PT url slug, 40-70 chars, target keyword; use 'portugal' where a country reference existed, e.g. cartoes-crypto-portugal-2026)",
  "meta_title": "string (55-65 chars, main keyword in Portuguese)",
  "meta_description": "string (140-160 chars, compelling, keyword, pt-PT)",
  "title": "string (H1 in pt-PT)",
  "excerpt": "string (2-3 sentence summary in pt-PT)"
}`;
}

function buildContentPrompt(frPost) {
  return `You are a professional crypto-card expert and SEO writer for topcryptocards.eu.

Translate AND localise the following French blog article into EUROPEAN Portuguese (pt-PT) for the PORTUGUESE market.
${PT_MARKET_NOTES}

Output ONLY the localised markdown article body — no JSON, no wrapper, no preamble. Keep the same markdown structure (## / ### headings, bullet lists, bold).

SOURCE ARTICLE BODY (French):
${frPost.content}`;
}

/* ── Generate one pt article (meta + content) ────────────────────────────── */
async function generatePt(frPost) {
  const metaMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildMetaPrompt(frPost) }],
  });
  const metaRaw = metaMsg.content[0].text.trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  let meta;
  try { meta = JSON.parse(metaRaw); }
  catch { throw new Error(`Meta JSON parse failed. Raw: ${metaRaw.slice(0, 200)}`); }

  await sleep(600);

  const contentMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: buildContentPrompt(frPost) }],
  });
  const content = contentMsg.content[0].text.trim();

  return { ...meta, content };
}

/* ── Does a pt version already exist for this topic_key? ─────────────────── */
async function ptExists(topicKey) {
  if (!topicKey) return false;
  const { data, error } = await supabase
    .from('blog_posts').select('lang').eq('topic_key', topicKey).eq('lang', 'pt');
  if (error) throw error;
  return (data || []).length > 0;
}

/* ── Upsert (hero image copied from FR, shared topic_key) ────────────────── */
async function upsertPt(frPost, gen) {
  const row = {
    slug: gen.slug,
    lang: 'pt',
    title: gen.title,
    content: gen.content,
    excerpt: gen.excerpt,
    meta_title: gen.meta_title,
    meta_description: gen.meta_description,
    topic_key: frPost.topic_key,
    category: frPost.category || 'guide',
    image_hero: frPost.image_hero || null,   // ← hero from the French article
    published: true,
    tags: frPost.tags || [],
  };
  const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
  if (error) throw error;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n🇵🇹 generate-pt-articles.mjs${DRY_RUN ? ' (DRY RUN)' : ''}`);
  const slugs = PRIORITY_FR_SLUGS.slice(0, LIMIT);
  console.log(`   priority FR slugs: ${slugs.length}\n`);

  // Fetch the FR source posts (must be published; need image_hero + topic_key)
  const { data: frPosts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, lang, title, excerpt, content, topic_key, category, tags, image_hero')
    .eq('lang', 'fr')
    .in('slug', slugs);
  if (error) { console.error('❌ Query error:', error.message); process.exit(1); }

  const bySlug = new Map((frPosts || []).map(p => [p.slug, p]));
  let generated = 0, skipped = 0, failed = 0, missing = 0;

  for (const slug of slugs) {
    const frPost = bySlug.get(slug);
    if (!frPost) { console.log(`⚠️  FR source not found: ${slug}`); missing++; continue; }

    if (!FORCE && await ptExists(frPost.topic_key)) {
      console.log(`✓ [${slug}] pt already exists (topic: ${frPost.topic_key})`);
      skipped++; continue;
    }

    console.log(`\n📝 [${slug}] (topic: ${frPost.topic_key}) hero: ${frPost.image_hero ? 'yes' : 'none'}`);
    if (DRY_RUN) { console.log('   → would generate pt'); generated++; continue; }

    try {
      const gen = await generatePt(frPost);
      await upsertPt(frPost, gen);
      console.log(`   ✅ pt → /pt/blog/${gen.slug}`);
      generated++;
      await sleep(900);
    } catch (err) {
      console.error(`   ❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(DRY_RUN
    ? `Would generate: ${generated} | Skip (exists): ${skipped} | FR missing: ${missing}\nRun without --dry-run to generate.`
    : `Generated: ${generated} | Skipped: ${skipped} | Failed: ${failed} | FR missing: ${missing}`);
  console.log(`\nNext: redeploy (or run scripts/generate-sitemap-blog.mjs) so /pt/blog/* enters the sitemap.\n`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
