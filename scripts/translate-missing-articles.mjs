#!/usr/bin/env node
/**
 * translate-missing-articles.mjs
 *
 * Finds all FR blog_posts that are missing DE / ES / IT / EN translations,
 * generates them via Claude Sonnet, and inserts them into Supabase.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/translate-missing-articles.mjs --dry-run     # show what would be generated
 *   node scripts/translate-missing-articles.mjs               # generate & insert
 *   node scripts/translate-missing-articles.mjs --limit 5     # process only 5 FR articles
 *   node scripts/translate-missing-articles.mjs --topic-key orphan-virtual  # one article group
 *   node scripts/translate-missing-articles.mjs --lang de     # only generate DE translations
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
const DRY_RUN   = process.argv.includes('--dry-run');
const LIMIT     = (() => { const i = process.argv.indexOf('--limit'); return i >= 0 ? parseInt(process.argv[i+1]) : Infinity; })();
const TOPIC_KEY = (() => { const i = process.argv.indexOf('--topic-key'); return i >= 0 ? process.argv[i+1] : null; })();
const LANG_FILTER = (() => { const i = process.argv.indexOf('--lang'); return i >= 0 ? process.argv[i+1] : null; })();
const TARGET_LANGS = LANG_FILTER ? [LANG_FILTER] : ['de', 'es', 'it', 'en'];

/* ── Language config ─────────────────────────────────────────────────────── */
const LANG_CONFIG = {
  de: {
    name: 'DEUTSCH',
    locale: 'de-DE',
    tone: 'Fachkundig aber zugänglich, professionell, entscheidungsorientiert',
    site: 'topcryptocards.eu (Krypto-Karten-Vergleich, 5 Sprachen, EU)',
  },
  es: {
    name: 'ESPAÑOL',
    locale: 'es-ES',
    tone: 'Experto pero accesible, profesional, orientado a la toma de decisiones',
    site: 'topcryptocards.eu (comparador de tarjetas crypto, 5 idiomas, UE)',
  },
  it: {
    name: 'ITALIANO',
    locale: 'it-IT',
    tone: 'Esperto ma accessibile, professionale, orientato alle decisioni',
    site: 'topcryptocards.eu (comparatore di carte crypto, 5 lingue, UE)',
  },
  en: {
    name: 'ENGLISH',
    locale: 'en-GB',
    tone: 'Expert yet accessible, professional, decision-oriented',
    site: 'topcryptocards.eu (crypto card comparison site, 5 languages, EU)',
  },
};

/* ── Prompt ──────────────────────────────────────────────────────────────── */
function buildPrompt(frPost, targetLang) {
  const cfg = LANG_CONFIG[targetLang];
  return `You are a professional crypto card expert and multilingual SEO writer.

Your task: translate and adapt a French blog article into ${cfg.name} for the site ${cfg.site}.

SOURCE ARTICLE (French):
Title: ${frPost.title}
Excerpt: ${frPost.excerpt || ''}

Content:
${frPost.content}

TRANSLATION INSTRUCTIONS:
- Target language: ${cfg.name} — write the ENTIRE response in this language only
- Tone: ${cfg.tone}
- This is a TRANSLATION + LOCALIZATION, not a summary. Keep the same structure, headings, and depth.
- Adapt examples and references to be natural in ${cfg.name} if needed
- Keep crypto card brand names (Binance Card, Gnosis Pay, MetaMask Card, etc.) in their original English form
- Translate markdown formatting exactly: ## headings stay as ## headings, bullet lists stay as bullet lists
- Generate a localized URL slug (lowercase, hyphens, no accents, appropriate keywords for ${cfg.name})

Return ONLY valid JSON (no markdown wrapper, no comments):
{
  "slug": "string (localized-url-slug-in-${targetLang}, 40–70 chars, target keyword + year if relevant)",
  "meta_title": "string (60–70 chars, include main keyword in ${cfg.name})",
  "meta_description": "string (145–160 chars, compelling, includes keyword, in ${cfg.name})",
  "title": "string (H1 title in ${cfg.name})",
  "excerpt": "string (2–3 sentence summary in ${cfg.name})",
  "content": "string (full translated article in Markdown, same length and structure as source)"
}`;
}

