#!/usr/bin/env node
/**
 * Génère les hero images manquantes via l'edge function generate-hero-image.
 * Dédupe par topic_key (l'edge function propage l'image à toutes les langues du sujet),
 * donc 1 appel par sujet suffit.
 *
 *   set -a && source .env && set +a
 *   node scripts/generate-missing-heroes.mjs             # DRY-RUN (liste ce qui serait généré)
 *   node scripts/generate-missing-heroes.mjs --confirm   # génère pour de vrai
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const ADMIN = process.env.ADMIN_SECRET || process.env.VITE_ADMIN_SECRET;
const SERVICE = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
// Pour la passerelle des Edge Functions, on utilise la clé SERVICE (valide, serveur)
// plutôt que la clé anon locale qui peut être périmée après rotation.
const GATEWAY = SERVICE || process.env.VITE_SUPABASE_ANON_KEY;
const CONFIRM = process.argv.includes('--confirm');

if (!ADMIN) { console.error('✗ ADMIN_SECRET manquant dans .env (nécessaire pour l\'edge function).'); process.exit(1); }
if (!GATEWAY) { console.error('✗ Aucune clé Supabase (SERVICE_ROLE) pour la passerelle.'); process.exit(1); }
const sb = createClient(URL, SERVICE);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { data, error } = await sb.from('blog_posts')
  .select('id, lang, slug, title, excerpt, tags, topic_key, image_hero, published')
  .eq('published', true);
if (error) { console.error('✗', error.message); process.exit(1); }

const missing = data.filter(p => !p.image_hero || /og-default/.test(p.image_hero));

// Dédup par topic_key ; on choisit un représentant (FR de préférence).
const repByTopic = new Map();
const orphans = [];
for (const p of missing) {
  if (!p.topic_key) { orphans.push(p); continue; }
  const cur = repByTopic.get(p.topic_key);
  if (!cur || (p.lang === 'fr' && cur.lang !== 'fr')) repByTopic.set(p.topic_key, p);
}
const targets = [...repByTopic.values(), ...orphans];

console.log(`\n${missing.length} posts publiés sans hero → ${targets.length} sujets uniques à générer.`);
targets.forEach(p => console.log(`   [${p.lang}] ${p.topic_key ?? '(orphelin)'} — ${p.slug}`));

if (!CONFIRM) { console.log(`\nDRY-RUN. Pour générer : node scripts/generate-missing-heroes.mjs --confirm`); process.exit(0); }

let ok = 0, ko = 0;
for (const p of targets) {
  try {
    const res = await fetch(`${URL}/functions/v1/generate-hero-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${GATEWAY}`, apikey: GATEWAY, 'Content-Type': 'application/json', 'X-Admin-Secret': ADMIN },
      body: JSON.stringify({ id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, tags: p.tags, forceRegenerate: true }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j.imageUrl) { console.log(`   ✗ ${p.slug}: ${j.error ?? res.status}`); ko++; }
    else { console.log(`   ✓ ${p.topic_key ?? p.slug} → ${j.imageUrl}`); ok++; }
  } catch (e) {
    console.log(`   ✗ ${p.slug}: ${String(e)}`); ko++;
  }
  await sleep(2000); // ménage l'API Together AI
}
console.log(`\n✓ ${ok} générées · ✗ ${ko} échecs. (Chaque image est propagée aux variantes de langue du sujet.)`);
