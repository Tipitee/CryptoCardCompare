#!/usr/bin/env node
/**
 * Insère l'article ES "Tarjeta Bitcoin en España 2026" dans blog_posts.
 * Retire le brief (commentaire HTML), pose lang=es, published, date du jour, topic_key.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-es-article.mjs             # DRY-RUN (montre, n'écrit rien)
 *   node scripts/insert-es-article.mjs --confirm   # insère
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');

const SLUG = 'tarjeta-bitcoin-espana-2026';
const LANG = 'es';

// Contenu : on lit le draft et on retire le brief (commentaire HTML en tête).
const raw = readFileSync('seo/content-drafts/tarjeta-bitcoin-espana-2026-es.md', 'utf8');
const content = raw.replace(/^﻿?\s*<!--[\s\S]*?-->\s*/, '').trim();

const post = {
  lang: LANG,
  slug: SLUG,
  title: 'Tarjeta Bitcoin en España 2026: cuál elegir (y cómo tributa)',
  excerpt: '¿Qué tarjeta usar para gastar bitcoin en España en 2026? Comparativa de las tarjetas cripto disponibles, opciones gratis, cashback y cómo tributan en el IRPF.',
  meta_title: 'Tarjeta Bitcoin en España 2026: cuál elegir',
  meta_description: '¿Qué tarjeta para gastar bitcoin en España en 2026? Comparativa, cashback, tarjetas gratis y cómo tributan en el IRPF. Verificado agosto 2026.',
  content,
  topic_key: 'blog-tarjeta-bitcoin-espana-2026',
  category: 'guide',
  tags: ['tarjeta bitcoin', 'españa', 'cashback', 'tarjeta cripto', 'fiscalidad'],
  published: true,
  created_at: new Date().toISOString(),
};

// Anti-doublon
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
console.log(`tags       : ${post.tags.join(', ')}`);

if (existing) {
  console.log(`\n⚠️  Un article existe déjà avec ce slug (${existing.id}, published=${existing.published}).`);
  console.log(`   → En --confirm je fais un UPDATE de cet article au lieu d'un doublon.`);
}

if (!CONFIRM) {
  console.log(`\nDRY-RUN terminé. Pour insérer : node scripts/insert-es-article.mjs --confirm`);
  process.exit(0);
}

let error;
if (existing) {
  ({ error } = await sb.from('blog_posts').update(post).eq('id', existing.id));
} else {
  ({ error } = await sb.from('blog_posts').insert(post));
}
if (error) { console.error(`\n✗ ${error.message}`); process.exit(1); }
console.log(`\n✓ Article ${existing ? 'mis à jour' : 'inséré'} et publié (date du jour).`);
console.log(`Ensuite :`);
console.log(`  node scripts/generate-missing-heroes.mjs --confirm   # genere la hero image`);
console.log(`  node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: article ES tarjeta bitcoin espana" && git push   # prerender + indexation`);
