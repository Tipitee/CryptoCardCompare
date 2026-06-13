#!/usr/bin/env node
/**
 * generate-card-reviews.mjs
 * Génère un avis riche par carte crypto via Claude API et upsert dans card_articles.
 * Ces avis s'affichent directement sur les pages /fr/cartes/[id] (CardDetail.tsx).
 *
 * Usage :
 *   node scripts/generate-card-reviews.mjs              # toutes les cartes
 *   node scripts/generate-card-reviews.mjs binance-card  # une seule carte (par id)
 *   node scripts/generate-card-reviews.mjs --lang=de    # toutes les cartes, en allemand
 *
 * Env vars requises :
 *   ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
 *
 * Chargement depuis .env :
 *   set -a && source .env && set +a
 *   SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_ROLE_KEY node scripts/generate-card-reviews.mjs
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

/* ── Config ──────────────────────────────────────────────────────────────── */
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL  = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: ANTHROPIC_API_KEY, SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY);
const YEAR = new Date().getFullYear();

/* ── Lang config ─────────────────────────────────────────────────────────── */
const LANG_NAMES = {
  fr: 'français',
  de: 'allemand',
  es: 'espagnol',
  it: 'italien',
  en: 'anglais',
};

const LANG_SITE_NAMES = {
  fr: 'topcryptocards.eu',
  de: 'TopCryptoCards (Europe)',
  es: 'TopCryptoCards (Europe)',
  it: 'TopCryptoCards (Europa)',
  en: 'topcryptocards.eu',
};

/* ── Prompt builder ──────────────────────────────────────────────────────── */
function buildPrompt(card, lang) {
  const langName = LANG_NAMES[lang] ?? 'français';
  const siteName = LANG_SITE_NAMES[lang] ?? 'topcryptocards.eu';
  const freeText = card.annual_fees === 0
    ? (lang === 'fr' ? 'gratuite (0 €/an)' : lang === 'de' ? 'kostenlos (0 €/Jahr)' : lang === 'es' ? 'gratuita (0 €/año)' : lang === 'it' ? 'gratuita (0 €/anno)' : 'free (€0/year)')
    : `${card.annual_fees} €/${lang === 'fr' ? 'an' : lang === 'de' ? 'Jahr' : lang === 'es' ? 'año' : lang === 'it' ? 'anno' : 'year'}`;
  const cashback = card.cashback_premium || card.cashback_base || 0;
  const cashbackPct = (cashback * 100).toFixed(1);
  const networkStr = card.card_network || 'Visa/Mastercard';
  const stakingStr = card.staking_required > 0
    ? `${card.staking_required} € minimum`
    : (lang === 'fr' ? 'aucun staking requis' : lang === 'de' ? 'kein Staking erforderlich' : lang === 'es' ? 'sin staking requerido' : lang === 'it' ? 'nessun staking richiesto' : 'no staking required');
  const availFR = card.available_france;
  const availEU = card.available_eu;

  return `Tu es un expert en cartes crypto et en rédaction SEO. Rédige un avis complet en ${langName} pour le site ${siteName} (comparateur de cartes crypto).

Carte à analyser :
- Nom : ${card.name}
- Émetteur : ${card.issuer}
- Réseau : ${networkStr}
- Frais annuels : ${freeText}
- Cashback maximum : ${cashbackPct}% en crypto
- Staking : ${stakingStr}
- Disponible en France : ${availFR ? 'Oui' : 'Non'}
- Disponible en UE : ${availEU ? 'Oui' : 'Non'}
${card.extras?.length ? `- Fonctionnalités extras : ${card.extras.join(', ')}` : ''}
${card.trust_score ? `- Score de confiance : ${card.trust_score}/100` : ''}

Instructions de rédaction :
- Langue : ${langName} UNIQUEMENT
- Longueur : 1000–1400 mots
- Format : HTML (balises <h2>, <h3>, <p>, <ul>, <li>, <strong>)
- Ton : Expert, objectif, orienté aide à la décision
- Angle : Avis de rédaction indépendante, pas de langue de bois
- Obligatoire : inclure les sections suivantes dans cet ordre :
  1. Introduction (2-3 phrases d'accroche, résumé rapide)
  2. <h2>Présentation de la [nom carte]</h2> (carte, émetteur, historique rapide)
  3. <h2>Cashback et récompenses</h2> (détailler le système de cashback, cryptos reçues, conditions)
  4. <h2>Frais et conditions</h2> (frais annuels, staking, limites de retrait, frais cachés)
  5. <h2>Pour qui est cette carte ?</h2> (profils idéaux, cas d'usage)
  6. <h2>Avantages</h2> (liste <ul>)
  7. <h2>Inconvénients</h2> (liste <ul>, soyez honnêtes)
  8. <h2>Notre verdict</h2> (recommandation finale, note implicite)
- Terminer OBLIGATOIREMENT par une section FAQ avec exactement ce wrapper HTML :
  <div data-faq="v1"><h2>FAQ</h2><ul><li><strong>Question ?</strong> Réponse.</li>...</ul></div>
  Inclure 4 questions-réponses pertinentes sur la carte (frais, cashback, staking, disponibilité, sécurité…)
- NE PAS utiliser de balises <html>, <head>, <body>
- Retourner UNIQUEMENT du JSON valide selon ce schéma exact :

{
  "meta_title": "string (55–65 caractères, inclure le nom de la carte et ${YEAR})",
  "meta_description": "string (145–160 caractères, accrocheur avec chiffres clés)",
  "excerpt": "string (1-2 phrases résumant la carte, max 200 caractères)",
  "content": "string (article complet en HTML)"
}`;
}

