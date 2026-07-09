import { Link } from 'react-router-dom';
import type { Language } from '../i18n/types';

const content: Record<Language, { label: string; text: string; link: string }> = {
  en: {
    label: 'Affiliate disclosure',
    text: 'This page may contain affiliate links. If you sign up via our links, we may earn a commission from the card provider. This does not affect our editorial rankings or assessments. Cards without affiliate relationships are listed equally.',
    link: 'Full disclosure',
  },
  de: {
    label: 'Affiliate-Hinweis',
    text: 'Diese Seite kann Affiliate-Links enthalten. Wenn Sie sich über unsere Links anmelden, erhalten wir möglicherweise eine Provision. Dies beeinflusst weder unsere Bewertungen noch die Reihenfolge der Karten. Karten ohne Affiliate-Beziehung werden gleichwertig aufgeführt.',
    link: 'Vollständige Offenlegung',
  },
  fr: {
    label: "Mention d'affiliation",
    text: "Cette page peut contenir des liens d'affiliation. Si vous vous inscrivez via nos liens, nous pouvons percevoir une commission. Cela n'influence ni nos évaluations ni le classement des cartes. Les cartes sans relation d'affiliation sont présentées de manière identique.",
    link: 'Détails complets',
  },
  es: {
    label: 'Aviso de afiliación',
    text: 'Esta página puede contener enlaces de afiliados. Si te registras a través de nuestros enlaces, podemos recibir una comisión. Esto no afecta nuestras evaluaciones ni el orden de las tarjetas. Las tarjetas sin relación de afiliación se presentan de igual manera.',
    link: 'Más información',
  },
  it: {
    label: 'Informativa affiliati',
    text: "Questa pagina può contenere link di affiliazione. Se ti iscrivi tramite i nostri link, potremmo ricevere una commissione. Ciò non influisce sulle nostre valutazioni né sull'ordine delle carte. Le carte senza relazioni di affiliazione sono elencate in modo uguale.",
    link: 'Informativa completa',
  },
};

export default function AffiliateDisclosure({ lang = 'en' }: { lang?: Language }) {
  const t = content[lang] ?? content.en;
  return (
    <div className="text-xs text-slate-400 border border-bg-border rounded-lg px-4 py-3 mb-6 bg-bg-elevated/50">
      <span className="font-semibold text-slate-400">{t.label}: </span>
      {t.text}{' '}
      <Link to="/affiliate-disclosure" className="underline hover:text-slate-300 transition-colors">
        {t.link} →
      </Link>
    </div>
  );
}
