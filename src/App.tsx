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
import BlogAdminHub from './pages/BlogAdminHub';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Privacy from './pages/Privacy';
import AffiliateDisclosurePage from './pages/AffiliateDisclosurePage';
import RiskSummary from './pages/RiskSummary';
import AboutPage from './pages/AboutPage';
import CardDetail from './pages/CardDetail';
import ThematicPage from './pages/ThematicPage';
import ComparisonPage from './pages/ComparisonPage';
import CryptoList from './pages/CryptoList';
import CryptoPage from './pages/CryptoPage';
import ReviewList from './pages/ReviewList';
import ReviewPage from './pages/ReviewPage';
import NotFound from './pages/NotFound';
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

// Redirects bare paths like /compare → /{lang}/compare
// (without this, /:lang catches them and renders Home)
const BARE_PATH_MAP: Record<string, Record<string, string>> = {
  compare:       { fr: 'comparer',      de: 'vergleich',  es: 'comparar',      it: 'confronto',    en: 'compare' },
  comparer:      { fr: 'comparer',      de: 'vergleich',  es: 'comparar',      it: 'confronto',    en: 'compare' },
  vergleich:     { fr: 'comparer',      de: 'vergleich',  es: 'comparar',      it: 'confronto',    en: 'compare' },
  comparar:      { fr: 'comparer',      de: 'vergleich',  es: 'comparar',      it: 'confronto',    en: 'compare' },
  confronto:     { fr: 'comparer',      de: 'vergleich',  es: 'comparar',      it: 'confronto',    en: 'compare' },
  blog:          { fr: 'blog',          de: 'blog',       es: 'blog',          it: 'blog',         en: 'blog' },
  simulateur:    { fr: 'simulateur',    de: 'simulator',  es: 'simulador',     it: 'simulatore',   en: 'simulator' },
  simulator:     { fr: 'simulateur',    de: 'simulator',  es: 'simulador',     it: 'simulatore',   en: 'simulator' },
  simulador:     { fr: 'simulateur',    de: 'simulator',  es: 'simulador',     it: 'simulatore',   en: 'simulator' },
  simulatore:    { fr: 'simulateur',    de: 'simulator',  es: 'simulador',     it: 'simulatore',   en: 'simulator' },
  recommandation:{ fr: 'recommandation',de: 'empfehlung', es: 'recomendacion', it: 'raccomandazione', en: 'recommendation' },
  recommendation:{ fr: 'recommandation',de: 'empfehlung', es: 'recomendacion', it: 'raccomandazione', en: 'recommendation' },
  favoris:       { fr: 'favoris',       de: 'favoriten',  es: 'favoritos',     it: 'preferiti',    en: 'favorites' },
  favorites:     { fr: 'favoris',       de: 'favoriten',  es: 'favoritos',     it: 'preferiti',    en: 'favorites' },
};

