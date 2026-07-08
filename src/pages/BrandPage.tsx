import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Building2, Calendar, Shield, ChevronRight, CheckCircle2, CheckCircle, XCircle, Star } from 'lucide-react';
import { fetchCardsByBrand, fetchRelatedPosts } from '../lib/supabase';
import type { BlogPost } from '../types/blog';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useLanguage } from '../hooks/useLanguage';
import { useHreflang } from '../hooks/useHreflang';
import SmartCardImage from '../components/SmartCardImage';
import TrustBadge from '../components/TrustBadge';
import { getAffiliateLink } from '../utils/affiliateLink';
import { trackAffiliateClick } from '../utils/analytics';
import AffiliateButton from '../components/AffiliateButton';
import { getBrandMeta } from '../data/brandConfig';
import { BRAND_WHY_CHOOSE } from '../data/brandEditorial';
import { getReviewBySlug } from '../data/cardReviews';
import { REVIEW_I18N } from '../data/cardReviewsI18n';
import { ROUTE_TRANSLATIONS, displayLang } from '../i18n/types';
import { THEMATIC_ROUTES } from '../config/routes';
import type { CryptoCard } from '../types/card';

// ── Labels ────────────────────────────────────────────────────────────────────

const L = {
  fr: {
    prosTitle: 'Les points forts',
    consTitle: 'Les points faibles',
    ratingLabel: 'Note globale',
    readReview: 'Lire l\'avis',
    updatedAt: 'Mis à jour',
    cashbackLabel: 'Cashback max',
    stakingLabel: 'Staking requis',
    feesLabel: 'Frais annuels',
    stakingNo: '✓ Non requis',
    stakingYes: '⚠️ Oui',
    home: 'Accueil',
    allCards: 'Toutes les cartes',
    allBrands: 'Toutes les marques',
    tier: 'Carte',
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
    tiers: 'cartes',
    tier1: 'carte',
    markets: 'Marchés',
    compareTitle: 'Comparaison des cartes',
    aboutTitle: 'À propos de',
    foundedLabel: 'Fondée en',
    hqLabel: 'Siège',
    regulationLabel: 'Régulation',
    verdictTitle: 'Notre verdict',
    faqTitle: 'Questions fréquentes',
    relatedTitle: 'Voir aussi',
    upTo: 'Jusqu\'à',
    websiteLabel: 'Site officiel',
    whyChooseTitle: 'Pourquoi choisir',
    thematicLinksTitle: 'Pages connexes',
  },
  de: {
    prosTitle: 'Vorteile',
    consTitle: 'Nachteile',
    ratingLabel: 'Gesamtbewertung',
    readReview: 'Bewertung lesen',
    updatedAt: 'Aktualisiert',
    cashbackLabel: 'Max. Cashback',
    stakingLabel: 'Staking erforderlich',
    feesLabel: 'Jahresgebühr',
    stakingNo: '✓ Nicht erforderlich',
    stakingYes: '⚠️ Ja',
    home: 'Startseite',
    allCards: 'Alle Karten',
    allBrands: 'Alle Marken',
    tier: 'Karte',
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
    tiers: 'Karten',
    tier1: 'Karte',
    markets: 'Märkte',
    compareTitle: 'Kartenvergleich',
    aboutTitle: 'Über',
    foundedLabel: 'Gegründet',
    hqLabel: 'Hauptsitz',
    regulationLabel: 'Regulierung',
    verdictTitle: 'Unser Urteil',
    faqTitle: 'Häufige Fragen',
    relatedTitle: 'Siehe auch',
    upTo: 'Bis zu',
    websiteLabel: 'Offizielle Website',
    whyChooseTitle: 'Warum',
    thematicLinksTitle: 'Verwandte Seiten',
  },
  es: {
    prosTitle: 'Puntos fuertes',
    consTitle: 'Puntos débiles',
    ratingLabel: 'Valoración global',
    readReview: 'Leer la reseña',
    updatedAt: 'Actualizado',
    cashbackLabel: 'Cashback máx.',
    stakingLabel: 'Staking requerido',
    feesLabel: 'Cuota anual',
    stakingNo: '✓ No requerido',
    stakingYes: '⚠️ Sí',
    home: 'Inicio',
    allCards: 'Todas las tarjetas',
    allBrands: 'Todas las marcas',
    tier: 'Tarjeta',
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
    tiers: 'tarjetas',
    tier1: 'tarjeta',
    markets: 'Mercados',
    compareTitle: 'Comparación de tarjetas',
    aboutTitle: 'Acerca de',
    foundedLabel: 'Fundada en',
    hqLabel: 'Sede',
    regulationLabel: 'Regulación',
    verdictTitle: 'Nuestro veredicto',
    faqTitle: 'Preguntas frecuentes',
    relatedTitle: 'Ver también',
    upTo: 'Hasta',
    websiteLabel: 'Sitio oficial',
    whyChooseTitle: 'Por qué elegir',
    thematicLinksTitle: 'Páginas relacionadas',
  },
  it: {
    prosTitle: 'Punti di forza',
    consTitle: 'Punti deboli',
    ratingLabel: 'Valutazione globale',
    readReview: 'Leggi la recensione',
    updatedAt: 'Aggiornato',
    cashbackLabel: 'Cashback max',
    stakingLabel: 'Staking richiesto',
    feesLabel: 'Costo annuale',
    stakingNo: '✓ Non richiesto',
    stakingYes: '⚠️ Sì',
    home: 'Home',
    allCards: 'Tutte le carte',
    allBrands: 'Tutti i marchi',
    tier: 'Carta',
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
    tiers: 'carte',
    tier1: 'carta',
    markets: 'Mercati',
    compareTitle: 'Confronto carte',
    aboutTitle: 'Informazioni su',
    foundedLabel: 'Fondata nel',
    hqLabel: 'Sede',
    regulationLabel: 'Regolamentazione',
    verdictTitle: 'Il nostro verdetto',
    faqTitle: 'Domande frequenti',
    relatedTitle: 'Vedi anche',
    upTo: 'Fino a',
    websiteLabel: 'Sito ufficiale',
    whyChooseTitle: 'Perché scegliere',
    thematicLinksTitle: 'Pagine correlate',
  },
  en: {
    prosTitle: 'Strengths',
    consTitle: 'Weaknesses',
    ratingLabel: 'Overall rating',
    readReview: 'Read the review',
    updatedAt: 'Updated',
    cashbackLabel: 'Max cashback',
    stakingLabel: 'Staking required',
    feesLabel: 'Annual fees',
    stakingNo: '✓ Not required',
    stakingYes: '⚠️ Yes',
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
    tiers: 'cards',
    tier1: 'card',
    markets: 'Markets',
    compareTitle: 'Card comparison',
    aboutTitle: 'About',
    foundedLabel: 'Founded',
    hqLabel: 'HQ',
    regulationLabel: 'Regulation',
    verdictTitle: 'Our verdict',
    faqTitle: 'FAQ',
    relatedTitle: 'See also',
    upTo: 'Up to',
    websiteLabel: 'Official website',
    whyChooseTitle: 'Why choose',
    thematicLinksTitle: 'Related pages',
  },
} as const;

