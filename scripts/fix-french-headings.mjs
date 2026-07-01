#!/usr/bin/env node
/**
 * fix-french-headings.mjs
 *
 * Fixes card_articles entries where non-FR articles still contain French H2 headings.
 * Replaces all known French heading patterns with the correct translation per language.
 *
 * Usage:
 *   node scripts/fix-french-headings.mjs --dry-run   # show what would be changed
 *   node scripts/fix-french-headings.mjs              # apply fixes
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Load .env ─────────────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, '.env'), 'utf8');
    const env = {};
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    }
    return env;
  } catch { return {}; }
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');

const HEADERS = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

// ── H2 replacement rules per language ────────────────────────────────────────
// All patterns target only inside <h2>...</h2> so body text is never changed.
const RULES = {
  en: [
    [/<h2([^>]*)>Présentation (?:de (?:la |l[''‘’]|les |)|du |der |des )(.+?)<\/h2>/gi, '<h2$1>Overview: $2</h2>'],
    [/<h2([^>]*)>Cashback (?:et récompenses?|und Récompenses?|y recompenses?|et Récompenses?)<\/h2>/gi, '<h2$1>Cashback &amp; Rewards</h2>'],
    [/<h2([^>]*)>Frais et [Cc]onditions(?:\s*\/\s*Geb[üu]hren und Bedingungen)?<\/h2>/gi, '<h2$1>Fees &amp; Conditions</h2>'],
    [/<h2([^>]*)>Pour qui (?:est cette carte|est diese Karte|est esta tarjeta|ist diese Karte geeignet)\s*\??<\/h2>/gi, '<h2$1>Who Is This Card For?</h2>'],
    [/<h2([^>]*)>Avantages<\/h2>/gi, '<h2$1>Pros</h2>'],
    [/<h2([^>]*)>Inconvénients<\/h2>/gi, '<h2$1>Cons</h2>'],
    [/<h2([^>]*)>Notre [Vv]erdict<\/h2>/gi, '<h2$1>Our Verdict</h2>'],
  ],
  de: [
    [/<h2([^>]*)>Présentation (?:de (?:la |l[''‘’]|les |)|du |der |des )(.+?)<\/h2>/gi, '<h2$1>Überblick: $2</h2>'],
    [/<h2([^>]*)>Cashback (?:et récompenses?|und Récompenses?|y recompenses?|et Récompenses?)<\/h2>/gi, '<h2$1>Cashback &amp; Prämien</h2>'],
    [/<h2([^>]*)>Frais et [Cc]onditions(?:\s*\/\s*Geb[üu]hren und Bedingungen)?<\/h2>/gi, '<h2$1>Gebühren &amp; Konditionen</h2>'],
    [/<h2([^>]*)>Pour qui (?:est cette carte|est diese Karte|est esta tarjeta|ist diese Karte geeignet)\s*\??<\/h2>/gi, '<h2$1>Für wen ist diese Karte?</h2>'],
    [/<h2([^>]*)>Avantages<\/h2>/gi, '<h2$1>Vorteile</h2>'],
    [/<h2([^>]*)>Inconvénients<\/h2>/gi, '<h2$1>Nachteile</h2>'],
    [/<h2([^>]*)>Notre [Vv]erdict<\/h2>/gi, '<h2$1>Unser Fazit</h2>'],
  ],
  es: [
    [/<h2([^>]*)>Présentation (?:de (?:la |l[''‘’]|les |)|du |der |des )(.+?)<\/h2>/gi, '<h2$1>Descripción de la $2</h2>'],
    [/<h2([^>]*)>Cashback (?:et récompenses?|und Récompenses?|y recompenses?|et Récompenses?)<\/h2>/gi, '<h2$1>Cashback y recompensas</h2>'],
    [/<h2([^>]*)>Frais et [Cc]onditions(?:\s*\/\s*Geb[üu]hren und Bedingungen)?<\/h2>/gi, '<h2$1>Tarifas y condiciones</h2>'],
    [/<h2([^>]*)>Pour qui (?:est cette carte|est diese Karte|est esta tarjeta|ist diese Karte geeignet)\s*\??<\/h2>/gi, '<h2$1>¿Para quién es esta tarjeta?</h2>'],
    [/<h2([^>]*)>Avantages<\/h2>/gi, '<h2$1>Ventajas</h2>'],
    [/<h2([^>]*)>Inconvénients<\/h2>/gi, '<h2$1>Inconvenientes</h2>'],
    [/<h2([^>]*)>Notre [Vv]erdict<\/h2>/gi, '<h2$1>Nuestro veredicto</h2>'],
  ],
  it: [
    [/<h2([^>]*)>Présentation (?:de (?:la |l[''‘’]|les |)|du |der |des )(.+?)<\/h2>/gi, '<h2$1>Panoramica della $2</h2>'],
    [/<h2([^>]*)>Cashback (?:et récompenses?|und Récompenses?|y recompenses?|et Récompenses?)<\/h2>/gi, '<h2$1>Cashback e premi</h2>'],
    [/<h2([^>]*)>Frais et [Cc]onditions(?:\s*\/\s*Geb[üu]hren und Bedingungen)?<\/h2>/gi, '<h2$1>Commissioni e condizioni</h2>'],
    [/<h2([^>]*)>Pour qui (?:est cette carte|est diese Karte|est esta tarjeta|ist diese Karte geeignet)\s*\??<\/h2>/gi, '<h2$1>Per chi è questa carta?</h2>'],
    [/<h2([^>]*)>Avantages<\/h2>/gi, '<h2$1>Vantaggi</h2>'],
    [/<h2([^>]*)>Inconvénients<\/h2>/gi, '<h2$1>Svantaggi</h2>'],
    [/<h2([^>]*)>Notre [Vv]erdict<\/h2>/gi, '<h2$1>Il nostro verdetto</h2>'],
  ],
};

const FRENCH_MARKERS = [
  'Présentation', 'Cashback et', 'récompenses', 'Récompenses',
  'Frais et', 'Pour qui', 'Avantages', 'Inconvénients', 'Notre verdict', 'Notre Verdict',
];

function fixH2(content, lang) {
  let c = content;
  for (const [pattern, replacement] of (RULES[lang] || [])) {
    c = c.replace(pattern, replacement);
  }
  return c;
}

function isContaminated(content) {
  return FRENCH_MARKERS.some(m => content.includes(m));
}

async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function supabasePatch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: { ...HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}: ${await res.text()}`);
  return res;
}

async function main() {
  console.log(`\n🔧  fix-french-headings.mjs${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

  // Fetch all non-FR published articles
  console.log('📥  Fetching non-FR articles from Supabase...');
  const articles = await supabaseGet(
    'card_articles?select=card_id,lang,content&lang=neq.fr&published=eq.true&limit=1000'
  );
  console.log(`    ${articles.length} articles fetched`);

  // Filter contaminated
  const contaminated = articles.filter(a => a.content && isContaminated(a.content));
  console.log(`    ${contaminated.length} articles with French headings\n`);

  let fixed = 0, skipped = 0, errors = 0;

  for (const a of contaminated) {
    const newContent = fixH2(a.content, a.lang);
    if (newContent === a.content) {
      console.log(`  ⚠️  [${a.lang}] ${a.card_id} — no change after replacement (check patterns)`);
      skipped++;
      continue;
    }

    // Show what changed
    const oldH2s = [...a.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1]);
    const newH2s = [...newContent.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1]);
    const changed = oldH2s.filter((h, i) => h !== newH2s[i]);

    if (DRY_RUN) {
      console.log(`  📝 [${a.lang}] ${a.card_id}`);
      for (let i = 0; i < oldH2s.length; i++) {
        if (oldH2s[i] !== newH2s[i]) {
          console.log(`      "${oldH2s[i]}" → "${newH2s[i]}"`);
        }
      }
      fixed++;
      continue;
    }

    try {
      await supabasePatch(
        `card_articles?card_id=eq.${encodeURIComponent(a.card_id)}&lang=eq.${a.lang}`,
        { content: newContent }
      );
      console.log(`  ✅ [${a.lang}] ${a.card_id} (${changed.length} heading${changed.length > 1 ? 's' : ''} fixed)`);
      fixed++;
    } catch (err) {
      console.error(`  ❌ [${a.lang}] ${a.card_id}: ${err.message}`);
      errors++;
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 80));
  }

  console.log(`\n${'─'.repeat(60)}`);
  if (DRY_RUN) {
    console.log(`Would fix: ${fixed} articles | Skipped (no match): ${skipped}`);
    console.log(`\nRun without --dry-run to apply.`);
  } else {
    console.log(`Fixed: ${fixed} | Skipped: ${skipped} | Errors: ${errors}`);
  }
  console.log();
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
