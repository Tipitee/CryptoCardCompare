#!/usr/bin/env node
/**
 * insert-gratuite-payante-articles.mjs
 * Money page "carte crypto gratuite vs payante" (guide de décision) en
 * FR, EN/UK, DE, ES, IT, PT. Intention décision/comparaison, distincte du thème
 * "sans frais" (listing) → pas de doublon. BROUILLON par défaut ; --publish pour publier.
 *   set -a && source .env && set +a
 *   node scripts/insert-gratuite-payante-articles.mjs --dry-run | --publish
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
const TOPIC = 'carte-crypto-gratuite-vs-payante-2026';

const rows = [
  { slug: 'carte-crypto-gratuite-vs-payante-2026', lang: 'fr',
    title: 'Carte crypto gratuite ou payante : laquelle choisir en 2026 ?',
    meta_title: 'Carte crypto gratuite vs payante 2026 | TopCryptoCards',
    meta_description: 'Carte crypto gratuite ou payante ? La plupart des bonnes cartes sont à 0 €/an ; une payante (Plutus, Revolut Metal) ne vaut le coup que sous conditions. Guide de décision 2026.',
    excerpt: 'La plupart des bonnes cartes sont gratuites. Une payante ne gagne qu\'à fort volume, pour les abonnements ou la banque premium. Le calcul à faire.',
    content: read('carte-crypto-gratuite-vs-payante-2026-fr.md') },
  { slug: 'free-vs-paid-crypto-card-2026', lang: 'en',
    title: 'Free vs paid crypto card: which to choose in 2026?',
    meta_title: 'Free vs Paid Crypto Card 2026 | TopCryptoCards',
    meta_description: 'Free or paid crypto card? Most good cards are €0/year; a paid one (Plutus, Revolut Metal) is only worth it under conditions. 2026 decision guide.',
    excerpt: 'Most good cards are free. A paid one only wins at high volume, for subscriptions or premium banking. The sum to run.',
    content: read('free-vs-paid-crypto-card-2026-en.md') },
  { slug: 'krypto-karte-kostenlos-vs-kostenpflichtig-2026', lang: 'de',
    title: 'Kostenlose vs kostenpflichtige Krypto-Karte: welche 2026 wählen?',
    meta_title: 'Krypto-Karte kostenlos vs kostenpflichtig 2026 | TopCryptoCards',
    meta_description: 'Kostenlose oder kostenpflichtige Krypto-Karte? Die meisten guten Karten sind 0 €/Jahr; eine kostenpflichtige (Plutus, Revolut Metal) lohnt sich nur bedingt. Entscheidungsguide 2026.',
    excerpt: 'Die meisten guten Karten sind kostenlos. Eine kostenpflichtige gewinnt nur bei hohem Volumen, für Abos oder Premium-Banking. Die Rechnung.',
    content: read('krypto-karte-kostenlos-vs-kostenpflichtig-2026-de.md') },
  { slug: 'tarjeta-cripto-gratis-vs-pago-2026', lang: 'es',
    title: 'Tarjeta cripto gratis o de pago: ¿cuál elegir en 2026?',
    meta_title: 'Tarjeta cripto gratis vs de pago 2026 | TopCryptoCards',
    meta_description: '¿Tarjeta cripto gratis o de pago? La mayoría de las buenas tarjetas son 0 €/año; una de pago (Plutus, Revolut Metal) solo vale la pena bajo condiciones. Guía de decisión 2026.',
    excerpt: 'La mayoría de las buenas tarjetas son gratuitas. Una de pago solo gana a alto volumen, para suscripciones o banca premium. El cálculo a hacer.',
    content: read('tarjeta-cripto-gratis-vs-pago-2026-es.md') },
  { slug: 'carta-cripto-gratuita-vs-pagamento-2026', lang: 'it',
    title: 'Carta crypto gratuita o a pagamento: quale scegliere nel 2026?',
    meta_title: 'Carta crypto gratuita vs a pagamento 2026 | TopCryptoCards',
    meta_description: 'Carta crypto gratuita o a pagamento? La maggior parte delle buone carte è 0 €/anno; una a pagamento (Plutus, Revolut Metal) conviene solo a condizioni. Guida alla decisione 2026.',
    excerpt: 'La maggior parte delle buone carte è gratuita. Una a pagamento vince solo ad alto volume, per abbonamenti o banking premium. Il calcolo da fare.',
    content: read('carta-cripto-gratuita-vs-pagamento-2026-it.md') },
  { slug: 'cartao-crypto-gratuito-vs-pago-2026', lang: 'pt',
    title: 'Cartão crypto gratuito ou pago: qual escolher em 2026?',
    meta_title: 'Cartão crypto gratuito vs pago 2026 | TopCryptoCards',
    meta_description: 'Cartão crypto gratuito ou pago? A maioria dos bons cartões é 0 €/ano; um pago (Plutus, Revolut Metal) só vale a pena sob condições. Guia de decisão 2026.',
    excerpt: 'A maioria dos bons cartões é gratuita. Um pago só ganha a alto volume, para subscrições ou banca premium. A conta a fazer.',
    content: read('cartao-crypto-gratuito-vs-pago-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nGratuite vs payante money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
