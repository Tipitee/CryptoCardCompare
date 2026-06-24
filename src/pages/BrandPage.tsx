import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Building2, Calendar, Shield, ChevronRight } from 'lucide-react';
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
    home: 'Accueil',
    allCards: 'Toutes les cartes',
    allBrands: 'Toutes les marques',
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
    details: 'Détails',
    compareCards: 'Comparer',
    loading: 'Chargement…',
    noBrand: 'Marque introuvable',
    noBrandDesc: 'Aucune carte trouvée pour cette marque.',
    withStaking: 'avec staking',
    noStaking: 'sans staking',
    premium: 'premium',
    tiers: 'niveaux',
    tier1: 'niveau',
    markets: 'Marchés',
    compareTitle: 'Comparaison des niveaux',
    aboutTitle: 'À propos de',
    foundedLabel: 'Fondée en',
    hqLabel: 'Siège',
    regulationLabel: 'Régulation',
    verdictTitle: 'Notre verdict',
    faqTitle: 'Questions fréquentes',
    relatedTitle: 'Voir aussi',
    upTo: 'Jusqu\'à',
    websiteLabel: 'Site officiel',
  },
  de: {
    home: 'Startseite',
    allCards: 'Alle Karten',
    allBrands: 'Alle Marken',
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
    details: 'Details',
    compareCards: 'Vergleichen',
    loading: 'Laden…',
    noBrand: 'Marke nicht gefunden',
    noBrandDesc: 'Keine Karten für diese Marke gefunden.',
    withStaking: 'mit Staking',
    noStaking: 'ohne Staking',
    premium: 'premium',
    tiers: 'Stufen',
    tier1: 'Stufe',
    markets: 'Märkte',
    compareTitle: 'Stufenvergleich',
    aboutTitle: 'Über',
    foundedLabel: 'Gegründet',
    hqLabel: 'Hauptsitz',
    regulationLabel: 'Regulierung',
    verdictTitle: 'Unser Urteil',
    faqTitle: 'Häufige Fragen',
    relatedTitle: 'Siehe auch',
    upTo: 'Bis zu',
    websiteLabel: 'Offizielle Website',
  },
  es: {
    home: 'Inicio',
    allCards: 'Todas las tarjetas',
    allBrands: 'Todas las marcas',
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
    details: 'Detalles',
    compareCards: 'Comparar',
    loading: 'Cargando…',
    noBrand: 'Marca no encontrada',
    noBrandDesc: 'No se encontraron tarjetas para esta marca.',
    withStaking: 'con staking',
    noStaking: 'sin staking',
    premium: 'premium',
    tiers: 'niveles',
    tier1: 'nivel',
    markets: 'Mercados',
    compareTitle: 'Comparación de niveles',
    aboutTitle: 'Acerca de',
    foundedLabel: 'Fundada en',
    hqLabel: 'Sede',
    regulationLabel: 'Regulación',
    verdictTitle: 'Nuestro veredicto',
    faqTitle: 'Preguntas frecuentes',
    relatedTitle: 'Ver también',
    upTo: 'Hasta',
    websiteLabel: 'Sitio oficial',
  },
  it: {
    home: 'Home',
    allCards: 'Tutte le carte',
    allBrands: 'Tutti i marchi',
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
    details: 'Dettagli',
    compareCards: 'Confronta',
    loading: 'Caricamento…',
    noBrand: 'Marchio non trovato',
    noBrandDesc: 'Nessuna carta trovata per questo marchio.',
    withStaking: 'con staking',
    noStaking: 'senza staking',
    premium: 'premium',
    tiers: 'livelli',
    tier1: 'livello',
    markets: 'Mercati',
    compareTitle: 'Confronto livelli',
    aboutTitle: 'Informazioni su',
    foundedLabel: 'Fondata nel',
    hqLabel: 'Sede',
    regulationLabel: 'Regolamentazione',
    verdictTitle: 'Il nostro verdetto',
    faqTitle: 'Domande frequenti',
    relatedTitle: 'Vedi anche',
    upTo: 'Fino a',
    websiteLabel: 'Sito ufficiale',
  },
  en: {
    home: 'Home',
    allCards: 'All cards',
    allBrands: 'All brands',
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
    details: 'Details',
    compareCards: 'Compare',
    loading: 'Loading…',
    noBrand: 'Brand not found',
    noBrandDesc: 'No cards found for this brand.',
    withStaking: 'with staking',
    noStaking: 'no staking',
    premium: 'premium',
    tiers: 'tiers',
    tier1: 'tier',
    markets: 'Markets',
    compareTitle: 'Tier comparison',
    aboutTitle: 'About',
    foundedLabel: 'Founded',
    hqLabel: 'HQ',
    regulationLabel: 'Regulation',
    verdictTitle: 'Our verdict',
    faqTitle: 'FAQ',
    relatedTitle: 'See also',
    upTo: 'Up to',
    websiteLabel: 'Official website',
  },
} as const;

// ── Market flags ──────────────────────────────────────────────────────────────
const MARKET_FLAG: Record<string, string> = {
  fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹', en: '🇬🇧',
};

