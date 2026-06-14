import { Link } from 'react-router-dom';
import { Star, ExternalLink, CheckCircle, TrendingUp } from 'lucide-react';
import { CARD_REVIEWS } from '../data/cardReviews';
import { getReviewI18n } from '../data/cardReviewsI18n';
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
  badge: string;
  title: string;
  subtitle: string;
  topPick: string;
  readReview: string;
  cashback: string;
  staking: string;
  fees: string;
  updated: string;
  noStaking: string;
  hasStaking: string;
  ctaTitle: string;
  ctaText: string;
  ctaCompare: string;
  ctaFind: string;
  breadcrumbHome: string;
  breadcrumbReviews: string;
  seoTitle: string;
  seoDesc: string;
  bestChoice: string;
}> = {
  fr: {
    badge: 'Avis & Tests 2026',
    title: 'Avis sur les Cartes Crypto',
    subtitle: 'Tests complets et objectifs des meilleures cartes crypto du marché. Cashback, frais, sécurité et expérience utilisateur passés au crible.',
    topPick: 'Notre meilleur choix',
    readReview: "Lire l'avis",
    cashback: 'Cashback max',
    staking: 'Staking requis',
    fees: 'Frais annuels',
    updated: 'Mis à jour',
    noStaking: '✅ Aucun',
    hasStaking: '⚠️ Oui',
    ctaTitle: 'Vous ne savez pas quelle carte choisir ?',
    ctaText: 'Notre comparateur analyse votre profil et vos dépenses pour vous recommander la carte la plus rentable.',
    ctaCompare: 'Comparer toutes les cartes',
    ctaFind: 'Trouver ma carte idéale',
    breadcrumbHome: 'Accueil',
    breadcrumbReviews: 'Avis cartes crypto',
    seoTitle: 'Avis Cartes Crypto 2026 — Comparatif & Tests Complets | TopCryptoCards',
    seoDesc: 'Avis détaillés et objectifs sur les meilleures cartes crypto : Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase et plus. Notes, cashback, frais et verdicts.',
    bestChoice: '⭐ Meilleur choix',
  },
  en: {
    badge: 'Reviews & Tests 2026',
    title: 'Crypto Card Reviews',
    subtitle: 'Complete and objective reviews of the best crypto cards on the market. Cashback, fees, security and user experience put to the test.',
    topPick: 'Our top pick',
    readReview: 'Read review',
    cashback: 'Max cashback',
    staking: 'Staking required',
    fees: 'Annual fees',
    updated: 'Updated',
    noStaking: '✅ None',
    hasStaking: '⚠️ Yes',
    ctaTitle: "Not sure which card to choose?",
    ctaText: 'Our comparison tool analyses your profile and spending to recommend the most profitable card.',
    ctaCompare: 'Compare all cards',
    ctaFind: 'Find my ideal card',
    breadcrumbHome: 'Home',
    breadcrumbReviews: 'Crypto card reviews',
    seoTitle: 'Crypto Card Reviews 2026 — Full Comparison & Tests | TopCryptoCards',
    seoDesc: 'Detailed, objective reviews of the best crypto cards: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase and more. Ratings, cashback, fees and verdicts.',
    bestChoice: '⭐ Best choice',
  },
  de: {
    badge: 'Bewertungen & Tests 2026',
    title: 'Krypto-Karten Bewertungen',
    subtitle: 'Vollständige und objektive Tests der besten Krypto-Karten auf dem Markt. Cashback, Gebühren, Sicherheit und Nutzererfahrung auf dem Prüfstand.',
    topPick: 'Unsere beste Wahl',
    readReview: 'Bewertung lesen',
    cashback: 'Max. Cashback',
    staking: 'Staking erforderlich',
    fees: 'Jahresgebühren',
    updated: 'Aktualisiert',
    noStaking: '✅ Keines',
    hasStaking: '⚠️ Ja',
    ctaTitle: 'Wissen Sie nicht, welche Karte Sie wählen sollen?',
    ctaText: 'Unser Vergleichsrechner analysiert Ihr Profil und Ihre Ausgaben, um Ihnen die rentabelste Karte zu empfehlen.',
    ctaCompare: 'Alle Karten vergleichen',
    ctaFind: 'Meine ideale Karte finden',
    breadcrumbHome: 'Startseite',
    breadcrumbReviews: 'Krypto-Karten Bewertungen',
    seoTitle: 'Krypto-Karten Bewertungen 2026 — Vergleich & vollständige Tests | TopCryptoCards',
    seoDesc: 'Detaillierte, objektive Bewertungen der besten Krypto-Karten: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase und mehr.',
    bestChoice: '⭐ Beste Wahl',
  },
  es: {
    badge: 'Opiniones & Tests 2026',
    title: 'Opiniones sobre Tarjetas Crypto',
    subtitle: 'Análisis completos y objetivos de las mejores tarjetas crypto del mercado. Cashback, comisiones, seguridad y experiencia de usuario al detalle.',
    topPick: 'Nuestra mejor elección',
    readReview: 'Leer opinión',
    cashback: 'Cashback máx.',
    staking: 'Staking requerido',
    fees: 'Comisiones anuales',
    updated: 'Actualizado',
    noStaking: '✅ Ninguno',
    hasStaking: '⚠️ Sí',
    ctaTitle: '¿No sabes qué tarjeta elegir?',
    ctaText: 'Nuestro comparador analiza tu perfil y gastos para recomendarte la tarjeta más rentable.',
    ctaCompare: 'Comparar todas las tarjetas',
    ctaFind: 'Encontrar mi tarjeta ideal',
    breadcrumbHome: 'Inicio',
    breadcrumbReviews: 'Opiniones tarjetas crypto',
    seoTitle: 'Opiniones Tarjetas Crypto 2026 — Comparativa & Tests Completos | TopCryptoCards',
    seoDesc: 'Opiniones detalladas y objetivas de las mejores tarjetas crypto: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase y más.',
    bestChoice: '⭐ Mejor elección',
  },
  it: {
    badge: 'Recensioni & Test 2026',
    title: 'Recensioni Carte Crypto',
    subtitle: 'Test completi e obiettivi delle migliori carte crypto del mercato. Cashback, commissioni, sicurezza ed esperienza utente nel dettaglio.',
    topPick: 'La nostra migliore scelta',
    readReview: 'Leggi la recensione',
    cashback: 'Cashback max',
    staking: 'Staking richiesto',
    fees: 'Commissioni annuali',
    updated: 'Aggiornato',
    noStaking: '✅ Nessuno',
    hasStaking: '⚠️ Sì',
    ctaTitle: 'Non sai quale carta scegliere?',
    ctaText: 'Il nostro comparatore analizza il tuo profilo e le tue spese per raccomandarti la carta più redditizia.',
    ctaCompare: 'Confronta tutte le carte',
    ctaFind: 'Trova la mia carta ideale',
    breadcrumbHome: 'Home',
    breadcrumbReviews: 'Recensioni carte crypto',
    seoTitle: 'Recensioni Carte Crypto 2026 — Confronto & Test Completi | TopCryptoCards',
    seoDesc: 'Recensioni dettagliate e obiettive delle migliori carte crypto: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase e altro.',
    bestChoice: '⭐ Migliore scelta',
  },
};

