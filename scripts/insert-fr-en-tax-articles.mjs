#!/usr/bin/env node
/**
 * insert-fr-en-tax-articles.mjs
 * Publie les articles fiscalité cashback FR (flat tax 30 %) et EN/UK (CGT) dans blog_posts.
 * Complète la série fiscalité (DE/AT, ES, IT, PT) sur les deux plus gros marchés.
 * Cible des buyer queries fiscalité peu concurrentielles ("territoire naturel").
 * Insère en BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-fr-en-tax-articles.mjs --dry-run
 *   node scripts/insert-fr-en-tax-articles.mjs
 *   node scripts/insert-fr-en-tax-articles.mjs --publish
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
    slug: 'cashback-carte-crypto-impots-france-2026',
    lang: 'fr',
    title: 'Le cashback des cartes crypto est-il imposable en France ? 2026',
    meta_title: 'Cashback Carte Crypto : Imposable en France ? 2026 | TopCryptoCards',
    meta_description: 'Le cashback des cartes crypto est-il imposable en France ? Flat tax 30 %, cession imposable, payer avec la carte, formulaires 2086/3916-bis : guide clair avec tableau et FAQ.',
    excerpt: 'Le cashback n\'est pas imposé à la réception ; il l\'est à la revente ou au paiement. Flat tax 30 %, seuil 305 €, échange crypto-crypto en sursis : expliqué avec tableau et FAQ.',
    content: read('cashback-carte-crypto-impots-france-2026-fr.md'),
    topic_key: 'fiscalite-cashback-crypto-fr-2026',
    category: 'guide', image_hero: null, published: PUBLISH,
  },
  {
    slug: 'crypto-card-cashback-tax-uk-2026',
    lang: 'en',
    title: 'Is crypto card cashback taxable in the UK? 2026',
    meta_title: 'Crypto Card Cashback: Taxable in the UK? 2026 | TopCryptoCards',
    meta_description: 'Is crypto card cashback taxable in the UK? Capital Gains Tax 18/24 %, £3,000 allowance, spending crypto as a disposal, SA108 reporting: clear guide with table and FAQ.',
    excerpt: 'Cashback isn\'t taxed at receipt; it matters when you sell or spend. CGT 18/24 %, £3,000 allowance, crypto-to-crypto swaps are disposals: explained with a table and FAQ.',
    content: read('crypto-card-cashback-tax-uk-2026-en.md'),
    topic_key: 'crypto-cashback-tax-uk-2026',
    category: 'guide', image_hero: null, published: PUBLISH,
  },
];

(async () => {
  console.log(`\nFR + EN/UK tax -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
