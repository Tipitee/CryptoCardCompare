import { useState } from 'react';
import type { CryptoCard } from '../types/card';
import CardVisual from './CardVisual';

interface Props {
  card: CryptoCard;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tilt?: boolean;
  className?: string;
  priority?: boolean;
}

const SIZE_CLASSES: Record<string, string> = {
  xs: 'w-36 h-[90px]',
  sm: 'w-56 h-36',
  md: 'w-72 h-44',
  lg: 'w-[340px] h-[210px]',
};

const SIZE_DIMS: Record<string, { width: number; height: number }> = {
  xs: { width: 144, height: 90 },
  sm: { width: 224, height: 144 },
  md: { width: 288, height: 176 },
  lg: { width: 340, height: 210 },
};

/**
 * Proxies any image through Netlify Image CDN, which resizes, compresses,
 * and serves WebP automatically. Available on all Netlify plans at no extra cost.
 * Path: /.netlify/images?url=<encoded>&w=<px>&q=<0-100>
 */
function getOptimizedImageUrl(url: string, width: number, quality = 80): string {
  if (!url) return url;
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&fm=webp`;
}

export default function SmartCardImage({ card, size = 'md', tilt = false, className = '', priority = false }: Props) {
  const [errored, setErrored] = useState(false);

  const sizeClass = SIZE_CLASSES[size];
  const dims = SIZE_DIMS[size];

  if (!card.realCardImage || errored) {
    return <CardVisual card={card} size={size} tilt={tilt} className={`flex-none shrink-0 ${className}`} />;
  }

  const pageLang = window.location.pathname.split('/')[1] || 'fr';
  const ALT_TPL: Record<string, (n: string, i: string) => string> = {
    fr: (n, i) => `Carte physique ${n} de ${i}, vue de face`,
    de: (n, i) => `Physische ${n} Karte von ${i}, Vorderseite`,
    es: (n, i) => `Tarjeta física ${n} de ${i}, vista frontal`,
    it: (n, i) => `Carta fisica ${n} di ${i}, vista frontale`,
    en: (n, i) => `${n} physical card by ${i}, front view`,
  };
  const altFn = ALT_TPL[pageLang] ?? ALT_TPL.en;
  const alt = card.imageAlt || altFn(card.name, card.issuer);

  const optimizedSrc = getOptimizedImageUrl(card.realCardImage, dims.width * 2);

  return (
    <div
      className={`${sizeClass} flex-none shrink-0 relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-bg-card ${className}`}
    >
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        width={dims.width}
        height={dims.height}
        onError={() => setErrored(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
