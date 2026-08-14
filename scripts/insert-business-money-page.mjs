#!/usr/bin/env node
/**
 * Insère la money page "carte crypto entreprise/freelance" (FR + DE/ES/IT/EN),
 * adaptée par marché. topic_key partagé (pour hero + hreflang), brief retiré, date du jour.
 * Hero non défini ici -> à générer ensuite via scripts/generate-missing-heroes.mjs.
 *
 *   set -a && source .env && set +a
 *   node scripts/insert-business-money-page.mjs             # DRY-RUN
 *   node scripts/insert-business-money-page.mjs --confirm   # insère
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');
const TOPIC = 'blog-money-carte-crypto-entreprise-2026';
const strip = raw => raw.replace(/^﻿?\s*<!--[\s\S]*?-->\s*/, '').trim();

const ITEMS = [
  {
    file: 'seo/content-drafts/carte-crypto-entreprise-freelance-2026-fr.md', lang: 'fr',
    slug: 'carte-crypto-entreprise-freelance-2026',
    title: 'Carte crypto entreprise et freelance en 2026 : quelles options pour un usage professionnel ?',
    meta_title: 'Carte crypto entreprise & freelance 2026 : le guide',
    meta_description: "Cartes crypto pour entreprise et freelance en 2026 : Wirex Business pour les sociétés, cartes régulées + stablecoins pour les indépendants. Compta, TVA, DAC8.",
    excerpt: "Peu de vraies cartes crypto « société » existent. Wirex Business pour les entreprises ; pour les freelances, une carte régulée rechargée en stablecoins. Le point compta et fiscalité 2026.",
    tags: ['carte crypto entreprise', 'carte crypto professionnelle', 'freelance', 'business', 'wirex'],
  },
  {
    file: 'seo/content-drafts/krypto-karte-unternehmen-freelancer-2026-de.md', lang: 'de',
    slug: 'krypto-karte-unternehmen-freelancer-2026',
    title: 'Krypto-Karte für Unternehmen und Freelancer 2026: welche Optionen für den geschäftlichen Einsatz?',
    meta_title: 'Krypto-Karte Unternehmen & Freelancer 2026',
    meta_description: 'Krypto-Karten für Unternehmen und Freelancer 2026: Wirex Business für Firmen, regulierte Karten + Stablecoins für Selbstständige. Buchhaltung, USt, DAC8.',
    excerpt: 'Es gibt kaum echte Firmen-Krypto-Karten. Wirex Business für Unternehmen; für Freelancer eine regulierte Karte mit Stablecoins. Der Buchhaltungs- und Steuerüberblick 2026.',
    tags: ['krypto karte unternehmen', 'krypto karte firma', 'freelancer', 'business', 'wirex'],
  },
  {
    file: 'seo/content-drafts/tarjeta-cripto-empresa-autonomos-2026-es.md', lang: 'es',
    slug: 'tarjeta-cripto-empresa-autonomos-2026',
    title: 'Tarjeta cripto para empresas y autónomos en 2026: ¿qué opciones para un uso profesional?',
    meta_title: 'Tarjeta cripto para empresas y autónomos 2026',
    meta_description: 'Tarjetas cripto para empresa y autónomos 2026: Wirex Business para sociedades, tarjetas reguladas + stablecoins para freelance. Contabilidad, IVA, DAC8.',
    excerpt: 'Existen pocas tarjetas cripto «de empresa» reales. Wirex Business para sociedades; para autónomos, una tarjeta regulada recargada con stablecoins. Contabilidad y fiscalidad 2026.',
    tags: ['tarjeta cripto empresa', 'tarjeta cripto autónomos', 'freelance', 'business', 'wirex'],
  },
  {
    file: 'seo/content-drafts/carta-crypto-azienda-partita-iva-2026-it.md', lang: 'it',
    slug: 'carta-crypto-azienda-partita-iva-2026',
    title: 'Carta crypto per aziende e partite IVA nel 2026: quali opzioni per un uso professionale?',
    meta_title: 'Carta crypto azienda e partita IVA 2026',
    meta_description: 'Carte crypto per aziende e partite IVA 2026: Wirex Business per le società, carte regolamentate + stablecoin per i freelance. Contabilità, IVA, DAC8.',
    excerpt: 'Esistono poche vere carte crypto «aziendali». Wirex Business per le società; per i freelance una carta regolamentata con stablecoin. Il punto su contabilità e fisco 2026.',
    tags: ['carta crypto azienda', 'carta crypto partita iva', 'freelance', 'business', 'wirex'],
  },
  {
    file: 'seo/content-drafts/crypto-card-business-freelancers-2026-en.md', lang: 'en',
    slug: 'crypto-card-business-freelancers-2026',
    title: 'Crypto card for business and freelancers in 2026: which options for professional use?',
    meta_title: 'Crypto card for business & freelancers 2026',
    meta_description: 'Crypto cards for business and freelancers in 2026: Wirex Business for companies, regulated cards + stablecoins for sole traders. Bookkeeping, VAT, CARF.',
    excerpt: "Few genuine 'company' crypto cards exist. Wirex Business for firms; for freelancers, a regulated card topped up with stablecoins. The 2026 bookkeeping and tax view.",
    tags: ['crypto card business', 'crypto card company', 'freelancers', 'self-employed', 'wirex'],
  },
];

console.log(`\n=== ${CONFIRM ? 'INSERTION' : 'DRY-RUN'} — ${ITEMS.length} versions money page entreprise ===`);
let done = 0;
for (const it of ITEMS) {
  const content = strip(readFileSync(it.file, 'utf8'));
  const post = {
    lang: it.lang, slug: it.slug, title: it.title, excerpt: it.excerpt,
    meta_title: it.meta_title, meta_description: it.meta_description, content,
    topic_key: TOPIC, category: 'guide', tags: it.tags,
    published: true, created_at: new Date().toISOString(),
  };
  const { data: existing } = await sb.from('blog_posts')
    .select('id').eq('lang', it.lang).eq('slug', it.slug).maybeSingle();

  console.log(`\n[${it.lang}] ${it.slug}`);
  console.log(`   title  : ${it.title}`);
  console.log(`   ${content.split(/\s+/).length} mots · meta_title ${it.meta_title.length} car · brief retiré: ${!content.includes('BRIEF (')}${existing ? ' · EXISTE (update)' : ''}`);

  if (CONFIRM) {
    const { error } = existing
      ? await sb.from('blog_posts').update(post).eq('id', existing.id)
      : await sb.from('blog_posts').insert(post);
    if (error) console.log(`   X ${error.message}`); else { console.log('   OK publié'); done++; }
  }
}

if (CONFIRM) {
  console.log(`\nOK ${done}/${ITEMS.length} publiés.`);
  console.log(`Ensuite : node scripts/generate-missing-heroes.mjs --confirm  (hero)`);
  console.log(`          node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: money page carte crypto entreprise FR DE ES IT EN" && git push`);
} else {
  console.log(`\nDRY-RUN. Pour insérer : node scripts/insert-business-money-page.mjs --confirm`);
}
