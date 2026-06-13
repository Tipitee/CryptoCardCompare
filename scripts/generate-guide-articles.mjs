#!/usr/bin/env node
/**
 * generate-guide-articles.mjs
 * Generates 53 targeted FR blog articles via Claude API and upserts to Supabase.
 * Topics: avis cartes, comparatifs, guides thématiques — longue traîne FR.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... SUPABASE_URL=https://... SUPABASE_SERVICE_KEY=... node scripts/generate-guide-articles.mjs
 *
 * Test a single article:
 *   ... node scripts/generate-guide-articles.mjs binance-card-avis
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

/* ── Article definitions (guides thématiques + pratiques uniquement) ────── */
const ARTICLES = [
  // ── Guides thématiques ──────────────────────────────────────────────────
  {
    slug: 'meilleure-carte-crypto-cashback-bitcoin',
    category: 'guide',
    focus: 'meilleure carte crypto cashback bitcoin',
    title: `Meilleure carte crypto avec cashback en Bitcoin ${YEAR}`,
    brief: `Guide sur les meilleures cartes crypto offrant un cashback en Bitcoin (BTC) en ${YEAR}. Liste les cartes qui permettent de recevoir son cashback directement en BTC (Coinbase Card, certains paliers Crypto.com, etc.), compare les taux, les conditions, les frais. Inclus des conseils pour maximiser le cashback en BTC. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-sans-frais-annuels',
    category: 'guide',
    focus: 'carte crypto sans frais annuels',
    title: `Cartes crypto sans frais annuels en ${YEAR} : le classement complet`,
    brief: `Guide complet sur les cartes crypto 100% gratuites (0€/an) en ${YEAR}. Liste toutes les cartes sans frais annuels (Binance Card, Crypto.com Midnight Blue, etc.), explique les autres frais potentiels (conversion, retrait ATM, inactivité), donne des conseils pour éviter les frais cachés. Classement des meilleures. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-sans-staking',
    category: 'guide',
    focus: 'carte crypto sans staking',
    title: `Meilleures cartes crypto sans staking obligatoire en ${YEAR}`,
    brief: `Guide sur les cartes crypto qui n'exigent aucun staking pour bénéficier du cashback en ${YEAR}. Explique pourquoi le staking est souvent requis (Crypto.com, Binance), liste les cartes sans cette contrainte (Bybit Card, Coinbase Card, certaines cartes DeFi), compare les avantages/inconvénients. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-debutant',
    category: 'guide',
    focus: 'meilleure carte crypto débutant',
    title: `Meilleure carte crypto pour débutant en ${YEAR} : guide simple`,
    brief: `Guide pour choisir sa première carte crypto en ${YEAR} quand on est débutant. Critères importants : simplicité d'utilisation, pas de staking complexe, frais clairs, support client, disponibilité en France. Recommande 3-4 cartes adaptées aux débutants avec explications simples. Explique comment l'obtenir en 5 étapes. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-france-disponible',
    category: 'guide',
    focus: 'carte crypto disponible en France',
    title: `Cartes crypto disponibles en France en ${YEAR} : liste complète`,
    brief: `Guide exhaustif des cartes crypto légalement disponibles en France en ${YEAR}. Rappelle le cadre réglementaire (PSAN, AMF), liste toutes les cartes accessibles depuis la France avec leur statut (disponible, liste d'attente, non disponible), explique comment vérifier la disponibilité. Top 5 recommandées pour les Français. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-cashback-usdt',
    category: 'guide',
    focus: 'carte crypto cashback USDT',
    title: `Cartes crypto avec cashback en USDT (stablecoin) en ${YEAR}`,
    brief: `Guide sur les cartes crypto qui versent leur cashback en USDT ou autres stablecoins en ${YEAR}. Explique l'avantage du cashback en stablecoin (pas de volatilité), liste les cartes proposant cette option, compare avec le cashback en tokens natifs (BNB, CRO). Pour qui c'est adapté. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-apple-pay-google-pay',
    category: 'guide',
    focus: 'carte crypto Apple Pay Google Pay',
    title: `Cartes crypto compatibles Apple Pay et Google Pay en ${YEAR}`,
    brief: `Guide sur les cartes crypto supportant Apple Pay et Google Pay en ${YEAR}. Liste les cartes compatibles, explique comment les configurer sur smartphone, avantages du paiement sans contact avec une carte crypto, limitations éventuelles. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-cashback-ethereum',
    category: 'guide',
    focus: 'carte crypto cashback Ethereum',
    title: `Cartes crypto avec cashback en Ethereum (ETH) en ${YEAR}`,
    brief: `Guide sur les cartes crypto offrant un cashback en Ethereum (ETH) en ${YEAR}. Liste les options disponibles, compare les taux de cashback ETH vs BTC vs tokens natifs, explique la fiscalité du cashback en ETH en France. Recommandations selon profil. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-cashback-solana',
    category: 'guide',
    focus: 'carte crypto cashback Solana',
    title: `Cartes crypto avec cashback en Solana (SOL) en ${YEAR}`,
    brief: `Guide sur les cartes crypto offrant un cashback en SOL en ${YEAR}. Présente les options (SolFlare Card, etc.), compare avec d'autres cryptos en cashback, explique les avantages de SOL (transactions rapides, faibles frais). FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-virtuelle',
    category: 'guide',
    focus: 'carte crypto virtuelle',
    title: `Meilleures cartes crypto virtuelles en ${YEAR} : paiement en ligne`,
    brief: `Guide sur les cartes crypto virtuelles (sans carte physique) en ${YEAR}. Explique l'utilité d'une carte virtuelle (achats en ligne, Apple/Google Pay), liste les meilleures options, compare avec les cartes physiques. Idéal pour les achats en ligne et la sécurité. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-haut-cashback',
    category: 'guide',
    focus: 'carte crypto meilleur taux cashback',
    title: `Cartes crypto avec le plus haut cashback en ${YEAR} : top 10`,
    brief: `Classement des cartes crypto avec le taux de cashback le plus élevé en ${YEAR}. Compare tous les taux (de 0.5% à 8%), explique les conditions pour atteindre le taux maximum (staking, palier), calcul d'exemple (500€/mois de dépenses → X€ de cashback/an). Tableau récapitulatif. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-cashback-sans-staking',
    category: 'guide',
    focus: 'carte crypto cashback sans staking',
    title: `Top cartes crypto avec cashback sans staking en ${YEAR}`,
    brief: `Classement des meilleures cartes crypto offrant du cashback sans exiger de staking en ${YEAR}. Explique pourquoi éviter le staking (risque, immobilisation de capital), liste les meilleures options (Bybit Card, Coinbase Card, etc.), compare leurs taux. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-europe',
    category: 'guide',
    focus: 'carte crypto Europe',
    title: `Meilleures cartes crypto en Europe en ${YEAR} : comparatif complet`,
    brief: `Guide des meilleures cartes crypto disponibles dans l'Union Européenne en ${YEAR}. Couvre la réglementation MiCA/PSAN, liste les cartes accessibles dans l'UE, explique les différences de disponibilité selon les pays (France, Allemagne, Espagne, Italie), recommandations par pays. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-cashback-bnb',
    category: 'guide',
    focus: 'carte crypto cashback BNB',
    title: `Carte crypto avec cashback en BNB : vaut-il mieux choisir la Binance Card ?`,
    brief: `Guide sur le cashback en BNB avec la Binance Card en ${YEAR}. Explique pourquoi recevoir du cashback en BNB peut être avantageux (utilité dans l'écosystème Binance, réductions sur les frais de trading), les conditions (staking BNB), compare avec d'autres options. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-defi',
    category: 'guide',
    focus: 'carte crypto DeFi',
    title: `Cartes crypto DeFi en ${YEAR} : dépenser depuis votre wallet`,
    brief: `Guide sur les cartes crypto DeFi (self-custody) en ${YEAR}. Explique la différence entre une carte crypto d'exchange (custodial) et une carte DeFi (non-custodial), présente les options disponibles (Gnosis Pay, MetaMask Card, etc.), avantages (vraie auto-custody) et inconvénients (complexité). FAQ 4 questions.`,
  },

  // ── Guides pratiques ────────────────────────────────────────────────────
  {
    slug: 'comment-fonctionne-carte-crypto',
    category: 'guide',
    focus: 'comment fonctionne une carte crypto',
    title: `Comment fonctionne une carte crypto ? Explication simple ${YEAR}`,
    brief: `Guide pédagogique expliquant le fonctionnement d'une carte crypto en ${YEAR} pour un débutant. Couvre : qu'est-ce qu'une carte crypto (Visa/Mastercard liée à un compte crypto), comment se fait la conversion au moment du paiement, qui sont les acteurs (exchange, émetteur de carte, réseau Visa/MC), différence avec une carte bancaire normale, sécurité. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-retrait-atm',
    category: 'guide',
    focus: 'retrait ATM carte crypto',
    title: `Retrait ATM avec une carte crypto : frais, limites et conseils ${YEAR}`,
    brief: `Guide complet sur les retraits d'espèces aux distributeurs (ATM) avec une carte crypto en ${YEAR}. Couvre : frais de retrait selon les cartes (gratuit jusqu'à un plafond mensuel, puis X€ ou X%), limites mensuelles, retraits à l'étranger, conseils pour minimiser les frais. Comparatif des limites de retrait gratuites par carte. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-impots-france',
    category: 'guide',
    focus: 'carte crypto impôts France',
    title: `Carte crypto et impôts en France : ce que vous devez savoir en ${YEAR}`,
    brief: `Guide fiscal sur l'utilisation d'une carte crypto en France en ${YEAR}. Couvre : la conversion crypto→fiat au moment du paiement est-elle un fait générateur d'imposition ?, le cashback en crypto est-il imposable ?, comment déclarer les plus-values issues de l'utilisation d'une carte crypto, position de l'administration fiscale (Bofip), conseils pratiques. IMPORTANT : précise que ce n'est pas un conseil fiscal officiel. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-etranger-frais',
    category: 'guide',
    focus: 'carte crypto à l\'étranger',
    title: `Utiliser sa carte crypto à l'étranger en ${YEAR} : frais et conseils`,
    brief: `Guide pratique pour utiliser une carte crypto en voyage ou à l'étranger en ${YEAR}. Couvre : frais de change (plupart des cartes crypto = 0%), frais de retrait ATM à l'étranger, acceptation Visa/Mastercard mondiale, conseils de sécurité (plafonds, blocage), comparaison avec les cartes bancaires classiques (qui facturent 1.5-3%). FAQ 4 questions.`,
  },
  {
    slug: 'cashback-crypto-fonctionnement',
    category: 'guide',
    focus: 'comment fonctionne cashback crypto',
    title: `Comment fonctionne le cashback sur une carte crypto ? Guide complet ${YEAR}`,
    brief: `Guide pédagogique sur le mécanisme du cashback crypto en ${YEAR}. Explique : qu'est-ce que le cashback (remise en crypto sur chaque achat), comment il est calculé (% du montant dépensé), quand il est versé (immédiat vs hebdomadaire), conditions pour le débloquer (staking ou non), valeur réelle du cashback (exemple : 1% de 500€/mois = X€/an), différence avec les miles ou points fidélité. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-staking-explique',
    category: 'guide',
    focus: 'staking carte crypto explication',
    title: `Staking et carte crypto : pourquoi est-ce souvent obligatoire ? ${YEAR}`,
    brief: `Guide expliquant pourquoi de nombreuses cartes crypto exigent du staking pour accéder au cashback en ${YEAR}. Explique le modèle économique (émetteur de la carte veut que tu immobilises des tokens pour financer le cashback), quels montants sont requis (ex : 1000 CRO pour Jade, 50000 CRO pour Obsidian), risques du staking (volatilité du token), alternatives sans staking. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-sans-kyc',
    category: 'guide',
    focus: 'carte crypto sans KYC',
    title: `Cartes crypto sans KYC en ${YEAR} : réalité ou mythe ?`,
    brief: `Guide sur la possibilité d'obtenir une carte crypto sans vérification d'identité (KYC) en ${YEAR}. Explique pourquoi le KYC est légalement obligatoire pour les cartes Visa/Mastercard (directive AML européenne, obligations PSAN), les solutions à KYC minimal (cartes virtuelles prépayées crypto), ce qui existe vraiment vs les arnaques. Cadre légal français. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-limites-retrait-comparatif',
    category: 'guide',
    focus: 'limites retrait carte crypto comparatif',
    title: `Limites de retrait gratuites par carte crypto en ${YEAR} : comparatif`,
    brief: `Comparatif des limites de retrait gratuit aux ATM pour les principales cartes crypto en ${YEAR}. Tableau détaillé : carte, retrait mensuel gratuit, frais au-delà, plafond journalier. Inclus Binance Card, Crypto.com (tous paliers), Coinbase Card, Bybit Card, Nexo Card. Conseils pour optimiser. FAQ 4 questions.`,
  },
  {
    slug: 'securite-carte-crypto',
    category: 'guide',
    focus: 'sécurité carte crypto',
    title: `Sécurité des cartes crypto en ${YEAR} : comment protéger votre argent`,
    brief: `Guide complet sur la sécurité des cartes crypto en ${YEAR}. Couvre : risques spécifiques aux cartes crypto (vol, phishing, faillite de l'émetteur), mesures de protection (2FA, plafonds, gel de carte depuis l'app), fonds garantis ou non (les cryptos ne sont pas couverts par le FGDR/FGD), que faire en cas de perte ou vol, meilleures pratiques. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-vs-carte-bancaire',
    category: 'guide',
    focus: 'carte crypto vs carte bancaire',
    title: `Carte crypto vs carte bancaire classique : laquelle choisir en ${YEAR} ?`,
    brief: `Comparatif entre une carte crypto et une carte bancaire traditionnelle en ${YEAR}. Compare : cashback (crypto 1-8% vs points/miles classiques), frais à l'étranger (crypto souvent 0% vs banques 1.5-3%), sécurité, garanties légales (FGDR vs pas de garantie crypto), facilité d'utilisation, fiscalité. Pour qui chaque option est mieux. FAQ 4 questions.`,
  },

  // ── Questions précises ─────────────────────────────────────────────────
  {
    slug: 'carte-crypto-avantages-inconvenients',
    category: 'guide',
    focus: 'avantages inconvénients carte crypto',
    title: `Avantages et inconvénients des cartes crypto en ${YEAR}`,
    brief: `Article équilibré présentant les avantages (cashback en crypto, frais à l'étranger nuls, accumulation passive de crypto) et les inconvénients (staking requis, volatilité du cashback, complexité fiscale, risque émetteur) des cartes crypto en ${YEAR}. Aide le lecteur à décider si une carte crypto lui convient. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-legale-france',
    category: 'guide',
    focus: 'carte crypto légale France',
    title: `Les cartes crypto sont-elles légales en France en ${YEAR} ?`,
    brief: `Article sur le cadre légal et réglementaire des cartes crypto en France en ${YEAR}. Couvre : statut PSAN (Prestataire de Services sur Actifs Numériques) requis, liste des acteurs agréés AMF, réglementation MiCA, obligations KYC/AML, droits des consommateurs, pourquoi certaines cartes ne sont pas disponibles en France. FAQ 4 questions.`,
  },
  {
    slug: 'comment-choisir-carte-crypto',
    category: 'guide',
    focus: 'comment choisir carte crypto',
    title: `Comment choisir sa carte crypto en ${YEAR} ? Les 7 critères essentiels`,
    brief: `Guide méthodologique pour choisir sa carte crypto en ${YEAR}. Les 7 critères : 1) taux de cashback, 2) nature du cashback (BTC/stablecoin/token natif), 3) staking requis ou non, 4) frais annuels, 5) limites de retrait, 6) disponibilité dans ton pays, 7) solidité de l'émetteur. Grille d'aide à la décision selon profil. FAQ 4 questions.`,
  },
  {
    slug: 'maximiser-cashback-carte-crypto',
    category: 'guide',
    focus: 'maximiser cashback carte crypto',
    title: `Comment maximiser son cashback avec une carte crypto en ${YEAR} ?`,
    brief: `Guide stratégique pour tirer le maximum de cashback de sa carte crypto en ${YEAR}. Conseils : concentrer les dépenses sur une seule carte, atteindre le bon palier de staking, utiliser la carte pour les gros achats, combiner avec d'autres programmes de fidélité, timing des dépenses. Exemples chiffrés. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-top-10-2026',
    category: 'guide',
    focus: 'meilleures cartes crypto 2026',
    title: `Top 10 des meilleures cartes crypto en ${YEAR} : classement et comparatif`,
    brief: `Classement des 10 meilleures cartes crypto en ${YEAR}. Pour chaque carte : note globale, points forts, points faibles, pour qui c'est adapté, lien vers l'avis complet. Couvre les plus populaires : Crypto.com, Binance, Coinbase, Nexo, Bybit, Plutus, Revolut Metal, Gnosis Pay, MetaMask, Kraken. Tableau récapitulatif. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-cashback-2026-classement',
    category: 'guide',
    focus: 'classement cartes crypto cashback 2026',
    title: `Classement des cartes crypto avec le meilleur cashback en ${YEAR}`,
    brief: `Classement détaillé des cartes crypto par taux de cashback en ${YEAR}. Sépare : cartes avec cashback sans staking vs avec staking. Calculs pratiques : pour 500€/mois de dépenses, combien gagne-t-on par an avec chaque carte ? Tableau comparatif. Recommandations selon budget. FAQ 4 questions.`,
  },
  {
    slug: 'investir-crypto-via-carte',
    category: 'guide',
    focus: 'investir crypto carte',
    title: `Investir passivement en crypto grâce à une carte : guide ${YEAR}`,
    brief: `Guide sur l'utilisation d'une carte crypto comme outil d'accumulation passive de cryptomonnaies en ${YEAR}. Explique le concept : chaque achat du quotidien = accumulation de crypto (DCA passif), calcul de l'accumulation sur 1 an selon les dépenses, quelles cryptos accumuler (BTC, ETH, stablecoins), risques et réalisme des montants. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-visa-vs-mastercard',
    category: 'guide',
    focus: 'carte crypto Visa vs Mastercard',
    title: `Cartes crypto Visa vs Mastercard : quelle différence en ${YEAR} ?`,
    brief: `Guide comparant les cartes crypto sur réseau Visa vs Mastercard en ${YEAR}. Explique : acceptation mondiale (les deux très similaires), différences de plafonds, couverture assurance, cashback spécifique au réseau, liste des cartes crypto sur chaque réseau. Verdict : le réseau importe peu, c'est l'émetteur qui compte. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-paiement-sans-contact',
    category: 'guide',
    focus: 'carte crypto paiement sans contact NFC',
    title: `Paiement sans contact avec une carte crypto : guide pratique ${YEAR}`,
    brief: `Guide pratique sur le paiement sans contact (NFC) avec une carte crypto en ${YEAR}. Couvre : quelles cartes crypto supportent le sans contact, comment configurer Apple Pay/Google Pay, limites de paiement sans contact, sécurité du NFC, utilisation dans les transports et commerces. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-cashback-impots',
    category: 'guide',
    focus: 'cashback crypto imposition France',
    title: `Le cashback d'une carte crypto est-il imposable en France ? ${YEAR}`,
    brief: `Article fiscal sur l'imposition du cashback reçu via une carte crypto en France en ${YEAR}. Analyse : le cashback en crypto est-il un revenu imposable ou un rabais commercial ?, position actuelle de l'administration fiscale, différence entre cashback en token natif (CRO, BNB) et en BTC/ETH, conseils pratiques. Mention obligatoire que ce n'est pas un conseil fiscal. FAQ 4 questions.`,
  },
  {
    slug: 'carte-crypto-faillite-emetteur',
    category: 'guide',
    focus: 'risque faillite émetteur carte crypto',
    title: `Que se passe-t-il si l'émetteur de votre carte crypto fait faillite ? ${YEAR}`,
    brief: `Article sur le risque de faillite des émetteurs de cartes crypto en ${YEAR} (ex : leçon de FTX, BlockFi). Couvre : vos cryptos sont-elles protégées ?, différence entre fonds sur exchange (risque) et fonds sur wallet (sécurisé), comment choisir un émetteur solide (régulé, PSAN, ancienneté), signes d'alerte, alternatives plus sûres (Gnosis Pay DeFi). FAQ 4 questions.`,
  },
  {
    slug: 'okx-card-avis',
    category: 'review',
    focus: 'OKX Card avis',
    title: `OKX Card avis ${YEAR} : test complet de la carte de l'exchange OKX`,
    brief: `Avis complet sur la OKX Card en ${YEAR}. Couvre : carte Mastercard liée au compte OKX, cashback en OKB (token OKX), frais annuels, limites, disponibilité Europe/France, intégration avec l'exchange OKX, avantages (cashback sans staking minimum), inconvénients. FAQ 4 questions.`,
  },
  {
    slug: 'bitpanda-card-avis',
    category: 'review',
    focus: 'Bitpanda Card avis',
    title: `Bitpanda Card avis ${YEAR} : la carte crypto autrichienne en Europe`,
    brief: `Avis complet sur la Bitpanda Card en ${YEAR}. Couvre : carte Visa liée à Bitpanda (néobroker européen réputé), cashback en BEST (token Bitpanda), disponibilité (Europe, dont France), frais, avantages (plateforme régulée, large choix de cryptos), inconvénients (cashback en BEST). FAQ 4 questions.`,
  },
  {
    slug: 'wirex-card-avis',
    category: 'review',
    focus: 'Wirex Card avis',
    title: `Wirex Card avis ${YEAR} : l'ancienne des cartes crypto`,
    brief: `Avis complet sur la Wirex Card en ${YEAR} (une des premières cartes crypto lancées en 2014). Couvre : différents plans (Standard/Elite), cashback en WXT, réseau Visa, disponibilité (globale dont France), avantages (ancienneté, fiabilité), inconvénients (cashback en token peu connu), évolution du produit. FAQ 4 questions.`,
  },
];

