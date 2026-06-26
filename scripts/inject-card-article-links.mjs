#!/usr/bin/env node
/**
 * inject-card-article-links.mjs
 *
 * Injects a "see-also-thematic" section into card_articles content.
 * CardDetail.tsx splits on `<div class="see-also-thematic"` and renders it
 * as a separate block between the article body and FAQ.
 *
 * Logic:
 *   - Fetches all cards + their card_articles from Supabase
 *   - Determines relevant thematic pages per card (based on cashback, fees, staking, etc.)
 *   - Injects localized `<div class="see-also-thematic">` before `<div data-faq="v1"` or at end
 *   - Idempotent: skips articles that already have the section
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/inject-card-article-links.mjs
 *   node scripts/inject-card-article-links.mjs --dry-run        # preview only
 *   node scripts/inject-card-article-links.mjs --force          # overwrite existing sections
 *   node scripts/inject-card-article-links.mjs crypto-com-ruby-steel  # single card
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE   = process.argv.includes('--force');
const FILTER_CARD = process.argv.slice(2).find(a => !a.startsWith('-'));

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ── Thematic page slugs (matches ThematicPage.tsx THEMATIC_SLUGS) ───────── */
const THEMATIC_SLUGS = {
  best:         { fr: 'meilleure-carte-crypto',     de: 'beste-krypto-karte',              es: 'mejor-tarjeta-cripto',          it: 'migliore-carta-cripto',           en: 'best-crypto-card' },
  cashback:     { fr: 'carte-crypto-cashback',      de: 'krypto-karte-cashback',            es: 'tarjeta-cripto-cashback',        it: 'carta-cripto-cashback',            en: 'crypto-card-cashback' },
  'no-fees':    { fr: 'carte-crypto-sans-frais',    de: 'krypto-karte-ohne-jahresgebuehr',  es: 'tarjeta-cripto-sin-comisiones',  it: 'carta-cripto-senza-commissioni',   en: 'crypto-card-no-fees' },
  'no-staking': { fr: 'carte-crypto-sans-staking',  de: 'krypto-karte-ohne-staking',        es: 'tarjeta-cripto-sin-staking',     it: 'carta-cripto-senza-staking',       en: 'crypto-card-no-staking' },
  virtual:      { fr: 'carte-crypto-virtuelle',     de: 'virtuelle-krypto-karte',           es: 'tarjeta-crypto-virtual',         it: 'carta-crypto-virtuale',            en: 'virtual-crypto-card' },
  beginner:     { fr: 'cartes-crypto-debutant',     de: 'krypto-karten-einsteiger',         es: 'tarjetas-crypto-principiante',   it: 'carte-crypto-principiante',        en: 'beginner-crypto-cards' },
  'no-kyc':     { fr: 'carte-crypto-sans-kyc',      de: 'krypto-karte-ohne-kyc',            es: 'tarjeta-crypto-sin-kyc',         it: 'carta-cripto-senza-kyc',           en: 'crypto-card-no-kyc' },
  '2026':       { fr: 'carte-crypto-2026',          de: 'krypto-karte-2026',                es: 'tarjeta-cripto-2026',            it: 'carta-cripto-2026',                en: 'best-crypto-card-2026' },
  travel:       { fr: 'carte-crypto-voyage',        de: 'krypto-karte-reise',               es: 'tarjeta-cripto-viaje',           it: 'carta-cripto-viaggio',             en: 'crypto-card-travel' },
  rewards:      { fr: 'carte-crypto-recompenses',   de: 'krypto-karte-praemien',            es: 'tarjeta-cripto-recompensas',     it: 'carta-cripto-premi',               en: 'crypto-card-rewards' },
};

