/**
 * internalLinks.ts — Static mappings for internal linking / SEO maillage interne
 * Used by CardDetail, ReviewPage, ThematicPage, BlogPost, Home
 */

// ── Comparison pairs (17 pairs from comparisonContent.ts) ────────────────────
// Each pair is [id1, id2] where ids match Supabase card IDs
export const COMPARISON_PAIRS: [string, string][] = [
  // ── Original 17 pairs ────────────────────────────────────────────────────────
  ['bybit-card', 'nexo-card'],
  ['crypto-com-midnight-blue', 'nexo-card'],
  ['crypto-com-ruby-steel', 'nexo-card'],
  ['nexo-card', 'wirex-elite'],
  ['binance-card', 'bybit-card'],
  ['bybit-card', 'crypto-com-midnight-blue'],
  ['coinbase-card', 'nexo-card'],
  ['binance-card', 'nexo-card'],
  ['bybit-card', 'okx-card'],
  ['bybit-card', 'wirex-elite'],
  ['nexo-card', 'okx-card'],
  ['binance-card', 'crypto-com-midnight-blue'],
  ['bybit-card', 'coinbase-card'],
  ['crypto-com-midnight-blue', 'wirex-elite'],
  ['bitpanda-card', 'nexo-card'],
  ['binance-card', 'okx-card'],
  ['coinbase-card', 'wirex-elite'],
  // ── Gnosis Pay (9 pairs) ─────────────────────────────────────────────────────
  ['binance-card', 'gnosis-pay-card'],
  ['bitpanda-card', 'gnosis-pay-card'],
  ['bybit-card', 'gnosis-pay-card'],
  ['coinbase-card', 'gnosis-pay-card'],
  ['crypto-com-midnight-blue', 'gnosis-pay-card'],
  ['crypto-com-ruby-steel', 'gnosis-pay-card'],
  ['gnosis-pay-card', 'nexo-card'],
  ['gnosis-pay-card', 'okx-card'],
  ['gnosis-pay-card', 'wirex-elite'],
  // ── MetaMask Card (9 pairs) ──────────────────────────────────────────────────
  ['binance-card', 'metamask-card'],
  ['bitpanda-card', 'metamask-card'],
  ['bybit-card', 'metamask-card'],
  ['coinbase-card', 'metamask-card'],
  ['crypto-com-midnight-blue', 'metamask-card'],
  ['crypto-com-ruby-steel', 'metamask-card'],
  ['metamask-card', 'nexo-card'],
  ['metamask-card', 'okx-card'],
  ['metamask-card', 'wirex-elite'],
  // ── Brighty (9 pairs) ────────────────────────────────────────────────────────
  ['binance-card', 'brighty-card'],
  ['bitpanda-card', 'brighty-card'],
  ['brighty-card', 'bybit-card'],
  ['brighty-card', 'coinbase-card'],
  ['brighty-card', 'crypto-com-midnight-blue'],
  ['brighty-card', 'crypto-com-ruby-steel'],
  ['brighty-card', 'nexo-card'],
  ['brighty-card', 'okx-card'],
  ['brighty-card', 'wirex-elite'],
  // ── Ledger Card (9 pairs) ────────────────────────────────────────────────────
  ['binance-card', 'ledger-card'],
  ['bitpanda-card', 'ledger-card'],
  ['bybit-card', 'ledger-card'],
  ['coinbase-card', 'ledger-card'],
  ['crypto-com-midnight-blue', 'ledger-card'],
  ['crypto-com-ruby-steel', 'ledger-card'],
  ['ledger-card', 'nexo-card'],
  ['ledger-card', 'okx-card'],
  ['ledger-card', 'wirex-elite'],
  // ── New × New (6 pairs) ──────────────────────────────────────────────────────
  ['brighty-card', 'gnosis-pay-card'],
  ['brighty-card', 'ledger-card'],
  ['brighty-card', 'metamask-card'],
  ['gnosis-pay-card', 'ledger-card'],
  ['gnosis-pay-card', 'metamask-card'],
  ['ledger-card', 'metamask-card'],
  // ── Completing all 78 pairs ────────────────────────────────────────────────
  ['binance-card', 'bitpanda-card'],
  ['binance-card', 'coinbase-card'],
  ['binance-card', 'crypto-com-ruby-steel'],
  ['binance-card', 'wirex-elite'],
  ['bitpanda-card', 'bybit-card'],
  ['bitpanda-card', 'coinbase-card'],
  ['bitpanda-card', 'crypto-com-midnight-blue'],
  ['bitpanda-card', 'crypto-com-ruby-steel'],
  ['bitpanda-card', 'okx-card'],
  ['bitpanda-card', 'wirex-elite'],
  ['bybit-card', 'crypto-com-ruby-steel'],
  ['coinbase-card', 'crypto-com-midnight-blue'],
  ['coinbase-card', 'crypto-com-ruby-steel'],
  ['coinbase-card', 'okx-card'],
  ['crypto-com-midnight-blue', 'crypto-com-ruby-steel'],
  ['crypto-com-midnight-blue', 'okx-card'],
  ['crypto-com-ruby-steel', 'okx-card'],
  ['crypto-com-ruby-steel', 'wirex-elite'],
  ['okx-card', 'wirex-elite'],
];

