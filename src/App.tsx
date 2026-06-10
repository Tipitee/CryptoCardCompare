import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Compare from './pages/Compare';
import Simulator from './pages/Simulator';
import Recommendation from './pages/Recommendation';
import Favorites from './pages/Favorites';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CardDetail from './pages/CardDetail';
import AdminBlog from './pages/AdminBlog';
import AdminHeroImages from './pages/AdminHeroImages';
import ThematicPage from './pages/ThematicPage';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Privacy from './pages/Privacy';
import AffiliateDisclosurePage from './pages/AffiliateDisclosurePage';
import RiskSummary from './pages/RiskSummary';
import { initializeLanguage } from './i18n/utils';
import { ROUTE_TRANSLATIONS } from './i18n/types';

const BASE = 'https://topcryptocards.eu';
const HREFLANG_LANGS = ['fr', 'de', 'es', 'it', 'en'];
const LANG_TO_CARD_SEGMENT: Record<string, string> = {
  fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards',
};
const CARD_SEGMENTS = new Set(Object.values(LANG_TO_CARD_SEGMENT));

function resolveHref(parts: string[], currentLang: string, targetLang: string): string {
  const routeParts = parts.slice(1);
  if (routeParts.length === 0) return `${BASE}/${targetLang}`;

  if (routeParts.length >= 2 && CARD_SEGMENTS.has(routeParts[0])) {
    const cardId = routeParts[1];
    const segment = LANG_TO_CARD_SEGMENT[targetLang] || 'cards';
    const rest = routeParts.slice(2).join('/');
    return `${BASE}/${targetLang}/${segment}/${cardId}${rest ? '/' + rest : ''}`;
  }

  const curTrans = ROUTE_TRANSLATIONS[currentLang as keyof typeof ROUTE_TRANSLATIONS];
  const tgtTrans = ROUTE_TRANSLATIONS[targetLang as keyof typeof ROUTE_TRANSLATIONS];
  if (!curTrans || !tgtTrans) return `${BASE}/${targetLang}`;

  const routeKey = Object.entries(curTrans).find(([, v]) => v === routeParts[0])?.[0];
  if (!routeKey) return `${BASE}/${targetLang}`;

  const newSeg = tgtTrans[routeKey];
  if (!newSeg) return `${BASE}/${targetLang}`;

  const rest = routeParts.slice(1).join('/');
  return `${BASE}/${targetLang}/${newSeg}${rest ? '/' + rest : ''}`;
}

function HreflangTags() {
  const location = useLocation();

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const currentLang = parts[0] || 'fr';
    const created: Element[] = [];

    HREFLANG_LANGS.forEach((lang) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', resolveHref(parts, currentLang, lang));
      document.head.appendChild(link);
      created.push(link);
    });

    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', resolveHref(parts, currentLang, 'en'));
    document.head.appendChild(xDefault);
    created.push(xDefault);

    document.querySelector('link[rel="canonical"]')?.remove();
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.origin + window.location.pathname);
    document.head.appendChild(canonical);
    created.push(canonical);

    return () => { created.forEach((el) => el.remove()); };
  }, [location.pathname]);

  return null;
}

function RootRedirect() {
  const location = useLocation();

  useEffect(() => {
    const initialLang = initializeLanguage();
    if (location.pathname === '/' || location.pathname === '') {
      window.location.replace(`/${initialLang}`);
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <HreflangTags />
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/generate-hero-images" element={<AdminHeroImages />} />

        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
        <Route path="/risk-summary" element={<RiskSummary />} />

        <Route path="/:lang" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="comparer" element={<Compare />} />
          <Route path="comparar" element={<Compare />} />
          <Route path="vergleich" element={<Compare />} />
          <Route path="confronto" element={<Compare />} />
          <Route path="compare" element={<Compare />} />

          <Route path="simulateur" element={<Simulator />} />
          <Route path="simulador" element={<Simulator />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="simulatore" element={<Simulator />} />

          <Route path="recommandation" element={<Recommendation />} />
          <Route path="recomendacion" element={<Recommendation />} />
          <Route path="empfehlung" element={<Recommendation />} />
          <Route path="raccomandazione" element={<Recommendation />} />
          <Route path="recommendation" element={<Recommendation />} />

          <Route path="favoris" element={<Favorites />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="favoriten" element={<Favorites />} />
          <Route path="preferiti" element={<Favorites />} />
          <Route path="favorites" element={<Favorites />} />

          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />

          <Route path="cartes/:id" element={<CardDetail />} />
          <Route path="karten/:id" element={<CardDetail />} />
          <Route path="tarjetas/:id" element={<CardDetail />} />
          <Route path="carte/:id" element={<CardDetail />} />
          <Route path="cards/:id" element={<CardDetail />} />
          {/* ── Pages thématiques ── */}
{/* FR */}
<Route path="meilleure-carte-crypto" element={<ThematicPage theme="best" />} />
<Route path="carte-crypto-cashback" element={<ThematicPage theme="cashback" />} />
<Route path="carte-crypto-sans-frais" element={<ThematicPage theme="no-fees" />} />
<Route path="carte-crypto-sans-staking" element={<ThematicPage theme="no-staking" />} />
<Route path="carte-crypto-france" element={<ThematicPage theme="france" />} />
<Route path="carte-crypto-virtuelle" element={<ThematicPage theme="virtual" />} />
<Route path="carte-crypto-debutant" element={<ThematicPage theme="beginner" />} />
{/* DE */}
<Route path="beste-krypto-karte" element={<ThematicPage theme="best" />} />
<Route path="krypto-karte-cashback" element={<ThematicPage theme="cashback" />} />
<Route path="krypto-karte-kostenlos" element={<ThematicPage theme="no-fees" />} />
<Route path="krypto-karte-ohne-staking" element={<ThematicPage theme="no-staking" />} />
{/* ES */}
<Route path="mejor-tarjeta-crypto" element={<ThematicPage theme="best" />} />
<Route path="tarjeta-crypto-cashback" element={<ThematicPage theme="cashback" />} />
<Route path="tarjeta-crypto-sin-comisiones" element={<ThematicPage theme="no-fees" />} />
<Route path="tarjeta-crypto-sin-staking" element={<ThematicPage theme="no-staking" />} />
{/* IT */}
<Route path="migliore-carta-crypto" element={<ThematicPage theme="best" />} />
<Route path="carta-crypto-cashback" element={<ThematicPage theme="cashback" />} />
<Route path="carta-crypto-senza-costi" element={<ThematicPage theme="no-fees" />} />
{/* EN */}
<Route path="best-crypto-card" element={<ThematicPage theme="best" />} />
<Route path="crypto-card-cashback" element={<ThematicPage theme="cashback" />} />
<Route path="crypto-card-no-fees" element={<ThematicPage theme="no-fees" />} />
<Route path="crypto-card-no-staking" element={<ThematicPage theme="no-staking" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
