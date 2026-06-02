import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../i18n/types';

const CONSENT_KEY = 'cookie_consent';

const translations: Record<Language, {
  title: string;
  body: string;
  accept: string;
  reject: string;
  link: string;
  href: string;
}> = {
  de: {
    title: 'Datenschutz-Einstellungen',
    body: 'Wir verwenden Cookies, um das Nutzungserlebnis zu verbessern und Affiliate-Links zu verfolgen. Technisch notwendige Cookies sind immer aktiv. Optionale Cookies werden nur mit Ihrer Einwilligung gesetzt.',
    accept: 'Alle akzeptieren',
    reject: 'Nur notwendige',
    link: 'Datenschutzerklärung',
    href: '/datenschutz',
  },
  en: {
    title: 'Cookie settings',
    body: 'We use cookies to improve your experience and track affiliate link clicks. Strictly necessary cookies are always active. Optional cookies are only set with your consent.',
    accept: 'Accept all',
    reject: 'Necessary only',
    link: 'Privacy Policy',
    href: '/privacy',
  },
  fr: {
    title: 'Paramètres des cookies',
    body: "Nous utilisons des cookies pour améliorer votre expérience et suivre les clics sur les liens d'affiliation. Les cookies strictement nécessaires sont toujours actifs. Les cookies optionnels ne sont déposés qu'avec votre consentement.",
    accept: 'Tout accepter',
    reject: 'Nécessaires uniquement',
    link: 'Politique de confidentialité',
    href: '/privacy',
  },
  es: {
    title: 'Configuración de cookies',
    body: 'Utilizamos cookies para mejorar tu experiencia y realizar el seguimiento de los clics en los enlaces de afiliados. Las cookies estrictamente necesarias están siempre activas. Las cookies opcionales solo se instalan con tu consentimiento.',
    accept: 'Aceptar todas',
    reject: 'Solo las necesarias',
    link: 'Política de privacidad',
    href: '/privacy',
  },
  it: {
    title: 'Impostazioni cookie',
    body: 'Utilizziamo cookie per migliorare la tua esperienza e monitorare i clic sui link di affiliazione. I cookie strettamente necessari sono sempre attivi. I cookie opzionali vengono installati solo con il tuo consenso.',
    accept: 'Accetta tutti',
    reject: 'Solo necessari',
    link: 'Informativa sulla privacy',
    href: '/privacy',
  },
};

export default function CookieBanner({ lang = 'en' }: { lang?: Language }) {
  const [visible, setVisible] = useState(false);
  const t = translations[lang] ?? translations.en;

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    window.dispatchEvent(new Event('cookie_consent_accepted'));
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-bg-border shadow-2xl">
      <div className="container-app py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm mb-1">{t.title}</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            {t.body}{' '}
            <Link to={t.href} className="underline text-cyan-accent hover:text-cyan-accent/80 transition-colors">
              {t.link}
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-bg-border text-slate-300 rounded-lg hover:bg-bg-elevated hover:text-white transition-colors"
          >
            {t.reject}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-cyan-accent text-bg-base rounded-lg hover:bg-cyan-accent/90 transition-colors font-semibold"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
