#!/usr/bin/env node
/**
 * generate-crypto-articles.mjs
 * Generates 50 crypto articles (10 cryptos × 5 languages) via Claude API
 * and inserts them into Supabase blog_posts with category='crypto'.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... SUPABASE_URL=https://... SUPABASE_SERVICE_KEY=... node scripts/generate-crypto-articles.mjs
 *
 * Optional: generate a single crypto/lang combo for testing:
 *   node scripts/generate-crypto-articles.mjs btc fr
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

/* ── Config ──────────────────────────────────────────────────────────────── */
const ANTHROPIC_KEY  = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL   = process.env.SUPABASE_URL;
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_KEY; // service role key

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY);

const YEAR = new Date().getFullYear();

/* ── Crypto definitions ──────────────────────────────────────────────────── */
const CRYPTOS = [
  { symbol: 'btc',  name: 'Bitcoin',   ticker: 'BTC',  mcap_rank: 1  },
  { symbol: 'eth',  name: 'Ethereum',  ticker: 'ETH',  mcap_rank: 2  },
  { symbol: 'xrp',  name: 'XRP',       ticker: 'XRP',  mcap_rank: 3  },
  { symbol: 'bnb',  name: 'BNB',       ticker: 'BNB',  mcap_rank: 4  },
  { symbol: 'sol',  name: 'Solana',    ticker: 'SOL',  mcap_rank: 5  },
  { symbol: 'ada',  name: 'Cardano',   ticker: 'ADA',  mcap_rank: 8  },
  { symbol: 'avax', name: 'Avalanche', ticker: 'AVAX', mcap_rank: 10 },
  { symbol: 'doge', name: 'Dogecoin',  ticker: 'DOGE', mcap_rank: 7  },
  { symbol: 'usdt', name: 'Tether',    ticker: 'USDT', mcap_rank: 3  },
  { symbol: 'usdc', name: 'USD Coin',  ticker: 'USDC', mcap_rank: 6  },
];

const LANGS = ['fr', 'de', 'es', 'it', 'en'];

const LANG_LABELS: Record<string, string> = {
  fr: 'French', de: 'German', es: 'Spanish', it: 'Italian', en: 'English'
};

/* ── Prompt builder ──────────────────────────────────────────────────────── */
function buildPrompt(crypto: typeof CRYPTOS[0], lang: string): string {
  const langLabel = LANG_LABELS[lang];
  return `You are an expert cryptocurrency writer. Write a comprehensive SEO-optimised article about ${crypto.name} (${crypto.ticker}) in ${langLabel} for a website that compares crypto debit cards.

The article must be written entirely in ${langLabel}. Do NOT mix languages.

Article requirements:
- Length: 1200–1800 words
- Format: Use Markdown headings (## and ###), paragraphs, and bullet lists where appropriate
- Tone: Informative, professional, slightly enthusiastic — for crypto-curious adults
- Year: ${YEAR} (mention it where relevant for freshness)
- Do NOT invent specific prices or market caps — keep financial claims general ("one of the highest market caps", "volatile but widely held", etc.)

Sections to cover (adapt headings to the language):
1. Introduction — what is ${crypto.name}? Why does it matter in ${YEAR}?
2. History and key milestones
3. How it works (technology, consensus, key differentiators)
4. Main use cases
5. Advantages and risks
6. How to buy and store ${crypto.ticker}
7. Using ${crypto.ticker} with a crypto debit card (link to the concept of spending crypto at merchants via a card; mention that crypto cards often support ${crypto.ticker})
8. FAQ (3–5 Q&A)
9. Conclusion

Return ONLY valid JSON (no markdown fence, no commentary) matching this exact schema:
{
  "meta_title": "string (60–70 chars, include ${crypto.name} and ${YEAR})",
  "meta_description": "string (145–160 chars)",
  "title": "string (H1, include ${crypto.name})",
  "content": "string (full article in Markdown)"
}`;
}

/* ── Slugs ───────────────────────────────────────────────────────────────── */
// Slug is always the symbol (btc, eth, etc.) — same across all languages
function getSlug(symbol: string): string {
  return symbol.toLowerCase();
}

/* ── Generator ───────────────────────────────────────────────────────────── */
async function generateArticle(crypto: typeof CRYPTOS[0], lang: string) {
  console.log(`  Generating ${crypto.symbol} / ${lang}…`);
  const prompt = buildPrompt(crypto, lang);

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = (msg.content[0] as { text: string }).text.trim();

  // Strip potential markdown code fences
  const jsonStr = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  let parsed: { meta_title: string; meta_description: string; title: string; content: string };
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.error(`    ❌ JSON parse error for ${crypto.symbol}/${lang}. Raw output:\n${raw.slice(0, 300)}`);
    throw new Error('JSON parse failed');
  }

  return parsed;
}

/* ── Upsert to Supabase ──────────────────────────────────────────────────── */
async function upsertArticle(
  crypto: typeof CRYPTOS[0],
  lang: string,
  article: { meta_title: string; meta_description: string; title: string; content: string }
) {
  const slug = getSlug(crypto.symbol);
  const row = {
    slug,
    lang,
    category: 'crypto',
    title: article.title,
    content: article.content,
    meta_title: article.meta_title,
    meta_description: article.meta_description,
    // published_at is set so the article is live immediately
    published_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('blog_posts')
    .upsert(row, { onConflict: 'slug,lang' });

  if (error) {
    console.error(`    ❌ Supabase upsert error for ${slug}/${lang}:`, error.message);
    throw error;
  }

  console.log(`    ✅ Saved ${slug}/${lang}`);
}

/* ── Rate limiting helper ────────────────────────────────────────────────── */
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  // Optional: single-crypto test mode (e.g. `node script.mjs btc fr`)
  const filterSymbol = process.argv[2];
  const filterLang   = process.argv[3];

  const pairs: Array<{ crypto: typeof CRYPTOS[0]; lang: string }> = [];
  for (const crypto of CRYPTOS) {
    for (const lang of LANGS) {
      if (filterSymbol && crypto.symbol !== filterSymbol) continue;
      if (filterLang   && lang          !== filterLang)   continue;
      pairs.push({ crypto, lang });
    }
  }

  console.log(`\n🚀 Generating ${pairs.length} article(s)…\n`);

  let success = 0;
  let failed  = 0;

  for (const { crypto, lang } of pairs) {
    try {
      const article = await generateArticle(crypto, lang);
      await upsertArticle(crypto, lang, article);
      success++;
    } catch (err) {
      console.error(`  ❌ Failed ${crypto.symbol}/${lang}:`, (err as Error).message);
      failed++;
    }
    // Respect rate limits: ~1 req/sec is safe for Claude Opus
    await sleep(1200);
  }

  console.log(`\n✅ Done. ${success} saved, ${failed} failed.\n`);
}

main();