/* ── Generator ───────────────────────────────────────────────────────────── */
async function generateReview(card, lang) {
  console.log(`  Generating "${card.id}" [${lang}]…`);
  const prompt = buildPrompt(card, lang);

  const msg = await anthropic.messages.create({
    model: lang === 'fr' ? 'claude-opus-4-6' : 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text.trim();
  const jsonStr = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.error(`    ❌ JSON parse error for "${card.id}" [${lang}]. Raw:\n${raw.slice(0, 300)}`);
    throw new Error('JSON parse failed');
  }

  return parsed;
}

/* ── Upsert to card_articles ─────────────────────────────────────────────── */
async function upsertReview(card, lang, generated) {
  const row = {
    card_id: card.id,
    lang,
    published: true,
    title: generated.meta_title,
    excerpt: generated.excerpt,
    content: generated.content,
    meta_title: generated.meta_title,
    meta_description: generated.meta_description,
    tags: [],
  };

  const { error } = await supabase
    .from('card_articles')
    .upsert(row, { onConflict: 'card_id,lang' });

  if (error) {
    console.error(`    ❌ Supabase error for "${card.id}" [${lang}]:`, error.message);
    throw error;
  }

  console.log(`    ✅ Saved "${card.id}" [${lang}]`);
}

/* ── Rate limiting ───────────────────────────────────────────────────────── */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  // Parse args: optional card ID filter + optional lang flag
  const args = process.argv.slice(2);
  const langArg = args.find((a) => a.startsWith('--lang='));
  const targetLang = langArg ? langArg.replace('--lang=', '') : 'fr';
  const forceRegen = args.includes('--force');
  const filterId = args.find((a) => !a.startsWith('--'));

  const allLangs = Object.keys(LANG_NAMES);
  // --lang=all skips FR (already generated with Opus) — use --lang=fr to force FR
  const selectedLangs = targetLang === 'all'
    ? allLangs.filter((l) => l !== 'fr')
    : targetLang.split(',').filter((l) => allLangs.includes(l));

  // Fetch cards from Supabase
  console.log('\n📥 Fetching cards from Supabase…');
  let query = supabase
    .from('cards')
    .select('id, name, issuer, card_network, cashback_base, cashback_premium, annual_fees, staking_required, available_france, available_eu, extras, trust_score')
    .eq('status', 'active')
    .order('name');

  if (filterId) {
    query = query.eq('id', filterId);
  }

  const { data: cards, error } = await query;

  if (error) {
    console.error('Failed to fetch cards:', error.message);
    process.exit(1);
  }

  if (!cards?.length) {
    console.error(filterId ? `No card found with id "${filterId}"` : 'No cards found.');
    process.exit(1);
  }

  const total = cards.length * selectedLangs.length;
  console.log(`\n🚀 Generating reviews for ${cards.length} card(s) × ${selectedLangs.length} lang(s) = ${total} total\n`);

  let success = 0;
  let failed = 0;

  // Pre-fetch existing entries to skip already-generated reviews
  // Only skip if content is substantial (> 1000 chars = not truncated/broken)
  const { data: existing } = await supabase
    .from('card_articles')
    .select('card_id, lang, content')
    .eq('published', true)
    .in('lang', selectedLangs);
  const existingSet = new Set(
    (existing || [])
      .filter((r) => r.content && r.content.length > 1000)
      .map((r) => `${r.card_id}::${r.lang}`)
  );

  for (const card of cards) {
    for (const lang of selectedLangs) {
      if (existingSet.has(`${card.id}::${lang}`)) {
        console.log(`  ⏭ Skip "${card.id}" [${lang}] (already exists)`);
        success++;
        continue;
      }
      try {
        const generated = await generateReview(card, lang);
        await upsertReview(card, lang, generated);
        success++;
      } catch (err) {
        console.error(`  ❌ Failed "${card.id}" [${lang}]:`, err.message);
        failed++;
      }
      // Respect API rate limits (~1 req/sec)
      if (total > 1) await sleep(1500);
    }
  }

  console.log(`\n✅ Done. ${success} saved, ${failed} failed.\n`);
}

main();
