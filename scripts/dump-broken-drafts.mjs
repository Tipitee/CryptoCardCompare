#!/usr/bin/env node
/**
 * LECTURE SEULE. Dump l'etat des 10 brouillons casses (title vide) :
 * langue, slug, meta, topic_key, longueur + apercu du contenu + langue detectee.
 *
 *   set -a && source .env && set +a
 *   node scripts/dump-broken-drafts.mjs
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const IDS = [
  'dfc7a00a-fb54-43b6-91a6-0acec0b2008d',
  'c732f21e-2069-4288-8f9e-e60de7b7a44c',
  '2fa83fea-f1e0-461c-89d0-5fce7f3c3519',
  'b39ce86e-ef0c-4616-a494-53e8a6805b23',
  '359803b1-b33d-4b5d-89bc-53ca10bfe5ad',
  '845a6457-1202-409a-8fd9-b6f2b69d91b9',
  '7343d9a8-7781-46d9-be3a-12293c372d82',
  'b04ec614-7030-418c-b89e-a62e2b9d7be7',
  '8b92bda7-1a0e-418c-9cec-0cf1d8ed9a6c',
  '2ad7820d-07ec-46fc-8c4b-9f575c86f0a5',
];

// marqueurs de langue simples pour deviner la langue dominante du contenu
const MARK = {
  fr: [' le ', ' la ', ' les ', ' des ', ' est ', ' vous ', ' pour ', ' avec ', ' sans '],
  de: [' der ', ' die ', ' das ', ' und ', ' ist ', ' Sie ', ' mit ', ' ohne ', ' fuer '],
  es: [' el ', ' la ', ' los ', ' las ', ' con ', ' sin ', ' para ', ' es ', ' una '],
  it: [' il ', ' la ', ' le ', ' con ', ' senza ', ' per ', ' e ', ' una ', ' della '],
  en: [' the ', ' and ', ' is ', ' with ', ' without ', ' for ', ' you ', ' a ', ' of '],
};
function guess(txt) {
  const t = ' ' + txt.toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿñæœ]/g, ' ') + ' ';
  let best = '?', score = -1;
  for (const [l, ms] of Object.entries(MARK)) {
    const s = ms.reduce((a, m) => a + (t.split(m).length - 1), 0);
    if (s > score) { score = s; best = l; }
  }
  return best;
}

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, meta_title, meta_description, excerpt, topic_key, content, published')
  .in('id', IDS);
if (error) { console.error('X', error.message); process.exit(1); }

data.sort((a, b) => (a.topic_key || '').localeCompare(b.topic_key || '') || a.lang.localeCompare(b.lang));

for (const p of data) {
  const c = p.content || '';
  console.log(`\n========== [${p.lang}] topic=${p.topic_key || '(aucun)'} ${p.published ? '' : '(draft)'}`);
  console.log(`  slug        : ${p.slug}`);
  console.log(`  meta_title  : ${p.meta_title || '(vide)'}`);
  console.log(`  excerpt     : ${(p.excerpt || '(vide)').slice(0, 90)}`);
  console.log(`  content     : ${c.split(/\s+/).length} mots · langue detectee du corps: ${guess(c)}`);
  console.log(`  apercu      : ${c.replace(/\s+/g, ' ').slice(0, 180)}`);
}
console.log(`\n(${data.length} brouillons)`);
