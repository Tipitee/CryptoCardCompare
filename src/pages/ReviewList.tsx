import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { CARD_REVIEWS } from '../data/cardReviews';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

const YEAR = new Date().getFullYear();

const L: Record<string, {
  title: string; desc: string; badge: string; h1: string; sub: string;
  topPick: string; readReview: string; cashback: string; staking: string;
  fees: string; stakingNo: string; stakingYes: string; updatedAt: string;
  ctaH2: string; ctaSub: string; compare: string; recommend: string;
  breadcrumb: string; brandPage: string; home: string;
}> = {
  fr: {
    title: `Avis Cartes Crypto ${YEAR} — Comparatif & Tests Complets | TopCryptoCards`,
    desc: `Avis détaillés et objectifs sur les meilleures cartes crypto : Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase et plus. Notes, cashback, frais et verdicts.`,
    badge: `Avis & Tests ${YEAR}`, h1: 'Avis sur les Cartes Crypto',
    sub: 'Tests complets et objectifs des meilleures cartes crypto du marché. Cashback, frais, sécurité et expérience utilisateur passés au crible.',
    topPick: 'Notre meilleur choix', readReview: "Lire l'avis",
    cashback: 'Cashback max', staking: 'Staking requis', fees: 'Frais annuels',
    stakingNo: '✅ Aucun', stakingYes: '⚠️ Oui',
    updatedAt: 'Mis à jour',
    ctaH2: 'Vous ne savez pas quelle carte choisir ?',
    ctaSub: 'Notre comparateur analyse votre profil et vos dépenses pour vous recommander la carte la plus rentable.',
    compare: 'Comparer toutes les cartes', recommend: 'Trouver ma carte idéale',
    breadcrumb: 'Avis cartes crypto', brandPage: 'Page de la marque →', home: 'Accueil',
  },
  de: {
    title: `Krypto-Karten Bewertungen ${YEAR} — Vollständige Tests | TopCryptoCards`,
    desc: `Detaillierte und objektive Bewertungen der besten Krypto-Karten: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase und mehr.`,
    badge: `Tests & Bewertungen ${YEAR}`, h1: 'Krypto-Karten Bewertungen',
    sub: 'Vollständige und objektive Tests der besten Krypto-Karten auf dem Markt. Cashback, Gebühren, Sicherheit und Benutzererfahrung unter der Lupe.',
    topPick: 'Unsere Top-Wahl', readReview: 'Bewertung lesen',
    cashback: 'Max. Cashback', staking: 'Staking erforderlich', fees: 'Jahresgebühren',
    stakingNo: '✅ Keins', stakingYes: '⚠️ Ja',
    updatedAt: 'Aktualisiert',
    ctaH2: 'Sie wissen nicht, welche Karte Sie wählen sollen?',
    ctaSub: 'Unser Vergleichstool analysiert Ihr Profil und Ihre Ausgaben, um die rentabelste Karte zu empfehlen.',
    compare: 'Alle Karten vergleichen', recommend: 'Meine ideale Karte finden',
    breadcrumb: 'Krypto-Karten Bewertungen', brandPage: 'Markenseite →', home: 'Startseite',
  },
  es: {
    title: `Opiniones Tarjetas Crypto ${YEAR} — Comparativa & Tests | TopCryptoCards`,
    desc: `Opiniones detalladas y objetivas sobre las mejores tarjetas crypto: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase y más.`,
    badge: `Opiniones & Tests ${YEAR}`, h1: 'Opiniones sobre Tarjetas Crypto',
    sub: 'Tests completos y objetivos de las mejores tarjetas crypto del mercado. Cashback, comisiones, seguridad y experiencia de usuario analizados.',
    topPick: 'Nuestra mejor elección', readReview: 'Leer opinión',
    cashback: 'Cashback máx.', staking: 'Staking requerido', fees: 'Comisiones anuales',
    stakingNo: '✅ Ninguno', stakingYes: '⚠️ Sí',
    updatedAt: 'Actualizado',
    ctaH2: '¿No sabe qué tarjeta elegir?',
    ctaSub: 'Nuestro comparador analiza tu perfil y gastos para recomendarte la tarjeta más rentable.',
    compare: 'Comparar todas las tarjetas', recommend: 'Encontrar mi tarjeta ideal',
    breadcrumb: 'Opiniones tarjetas crypto', brandPage: 'Página de la marca →', home: 'Inicio',
  },
  it: {
    title: `Recensioni Carte Crypto ${YEAR} — Confronto & Test Completi | TopCryptoCards`,
    desc: `Recensioni dettagliate e obiettive sulle migliori carte crypto: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase e altro.`,
    badge: `Recensioni & Test ${YEAR}`, h1: 'Recensioni Carte Crypto',
    sub: 'Test completi e obiettivi delle migliori carte crypto sul mercato. Cashback, commissioni, sicurezza ed esperienza utente analizzati.',
    topPick: 'La nostra migliore scelta', readReview: 'Leggi la recensione',
    cashback: 'Cashback max.', staking: 'Staking richiesto', fees: 'Commissioni annuali',
    stakingNo: '✅ Nessuno', stakingYes: '⚠️ Sì',
    updatedAt: 'Aggiornato',
    ctaH2: 'Non sai quale carta scegliere?',
    ctaSub: 'Il nostro comparatore analizza il tuo profilo e le tue spese per consigliarti la carta più redditizia.',
    compare: 'Confronta tutte le carte', recommend: 'Trova la mia carta ideale',
    breadcrumb: 'Recensioni carte crypto', brandPage: 'Pagina del marchio →', home: 'Home',
  },
  en: {
    title: `Crypto Card Reviews ${YEAR} — Full Comparison & Tests | TopCryptoCards`,
    desc: `Detailed and objective reviews of the best crypto cards: Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase and more.`,
    badge: `Reviews & Tests ${YEAR}`, h1: 'Crypto Card Reviews',
    sub: 'Complete and objective tests of the best crypto cards on the market. Cashback, fees, security and user experience scrutinized.',
    topPick: 'Our top pick', readReview: 'Read review',
    cashback: 'Max cashback', staking: 'Staking required', fees: 'Annual fees',
    stakingNo: '✅ None', stakingYes: '⚠️ Yes',
    updatedAt: 'Updated',
    ctaH2: "Don't know which card to choose?",
    ctaSub: 'Our comparison tool analyzes your profile and spending to recommend the most profitable card.',
    compare: 'Compare all cards', recommend: 'Find my ideal card',
    breadcrumb: 'Crypto card reviews', brandPage: 'Brand page →', home: 'Home',
  },
};

