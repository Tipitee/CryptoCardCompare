/**
 * Centralised routing configuration.
 *
 * Single source of truth for:
 *  - Thematic SEO routes (previously scattered across App.tsx and Layout.tsx)
 *  - Review route labels per language (previously duplicated in Layout.tsx)
 *  - Thematic nav labels per language (previously duplicated in Layout.tsx)
 *
 * App.tsx generates <Route> elements from THEMATIC_ROUTES.
 * Layout.tsx builds navigation links from THEMATIC_NAV_LABELS.
 */

import type { Language } from '../i18n/types';

// ---------------------------------------------------------------------------
// Thematic routes
// Each key is the canonical theme name used as the `theme` prop of <ThematicPage>.
// Values map each language to its localised URL slug.
// ---------------------------------------------------------------------------

export const THEMATIC_ROUTES: Record<string, Record<Language, string>> = {
  best: {
    fr: 'meilleure-carte-crypto',
    de: 'beste-krypto-karte',
    es: 'mejor-tarjeta-cripto',
    it: 'migliore-carta-cripto',
    en: 'best-crypto-card',
  },
  cashback: {
    fr: 'carte-crypto-cashback',
    de: 'krypto-karte-cashback',
    es: 'tarjeta-cripto-cashback',
    it: 'carta-cripto-cashback',
    en: 'crypto-card-cashback',
  },
  'no-fees': {
    fr: 'carte-crypto-sans-frais',
    de: 'krypto-karte-ohne-jahresgebuehr',
    es: 'tarjeta-cripto-sin-comisiones',
    it: 'carta-cripto-senza-commissioni',
    en: 'crypto-card-no-fees',
  },
  'no-staking': {
    fr: 'carte-crypto-sans-staking',
    de: 'krypto-karte-ohne-staking',
    es: 'tarjeta-cripto-sin-staking',
    it: 'carta-cripto-senza-staking',
    en: 'crypto-card-no-staking',
  },
  france: {
    fr: 'cartes-crypto-france',
    de: 'krypto-karten-deutschland',
    es: 'tarjetas-crypto-espana',
    it: 'carte-crypto-italia',
    en: 'crypto-cards-europe',
  },
  virtual: {
    fr: 'carte-crypto-virtuelle',
    de: 'virtuelle-krypto-karte',
    es: 'tarjeta-crypto-virtual',
    it: 'carta-crypto-virtuale',
    en: 'virtual-crypto-card',
  },
  beginner: {
    fr: 'cartes-crypto-debutant',
    de: 'krypto-karten-einsteiger',
    es: 'tarjetas-crypto-principiante',
    it: 'carte-crypto-principiante',
    en: 'beginner-crypto-cards',
  },
  'no-kyc': {
    fr: 'carte-crypto-sans-kyc',
    de: 'krypto-karte-ohne-kyc',
    es: 'tarjeta-crypto-sin-kyc',
    it: 'carta-cripto-senza-kyc',
    en: 'crypto-card-no-kyc',
  },
  '2026': {
    fr: 'carte-crypto-2026',
    de: 'krypto-karte-2026',
    es: 'tarjeta-cripto-2026',
    it: 'carta-cripto-2026',
    en: 'best-crypto-card-2026',
  },
  travel: {
    fr: 'carte-crypto-voyage',
    de: 'krypto-karte-reise',
    es: 'tarjeta-cripto-viaje',
    it: 'carta-cripto-viaggio',
    en: 'crypto-card-travel',
  },
  rewards: {
    fr: 'carte-crypto-recompenses',
    de: 'krypto-karte-praemien',
    es: 'tarjeta-cripto-recompensas',
    it: 'carta-cripto-premi',
    en: 'crypto-card-rewards',
  },
  physical: {
    fr: 'carte-crypto-physique',
    de: 'physische-krypto-karte',
    es: 'tarjeta-crypto-fisica',
    it: 'carta-crypto-fisica',
    en: 'physical-crypto-card',
  },
};

// ---------------------------------------------------------------------------
// Navigation labels for thematic links (used in the Guides dropdown / footer)
// ---------------------------------------------------------------------------

