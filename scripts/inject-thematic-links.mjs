/**
 * inject-thematic-links.mjs
 *
 * Injects contextual internal links into blog_posts content stored in Supabase.
 * For each article, scans the body for theme keywords and inserts a <a href> to
 * the matching thematic page. Safe to re-run: won't duplicate existing links.
 *
 * Usage:
 *   VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/inject-thematic-links.mjs
 *
 * Or with dotenv:
 *   node --env-file=.env scripts/inject-thematic-links.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map: keyword (regex) → thematic slug per language
const THEME_LINKS = [
  {
    theme: 'cashback',
    patterns: {
      fr: [/meilleur cashback/gi, /taux de cashback/gi, /carte cashback/gi],
      en: [/best cashback/gi, /cashback rate/gi, /cashback card/gi],
      de: [/bester cashback/gi, /cashback-rate/gi, /cashback karte/gi],
      es: [/mejor cashback/gi, /tasa de cashback/gi, /tarjeta cashback/gi],
      it: [/miglior cashback/gi, /tasso di cashback/gi, /carta cashback/gi],
    },
    slugs: { fr: '/fr/cartes/cashback', en: '/en/cards/cashback', de: '/de/karten/cashback', es: '/es/tarjetas/cashback', it: '/it/carte/cashback' },
  },
  {
    theme: 'no-fees',
    patterns: {
      fr: [/sans frais annuels/gi, /carte gratuite/gi, /sans abonnement/gi],
      en: [/no annual fees?/gi, /free crypto card/gi, /no subscription/gi],
      de: [/ohne jahresgebühr/gi, /kostenlose karte/gi],
      es: [/sin cuota anual/gi, /tarjeta gratuita/gi],
      it: [/senza costi annuali/gi, /carta gratuita/gi],
    },
    slugs: { fr: '/fr/cartes/sans-frais', en: '/en/cards/no-fees', de: '/de/karten/kostenlos', es: '/es/tarjetas/sin-comisiones', it: '/it/carte/senza-costi' },
  },
  {
    theme: 'no-staking',
    patterns: {
      fr: [/sans staking/gi, /sans obligation de staking/gi],
      en: [/no staking/gi, /without staking/gi, /no staking required/gi],
      de: [/ohne staking/gi, /kein staking/gi],
      es: [/sin staking/gi, /sin obligación de staking/gi],
      it: [/senza staking/gi, /nessuno staking/gi],
    },
    slugs: { fr: '/fr/cartes/sans-staking', en: '/en/cards/no-staking', de: '/de/karten/ohne-staking', es: '/es/tarjetas/sin-staking', it: '/it/carte/senza-staking' },
  },
  {
    theme: 'best',
    patterns: {
      fr: [/meilleure carte crypto/gi, /meilleures cartes crypto/gi],
      en: [/best crypto card/gi, /top crypto card/gi],
      de: [/beste krypto.?karte/gi],
      es: [/mejor tarjeta crypto/gi],
      it: [/migliore carta crypto/gi],
    },
    slugs: { fr: '/fr/cartes/meilleures', en: '/en/cards/best', de: '/de/karten/beste', es: '/es/tarjetas/mejores', it: '/it/carte/migliori' },
  },
];

function injectLinks(html, lang, cardSlug) {
  let result = html;
  let linksAdded = 0;

  for (const theme of THEME_LINKS) {
    const slug = theme.slugs[lang];
    if (!slug) continue;
    const alreadyLinked = new RegExp(`href=["']${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(result);
    if (alreadyLinked) continue; // one link per theme per article

    const patterns = theme.patterns[lang] || [];
    for (const pattern of patterns) {
      let replaced = false;
      result = result.replace(pattern, (match) => {
        if (replaced) return match; // only first occurrence
        replaced = true;
        linksAdded++;
        return `<a href="${slug}" class="text-cyan-400 hover:text-cyan-300 underline">${match}</a>`;
      });
      if (replaced) break; // one theme = one link per article
    }
  }

  return { html: result, linksAdded };
}

async function main() {
  console.log('Fetching blog posts from Supabase…');
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, lang, card_id, content')
    .eq('published', true);

  if (error) { console.error('Fetch error:', error); process.exit(1); }
  console.log(`Found ${posts.length} published posts.`);

  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    if (!post.content) { skipped++; continue; }
    const { html, linksAdded } = injectLinks(post.content, post.lang, post.card_id);
    if (linksAdded === 0) { skipped++; continue; }

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ content: html })
      .eq('id', post.id);

    if (updateError) {
      console.error(`Error updating post ${post.id}:`, updateError);
    } else {
      updated++;
      console.log(`  ✅ [${post.lang}] post ${post.id} — ${linksAdded} lien(s) ajouté(s)`);
    }
  }

  console.log(`\nDone. ${updated} posts updated, ${skipped} skipped (no match or no content).`);
}

main();
