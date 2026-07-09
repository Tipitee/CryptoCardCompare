#!/usr/bin/env node
/**
 * fix-orphan-posts.mjs
 *
 * Finds blog_posts where a topic_key has only 1 language variant (true orphans),
 * then generates the missing language translations using the existing post as source.
 *
 * Unlike translate-missing-articles.mjs (FR-only source), this script uses
 * whatever language is available as the source.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/fix-orphan-posts.mjs --dry-run     # show orphans + what would be generated
 *   node scripts/fix-orphan-posts.mjs               # generate & insert
 *   node scripts/fix-orphan-posts.mjs --topic-key blog_es_xyz  # fix one specific topic
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

/* ── Config ──────────────────────────────────────────────────────────────── */
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL  = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env: ANTHROPIC_API_KEY, SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── Args ────────────────────────────────────────────────────────────────── */
const DRY_RUN   = process.argv.includes('--dry-run');
const TOPIC_KEY = (() => { const i = process.argv.indexOf('--topic-key'); return i >= 0 ? process.argv[i+1] : null; })();
const ALL_LANGS = ['fr', 'de', 'es', 'it', 'en'];

/* ── Language config ─────────────────────────────────────────────────────── */
const LANG_CONFIG = {
  fr: { name: 'FRANÇAIS', locale: 'fr-FR', tone: 'Expert mais accessible, professionnel, orienté aide à la décision', site: 'topcryptocards.eu (comparateur de cartes crypto, 5 langues, UE)' },
  de: { name: 'DEUTSCH',  locale: 'de-DE', tone: 'Fachkundig aber zugänglich, professionell, entscheidungsorientiert', site: 'topcryptocards.eu (Krypto-Karten-Vergleich, 5 Sprachen, EU)' },
  es: { name: 'ESPAÑOL',  locale: 'es-ES', tone: 'Experto pero accesible, profesional, orientado a la toma de decisiones', site: 'topcryptocards.eu (comparador de tarjetas crypto, 5 idiomas, UE)' },
  it: { name: 'ITALIANO', locale: 'it-IT', tone: 'Esperto ma accessibile, professionale, orientato alle decisioni', site: 'topcryptocards.eu (comparatore di carte crypto, 5 lingue, UE)' },
  en: { name: 'ENGLISH',  locale: 'en-GB', tone: 'Expert yet accessible, professional, decision-oriented', site: 'topcryptocards.eu (crypto card comparison site, 5 languages, EU)' },
};

/* ── Find orphan posts ───────────────────────────────────────────────────── */
async function findOrphans() {
  let query = supabase
    .from('blog_posts')
    .select('id, slug, lang, topic_key, title, excerpt, content, category, tags')
    .not('topic_key', 'is', null);

  if (TOPIC_KEY) query = query.eq('topic_key', TOPIC_KEY);

  const { data, error } = await query;
  if (error) throw error;

  // Group by topic_key
  const byKey = {};
  for (const p of data) {
    if (!byKey[p.topic_key]) byKey[p.topic_key] = [];
    byKey[p.topic_key].push(p);
  }

  // Return topic_keys with only 1 language
  return Object.values(byKey).filter(posts => posts.length === 1);
}

/* ── Build prompts ───────────────────────────────────────────────────────── */
function buildMetaPrompt(sourcePost, sourceLang, targetLang) {
  const cfg = LANG_CONFIG[targetLang];
  const srcName = LANG_CONFIG[sourceLang]?.name ?? sourceLang.toUpperCase();
  return `You are a professional crypto card expert and multilingual SEO writer for ${cfg.site}.

Translate and adapt these fields from ${srcName} to ${cfg.name}. Tone: ${cfg.tone}.
Keep crypto card brand names (Binance Card, Gnosis Pay, MetaMask Card, etc.) in English.

SOURCE (${srcName}):
Title: ${sourcePost.title}
Excerpt: ${sourcePost.excerpt || '(no excerpt)'}

Return ONLY valid JSON (no markdown wrapper, no comments):
{
  "slug": "string (localized-url-slug-in-${targetLang}, 40–70 chars, same topic adapted)",
  "meta_title": "string (60–70 chars, include main keyword in ${cfg.name})",
  "meta_description": "string (145–160 chars, compelling, includes keyword, in ${cfg.name})",
  "title": "string (H1 title in ${cfg.name})",
  "excerpt": "string (2–3 sentence summary in ${cfg.name})"
}`;
}

