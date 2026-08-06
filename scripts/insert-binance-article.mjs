#!/usr/bin/env node
/**
 * Insère l'article FR "Carte Binance en 2026 (arrêt Europe + alternatives)".
 * Retire le brief (commentaire HTML), lang=fr, published, date du jour, topic_key.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-binance-article.mjs             # DRY-RUN
 *   node scripts/insert-binance-article.mjs --confirm   # insère
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');

const SLUG = 'carte-binance-europe-arret-alternatives';
const LANG = 'fr';

const raw = readFileSync('seo/content-drafts/carte-binance-2026-fr.md', 'utf8');
const content = raw.replace(/^﻿?\s*<!--[\s\S]*?-->\s*/, '').trim();

const post = {
  lang: LANG,
  slug: SLUG,
  title: "Carte Binance en 2026 : pourquoi elle n'existe plus en Europe (et par quoi la remplacer)",
  excerpt: "La carte Binance (Binance Visa Card) n'est plus disponible dans l'Espace économique européen depuis le 20 décembre 2023. Voici pourquoi, et les meilleures cartes crypto pour la remplacer en 2026.",
  meta_title: 'Carte Binance 2026 : arrêtée en Europe, alternatives',
  meta_description: "La carte Binance n'existe plus dans l'EEE depuis déc. 2023. Pourquoi, et par quelles cartes crypto la remplacer en 2026. Vérifié août 2026.",
  content,
  topic_key: 'blog-carte-binance-arret-europe-2026',
  category: 'guide',
  tags: ['carte binance', 'binance', 'alternatives', 'cashback', 'europe'],
  published: true,
  created_at: new Date().toISOString(),
};

const { data: existing } = await sb.from('blog_posts')
  .select('id, slug, published').eq('lang', LANG).eq('slug', SLUG).maybeSingle();

console.log(`\n=== ${CONFIRM ? 'INSERTION' : 'DRY-RUN'} ===`);
console.log(`lang       : ${post.lang}`);
console.log(`slug       : ${post.slug}`);
console.log(`title      : ${post.title}`);
console.log(`meta_title : ${post.meta_title} (${post.meta_title.length} car.)`);
console.log(`meta_desc  : ${post.meta_description.length} car.`);
console.log(`content    : ${content.split(/\s+/).length} mots, brief retiré: ${!content.includes('BRIEF (')}`);
console.log(`topic_key  : ${post.topic_key}`);

if (existing) console.log(`\n⚠️  Article déjà présent (${existing.id}) → UPDATE au lieu d'un doublon.`);

if (!CONFIRM) { console.log(`\nDRY-RUN terminé. Pour insérer : node scripts/insert-binance-article.mjs --confirm`); process.exit(0); }

let error;
if (existing) ({ error } = await sb.from('blog_posts').update(post).eq('id', existing.id));
else ({ error } = await sb.from('blog_posts').insert(post));
if (error) { console.error(`\n✗ ${error.message}`); process.exit(1); }
console.log(`\n✓ Article ${existing ? 'mis à jour' : 'inséré'} et publié (date du jour).`);
console.log(`Ensuite :`);
console.log(`  node scripts/generate-missing-heroes.mjs --confirm   # hero image`);
console.log(`  node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: article FR carte Binance arret Europe" && git push`);