/* ── Prompt builder ──────────────────────────────────────────────────────── */
function buildPrompt(article) {
  return `Tu es un expert en cartes crypto et en rédaction SEO. Rédige un article de blog complet en FRANÇAIS pour le site topcryptocards.eu (comparateur de cartes crypto).

Article à rédiger :
- Titre H1 : "${article.title}"
- Mot-clé cible : "${article.focus}"
- Catégorie : ${article.category === 'review' ? 'avis/test' : article.category === 'comparatif' ? 'comparatif' : 'guide'}

Instructions de rédaction :
${article.brief}

Exigences de format :
- Longueur : 1200–1800 mots
- Langue : FRANÇAIS uniquement, aucun mot anglais non traduit
- Format : Markdown avec titres ## et ###, paragraphes, listes à puces si pertinent
- Ton : Expert mais accessible, professionnel, orienté vers l'aide à la décision
- Année : ${YEAR} (mentionner pour la fraîcheur SEO)
- Inclure obligatoirement : une FAQ de 4 questions-réponses à la fin (format ### FAQ)
- Ne pas inventer de prix ou données non vérifiables — formuler de façon générale si nécessaire
- Mots-clés secondaires à intégrer naturellement : "carte crypto", "cashback crypto", "carte visa crypto", "${article.focus}"

Retourne UNIQUEMENT du JSON valide (pas de balises markdown, pas de commentaire) selon ce schéma exact :
{
  "meta_title": "string (60–70 caractères, inclure le mot-clé cible et ${YEAR})",
  "meta_description": "string (145–160 caractères, accrocheur et incluant le mot-clé cible)",
  "title": "string (le H1 exact de l'article)",
  "content": "string (article complet en Markdown)"
}`;
}