export interface ThematicNavGroup {
  title: string;
  best: string;
  cashback: string;
  noFees: string;
  noStaking: string;
  cryptos: string;
  france: string;
  virtual: string;
  beginner: string;
  noKyc: string;
  year2026: string;
  travel: string;
  rewards: string;
  physical: string;
}

export const THEMATIC_NAV_LABELS: Record<Language, ThematicNavGroup> = {
  fr: { title: 'Guides', best: 'Meilleures cartes crypto', cashback: 'Cartes avec cashback', noFees: 'Cartes sans frais', noStaking: 'Cartes sans staking', cryptos: 'Guide Cryptomonnaies', france: 'Cartes disponibles en France', virtual: 'Cartes virtuelles', beginner: 'Cartes pour débutants', noKyc: 'Cartes sans KYC', year2026: 'Meilleures cartes 2026', travel: 'Cartes voyage', rewards: 'Cartes avec récompenses', physical: 'Cartes physiques' },
  de: { title: 'Ratgeber', best: 'Beste Krypto-Karten', cashback: 'Karten mit Cashback', noFees: 'Kostenlose Karten', noStaking: 'Karten ohne Staking', cryptos: 'Kryptowährungs-Guide', france: 'Karten in Deutschland', virtual: 'Virtuelle Karten', beginner: 'Karten für Einsteiger', noKyc: 'Karten ohne KYC', year2026: 'Beste Karten 2026', travel: 'Reise-Karten', rewards: 'Karten mit Prämien', physical: 'Physische Karten' },
  es: { title: 'Guías', best: 'Mejores tarjetas crypto', cashback: 'Tarjetas con cashback', noFees: 'Tarjetas sin comisiones', noStaking: 'Tarjetas sin staking', cryptos: 'Guía Criptomonedas', france: 'Tarjetas en España', virtual: 'Tarjetas virtuales', beginner: 'Tarjetas para principiantes', noKyc: 'Tarjetas sin KYC', year2026: 'Mejores tarjetas 2026', travel: 'Tarjetas de viaje', rewards: 'Tarjetas con recompensas', physical: 'Tarjetas físicas' },
  it: { title: 'Guide', best: 'Migliori carte crypto', cashback: 'Carte con cashback', noFees: 'Carte senza costi', noStaking: 'Carte senza staking', cryptos: 'Guida Criptovalute', france: 'Carte in Italia', virtual: 'Carte virtuali', beginner: 'Carte per principianti', noKyc: 'Carte senza KYC', year2026: 'Migliori carte 2026', travel: 'Carte da viaggio', rewards: 'Carte con premi', physical: 'Carte fisiche' },
  en: { title: 'Guides', best: 'Best crypto cards', cashback: 'Cards with cashback', noFees: 'No-fee cards', noStaking: 'No-staking cards', cryptos: 'Cryptocurrency Guide', france: 'Cards available in Europe', virtual: 'Virtual cards', beginner: 'Cards for beginners', noKyc: 'No-KYC cards', year2026: 'Best cards in 2026', travel: 'Travel cards', rewards: 'Rewards cards', physical: 'Physical cards' },
};

// ---------------------------------------------------------------------------
// Virtual vs Physical comparison page slugs
// ---------------------------------------------------------------------------

export const VVP_SLUGS: Record<Language, string> = {
  fr: 'carte-crypto-virtuelle-vs-physique',
  de: 'virtuelle-vs-physische-krypto-karte',
  es: 'tarjeta-crypto-virtual-vs-fisica',
  it: 'carta-crypto-virtuale-vs-fisica',
  en: 'virtual-vs-physical-crypto-card',
};

export const VVP_NAV_LABELS: Record<Language, string> = {
  fr: 'Virtuelle vs Physique',
  de: 'Virtuell vs. Physisch',
  es: 'Virtual vs Física',
  it: 'Virtuale vs Fisica',
  en: 'Virtual vs Physical',
};

// ---------------------------------------------------------------------------
// Review section labels (used in Layout nav)
// ---------------------------------------------------------------------------

export const REVIEW_NAV_LABELS: Record<Language, string> = {
  fr: 'Avis',
  de: 'Bewertungen',
  es: 'Opiniones',
  it: 'Recensioni',
  en: 'Reviews',
};
