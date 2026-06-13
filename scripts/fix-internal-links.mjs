/**
 * fix-internal-links.mjs
 *
 * Fixes all internal links in blog_posts content so they point to the
 * correct language path instead of hardcoded French paths.
 *
 * Handles:
 *   - Bare paths:        /simulateur  →  /de/simulator
 *   - FR-prefixed:       /fr/comparer →  /de/vergleich
 *   - Absolute:          https://topcryptocards.eu/simulateur  →  /de/simulator
 *   - Thematic pages:    /fr/cartes/meilleures  →  /de/beste-krypto-karte
 *   - Card details:      /fr/cartes/{id}         →  /de/karten/{id}
 *   - Blog links:        /fr/blog/{slug}          →  /de/blog/{slug}
 *
 * Usage:
 *   node --env-file=.env scripts/fix-internal-links.mjs
 *   node --env-file=.env scripts/fix-internal-links.mjs --dry-run
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Route slugs per language ─────────────────────────────────────────────────

const ROUTES = {
  fr: { compare: 'comparer',  simulator: 'simulateur', recommendation: 'recommandation', favorites: 'favoris',   blog: 'blog', cards: 'cartes' },
  de: { compare: 'vergleich', simulator: 'simulator',  recommendation: 'empfehlung',     favorites: 'favoriten', blog: 'blog', cards: 'karten' },
  es: { compare: 'comparar',  simulator: 'simulador',  recommendation: 'recomendacion',  favorites: 'favoritos', blog: 'blog', cards: 'tarjetas' },
  it: { compare: 'confronto', simulator: 'simulatore', recommendation: 'raccomandazione',favorites: 'preferiti', blog: 'blog', cards: 'carte' },
  en: { compare: 'compare',   simulator: 'simulator',  recommendation: 'recommendation', favorites: 'favorites', blog: 'blog', cards: 'cards' },
};

// ─── Thematic page slugs per language ────────────────────────────────────────

const THEMATIC = {
  // FR slugs → target lang slug (key = all possible FR paths)
  'meilleure-carte-crypto':    { de: 'beste-krypto-karte',              es: 'mejor-tarjeta-cripto',         it: 'migliore-carta-cripto',          en: 'best-crypto-card' },
  'carte-crypto-cashback':     { de: 'krypto-karte-cashback',           es: 'tarjeta-cripto-cashback',       it: 'carta-cripto-cashback',           en: 'crypto-card-cashback' },
  'carte-crypto-sans-frais':   { de: 'krypto-karte-ohne-jahresgebuehr', es: 'tarjeta-cripto-sin-comisiones', it: 'carta-cripto-senza-commissioni',  en: 'crypto-card-no-fees' },
  'carte-crypto-sans-staking': { de: 'krypto-karte-ohne-staking',       es: 'tarjeta-cripto-sin-staking',    it: 'carta-cripto-senza-staking',      en: 'crypto-card-no-staking' },
  'cartes-crypto-france':      { de: 'krypto-karten-deutschland',       es: 'tarjetas-crypto-espana',        it: 'carte-crypto-italia',             en: 'crypto-cards-europe' },
  'carte-crypto-virtuelle':    { de: 'virtuelle-krypto-karte',          es: 'tarjeta-crypto-virtual',        it: 'carta-crypto-virtuale',           en: 'virtual-crypto-card' },
  'cartes-crypto-debutant':    { de: 'krypto-karten-einsteiger',        es: 'tarjetas-crypto-principiante',  it: 'carte-crypto-principiante',       en: 'beginner-crypto-cards' },
};

const DOMAIN = 'https://topcryptocards.eu';

// ─── All French route slugs (for detecting bare French paths) ─────────────────

const FR_BARE_PATHS = {
  'comparer':       'compare',
  'simulateur':     'simulator',
  'recommandation': 'recommendation',
  'favoris':        'favorites',
};

// ─── Fix a single article's content ──────────────────────────────────────────

function fixLinks(html, lang) {
  if (lang === 'fr') return { html, changes: 0 }; // French articles are the source of truth
  let result = html;
  let changes = 0;
  const r = ROUTES[lang];
  if (!r) return { html, changes };

  const track = (before, after) => {
    if (before !== after) changes++;
    return after;
  };

  // 1. Absolute URLs with French bare paths  e.g. https://topcryptocards.eu/simulateur
  for (const [frSlug, routeKey] of Object.entries(FR_BARE_PATHS)) {
    const abs = new RegExp(`${DOMAIN}/${frSlug}(?=["'\\s>])`, 'g');
    result = result.replace(abs, (m) => track(m, `/${lang}/${r[routeKey]}`));
  }

  // 2. Absolute URLs with /fr/ prefix  e.g. https://topcryptocards.eu/fr/comparer
  result = result.replace(
    new RegExp(`${DOMAIN}/fr/([^"'\\s>]+)`, 'g'),
    (m, path) => track(m, `/${lang}/${translateFrPath(path, lang)}`)
  );

  // 3. Absolute domain root  e.g. https://topcryptocards.eu/compare  (English bare)
  result = result.replace(
    new RegExp(`${DOMAIN}/compare(?=["'\\s>])`, 'g'),
    (m) => track(m, `/${lang}/${r.compare}`)
  );

  // 4. Relative bare French paths  e.g. href="/simulateur"  href="/comparer"
  for (const [frSlug, routeKey] of Object.entries(FR_BARE_PATHS)) {
    const rel = new RegExp(`(href=["'])/${frSlug}(["'\\s>])`, 'g');
    result = result.replace(rel, (m, pre, post) => track(m, `${pre}/${lang}/${r[routeKey]}${post}`));
  }

  // 5. Relative /fr/ prefixed paths  e.g. href="/fr/comparer"
  result = result.replace(
    /(href=["'])\/fr\/([^"'\s>]+)(["'\s>])/g,
    (m, pre, path, post) => track(m, `${pre}/${lang}/${translateFrPath(path, lang)}${post}`)
  );

  // 6. Markdown-style links  e.g. [text](/simulateur)  [text](/fr/comparer)
  for (const [frSlug, routeKey] of Object.entries(FR_BARE_PATHS)) {
    const md = new RegExp(`\\(/${frSlug}\\)`, 'g');
    result = result.replace(md, (m) => track(m, `(/${lang}/${r[routeKey]})`));
  }
  result = result.replace(
    /\(\/fr\/([^)]+)\)/g,
    (m, path) => track(m, `(/${lang}/${translateFrPath(path, lang)})`)
  );

  // 7. Plain text links without href (e.g. in Markdown or JSON)  https://topcryptocards.eu/simulateur
  for (const [frSlug, routeKey] of Object.entries(FR_BARE_PATHS)) {
    const plain = new RegExp(`${DOMAIN}/${frSlug}(?=[\\s"'<>)\\]])`, 'g');
    result = result.replace(plain, (m) => track(m, `${DOMAIN}/${lang}/${r[routeKey]}`));
  }

  return { html: result, changes };
}

// ─── Translate a French path segment to target language ──────────────────────

function translateFrPath(frPath, lang) {
  const r = ROUTES[lang];

  // Check thematic pages: /cartes/{thematic-slug}
  const thematicMatch = frPath.match(/^cartes\/(.+)$/);
  if (thematicMatch) {
    const frThematicSlug = thematicMatch[1];
    if (THEMATIC[frThematicSlug]?.[lang]) {
      return THEMATIC[frThematicSlug][lang];
    }
    // Unknown thematic slug: just swap cards segment
    return `${r.cards}/${frThematicSlug}`;
  }

  // Card detail: /cartes/{id}  (id is a uuid-like string, not a thematic slug)
  const cardMatch = frPath.match(/^cartes\/([a-f0-9-]{8,})$/i);
  if (cardMatch) return `${r.cards}/${cardMatch[1]}`;

  // Blog: /blog/{slug}
  const blogMatch = frPath.match(/^blog\/(.+)$/);
  if (blogMatch) return `${r.blog}/${blogMatch[1]}`;

  // Named routes
  if (frPath === 'comparer' || frPath === 'compare')       return r.compare;
  if (frPath === 'simulateur' || frPath === 'simulator')   return r.simulator;
  if (frPath === 'recommandation')                          return r.recommendation;
  if (frPath === 'favoris')                                 return r.favorites;

  // Unknown — return as-is
  return frPath;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nfix-internal-links.mjs ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, lang, content')
    .eq('published', true)
    .neq('lang', 'fr'); // French articles are the source of truth, skip them

  if (error) { console.error('Fetch error:', error); process.exit(1); }
  console.log(`Found ${posts.length} non-French published posts.\n`);

  const stats = { updated: 0, skipped: 0, errors: 0 };

  for (const post of posts) {
    if (!post.content) { stats.skipped++; continue; }

    const { html, changes } = fixLinks(post.content, post.lang);

    if (changes === 0) {
      stats.skipped++;
      continue;
    }

    console.log(`  [${post.lang}] ${post.slug}  →  ${changes} link(s) fixed`);

    if (!DRY_RUN) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ content: html })
        .eq('id', post.id);

      if (updateError) {
        console.error(`    ❌ Error:`, updateError.message);
        stats.errors++;
      } else {
        stats.updated++;
      }
    } else {
      stats.updated++;
    }
  }

  console.log(`\nDone. ${stats.updated} updated, ${stats.skipped} skipped, ${stats.errors} errors.`);
  if (DRY_RUN) console.log('(Dry run — no changes written to DB)');
}

main();
