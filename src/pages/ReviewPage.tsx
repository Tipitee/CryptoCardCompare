import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, XCircle, Star, ExternalLink, Shield, Zap, CreditCard, HeadphonesIcon, DollarSign } from 'lucide-react';
import { getReviewBySlug, getRelatedReviews } from '../data/cardReviews';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import {
  REVIEW_SLUG_TO_CARD_ID, CARD_COMPARISONS, CARD_NAMES,
  COMPARE_SEG, CARD_SEG, THEMATIC_SLUGS, THEMATIC_LABELS,
  comparisonSlug,
} from '../data/internalLinks';

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

const REVIEW_SEG: Record<string, string> = {
  fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews',
};

const COPY: Record<string, {
  breadcrumb: string; backLink: string; reviewWord: string; updatedOn: string;
  network: string; globalRating: string; outOf5: string; issuer: string;
  getCard: string; getCardNamed: (name: string) => string; compareCards: string;
  keyStatLabels: Record<string, string>; ratingDetail: string;
  breakdownLabels: { cashback: string; frais: string; facilite: string; securite: string; support: string };
  avgRating: string; pros: string; cons: string;
  sectionTitles: { presentation: string; cashback: string; frais: string; securite: string; experience: string };
  ourVerdict: string; recap: string; otherReviews: string; seeAllReviews: string;
  compareNow: string; dateLocale: string;
}> = {
  fr: {
    breadcrumb: 'Avis cartes crypto', backLink: 'Tous les avis', reviewWord: 'Avis',
    updatedOn: 'Mis à jour le', network: 'Réseau', globalRating: 'Note globale', outOf5: 'sur 5',
    issuer: 'Émetteur', getCard: 'Obtenir la carte', getCardNamed: (n) => `Obtenir la ${n}`,
    compareCards: 'Comparer les cartes',
    keyStatLabels: { cashbackMax: '💰 Cashback max', stakingRequis: '🔒 Staking requis', fraisAnnuels: '💳 Frais annuels', disponibilite: '🌍 Disponibilité' },
    ratingDetail: 'Détail de la note',
    breakdownLabels: { cashback: 'Cashback', frais: 'Frais', facilite: "Facilité d'usage", securite: 'Sécurité', support: 'Support' },
    avgRating: 'Note moyenne', pros: 'Points forts', cons: 'Points faibles',
    sectionTitles: { presentation: '📋 Présentation', cashback: '💰 Cashback & Récompenses', frais: '💳 Frais & Conditions', securite: '🔒 Sécurité & Régulation', experience: '📱 Expérience utilisateur' },
    ourVerdict: 'Notre verdict', recap: 'Récapitulatif', otherReviews: 'Autres avis',
    seeAllReviews: 'Voir tous les avis →', compareNow: 'Comparer maintenant', dateLocale: 'fr-FR',
  },
  de: {
    breadcrumb: 'Krypto-Karten Bewertungen', backLink: 'Alle Bewertungen', reviewWord: 'Bewertung',
    updatedOn: 'Aktualisiert am', network: 'Netzwerk', globalRating: 'Gesamtnote', outOf5: 'von 5',
    issuer: 'Anbieter', getCard: 'Karte erhalten', getCardNamed: (n) => `${n} erhalten`,
    compareCards: 'Karten vergleichen',
    keyStatLabels: { cashbackMax: '💰 Max. Cashback', stakingRequis: '🔒 Staking erforderlich', fraisAnnuels: '💳 Jahresgebühr', disponibilite: '🌍 Verfügbarkeit' },
    ratingDetail: 'Bewertungsdetails',
    breakdownLabels: { cashback: 'Cashback', frais: 'Gebühren', facilite: 'Benutzerfreundlichkeit', securite: 'Sicherheit', support: 'Support' },
    avgRating: 'Durchschnittsnote', pros: 'Stärken', cons: 'Schwächen',
    sectionTitles: { presentation: '📋 Vorstellung', cashback: '💰 Cashback & Belohnungen', frais: '💳 Gebühren & Bedingungen', securite: '🔒 Sicherheit & Regulierung', experience: '📱 Nutzererfahrung' },
    ourVerdict: 'Unser Urteil', recap: 'Zusammenfassung', otherReviews: 'Andere Bewertungen',
    seeAllReviews: 'Alle Bewertungen anzeigen →', compareNow: 'Jetzt vergleichen', dateLocale: 'de-DE',
  },
  es: {
    breadcrumb: 'Opiniones tarjetas crypto', backLink: 'Todas las opiniones', reviewWord: 'Opinión',
    updatedOn: 'Actualizado el', network: 'Red', globalRating: 'Nota global', outOf5: 'sobre 5',
    issuer: 'Emisor', getCard: 'Obtener la tarjeta', getCardNamed: (n) => `Obtener la ${n}`,
    compareCards: 'Comparar tarjetas',
    keyStatLabels: { cashbackMax: '💰 Cashback máx.', stakingRequis: '🔒 Staking requerido', fraisAnnuels: '💳 Cuota anual', disponibilite: '🌍 Disponibilidad' },
    ratingDetail: 'Detalle de la nota',
    breakdownLabels: { cashback: 'Cashback', frais: 'Comisiones', facilite: 'Facilidad de uso', securite: 'Seguridad', support: 'Soporte' },
    avgRating: 'Nota media', pros: 'Puntos fuertes', cons: 'Puntos débiles',
    sectionTitles: { presentation: '📋 Presentación', cashback: '💰 Cashback & Recompensas', frais: '💳 Comisiones & Condiciones', securite: '🔒 Seguridad & Regulación', experience: '📱 Experiencia de usuario' },
    ourVerdict: 'Nuestro veredicto', recap: 'Resumen', otherReviews: 'Otras opiniones',
    seeAllReviews: 'Ver todas las opiniones →', compareNow: 'Comparar ahora', dateLocale: 'es-ES',
  },
  it: {
    breadcrumb: 'Recensioni carte crypto', backLink: 'Tutte le recensioni', reviewWord: 'Recensione',
    updatedOn: 'Aggiornato il', network: 'Rete', globalRating: 'Voto globale', outOf5: 'su 5',
    issuer: 'Emittente', getCard: 'Ottieni la carta', getCardNamed: (n) => `Ottieni la ${n}`,
    compareCards: 'Confronta le carte',
    keyStatLabels: { cashbackMax: '💰 Cashback max', stakingRequis: '🔒 Staking richiesto', fraisAnnuels: '💳 Costi annuali', disponibilite: '🌍 Disponibilità' },
    ratingDetail: 'Dettaglio del voto',
    breakdownLabels: { cashback: 'Cashback', frais: 'Commissioni', facilite: 'Facilità d\'uso', securite: 'Sicurezza', support: 'Supporto' },
    avgRating: 'Voto medio', pros: 'Punti di forza', cons: 'Punti deboli',
    sectionTitles: { presentation: '📋 Presentazione', cashback: '💰 Cashback & Premi', frais: '💳 Commissioni & Condizioni', securite: '🔒 Sicurezza & Regolamentazione', experience: '📱 Esperienza utente' },
    ourVerdict: 'Il nostro verdetto', recap: 'Riepilogo', otherReviews: 'Altre recensioni',
    seeAllReviews: 'Vedi tutte le recensioni →', compareNow: 'Confronta ora', dateLocale: 'it-IT',
  },
  en: {
    breadcrumb: 'Crypto card reviews', backLink: 'All reviews', reviewWord: 'Review',
    updatedOn: 'Updated on', network: 'Network', globalRating: 'Overall rating', outOf5: 'out of 5',
    issuer: 'Issuer', getCard: 'Get the card', getCardNamed: (n) => `Get the ${n}`,
    compareCards: 'Compare cards',
    keyStatLabels: { cashbackMax: '💰 Max cashback', stakingRequis: '🔒 Staking required', fraisAnnuels: '💳 Annual fees', disponibilite: '🌍 Availability' },
    ratingDetail: 'Rating breakdown',
    breakdownLabels: { cashback: 'Cashback', frais: 'Fees', facilite: 'Ease of use', securite: 'Security', support: 'Support' },
    avgRating: 'Average rating', pros: 'Strengths', cons: 'Weaknesses',
    sectionTitles: { presentation: '📋 Overview', cashback: '💰 Cashback & Rewards', frais: '💳 Fees & Conditions', securite: '🔒 Security & Regulation', experience: '📱 User experience' },
    ourVerdict: 'Our verdict', recap: 'Summary', otherReviews: 'Other reviews',
    seeAllReviews: 'See all reviews →', compareNow: 'Compare now', dateLocale: 'en-GB',
  },
};

