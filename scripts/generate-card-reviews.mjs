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
  const pct = (v) => (((v || 0) * 100)).toFixed(1).replace(/\.0$/, '');
  const base = card.cashback_base || 0;
  const noStk = card.cashback_no_staking || 0;
  const premium = card.cashback_premium || 0;
  const cashbackFacts = `base ${pct(base)}%` +
    (noStk ? `, sans staking ${pct(noStk)}%` : '') +
    (premium ? `, maximum ${pct(premium)}% (conditionnel)` : '') +
    (base === 0 && noStk === 0 && premium > 0 ? ` — ATTENTION : 0% sans staking, le ${pct(premium)}% exige un blocage` : '') +
    (base === 0 && noStk === 0 && premium === 0 ? ' — cette carte N\'OFFRE AUCUN cashback' : '');
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
- Cashback (crypto) : ${cashbackFacts}
- Staking : ${stakingStr}
- Juridiction / régulateur de l'émetteur : ${card.issuer_jurisdiction || card.regulation || 'NON FOURNI — ne pas inventer'}
- Disponible en France : ${availFR ? 'Oui' : 'Non'}
- Disponible en UE : ${availEU ? 'Oui' : 'Non'}
${card.extras?.length ? `- Fonctionnalités extras : ${card.extras.join(', ')}` : ''}
${card.trust_score ? `- Score de confiance : ${card.trust_score}/100` : ''}

RÈGLES D'HONNÊTETÉ (ABSOLUES — priment sur tout le reste) :
- JAMAIS présenter le cashback maximum comme le taux « réel » : toujours formuler « jusqu'à X% (base Y%, le maximum exige un staking/palier) ».
- Si la base est 0% : le dire clairement et NE JAMAIS écrire « rentable dès le premier euro » ni équivalent (c'est faux).
- Si la carte n'offre aucun cashback : l'indiquer franchement, ne pas inventer d'avantage cashback.
- Le verdict doit être NUANCÉ et conditionnel (« pour tel profil… ; à éviter si… »). INTERDIT : « hautement recommandée », « excellent choix » de façon systématique, superlatifs gratuits.
- Régulation/sécurité : n'affirmer QUE ce qui est fourni ci-dessus. Ne JAMAIS inventer un régulateur (ex. FCA) ni une « longue expérience » pour une société récente. Si la juridiction n'est pas fournie, rester prudent (« vérifiez le statut réglementaire de l'émetteur »).
- Pas de promesses de gains, pas de ton publicitaire. Nuance = citabilité IA + confiance.

Instructions de rédaction :
- Langue : ${langName} UNIQUEMENT
- Longueur : 1000–1400 mots
- Format : HTML (balises <h2>, <h3>, <p>, <ul>, <li>, <strong>)
- Ton : Expert, objectif, orienté aide à la décision — honnête avant d'être positif
- Angle : Avis de rédaction indépendante, pas de langue de bois
- Obligatoire : inclure les sections suivantes dans cet ordre :
  1. Introduction (2-3 phrases d'accroche, résumé rapide)
  2. <h2>Présentation de la [nom carte]</h2> (carte, émetteur, historique rapide)
  3. <h2>Cashback et récompenses</h2> (détailler le système de cashback, cryptos reçues, conditions)
  4. <h2>Frais et conditions</h2> (frais annuels, staking, limites de retrait, frais cachés)
  5. <h2>Pour qui est cette carte ?</h2> (profils idéaux, cas d'usage)
  6. <h2>Avantages</h2> (liste <ul>)
  7. <h2>Inconvénients</h2> (liste <ul>, soyez honnêtes)
  8. <h2>Notre verdict</h2> (verdict NUANCÉ par profil : pour qui oui, pour qui non — jamais une recommandation systématique)
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

/* ── Generator ───────────────────────────────────────────────────────────────
   On force une sortie structurée via « tool use » : l'API renvoie directement
   un objet déjà parsé (tool_use.input), ce qui élimine toute la classe d'erreurs
   d'échappement JSON (guillemets / sauts de ligne non échappés dans le HTML,
   fréquents en allemand) qui faisaient échouer le JSON.parse manuel. */
const REVIEW_TOOL = {
  name: 'submit_review',
  description: "Enregistre l'avis rédigé sur la carte crypto.",
  input_schema: {
    type: 'object',
    properties: {
      meta_title:       { type: 'string', description: 'Titre SEO 55–65 caractères, incluant le nom de la carte et l\'année.' },
      meta_description: { type: 'string', description: 'Meta description 145–160 caractères, avec chiffres clés.' },
      excerpt:          { type: 'string', description: 'Résumé 1-2 phrases, max 200 caractères.' },
      content:          { type: 'string', description: 'Article complet en HTML (h2/h3/p/ul/li/strong), 1000–1400 mots, se terminant par le bloc FAQ.' },
    },
    required: ['meta_title', 'meta_description', 'excerpt', 'content'],
  },
};

async function generateReview(card, lang) {
  console.log(`  Generating "${card.id}" [${lang}]…`);
  const prompt = buildPrompt(card, lang);

  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const msg = await anthropic.messages.create({
      model: lang === 'fr' ? 'claude-opus-4-6' : 'claude-sonnet-4-6',
      max_tokens: 16000,
      tools: [REVIEW_TOOL],
      tool_choice: { type: 'tool', name: 'submit_review' },
      messages: [{ role: 'user', content: prompt }],
    });

    const block = msg.content.find(b => b.type === 'tool_use' && b.name === 'submit_review');
    if (block && block.input && block.input.content) {
      return block.input;
    }

    lastErr = new Error(msg.stop_reason === 'max_tokens'
      ? 'réponse tronquée (max_tokens)'
      : 'pas de tool_use submit_review exploitable');
    console.error(`    ⚠️ "${card.id}" [${lang}] échec (tentative ${attempt}/2) : ${lastErr.message}`);
  }

  console.error(`    ❌ Échec définitif "${card.id}" [${lang}]: ${lastErr?.message}`);
  throw new Error('generation failed');
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
  // --needs-fix : ne régénère QUE les articles contenant des tournures trompeuses
  // (survente du cashback max, recommandation systématique) — ciblage coût.
  const needsFixMode = args.includes('--needs-fix');
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
    .select('id, name, issuer, card_network, cashback_base, cashback_no_staking, cashback_premium, annual_fees, staking_required, available_france, available_eu, extras, trust_score')
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

  // --needs-fix : repère les articles à tournures trompeuses (à régénérer en priorité).
  const HYPE_RE = /first euro|premier euro|primer euro|primo euro|primeiro euro|ersten euro|highly recommend|hautement recommand|altamente recomendad|vivamente consigliat|sehr empfehlenswert|excellent choice|excellent choix/i;
  const needsFixSet = new Set(
    (existing || [])
      .filter((r) => r.content && HYPE_RE.test(r.content))
      .map((r) => `${r.card_id}::${r.lang}`)
  );
  if (needsFixMode) {
    console.log(`\n🔎 --needs-fix : ${needsFixSet.size} article(s) à tournures trompeuses détecté(s) et à régénérer.\n`);
    if (needsFixSet.size === 0) { console.log('Rien à corriger. ✅'); return; }
  }

  for (const card of cards) {
    for (const lang of selectedLangs) {
      const key = `${card.id}::${lang}`;
      if (needsFixMode && !needsFixSet.has(key)) { continue; } // hors périmètre --needs-fix
      if (needsFixMode) { /* force regen des articles ciblés */ }
      else if (existingSet.has(key) && !forceRegen) {
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
