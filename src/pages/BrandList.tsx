/**
 * BrandList — /:lang/marques | /de/marken | /es/marcas | /it/marche | /en/brands
 * Shows all known brands with their card count, best cashback and a link to BrandPage.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useHreflang } from '../hooks/useHreflang';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useAppStore } from '../store/useAppStore';
import SmartCardImage from '../components/SmartCardImage';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { BRAND_CONFIG } from '../data/brandConfig';
import { THEMATIC_ROUTES } from '../config/routes';
import type { CryptoCard } from '../types/card';

const YEAR = new Date().getFullYear();

const BRANDLIST_EDITORIAL: Record<string, { h2: string; body: string; related: string; links: { key: string; emoji: string; label: string }[] }> = {
  fr: {
    h2: 'Toutes les marques de cartes crypto disponibles en Europe',
    body: `Cette page recense toutes les marques de cartes crypto accessibles depuis la France, l'Allemagne, l'Espagne, l'Italie et d'autres pays européens en ${YEAR}. Chaque marque propose une gamme de cartes avec des niveaux de cashback, des frais annuels et des exigences de staking différents. Crypto.com, Nexo, Bybit, Binance, OKX, Gnosis Pay, MetaMask, Wirex, Trade Republic — chaque émetteur a ses forces selon votre profil : voyageur, investisseur actif, débutant, ou utilisateur quotidien. Comparez directement via notre outil ou consultez nos avis détaillés par carte.`,
    related: 'Guides thématiques',
    links: [
      { key: 'best', emoji: '🏆', label: 'Meilleures cartes' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Sans frais' },
      { key: 'no-staking', emoji: '🔓', label: 'Sans staking' },
      { key: 'travel', emoji: '✈️', label: 'Voyages' },
    ],
  },
  de: {
    h2: 'Alle Krypto-Karten-Marken in Europa',
    body: `Diese Seite listet alle Krypto-Karten-Marken auf, die von Frankreich, Deutschland, Spanien, Italien und anderen europäischen Ländern aus zugänglich sind. Jede Marke bietet eine Palette von Karten mit unterschiedlichen Cashback-Stufen, Jahresgebühren und Staking-Anforderungen. Crypto.com, Nexo, Bybit, Binance, OKX, Gnosis Pay, MetaMask, Wirex, Trade Republic — jeder Anbieter hat seine Stärken je nach Ihrem Profil: Reisender, aktiver Investor, Einsteiger oder täglicher Nutzer. Vergleichen Sie direkt über unser Tool oder lesen Sie unsere detaillierten Kartenbewertungen.`,
    related: 'Thematische Ratgeber',
    links: [
      { key: 'best', emoji: '🏆', label: 'Beste Karten' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Keine Gebühren' },
      { key: 'no-staking', emoji: '🔓', label: 'Kein Staking' },
      { key: 'travel', emoji: '✈️', label: 'Reisen' },
    ],
  },
  es: {
    h2: 'Todas las marcas de tarjetas crypto disponibles en Europa',
    body: `Esta página enumera todas las marcas de tarjetas crypto accesibles desde Francia, Alemania, España, Italia y otros países europeos en ${YEAR}. Cada marca ofrece una gama de tarjetas con diferentes niveles de cashback, comisiones anuales y requisitos de staking. Crypto.com, Nexo, Bybit, Binance, OKX, Gnosis Pay, MetaMask, Wirex, Trade Republic — cada emisor tiene sus puntos fuertes según tu perfil: viajero, inversor activo, principiante o usuario cotidiano. Compara directamente con nuestra herramienta o consulta nuestros análisis detallados por tarjeta.`,
    related: 'Guías temáticas',
    links: [
      { key: 'best', emoji: '🏆', label: 'Mejores tarjetas' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Sin comisiones' },
      { key: 'no-staking', emoji: '🔓', label: 'Sin staking' },
      { key: 'travel', emoji: '✈️', label: 'Viajes' },
    ],
  },
  it: {
    h2: 'Tutti i brand di carte crypto disponibili in Europa',
    body: `Questa pagina elenca tutti i brand di carte crypto accessibili da Francia, Germania, Spagna, Italia e altri paesi europei nel ${YEAR}. Ogni brand offre una gamma di carte con diversi livelli di cashback, commissioni annuali e requisiti di staking. Crypto.com, Nexo, Bybit, Binance, OKX, Gnosis Pay, MetaMask, Wirex, Trade Republic — ogni emittente ha i suoi punti di forza a seconda del tuo profilo: viaggiatore, investitore attivo, principiante o utente quotidiano. Confronta direttamente con il nostro strumento o consulta le nostre recensioni dettagliate per carta.`,
    related: 'Guide tematiche',
    links: [
      { key: 'best', emoji: '🏆', label: 'Migliori carte' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Nessuna commissione' },
      { key: 'no-staking', emoji: '🔓', label: 'Nessuno staking' },
      { key: 'travel', emoji: '✈️', label: 'Viaggi' },
    ],
  },
  en: {
    h2: 'All crypto card brands available in Europe',
    body: `This page lists all crypto card brands accessible from France, Germany, Spain, Italy and other European countries in ${YEAR}. Each brand offers a range of cards with different cashback levels, annual fees and staking requirements. Crypto.com, Nexo, Bybit, Binance, OKX, Gnosis Pay, MetaMask, Wirex, Trade Republic — each issuer has its strengths depending on your profile: traveller, active investor, beginner, or daily user. Compare directly with our tool or check our detailed per-card reviews.`,
    related: 'Thematic guides',
    links: [
      { key: 'best', emoji: '🏆', label: 'Best cards' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'No fees' },
      { key: 'no-staking', emoji: '🔓', label: 'No staking' },
      { key: 'travel', emoji: '✈️', label: 'Travel' },
    ],
  },
};

const LOADING_LABEL: Record<string, string> = {
  fr: 'Chargement…', de: 'Wird geladen…', es: 'Cargando…', it: 'Caricamento…', en: 'Loading…',
};

const L: Record<string, {
  title: string; desc: string; home: string; h1: string; sub: string;
  tiers: string; tier1: string; upTo: string; cashback: string;
  free: string; noBrand: string; discover: string;
}> = {
  fr: {
    title: `Toutes les marques de cartes crypto ${YEAR} | TopCryptoCards`,
    desc: `+20 marques de cartes crypto en Europe ${YEAR} — Crypto.com, Nexo, Binance, Bybit, Wirex et plus. Cashback, frais, staking comparés. Gratuit ✓`,
    home: 'Accueil', h1: `Marques de cartes crypto ${YEAR}`, sub: `Toutes les marques disponibles en ${YEAR}`,
    tiers: 'cartes', tier1: 'carte', upTo: "Jusqu'à", cashback: 'cashback',
    free: 'Gratuit', noBrand: 'Autres cartes', discover: 'Découvrir',
  },
  de: {
    title: `Alle Krypto-Karten-Marken ${YEAR} | TopCryptoCards`,
    desc: `+20 Krypto-Karten-Marken in Europa ${YEAR} — Crypto.com, Nexo, Binance, Bybit, Wirex und mehr. Cashback, Gebühren, Staking verglichen. Kostenlos ✓`,
    home: 'Startseite', h1: `Krypto-Karten-Marken ${YEAR}`, sub: `Alle verfügbaren Marken ${YEAR}`,
    tiers: 'Karten', tier1: 'Karte', upTo: 'Bis zu', cashback: 'Cashback',
    free: 'Kostenlos', noBrand: 'Weitere Karten', discover: 'Entdecken',
  },
  es: {
    title: `Todas las marcas de tarjetas crypto ${YEAR} | TopCryptoCards`,
    desc: `+20 marcas de tarjetas crypto en Europa ${YEAR} — Crypto.com, Nexo, Binance, Bybit, Wirex y más. Cashback, comisiones, staking comparados. Gratis ✓`,
    home: 'Inicio', h1: `Marcas de tarjetas crypto ${YEAR}`, sub: `Todas las marcas disponibles en ${YEAR}`,
    tiers: 'tarjetas', tier1: 'tarjeta', upTo: 'Hasta', cashback: 'cashback',
    free: 'Gratis', noBrand: 'Otras tarjetas', discover: 'Descubrir',
  },
  it: {
    title: `Tutti i marchi di carte crypto ${YEAR} | TopCryptoCards`,
    desc: `+20 marchi di carte crypto in Europa ${YEAR} — Crypto.com, Nexo, Binance, Bybit, Wirex e altri. Cashback, commissioni, staking confrontati. Gratuito ✓`,
    home: 'Home', h1: `Marchi di carte crypto ${YEAR}`, sub: `Tutti i marchi disponibili nel ${YEAR}`,
    tiers: 'carte', tier1: 'carta', upTo: 'Fino a', cashback: 'cashback',
    free: 'Gratuito', noBrand: 'Altre carte', discover: 'Scopri',
  },
  en: {
    title: `All Crypto Card Brands ${YEAR} — Crypto.com, Nexo, Bybit`,
    desc: `20+ crypto card brands in Europe ${YEAR} on one page: Crypto.com, Nexo, Bybit, Gnosis Pay, Binance and more. Cashback, fees & staking compared. Free ✓`,
    home: 'Home', h1: `Crypto card brands ${YEAR}`, sub: `All available brands in ${YEAR}`,
    tiers: 'cards', tier1: 'card', upTo: 'Up to', cashback: 'cashback',
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

  useSeoMeta({ title: l.title, description: l.desc, lang });

  useEffect(() => {
    if (cards.length > 0) setReady(true);
  }, [cards]);

  // Hreflang tags
  useHreflang(l => `https://topcryptocards.eu/${l}/${ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands'}`, []);

  // Schema.org ItemList of brands
  useEffect(() => {
    if (!ready) return;
    const BASE = 'https://topcryptocards.eu';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: l.h1,
      inLanguage: lang,
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

  // BreadcrumbList schema
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const homeL: Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };
    const slug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeL[lang] ?? 'Home', item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: l.h1, item: `${BASE}/${lang}/${slug}` },
      ],
    };
    document.getElementById('schema-brandlist-breadcrumb')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-brandlist-breadcrumb'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-brandlist-breadcrumb')?.remove(); };
  }, [lang, l.h1]);

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
        {LOADING_LABEL[lang] || LOADING_LABEL.en}
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

      {/* Bloc éditorial — thin content fix + thematic links */}
      {(() => {
        const ed = BRANDLIST_EDITORIAL[lang] ?? BRANDLIST_EDITORIAL.en;
        return (
          <div className="border-t border-bg-border pt-10">
            <h2 className="text-xl font-bold text-white mb-4">{ed.h2}</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mb-8">{ed.body}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{ed.related}</p>
            <div className="flex flex-wrap gap-2">
              {ed.links.map(({ key, emoji, label }) => {
                const slug = THEMATIC_ROUTES[key]?.[lang as keyof typeof THEMATIC_ROUTES['best']] ?? THEMATIC_ROUTES[key]?.en;
                if (!slug) return null;
                return (
                  <Link key={key} to={`/${lang}/${slug}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
                    <span aria-hidden="true">{emoji}</span>{label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
