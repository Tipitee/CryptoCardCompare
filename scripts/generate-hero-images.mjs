#!/usr/bin/env node
/**
 * generate-hero-images.mjs
 * Génère des images hero pour les articles blog via Together AI (FLUX.1-schnell).
 * Bypasse Anthropic — le prompt est construit localement.
 *
 * Usage :
 *   node scripts/generate-hero-images.mjs              # génère les articles sans image
 *   node scripts/generate-hero-images.mjs --list       # audit seulement (sans générer)
 *   node scripts/generate-hero-images.mjs --lang=fr    # filtre par langue
 *   node scripts/generate-hero-images.mjs --slug=xxx   # un seul article
 *   node scripts/generate-hero-images.mjs --force      # régénère même si image existante
 *
 * Env vars :
 *   set -a && source .env && set +a
 *   TOGETHER_API_KEY, SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_KEY (ou SUPABASE_SERVICE_ROLE_KEY)
 */

import { createClient } from '@supabase/supabase-js';

/* ── Config ──────────────────────────────────────────────────────────────── */
const TOGETHER_KEY = process.env.TOGETHER_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── Args ────────────────────────────────────────────────────────────────── */
const args     = process.argv.slice(2);
const listOnly = args.includes('--list');
const force    = args.includes('--force');
const langArg  = args.find(a => a.startsWith('--lang='))?.replace('--lang=', '');
const slugArg  = args.find(a => a.startsWith('--slug='))?.replace('--slug=', '');

if (!listOnly && !TOGETHER_KEY) {
  console.error('❌ Missing TOGETHER_API_KEY (required for image generation)');
  process.exit(1);
}

/* ── Prompt builder ──────────────────────────────────────────────────────── */
const STYLES = [
  'dark background, neon cyan and green accents, abstract crypto blockchain aesthetic, cinematic lighting',
  'dark background with subtle gradient, glowing cyan and purple geometric shapes, modern tech aesthetic, dramatic shadows',
  'deep blue and black gradient background, emerald green accents, holographic digital art style, volumetric lighting',
  'dark space-like background, bright cyan highlights, abstract connectivity patterns, sleek futuristic design',
  'charcoal background with neon cyan lines, minimalist geometric composition, intense dramatic lighting, tech noir style',
];

const THEMES = {
  cashback:  'cryptocurrency rewards flying coins cashback concept',
  carte:     'premium crypto debit card floating holographic surface',
  bitcoin:   'Bitcoin BTC symbol golden digital glow',
  ethereum:  'Ethereum ETH diamond shape purple ethereal glow',
  solana:    'Solana SOL abstract gradient purple teal',
  bnb:       'Binance BNB coin golden network nodes',
  staking:   'blockchain staking nodes interconnected network glowing',
  frais:     'financial fees comparison chart minimalist digital',
  securite:  'cybersecurity shield lock digital encryption neon',
  defi:      'decentralized finance DeFi protocol nodes abstract web',
  impots:    'tax financial document crypto declaration abstract',
  kyc:       'identity verification digital passport biometric scan',
  retrait:   'ATM cash withdrawal crypto conversion machine',
  europe:    'European Union map crypto payment network constellation',
  visa:      'payment network card contactless NFC terminal glow',
  virtuelle: 'virtual digital card holographic floating interface',
  faillite:  'financial risk warning shield cryptocurrency vault',
  defaut:    'cryptocurrency payment card digital finance abstract futuristic',
};

function buildPrompt(post) {
  const style    = STYLES[Math.floor(Math.random() * STYLES.length)];
  const haystack = `${post.title} ${post.slug}`.toLowerCase();

  let theme = THEMES.defaut;
  for (const [key, val] of Object.entries(THEMES)) {
    if (haystack.includes(key)) { theme = val; break; }
  }

  return `Cinematic hero image, ${theme}, ${style}, no text, no letters, no logos, no watermarks, 16:9 ratio, ultra high quality`;
}

