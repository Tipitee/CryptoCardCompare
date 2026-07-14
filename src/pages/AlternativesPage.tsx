/**
 * AlternativesPage — "[Brand] alternatives" SEO page
 * Shows top alternatives to a given crypto card brand.
 * Route: /:lang/{brand-specific-slug}
 * Content: alternativesContent.ts
 */
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import Breadcrumb from '../components/Breadcrumb';
import SmartCardImage from '../components/SmartCardImage';
import { useLanguage } from '../hooks/useLanguage';
import { contentLang, ROUTE_TRANSLATIONS } from '../i18n/types';
import { THEMATIC_ROUTES } from '../config/routes';
import { ALT_BRAND_MAP, type AltBrandId } from '../data/alternativesContent';

const BASE = 'https://topcryptocards.eu';

/* ── i18n labels ────────────────────────────────────────────────────────────── */
const LOADING_LABEL: Record<string, string> = {
  fr: 'Chargement…', be: 'Chargement…', de: 'Laden…', at: 'Laden…',
  es: 'Cargando…', it: 'Caricamento…', en: 'Loading…',
};
const BRANDS_LABEL: Record<string, string> = {
  fr: 'Marques', be: 'Marques', de: 'Marken', at: 'Marken',
  es: 'Marcas', it: 'Marchi', en: 'Brands',
};
const ALTERNATIVES_LABEL: Record<string, string> = {
  fr: 'Alternatives', be: 'Alternatives', de: 'Alternativen', at: 'Alternativen',
  es: 'Alternativas', it: 'Alternative', en: 'Alternatives',
};
const WHY_LABEL: Record<string, string> = {
  fr: 'Pourquoi chercher une alternative ?',
  be: 'Pourquoi chercher une alternative ?',
  de: 'Warum eine Alternative suchen?',
  at: 'Warum eine Alternative suchen?',
  es: '¿Por qué buscar una alternativa?',
  it: 'Perché cercare un\'alternativa?',
  en: 'Why look for an alternative?',
};
const TOP_ALTS_LABEL: Record<string, string> = {
  fr: 'Meilleures alternatives',
  be: 'Meilleures alternatives',
  de: 'Beste Alternativen',
  at: 'Beste Alternativen',
  es: 'Mejores alternativas',
  it: 'Migliori alternative',
  en: 'Top alternatives',
};
const FREE_LABEL: Record<string, string> = {
  fr: 'Gratuit', be: 'Gratuit', de: 'Kostenlos', at: 'Kostenlos',
  es: 'Gratuita', it: 'Gratuita', en: 'Free',
};
const PER_YEAR_LABEL: Record<string, string> = {
  fr: '/an', be: '/an', de: '/Jahr', at: '/Jahr',
  es: '/año', it: '/anno', en: '/year',
};
const STAKING_LABEL: Record<string, string> = {
  fr: 'Staking requis', be: 'Staking requis', de: 'Staking erforderlich', at: 'Staking erforderlich',
  es: 'Staking requerido', it: 'Staking richiesto', en: 'Staking required',
};
const NO_STAKING_LABEL: Record<string, string> = {
  fr: 'Sans staking', be: 'Sans staking', de: 'Kein Staking', at: 'Kein Staking',
  es: 'Sin staking', it: 'Nessuno staking', en: 'No staking',
};
const DETAILS_LABEL: Record<string, string> = {
  fr: 'Voir la fiche', be: 'Voir la fiche', de: 'Details', at: 'Details',
  es: 'Ver ficha', it: 'Vedi scheda', en: 'View card',
};
const COMPARE_LINK_LABEL: Record<string, string> = {
  fr: 'Comparer toutes les cartes', be: 'Comparer toutes les cartes',
  de: 'Alle Karten vergleichen', at: 'Alle Karten vergleichen',
  es: 'Comparar todas las tarjetas', it: 'Confronta tutte le carte',
  en: 'Compare all cards',
};
const BRAND_PAGE_LABEL: Record<string, string> = {
  fr: 'Voir la page marque', be: 'Voir la page marque',
  de: 'Zur Markenseite', at: 'Zur Markenseite',
  es: 'Ver página de marca', it: 'Vedi pagina del marchio',
  en: 'View brand page',
};
const FAQ_LABEL: Record<string, string> = {
  fr: 'Questions fréquentes', be: 'Questions fréquentes',
  de: 'Häufige Fragen', at: 'Häufige Fragen',
  es: 'Preguntas frecuentes', it: 'Domande frequenti',
  en: 'Frequently Asked Questions',
};