const BRAND_ARTICLES_TITLE: Record<string, string> = {
  fr: 'Articles sur', de: 'Artikel über', es: 'Artículos sobre', it: 'Articoli su', en: 'Articles about',
};
const BRAND_ARTICLES_READ: Record<string, string> = {
  fr: 'Lire l\'article', de: 'Artikel lesen', es: 'Leer artículo', it: 'Leggi articolo', en: 'Read article',
};

// ── Market flags ──────────────────────────────────────────────────────────────
const MARKET_FLAG: Record<string, string> = {
  fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸', it: '🇮🇹', en: '🇬🇧',
};

// ── Review slugs by brand (FR review slug; ReviewPage handles multi-lang) ─────
const BRAND_REVIEW_SLUG: Record<string, string> = {
  'crypto-com': 'crypto-com-card',
  'nexo': 'nexo-card',
  'binance': 'binance-card',
  'kraken': 'kraken-card',
  'brighty': 'brighty-card',
  'gnosis': 'gnosis-pay-card',
  'bybit': 'bybit-card',
  'wirex': 'wirex-card',
  'bitpanda': 'bitpanda-card',
  'okx': 'okx-card',
  'coinbase': 'coinbase-card',
  'revolut': 'revolut-card',
  'deblock': 'deblock-card',
  'bleap': 'bleap-card',
  'plutus': 'plutus-card',
  'trade-republic': 'trade-republic-card',
  'ledger': 'ledger-card',
  'metamask': 'metamask-card',
};

