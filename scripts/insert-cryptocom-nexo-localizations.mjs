#!/usr/bin/env node
/**
 * insert-cryptocom-nexo-localizations.mjs
 * Localise le comparatif fort intent "Crypto.com vs Nexo" en EN/UK, DE, ES, IT
 * (la version FR existe déjà). Slugs localisés, mêmes faits, liens internes par marché.
 * topic_key commun pour grouper les variantes. BROUILLON par défaut ; --publish pour publier.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-cryptocom-nexo-localizations.mjs --dry-run
 *   node scripts/insert-cryptocom-nexo-localizations.mjs --publish
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
const TOPIC = 'crypto-com-vs-nexo-choix-2026';

const rows = [
  {
    slug: 'crypto-com-vs-nexo-which-card', lang: 'en',
    title: 'Crypto.com vs Nexo: which crypto card to choose in 2026?',
    meta_title: 'Crypto.com vs Nexo: Which Card to Choose? | TopCryptoCards',
    meta_description: 'Crypto.com or Nexo? Real cashback, staking, caps, cashback currency: our honest, numbers-first comparison to pick the right crypto card in 2026.',
    excerpt: 'Nexo is simpler and staking-free; Crypto.com aims higher but requires locking CRO. A numbers-first comparison to choose by profile.',
    content: read('crypto-com-vs-nexo-which-card-en.md'),
  },
  {
    slug: 'crypto-com-oder-nexo-welche-karte', lang: 'de',
    title: 'Crypto.com oder Nexo: Welche Krypto-Karte 2026 wählen?',
    meta_title: 'Crypto.com oder Nexo: Welche Karte wählen? | TopCryptoCards',
    meta_description: 'Crypto.com oder Nexo? Realer Cashback, Staking, Limits, Cashback-Währung: unser ehrlicher Vergleich mit Zahlen, um 2026 die richtige Krypto-Karte zu wählen.',
    excerpt: 'Nexo ist einfacher und ohne Staking; Crypto.com zielt höher, verlangt aber das Sperren von CRO. Ein Vergleich mit Zahlen, je nach Profil.',
    content: read('crypto-com-oder-nexo-welche-karte-de.md'),
  },
  {
    slug: 'crypto-com-o-nexo-que-tarjeta-elegir', lang: 'es',
    title: 'Crypto.com o Nexo: ¿qué tarjeta cripto elegir en 2026?',
    meta_title: 'Crypto.com o Nexo: ¿Qué tarjeta elegir? | TopCryptoCards',
    meta_description: '¿Crypto.com o Nexo? Cashback real, staking, límites, moneda del cashback: nuestra comparación honesta y con cifras para elegir la tarjeta cripto en 2026.',
    excerpt: 'Nexo es más simple y sin staking; Crypto.com apunta más alto pero exige bloquear CRO. Una comparación con cifras para elegir según tu perfil.',
    content: read('crypto-com-o-nexo-que-tarjeta-elegir-es.md'),
  },
  {
    slug: 'crypto-com-o-nexo-quale-carta-scegliere', lang: 'it',
    title: 'Crypto.com o Nexo: quale carta crypto scegliere nel 2026?',
    meta_title: 'Crypto.com o Nexo: Quale carta scegliere? | TopCryptoCards',
    meta_description: 'Crypto.com o Nexo? Cashback reale, staking, massimali, valuta del cashback: il nostro confronto onesto e con i numeri per scegliere la carta crypto nel 2026.',
    excerpt: 'Nexo è più semplice e senza staking; Crypto.com punta più in alto ma richiede di bloccare CRO. Un confronto con i numeri per scegliere in base al profilo.',
    content: read('crypto-com-o-nexo-quale-carta-scegliere-it.md'),
  },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nCrypto.com vs Nexo localisations (en/de/es/it) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