// ── Per-card: which other cards have comparison pages ───────────────────────
export const CARD_COMPARISONS: Record<string, string[]> = {};
for (const [a, b] of COMPARISON_PAIRS) {
  if (!CARD_COMPARISONS[a]) CARD_COMPARISONS[a] = [];
  if (!CARD_COMPARISONS[b]) CARD_COMPARISONS[b] = [];
  CARD_COMPARISONS[a].push(b);
  CARD_COMPARISONS[b].push(a);
}

// ── Card display names ───────────────────────────────────────────────────────
export const CARD_NAMES: Record<string, string> = {
  'nexo-card':               'Nexo Card',
  'bybit-card':              'Bybit Card',
  'binance-card':            'Binance Card',
  'crypto-com-midnight-blue':'Crypto.com Midnight Blue',
  'crypto-com-ruby-steel':   'Crypto.com Ruby Steel',
  'wirex-elite':             'Wirex Elite',
  'coinbase-card':           'Coinbase Card',
  'okx-card':                'OKX Card',
  'bitpanda-card':           'Bitpanda Card',
  'gnosis-pay-card':         'Gnosis Pay',
  'metamask-card':           'MetaMask Card',
  'brighty-card':            'Brighty',
  'ledger-card':             'Ledger Card',
};

// ── Card ID → review page slug ───────────────────────────────────────────────
export const CARD_REVIEW_SLUGS: Record<string, string> = {
  'nexo-card':               'nexo-card',
  'bybit-card':              'bybit-card',
  'binance-card':            'binance-card',
  'crypto-com-midnight-blue':'crypto-com-card',
  'crypto-com-ruby-steel':   'crypto-com-card',
  'coinbase-card':           'coinbase-card',
  'okx-card':                'okx-card',
  'bitpanda-card':           'bitpanda-card',
  'wirex-elite':             'wirex-card',
  'ledger-card':             'ledger-card',
  'gnosis-pay-card':         'gnosis-pay-card',
  'metamask-card':           'metamask-card',
  'brighty-card':            'brighty-card',
};

// ── Review slug → card ID (reverse lookup) ──────────────────────────────────
export const REVIEW_SLUG_TO_CARD_ID: Record<string, string> = {
  'nexo-card':      'nexo-card',
  'bybit-card':     'bybit-card',
  'binance-card':   'binance-card',
  'crypto-com-card':'crypto-com-midnight-blue',
  'coinbase-card':  'coinbase-card',
  'okx-card':       'okx-card',
  'bitpanda-card':  'bitpanda-card',
  'wirex-card':     'wirex-elite',
  'ledger-card':    'ledger-card',
  'gnosis-pay-card':'gnosis-pay-card',
  'metamask-card':  'metamask-card',
  'brighty-card':   'brighty-card',
};

