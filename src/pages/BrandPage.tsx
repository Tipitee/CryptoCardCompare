import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardsByBrand } from '../lib/supabase';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useLanguage } from '../hooks/useLanguage';
import SmartCardImage from '../components/SmartCardImage';
import TrustBadge from '../components/TrustBadge';
import { getAffiliateLink } from '../utils/affiliateLink';
import { getBrandMeta } from '../data/brandConfig';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import type { CryptoCard } from '../types/card';

// ── Labels ────────────────────────────────────────────────────────────────────

const L = {
  fr: {
    tier: 'Niveau',
    cashback: 'Cashback',
    fees: 'Frais annuels',
    staking: 'Staking requis',
    network: 'Réseau',
    market: 'Disponibilité',
    free: 'Gratuit',
    perYear: '/an',
    eur: '€',
    notRequired: 'Non requis',
    yes: 'Oui',
    no: 'Non',
    seeOffer: 'Voir l\'offre',
    compareCards: 'Comparer',
    loading: 'Chargement…',
    noBrand: 'Marque introuvable',
    noBrandDesc: 'Aucune carte trouvée pour cette marque.',
    allBrands: 'Toutes les marques',
    allCards: 'Toutes les cartes',
    withStaking: 'avec staking',
    noStaking: 'sans staking',
    premium: 'premium',
    tiers: 'niveaux',
    tier1: 'niveau',
    markets: 'Marchés',
  },
  de: {
    tier: 'Stufe',
    cashback: 'Cashback',
    fees: 'Jahresgebühr',
    staking: 'Staking erforderlich',
    network: 'Netzwerk',
    market: 'Verfügbarkeit',
    free: 'Kostenlos',
    perYear: '/Jahr',
    eur: '€',
    notRequired: 'Nicht erforderlich',
    yes: 'Ja',
    no: 'Nein',
    seeOffer: 'Angebot ansehen',
    compareCards: 'Vergleichen',
    loading: 'Laden…',
    noBrand: 'Marke nicht gefunden',
    noBrandDesc: 'Keine Karten für diese Marke gefunden.',
    allBrands: 'Alle Marken',
    allCards: 'Alle Karten',
    withStaking: 'mit Staking',
    noStaking: 'ohne Staking',
    premium: 'premium',
    tiers: 'Stufen',
    tier1: 'Stufe',
    markets: 'Märkte',
  },
  es: {
    tier: 'Nivel',
    cashback: 'Cashback',
    fees: 'Cuota anual',
    staking: 'Staking requerido',
    network: 'Red',
    market: 'Disponibilidad',
    free: 'Gratis',
    perYear: '/año',
    eur: '€',
    notRequired: 'No requerido',
    yes: 'Sí',
    no: 'No',
    seeOffer: 'Ver oferta',
    compareCards: 'Comparar',
    loading: 'Cargando…',
    noBrand: 'Marca no encontrada',
    noBrandDesc: 'No se encontraron tarjetas para esta marca.',
    allBrands: 'Todas las marcas',
    allCards: 'Todas las tarjetas',
    withStaking: 'con staking',
    noStaking: 'sin staking',
    premium: 'premium',
    tiers: 'niveles',
    tier1: 'nivel',
    markets: 'Mercados',
  },
  it: {
    tier: 'Livello',
    cashback: 'Cashback',
    fees: 'Costo annuale',
    staking: 'Staking richiesto',
    network: 'Rete',
    market: 'Disponibilità',
    free: 'Gratuito',
    perYear: '/anno',
    eur: '€',
    notRequired: 'Non richiesto',
    yes: 'Sì',
    no: 'No',
    seeOffer: 'Vedi offerta',
    compareCards: 'Confronta',
    loading: 'Caricamento…',
    noBrand: 'Marchio non trovato',
    noBrandDesc: 'Nessuna carta trovata per questo marchio.',
    allBrands: 'Tutti i marchi',
    allCards: 'Tutte le carte',
    withStaking: 'con staking',
    noStaking: 'senza staking',
    premium: 'premium',
    tiers: 'livelli',
    tier1: 'livello',
    markets: 'Mercati',
  },
  en: {
    tier: 'Tier',
    cashback: 'Cashback',
    fees: 'Annual fees',
    staking: 'Staking required',
    network: 'Network',
    market: 'Availability',
    free: 'Free',
    perYear: '/year',
    eur: '€',
    notRequired: 'Not required',
    yes: 'Yes',
    no: 'No',
    seeOffer: 'See offer',
    compareCards: 'Compare',
    loading: 'Loading…',
    noBrand: 'Brand not found',
    noBrandDesc: 'No cards found for this brand.',
    allBrands: 'All brands',
    allCards: 'All cards',
    withStaking: 'with staking',
    noStaking: 'no staking',
    premium: 'premium',
    tiers: 'tiers',
    tier1: 'tier',
    markets: 'Markets',
  },
} as const;

