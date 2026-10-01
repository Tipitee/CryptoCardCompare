#!/usr/bin/env node
/**
 * insert-retrait-dab-articles.mjs
 * Money page cas d'usage "meilleure carte crypto pour retirer du cash (DAB/ATM)" en
 * FR, EN/UK, DE, ES, IT, PT. Cas d'usage sans thématique existante → pas de doublon.
 * BROUILLON par défaut ; --publish pour publier.
 *   set -a && source .env && set +a
 *   node scripts/insert-retrait-dab-articles.mjs --dry-run | --publish
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
const TOPIC = 'meilleure-carte-retrait-dab-2026';

const rows = [
  { slug: 'meilleure-carte-crypto-retrait-dab-2026', lang: 'fr',
    title: 'Meilleure carte crypto pour retirer du cash au distributeur (DAB) en 2026',
    meta_title: 'Carte crypto retrait DAB : frais & plafonds 2026 | TopCryptoCards',
    meta_description: 'Quelle carte crypto pour retirer du cash au DAB ? Franchise gratuite mensuelle, frais au-delà, fiscalité : Nexo, Crypto.com, Revolut comparées. Guide 2026.',
    excerpt: 'Pour retirer du cash : regarde la franchise gratuite mensuelle et les frais au-delà, pas le cashback. Nexo, Crypto.com, Revolut comparées.',
    content: read('meilleure-carte-crypto-retrait-dab-2026-fr.md') },
  { slug: 'best-crypto-card-atm-withdrawals-2026', lang: 'en',
    title: 'Best crypto card for ATM cash withdrawals in 2026',
    meta_title: 'Crypto Card ATM Withdrawals: Fees & Caps 2026 | TopCryptoCards',
    meta_description: 'Which crypto card for ATM cash withdrawals? Free monthly allowance, fee above, tax: Nexo, Crypto.com, Revolut compared. 2026 guide.',
    excerpt: 'For cash withdrawals: look at the free monthly allowance and the fee above, not cashback. Nexo, Crypto.com, Revolut compared.',
    content: read('best-crypto-card-atm-withdrawals-2026-en.md') },
  { slug: 'beste-krypto-karte-geldautomat-abhebung-2026', lang: 'de',
    title: 'Beste Krypto-Karte für Geldautomaten-Abhebungen 2026',
    meta_title: 'Krypto-Karte Geldautomat: Gebühren & Limits 2026 | TopCryptoCards',
    meta_description: 'Welche Krypto-Karte für Geldautomaten-Abhebungen? Kostenloser Monatsfreibetrag, Gebühr darüber, Steuer: Nexo, Crypto.com, Revolut im Vergleich. Guide 2026.',
    excerpt: 'Für Bargeldabhebungen: achte auf den kostenlosen Monatsfreibetrag und die Gebühr darüber, nicht auf Cashback. Nexo, Crypto.com, Revolut im Vergleich.',
    content: read('beste-krypto-karte-geldautomat-abhebung-2026-de.md') },
  { slug: 'mejor-tarjeta-cripto-retirar-cajero-2026', lang: 'es',
    title: 'Mejor tarjeta cripto para retirar efectivo en cajero en 2026',
    meta_title: 'Tarjeta cripto retirar cajero: comisiones & límites 2026 | TopCryptoCards',
    meta_description: '¿Qué tarjeta cripto para retirar efectivo en cajero? Franquicia gratuita mensual, comisión por encima, fiscalidad: Nexo, Crypto.com, Revolut comparadas. Guía 2026.',
    excerpt: 'Para retirar efectivo: mira la franquicia gratuita mensual y la comisión por encima, no el cashback. Nexo, Crypto.com, Revolut comparadas.',
    content: read('mejor-tarjeta-cripto-retirar-cajero-2026-es.md') },
  { slug: 'migliore-carta-cripto-prelievo-atm-2026', lang: 'it',
    title: 'Migliore carta crypto per prelievo contanti all\'ATM nel 2026',
    meta_title: 'Carta crypto prelievo ATM: commissioni & massimali 2026 | TopCryptoCards',
    meta_description: 'Quale carta crypto per prelevare contanti all\'ATM? Franchigia gratuita mensile, commissione oltre, fiscalità: Nexo, Crypto.com, Revolut a confronto. Guida 2026.',
    excerpt: 'Per prelevare contanti: guarda la franchigia gratuita mensile e la commissione oltre, non il cashback. Nexo, Crypto.com, Revolut a confronto.',
    content: read('migliore-carta-cripto-prelievo-atm-2026-it.md') },
  { slug: 'melhor-cartao-crypto-levantamento-multibanco-2026', lang: 'pt',
    title: 'Melhor cartão crypto para levantar dinheiro no multibanco em 2026',
    meta_title: 'Cartão crypto levantamento multibanco: taxas & limites 2026 | TopCryptoCards',
    meta_description: 'Que cartão crypto para levantar dinheiro no multibanco? Franquia gratuita mensal, comissão acima, fiscalidade: Nexo, Crypto.com, Revolut comparados. Guia 2026.',
    excerpt: 'Para levantar dinheiro: olha para a franquia gratuita mensal e a comissão acima, não para o cashback. Nexo, Crypto.com, Revolut comparados.',
    content: read('melhor-cartao-crypto-levantamento-multibanco-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nRetrait DAB/ATM money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
