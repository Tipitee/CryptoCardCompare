#!/usr/bin/env node
/**
 * insert-applepay-articles.mjs
 * Money page cas d'usage "carte crypto compatible Apple Pay / Google Pay" en
 * FR, EN/UK, DE, ES, IT, PT. Cas d'usage sans thématique existante → pas de doublon.
 * BROUILLON par défaut ; --publish pour publier.
 *   set -a && source .env && set +a
 *   node scripts/insert-applepay-articles.mjs --dry-run | --publish
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
const TOPIC = 'carte-crypto-apple-google-pay-2026';

const rows = [
  { slug: 'carte-crypto-apple-pay-google-pay-2026', lang: 'fr',
    title: 'Meilleure carte crypto compatible Apple Pay et Google Pay en 2026',
    meta_title: 'Carte crypto Apple Pay / Google Pay 2026 | TopCryptoCards',
    meta_description: 'Quelles cartes crypto sont compatibles Apple Pay et Google Pay ? Crypto.com, Nexo, Bybit, Bitpanda, Gnosis Pay, MetaMask : liste, activation et conseils. Guide 2026.',
    excerpt: 'La plupart des grandes cartes crypto supportent Apple Pay et Google Pay. Liste des compatibles, activation et points d\'attention.',
    content: read('carte-crypto-apple-pay-google-pay-2026-fr.md') },
  { slug: 'crypto-card-apple-pay-google-pay-2026', lang: 'en',
    title: 'Best crypto card compatible with Apple Pay and Google Pay in 2026',
    meta_title: 'Crypto Card Apple Pay / Google Pay 2026 | TopCryptoCards',
    meta_description: 'Which crypto cards work with Apple Pay and Google Pay? Crypto.com, Nexo, Bybit, Bitpanda, Gnosis Pay, MetaMask: list, setup and tips. 2026 guide.',
    excerpt: 'Most major crypto cards support Apple Pay and Google Pay. The compatible list, how to set it up and what to watch.',
    content: read('crypto-card-apple-pay-google-pay-2026-en.md') },
  { slug: 'krypto-karte-apple-pay-google-pay-2026', lang: 'de',
    title: 'Beste Krypto-Karte mit Apple Pay und Google Pay 2026',
    meta_title: 'Krypto-Karte Apple Pay / Google Pay 2026 | TopCryptoCards',
    meta_description: 'Welche Krypto-Karten funktionieren mit Apple Pay und Google Pay? Crypto.com, Nexo, Bybit, Bitpanda, Gnosis Pay, MetaMask: Liste, Einrichtung und Tipps. Guide 2026.',
    excerpt: 'Die meisten großen Krypto-Karten unterstützen Apple Pay und Google Pay. Die kompatible Liste, Einrichtung und worauf zu achten ist.',
    content: read('krypto-karte-apple-pay-google-pay-2026-de.md') },
  { slug: 'tarjeta-cripto-apple-pay-google-pay-2026', lang: 'es',
    title: 'Mejor tarjeta cripto compatible con Apple Pay y Google Pay en 2026',
    meta_title: 'Tarjeta cripto Apple Pay / Google Pay 2026 | TopCryptoCards',
    meta_description: '¿Qué tarjetas cripto son compatibles con Apple Pay y Google Pay? Crypto.com, Nexo, Bybit, Bitpanda, Gnosis Pay, MetaMask: lista, activación y consejos. Guía 2026.',
    excerpt: 'La mayoría de las grandes tarjetas cripto soportan Apple Pay y Google Pay. La lista de compatibles, cómo activarlo y qué vigilar.',
    content: read('tarjeta-cripto-apple-pay-google-pay-2026-es.md') },
  { slug: 'carta-cripto-apple-pay-google-pay-2026', lang: 'it',
    title: 'Migliore carta crypto compatibile con Apple Pay e Google Pay nel 2026',
    meta_title: 'Carta crypto Apple Pay / Google Pay 2026 | TopCryptoCards',
    meta_description: 'Quali carte crypto sono compatibili con Apple Pay e Google Pay? Crypto.com, Nexo, Bybit, Bitpanda, Gnosis Pay, MetaMask: elenco, attivazione e consigli. Guida 2026.',
    excerpt: 'La maggior parte delle grandi carte crypto supporta Apple Pay e Google Pay. L\'elenco delle compatibili, come attivarlo e cosa controllare.',
    content: read('carta-cripto-apple-pay-google-pay-2026-it.md') },
  { slug: 'cartao-crypto-apple-pay-google-pay-2026', lang: 'pt',
    title: 'Melhor cartão crypto compatível com Apple Pay e Google Pay em 2026',
    meta_title: 'Cartão crypto Apple Pay / Google Pay 2026 | TopCryptoCards',
    meta_description: 'Que cartões crypto são compatíveis com Apple Pay e Google Pay? Crypto.com, Nexo, Bybit, Bitpanda, Gnosis Pay, MetaMask: lista, ativação e dicas. Guia 2026.',
    excerpt: 'A maioria dos grandes cartões crypto suporta Apple Pay e Google Pay. A lista de compatíveis, como ativar e o que verificar.',
    content: read('cartao-crypto-apple-pay-google-pay-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nApple/Google Pay money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
