#!/usr/bin/env node
/**
 * insert-bitpanda-revolut-articles.mjs
 * Publie le comparatif fort intent "Bitpanda vs Revolut" en FR, EN/UK, DE, ES, IT.
 * Slugs localisés, mêmes faits, liens internes par marché. topic_key commun.
 * BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-bitpanda-revolut-articles.mjs --dry-run
 *   node scripts/insert-bitpanda-revolut-articles.mjs --publish
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
const TOPIC = 'bitpanda-vs-revolut-choix-2026';

const rows = [
  {
    slug: 'bitpanda-ou-revolut-quelle-carte-choisir', lang: 'fr',
    title: 'Bitpanda ou Revolut : quelle carte choisir en 2026 ?',
    meta_title: 'Bitpanda ou Revolut : quelle carte choisir ? | TopCryptoCards',
    meta_description: 'Bitpanda ou Revolut ? Carte crypto gratuite à cashback en BEST vs néobanque premium payante (RevPoints) : notre comparatif honnête et chiffré pour choisir en 2026.',
    excerpt: 'Bitpanda est gratuite et verse du vrai cashback crypto ; Revolut Metal est une néobanque payante à points. Comparatif chiffré pour choisir selon ton besoin.',
    content: read('bitpanda-ou-revolut-quelle-carte-choisir-fr.md'),
  },
  {
    slug: 'bitpanda-vs-revolut-which-card', lang: 'en',
    title: 'Bitpanda vs Revolut: which card to choose in 2026?',
    meta_title: 'Bitpanda vs Revolut: Which Card to Choose? | TopCryptoCards',
    meta_description: 'Bitpanda or Revolut? Free crypto card with BEST cashback vs paid premium neobank (RevPoints): our honest, numbers-first comparison to choose in 2026.',
    excerpt: 'Bitpanda is free with real crypto cashback; Revolut Metal is a paid points-based neobank. A numbers-first comparison to choose by need.',
    content: read('bitpanda-vs-revolut-which-card-en.md'),
  },
  {
    slug: 'bitpanda-oder-revolut-welche-karte', lang: 'de',
    title: 'Bitpanda oder Revolut: Welche Karte 2026 wählen?',
    meta_title: 'Bitpanda oder Revolut: Welche Karte wählen? | TopCryptoCards',
    meta_description: 'Bitpanda oder Revolut? Kostenlose Krypto-Karte mit BEST-Cashback vs kostenpflichtige Premium-Neobank (RevPoints): unser ehrlicher Vergleich mit Zahlen für 2026.',
    excerpt: 'Bitpanda ist kostenlos mit echtem Krypto-Cashback; Revolut Metal ist eine kostenpflichtige, punktebasierte Neobank. Ein Vergleich mit Zahlen, je nach Bedarf.',
    content: read('bitpanda-oder-revolut-welche-karte-de.md'),
  },
  {
    slug: 'bitpanda-o-revolut-que-tarjeta-elegir', lang: 'es',
    title: 'Bitpanda o Revolut: ¿qué tarjeta elegir en 2026?',
    meta_title: 'Bitpanda o Revolut: ¿Qué tarjeta elegir? | TopCryptoCards',
    meta_description: 'Bitpanda o Revolut? Tarjeta cripto gratuita con cashback en BEST vs neobanco premium de pago (RevPoints): nuestra comparación honesta y con cifras para 2026.',
    excerpt: 'Bitpanda es gratuita con cashback cripto real; Revolut Metal es un neobanco de pago por puntos. Comparación con cifras para elegir según tu necesidad.',
    content: read('bitpanda-o-revolut-que-tarjeta-elegir-es.md'),
  },
  {
    slug: 'bitpanda-o-revolut-quale-carta-scegliere', lang: 'it',
    title: 'Bitpanda o Revolut: quale carta scegliere nel 2026?',
    meta_title: 'Bitpanda o Revolut: Quale carta scegliere? | TopCryptoCards',
    meta_description: 'Bitpanda o Revolut? Carta crypto gratuita con cashback in BEST vs neobanca premium a pagamento (RevPoints): il nostro confronto onesto e con i numeri per il 2026.',
    excerpt: 'Bitpanda è gratuita con cashback crypto reale; Revolut Metal è una neobanca a pagamento a punti. Un confronto con i numeri per scegliere in base al bisogno.',
    content: read('bitpanda-o-revolut-quale-carta-scegliere-it.md'),
  },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nBitpanda vs Revolut (fr/en/de/es/it) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