const REVIEW_LABEL: Record<string, string> = {
  fr: 'Avis complet', de: 'Vollständige Bewertung', es: 'Reseña completa',
  it: 'Recensione completa', en: 'Full review',
};

const BASE_URL = 'https://topcryptocards.eu';

// ── HQ localization ───────────────────────────────────────────────────────────
// brand.hq is stored in French; translate it for non-FR pages
const HQ_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Singapour':      { de: 'Singapur',            es: 'Singapur',            it: 'Singapore',           en: 'Singapore' },
  'Royaume-Uni':    { de: 'Vereinigtes Königreich', es: 'Reino Unido',       it: 'Regno Unito',         en: 'United Kingdom' },
  'Suisse':         { de: 'Schweiz',              es: 'Suiza',               it: 'Svizzera',            en: 'Switzerland' },
  'Dubaï':          { de: 'Dubai',                es: 'Dubái',               it: 'Dubai',               en: 'Dubai' },
  'États-Unis':     { de: 'Vereinigte Staaten',   es: 'Estados Unidos',      it: 'Stati Uniti',         en: 'United States' },
  'Autriche':       { de: 'Österreich',           es: 'Austria',             it: 'Austria',             en: 'Austria' },
  'Allemagne':      { de: 'Deutschland',          es: 'Alemania',            it: 'Germania',            en: 'Germany' },
  'Pologne':        { de: 'Polen',                es: 'Polonia',             it: 'Polonia',             en: 'Poland' },
  'Non communiqué': { de: 'Unbekannt',            es: 'Desconocido',         it: 'Sconosciuto',         en: 'N/A' },
};

