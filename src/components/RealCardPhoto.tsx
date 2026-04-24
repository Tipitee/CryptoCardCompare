import { useState } from 'react';
import type { CryptoCard } from '../types/card';
import CardVisual from './CardVisual';

interface Props {
  card: CryptoCard;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tilt?: boolean;
  className?: string;
  hoverPreview?: boolean;
}

const SIZE_CLASSES: Record<string, string> = {
  xs: 'w-36 h-[90px]',
  sm: 'w-56 h-36',
  md: 'w-72 h-44',
  lg: 'w-[340px] h-[210px]',
};

export default function RealCardPhoto({
  card,
  size = 'xs',
  tilt = false,
  className = '',
  hoverPreview = true,
}: Props) {
  const [errored, setErrored] = useState(false);
  const hasRealImage = Boolean(card.realCardImage) && !errored;

  if (!hasRealImage) {
    return <CardVisual card={card} size={size} tilt={tilt} className={className} />;
  }

  const alt =
    card.imageAlt ||
    `Carte physique ${card.name} de ${card.issuer}, vue de face`;

  return (
    <div
      className={`group relative ${SIZE_CLASSES[size]} ${className} rounded-2xl overflow-hidden`}
      aria-label={alt}
    >
      <img
        src={card.realCardImage as string}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        className="w-full h-full object-cover shadow-lg ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.02]"
      />
      {hoverPreview && (
        <div
          className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
          role="tooltip"
        >
          <div className="bg-bg-card border border-bg-border rounded-xl p-2 shadow-2xl">
            <img
              src={card.realCardImage as string}
              alt={alt}
              loading="lazy"
              className="w-[340px] h-[210px] object-cover rounded-2xl"
            />
            <div className="mt-1.5 text-center text-[11px] text-slate-400">
              {card.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