/* ── Together AI ─────────────────────────────────────────────────────────── */
async function generateImage(prompt) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOGETHER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt,
        width: 1360,
        height: 768,
        steps: 4,
        n: 1,
        response_format: 'b64_json',
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (attempt < 3 && res.status >= 500) {
        console.warn(`    ⚠️  Attempt ${attempt} failed (${res.status}), retrying…`);
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      throw new Error(`Together AI ${res.status}: ${txt.slice(0, 200)}`);
    }

    const result = await res.json();
    const b64 = result?.data?.[0]?.b64_json;
    if (!b64) throw new Error('No image data in Together AI response');
    return b64;
  }
}

/* ── Supabase Storage upload ─────────────────────────────────────────────── */
async function uploadImage(b64, slug) {
  const fileName = `${slug}-${Date.now()}.jpg`;
  const buffer   = Buffer.from(b64, 'base64');

  const { error } = await supabase.storage
    .from('blog-hero-images')
    .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: false });

  if (error) throw new Error(`Storage: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from('blog-hero-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

/* ── DB update ───────────────────────────────────────────────────────────── */
async function saveUrl(id, url) {
  const { error } = await supabase.from('blog_posts').update({ image_hero: url }).eq('id', id);
  if (error) throw new Error(`DB: ${error.message}`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  // Fetch ALL posts for audit (no image_hero filter here)
  console.log('\n📥 Fetching all blog posts…');
  let query = supabase
    .from('blog_posts')
    .select('id, slug, lang, title, image_hero')
    .order('lang')
    .order('slug');

  if (langArg) query = query.eq('lang', langArg);
  if (slugArg) query = query.eq('slug', slugArg);

  const { data: allPosts, error } = await query;
  if (error) { console.error('Fetch error:', error.message); process.exit(1); }
  if (!allPosts?.length) { console.log('No posts found.'); return; }

  const withImage    = allPosts.filter(p => p.image_hero);
  const withoutImage = allPosts.filter(p => !p.image_hero);

  // ── Audit display ──
  console.log(`\n📊 Audit — ${allPosts.length} articles total`);
  console.log(`   ✅ Avec image    : ${withImage.length}`);
  console.log(`   ❌ Sans image    : ${withoutImage.length}`);

  if (withoutImage.length > 0) {
    console.log('\n  Articles sans image :');
    // Group by lang
    const byLang = withoutImage.reduce((acc, p) => {
      (acc[p.lang] = acc[p.lang] || []).push(p);
      return acc;
    }, {});
    for (const [lang, posts] of Object.entries(byLang)) {
      console.log(`\n  [${lang}] — ${posts.length} article(s)`);
      for (const p of posts) {
        console.log(`    • ${p.slug}`);
      }
    }
  }

  if (listOnly) {
    console.log('\n(mode --list : aucune génération lancée)\n');
    return;
  }

  // ── Determine what to generate ──
  const toGenerate = force ? allPosts : withoutImage;

  if (toGenerate.length === 0) {
    console.log('\n✨ Tous les articles ont déjà une image. Utilisez --force pour régénérer.\n');
    return;
  }

  console.log(`\n🚀 Génération de ${toGenerate.length} image(s)${force ? ' (--force)' : ''}…\n`);
  let ok = 0, fail = 0;

  for (const post of toGenerate) {
    const prompt = buildPrompt(post);
    console.log(`  🎨 [${post.lang}] ${post.slug}`);

    try {
      const b64 = await generateImage(prompt);
      const url = await uploadImage(b64, post.slug);
      await saveUrl(post.id, url);
      console.log(`     ✅ OK`);
      ok++;
    } catch (err) {
      console.error(`     ❌ ${err.message}`);
      fail++;
    }

    if (toGenerate.length > 1) await sleep(2000);
  }

  console.log(`\nDone. ${ok} générées, ${fail} échecs.\n`);
}

main();
