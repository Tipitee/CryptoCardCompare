#!/usr/bin/env node
/**
 * fix-empty-titles.mjs
 * Backfill des titres manquants dans blog_posts (générations récentes où `title`
 * est resté NULL/vide — bug corrigé dans auto-article.mjs, ce script répare l'existant).
 *
 * Ordre de dérivation du titre, par ligne :
 *   1. Premier `# H1` du corps markdown (source de vérité — markdown.ts le strippe à l'affichage)
 *   2. meta_title sans le suffixe " | ..." (ex. " | TopCryptoCards")
 *   3. slug converti en Title Case
 *
 * Usage :
 *   set -a && source .env && set +a
 *   node scripts/fix-empty-titles.mjs            # dry-run (n'écrit rien, affiche le plan)
 *   node scripts/fix-empty-titles.mjs --apply    # applique les mises à jour
 *   node scripts/fix-empty-titles.mjs --lang=fr  # filtre par langue (optionnel)
 *
 * Env vars :
 *   SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (ou SUPABASE_SERVICE_ROLE_KEY)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const args   = process.argv.slice(2);
const apply  = args.includes('--apply');
const langArg = args.find(a => a.startsWith('--lang='))?.replace('--lang=', '');

/* ── Dérivation du titre ─────────────────────────────────────────────────── */
const firstH1 = (md) => ((md || '').match(/^\s*#\s+(.+?)\s*$/m)?.[1] || '').trim();

const stripMetaSuffix = (mt) => (mt || '').replace(/\s*[|–—-]\s*[^|–—-]*$/, '').trim();

const titleFromSlug = (slug) =>
  (slug || '')
    .split('-')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .trim();

function deriveTitle(row) {
  const h1 = firstH1(row.body);
  if (h1) return { title: h1, source: 'h1' };
  const mt = stripMetaSuffix(row.meta_title);
  if (mt) return { title: mt, source: 'meta_title' };
  const st = titleFromSlug(row.slug);
  if (st) return { title: st, source: 'slug' };
  return { title: '', source: 'none' };
}

const isEmpty = (v) => v == null || String(v).trim() === '';

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n📥 Récupération des blog_posts${langArg ? ` [lang=${langArg}]` : ''}…`);

  let query = supabase
    .from('blog_posts')
    .select('id, lang, slug, title, meta_title, content')
    .order('lang')
    .order('slug');
  if (langArg) query = query.eq('lang', langArg);

  const { data: posts, error } = await query;
  if (error) { console.error('Fetch error:', error.message); process.exit(1); }
  if (!posts?.length) { console.log('Aucun article trouvé.'); return; }

  const empties = posts.filter(p => isEmpty(p.title));
  console.log(`\n📊 ${posts.length} articles — ${empties.length} sans titre.`);

  if (empties.length === 0) {
    console.log('✨ Rien à corriger.\n');
    return;
  }

  const plan = [];
  const unresolved = [];
  for (const row of empties) {
    const { title, source } = deriveTitle(row);
    if (isEmpty(title)) { unresolved.push(row); continue; }
    plan.push({ id: row.id, lang: row.lang, slug: row.slug, title, source });
  }

  console.log(`\n  À corriger : ${plan.length}${unresolved.length ? `  |  ⚠️ non résolus : ${unresolved.length}` : ''}\n`);
  for (const p of plan) {
    console.log(`  [${p.lang}] ${p.slug}`);
    console.log(`     → "${p.title}"  (${p.source})`);
  }
  if (unresolved.length) {
    console.log('\n  ⚠️ Impossible de dériver un titre (ni H1, ni meta_title, ni slug) :');
    for (const r of unresolved) console.log(`     • [${r.lang}] ${r.slug} (id=${r.id})`);
  }

  if (!apply) {
    console.log('\n(dry-run : aucune écriture. Relancez avec --apply pour appliquer.)\n');
    return;
  }

  console.log('\n🚀 Application…\n');
  let ok = 0, fail = 0;
  for (const p of plan) {
    const { error: upErr } = await supabase
      .from('blog_posts')
      .update({ title: p.title })
      .eq('id', p.id);
    if (upErr) { console.error(`  ❌ [${p.lang}] ${p.slug}: ${upErr.message}`); fail++; }
    else { ok++; }
  }
  console.log(`\nDone. ${ok} mis à jour, ${fail} échecs, ${unresolved.length} non résolus.\n`);
}

main();