// ── URL segments per language ────────────────────────────────────────────────
export const COMPARE_SEG: Record<string, string> = {
  fr: 'comparer', de: 'vergleichen', es: 'comparar', it: 'confrontare', en: 'compare',
};
export const REVIEW_SEG: Record<string, string> = {
  fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews',
};
export const CARD_SEG: Record<string, string> = {
  fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards',
};
export const CRYPTO_SEG: Record<string, string> = {
  fr: 'cryptos', de: 'kryptos', es: 'criptos', it: 'criptos', en: 'cryptos',
};

// ── Build normalized comparison slug (alphabetical) ─────────────────────────
export function comparisonSlug(id1: string, id2: string): string {
  return [id1, id2].sort().join('-vs-');
}

// ── Thematic page slugs per theme per language ───────────────────────────────
export const THEMATIC_SLUGS: Record<string, Record<string, string>> = {
  'best':       { fr:'meilleure-carte-crypto',       de:'beste-krypto-karte',              es:'mejor-tarjeta-cripto',            it:'migliore-carta-cripto',          en:'best-crypto-card' },
  'cashback':   { fr:'carte-crypto-cashback',         de:'krypto-karte-cashback',           es:'tarjeta-cripto-cashback',          it:'carta-cripto-cashback',           en:'crypto-card-cashback' },
  'no-fees':    { fr:'carte-crypto-sans-frais',       de:'krypto-karte-ohne-jahresgebuehr', es:'tarjeta-cripto-sin-comisiones',    it:'carta-cripto-senza-commissioni',  en:'crypto-card-no-fees' },
  'no-staking': { fr:'carte-crypto-sans-staking',     de:'krypto-karte-ohne-staking',       es:'tarjeta-cripto-sin-staking',       it:'carta-cripto-senza-staking',      en:'crypto-card-no-staking' },
  'france':     { fr:'cartes-crypto-france',          de:'krypto-karten-deutschland',       es:'tarjetas-crypto-espana',           it:'carte-crypto-italia',             en:'crypto-cards-europe' },
  'virtual':    { fr:'carte-crypto-virtuelle',        de:'virtuelle-krypto-karte',          es:'tarjeta-crypto-virtual',           it:'carta-crypto-virtuale',           en:'virtual-crypto-card' },
  'beginner':   { fr:'cartes-crypto-debutant',        de:'krypto-karten-einsteiger',        es:'tarjetas-crypto-principiante',     it:'carte-crypto-principiante',       en:'beginner-crypto-cards' },
  'no-kyc':     { fr:'carte-crypto-sans-kyc',         de:'krypto-karte-ohne-kyc',           es:'tarjeta-cripto-sin-kyc',           it:'carta-cripto-senza-kyc',          en:'crypto-card-no-kyc' },
  '2026':       { fr:'meilleures-cartes-crypto-2026', de:'beste-krypto-karten-2026',        es:'mejores-tarjetas-crypto-2026',     it:'migliori-carte-crypto-2026',      en:'best-crypto-cards-2026' },
  'travel':     { fr:'carte-crypto-voyage',           de:'krypto-karte-reise',              es:'tarjeta-cripto-viaje',             it:'carta-cripto-viaggio',           en:'crypto-card-travel' },
  'rewards':    { fr:'carte-crypto-recompenses',      de:'krypto-karte-praemien',           es:'tarjeta-cripto-recompensas',       it:'carta-cripto-premi',             en:'crypto-card-rewards' },
};

