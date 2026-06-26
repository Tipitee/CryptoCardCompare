#!/usr/bin/env node
/**
 * generate-orphan-articles.mjs
 * Generates 20 blog articles for the 4 orphan thematic pages:
 *   virtual, no-kyc, beginner, 2026 — in all 5 languages (fr/de/es/it/en)
 *
 * Slugs match exactly what ThematicPage.tsx expects in RELATED_ARTICLES.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/generate-orphan-articles.mjs
 *
 * Test a single article:
 *   node scripts/generate-orphan-articles.mjs carte-crypto-virtuelle-guide-complet
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

/* ── Config ──────────────────────────────────────────────────────────────── */
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL  = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY);
const YEAR = 2026;

/* ── Article definitions ─────────────────────────────────────────────────── */
const ARTICLES = [

  // ── VIRTUAL ──────────────────────────────────────────────────────────────

  {
    slug: 'carte-crypto-virtuelle-guide-complet',
    lang: 'fr',
    theme: 'virtual',
    title: `Cartes crypto virtuelles : le guide complet ${YEAR}`,
    focus: 'carte crypto virtuelle',
    brief: `Guide complet sur les cartes crypto virtuelles en ${YEAR}. Explique ce qu'est une carte virtuelle (pas de carte physique, uniquement numérique), ses avantages (disponible immédiatement, sécurité accrue pour les achats en ligne, Apple/Google Pay), ses inconvénients (pas de retrait ATM), les meilleures options disponibles (MetaMask Card, Gnosis Pay, etc.). Pour qui c'est adapté. FAQ 5 questions.`,
  },
  {
    slug: 'virtuelle-krypto-karte-leitfaden',
    lang: 'de',
    theme: 'virtual',
    title: `Virtuelle Krypto-Karten: Der vollständige Leitfaden ${YEAR}`,
    focus: 'virtuelle Krypto-Karte',
    brief: `Umfassender Leitfaden zu virtuellen Krypto-Karten in ${YEAR}. Erklärt was eine virtuelle Karte ist (keine physische Karte, nur digital), ihre Vorteile (sofort verfügbar, erhöhte Sicherheit für Online-Käufe, Apple/Google Pay), Nachteile (kein ATM-Abheben), die besten verfügbaren Optionen (MetaMask Card, Gnosis Pay usw.). Für wen geeignet. FAQ 5 Fragen.`,
  },
  {
    slug: 'tarjeta-crypto-virtual-guia-completa',
    lang: 'es',
    theme: 'virtual',
    title: `Tarjetas crypto virtuales: guía completa ${YEAR}`,
    focus: 'tarjeta crypto virtual',
    brief: `Guía completa sobre tarjetas crypto virtuales en ${YEAR}. Explica qué es una tarjeta virtual (sin tarjeta física, solo digital), sus ventajas (disponible inmediatamente, mayor seguridad para compras online, Apple/Google Pay), desventajas (sin retirada de efectivo en cajeros), las mejores opciones disponibles (MetaMask Card, Gnosis Pay, etc.). Para quién es adecuada. FAQ 5 preguntas.`,
  },
  {
    slug: 'carta-crypto-virtuale-guida-completa',
    lang: 'it',
    theme: 'virtual',
    title: `Carte crypto virtuali: la guida completa ${YEAR}`,
    focus: 'carta crypto virtuale',
    brief: `Guida completa sulle carte crypto virtuali nel ${YEAR}. Spiega cos'è una carta virtuale (nessuna carta fisica, solo digitale), i suoi vantaggi (disponibile immediatamente, maggiore sicurezza per gli acquisti online, Apple/Google Pay), svantaggi (nessun prelievo ATM), le migliori opzioni disponibili (MetaMask Card, Gnosis Pay, ecc.). Per chi è adatta. FAQ 5 domande.`,
  },
  {
    slug: 'virtual-crypto-card-complete-guide',
    lang: 'en',
    theme: 'virtual',
    title: `Virtual Crypto Cards: The Complete Guide ${YEAR}`,
    focus: 'virtual crypto card',
    brief: `Complete guide to virtual crypto cards in ${YEAR}. Explains what a virtual card is (no physical card, digital only), its advantages (instant availability, enhanced security for online shopping, Apple/Google Pay compatibility), disadvantages (no ATM withdrawals), best available options (MetaMask Card, Gnosis Pay, etc.). Who it suits best. FAQ with 5 questions.`,
  },

  // ── BEGINNER ─────────────────────────────────────────────────────────────

  {
    slug: 'cartes-crypto-guide-debutant',
    lang: 'fr',
    theme: 'beginner',
    title: `Guide débutant : comment choisir sa première carte crypto en ${YEAR}`,
    focus: 'carte crypto débutant',
    brief: `Guide pratique pour choisir sa première carte crypto quand on est débutant en ${YEAR}. Critères essentiels : simplicité d'utilisation, absence de staking complexe, frais transparents, support client réactif. Recommande 3-4 cartes idéales pour débuter (Gnosis Pay, MetaMask Card, Binance Card). Explique comment obtenir sa carte en 5 étapes simples. Erreurs courantes à éviter. FAQ 5 questions.`,
  },
  {
    slug: 'krypto-karten-leitfaden-einsteiger',
    lang: 'de',
    theme: 'beginner',
    title: `Einsteiger-Leitfaden: Wie wählt man seine erste Krypto-Karte in ${YEAR}?`,
    focus: 'Krypto-Karte Einsteiger',
    brief: `Praktischer Leitfaden zur Auswahl der ersten Krypto-Karte für Einsteiger in ${YEAR}. Wesentliche Kriterien: Benutzerfreundlichkeit, kein komplexes Staking, transparente Gebühren, reaktiver Kundendienst. Empfiehlt 3-4 ideale Karten für den Einstieg (Gnosis Pay, MetaMask Card, Binance Card). Erklärt in 5 einfachen Schritten, wie man seine Karte erhält. Häufige Fehler vermeiden. FAQ 5 Fragen.`,
  },
  {
    slug: 'tarjetas-crypto-guia-principiante',
    lang: 'es',
    theme: 'beginner',
    title: `Guía para principiantes: cómo elegir tu primera tarjeta crypto en ${YEAR}`,
    focus: 'tarjeta crypto principiante',
    brief: `Guía práctica para elegir la primera tarjeta crypto siendo principiante en ${YEAR}. Criterios esenciales: facilidad de uso, sin staking complejo, comisiones transparentes, atención al cliente receptiva. Recomienda 3-4 tarjetas ideales para empezar (Gnosis Pay, MetaMask Card, Binance Card). Explica cómo obtener tu tarjeta en 5 pasos simples. Errores comunes a evitar. FAQ 5 preguntas.`,
  },
  {
    slug: 'carte-crypto-guida-principiante',
    lang: 'it',
    theme: 'beginner',
    title: `Guida per principianti: come scegliere la prima carta crypto nel ${YEAR}`,
    focus: 'carta crypto principiante',
    brief: `Guida pratica per scegliere la prima carta crypto da principiante nel ${YEAR}. Criteri essenziali: semplicità d'uso, nessun staking complesso, commissioni trasparenti, supporto clienti reattivo. Raccomanda 3-4 carte ideali per iniziare (Gnosis Pay, MetaMask Card, Binance Card). Spiega come ottenere la carta in 5 semplici passi. Errori comuni da evitare. FAQ 5 domande.`,
  },
  {
    slug: 'beginners-guide-crypto-cards',
    lang: 'en',
    theme: 'beginner',
    title: `Beginner's Guide to Crypto Cards: How to Choose Your First One in ${YEAR}`,
    focus: 'crypto card for beginners',
    brief: `Practical guide to choosing your first crypto card as a beginner in ${YEAR}. Key criteria: ease of use, no complex staking requirements, transparent fees, responsive customer support. Recommends 3-4 ideal starter cards (Gnosis Pay, MetaMask Card, Binance Card). Explains how to get your card in 5 simple steps. Common mistakes to avoid. FAQ with 5 questions.`,
  },

  // ── NO-KYC ───────────────────────────────────────────────────────────────

  {
    slug: 'carte-crypto-sans-kyc-guide',
    lang: 'fr',
    theme: 'no-kyc',
    title: `Cartes crypto sans KYC en ${YEAR} : ce qu'il faut savoir`,
    focus: 'carte crypto sans KYC',
    brief: `Guide sur les cartes crypto à KYC minimal ou réduit en ${YEAR}. Explique pourquoi le KYC complet est légalement requis pour les cartes Visa/Mastercard (directive AML européenne), mais pourquoi certaines cartes DeFi/self-custody ont un processus allégé (MetaMask Card, Gnosis Pay). Différence entre KYC complet et KYC simplifié. Ce qui est réellement possible. Risques des "cartes sans KYC" vendues illégalement. FAQ 5 questions.`,
  },
  {
    slug: 'krypto-karte-ohne-kyc-guide',
    lang: 'de',
    theme: 'no-kyc',
    title: `Krypto-Karten ohne KYC ${YEAR}: Was Sie wissen müssen`,
    focus: 'Krypto-Karte ohne KYC',
    brief: `Leitfaden zu Krypto-Karten mit minimalem oder reduziertem KYC in ${YEAR}. Erklärt, warum ein vollständiges KYC für Visa/Mastercard-Karten gesetzlich vorgeschrieben ist (EU-AML-Richtlinie), aber warum einige DeFi/Self-Custody-Karten einen vereinfachten Prozess haben (MetaMask Card, Gnosis Pay). Unterschied zwischen vollständigem und vereinfachtem KYC. Was wirklich möglich ist. Risiken von illegal verkauften "KYC-freien Karten". FAQ 5 Fragen.`,
  },
  {
    slug: 'tarjeta-crypto-sin-kyc-guia',
    lang: 'es',
    theme: 'no-kyc',
    title: `Tarjetas crypto sin KYC en ${YEAR}: lo que debes saber`,
    focus: 'tarjeta crypto sin KYC',
    brief: `Guía sobre tarjetas crypto con KYC mínimo o reducido en ${YEAR}. Explica por qué el KYC completo es legalmente obligatorio para tarjetas Visa/Mastercard (directiva AML europea), pero por qué algunas tarjetas DeFi/self-custody tienen un proceso simplificado (MetaMask Card, Gnosis Pay). Diferencia entre KYC completo y simplificado. Lo que es realmente posible. Riesgos de las "tarjetas sin KYC" vendidas ilegalmente. FAQ 5 preguntas.`,
  },
  {
    slug: 'carta-cripto-senza-kyc-guida',
    lang: 'it',
    theme: 'no-kyc',
    title: `Carte crypto senza KYC nel ${YEAR}: quello che devi sapere`,
    focus: 'carta crypto senza KYC',
    brief: `Guida sulle carte crypto con KYC minimo o ridotto nel ${YEAR}. Spiega perché il KYC completo è legalmente richiesto per le carte Visa/Mastercard (direttiva AML europea), ma perché alcune carte DeFi/self-custody hanno un processo semplificato (MetaMask Card, Gnosis Pay). Differenza tra KYC completo e semplificato. Cosa è realmente possibile. Rischi delle "carte senza KYC" vendute illegalmente. FAQ 5 domande.`,
  },
  {
    slug: 'crypto-card-no-kyc-guide',
    lang: 'en',
    theme: 'no-kyc',
    title: `Crypto Cards Without KYC in ${YEAR}: What You Need to Know`,
    focus: 'crypto card no KYC',
    brief: `Guide on crypto cards with minimal or reduced KYC in ${YEAR}. Explains why full KYC is legally required for Visa/Mastercard cards (EU AML directive), but why some DeFi/self-custody cards have a lighter process (MetaMask Card, Gnosis Pay). Difference between full and simplified KYC. What is realistically possible. Risks of illegally sold "no-KYC cards". FAQ with 5 questions.`,
  },

  // ── 2026 ─────────────────────────────────────────────────────────────────

  {
    slug: 'meilleures-cartes-crypto-2026',
    lang: 'fr',
    theme: '2026',
    title: `Meilleures cartes crypto en 2026 : le classement complet`,
    focus: 'meilleure carte crypto 2026',
    brief: `Classement complet des meilleures cartes crypto en 2026. Couvre les nouveautés de l'année (réglementation MiCA en vigueur, nouveaux acteurs), classe les top 10 cartes par catégorie : meilleur cashback, sans staking, pour débutants, DeFi/self-custody. Pour chaque carte : note, avantages, inconvénients, pour qui. Tableau récapitulatif. Tendances 2026 du marché des cartes crypto. FAQ 5 questions.`,
  },
  {
    slug: 'beste-krypto-karten-2026',
    lang: 'de',
    theme: '2026',
    title: `Beste Krypto-Karten 2026: Das vollständige Ranking`,
    focus: 'beste Krypto-Karte 2026',
    brief: `Vollständiges Ranking der besten Krypto-Karten 2026. Deckt die Neuheiten des Jahres ab (MiCA-Regulierung in Kraft, neue Akteure), klassifiziert die Top-10-Karten nach Kategorie: bestes Cashback, ohne Staking, für Einsteiger, DeFi/Self-Custody. Für jede Karte: Note, Vorteile, Nachteile, für wen geeignet. Übersichtstabelle. Trends 2026 auf dem Krypto-Kartenmarkt. FAQ 5 Fragen.`,
  },
  {
    slug: 'mejores-tarjetas-cripto-2026',
    lang: 'es',
    theme: '2026',
    title: `Mejores tarjetas crypto en 2026: el ranking completo`,
    focus: 'mejor tarjeta crypto 2026',
    brief: `Ranking completo de las mejores tarjetas crypto en 2026. Cubre las novedades del año (reglamento MiCA en vigor, nuevos actores), clasifica las 10 mejores tarjetas por categoría: mejor cashback, sin staking, para principiantes, DeFi/self-custody. Para cada tarjeta: nota, ventajas, desventajas, para quién. Tabla resumen. Tendencias 2026 del mercado de tarjetas crypto. FAQ 5 preguntas.`,
  },
  {
    slug: 'migliori-carte-cripto-2026',
    lang: 'it',
    theme: '2026',
    title: `Migliori carte crypto nel 2026: il ranking completo`,
    focus: 'migliore carta crypto 2026',
    brief: `Ranking completo delle migliori carte crypto nel 2026. Copre le novità dell'anno (regolamento MiCA in vigore, nuovi attori), classifica le top 10 carte per categoria: miglior cashback, senza staking, per principianti, DeFi/self-custody. Per ogni carta: voto, vantaggi, svantaggi, per chi. Tabella riepilogativa. Tendenze 2026 del mercato delle carte crypto. FAQ 5 domande.`,
  },
  {
    slug: 'best-crypto-cards-2026',
    lang: 'en',
    theme: '2026',
    title: `Best Crypto Cards in 2026: The Complete Ranking`,
    focus: 'best crypto card 2026',
    brief: `Complete ranking of the best crypto cards in 2026. Covers the year's highlights (MiCA regulation fully in effect, new market entrants), ranks the top 10 cards by category: best cashback, no staking required, for beginners, DeFi/self-custody. For each card: score, pros, cons, who it's for. Summary table. 2026 market trends for crypto cards. FAQ with 5 questions.`,
  },
];

