/**
 * fix-bad-card-links.mjs
 *
 * Fixes blog article content where AI-generated links point to fake card IDs
 * (e.g. /fr/cartes/cashback) instead of proper thematic pages.
 *
 * Run: node --env-file=.env scripts/fix-bad-card-links.mjs
 * Dry run: node --env-file=.env scripts/fix-bad-card-links.mjs --dry-run
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const DRY_RUN = process.argv.includes('--dry-run');

/** Maps bad card-ID slugs → correct thematic page per language */
const THEMATIC_MAP = {
  fr: {
    cashback:       'carte-crypto-cashback',
    comparatif:     'meilleure-carte-crypto',
    meilleure:      'meilleure-carte-crypto',
    best:           'meilleure-carte-crypto',
    'sans-frais':   'carte-crypto-sans-frais',
    'no-fees':      'carte-crypto-sans-frais',
    'sans-staking': 'carte-crypto-sans-staking',
    'no-staking':   'carte-crypto-sans-staking',
    virtuelle:      'carte-crypto-virtuelle',
    virtual:        'carte-crypto-virtuelle',
    debutant:       'cartes-crypto-debutant',
    beginner:       'cartes-crypto-debutant',
    france:         'cartes-crypto-france',
  },
  de: {
    cashback:       'krypto-karte-cashback',
    comparatif:     'beste-krypto-karte',
    meilleure:      'beste-krypto-karte',
    best:           'beste-krypto-karte',
    'sans-frais':   'krypto-karte-ohne-jahresgebuehr',
    'no-fees':      'krypto-karte-ohne-jahresgebuehr',
    'sans-staking': 'krypto-karte-ohne-staking',
    'no-staking':   'krypto-karte-ohne-staking',
    virtuelle:      'virtuelle-krypto-karte',
    virtual:        'virtuelle-krypto-karte',
    debutant:       'krypto-karten-einsteiger',
    beginner:       'krypto-karten-einsteiger',
    france:         'krypto-karten-deutschland',
  },
  es: {
    cashback:       'tarjeta-cripto-cashback',
    comparatif:     'mejor-tarjeta-cripto',
    meilleure:      'mejor-tarjeta-cripto',
    best:           'mejor-tarjeta-cripto',
    'sans-frais':   'tarjeta-cripto-sin-comisiones',
    'no-fees':      'tarjeta-cripto-sin-comisiones',
    'sans-staking': 'tarjeta-cripto-sin-staking',
    'no-staking':   'tarjeta-cripto-sin-staking',
    virtuelle:      'tarjeta-crypto-virtual',
    virtual:        'tarjeta-crypto-virtual',
    debutant:       'tarjetas-crypto-principiante',
    beginner:       'tarjetas-crypto-principiante',
    france:         'tarjetas-crypto-espana',
  },
  it: {
    cashback:       'carta-cripto-cashback',
    comparatif:     'migliore-carta-cripto',
    meilleure:      'migliore-carta-cripto',
    best:           'migliore-carta-cripto',
    'sans-frais':   'carta-cripto-senza-commissioni',
    'no-fees':      'carta-cripto-senza-commissioni',
    'sans-staking': 'carta-cripto-senza-staking',
    'no-staking':   'carta-cripto-senza-staking',
    virtuelle:      'carta-crypto-virtuale',
    virtual:        'carta-crypto-virtuale',
    debutant:       'carte-crypto-principiante',
    beginner:       'carte-crypto-principiante',
    france:         'carte-crypto-italia',
  },
  en: {
    cashback:       'crypto-card-cashback',
    comparatif:     'best-crypto-card',
    meilleure:      'best-crypto-card',
    best:           'best-crypto-card',
    'sans-frais':   'crypto-card-no-fees',
    'no-fees':      'crypto-card-no-fees',
    'sans-staking': 'crypto-card-no-staking',
    'no-staking':   'crypto-card-no-staking',
    virtuelle:      'virtual-crypto-card',
    virtual:        'virtual-crypto-card',
    debutant:       'beginner-crypto-cards',
    beginner:       'beginner-crypto-cards',
    france:         'crypto-cards-europe',
  },
};

const CARD_SEGMENTS = { fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards' };

function fixContent(content, lang) {
  let fixed = content;
  let changes = 0;
  const segment = CARD_SEGMENTS[lang] || 'cards';
  const thematic = THEMATIC_MAP[lang] || THEMATIC_MAP.en;

  for (const [badId, goodSlug] of Object.entries(thematic)) {
    // Match href="/lang/segment/badId" or href="/segment/badId" (absolute or relative)
    const patterns = [
      // HTML href with lang prefix
      new RegExp(`(href=["'])/${lang}/${segment}/${badId}(["'/\\s>])`, 'g'),
      // HTML href without lang prefix
      new RegExp(`(href=["'])/${segment}/${badId}(["'/\\s>])`, 'g'),
      // Markdown link
      new RegExp(`(\\()/${lang}/${segment}/${badId}(\\))`, 'g'),
      new RegExp(`(\\()/${segment}/${badId}(\\))`, 'g'),
    ];
    for (const re of patterns) {
      const before = fixed;
      fixed = fixed.replace(re, `$1/${lang}/${goodSlug}$2`);
      if (fixed !== before) changes++;
    }
  }
  return { fixed, changes };
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no changes will be saved\n' : '🔧 LIVE — changes will be saved\n');

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, lang, content')
    .eq('published', true);

  if (error) { console.error('Supabase error:', error); process.exit(1); }

  let totalChanges = 0;

  for (const post of posts) {
    const { fixed, changes } = fixContent(post.content, post.lang);
    if (changes === 0) continue;

    totalChanges += changes;
    console.log(`[${post.lang}] ${post.slug} — ${changes} replacement(s)`);

    if (!DRY_RUN) {
      const { error: updateErr } = await supabase
        .from('blog_posts')
        .update({ content: fixed })
        .eq('id', post.id);
      if (updateErr) console.error(`  ❌ Error updating ${post.slug}:`, updateErr);
      else console.log(`  ✅ Updated`);
    }
  }

  console.log(`\n${DRY_RUN ? 'Would fix' : 'Fixed'} ${totalChanges} bad link(s) across ${posts.length} articles.`);
}

main();