// ── Market flags ──────────────────────────────────────────────────────────────
const MARKET_FLAG: Record<string, string> = {
  fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹', en: '🇬🇧',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function CashbackBadge({ card, lang }: { card: CryptoCard; lang: string }) {
  const l = L[lang as keyof typeof L] ?? L.en;
  const max = Math.max(card.cashbackBase, card.cashbackNoStaking, card.cashbackPremium);
  if (max === 0) return <span className="text-text-secondary text-sm">—</span>;

  const hasStaking = card.stakingRequired > 0;
  return (
    <div className="text-center">
      <span className="text-2xl font-bold text-brand-accent">{max}%</span>
      <span className="text-xs text-text-secondary block">
        {hasStaking ? l.withStaking : l.noStaking}
      </span>
    </div>
  );
}

function FeeBadge({ card, lang }: { card: CryptoCard; lang: string }) {
  const l = L[lang as keyof typeof L] ?? L.en;
  if (card.annualFees === 0) {
    return <span className="text-green-400 font-medium">{l.free}</span>;
  }
  return <span>{card.annualFees}{l.eur}{l.perYear}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BrandPage() {
  const { lang = 'fr', brandId } = useParams<{ lang: string; brandId: string }>();
  const language = useLanguage();
  const l = L[lang as keyof typeof L] ?? L.en;

  const [cards, setCards] = useState<CryptoCard[]>([]);
  const [loading, setLoading] = useState(true);

  const cardsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';

  useEffect(() => {
    if (!brandId) return;
    setLoading(true);
    fetchCardsByBrand(brandId)
      .then(setCards)
      .finally(() => setLoading(false));
  }, [brandId]);

  const brand = getBrandMeta(brandId ?? '');
  const seo = brand.seo[lang] ?? brand.seo.en;

  useSeoMeta({
    title: seo.title || `${brand.displayName} — TopCryptoCards`,
    description: seo.description || '',
  });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        {l.loading}
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">{l.noBrand}</h1>
        <p className="text-text-secondary mb-8">{l.noBrandDesc}</p>
        <Link to={`/${lang}`} className="text-brand-accent hover:underline">← {l.allCards}</Link>
      </div>
    );
  }

  const bestCashback = Math.max(...cards.map(c =>
    Math.max(c.cashbackBase, c.cashbackNoStaking, c.cashbackPremium)
  ));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-text-secondary flex items-center gap-2 flex-wrap">
        <Link to={`/${lang}`} className="hover:text-text-primary">Accueil</Link>
        <span>›</span>
        <Link to={`/${lang}/${brandsSlug}`} className="hover:text-text-primary">{l.allBrands}</Link>
        <span>›</span>
        <span className="text-text-primary">{brand.displayName}</span>
      </nav>

      {/* Brand hero */}
      <header className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-text-primary">{brand.displayName}</h1>
          {bestCashback > 0 && (
            <span className="bg-brand-accent/10 text-brand-accent text-sm font-semibold px-3 py-1 rounded-full">
              Jusqu'à {bestCashback}% cashback
            </span>
          )}
          <span className="text-text-secondary text-sm">
            {cards.length} {cards.length === 1 ? l.tier1 : l.tiers}
          </span>
        </div>

        {seo.intro && (
          <p className="text-text-secondary leading-relaxed max-w-3xl">{seo.intro}</p>
        )}

        {brand.website !== '#' && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-brand-accent hover:underline text-sm"
          >
            {brand.website.replace(/^https?:\/\//, '')} ↗
          </a>
        )}
      </header>

      {/* Tier cards grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <TierCard key={card.id} card={card} lang={lang} l={l} cardsSlug={cardsSlug} />
        ))}
      </section>

      {/* Comparison table (only if multiple tiers) */}
      {cards.length > 1 && (
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Comparaison des niveaux {brand.displayName}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-card bg-bg-card">
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">{l.tier}</th>
                  {cards.map((c) => (
                    <th key={c.id} className="text-center px-4 py-3 text-text-primary font-semibold">
                      {c.tierLabel ?? c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Cashback */}
                <CompareRow label={l.cashback} cards={cards}>
                  {(c) => (
                    <div className="font-bold text-brand-accent">
                      {Math.max(c.cashbackBase, c.cashbackNoStaking, c.cashbackPremium) > 0
                        ? `${Math.max(c.cashbackBase, c.cashbackNoStaking, c.cashbackPremium)}%`
                        : '—'}
                    </div>
                  )}
                </CompareRow>

                {/* Annual fees */}
                <CompareRow label={l.fees} cards={cards} alt>
                  {(c) => <FeeBadge card={c} lang={lang} />}
                </CompareRow>

                {/* Staking */}
                <CompareRow label={l.staking} cards={cards}>
                  {(c) => (
                    <span>
                      {c.stakingRequired === 0
                        ? <span className="text-green-400">{l.notRequired}</span>
                        : `${c.stakingRequired.toLocaleString()} tokens`}
                    </span>
                  )}
                </CompareRow>

                {/* Network */}
                <CompareRow label={l.network} cards={cards} alt>
                  {(c) => <span className="text-text-secondary">{c.cardNetwork}</span>}
                </CompareRow>

                {/* Markets */}
                <CompareRow label={l.markets} cards={cards}>
                  {(c) => (
                    <div className="flex gap-1 justify-center flex-wrap">
                      {(c.markets ?? []).map((m) => (
                        <span key={m} title={m.toUpperCase()}>{MARKET_FLAG[m] ?? m}</span>
                      ))}
                    </div>
                  )}
                </CompareRow>

                {/* CTA row */}
                <tr>
                  <td className="px-4 py-3 text-text-secondary">{l.seeOffer}</td>
                  {cards.map((c) => (
                    <td key={c.id} className="px-4 py-3 text-center">
                      <a
                        href={getAffiliateLink(c)}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-block bg-brand-accent text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        {l.seeOffer}
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Outro */}
      {seo.outro && (
        <section className="bg-bg-card rounded-xl p-6 border border-border-card">
          <p className="text-text-secondary leading-relaxed">{seo.outro}</p>
        </section>
      )}

      {/* Back to all cards */}
      <nav className="pt-2">
        <Link
          to={`/${lang}/${cardsSlug}`}
          className="text-brand-accent hover:underline text-sm"
        >
          ← {l.allCards}
        </Link>
      </nav>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TierCard({
  card, lang, l, cardsSlug,
}: {
  card: CryptoCard;
  lang: string;
  l: (typeof L)[keyof typeof L];
  cardsSlug: string;
}) {
  const maxCashback = Math.max(card.cashbackBase, card.cashbackNoStaking, card.cashbackPremium);

  return (
    <div className="bg-bg-card border border-border-card rounded-2xl p-5 flex flex-col gap-4 hover:border-brand-accent/40 transition-colors">
      {/* Card image */}
      <div className="flex justify-center">
        <SmartCardImage card={card} size="sm" />
      </div>

      {/* Tier label + trust */}
      <div className="flex items-start justify-between gap-2">
        <div>
          {card.tierLabel && (
            <span className="text-xs text-brand-accent font-semibold uppercase tracking-wide">
              {card.tierLabel}
            </span>
          )}
          <h3 className="text-text-primary font-bold text-base leading-tight">{card.name}</h3>
        </div>
        {card.trustScore != null && (
          <TrustBadge score={card.trustScore} size="sm" />
        )}
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Stat label={l.cashback}>
          {maxCashback > 0
            ? <span className="text-brand-accent font-bold">{maxCashback}%</span>
            : <span className="text-text-secondary">—</span>}
        </Stat>
        <Stat label={l.fees}>
          <FeeBadge card={card} lang={lang} />
        </Stat>
        <Stat label={l.staking}>
          {card.stakingRequired === 0
            ? <span className="text-green-400 text-xs">{l.notRequired}</span>
            : <span className="text-xs">{card.stakingRequired.toLocaleString()}</span>}
        </Stat>
        <Stat label={l.network}>
          <span className="text-text-secondary">{card.cardNetwork}</span>
        </Stat>
      </div>

      {/* Markets */}
      <div className="flex gap-1 flex-wrap">
        {(card.markets ?? []).map((m) => (
          <span key={m} className="text-lg" title={m.toUpperCase()}>
            {MARKET_FLAG[m] ?? m}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-2 mt-auto">
        <a
          href={getAffiliateLink(card)}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 text-center bg-brand-accent text-white text-sm font-semibold py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          {l.seeOffer}
        </a>
        <Link
          to={`/${lang}/${cardsSlug}/${card.id}`}
          className="flex-1 text-center border border-border-card text-text-primary text-sm py-2 rounded-xl hover:border-brand-accent/40 transition-colors"
        >
          Détails
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-text-secondary text-xs block mb-0.5">{label}</span>
      {children}
    </div>
  );
}

function CompareRow({
  label, cards, children, alt = false,
}: {
  label: string;
  cards: CryptoCard[];
  children: (c: CryptoCard) => React.ReactNode;
  alt?: boolean;
}) {
  return (
    <tr className={alt ? 'bg-bg-card/50' : ''}>
      <td className="px-4 py-3 text-text-secondary font-medium">{label}</td>
      {cards.map((c) => (
        <td key={c.id} className="px-4 py-3 text-center text-text-primary">
          {children(c)}
        </td>
      ))}
    </tr>
  );
}
