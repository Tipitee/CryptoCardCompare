#!/usr/bin/env node
/**
 * insert-abonnements-articles.mjs
 * Money page cas d'usage "meilleure carte crypto pour les abonnements (Netflix, Spotify)"
 * en FR, EN/UK, DE, ES, IT, PT. Répond à une buyer query listée, sans page existante.
 * BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-abonnements-articles.mjs --dry-run
 *   node scripts/insert-abonnements-articles.mjs --publish
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
const TOPIC = 'carte-crypto-abonnements-2026';

const rows = [
  { slug: 'carte-crypto-abonnements-netflix-spotify-2026', lang: 'fr',
    title: 'Meilleure carte crypto pour les abonnements (Netflix, Spotify) en 2026',
    meta_title: 'Carte crypto abonnements Netflix/Spotify 2026 | TopCryptoCards',
    meta_description: 'Quelle carte crypto rembourse Netflix, Spotify, Disney+ ? Plutus (Perks) et Crypto.com (paliers) remboursent les abonnements, pas juste du cashback. Guide 2026.',
    excerpt: 'Plutus et Crypto.com remboursent les abonnements (Netflix, Spotify…), pas juste un cashback. Comment en profiter vraiment.',
    content: read('carte-crypto-abonnements-netflix-spotify-2026-fr.md') },
  { slug: 'crypto-card-subscriptions-netflix-spotify-2026', lang: 'en',
    title: 'Best crypto card for subscriptions (Netflix, Spotify) in 2026',
    meta_title: 'Crypto Card for Subscriptions Netflix/Spotify 2026 | TopCryptoCards',
    meta_description: 'Which crypto card rebates Netflix, Spotify, Disney+? Plutus (Perks) and Crypto.com (tiers) rebate subscriptions, not just cashback. 2026 guide.',
    excerpt: 'Plutus and Crypto.com rebate subscriptions (Netflix, Spotify…), not just cashback. How to actually benefit.',
    content: read('crypto-card-subscriptions-netflix-spotify-2026-en.md') },
  { slug: 'krypto-karte-abos-netflix-spotify-2026', lang: 'de',
    title: 'Beste Krypto-Karte für Abos (Netflix, Spotify) 2026',
    meta_title: 'Krypto-Karte Abos Netflix/Spotify 2026 | TopCryptoCards',
    meta_description: 'Welche Krypto-Karte erstattet Netflix, Spotify, Disney+? Plutus (Perks) und Crypto.com (Stufen) erstatten Abos, nicht nur Cashback. Guide 2026.',
    excerpt: 'Plutus und Crypto.com erstatten Abos (Netflix, Spotify…), nicht nur Cashback. So profitierst du wirklich.',
    content: read('krypto-karte-abos-netflix-spotify-2026-de.md') },
  { slug: 'tarjeta-cripto-suscripciones-netflix-spotify-2026', lang: 'es',
    title: 'Mejor tarjeta cripto para suscripciones (Netflix, Spotify) en 2026',
    meta_title: 'Tarjeta cripto suscripciones Netflix/Spotify 2026 | TopCryptoCards',
    meta_description: '¿Qué tarjeta cripto reembolsa Netflix, Spotify, Disney+? Plutus (Perks) y Crypto.com (niveles) reembolsan suscripciones, no solo cashback. Guía 2026.',
    excerpt: 'Plutus y Crypto.com reembolsan suscripciones (Netflix, Spotify…), no solo cashback. Cómo aprovecharlo de verdad.',
    content: read('tarjeta-cripto-suscripciones-netflix-spotify-2026-es.md') },
  { slug: 'carta-cripto-abbonamenti-netflix-spotify-2026', lang: 'it',
    title: 'Migliore carta crypto per gli abbonamenti (Netflix, Spotify) nel 2026',
    meta_title: 'Carta crypto abbonamenti Netflix/Spotify 2026 | TopCryptoCards',
    meta_description: 'Quale carta crypto rimborsa Netflix, Spotify, Disney+? Plutus (Perks) e Crypto.com (livelli) rimborsano gli abbonamenti, non solo cashback. Guida 2026.',
    excerpt: 'Plutus e Crypto.com rimborsano gli abbonamenti (Netflix, Spotify…), non solo cashback. Come approfittarne davvero.',
    content: read('carta-cripto-abbonamenti-netflix-spotify-2026-it.md') },
  { slug: 'cartao-crypto-subscricoes-netflix-spotify-2026', lang: 'pt',
    title: 'Melhor cartão crypto para subscrições (Netflix, Spotify) em 2026',
    meta_title: 'Cartão crypto subscrições Netflix/Spotify 2026 | TopCryptoCards',
    meta_description: 'Que cartão crypto reembolsa Netflix, Spotify, Disney+? Plutus (Perks) e Crypto.com (níveis) reembolsam subscrições, não só cashback. Guia 2026.',
    excerpt: 'O Plutus e o Crypto.com reembolsam subscrições (Netflix, Spotify…), não só cashback. Como aproveitar de verdade.',
    content: read('cartao-crypto-subscricoes-netflix-spotify-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nAbonnements money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