/* ── Component ──────────────────────────────────────────────────────────────── */
interface AlternativesPageProps {
  brand: AltBrandId;
}

export default function AlternativesPage({ brand }: AlternativesPageProps) {
  const { lang = 'fr' } = useParams<{ lang: string }>();
  useLanguage(); // sync

  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const altBrand = ALT_BRAND_MAP[brand];
  const cl = contentLang(lang);
  const copy = altBrand?.copy[cl] ?? altBrand?.copy['en'];

  const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;
  const brandsSlug = rt.brands ?? 'brands';
  const cardsSlug  = rt.cards  ?? 'cards';
  const compareSlug = rt.compare ?? 'compare';

  // Hreflang: each lang uses its own slug
  useHreflang(
    altBrand
      ? (l: string) => {
          const s = altBrand.slugs[l as keyof typeof altBrand.slugs];
          return s ? `${BASE}/${l}/${s}` : null;
        }
      : null,
    [brand]
  );

  useSeoMeta({
    title: copy?.title ?? `${altBrand?.displayName} Alternatives`,
    description: copy?.description,
    lang,
  });

  useEffect(() => {
    supabase
      .from('cards')
      .select('id, name, brand_id, issuer, cashback_base, cashback_premium, annual_fees, staking_required, virtual_only, card_network, markets, trust_score, real_card_image')
      .then(({ data, error }) => {
        if (error) console.error('AlternativesPage error:', error);
        setCards(data || []);
        setLoading(false);
      });
  }, []);

  // Top alternatives = cards NOT from this brand, sorted by trust_score DESC
  const alternatives = useMemo(() => {
    return cards
      .filter(c => c.brand_id !== brand)
      .sort((a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0))
      .slice(0, 8);
  }, [cards, brand]);

  if (!altBrand || !copy) return null;

  const breadcrumb = [
    { label: lang === 'de' || lang === 'at' ? 'Startseite' : lang === 'es' ? 'Inicio' : lang === 'it' ? 'Home' : lang === 'en' ? 'Home' : 'Accueil', to: `/${lang}` },
    { label: BRANDS_LABEL[lang] ?? 'Brands', to: `/${lang}/${brandsSlug}` },
    { label: `${ALTERNATIVES_LABEL[lang] ?? 'Alternatives'} ${altBrand.displayName}` },
  ];

  // Schema.org — ItemList + FAQPage
  const schemaItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: copy.h1,
    description: copy.description,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${BASE}/${lang}/${cardsSlug}/${c.id}`,
    })),
  };

  const schemaFaq = copy.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

  return (
    <div className="container-app py-8">
      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList) }} />
      {schemaFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />}

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumb} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          {copy.h1}
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
          {copy.intro}
        </p>
      </div>

      {/* Why block */}
      <div className="mb-8 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
        <p className="text-sm font-semibold text-amber-400 mb-2">
          {WHY_LABEL[lang] ?? WHY_LABEL.en}
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">{copy.reason}</p>
      </div>

      {/* Alternatives grid */}
      <h2 className="text-xl font-semibold text-white mb-5">
        {TOP_ALTS_LABEL[lang] ?? TOP_ALTS_LABEL.en}
      </h2>

      {loading ? (
        <p className="text-slate-400 text-sm py-8 text-center">{LOADING_LABEL[lang] ?? '…'}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {alternatives.map((card, idx) => {
            const fees = card.annual_fees === 0 || card.annual_fees === null
              ? (FREE_LABEL[lang] ?? 'Free')
              : `${card.annual_fees}€${PER_YEAR_LABEL[lang] ?? '/yr'}`;
            const cbRate = card.cashback_premium
              ? `${card.cashback_base}–${card.cashback_premium}%`
              : card.cashback_base
                ? `${card.cashback_base}%`
                : '—';
            return (
              <Link
                key={card.id}
                to={`/${lang}/${cardsSlug}/${card.id}`}
                className="group rounded-2xl border border-bg-border bg-bg-card hover:border-cyan-accent/50 hover:bg-bg-elevated transition-all p-4 flex flex-col gap-3"
              >
                {/* Rank badge */}
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                  {card.trust_score >= 8 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                      ★ Top
                    </span>
                  )}
                </div>

                {/* Card image */}
                <div className="flex justify-center my-1">
                  <SmartCardImage
                    card={{ id: card.id, name: card.name, realCardImage: card.real_card_image }}
                    className="w-20 h-auto object-contain"
                    loading={idx < 4 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Name */}
                <p className="text-sm font-semibold text-white text-center group-hover:text-cyan-accent transition-colors leading-tight">
                  {card.name}
                </p>

                {/* Stats */}
                <div className="flex flex-col gap-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Cashback</span>
                    <span className="text-cyan-accent font-medium">{cbRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'de' || lang === 'at' ? 'Gebühr' : lang === 'en' ? 'Fee' : 'Frais'}</span>
                    <span className="text-white">{fees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staking</span>
                    <span className={card.staking_required ? 'text-amber-400' : 'text-emerald-400'}>
                      {card.staking_required
                        ? (STAKING_LABEL[lang] ?? 'Required')
                        : (NO_STAKING_LABEL[lang] ?? 'None')}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <span className="mt-auto text-xs text-cyan-accent text-center group-hover:underline">
                  {DETAILS_LABEL[lang] ?? 'View card'} →
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* CTA row */}
      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          to={`/${lang}/${compareSlug}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-accent text-bg font-semibold text-sm hover:bg-cyan-400 transition-colors"
        >
          {COMPARE_LINK_LABEL[lang] ?? 'Compare all cards'}
        </Link>
        <Link
          to={`/${lang}/${brandsSlug}/${brand}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card border border-bg-border text-slate-300 text-sm hover:text-white hover:border-cyan-accent/50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {BRAND_PAGE_LABEL[lang] ?? 'Brand page'}
        </Link>
        <Link
          to={`/${lang}/${THEMATIC_ROUTES.cashback[lang as keyof typeof THEMATIC_ROUTES.cashback] ?? 'crypto-card-cashback'}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card border border-bg-border text-slate-300 text-sm hover:text-white hover:border-cyan-accent/50 transition-colors"
        >
          💰 {lang === 'de' || lang === 'at' ? 'Cashback-Karten' : lang === 'es' ? 'Tarjetas cashback' : lang === 'it' ? 'Carte cashback' : lang === 'en' ? 'Cashback cards' : 'Cartes cashback'}
        </Link>
      </div>

      {/* FAQ */}
      {copy.faq.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            {FAQ_LABEL[lang] ?? FAQ_LABEL.en}
          </h2>
          <div className="space-y-2">
            {copy.faq.map(([q, a], i) => (
              <div
                key={i}
                className="rounded-xl border border-bg-border bg-bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-3 p-4 text-left text-sm font-medium text-white hover:bg-bg-elevated/50 transition-colors"
                  aria-expanded={openFaq === i}
                >
                  <span>{q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-300 leading-relaxed border-t border-bg-border">
                    <p className="pt-3">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom internal links */}
      <div className="text-xs text-slate-500 leading-relaxed">
        <p>
          {lang === 'fr' || lang === 'be'
            ? `Voir aussi : `
            : lang === 'de' || lang === 'at'
              ? `Siehe auch: `
              : lang === 'es' ? `Ver también: ` : lang === 'it' ? `Vedi anche: ` : `See also: `}
          <Link to={`/${lang}/${THEMATIC_ROUTES.best[lang as keyof typeof THEMATIC_ROUTES.best]}`} className="text-cyan-400 hover:underline">
            {lang === 'de' || lang === 'at' ? 'Beste Krypto-Karten' : lang === 'es' ? 'Mejores tarjetas crypto' : lang === 'it' ? 'Migliori carte crypto' : lang === 'en' ? 'Best crypto cards' : 'Meilleures cartes crypto'}
          </Link>
          {' · '}
          <Link to={`/${lang}/${THEMATIC_ROUTES['no-fees'][lang as keyof typeof THEMATIC_ROUTES['no-fees']]}`} className="text-cyan-400 hover:underline">
            {lang === 'de' || lang === 'at' ? 'Kostenlose Krypto-Karten' : lang === 'es' ? 'Tarjetas sin comisiones' : lang === 'it' ? 'Carte senza commissioni' : lang === 'en' ? 'No-fee cards' : 'Cartes sans frais'}
          </Link>
          {' · '}
          <Link to={`/${lang}/${THEMATIC_ROUTES['no-staking'][lang as keyof typeof THEMATIC_ROUTES['no-staking']]}`} className="text-cyan-400 hover:underline">
            {lang === 'de' || lang === 'at' ? 'Kein Staking' : lang === 'es' ? 'Sin staking' : lang === 'it' ? 'Senza staking' : lang === 'en' ? 'No staking' : 'Sans staking'}
          </Link>
        </p>
      </div>
    </div>
  );
}
