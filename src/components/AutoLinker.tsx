/**
 * AutoLinker — replaces known brand/card names AND crypto token names in plain text
 * with <Link> components.
 *
 * Brand names   → /${lang}/${brandsSlug}/${brandId}   e.g. /fr/marques/crypto-com
 * Crypto tokens → /${lang}/cryptos/${symbol}          e.g. /fr/cryptos/btc
 *
 * Ordered longest-match first to avoid partial replacements.
 * Tickers (BTC, ETH…) use word boundaries to prevent false matches inside other words.
 */
import { Link } from 'react-router-dom';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

// ── Brand entities ──────────────────────────────────────────────────────────
// [displayName, brandId] — longest/most specific first
const BRAND_ENTITIES: [string, string][] = [
  ['Gnosis Pay',          'gnosis'],
  ['MetaMask Card',       'metamask'],
  ['Ether.fi Card',       'etherfi'],
  ['Crypto.com Obsidian', 'crypto-com'],
  ['Crypto.com Jade',     'crypto-com'],
  ['Crypto.com Ruby',     'crypto-com'],
  ['Crypto.com',          'crypto-com'],
  ['MetaMask',            'metamask'],
  ['Ether.fi',            'etherfi'],
  ['Brighty',             'brighty'],
  ['Deblock',             'deblock'],
  ['Bitpanda',            'bitpanda'],
  ['Binance',             'binance'],
  ['Revolut',             'revolut'],
  ['Bybit',               'bybit'],
  ['Wirex',               'wirex'],
  ['Kraken',              'kraken'],
  ['Nexo',                'nexo'],
  ['Bleap',               'bleap'],
  ['OKX',                 'okx'],
];

// ── Crypto entities ─────────────────────────────────────────────────────────
// [displayName, symbol] — full names first, then tickers (uppercase, word-boundary protected)
const CRYPTO_ENTITIES: [string, string][] = [
  ['USD Coin',  'usdc'],
  ['Dogecoin',  'doge'],
  ['Avalanche', 'avax'],
  ['Cardano',   'ada'],
  ['Ethereum',  'eth'],
  ['Bitcoin',   'btc'],
  ['Solana',    'sol'],
  ['Tether',    'usdt'],
  ['Ripple',    'xrp'],
  // Uppercase tickers — word-boundary protected in the regex below
  ['USDC', 'usdc'],
  ['USDT', 'usdt'],
  ['AVAX', 'avax'],
  ['DOGE', 'doge'],
  ['BNB',  'bnb'],
  ['ADA',  'ada'],
  ['XRP',  'xrp'],
  ['ETH',  'eth'],
  ['BTC',  'btc'],
  ['SOL',  'sol'],
];

// Set of tickers that need \b word boundaries (short uppercase strings)
const TICKER_SET = new Set(['USDC','USDT','AVAX','DOGE','BNB','ADA','XRP','ETH','BTC','SOL']);

function escRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Pre-build combined pattern once at module level
const PATTERN = new RegExp(
  '(' +
  [
    ...BRAND_ENTITIES.map(([n]) => escRe(n)),
    ...CRYPTO_ENTITIES.map(([n]) => TICKER_SET.has(n) ? `\\b${escRe(n)}\\b` : escRe(n)),
  ].join('|') +
  ')',
  'g'
);

// ── HTML post-processor (for dangerouslySetInnerHTML content) ────────────────
/**
 * Inject brand/crypto links into a pre-rendered HTML string.
 * Skips text already inside an <a> tag to avoid double-linking.
 * Use this for article bodies rendered via renderMarkdown().
 */
export function autoLinkHtml(html: string, lang: string, brandsSlug: string): string {
  // Split on existing <a>…</a> blocks — leave those intact, process the rest
  return html.replace(/(<a\b[^>]*>[\s\S]*?<\/a>)|([^<]+)/g, (_: string, insideAnchor: string, textNode: string) => {
    if (insideAnchor) return insideAnchor;
    if (!textNode) return _;
    return textNode.replace(PATTERN, (match: string) => {
      const brand = BRAND_ENTITIES.find(([n]) => n === match);
      if (brand) {
        return `<a href="/${lang}/${brandsSlug}/${brand[1]}" class="text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline transition-colors">${match}</a>`;
      }
      const crypto = CRYPTO_ENTITIES.find(([n]) => n === match);
      if (crypto) {
        return `<a href="/${lang}/cryptos/${crypto[1]}" class="text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline transition-colors">${match}</a>`;
      }
      return match;
    });
  });
}

// ── React component ──────────────────────────────────────────────────────────
interface AutoLinkerProps {
  text: string;
  lang: string;
  className?: string;
  /** Extra Tailwind classes on the generated <Link> elements */
  linkClassName?: string;
}

export default function AutoLinker({
  text,
  lang,
  className,
  linkClassName = 'text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline transition-colors',
}: AutoLinkerProps) {
  const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;
  const brandsSlug = rt.brands ?? 'brands';

  const parts = text.split(PATTERN);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const brand = BRAND_ENTITIES.find(([name]) => name === part);
        if (brand) {
          return (
            <Link key={i} to={`/${lang}/${brandsSlug}/${brand[1]}`} className={linkClassName}>
              {part}
            </Link>
          );
        }
        const crypto = CRYPTO_ENTITIES.find(([name]) => name === part);
        if (crypto) {
          return (
            <Link key={i} to={`/${lang}/cryptos/${crypto[1]}`} className={linkClassName}>
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
