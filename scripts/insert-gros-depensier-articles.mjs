#!/usr/bin/env node
/**
 * insert-gros-depensier-articles.mjs
 * Money page cas d'usage "meilleure carte crypto gros dépensier / high spender" en
 * FR, EN/UK, DE, ES, IT, PT. Angle distinct (rendement net à fort volume : plafonds,
 * coût d'immobilisation, amortissement des frais) → pas de doublon avec la thématique
 * cashback. FR/BE sans Bybit (indispo). BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-gros-depensier-articles.mjs --dry-run
 *   node scripts/insert-gros-depensier-articles.mjs --publish
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
const TOPIC = 'meilleure-carte-gros-depensier-2026';

const rows = [
  { slug: 'meilleure-carte-crypto-gros-depensier-2026', lang: 'fr',
    title: 'Meilleure carte crypto pour gros dépensiers en 2026',
    meta_title: 'Meilleure carte crypto gros dépensier 2026 | TopCryptoCards',
    meta_description: 'Quelle carte crypto rapporte le plus à fort volume ? Plutus, Crypto.com, Nexo comparées sur le rendement NET (plafonds, staking, frais). Guide gros dépensier 2026.',
    excerpt: 'À fort volume, le rendement net prime sur le taux affiché : plafonds, coût du staking, amortissement des frais. Notre guide pour gros dépensiers.',
    content: read('meilleure-carte-crypto-gros-depensier-2026-fr.md') },
  { slug: 'best-crypto-card-high-spenders-2026', lang: 'en',
    title: 'Best crypto card for high spenders in 2026',
    meta_title: 'Best Crypto Card for High Spenders 2026 | TopCryptoCards',
    meta_description: 'Which crypto card pays most at high volume? Bybit, Plutus, Crypto.com, Nexo compared on NET return (caps, staking, fees). High-spender guide 2026.',
    excerpt: 'At high volume, net return beats the headline rate: caps, staking cost, fee amortisation. Our guide for high spenders.',
    content: read('best-crypto-card-high-spenders-2026-en.md') },
  { slug: 'beste-krypto-karte-vielausgeber-2026', lang: 'de',
    title: 'Beste Krypto-Karte für Vielausgeber 2026',
    meta_title: 'Beste Krypto-Karte Vielausgeber 2026 | TopCryptoCards',
    meta_description: 'Welche Krypto-Karte zahlt bei hohem Volumen am meisten? Bybit, Plutus, Crypto.com, Nexo im Vergleich auf NETTO-Rendite (Limits, Staking, Gebühren). Guide 2026.',
    excerpt: 'Bei Volumen zählt die Netto-Rendite mehr als die beworbene Rate: Limits, Staking-Kosten, Gebührenamortisation. Unser Guide für Vielausgeber.',
    content: read('beste-krypto-karte-vielausgeber-2026-de.md') },
  { slug: 'mejor-tarjeta-cripto-grandes-gastadores-2026', lang: 'es',
    title: 'Mejor tarjeta cripto para grandes gastadores en 2026',
    meta_title: 'Mejor tarjeta cripto grandes gastadores 2026 | TopCryptoCards',
    meta_description: '¿Qué tarjeta cripto paga más a alto volumen? Bybit, Plutus, Crypto.com, Nexo comparadas por rendimiento NETO (límites, staking, cuotas). Guía 2026.',
    excerpt: 'A volumen, el rendimiento neto supera a la tasa anunciada: límites, coste del staking, amortización de cuotas. Nuestra guía para grandes gastadores.',
    content: read('mejor-tarjeta-cripto-grandes-gastadores-2026-es.md') },
  { slug: 'migliore-carta-cripto-grandi-spenditori-2026', lang: 'it',
    title: 'Migliore carta crypto per grandi spenditori nel 2026',
    meta_title: 'Migliore carta crypto grandi spenditori 2026 | TopCryptoCards',
    meta_description: 'Quale carta crypto paga di più ad alto volume? Bybit, Plutus, Crypto.com, Nexo a confronto sul rendimento NETTO (massimali, staking, costi). Guida 2026.',
    excerpt: 'Al volume, il rendimento netto conta più del tasso pubblicizzato: massimali, costo dello staking, ammortamento dei costi. La nostra guida per grandi spenditori.',
    content: read('migliore-carta-cripto-grandi-spenditori-2026-it.md') },
  { slug: 'melhor-cartao-crypto-grandes-gastadores-2026', lang: 'pt',
    title: 'Melhor cartão crypto para grandes gastadores em 2026',
    meta_title: 'Melhor cartão crypto grandes gastadores 2026 | TopCryptoCards',
    meta_description: 'Que cartão crypto paga mais a alto volume? Bybit, Plutus, Crypto.com, Nexo comparados pelo rendimento LÍQUIDO (limites, staking, anuidades). Guia 2026.',
    excerpt: 'Ao volume, o rendimento líquido supera a taxa anunciada: limites, custo do staking, amortização de anuidades. O nosso guia para grandes gastadores.',
    content: read('melhor-cartao-crypto-grandes-gastadores-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nGros dépensier money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