// ── Thematic labels per lang ─────────────────────────────────────────────────
export const THEMATIC_LABELS: Record<string, Record<string, string>> = {
  'best':       { fr:'Meilleures cartes crypto',     de:'Beste Krypto-Karten',       es:'Mejores tarjetas crypto',    it:'Migliori carte crypto',       en:'Best crypto cards' },
  'cashback':   { fr:'Cartes avec cashback',          de:'Karten mit Cashback',        es:'Tarjetas con cashback',      it:'Carte con cashback',           en:'Cashback cards' },
  'no-fees':    { fr:'Cartes sans frais annuels',     de:'Ohne Jahresgebühr',          es:'Sin comisiones anuales',     it:'Senza costi annuali',          en:'No annual fee' },
  'no-staking': { fr:'Sans staking requis',           de:'Ohne Staking',               es:'Sin staking requerido',      it:'Senza staking richiesto',      en:'No staking required' },
  'france':     { fr:'Cartes disponibles en France',  de:'Karten in Deutschland',      es:'Disponibles en España',      it:'Disponibili in Italia',        en:'Cards in Europe' },
  'virtual':    { fr:'Cartes virtuelles',             de:'Virtuelle Karten',           es:'Tarjetas virtuales',         it:'Carte virtuali',               en:'Virtual cards' },
  'beginner':   { fr:'Pour débutants',                de:'Für Einsteiger',             es:'Para principiantes',         it:'Per principianti',             en:'For beginners' },
  'no-kyc':     { fr:'Sans KYC',                      de:'Ohne KYC',                   es:'Sin KYC',                    it:'Senza KYC',                    en:'No KYC' },
  '2026':       { fr:'Top cartes 2026',               de:'Top Karten 2026',            es:'Mejores tarjetas 2026',      it:'Migliori carte 2026',          en:'Top cards 2026' },
  'travel':     { fr:'Cartes pour voyager',           de:'Karten fürs Reisen',         es:'Tarjetas para viajar',       it:'Carte per viaggiare',          en:'Cards for travel' },
  'rewards':    { fr:'Meilleures récompenses',        de:'Beste Prämien',              es:'Mejores recompensas',        it:'Migliori premi',               en:'Best rewards' },
};

// ── Comparison pairs relevant to each theme ──────────────────────────────────
export const THEME_COMPARISONS: Record<string, [string, string][]> = {
  'best': [
    ['bybit-card', 'nexo-card'],
    ['binance-card', 'nexo-card'],
    ['bybit-card', 'crypto-com-midnight-blue'],
    ['binance-card', 'bybit-card'],
  ],
  'cashback': [
    ['bybit-card', 'nexo-card'],
    ['binance-card', 'nexo-card'],
    ['binance-card', 'bybit-card'],
    ['binance-card', 'crypto-com-midnight-blue'],
    ['brighty-card', 'nexo-card'],
    ['brighty-card', 'bybit-card'],
  ],
  'no-fees': [
    ['coinbase-card', 'nexo-card'],
    ['coinbase-card', 'wirex-elite'],
    ['bybit-card', 'nexo-card'],
    ['brighty-card', 'nexo-card'],
    ['gnosis-pay-card', 'nexo-card'],
  ],
  'no-staking': [
    ['bybit-card', 'coinbase-card'],
    ['coinbase-card', 'nexo-card'],
    ['bybit-card', 'nexo-card'],
    ['coinbase-card', 'wirex-elite'],
    ['brighty-card', 'nexo-card'],
    ['gnosis-pay-card', 'nexo-card'],
    ['metamask-card', 'nexo-card'],
  ],
  'france': [
    ['bybit-card', 'nexo-card'],
    ['crypto-com-midnight-blue', 'nexo-card'],
    ['binance-card', 'nexo-card'],
  ],
  'virtual': [
    ['bybit-card', 'nexo-card'],
    ['coinbase-card', 'nexo-card'],
  ],
  'beginner': [
    ['coinbase-card', 'nexo-card'],
    ['bybit-card', 'coinbase-card'],
    ['bybit-card', 'nexo-card'],
  ],
  'no-kyc': [
    ['bybit-card', 'okx-card'],
    ['binance-card', 'okx-card'],
    ['bybit-card', 'nexo-card'],
    ['gnosis-pay-card', 'nexo-card'],
    ['metamask-card', 'nexo-card'],
  ],
  '2026': [
    ['bybit-card', 'nexo-card'],
    ['binance-card', 'nexo-card'],
    ['binance-card', 'bybit-card'],
    ['bybit-card', 'crypto-com-midnight-blue'],
    ['brighty-card', 'nexo-card'],
    ['gnosis-pay-card', 'nexo-card'],
  ],
  'travel': [
    ['crypto-com-ruby-steel', 'wirex-elite'],
    ['binance-card', 'wirex-elite'],
    ['crypto-com-ruby-steel', 'binance-card'],
    ['coinbase-card', 'wirex-elite'],
  ],
  'rewards': [
    ['bybit-card', 'nexo-card'],
    ['binance-card', 'wirex-elite'],
    ['crypto-com-ruby-steel', 'wirex-elite'],
    ['brighty-card', 'nexo-card'],
  ],
};

