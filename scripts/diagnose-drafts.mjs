#!/usr/bin/env node
/**
 * Pourquoi ces posts sont-ils en brouillon ?
 * Groupe chaque brouillon par topic_key et montre l'état (publié/brouillon) de
 * TOUTES ses variantes de langue. Répond à : « localisation oubliée » vs « jamais finalisé ».
 *
 *   set -a && source .env && set +a
 *   node scripts/diagnose-drafts.mjs
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, topic_key, published, created_at')
  .order('created_at', { ascending: true });
if (error) { console.error('✗', error.message); process.exit(1); }

const drafts = data.filter(p => !p.published);
const pub = data.filter(p => p.published);

// Vue d'ensemble
console.log(`\n=== VUE D'ENSEMBLE ===`);
console.log(`${data.length} posts · ${pub.length} publiés · ${drafts.length} brouillons`);

const by = (arr, key) => arr.reduce((m, p) => ((m[p[key] ?? '∅'] = (m[p[key] ?? '∅'] || 0) + 1), m), {});
console.log(`\nBrouillons par langue :`, by(drafts, 'lang'));
console.log(`Publiés par langue   :`, by(pub, 'lang'));

// Combien de brouillons ont un topic_key ?
const draftsNoTK = drafts.filter(p => !p.topic_key);
console.log(`\nBrouillons SANS topic_key : ${draftsNoTK.length} (impossible de lier aux autres langues)`);

// Index topic_key -> variantes
const groups = {};
for (const p of data) {
  if (!p.topic_key) continue;
  (groups[p.topic_key] ??= []).push(p);
}

// Pour chaque topic_key qui contient au moins un brouillon, montrer l'état par langue
const draftTopics = [...new Set(drafts.filter(p => p.topic_key).map(p => p.topic_key))];

let localisationOubliee = 0;   // le sujet est publié dans ≥1 langue MAIS ce brouillon ne l'est pas
let jamaisPublie = 0;          // aucune langue du sujet n'est publiée

console.log(`\n=== ${draftTopics.length} SUJETS (topic_key) AVEC AU MOINS UN BROUILLON ===`);
for (const tk of draftTopics) {
  const g = groups[tk];
  const langs = g.map(p => `${p.lang}${p.published ? '✅' : '📝'}`).join(' ');
  const anyPub = g.some(p => p.published);
  if (anyPub) localisationOubliee++; else jamaisPublie++;
  console.log(`\n[${anyPub ? 'LOCALISATION OUBLIÉE' : 'JAMAIS PUBLIÉ (aucune langue)'}] ${tk}`);
  console.log(`   ${langs}   (✅=publié 📝=brouillon)`);
  console.log(`   ex: ${g[0].slug}`);
}

console.log(`\n=== VERDICT ===`);
console.log(`Sujets où d'autres langues SONT publiées mais ce(s) brouillon(s) non : ${localisationOubliee}`);
console.log(`Sujets entièrement en brouillon (aucune langue publiée)            : ${jamaisPublie}`);
console.log(`Brouillons sans topic_key (orphelins)                             : ${draftsNoTK.length}`);
if (draftsNoTK.length) {
  console.log(`\nOrphelins (extrait) :`);
  draftsNoTK.slice(0, 15).forEach(p => console.log(`   [${p.lang}] ${p.slug}`));
}
