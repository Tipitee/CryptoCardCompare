#!/usr/bin/env node
/**
 * A7 Internal-Link Finder — propose des liens internes contextuels vers les
 * money pages, à partir des posts qui parlent du sujet mais ne lient pas encore.
 * LECTURE SEULE : n'écrit QUE le fichier de file d'attente, jamais la base.
 *
 * Réseau requis (Supabase) → lancer depuis TA machine :
 *   set -a && source .env && set +a
 *   node scripts/internal-link-finder.mjs
 *
 * Sortie : seo/state/internal-link-queue.md (tu approuves avant tout ajout réel).
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!URL || !KEY) { console.error('❌ env manquant (SUPABASE_URL + une clé)'); process.exit(1); }
const sb = createClient(URL, KEY);

// Segment d'URL des fiches cartes par marché
const SEG = { fr: 'cartes', be: 'cartes', de: 'karten', at: 'karten', es: 'tarjetas', it: 'carte', en: 'cards' };
const LANGS = ['fr', 'de', 'es', 'it', 'en']; // be/at partagent le contenu fr/de

// Money pages = fiches cartes principales (marque facile à repérer dans le texte)
const MONEY = [
  { brand: 'Nexo', card: 'nexo-card' },
  { brand: 'Crypto.com', card: 'crypto-com-card' },
  { brand: 'Bybit', card: 'bybit-card' },
  { brand: 'Bitpanda', card: 'bitpanda-card' },
  { brand: 'Wirex', card: 'wirex-card' },
  { brand: 'Revolut', card: 'revolut-card' },
  { brand: 'Coinbase', card: 'coinbase-card' },
  { brand: 'Gnosis Pay', card: 'gnosis-pay-card' },
  { brand: 'Brighty', card: 'brighty-card' },
  { brand: 'MetaMask', card: 'metamask-card' },
];

const MAX_PER_MONEY = 5;
let md = `# File — opportunités de liens internes\nGénéré le ${new Date().toISOString().slice(0,10)} par A7. LECTURE SEULE.\nApprouve une ligne → ajoute le lien à la main (ou via un futur maker) dans le post source.\n\n`;
let total = 0;

for (const { brand, card } of MONEY) {
  for (const lang of LANGS) {
    // posts qui MENTIONNENT la marque mais ne LIENT pas déjà la fiche (slug absent)
    const { data, error } = await sb
      .from('blog_posts')
      .select('slug,title')
      .eq('lang', lang)
      .eq('published', true)
      .ilike('content', `%${brand}%`)
      .not('content', 'ilike', `%${card}%`)
      .limit(MAX_PER_MONEY);
    if (error) { console.error(`✗ ${brand}/${lang}: ${error.message}`); continue; }
    if (!data?.length) continue;
    const target = `/${lang}/${SEG[lang]}/${card}`;
    md += `## → ${target}  (ancre : « ${brand} »)\n`;
    for (const p of data) {
      md += `- [ ] depuis **/${lang}/blog/${p.slug}** — « ${p.title.slice(0,60)} »\n`;
      total++;
    }
    md += '\n';
  }
}

md += `\n---\nTotal : ${total} opportunités. Cap conseillé : n'ajoute pas plus de ~10 liens/semaine pour rester naturel.\n`;
try {
  writeFileSync(new URL('../seo/state/internal-link-queue.md', import.meta.url), md);
  console.log(`✓ seo/state/internal-link-queue.md — ${total} opportunités`);
} catch { console.log(md); }
