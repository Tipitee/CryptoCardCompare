#!/usr/bin/env node
/**
 * localize-blog-fields.mjs  (remplace localize-title-tags.mjs)
 * Garantit que title, tags, excerpt ET slug de chaque blog_posts sont dans la
 * langue du marché (fr/be=français, de/at=allemand, es, it, en=anglais UK, pt=pt-PT).
 *
 * Un LLM vérifie chaque champ :
 *   - déjà correct dans la bonne langue → renvoyé À L'IDENTIQUE (aucune écriture)
 *   - dans une autre langue             → localisé (adapté, pas traduit mot à mot)
 * Noms de marques/produits/monnaies préservés (Nexo, Binance, Bitcoin, MiCA, SEPA…).
 *
 * SLUG — règle de sécurité : réécrit UNIQUEMENT pour les brouillons (published=false),
 * pour ne jamais casser une URL déjà indexée. Le lien entre variantes passe par
 * topic_key (pas par le slug), donc localiser le slug d'un brouillon est sûr.
 * Collision (même lang+slug sur un autre article) → slug non modifié + avertissement.
 * Utilise --slugs-published pour forcer aussi les publiés (déconseillé sans redirect).
 *
 * Usage :
 *   set -a && source .env && set +a
 *   node scripts/localize-blog-fields.mjs                 # dry-run (n'écrit rien)
 *   node scripts/localize-blog-fields.mjs --apply         # applique
 *   node scripts/localize-blog-fields.mjs --lang=de       # un seul marché
 *   node scripts/localize-blog-fields.mjs --slug=xxx      # un seul slug (toutes langues)
 *   node scripts/localize-blog-fields.mjs --limit=20      # limite
 *   node scripts/localize-blog-fields.mjs --apply --slugs-published   # inclut les publiés
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

const args     = process.argv.slice(2);
const apply    = args.includes('--apply');
const slugsPub = args.includes('--slugs-published');
const langArg  = args.find(a => a.startsWith('--lang='))?.replace('--lang=', '');
const slugArg  = args.find(a => a.startsWith('--slug='))?.replace('--slug=', '');
const limitArg = Number(args.find(a => a.startsWith('--limit='))?.replace('--limit=', '')) || 0;

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

// Normalise un slug : minuscules ASCII, accents retirés, espaces/ponctuation → tiret.
function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function buildPrompt(post) {
  const langName = LANG_NAME[post.lang] || post.lang;
  const excerpt = (post.content || '').replace(/\s+/g, ' ').slice(0, 600);
  return `Tu es rédacteur SEO multilingue pour topcryptocards.eu (comparateur de cartes crypto).

Marché de cet article : ${langName}.

Titre actuel  : ${JSON.stringify(post.title || '')}
Tags actuels  : ${JSON.stringify(post.tags || [])}
Extrait actuel: ${JSON.stringify(post.excerpt || '')}
Slug actuel   : ${JSON.stringify(post.slug || '')}
Contexte (début du contenu) : "${excerpt}"

TÂCHE : renvoie title, tags, excerpt et slug DANS LA LANGUE DU MARCHÉ (${langName}).
RÈGLES :
- Si un champ est DÉJÀ entièrement dans la bonne langue et correct, renvoie-le À L'IDENTIQUE.
- Sinon, ADAPTE-le (pas de traduction mot à mot) dans la langue du marché, en gardant le sens et le mot-clé SEO.
- title : 55-65 caractères idéalement, sans suffixe " | TopCryptoCards".
- tags : même NOMBRE, chaque tag dans la langue du marché ; localise ceux qui ne le sont pas.
- excerpt : 2-3 phrases, dans la langue du marché.
- slug : minuscules ASCII, mots séparés par des tirets, SANS accents, 40-70 caractères, mot-clé localisé + année si pertinent (ex. "krypto-karte-cashback-steuern-2026"). Garde les noms de marques.
- Noms de marques/produits/protocoles/monnaies inchangés partout : Nexo, Binance, Coinbase, Wirex, Bitcoin, Ethereum, MiCA, SEPA, Visa, Mastercard, KESt, IRPF…

Renvoie UNIQUEMENT ce JSON (sans wrapper) :
{"title":"...","tags":["..."],"excerpt":"...","slug":"..."}`;
}

async function localize(post) {
  const raw = await ai.messages.create({
    model: MODEL,
    max_tokens: 640,
    messages: [{ role: 'user', content: buildPrompt(post) }],
  });
  const p = JSON.parse(stripJson(raw.content[0].text.trim()));
  return {
    title:   typeof p.title === 'string' ? p.title.trim() : post.title,
    tags:    Array.isArray(p.tags) ? p.tags.map(t => String(t).trim()).filter(Boolean) : post.tags,
    excerpt: typeof p.excerpt === 'string' ? p.excerpt.trim() : post.excerpt,
    slug:    p.slug ? slugify(p.slug) : post.slug,
  };
}

const sameTags = (a, b) =>
  Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((t, i) => t === b[i]);

// Vérifie qu'aucun autre article de la même langue n'utilise déjà ce slug.
async function slugTaken(lang, slug, selfId) {
  const { data, error } = await sb.from('blog_posts')
    .select('id').eq('lang', lang).eq('slug', slug).neq('id', selfId).limit(1);
  if (error) { console.error(`   (collision check error: ${error.message})`); return true; } // prudence
  return (data || []).length > 0;
}

async function main() {
  console.log(`\n📥 Récupération des blog_posts${langArg ? ` [lang=${langArg}]` : ''}${slugArg ? ` [slug=${slugArg}]` : ''}…`);
  let query = sb.from('blog_posts')
    .select('id, lang, slug, title, tags, excerpt, content, published')
    .order('lang').order('slug');
  if (langArg) query = query.eq('lang', langArg);
  if (slugArg) query = query.eq('slug', slugArg);

  let { data: posts, error } = await query;
  if (error) { console.error('Fetch error:', error.message); process.exit(1); }
  if (!posts?.length) { console.log('Aucun article.'); return; }
  if (limitArg) posts = posts.slice(0, limitArg);

  console.log(`\n🔎 ${posts.length} articles à vérifier (modèle : ${MODEL})…\n`);

  const plan = [];
  let checked = 0, errors = 0, slugSkipped = 0;
  for (const post of posts) {
    checked++;
    try {
      const loc = await localize(post);
      const titleChanged   = loc.title   && loc.title   !== (post.title   || '');
      const tagsChanged    = !sameTags(loc.tags, post.tags || []);
      const excerptChanged = loc.excerpt && loc.excerpt !== (post.excerpt || '');

      // Slug : uniquement brouillons (sauf --slugs-published), + anti-collision.
      let slugChanged = false;
      if (loc.slug && loc.slug !== (post.slug || '')) {
        const allowed = post.published === false || slugsPub;
        if (!allowed) {
          slugSkipped++;
        } else if (await slugTaken(post.lang, loc.slug, post.id)) {
          console.log(`  ⚠️ [${post.lang}] slug "${loc.slug}" déjà pris → conservé "${post.slug}"`);
          slugSkipped++;
        } else {
          slugChanged = true;
        }
      }

      if (titleChanged || tagsChanged || excerptChanged || slugChanged) {
        plan.push({ ...post, loc, titleChanged, tagsChanged, excerptChanged, slugChanged });
        console.log(`  [${post.lang}] ${post.slug}${post.published === false ? ' (brouillon)' : ''}`);
        if (slugChanged)    console.log(`     slug    : "${post.slug}"\n            → "${loc.slug}"`);
        if (titleChanged)   console.log(`     titre   : "${post.title}"\n            → "${loc.title}"`);
        if (excerptChanged) console.log(`     excerpt : "${(post.excerpt||'').slice(0,60)}…"\n            → "${loc.excerpt.slice(0,60)}…"`);
        if (tagsChanged)    console.log(`     tags    : ${JSON.stringify(post.tags)}\n            → ${JSON.stringify(loc.tags)}`);
      }
    } catch (e) {
      errors++;
      console.error(`  ⚠️ [${post.lang}] ${post.slug} : ${e.message}`);
    }
    await sleep(300);
  }

  console.log(`\n📊 ${checked} vérifiés — ${plan.length} à corriger${errors ? ` — ${errors} erreurs` : ''}${slugSkipped ? ` — ${slugSkipped} slugs conservés (publié/collision)` : ''}.`);

  if (!apply) { console.log('\n(dry-run : aucune écriture. Relancez avec --apply pour appliquer.)\n'); return; }
  if (plan.length === 0) { console.log('✨ Rien à écrire.\n'); return; }

  console.log('\n🚀 Application…\n');
  let ok = 0, fail = 0;
  for (const p of plan) {
    const patch = {};
    if (p.titleChanged)   patch.title = p.loc.title;
    if (p.tagsChanged)    patch.tags = p.loc.tags;
    if (p.excerptChanged) patch.excerpt = p.loc.excerpt;
    if (p.slugChanged)    patch.slug = p.loc.slug;
    const { error: upErr } = await sb.from('blog_posts').update(patch).eq('id', p.id);
    if (upErr) { console.error(`  ❌ [${p.lang}] ${p.slug} : ${upErr.message}`); fail++; }
    else ok++;
  }
  console.log(`\nDone. ${ok} mis à jour, ${fail} échecs.\n`);
}

main();
