#!/usr/bin/env node
/**
 * LECTURE SEULE. Liste tous les blog_posts dont le champ `title` est vide/absent
 * (mais qui ont un meta_title / slug) — cause du H1 manquant sur la page.
 *
 *   set -a && source .env && set +a
 *   node scripts/find-empty-titles.mjs
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, meta_title, published');
if (error) { console.error('✗', error.message); process.exit(1); }

const empty = data.filter(p => !p.title || !String(p.title).trim());

console.log(`\n=== ${data.length} posts au total · ${empty.length} avec title VIDE ===\n`);
for (const p of empty) {
  console.log(`[${p.lang}]${p.published ? '' : ' (draft)'} ${p.slug}`);
  console.log(`   id: ${p.id}`);
  console.log(`   meta_title: ${p.meta_title || '(vide aussi)'}\n`);
}
if (!empty.length) console.log('Aucun title vide.');
