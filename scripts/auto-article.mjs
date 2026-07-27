#!/usr/bin/env node
/**
 * Pipeline d'articles automatique — TopCryptoCards.
 * FR premium (Sonnet) → quality gate → localisation ADAPTÉE de/es/it/en (+be/at)
 * → quality gate sur chaque → insertion Supabase.
 *
 * MODE HYBRIDE (décidé avec l'utilisateur) :
 *   --mode new       (défaut) : articles NEUFS → published=false (brouillon), tu approuves.
 *   --mode refresh            : rafraîchit une page existante → published=true + publie (faible risque).
 *   --dry-run                 : génère + gate + affiche, n'insère RIEN. À lancer en premier.
 *
 * Réseau requis (Anthropic + Supabase) → tourne sur TA machine :
 *   set -a && source .env && set +a
 *   node scripts/auto-article.mjs --dry-run
 *   node scripts/auto-article.mjs                 # 1 article neuf en brouillon
 *   node scripts/auto-article.mjs --mode refresh  # 1 refresh auto-publié
 *
 * Garde-fous : 1 sujet par run, quality gate DUR sur chaque langue (rejet = skip + log),
 * jamais de full-auto sur du neuf. Cadence conseillée : lun/mer/ven (voir launchd plist).
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const MODEL = process.env.WRITER_MODEL || 'claude-sonnet-4-6';
const DRY = process.argv.includes('--dry-run');
const MODE = (process.argv.includes('--mode') ? process.argv[process.argv.indexOf('--mode') + 1] : 'new');

const AKEY = process.env.ANTHROPIC_API_KEY;
const SURL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SKEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!AKEY || !SURL || !SKEY) { console.error('❌ env manquant : ANTHROPIC_API_KEY + SUPABASE_URL + SERVICE key'); process.exit(1); }
const ai = new Anthropic({ apiKey: AKEY });
const sb = createClient(SURL, SKEY);

const ROOT = new URL('..', import.meta.url);
const P = rel => new URL(rel, ROOT);

// Marchés : langue de contenu + note d'adaptation pays (JAMAIS traduire)
const MARKETS = {
  fr: { name: 'français', locale: 'fr-FR', tax: 'flat tax 30% (PFU)', reg: 'AMF/ACPR', note: 'France' },
  de: { name: 'Deutsch',  locale: 'de-DE', tax: '§23 EStG — steuerfrei nach 1 Jahr Haltefrist, Freigrenze 1000€', reg: 'BaFin', note: 'Deutschland' },
  es: { name: 'español',  locale: 'es-ES', tax: 'IRPF base del ahorro 19-28% + modelo 721', reg: 'CNMV', note: 'España' },
  it: { name: 'italiano', locale: 'it-IT', tax: 'imposta sostitutiva 26% + quadro RW', reg: 'CONSOB/OAM', note: 'Italia' },
  en: { name: 'English (UK)', locale: 'en-GB', tax: 'UK Capital Gains Tax + annual allowance', reg: 'FCA', note: 'United Kingdom' },
};
// be hérite du contenu fr mais adapte la fiscalité belge ; at hérite de de + fiscalité autrichienne
const MARKET_VARIANTS = {
  be: { base: 'fr', tax: 'Belgique : régime des revenus divers / plus-values selon gestion, pas de flat tax FR', reg: 'FSMA', note: 'Belgique' },
  at: { base: 'de', tax: 'Österreich : 27,5% KESt (Kapitalertragsteuer)', reg: 'FMA', note: 'Österreich' },
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function claude(prompt, maxTokens = 8192) {
  const m = await ai.messages.create({ model: MODEL, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] });
  return m.content[0].text.trim();
}
function stripJson(s) { return s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim(); }

// Quality gate A11 en sous-processus (source unique de vérité)
const REPO_DIR = fileURLToPath(ROOT);
function gate(markdown) {
  try {
    execSync('node scripts/quality-gate.mjs --stdin', { input: markdown, cwd: REPO_DIR, stdio: ['pipe', 'pipe', 'pipe'] });
    return { pass: true };
  } catch (e) {
    return { pass: false, report: (e.stdout || Buffer.from('')).toString() };
  }
}

// Fiche de données datée (faits citables) — top cartes depuis Supabase
async function feeSheet() {
  const { data } = await sb.from('cards')
    .select('name,issuer,cashback_base,cashback_premium,annual_fees,staking_required,virtual_only,trust_score')
    .order('trust_score', { ascending: false }).limit(15);
  const today = new Date().toISOString().slice(0, 10);
  const rows = (data || []).map(c => `- ${c.name} (${c.issuer}) : cashback ${c.cashback_base}–${c.cashback_premium}%, frais annuels ${c.annual_fees}€, staking ${c.staking_required ? 'requis' : 'non'}${c.virtual_only ? ', virtuelle' : ''}`).join('\n');
  return `Données vérifiées le ${today} (source : base TopCryptoCards) :\n${rows}`;
}

const BRAND_VOICE = readFileSync(P('seo/your-site/brand-voice.md'), 'utf8').slice(0, 1500);

function frPrompt(topic, facts) {
  return `Tu es analyste cartes crypto pour topcryptocards.eu, comparateur indépendant. Tu as réellement testé les cartes. Rédige un article de blog EN FRANÇAIS, premium, "people-first", sur le sujet : « ${topic.title} » (mot-clé cible : ${topic.keyword}).

VOIX DE MARQUE (extrait) :
${BRAND_VOICE}

FAITS À UTILISER (cite-les, datés) :
${facts}

RÈGLES OBLIGATOIRES (elles seront vérifiées automatiquement, un échec = rejet) :
- Réponse directe à l'intention dès les 100 premiers mots, avec un chiffre concret.
- Les H2 (##) sont de VRAIES questions que se posent les acheteurs.
- Une section FAQ avec 3-5 questions/réponses.
- Au moins un lien interne markdown vers une money page, ex : [meilleure carte crypto](/fr/meilleure-carte-crypto) ou une fiche [Nexo Card](/fr/cartes/nexo-card).
- Mentionne "vérifié en ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}".
- Longueur 1000-1500 mots. Aucun cliché ("dans le monde en constante évolution"...). Pas de conseil financier personnalisé, pas de stat non sourcée.
- Honnête : dire pour QUI la carte n'est pas adaptée.

Rends UNIQUEMENT le corps markdown de l'article (commence par un # H1). Pas de préambule.`;
}

async function meta(frBody, topic) {
  const raw = await claude(`À partir de cet article FR, renvoie UNIQUEMENT un JSON (sans wrapper) :
{"slug":"slug-url-fr-40-70-car-avec-mot-cle","meta_title":"55-65 car avec mot-clé","meta_description":"145-160 car, accrocheur","excerpt":"résumé 2-3 phrases","tags":["3-5 tags"]}
Mot-clé : ${topic.keyword}
Article :
${frBody.slice(0, 1500)}`, 1024);
  return JSON.parse(stripJson(raw));
}

function locPrompt(frBody, lang) {
  const m = MARKETS[lang];
  return `Tu es rédacteur SEO expert pour topcryptocards.eu. ADAPTE (ne traduis PAS mot à mot) cet article FR pour le marché ${m.note} en ${m.name}.

ADAPTATION PAYS OBLIGATOIRE — remplace les éléments FR par ceux de CE marché :
- Fiscalité : ${m.tax}
- Régulateur : ${m.reg}
- Disponibilité réelle des cartes, devise, banques locales pour les exemples SEPA.
- Une variante n'est JAMAIS une simple traduction. DE≠AT, fr≠be, en=UK.
Garde la structure (H2 en questions, FAQ, lien interne — adapte le chemin : /${lang}/…), la profondeur, les faits chiffrés, la mention de fraîcheur.
Garde les noms de marques de cartes en anglais.

Rends UNIQUEMENT le corps markdown en ${m.name}. Article source FR :
${frBody}`;
}

// ─────────────────────────────────────────────────────────────────────────
async function runNew() {
  // Sélection du prochain sujet dans le backlog
  const backlogPath = P('seo/state/article-backlog.csv');
  const lines = readFileSync(backlogPath, 'utf8').trim().split('\n');
  const header = lines[0];
  const rows = lines.slice(1).map(l => l.split(','));
  const idx = rows.findIndex(r => (r[3] || '').trim() === 'todo');
  if (idx === -1) { console.log('Backlog vide (aucun sujet "todo"). Ajoute des lignes dans seo/state/article-backlog.csv.'); return; }
  const [keyword, title, category] = rows[idx];
  const topic = { keyword: keyword.trim(), title: title.trim(), category: (category || 'guide').trim() };
  console.log(`📝 Sujet : « ${topic.title} » (${topic.keyword})`);

  const facts = await feeSheet();
  const frBody = await claude(frPrompt(topic, facts));
  const g = gate(frBody);
  if (!g.pass) { console.log('❌ FR rejeté par le quality gate :\n' + g.report); return; }
  console.log('✅ FR passe le gate');
  const md = await meta(frBody, topic);
  const topicKey = `blog-auto-${md.slug}`.slice(0, 60);

  const variants = [{ lang: 'fr', body: frBody, ...md }];
  for (const lang of ['de', 'es', 'it', 'en']) {
    await sleep(800);
    const body = await claude(locPrompt(frBody, lang));
    const lg = gate(body);
    if (!lg.pass) { console.log(`⚠️ ${lang} rejeté, ignoré`); continue; }
    await sleep(600);
    const lmeta = await meta(body, topic);
    variants.push({ lang, body, ...lmeta });
    console.log(`✅ ${lang} adapté + gate OK`);
  }

  if (DRY) {
    console.log(`\n[dry-run] ${variants.length} variantes générées (fr + ${variants.length - 1}). Rien inséré.`);
    console.log('Aperçu FR (300 car) :\n' + frBody.slice(0, 300));
    return;
  }

  for (const v of variants) {
    const row = {
      lang: v.lang, slug: v.slug, title: v.title, excerpt: v.excerpt,
      content: v.body, meta_title: v.meta_title, meta_description: v.meta_description,
      topic_key: topicKey, category: topic.category, tags: v.tags || [],
      published: false, // NEUF = brouillon (mode hybride)
    };
    const { error } = await sb.from('blog_posts').insert(row);
    console.log(error ? `✗ ${v.lang}: ${error.message}` : `✓ brouillon [${v.lang}] ${v.slug}`);
  }
  // marque le backlog done + log drafts
  rows[idx][3] = 'done';
  writeFileSync(backlogPath, header + '\n' + rows.map(r => r.join(',')).join('\n') + '\n');
  appendFileSync(P('seo/state/drafts.md'), `\n| ${topicKey} | ${variants.map(v => v.lang).join('+')} | gate PASS | prêt review (${new Date().toISOString().slice(0,10)}) |`);
  console.log(`\n✅ ${variants.length} brouillons prêts. Relis puis :\n  node scripts/publish-drafts.mjs ${variants.map(v => v.slug).join(' ')}`);
}

async function runRefresh() {
  // Prend la 1re page de refresh-queue (produite par A5 decay-tracker)
  let queue;
  try { queue = readFileSync(P('seo/state/refresh-queue.md'), 'utf8'); } catch { console.log('Pas de refresh-queue.'); return; }
  const m = queue.match(/\/(fr|be|de|at|es|it|en)\/blog\/([a-z0-9-]+)/);
  if (!m) { console.log('Aucune page à rafraîchir dans seo/state/refresh-queue.md (lance A5 d\'abord).'); return; }
  const [, lang, slug] = m;
  const { data } = await sb.from('blog_posts').select('*').eq('lang', lang).eq('slug', slug).maybeSingle();
  if (!data) { console.log(`Page introuvable : ${lang}/${slug}`); return; }
  console.log(`♻️ Refresh : [${lang}] ${slug}`);

  const facts = await feeSheet();
  const body = await claude(`Rafraîchis cet article de blog crypto (${lang}) : mets à jour les données périmées avec les faits ci-dessous, ajoute une section sur ce qui a changé en ${new Date().getFullYear()}, renforce la FAQ, garde le slug et la structure. Mentionne "mis à jour ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}".

FAITS DATÉS :
${facts}

ARTICLE ACTUEL :
${data.content}

Rends UNIQUEMENT le corps markdown mis à jour.`);
  const g = gate(body);
  if (!g.pass) { console.log('❌ Refresh rejeté par le gate :\n' + g.report); return; }
  console.log('✅ Refresh passe le gate');

  if (DRY) { console.log('[dry-run] refresh généré, non appliqué. Aperçu :\n' + body.slice(0, 300)); return; }

  const { error } = await sb.from('blog_posts').update({ content: body, published: true }).eq('id', data.id);
  if (error) { console.log('✗ ' + error.message); return; }
  console.log('✓ page mise à jour + published=true');
  console.log('\nÉtapes de publication (refresh = auto) :');
  console.log('  node scripts/gen-blog-sitemap.mjs && git add -A && git commit -m "content: auto-refresh ' + slug + '" && git push');
}

console.log(`Mode: ${MODE}${DRY ? ' (dry-run)' : ''} · modèle: ${MODEL}`);
if (MODE === 'refresh') await runRefresh(); else await runNew();
