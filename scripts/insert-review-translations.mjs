#!/usr/bin/env node
/**
 * Inserts the 9 missing review translations (FR/ES/IT × Gnosis Pay, Brighty,
 * MetaMask Card). Content translated from the existing EN/DE versions.
 *
 * Usage:
 *   set -a && source .env && set +a
 *   node scripts/insert-review-translations.mjs --dry-run
 *   node scripts/insert-review-translations.mjs
 *
 * After inserting: node scripts/gen-blog-sitemap.mjs && git commit && push.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ env manquant'); process.exit(1); }
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
const DRY = process.argv.includes('--dry-run');

const HERO = {
  'blog-gnosis-pay-review-2026': null, // propagé depuis topic_key par l'edge function si null
  'blog-brighty-card-review-2026': 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/blog-hero-images/brighty-card-testbericht-2026-1782575517679.png',
  'blog-metamask-card-review-2026': 'https://pnrwskzladqibjqngxem.supabase.co/storage/v1/object/public/blog-hero-images/metamask-card-testbericht-2026-1782575536338.png',
};

const POSTS = [
  // ═══════════════ GNOSIS PAY ═══════════════
  {
    topic_key: 'blog-gnosis-pay-review-2026', lang: 'fr', slug: 'gnosis-pay-avis-2026', category: 'card',
    title: 'Gnosis Pay Avis 2026 : la carte crypto self-custody avec 2% de cashback en EURE',
    excerpt: "Gnosis Pay est la première carte crypto réellement non-custodiale : 2% de cashback en EURE (stablecoin euro), sans staking, sans frais. Notre avis complet.",
    tags: ['Gnosis Pay', 'Self-custody', 'Carte crypto', 'Cashback'],
    content: `## Gnosis Pay : la première carte crypto réellement non-custodiale

Gnosis Pay est une carte Visa connectée directement à votre **wallet Safe** sur la Gnosis Chain. Contrairement à toutes les autres cartes crypto du marché, vos fonds ne transitent jamais par un exchange centralisé — vous gardez le contrôle de vos clés à tout moment.

## Points forts

- **2% de cashback en EURE** (stablecoin euro, 1 EURE = 1 EUR)
- **Sans staking**, sans frais annuels
- Véritable **self-custody** : vos actifs restent dans votre wallet Safe
- Disponible dans toute l'UE

## Pour qui ?

Gnosis Pay s'adresse aux **utilisateurs Web3** qui maîtrisent déjà les wallets et la blockchain. Si vous utilisez déjà un wallet Safe ou si vous voulez dépenser vos cryptos sans confier vos fonds à un tiers, c'est la carte qu'il vous faut.

## Cashback en EURE : une proposition unique

Au lieu de créditer un token natif volatil, Gnosis Pay verse le cashback en **EURE** — le stablecoin euro de la Gnosis Chain. Vous accumulez de la valeur stable, sans risque de volatilité crypto.

## Notre verdict

Gnosis Pay est l'option la plus aboutie pour les utilisateurs Web3 convaincus. Pour un cashback maximal sans complexité, Brighty ou Nexo restent de meilleurs choix.

**Note globale : 4,2/5**`,
  },
  {
    topic_key: 'blog-gnosis-pay-review-2026', lang: 'es', slug: 'gnosis-pay-opiniones-2026', category: 'card',
    title: 'Gnosis Pay Opiniones 2026: la tarjeta crypto self-custody con 2% de cashback en EURE',
    excerpt: 'Gnosis Pay es la primera tarjeta crypto realmente no custodial: 2% de cashback en EURE (stablecoin de euro), sin staking, sin comisiones. Nuestra reseña completa.',
    tags: ['Gnosis Pay', 'Self-custody', 'Tarjeta crypto', 'Cashback'],
    content: `## Gnosis Pay: la primera tarjeta crypto realmente no custodial

Gnosis Pay es una tarjeta Visa conectada directamente a tu **wallet Safe** en Gnosis Chain. A diferencia de todas las demás tarjetas crypto del mercado, tus fondos nunca pasan por un exchange centralizado: mantienes el control de tus claves en todo momento.

## Puntos fuertes

- **2% de cashback en EURE** (stablecoin de euro, 1 EURE = 1 EUR)
- **Sin staking**, sin cuota anual
- Verdadera **self-custody**: tus activos permanecen en tu wallet Safe
- Disponible en toda la UE

## ¿Para quién es?

Gnosis Pay está pensada para **usuarios Web3** que ya dominan los wallets y la blockchain. Si ya usas un wallet Safe o quieres gastar tus criptos sin entregar tus fondos a un tercero, esta es tu tarjeta.

## Cashback en EURE: una propuesta única

En lugar de abonar un token nativo volátil, Gnosis Pay paga el cashback en **EURE**, el stablecoin de euro de Gnosis Chain. Acumulas valor estable, sin riesgo de volatilidad crypto.

## Nuestro veredicto

Gnosis Pay es la opción más avanzada para usuarios Web3 convencidos. Para un cashback máximo sin complejidad, Brighty o Nexo son mejores opciones.

**Nota global: 4,2/5**`,
  },
  {
    topic_key: 'blog-gnosis-pay-review-2026', lang: 'it', slug: 'gnosis-pay-recensione-2026', category: 'card',
    title: 'Gnosis Pay Recensione 2026: la carta crypto self-custody con il 2% di cashback in EURE',
    excerpt: 'Gnosis Pay è la prima carta crypto davvero non-custodial: 2% di cashback in EURE (stablecoin euro), senza staking, senza commissioni. La nostra recensione completa.',
    tags: ['Gnosis Pay', 'Self-custody', 'Carta crypto', 'Cashback'],
    content: `## Gnosis Pay: la prima carta crypto davvero non-custodial

Gnosis Pay è una carta Visa collegata direttamente al tuo **wallet Safe** su Gnosis Chain. A differenza di tutte le altre carte crypto sul mercato, i tuoi fondi non passano mai da un exchange centralizzato: mantieni il controllo delle tue chiavi in ogni momento.

## Punti di forza

- **2% di cashback in EURE** (stablecoin euro, 1 EURE = 1 EUR)
- **Senza staking**, senza canone annuo
- Vera **self-custody**: i tuoi asset restano nel tuo wallet Safe
- Disponibile in tutta l'UE

## Per chi è?

Gnosis Pay si rivolge agli **utenti Web3** che conoscono già wallet e blockchain. Se usi già un wallet Safe o vuoi spendere le tue crypto senza affidare i fondi a terzi, è la carta che fa per te.

## Cashback in EURE: una proposta unica

Invece di accreditare un token nativo volatile, Gnosis Pay paga il cashback in **EURE**, lo stablecoin euro di Gnosis Chain. Accumuli valore stabile, senza rischio di volatilità crypto.

## Il nostro verdetto

Gnosis Pay è l'opzione più evoluta per gli utenti Web3 convinti. Per il massimo cashback senza complessità, Brighty o Nexo restano scelte migliori.

**Voto complessivo: 4,2/5**`,
  },
  // ═══════════════ BRIGHTY ═══════════════
  {
    topic_key: 'blog-brighty-card-review-2026', lang: 'fr', slug: 'brighty-card-avis-2026', category: 'card',
    title: "Brighty Card Avis 2026 : jusqu'à 4% de cashback sans staking",
    excerpt: "Brighty offre le cashback crypto le plus élevé du marché sans staking : jusqu'à 4% en BTC, ETH ou USDT. Sans frais annuels. Notre avis complet.",
    tags: ['Brighty', 'Cashback', 'Carte crypto', 'Sans staking'],
    content: `## Brighty : le cashback crypto le plus élevé sans staking

**Brighty** est une néobanque crypto suisse qui propose ce qu'aucune autre carte gratuite n'offre : **jusqu'à 4% de cashback** sans aucune exigence de staking.

## Points forts

- **Jusqu'à 4% de cashback** en crypto (BTC, ETH, USDT…)
- **Sans staking**, sans frais annuels
- Cashback dans la crypto de votre choix

## Brighty face aux alternatives sans staking

- **Nexo** : 2% — deux fois moins
- **Gnosis Pay** : 2% en EURE (self-custody)
- **MetaMask Card** : 1% en ETH (self-custody)
- **Brighty** : **jusqu'à 4%** dans la crypto de votre choix

## Notre verdict

Si vous cherchez le cashback maximal sans staking et sans frais annuels, Brighty est le meilleur choix en 2026.

**Note globale : 4,3/5**`,
  },
  {
    topic_key: 'blog-brighty-card-review-2026', lang: 'es', slug: 'brighty-card-opiniones-2026', category: 'card',
    title: 'Brighty Card Opiniones 2026: hasta un 4% de cashback sin staking',
    excerpt: 'Brighty ofrece el cashback crypto más alto del mercado sin staking: hasta un 4% en BTC, ETH o USDT. Sin cuota anual. Nuestra reseña completa.',
    tags: ['Brighty', 'Cashback', 'Tarjeta crypto', 'Sin staking'],
    content: `## Brighty: el cashback crypto más alto sin staking

**Brighty** es un neobanco crypto suizo que ofrece lo que ninguna otra tarjeta gratuita puede: **hasta un 4% de cashback** sin ningún requisito de staking.

## Puntos fuertes

- **Hasta un 4% de cashback** en crypto (BTC, ETH, USDT…)
- **Sin staking**, sin cuota anual
- Cashback en la crypto que elijas

## Brighty frente a las alternativas sin staking

- **Nexo**: 2% — la mitad
- **Gnosis Pay**: 2% en EURE (self-custody)
- **MetaMask Card**: 1% en ETH (self-custody)
- **Brighty**: **hasta un 4%** en la crypto que elijas

## Nuestro veredicto

Si buscas el cashback máximo sin staking y sin cuota anual, Brighty es la mejor elección en 2026.

**Nota global: 4,3/5**`,
  },
  {
    topic_key: 'blog-brighty-card-review-2026', lang: 'it', slug: 'brighty-card-recensione-2026', category: 'card',
    title: 'Brighty Card Recensione 2026: fino al 4% di cashback senza staking',
    excerpt: 'Brighty offre il cashback crypto più alto del mercato senza staking: fino al 4% in BTC, ETH o USDT. Senza canone annuo. La nostra recensione completa.',
    tags: ['Brighty', 'Cashback', 'Carta crypto', 'Senza staking'],
    content: `## Brighty: il cashback crypto più alto senza staking

**Brighty** è una neobanca crypto svizzera che offre ciò che nessun'altra carta gratuita propone: **fino al 4% di cashback** senza alcun requisito di staking.

## Punti di forza

- **Fino al 4% di cashback** in crypto (BTC, ETH, USDT…)
- **Senza staking**, senza canone annuo
- Cashback nella crypto che preferisci

## Brighty contro le alternative senza staking

- **Nexo**: 2% — la metà
- **Gnosis Pay**: 2% in EURE (self-custody)
- **MetaMask Card**: 1% in ETH (self-custody)
- **Brighty**: **fino al 4%** nella crypto che preferisci

## Il nostro verdetto

Se cerchi il cashback massimo senza staking e senza canone annuo, Brighty è la scelta migliore nel 2026.

**Voto complessivo: 4,3/5**`,
  },
  // ═══════════════ METAMASK CARD ═══════════════
  {
    topic_key: 'blog-metamask-card-review-2026', lang: 'fr', slug: 'metamask-card-avis-2026', category: 'card',
    title: 'MetaMask Card Avis 2026 : dépensez vos ETH directement depuis votre wallet',
    excerpt: 'La MetaMask Card permet de dépenser vos ETH directement depuis votre wallet MetaMask. 1% de cashback en ETH, sans staking, sans frais. Notre avis complet.',
    tags: ['MetaMask', 'Ethereum', 'Carte crypto', 'Self-custody'],
    content: `## MetaMask Card : dépensez vos ETH sans intermédiaire centralisé

La **MetaMask Card** (Mastercard) est la carte crypto naturelle pour les 30 millions d'utilisateurs de MetaMask. Elle permet de payer en euros directement depuis votre wallet MetaMask.

## Points forts

- **1% de cashback en ETH** sur toutes les dépenses
- **Sans staking**, sans frais annuels
- Reliée directement à votre **wallet MetaMask**
- Self-custody natif : vos clés restent les vôtres

## Notre verdict

La MetaMask Card est la porte d'entrée naturelle des utilisateurs Ethereum vers les paiements du quotidien. Pour un cashback plus élevé, Brighty reste le meilleur choix.

**Note globale : 4,0/5**`,
  },
  {
    topic_key: 'blog-metamask-card-review-2026', lang: 'es', slug: 'metamask-card-opiniones-2026', category: 'card',
    title: 'MetaMask Card Opiniones 2026: gasta tus ETH directamente desde tu wallet',
    excerpt: 'La MetaMask Card permite gastar tus ETH directamente desde tu wallet MetaMask. 1% de cashback en ETH, sin staking, sin comisiones. Nuestra reseña completa.',
    tags: ['MetaMask', 'Ethereum', 'Tarjeta crypto', 'Self-custody'],
    content: `## MetaMask Card: gasta tus ETH sin intermediario centralizado

La **MetaMask Card** (Mastercard) es la tarjeta crypto natural para los 30 millones de usuarios de MetaMask. Permite pagar en euros directamente desde tu wallet MetaMask.

## Puntos fuertes

- **1% de cashback en ETH** en todas las compras
- **Sin staking**, sin cuota anual
- Conectada directamente a tu **wallet MetaMask**
- Self-custody nativa: tus claves siguen siendo tuyas

## Nuestro veredicto

La MetaMask Card es la puerta de entrada natural de los usuarios de Ethereum a los pagos cotidianos. Para un cashback más alto, Brighty es la mejor opción.

**Nota global: 4,0/5**`,
  },
  {
    topic_key: 'blog-metamask-card-review-2026', lang: 'it', slug: 'metamask-card-recensione-2026', category: 'card',
    title: 'MetaMask Card Recensione 2026: spendi i tuoi ETH direttamente dal wallet',
    excerpt: 'La MetaMask Card permette di spendere i tuoi ETH direttamente dal wallet MetaMask. 1% di cashback in ETH, senza staking, senza commissioni. La nostra recensione completa.',
    tags: ['MetaMask', 'Ethereum', 'Carta crypto', 'Self-custody'],
    content: `## MetaMask Card: spendi i tuoi ETH senza intermediari centralizzati

La **MetaMask Card** (Mastercard) è la carta crypto naturale per i 30 milioni di utenti MetaMask. Permette di pagare in euro direttamente dal tuo wallet MetaMask.

## Punti di forza

- **1% di cashback in ETH** su tutte le spese
- **Senza staking**, senza canone annuo
- Collegata direttamente al tuo **wallet MetaMask**
- Self-custody nativa: le tue chiavi restano tue

## Il nostro verdetto

La MetaMask Card è la porta d'ingresso naturale degli utenti Ethereum verso i pagamenti quotidiani. Per un cashback più alto, Brighty resta la scelta migliore.

**Voto complessivo: 4,0/5**`,
  },
];

// ── Insertion ────────────────────────────────────────────────────────────────
let ok = 0, skip = 0;
for (const p of POSTS) {
  const { data: existing } = await sb.from('blog_posts').select('id').eq('lang', p.lang).eq('slug', p.slug).maybeSingle();
  if (existing) { console.log(`↷ existe déjà: [${p.lang}] ${p.slug}`); skip++; continue; }
  const row = { ...p, image_hero: HERO[p.topic_key] ?? null, published: true };
  if (DRY) { console.log(`[dry-run] insérerait [${p.lang}] ${p.slug} (${p.content.split(/\s+/).length} mots)`); ok++; continue; }
  const { error } = await sb.from('blog_posts').insert(row);
  if (error) console.error(`✗ [${p.lang}] ${p.slug}: ${error.message}`);
  else { console.log(`✓ [${p.lang}] ${p.slug}`); ok++; }
}
console.log(`\n${ok} insérés, ${skip} ignorés.`);
console.log('Prochaine étape: node scripts/gen-blog-sitemap.mjs puis commit + push (le prerender les publiera).');