/* ── Prompt builder ──────────────────────────────────────────────────────── */
const LANG_INSTRUCTION = {
  fr: 'FRANÇAIS uniquement',
  de: 'DEUTSCH uniquement',
  es: 'ESPAÑOL únicamente',
  it: 'ITALIANO únicamente',
  en: 'ENGLISH only',
};

const LANG_TONE = {
  fr: 'Expert mais accessible, professionnel, orienté vers l\'aide à la décision',
  de: 'Fachkundig aber zugänglich, professionell, entscheidungsorientiert',
  es: 'Experto pero accesible, profesional, orientado a la toma de decisiones',
  it: 'Esperto ma accessibile, professionale, orientato alle decisioni',
  en: 'Expert yet accessible, professional, decision-oriented',
};

const SITE_CONTEXT = {
  fr: 'topcryptocards.eu (comparateur de cartes crypto, 5 langues, UE)',
  de: 'topcryptocards.eu (Krypto-Karten-Vergleich, 5 Sprachen, EU)',
  es: 'topcryptocards.eu (comparador de tarjetas crypto, 5 idiomas, UE)',
  it: 'topcryptocards.eu (comparatore di carte crypto, 5 lingue, UE)',
  en: 'topcryptocards.eu (crypto card comparison site, 5 languages, EU)',
};

