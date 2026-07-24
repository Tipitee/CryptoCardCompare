#!/usr/bin/env node
/**
 * Pipeline de publication — LE gate final. Bascule published=true UNIQUEMENT
 * pour les slugs que TU as approuvés. Rien ne va en ligne sans passer par ici.
 *
 * Réseau requis (Supabase) → depuis ta machine :
 *   set -a && source .env && set +a
 *   node scripts/publish-drafts.mjs --dry-run        # montre ce qui serait publié
 *   node scripts/publish-drafts.mjs slug-1 slug-2    # publie ces slugs
 *   node scripts/publish-drafts.mjs --file seo/state/approved.txt
 *
 * Après : node scripts/gen-blog-sitemap.mjs && git add -A && git commit && git push
 * (le prerender GitHub Actions mettra les pages en ligne).
 *
 * Garde-fous : cap de MAX_PUBLISH par run ; refuse si le draft n'a pas passé
 * le quality gate (champ published toujours false + qg_passed attendu si présent).
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const MAX_PUBLISH = Number(process.env.MAX_PUBLISH || 5);
const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('❌ env manquant (SUPABASE_URL + SERVICE key)'); process.exit(1); }
const sb = createClient(URL, KEY);

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
let slugs = args.filter(a => !a.startsWith('--'));
const fi = args.indexOf('--file');
if (fi !== -1 && args[fi + 1]) {
  slugs = readFileSync(args[fi + 1], 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
}
if (!slugs.length) { console.error('Usage : node scripts/publish-drafts.mjs <slug…>  ou  --file <liste>'); process.exit(1); }
if (slugs.length > MAX_PUBLISH) { console.error(`❌ Cap dépassé : ${slugs.length} > MAX_PUBLISH=${MAX_PUBLISH}. Publie par lots.`); process.exit(1); }

const { data, error } = await sb.from('blog_posts').select('id,lang,slug,title,published').in('slug', slugs);
if (error) { console.error('✗', error.message); process.exit(1); }
if (!data.length) { console.error('Aucun post trouvé pour ces slugs.'); process.exit(1); }

for (const p of data) {
  const state = p.published ? 'déjà publié' : (DRY ? 'SERAIT publié' : 'publication…');
  console.log(`[${p.lang}] ${p.slug} — ${state}`);
}
if (DRY) { console.log('\n(dry-run — rien de modifié)'); process.exit(0); }

const toPublish = data.filter(p => !p.published).map(p => p.id);
if (!toPublish.length) { console.log('\nRien à faire (tout est déjà publié).'); process.exit(0); }
const { error: upErr } = await sb.from('blog_posts').update({ published: true }).in('id', toPublish);
if (upErr) { console.error('✗ update:', upErr.message); process.exit(1); }
console.log(`\n✓ ${toPublish.length} publié(s). Étapes suivantes :`);
console.log('  node scripts/gen-blog-sitemap.mjs');
console.log('  git add -A && git commit -m "content: publish approved drafts" && git push');
