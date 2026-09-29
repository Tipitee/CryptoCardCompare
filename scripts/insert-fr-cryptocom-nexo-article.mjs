#!/usr/bin/env node
/**
 * insert-fr-cryptocom-nexo-article.mjs
 * Publie l'article FR "Crypto.com ou Nexo : quelle carte choisir" dans blog_posts.
 * Cible la buyer query "Crypto.com ou Nexo, laquelle choisir ?" (gagnant actuel : slashdot.org).
 * Article FR (une ligne lang='fr'). Insère en BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-fr-cryptocom-nexo-article.mjs --dry-run
 *   node scripts/insert-fr-cryptocom-nexo-article.mjs
 *   node scripts/insert-fr-cryptocom-nexo-article.mjs --publish
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

const content = fs.readFileSync(
  path.join(ROOT, 'seo', 'content-drafts', 'crypto-com-ou-nexo-quelle-carte-choisir-fr.md'), 'utf-8').trim();

const row = {
  slug: 'crypto-com-ou-nexo-quelle-carte-choisir',
  lang: 'fr',
  title: 'Crypto.com ou Nexo : quelle carte crypto choisir en 2026 ?',
  meta_title: 'Crypto.com ou Nexo : quelle carte choisir ? | TopCryptoCards',
  meta_description: 'Crypto.com ou Nexo ? Cashback reel, staking, plafonds, monnaie du cashback : notre comparatif honnete et chiffre pour choisir la bonne carte crypto en 2026.',
  excerpt: 'Nexo est plus simple et sans staking, Crypto.com vise plus haut mais exige de bloquer des CRO. Notre comparatif chiffre pour choisir selon ton profil.',
  content,
  topic_key: 'crypto-com-vs-nexo-choix-2026',
  category: 'guide',
  image_hero: null,
  published: PUBLISH,
};

(async () => {
  const words = content.split(/\s+/).length;
  console.log(`\nFR Crypto.com vs Nexo -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''} | ${words} mots | /fr/blog/${row.slug}\n`);
  if (DRY) { console.log('(dry) upsert:', row.lang, row.slug, `published=${row.published}`); return; }
  const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
  if (error) { console.error('x', error.message); process.exit(1); }
  console.log(`OK ${row.lang} /fr/blog/${row.slug} -- ${PUBLISH ? 'publie' : 'brouillon (relire dans /admin/blog puis publier)'}`);
})();
