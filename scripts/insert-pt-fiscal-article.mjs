#!/usr/bin/env node
/**
 * insert-pt-fiscal-article.mjs
 *
 * Inserts the pt-PT article "Fiscalidade do cashback de cartões crypto em Portugal"
 * into Supabase blog_posts. The body is read from
 *   seo/content-drafts/fiscalidade-cashback-cartao-crypto-portugal-pt.md
 * The hero image is reused from the FR tax article (carte-crypto-impots-france)
 * if available. Its own topic_key (not shared) so it is not treated as a
 * translation of another article.
 *
 * Inserts as a DRAFT (published:false) so you can review it in /admin/blog first.
 * Add --publish to publish immediately.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/insert-pt-fiscal-article.mjs --dry-run
 *   node scripts/insert-pt-fiscal-article.mjs            # insert as draft
 *   node scripts/insert-pt-fiscal-article.mjs --publish  # insert & publish
 *
 * Requires in .env: SUPABASE_URL (or VITE_SUPABASE_URL),
 *                   SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env: SUPABASE_URL (or VITE_SUPABASE_URL) + SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DRY = process.argv.includes('--dry-run');
const PUBLISH = process.argv.includes('--publish');

const content = fs.readFileSync(
  path.join(ROOT, 'seo', 'content-drafts', 'fiscalidade-cashback-cartao-crypto-portugal-pt.md'),
  'utf-8'
).trim();

const POST = {
  slug: 'fiscalidade-cashback-cartao-crypto-portugal',
  lang: 'pt',
  title: 'Fiscalidade do cashback de cartões crypto em Portugal',
  meta_title: 'Cashback de cartões crypto: a fiscalidade em Portugal 2026',
  meta_description: 'Como é tributado o cashback dos cartões crypto em Portugal: regra dos 365 dias, 28% de mais-valias, pagar com cripto como alienação. Guia claro, com dados 2026.',
  excerpt: 'Receber cashback num cartão crypto tem implicações fiscais mal explicadas em Portugal. Regra dos 365 dias, 28% de mais-valias, e por que o cashback real muda tudo.',
  category: 'guide',
  topic_key: 'pt-fiscalidade-cashback-2026',
  content,
};

async function run() {
  // Reuse hero image from the FR tax article, if it exists.
  let image_hero = null;
  try {
    const { data } = await supabase.from('blog_posts')
      .select('image_hero').eq('lang', 'fr').eq('slug', 'carte-crypto-impots-france').maybeSingle();
    image_hero = data?.image_hero || null;
  } catch (e) { console.warn('⚠️  could not read FR hero:', e.message); }

  const row = { ...POST, image_hero, published: PUBLISH };

  console.log(`\n📝 ${row.slug} (pt) — ${row.content.split(/\s+/).length} words`);
  console.log(`   hero: ${image_hero ? 'reused from FR tax article' : 'none'} · published: ${row.published}`);
  if (DRY) { console.log('\n(dry-run) nothing written.'); return; }

  const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
  if (error) { console.error('❌ upsert failed:', error.message); process.exit(1); }
  console.log(`\n✅ Upserted. ${PUBLISH ? 'Published.' : 'Draft — review in /admin/blog, then publish.'}`);
}
run();
