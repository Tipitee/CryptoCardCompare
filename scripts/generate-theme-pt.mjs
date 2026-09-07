#!/usr/bin/env node
/**
 * generate-theme-pt.mjs
 *
 * Translates the FR THEME_SECTIONS (H2 SEO blocks) and THEME_FAQ of
 * src/pages/ThematicPage.tsx into European Portuguese (pt-PT), adapted for the
 * Portuguese market, and writes src/data/themeContentPt.ts.
 *
 * This does NOT edit ThematicPage.tsx (it only reads it) — the pt content lives
 * in a separate overlay file merged at runtime, so there is zero risk of
 * corrupting the big config file.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/generate-theme-pt.mjs --dry-run     # list themes to translate
 *   node scripts/generate-theme-pt.mjs               # translate + write overlay
 *   node scripts/generate-theme-pt.mjs --limit 3
 *
 * Requires: ANTHROPIC_API_KEY
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error('❌ ANTHROPIC_API_KEY required'); process.exit(1); }
const anthropic = new Anthropic({ apiKey: KEY });

const DRY = process.argv.includes('--dry-run');
const LIMIT = (() => { const i = process.argv.indexOf('--limit'); return i >= 0 ? parseInt(process.argv[i + 1]) : Infinity; })();

const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'ThematicPage.tsx'), 'utf-8');

/** Return the balanced [...] or {...} literal starting at the bracket at/after `from`. */
function balanced(text, from, open, close) {
  const start = text.indexOf(open, from);
  if (start < 0) return null;
  let depth = 0, i = start, str = null;
  for (; i < text.length; i++) {
    const c = text[i], prev = text[i - 1];
    if (str) { if (c === str && prev !== '\\') str = null; continue; }
    if (c === '`' || c === '"' || c === "'") { str = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }
  return null;
}

/** Extract the FR array literal (as TS text) for a theme inside a named map. */
function extractFrArray(mapName, theme) {
  const mapStart = src.indexOf(`const ${mapName}`);
  if (mapStart < 0) return null;
  const themeRe = new RegExp(`\\n  '?${theme.replace(/[-]/g, '\\-')}'?: \\{`);
  const m = src.slice(mapStart).match(themeRe);
  if (!m) return null;
  const themeAbs = mapStart + m.index;
  const frIdx = src.indexOf('fr:', themeAbs);
  if (frIdx < 0) return null;
  return balanced(src, frIdx, '[', ']');
}

const THEMES = ['credit','business','bitcoin','best','cashback','no-fees','no-staking','france','virtual','beginner','no-kyc','2026','travel','rewards','physical','belgium','austria','iban'];

const PT_NOTE = `Write EUROPEAN Portuguese (pt-PT, Portugal — never Brazilian: "cartão", "grátis", "comissões", "levantamento", "detido", impersonal or "tu", never "você"). Keep crypto/card brand names in English. Keep the same structure and length. Where a paragraph mentions a country, tax or regulator, adapt to Portugal: Banco de Portugal / MiCA, and the Portuguese crypto tax (28% on gains if held < 365 days, exempt after one year; paying with crypto is a taxable disposal). Keep any \${YEAR} template markers intact.`;

async function translate(kind, frText, attempt = 1) {
  const shape = kind === 'sections'
    ? 'an array of objects {"h2": string, "p": string}'
    : 'an array of objects {"q": string, "a": string}';
  const prompt = `Translate this French ${kind === 'sections' ? 'set of SEO content blocks' : 'FAQ'} into European Portuguese for a crypto-card comparison site.
${PT_NOTE}
Return ONLY valid JSON: ${shape}. No markdown fences, no comment.

French source (TypeScript array):
${frText}`;
  try {
    const msg = await anthropic.messages.create({ model: 'claude-sonnet-4-6', max_tokens: 8192, messages: [{ role: 'user', content: prompt }] });
    const txt = msg.content[0].text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(txt);
  } catch (e) {
    if (attempt < 3) { await new Promise(r => setTimeout(r, attempt * 2000)); return translate(kind, frText, attempt + 1); }
    throw e;
  }
}

// Load existing overlay (incremental)
const outPath = path.join(ROOT, 'src', 'data', 'themeContentPt.ts');
let SEC = {}, FAQ = {};
try {
  const ex = fs.readFileSync(outPath, 'utf-8');
  const sm = ex.match(/THEME_SECTIONS_PT[^=]*=\s*(\{[\s\S]*?\});/);
  const fm = ex.match(/THEME_FAQ_PT[^=]*=\s*(\{[\s\S]*?\});/);
  if (sm) SEC = JSON.parse(sm[1]); if (fm) FAQ = JSON.parse(fm[1]);
} catch {}

const sleep = ms => new Promise(r => setTimeout(r, ms));
let done = 0;
for (const theme of THEMES) {
  if (done >= LIMIT) break;
  const secFr = extractFrArray('THEME_SECTIONS', theme);
  const faqFr = extractFrArray('THEME_FAQ', theme);
  const needSec = secFr && !(SEC[theme]?.length);
  const needFaq = faqFr && !(FAQ[theme]?.length);
  if (!needSec && !needFaq) continue;
  console.log(`\n📝 ${theme}${DRY ? ' (dry)' : ''}  sections=${needSec ? 'yes' : '-'} faq=${needFaq ? 'yes' : '-'}`);
  done++;
  if (DRY) continue;
  try {
    if (needSec) { SEC[theme] = await translate('sections', secFr); await sleep(700); }
    if (needFaq) { FAQ[theme] = await translate('faq', faqFr); await sleep(700); }
    console.log('   ✅');
  } catch (e) { console.log('   ❌', e.message); }
}

if (!DRY) {
  const file = `// ─────────────────────────────────────────────────────────────────────────────
// themeContentPt.ts — AUTO-GENERATED by scripts/generate-theme-pt.mjs
// DO NOT EDIT MANUALLY. Generated: ${new Date().toISOString()}
// ─────────────────────────────────────────────────────────────────────────────

export const THEME_SECTIONS_PT: Record<string, { h2: string; p: string }[]> = ${JSON.stringify(SEC, null, 2)};

export const THEME_FAQ_PT: Record<string, { q: string; a: string }[]> = ${JSON.stringify(FAQ, null, 2)};
`;
  fs.writeFileSync(outPath, file, 'utf-8');
  console.log(`\n✅ Written ${Object.keys(SEC).length} section-sets + ${Object.keys(FAQ).length} FAQ-sets to src/data/themeContentPt.ts`);
} else {
  console.log(`\n${done} theme(s) would be translated. Run without --dry-run.`);
}
