#!/usr/bin/env node
/**
 * insert-de-tax-article.mjs
 * Publie l'article DE "Krypto-Cashback versteuern in Deutschland 2026" dans blog_posts.
 * Article SPÉCIFIQUE au marché allemand (droit fiscal DE : § 23 EStG, Haltefrist, Freigrenze),
 * donc une seule ligne lang='de' (pas de localisation multi-marché).
 * Cible la buyer query "Muss ich Krypto-Cashback in Deutschland versteuern?" (gagnant actuel : winheller.com).
 *
 * Insère en BROUILLON (published:false) par défaut. --publish pour publier tout de suite.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-de-tax-article.mjs --dry-run
 *   node scripts/insert-de-tax-article.mjs            # brouillon → relire dans /admin/blog
 *   node scripts/insert-de-tax-article.mjs --publish
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
if (!SB_URL || !SB_KEY) { console.error('❌ Missing env: SUPABASE url + service key'); process.exit(1); }

const DRY = process.argv.includes('--dry-run');
const PUBLISH = process.argv.includes('--publish');
const supabase = createClient(SB_URL, SB_KEY);

const content = fs.readFileSync(
  path.join(ROOT, 'seo', 'content-drafts', 'krypto-cashback-steuern-deutschland-2026-de.md'), 'utf-8').trim();

const row = {
  slug: 'krypto-cashback-steuern-deutschland-2026',
  lang: 'de',
  title: 'Krypto-Cashback versteuern in Deutschland 2026: Was gilt?',
  meta_title: 'Krypto-Cashback Steuer Deutschland 2026 | TopCryptoCards',
  meta_description: 'Muss man Krypto-Cashback in Deutschland versteuern? § 23 EStG, 1-Jahres-Haltefrist und 1.000-€-Freigrenze einfach erklärt – mit Übersichtstabelle und FAQ.',
  excerpt: 'Das Cashback selbst ist meist steuerfrei – erst Verkauf, Tausch oder Bezahlen kann Steuer auslösen. § 23 EStG, Haltefrist und Freigrenze klar erklärt.',
  content,
  topic_key: 'krypto-steuer-cashback-de-2026',
  category: 'guide',
  image_hero: null,
  published: PUBLISH,
};

(async () => {
  const words = content.split(/\s+/).length;
  console.log(`\nDE Steuer-Artikel → ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''} | ${words} mots | /de/blog/${row.slug}\n`);
  if (DRY) { console.log('(dry) upsert:', row.lang, row.slug, `published=${row.published}`); return; }
  const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
  if (error) { console.error('✗', error.message); process.exit(1); }
  console.log(`✅ ${row.lang} /de/blog/${row.slug} — ${PUBLISH ? 'publié' : 'brouillon (relire dans /admin/blog puis publier)'}`);
})();
