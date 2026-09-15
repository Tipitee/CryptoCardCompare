#!/usr/bin/env node
/**
 * generate-mica-article.mjs
 *
 * Publishes the "MiCA regulation & security" article across all content markets.
 * Base = hand-written FR master (seo/content-drafts/carte-crypto-regulation-mica-2026-fr.md).
 * The FR row is inserted as-is; de/es/it/en/pt are localised with Claude, adapting the
 * NATIONAL regulator per market and (for en = UK) reframing to the FCA regime (UK is
 * outside MiCA). Internal-link slugs are rewritten in code (not trusted to the LLM).
 * be/at reuse fr/de content at display time, so no separate rows are created for them.
 *
 * Inserts as DRAFTS (published:false). Add --publish to publish immediately.
 *
 *   set -a && source .env && set +a
 *   node scripts/generate-mica-article.mjs --dry-run
 *   node scripts/generate-mica-article.mjs
 *   node scripts/generate-mica-article.mjs --publish
 *
 * Requires: ANTHROPIC_API_KEY, SUPABASE_URL (or VITE_SUPABASE_URL),
 *           SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const KEY = process.env.ANTHROPIC_API_KEY;
const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY || !SB_URL || !SB_KEY) { console.error('❌ Missing env: ANTHROPIC_API_KEY + SUPABASE url/service key'); process.exit(1); }

const anthropic = new Anthropic({ apiKey: KEY });
const supabase = createClient(SB_URL, SB_KEY);
const DRY = process.argv.includes('--dry-run');
const PUBLISH = process.argv.includes('--publish');

const TOPIC_KEY = 'mica-regulation-2026';
const CATEGORY = 'guide';
const FR_BODY = fs.readFileSync(path.join(ROOT, 'seo', 'content-drafts', 'carte-crypto-regulation-mica-2026-fr.md'), 'utf-8').trim();

// Internal links present in the FR master (rewritten per market).
const FR_LINKS = { etude: '/etudes/cartes-crypto-2026', compare: '/fr/comparer', noStaking: '/fr/carte-crypto-sans-staking' };

const FR_META = {
  slug: 'carte-crypto-regulation-mica-2026',
  title: 'Carte crypto et MiCA en 2026 : régulation, sécurité, ce qui change',
  meta_title: 'Carte Crypto & MiCA 2026 : Régulation et Sécurité | TopCryptoCards',
  meta_description: 'MiCA est pleinement en vigueur depuis juillet 2026. Ce qui change pour votre carte crypto : émetteurs agréés, régulateur national, cashback en stablecoin conforme.',
  excerpt: 'Depuis juillet 2026, MiCA encadre tous les émetteurs de cartes crypto dans l\'UE. Régulateur national, protection des fonds et cashback en stablecoin : ce qui change pour vous.',
};

const MARKETS = {
  de: { articleSlug: 'krypto-karte-regulierung-mica-2026', langName: 'German (Deutsch)', reg: 'In Deutschland ist die zuständige Aufsichtsbehörde die BaFin.', mica: true,
        links: { etude: '/etudes/krypto-karten-2026', compare: '/de/vergleich', noStaking: '/de/krypto-karte-ohne-staking' } },
  es: { articleSlug: 'tarjeta-cripto-regulacion-mica-2026', langName: 'European Spanish (español)', reg: 'En España, la autoridad competente es la CNMV, junto con el Banco de España.', mica: true,
        links: { etude: '/etudes/tarjetas-cripto-2026', compare: '/es/comparar', noStaking: '/es/tarjeta-cripto-sin-staking' } },
  it: { articleSlug: 'carta-cripto-regolamento-mica-2026', langName: 'Italian (italiano)', reg: 'In Italia le autorità competenti sono la CONSOB e la Banca d\'Italia.', mica: true,
        links: { etude: '/etudes/carte-crypto-2026', compare: '/it/confronto', noStaking: '/it/carta-cripto-senza-staking' } },
  pt: { articleSlug: 'cartao-crypto-regulacao-mica-2026', langName: 'European Portuguese (pt-PT, Portugal, NEVER Brazilian: "cartão", "grátis", "detido")', reg: 'Em Portugal, a autoridade competente é o Banco de Portugal, em articulação com a CMVM.', mica: true,
        links: { etude: '/etudes/cartoes-crypto-2026', compare: '/pt/comparar', noStaking: '/pt/cartao-crypto-sem-staking' } },
  en: { articleSlug: 'crypto-card-regulation-mica-fca-2026', langName: 'British English (en-GB)', mica: false,
        reg: 'IMPORTANT: this article targets the UNITED KINGDOM. The UK is NOT covered by MiCA since Brexit. Reframe accordingly: the primary regulator for UK residents is the FCA (Financial Conduct Authority), and cards are covered by the FCA regime, not MiCA. Present MiCA as the EU framework that governs cards available in the EU/EEA — useful when comparing cross-border — but never tell a UK reader that MiCA regulates their card. Keep the stablecoin facts (USDC/EURC compliant in the EU, USDT delisted by EU platforms) as relevant cross-border context.',
        links: { etude: '/etudes/crypto-cards-2026', compare: '/en/compare', noStaking: '/en/crypto-card-no-staking' } },
};

function contentPrompt(m) {
  return `You are a professional crypto-card expert and SEO writer for topcryptocards.eu.
Localise the following FRENCH markdown article into ${m.langName} for the ${m.mica ? 'local EU' : 'UK'} market.

Rules:
- Keep the same markdown structure (## / ### headings, bold, lists) and similar length.
- Keep crypto/card/stablecoin brand names in English (MiCA, CASP, USDC, EURC, USDT, EURe, FCA, ESMA).
- ${m.reg}
- Keep every markdown link URL EXACTLY as written in the source (do NOT translate or change URLs); they are rewritten later.
- Natural, human style. No emojis. Vary sentence length. Keep the "not financial/legal advice" note and the closing freshness line.
- Keep the factual MiCA points accurate: transitional period ended 1 July 2026; single EU framework; one CASP licence passports to all 27 member states; CASP needs an EU entity, €150,000 minimum capital, governance and fit-and-proper management; stablecoin reserve/redemption/no-interest rules since June 2024; USDC and EURC compliant, USDT not.

Output ONLY the localised markdown body. No preamble.

FRENCH SOURCE:
${FR_BODY}`;
}

function metaPrompt(m, sampleTitle) {
  return `Return ONLY valid JSON (no markdown fence) with localised SEO fields in ${m.langName} for an article about crypto-card regulation (MiCA / ${m.mica ? 'national EU regulator' : 'UK FCA'}) in 2026:
{"title":"H1 (~50-60 chars)","meta_title":"55-65 chars, ends with | TopCryptoCards","meta_description":"140-160 chars, compelling, keyword","excerpt":"2 sentences summary"}
Reference FR title for tone: "${sampleTitle}". Keep MiCA/FCA/brand names in English.`;
}

function rewriteLinks(body, links) {
  return body
    .split(FR_LINKS.etude).join(links.etude)
    .split(FR_LINKS.compare).join(links.compare)
    .split(FR_LINKS.noStaking).join(links.noStaking);
}

async function llm(prompt, maxTokens = 4096, attempt = 1) {
  try {
    const msg = await anthropic.messages.create({ model: 'claude-sonnet-4-6', max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] });
    return msg.content[0].text.trim();
  } catch (e) {
    if (attempt < 3) { await new Promise(r => setTimeout(r, attempt * 2000)); return llm(prompt, maxTokens, attempt + 1); }
    throw e;
  }
}

async function upsert(row) {
  if (DRY) { console.log(`   (dry) would upsert ${row.lang} /${row.slug} (${row.content.split(/\s+/).length} words, published=${row.published})`); return; }
  const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
  if (error) throw new Error(error.message);
  console.log(`   ✅ ${row.lang} /${row.slug}`);
}

(async () => {
  console.log(`\nMiCA article → ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);

  // FR (master, links already correct)
  console.log('📝 fr');
  await upsert({ slug: FR_META.slug, lang: 'fr', title: FR_META.title, content: FR_BODY, excerpt: FR_META.excerpt,
    meta_title: FR_META.meta_title, meta_description: FR_META.meta_description, topic_key: TOPIC_KEY, category: CATEGORY, image_hero: null, published: PUBLISH });

  // de/es/it/en/pt
  for (const [lang, m] of Object.entries(MARKETS)) {
    console.log(`📝 ${lang}`);
    const bodyRaw = await llm(contentPrompt(m), 5000);
    const body = rewriteLinks(bodyRaw.replace(/^```(?:markdown)?\s*/i, '').replace(/\s*```$/,''), m.links);
    let meta;
    try { meta = JSON.parse((await llm(metaPrompt(m, FR_META.title), 700)).replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/,'')); }
    catch { meta = { title: FR_META.title, meta_title: FR_META.meta_title, meta_description: FR_META.meta_description, excerpt: FR_META.excerpt }; }
    await upsert({ slug: m.articleSlug, lang, title: meta.title, content: body, excerpt: meta.excerpt,
      meta_title: meta.meta_title, meta_description: meta.meta_description, topic_key: TOPIC_KEY, category: CATEGORY, image_hero: null, published: PUBLISH });
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\n✅ Done. ${PUBLISH ? 'Published' : 'Drafts'} for fr + de/es/it/en/pt. Review in /admin/blog${PUBLISH ? '' : ', then publish'}.`);
})();
