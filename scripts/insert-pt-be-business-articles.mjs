#!/usr/bin/env node
/**
 * insert-pt-be-business-articles.mjs
 * Complète la série "carte crypto entreprise/freelance" sur les marchés manquants :
 *  - PT (langue propre, pt)
 *  - BE (fiscalité société belge ; stocké lang='fr', ciblé Belgique → indexé sous /fr)
 * BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-pt-be-business-articles.mjs --dry-run
 *   node scripts/insert-pt-be-business-articles.mjs --publish
 *
 * Requires: SUPABASE_URL (ou VITE_SUPABASE_URL) + SUPABASE_SERVICE_KEY (ou SERVICE_ROLE_KEY).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SB_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB_URL || !SB_KEY) { console.error('Missing env: SUPABASE url + service key'); process.exit(1); }

const DRY = process.argv.includes('--dry-run');
const PUBLISH = process.argv.includes('--publish');
const supabase = createClient(SB_URL, SB_KEY);
const read = (f) => fs.readFileSync(path.join(ROOT, 'seo', 'content-drafts', f), 'utf-8').trim();
const TOPIC = 'carte-crypto-entreprise-freelance-2026';

const rows = [
  {
    slug: 'cartao-crypto-empresa-freelancer-2026', lang: 'pt',
    title: 'Cartão crypto para empresas e freelancers em 2026: que opções para uso profissional?',
    meta_title: 'Cartão crypto empresa e freelancer 2026 | TopCryptoCards',
    meta_description: 'Cartões crypto para empresa e freelancer em 2026: Wirex Business para sociedades, cartões regulados + stablecoins para independentes. IRC, Categoria B, IVA, DAC8.',
    excerpt: 'Poucos cartões "de empresa" reais: Wirex Business para sociedades, cartão regulado + stablecoins para freelancers. Com o enquadramento fiscal português (IRC, Categoria B, IVA, DAC8).',
    content: read('cartao-crypto-empresa-freelancer-2026-pt.md'),
  },
  {
    slug: 'carte-crypto-entreprise-belgique-2026', lang: 'fr',
    title: 'Carte crypto pour entreprise et indépendant en Belgique en 2026 : quelles options ?',
    meta_title: 'Carte crypto entreprise Belgique 2026 | TopCryptoCards',
    meta_description: 'Carte crypto entreprise et indépendant en Belgique 2026 : Wirex Business pour les sociétés, cartes régulées + stablecoins pour les indépendants. ISoc, taxe 10 %, TVA, DAC8, FSMA.',
    excerpt: 'Peu de vraies cartes "société" : Wirex Business pour les sociétés, carte régulée + stablecoins pour les indépendants. Avec le cadre fiscal belge (ISoc, taxe 10 % 2026, TVA, DAC8).',
    content: read('carte-crypto-entreprise-belgique-2026-fr.md'),
  },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nPT + BE business/freelance -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
