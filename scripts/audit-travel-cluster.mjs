#!/usr/bin/env node
/**
 * LECTURE SEULE. Recense tous les articles "voyage" par marche pour reperer
 * la cannibalisation (plusieurs pages sur la meme intention) + slugs tronques.
 *
 *   set -a && source .env && set +a
 *   node scripts/audit-travel-cluster.mjs
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// marqueurs voyage par langue (slug OU title)
const RX = /(voyage|voyag|reise|reisen|viagg|viaggi|viajar|viaje|travel)/i;

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, topic_key, published, content, image_hero');
if (error) { console.error('X', error.message); process.exit(1); }

const travel = data.filter(p => RX.test(p.slug || '') || RX.test(p.title || ''));
travel.sort((a, b) => a.lang.localeCompare(b.lang) || (a.slug || '').localeCompare(b.slug || ''));

const byLang = {};
for (const p of travel) (byLang[p.lang] ??= []).push(p);

for (const lang of Object.keys(byLang).sort()) {
  console.log(`\n===== [${lang}] ${byLang[lang].length} articles voyage =====`);
  for (const p of byLang[lang]) {
    const words = (p.content || '').split(/\s+/).filter(Boolean).length;
    const trunc = /-$/.test(p.slug || '') ? ' ⚠️TRONQUE' : '';
    const nohero = p.image_hero ? '' : ' ⚠️sans-hero';
    console.log(`  ${p.published ? 'PUB ' : 'DRA '}${p.slug}${trunc}${nohero}`);
    console.log(`       "${p.title}" · ${words} mots · topic=${p.topic_key || '-'}`);
  }
}
console.log(`\nTOTAL: ${travel.length} articles voyage sur ${data.length} posts.`);
console.log(`Tronques (slug finissant par '-') : ${travel.filter(p => /-$/.test(p.slug||'')).length}`);
