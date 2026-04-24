import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Clock, ExternalLink, Tag } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../types/blog';
import { fetchPostBySlug, fetchRelatedPosts } from '../lib/supabase';
import { renderMarkdown, estimateReadTime } from '../utils/markdown';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    fetchPostBySlug(slug)
      .then(async p => {
        if (!p) {
          setNotFound(true);
          return;
        }
        setPost(p);
        const rel = await fetchRelatedPosts(p.tags, p.slug);
        setRelated(rel);
      })
      .finally(() => setLoading(false));
  }, [slug]);

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
        <h1 className="text-3xl font-display font-bold text-white mb-2">Article introuvable</h1>
        <p className="text-slate-500 mb-8">Cet article n'existe pas ou n'est plus disponible.</p>
        <Link to="/blog" className="btn-primary">
          Retour au blog
        </Link>
      </div>
    );
  }

  const readTime = estimateReadTime(post.content);
  const renderedContent = renderMarkdown(post.content);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative">
        {post.image_hero ? (
          <div className="h-72 md:h-96 w-full overflow-hidden">
            <img
              src={post.image_hero}
              alt={post.title}
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
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs font-medium text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} min de lecture
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-app py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Excerpt lead */}
            <p className="text-lg text-slate-300 leading-relaxed mb-8 pb-8 border-b border-bg-border font-medium">
              {post.excerpt}
            </p>

            {/* Rendered markdown */}
            <div
              className="prose-crypto"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* CTA */}
            <div className="mt-12 p-6 card-surface border-cyan-accent/30 text-center">
              <p className="text-slate-300 mb-4 text-lg">
                Prêt à choisir votre carte crypto idéale ?
              </p>
              <Link to="/compare" className="btn-primary inline-flex">
                Comparer toutes les cartes
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          {related.length > 0 && (
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Articles similaires
                </h3>
                <div className="space-y-4">
                  {related.map(rel => (
                    <RelatedCard key={rel.id} post={rel} />
                  ))}
                </div>

                <div className="mt-8 p-5 card-surface border-cyan-accent/20">
                  <h4 className="font-display font-bold text-white mb-2 text-sm">
                    Comparer les cartes
                  </h4>
                  <p className="text-slate-500 text-xs mb-3 leading-relaxed">
                    Utilisez notre comparateur pour trouver la carte crypto qui correspond à votre profil.
                  </p>
                  <Link to="/compare" className="btn-primary w-full text-sm">
                    Accéder au comparateur
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

function RelatedCard({ post }: { post: BlogPostType }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="card-surface flex gap-3 p-3 hover:border-cyan-accent/30 transition-colors group"
    >
      {post.image_hero ? (
        <img
          src={post.image_hero}
          alt={post.title}
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
          {estimateReadTime(post.content)} min
        </p>
      </div>
    </Link>
  );
}
