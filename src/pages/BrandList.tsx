/**
 * BrandList — /:lang/marques | /de/marken | /es/marcas | /it/marche | /en/brands
 * Shows all known brands with their card count, best cashback and a link to BrandPage.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useAppStore } from '../store/useAppStore';
import SmartCardImage from '../components/SmartCardImage';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { BRAND_CONFIG } from '../data/brandConfig';
import type { CryptoCard } from '../types/card';

const YEAR = new Date().getFullYear();

const L: Record<string, {
  title: string; desc: string; home: string; h1: string; sub: string;
  tiers: string; tier1: string; upTo: string; cashback: string;
  free: string; noBrand: string; discover: string;
}> = {
  fr: {
    title: `Toutes les marques de cartes crypto ${YEAR} | TopCryptoCards`,
    desc: `Comparez toutes les marques de cartes crypto disponibles en Europe en ${YEAR}. Crypto.com, Nexo, Binance, Bybit et plus.`,
    home: 'Accueil', h1: 'Marques de cartes crypto', sub: `Toutes les marques disponibles en ${YEAR}`,
    tiers: 'niveaux', tier1: 'niveau', upTo: "Jusqu'à", cashback: 'cashback',
    free: 'Gratuit', noBrand: 'Autres cartes', discover: 'Découvrir',
  },
  de: {
    title: `Alle Krypto-Karten-Marken ${YEAR} | TopCryptoCards`,
    desc: `Vergleichen Sie alle in Europa verfügbaren Krypto-Karten-Marken ${YEAR}. Crypto.com, Nexo, Binance, Bybit und mehr.`,
    home: 'Startseite', h1: 'Krypto-Karten-Marken', sub: `Alle verfügbaren Marken ${YEAR}`,
    tiers: 'Stufen', tier1: 'Stufe', upTo: 'Bis zu', cashback: 'Cashback',
    free: 'Kostenlos', noBrand: 'Weitere Karten', discover: 'Entdecken',
  },
  es: {
    title: `Todas las marcas de tarjetas crypto ${YEAR} | TopCryptoCards`,
    desc: `Compara todas las marcas de tarjetas crypto disponibles en Europa en ${YEAR}. Crypto.com, Nexo, Binance, Bybit y más.`,
    home: 'Inicio', h1: 'Marcas de tarjetas crypto', sub: `Todas las marcas disponibles en ${YEAR}`,
    tiers: 'niveles', tier1: 'nivel', upTo: 'Hasta', cashback: 'cashback',
    free: 'Gratis', noBrand: 'Otras tarjetas', discover: 'Descubrir',
  },
  it: {
    title: `Tutti i marchi di carte crypto ${YEAR} | TopCryptoCards`,
    desc: `Confronta tutti i marchi di carte crypto disponibili in Europa nel ${YEAR}. Crypto.com, Nexo, Binance, Bybit e altri.`,
    home: 'Home', h1: 'Marchi di carte crypto', sub: `Tutti i marchi disponibili nel ${YEAR}`,
    tiers: 'livelli', tier1: 'livello', upTo: 'Fino a', cashback: 'cashback',
    free: 'Gratuito', noBrand: 'Altre carte', discover: 'Scopri',
  },
  en: {
    title: `All Crypto Card Brands ${YEAR} | TopCryptoCards`,
    desc: `Compare all crypto card brands available in Europe in ${YEAR}. Crypto.com, Nexo, Binance, Bybit and more.`,
    home: 'Home', h1: 'Crypto card brands', sub: `All available brands in ${YEAR}`,
    tiers: 'tiers', tier1: 'tier', upTo: 'Up to', cashback: 'cashback',
    free: 'Free', noBrand: 'Other cards', discover: 'Discover',
  },
};

const MARKET_FLAG: Record<string, string> = {
  fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹', en: '🇬🇧',
};

export default function BrandList() {
  const lang = useLanguage();
  const l = L[lang] ?? L.en;
  const cards = useAppStore((s) => s.cards);
  const [ready, setReady] = useState(false);

  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
  const cardsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';

  useSeoMeta({ title: l.title, description: l.desc });

  useEffect(() => {
    if (cards.length > 0) setReady(true);
  }, [cards]);

  // Hreflang tags
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    document.querySelectorAll('link[data-hreflang-brandlist]').forEach(el => el.remove());
    const langs = ['fr', 'de', 'es', 'it', 'en'];
    langs.forEach(l => {
      const slug = ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/${slug}`);
      el.setAttribute('data-hreflang-brandlist', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate';
    xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/${ROUTE_TRANSLATIONS.fr.brands}`);
    xd.setAttribute('data-hreflang-brandlist', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-brandlist]').forEach(el => el.remove()); };
  }, []);

  // Schema.org ItemList of brands
  useEffect(() => {
    if (!ready) return;
    const BASE = 'https://topcryptocards.eu';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: l.h1,
      numberOfItems: Object.keys(brandGroups).length,
      itemListElement: Object.entries(brandGroups).map(([bid], i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: BRAND_CONFIG[bid]?.displayName ?? bid,
        url: `${BASE}/${lang}/${brandsSlug}/${bid}`,
      })),
    };
    document.getElementById('schema-brand-list')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-brand-list';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-brand-list')?.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, lang]);

  // Group cards by brandId; cards without brandId go into individual entries
  const { brandGroups, singles } = useMemo(() => {
    const groups: Record<string, CryptoCard[]> = {};
    const singles: CryptoCard[] = [];
    for (const card of cards) {
      if (card.brandId) {
        if (!groups[card.brandId]) groups[card.brandId] = [];
        groups[card.brandId].push(card);
      } else {
        singles.push(card);
      }
    }
    // Sort tiers within each brand by tier_rank
    for (const bid of Object.keys(groups)) {
      groups[bid].sort((a, b) => (a.tierRank ?? 99) - (b.tierRank ?? 99));
    }
    return { brandGroups: groups, singles };
  }, [cards]);

  const sortedBrandIds = Object.keys(brandGroups).sort((a, b) => {
    // Known brands (in BRAND_CONFIG) first, alphabetical within each group
    const aKnown = !!BRAND_CONFIG[a];
    const bKnown = !!BRAND_CONFIG[b];
    if (aKnown !== bKnown) return aKnown ? -1 : 1;
    const aName = BRAND_CONFIG[a]?.displayName ?? a;
    const bName = BRAND_CONFIG[b]?.displayName ?? b;
    return aName.localeCompare(bName);
  });

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        {lang === 'fr' ? 'Chargement…' : 'Loading…'}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 flex items-center gap-2">
        <Link to={`/${lang}`} className="hover:text-white">{l.home}</Link>
        <span>›</span>
        <span className="text-white">{l.h1}</span>
      </nav>

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">{l.h1}</h1>
        <p className="text-slate-400">{l.sub}</p>
      </header>

      {/* Brand grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sortedBrandIds.map((brandId) => {
          const brandCards = brandGroups[brandId];
          const meta = BRAND_CONFIG[brandId];
          const seo = meta?.seo?.[lang] ?? meta?.seo?.en;
          const maxCashback = Math.max(...brandCards.map(c =>
            Math.max(c.cashbackBase, c.cashbackNoStaking, c.cashbackPremium)
          ));
          const minFees = Math.min(...brandCards.map(c => c.annualFees));
          const allMarkets = [...new Set(brandCards.flatMap(c => c.markets ?? []))];
          const displayName = meta?.displayName ?? brandId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

          return (
            <Link
              key={brandId}
              to={`/${lang}/${brandsSlug}/${brandId}`}
              className="bg-bg-card border border-border-card rounded-2xl p-5 hover:border-brand-accent/40 transition-colors group flex flex-col gap-3"
            >
              {/* Card images strip */}
              <div className="flex -space-x-6 mb-1 overflow-hidden">
                {brandCards.slice(0, 3).map((card, idx) => (
                  <div
                    key={card.id}
                    className="rounded-xl ring-2 ring-bg-card flex-none shrink-0"
                    style={{ zIndex: idx + 1 }}
                  >
                    <SmartCardImage card={card} size="xs" tilt={false} />
                  </div>
                ))}
              </div>

              {/* Name + tier count */}
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white group-hover:text-brand-accent transition-colors">
                  {displayName}
                </h2>
                <span className="text-xs text-slate-500">
                  {brandCards.length} {brandCards.length === 1 ? l.tier1 : l.tiers}
                </span>
              </div>

              {/* Intro */}
              {seo?.intro && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {seo.intro}
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-3 text-xs mt-auto pt-2 border-t border-border-card">
                {maxCashback > 0 && (
                  <span className="text-brand-accent font-semibold">
                    {l.upTo} {maxCashback}% {l.cashback}
                  </span>
                )}
                <span className="text-slate-400">
                  {minFees === 0 ? l.free : `${minFees}€/an`}
                </span>
                <span className="ml-auto flex gap-0.5">
                  {allMarkets.slice(0, 4).map(m => (
                    <span key={m} title={m.toUpperCase()}>{MARKET_FLAG[m] ?? m}</span>
                  ))}
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Singles section — cards with no brand */}
      {singles.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-4">{l.noBrand}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {singles.map((card) => (
              <Link
                key={card.id}
                to={`/${lang}/${cardsSlug}/${card.id}`}
                className="bg-bg-card border border-border-card rounded-xl p-4 hover:border-brand-accent/40 transition-colors flex items-center gap-3 group"
              >
                <SmartCardImage card={card} size="xs" tilt={false} />
                <div className="min-w-0">
                  <div className="font-medium text-white group-hover:text-brand-accent transition-colors truncate">
                    {card.name}
                  </div>
                  <div className="text-xs text-slate-500">{card.issuer}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
