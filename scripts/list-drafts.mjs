#!/usr/bin/env node
/**
 * Liste les brouillons (published=false) depuis le terminal.
 *   set -a && source .env && set +a
 *   node scripts/list-drafts.mjs
 */
import { createClient } from '@supabase/supabase-js';
const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);
const { data, error } = await sb.from('blog_posts')
  .select('lang,slug,title,topic_key,created_at')
  .eq('published', false)
  .order('created_at', { ascending: false });
if (error) { console.error('✗', error.message); process.exit(1); }
if (!data.length) { console.log('Aucun brouillon.'); process.exit(0); }
console.log(`${data.length} brouillon(s) :\n`);
const byTopic = {};
for (const p of data) (byTopic[p.topic_key] ??= []).push(p);
for (const [tk, posts] of Object.entries(byTopic)) {
  console.log(`● ${tk}  (${posts.map(p => p.lang).join('+')})`);
  for (const p of posts) console.log(`    [${p.lang}] ${p.slug} — ${p.title.slice(0,55)}`);
}
console.log(`\nPublier un groupe : node scripts/publish-drafts.mjs ${data.slice(0,6).map(p=>p.slug).join(' ')}`);
console.log('Ou relire dans /admin/blog (badge « Brouillon »).');
