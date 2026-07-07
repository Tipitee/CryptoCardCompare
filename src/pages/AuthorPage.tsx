import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Clock, ExternalLink, User } from 'lucide-react';
import { AUTHORS } from '../data/authors';
import { fetchPublishedPosts } from '../lib/supabase';
import type { BlogPost } from '../types/blog';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { estimateReadTime } from '../utils/markdown';
import Breadcrumb from '../components/Breadcrumb';

const HOME_LABEL: Record<string, string> = {
  fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home',
};
const BLOG_LABEL: Record<string, string> = {
  fr: 'Blog', de: 'Blog', es: 'Blog', it: 'Blog', en: 'Blog',
};
const READ_MORE_LABEL: Record<string, string> = {
  fr: "Lire l'article", de: 'Artikel lesen', es: 'Leer artículo', it: "Leggi l'articolo", en: 'Read article',
};
const READ_DURATION_LABEL: Record<string, string> = {
  fr: 'min de lecture', de: 'Min. Lesezeit', es: 'min de lectura', it: 'min di lettura', en: 'min read',
};
const ARTICLES_LABEL: Record<string, string> = {
  fr: 'Articles publiés', de: 'Veröffentlichte Artikel', es: 'Artículos publicados', it: 'Articoli pubblicati', en: 'Published articles',
};
const NOT_FOUND_LABEL: Record<string, string> = {
  fr: 'Auteur introuvable', de: 'Autor nicht gefunden', es: 'Autor no encontrado', it: 'Autore non trovato', en: 'Author not found',
};
const EXPERTISE_LABEL: Record<string, string> = {
  fr: "Domaine d'expertise", de: 'Fachgebiet', es: 'Área de experiencia', it: 'Area di competenza', en: 'Area of expertise',
};
const EXPERTISE_VALUE: Record<string, string> = {
  fr: 'Cartes crypto · Fintech · Régulation MiCA',
  de: 'Krypto-Karten · Fintech · MiCA-Regulierung',
  es: 'Tarjetas cripto · Fintech · Regulación MiCA',
  it: 'Carte crypto · Fintech · Regolazione MiCA',
  en: 'Crypto cards · Fintech · MiCA regulation',
};
const SINCE_LABEL: Record<string, string> = {
  fr: 'Sur TopCryptoCards depuis', de: 'Auf TopCryptoCards seit', es: 'En TopCryptoCards desde', it: 'Su TopCryptoCards dal', en: 'On TopCryptoCards since',
};

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const lang = useLanguage();
  const author = id ? AUTHORS[id] : null;
  const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedPosts(lang)
      .then(all => setPosts(all.slice(0, 18)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [lang]);

  useSeoMeta({
    title: author
      ? `${author.name} — TopCryptoCards`
      : (NOT_FOUND_LABEL[lang] ?? NOT_FOUND_LABEL.en),
    description: author
      ? (author.bio[lang] ?? author.bio.en)
      : '',
    lang,
  });

  // ── Hreflang ────────────────────────────────────────────────────────────────
  useHreflang(
    author ? Object.entries(author.urls).map(([l, path]) => ({ lang: l, href: `https://topcryptocards.eu${path}` })) : null,
    [author],
    { xDefault: author ? `https://topcryptocards.eu${author.urls.en}` : undefined },
  );

  // ── Schema.org Person ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!author) return;
    const BASE = 'https://topcryptocards.eu';
    document.getElementById('schema-author')?.remove();
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author.name,
      url: `${BASE}${author.urls[lang] ?? author.urls.en}`,
      description: author.bio[lang] ?? author.bio.en,
      image: author.avatar ? `${BASE}${author.avatar}` : undefined,
      worksFor: { '@type': 'Organization', name: 'TopCryptoCards', url: BASE },
      knowsAbout: ['crypto cards', 'cryptocurrency', 'cashback', 'fintech', 'MiCA regulation'],
      ...(author.sameAs.length ? { sameAs: author.sameAs } : {}),
    };
    const el = document.createElement('script');
    el.id = 'schema-author'; el.type = 'application/ld+json';
    el.text = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-author')?.remove(); };
  }, [author, lang]);

  if (!author) {
    return (
      <div className="container-app py-16 text-center text-slate-400">
        {NOT_FOUND_LABEL[lang] ?? NOT_FOUND_LABEL.en}
      </div>
    );
  }

  const blogSlug = rt.blog ?? 'blog';

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="container-app pt-6 pb-4">
        <Breadcrumb items={[
          { label: HOME_LABEL[lang] ?? 'Home', href: `/${lang}` },
          { label: ARTICLES_LABEL[lang] ?? 'Articles', href: `/${lang}/${blogSlug}` },
          { label: author.name },
        ]} />
      </div>

      {/* Hero */}
      <div className="container-app pb-10">
        <div className="card-surface p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {/* Avatar */}
          <div className="shrink-0">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover ring-2 ring-cyan-accent/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-bg-elevated flex items-center justify-center ring-2 ring-bg-border">
                <User className="w-10 h-10 text-slate-500" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              {author.name}
            </h1>
            <p className="text-slate-300 text-base leading-relaxed mb-4 max-w-xl">
              {author.bio[lang] ?? author.bio.en}
            </p>

            <dl className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2 text-sm mb-4">
              <div>
                <dt className="text-slate-500 text-xs uppercase tracking-wide">{EXPERTISE_LABEL[lang] ?? EXPERTISE_LABEL.en}</dt>
                <dd className="text-slate-300 font-medium">{EXPERTISE_VALUE[lang] ?? EXPERTISE_VALUE.en}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs uppercase tracking-wide">{SINCE_LABEL[lang] ?? SINCE_LABEL.en}</dt>
                <dd className="text-slate-300 font-medium">2024</dd>
              </div>
            </dl>

            {author.sameAs.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {author.sameAs.map(url => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-bg-border text-xs text-slate-400 hover:text-cyan-accent hover:border-cyan-accent/30 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {url.includes('linkedin') ? 'LinkedIn' : url.includes('x.com') || url.includes('twitter') ? 'X / Twitter' : new URL(url).hostname}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="container-app">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-accent" />
          {ARTICLES_LABEL[lang] ?? ARTICLES_LABEL.en}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-surface h-40 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-slate-500 text-sm">{BLOG_LABEL[lang]}: —</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/${lang}/${blogSlug}/${post.slug}`}
                className="card-surface flex flex-col gap-3 p-4 hover:border-cyan-accent/30 transition-colors group"
              >
                {post.image_hero ? (
                  <img
                    src={post.image_hero}
                    alt={post.title}
                    width={400}
                    height={160}
                    loading="lazy"
                    className="w-full h-28 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-28 rounded-lg bg-bg-elevated flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-slate-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2 mb-1">
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {estimateReadTime(post.content)} {READ_DURATION_LABEL[lang] ?? READ_DURATION_LABEL.en}
                  </p>
                </div>
                <span className="text-xs text-cyan-accent font-medium group-hover:underline">
                  {READ_MORE_LABEL[lang] ?? READ_MORE_LABEL.en} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
