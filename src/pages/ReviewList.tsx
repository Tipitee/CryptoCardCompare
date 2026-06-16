import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, CheckCircle, TrendingUp } from 'lucide-react';
import { CARD_REVIEWS } from '../data/cardReviews';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';

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

const REVIEW_SEG: Record<string, string> = {
  fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews',
};

const YEAR = new Date().getFullYear();

const COPY: Record<string, {
  seoTitle: string; seoDesc: string; breadcrumb: string; badge: string;
  h1: string; subtitle: string; topPick: string; readReview: string;
  bestBadge: string; cashbackLabel: string; stakingLabel: string; feesLabel: string;
  noStaking: string; yesStaking: string; updatedPrefix: string; dateLocale: string;
  ctaH2: string; ctaP: string; compareBtn: string; recommendBtn: string;
}> = {
  fr: {
    seoTitle: `Avis Cartes Crypto ${YEAR} — Comparatif & Tests Complets | TopCryptoCards`,
    seoDesc: `Avis détaillés et objectifs sur les meilleures cartes crypto : Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase et plus. Notes, cashback, frais et verdicts.`,
    breadcrumb: 'Avis cartes crypto', badge: `Avis & Tests ${YEAR}`,
    h1: 'Avis sur les Cartes Crypto',
    subtitle: 'Tests complets et objectifs des meilleures cartes crypto du marché. Cashback, frais, sécurité et expérience utilisateur passés au crible.',
    topPick: 'Notre meilleur choix', readReview: "Lire l'avis", bestBadge: '⭐ Meilleur choix',
    cashbackLabel: 'Cashback max', stakingLabel: 'Staking requis', feesLabel: 'Frais annuels',
    noStaking: '✅ Aucun', yesStaking: '⚠️ Oui', updatedPrefix: 'Mis à jour', dateLocale: 'fr-FR',
    ctaH2: 'Vous ne savez pas quelle carte choisir ?',
    ctaP: 'Notre comparateur analyse votre profil et vos dépenses pour vous recommander la carte la plus rentable.',
    compareBtn: 'Comparer toutes les cartes', recommendBtn: 'Trouver ma carte idéale',
  },
  de: {
    seoTitle: `Krypto-Karten Bewertungen ${YEAR} — Vollständiger Vergleich & Tests | TopCryptoCards`,
    seoDesc: `Detaillierte und objektive Bewertungen der besten Krypto-Karten: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase und mehr. Noten, Cashback, Gebühren und Urteile.`,
    breadcrumb: 'Krypto-Karten Bewertungen', badge: `Bewertungen & Tests ${YEAR}`,
    h1: 'Krypto-Karten Bewertungen',
    subtitle: 'Vollständige und objektive Tests der besten Krypto-Karten. Cashback, Gebühren, Sicherheit und Nutzererfahrung unter der Lupe.',
    topPick: 'Unsere Top-Wahl', readReview: 'Bewertung lesen', bestBadge: '⭐ Top-Wahl',
    cashbackLabel: 'Max. Cashback', stakingLabel: 'Staking erforderlich', feesLabel: 'Jahresgebühr',
    noStaking: '✅ Keines', yesStaking: '⚠️ Ja', updatedPrefix: 'Aktualisiert', dateLocale: 'de-DE',
    ctaH2: 'Unsicher, welche Karte die richtige ist?',
    ctaP: 'Unser Vergleichstool analysiert Ihr Profil und Ihre Ausgaben, um die rentabelste Karte zu empfehlen.',
    compareBtn: 'Alle Karten vergleichen', recommendBtn: 'Meine ideale Karte finden',
  },
  es: {
    seoTitle: `Opiniones Tarjetas Crypto ${YEAR} — Comparativa & Tests Completos | TopCryptoCards`,
    seoDesc: `Opiniones detalladas y objetivas sobre las mejores tarjetas crypto: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase y más. Notas, cashback, comisiones y veredictos.`,
    breadcrumb: 'Opiniones tarjetas crypto', badge: `Opiniones & Tests ${YEAR}`,
    h1: 'Opiniones sobre Tarjetas Crypto',
    subtitle: 'Tests completos y objetivos de las mejores tarjetas crypto del mercado. Cashback, comisiones, seguridad y experiencia de usuario analizados.',
    topPick: 'Nuestra mejor elección', readReview: 'Leer opinión', bestBadge: '⭐ Mejor elección',
    cashbackLabel: 'Cashback máx.', stakingLabel: 'Staking requerido', feesLabel: 'Cuota anual',
    noStaking: '✅ Ninguno', yesStaking: '⚠️ Sí', updatedPrefix: 'Actualizado', dateLocale: 'es-ES',
    ctaH2: '¿No sabes qué tarjeta elegir?',
    ctaP: 'Nuestro comparador analiza tu perfil y tus gastos para recomendarte la tarjeta más rentable.',
    compareBtn: 'Comparar todas las tarjetas', recommendBtn: 'Encontrar mi tarjeta ideal',
  },
  it: {
    seoTitle: `Recensioni Carte Crypto ${YEAR} — Comparativa & Test Completi | TopCryptoCards`,
    seoDesc: `Recensioni dettagliate e obiettive sulle migliori carte crypto: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase e altro. Voti, cashback, commissioni e verdetti.`,
    breadcrumb: 'Recensioni carte crypto', badge: `Recensioni & Test ${YEAR}`,
    h1: 'Recensioni delle Carte Crypto',
    subtitle: 'Test completi e obiettivi delle migliori carte crypto del mercato. Cashback, commissioni, sicurezza ed esperienza utente esaminati.',
    topPick: 'La nostra scelta migliore', readReview: 'Leggi la recensione', bestBadge: '⭐ Scelta migliore',
    cashbackLabel: 'Cashback max', stakingLabel: 'Staking richiesto', feesLabel: 'Costi annuali',
    noStaking: '✅ Nessuno', yesStaking: '⚠️ Sì', updatedPrefix: 'Aggiornato', dateLocale: 'it-IT',
    ctaH2: 'Non sai quale carta scegliere?',
    ctaP: 'Il nostro comparatore analizza il tuo profilo e le tue spese per raccomandarti la carta più redditizia.',
    compareBtn: 'Confronta tutte le carte', recommendBtn: 'Trova la mia carta ideale',
  },
  en: {
    seoTitle: `Crypto Card Reviews ${YEAR} — Full Comparison & Tests | TopCryptoCards`,
    seoDesc: `Detailed and objective reviews of the best crypto cards: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase and more. Ratings, cashback, fees and verdicts.`,
    breadcrumb: 'Crypto card reviews', badge: `Reviews & Tests ${YEAR}`,
    h1: 'Crypto Card Reviews',
    subtitle: 'Complete and objective tests of the best crypto cards on the market. Cashback, fees, security and user experience examined in depth.',
    topPick: 'Our top pick', readReview: 'Read review', bestBadge: '⭐ Top pick',
    cashbackLabel: 'Max cashback', stakingLabel: 'Staking required', feesLabel: 'Annual fees',
    noStaking: '✅ None', yesStaking: '⚠️ Yes', updatedPrefix: 'Updated', dateLocale: 'en-GB',
    ctaH2: "Not sure which card to choose?",
    ctaP: 'Our comparison tool analyses your profile and spending habits to recommend the most profitable card.',
    compareBtn: 'Compare all cards', recommendBtn: 'Find my ideal card',
  },
};

