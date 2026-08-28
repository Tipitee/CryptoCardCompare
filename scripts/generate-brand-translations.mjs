/**
 * generate-brand-translations.mjs
 *
 * Adds European Portuguese (pt-PT) SEO content for every brand in
 * src/data/brandConfig.ts, by translating each brand's existing EN `seo.en`
 * block via the Claude API. Writes src/data/brandConfigPt.ts.
 *
 * Incremental: brands already present in brandConfigPt.ts are skipped, so a
 * re-run only fills in what's missing (or newly added brands).
 *
 * Usage (from project root, needs ANTHROPIC_API_KEY in .env):
 *   node scripts/generate-brand-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── API key ──────────────────────────────────────────────────────────────────
const envPath = path.join(ROOT, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/ANTHROPIC_API_KEY=(.+)/);
if (!apiKeyMatch) { console.error('ANTHROPIC_API_KEY not found in .env'); process.exit(1); }
const ANTHROPIC_API_KEY = apiKeyMatch[1].trim();

// ── Read source ───────────────────────────────────────────────────────────────
const srcPath = path.join(ROOT, 'src', 'data', 'brandConfig.ts');
const src = fs.readFileSync(srcPath, 'utf-8');

const BRAND_IDS = [
  'crypto-com','wirex','nexo','bybit','binance','okx','coinbase','bitpanda','kraken',
  'deblock','revolut','ledger','trade-republic','bleap','plutus','brighty','gnosis',
  'metamask','ether-fi','bitget','kucoin','young-platform','bit2me','whitebit','gate',
];

/** Return the balanced `{...}` literal starting at the first `{` at/after `from`. */
function balancedObject(text, from) {
  const start = text.indexOf('{', from);
  if (start < 0) return null;
  let depth = 0, i = start, str = null;
  for (; i < text.length; i++) {
    const c = text[i], prev = text[i - 1];
    if (str) {
      if (c === str && prev !== '\\') str = null;
      continue;
    }
    if (c === '`' || c === '"' || c === "'") { str = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }
  return null;
}

/** Extract the EN seo object literal (as TS source) for a brand. */
function extractEnSeo(brandId) {
  const re = new RegExp(`\\n  '${brandId.replace(/[-]/g, '\\-')}':\\s*\\{`);
  const m = src.match(re);
  if (!m) return null;
  const brandStart = m.index;
  const seoIdx = src.indexOf('seo:', brandStart);
  if (seoIdx < 0) return null;
  // Match the seo-level language key `en: {` (6-space indent), not any nested "en:".
  const enMatch = src.slice(seoIdx).match(/\n {6}en:\s*\{/);
  if (!enMatch) return null;
  const enIdx = seoIdx + enMatch.index;
  return balancedObject(src, enIdx);
}

// ── Prompt ────────────────────────────────────────────────────────────────────
function buildPrompt(brandId, enSeoTs) {
  return `You are a professional crypto-finance copywriter. Below is a TypeScript object literal holding the ENGLISH SEO content for the "${brandId}" brand page of a crypto-card comparison site.

Translate every human-readable STRING VALUE into EUROPEAN Portuguese (pt-PT, Portugal — NOT Brazilian).

Rules:
- Return ONLY a valid JSON object (no code fences, no comment, no trailing text).
- Preserve the exact keys and structure (title, description, intro, outro, rating, pros[], cons[], faq[] with {q,a}). Keep any numeric "rating" unchanged.
- Keep **bold** markdown markers, numbers, percentages, brand/product names and crypto tickers (BTC, ETH, CRO, BNB, GNO, USDC…) unchanged.
- European Portuguese only: "cartão", "grátis", "comissões", "levantamento" (not "saque"), "detido", impersonal or "tu" (never "você").
- title ≤ 60 chars, description ≤ 155 chars, both SEO-optimised in Portuguese.
- Keep the tone informative and direct.
- Where natural (in an intro, outro or an FAQ answer about availability/taxes), you MAY add that the card is available in Portugal via Banco de Portugal / MiCA-registered providers, and that paying with crypto held under 365 days triggers a 28% capital-gains tax (exempt after one year). Do not force it if it doesn't fit.

English source (TypeScript):
${enSeoTs}

Return the same object translated to European Portuguese as JSON.`;
}

async function translateBrand(brandId, enSeoTs, attempt = 1) {
  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{ role: 'user', content: buildPrompt(brandId, enSeoTs) }],
      }),
    });
  } catch (networkErr) {
    if (attempt < 3) { await new Promise(r => setTimeout(r, attempt * 2000)); return translateBrand(brandId, enSeoTs, attempt + 1); }
    throw networkErr;
  }
  if (!response.ok) {
    const err = await response.text();
    if ((response.status === 529 || response.status >= 500) && attempt < 3) {
      await new Promise(r => setTimeout(r, attempt * 2000));
      return translateBrand(brandId, enSeoTs, attempt + 1);
    }
    throw new Error(`API error ${response.status}: ${err}`);
  }
  const data = await response.json();
  const text = data.content[0].text.trim();
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(clean);
}

// ── Load existing (incremental) ───────────────────────────────────────────────
const outputPath = path.join(ROOT, 'src', 'data', 'brandConfigPt.ts');
let RESULTS = {};
if (fs.existsSync(outputPath)) {
  try {
    const existing = fs.readFileSync(outputPath, 'utf-8');
    const match = existing.match(/export const BRAND_SEO_PT[^=]+=\s*(\{[\s\S]*?\});\s*$/m);
    if (match) {
      RESULTS = JSON.parse(match[1]);
      console.log(`Loaded ${Object.keys(RESULTS).length} existing PT brand blocks.`);
    }
  } catch { console.log('Could not parse existing brandConfigPt.ts — starting fresh.'); }
}

// ── Main ──────────────────────────────────────────────────────────────────────
const todo = [];
for (const brandId of BRAND_IDS) {
  if (RESULTS[brandId]) continue;
  const en = extractEnSeo(brandId);
  if (!en || en.length < 40) { console.log(`  (skip ${brandId}: no EN seo)`); continue; }
  todo.push({ brandId, en });
}
console.log(`Translating ${todo.length} brands to PT...\n`);

let done = 0;
for (const { brandId, en } of todo) {
  process.stdout.write(`  [${++done}/${todo.length}] ${brandId} ... `);
  try {
    RESULTS[brandId] = await translateBrand(brandId, en);
    console.log('✓');
  } catch (e) {
    console.log(`✗ ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 300));
}

// ── Write output ──────────────────────────────────────────────────────────────
const fileContent = `// ─────────────────────────────────────────────────────────────────────────────
// brandConfigPt.ts
// AUTO-GENERATED by scripts/generate-brand-translations.mjs
// DO NOT EDIT MANUALLY — re-run the script to regenerate.
// Generated: ${new Date().toISOString()}
// Merged into BRAND_CONFIG (seo.pt) by brandConfig.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND_SEO_PT: Record<string, {
  title: string;
  description: string;
  intro: string;
  outro: string;
  rating?: number;
  pros?: string[];
  cons?: string[];
  faq?: Array<{ q: string; a: string }>;
}> = ${JSON.stringify(RESULTS, null, 2)};
`;
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`\n✅ Written ${Object.keys(RESULTS).length} PT brand blocks to src/data/brandConfigPt.ts`);