// ── "Compare these cards" label per lang ─────────────────────────────────────
export const COMPARE_SECTION_LABEL: Record<string, string> = {
  fr: 'Comparer ces cartes',
  de: 'Karten vergleichen',
  es: 'Comparar estas tarjetas',
  it: 'Confronta queste carte',
  en: 'Compare these cards',
};

// ── "Compare X vs Y" label pattern ───────────────────────────────────────────
export const VS_LABEL: Record<string, string> = {
  fr: 'vs', de: 'vs.', es: 'vs', it: 'vs', en: 'vs',
};

// ── Tags → card IDs (for BlogPost "Voir aussi") ──────────────────────────────
export const TAG_TO_CARD_ID: Record<string, string> = {
  'nexo': 'nexo-card',
  'nexo card': 'nexo-card',
  'bybit': 'bybit-card',
  'bybit card': 'bybit-card',
  'binance': 'binance-card',
  'binance card': 'binance-card',
  'crypto.com': 'crypto-com-midnight-blue',
  'crypto com': 'crypto-com-midnight-blue',
  'coinbase': 'coinbase-card',
  'coinbase card': 'coinbase-card',
  'okx': 'okx-card',
  'okx card': 'okx-card',
  'wirex': 'wirex-elite',
  'bitpanda': 'bitpanda-card',
  'ledger': 'ledger-card',
  'ledger card': 'ledger-card',
  'gnosis': 'gnosis-pay-card',
  'gnosis pay': 'gnosis-pay-card',
  'gnosis pay card': 'gnosis-pay-card',
  'metamask': 'metamask-card',
  'metamask card': 'metamask-card',
  'brighty': 'brighty-card',
  'brighty card': 'brighty-card',
};

// ── Tags → thematic themes (for BlogPost "Voir aussi") ───────────────────────
export const TAG_TO_THEME: Record<string, string> = {
  'cashback': 'cashback',
  'récompenses': 'cashback',
  'rewards': 'cashback',
  'gratuit': 'no-fees',
  'sans frais': 'no-fees',
  'no fees': 'no-fees',
  'sans staking': 'no-staking',
  'no staking': 'no-staking',
  'france': 'france',
  'virtuelle': 'virtual',
  'virtual': 'virtual',
  'débutant': 'beginner',
  'beginner': 'beginner',
  'kyc': 'no-kyc',
  '2026': '2026',
  'meilleure': 'best',
  'best': 'best',
  'comparatif': 'best',
  'voyage': 'travel',
  'travel': 'travel',
  'reisen': 'travel',
  'viaje': 'travel',
  'retrait atm': 'travel',
  'récompenses': 'rewards',
  'rewards': 'rewards',
  'prämien': 'rewards',
  'recompensas': 'rewards',
};