function buildPrompt(article) {
  const langStr = LANG_INSTRUCTION[article.lang];
  return `You are a crypto card expert and SEO writer. Write a complete blog article in ${langStr} for the site ${SITE_CONTEXT[article.lang]}.

Article to write:
- H1 title: "${article.title}"
- Target keyword: "${article.focus}"
- Language: ${article.lang.toUpperCase()} — write the ENTIRE response in this language only

Content instructions:
${article.brief}

Format requirements:
- Length: 1200–1800 words
- Language: ${langStr} — no untranslated foreign words
- Format: Markdown with ## and ### headings, paragraphs, bullet lists where relevant
- Tone: ${LANG_TONE[article.lang]}
- Year: ${YEAR} (mention for SEO freshness)
- Must include: a FAQ with 5 questions at the end (### FAQ format)
- Do not invent unverifiable prices or data — phrase generally if needed
- Naturally integrate the target keyword and its semantic variants

Return ONLY valid JSON (no markdown wrapper, no comments) matching this exact schema:
{
  "meta_title": "string (60–70 chars, include target keyword and ${YEAR})",
  "meta_description": "string (145–160 chars, compelling, includes target keyword)",
  "title": "string (the exact H1 of the article)",
  "content": "string (complete article in Markdown)"
}`;
}

