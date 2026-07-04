import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Calendar, Clock, ExternalLink, Tag } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../types/blog';
import { fetchPostBySlug, fetchRelatedPosts, fetchPostVariants } from '../lib/supabase';
import { renderMarkdown, estimateReadTime } from '../utils/markdown';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import Breadcrumb from '../components/Breadcrumb';

const HOME_LABEL: Record<string, string> = {
  fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home',
};

/* ── Thematic slugs (must match ThematicPage.tsx THEMATIC_SLUGS) ── */
const BLOG_THEMATIC_SLUGS: Record<string, Record<string, string>> = {
  cashback:     { fr: 'carte-crypto-cashback',       de: 'krypto-karte-cashback',            es: 'tarjeta-cripto-cashback',         it: 'carta-cripto-cashback',          en: 'crypto-card-cashback' },
  'no-fees':    { fr: 'carte-crypto-sans-frais',     de: 'krypto-karte-ohne-jahresgebuehr',  es: 'tarjeta-cripto-sin-comisiones',   it: 'carta-cripto-senza-commissioni', en: 'crypto-card-no-fees' },
  'no-staking': { fr: 'carte-crypto-sans-staking',   de: 'krypto-karte-ohne-staking',        es: 'tarjeta-cripto-sin-staking',      it: 'carta-cripto-senza-staking',     en: 'crypto-card-no-staking' },
  travel:       { fr: 'carte-crypto-voyage',         de: 'krypto-karte-reise',               es: 'tarjeta-cripto-viaje',            it: 'carta-cripto-viaggio',           en: 'crypto-card-travel' },
  best:         { fr: 'meilleure-carte-crypto',      de: 'beste-krypto-karte',               es: 'mejor-tarjeta-cripto',            it: 'migliore-carta-cripto',          en: 'best-crypto-card' },
  rewards:      { fr: 'carte-crypto-recompenses',    de: 'krypto-karte-praemien',            es: 'tarjeta-cripto-recompensas',      it: 'carta-cripto-premi',             en: 'crypto-card-rewards' },
  virtual:      { fr: 'carte-crypto-virtuelle',      de: 'virtuelle-krypto-karte',           es: 'tarjeta-crypto-virtual',          it: 'carta-crypto-virtuale',          en: 'virtual-crypto-card' },
  beginner:     { fr: 'cartes-crypto-debutant',      de: 'krypto-karten-einsteiger',         es: 'tarjetas-crypto-principiante',    it: 'carte-crypto-principiante',      en: 'beginner-crypto-cards' },
  '2026':       { fr: 'carte-crypto-2026',           de: 'krypto-karte-2026',                es: 'tarjeta-cripto-2026',             it: 'carta-cripto-2026',              en: 'best-crypto-card-2026' },
};
const BLOG_THEMATIC_EMOJI: Record<string, string> = {
  cashback: '💰', 'no-fees': '🆓', 'no-staking': '🔓', travel: '✈️',
  best: '⭐', rewards: '🎁', virtual: '📱', beginner: '🎯', '2026': '🚀',
};
const BLOG_THEMATIC_LABEL: Record<string, Record<string, string>> = {
  cashback:     { fr: 'Cashback',           de: 'Cashback',          es: 'Cashback',         it: 'Cashback',         en: 'Cashback' },
  'no-fees':    { fr: 'Sans frais',         de: 'Ohne Gebühren',     es: 'Sin comisiones',   it: 'Senza costi',      en: 'No fees' },
  'no-staking': { fr: 'Sans staking',       de: 'Ohne Staking',      es: 'Sin staking',      it: 'Senza staking',    en: 'No staking' },
  travel:       { fr: 'Voyage',             de: 'Reisen',            es: 'Viaje',            it: 'Viaggio',          en: 'Travel' },
  best:         { fr: 'Meilleure carte',    de: 'Beste Karte',       es: 'Mejor tarjeta',    it: 'Migliore carta',   en: 'Best card' },
  rewards:      { fr: 'Récompenses',        de: 'Prämien',           es: 'Recompensas',      it: 'Premi',            en: 'Rewards' },
  virtual:      { fr: 'Carte virtuelle',    de: 'Virtuelle Karte',   es: 'Tarjeta virtual',  it: 'Carta virtuale',   en: 'Virtual card' },
  beginner:     { fr: 'Pour débutants',     de: 'Für Einsteiger',    es: 'Para principiantes', it: 'Per principianti', en: 'For beginners' },
  '2026':       { fr: 'Meilleures 2026',   de: 'Beste 2026',        es: 'Mejores 2026',     it: 'Migliori 2026',    en: 'Best 2026' },
};
/** Map tag keywords → theme id */
function tagsToThemes(tags: string[]): string[] {
  const joined = tags.join(' ').toLowerCase();
  const themes: string[] = [];
  if (/cashback/.test(joined))                                       themes.push('cashback');
  if (/no.staking|sans.staking|ohne.staking|senza.staking|sin.staking/.test(joined)) themes.push('no-staking');
  if (/no.fee|sans.frais|ohne.geb|senza.com|sin.comi|gratuit|free|kostenlos/.test(joined)) themes.push('no-fees');
  if (/travel|voyage|reise|viaje|viaggio|abroad|étranger|ausland/.test(joined))      themes.push('travel');
  if (/reward|récompense|pr[äa]mie|recompensa|premio/.test(joined)) themes.push('rewards');
  if (/virtual|virtuel|virtuell/.test(joined))                       themes.push('virtual');
  if (/d[ée]butant|beginner|einsteiger|principiante/.test(joined))  themes.push('beginner');
  if (/\b2026\b/.test(joined))                                       themes.push('2026');
  if (/best|meilleur|beste|mejor|migli/.test(joined))               themes.push('best');
  return [...new Set(themes)].slice(0, 4);
}
const RELATED_PAGES_LABEL: Record<string, string> = {
  fr: 'Pages liées', de: 'Verwandte Seiten', es: 'Páginas relacionadas', it: 'Pagine correlate', en: 'Related pages',
};
const SIMULATOR_LABEL: Record<string, string> = {
  fr: 'Simuler mes gains', de: 'Gewinne simulieren', es: 'Simular mis ganancias', it: 'Simulare i guadagni', en: 'Simulate my earnings',
};
const REVIEWS_LABEL: Record<string, string> = {
  fr: 'Tous les avis cartes', de: 'Alle Kartenbewertungen', es: 'Todas las reseñas', it: 'Tutte le recensioni', en: 'All card reviews',
};

