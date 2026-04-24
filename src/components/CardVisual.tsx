import { useRef, useState, MouseEvent } from 'react';
import type { CryptoCard } from '../types/card';

interface Props {
  card: CryptoCard;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tilt?: boolean;
  className?: string;
}

const SIZES: Record<string, string> = {
  xs: 'w-36 h-[90px]',
  sm: 'w-56 h-36',
  md: 'w-72 h-44',
  lg: 'w-[340px] h-[210px]',
};

export default function CardVisual({ card, size = 'md', tilt = true, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const activeTilt = tilt && !prefersReduced;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!activeTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setT({
      ry: (px - 0.5) * 16,
      rx: (0.5 - py) * 14,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const onLeave = () => setT({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const bg = `linear-gradient(135deg, ${card.colorPrimary} 0%, ${card.colorSecondary} 100%)`;
  const issuerLabel = card.issuer.toUpperCase();
  const isLightBg = size === 'lg';
  void isLightBg;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${SIZES[size]} relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 ${className}`}
      style={{
        transform: activeTilt
          ? `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`
          : undefined,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.25s ease-out',
        background: bg,
      }}
      aria-label={`Carte ${card.name} de ${card.issuer}`}
    >
      <div
        className="absolute inset-0 opacity-70 mix-blend-overlay pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.35), transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 10px)',
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <div className="text-[10px] font-semibold tracking-[0.2em] opacity-80">
            {issuerLabel}
          </div>
          {size !== 'xs' && (
            <div className="flex gap-1">
              <span className="w-4 h-4 rounded-full bg-white/30 border border-white/40 -mr-2" />
              <span className="w-4 h-4 rounded-full bg-white/20 border border-white/40" />
            </div>
          )}
        </div>

        {size !== 'xs' && (
          <div className="flex items-center">
            <div className="w-9 h-7 rounded-[4px] bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 relative overflow-hidden shadow-inner">
              <div className="absolute inset-1 grid grid-cols-3 grid-rows-2 gap-[1px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-amber-700/30" />
                ))}
              </div>
            </div>
            <div className="ml-2 text-white/60">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M3 12c4-6 14-6 18 0M6 15c3-4 9-4 12 0M9 18c2-2 4-2 6 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}

        <div>
          {size !== 'xs' && (
            <div className="font-mono text-[13px] tracking-[0.2em] opacity-90 mb-1.5">
              •••• •••• •••• {card.id.slice(-4).toUpperCase().padStart(4, '0')}
            </div>
          )}
          <div className="flex items-end justify-between">
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-wider opacity-60">Titulaire</div>
              <div className="text-xs font-semibold truncate">{card.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider opacity-60">Réseau</div>
              <div className="text-sm font-bold italic">
                {card.cardNetwork.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
