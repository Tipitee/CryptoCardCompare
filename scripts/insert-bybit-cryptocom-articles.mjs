#!/usr/bin/env node
/**
 * insert-bybit-cryptocom-articles.mjs
 * Publie le comparatif fort intent "Bybit vs Crypto.com" en EN/UK, DE, ES, IT, PT.
 * (Bybit n'est PAS dispo en FR/BE → pas de version fr.) Slugs localisés, mêmes faits,
 * liens internes par marché (PT sans lien compare : pas de pages compare en pt).
 * topic_key commun. BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-bybit-cryptocom-articles.mjs --dry-run
 *   node scripts/insert-bybit-cryptocom-articles.mjs --publish
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
const TOPIC = 'bybit-vs-crypto-com-choix-2026';

const rows = [
  {
    slug: 'bybit-vs-crypto-com-which-card', lang: 'en',
    title: 'Bybit vs Crypto.com: which card to choose in 2026?',
    meta_title: 'Bybit vs Crypto.com: Which Card to Choose? | TopCryptoCards',
    meta_description: 'Bybit or Crypto.com? Up to 10% with no staking vs up to 5% requiring CRO staking: our honest, numbers-first comparison to pick the right crypto card in 2026.',
    excerpt: 'Bybit pays 2–10% with no staking; Crypto.com needs CRO locked for its top rate. A numbers-first comparison to choose by profile.',
    content: read('bybit-vs-crypto-com-which-card-en.md'),
  },
  {
    slug: 'bybit-oder-crypto-com-welche-karte', lang: 'de',
    title: 'Bybit oder Crypto.com: Welche Karte 2026 wählen?',
    meta_title: 'Bybit oder Crypto.com: Welche Karte wählen? | TopCryptoCards',
    meta_description: 'Bybit oder Crypto.com? Bis zu 10 % ohne Staking vs bis zu 5 % mit CRO-Staking: unser ehrlicher Vergleich mit Zahlen für die richtige Krypto-Karte 2026.',
    excerpt: 'Bybit zahlt 2–10 % ohne Staking; Crypto.com braucht gesperrtes CRO für die Spitzenrate. Ein Vergleich mit Zahlen, je nach Profil.',
    content: read('bybit-oder-crypto-com-welche-karte-de.md'),
  },
  {
    slug: 'bybit-o-crypto-com-que-tarjeta-elegir', lang: 'es',
    title: 'Bybit o Crypto.com: ¿qué tarjeta elegir en 2026?',
    meta_title: 'Bybit o Crypto.com: ¿Qué tarjeta elegir? | TopCryptoCards',
    meta_description: '¿Bybit o Crypto.com? Hasta 10 % sin staking vs hasta 5 % con staking de CRO: nuestra comparación honesta y con cifras para elegir la tarjeta cripto en 2026.',
    excerpt: 'Bybit paga 2–10 % sin staking; Crypto.com exige bloquear CRO para su tasa máxima. Comparación con cifras para elegir según tu perfil.',
    content: read('bybit-o-crypto-com-que-tarjeta-elegir-es.md'),
  },
  {
    slug: 'bybit-o-crypto-com-quale-carta-scegliere', lang: 'it',
    title: 'Bybit o Crypto.com: quale carta scegliere nel 2026?',
    meta_title: 'Bybit o Crypto.com: Quale carta scegliere? | TopCryptoCards',
    meta_description: 'Bybit o Crypto.com? Fino al 10 % senza staking vs fino al 5 % con staking di CRO: il nostro confronto onesto e con i numeri per scegliere nel 2026.',
    excerpt: 'Bybit paga 2–10 % senza staking; Crypto.com richiede CRO bloccati per il tasso massimo. Un confronto con i numeri per scegliere in base al profilo.',
    content: read('bybit-o-crypto-com-quale-carta-scegliere-it.md'),
  },
  {
    slug: 'bybit-ou-crypto-com-que-cartao-escolher', lang: 'pt',
    title: 'Bybit ou Crypto.com: que cartão escolher em 2026?',
    meta_title: 'Bybit ou Crypto.com: Que cartão escolher? | TopCryptoCards',
    meta_description: 'Bybit ou Crypto.com? Até 10 % sem staking vs até 5 % com staking de CRO: a nossa comparação honesta e com números para escolher o cartão crypto em 2026.',
    excerpt: 'O Bybit paga 2–10 % sem staking; o Crypto.com exige CRO bloqueado para a taxa máxima. Uma comparação com números para escolher conforme o perfil.',
    content: read('bybit-ou-crypto-com-que-cartao-escolher-pt.md'),
  },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nBybit vs Crypto.com (en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