// ── Review slugs by brand (FR review slug; ReviewPage handles multi-lang) ─────
const BRAND_REVIEW_SLUG: Record<string, string> = {
  'crypto-com': 'crypto-com-visa-card',
  'nexo': 'nexo-card',
  'binance': 'binance-card',
  'bybit': 'bybit-card',
  'wirex': 'wirex-card',
  'bitpanda': 'bitpanda-card',
  'okx': 'okx-card',
  'coinbase': 'coinbase-card',
};

const REVIEW_LABEL: Record<string, string> = {
  fr: 'Avis complet', de: 'Vollständige Bewertung', es: 'Reseña completa',
  it: 'Recensione completa', en: 'Full review',
};

const BASE_URL = 'https://topcryptocards.eu';

// ── Helpers ───────────────────────────────────────────────────────────────────

function FeeBadge({ card, lang }: { card: CryptoCard; lang: string }) {
  const l = L[lang as keyof typeof L] ?? L.en;
  if (card.annualFees === 0) return <span className="text-green-400 font-medium">{l.free}</span>;
  return <span>{card.annualFees}{l.eur}{l.perYear}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BrandPage() {
  const { lang = 'fr', brandId } = useParams<{ lang: string; brandId: string }>();
  useLanguage(); // ensure lang is tracked
  const l = L[lang as keyof typeof L] ?? L.en;

  const [cards, setCards] = useState<CryptoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const cardsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
  const reviewsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.reviews ?? 'reviews';

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

  // ── Hreflang ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!brandId) return;
    document.querySelectorAll('link[data-hreflang-brand]').forEach(el => el.remove());
    const langs = ['fr', 'de', 'es', 'it', 'en'];
    langs.forEach(l => {
      const slug = ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE_URL}/${l}/${slug}/${brandId}`);
      el.setAttribute('data-hreflang-brand', 'true');
      document.head.appendChild(el);
    });
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', `${BASE_URL}/fr/${ROUTE_TRANSLATIONS.fr.brands}/${brandId}`);
    xDefault.setAttribute('data-hreflang-brand', 'true');
    document.head.appendChild(xDefault);
    return () => { document.querySelectorAll('link[data-hreflang-brand]').forEach(el => el.remove()); };
  }, [brandId]);

  // ── Schema.org BreadcrumbList + FAQPage ───────────────────────────────────
  useEffect(() => {
    if (!brandId || cards.length === 0) return;

    // ItemList for tiers
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: brand.displayName,
      numberOfItems: cards.length,
      itemListElement: cards.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        url: `${BASE_URL}/${lang}/${cardsSlug}/${c.id}`,
      })),
    };

    // FAQPage if FAQ exists
    const faqs = seo.faq;
    let faqSchema: object | null = null;
    if (faqs && faqs.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      };
    }

    ['schema-brand-itemlist', 'schema-brand-faq'].forEach(id => document.getElementById(id)?.remove());

    const listEl = document.createElement('script');
    listEl.id = 'schema-brand-itemlist';
    listEl.type = 'application/ld+json';
    listEl.textContent = JSON.stringify(itemListSchema);
    document.head.appendChild(listEl);

    if (faqSchema) {
      const faqEl = document.createElement('script');
      faqEl.id = 'schema-brand-faq';
      faqEl.type = 'application/ld+json';
      faqEl.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqEl);
    }

    return () => {
      ['schema-brand-itemlist', 'schema-brand-faq'].forEach(id => document.getElementById(id)?.remove());
    };
  }, [brandId, cards, seo, lang, cardsSlug, brand.displayName]);

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

  // Affiliate-aware website link
  const websiteHref = brand.affiliateLink ?? brand.website;
  const hasReview = !!BRAND_REVIEW_SLUG[brandId ?? ''];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-text-secondary flex items-center gap-2 flex-wrap">
        <Link to={`/${lang}`} className="hover:text-text-primary">{l.home}</Link>
        <span>›</span>
        <Link to={`/${lang}`} className="hover:text-text-primary">{l.allBrands}</Link>
        <span>›</span>
        <span className="text-text-primary">{brand.displayName}</span>
      </nav>

      {/* ── Brand hero ──────────────────────────────────────────────────────── */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-text-primary">{brand.displayName}</h1>
          {bestCashback > 0 && (
            <span className="bg-brand-accent/10 text-brand-accent text-sm font-semibold px-3 py-1 rounded-full">
              {l.upTo} {bestCashback}% cashback
            </span>
          )}
          <span className="text-text-secondary text-sm">
            {cards.length} {cards.length === 1 ? l.tier1 : l.tiers}
          </span>
        </div>

        {seo.intro && (
          <p className="text-text-secondary leading-relaxed max-w-3xl text-base">{seo.intro}</p>
        )}

        <div className="flex flex-wrap gap-3 items-center">
          {websiteHref && websiteHref !== '#' && (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 text-brand-accent hover:underline text-sm font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {l.websiteLabel}
            </a>
          )}
          {hasReview && (
            <Link
              to={`/${lang}/${reviewsSlug}/${BRAND_REVIEW_SLUG[brandId ?? '']}`}
              className="inline-flex items-center gap-1 text-text-secondary hover:text-brand-accent text-sm transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {REVIEW_LABEL[lang] || REVIEW_LABEL.en}
            </Link>
          )}
        </div>
      </header>

      {/* ── Tier cards grid ─────────────────────────────────────────────────── */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <TierCard key={card.id} card={card} lang={lang} l={l} cardsSlug={cardsSlug} />
          ))}
        </div>
      </section>

      {/* ── About the brand ─────────────────────────────────────────────────── */}
      {(brand.founded > 0 || brand.hq || brand.regulation) && (
        <section className="bg-bg-card rounded-xl p-6 border border-border-card">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-accent" />
            {l.aboutTitle} {brand.displayName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {brand.founded > 0 && (
              <AboutChip
                icon={<Calendar className="w-4 h-4 text-brand-accent" />}
                label={l.foundedLabel}
                value={String(brand.founded)}
              />
            )}
            {brand.hq && (
              <AboutChip
                icon={<Building2 className="w-4 h-4 text-brand-accent" />}
                label={l.hqLabel}
                value={brand.hq}
              />
            )}
            {brand.regulation && (
              <AboutChip
                icon={<Shield className="w-4 h-4 text-brand-accent" />}
                label={l.regulationLabel}
                value={brand.regulation}
              />
            )}
          </div>
        </section>
      )}

      {/* ── Comparison table (only if multiple tiers) ───────────────────────── */}
      {cards.length > 1 && (
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-4">
            {l.compareTitle} {brand.displayName}
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
                <CompareRow label={l.cashback} cards={cards}>
                  {(c) => (
                    <div className="font-bold text-brand-accent">
                      {Math.max(c.cashbackBase, c.cashbackNoStaking, c.cashbackPremium) > 0
                        ? `${Math.max(c.cashbackBase, c.cashbackNoStaking, c.cashbackPremium)}%`
                        : '—'}
                    </div>
                  )}
                </CompareRow>
                <CompareRow label={l.fees} cards={cards} alt>
                  {(c) => <FeeBadge card={c} lang={lang} />}
                </CompareRow>
                <CompareRow label={l.staking} cards={cards}>
                  {(c) => (
                    c.stakingRequired === 0
                      ? <span className="text-green-400">{l.notRequired}</span>
                      : <span>{c.stakingRequired.toLocaleString()} tokens</span>
                  )}
                </CompareRow>
                <CompareRow label={l.network} cards={cards} alt>
                  {(c) => <span className="text-text-secondary">{c.cardNetwork}</span>}
                </CompareRow>
                <CompareRow label={l.markets} cards={cards}>
                  {(c) => (
                    <div className="flex gap-1 justify-center flex-wrap">
                      {(c.markets ?? []).map((m) => (
                        <span key={m} title={m.toUpperCase()}>{MARKET_FLAG[m] ?? m}</span>
                      ))}
                    </div>
                  )}
                </CompareRow>
                <tr>
                  <td className="px-4 py-3 text-text-secondary font-medium">{l.seeOffer}</td>
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

      {/* ── Verdict ─────────────────────────────────────────────────────────── */}
      {seo.outro && (
        <section className="bg-bg-card rounded-xl p-6 border border-border-card">
          <h2 className="text-lg font-bold text-text-primary mb-3">
            {l.verdictTitle} — {brand.displayName}
          </h2>
          <p className="text-text-secondary leading-relaxed">{seo.outro}</p>
        </section>
      )}

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      {seo.faq && seo.faq.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-4">{l.faqTitle}</h2>
          <div className="space-y-2">
            {seo.faq.map((item, i) => (
              <div key={i} className="rounded-xl border border-border-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-bg-card hover:bg-bg-elevated transition-colors"
                >
                  <span className="font-medium text-text-primary">{item.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-text-secondary shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4 text-text-secondary leading-relaxed bg-bg-elevated border-t border-border-card">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── See also ────────────────────────────────────────────────────────── */}
      <nav className="flex flex-wrap gap-3 pt-2 border-t border-border-card">
        <Link to={`/${lang}`} className="text-brand-accent hover:underline text-sm">
          ← {l.allCards}
        </Link>
        {hasReview && (
          <Link
            to={`/${lang}/${reviewsSlug}/${BRAND_REVIEW_SLUG[brandId ?? '']}`}
            className="text-brand-accent hover:underline text-sm"
          >
            {REVIEW_LABEL[lang] || REVIEW_LABEL.en} →
          </Link>
        )}
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
            <span className="text-xs text-brand-accent font-semibold uppercase tracking-wide block mb-0.5">
              {card.tierLabel}
            </span>
          )}
          <h3 className="text-text-primary font-bold text-base leading-tight">{card.name}</h3>
        </div>
        {card.trustScore != null && (
          <TrustBadge card={card} />
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
          {l.details}
        </Link>
      </div>
    </div>
  );
}

function AboutChip({
  icon, label, value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-xs text-text-secondary mb-0.5">{label}</div>
        <div className="text-sm font-medium text-text-primary">{value}</div>
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
