#!/usr/bin/env node
/**
 * insert-stablecoins-articles.mjs
 * Money page cas d'usage "meilleure carte crypto pour dépenser des stablecoins (USDC/EURe)"
 * en FR, EN/UK, DE, ES, IT, PT. Cas d'usage sans thématique existante → pas de doublon.
 * BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-stablecoins-articles.mjs --dry-run
 *   node scripts/insert-stablecoins-articles.mjs --publish
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
const TOPIC = 'meilleure-carte-stablecoins-2026';

const rows = [
  { slug: 'meilleure-carte-crypto-stablecoins-2026', lang: 'fr',
    title: 'Meilleure carte crypto pour dépenser des stablecoins (USDC, EURe) en 2026',
    meta_title: 'Meilleure carte crypto stablecoins (USDC/EURe) 2026 | TopCryptoCards',
    meta_description: 'Quelle carte pour dépenser des stablecoins (USDC, USDT, EURe) ? Gnosis Pay, MetaMask, Nexo comparées : euro natif, self-custody, fiscalité minimale. Guide 2026.',
    excerpt: 'Dépenser des stablecoins évite la volatilité et minimise l\'impôt. Gnosis Pay (EURe natif), MetaMask, Nexo : notre guide par usage.',
    content: read('meilleure-carte-crypto-stablecoins-2026-fr.md') },
  { slug: 'best-crypto-card-stablecoins-2026', lang: 'en',
    title: 'Best crypto card for spending stablecoins (USDC, EURe) in 2026',
    meta_title: 'Best Crypto Card for Stablecoins (USDC/EURe) 2026 | TopCryptoCards',
    meta_description: 'Which card to spend stablecoins (USDC, USDT, EURe)? Gnosis Pay, MetaMask, Nexo compared: native euro, self-custody, minimal tax. 2026 guide.',
    excerpt: 'Spending stablecoins avoids volatility and minimises tax. Gnosis Pay (native EURe), MetaMask, Nexo: our use-case guide.',
    content: read('best-crypto-card-stablecoins-2026-en.md') },
  { slug: 'beste-krypto-karte-stablecoins-2026', lang: 'de',
    title: 'Beste Krypto-Karte für Stablecoins (USDC, EURe) 2026',
    meta_title: 'Beste Krypto-Karte Stablecoins (USDC/EURe) 2026 | TopCryptoCards',
    meta_description: 'Welche Karte für Stablecoin-Ausgaben (USDC, USDT, EURe)? Gnosis Pay, MetaMask, Nexo im Vergleich: natives Euro, Selbstverwahrung, minimale Steuer. Guide 2026.',
    excerpt: 'Stablecoins auszugeben vermeidet Volatilität und minimiert die Steuer. Gnosis Pay (natives EURe), MetaMask, Nexo: unser Anwendungs-Guide.',
    content: read('beste-krypto-karte-stablecoins-2026-de.md') },
  { slug: 'mejor-tarjeta-cripto-stablecoins-2026', lang: 'es',
    title: 'Mejor tarjeta cripto para gastar stablecoins (USDC, EURe) en 2026',
    meta_title: 'Mejor tarjeta cripto stablecoins (USDC/EURe) 2026 | TopCryptoCards',
    meta_description: '¿Qué tarjeta para gastar stablecoins (USDC, USDT, EURe)? Gnosis Pay, MetaMask, Nexo comparadas: euro nativo, autocustodia, impuesto mínimo. Guía 2026.',
    excerpt: 'Gastar stablecoins evita la volatilidad y minimiza el impuesto. Gnosis Pay (EURe nativo), MetaMask, Nexo: nuestra guía por uso.',
    content: read('mejor-tarjeta-cripto-stablecoins-2026-es.md') },
  { slug: 'migliore-carta-cripto-stablecoin-2026', lang: 'it',
    title: 'Migliore carta crypto per spendere stablecoin (USDC, EURe) nel 2026',
    meta_title: 'Migliore carta crypto stablecoin (USDC/EURe) 2026 | TopCryptoCards',
    meta_description: 'Quale carta per spendere stablecoin (USDC, USDT, EURe)? Gnosis Pay, MetaMask, Nexo a confronto: euro nativo, autocustodia, imposta minima. Guida 2026.',
    excerpt: 'Spendere stablecoin evita la volatilità e minimizza l\'imposta. Gnosis Pay (EURe nativo), MetaMask, Nexo: la nostra guida per uso.',
    content: read('migliore-carta-cripto-stablecoin-2026-it.md') },
  { slug: 'melhor-cartao-crypto-stablecoins-2026', lang: 'pt',
    title: 'Melhor cartão crypto para gastar stablecoins (USDC, EURe) em 2026',
    meta_title: 'Melhor cartão crypto stablecoins (USDC/EURe) 2026 | TopCryptoCards',
    meta_description: 'Que cartão para gastar stablecoins (USDC, USDT, EURe)? Gnosis Pay, MetaMask, Nexo comparados: euro nativo, auto-custódia, imposto mínimo. Guia 2026.',
    excerpt: 'Gastar stablecoins evita a volatilidade e minimiza o imposto. Gnosis Pay (EURe nativo), MetaMask, Nexo: o nosso guia por uso.',
    content: read('melhor-cartao-crypto-stablecoins-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nStablecoins money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
