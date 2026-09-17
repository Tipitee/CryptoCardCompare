#!/usr/bin/env node
/**
 * localize-title-tags.mjs
 * Garantit que le `title` ET les `tags` de chaque blog_posts sont dans la langue
 * du marché (fr/be=français, de/at=allemand, es, it, en=anglais UK, pt=pt-PT).
 *
 * Pour chaque article, un LLM vérifie la langue du titre et des tags :
 *   - déjà corrects dans la bonne langue  → renvoyés VERBATIM (aucune écriture)
 *   - dans une autre langue               → localisés (adaptés, pas traduits mot à mot)
 * Les noms de marques/produits (Nexo, Binance, Bitcoin, MiCA, SEPA, Visa…) restent tels quels.
 *
 * Usage :
 *   set -a && source .env && set +a
 *   node scripts/localize-title-tags.mjs                 # dry-run (n'écrit rien)
 *   node scripts/localize-title-tags.mjs --apply         # applique
 *   node scripts/localize-title-tags.mjs --lang=en       # un seul marché
 *   node scripts/localize-title-tags.mjs --limit=20      # limite le nombre traité
 *   node scripts/localize-title-tags.mjs --slug=xxx      # un seul slug (toutes langues)
 *
 * Env : ANTHROPIC_API_KEY, SUPABASE_URL (ou VITE_SUPABASE_URL),
 *       SUPABASE_SERVICE_KEY (ou SUPABASE_SERVICE_ROLE_KEY)
 *       WRITER_MODEL optionnel (défaut : claude-haiku-4-5-20251001)
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const AKEY = process.env.ANTHROPIC_API_KEY;
const SURL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SKEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!AKEY || !SURL || !SKEY) {
  console.error('❌ env manquant : ANTHROPIC_API_KEY + SUPABASE_URL + SERVICE key');
  process.exit(1);
}

const ai = new Anthropic({ apiKey: AKEY });
const sb = createClient(SURL, SKEY);
const MODEL = process.env.WRITER_MODEL || 'claude-haiku-4-5-20251001';

const args    = process.argv.slice(2);
const apply   = args.includes('--apply');
const langArg = args.find(a => a.startsWith('--lang='))?.replace('--lang=', '');
const slugArg = args.find(a => a.startsWith('--slug='))?.replace('--slug=', '');
const limitArg = Number(args.find(a => a.startsWith('--limit='))?.replace('--limit=', '')) || 0;

// Langue cible par marché (be=français Belgique, at=allemand Autriche, en=anglais UK, pt=pt-PT)
const LANG_NAME = {
  fr: 'français (France)',
  be: 'français (Belgique)',
  de: 'allemand (Deutsch)',
  at: 'allemand (Österreich)',
  es: 'espagnol (español)',
  it: 'italien (italiano)',
  en: 'anglais britannique (English, UK)',
  pt: 'portugais européen (português de Portugal, pt-PT — JAMAIS brésilien)',
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const stripJson = s => s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

function buildPrompt(post) {
  const langName = LANG_NAME[post.lang] || post.lang;
  const excerpt = (post.content || '').replace(/\s+/g, ' ').slice(0, 500);
  return `Tu es rédacteur SEO multilingue pour topcryptocards.eu (comparateur de cartes crypto).

Marché de cet article : ${langName}.

Titre actuel : ${JSON.stringify(post.title || '')}
Tags actuels : ${JSON.stringify(post.tags || [])}
Extrait du contenu (contexte) : "${excerpt}"

TÂCHE : renvoie le titre et les tags DANS LA LANGUE DU MARCHÉ (${langName}).
RÈGLES :
- Si le titre est DÉJÀ entièrement dans la bonne langue et correct, renvoie-le À L'IDENTIQUE (mot pour mot).
- Sinon, ADAPTE-le (pas de traduction mot à mot) dans la langue du marché, en gardant le sens et le mot-clé SEO. 55-65 caractères idéalement.
- Chaque tag doit être dans la langue du marché. Garde le même NOMBRE de tags et le même concept ; localise ceux qui ne le sont pas, laisse à l'identique ceux qui le sont déjà.
- Les noms de marques/produits/protocoles/monnaies restent tels quels dans toutes les langues : Nexo, Binance, Coinbase, Wirex, Bitcoin, Ethereum, MiCA, SEPA, Visa, Mastercard, KESt, IRPF, etc.
- Pas de guillemets superflus, pas de suffixe " | TopCryptoCards".

Renvoie UNIQUEMENT ce JSON (sans wrapper) :
{"title":"...","tags":["...","..."]}`;
}

async function localize(post) {
  const raw = await ai.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [{ role: 'user', content: buildPrompt(post) }],
  });
  const parsed = JSON.parse(stripJson(raw.content[0].text.trim()));
  const title = typeof parsed.title === 'string' ? parsed.title.trim() : post.title;
  const tags = Array.isArray(parsed.tags) ? parsed.tags.map(t => String(t).trim()).filter(Boolean) : post.tags;
  return { title, tags };
}

const sameTags = (a, b) =>
  Array.isArray(a) && Array.isArray(b) &&
  a.length === b.length &&
  a.every((t, i) => t === b[i]);

async function main() {
  console.log(`\n📥 Récupération des blog_posts${langArg ? ` [lang=${langArg}]` : ''}${slugArg ? ` [slug=${slugArg}]` : ''}…`);
  let query = sb.from('blog_posts')
    .select('id, lang, slug, title, tags, content')
    .order('lang').order('slug');
  if (langArg) query = query.eq('lang', langArg);
  if (slugArg) query = query.eq('slug', slugArg);

  let { data: posts, error } = await query;
  if (error) { console.error('Fetch error:', error.message); process.exit(1); }
  if (!posts?.length) { console.log('Aucun article.'); return; }
  if (limitArg) posts = posts.slice(0, limitArg);

  console.log(`\n🔎 ${posts.length} articles à vérifier (modèle : ${MODEL})…\n`);

  const plan = [];
  let checked = 0, errors = 0;
  for (const post of posts) {
    checked++;
    try {
      const { title, tags } = await localize(post);
      const titleChanged = title && title !== (post.title || '');
      const tagsChanged = !sameTags(tags, post.tags || []);
      if (titleChanged || tagsChanged) {
        plan.push({ ...post, newTitle: title, newTags: tags, titleChanged, tagsChanged });
        console.log(`  [${post.lang}] ${post.slug}`);
        if (titleChanged) {
          console.log(`     titre : "${post.title}"`);
          console.log(`          → "${title}"`);
        }
        if (tagsChanged) {
          console.log(`     tags  : ${JSON.stringify(post.tags)}`);
          console.log(`          → ${JSON.stringify(tags)}`);
        }
      }
    } catch (e) {
      errors++;
      console.error(`  ⚠️ [${post.lang}] ${post.slug} : ${e.message}`);
    }
    await sleep(300);
  }

  console.log(`\n📊 ${checked} vérifiés — ${plan.length} à corriger${errors ? ` — ${errors} erreurs` : ''}.`);

  if (!apply) {
    console.log('\n(dry-run : aucune écriture. Relancez avec --apply pour appliquer.)\n');
    return;
  }
  if (plan.length === 0) { console.log('✨ Rien à écrire.\n'); return; }

  console.log('\n🚀 Application…\n');
  let ok = 0, fail = 0;
  for (const p of plan) {
    const patch = {};
    if (p.titleChanged) patch.title = p.newTitle;
    if (p.tagsChanged) patch.tags = p.newTags;
    const { error: upErr } = await sb.from('blog_posts').update(patch).eq('id', p.id);
    if (upErr) { console.error(`  ❌ [${p.lang}] ${p.slug} : ${upErr.message}`); fail++; }
    else ok++;
  }
  console.log(`\nDone. ${ok} mis à jour, ${fail} échecs.\n`);
}

main();