export default function ReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('blog');
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const c = COPY[lang as keyof typeof COPY] ?? COPY.fr;
  const seg = REVIEW_SEG[lang] ?? 'avis';

  const review = slug ? getReviewBySlug(slug) : undefined;
  const related = slug ? getRelatedReviews(slug, 3) : [];

  // Hooks always at top level
  useSeoMeta({
    title: review?.metaTitle || 'Avis carte crypto | TopCryptoCards',
    description: review?.metaDescription || '',
    type: 'article',
  });

  // ── Hreflang alternate tags ───────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    const BASE = 'https://topcryptocards.eu';
    const REVIEW_SEGS: Record<string, string> = {
      fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews',
    };
    document.querySelectorAll('link[data-hreflang-review]').forEach((el) => el.remove());

    Object.entries(REVIEW_SEGS).forEach(([l, seg]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l;
      link.href = `${BASE}/${l}/${seg}/${slug}`;
      link.setAttribute('data-hreflang-review', 'true');
      document.head.appendChild(link);
    });

    const xd = document.createElement('link');
    xd.rel = 'alternate';
    xd.hreflang = 'x-default';
    xd.href = `${BASE}/fr/avis/${slug}`;
    xd.setAttribute('data-hreflang-review', 'true');
    document.head.appendChild(xd);

    return () => {
      document.querySelectorAll('link[data-hreflang-review]').forEach((el) => el.remove());
    };
  }, [slug]);

  if (!review) {
    return (
      <div className="container-app py-24 text-center">
        <CreditCard className="w-14 h-14 text-slate-600 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">{c.reviewWord} introuvable</h1>
        <p className="text-slate-500 mb-8">{c.backLink}</p>
        <Link to={`/${lang}/${seg}`} className="btn-primary">
          {c.seeAllReviews}
        </Link>
      </div>
    );
  }

  const avgBreakdown = Object.values(review.ratingBreakdown).reduce((a, b) => a + b, 0) / Object.values(review.ratingBreakdown).length;

  // ── Schema.org: Review + Product/AggregateRating (rich snippets) ───────────
  useEffect(() => {
    const pageUrl = `https://topcryptocards.eu/${lang}/avis/${slug}`;

    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Review',
          '@id': `${pageUrl}#review`,
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
            url: 'https://topcryptocards.eu',
          },
          publisher: {
            '@type': 'Organization',
            name: 'TopCryptoCards',
            url: 'https://topcryptocards.eu',
          },
          datePublished: review.updatedAt,
          dateModified: review.updatedAt,
          url: pageUrl,
          itemReviewed: { '@id': `${pageUrl}#product` },
        },
        {
          '@type': 'Product',
          '@id': `${pageUrl}#product`,
          name: review.cardName,
          brand: { '@type': 'Brand', name: review.issuer },
          category: 'Crypto debit card',
          description: review.metaDescription,
          review: { '@id': `${pageUrl}#review` },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: review.globalRating.toFixed(1),
            bestRating: '5',
            worstRating: '1',
            ratingCount: 1,
            reviewCount: 1,
          },
        },
      ],
    };

    document.getElementById('schema-review-page')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-review-page';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(graph);
    document.head.appendChild(el);

    return () => { document.getElementById('schema-review-page')?.remove(); };
  }, [review, lang, slug]);

  // BreadcrumbList schema
  useEffect(() => {
    if (!review || !slug) return;
    const BASE = 'https://topcryptocards.eu';
    const REVIEW_LABELS: Record<string, string> = {
      fr: 'Avis cartes crypto', de: 'Krypto-Karten Bewertungen',
      es: 'Opiniones tarjetas crypto', it: 'Recensioni carte crypto', en: 'Crypto card reviews',
    };
    document.getElementById('schema-breadcrumb-review')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-breadcrumb-review';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'TopCryptoCards', item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: REVIEW_LABELS[lang] ?? 'Reviews', item: `${BASE}/${lang}/${REVIEW_SEG[lang] ?? 'avis'}` },
        { '@type': 'ListItem', position: 3, name: review.cardName, item: `${BASE}/${lang}/${REVIEW_SEG[lang] ?? 'avis'}/${slug}` },
      ],
    });
    document.head.appendChild(el);
    return () => { document.getElementById('schema-breadcrumb-review')?.remove(); };
  }, [review, slug, lang]);

  const breakdownItems = [
    { key: 'cashback', label: c.breakdownLabels.cashback, icon: DollarSign },
    { key: 'frais', label: c.breakdownLabels.frais, icon: CreditCard },
    { key: 'facilite', label: c.breakdownLabels.facilite, icon: Zap },
    { key: 'securite', label: c.breakdownLabels.securite, icon: Shield },
    { key: 'support', label: c.breakdownLabels.support, icon: HeadphonesIcon },
  ] as const;

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <div className="bg-gradient-to-br from-bg-elevated via-bg-card to-bg border-b border-bg-border">
        <div className="container-app py-10">
          <Breadcrumb items={[
            { label: { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' }[lang] || 'Accueil', href: `/${lang}` },
            { label: c.breadcrumb, href: `/${lang}/${seg}` },
            { label: review.cardName },
          ]} />

          <Link to={`/${lang}/${seg}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {c.backLink}
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              {review.badge && (
                <span className="inline-flex items-center gap-1.5 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {review.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {review.cardName} — {c.reviewWord} {new Date(review.updatedAt).getFullYear()}
              </h1>
              <p className="text-slate-400 text-sm mb-4">
                {c.updatedOn} {new Date(review.updatedAt).toLocaleDateString(c.dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })} · {c.network} {review.network}
              </p>

              {/* Global rating */}
              <div className="flex items-center gap-4">
                <div className="text-5xl font-display font-bold text-white">
                  {review.globalRating.toFixed(1)}
                </div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-1">{c.globalRating} / 5</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card-surface p-6 w-full md:w-72 shrink-0">
              <p className="text-white font-semibold mb-1">{review.cardName}</p>
              <p className="text-slate-400 text-sm mb-4">{c.issuer} : {review.issuer}</p>
              <a
                href={review.affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary w-full justify-center flex items-center gap-2 mb-3"
              >
                {c.getCard}
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link to={getRoute('compare')} className="btn-secondary w-full justify-center flex text-sm">
                {c.compareCards}
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
                return (
                  <div key={key} className="card-surface p-4">
                    <p className="text-xs text-slate-500 mb-1">{c.keyStatLabels[key as keyof typeof c.keyStatLabels] ?? key}</p>
                    <p className="text-sm font-semibold text-white">{val}</p>
                  </div>
                );
              })}
            </div>

            {/* Rating breakdown */}
            <div className="card-surface p-6">
              <h2 className="text-lg font-display font-bold text-white mb-5">{c.ratingDetail}</h2>
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
                <span className="text-slate-400 font-medium">{c.avgRating}</span>
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
                  <CheckCircle className="w-5 h-5" /> {c.pros}
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
                  <XCircle className="w-5 h-5" /> {c.cons}
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
            {(['presentation', 'cashback', 'frais', 'securite', 'experience'] as const).map((key) => (
              <div key={key}>
                <h2 className="text-xl font-display font-bold text-white mb-4">{c.sectionTitles[key]}</h2>
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
                {c.ourVerdict}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl font-display font-bold text-cyan-accent">{review.globalRating.toFixed(1)}</div>
                <div>
                  <StarRating value={review.globalRating} />
                  <p className="text-slate-500 text-xs mt-0.5">{c.outOf5}</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{review.verdict}</p>
              <a
                href={review.affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-primary inline-flex items-center gap-2 mt-5"
              >
                {c.getCardNamed(review.cardName)}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Quick recap */}
              <div className="card-surface p-5">
                <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">{c.recap}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{c.globalRating}</span>
                    <span className="font-bold text-white">{review.globalRating}/5</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{c.network}</span>
                    <span className="font-semibold text-white">{review.network}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{c.keyStatLabels.cashbackMax}</span>
                    <span className="font-semibold text-white">{review.keyStats.cashbackMax.split(' ').slice(0, 3).join(' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{c.keyStatLabels.fraisAnnuels}</span>
                    <span className="font-semibold text-white">{review.keyStats.fraisAnnuels}</span>
                  </div>
                </div>
                <a
                  href={review.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="btn-primary w-full justify-center flex items-center gap-2 mt-5 text-sm"
                >
                  {c.getCard}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Related reviews */}
              {related.length > 0 && (
                <div className="card-surface p-5">
                  <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">{c.otherReviews}</h3>
                  <div className="space-y-3">
                    {related.map(rel => (
                      <Link
                        key={rel.slug}
                        to={`/${lang}/${seg}/${rel.slug}`}
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
                  <Link to={`/${lang}/${seg}`} className="text-cyan-accent text-xs font-medium mt-4 block hover:underline">
                    {c.seeAllReviews}
                  </Link>
                </div>
              )}

              {/* Compare CTA */}
              <div className="card-surface p-5 border-cyan-accent/20">
                <h4 className="font-display font-bold text-white mb-2 text-sm">{c.compareCards}</h4>
                <Link to={getRoute('compare')} className="btn-primary w-full text-sm flex justify-center">
                  {c.compareNow}
                </Link>
              </div>

              {/* ── Comparaisons directes pour cette carte ── */}
              {(() => {
                const cardId = REVIEW_SLUG_TO_CARD_ID[slug || ''];
                const partners = cardId ? CARD_COMPARISONS[cardId] : [];
                if (!partners || partners.length === 0) return null;
                return (
                  <div className="card-surface p-5">
                    <h3 className="font-display font-bold text-white mb-3 text-sm uppercase tracking-wider">
                      {lang === 'de' ? 'Direktvergleiche' :
                       lang === 'es' ? 'Comparativas directas' :
                       lang === 'it' ? 'Confronti diretti' :
                       lang === 'en' ? 'Head-to-head comparisons' :
                       'Comparatifs directs'}
                    </h3>
                    <div className="space-y-2">
                      {partners.slice(0, 5).map(partnerId => (
                        <Link
                          key={partnerId}
                          to={`/${lang}/${COMPARE_SEG[lang] || 'comparer'}/${comparisonSlug(cardId, partnerId)}`}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-bg-elevated border border-bg-border hover:border-cyan-accent/40 hover:text-cyan-accent transition-colors group text-xs"
                        >
                          <span className="text-slate-300 group-hover:text-cyan-accent transition-colors">
                            {review?.cardName || cardId} <span className="text-slate-500">vs</span> {CARD_NAMES[partnerId] || partnerId}
                          </span>
                          <span className="text-slate-600 group-hover:text-cyan-accent">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Fiche carte complète ── */}
              {(() => {
                const cardId = REVIEW_SLUG_TO_CARD_ID[slug || ''];
                if (!cardId) return null;
                const cardSeg = lang === 'de' ? 'karten' : lang === 'es' ? 'tarjetas' : lang === 'it' ? 'carte' : lang === 'en' ? 'cards' : 'cartes';
                return (
                  <div className="card-surface p-5">
                    <h3 className="font-display font-bold text-white mb-3 text-sm uppercase tracking-wider">
                      {lang === 'de' ? 'Vollständige Karte' :
                       lang === 'es' ? 'Ficha completa' :
                       lang === 'it' ? 'Scheda completa' :
                       lang === 'en' ? 'Full card details' :
                       'Fiche complète'}
                    </h3>
                    <div className="space-y-2">
                      <Link
                        to={`/${lang}/${cardSeg}/${cardId}`}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-bg-elevated border border-bg-border hover:border-cyan-accent/40 transition-colors group text-xs"
                      >
                        <span className="text-slate-300 group-hover:text-cyan-accent transition-colors">
                          {review?.cardName} — {lang === 'de' ? 'Alle Details' : lang === 'es' ? 'Todos los detalles' : lang === 'it' ? 'Tutti i dettagli' : lang === 'en' ? 'All details' : 'Tous les détails'}
                        </span>
                        <span className="text-slate-600 group-hover:text-cyan-accent">→</span>
                      </Link>
                      {(['cashback', 'no-fees', 'no-staking', 'best'] as const).map(theme => (
                        <Link
                          key={theme}
                          to={`/${lang}/${THEMATIC_SLUGS[theme]?.[lang] || THEMATIC_SLUGS[theme]?.fr}`}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-bg-elevated border border-bg-border hover:border-cyan-accent/40 transition-colors group text-xs"
                        >
                          <span className="text-slate-300 group-hover:text-cyan-accent transition-colors">
                            {THEMATIC_LABELS[theme]?.[lang] || THEMATIC_LABELS[theme]?.fr}
                          </span>
                          <span className="text-slate-600 group-hover:text-cyan-accent">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
