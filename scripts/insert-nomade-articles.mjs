#!/usr/bin/env node
/**
 * insert-nomade-articles.mjs
 * Money page cas d'usage "meilleure carte crypto nomade digital / expatrié" en
 * FR, EN/UK, DE, ES, IT, PT. Cas d'usage distinct (multi-devises, 0 % FX, IBAN) du
 * thème voyage → pas de doublon. BROUILLON par défaut ; --publish pour publier.
 *   set -a && source .env && set +a
 *   node scripts/insert-nomade-articles.mjs --dry-run | --publish
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
const TOPIC = 'meilleure-carte-nomade-expat-2026';

const rows = [
  { slug: 'meilleure-carte-crypto-nomade-expat-2026', lang: 'fr',
    title: 'Meilleure carte crypto pour nomades digitaux et expatriés en 2026',
    meta_title: 'Carte crypto nomade digital & expat 2026 | TopCryptoCards',
    meta_description: 'Quelle carte crypto pour un nomade digital ou expatrié ? 0 % de change, acceptation mondiale, IBAN : Nexo, Gnosis Pay, Deblock comparées. Guide 2026.',
    excerpt: 'Pour vivre à l\'étranger : 0 % de change, acceptation mondiale, IBAN. Nexo, Gnosis Pay, Deblock/Bit2Me selon ton profil.',
    content: read('meilleure-carte-crypto-nomade-expat-2026-fr.md') },
  { slug: 'best-crypto-card-digital-nomads-expats-2026', lang: 'en',
    title: 'Best crypto card for digital nomads and expats in 2026',
    meta_title: 'Best Crypto Card for Digital Nomads & Expats 2026 | TopCryptoCards',
    meta_description: 'Which crypto card for a digital nomad or expat? 0% FX, worldwide acceptance, IBAN: Nexo, Gnosis Pay, Deblock compared. 2026 guide.',
    excerpt: 'For living abroad: 0% FX, worldwide acceptance, IBAN. Nexo, Gnosis Pay, Deblock/Bitpanda by profile.',
    content: read('best-crypto-card-digital-nomads-expats-2026-en.md') },
  { slug: 'beste-krypto-karte-digitale-nomaden-expats-2026', lang: 'de',
    title: 'Beste Krypto-Karte für digitale Nomaden und Expats 2026',
    meta_title: 'Krypto-Karte digitale Nomaden & Expats 2026 | TopCryptoCards',
    meta_description: 'Welche Krypto-Karte für digitale Nomaden oder Expats? 0 % Umtausch, weltweite Akzeptanz, IBAN: Nexo, Gnosis Pay, Bitpanda im Vergleich. Guide 2026.',
    excerpt: 'Fürs Leben im Ausland: 0 % Umtausch, weltweite Akzeptanz, IBAN. Nexo, Gnosis Pay, Bitpanda/Bit2Me je nach Profil.',
    content: read('beste-krypto-karte-digitale-nomaden-expats-2026-de.md') },
  { slug: 'mejor-tarjeta-cripto-nomadas-expatriados-2026', lang: 'es',
    title: 'Mejor tarjeta cripto para nómadas digitales y expatriados en 2026',
    meta_title: 'Tarjeta cripto nómadas digitales & expats 2026 | TopCryptoCards',
    meta_description: '¿Qué tarjeta cripto para un nómada digital o expatriado? 0 % de cambio, aceptación mundial, IBAN: Nexo, Gnosis Pay, Bit2Me comparadas. Guía 2026.',
    excerpt: 'Para vivir fuera: 0 % de cambio, aceptación mundial, IBAN. Nexo, Gnosis Pay, Bitpanda/Bit2Me según tu perfil.',
    content: read('mejor-tarjeta-cripto-nomadas-expatriados-2026-es.md') },
  { slug: 'migliore-carta-cripto-nomadi-expat-2026', lang: 'it',
    title: 'Migliore carta crypto per nomadi digitali ed expat nel 2026',
    meta_title: 'Carta crypto nomadi digitali & expat 2026 | TopCryptoCards',
    meta_description: 'Quale carta crypto per un nomade digitale o expat? 0 % di cambio, accettazione mondiale, IBAN: Nexo, Gnosis Pay, Bit2Me a confronto. Guida 2026.',
    excerpt: 'Per vivere all\'estero: 0 % di cambio, accettazione mondiale, IBAN. Nexo, Gnosis Pay, Bitpanda/Bit2Me secondo il profilo.',
    content: read('migliore-carta-cripto-nomadi-expat-2026-it.md') },
  { slug: 'melhor-cartao-crypto-nomadas-expatriados-2026', lang: 'pt',
    title: 'Melhor cartão crypto para nómadas digitais e expatriados em 2026',
    meta_title: 'Cartão crypto nómadas digitais & expats 2026 | TopCryptoCards',
    meta_description: 'Que cartão crypto para um nómada digital ou expatriado? 0 % de câmbio, aceitação mundial, IBAN: Nexo, Gnosis Pay, Bit2Me comparados. Guia 2026.',
    excerpt: 'Para viver no estrangeiro: 0 % de câmbio, aceitação mundial, IBAN. Nexo, Gnosis Pay, Bitpanda/Bit2Me conforme o perfil.',
    content: read('melhor-cartao-crypto-nomadas-expatriados-2026-pt.md') },
].map(r => ({ ...r, topic_key: TOPIC, category: 'guide', image_hero: null, published: PUBLISH }));

(async () => {
  console.log(`\nNomade/expat money page (fr/en/de/es/it/pt) -> ${PUBLISH ? 'PUBLISH' : 'DRAFT'}${DRY ? ' (dry-run)' : ''}\n`);
  for (const row of rows) {
    const words = row.content.split(/\s+/).length;
    if (DRY) { console.log(`(dry) ${row.lang} /${row.lang}/blog/${row.slug} | ${words} mots | published=${row.published}`); continue; }
    const { error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug,lang' });
    if (error) { console.error('x', row.lang, error.message); process.exit(1); }
    console.log(`OK ${row.lang} /${row.lang}/blog/${row.slug} (${words} mots) -- ${PUBLISH ? 'publie' : 'brouillon'}`);
  }
})();
