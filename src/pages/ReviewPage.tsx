import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, XCircle, Star, ExternalLink, Shield, Zap, CreditCard, HeadphonesIcon, DollarSign } from 'lucide-react';
import { getReviewBySlug, getRelatedReviews } from '../data/cardReviews';
import { getReviewI18n } from '../data/cardReviewsI18n';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { getAffiliateLink } from '../utils/affiliateLink';
import { trackAffiliateClick } from '../utils/analytics';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

const CARD_SEGMENT: Record<string, string> = {
  fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards',
};

const VIEW_CARD_LABEL: Record<string, string> = {
  fr: 'Voir la fiche complète', de: 'Vollständige Karte ansehen',
  es: 'Ver ficha completa', it: 'Vedi scheda completa', en: 'View full card details',
};

// ── i18n ──────────────────────────────────────────────────────────────────────
const L: Record<string, {
  notFound: string; notFoundDesc: string; allReviews: string;
  reviewWord: string; updatedOn: string; network: string; globalRating: string;
  outOf5: string; issuer: string; getCard: string; compareCards: string;
  ratingDetail: string; avgRating: string; strongPoints: string; weakPoints: string;
  verdict: string; recap: string; noteGlobale: string; maxCashback: string;
  annualFees: string; otherReviews: string; compareCta: string; compareCtaDesc: string;
  compareNow: string; breadcrumbReviews: string; home: string;
  breakdownLabels: Record<string, string>;
  statsLabels: Record<string, string>;
  sectionTitles: Record<string, string>;
}> = {
  fr: {
    notFound: 'Avis introuvable',
    notFoundDesc: "Cet avis n'existe pas ou a été déplacé.",
    allReviews: 'Voir tous les avis',
    reviewWord: 'Avis',
    updatedOn: 'Mis à jour le',
    network: 'Réseau',
    globalRating: 'Note globale / 5',
    outOf5: 'sur 5',
    issuer: 'Émetteur',
    getCard: 'Obtenir la carte',
    compareCards: 'Comparer les cartes',
    ratingDetail: 'Détail de la note',
    avgRating: 'Note moyenne',
    strongPoints: 'Points forts',
    weakPoints: 'Points faibles',
    verdict: 'Notre verdict',
    recap: 'Récapitulatif',
    noteGlobale: 'Note globale',
    maxCashback: 'Cashback max',
    annualFees: 'Frais annuels',
    otherReviews: 'Autres avis',
    compareCta: 'Comparer les cartes',
    compareCtaDesc: "Trouvez la carte qui correspond vraiment à votre profil avec notre comparateur.",
    compareNow: 'Comparer maintenant',
    breadcrumbReviews: 'Avis cartes crypto',
    home: 'Accueil',
    breakdownLabels: { cashback: 'Cashback', frais: 'Frais', facilite: "Facilité d'usage", securite: 'Sécurité', support: 'Support' },
    statsLabels: { cashbackMax: '💰 Cashback max', stakingRequis: '🔒 Staking requis', fraisAnnuels: '💳 Frais annuels', disponibilite: '🌍 Disponibilité' },
    sectionTitles: { presentation: '📋 Présentation', cashback: '💰 Cashback & Récompenses', frais: '💳 Frais & Conditions', securite: '🔒 Sécurité & Régulation', experience: '📱 Expérience utilisateur' },
  },
  de: {
    notFound: 'Bewertung nicht gefunden',
    notFoundDesc: 'Diese Bewertung existiert nicht oder wurde verschoben.',
    allReviews: 'Alle Bewertungen ansehen',
    reviewWord: 'Bewertung',
    updatedOn: 'Aktualisiert am',
    network: 'Netzwerk',
    globalRating: 'Gesamtnote / 5',
    outOf5: 'von 5',
    issuer: 'Herausgeber',
    getCard: 'Karte erhalten',
    compareCards: 'Karten vergleichen',
    ratingDetail: 'Bewertungsdetails',
    avgRating: 'Durchschnittsnote',
    strongPoints: 'Stärken',
    weakPoints: 'Schwächen',
    verdict: 'Unser Urteil',
    recap: 'Zusammenfassung',
    noteGlobale: 'Gesamtnote',
    maxCashback: 'Max. Cashback',
    annualFees: 'Jahresgebühr',
    otherReviews: 'Weitere Bewertungen',
    compareCta: 'Karten vergleichen',
    compareCtaDesc: 'Finden Sie mit unserem Vergleichstool die passende Karte für Ihr Profil.',
    compareNow: 'Jetzt vergleichen',
    breadcrumbReviews: 'Krypto-Karten Bewertungen',
    home: 'Startseite',
    breakdownLabels: { cashback: 'Cashback', frais: 'Gebühren', facilite: 'Benutzerfreundlichkeit', securite: 'Sicherheit', support: 'Support' },
    statsLabels: { cashbackMax: '💰 Max. Cashback', stakingRequis: '🔒 Staking erf.', fraisAnnuels: '💳 Jahresgebühr', disponibilite: '🌍 Verfügbarkeit' },
    sectionTitles: { presentation: '📋 Übersicht', cashback: '💰 Cashback & Prämien', frais: '💳 Gebühren & Bedingungen', securite: '🔒 Sicherheit & Regulierung', experience: '📱 Benutzererfahrung' },
  },
  es: {
    notFound: 'Opinión no encontrada',
    notFoundDesc: 'Esta opinión no existe o ha sido trasladada.',
    allReviews: 'Ver todas las opiniones',
    reviewWord: 'Opinión',
    updatedOn: 'Actualizado el',
    network: 'Red',
    globalRating: 'Nota global / 5',
    outOf5: 'de 5',
    issuer: 'Emisor',
    getCard: 'Obtener la tarjeta',
    compareCards: 'Comparar tarjetas',
    ratingDetail: 'Detalle de la nota',
    avgRating: 'Nota media',
    strongPoints: 'Puntos fuertes',
    weakPoints: 'Puntos débiles',
    verdict: 'Nuestro veredicto',
    recap: 'Resumen',
    noteGlobale: 'Nota global',
    maxCashback: 'Cashback máx.',
    annualFees: 'Comisiones anuales',
    otherReviews: 'Otras opiniones',
    compareCta: 'Comparar tarjetas',
    compareCtaDesc: 'Encuentra la tarjeta que realmente se adapta a tu perfil con nuestro comparador.',
    compareNow: 'Comparar ahora',
    breadcrumbReviews: 'Opiniones tarjetas crypto',
    home: 'Inicio',
    breakdownLabels: { cashback: 'Cashback', frais: 'Comisiones', facilite: 'Facilidad de uso', securite: 'Seguridad', support: 'Soporte' },
    statsLabels: { cashbackMax: '💰 Cashback máx.', stakingRequis: '🔒 Staking req.', fraisAnnuels: '💳 Comisiones anuales', disponibilite: '🌍 Disponibilidad' },
    sectionTitles: { presentation: '📋 Presentación', cashback: '💰 Cashback & Recompensas', frais: '💳 Comisiones & Condiciones', securite: '🔒 Seguridad & Regulación', experience: '📱 Experiencia de usuario' },
  },
  it: {
    notFound: 'Recensione non trovata',
    notFoundDesc: 'Questa recensione non esiste o è stata spostata.',
    allReviews: 'Vedi tutte le recensioni',
    reviewWord: 'Recensione',
    updatedOn: 'Aggiornato il',
    network: 'Rete',
    globalRating: 'Voto globale / 5',
    outOf5: 'su 5',
    issuer: 'Emittente',
    getCard: 'Ottieni la carta',
    compareCards: 'Confronta le carte',
    ratingDetail: 'Dettaglio del voto',
    avgRating: 'Voto medio',
    strongPoints: 'Punti di forza',
    weakPoints: 'Punti deboli',
    verdict: 'Il nostro verdetto',
    recap: 'Riepilogo',
    noteGlobale: 'Voto globale',
    maxCashback: 'Cashback max.',
    annualFees: 'Commissioni annuali',
    otherReviews: 'Altre recensioni',
    compareCta: 'Confronta le carte',
    compareCtaDesc: 'Trova la carta che si adatta davvero al tuo profilo con il nostro comparatore.',
    compareNow: 'Confronta ora',
    breadcrumbReviews: 'Recensioni carte crypto',
    home: 'Home',
    breakdownLabels: { cashback: 'Cashback', frais: 'Commissioni', facilite: 'Facilità d\'uso', securite: 'Sicurezza', support: 'Supporto' },
    statsLabels: { cashbackMax: '💰 Cashback max.', stakingRequis: '🔒 Staking rich.', fraisAnnuels: '💳 Commissioni annuali', disponibilite: '🌍 Disponibilità' },
    sectionTitles: { presentation: '📋 Presentazione', cashback: '💰 Cashback & Premi', frais: '💳 Commissioni & Condizioni', securite: '🔒 Sicurezza & Regolamentazione', experience: '📱 Esperienza utente' },
  },
  en: {
    notFound: 'Review not found',
    notFoundDesc: 'This review does not exist or has been moved.',
    allReviews: 'See all reviews',
    reviewWord: 'Review',
    updatedOn: 'Updated on',
    network: 'Network',
    globalRating: 'Overall rating / 5',
    outOf5: 'out of 5',
    issuer: 'Issuer',
    getCard: 'Get the card',
    compareCards: 'Compare cards',
    ratingDetail: 'Rating breakdown',
    avgRating: 'Average rating',
    strongPoints: 'Strengths',
    weakPoints: 'Weaknesses',
    verdict: 'Our verdict',
    recap: 'Summary',
    noteGlobale: 'Overall rating',
    maxCashback: 'Max cashback',
    annualFees: 'Annual fees',
    otherReviews: 'Other reviews',
    compareCta: 'Compare cards',
    compareCtaDesc: 'Find the card that truly matches your profile with our comparison tool.',
    compareNow: 'Compare now',
    breadcrumbReviews: 'Crypto card reviews',
    home: 'Home',
    breakdownLabels: { cashback: 'Cashback', frais: 'Fees', facilite: 'Ease of use', securite: 'Security', support: 'Support' },
    statsLabels: { cashbackMax: '💰 Max cashback', stakingRequis: '🔒 Staking req.', fraisAnnuels: '💳 Annual fees', disponibilite: '🌍 Availability' },
    sectionTitles: { presentation: '📋 Overview', cashback: '💰 Cashback & Rewards', frais: '💳 Fees & Conditions', securite: '🔒 Security & Regulation', experience: '📱 User experience' },
  },
};

