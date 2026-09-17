import { MARKET_INFO } from '../config/marketInfo';
import type { Language } from '../i18n/types';

interface MarketInsightProps {
  lang: Language;
  /** Nom de la carte (fiches / avis) → paragraphe d'intro riche. Absent → bloc de faits seul. */
  subject?: string;
}

/**
 * Bloc d'information spécifique au marché (régulateur, devise, fiscalité crypto locale).
 * Rend un contenu DIFFÉRENT par marché → casse la duplication be↔fr / at↔de et
 * renforce la pertinence locale (hreflang). Rendu côté serveur via le prerender.
 */
export default function MarketInsight({ lang, subject }: MarketInsightProps) {
  const info = MARKET_INFO[lang];
  if (!info) return null;

  return (
    <section aria-labelledby="market-insight-heading" className="card-surface p-6">
      <h2
        id="market-insight-heading"
        className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4"
      >
        {info.heading}
      </h2>

      {subject && <p className="text-slate-300 leading-relaxed mb-4">{info.intro(subject)}</p>}

      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-500">{info.labels.regulator}</dt>
          <dd className="text-slate-200 font-medium">{info.regulator}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-500">{info.labels.currency}</dt>
          <dd className="text-slate-200 font-medium">{info.currency}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-500">{info.labels.tax}</dt>
          <dd className="text-slate-300 text-sm leading-snug">{info.tax}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-slate-500">{info.disclaimer}</p>
    </section>
  );
}