/* ── Generator ───────────────────────────────────────────────────────────── */
async function generateArticle(article) {
  console.log(`  Generating "${article.slug}" [${article.lang}]…`);
  const prompt = buildPrompt(article);

  const msg = await anthropic.messages.create({
    model: article.lang === 'fr' ? 'claude-opus-4-6' : 'claude-sonnet-4-6',
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
    console.error(`    ❌ JSON parse error for "${article.slug}" [${article.lang}]. Raw:\n${raw.slice(0, 300)}`);
    throw new Error('JSON parse failed');
  }

  return parsed;
}

/* ── Check existing ──────────────────────────────────────────────────────── */
async function articleExists(slug, lang) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('slug', slug)
    .eq('lang', lang)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/* ── Upsert to Supabase ──────────────────────────────────────────────────── */
async function upsertArticle(article, generated) {
  const row = {
    slug: article.slug,
    lang: article.lang,
    title: generated.title,
    content: generated.content,
    meta_title: generated.meta_title,
    meta_description: generated.meta_description,
    published_at: new Date().toISOString(),
    category: 'guide',
    topic_key: `orphan-${article.theme}`,
  };

  const { error } = await supabase
    .from('blog_posts')
    .upsert(row, { onConflict: 'slug,lang' });

  if (error) {
    console.error(`    ❌ Supabase error for "${article.slug}" [${article.lang}]:`, error.message);
    throw error;
  }

  console.log(`    ✅ Saved "${article.slug}" [${article.lang}]`);
}

/* ── Rate limiting ───────────────────────────────────────────────────────── */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  const filterSlug = process.argv[2];
  const skipExisting = !process.argv.includes('--force');

  const targets = filterSlug
    ? ARTICLES.filter((a) => a.slug === filterSlug)
    : ARTICLES;

  if (targets.length === 0) {
    console.error(`No article found with slug "${filterSlug}"`);
    console.log('Available slugs:', ARTICLES.map((a) => `${a.slug} [${a.lang}]`).join('\n  '));
    process.exit(1);
  }

  console.log(`\n🚀 Generating ${targets.length} article(s)…\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const article of targets) {
    try {
      if (skipExisting) {
        const exists = await articleExists(article.slug, article.lang);
        if (exists) {
          console.log(`  ⏭ Skip "${article.slug}" [${article.lang}] (already exists)`);
          skipped++;
          continue;
        }
      }

      const generated = await generateArticle(article);
      await upsertArticle(article, generated);
      success++;
    } catch (err) {
      console.error(`  ❌ Failed "${article.slug}" [${article.lang}]:`, err.message);
      failed++;
    }
    // Rate limiting
    if (targets.length > 1) await sleep(1500);
  }

  console.log(`\n✅ Done. ${success} saved, ${skipped} skipped, ${failed} failed.\n`);
}

main();
