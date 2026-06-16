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

export default function ReviewList() {
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();

  useSeoMeta({
    title: 'Avis Cartes Crypto 2026 — Comparatif & Tests Complets | TopCryptoCards',
    description: 'Avis détaillés et objectifs sur les meilleures cartes crypto : Crypto.com, Binance, Bybit, OKX, Nexo, Coinbase et plus. Notes, cashback, frais et verdicts.',
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
    name: 'Avis cartes crypto 2026',
    description: 'Comparatif complet des meilleures cartes crypto avec notes et verdicts',
    url: `https://topcryptocards.eu/${lang}/avis`,
    numberOfItems: CARD_REVIEWS.length,
    itemListElement: CARD_REVIEWS
      .sort((a, b) => b.globalRating - a.globalRating)
      .map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://topcryptocards.eu/${lang}/avis/${r.slug}`,
        name: r.cardName,
      })),
  };

  const sorted = [...CARD_REVIEWS].sort((a, b) => b.globalRating - a.globalRating);

  return (
    <div className="container-app py-12 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <Breadcrumb items={[
        { label: { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' }[lang] || 'Accueil', href: `/${lang}` },
        { label: 'Avis cartes crypto' },
      ]} />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Star className="w-4 h-4" fill="currentColor" />
          Avis & Tests 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Avis sur les Cartes Crypto
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Tests complets et objectifs des meilleures cartes crypto du marché. Cashback, frais, sécurité et expérience utilisateur passés au crible.
        </p>
      </div>

      {/* Top pick banner */}
      {sorted[0] && (
        <div className="card-surface border-cyan-accent/40 bg-cyan-accent/5 p-6 mb-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <TrendingUp className="w-5 h-5 text-cyan-accent" />
            <span className="text-cyan-accent font-bold text-sm uppercase tracking-wide">Notre meilleur choix</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{sorted[0].cardName}</p>
            <p className="text-slate-400 text-sm mt-0.5">{sorted[0].verdict.slice(0, 120)}…</p>
          </div>
          <Link
            to={`/${lang}/avis/${sorted[0].slug}`}
            className="btn-primary shrink-0 text-sm"
          >
            Lire l'avis
          </Link>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sorted.map((review, index) => (
          <Link
            key={review.slug}
            to={`/${lang}/avis/${review.slug}`}
            className="card-surface flex flex-col overflow-hidden group hover:border-cyan-accent/50 hover:shadow-lg hover:shadow-cyan-accent/10 transition-all duration-300"
          >
            {/* Card header */}
            <div className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-bg-border">
              <div>
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 px-2 py-0.5 rounded-full mb-2">
                    ⭐ Meilleur choix
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
                <span className="text-slate-400">Cashback max</span>
                <span className="font-semibold text-white">{review.keyStats.cashbackMax.replace('Jusqu\'à ', '').replace('0 €', 'Gratuit')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Staking requis</span>
                <span className="font-semibold text-white">{review.keyStats.stakingRequis.includes('Aucun') ? '✅ Aucun' : '⚠️ Oui'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Frais annuels</span>
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
                Mis à jour {new Date(review.updatedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <span className="text-cyan-accent text-sm font-semibold group-hover:translate-x-0.5 transition-transform">
                Lire l'avis →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 text-center card-surface p-8 border-cyan-accent/20">
        <h2 className="text-2xl font-display font-bold text-white mb-3">
          Vous ne savez pas quelle carte choisir ?
        </h2>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
          Notre comparateur analyse votre profil et vos dépenses pour vous recommander la carte la plus rentable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={getRoute('compare')} className="btn-primary inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Comparer toutes les cartes
          </Link>
          <Link to={getRoute('recommendation')} className="btn-secondary inline-flex items-center gap-2">
            Trouver ma carte idéale
          </Link>
        </div>
      </div>
    </div>
  );
}
