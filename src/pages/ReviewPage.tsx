import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, XCircle, Star, ExternalLink, Shield, Zap, CreditCard, HeadphonesIcon, DollarSign } from 'lucide-react';
import { getReviewBySlug, getRelatedReviews } from '../data/cardReviews';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { getAffiliateLink } from '../utils/affiliateLink';

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block w-5 h-5">
            <Star className="w-5 h-5 text-slate-700 absolute inset-0" fill="currentColor" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
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
  const { t } = useTranslation('blog');
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();

  const review = slug ? getReviewBySlug(slug) : undefined;
  const related = slug ? getRelatedReviews(slug, 3) : [];

  // Hooks always at top level
  useSeoMeta({
    title: review?.metaTitle || 'Avis carte crypto | TopCryptoCards',
    description: review?.metaDescription || '',
    type: 'article',
  });

  if (!review) {
    return (
      <div className="container-app py-24 text-center">
        <CreditCard className="w-14 h-14 text-slate-600 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">Avis introuvable</h1>
        <p className="text-slate-500 mb-8">Cet avis n'existe pas ou a été déplacé.</p>
        <Link to={`/${lang}/avis`} className="btn-primary">
          Voir tous les avis
        </Link>
      </div>
    );
  }

  const avgBreakdown = Object.values(review.ratingBreakdown).reduce((a, b) => a + b, 0) / Object.values(review.ratingBreakdown).length;

  // Review JSON-LD schema
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
      category: 'Carte bancaire crypto',
    },
    datePublished: review.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: 'TopCryptoCards',
      url: 'https://topcryptocards.eu',
    },
  };

  const breakdownItems = [
    { key: 'cashback', label: 'Cashback', icon: DollarSign },
    { key: 'frais', label: 'Frais', icon: CreditCard },
    { key: 'facilite', label: 'Facilité d\'usage', icon: Zap },
    { key: 'securite', label: 'Sécurité', icon: Shield },
    { key: 'support', label: 'Support', icon: HeadphonesIcon },
  ] as const;

  return (
    <div className="animate-fade-in">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-bg-elevated via-bg-card to-bg border-b border-bg-border">
        <div className="container-app py-10">
          <Breadcrumb items={[
            { label: { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' }[lang] || 'Accueil', href: `/${lang}` },
            { label: 'Avis cartes crypto', href: `/${lang}/avis` },
            { label: review.cardName },
          ]} />

          <Link to={`/${lang}/avis`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Tous les avis
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              {review.badge && (
                <span className="inline-flex items-center gap-1.5 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {review.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {review.cardName} — Avis {new Date(review.updatedAt).getFullYear()}
              </h1>
              <p className="text-slate-400 text-sm mb-4">
                Mis à jour le {new Date(review.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · Réseau {review.network}
              </p>

              {/* Global rating */}
              <div className="flex items-center gap-4">
                <div className="text-5xl font-display font-bold text-white">
                  {review.globalRating.toFixed(1)}
                </div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-1">Note globale / 5</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card-surface p-6 w-full md:w-72 shrink-0">
              <p className="text-white font-semibold mb-1">{review.cardName}</p>
              <p className="text-slate-400 text-sm mb-4">Émetteur : {review.issuer}</p>
              <a
                href={getAffiliateLink(review)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary w-full justify-center flex items-center gap-2 mb-3"
              >
                Obtenir la carte
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link to={getRoute('compare')} className="btn-secondary w-full justify-center flex text-sm">
                Comparer les cartes
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
              {Object.entries(review.keyStats).map(([key, val]) => {
                const labels: Record<string, string> = {
                  cashbackMax: '💰 Cashback max',
                  stakingRequis: '🔒 Staking requis',
                  fraisAnnuels: '💳 Frais annuels',
                  disponibilite: '🌍 Disponibilité',
                };
                return (
                  <div key={key} className="card-surface p-4">
                    <p className="text-xs text-slate-500 mb-1">{labels[key]}</p>
                    <p className="text-sm font-semibold text-white">{val}</p>
                  </div>
                );
              })}
            </div>

            {/* Rating breakdown */}
            <div className="card-surface p-6">
              <h2 className="text-lg font-display font-bold text-white mb-5">Détail de la note</h2>
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
                <span className="text-slate-400 font-medium">Note moyenne</span>
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
                  <CheckCircle className="w-5 h-5" /> Points forts
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
                  <XCircle className="w-5 h-5" /> Points faibles
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

            {/* Sections */}
            {([
              { key: 'presentation', title: '📋 Présentation' },
              { key: 'cashback', title: '💰 Cashback & Récompenses' },
              { key: 'frais', title: '💳 Frais & Conditions' },
              { key: 'securite', title: '🔒 Sécurité & Régulation' },
              { key: 'experience', title: '📱 Expérience utilisateur' },
            ] as const).map(({ key, title }) => (
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
                Notre verdict
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl font-display font-bold text-cyan-accent">{review.globalRating.toFixed(1)}</div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-0.5">sur 5</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{review.verdict}</p>
              <a
                href={getAffiliateLink(review)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary inline-flex items-center gap-2 mt-5"
              >
                Obtenir la {review.cardName}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Quick recap */}
              <div className="card-surface p-5">
                <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Récapitulatif</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Note globale</span>
                    <span className="font-bold text-white">{review.globalRating}/5</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Réseau</span>
                    <span className="font-semibold text-white">{review.network}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Cashback max</span>
                    <span className="font-semibold text-white">{review.keyStats.cashbackMax.split(' ').slice(0, 3).join(' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Frais annuels</span>
                    <span className="font-semibold text-white">{review.keyStats.fraisAnnuels}</span>
                  </div>
                </div>
                <a
                  href={getAffiliateLink(review)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="btn-primary w-full justify-center flex items-center gap-2 mt-5 text-sm"
                >
                  Obtenir la carte
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Related reviews */}
              {related.length > 0 && (
                <div className="card-surface p-5">
                  <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Autres avis</h3>
                  <div className="space-y-3">
                    {related.map(rel => (
                      <Link
                        key={rel.slug}
                        to={`/${lang}/avis/${rel.slug}`}
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
                  <Link to={`/${lang}/avis`} className="text-cyan-accent text-xs font-medium mt-4 block hover:underline">
                    Voir tous les avis →
                  </Link>
                </div>
              )}

              {/* Compare CTA */}
              <div className="card-surface p-5 border-cyan-accent/20">
                <h4 className="font-display font-bold text-white mb-2 text-sm">Comparer les cartes</h4>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">
                  Trouvez la carte qui correspond vraiment à votre profil avec notre comparateur.
                </p>
                <Link to={getRoute('compare')} className="btn-primary w-full text-sm flex justify-center">
                  Comparer maintenant
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
