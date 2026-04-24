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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
