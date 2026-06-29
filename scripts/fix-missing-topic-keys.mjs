#!/usr/bin/env node
/**
 * fix-missing-topic-keys.mjs
 *
 * Assigns topic_key to all blog_posts that currently have none.
 *
 * Strategy:
 *  - GROUPS: articles that are cross-lang translations share the same topic_key
 *  - SOLO:   articles with no known cross-lang pair get topic_key = `solo-{lang}-{slug}`
 *            (so they at least appear in the admin image generator)
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/fix-missing-topic-keys.mjs --dry-run
 *   node scripts/fix-missing-topic-keys.mjs
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Cross-language groups ─────────────────────────────────────────────────────
// Each entry: { topicKey, slugs: { lang: slug, ... } }
// An article matching ANY of the listed slugs gets that topic_key.

const GROUPS = [
  // ── Staking basics ────────────────────────────────────────────────────────
  { topicKey: 'blog-staking-intro', slugs: {
    fr: ['staking-carte-crypto-explique', 'carte-crypto-staking-explique'],
    de: ['staking-und-kryptokarten-alles-was-sie-wissen-mussen-bevor-sie'],
    en: ['staking-and-crypto-cards-everything-you-need-to-know-before'],
    es: ['staking-y-tarjetas-cripto-todo-lo-que-necesitas-saber-antes-de'],
    it: ['staking-e-carte-crypto-tutto-quello-che-devi-sapere-prima-di'],
  }},
  { topicKey: 'blog-staking-risks', slugs: {
    fr: ['staking-carte-crypto-risques-alternatives'],
    de: ['staking-fur-kryptokarte-wie-viel-sperren-und-welche'],
    en: ['staking-for-crypto-card-how-much-to-lock-and-what'],
    es: ['staking-para-tarjeta-criptografica-cuanto-bloquear-y-que'],
    it: ['staking-per-carta-crypto-quanto-bloccare-e-quali'],
  }},

  // ── How to choose ─────────────────────────────────────────────────────────
  { topicKey: 'blog-how-to-choose-2025', slugs: {
    fr: ['guide-choisir-carte-crypto', 'comment-choisir-carte-crypto'],
    de: ['wie-wahle-ich-2025-eine-kryptokarte-aus-der-komplette'],
    en: ['how-to-choose-a-crypto-card-in-2025-the-complete'],
    es: ['como-elegir-una-tarjeta-cripto-en-2025-la-guia'],
    it: ['come-scegliere-una-carta-crypto-nel-2025-la-guida'],
  }},
  { topicKey: 'blog-which-to-choose-2026', slugs: {
    fr: ['quelle-carte-crypto-choisir-2026'],
    de: ['welche-krypto-karte-waehlen-2026'],
    en: ['which-crypto-card-to-choose-2026'],
    es: ['que-tarjeta-cripto-elegir-2026'],
    it: ['quale-carta-cripto-scegliere-2026'],
  }},

  // ── What is a crypto card ─────────────────────────────────────────────────
  { topicKey: 'blog-what-is-crypto-card', slugs: {
    fr: ['qu-est-ce-qu-une-carte-crypto-guide-debutant'],
    de: ['was-ist-eine-kryptokarte-vollstandiger-anfangerleitfaden'],
    en: ['what-is-a-crypto-card-complete-guide-for-beginners'],
    es: ['que-es-una-tarjeta-criptografica-guia-completa-para'],
    it: ['che-cose-una-carta-crypto-guida-completa-per'],
  }},

  // ── No fees ───────────────────────────────────────────────────────────────
  { topicKey: 'blog-no-fees-2025', slugs: {
    fr: ['cartes-crypto-sans-frais'],
    de: ['die-besten-gebuhrenfreien-kryptokarten-2025'],
    en: ['the-best-zero-fee-crypto-cards-in-2025'],
    es: ['las-mejores-tarjetas-cripto-sin-comisiones-en'],
    it: ['le-migliori-carte-crypto-senza-commissioni-nel'],
  }},
  { topicKey: 'blog-no-annual-fees-2026', slugs: {
    fr: ['carte-crypto-sans-frais-annuels-selection-2026', 'carte-crypto-sans-frais-annuels'],
    de: ['kryptokarte-ohne-jahresgebuhren-unsere-auswahl'],
    en: ['crypto-card-with-no-annual-fees-our-2026-selection'],
    es: ['tarjeta-crypto-sin-cuotas-anuales-nuestra-seleccion'],
    it: ['carta-crypto-senza-commissioni-annuali-la-nostra-selezione'],
  }},

  // ── Cashback ──────────────────────────────────────────────────────────────
  { topicKey: 'blog-cashback-with-card-2025', slugs: {
    fr: ['carte-crypto-cashback-meilleures-offres'],
    de: ['kryptokarte-mit-cashback-die-besten-angebote'],
    en: ['crypto-card-with-cashback-the-best-offers-in'],
    es: ['tarjeta-crypto-con-cashback-las-mejores-ofertas-en'],
    it: ['carta-crypto-con-cashback-le-migliori-offerte-nel'],
  }},
  { topicKey: 'blog-cashback-comparison', slugs: {
    fr: ['cashback-crypto-fonctionnement'],
    de: ['cashback-vergleich-welche-kryptokarte-verdient-2025-am'],
    en: ['cashback-comparison-which-crypto-card-earns-the-most-in'],
    es: [],
    it: [],
  }},

  // ── Best cards (country / year) ────────────────────────────────────────────
  { topicKey: 'blog-best-card-france-2025', slugs: {
    fr: ['meilleure-carte-crypto-france-2025-comparatif'],
    de: ['beste-kryptokarte-in-frankreich-2025-vollstandiger'],
    en: ['best-crypto-card-in-france-in-2025-complete'],
    es: ['mejor-tarjeta-criptografica-en-francia-en-2025-comparativa'],
    it: ['migliore-carta-crypto-in-francia-nel-2025-confronto'],
  }},

  // ── Card brand reviews ────────────────────────────────────────────────────
  { topicKey: 'blog-cryptocom-review', slugs: {
    fr: ['carte-crypto-com-avis-complet-cashback-niveaux'],
    de: ['cryptocom-karte-vollstandige-bewertung-cashback-und-stufen'],
    en: ['cryptocom-card-complete-review-cashback-and-levels'],
    es: ['tarjeta-cryptocom-opinion-completa-cashback-y-niveles'],
    it: ['carta-cryptocom-recensione-completa-cashback-e-livelli'],
  }},
  { topicKey: 'blog-bybit-review', slugs: {
    fr: ['carte-bybit-avis-cashback-disponibilite-france-europe'],
    de: ['bybit-karte-vollstandige-bewertung-10-cashback-und-verfugbarkeit-in'],
    en: ['bybit-card-complete-review-10-cashback-and-availability-in'],
    es: ['tarjeta-bybit-opinion-completa-cashback-10-y-disponibilidad-en'],
    it: ['carta-bybit-recensione-completa-cashback-10-e-disponibilita-in'],
  }},
  { topicKey: 'blog-nexo-review', slugs: {
    fr: ['carte-nexo-depenser-cryptos-sans-vendre-legal'],
    de: ['nexo-karte-kryptowahrungen-ausgeben-ohne-zu-verkaufen-ist-das'],
    en: ['nexo-card-spending-your-crypto-without-selling-is-it'],
    es: ['tarjeta-nexo-gastar-sus-criptos-sin-vender-es'],
    it: ['carta-nexo-spendere-le-criptovalute-senza-venderle-e'],
  }},
  { topicKey: 'blog-ledger-review', slugs: {
    fr: ['carte-ledger-avis-self-custody'],
    de: ['ledger-card-vollstandige-bewertung-der-einzigen-krypto-karte-mit-self', 'ledger-card-testbericht-2026'],
    en: ['ledger-card-complete-review-on-the-only-self-custody-crypto', 'ledger-card-review-2026'],
    es: ['tarjeta-ledger-opinion-completa-sobre-la-unica-tarjeta-crypto-self'],
    it: ['carta-ledger-recensione-completa-sullunica-carta-crypto-self'],
  }},
  { topicKey: 'blog-gnosis-pay-review-2026', slugs: {
    fr: [],
    de: ['gnosis-pay-testbericht-2026'],
    en: ['gnosis-pay-review-2026'],
    es: [],
    it: [],
  }},
  { topicKey: 'blog-metamask-card-review-2026', slugs: {
    fr: [],
    de: ['metamask-card-testbericht-2026'],
    en: ['metamask-card-review-2026'],
    es: [],
    it: [],
  }},
  { topicKey: 'blog-brighty-card-review-2026', slugs: {
    fr: [],
    de: ['brighty-card-testbericht-2026'],
    en: ['brighty-card-review-2026'],
    es: [],
    it: [],
  }},

  // ── Comparisons ───────────────────────────────────────────────────────────
  { topicKey: 'blog-binance-vs-cryptocom', slugs: {
    fr: ['carte-binance-vs-crypto-com-comparatif-2025'],
    de: ['binance-card-vs-cryptocom-der-kampf-der-giganten'],
    en: ['binance-card-vs-cryptocom-the-battle-of-the-giants-in'],
    es: ['tarjeta-binance-vs-cryptocom-el-duelo-de-los-gigantes-en'],
    it: ['carta-binance-vs-cryptocom-lo-scontro-dei-giganti-nel'],
  }},
  { topicKey: 'blog-gnosis-vs-metamask-2026', slugs: {
    fr: ['gnosis-pay-vs-metamask-card-self-custody'],
    de: ['gnosis-pay-vs-metamask-card-self-custody'],
    en: ['gnosis-pay-vs-metamask-card-self-custody'],
    es: ['gnosis-pay-vs-metamask-card-self-custody'],
    it: ['gnosis-pay-vs-metamask-card-self-custody'],
  }},
  { topicKey: 'blog-brighty-vs-nexo-2026', slugs: {
    fr: ['brighty-card-vs-nexo-card-cashback'],
    de: ['brighty-card-vs-nexo-card-cashback'],
    en: ['brighty-card-vs-nexo-card-cashback'],
    es: ['brighty-card-vs-nexo-card-cashback'],
    it: ['brighty-card-vs-nexo-card-cashback'],
  }},

  // ── Self-custody ──────────────────────────────────────────────────────────
  { topicKey: 'blog-self-custody-cards-2026', slugs: {
    fr: ['carte-crypto-self-custody-2026'],
    de: ['krypto-karten-self-custody-2026'],
    en: ['self-custody-crypto-cards-2026'],
    es: ['tarjetas-crypto-self-custody-2026'],
    it: ['carte-crypto-self-custody-2026'],
  }},

  // ── No staking ────────────────────────────────────────────────────────────
  { topicKey: 'blog-no-staking-2026', slugs: {
    fr: ['meilleure-carte-crypto-sans-staking-2026'],
    de: ['beste-krypto-karte-ohne-staking-2026'],
    en: ['best-crypto-card-no-staking-2026'],
    es: ['mejor-tarjeta-crypto-sin-staking-2026'],
    it: ['migliore-carta-crypto-senza-staking-2026'],
  }},

  // ── Use cases ─────────────────────────────────────────────────────────────
  { topicKey: 'blog-travel-2026', slugs: {
    fr: ['carte-crypto-voyage-2026'],
    de: ['krypto-karte-reisen-2026'],
    en: ['crypto-card-travel-2026'],
    es: ['tarjeta-cripto-viaje-2026'],
    it: ['carta-cripto-viaggio-2026'],
  }},
  { topicKey: 'blog-pay-online-2026', slugs: {
    fr: ['carte-crypto-payer-en-ligne-2026'],
    de: ['krypto-karte-online-bezahlen-2026'],
    en: ['crypto-card-pay-online-2026'],
    es: ['tarjeta-cripto-pagar-online-2026'],
    it: ['carta-cripto-pagare-online-2026'],
  }},
  { topicKey: 'blog-bitcoin-2026', slugs: {
    fr: ['carte-crypto-bitcoin-2026'],
    de: ['krypto-karte-bitcoin-2026'],
    en: ['crypto-card-bitcoin-2026'],
    es: ['tarjeta-cripto-bitcoin-2026'],
    it: ['carta-cripto-bitcoin-2026'],
  }},
  { topicKey: 'blog-exchange-rate-2026', slugs: {
    fr: ['carte-crypto-taux-de-change-2026'],
    de: ['krypto-karte-wechselkurs-2026'],
    en: ['crypto-card-exchange-rate-2026'],
    es: ['tarjeta-cripto-tipo-cambio-2026'],
    it: ['carta-cripto-tasso-cambio-2026'],
  }},
  { topicKey: 'blog-atm-withdrawal-2026', slugs: {
    fr: ['carte-crypto-retrait-especes-2026', 'carte-crypto-retrait-atm'],
    de: ['krypto-karte-geldautomat-2026'],
    en: ['crypto-card-atm-withdrawal-2026'],
    es: ['tarjeta-cripto-cajero-automatico-2026'],
    it: ['carta-cripto-prelievo-contanti-2026'],
  }},
  { topicKey: 'blog-pay-abroad', slugs: {
    fr: ['payer-crypto-etranger-guide-pratique-2026', 'carte-crypto-etranger-frais'],
    de: ['mit-krypto-im-ausland-bezahlen-praktischer-leitfaden'],
    en: ['pay-with-crypto-abroad-practical-guide-2026'],
    es: ['pagar-en-criptomonedas-en-el-extranjero-guia-practica'],
    it: ['pagare-in-crypto-allestero-guida-pratica-2026'],
  }},

  // ── Tax / legal ───────────────────────────────────────────────────────────
  { topicKey: 'blog-crypto-tax-france', slugs: {
    fr: ['fiscalite-carte-crypto-france-declarer-cashback', 'carte-crypto-cashback-impots', 'carte-crypto-impots-france', 'fiscalite-cashback-crypto-france'],
    de: ['kryptokarten-steuern-in-frankreich-cashback'],
    en: ['taxation-of-crypto-cards-in-france-do-you-need-to-declare-your'],
    es: ['fiscalidad-de-las-tarjetas-cripto-en-francia-declarar-su'],
    it: ['tassazione-delle-carte-crypto-in-francia-dichiarare-il-proprio'],
  }},

  // ── Simulator ─────────────────────────────────────────────────────────────
  { topicKey: 'blog-simulator', slugs: {
    fr: ['simulateur-carte-crypto-rentable-selon-depenses'],
    de: ['simulator-welche-kryptokarte-bringt-die-meisten-gewinne-je-nach-ihren'],
    en: ['simulator-which-crypto-card-earns-the-most-based-on-your'],
    es: ['simulador-que-tarjeta-criptografica-rinde-mas-segun-tus'],
    it: ['simulatore-quale-carta-crypto-rende-di-piu-in-base-alle-tue'],
  }},

  // ── Scams / security ─────────────────────────────────────────────────────
  { topicKey: 'blog-scams', slugs: {
    fr: ['arnaques-cartes-crypto-reconnaitre-eviter'],
    de: ['betrugereien-mit-kryptokarten-leitfaden-zum-erkennen-und'],
    en: ['crypto-card-scams-a-guide-to-recognizing-and-avoiding'],
    es: ['estafas-de-tarjetas-criptograficas-guia-para-identificarlas-y'],
    it: ['truffe-alle-carte-crypto-guida-per-riconoscerle-ed'],
  }},

  // ── Methodology ───────────────────────────────────────────────────────────
  { topicKey: 'blog-methodology', slugs: {
    fr: ['methodologie-comparaison-cartes-crypto'],
    de: ['unsere-methodik-wie-wir-kryptokarten-vergleichen'],
    en: ['our-methodology-how-we-compare-crypto-cards'],
    es: ['nuestra-metodologia-como-comparamos-las-tarjetas'],
    it: ['la-nostra-metodologia-come-confrontiamo-le-carte'],
  }},
];

// Build a flat lookup: slug → topicKey
const SLUG_TO_TOPIC = {};
for (const group of GROUPS) {
  for (const slugs of Object.values(group.slugs)) {
    for (const slug of slugs) {
      if (slug) SLUG_TO_TOPIC[slug] = group.topicKey;
    }
  }
}

async function main() {
  console.log(`\n🔧 fix-missing-topic-keys.mjs${DRY_RUN ? ' (DRY RUN)' : ''}\n`);

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, lang, topic_key, image_hero')
    .is('topic_key', null);

  if (error) { console.error('Fetch error:', error); process.exit(1); }

  console.log(`Found ${posts.length} posts without topic_key\n`);

  let grouped = 0, solo = 0, failed = 0;

  for (const post of posts) {
    // Try known cross-lang mapping first
    let topicKey = SLUG_TO_TOPIC[post.slug];

    // Fall back to solo key (still visible in admin)
    if (!topicKey) {
      topicKey = `solo-${post.lang}-${post.slug}`.slice(0, 120);
    } else {
      grouped++;
    }

    if (topicKey.startsWith('solo-')) solo++;

    if (DRY_RUN) {
      const label = topicKey.startsWith('solo-') ? '(solo)' : '✓ group';
      console.log(`  ${label} [${post.lang}] ${post.slug} → ${topicKey}`);
      continue;
    }

    const { error: updateErr } = await supabase
      .from('blog_posts')
      .update({ topic_key: topicKey })
      .eq('id', post.id);

    if (updateErr) {
      console.error(`  ❌ [${post.lang}] ${post.slug}: ${updateErr.message}`);
      failed++;
    }
  }

  if (!DRY_RUN) {
    console.log(`\n✅ Done.`);
    console.log(`  ${grouped} assigned to cross-lang groups`);
    console.log(`  ${solo} assigned as solo (single-lang)`);
    console.log(`  ${failed} failed`);

    // Now propagate images within each group
    console.log('\n📡 Propagating images within groups...');
    const topicKeys = [...new Set(
      posts
        .filter(p => SLUG_TO_TOPIC[p.slug])
        .map(p => SLUG_TO_TOPIC[p.slug])
    )];

    for (const tk of topicKeys) {
      const { data: group } = await supabase
        .from('blog_posts')
        .select('id, image_hero')
        .eq('topic_key', tk);

      if (!group) continue;
      const withImage = group.find(p => p.image_hero);
      if (!withImage) continue;

      const withoutImage = group.filter(p => !p.image_hero);
      if (withoutImage.length === 0) continue;

      for (const p of withoutImage) {
        await supabase
          .from('blog_posts')
          .update({ image_hero: withImage.image_hero })
          .eq('id', p.id);
      }
      console.log(`  ✅ [${tk}] propagated image to ${withoutImage.length} article(s)`);
    }
  } else {
    const soloCount = posts.filter(p => !SLUG_TO_TOPIC[p.slug]).length;
    const groupCount = posts.filter(p => SLUG_TO_TOPIC[p.slug]).length;
    console.log(`\nSummary (dry run):`);
    console.log(`  ${groupCount} will be assigned to cross-lang groups`);
    console.log(`  ${soloCount} will be assigned solo topic_keys`);
    console.log(`  0 failed`);
  }
}

main();
