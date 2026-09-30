#!/usr/bin/env node
/**
 * insert-es-it-tax-articles.mjs
 * Publie les articles fiscalité cashback ES (IRPF) et IT (plusvalenze 2026) dans blog_posts.
 * Deux marchés à langue propre (es / it), articles distincts. Cible des buyer queries
 * fiscalité peu concurrentielles ("territoire naturel").
 * Insère en BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-es-it-tax-articles.mjs --dry-run
 *   node scripts/insert-es-it-tax-articles.mjs
 *   node scripts/insert-es-it-tax-articles.mjs --publish
 *
 * Requires: SUPABASE_URL (ou VITE_SUPABASE_URL) + SUPABASE_SERVICE_KEY (ou SERVICE_ROLE_KEY).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB_URL || !SB_KEY) { console.error('Missing env: SUPABASE url + service key'); process.exit(1); }

const DRY = process.argv.includes('--dry-run');
const PUBLISH = process.argv.includes('--publish');
const supabase = createClient(SB_URL, SB_KEY);
const read = (f) => fs.readFileSync(path.join(ROOT, 'seo', 'content-drafts', f), 'utf-8').trim();

const rows = [
  {
    slug: 'declarar-cashback-tarjetas-cripto-espana-2026',
    lang: 'es',
    title: '¿Hay que declarar el cashback de las tarjetas cripto? España 2026',
    meta_title: 'Cashback Tarjetas Cripto: ¿Tributa? España 2026 | TopCryptoCards',
    meta_description: '¿Se declara el cashback de las tarjetas cripto en España? IRPF, base del ahorro (19–30 %), pagar con cripto y permutas: explicado con tabla y FAQ.',
    excerpt: 'El cashback no tributa al recibirlo; sí al vender, permutar o pagar con las cripto. IRPF, tipos y casos, explicado claro con tabla y FAQ.',
    content: read('declarar-cashback-tarjetas-cripto-espana-2026-es.md'),
    topic_key: 'fiscalidad-cashback-cripto-es-2026',
    category: 'guide', image_hero: null, published: PUBLISH,
  },
  {
    slug: 'cashback-carte-crypto-tassazione-italia-2026',
    lang: 'it',
    title: 'Il cashback delle carte crypto è tassato in Italia? 2026',
    meta_title: 'Cashback Carte Crypto: Tassazione in Italia 2026 | TopCryptoCards',
    meta_description: 'Il cashback delle carte crypto è tassato in Italia? Plusvalenze al 33 % dal 2026 (26 % per EMT in euro), niente franchigia, pagare con crypto: guida con tabella e FAQ.',
    excerpt: 'Il cashback non è tassato alla ricezione; lo è vendendo, permutando o pagando. Aliquota 33 % dal 2026 (26 % EMT euro), spiegato con tabella e FAQ.',
    content: read('cashback-carte-crypto-tassazione-italia-2026-it.md'),
    topic_key: 'tassazione-cashback-crypto-it-2026',
    category: 'guide', image_hero: null, published: PUBLISH,
  },
];

(async () => {
  console.log(`\nES + IT Steuer/Tax -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
