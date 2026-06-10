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
import AdminBlog from './pages/AdminBlog';
import AdminHeroImages from './pages/AdminHeroImages';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Privacy from './pages/Privacy';
import AffiliateDisclosurePage from './pages/AffiliateDisclosurePage';
import RiskSummary from './pages/RiskSummary';
import CardDetail from './pages/CardDetail';
import ThematicPage from './pages/ThematicPage';
import ComparisonPage from './pages/ComparisonPage';
import { initializeLanguage } from './i18n/utils';

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

          {/* ── Comparateur (outil) ── */}
          <Route path="comparer" element={<Compare />} />
          <Route path="comparar" element={<Compare />} />
          <Route path="vergleich" element={<Compare />} />
          <Route path="confronto" element={<Compare />} />
          <Route path="compare" element={<Compare />} />

          {/* ── Simulateur ── */}
          <Route path="simulateur" element={<Simulator />} />
          <Route path="simulador" element={<Simulator />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="simulatore" element={<Simulator />} />

          {/* ── Recommandation ── */}
          <Route path="recommandation" element={<Recommendation />} />
          <Route path="recomendacion" element={<Recommendation />} />
          <Route path="empfehlung" element={<Recommendation />} />
          <Route path="raccomandazione" element={<Recommendation />} />
          <Route path="recommendation" element={<Recommendation />} />

          {/* ── Favoris ── */}
          <Route path="favoris" element={<Favorites />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="favoriten" element={<Favorites />} />
          <Route path="preferiti" element={<Favorites />} />
          <Route path="favorites" element={<Favorites />} />

          {/* ── Blog ── */}
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />

          {/* ── Fiches cartes ── */}
          <Route path="cartes/:id" element={<CardDetail />} />
          <Route path="karten/:id" element={<CardDetail />} />
          <Route path="tarjetas/:id" element={<CardDetail />} />
          <Route path="carte/:id" element={<CardDetail />} />
          <Route path="cards/:id" element={<CardDetail />} />

          {/* ── Pages thématiques — FR ── */}
          <Route path="meilleure-carte-crypto" element={<ThematicPage theme="best" />} />
          <Route path="carte-crypto-cashback" element={<ThematicPage theme="cashback" />} />
          <Route path="carte-crypto-sans-frais" element={<ThematicPage theme="no-fees" />} />
          <Route path="carte-crypto-sans-staking" element={<ThematicPage theme="no-staking" />} />

          {/* ── Pages thématiques — DE ── */}
          <Route path="beste-krypto-karte" element={<ThematicPage theme="best" />} />
          <Route path="krypto-karte-cashback" element={<ThematicPage theme="cashback" />} />
          <Route path="krypto-karte-ohne-jahresgebuehr" element={<ThematicPage theme="no-fees" />} />
          <Route path="krypto-karte-ohne-staking" element={<ThematicPage theme="no-staking" />} />

          {/* ── Pages thématiques — ES ── */}
          <Route path="mejor-tarjeta-cripto" element={<ThematicPage theme="best" />} />
          <Route path="tarjeta-cripto-cashback" element={<ThematicPage theme="cashback" />} />
          <Route path="tarjeta-cripto-sin-comisiones" element={<ThematicPage theme="no-fees" />} />
          <Route path="tarjeta-cripto-sin-staking" element={<ThematicPage theme="no-staking" />} />

          {/* ── Pages thématiques — IT ── */}
          <Route path="migliore-carta-cripto" element={<ThematicPage theme="best" />} />
          <Route path="carta-cripto-cashback" element={<ThematicPage theme="cashback" />} />
          <Route path="carta-cripto-senza-commissioni" element={<ThematicPage theme="no-fees" />} />
          <Route path="carta-cripto-senza-staking" element={<ThematicPage theme="no-staking" />} />

          {/* ── Pages thématiques — EN ── */}
          <Route path="best-crypto-card" element={<ThematicPage theme="best" />} />
          <Route path="crypto-card-cashback" element={<ThematicPage theme="cashback" />} />
          <Route path="crypto-card-no-fees" element={<ThematicPage theme="no-fees" />} />
          <Route path="crypto-card-no-staking" element={<ThematicPage theme="no-staking" />} />

          {/* ── Pages A vs B (comparaisons) ── */}
          <Route path="comparer/:slug" element={<ComparisonPage />} />
          <Route path="vergleichen/:slug" element={<ComparisonPage />} />
          <Route path="comparar/:slug" element={<ComparisonPage />} />
          <Route path="confrontare/:slug" element={<ComparisonPage />} />
          <Route path="compare/:slug" element={<ComparisonPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