export default function ReviewList() {
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const c = COPY[lang as keyof typeof COPY] ?? COPY.fr;
  const seg = REVIEW_SEG[lang] ?? 'avis';

  useSeoMeta({
    title: c.seoTitle,
    description: c.seoDesc,
  });

  // ── Hreflang alternate tags ───────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const REVIEW_SEGS: Record<string, string> = {
      fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews',
    };
    document.querySelectorAll('link[data-hreflang-reviewlist]').forEach((el) => el.remove());

    Object.entries(REVIEW_SEGS).forEach(([l, seg]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l;
      link.href = `${BASE}/${l}/${seg}`;
      link.setAttribute('data-hreflang-reviewlist', 'true');
      document.head.appendChild(link);
    });

    const xd = document.createElement('link');
    xd.rel = 'alternate';
    xd.hreflang = 'x-default';
    xd.href = `${BASE}/fr/avis`;
    xd.setAttribute('data-hreflang-reviewlist', 'true');
    document.head.appendChild(xd);

    return () => {
      document.querySelectorAll('link[data-hreflang-reviewlist]').forEach((el) => el.remove());
    };
  }, []);

  // JSON-LD ItemList
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.h1,
    description: c.seoDesc,
    url: `https://topcryptocards.eu/${lang}/${seg}`,
    numberOfItems: CARD_REVIEWS.length,
    itemListElement: CARD_REVIEWS
      .sort((a, b) => b.globalRating - a.globalRating)
      .map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://topcryptocards.eu/${lang}/${seg}/${r.slug}`,
        name: r.cardName,
      })),
  };

  const sorted = [...CARD_REVIEWS].sort((a, b) => b.globalRating - a.globalRating);

  return (
    <div className="container-app py-12 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <Breadcrumb items={[
        { label: { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' }[lang] || 'Accueil', href: `/${lang}` },
        { label: c.breadcrumb },
      ]} />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Star className="w-4 h-4" fill="currentColor" />
          {c.badge}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          {c.h1}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {c.subtitle}
        </p>
      </div>

      {/* Top pick banner */}
      {sorted[0] && (
        <div className="card-surface border-cyan-accent/40 bg-cyan-accent/5 p-6 mb-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <TrendingUp className="w-5 h-5 text-cyan-accent" />
            <span className="text-cyan-accent font-bold text-sm uppercase tracking-wide">{c.topPick}</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{sorted[0].cardName}</p>
            <p className="text-slate-400 text-sm mt-0.5">{sorted[0].verdict.slice(0, 120)}…</p>
          </div>
          <Link
            to={`/${lang}/${seg}/${sorted[0].slug}`}
            className="btn-primary shrink-0 text-sm"
          >
            {c.readReview}
          </Link>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sorted.map((review, index) => (
          <Link
            key={review.slug}
            to={`/${lang}/${seg}/${review.slug}`}
            className="card-surface flex flex-col overflow-hidden group hover:border-cyan-accent/50 hover:shadow-lg hover:shadow-cyan-accent/10 transition-all duration-300"
          >
            {/* Card header */}
            <div className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-bg-border">
              <div>
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 px-2 py-0.5 rounded-full mb-2">
                    {c.bestBadge}
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
                <span className="text-slate-400">{c.cashbackLabel}</span>
                <span className="font-semibold text-white">{review.keyStats.cashbackMax.replace("Jusqu'à ", '').replace('0 €', 'Gratuit')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{c.stakingLabel}</span>
                <span className="font-semibold text-white">{review.keyStats.stakingRequis.includes('Aucun') ? c.noStaking : c.yesStaking}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{c.feesLabel}</span>
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
                {c.updatedPrefix} {new Date(review.updatedAt).toLocaleDateString(c.dateLocale, { month: 'long', year: 'numeric' })}
              </span>
              <span className="text-cyan-accent text-sm font-semibold group-hover:translate-x-0.5 transition-transform">
                {c.readReview} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 text-center card-surface p-8 border-cyan-accent/20">
        <h2 className="text-2xl font-display font-bold text-white mb-3">
          {c.ctaH2}
        </h2>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
          {c.ctaP}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={getRoute('compare')} className="btn-primary inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {c.compareBtn}
          </Link>
          <Link to={getRoute('recommendation')} className="btn-secondary inline-flex items-center gap-2">
            {c.recommendBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