/* ── Generate one translation ────────────────────────────────────────────── */
async function generateTranslation(frPost, targetLang) {
  const prompt = buildPrompt(frPost, targetLang);

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text.trim();
  const jsonStr = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    return JSON.parse(jsonStr);
  } catch {
    console.error(`  ❌ JSON parse error. Raw:\n${raw.slice(0, 400)}`);
    throw new Error('JSON parse failed');
  }
}

/* ── Check if translation exists ─────────────────────────────────────────── */
async function findExistingTranslations(topicKey) {
  if (!topicKey) return new Set();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('lang')
    .eq('topic_key', topicKey);

  if (error) throw error;
  return new Set((data || []).map(r => r.lang));
}

/* ── Upsert translation ──────────────────────────────────────────────────── */
async function upsertTranslation(frPost, targetLang, generated) {
  const row = {
    slug: generated.slug,
    lang: targetLang,
    title: generated.title,
    content: generated.content,
    excerpt: generated.excerpt,
    meta_title: generated.meta_title,
    meta_description: generated.meta_description,
    topic_key: frPost.topic_key,
    category: frPost.category || 'guide',
    published: true,
    tags: [],
  };

  const { error } = await supabase
    .from('blog_posts')
    .upsert(row, { onConflict: 'slug,lang' });

  if (error) throw error;
}

/* ── Sleep ───────────────────────────────────────────────────────────────── */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n🌍 translate-missing-articles.mjs${DRY_RUN ? ' (DRY RUN)' : ''}`);
  if (TOPIC_KEY) console.log(`   topic_key filter: ${TOPIC_KEY}`);
  if (LANG_FILTER) console.log(`   lang filter: ${LANG_FILTER}`);
  if (LIMIT < Infinity) console.log(`   limit: ${LIMIT} FR articles`);
  console.log(`   target langs: ${TARGET_LANGS.join(', ')}\n`);

  // 1. Fetch all FR posts
  let query = supabase
    .from('blog_posts')
    .select('id, slug, lang, title, excerpt, content, topic_key, category, tags')
    .eq('lang', 'fr')
    .eq('published', true)
    .not('topic_key', 'is', null)
    .order('created_at', { ascending: false });

  if (TOPIC_KEY) query = query.eq('topic_key', TOPIC_KEY);

  const { data: frPosts, error } = await query;
  if (error) { console.error('❌ Query error:', error.message); process.exit(1); }

  const posts = frPosts.slice(0, LIMIT);
  console.log(`Found ${frPosts.length} FR articles${LIMIT < Infinity ? ` (processing first ${posts.length})` : ''}\n`);

  let totalGenerated = 0, totalSkipped = 0, totalFailed = 0;

  for (const frPost of posts) {
    const existingLangs = await findExistingTranslations(frPost.topic_key);
    const missingLangs = TARGET_LANGS.filter(l => !existingLangs.has(l));

    if (missingLangs.length === 0) {
      console.log(`✓ [${frPost.slug}] all langs exist`);
      totalSkipped++;
      continue;
    }

    console.log(`\n📝 [${frPost.slug}] (topic: ${frPost.topic_key})`);
    console.log(`   existing: ${[...existingLangs].join(', ')} | missing: ${missingLangs.join(', ')}`);

    if (DRY_RUN) {
      console.log(`   → would generate: ${missingLangs.join(', ')}`);
      totalGenerated += missingLangs.length;
      continue;
    }

    for (const targetLang of missingLangs) {
      try {
        console.log(`   ⏳ Generating [${targetLang}]…`);
        const generated = await generateTranslation(frPost, targetLang);
        await upsertTranslation(frPost, targetLang, generated);
        console.log(`   ✅ [${targetLang}] → slug: ${generated.slug}`);
        totalGenerated++;
        await sleep(800); // rate limiting between API calls
      } catch (err) {
        console.error(`   ❌ [${targetLang}] ${err.message}`);
        totalFailed++;
      }
    }

    await sleep(500); // between articles
  }

  console.log(`\n${'─'.repeat(60)}`);
  if (DRY_RUN) {
    console.log(`Would generate: ${totalGenerated} translations`);
    console.log(`Already complete: ${totalSkipped} articles`);
    console.log(`\nRun without --dry-run to generate.`);
  } else {
    console.log(`Generated: ${totalGenerated} | Skipped: ${totalSkipped} | Failed: ${totalFailed}`);
  }
  console.log();
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
