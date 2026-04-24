import { useState } from 'react';
import type { CryptoCard } from '../types/card';
import CardVisual from './CardVisual';

interface Props {
  card: CryptoCard;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tilt?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<string, string> = {
  xs: 'w-36 h-[90px]',
  sm: 'w-56 h-36',
  md: 'w-72 h-44',
  lg: 'w-[340px] h-[210px]',
};

export default function SmartCardImage({ card, size = 'md', tilt = false, className = '' }: Props) {
  const [errored, setErrored] = useState(false);

  const sizeClass = SIZE_CLASSES[size];

  if (!card.realCardImage || errored) {
    return <CardVisual card={card} size={size} tilt={tilt} className={`flex-none shrink-0 ${className}`} />;
  }

  const alt =
    card.imageAlt || `Carte physique ${card.name} de ${card.issuer}, vue de face`;

  return (
    <div
      className={`${sizeClass} flex-none shrink-0 relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 ${className}`}
    >
      <img
        src={card.realCardImage}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
