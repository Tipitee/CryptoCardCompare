import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { Home, BarChart3, BookOpen, TrendingUp } from 'lucide-react';

const MESSAGES: Record<string, { title: string; subtitle: string; cta: string }> = {
  fr: { title: 'Page introuvable', subtitle: 'Cette page n\'existe pas ou a été déplacée.', cta: 'Que souhaitez-vous faire ?' },
  de: { title: 'Seite nicht gefunden', subtitle: 'Diese Seite existiert nicht oder wurde verschoben.', cta: 'Was möchten Sie tun?' },
  es: { title: 'Página no encontrada', subtitle: 'Esta página no existe o fue movida.', cta: '¿Qué desea hacer?' },
  it: { title: 'Pagina non trovata', subtitle: 'Questa pagina non esiste o è stata spostata.', cta: 'Cosa vuoi fare?' },
  en: { title: 'Page not found', subtitle: 'This page doesn\'t exist or has been moved.', cta: 'What would you like to do?' },
};

const LINKS: Record<string, { home: string; compare: string; blog: string; guides: string }> = {
  fr: { home: 'Accueil', compare: 'Comparer les cartes', blog: 'Blog', guides: 'Meilleures cartes' },
  de: { home: 'Startseite', compare: 'Karten vergleichen', blog: 'Blog', guides: 'Beste Karten' },
  es: { home: 'Inicio', compare: 'Comparar tarjetas', blog: 'Blog', guides: 'Mejores tarjetas' },
  it: { home: 'Home', compare: 'Confronta carte', blog: 'Blog', guides: 'Migliori carte' },
  en: { home: 'Home', compare: 'Compare cards', blog: 'Blog', guides: 'Best cards' },
};

const THEMATIC_BEST: Record<string, string> = {
  fr: 'meilleure-carte-crypto',
  de: 'beste-krypto-karte',
  es: 'mejor-tarjeta-cripto',
  it: 'migliore-carta-cripto',
  en: 'best-crypto-card',
};

export default function NotFound() {
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const msg = MESSAGES[lang] || MESSAGES.en;
  const links = LINKS[lang] || LINKS.en;

  useSeoMeta({ title: `404 — ${msg.title} | TopCryptoCards`, description: msg.subtitle });

  // Inject noindex so soft-404s don't pollute the index
  useEffect(() => {
    const el = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const prev = el?.getAttribute('content') ?? '';
    if (el) el.setAttribute('content', 'noindex, nofollow');
    return () => { if (el) el.setAttribute('content', prev); };
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-display font-black text-cyan-accent/20 select-none mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">{msg.title}</h1>
      <p className="text-slate-400 mb-10 max-w-sm">{msg.subtitle}</p>

      <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">{msg.cta}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg w-full">
        <Link
          to={getRoute('')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-bg-elevated hover:border-cyan-accent/50 hover:bg-cyan-accent/5 transition-all group"
        >
          <Home className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{links.home}</span>
        </Link>

        <Link
          to={getRoute('compare')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-bg-elevated hover:border-cyan-accent/50 hover:bg-cyan-accent/5 transition-all group"
        >
          <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xs text-slate-400 group-hover:text-white transition-colors text-center leading-tight">{links.compare}</span>
        </Link>

        <Link
          to={`/${lang}/${THEMATIC_BEST[lang] || THEMATIC_BEST.en}`}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-bg-elevated hover:border-cyan-accent/50 hover:bg-cyan-accent/5 transition-all group"
        >
          <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xs text-slate-400 group-hover:text-white transition-colors text-center leading-tight">{links.guides}</span>
        </Link>

        <Link
          to={getRoute('blog')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-bg-elevated hover:border-cyan-accent/50 hover:bg-cyan-accent/5 transition-all group"
        >
          <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{links.blog}</span>
        </Link>
      </div>
    </div>
  );
}