function buildContentPrompt(sourcePost, sourceLang, targetLang) {
  const cfg = LANG_CONFIG[targetLang];
  const srcName = LANG_CONFIG[sourceLang]?.name ?? sourceLang.toUpperCase();
  return `You are a professional crypto card expert and multilingual SEO writer for ${cfg.site}.

Translate the following ${srcName} blog article into ${cfg.name}.
- Tone: ${cfg.tone}
- Full translation + localization — same structure, headings, depth
- Keep crypto card brand names in English
- Translate markdown formatting exactly (## headings, bullet lists, bold, etc.)
- Output ONLY the translated markdown article body — no JSON, no wrapper, no preamble

SOURCE ARTICLE BODY (${srcName}):
${sourcePost.content}`;
}

/* ── Generate one translation ────────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function generateTranslation(sourcePost, sourceLang, targetLang) {
  // Call 1: metadata
  const metaMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildMetaPrompt(sourcePost, sourceLang, targetLang) }],
  });

  const metaRaw = metaMsg.content[0].text.trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  let meta;
  try { meta = JSON.parse(metaRaw); }
  catch { throw new Error(`Meta JSON parse failed. Raw: ${metaRaw.slice(0, 200)}`); }

  await sleep(600);

  // Call 2: content
  const contentMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: buildContentPrompt(sourcePost, sourceLang, targetLang) }],
  });

  return { ...meta, content: contentMsg.content[0].text.trim() };
}

/* ── Upsert translation ──────────────────────────────────────────────────── */
async function upsertTranslation(sourcePost, targetLang, generated) {
  const row = {
    slug:             generated.slug,
    lang:             targetLang,
    title:            generated.title,
    content:          generated.content,
    excerpt:          generated.excerpt,
    meta_title:       generated.meta_title,
    meta_description: generated.meta_description,
    topic_key:        sourcePost.topic_key,
    category:         sourcePost.category || 'guide',
    published:        true,
    tags:             sourcePost.tags || [],
  };

  const { error } = await supabase
    .from('blog_posts')
    .upsert(row, { onConflict: 'slug,lang' });

  if (error) throw error;
}

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n🔍 fix-orphan-posts.mjs${DRY_RUN ? ' (DRY RUN)' : ''}`);
  if (TOPIC_KEY) console.log(`   topic_key filter: ${TOPIC_KEY}`);
  console.log();

  const orphanGroups = await findOrphans();

  if (orphanGroups.length === 0) {
    console.log('✅ No orphan posts found — all topic_keys have ≥2 language variants.');
    return;
  }

  console.log(`Found ${orphanGroups.length} orphan(s):\n`);
  for (const [posts] of orphanGroups.map(p => [p])) {
    const source = posts[0];
    const missingLangs = ALL_LANGS.filter(l => l !== source.lang);
    console.log(`  topic_key: ${source.topic_key}`);
    console.log(`  source: [${source.lang}] ${source.slug}`);
    console.log(`  title: ${source.title}`);
    console.log(`  → will generate: ${missingLangs.join(', ')}`);
    console.log();
  }

  if (DRY_RUN) {
    console.log('Dry run complete. Run without --dry-run to generate translations.');
    return;
  }

  let totalGenerated = 0, totalFailed = 0;

  for (const posts of orphanGroups) {
    const source = posts[0];
    const sourceLang = source.lang;
    const missingLangs = ALL_LANGS.filter(l => l !== sourceLang);

    console.log(`\n📝 Processing orphan: [${sourceLang}] ${source.slug}`);

    for (const targetLang of missingLangs) {
      try {
        console.log(`   ⏳ Generating [${targetLang}]…`);
        const generated = await generateTranslation(source, sourceLang, targetLang);
        await upsertTranslation(source, targetLang, generated);
        console.log(`   ✅ [${targetLang}] → ${generated.slug}`);
        totalGenerated++;
        await sleep(800);
      } catch (err) {
        console.error(`   ❌ [${targetLang}] ${err.message}`);
        totalFailed++;
      }
    }

    await sleep(500);
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Generated: ${totalGenerated} | Failed: ${totalFailed}`);
  console.log('\n✅ Done. Orphan posts now have translations in all 5 languages.');
  console.log('Remember to regenerate sitemap-blog.xml:');
  console.log('  node scripts/gen-blog-sitemap.mjs');
  console.log();
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
