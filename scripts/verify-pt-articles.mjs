#!/usr/bin/env node
/**
 * verify-pt-articles.mjs
 * Reads back the pt blog_posts and runs quality checks:
 *   - content length, hero image present
 *   - Portugal market markers (28%, 365, Banco de Portugal / MiCA)
 *   - no obvious Brazilian-PT tokens ("você", "saque", "celular")
 *   - no leftover French market refs ("AMF", "en France")
 *
 * Usage: set -a && source .env && set +a && node scripts/verify-pt-articles.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ Missing Supabase env'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data, error } = await supabase
  .from('blog_posts')
  .select('slug, title, content, meta_title, meta_description, image_hero, topic_key, published')
  .eq('lang', 'pt')
  .order('slug');
if (error) { console.error('❌', error.message); process.exit(1); }

console.log(`\n🇵🇹 ${data.length} pt articles\n`);
let warn = 0;
for (const p of data) {
  const c = (p.content || '');
  const low = c.toLowerCase();
  const tax = /28\s?%/.test(c) && /365/.test(c);
  const reg = /banco de portugal|mica/i.test(c);
  const braz = ['você', 'saque', 'celular', 'grana'].filter(w => low.includes(w));
  const frRefs = ['amf', 'en france', 'en frança'].filter(w => low.includes(w));
  const flags = [];
  if (!p.image_hero) flags.push('NO HERO');
  if (c.length < 1500) flags.push(`SHORT(${c.length})`);
  if (!p.published) flags.push('UNPUBLISHED');
  if (braz.length) flags.push('BR-PT:' + braz.join(','));
  if (frRefs.length) flags.push('FR-REF:' + frRefs.join(','));
  const taxNote = /impost|fiscal|tax/i.test(p.slug) ? (tax ? ' tax✓' : ' tax✗MISSING') : (tax ? ' tax✓' : '');
  if (flags.length || (/impost|fiscal/i.test(p.slug) && !tax)) warn++;
  console.log(`${flags.length ? '⚠️ ' : '✓ '}${p.slug}`);
  console.log(`    len=${c.length} hero=${p.image_hero ? 'yes' : 'NO'} reg=${reg ? 'yes' : 'no'}${taxNote}${flags.length ? '  ['+flags.join(' | ')+']' : ''}`);
}
console.log(`\n${warn ? '⚠️  '+warn+' article(s) with flags — review above.' : '✅ All good.'}\n`);