/** Suffix used when title-based fallback meta desc is generated */
const BLOG_META_SUFFIX: Record<string, string> = {
  fr: '— Analyse complète sur TopCryptoCards.',
  de: '— Vollständige Analyse auf TopCryptoCards.',
  es: '— Análisis completo en TopCryptoCards.',
  it: '— Analisi completa su TopCryptoCards.',
  en: '— Full analysis on TopCryptoCards.',
};

function buildBlogMetaDesc(post: { meta_description?: string | null; excerpt?: string | null; title: string } | null, lang: string): string {
  if (!post) return '';
  if (post.meta_description) return post.meta_description;
  if (post.excerpt) {
    const e = post.excerpt.trim();
    return e.length > 157 ? e.slice(0, 154) + '…' : e;
  }
  const suffix = BLOG_META_SUFFIX[lang] ?? BLOG_META_SUFFIX.en;
  const desc = `${post.title} ${suffix}`;
  return desc.length > 157 ? desc.slice(0, 154) + '…' : desc;
}

const DATE_LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  it: 'it-IT',
  en: 'en-GB',
};

function formatDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(DATE_LOCALES[lang] ?? 'fr-FR', {
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
  const [langVariants, setLangVariants] = useState<{ lang: string; slug: string }[]>([]);

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
        // If the fallback returned a post in a different language, redirect to the
        // canonical URL for that language instead of showing wrong-language content.
        if (p.lang && p.lang !== lang) {
          const blogSegment: Record<string, string> = {
            fr: 'blog', de: 'blog', es: 'blog', it: 'blog', en: 'blog',
          };
          window.location.replace(`/${p.lang}/${blogSegment[p.lang] ?? 'blog'}/${p.slug}`);
          return;
        }
        setPost(p);
        const [rel, variants] = await Promise.all([
          fetchRelatedPosts(p.tags ?? [], p.slug, lang),
          p.topic_key ? fetchPostVariants(p.topic_key) : Promise.resolve([]),
        ]);
        setRelated(rel);
        setLangVariants(variants);
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
    description: buildBlogMetaDesc(post, lang),
    image: post?.image_hero || undefined,
    type: 'article',
    lang,
  });

  useEffect(() => {
    if (!post) return;
    const articleUrl = `https://topcryptocards.eu${window.location.pathname}`;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      url: articleUrl,
      headline: post.title,
      description: post.excerpt || post.meta_description || '',
      image: post.image_hero || 'https://topcryptocards.eu/og-default.jpg',
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      inLanguage: post.lang ?? 'fr',
      author: { '@type': 'Organization', name: 'TopCryptoCards', url: 'https://topcryptocards.eu' },
      publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: 'https://topcryptocards.eu', logo: { '@type': 'ImageObject', url: 'https://topcryptocards.eu/logo.png' } },
    };
    document.getElementById('schema-article')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-article';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-article')?.remove(); };
  }, [post]);

  // ── Hreflang — uses topic_key variants for accurate cross-lang URLs ──────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    document.querySelectorAll('link[data-hreflang-blogpost]').forEach(el => el.remove());
    if (langVariants.length > 0) {
      langVariants.forEach(({ lang: l, slug: s }) => {
        const el = document.createElement('link');
        el.rel = 'alternate';
        el.setAttribute('hreflang', l);
        el.setAttribute('href', `${BASE}/${l}/blog/${s}`);
        el.setAttribute('data-hreflang-blogpost', 'true');
        document.head.appendChild(el);
      });
      const frVariant = langVariants.find(v => v.lang === 'fr');
      if (frVariant) {
        const xd = document.createElement('link');
        xd.rel = 'alternate'; xd.setAttribute('hreflang', 'x-default');
        xd.setAttribute('href', `${BASE}/fr/blog/${frVariant.slug}`);
        xd.setAttribute('data-hreflang-blogpost', 'true');
        document.head.appendChild(xd);
      }
    }
    return () => { document.querySelectorAll('link[data-hreflang-blogpost]').forEach(el => el.remove()); };
  }, [langVariants]);

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
            { label: HOME_LABEL[lang] || 'Home', href: `/${lang}` },
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

            {/* Internal links: thematic pages derived from article tags */}
            {(() => {
              const themes = tagsToThemes(tags);
              if (themes.length === 0) return null;
              return (
                <div className="mt-8 p-5 rounded-xl border border-bg-border bg-bg-card">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    {RELATED_PAGES_LABEL[lang] || RELATED_PAGES_LABEL.en}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {themes.map(theme => {
                      const slug = BLOG_THEMATIC_SLUGS[theme]?.[lang] ?? BLOG_THEMATIC_SLUGS[theme]?.en;
                      const label = BLOG_THEMATIC_LABEL[theme]?.[lang] ?? BLOG_THEMATIC_LABEL[theme]?.en;
                      const emoji = BLOG_THEMATIC_EMOJI[theme];
                      if (!slug || !label) return null;
                      return (
                        <Link
                          key={theme}
                          to={`/${lang}/${slug}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
                        >
                          <span>{emoji}</span>
                          {label}
                        </Link>
                      );
                    })}
                    <Link
                      to={`/${lang}/${ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.reviews ?? 'reviews'}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
                    >
                      <span>📝</span>
                      {REVIEWS_LABEL[lang] || REVIEWS_LABEL.en}
                    </Link>
                  </div>
                </div>
              );
            })()}
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
                  <Link to={getRoute('simulator')} className="btn-ghost w-full text-sm mt-2 border border-bg-border flex justify-center items-center gap-1.5">
                    🧮 {SIMULATOR_LABEL[lang] || SIMULATOR_LABEL.en}
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