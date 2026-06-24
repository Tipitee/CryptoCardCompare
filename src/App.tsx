import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import CardDetail from './pages/CardDetail';
import ThematicPage from './pages/ThematicPage';
import ComparisonPage from './pages/ComparisonPage';
import CryptoList from './pages/CryptoList';
import CryptoPage from './pages/CryptoPage';
import ReviewList from './pages/ReviewList';
import ReviewPage from './pages/ReviewPage';
import NotFound from './pages/NotFound';
import BrandPage from './pages/BrandPage';

import { ROUTE_TRANSLATIONS } from './i18n/types';
import { initializeLanguage } from './i18n/utils';
import { THEMATIC_ROUTES } from './config/routes';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deduplicated list of all localised slugs for a given route key. */
function allSlugs(key: string): string[] {
  return [...new Set(Object.values(ROUTE_TRANSLATIONS).map((t) => t[key]).filter(Boolean))];
}

// Reverse map: any localised slug → canonical route key (e.g. 'comparer' → 'compare').
// Built once at module level from ROUTE_TRANSLATIONS.
const SLUG_TO_KEY: Record<string, string> = {};
for (const routes of Object.values(ROUTE_TRANSLATIONS)) {
  for (const [key, slug] of Object.entries(routes)) {
    SLUG_TO_KEY[slug] = key;
  }
}

// ---------------------------------------------------------------------------
// Route components
// ---------------------------------------------------------------------------

/** Redirects / to /{detectedLang}. */
function RootRedirect() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      window.location.replace(`/${initializeLanguage()}`);
    }
  }, [location.pathname]);
  return null;
}

/**
 * Redirects a bare path (e.g. /compare) to /{detectedLang}/{localizedSlug}.
 * Uses SLUG_TO_KEY to find the canonical key, then ROUTE_TRANSLATIONS to
 * find the correct slug for the detected language.
 */
function BarePathRedirect({ slug }: { slug: string }) {
  const lang = initializeLanguage();
  const key = SLUG_TO_KEY[slug] ?? slug;
  const target = ROUTE_TRANSLATIONS[lang]?.[key] ?? slug;
  return <Navigate to={`/${lang}/${target}`} replace />;
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        {/* Admin (no layout wrapper) */}
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/generate-hero-images" element={<AdminHeroImages />} />
        <Route path="/:lang/blog-admin" element={<BlogAdminHub />} />

        {/* Static legal pages (language-agnostic) */}
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
        <Route path="/risk-summary" element={<RiskSummary />} />

        {/* Bare-path redirects: /compare → /en/compare, /comparer → /fr/comparer, etc. */}
        {Object.keys(SLUG_TO_KEY).map((slug) => (
          <Route key={slug} path={`/${slug}`} element={<BarePathRedirect slug={slug} />} />
        ))}

        {/* ── Main app (with Layout) ── */}
        <Route path="/:lang" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Compare tool */}
          {allSlugs('compare').map((slug) => (
            <Route key={slug} path={slug} element={<Compare />} />
          ))}

          {/* Simulator */}
          {allSlugs('simulator').map((slug) => (
            <Route key={slug} path={slug} element={<Simulator />} />
          ))}

          {/* Recommendation quiz */}
          {allSlugs('recommendation').map((slug) => (
            <Route key={slug} path={slug} element={<Recommendation />} />
          ))}

          {/* Favorites */}
          {allSlugs('favorites').map((slug) => (
            <Route key={slug} path={slug} element={<Favorites />} />
          ))}

          {/* Blog */}
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />

          {/* Card detail pages */}
          {allSlugs('cards').map((slug) => (
            <Route key={slug} path={`${slug}/:id`} element={<CardDetail />} />
          ))}

          {/* Thematic SEO pages — generated from THEMATIC_ROUTES config */}
          {Object.entries(THEMATIC_ROUTES).flatMap(([theme, slugs]) =>
            [...new Set(Object.values(slugs))].map((slug) => (
              <Route key={slug} path={slug} element={<ThematicPage theme={theme} />} />
            ))
          )}

          {/* Crypto guide */}
          <Route path="cryptos" element={<CryptoList />} />
          <Route path="cryptos/:symbol" element={<CryptoPage />} />

          {/* A vs B comparison pages */}
          {allSlugs('comparisons').map((slug) => (
            <Route key={`cmp-${slug}`} path={`${slug}/:slug`} element={<ComparisonPage />} />
          ))}

          {/* Reviews */}
          {allSlugs('reviews').map((slug) => (
            [
              <Route key={slug} path={slug} element={<ReviewList />} />,
              <Route key={`${slug}-post`} path={`${slug}/:slug`} element={<ReviewPage />} />,
            ]
          ))}

          {/* Brand pages — /:lang/marques/:brandId, /de/marken/:brandId, etc. */}
          {allSlugs('brands').map((slug) => (
            <Route key={`brand-${slug}`} path={`${slug}/:brandId`} element={<BrandPage />} />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
