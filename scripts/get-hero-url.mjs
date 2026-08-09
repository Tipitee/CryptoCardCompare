#!/usr/bin/env node
/**
 * Affiche l'URL de la hero image d'un article.
 *   set -a && source .env && set +a
 *   node scripts/get-hero-url.mjs <slug> [lang=fr]
 */
import { createClient } from '@supabase/supabase-js';
const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const slug = process.argv[2];
const lang = process.argv[3] || 'fr';
if (!slug) { console.error('Usage: node scripts/get-hero-url.mjs <slug> [lang]'); process.exit(1); }
const { data, error } = await sb.from('blog_posts')
  .select('slug, lang, image_hero').eq('slug', slug).eq('lang', lang).maybeSingle();
if (error) { console.error('✗', error.message); process.exit(1); }
if (!data) { console.log('(article introuvable pour ce slug/lang)'); process.exit(0); }
console.log(data.image_hero || '(aucune image hero — lance: node scripts/generate-missing-heroes.mjs --confirm)');
