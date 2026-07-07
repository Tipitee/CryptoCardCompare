import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';

import Layout from './components/Layout';
// Home chargé en eager (page d'atterrissage principale)
import Home from './pages/Home';

// Toutes les autres pages en lazy — réduit le bundle initial significativement
const Compare              = lazy(() => import('./pages/Compare'));
const Simulator            = lazy(() => import('./pages/Simulator'));
const Recommendation       = lazy(() => import('./pages/Recommendation'));
const Favorites            = lazy(() => import('./pages/Favorites'));
const Blog                 = lazy(() => import('./pages/Blog'));
const BlogPost             = lazy(() => import('./pages/BlogPost'));
const AdminBlog            = lazy(() => import('./pages/AdminBlog'));
const AdminHeroImages      = lazy(() => import('./pages/AdminHeroImages'));
const BlogAdminHub         = lazy(() => import('./pages/BlogAdminHub'));
const Impressum            = lazy(() => import('./pages/Impressum'));
const Datenschutz          = lazy(() => import('./pages/Datenschutz'));
const Privacy              = lazy(() => import('./pages/Privacy'));
const AffiliateDisclosurePage = lazy(() => import('./pages/AffiliateDisclosurePage'));
const MethodologyPage      = lazy(() => import('./pages/MethodologyPage'));
const BlogCategoryPage     = lazy(() => import('./pages/BlogCategoryPage'));
const RiskSummary          = lazy(() => import('./pages/RiskSummary'));
const CardDetail           = lazy(() => import('./pages/CardDetail'));
const ThematicPage         = lazy(() => import('./pages/ThematicPage'));
const ComparisonPage       = lazy(() => import('./pages/ComparisonPage'));
const CryptoList           = lazy(() => import('./pages/CryptoList'));
const CryptoPage           = lazy(() => import('./pages/CryptoPage'));
const ReviewList           = lazy(() => import('./pages/ReviewList'));
const ReviewPage           = lazy(() => import('./pages/ReviewPage'));
const NotFound             = lazy(() => import('./pages/NotFound'));
const BrandPage            = lazy(() => import('./pages/BrandPage'));
const BrandList            = lazy(() => import('./pages/BrandList'));
const About                = lazy(() => import('./pages/About'));
const AuthorPage           = lazy(() => import('./pages/AuthorPage'));
const VirtualVsPhysical    = lazy(() => import('./pages/VirtualVsPhysicalPage'));

import { ROUTE_TRANSLATIONS } from './i18n/types';
import { initializeLanguage } from './i18n/utils';
import { THEMATIC_ROUTES, VVP_SLUGS } from './config/routes';

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

// Fallback minimal pour Suspense (pas de spinner visible, juste blanc momentané)
function PageLoader() {
  return <div style={{ minHeight: '100vh' }} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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

        {/* Affiliate disclosure — lang-prefixed standalone routes (own header/footer, no Layout) */}
        <Route path="/:lang/affiliate-disclosure"      element={<AffiliateDisclosurePage />} />
        <Route path="/:lang/divulgation-affilies"      element={<AffiliateDisclosurePage />} />
        <Route path="/:lang/affiliate-offenlegung"     element={<AffiliateDisclosurePage />} />
        <Route path="/:lang/divulgacion-afiliados"     element={<AffiliateDisclosurePage />} />
        <Route path="/:lang/divulgazione-affiliati"    element={<AffiliateDisclosurePage />} />

        {/* Methodology — lang-prefixed standalone routes */}
        <Route path="/:lang/methodology"               element={<MethodologyPage />} />
        <Route path="/:lang/methodologie"              element={<MethodologyPage />} />
        <Route path="/:lang/methodik"                  element={<MethodologyPage />} />
        <Route path="/:lang/metodologia"               element={<MethodologyPage />} />

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

          {/* Blog category hubs — /:lang/blog/{categorie|kategorie|categoria|category}/:category */}
          <Route path="blog/categorie/:category"  element={<BlogCategoryPage />} />
          <Route path="blog/kategorie/:category"  element={<BlogCategoryPage />} />
          <Route path="blog/categoria/:category"  element={<BlogCategoryPage />} />
          <Route path="blog/category/:category"   element={<BlogCategoryPage />} />

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

          {/* Virtual vs Physical comparison page */}
          {[...new Set(Object.values(VVP_SLUGS))].map((slug) => (
            <Route key={`vvp-${slug}`} path={slug} element={<VirtualVsPhysical />} />
          ))}

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

          {/* Brand list — /:lang/marques, /de/marken, etc. */}
          {allSlugs('brands').map((slug) => (
            <Route key={`brands-list-${slug}`} path={slug} element={<BrandList />} />
          ))}

          {/* Brand pages — /:lang/marques/:brandId, /de/marken/:brandId, etc. */}
          {allSlugs('brands').map((slug) => (
            <Route key={`brand-${slug}`} path={`${slug}/:brandId`} element={<BrandPage />} />
          ))}

          {/* About / Methodology */}
          {allSlugs('about').map((slug) => (
            <Route key={`about-${slug}`} path={slug} element={<About />} />
          ))}

          {/* Author pages — /:lang/auteurs/:id, /de/autoren/:id, etc. */}
          {allSlugs('authors').map((slug) => (
            <Route key={`author-${slug}`} path={`${slug}/:id`} element={<AuthorPage />} />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
