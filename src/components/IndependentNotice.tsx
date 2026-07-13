/**
 * IndependentNotice — small E-E-A-T trust signal shown on card-listing pages.
 * Satisfies Google's YMYL transparency requirement: site is independent and
 * may earn affiliate commissions, with a link to the full disclosure page.
 */
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const COPY: Record<string, { text: string; linkLabel: string }> = {
  fr: { text: 'Comparatif indépendant — nous pouvons percevoir des commissions d\'affiliation.', linkLabel: 'En savoir plus' },
  be: { text: 'Comparatif indépendant — nous pouvons percevoir des commissions d\'affiliation.', linkLabel: 'En savoir plus' },
  de: { text: 'Unabhängiger Vergleich — wir können Affiliate-Provisionen erhalten.', linkLabel: 'Mehr erfahren' },
  at: { text: 'Unabhängiger Vergleich — wir können Affiliate-Provisionen erhalten.', linkLabel: 'Mehr erfahren' },
  es: { text: 'Comparador independiente — podemos recibir comisiones de afiliados.', linkLabel: 'Más información' },
  it: { text: 'Comparatore indipendente — potremmo ricevere commissioni di affiliazione.', linkLabel: 'Scopri di più' },
  en: { text: 'Independent comparison — we may earn affiliate commissions.', linkLabel: 'Learn more' },
};

const AFFILIATE_SLUGS: Record<string, string> = {
  fr: 'divulgation-affilies', be: 'divulgation-affilies',
  de: 'affiliate-offenlegung', at: 'affiliate-offenlegung',
  es: 'divulgacion-afiliados',
  it: 'divulgazione-affiliati',
  en: 'affiliate-disclosure',
};

export default function IndependentNotice() {
  const lang = useLanguage();
  const copy = COPY[lang] ?? COPY.en;
  const slug = AFFILIATE_SLUGS[lang] ?? 'affiliate-disclosure';

  return (
    <p className="inline-flex items-center gap-1.5 text-xs text-slate-400">
      <Info className="w-3 h-3 shrink-0 text-slate-500" />
      {copy.text}{' '}
      <Link
        to={`/${lang}/${slug}`}
        className="text-slate-400 hover:text-cyan-accent underline transition-colors"
      >
        {copy.linkLabel} →
      </Link>
    </p>
  );
}
