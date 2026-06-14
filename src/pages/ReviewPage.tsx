import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Star, ExternalLink, Shield, Zap, CreditCard, HeadphonesIcon, DollarSign } from 'lucide-react';
import { getReviewBySlug, getRelatedReviews } from '../data/cardReviews';
import { getReviewI18n } from '../data/cardReviewsI18n';
import { getReviewSections } from '../data/cardReviewsSectionsI18n';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';

// ── Route slug per language ───────────────────────────────────────────────────
const REVIEW_SLUGS: Record<string, string> = {
  fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews',
};

// ── UI labels ─────────────────────────────────────────────────────────────────
const LABELS: Record<string, {
  breadcrumbHome: string;
  breadcrumbReviews: string;
  backToAll: string;
  network: string;
  updatedOn: string;
  globalRating: string;
  overallRating: string;
  getCard: string;
  compareCards: string;
  ratingDetail: string;
  cashback: string;
  fees: string;
  ease: string;
  security: string;
  support: string;
  averageRating: string;
  strengths: string;
  weaknesses: string;
  verdict: string;
  outOf: string;
  getThe: string;
  summary: string;
  globalRatingLabel: string;
  cashbackMax: string;
  annualFees: string;
  otherReviews: string;
  seeAll: string;
  compareNow: string;
  compareDesc: string;
  notFound: string;
  notFoundDesc: string;
  seeAllReviews: string;
  emitter: string;
  presentation: string;
  cashbackSection: string;
  feesSection: string;
  securitySection: string;
  experience: string;
  stakingRequired: string;
  availability: string;
}> = {
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbReviews: 'Avis cartes crypto',
    backToAll: 'Tous les avis',
    network: 'Réseau',
    updatedOn: 'Mis à jour le',
    globalRating: 'Note globale / 5',
    overallRating: 'Note globale',
    getCard: 'Obtenir la carte',
    compareCards: 'Comparer les cartes',
    ratingDetail: 'Détail de la note',
    cashback: 'Cashback',
    fees: 'Frais',
    ease: "Facilité d'usage",
    security: 'Sécurité',
    support: 'Support',
    averageRating: 'Note moyenne',
    strengths: 'Points forts',
    weaknesses: 'Points faibles',
    verdict: 'Notre verdict',
    outOf: 'sur 5',
    getThe: 'Obtenir la',
    summary: 'Récapitulatif',
    globalRatingLabel: 'Note globale',
    cashbackMax: 'Cashback max',
    annualFees: 'Frais annuels',
    otherReviews: 'Autres avis',
    seeAll: 'Voir tous les avis →',
    compareNow: 'Comparer maintenant',
    compareDesc: 'Trouvez la carte qui correspond vraiment à votre profil avec notre comparateur.',
    notFound: 'Avis introuvable',
    notFoundDesc: "Cet avis n'existe pas ou a été déplacé.",
    seeAllReviews: 'Voir tous les avis',
    emitter: 'Émetteur',
    presentation: '📋 Présentation',
    cashbackSection: '💰 Cashback & Récompenses',
    feesSection: '💳 Frais & Conditions',
    securitySection: '🔒 Sécurité & Régulation',
    experience: '📱 Expérience utilisateur',
    stakingRequired: 'Staking requis',
    availability: 'Disponibilité',
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumbReviews: 'Crypto card reviews',
    backToAll: 'All reviews',
    network: 'Network',
    updatedOn: 'Updated on',
    globalRating: 'Overall rating / 5',
    overallRating: 'Overall rating',
    getCard: 'Get the card',
    compareCards: 'Compare cards',
    ratingDetail: 'Rating breakdown',
    cashback: 'Cashback',
    fees: 'Fees',
    ease: 'Ease of use',
    security: 'Security',
    support: 'Support',
    averageRating: 'Average rating',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    verdict: 'Our verdict',
    outOf: 'out of 5',
    getThe: 'Get the',
    summary: 'Summary',
    globalRatingLabel: 'Overall rating',
    cashbackMax: 'Max cashback',
    annualFees: 'Annual fees',
    otherReviews: 'Other reviews',
    seeAll: 'See all reviews →',
    compareNow: 'Compare now',
    compareDesc: 'Find the card that truly matches your profile with our comparison tool.',
    notFound: 'Review not found',
    notFoundDesc: 'This review does not exist or has been moved.',
    seeAllReviews: 'See all reviews',
    emitter: 'Issuer',
    presentation: '📋 Overview',
    cashbackSection: '💰 Cashback & Rewards',
    feesSection: '💳 Fees & Conditions',
    securitySection: '🔒 Security & Regulation',
    experience: '📱 User experience',
    stakingRequired: 'Staking required',
    availability: 'Availability',
  },
  de: {
    breadcrumbHome: 'Startseite',
    breadcrumbReviews: 'Krypto-Karten Bewertungen',
    backToAll: 'Alle Bewertungen',
    network: 'Netzwerk',
    updatedOn: 'Aktualisiert am',
    globalRating: 'Gesamtnote / 5',
    overallRating: 'Gesamtnote',
    getCard: 'Karte erhalten',
    compareCards: 'Karten vergleichen',
    ratingDetail: 'Bewertungsdetails',
    cashback: 'Cashback',
    fees: 'Gebühren',
    ease: 'Benutzerfreundlichkeit',
    security: 'Sicherheit',
    support: 'Support',
    averageRating: 'Durchschnittsnote',
    strengths: 'Stärken',
    weaknesses: 'Schwächen',
    verdict: 'Unser Urteil',
    outOf: 'von 5',
    getThe: 'Erhalten Sie die',
    summary: 'Zusammenfassung',
    globalRatingLabel: 'Gesamtnote',
    cashbackMax: 'Max. Cashback',
    annualFees: 'Jahresgebühren',
    otherReviews: 'Weitere Bewertungen',
    seeAll: 'Alle Bewertungen →',
    compareNow: 'Jetzt vergleichen',
    compareDesc: 'Finden Sie die Karte, die wirklich zu Ihrem Profil passt, mit unserem Vergleichsrechner.',
    notFound: 'Bewertung nicht gefunden',
    notFoundDesc: 'Diese Bewertung existiert nicht oder wurde verschoben.',
    seeAllReviews: 'Alle Bewertungen ansehen',
    emitter: 'Herausgeber',
    presentation: '📋 Überblick',
    cashbackSection: '💰 Cashback & Prämien',
    feesSection: '💳 Gebühren & Konditionen',
    securitySection: '🔒 Sicherheit & Regulierung',
    experience: '📱 Nutzererfahrung',
    stakingRequired: 'Staking erforderlich',
    availability: 'Verfügbarkeit',
  },
  es: {
    breadcrumbHome: 'Inicio',
    breadcrumbReviews: 'Opiniones tarjetas crypto',
    backToAll: 'Todas las opiniones',
    network: 'Red',
    updatedOn: 'Actualizado el',
    globalRating: 'Puntuación global / 5',
    overallRating: 'Puntuación global',
    getCard: 'Obtener la tarjeta',
    compareCards: 'Comparar tarjetas',
    ratingDetail: 'Detalle de la puntuación',
    cashback: 'Cashback',
    fees: 'Comisiones',
    ease: 'Facilidad de uso',
    security: 'Seguridad',
    support: 'Soporte',
    averageRating: 'Puntuación media',
    strengths: 'Puntos fuertes',
    weaknesses: 'Puntos débiles',
    verdict: 'Nuestro veredicto',
    outOf: 'sobre 5',
    getThe: 'Obtener la',
    summary: 'Resumen',
    globalRatingLabel: 'Puntuación global',
    cashbackMax: 'Cashback máx.',
    annualFees: 'Comisiones anuales',
    otherReviews: 'Otras opiniones',
    seeAll: 'Ver todas las opiniones →',
    compareNow: 'Comparar ahora',
    compareDesc: 'Encuentra la tarjeta que realmente se adapta a tu perfil con nuestro comparador.',
    notFound: 'Opinión no encontrada',
    notFoundDesc: 'Esta opinión no existe o ha sido movida.',
    seeAllReviews: 'Ver todas las opiniones',
    emitter: 'Emisor',
    presentation: '📋 Presentación',
    cashbackSection: '💰 Cashback & Recompensas',
    feesSection: '💳 Comisiones & Condiciones',
    securitySection: '🔒 Seguridad & Regulación',
    experience: '📱 Experiencia de usuario',
    stakingRequired: 'Staking requerido',
    availability: 'Disponibilidad',
  },
  it: {
    breadcrumbHome: 'Home',
    breadcrumbReviews: 'Recensioni carte crypto',
    backToAll: 'Tutte le recensioni',
    network: 'Rete',
    updatedOn: 'Aggiornato il',
    globalRating: 'Voto globale / 5',
    overallRating: 'Voto globale',
    getCard: 'Ottieni la carta',
    compareCards: 'Confronta le carte',
    ratingDetail: 'Dettaglio del voto',
    cashback: 'Cashback',
    fees: 'Commissioni',
    ease: 'Facilità d\'uso',
    security: 'Sicurezza',
    support: 'Supporto',
    averageRating: 'Voto medio',
    strengths: 'Punti di forza',
    weaknesses: 'Punti deboli',
    verdict: 'Il nostro verdetto',
    outOf: 'su 5',
    getThe: 'Ottieni la',
    summary: 'Riepilogo',
    globalRatingLabel: 'Voto globale',
    cashbackMax: 'Cashback max',
    annualFees: 'Commissioni annuali',
    otherReviews: 'Altre recensioni',
    seeAll: 'Vedi tutte le recensioni →',
    compareNow: 'Confronta ora',
    compareDesc: 'Trova la carta che si adatta davvero al tuo profilo con il nostro comparatore.',
    notFound: 'Recensione non trovata',
    notFoundDesc: 'Questa recensione non esiste o è stata spostata.',
    seeAllReviews: 'Vedi tutte le recensioni',
    emitter: 'Emittente',
    presentation: '📋 Presentazione',
    cashbackSection: '💰 Cashback & Premi',
    feesSection: '💳 Commissioni & Condizioni',
    securitySection: '🔒 Sicurezza & Regolamentazione',
    experience: '📱 Esperienza utente',
    stakingRequired: 'Staking richiesto',
    availability: 'Disponibilità',
  },
};

