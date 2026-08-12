#!/usr/bin/env node
/**
 * Consolidation cluster voyage : depublie les 5 articles fins "blog-travel-2026"
 * (doublons directs de la money page) pour les sortir du sitemap. Les URLs seront
 * redirigees en 301 vers la money page via public/_redirects.
 *
 *   set -a && source .env && set +a
 *   node scripts/consolidate-travel-dupes.mjs            # DRY-RUN
 *   node scripts/consolidate-travel-dupes.mjs --confirm  # depublie
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');

// money page cible par contentLang (destination des 301)
const MONEY = {
  fr: 'meilleure-carte-crypto-voyage-europe-sans-frais',
  de: 'beste-krypto-karte-reisen-europa',
  es: 'mejor-tarjeta-cripto-viajar-europa',
  it: 'migliore-carta-crypto-viaggi-europa',
  en: 'best-crypto-card-travel-europe',
};
const ALIAS = { fr: ['be'], de: ['at'] }; // marches qui partagent le contenu

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, published').eq('topic_key', 'blog-travel-2026');
if (error) { console.error('X', error.message); process.exit(1); }

console.log(`\n=== ${CONFIRM ? 'DEPUBLICATION' : 'DRY-RUN'} - ${data.length} doublons blog-travel-2026 ===`);
const redirects = [];
for (const p of data) {
  const dest = MONEY[p.lang];
  console.log(`\n[${p.lang}] ${p.slug}  ->  ${dest || '??? pas de money page'}`);
  if (!dest) { console.log('   (aucune cible, on saute)'); continue; }
  const langs = [p.lang, ...(ALIAS[p.lang] || [])];
  for (const l of langs) redirects.push(`/${l}/blog/${p.slug}   /${l}/blog/${dest}   301`);
  if (CONFIRM) {
    const { error: e } = await sb.from('blog_posts').update({ published: false }).eq('id', p.id);
    console.log(e ? `   X ${e.message}` : '   OK depublie');
  }
}

console.log(`\n=== 301 a ajouter dans public/_redirects ===`);
redirects.forEach(r => console.log(r));
if (!CONFIRM) console.log(`\nDRY-RUN. Pour depublier : node scripts/consolidate-travel-dupes.mjs --confirm`);
else console.log(`\nEnsuite : ajouter les 301 ci-dessus dans public/_redirects, puis gen-blog-sitemap + push.`);
