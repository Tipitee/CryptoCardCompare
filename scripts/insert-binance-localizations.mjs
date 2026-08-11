#!/usr/bin/env node
/**
 * Insère les 4 localisations Binance (DE/ES/IT/EN), adaptées par marché.
 * topic_key partagé avec la FR (hero réutilisée), brief retiré, date du jour.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-binance-localizations.mjs             # DRY-RUN
 *   node scripts/insert-binance-localizations.mjs --confirm   # insère
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');
const TOPIC = 'blog-carte-binance-arret-europe-2026';
const HERO = 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/blog-hero-images/carte-binance-europe-arret-alternatives-1786041528185.jpg';

const strip = raw => raw.replace(/^﻿?\s*<!--[\s\S]*?-->\s*/, '').trim();

const ITEMS = [
  {
    file: 'seo/content-drafts/binance-karte-2026-de.md', lang: 'de',
    slug: 'binance-karte-2026-europa-eingestellt-alternativen',
    title: 'Binance Karte 2026: warum es sie in Europa nicht mehr gibt (und die besten Alternativen)',
    meta_title: 'Binance Karte 2026: eingestellt in Europa + Alternativen',
    meta_description: 'Die Binance Karte gibt es im EWR seit Dez. 2023 nicht mehr. Warum, und welche Krypto-Karten sie 2026 ersetzen. Geprüft August 2026.',
    excerpt: 'Die Binance Card ist im EWR seit dem 20. Dezember 2023 nicht mehr verfügbar. Warum, und die besten Krypto-Karten als Ersatz in Deutschland 2026.',
    tags: ['binance karte', 'binance', 'alternativen', 'cashback', 'europa'],
  },
  {
    file: 'seo/content-drafts/tarjeta-binance-2026-es.md', lang: 'es',
    slug: 'tarjeta-binance-europa-fin-alternativas',
    title: 'Tarjeta Binance en 2026: por qué ya no existe en Europa (y por cuál sustituirla)',
    meta_title: 'Tarjeta Binance 2026: retirada en Europa + alternativas',
    meta_description: 'La tarjeta Binance ya no existe en el EEE desde dic. 2023. Por qué, y las mejores tarjetas cripto para sustituirla en España 2026. Verificado agosto 2026.',
    excerpt: 'La tarjeta Binance ya no está disponible en el EEE desde el 20 de diciembre de 2023. Por qué, y las mejores tarjetas cripto para sustituirla en España en 2026.',
    tags: ['tarjeta binance', 'binance', 'alternativas', 'cashback', 'españa'],
  },
  {
    file: 'seo/content-drafts/carta-binance-2026-it.md', lang: 'it',
    slug: 'carta-binance-europa-stop-alternative',
    title: 'Carta Binance nel 2026: perché non esiste più in Europa (e con cosa sostituirla)',
    meta_title: 'Carta Binance 2026: ritirata in Europa + alternative',
    meta_description: 'La carta Binance non esiste più nel SEE dal dic. 2023. Perché, e le migliori carte crypto per sostituirla in Italia nel 2026. Verificato agosto 2026.',
    excerpt: 'La carta Binance non è più disponibile nel SEE dal 20 dicembre 2023. Perché, e le migliori carte crypto per sostituirla in Italia nel 2026.',
    tags: ['carta binance', 'binance', 'alternative', 'cashback', 'europa'],
  },
  {
    file: 'seo/content-drafts/binance-card-2026-en.md', lang: 'en',
    slug: 'binance-card-uk-availability-alternatives',
    title: 'Binance Card in 2026: is it available in the UK? (and the best alternatives)',
    meta_title: 'Binance Card UK 2026: availability and alternatives',
    meta_description: 'Is the Binance Card available in the UK in 2026? No — here is why (FCA), and the best crypto cards for UK residents instead. Verified August 2026.',
    excerpt: 'The Binance Card is not available to UK residents in 2026 (FCA). Here is why, and the best crypto cards UK users can get instead.',
    tags: ['binance card', 'binance', 'uk', 'alternatives', 'cashback'],
  },
];

console.log(`\n=== ${CONFIRM ? 'INSERTION' : 'DRY-RUN'} — ${ITEMS.length} localisations Binance ===`);
let done = 0;
for (const it of ITEMS) {
  const content = strip(readFileSync(it.file, 'utf8'));
  const post = {
    lang: it.lang, slug: it.slug, title: it.title, excerpt: it.excerpt,
    meta_title: it.meta_title, meta_description: it.meta_description, content,
    topic_key: TOPIC, category: 'guide', tags: it.tags, image_hero: HERO,
    published: true, created_at: new Date().toISOString(),
  };
  const { data: existing } = await sb.from('blog_posts')
    .select('id').eq('lang', it.lang).eq('slug', it.slug).maybeSingle();

  console.log(`\n[${it.lang}] ${it.slug}`);
  console.log(`   title: ${it.title}`);
  console.log(`   ${content.split(/\s+/).length} mots · meta_title ${it.meta_title.length} car · brief retiré: ${!content.includes('BRIEF (')}${existing ? ' · EXISTE (update)' : ''}`);

  if (CONFIRM) {
    const { error } = existing
      ? await sb.from('blog_posts').update(post).eq('id', existing.id)
      : await sb.from('blog_posts').insert(post);
    if (error) console.log(`   ✗ ${error.message}`); else { console.log('   ✓ publié'); done++; }
  }
}

if (CONFIRM) {
  console.log(`\n✓ ${done}/${ITEMS.length} publiés (date du jour, hero partagée).`);
  console.log(`Ensuite : node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: localisations Binance DE/ES/IT/EN" && git push`);
} else {
  console.log(`\nDRY-RUN. Pour insérer : node scripts/insert-binance-localizations.mjs --confirm`);
}
