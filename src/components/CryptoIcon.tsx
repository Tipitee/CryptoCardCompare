interface Props {
  symbol: string;
  size?: number;
}

const COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  BNB: '#F3BA2F',
  CRO: '#103F68',
  SOL: '#14F195',
  XRP: '#23292F',
  ADA: '#0033AD',
  USDC: '#2775CA',
  USDT: '#26A17B',
  DOT: '#E6007A',
  MATIC: '#8247E5',
  AVAX: '#E84142',
  LINK: '#2A5ADA',
  NEXO: '#1A4199',
  BEST: '#10B981',
  WXT: '#EC4899',
  PLU: '#F97316',
  BUSD: '#F0B90B',
  SXP: '#FF6B00',
  DAI: '#F5AC37',
  LTC: '#345D9D',
  BCH: '#0AC18E',
  XLM: '#14B6E7',
};

export default function CryptoIcon({ symbol, size = 20 }: Props) {
  const bg = COLORS[symbol] ?? '#475569';
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.38,
        letterSpacing: '-0.02em',
      }}
      title={symbol}
    >
      {symbol.slice(0, 3)}
    </div>
  );
}
