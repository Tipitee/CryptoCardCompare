import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, Calculator, ChevronDown, FileText, Heart, Sparkles, Menu, Shield, Star, TrendingUp, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import LanguageSwitcher from './LanguageSwitcher';
import LanguageSync from './LanguageSync';
import CookieBanner from './CookieBanner';
import { useEffect, useRef, useState } from 'react';

const REVIEW_SLUGS: Record<string, string> = {
  fr: 'avis', de: 'bewertungen', es: 'opiniones', it: 'recensioni', en: 'reviews',
};

const REVIEW_LABELS: Record<string, string> = {
  fr: 'Avis', de: 'Bewertungen', es: 'Opiniones', it: 'Recensioni', en: 'Reviews',
};

const THEMATIC_SLUGS: Record<string, Record<string, string>> = {
  fr: { best: 'meilleure-carte-crypto', cashback: 'carte-crypto-cashback', noFees: 'carte-crypto-sans-frais', noStaking: 'carte-crypto-sans-staking' },
  de: { best: 'beste-krypto-karte', cashback: 'krypto-karte-cashback', noFees: 'krypto-karte-ohne-jahresgebuehr', noStaking: 'krypto-karte-ohne-staking' },
  es: { best: 'mejor-tarjeta-cripto', cashback: 'tarjeta-cripto-cashback', noFees: 'tarjeta-cripto-sin-comisiones', noStaking: 'tarjeta-cripto-sin-staking' },
  it: { best: 'migliore-carta-cripto', cashback: 'carta-cripto-cashback', noFees: 'carta-cripto-senza-commissioni', noStaking: 'carta-cripto-senza-staking' },
  en: { best: 'best-crypto-card', cashback: 'crypto-card-cashback', noFees: 'crypto-card-no-fees', noStaking: 'crypto-card-no-staking' },
};

const THEMATIC_LABELS: Record<string, { best: string; cashback: string; noFees: string; noStaking: string; title: string; cryptos: string }> = {
  fr: { title: 'Guides', best: 'Meilleures cartes crypto', cashback: 'Cartes avec cashback', noFees: 'Cartes sans frais', noStaking: 'Cartes sans staking', cryptos: 'Guide Cryptomonnaies' },
  de: { title: 'Ratgeber', best: 'Beste Krypto-Karten', cashback: 'Karten mit Cashback', noFees: 'Kostenlose Karten', noStaking: 'Karten ohne Staking', cryptos: 'Kryptowährungs-Guide' },
  es: { title: 'Guías', best: 'Mejores tarjetas crypto', cashback: 'Tarjetas con cashback', noFees: 'Tarjetas sin comisiones', noStaking: 'Tarjetas sin staking', cryptos: 'Guía Criptomonedas' },
  it: { title: 'Guide', best: 'Migliori carte crypto', cashback: 'Carte con cashback', noFees: 'Carte senza costi', noStaking: 'Carte senza staking', cryptos: 'Guida Criptovalute' },
  en: { title: 'Guides', best: 'Best crypto cards', cashback: 'Cards with cashback', noFees: 'No-fee cards', noStaking: 'No-staking cards', cryptos: 'Cryptocurrency Guide' },
};

