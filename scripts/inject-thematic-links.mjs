/**
 * inject-thematic-links.mjs
 *
 * Injects contextual internal links into blog_posts content stored in Supabase.
 * Detects language from slug/content and inserts <a href> to matching thematic pages.
 * Safe to re-run: won't duplicate existing links.
 *
 * Usage:
 *   node --env-file=.env scripts/inject-thematic-links.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Language detection from slug/content ─────────────────────────────────────

function detectLang(slug = '', content = '') {
  const text = (slug + ' ' + content.slice(0, 500)).toLowerCase();
  if (/\b(carte|meilleur|frais|cashback|staking|gratuit|choisir|sans)\b/.test(text)) return 'fr';
  if (/\b(karte|krypto|gebühr|kostenlos|beste|ohne|vergleich)\b/.test(text)) return 'de';
  if (/\b(tarjeta|mejor|gratis|comisiones|cripto|elección)\b/.test(text)) return 'es';
  if (/\b(carta|migliore|gratuita|commissioni|cripto|scelta)\b/.test(text)) return 'it';
  if (/\b(card|best|free|fees|cashback|staking|choose|without)\b/.test(text)) return 'en';
  return 'fr'; // default
}

// ─── Theme link definitions ───────────────────────────────────────────────────

const THEME_LINKS = [
  {
    theme: 'cashback',
    patterns: {
      fr: [/meilleur(?:es?)? cashback/gi, /taux de cashback/gi, /carte(?:s)? cashback/gi],
      en: [/best cashback/gi, /cashback rate/gi, /cashback card/gi],
      de: [/bester cashback/gi, /cashback.?rate/gi, /cashback.?karte/gi],
      es: [/mejor cashback/gi, /tasa de cashback/gi, /tarjeta cashback/gi],
      it: [/miglior cashback/gi, /tasso di cashback/gi, /carta cashback/gi],
    },
    slugs: {
      fr: '/fr/cartes/cashback', en: '/en/cards/cashback',
      de: '/de/karten/cashback', es: '/es/tarjetas/cashback', it: '/it/carte/cashback',
    },
  },
  {
    theme: 'no-fees',
    patterns: {
      fr: [/sans frais annuels/gi, /carte(?:s)? gratuite(?:s)?/gi, /sans abonnement/gi],
      en: [/no annual fees?/gi, /free crypto card/gi, /no subscription/gi],
      de: [/ohne jahresgebühr/gi, /kostenlose karte/gi],
      es: [/sin cuota anual/gi, /tarjeta gratuita/gi],
      it: [/senza costi annuali/gi, /carta gratuita/gi],
    },
    slugs: {
      fr: '/fr/cartes/sans-frais', en: '/en/cards/no-fees',
      de: '/de/karten/kostenlos', es: '/es/tarjetas/sin-comisiones', it: '/it/carte/senza-costi',
    },
  },
  {
    theme: 'no-staking',
    patterns: {
      fr: [/sans staking/gi, /sans obligation de staking/gi, /aucun staking/gi],
      en: [/no staking/gi, /without staking/gi, /no staking required/gi],
      de: [/ohne staking/gi, /kein staking/gi],
      es: [/sin staking/gi, /sin obligación de staking/gi],
      it: [/senza staking/gi, /nessuno staking/gi],
    },
    slugs: {
      fr: '/fr/cartes/sans-staking', en: '/en/cards/no-staking',
      de: '/de/karten/ohne-staking', es: '/es/tarjetas/sin-staking', it: '/it/carte/senza-staking',
    },
  },
  {
    theme: 'best',
    patterns: {
      fr: [/meilleures? cartes? crypto/gi, /top cartes? crypto/gi],
      en: [/best crypto card/gi, /top crypto card/gi],
      de: [/beste krypto.?karte/gi],
      es: [/mejor(?:es)? tarjeta(?:s)? crypto/gi],
      it: [/migliori? carta? crypto/gi],
    },
    slugs: {
      fr: '/fr/cartes/meilleures', en: '/en/cards/best',
      de: '/de/karten/beste', es: '/es/tarjetas/mejores', it: '/it/carte/migliori',
    },
  },
  {
    theme: 'beginner',
    patterns: {
      fr: [/carte(?:s)? crypto (?:pour )?débutant/gi, /première carte crypto/gi, /commencer avec une carte crypto/gi],
      en: [/beginner crypto card/gi, /first crypto card/gi, /getting started with crypto card/gi],
      de: [/krypto.?karte für einsteiger/gi, /erste krypto.?karte/gi],
      es: [/tarjeta crypto para principiantes/gi, /primera tarjeta crypto/gi],
      it: [/carta crypto per principianti/gi, /prima carta crypto/gi],
    },
    slugs: {
      fr: '/fr/cartes/debutant', en: '/en/cards/beginner',
      de: '/de/karten/einsteiger', es: '/es/tarjetas/principiante', it: '/it/carte/principiante',
    },
  },
];

// ─── Link injection ───────────────────────────────────────────────────────────

function injectLinks(html, lang) {
  let result = html;
  let linksAdded = 0;

  for (const theme of THEME_LINKS) {
    const slug = theme.slugs[lang];
    if (!slug) continue;

    // Skip if this theme's link is already present
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`href=["']${escapedSlug}["']`).test(result)) continue;

    const patterns = theme.patterns[lang] || [];
    for (const pattern of patterns) {
      let replaced = false;
      result = result.replace(pattern, (match) => {
        if (replaced) return match;
        replaced = true;
        linksAdded++;
        return `<a href="${slug}" class="text-cyan-400 hover:text-cyan-300 underline">${match}</a>`;
      });
      if (replaced) break;
    }
  }

  return { html: result, linksAdded };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching blog posts from Supabase…');
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, content')
    .eq('published', true);

  if (error) { console.error('Fetch error:', error); process.exit(1); }
  console.log(`Found ${posts.length} published posts.`);

  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    if (!post.content) { skipped++; continue; }

    const lang = detectLang(post.slug, post.content);
    const { html, linksAdded } = injectLinks(post.content, lang);

    if (linksAdded === 0) { skipped++; continue; }

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ content: html })
      .eq('id', post.id);

    if (updateError) {
      console.error(`Error updating ${post.slug}:`, updateError);
    } else {
      updated++;
      console.log(`  ✅ [${lang}] ${post.slug} — ${linksAdded} lien(s)`);
    }
  }

  console.log(`\nDone. ${updated} posts updated, ${skipped} skipped.`);
}

main();
