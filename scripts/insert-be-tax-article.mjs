#!/usr/bin/env node
/**
 * insert-be-tax-article.mjs
 * Publie l'article fiscalité cashback BELGIQUE 2026 (nouvelle taxe 10 % plus-values).
 * Stocké en lang='fr' (le marché be partage les posts blog du marché fr), ciblé Belgique,
 * donc indexé sous /fr/blog/...belgique-2026. Complète la série fiscalité.
 * Insère en BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-be-tax-article.mjs --dry-run
 *   node scripts/insert-be-tax-article.mjs --publish
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
const content = fs.readFileSync(path.join(ROOT, 'seo', 'content-drafts', 'cashback-carte-crypto-impots-belgique-2026-fr.md'), 'utf-8').trim();

const row = {
  slug: 'cashback-carte-crypto-impots-belgique-2026',
  lang: 'fr',
  title: 'Le cashback des cartes crypto est-il imposable en Belgique ? 2026',
  meta_title: 'Cashback Carte Crypto : Imposable en Belgique ? 2026 | TopCryptoCards',
  meta_description: 'Le cashback des cartes crypto est-il imposable en Belgique ? Nouvelle taxe 10 % sur les plus-values dès 2026, franchise 10 000 €, régime 33 % spéculatif : guide avec tableau et FAQ.',
  excerpt: 'Depuis 2026, une taxe de 10 % sur les plus-values s\'applique au-delà d\'une franchise de 10 000 €. Le cashback n\'est pas imposé à la réception, mais à la réalisation : expliqué avec tableau et FAQ.',
  content,
  topic_key: 'fiscalite-cashback-crypto-be-2026',
  category: 'guide', image_hero: null, published: PUBLISH,
};

(async () => {
  const words = content.split(/\s+/).length;
  console.log(`\nBE tax -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''} | ${words} mots | /fr/blog/${row.slug}\n`);
  if (DRY) { console.log('(dry) upsert:', row.lang, row.slug, `published=${row.published}`); return; }
  const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
  if (error) { console.error('x', error.message); process.exit(1); }
  console.log(`OK ${row.lang} /fr/blog/${row.slug} -- ${PUBLISH ? 'publie' : 'brouillon'}`);
})();
