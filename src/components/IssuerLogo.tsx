interface Props {
  issuer: string;
  size?: 'sm' | 'md' | 'lg';
}

const palette: Record<string, string> = {
  'Crypto.com': 'from-cyan-400 to-blue-600',
  Binance: 'from-yellow-400 to-amber-600',
  Nexo: 'from-sky-400 to-cyan-600',
  Bitpanda: 'from-emerald-400 to-teal-600',
  Wirex: 'from-pink-400 to-rose-600',
  Coinbase: 'from-blue-400 to-blue-700',
  Monolith: 'from-slate-400 to-slate-700',
  Plutus: 'from-amber-400 to-orange-600',
  Klarpay: 'from-teal-400 to-cyan-700',
};

export default function IssuerLogo({ issuer, size = 'md' }: Props) {
  const initial = issuer.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'C';
  const gradient = palette[issuer] ?? 'from-cyan-accent to-green-accent';
  const dims =
    size === 'sm' ? 'w-8 h-8 text-[11px]' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-xs';
  return (
    <div
      className={`${dims} shrink-0 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white shadow-md`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