/* ── Generator ───────────────────────────────────────────────────────────── */
async function generateArticle(article) {
  console.log(`  Generating "${article.slug}"…`);
  const prompt = buildPrompt(article);

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-6',
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
    console.error(`    ❌ JSON parse error for "${article.slug}". Raw:\n${raw.slice(0, 300)}`);
    throw new Error('JSON parse failed');
  }

  return parsed;
}

/* ── Upsert to Supabase ──────────────────────────────────────────────────── */
async function upsertArticle(article, generated) {
  const row = {
    slug: article.slug,
    lang: 'fr',
    title: generated.title,
    content: generated.content,
    meta_title: generated.meta_title,
    meta_description: generated.meta_description,
    published_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('blog_posts')
    .upsert(row, { onConflict: 'slug,lang' });

  if (error) {
    console.error(`    ❌ Supabase error for "${article.slug}":`, error.message);
    throw error;
  }

  console.log(`    ✅ Saved "${article.slug}"`);
}

/* ── Rate limiting ───────────────────────────────────────────────────────── */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  const filterSlug = process.argv[2];

  const targets = filterSlug
    ? ARTICLES.filter((a) => a.slug === filterSlug)
    : ARTICLES;

  if (targets.length === 0) {
    console.error(`No article found with slug "${filterSlug}"`);
    console.log('Available slugs:', ARTICLES.map((a) => a.slug).join(', '));
    process.exit(1);
  }

  console.log(`\n🚀 Generating ${targets.length} article(s) in French…\n`);

  let success = 0;
  let failed = 0;

  for (const article of targets) {
    try {
      const generated = await generateArticle(article);
      await upsertArticle(article, generated);
      success++;
    } catch (err) {
      console.error(`  ❌ Failed "${article.slug}":`, err.message);
      failed++;
    }
    // ~1 req/sec to respect API rate limits
    if (targets.length > 1) await sleep(1500);
  }

  console.log(`\n✅ Done. ${success} saved, ${failed} failed.\n`);
}

main();
