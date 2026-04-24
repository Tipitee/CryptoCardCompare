import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpen, Calculator, Heart, Home, Sparkles, Coins, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import LanguageSwitcher from './LanguageSwitcher';
import { useEffect, useState } from 'react';

export default function Layout() {
  const loadCards = useAppStore((s) => s.loadCards);
  const loadFavorites = useAppStore((s) => s.loadFavorites);
  const favorites = useAppStore((s) => s.favorites);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();

  const navItems = [
    { path: '', label: t('nav_home'), icon: Home },
    { path: 'comparer', label: t('nav_compare'), icon: BarChart3 },
    { path: 'simulateur', label: t('nav_simulator'), icon: Calculator },
    { path: 'recommandation', label: t('nav_recommendation'), icon: Sparkles },
    { path: 'favoris', label: t('nav_favorites'), icon: Heart },
    { path: 'blog', label: t('nav_blog'), icon: BookOpen },
  ];

  useEffect(() => {
    loadCards();
    loadFavorites();
  }, [loadCards, loadFavorites]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="sticky top-0 z-40 border-b border-bg-border bg-bg/80 backdrop-blur-lg">
        <div className="container-app flex items-center justify-between h-16">
          <NavLink to={getRoute('')} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-accent to-green-accent flex items-center justify-center shadow-glow">
              <Coins className="w-5 h-5 text-bg" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              TopCrypto<span className="text-cyan-accent">Cards</span>
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={getRoute(item.path)}
                end={item.path === ''}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-cyan-accent bg-cyan-accent/10'
                      : 'text-slate-400 hover:text-white hover:bg-bg-elevated'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.path === 'favoris' && favorites.length > 0 && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-accent/20 text-green-accent">
                    {favorites.length}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="md:hidden btn-ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-bg-border bg-bg-elevated">
            <div className="container-app py-2 flex flex-col">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={getRoute(item.path)}
                  end={item.path === ''}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
                      isActive
                        ? 'text-cyan-accent bg-cyan-accent/10'
                        : 'text-slate-300'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-bg-border bg-bg-elevated/40 mt-20">
        <div className="container-app py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-accent to-green-accent flex items-center justify-center">
                  <Coins className="w-4 h-4 text-bg" />
                </div>
                <span className="font-display font-semibold text-white">
                  TopCryptoCards
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs">
                {t('site_description')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">{t('nav_blog')}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {navItems.map((i) => (
                  <li key={i.path}>
                    <NavLink to={getRoute(i.path)} className="hover:text-cyan-accent transition-colors">
                      {i.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Ressources</h4>
              <ul className="space-y-2 text-sm text-slate-400 mb-6">
                <li>
                  <NavLink to={getRoute('blog')} className="hover:text-cyan-accent transition-colors flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Blog & Guides
                  </NavLink>
                </li>
              </ul>
              <h4 className="text-sm font-semibold text-white mb-3">À savoir</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Les informations présentées sont fournies à titre indicatif. Les taux de cashback, frais et conditions de staking peuvent varier selon l'émetteur. Les investissements en cryptomonnaies comportent des risques.
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-bg-border flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} TopCryptoCards. Aucun conseil financier.</span>
            <span>Fait avec soin pour la communauté crypto.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