// ─────────────────────────────────────────────────────────────────────────────

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

  const lbl = LABELS[lang] || LABELS.fr;
  const reviewRouteSlug = REVIEW_SLUGS[lang] || 'avis';

  const baseReview = slug ? getReviewBySlug(slug) : undefined;
  const related = slug ? getRelatedReviews(slug, 3) : [];

  // Merge i18n content on top of base review (fr fallback)
  const i18n = baseReview ? getReviewI18n(baseReview.slug, lang) : null;
  const i18nSections = baseReview ? getReviewSections(baseReview.slug, lang) : null;
  const review = baseReview
    ? {
        ...baseReview,
        ...(i18n && {
          badge: i18n.badge ?? baseReview.badge,
          pros: i18n.pros,
          cons: i18n.cons,
          verdict: i18n.verdict,
          keyStats: i18n.keyStats,
          metaTitle: i18n.metaTitle,
          metaDescription: i18n.metaDescription,
        }),
        sections: i18nSections ?? baseReview.sections,
      }
    : baseReview;

  // Date locale per language
  const dateLocale: Record<string, string> = { fr: 'fr-FR', en: 'en-GB', de: 'de-DE', es: 'es-ES', it: 'it-IT' };
  const locale = dateLocale[lang] || 'fr-FR';

  useSeoMeta({
    title: review?.metaTitle || 'Crypto card review | TopCryptoCards',
    description: review?.metaDescription || '',
    type: 'article',
  });

  if (!review) {
    return (
      <div className="container-app py-24 text-center">
        <CreditCard className="w-14 h-14 text-slate-600 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">{lbl.notFound}</h1>
        <p className="text-slate-500 mb-8">{lbl.notFoundDesc}</p>
        <Link to={`/${lang}/${reviewRouteSlug}`} className="btn-primary">
          {lbl.seeAllReviews}
        </Link>
      </div>
    );
  }

  const avgBreakdown = Object.values(review.ratingBreakdown).reduce((a, b) => a + b, 0) / Object.values(review.ratingBreakdown).length;

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: review.metaTitle,
    reviewBody: review.verdict,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.globalRating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Organization',
      name: 'TopCryptoCards',
    },
    itemReviewed: {
      '@type': 'Product',
      name: review.cardName,
      brand: { '@type': 'Brand', name: review.issuer },
    },
    datePublished: review.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: 'TopCryptoCards',
      url: 'https://topcryptocards.eu',
    },
  };

  const breakdownItems = [
    { key: 'cashback', label: lbl.cashback, icon: DollarSign },
    { key: 'frais',    label: lbl.fees,     icon: CreditCard },
    { key: 'facilite', label: lbl.ease,     icon: Zap },
    { key: 'securite', label: lbl.security, icon: Shield },
    { key: 'support',  label: lbl.support,  icon: HeadphonesIcon },
  ] as const;

  const sectionTitles = [
    { key: 'presentation', title: lbl.presentation },
    { key: 'cashback',     title: lbl.cashbackSection },
    { key: 'frais',        title: lbl.feesSection },
    { key: 'securite',     title: lbl.securitySection },
    { key: 'experience',   title: lbl.experience },
  ] as const;

  const keyStatLabels: Record<string, string> = {
    cashbackMax:   `💰 ${lbl.cashbackMax}`,
    stakingRequis: `🔒 ${lbl.stakingRequired}`,
    fraisAnnuels:  `💳 ${lbl.annualFees}`,
    disponibilite: `🌍 ${lbl.availability}`,
  };

  return (
    <div className="animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-bg-elevated via-bg-card to-bg border-b border-bg-border">
        <div className="container-app py-10">
          <Breadcrumb items={[
            { label: lbl.breadcrumbHome, href: `/${lang}` },
            { label: lbl.breadcrumbReviews, href: `/${lang}/${reviewRouteSlug}` },
            { label: review.cardName },
          ]} />

          <Link to={`/${lang}/${reviewRouteSlug}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {lbl.backToAll}
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              {review.badge && (
                <span className="inline-flex items-center gap-1.5 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {review.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {review.cardName} — {lbl.verdict.replace('Notre ', '').replace('Our ', '').replace('Unser ', '').replace('Nuestro ', '').replace('Il nostro ', '')} {new Date(review.updatedAt).getFullYear()}
              </h1>
              <p className="text-slate-400 text-sm mb-4">
                {lbl.updatedOn} {new Date(review.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })} · {lbl.network} {review.network}
              </p>

              <div className="flex items-center gap-4">
                <div className="text-5xl font-display font-bold text-white">
                  {review.globalRating.toFixed(1)}
                </div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-1">{lbl.globalRating}</p>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="card-surface p-6 w-full md:w-72 shrink-0">
              <p className="text-white font-semibold mb-1">{review.cardName}</p>
              <p className="text-slate-400 text-sm mb-4">{lbl.emitter} : {review.issuer}</p>
              <a
                href={review.affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary w-full justify-center flex items-center gap-2 mb-3"
              >
                {lbl.getCard}
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link to={getRoute('compare')} className="btn-secondary w-full justify-center flex text-sm">
                {lbl.compareCards}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-10">

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(review.keyStats).map(([key, val]) => (
                <div key={key} className="card-surface p-4">
                  <p className="text-xs text-slate-500 mb-1">{keyStatLabels[key] ?? key}</p>
                  <p className="text-sm font-semibold text-white">{val}</p>
                </div>
              ))}
            </div>

            {/* Rating breakdown */}
            <div className="card-surface p-6">
              <h2 className="text-lg font-display font-bold text-white mb-5">{lbl.ratingDetail}</h2>
              <div className="space-y-4">
                {breakdownItems.map(({ key, label, icon }) => (
                  <RatingBar
                    key={key}
                    label={label}
                    value={review.ratingBreakdown[key]}
                    icon={icon}
                  />
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-bg-border flex items-center justify-between">
                <span className="text-slate-400 font-medium">{lbl.averageRating}</span>
                <div className="flex items-center gap-2">
                  <StarRating value={avgBreakdown} />
                  <span className="font-bold text-white">{avgBreakdown.toFixed(1)}/5</span>
                </div>
              </div>
            </div>

            {/* Pros / Cons */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-surface p-5 border-emerald-500/20">
                <h3 className="font-display font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> {lbl.strengths}
                </h3>
                <ul className="space-y-2">
                  {review.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-surface p-5 border-red-500/20">
                <h3 className="font-display font-bold text-red-400 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> {lbl.weaknesses}
                </h3>
                <ul className="space-y-2">
                  {review.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sections (kept in FR as long-form content) */}
            {sectionTitles.map(({ key, title }) => (
              <div key={key}>
                <h2 className="text-xl font-display font-bold text-white mb-4">{title}</h2>
                <div
                  className="prose-crypto text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="mt-0">${renderMarkdownLite(review.sections[key])}</p>`,
                  }}
                />
              </div>
            ))}

            {/* Verdict */}
            <div className="card-surface p-6 border-cyan-accent/30 bg-cyan-accent/5">
              <h2 className="text-xl font-display font-bold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-accent" fill="currentColor" />
                {lbl.verdict}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl font-display font-bold text-cyan-accent">{review.globalRating.toFixed(1)}</div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-0.5">{lbl.outOf}</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{review.verdict}</p>
              <a
                href={review.affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary inline-flex items-center gap-2 mt-5"
              >
                {lbl.getThe} {review.cardName}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Quick recap */}
              <div className="card-surface p-5">
                <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">{lbl.summary}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{lbl.globalRatingLabel}</span>
                    <span className="font-bold text-white">{review.globalRating}/5</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{lbl.network}</span>
                    <span className="font-semibold text-white">{review.network}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{lbl.cashbackMax}</span>
                    <span className="font-semibold text-white">{review.keyStats.cashbackMax.split(' ').slice(0, 3).join(' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{lbl.annualFees}</span>
                    <span className="font-semibold text-white">{review.keyStats.fraisAnnuels}</span>
                  </div>
                </div>
                <a
                  href={review.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="btn-primary w-full justify-center flex items-center gap-2 mt-5 text-sm"
                >
                  {lbl.getCard}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Related reviews */}
              {related.length > 0 && (
                <div className="card-surface p-5">
                  <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">{lbl.otherReviews}</h3>
                  <div className="space-y-3">
                    {related.map(rel => (
                      <Link
                        key={rel.slug}
                        to={`/${lang}/${reviewRouteSlug}/${rel.slug}`}
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
                  <Link to={`/${lang}/${reviewRouteSlug}`} className="text-cyan-accent text-xs font-medium mt-4 block hover:underline">
                    {lbl.seeAll}
                  </Link>
                </div>
              )}

              {/* Compare CTA */}
              <div className="card-surface p-5 border-cyan-accent/20">
                <h4 className="font-display font-bold text-white mb-2 text-sm">{lbl.compareCards}</h4>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">
                  {lbl.compareDesc}
                </p>
                <Link to={getRoute('compare')} className="btn-primary w-full text-sm flex justify-center">
                  {lbl.compareNow}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
