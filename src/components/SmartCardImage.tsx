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
 * Returns an optimized image URL using Supabase Storage image transforms.
 * Falls back to the raw URL for non-Supabase sources.
 */
function getOptimizedImageUrl(url: string, width: number, quality = 80): string {
  if (!url) return url;
  // Supabase Storage image transform API (no extra plan required for public buckets)
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    return url.replace('/object/public/', '/render/image/public/') +
      `?width=${width}&quality=${quality}&format=webp`;
  }
  return url;
}

export default function SmartCardImage({ card, size = 'md', tilt = false, className = '', priority = false }: Props) {
  // 'optimized' → try Supabase render URL; 'raw' → try direct URL; 'failed' → CardVisual
  const [imgState, setImgState] = useState<'optimized' | 'raw' | 'failed'>('optimized');

  const sizeClass = SIZE_CLASSES[size];
  const dims = SIZE_DIMS[size];

  if (!card.realCardImage || imgState === 'failed') {
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

  const src = imgState === 'optimized'
    ? getOptimizedImageUrl(card.realCardImage, dims.width * 2)
    : card.realCardImage;

  const handleError = () => {
    if (imgState === 'optimized') setImgState('raw');
    else setImgState('failed');
  };

  return (
    <div
      className={`${sizeClass} flex-none shrink-0 relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-bg-card ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        width={dims.width}
        height={dims.height}
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
