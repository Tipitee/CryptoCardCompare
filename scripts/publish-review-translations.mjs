#!/usr/bin/env node
/** Publie les 9 traductions insérées sans le flag published. Usage:
 *  set -a && source .env && set +a && node scripts/publish-review-translations.mjs
 */
import { createClient } from '@supabase/supabase-js';
const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const SLUGS = [
  'gnosis-pay-avis-2026', 'gnosis-pay-opiniones-2026', 'gnosis-pay-recensione-2026',
  'brighty-card-avis-2026', 'brighty-card-opiniones-2026', 'brighty-card-recensione-2026',
  'metamask-card-avis-2026', 'metamask-card-opiniones-2026', 'metamask-card-recensione-2026',
];
const { data, error } = await sb.from('blog_posts')
  .update({ published: true })
  .in('slug', SLUGS)
  .select('lang, slug, published');
if (error) { console.error('✗', error.message); process.exit(1); }
data.forEach(r => console.log(`✓ publié [${r.lang}] ${r.slug}`));
console.log(`\n${data.length}/9 publiés. Ensuite: node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: publish 9 reviews + sitemap" && git push`);