/* Card segment per language */
const CARD_SEG = { fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards' };

/* ── Section labels ──────────────────────────────────────────────────────── */
const SEE_ALSO_LABEL = {
  fr: 'À lire aussi',
  de: 'Weiterführende Artikel',
  es: 'Ver también',
  it: 'Leggi anche',
  en: 'Related guides',
};

/* ── Theme display config ────────────────────────────────────────────────── */
const THEME_META = {
  best:         { emoji: '⭐', label: { fr: 'Meilleures cartes crypto',   de: 'Beste Krypto-Karten',         es: 'Mejores tarjetas crypto',       it: 'Migliori carte crypto',          en: 'Best crypto cards' } },
  cashback:     { emoji: '💰', label: { fr: 'Cartes avec cashback',        de: 'Karten mit Cashback',         es: 'Tarjetas con cashback',         it: 'Carte con cashback',             en: 'Cards with cashback' } },
  'no-fees':    { emoji: '🆓', label: { fr: 'Cartes sans frais',           de: 'Karten ohne Gebühren',        es: 'Tarjetas sin comisiones',       it: 'Carte senza commissioni',        en: 'No-fee cards' } },
  'no-staking': { emoji: '🔓', label: { fr: 'Cartes sans staking',         de: 'Karten ohne Staking',         es: 'Tarjetas sin staking',          it: 'Carte senza staking',            en: 'No-staking cards' } },
  virtual:      { emoji: '📱', label: { fr: 'Cartes virtuelles',           de: 'Virtuelle Karten',            es: 'Tarjetas virtuales',            it: 'Carte virtuali',                 en: 'Virtual cards' } },
  beginner:     { emoji: '🎯', label: { fr: 'Cartes pour débutants',       de: 'Karten für Einsteiger',       es: 'Tarjetas para principiantes',   it: 'Carte per principianti',         en: 'Cards for beginners' } },
  'no-kyc':     { emoji: '🔐', label: { fr: 'Cartes sans KYC',             de: 'Karten ohne KYC',             es: 'Tarjetas sin KYC',              it: 'Carte senza KYC',                en: 'No-KYC cards' } },
  '2026':       { emoji: '🚀', label: { fr: 'Meilleures cartes 2026',      de: 'Beste Karten 2026',           es: 'Mejores tarjetas 2026',         it: 'Migliori carte 2026',            en: 'Best cards 2026' } },
  travel:       { emoji: '✈️', label: { fr: 'Cartes pour les voyages',      de: 'Reisekarten',                 es: 'Tarjetas para viajes',          it: 'Carte per i viaggi',             en: 'Travel cards' } },
  rewards:      { emoji: '🎁', label: { fr: 'Cartes avec récompenses',     de: 'Karten mit Prämien',          es: 'Tarjetas con recompensas',      it: 'Carte con premi',                en: 'Cards with rewards' } },
};

/* ── Determine relevant themes for a card ───────────────────────────────── */
const SELF_CUSTODY_EXTRAS = new Set(['self_custody', 'hybrid_custody', 'web3_native', 'defi_native', 'exodus_wallet']);

function getRelevantThemes(card) {
  const themes = ['best', '2026']; // always include

  const cashback = (card.cashback_base || 0) + (card.cashback_premium || 0);
  const fees     = card.annual_fees ?? 0;
  const staking  = card.staking_required ?? 0;
  const extras   = Array.isArray(card.extras) ? card.extras : [];

  if (cashback > 0)  themes.push('cashback');
  if (fees === 0)    themes.push('no-fees');
  if (staking === 0) themes.push('no-staking');
  if (fees === 0 && staking === 0) themes.push('beginner');
  if (card.virtual_only) themes.push('virtual');
  if (extras.some(e => SELF_CUSTODY_EXTRAS.has(e))) themes.push('no-kyc');

  // rewards: cashback ≥ 2% OR has lounge / perks in extras
  if (cashback >= 2 || extras.some(e => ['lounge_access', 'airport_lounge', 'netflix', 'spotify'].includes(e))) {
    themes.push('rewards');
  }

  // travel: explicit travel extra or high ATM limit
  if (extras.some(e => ['travel_insurance', 'airport_lounge', 'lounge_access'].includes(e))) {
    themes.push('travel');
  }

  // Deduplicate and cap at 5 (remove 2026 if we have 5 others)
  const unique = [...new Set(themes)];
  return unique.slice(0, 6);
}

/* ── Build the HTML section ──────────────────────────────────────────────── */
function buildSeeAlsoSection(card, lang) {
  const themes = getRelevantThemes(card);
  const seeAlsoLabel = SEE_ALSO_LABEL[lang] || SEE_ALSO_LABEL.en;

  const links = themes.map(theme => {
    const slugs  = THEMATIC_SLUGS[theme];
    const meta   = THEME_META[theme];
    if (!slugs || !meta) return null;

    const slug  = slugs[lang];
    const label = meta.label[lang] || meta.label.en;
    const href  = `/${lang}/${slug}`;

    return `    <a href="${href}" class="see-also-link flex items-center gap-2 p-3 rounded-lg bg-bg-elevated border border-white/10 hover:border-cyan-500/40 transition-colors text-sm text-text-secondary hover:text-cyan-300 no-underline">
      <span class="text-lg leading-none">${meta.emoji}</span>
      <span>${label}</span>
    </a>`;
  }).filter(Boolean);

  if (links.length === 0) return '';

  return `
<div class="see-also-thematic mt-10 pt-8 border-t border-white/10">
  <p class="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">${seeAlsoLabel}</p>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
${links.join('\n')}
  </div>
</div>`;
}

/* ── Insert section into content ─────────────────────────────────────────── */
function insertSection(content, section) {
  const FAQ_SEP = '<div data-faq="v1"';
  const faqIdx = content.indexOf(FAQ_SEP);

  if (faqIdx > 0) {
    // Insert before FAQ
    return content.slice(0, faqIdx) + section + '\n' + content.slice(faqIdx);
  }
  // Append at end
  return content + section;
}

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n🔗 inject-card-article-links.mjs${DRY_RUN ? ' (DRY RUN)' : ''}${FORCE ? ' (FORCE)' : ''}\n`);

  // 1. Fetch all cards
  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('id, name, cashback_base, cashback_premium, annual_fees, staking_required, virtual_only, extras')
    .order('id');

  if (cardsError) { console.error('Cards fetch error:', cardsError); process.exit(1); }

  const cardMap = Object.fromEntries(cards.map(c => [c.id, c]));
  const cardIds = FILTER_CARD ? [FILTER_CARD] : cards.map(c => c.id);

  // 2. Fetch card_articles
  let query = supabase
    .from('card_articles')
    .select('id, card_id, lang, content, published');

  if (FILTER_CARD) {
    query = query.eq('card_id', FILTER_CARD);
  }

  const { data: articles, error: artError } = await query;
  if (artError) { console.error('Articles fetch error:', artError); process.exit(1); }

  console.log(`Found ${articles.length} card_articles (${cardIds.length} card(s) targeted)\n`);

  const MARKER = '<div class="see-also-thematic"';
  let updated = 0, skipped = 0, failed = 0;

  for (const art of articles) {
    const card = cardMap[art.card_id];
    if (!card) {
      console.log(`  ⚠ No card found for card_id="${art.card_id}" — skip`);
      skipped++;
      continue;
    }

    if (!art.content) {
      skipped++;
      continue;
    }

    // Already has the section?
    if (!FORCE && art.content.includes(MARKER)) {
      skipped++;
      continue;
    }

    // Strip existing section if --force
    let content = art.content;
    if (FORCE && content.includes(MARKER)) {
      const startIdx = content.indexOf(MARKER);
      const faqIdx   = content.indexOf('<div data-faq="v1"');
      if (faqIdx > startIdx) {
        content = content.slice(0, startIdx) + content.slice(faqIdx);
      } else {
        content = content.slice(0, startIdx);
      }
    }

    const section     = buildSeeAlsoSection(card, art.lang);
    if (!section) { skipped++; continue; }

    const newContent  = insertSection(content, section);
    const themesCount = getRelevantThemes(card).length;

    console.log(`  ${DRY_RUN ? '(dry)' : '✅'} [${art.lang}] ${art.card_id}  →  ${themesCount} thematic link(s)`);

    if (!DRY_RUN) {
      const { error: upErr } = await supabase
        .from('card_articles')
        .update({ content: newContent })
        .eq('id', art.id);

      if (upErr) {
        console.error(`    ❌ ${upErr.message}`);
        failed++;
        continue;
      }
    }

    updated++;
  }

  console.log(`\n✅ Done. ${updated} updated, ${skipped} skipped, ${failed} failed.`);
  if (DRY_RUN) console.log('(Dry run — no DB writes)');
}

main();
