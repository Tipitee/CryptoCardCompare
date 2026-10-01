#!/usr/bin/env node
/**
 * insert-nexo-revolut-articles.mjs
 * Publie le comparatif fort intent "Nexo vs Revolut" en FR, EN/UK, DE, ES, IT, PT.
 * Angle distinct : ligne de crédit Nexo (dépenser sans vendre) vs néobanque payante.
 * Slugs localisés, liens internes par marché (PT sans lien compare). topic_key commun.
 * BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-nexo-revolut-articles.mjs --dry-run
 *   node scripts/insert-nexo-revolut-articles.mjs --publish
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
const TOPIC = 'nexo-vs-revolut-choix-2026';

const rows = [
  { slug: 'nexo-ou-revolut-quelle-carte-choisir', lang: 'fr',
    title: 'Nexo ou Revolut : quelle carte choisir en 2026 ?',
    meta_title: 'Nexo ou Revolut : quelle carte choisir ? | TopCryptoCards',
    meta_description: 'Nexo ou Revolut ? Carte crypto gratuite (ligne de crédit, cashback BTC, dépenser sans vendre) vs néobanque premium payante (RevPoints) : comparatif honnête et chiffré 2026.',
    excerpt: 'Nexo permet de dépenser sans vendre ses cryptos avec cashback BTC gratuit ; Revolut Metal est une néobanque payante à points. Comparatif chiffré pour choisir.',
    content: read('nexo-ou-revolut-quelle-carte-choisir-fr.md') },
  { slug: 'nexo-vs-revolut-which-card', lang: 'en',
    title: 'Nexo vs Revolut: which card to choose in 2026?',
    meta_title: 'Nexo vs Revolut: Which Card to Choose? | TopCryptoCards',
    meta_description: 'Nexo or Revolut? Free crypto card (credit line, BTC cashback, spend without selling) vs paid premium neobank (RevPoints): honest, numbers-first comparison for 2026.',
    excerpt: 'Nexo lets you spend without selling your crypto with free BTC cashback; Revolut Metal is a paid points-based neobank. A numbers-first comparison.',
    content: read('nexo-vs-revolut-which-card-en.md') },
  { slug: 'nexo-oder-revolut-welche-karte', lang: 'de',
    title: 'Nexo oder Revolut: Welche Karte 2026 wählen?',
    meta_title: 'Nexo oder Revolut: Welche Karte wählen? | TopCryptoCards',
    meta_description: 'Nexo oder Revolut? Kostenlose Krypto-Karte (Kreditlinie, BTC-Cashback, ausgeben ohne verkaufen) vs kostenpflichtige Premium-Neobank (RevPoints): ehrlicher Vergleich 2026.',
    excerpt: 'Nexo: ausgeben ohne verkaufen mit kostenlosem BTC-Cashback; Revolut Metal: kostenpflichtige, punktebasierte Neobank. Ein Vergleich mit Zahlen.',
    content: read('nexo-oder-revolut-welche-karte-de.md') },
  { slug: 'nexo-o-revolut-que-tarjeta-elegir', lang: 'es',
    title: 'Nexo o Revolut: ¿qué tarjeta elegir en 2026?',
    meta_title: 'Nexo o Revolut: ¿Qué tarjeta elegir? | TopCryptoCards',
    meta_description: '¿Nexo o Revolut? Tarjeta cripto gratuita (línea de crédito, cashback BTC, gastar sin vender) vs neobanco premium de pago (RevPoints): comparación honesta y con cifras 2026.',
    excerpt: 'Nexo permite gastar sin vender tus criptos con cashback BTC gratis; Revolut Metal es un neobanco de pago por puntos. Comparación con cifras.',
    content: read('nexo-o-revolut-que-tarjeta-elegir-es.md') },
  { slug: 'nexo-o-revolut-quale-carta-scegliere', lang: 'it',
    title: 'Nexo o Revolut: quale carta scegliere nel 2026?',
    meta_title: 'Nexo o Revolut: Quale carta scegliere? | TopCryptoCards',
    meta_description: 'Nexo o Revolut? Carta crypto gratuita (linea di credito, cashback BTC, spendere senza vendere) vs neobanca premium a pagamento (RevPoints): confronto onesto e con numeri 2026.',
    excerpt: 'Nexo permette di spendere senza vendere le crypto con cashback BTC gratuito; Revolut Metal è una neobanca a pagamento a punti. Un confronto con i numeri.',
    content: read('nexo-o-revolut-quale-carta-scegliere-it.md') },
  { slug: 'nexo-ou-revolut-que-cartao-escolher', lang: 'pt',
    title: 'Nexo ou Revolut: que cartão escolher em 2026?',
    meta_title: 'Nexo ou Revolut: Que cartão escolher? | TopCryptoCards',
    meta_description: 'Nexo ou Revolut? Cartão crypto gratuito (linha de crédito, cashback BTC, gastar sem vender) vs neobanco premium pago (RevPoints): comparação honesta e com números 2026.',
    excerpt: 'O Nexo permite gastar sem vender as crypto com cashback BTC grátis; o Revolut Metal é um neobanco pago por pontos. Uma comparação com números.',
    content: read('nexo-ou-revolut-que-cartao-escolher-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nNexo vs Revolut (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
