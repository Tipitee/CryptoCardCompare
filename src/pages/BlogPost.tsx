import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Calendar, Clock, ExternalLink, Tag } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../types/blog';
import { fetchPostBySlug, fetchRelatedPosts } from '../lib/supabase';
import { renderMarkdown, estimateReadTime } from '../utils/markdown';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';

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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('blog');
  const { t: tCards } = useTranslation('cards');
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    fetchPostBySlug(slug, lang)
      .then(async p => {
        if (!p) {
          setNotFound(true);
          return;
        }
        setPost(p);
        const rel = await fetchRelatedPosts(p.tags ?? [], p.slug, lang);
        setRelated(rel);
      })
      .finally(() => setLoading(false));
  }, [slug, lang]);

  // Hooks must always be called — before any early returns
  const tags = post?.tags ?? [];
  const excerpt = post?.excerpt ?? '';
  const readTime = estimateReadTime(post?.content ?? '');
  const renderedContent = renderMarkdown(post?.content ?? '');

  useSeoMeta({
    title: post?.meta_title || (post ? `${post.title} | TopCryptoCards` : 'TopCryptoCards'),
    description: post?.meta_description || post?.excerpt || '',
    image: post?.image_hero || undefined,
    type: 'article',
  });

  useEffect(() => {
    if (!post) return;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || post.meta_description || '',
      image: post.image_hero || 'https://topcryptocards.eu/og-default.jpg',
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: { '@type': 'Organization', name: 'TopCryptoCards', url: 'https://topcryptocards.eu' },
      publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: 'https://topcryptocards.eu' },
    };
    document.getElementById('schema-article')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-article';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-article')?.remove(); };
  }, [post]);

  if (loading) {
    return (
      <div className="container-app py-12 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-1/3" />
          <div className="h-80 bg-bg-elevated rounded-2xl" />
          <div className="h-6 bg-bg-elevated rounded w-2/3" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-bg-elevated rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="container-app py-24 text-center">
        <BookOpen className="w-14 h-14 text-slate-600 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">{t('blog_not_found_title')}</h1>
        <p className="text-slate-500 mb-8">{t('blog_not_found_desc')}</p>
        <Link to={getRoute('blog')} className="btn-primary">
          {t('blog_back_to_blog')}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative">
        {post.image_hero ? (
          <div className="h-72 md:h-96 w-full overflow-hidden">
            <img
              src={post.image_hero}
              alt={post.title}
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
          </div>
        ) : (
          <div className="h-56 md:h-72 w-full bg-gradient-to-br from-bg-elevated via-bg-card to-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 container-app pb-8">
          <Breadcrumb items={[
            { label: 'Home', href: `/${lang}` },
            { label: 'Blog', href: getRoute('blog') },
            { label: post.title },
          ]} />
          <Link
            to={getRoute('blog')}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog_back_to_blog')}
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at, lang)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} {t('blog_read_time')}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {excerpt && (
              <p className="text-lg text-slate-300 leading-relaxed mb-8 pb-8 border-b border-bg-border font-medium">
                {excerpt}
              </p>
            )}

            <div
              className="prose-crypto"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-bg-border">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs font-medium text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-12 p-6 card-surface border-cyan-accent/30 text-center">
              <p className="text-slate-300 mb-4 text-lg">
                {t('blog_cta_text')}
              </p>
              <Link to={getRoute('compare')} className="btn-primary inline-flex">
                {t('blog_cta_btn')}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          {related.length > 0 && (
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  {t('blog_related')}
                </h3>
                <div className="space-y-4">
                  {related.map(rel => (
                    <RelatedCard
                      key={rel.id}
                      post={rel}
                      blogRoute={getRoute('blog')}
                      readDuration={t('blog_read_duration')}
                    />
                  ))}
                </div>

                <div className="mt-8 p-5 card-surface border-cyan-accent/20">
                  <h4 className="font-display font-bold text-white mb-2 text-sm">
                    {tCards('compare_title')}
                  </h4>
                  <p className="text-slate-500 text-xs mb-3 leading-relaxed">
                    {t('blog_sidebar_compare_desc')}
                  </p>
                  <Link to={getRoute('compare')} className="btn-primary w-full text-sm">
                    {t('blog_sidebar_compare_btn')}
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

interface RelatedCardProps {
  post: BlogPostType;
  blogRoute: string;
  readDuration: string;
}

function RelatedCard({ post, blogRoute, readDuration }: RelatedCardProps) {
  return (
    <Link
      to={`${blogRoute}/${post.slug}`}
      className="card-surface flex gap-3 p-3 hover:border-cyan-accent/30 transition-colors group"
    >
      {post.image_hero ? (
        <img
          src={post.image_hero}
          alt={post.title}
          width={64}
          height={64}
          loading="lazy"
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-bg-elevated shrink-0 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-slate-600" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2">
          {post.title}
        </p>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {estimateReadTime(post.content)} {readDuration}
        </p>
      </div>
    </Link>
  );
}