export default function Layout() {
  const loadCards = useAppStore((s) => s.loadCards);
  const loadFavorites = useAppStore((s) => s.loadFavorites);
  const favorites = useAppStore((s) => s.favorites);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const guidesRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const location = useLocation();

  const slugs = THEMATIC_SLUGS[lang] || THEMATIC_SLUGS.en;
  const labels = THEMATIC_LABELS[lang] || THEMATIC_LABELS.en;
  const reviewSlug = REVIEW_SLUGS[lang] || 'avis';
  const reviewLabel = REVIEW_LABELS[lang] || 'Avis';

  // Nav items — Home removed, logo acts as home link
  const navItems = [
    { key: 'compare', label: t('nav_compare'), icon: BarChart3 },
    { key: 'simulator', label: t('nav_simulator'), icon: Calculator },
    { key: 'recommendation', label: t('nav_recommendation'), icon: Sparkles },
    { key: 'favorites', label: t('nav_favorites'), icon: Heart },
    { key: 'blog', label: t('nav_blog'), icon: BookOpen },
  ];

  const thematicLinks = [
    { slug: slugs.best, label: labels.best },
    { slug: slugs.cashback, label: labels.cashback },
    { slug: slugs.noFees, label: labels.noFees },
    { slug: slugs.noStaking, label: labels.noStaking },
    { slug: 'cryptos', label: labels.cryptos },
  ];

  useEffect(() => {
    loadCards(lang);
    loadFavorites();
  }, [loadCards, loadFavorites, lang]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setGuidesOpen(false);
  }, [location.pathname]);

  // Close guides dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (guidesRef.current && !guidesRef.current.contains(e.target as Node)) {
        setGuidesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
      isActive
        ? 'text-cyan-accent bg-cyan-accent/10'
        : 'text-slate-400 hover:text-white hover:bg-bg-elevated'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium min-h-[52px] transition-colors ${
      isActive
        ? 'text-cyan-accent bg-cyan-accent/10'
        : 'text-slate-300 hover:text-white hover:bg-bg-card active:bg-bg-card'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <LanguageSync />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-bg-border bg-bg/80 backdrop-blur-lg">
        <div className="container-app flex items-center justify-between h-16">

          {/* Brand — logo + text, links to home */}
          <NavLink to={getRoute('')} className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="TopCryptoCards" className="h-10 w-auto" />
            <span className="font-display font-bold text-white text-lg tracking-tight leading-none">
              TopCrypto<span className="text-cyan-accent">Cards</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <NavLink key={item.key} to={getRoute(item.key)} className={navLinkClass}>
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.key === 'favorites' && favorites.length > 0 && (
                  <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-accent/20 text-green-accent">
                    {favorites.length}
                  </span>
                )}
              </NavLink>
            ))}

            <NavLink to={`/${lang}/${reviewSlug}`} className={navLinkClass}>
              <Star className="w-4 h-4" />
              {reviewLabel}
            </NavLink>

            {/* Guides dropdown */}
            <div ref={guidesRef} className="relative">
              <button
                onClick={() => setGuidesOpen((v) => !v)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  guidesOpen ? 'text-cyan-accent bg-cyan-accent/10' : 'text-slate-400 hover:text-white hover:bg-bg-elevated'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                {labels.title}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${guidesOpen ? 'rotate-180' : ''}`} />
              </button>

              {guidesOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 rounded-xl border border-bg-border bg-bg-elevated shadow-xl py-1 z-50">
                  {thematicLinks.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/${lang}/${item.slug}`}
                      onClick={() => setGuidesOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-bg-card transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in panel */}
          <nav className="absolute right-0 top-0 h-full w-[280px] bg-bg-elevated border-l border-bg-border flex flex-col shadow-2xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-bg-border shrink-0">
              <NavLink to={getRoute('')} className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <img src="/logo.png" alt="TopCryptoCards" className="h-8 w-auto" />
                <span className="font-display font-bold text-white text-base">
                  TopCrypto<span className="text-cyan-accent">Cards</span>
                </span>
              </NavLink>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-bg-card transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable links */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={getRoute(item.key)}
                  onClick={() => setMenuOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.key === 'favorites' && favorites.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-accent/20 text-green-accent">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
              ))}

              <NavLink
                to={`/${lang}/${reviewSlug}`}
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <Star className="w-5 h-5 shrink-0" />
                {reviewLabel}
              </NavLink>

              {/* Guides section */}
              <div className="mt-4 mb-2 px-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                {labels.title}
              </div>
              {thematicLinks.map((item) => (
                <Link
                  key={item.slug}
                  to={`/${lang}/${item.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-bg-card active:bg-bg-card transition-colors min-h-[48px]"
                >
                  <TrendingUp className="w-4 h-4 shrink-0 text-slate-500" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Panel footer */}
            <div className="shrink-0 px-4 py-4 border-t border-bg-border">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-bg-border bg-bg-elevated/40 mt-20">
        <div className="container-app py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="TopCryptoCards" className="h-8 w-auto" />
                <span className="font-display font-semibold text-white">
                  TopCryptoCards
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs">
                {t('footer_desc')}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">{t('nav_compare')}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {navItems.map((i) => (
                  <li key={i.key}>
                    <NavLink to={getRoute(i.key)} className="hover:text-cyan-accent transition-colors">
                      {i.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">{labels.title}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {thematicLinks.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/${lang}/${item.slug}`} className="hover:text-cyan-accent transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">{t('footer_resources')}</h4>
              <ul className="space-y-2 text-sm text-slate-400 mb-6">
                <li>
                  <NavLink to={getRoute('blog')} className="hover:text-cyan-accent transition-colors flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {t('footer_guides')}
                  </NavLink>
                </li>
                <li>
                  <Link to="/affiliate-disclosure" className="hover:text-cyan-accent transition-colors flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Affiliate Disclosure
                  </Link>
                </li>
                <li>
                  <Link to="/risk-summary" className="hover:text-cyan-accent transition-colors flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Risk Summary
                  </Link>
                </li>
              </ul>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('footer_disclaimer')}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-bg-border flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} {t('footer_copyright')}</span>
            <div className="flex flex-wrap gap-3">
              <Link to="/impressum" className="hover:text-slate-300 transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="hover:text-slate-300 transition-colors">Datenschutz</Link>
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
              <Link to="/affiliate-disclosure" className="hover:text-slate-300 transition-colors">Affiliate</Link>
              <Link to="/risk-summary" className="hover:text-slate-300 transition-colors">Risk</Link>
            </div>
            <span>{t('footer_tagline')}</span>
          </div>
        </div>
      </footer>

      <CookieBanner lang={lang} />
    </div>
  );
}