// ─────────────────────────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block w-4 h-4">
            <Star className="w-4 h-4 text-slate-700 absolute inset-0" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

const RATING_COLOR = (r: number) =>
  r >= 4.5 ? 'text-emerald-400' : r >= 4 ? 'text-cyan-accent' : r >= 3.5 ? 'text-amber-400' : 'text-slate-400';

// Helper: does keyStats.stakingRequis suggest "none"?
function hasNoStaking(val: string): boolean {
  return /^(aucun|none|nessuno|ninguno|keines)/i.test(val.trim());
}

export default function ReviewList() {
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const lbl = LABELS[lang] || LABELS.fr;
  const reviewRouteSlug = REVIEW_SLUGS[lang] || 'avis';

  useSeoMeta({
    title: lbl.seoTitle,
    description: lbl.seoDesc,
  });

  const sorted = [...CARD_REVIEWS].sort((a, b) => b.globalRating - a.globalRating);

  // Localise each review's displayed content
  const localised = sorted.map((review) => {
    const i18n = getReviewI18n(review.slug, lang);
    return i18n
      ? { ...review, badge: i18n.badge ?? review.badge, pros: i18n.pros, verdict: i18n.verdict, keyStats: i18n.keyStats }
      : review;
  });

  // JSON-LD ItemList (language-aware)
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lbl.breadcrumbReviews,
    url: `https://topcryptocards.eu/${lang}/${reviewRouteSlug}`,
    numberOfItems: CARD_REVIEWS.length,
    itemListElement: localised.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://topcryptocards.eu/${lang}/${reviewRouteSlug}/${r.slug}`,
      name: r.cardName,
    })),
  };

  // Locale string for date formatting
  const dateLocale: Record<string, string> = { fr: 'fr-FR', en: 'en-GB', de: 'de-DE', es: 'es-ES', it: 'it-IT' };
  const locale = dateLocale[lang] || 'fr-FR';

  return (
    <div className="container-app py-12 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <Breadcrumb items={[
        { label: lbl.breadcrumbHome, href: `/${lang}` },
        { label: lbl.breadcrumbReviews },
      ]} />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Star className="w-4 h-4" fill="currentColor" />
          {lbl.badge}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          {lbl.title}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {lbl.subtitle}
        </p>
      </div>

      {/* Top pick banner */}
      {localised[0] && (
        <div className="card-surface border-cyan-accent/40 bg-cyan-accent/5 p-6 mb-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <TrendingUp className="w-5 h-5 text-cyan-accent" />
            <span className="text-cyan-accent font-bold text-sm uppercase tracking-wide">{lbl.topPick}</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{localised[0].cardName}</p>
            <p className="text-slate-400 text-sm mt-0.5">{localised[0].verdict.slice(0, 120)}…</p>
          </div>
          <Link
            to={`/${lang}/${reviewRouteSlug}/${localised[0].slug}`}
            className="btn-primary shrink-0 text-sm"
          >
            {lbl.readReview}
          </Link>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {localised.map((review, index) => (
          <Link
            key={review.slug}
            to={`/${lang}/${reviewRouteSlug}/${review.slug}`}
            className="card-surface flex flex-col overflow-hidden group hover:border-cyan-accent/50 hover:shadow-lg hover:shadow-cyan-accent/10 transition-all duration-300"
          >
            {/* Card header */}
            <div className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-bg-border">
              <div>
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 px-2 py-0.5 rounded-full mb-2">
                    {lbl.bestChoice}
                  </span>
                )}
                {review.badge && index > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-bg-elevated border border-bg-border px-2 py-0.5 rounded-full mb-2">
                    {review.badge}
                  </span>
                )}
                <h2 className="font-display font-bold text-white group-hover:text-cyan-accent transition-colors text-lg leading-tight">
                  {review.cardName}
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">{review.issuer} · {review.network}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className={`text-2xl font-display font-bold ${RATING_COLOR(review.globalRating)}`}>
                  {review.globalRating.toFixed(1)}
                </div>
                <StarRating value={review.globalRating} />
              </div>
            </div>

            {/* Key stats */}
            <div className="p-5 flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{lbl.cashback}</span>
                <span className="font-semibold text-white">{review.keyStats.cashbackMax}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{lbl.staking}</span>
                <span className="font-semibold text-white">
                  {hasNoStaking(review.keyStats.stakingRequis) ? lbl.noStaking : lbl.hasStaking}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{lbl.fees}</span>
                <span className="font-semibold text-white">{review.keyStats.fraisAnnuels}</span>
              </div>
            </div>

            {/* Top pros */}
            <div className="px-5 pb-4">
              <div className="space-y-1">
                {review.pros.slice(0, 2).map((pro, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{pro}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-bg-border flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {lbl.updated} {new Date(review.updatedAt).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
              </span>
              <span className="text-cyan-accent text-sm font-semibold group-hover:translate-x-0.5 transition-transform">
                {lbl.readReview} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 text-center card-surface p-8 border-cyan-accent/20">
        <h2 className="text-2xl font-display font-bold text-white mb-3">
          {lbl.ctaTitle}
        </h2>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
          {lbl.ctaText}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={getRoute('compare')} className="btn-primary inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {lbl.ctaCompare}
          </Link>
          <Link to={getRoute('recommendation')} className="btn-secondary inline-flex items-center gap-2">
            {lbl.ctaFind}
          </Link>
        </div>
      </div>
    </div>
  );
}
