#!/usr/bin/env node
/**
 * Corrige les 4 variantes du cluster « voyage » (blog-travel-2026) dont le contenu
 * est bien localisé mais dont titre/excerpt/meta/slug sont restés en français.
 * Métadonnées écrites à la main dans chaque langue + slug localisé.
 *
 *   set -a && source .env && set +a
 *   node scripts/fix-travel-metadata.mjs             # DRY-RUN
 *   node scripts/fix-travel-metadata.mjs --confirm   # applique
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');

// lang → { oldSlug, patch{...} }. Le FR (original) n'est PAS touché.
const FIX = {
  it: {
    oldSlug: 'meilleure-carte-crypto-voyage-europe-comparatif',
    patch: {
      slug: 'migliore-carta-crypto-viaggi-europa',
      title: 'Migliore carta crypto per viaggiare in Europa (2026)',
      meta_title: 'Migliore carta crypto per viaggiare in Europa 2026',
      meta_description: 'Qual è la migliore carta crypto per viaggiare in Europa senza costi nascosti? Cashback, commissioni e disponibilità: comparativo testato ad agosto 2026.',
      excerpt: 'Trovare la migliore carta crypto per viaggiare in Europa senza elevate commissioni di cambio non è semplice. Cashback reale, costi nascosti e disponibilità per paese: ecco cosa distingue davvero le carte crypto nel 2026.',
    },
  },
  de: {
    oldSlug: 'meilleure-carte-crypto-voyage-europe-sans-frais',
    patch: {
      slug: 'beste-krypto-karte-reisen-europa',
      title: 'Beste Krypto-Karte für Reisen in Europa (2026)',
      meta_title: 'Beste Krypto-Karte für Reisen in Europa 2026',
      meta_description: 'Welche Krypto-Karte ist die beste für Reisen in Europa ohne versteckte Gebühren? Cashback, Gebühren und Verfügbarkeit: getesteter Vergleich 2026.',
      excerpt: 'Die beste Krypto-Karte für Reisen in Europa ohne hohe Wechselgebühren zu finden ist nicht einfach. Echtes Cashback, versteckte Kosten und Verfügbarkeit je Land: Das unterscheidet Krypto-Karten 2026 wirklich.',
    },
  },
  en: {
    oldSlug: 'meilleure-carte-crypto-voyage-europe-selection-testee',
    patch: {
      slug: 'best-crypto-card-travel-europe',
      title: 'Best Crypto Card for Travel in Europe (2026)',
      meta_title: 'Best Crypto Card for Travel in Europe 2026',
      meta_description: 'Which crypto card is best for travelling in Europe with no hidden fees? Cashback, annual fees and availability: our tested comparison for 2026.',
      excerpt: "Finding the best crypto card for travelling in Europe without steep FX fees isn't simple. Real cashback, hidden costs and availability by country: here's what truly sets crypto cards apart in 2026.",
    },
  },
  es: {
    oldSlug: 'meilleure-carte-crypto-voyage-europe-sans-frais',
    patch: {
      slug: 'mejor-tarjeta-cripto-viajar-europa',
      title: 'Mejor tarjeta cripto para viajar por Europa (2026)',
      meta_title: 'Mejor tarjeta cripto para viajar por Europa 2026',
      meta_description: '¿Cuál es la mejor tarjeta cripto para viajar por Europa sin comisiones ocultas? Cashback, cuotas anuales y disponibilidad: comparativo probado en 2026.',
      excerpt: 'Encontrar la mejor tarjeta cripto para viajar por Europa sin comisiones de cambio elevadas no es sencillo. Cashback real, costes ocultos y disponibilidad por país: esto es lo que de verdad diferencia a las tarjetas cripto en 2026.',
    },
  },
};

const redirects = [];
for (const [lang, { oldSlug, patch }] of Object.entries(FIX)) {
  const { data: rows, error } = await sb.from('blog_posts')
    .select('id, lang, slug, title')
    .eq('lang', lang).eq('slug', oldSlug);
  if (error) { console.error(`✗ ${lang}:`, error.message); continue; }
  if (!rows.length) { console.log(`⚠️  ${lang}: aucune ligne (slug déjà corrigé ?) — ${oldSlug}`); continue; }
  if (rows.length > 1) { console.log(`⚠️  ${lang}: ${rows.length} lignes pour ce slug — on saute par prudence`); continue; }
  const p = rows[0];

  console.log(`\n[${lang}] ${p.id}`);
  console.log(`   slug  : ${p.slug}  →  ${patch.slug}`);
  console.log(`   title : ${patch.title}`);
  console.log(`   meta_t: ${patch.meta_title}`);

  redirects.push(`/${lang}/blog/${oldSlug}   /${lang}/blog/${patch.slug}   301`);

  if (CONFIRM) {
    const { error: e } = await sb.from('blog_posts').update(patch).eq('id', p.id);
    console.log(e ? `   ✗ ${e.message}` : `   ✓ mis à jour`);
  }
}

console.log(`\n=== Lignes 301 à mettre dans public/_redirects (déjà ajoutées si tu utilises la version fournie) ===`);
redirects.forEach(r => console.log(r));
if (!CONFIRM) console.log(`\nDRY-RUN. Pour appliquer : node scripts/fix-travel-metadata.mjs --confirm`);
else console.log(`\n✓ Terminé. Ensuite : node scripts/gen-blog-sitemap.mjs && git add -A && commit && push.`);