// Map review issuer → brand ID (for BrandPage links)
const ISSUER_TO_BRAND: Record<string, string> = {
  'Crypto.com': 'crypto-com', 'Binance': 'binance', 'Bybit': 'bybit',
  'OKX': 'okx', 'Coinbase': 'coinbase', 'Nexo': 'nexo', 'Bitpanda': 'bitpanda',
  'Wirex': 'wirex', 'Ledger (Baanx)': 'ledger', 'Revolut': 'revolut',
  'Bleap': 'bleap', 'Plutus': 'plutus', 'Gnosis': 'gnosis', 'Trade Republic': 'trade-republic',
};

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

export default function ReviewList() {
  const lang = useLanguage();
  const l = L[lang] ?? L.en;
  const { getRoute } = useLocalizedRoute();
  const reviewSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.reviews ?? 'reviews';
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';

  useSeoMeta({ title: l.title, description: l.desc, lang });

  // ── Hreflang ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    document.querySelectorAll('link[data-hreflang-reviewlist]').forEach(el => el.remove());
    const segs: Record<string, string> = { fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews' };
    Object.entries(segs).forEach(([l, seg]) => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/${seg}`);
      el.setAttribute('data-hreflang-reviewlist', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate'; xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/avis`);
    xd.setAttribute('data-hreflang-reviewlist', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-reviewlist]').forEach(el => el.remove()); };
  }, []);

  const sorted = [...CARD_REVIEWS].sort((a, b) => b.globalRating - a.globalRating);

  // Schema.org ItemList
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: l.h1,
    description: l.sub,
    url: `https://topcryptocards.eu/${lang}/${reviewSlug}`,
    numberOfItems: CARD_REVIEWS.length,
    itemListElement: sorted.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://topcryptocards.eu/${lang}/${reviewSlug}/${r.slug}`,
      name: r.cardName,
    })),
  };

  return (
    <div className="container-app py-12 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <Breadcrumb items={[
        { label: l.home, href: `/${lang}` },
        { label: l.breadcrumb },
      ]} />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Star className="w-4 h-4" fill="currentColor" />
          {l.badge}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          {l.h1}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {l.sub}
        </p>
      </div>

      {/* Top pick banner */}
      {sorted[0] && (
        <div className="card-surface border-cyan-accent/40 bg-cyan-accent/5 p-6 mb-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <TrendingUp className="w-5 h-5 text-cyan-accent" />
            <span className="text-cyan-accent font-bold text-sm uppercase tracking-wide">{l.topPick}</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{sorted[0].cardName}</p>
            <p className="text-slate-400 text-sm mt-0.5">{sorted[0].verdict.slice(0, 120)}…</p>
          </div>
          <Link
            to={`/${lang}/${reviewSlug}/${sorted[0].slug}`}
            className="btn-primary shrink-0 text-sm"
          >
            {l.readReview}
          </Link>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sorted.map((review, index) => {
          const brandId = ISSUER_TO_BRAND[review.issuer];
          return (
            <div key={review.slug} className="flex flex-col">
              <Link
                to={`/${lang}/${reviewSlug}/${review.slug}`}
                className="card-surface flex flex-col overflow-hidden group hover:border-cyan-accent/50 hover:shadow-lg hover:shadow-cyan-accent/10 transition-all duration-300 flex-1"
              >
                {/* Card header */}
                <div className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-bg-border">
                  <div>
                    {index === 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 px-2 py-0.5 rounded-full mb-2">
                        ⭐ {l.topPick}
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
                    <span className="text-slate-400">{l.cashback}</span>
                    <span className="font-semibold text-white">{review.keyStats.cashbackMax.replace('Jusqu\'à ', '').replace('0 €', 'Gratuit')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{l.staking}</span>
                    <span className="font-semibold text-white">{review.keyStats.stakingRequis.includes('Aucun') ? l.stakingNo : l.stakingYes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{l.fees}</span>
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
                    {l.updatedAt} {new Date(review.updatedAt).toLocaleDateString(
                      lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : 'en-GB',
                      { month: 'long', year: 'numeric' }
                    )}
                  </span>
                  <span className="text-cyan-accent text-sm font-semibold group-hover:translate-x-0.5 transition-transform">
                    {l.readReview} →
                  </span>
                </div>
              </Link>

              {/* Brand page link — outside the main <Link> to avoid nested anchors */}
              {brandId && (
                <Link
                  to={`/${lang}/${brandsSlug}/${brandId}`}
                  className="mt-1.5 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-cyan-accent transition-colors py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronRight className="w-3 h-3" />
                  {l.brandPage}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 text-center card-surface p-8 border-cyan-accent/20">
        <h2 className="text-2xl font-display font-bold text-white mb-3">
          {l.ctaH2}
        </h2>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
          {l.ctaSub}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={getRoute('compare')} className="btn-primary inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {l.compare}
          </Link>
          <Link to={getRoute('recommendation')} className="btn-secondary inline-flex items-center gap-2">
            {l.recommend}
          </Link>
        </div>
      </div>
    </div>
  );
}
