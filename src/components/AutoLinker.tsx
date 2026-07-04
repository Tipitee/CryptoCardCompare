/**
 * AutoLinker — replaces known brand/card names in plain text with <Link> components.
 * Ordered longest-match first to avoid partial replacements
 * (e.g. "Gnosis Pay" matched before "Gnosis").
 */
import { Link } from 'react-router-dom';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

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

// Pre-build the regex once (module-level)
const PATTERN = new RegExp(
  `(${BRAND_ENTITIES.map(([n]) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'g'
);

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
        const match = BRAND_ENTITIES.find(([name]) => name === part);
        if (match) {
          const [, brandId] = match;
          return (
            <Link
              key={i}
              to={`/${lang}/${brandsSlug}/${brandId}`}
              className={linkClassName}
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