// Map issuer name → brand_id for "See all tiers" links
const ISSUER_TO_BRAND: Record<string, string> = {
  'Crypto.com': 'crypto-com', 'Binance': 'binance', 'Bybit': 'bybit',
  'OKX': 'okx', 'Coinbase': 'coinbase', 'Nexo': 'nexo', 'Bitpanda': 'bitpanda',
  'Wirex': 'wirex', 'Ledger (Baanx)': 'ledger', 'Revolut': 'revolut',
  'Bleap': 'bleap', 'Plutus': 'plutus', 'Gnosis': 'gnosis', 'Trade Republic': 'trade-republic',
};
const SEE_ALL_TIERS: Record<string, string> = {
  fr: 'Voir toutes les cartes', de: 'Alle Karten ansehen',
  es: 'Ver todas las tarjetas', it: 'Vedi tutte le carte', en: 'See all cards',
};

const DATE_LOCALE: Record<string, string> = {
  fr: 'fr-FR', de: 'de-DE', es: 'es-ES', it: 'it-IT', en: 'en-GB',
};

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block w-5 h-5">
            <Star className="w-5 h-5 text-slate-700 absolute inset-0" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function RatingBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.FC<{ className?: string }> }) {
  const pct = (value / 5) * 100;
  const color = value >= 4 ? 'bg-emerald-500' : value >= 3 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-sm text-slate-400 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-white w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

function renderMarkdownLite(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- /g, '</p><li>')
    .replace(/<\/p><li>/g, '<ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300"><li>')
    .replace(/\n/g, '</p><p class="mt-3">');
}

