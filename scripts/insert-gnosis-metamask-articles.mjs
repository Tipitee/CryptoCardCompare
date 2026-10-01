#!/usr/bin/env node
/**
 * insert-gnosis-metamask-articles.mjs
 * Publie le comparatif fort intent self-custody "Gnosis Pay vs MetaMask" en
 * FR, EN/UK, DE, ES, IT, PT. Slugs localisés, mêmes faits, liens internes par marché
 * (PT sans lien compare : pas de pages compare en pt ; liens vers fiches cartes).
 * topic_key commun. BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-gnosis-metamask-articles.mjs --dry-run
 *   node scripts/insert-gnosis-metamask-articles.mjs --publish
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
const TOPIC = 'gnosis-pay-vs-metamask-choix-2026';

const rows = [
  {
    slug: 'gnosis-pay-ou-metamask-quelle-carte-choisir', lang: 'fr',
    title: 'Gnosis Pay ou MetaMask : quelle carte self-custody choisir en 2026 ?',
    meta_title: 'Gnosis Pay ou MetaMask : quelle carte choisir ? | TopCryptoCards',
    meta_description: 'Gnosis Pay ou MetaMask Card ? Deux cartes self-custody comparées : cashback, réseau, stablecoin euro, mise en route. Notre comparatif honnête et chiffré pour 2026.',
    excerpt: 'Deux cartes self-custody : MetaMask est la plus simple, Gnosis Pay offre l\'euro natif et jusqu\'à 5 %. Comparatif chiffré pour choisir selon ton wallet.',
    content: read('gnosis-pay-ou-metamask-quelle-carte-choisir-fr.md'),
  },
  {
    slug: 'gnosis-pay-vs-metamask-which-card', lang: 'en',
    title: 'Gnosis Pay vs MetaMask: which self-custody card to choose in 2026?',
    meta_title: 'Gnosis Pay vs MetaMask: Which Card to Choose? | TopCryptoCards',
    meta_description: 'Gnosis Pay or MetaMask Card? Two self-custody cards compared: cashback, network, euro stablecoin, setup. Our honest, numbers-first comparison for 2026.',
    excerpt: 'Two self-custody cards: MetaMask is simplest, Gnosis Pay offers native euro and up to 5%. A numbers-first comparison to choose by wallet.',
    content: read('gnosis-pay-vs-metamask-which-card-en.md'),
  },
  {
    slug: 'gnosis-pay-oder-metamask-welche-karte', lang: 'de',
    title: 'Gnosis Pay oder MetaMask: Welche Self-Custody-Karte 2026 wählen?',
    meta_title: 'Gnosis Pay oder MetaMask: Welche Karte wählen? | TopCryptoCards',
    meta_description: 'Gnosis Pay oder MetaMask Card? Zwei Self-Custody-Karten im Vergleich: Cashback, Netzwerk, Euro-Stablecoin, Einrichtung. Unser ehrlicher Vergleich mit Zahlen für 2026.',
    excerpt: 'Zwei Self-Custody-Karten: MetaMask am einfachsten, Gnosis Pay mit nativem Euro und bis 5 %. Ein Vergleich mit Zahlen, je nach Wallet.',
    content: read('gnosis-pay-oder-metamask-welche-karte-de.md'),
  },
  {
    slug: 'gnosis-pay-o-metamask-que-tarjeta-elegir', lang: 'es',
    title: 'Gnosis Pay o MetaMask: ¿qué tarjeta self-custody elegir en 2026?',
    meta_title: 'Gnosis Pay o MetaMask: ¿Qué tarjeta elegir? | TopCryptoCards',
    meta_description: '¿Gnosis Pay o MetaMask Card? Dos tarjetas self-custody comparadas: cashback, red, stablecoin en euro, configuración. Nuestra comparación honesta y con cifras para 2026.',
    excerpt: 'Dos tarjetas self-custody: MetaMask es la más simple, Gnosis Pay ofrece euro nativo y hasta 5%. Comparación con cifras para elegir según tu wallet.',
    content: read('gnosis-pay-o-metamask-que-tarjeta-elegir-es.md'),
  },
  {
    slug: 'gnosis-pay-o-metamask-quale-carta-scegliere', lang: 'it',
    title: 'Gnosis Pay o MetaMask: quale carta self-custody scegliere nel 2026?',
    meta_title: 'Gnosis Pay o MetaMask: Quale carta scegliere? | TopCryptoCards',
    meta_description: 'Gnosis Pay o MetaMask Card? Due carte self-custody a confronto: cashback, circuito, stablecoin in euro, configurazione. Il nostro confronto onesto e con i numeri per il 2026.',
    excerpt: 'Due carte self-custody: MetaMask è la più semplice, Gnosis Pay offre euro nativo e fino al 5%. Un confronto con i numeri per scegliere in base al wallet.',
    content: read('gnosis-pay-o-metamask-quale-carta-scegliere-it.md'),
  },
  {
    slug: 'gnosis-pay-ou-metamask-que-cartao-escolher', lang: 'pt',
    title: 'Gnosis Pay ou MetaMask: que cartão self-custody escolher em 2026?',
    meta_title: 'Gnosis Pay ou MetaMask: Que cartão escolher? | TopCryptoCards',
    meta_description: 'Gnosis Pay ou MetaMask Card? Dois cartões self-custody comparados: cashback, rede, stablecoin em euro, configuração. A nossa comparação honesta e com números para 2026.',
    excerpt: 'Dois cartões self-custody: o MetaMask é o mais simples, o Gnosis Pay oferece euro nativo e até 5%. Uma comparação com números para escolher conforme a wallet.',
    content: read('gnosis-pay-ou-metamask-que-cartao-escolher-pt.md'),
  },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nGnosis Pay vs MetaMask (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
