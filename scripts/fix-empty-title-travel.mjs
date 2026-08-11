#!/usr/bin/env node
/**
 * Remet le champ `title` (H1) manquant sur l'article voyage FR publié.
 * Ciblé par id pour éviter tout effet de bord.
 *
 *   set -a && source .env && set +a
 *   node scripts/fix-empty-title-travel.mjs            # DRY-RUN
 *   node scripts/fix-empty-title-travel.mjs --confirm  # applique
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');

const ID = '8b0a3c41-7034-43a4-90b3-2a9bd03534a7';
const TITLE = 'Meilleure carte crypto pour voyager en Europe (2026)';

const { data: before, error: e1 } = await sb.from('blog_posts')
  .select('id, lang, slug, title, meta_title, published').eq('id', ID).maybeSingle();
if (e1) { console.error('X', e1.message); process.exit(1); }
if (!before) { console.error('X post introuvable'); process.exit(1); }

console.log(`\n[${before.lang}]${before.published ? '' : ' (draft)'} ${before.slug}`);
console.log(`   title actuel : ${JSON.stringify(before.title)}`);
console.log(`   title cible  : ${JSON.stringify(TITLE)}`);
console.log(`   meta_title   : ${before.meta_title}`);

if (CONFIRM) {
  const { error } = await sb.from('blog_posts').update({ title: TITLE }).eq('id', ID);
  console.log(error ? `   X ${error.message}` : `   OK titre mis a jour`);
  console.log(`\nEnsuite : git non requis (contenu en base). La page se met a jour au prochain rendu.`);
} else {
  console.log(`\nDRY-RUN. Pour appliquer : node scripts/fix-empty-title-travel.mjs --confirm`);
}
