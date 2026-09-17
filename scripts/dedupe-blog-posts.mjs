#!/usr/bin/env node
/**
 * dedupe-blog-posts.mjs
 * Détecte les articles blog EN DOUBLE : plusieurs lignes pour un même sujet
 * (topic_key) dans une même langue, avec des slugs différents. Un doublon crée
 * un 404 (ancien slug) et un "Duplicate canonical" côté Google.
 *
 * Stratégie (sans suppression) :
 *   - garde le "meilleur" (publié > contenu le plus long > plus récent)
 *   - DÉPUBLIE les doublons (published=false) — aucune donnée effacée
 *   - émet des règles 301 (ancien slug → gardé) à coller dans public/_redirects
 *
 * Usage :
 *   set -a && source .env && set +a
 *   node scripts/dedupe-blog-posts.mjs             # dry-run (n'écrit rien)
 *   node scripts/dedupe-blog-posts.mjs --apply     # dépublie les doublons + écrit les 301
 *   node scripts/dedupe-blog-posts.mjs --lang=en   # un seul marché
 *
 * Sortie : scripts/out/blog-dupes-301.txt (règles à coller dans _redirects).
 *
 * Env : SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (ou SERVICE_ROLE_KEY)
 */

import { createClient } from '@supabase/supabase-js';
import { mkdirSync, writeFileSync } from 'node:fs';

const SURL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SKEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SURL || !SKEY) { console.error('❌ env manquant : SUPABASE_URL + SERVICE key'); process.exit(1); }

const sb = createClient(SURL, SKEY);
const args    = process.argv.slice(2);
const apply   = args.includes('--apply');
const langArg = args.find(a => a.startsWith('--lang='))?.replace('--lang=', '');

// Segment blog par langue (be/at utilisent aussi "blog").
const BLOG_SEG = { fr: 'blog', be: 'blog', de: 'blog', at: 'blog', es: 'blog', it: 'blog', en: 'blog', pt: 'blog' };
const blogUrl = (lang, slug) => `/${lang}/${BLOG_SEG[lang] || 'blog'}/${slug}`;

// Choix du gardé : publié d'abord, puis contenu le plus long, puis plus récent.
function pickKeeper(rows) {
  return [...rows].sort((a, b) => {
    if (!!b.published !== !!a.published) return (b.published ? 1 : 0) - (a.published ? 1 : 0);
    const la = (a.content || '').length, lb = (b.content || '').length;
    if (lb !== la) return lb - la;
    return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
  })[0];
}

async function main() {
  console.log(`\n📥 Récupération des blog_posts${langArg ? ` [lang=${langArg}]` : ''}…`);
  let query = sb.from('blog_posts')
    .select('id, lang, slug, topic_key, title, content, published, updated_at')
    .not('topic_key', 'is', null)
    .order('lang');
  if (langArg) query = query.eq('lang', langArg);

  const { data: posts, error } = await query;
  if (error) { console.error('Fetch error:', error.message); process.exit(1); }
  if (!posts?.length) { console.log('Aucun article.'); return; }

  // Groupes (lang + topic_key) avec > 1 ligne = doublons.
  const groups = new Map();
  for (const p of posts) {
    const k = `${p.lang}|${p.topic_key}`;
    (groups.get(k) || groups.set(k, []).get(k)).push(p);
  }

  const dupeGroups = [...groups.entries()].filter(([, rows]) => rows.length > 1);
  console.log(`\n📊 ${posts.length} articles — ${dupeGroups.length} groupes en double.\n`);

  if (dupeGroups.length === 0) { console.log('✨ Aucun doublon.\n'); return; }

  const redirects = [];
  const toUnpublish = [];
  for (const [key, rows] of dupeGroups) {
    const keeper = pickKeeper(rows);
    const losers = rows.filter(r => r.id !== keeper.id);
    const [lang] = key.split('|');
    console.log(`  [${lang}] topic=${keeper.topic_key}`);
    console.log(`     ✅ gardé   : ${keeper.slug}${keeper.published ? '' : ' (brouillon)'} (${(keeper.content||'').length} car.)`);
    for (const l of losers) {
      console.log(`     ✗ doublon : ${l.slug}${l.published ? ' (publié→dépublié)' : ' (brouillon)'} (${(l.content||'').length} car.)`);
      toUnpublish.push(l);
      redirects.push(`${blogUrl(lang, l.slug)}  ${blogUrl(lang, keeper.slug)}  301`);
    }
  }

  // Écrit les règles 301 dans un fichier à part.
  mkdirSync('scripts/out', { recursive: true });
  const outPath = 'scripts/out/blog-dupes-301.txt';
  writeFileSync(outPath, redirects.join('\n') + '\n');
  console.log(`\n📝 ${redirects.length} règles 301 écrites → ${outPath} (à coller dans public/_redirects avant le catch-all 404).`);

  if (!apply) {
    console.log('\n(dry-run : aucune écriture DB. Relancez avec --apply pour dépublier les doublons.)\n');
    return;
  }

  console.log('\n🚀 Dépublication des doublons…\n');
  let ok = 0, fail = 0;
  for (const l of toUnpublish) {
    const { error: upErr } = await sb.from('blog_posts').update({ published: false }).eq('id', l.id);
    if (upErr) { console.error(`  ❌ ${l.lang}/${l.slug}: ${upErr.message}`); fail++; }
    else ok++;
  }
  console.log(`\nDone. ${ok} dépubliés, ${fail} échecs. Collez ${outPath} dans public/_redirects puis redéployez.\n`);
}

main();