export default function ReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const l = L[lang] ?? L.en;

  const review = slug ? getReviewBySlug(slug) : undefined;
  const related = slug ? getRelatedReviews(slug, 3) : [];
  // Translated content for non-FR languages (generated by scripts/generate-review-translations.mjs)
  const i18n = review ? getReviewI18n(review.slug, lang) : undefined;

  const reviewSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.reviews ?? 'reviews';

  useSeoMeta({
    title: i18n?.metaTitle || review?.metaTitle || `${l.reviewWord} | TopCryptoCards`,
    description: i18n?.metaDescription || review?.metaDescription || '',
    image: review?.realCardImage || undefined,
    type: 'article',
    lang,
  });

  // ── Hreflang ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!review || !slug) return;
    const BASE = 'https://topcryptocards.eu';
    document.querySelectorAll('link[data-hreflang-review]').forEach(el => el.remove());
    const langs = ['fr', 'de', 'es', 'it', 'en'];
    langs.forEach(l => {
      const seg = ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.reviews ?? 'reviews';
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/${seg}/${slug}`);
      el.setAttribute('data-hreflang-review', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate';
    xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/${ROUTE_TRANSLATIONS.fr.reviews}/${slug}`);
    xd.setAttribute('data-hreflang-review', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-review]').forEach(el => el.remove()); };
  }, [review, slug, lang]);

  if (!review) {
    return (
      <div className="container-app py-24 text-center">
        <CreditCard className="w-14 h-14 text-slate-600 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">{l.notFound}</h1>
        <p className="text-slate-500 mb-8">{l.notFoundDesc}</p>
        <Link to={`/${lang}/${reviewSlug}`} className="btn-primary">
          {l.allReviews}
        </Link>
      </div>
    );
  }

  const avgBreakdown = Object.values(review.ratingBreakdown).reduce((a, b) => a + b, 0) / Object.values(review.ratingBreakdown).length;

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    inLanguage: lang,
    name: review.metaTitle,
    reviewBody: review.verdict,
    reviewRating: { '@type': 'Rating', ratingValue: review.globalRating, bestRating: 5, worstRating: 1 },
    author: { '@type': 'Organization', name: 'TopCryptoCards' },
    itemReviewed: { '@type': 'Product', name: review.cardName, brand: { '@type': 'Brand', name: review.issuer } },
    datePublished: review.updatedAt,
    publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: 'https://topcryptocards.eu' },
  };

  const breakdownItems = [
    { key: 'cashback', label: l.breakdownLabels.cashback, icon: DollarSign },
    { key: 'frais',    label: l.breakdownLabels.frais,    icon: CreditCard },
    { key: 'facilite', label: l.breakdownLabels.facilite, icon: Zap },
    { key: 'securite', label: l.breakdownLabels.securite, icon: Shield },
    { key: 'support',  label: l.breakdownLabels.support,  icon: HeadphonesIcon },
  ] as const;

  const sectionDefs = [
    { key: 'presentation', title: l.sectionTitles.presentation },
    { key: 'cashback',     title: l.sectionTitles.cashback },
    { key: 'frais',        title: l.sectionTitles.frais },
    { key: 'securite',     title: l.sectionTitles.securite },
    { key: 'experience',   title: l.sectionTitles.experience },
  ] as const;

  const dateLocale = DATE_LOCALE[lang] ?? 'en-GB';

  return (
    <div className="animate-fade-in">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-bg-elevated via-bg-card to-bg border-b border-bg-border">
        <div className="container-app py-10">
          <Breadcrumb items={[
            { label: l.home, href: `/${lang}` },
            { label: l.breadcrumbReviews, href: `/${lang}/${reviewSlug}` },
            { label: review.cardName },
          ]} />

          <Link to={`/${lang}/${reviewSlug}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {l.allReviews}
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              {(i18n?.badge ?? (lang === 'fr' ? review.badge : undefined)) && (
                <span className="inline-flex items-center gap-1.5 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {i18n?.badge ?? review.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {review.cardName} — {l.reviewWord} {new Date(review.updatedAt).getFullYear()}
              </h1>
              <p className="text-slate-400 text-sm mb-4">
                {l.updatedOn} {new Date(review.updatedAt).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })} · {l.network} {review.network}
              </p>

              <div className="flex items-center gap-4">
                <div className="text-5xl font-display font-bold text-white">
                  {review.globalRating.toFixed(1)}
                </div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-1">{l.globalRating}</p>
                </div>
              </div>
            </div>

            {/* CTA sidebar */}
            <div className="card-surface p-6 w-full md:w-72 shrink-0">
              <p className="text-white font-semibold mb-1">{review.cardName}</p>
              <p className="text-slate-400 text-sm mb-4">{l.issuer} : {review.issuer}</p>
              <a
                href={getAffiliateLink(review)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary w-full justify-center flex items-center gap-2 mb-3"
                onClick={() => trackAffiliateClick(review.cardName, review.issuer, getAffiliateLink(review), 'review', lang)}
              >
                {l.getCard}
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                to={`/${lang}/${CARD_SEGMENT[lang] ?? 'cards'}/${slug}`}
                className="btn-secondary w-full justify-center flex text-sm mb-3"
              >
                {VIEW_CARD_LABEL[lang] ?? VIEW_CARD_LABEL.en}
              </Link>
              <Link to={getRoute('compare')} className="btn-ghost w-full justify-center flex text-sm mb-3 border border-bg-border">
                {l.compareCards}
              </Link>
              {ISSUER_TO_BRAND[review.issuer] && (() => {
                const bSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
                return (
                  <Link
                    to={`/${lang}/${bSlug}/${ISSUER_TO_BRAND[review.issuer]}`}
                    className="btn-ghost w-full justify-center flex text-sm border border-bg-border"
                  >
                    {SEE_ALL_TIERS[lang] ?? SEE_ALL_TIERS.en}
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-10">

            {/* Key stats */}
            {(lang === 'fr' || i18n) && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(i18n?.keyStats ?? review.keyStats).map(([key, val]) => (
                  <div key={key} className="card-surface p-4">
                    <p className="text-xs text-slate-500 mb-1">{l.statsLabels[key] ?? key}</p>
                    <p className="text-sm font-semibold text-white">{val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Rating breakdown */}
            <div className="card-surface p-6">
              <h2 className="text-lg font-display font-bold text-white mb-5">{l.ratingDetail}</h2>
              <div className="space-y-4">
                {breakdownItems.map(({ key, label, icon }) => (
                  <RatingBar key={key} label={label} value={review.ratingBreakdown[key]} icon={icon} />
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-bg-border flex items-center justify-between">
                <span className="text-slate-400 font-medium">{l.avgRating}</span>
                <div className="flex items-center gap-2">
                  <StarRating value={avgBreakdown} />
                  <span className="font-bold text-white">{avgBreakdown.toFixed(1)}/5</span>
                </div>
              </div>
            </div>

            {/* Pros / Cons */}
            {(lang === 'fr' || i18n) && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface p-5 border-emerald-500/20">
                  <h3 className="font-display font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> {l.strongPoints}
                  </h3>
                  <ul className="space-y-2">
                    {(i18n?.pros ?? review.pros).map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-surface p-5 border-red-500/20">
                  <h3 className="font-display font-bold text-red-400 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> {l.weakPoints}
                  </h3>
                  <ul className="space-y-2">
                    {(i18n?.cons ?? review.cons).map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Editorial sections */}
            {(lang === 'fr' || i18n) && sectionDefs.map(({ key, title }) => (
              <div key={key}>
                <h2 className="text-xl font-display font-bold text-white mb-4">{title}</h2>
                <div
                  className="prose-crypto text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: `<p class="mt-0">${renderMarkdownLite((i18n?.sections ?? review.sections)[key])}</p>` }}
                />
              </div>
            ))}

            {/* Verdict */}
            <div className="card-surface p-6 border-cyan-accent/30 bg-cyan-accent/5">
              <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-accent" fill="currentColor" />
                {l.verdict}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl font-display font-bold text-cyan-accent">{review.globalRating.toFixed(1)}</div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-0.5">{l.outOf5}</p>
                </div>
              </div>
              {(lang === 'fr' || i18n) && <p className="text-slate-300 leading-relaxed">{i18n?.verdict ?? review.verdict}</p>}
              <a
                href={getAffiliateLink(review)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary inline-flex items-center gap-2 mt-5"
                onClick={() => trackAffiliateClick(review.cardName, review.issuer, getAffiliateLink(review), 'review', lang)}
              >
                {l.getCard}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Quick recap */}
              <div className="card-surface p-5">
                <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">{l.recap}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{l.noteGlobale}</span>
                    <span className="font-bold text-white">{review.globalRating}/5</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{l.network}</span>
                    <span className="font-semibold text-white">{review.network}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{l.maxCashback}</span>
                    <span className="font-semibold text-white">
                      {i18n
                        ? i18n.keyStats.cashbackMax.split(' ').slice(0, 3).join(' ')
                        : lang === 'fr'
                          ? review.keyStats.cashbackMax.split(' ').slice(0, 3).join(' ')
                          : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{l.annualFees}</span>
                    <span className="font-semibold text-white">
                      {i18n?.keyStats.fraisAnnuels ?? (lang === 'fr' ? review.keyStats.fraisAnnuels : '—')}
                    </span>
                  </div>
                </div>
                <a
                  href={getAffiliateLink(review)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="btn-primary w-full justify-center flex items-center gap-2 mt-5 text-sm"
                  onClick={() => trackAffiliateClick(review.cardName, review.issuer, getAffiliateLink(review), 'review', lang)}
                >
                  {l.getCard}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Related reviews */}
              {related.length > 0 && (
                <div className="card-surface p-5">
                  <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">{l.otherReviews}</h3>
                  <div className="space-y-3">
                    {related.map(rel => (
                      <Link
                        key={rel.slug}
                        to={`/${lang}/${reviewSlug}/${rel.slug}`}
                        className="flex items-center justify-between gap-2 group hover:text-cyan-accent transition-colors"
                      >
                        <span className="text-sm text-slate-300 group-hover:text-cyan-accent transition-colors line-clamp-1">
                          {rel.cardName}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                          <span className="text-xs font-bold text-white">{rel.globalRating}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link to={`/${lang}/${reviewSlug}`} className="text-cyan-accent text-xs font-medium mt-4 block hover:underline">
                    {l.allReviews} →
                  </Link>
                </div>
              )}

              {/* Compare CTA */}
              <div className="card-surface p-5 border-cyan-accent/20">
                <h4 className="font-display font-bold text-white mb-2 text-sm">{l.compareCta}</h4>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">{l.compareCtaDesc}</p>
                <Link to={getRoute('compare')} className="btn-primary w-full text-sm flex justify-center">
                  {l.compareNow}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