function translateHq(hq: string, lang: string): string {
  if (lang === 'fr') return hq;
  return HQ_TRANSLATIONS[hq]?.[lang] ?? hq;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ratingColor(r: number) {
  if (r >= 4.5) return 'text-emerald-400';
  if (r >= 4.0) return 'text-green-400';
  if (r >= 3.5) return 'text-yellow-400';
  if (r >= 3.0) return 'text-orange-400';
  return 'text-red-400';
}

function FeeBadge({ card, lang }: { card: CryptoCard; lang: string }) {
  const l = L[displayLang(lang) as keyof typeof L] ?? L.en;
  if (card.annualFees === 0) return <span className="text-green-400 font-medium">{l.free}</span>;
  return <span>{card.annualFees}{l.eur}{l.perYear}</span>;
}

/** Maps brand IDs to relevant comparison pair slugs (alphabetically normalized). */
const BRAND_COMPARISONS: Record<string, string[]> = {
  nexo:       ['nexo-card-vs-revolut-metal', 'bybit-card-vs-nexo-card', 'coinbase-card-vs-nexo-card', 'kraken-krak-card-vs-nexo-card'],
  bybit:      ['bybit-card-vs-nexo-card', 'bybit-card-vs-revolut-metal', 'bybit-card-vs-coinbase-card', 'bybit-card-vs-okx-card'],
  revolut:    ['nexo-card-vs-revolut-metal', 'bybit-card-vs-revolut-metal', 'binance-standard-vs-revolut-metal', 'crypto-com-midnight-blue-vs-revolut-metal'],
  'crypto-com': ['crypto-com-midnight-blue-vs-nexo-card', 'crypto-com-midnight-blue-vs-revolut-metal', 'bybit-card-vs-crypto-com-midnight-blue'],
  binance:    ['binance-card-vs-bybit-card', 'binance-card-vs-nexo-card', 'binance-standard-vs-revolut-metal'],
  coinbase:   ['coinbase-card-vs-nexo-card', 'bybit-card-vs-coinbase-card', 'bitpanda-card-vs-coinbase-card'],
  okx:        ['bybit-card-vs-okx-card', 'nexo-card-vs-okx-card'],
  bitpanda:   ['bitpanda-card-vs-coinbase-card', 'bitpanda-card-vs-revolut-metal'],
  kraken:     ['kraken-krak-card-vs-nexo-card'],
  deblock:    ['deblock-card-vs-nexo-card', 'deblock-card-vs-coinbase-card', 'deblock-card-vs-wirex-elite'],
  wirex:      ['nexo-card-vs-wirex-elite', 'bybit-card-vs-wirex-elite', 'deblock-card-vs-wirex-elite'],
};

/** Convert a comparison slug to a display label (card names are proper nouns, no i18n needed). */
function brandCompSlugToLabel(slug: string): string {
  return slug.split('-vs-').map((part) =>
    part.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  ).join(' vs ');
}

const BRAND_COMP_TITLE: Record<string, string> = {
  fr: 'Comparatifs populaires', be: 'Comparatifs populaires', de: 'Beliebte Vergleiche', at: 'Beliebte Vergleiche', es: 'Comparativas populares', it: 'Confronti popolari', en: 'Popular comparisons',
};

// ── Main component ────────────────────────────────────────────────────────────

export default function BrandPage() {
  const { lang = 'fr', brandId } = useParams<{ lang: string; brandId: string }>();
  useLanguage(); // ensure lang is tracked
  const l = L[displayLang(lang) as keyof typeof L] ?? L.en;

  const [cards, setCards] = useState<CryptoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [brandArticles, setBrandArticles] = useState<BlogPost[]>([]);

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

  useEffect(() => {
    if (!brandId) return;
    // Search by brandId (e.g. 'crypto-com') + dot-version (e.g. 'crypto.com') + brand name
    const brand = getBrandMeta(brandId);
    const searchTags = [brandId, brandId.replace(/-/g, '.'), brand.displayName.toLowerCase()];
    fetchRelatedPosts(searchTags, '', lang, 3)
      .then(setBrandArticles)
      .catch(() => setBrandArticles([]));
  }, [brandId, lang]);

  const brand = getBrandMeta(brandId ?? '');
  const seo = brand.seo[lang] ?? brand.seo.en;
  const reviewSlug = BRAND_REVIEW_SLUG[brandId ?? ''];
  const review = reviewSlug ? getReviewBySlug(reviewSlug) : undefined;

  const brandOgImage = cards.find(c => c.realCardImage)?.realCardImage || undefined;
  useSeoMeta({
    title: seo.title || `${brand.displayName} — TopCryptoCards`,
    description: seo.description || '',
    image: brandOgImage,
    lang,
  });

  // ── Hreflang ───────────────────────────────────────────────────────────────
  useHreflang(brandId ? l => `https://topcryptocards.eu/${l}/${ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands'}/${brandId}` : null, [brandId]);

  // ── Schema.org BreadcrumbList + FAQPage ───────────────────────────────────
  useEffect(() => {
    if (!brandId || cards.length === 0) return;

    // ItemList for tiers
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      inLanguage: lang,
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
        inLanguage: lang,
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      };
    }

    // BreadcrumbList
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'TopCryptoCards', item: `${BASE_URL}/${lang}` },
        { '@type': 'ListItem', position: 2, name: brand.displayName, item: `${BASE_URL}/${lang}/${ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands'}/${brandId}` },
      ],
    };

    // Organization — brand entity
    const orgSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brand.displayName,
      url: brand.website,
      description: seo.description,
      ...(brand.founded > 0 ? { foundingDate: String(brand.founded) } : {}),
      ...(brand.twitter ? { sameAs: [`https://twitter.com/${brand.twitter}`] } : {}),
    };

    ['schema-brand-itemlist', 'schema-brand-faq', 'schema-brand-breadcrumb', 'schema-brand-org'].forEach(id => document.getElementById(id)?.remove());

    const listEl = document.createElement('script');
    listEl.id = 'schema-brand-itemlist';
    listEl.type = 'application/ld+json';
    listEl.textContent = JSON.stringify(itemListSchema);
    document.head.appendChild(listEl);

    const bcEl = document.createElement('script');
    bcEl.id = 'schema-brand-breadcrumb';
    bcEl.type = 'application/ld+json';
    bcEl.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(bcEl);

    if (faqSchema) {
      const faqEl = document.createElement('script');
      faqEl.id = 'schema-brand-faq';
      faqEl.type = 'application/ld+json';
      faqEl.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqEl);
    }

    const orgEl = document.createElement('script');
    orgEl.id = 'schema-brand-org';
    orgEl.type = 'application/ld+json';
    orgEl.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgEl);

    return () => {
      ['schema-brand-itemlist', 'schema-brand-faq', 'schema-brand-breadcrumb', 'schema-brand-org'].forEach(id => document.getElementById(id)?.remove());
    };
  }, [brandId, cards, seo, lang, cardsSlug, brand.displayName, brand.website, brand.founded, brand.twitter]);

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

  // Thematic links based on brand card features
  const brandHasCashback = bestCashback > 0;
  const brandHasNoFees = cards.some(c => c.annualFees === 0);
  const brandHasNoStaking = cards.some(c => c.stakingRequired === 0 && (c.cashbackBase > 0 || c.cashbackNoStaking > 0));
  const brandHasVirtual = cards.some(c => c.virtualOnly);
  const thematicLinks: Array<{ to: string; icon: string; label: string }> = [];
  if (brandHasCashback)
    thematicLinks.push({ to: `/${lang}/${THEMATIC_ROUTES.cashback[lang as keyof typeof THEMATIC_ROUTES.cashback]}`, icon: '💰', label: { fr:'Cartes cashback', de:'Cashback-Karten', es:'Tarjetas cashback', it:'Carte cashback', en:'Cashback cards' }[lang] || 'Cashback cards' });
  if (brandHasNoFees)
    thematicLinks.push({ to: `/${lang}/${THEMATIC_ROUTES['no-fees'][lang as keyof typeof THEMATIC_ROUTES['no-fees']]}`, icon: '🆓', label: { fr:'Cartes sans frais', de:'Kostenlose Karten', es:'Tarjetas sin comisiones', it:'Carte senza commissioni', en:'No-fee cards' }[lang] || 'No-fee cards' });
  if (brandHasNoStaking)
    thematicLinks.push({ to: `/${lang}/${THEMATIC_ROUTES['no-staking'][lang as keyof typeof THEMATIC_ROUTES['no-staking']]}`, icon: '🔓', label: { fr:'Sans staking', de:'Ohne Staking', es:'Sin staking', it:'Senza staking', en:'No-staking cards' }[lang] || 'No-staking cards' });
  if (brandHasVirtual)
    thematicLinks.push({ to: `/${lang}/${THEMATIC_ROUTES.virtual[lang as keyof typeof THEMATIC_ROUTES.virtual]}`, icon: '📱', label: { fr:'Cartes virtuelles', de:'Virtuelle Karten', es:'Tarjetas virtuales', it:'Carte virtuali', en:'Virtual cards' }[lang] || 'Virtual cards' });
  thematicLinks.push({ to: `/${lang}/${THEMATIC_ROUTES.best[lang as keyof typeof THEMATIC_ROUTES.best]}`, icon: '⭐', label: { fr:'Meilleures cartes', de:'Beste Karten', es:'Mejores tarjetas', it:'Migliori carte', en:'Best cards' }[lang] || 'Best cards' });

  // Affiliate-aware website link
  const websiteHref = brand.affiliateLink ?? brand.website;
  const hasReview = !!BRAND_REVIEW_SLUG[brandId ?? ''];
  const whyChoose = brandId ? BRAND_WHY_CHOOSE[brandId]?.[lang] : undefined;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-text-secondary flex items-center gap-2 flex-wrap">
        <Link to={`/${lang}`} className="hover:text-text-primary">{l.home}</Link>
        <span>›</span>
        <Link to={`/${lang}/${brandsSlug}`} className="hover:text-text-primary">{l.allBrands}</Link>
        <span>›</span>
        <span className="text-text-primary">{brand.displayName}</span>
      </nav>

      {/* ── Brand hero ──────────────────────────────────────────────────────── */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-text-primary">{brand.displayName}</h1>
          {seo.rating != null && (
            <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {seo.rating.toFixed(1)}/5
            </span>
          )}
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

      {/* ── Tier cards + optional review mini-card ──────────────────────────── */}
      <section>
        {cards.length === 1 && review ? (
          /* Single card: show tier card and review card side by side */
          <div className="grid gap-6 sm:grid-cols-2">
            <TierCard card={cards[0]} lang={lang} l={l} cardsSlug={cardsSlug} />
            <ReviewMiniCard
              review={review}
              seo={seo}
              lang={lang}
              l={l}
              reviewsSlug={reviewsSlug}
              primaryCard={cards[0]}
            />
          </div>
        ) : (
          /* Multiple cards: centered flex-wrap so last row is always centred (pyramid) */
          <>
            <div className="flex flex-wrap gap-6 justify-center">
              {cards.map((card) => (
                <div key={card.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TierCard card={card} lang={lang} l={l} cardsSlug={cardsSlug} />
                </div>
              ))}
            </div>
            {review && (
              <div className="mt-6 max-w-sm">
                <ReviewMiniCard
                  review={review}
                  seo={seo}
                  lang={lang}
                  l={l}
                  reviewsSlug={reviewsSlug}
                  primaryCard={cards[0]}
                />
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Pros & Cons ─────────────────────────────────────────────────────── */}
      {(seo.pros?.length || seo.cons?.length) && (
        <section className="grid sm:grid-cols-2 gap-4">
          {seo.pros && seo.pros.length > 0 && (
            <div className="bg-bg-card border border-green-500/20 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {l.prosTitle}
              </h2>
              <ul className="space-y-2">
                {seo.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {seo.cons && seo.cons.length > 0 && (
            <div className="bg-bg-card border border-red-500/20 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {l.consTitle}
              </h2>
              <ul className="space-y-2">
                {seo.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-snug">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ── Why choose ──────────────────────────────────────────────────────── */}
      {whyChoose && (
        <section className="bg-bg-card rounded-xl p-6 border border-border-card">
          <h2 className="text-lg font-bold text-text-primary mb-3">
            {l.whyChooseTitle} {brand.displayName} ?
          </h2>
          <p className="text-text-secondary leading-relaxed">{whyChoose}</p>
        </section>
      )}

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
                value={translateHq(brand.hq, lang)}
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
                      <AffiliateButton card={c} lang={lang} label={l.seeOffer} source="brand_page" className="inline-block bg-brand-accent text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity" showIcon={false} />
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

      {/* ── Full review CTA ─────────────────────────────────────────────────── */}
      {hasReview && (
        <section className="bg-bg-card border border-brand-accent/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-text-primary font-semibold text-base">
              {REVIEW_LABEL[lang] || REVIEW_LABEL.en} — {brand.displayName}
            </p>
            <p className="text-text-secondary text-sm mt-0.5">
              {lang === 'fr' && 'Cashback, frais, sécurité, expérience utilisateur — tout est détaillé.'}
              {lang === 'de' && 'Cashback, Gebühren, Sicherheit, Nutzererfahrung — alles im Detail.'}
              {lang === 'es' && 'Cashback, comisiones, seguridad, experiencia de usuario — todo en detalle.'}
              {lang === 'it' && 'Cashback, commissioni, sicurezza, esperienza utente — tutto nel dettaglio.'}
              {lang === 'en' && 'Cashback, fees, security, user experience — everything covered in depth.'}
            </p>
          </div>
          <Link
            to={`/${lang}/${reviewsSlug}/${BRAND_REVIEW_SLUG[brandId ?? '']}`}
            className="shrink-0 inline-flex items-center gap-1.5 bg-brand-accent text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            {REVIEW_LABEL[lang] || REVIEW_LABEL.en}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* ── Thematic links ──────────────────────────────────────────────────── */}
      {thematicLinks.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            {l.thematicLinksTitle}
          </h2>
          <div className="flex flex-wrap gap-2">
            {thematicLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-brand-accent hover:border-brand-accent/40 transition-all"
              >
                <span>{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Comparison links ────────────────────────────────────────────────── */}
      {(BRAND_COMPARISONS[brandId ?? ''] || []).length > 0 && (() => {
        const compSeg = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.comparisons ?? 'compare';
        return (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              {BRAND_COMP_TITLE[lang] || BRAND_COMP_TITLE.en}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(BRAND_COMPARISONS[brandId ?? ''] || []).map((slug) => (
                <Link
                  key={slug}
                  to={`/${lang}/${compSeg}/${slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-brand-accent hover:border-brand-accent/40 transition-all"
                >
                  <span>⚖️</span>
                  {brandCompSlugToLabel(slug)}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* ── Blog articles ───────────────────────────────────────────────────── */}
      {brandArticles.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            {BRAND_ARTICLES_TITLE[lang] || BRAND_ARTICLES_TITLE.en} {brand.displayName}
          </h2>
          <div className="space-y-2">
            {brandArticles.map(article => (
              <Link
                key={article.id}
                to={`/${lang}/blog/${article.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 card-surface hover:border-brand-accent/30 transition-colors group"
              >
                <span className="text-sm text-slate-300 group-hover:text-brand-accent transition-colors line-clamp-1">
                  📰 {article.title}
                </span>
                <span className="shrink-0 text-xs text-slate-500 group-hover:text-brand-accent transition-colors">
                  {BRAND_ARTICLES_READ[lang] || BRAND_ARTICLES_READ.en} →
                </span>
              </Link>
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
        <AffiliateButton card={card} lang={lang} label={l.seeOffer} source="brand_page" className="flex-1 text-center bg-brand-accent text-white text-sm font-semibold py-2 rounded-xl hover:opacity-90 transition-opacity" showIcon={false} />
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

import type { CardReview } from '../data/cardReviews';

// ── Helpers for ReviewMiniCard keyStats (lang-aware, from numeric card data) ──
const UP_TO: Record<string, string> = { fr: "Jusqu'à", be: "Jusqu'à", de: 'Bis zu', at: 'Bis zu', es: 'Hasta', it: 'Fino al', en: 'Up to' };
const FREE: Record<string, string> = { fr: 'Gratuit', be: 'Gratuit', de: 'Kostenlos', at: 'Kostenlos', es: 'Gratis', it: 'Gratuito', en: 'Free' };
const PER_YEAR: Record<string, string> = { fr: '/an', be: '/an', de: '/Jahr', at: '/Jahr', es: '/año', it: '/anno', en: '/year' };

function fmtCashbackMax(card: CryptoCard, lang: string): string {
  const pct = card.cashbackPremium ?? card.cashbackBase ?? 0;
  if (!pct) return '—';
  const upTo = UP_TO[lang] ?? UP_TO.en;
  return `${upTo} ${pct} %`;
}

function fmtAnnualFees(card: CryptoCard, lang: string): string {
  const fees = card.annualFees ?? 0;
  if (fees === 0) return FREE[lang] ?? FREE.en;
  return `${fees} €${PER_YEAR[lang] ?? PER_YEAR.en}`;
}

function ReviewMiniCard({
  review, seo, lang, l, reviewsSlug, primaryCard,
}: {
  review: CardReview;
  seo: { rating?: number; pros?: string[] };
  lang: string;
  l: (typeof L)[keyof typeof L];
  reviewsSlug: string;
  primaryCard?: CryptoCard;
}) {
  const rating = seo.rating ?? review.globalRating;
  const dateLocale = lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : 'en-GB';
  const updatedLabel = new Date(review.updatedAt).toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' });

  // Use numeric card data for keyStats when available (avoids FR-only strings)
  const cashbackDisplay = primaryCard ? fmtCashbackMax(primaryCard, lang) : (lang === 'fr' ? review.keyStats.cashbackMax : '—');
  const feesDisplay = primaryCard ? fmtAnnualFees(primaryCard, lang) : (lang === 'fr' ? review.keyStats.fraisAnnuels : '—');
  const stakingBool = primaryCard
    ? (primaryCard.stakingRequired ?? 0) > 0
    : review.keyStats.stakingRequis.toLowerCase().includes('aucun') || review.keyStats.stakingRequis.toLowerCase().includes('non') ? false : true;

  return (
    <Link
      to={`/${lang}/${reviewsSlug}/${review.slug}`}
      className="bg-bg-card border border-border-card rounded-2xl flex flex-col overflow-hidden hover:border-brand-accent/50 hover:shadow-lg transition-all group"
    >
      {/* Header */}
      <div className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-bg-border">
        <div>
          {(REVIEW_I18N[`${review.slug}__${lang}`]?.badge ?? review.badge) && (
            <span className="inline-flex items-center text-xs font-semibold text-text-secondary bg-bg-elevated border border-bg-border px-2 py-0.5 rounded-full mb-2">
              {REVIEW_I18N[`${review.slug}__${lang}`]?.badge ?? review.badge}
            </span>
          )}
          <h3 className="font-display font-bold text-text-primary group-hover:text-brand-accent transition-colors text-base leading-tight">
            {review.cardName}
          </h3>
          <p className="text-text-secondary text-xs mt-0.5">{review.issuer} · {review.network}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className={`text-2xl font-display font-bold ${ratingColor(rating)}`}>
            {rating.toFixed(1)}
          </div>
          <div className="flex gap-0.5 justify-end mt-0.5">
            {[1,2,3,4,5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Key stats — computed from numeric card data (language-agnostic) */}
      <div className="p-5 flex-1 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">{l.cashbackLabel}</span>
          <span className="font-semibold text-text-primary">{cashbackDisplay}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">{l.stakingLabel}</span>
          <span className="font-semibold text-text-primary">
            {stakingBool ? l.stakingYes : l.stakingNo}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">{l.feesLabel}</span>
          <span className="font-semibold text-text-primary">{feesDisplay}</span>
        </div>
      </div>

      {/* Top pros — use seo.pros if available (multilingual), else review.pros as fallback */}
      <div className="px-5 pb-4">
        <div className="space-y-1">
          {(seo.pros ?? review.pros ?? []).slice(0, 2).map((pro, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-text-secondary leading-snug">
              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{pro}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-bg-border flex items-center justify-between">
        <span className="text-xs text-text-secondary">{l.updatedAt} {updatedLabel}</span>
        <span className="text-brand-accent text-sm font-semibold group-hover:translate-x-0.5 transition-transform">
          {l.readReview} →
        </span>
      </div>
    </Link>
  );
}
