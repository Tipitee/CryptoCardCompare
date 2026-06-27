import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Calendar, Clock, Search } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { fetchPublishedPosts } from '../lib/supabase';
import { estimateReadTime } from '../utils/markdown';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';

const PAGE_SIZE = 6;

const DATE_LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  it: 'it-IT',
  en: 'en-GB',
};

function formatDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(DATE_LOCALES[lang] ?? 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Blog() {
  const { t } = useTranslation('blog');
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useSeoMeta({
    title: `${t('blog_header_title')} | TopCryptoCards`,
    description: t('blog_header_desc'),
    lang,
  });

  // ── Hreflang ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    document.querySelectorAll('link[data-hreflang-blog]').forEach(el => el.remove());
    ['fr', 'de', 'es', 'it', 'en'].forEach(l => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/blog`);
      el.setAttribute('data-hreflang-blog', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate'; xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/blog`);
    xd.setAttribute('data-hreflang-blog', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-blog]').forEach(el => el.remove()); };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPublishedPosts(lang)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [lang]);

  // Schema.org CollectionPage for blog listing
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const BLOG_LABELS: Record<string, string> = {
      fr: 'Blog — Guides et Actualités Cartes Crypto',
      de: 'Blog — Guides und Neuigkeiten Krypto-Karten',
      es: 'Blog — Guías y Noticias Tarjetas Crypto',
      it: 'Blog — Guide e Notizie Carte Crypto',
      en: 'Blog — Crypto Card Guides and News',
    };
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: BLOG_LABELS[lang] ?? BLOG_LABELS['en'],
      url: `${BASE}/${lang}/blog`,
      inLanguage: lang,
      publisher: {
        '@type': 'Organization',
        name: 'TopCryptoCards',
        url: BASE,
      },
    };
    document.getElementById('schema-blog-collection')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-blog-collection';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-blog-collection')?.remove(); };
  }, [lang]);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const q = search.toLowerCase();
      return !q || p.title.toLowerCase().includes(q) || (p.excerpt ?? '').toLowerCase().includes(q);
    });
  }, [posts, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  return (
    <div className="container-app py-12 animate-fade-in">
      <Breadcrumb items={[
        { label: { fr:'Accueil',de:'Startseite',es:'Inicio',it:'Home',en:'Home' }[lang] || 'Home', href: `/${lang}` },
        { label: t('blog_header_badge') },
      ]} />
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <BookOpen className="w-4 h-4" />
          {t('blog_header_badge')}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          {t('blog_header_title')}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {t('blog_header_desc')}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={t('blog_search_placeholder')}
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>

      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-surface animate-pulse">
              <div className="h-48 bg-bg-elevated rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-bg-elevated rounded w-1/3" />
                <div className="h-6 bg-bg-elevated rounded w-4/5" />
                <div className="h-4 bg-bg-elevated rounded w-full" />
                <div className="h-4 bg-bg-elevated rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-24">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-white mb-2">
            {posts.length === 0 ? t('blog_no_articles') : t('blog_no_results')}
          </h3>
          <p className="text-slate-500 mb-6">
            {posts.length === 0 ? t('blog_coming_soon') : t('blog_try_other')}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="btn-secondary"
            >
              {t('blog_clear_filters')}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(post => (
              <ArticleCard
                key={post.id}
                post={post}
                lang={lang}
                blogRoute={getRoute('blog')}
                readDuration={t('blog_read_duration')}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('blog_previous')}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    n === page
                      ? 'bg-cyan-accent text-bg font-bold'
                      : 'btn-ghost'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('blog_next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ArticleCardProps {
  post: BlogPost;
  lang: string;
  blogRoute: string;
  readDuration: string;
}

function ArticleCard({ post, lang, blogRoute, readDuration }: ArticleCardProps) {
  const readTime = estimateReadTime(post.content);

  return (
    <Link
      to={`${blogRoute}/${post.slug}`}
      className="card-surface flex flex-col overflow-hidden group hover:border-cyan-accent/50 hover:shadow-lg hover:shadow-cyan-accent/10 transition-all duration-300"
    >
      {post.image_hero ? (
        <div className="h-48 overflow-hidden shrink-0 bg-gradient-to-br from-slate-800 to-slate-900">
          <img
            src={post.image_hero}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-48 shrink-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-cyan-accent/8 blur-2xl" />
            <div className="absolute bottom-4 right-6 w-24 h-24 rounded-full bg-cyan-accent/6 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3 opacity-30">
            <BookOpen className="w-10 h-10 text-cyan-accent" />
            <div className="flex gap-1.5">
              <div className="w-16 h-1.5 rounded-full bg-cyan-accent" />
              <div className="w-8 h-1.5 rounded-full bg-cyan-accent/60" />
            </div>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {lang === 'fr' && (post.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(post.tags ?? []).slice(0, 3).map(tag => (
              <span key={tag} className="text-xs font-semibold text-cyan-accent bg-cyan-accent/15 px-2.5 py-1 rounded-full border border-cyan-accent/30 group-hover:border-cyan-accent/60 group-hover:bg-cyan-accent/25 transition-all">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="font-display font-bold text-white text-lg leading-snug mb-2 group-hover:text-cyan-accent transition-colors duration-200 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3 group-hover:text-slate-300 transition-colors">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-3 border-t border-bg-border/50 group-hover:border-cyan-accent/30 transition-colors">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.created_at, lang)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readTime} {readDuration}
          </span>
        </div>
      </div>
    </Link>
  );
}
