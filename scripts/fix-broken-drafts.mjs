#!/usr/bin/env node
/**
 * Repare + publie les 10 brouillons (2 clusters x 5 langues) dont le CONTENU
 * est deja bien localise mais dont les metadonnees sont restees en francais.
 *  - title  : extrait du H1 present dans le contenu (deja dans la bonne langue)
 *  - meta_title / meta_description / excerpt / slug : localises (non-FR)
 *  - published = true, created_at = aujourd'hui
 * Les slugs non-FR changent, mais ces pages etaient des drafts (jamais indexees)
 * -> pas de redirection necessaire.
 *
 *   set -a && source .env && set +a
 *   node scripts/fix-broken-drafts.mjs            # DRY-RUN
 *   node scripts/fix-broken-drafts.mjs --confirm  # applique + publie
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');

// patch metadonnees par id. FR = {} (meta/excerpt/slug deja FR corrects, title auto).
const PATCH = {
  // ---- cluster NEXO ALTERNATIVES ----
  'dfc7a00a-fb54-43b6-91a6-0acec0b2008d': {}, // fr
  '2fa83fea-f1e0-461c-89d0-5fce7f3c3519': { // de
    slug: 'nexo-alternativen-krypto-karten-2026',
    meta_title: 'Nexo Alternativen 2026: die besten Krypto-Karten',
    meta_description: 'Auf der Suche nach einer Nexo-Alternative? Diese Krypto-Karten bieten 0,5-2 % Cashback ohne Pflicht-Staking. Vergleich, gepruft 2026.',
    excerpt: 'Die Nexo Card bietet 0,5-2 % Cashback ohne Jahresgebuhr, doch mehrere Alternativen schneiden besser ab. Die besten Nexo-Konkurrenten 2026.',
  },
  'b39ce86e-ef0c-4616-a494-53e8a6805b23': { // en
    slug: 'nexo-alternatives-crypto-cards-2026',
    meta_title: 'Nexo Alternatives 2026: the best crypto cards',
    meta_description: 'Looking for a Nexo Card alternative? These crypto cards offer 0.5-2% cashback with no mandatory staking. Compared, verified 2026.',
    excerpt: 'The Nexo Card offers 0.5-2% cashback with no annual fee, but several alternatives do better. Here are the best Nexo competitors in 2026.',
  },
  '359803b1-b33d-4b5d-89bc-53ca10bfe5ad': { // es
    slug: 'nexo-alternativas-tarjetas-cripto-2026',
    meta_title: 'Alternativas a Nexo 2026: las mejores tarjetas cripto',
    meta_description: 'Buscas una alternativa a la Nexo Card? Estas tarjetas cripto ofrecen 0,5-2 % de cashback sin staking obligatorio. Comparativa 2026.',
    excerpt: 'La Nexo Card ofrece 0,5-2 % de cashback sin cuota anual, pero varias alternativas la superan. Estas son las mejores en 2026.',
  },
  'c732f21e-2069-4288-8f9e-e60de7b7a44c': { // it
    slug: 'nexo-alternative-carte-crypto-2026',
    meta_title: 'Alternative a Nexo 2026: le migliori carte crypto',
    meta_description: "Cerchi un'alternativa alla Nexo Card? Queste carte crypto offrono 0,5-2 % di cashback senza staking obbligatorio. Comparativo 2026.",
    excerpt: 'La Nexo Card offre 0,5-2 % di cashback senza costi annuali, ma diverse alternative fanno meglio. Ecco le migliori nel 2026.',
  },
  // ---- cluster NETFLIX / SPOTIFY ----
  '845a6457-1202-409a-8fd9-b6f2b69d91b9': {}, // fr
  '7343d9a8-7781-46d9-be3a-12293c372d82': { // de
    slug: 'krypto-karte-streaming-abos-netflix-spotify',
    meta_title: 'Krypto-Karte: Netflix & Spotify per Cashback 2026',
    meta_description: 'Welche Krypto-Karten erstatten deine Streaming-Abos? Bis zu 8 % Cashback auf Netflix und Spotify. Vergleich, gepruft 2026.',
    excerpt: 'Manche Krypto-Karten zahlen bis zu 8 % Cashback auf Streaming-Abos wie Netflix und Spotify - aber nur unter Bedingungen. Der Vergleich 2026.',
  },
  '2ad7820d-07ec-46fc-8c4b-9f575c86f0a5': { // en
    slug: 'crypto-card-streaming-cashback-netflix-spotify',
    meta_title: 'Crypto card cashback: Netflix & Spotify in 2026',
    meta_description: 'Which crypto cards pay back your streaming subscriptions? Up to 8% cashback on Netflix and Spotify. Compared, verified 2026.',
    excerpt: 'Some crypto cards give up to 8% cashback on streaming subscriptions like Netflix and Spotify - but only under conditions. The 2026 comparison.',
  },
  'b04ec614-7030-418c-b89e-a62e2b9d7be7': { // es
    slug: 'tarjeta-cripto-cashback-suscripciones-netflix-spotify',
    meta_title: 'Tarjeta cripto: cashback en Netflix y Spotify 2026',
    meta_description: 'Que tarjetas cripto reembolsan tus suscripciones de streaming? Hasta un 8 % de cashback en Netflix y Spotify. Comparativa 2026.',
    excerpt: 'Algunas tarjetas cripto devuelven hasta un 8 % en suscripciones como Netflix y Spotify, pero con condiciones. La comparativa 2026.',
  },
  '8b92bda7-1a0e-418c-9cec-0cf1d8ed9a6c': { // it
    slug: 'carta-crypto-cashback-abbonamenti-netflix-spotify',
    meta_title: 'Carta crypto: cashback su Netflix e Spotify 2026',
    meta_description: "Quali carte crypto rimborsano i tuoi abbonamenti streaming? Fino all'8 % di cashback su Netflix e Spotify. Comparativo 2026.",
    excerpt: "Alcune carte crypto rimborsano fino all'8 % sugli abbonamenti come Netflix e Spotify, ma a certe condizioni. Il comparativo 2026.",
  },
};

const TODAY = new Date().toISOString();
const firstH1 = (c) => {
  const m = (c || '').match(/^﻿?\s*#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
};

const ids = Object.keys(PATCH);
const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, meta_title, content, published').in('id', ids);
if (error) { console.error('X', error.message); process.exit(1); }

console.log(`\n=== ${CONFIRM ? 'CORRECTION + PUBLICATION' : 'DRY-RUN'} - ${data.length} brouillons ===`);
let done = 0;
for (const p of data) {
  const patch = { ...PATCH[p.id] };
  const title = firstH1(p.content);
  if (!title) { console.log(`\n[${p.lang}] ${p.id} X pas de H1 dans le contenu -> saute`); continue; }
  patch.title = title;
  patch.published = true;
  patch.created_at = TODAY;

  console.log(`\n[${p.lang}] ${patch.slug || p.slug}`);
  console.log(`   title  : ${title}`);
  console.log(`   meta_t : ${patch.meta_title || p.meta_title}  (${(patch.meta_title || p.meta_title || '').length} car)`);

  if (CONFIRM) {
    const { error: e } = await sb.from('blog_posts').update(patch).eq('id', p.id);
    if (e) console.log(`   X ${e.message}`); else { console.log('   OK publie'); done++; }
  }
}

if (CONFIRM) {
  console.log(`\nOK ${done}/${data.length} publies.`);
  console.log(`Ensuite : node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: fix + publish 10 drafts nexo/netflix clusters" && git push`);
} else {
  console.log(`\nDRY-RUN. Pour appliquer : node scripts/fix-broken-drafts.mjs --confirm`);
}