function BarePathRedirect({ slug }: { slug: string }) {
  const lang = initializeLanguage();
  const map = BARE_PATH_MAP[slug];
  const target = map ? (map[lang] ?? slug) : slug;
  return <Navigate to={`/${lang}/${target}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/generate-hero-images" element={<AdminHeroImages />} />
        <Route path="/:lang/blog-admin" element={<BlogAdminHub />} />

        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
        <Route path="/risk-summary" element={<RiskSummary />} />
        <Route path="/about" element={<AboutPage />} />

        {/* ── Bare-path redirects (e.g. /compare → /en/compare) ── */}
        {Object.keys(BARE_PATH_MAP).map(slug => (
          <Route key={slug} path={`/${slug}`} element={<BarePathRedirect slug={slug} />} />
        ))}

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
          <Route path="meilleure-carte-crypto"      element={<ThematicPage theme="best" />} />
          <Route path="carte-crypto-cashback"       element={<ThematicPage theme="cashback" />} />
          <Route path="carte-crypto-sans-frais"     element={<ThematicPage theme="no-fees" />} />
          <Route path="carte-crypto-sans-staking"   element={<ThematicPage theme="no-staking" />} />
          <Route path="cartes-crypto-france"        element={<ThematicPage theme="france" />} />
          <Route path="carte-crypto-virtuelle"      element={<ThematicPage theme="virtual" />} />
          <Route path="cartes-crypto-debutant"      element={<ThematicPage theme="beginner" />} />
          <Route path="carte-crypto-sans-kyc"       element={<ThematicPage theme="no-kyc" />} />
          <Route path="carte-crypto-2026"           element={<ThematicPage theme="2026" />} />

          {/* ── Pages thématiques — DE ── */}
          <Route path="beste-krypto-karte"           element={<ThematicPage theme="best" />} />
          <Route path="krypto-karte-cashback"        element={<ThematicPage theme="cashback" />} />
          <Route path="krypto-karte-ohne-jahresgebuehr" element={<ThematicPage theme="no-fees" />} />
          <Route path="krypto-karte-ohne-staking"    element={<ThematicPage theme="no-staking" />} />
          <Route path="krypto-karten-deutschland"    element={<ThematicPage theme="france" />} />
          <Route path="virtuelle-krypto-karte"       element={<ThematicPage theme="virtual" />} />
          <Route path="krypto-karten-einsteiger"     element={<ThematicPage theme="beginner" />} />
          <Route path="krypto-karte-ohne-kyc"        element={<ThematicPage theme="no-kyc" />} />
          <Route path="krypto-karte-2026"            element={<ThematicPage theme="2026" />} />

          {/* ── Pages thématiques — ES ── */}
          <Route path="mejor-tarjeta-cripto"              element={<ThematicPage theme="best" />} />
          <Route path="tarjeta-cripto-cashback"           element={<ThematicPage theme="cashback" />} />
          <Route path="tarjeta-cripto-sin-comisiones"     element={<ThematicPage theme="no-fees" />} />
          <Route path="tarjeta-cripto-sin-staking"        element={<ThematicPage theme="no-staking" />} />
          <Route path="tarjetas-crypto-espana"            element={<ThematicPage theme="france" />} />
          <Route path="tarjeta-crypto-virtual"            element={<ThematicPage theme="virtual" />} />
          <Route path="tarjetas-crypto-principiante"      element={<ThematicPage theme="beginner" />} />
          <Route path="tarjeta-crypto-sin-kyc"            element={<ThematicPage theme="no-kyc" />} />
          <Route path="tarjeta-cripto-2026"               element={<ThematicPage theme="2026" />} />

          {/* ── Pages thématiques — IT ── */}
          <Route path="migliore-carta-cripto"         element={<ThematicPage theme="best" />} />
          <Route path="carta-cripto-cashback"         element={<ThematicPage theme="cashback" />} />
          <Route path="carta-cripto-senza-commissioni" element={<ThematicPage theme="no-fees" />} />
          <Route path="carta-cripto-senza-staking"    element={<ThematicPage theme="no-staking" />} />
          <Route path="carte-crypto-italia"           element={<ThematicPage theme="france" />} />
          <Route path="carta-crypto-virtuale"         element={<ThematicPage theme="virtual" />} />
          <Route path="carte-crypto-principiante"     element={<ThematicPage theme="beginner" />} />
          <Route path="carta-cripto-senza-kyc"        element={<ThematicPage theme="no-kyc" />} />
          <Route path="carta-cripto-2026"             element={<ThematicPage theme="2026" />} />

          {/* ── Pages thématiques — EN ── */}
          <Route path="best-crypto-card"        element={<ThematicPage theme="best" />} />
          <Route path="crypto-card-cashback"    element={<ThematicPage theme="cashback" />} />
          <Route path="crypto-card-no-fees"     element={<ThematicPage theme="no-fees" />} />
          <Route path="crypto-card-no-staking"  element={<ThematicPage theme="no-staking" />} />
          <Route path="crypto-cards-europe"     element={<ThematicPage theme="france" />} />
          <Route path="virtual-crypto-card"     element={<ThematicPage theme="virtual" />} />
          <Route path="beginner-crypto-cards"   element={<ThematicPage theme="beginner" />} />
          <Route path="crypto-card-no-kyc"      element={<ThematicPage theme="no-kyc" />} />
          <Route path="best-crypto-card-2026"   element={<ThematicPage theme="2026" />} />

          {/* ── Section Cryptos ── */}
          <Route path="cryptos" element={<CryptoList />} />
          <Route path="cryptos/:symbol" element={<CryptoPage />} />

          {/* ── Pages A vs B (comparaisons) ── */}
          <Route path="comparer/:slug" element={<ComparisonPage />} />
          <Route path="vergleichen/:slug" element={<ComparisonPage />} />
          <Route path="comparar/:slug" element={<ComparisonPage />} />
          <Route path="confrontare/:slug" element={<ComparisonPage />} />
          <Route path="compare/:slug" element={<ComparisonPage />} />

          {/* ── Avis cartes crypto ── */}
          <Route path="avis" element={<ReviewList />} />
          <Route path="avis/:slug" element={<ReviewPage />} />
          <Route path="reviews" element={<ReviewList />} />
          <Route path="reviews/:slug" element={<ReviewPage />} />
          <Route path="bewertungen" element={<ReviewList />} />
          <Route path="bewertungen/:slug" element={<ReviewPage />} />
          <Route path="opiniones" element={<ReviewList />} />
          <Route path="opiniones/:slug" element={<ReviewPage />} />
          <Route path="recensioni" element={<ReviewList />} />
          <Route path="recensioni/:slug" element={<ReviewPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;