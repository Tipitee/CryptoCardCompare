#!/usr/bin/env node
/**
 * insert-sans-banque-articles.mjs
 * Money page cas d'usage "meilleure carte crypto sans compte bancaire / non-bancarisés"
 * en FR, EN/UK, DE, ES, IT, PT. Cas d'usage sans thématique existante → pas de doublon.
 * BROUILLON par défaut ; --publish pour publier.
 *   set -a && source .env && set +a
 *   node scripts/insert-sans-banque-articles.mjs --dry-run | --publish
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
const TOPIC = 'meilleure-carte-sans-compte-bancaire-2026';

const rows = [
  { slug: 'meilleure-carte-crypto-sans-compte-bancaire-2026', lang: 'fr',
    title: 'Meilleure carte crypto sans compte bancaire en 2026',
    meta_title: 'Carte crypto sans compte bancaire 2026 | TopCryptoCards',
    meta_description: 'Une carte de paiement sans compte bancaire ? Les cartes crypto prépayées, sans vérification de crédit, parfois avec IBAN : Bit2Me, Deblock, Nexo, Gnosis Pay. Guide 2026.',
    excerpt: 'Oui, une carte sans compte bancaire : prépayée, sans vérification de crédit, parfois avec IBAN. Bit2Me, Deblock, Nexo, Gnosis Pay.',
    content: read('meilleure-carte-crypto-sans-compte-bancaire-2026-fr.md') },
  { slug: 'best-crypto-card-no-bank-account-2026', lang: 'en',
    title: 'Best crypto card without a bank account in 2026',
    meta_title: 'Crypto Card Without a Bank Account 2026 | TopCryptoCards',
    meta_description: 'A payment card without a bank account? Prepaid crypto cards, no credit check, sometimes with IBAN: Deblock, Nexo, Gnosis Pay, Bitpanda. 2026 guide.',
    excerpt: 'Yes, a card with no bank account: prepaid, no credit check, sometimes with IBAN. Deblock, Nexo, Gnosis Pay, Bitpanda.',
    content: read('best-crypto-card-no-bank-account-2026-en.md') },
  { slug: 'beste-krypto-karte-ohne-bankkonto-2026', lang: 'de',
    title: 'Beste Krypto-Karte ohne Bankkonto 2026',
    meta_title: 'Krypto-Karte ohne Bankkonto 2026 | TopCryptoCards',
    meta_description: 'Eine Zahlungskarte ohne Bankkonto? Prepaid-Krypto-Karten, ohne Bonitätsprüfung, teils mit IBAN: Bit2Me, Nexo, Gnosis Pay, Bitpanda. Guide 2026.',
    excerpt: 'Ja, eine Karte ohne Bankkonto: prepaid, ohne Bonitätsprüfung, teils mit IBAN. Bit2Me, Nexo, Gnosis Pay, Bitpanda.',
    content: read('beste-krypto-karte-ohne-bankkonto-2026-de.md') },
  { slug: 'mejor-tarjeta-cripto-sin-cuenta-bancaria-2026', lang: 'es',
    title: 'Mejor tarjeta cripto sin cuenta bancaria en 2026',
    meta_title: 'Tarjeta cripto sin cuenta bancaria 2026 | TopCryptoCards',
    meta_description: '¿Una tarjeta de pago sin cuenta bancaria? Tarjetas cripto prepago, sin verificación de crédito, a veces con IBAN: Bit2Me, Nexo, Gnosis Pay, Bitpanda. Guía 2026.',
    excerpt: 'Sí, una tarjeta sin cuenta bancaria: prepago, sin verificación de crédito, a veces con IBAN. Bit2Me, Nexo, Gnosis Pay, Bitpanda.',
    content: read('mejor-tarjeta-cripto-sin-cuenta-bancaria-2026-es.md') },
  { slug: 'migliore-carta-cripto-senza-conto-bancario-2026', lang: 'it',
    title: 'Migliore carta crypto senza conto bancario nel 2026',
    meta_title: 'Carta crypto senza conto bancario 2026 | TopCryptoCards',
    meta_description: 'Una carta di pagamento senza conto bancario? Carte crypto prepagate, senza verifica del credito, a volte con IBAN: Bit2Me, Nexo, Gnosis Pay, Bitpanda. Guida 2026.',
    excerpt: 'Sì, una carta senza conto bancario: prepagata, senza verifica del credito, a volte con IBAN. Bit2Me, Nexo, Gnosis Pay, Bitpanda.',
    content: read('migliore-carta-cripto-senza-conto-bancario-2026-it.md') },
  { slug: 'melhor-cartao-crypto-sem-conta-bancaria-2026', lang: 'pt',
    title: 'Melhor cartão crypto sem conta bancária em 2026',
    meta_title: 'Cartão crypto sem conta bancária 2026 | TopCryptoCards',
    meta_description: 'Um cartão de pagamento sem conta bancária? Cartões crypto pré-pagos, sem verificação de crédito, por vezes com IBAN: Bit2Me, Nexo, Gnosis Pay, Bitpanda. Guia 2026.',
    excerpt: 'Sim, um cartão sem conta bancária: pré-pago, sem verificação de crédito, por vezes com IBAN. Bit2Me, Nexo, Gnosis Pay, Bitpanda.',
    content: read('melhor-cartao-crypto-sem-conta-bancaria-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nSans compte bancaire money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
