import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, Clock, Layers } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { fetchPostsByCategory } from '../lib/supabase';
import { estimateReadTime } from '../utils/markdown';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import Breadcrumb from '../components/Breadcrumb';
import { THEMATIC_ROUTES } from '../config/routes';

// ── Category segment slug (the part BEFORE /:category in the URL) ────────────
export const BLOG_CAT_SLUG: Record<string, string> = {
  fr: 'categorie',
  de: 'kategorie',
  es: 'categoria',
  it: 'categoria',
  en: 'category',
};

// ── Category keys supported (= values stored in blog_posts.category) ─────────
const CATEGORIES = ['card', 'crypto', 'guide'] as const;
type CategoryKey = typeof CATEGORIES[number];

// ── i18n labels per category × lang ──────────────────────────────────────────
const CAT_LABEL: Record<CategoryKey, Record<string, string>> = {
  card: {
    fr: 'Articles sur les Cartes Crypto',
    de: 'Artikel über Krypto-Karten',
    es: 'Artículos sobre Tarjetas Crypto',
    it: 'Articoli sulle Carte Crypto',
    en: 'Crypto Card Articles',
  },
  crypto: {
    fr: 'Guides Cryptomonnaies',
    de: 'Kryptowährungs-Ratgeber',
    es: 'Guías de Criptomonedas',
    it: 'Guide sulle Criptovalute',
    en: 'Cryptocurrency Guides',
  },
  guide: {
    fr: 'Guides & Tutoriels',
    de: 'Guides & Anleitungen',
    es: 'Guías & Tutoriales',
    it: 'Guide & Tutorial',
    en: 'Guides & Tutorials',
  },
};

const CAT_DESC: Record<CategoryKey, Record<string, string>> = {
  card: {
    fr: `Tous nos articles et guides sur les cartes crypto : comparatifs, analyses de cashback, frais, disponibilité par pays, et conseils pour choisir la carte adaptée à votre profil en ${new Date().getFullYear()}.`,
    de: `Alle unsere Artikel und Guides zu Krypto-Karten: Vergleiche, Cashback-Analysen, Gebühren, Verfügbarkeit nach Land und Tipps zur Auswahl der richtigen Karte für Ihr Profil in ${new Date().getFullYear()}.`,
    es: `Todos nuestros artículos y guías sobre tarjetas crypto: comparativas, análisis de cashback, comisiones, disponibilidad por país y consejos para elegir la tarjeta adecuada a tu perfil en ${new Date().getFullYear()}.`,
    it: `Tutti i nostri articoli e guide sulle carte crypto: comparazioni, analisi di cashback, commissioni, disponibilità per paese e consigli per scegliere la carta adatta al tuo profilo nel ${new Date().getFullYear()}.`,
    en: `All our articles and guides on crypto cards: comparisons, cashback analyses, fees, availability by country, and tips to choose the card that matches your profile in ${new Date().getFullYear()}.`,
  },
  crypto: {
    fr: `Nos guides complets sur les cryptomonnaies : Bitcoin, Ethereum, Solana, BNB, XRP et plus. Comprendre comment utiliser vos cryptos au quotidien avec une carte de paiement crypto en ${new Date().getFullYear()}.`,
    de: `Unsere umfassenden Kryptowährungs-Ratgeber: Bitcoin, Ethereum, Solana, BNB, XRP und mehr. Verstehen Sie, wie Sie Ihre Kryptos im Alltag mit einer Krypto-Zahlungskarte nutzen können in ${new Date().getFullYear()}.`,
    es: `Nuestras guías completas sobre criptomonedas: Bitcoin, Ethereum, Solana, BNB, XRP y más. Aprende a usar tus criptos en el día a día con una tarjeta de pago crypto en ${new Date().getFullYear()}.`,
    it: `Le nostre guide complete sulle criptovalute: Bitcoin, Ethereum, Solana, BNB, XRP e altro. Scopri come usare le tue crypto nella vita quotidiana con una carta di pagamento crypto nel ${new Date().getFullYear()}.`,
    en: `Our comprehensive guides on cryptocurrencies: Bitcoin, Ethereum, Solana, BNB, XRP and more. Learn how to use your crypto in everyday life with a crypto payment card in ${new Date().getFullYear()}.`,
  },
  guide: {
    fr: `Nos guides pratiques pour tout comprendre sur les cartes crypto : staking, cashback, KYC, MiCA, fiscalité et conseils pour débuter. Rédigés par des experts et mis à jour en ${new Date().getFullYear()}.`,
    de: `Unsere praktischen Guides zum Verständnis von Krypto-Karten: Staking, Cashback, KYC, MiCA, Besteuerung und Einsteiger-Tipps. Von Experten verfasst und aktualisiert in ${new Date().getFullYear()}.`,
    es: `Nuestras guías prácticas para entender todo sobre las tarjetas crypto: staking, cashback, KYC, MiCA, fiscalidad y consejos para principiantes. Escritas por expertos y actualizadas en ${new Date().getFullYear()}.`,
    it: `Le nostre guide pratiche per capire tutto sulle carte crypto: staking, cashback, KYC, MiCA, fiscalità e consigli per iniziare. Scritte da esperti e aggiornate nel ${new Date().getFullYear()}.`,
    en: `Our practical guides to understand everything about crypto cards: staking, cashback, KYC, MiCA, taxation and beginner tips. Written by experts and updated in ${new Date().getFullYear()}.`,
  },
};

const CAT_META_TITLE: Record<CategoryKey, Record<string, string>> = {
  card: {
    fr: `Articles Cartes Crypto ${new Date().getFullYear()}, Guides & Comparatifs | TopCryptoCards`,
    de: `Krypto-Karten Artikel ${new Date().getFullYear()}, Guides & Vergleiche | TopCryptoCards`,
    es: `Artículos Tarjetas Crypto ${new Date().getFullYear()}, Guías & Comparativas | TopCryptoCards`,
    it: `Articoli Carte Crypto ${new Date().getFullYear()}, Guide & Confronti | TopCryptoCards`,
    en: `Crypto Card Articles ${new Date().getFullYear()}, Guides & Comparisons | TopCryptoCards`,
  },
  crypto: {
    fr: `Guides Cryptomonnaies ${new Date().getFullYear()}, Bitcoin, ETH, SOL & Plus | TopCryptoCards`,
    de: `Kryptowährungs-Guides ${new Date().getFullYear()}, Bitcoin, ETH, SOL & Mehr | TopCryptoCards`,
    es: `Guías Criptomonedas ${new Date().getFullYear()}, Bitcoin, ETH, SOL & Más | TopCryptoCards`,
    it: `Guide Criptovalute ${new Date().getFullYear()}, Bitcoin, ETH, SOL & Altro | TopCryptoCards`,
    en: `Cryptocurrency Guides ${new Date().getFullYear()}, Bitcoin, ETH, SOL & More | TopCryptoCards`,
  },
  guide: {
    fr: `Guides Cartes Crypto ${new Date().getFullYear()}, Staking, Cashback, MiCA | TopCryptoCards`,
    de: `Krypto-Karten Guides ${new Date().getFullYear()}, Staking, Cashback, MiCA | TopCryptoCards`,
    es: `Guías Tarjetas Crypto ${new Date().getFullYear()}, Staking, Cashback, MiCA | TopCryptoCards`,
    it: `Guide Carte Crypto ${new Date().getFullYear()}, Staking, Cashback, MiCA | TopCryptoCards`,
    en: `Crypto Card Guides ${new Date().getFullYear()}, Staking, Cashback, MiCA | TopCryptoCards`,
  },
};

const CAT_META_DESC: Record<CategoryKey, Record<string, string>> = {
  card: {
    fr: `Explorez ${new Date().getFullYear()} guides sur les cartes crypto en Europe : cashback, staking, frais, comparatifs Crypto.com, Binance, Bybit, Nexo, OKX et plus.`,
    de: `Entdecken Sie ${new Date().getFullYear()} Guides zu Krypto-Karten in Europa: Cashback, Staking, Gebühren, Vergleiche Crypto.com, Binance, Bybit, Nexo, OKX und mehr.`,
    es: `Explora guías ${new Date().getFullYear()} sobre tarjetas crypto en Europa: cashback, staking, comisiones, comparativas Crypto.com, Binance, Bybit, Nexo, OKX y más.`,
    it: `Esplora guide ${new Date().getFullYear()} sulle carte crypto in Europa: cashback, staking, commissioni, confronti Crypto.com, Binance, Bybit, Nexo, OKX e altro.`,
    en: `Explore ${new Date().getFullYear()} guides on crypto cards in Europe: cashback, staking, fees, comparisons Crypto.com, Binance, Bybit, Nexo, OKX and more.`,
  },
  crypto: {
    fr: `Guides complets sur les cryptomonnaies majeures : Bitcoin, Ethereum, Solana, BNB, XRP. Comment acheter, stocker et dépenser vos cryptos avec une carte en ${new Date().getFullYear()}.`,
    de: `Umfassende Guides zu wichtigen Kryptowährungen: Bitcoin, Ethereum, Solana, BNB, XRP. Wie man Kryptos kauft, speichert und mit einer Karte ausgibt in ${new Date().getFullYear()}.`,
    es: `Guías completas sobre las principales criptomonedas: Bitcoin, Ethereum, Solana, BNB, XRP. Cómo comprar, almacenar y gastar tus criptos con una tarjeta en ${new Date().getFullYear()}.`,
    it: `Guide complete sulle principali criptovalute: Bitcoin, Ethereum, Solana, BNB, XRP. Come acquistare, conservare e spendere le tue crypto con una carta nel ${new Date().getFullYear()}.`,
    en: `Complete guides on major cryptocurrencies: Bitcoin, Ethereum, Solana, BNB, XRP. How to buy, store and spend your crypto with a card in ${new Date().getFullYear()}.`,
  },
  guide: {
    fr: `Guides pratiques pour maîtriser les cartes crypto en ${new Date().getFullYear()} : staking, cashback, réglementation MiCA, KYC, fiscalité. Tout comprendre pour bien choisir.`,
    de: `Praktische Guides zur Nutzung von Krypto-Karten in ${new Date().getFullYear()}: Staking, Cashback, MiCA-Regulierung, KYC, Besteuerung. Alles verstehen, um richtig zu wählen.`,
    es: `Guías prácticas para dominar las tarjetas crypto en ${new Date().getFullYear()}: staking, cashback, regulación MiCA, KYC, fiscalidad. Todo para elegir bien.`,
    it: `Guide pratiche per padroneggiare le carte crypto nel ${new Date().getFullYear()}: staking, cashback, regolamentazione MiCA, KYC, fiscalità. Tutto per scegliere bene.`,
    en: `Practical guides to master crypto cards in ${new Date().getFullYear()}: staking, cashback, MiCA regulation, KYC, taxation. Everything to choose wisely.`,
  },
};

// ── UI labels ─────────────────────────────────────────────────────────────────
const L: Record<string, {
  home: string; blog: string; readDuration: string; noArticles: string;
  allCategories: string; allBlog: string; readArticle: string;
  otherCategories: string; thematicLinks: string; previous: string; next: string;
}> = {
  fr: {
    home: 'Accueil', blog: 'Blog', readDuration: 'min de lecture',
    noArticles: 'Aucun article dans cette catégorie pour le moment.',
    allCategories: 'Toutes les catégories', allBlog: 'Voir tous les articles',
    readArticle: 'Lire l\'article', otherCategories: 'Autres catégories',
    thematicLinks: 'Guides thématiques associés', previous: 'Précédent', next: 'Suivant',
  },
  de: {
    home: 'Startseite', blog: 'Blog', readDuration: 'Min Lesezeit',
    noArticles: 'Noch keine Artikel in dieser Kategorie.',
    allCategories: 'Alle Kategorien', allBlog: 'Alle Artikel ansehen',
    readArticle: 'Artikel lesen', otherCategories: 'Weitere Kategorien',
    thematicLinks: 'Verwandte thematische Guides', previous: 'Zurück', next: 'Weiter',
  },
  es: {
    home: 'Inicio', blog: 'Blog', readDuration: 'min de lectura',
    noArticles: 'Ningún artículo en esta categoría por el momento.',
    allCategories: 'Todas las categorías', allBlog: 'Ver todos los artículos',
    readArticle: 'Leer el artículo', otherCategories: 'Otras categorías',
    thematicLinks: 'Guías temáticas relacionadas', previous: 'Anterior', next: 'Siguiente',
  },
  it: {
    home: 'Home', blog: 'Blog', readDuration: 'min di lettura',
    noArticles: 'Nessun articolo in questa categoria per il momento.',
    allCategories: 'Tutte le categorie', allBlog: 'Vedi tutti gli articoli',
    readArticle: 'Leggi l\'articolo', otherCategories: 'Altre categorie',
    thematicLinks: 'Guide tematiche correlate', previous: 'Precedente', next: 'Successivo',
  },
  en: {
    home: 'Home', blog: 'Blog', readDuration: 'min read',
    noArticles: 'No articles in this category yet.',
    allCategories: 'All categories', allBlog: 'View all articles',
    readArticle: 'Read article', otherCategories: 'Other categories',
    thematicLinks: 'Related thematic guides', previous: 'Previous', next: 'Next',
  },
};

const DATE_LOCALES: Record<string, string> = {
  fr: 'fr-FR', de: 'de-DE', es: 'es-ES', it: 'it-IT', en: 'en-GB',
};

function formatDate(iso: string, lang: string): string {
  return new Date(iso).toLocaleDateString(DATE_LOCALES[lang] ?? 'fr-FR', {
    month: 'long', year: 'numeric',
  });
}

// ── Thematic links per category ───────────────────────────────────────────────
const CAT_THEMATIC_LINKS: Record<CategoryKey, { key: string; emoji: string; label: Record<string, string> }[]> = {
  card: [
    { key: 'best',       emoji: '🏆', label: { fr: 'Meilleures cartes', de: 'Beste Karten', es: 'Mejores tarjetas', it: 'Migliori carte', en: 'Best cards' } },
    { key: 'cashback',   emoji: '💰', label: { fr: 'Cartes cashback', de: 'Cashback-Karten', es: 'Tarjetas cashback', it: 'Carte cashback', en: 'Cashback cards' } },
    { key: 'no-fees',    emoji: '🚫', label: { fr: 'Sans frais annuels', de: 'Ohne Jahresgebühren', es: 'Sin comisiones', it: 'Senza commissioni', en: 'No annual fees' } },
    { key: 'no-staking', emoji: '🔓', label: { fr: 'Sans staking', de: 'Ohne Staking', es: 'Sin staking', it: 'Senza staking', en: 'No staking' } },
  ],
  crypto: [
    { key: 'best',     emoji: '🏆', label: { fr: 'Meilleures cartes', de: 'Beste Karten', es: 'Mejores tarjetas', it: 'Migliori carte', en: 'Best cards' } },
    { key: 'rewards',  emoji: '🎁', label: { fr: 'Récompenses crypto', de: 'Krypto-Prämien', es: 'Recompensas crypto', it: 'Premi crypto', en: 'Crypto rewards' } },
    { key: 'staking',  emoji: '🔒', label: { fr: 'Staking & récompenses', de: 'Staking & Prämien', es: 'Staking & recompensas', it: 'Staking & premi', en: 'Staking & rewards' } },
  ],
  guide: [
    { key: 'beginner', emoji: '🌱', label: { fr: 'Guide débutant', de: 'Einsteiger-Guide', es: 'Guía principiantes', it: 'Guida principianti', en: 'Beginner guide' } },
    { key: 'no-kyc',   emoji: '🕵️', label: { fr: 'Sans KYC', de: 'Ohne KYC', es: 'Sin KYC', it: 'Senza KYC', en: 'No KYC' } },
    { key: 'virtual',  emoji: '💳', label: { fr: 'Cartes virtuelles', de: 'Virtuelle Karten', es: 'Tarjetas virtuales', it: 'Carte virtuali', en: 'Virtual cards' } },
    { key: 'travel',   emoji: '✈️', label: { fr: 'Voyage', de: 'Reisen', es: 'Viajes', it: 'Viaggi', en: 'Travel' } },
  ],
};

const PAGE_SIZE = 9;

// ── Main component ─────────────────────────────────────────────────────────────
export default function BlogCategoryPage() {
  const lang = useLanguage();
  const { category = '' } = useParams<{ category: string }>();
  const { getRoute } = useLocalizedRoute();

  const isValid = CATEGORIES.includes(category as CategoryKey);
  const cat = (isValid ? category : 'card') as CategoryKey;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const l = L[lang] ?? L.en;
  const labels = CAT_LABEL[cat] ?? CAT_LABEL.card;
  const catTitle = labels[lang] ?? labels.en;
  const catDesc = (CAT_DESC[cat] ?? CAT_DESC.card)[lang] ?? (CAT_DESC[cat] ?? CAT_DESC.card).en;
  const metaTitle = (CAT_META_TITLE[cat] ?? CAT_META_TITLE.card)[lang] ?? (CAT_META_TITLE[cat] ?? CAT_META_TITLE.card).en;
  const metaDesc = (CAT_META_DESC[cat] ?? CAT_META_DESC.card)[lang] ?? (CAT_META_DESC[cat] ?? CAT_META_DESC.card).en;

  const catSlug = BLOG_CAT_SLUG[lang] ?? 'category';
  const blogRoute = getRoute('blog');

  useSeoMeta({ title: metaTitle, description: metaDesc, lang });

  // Hreflang
  useHreflang(
    l => `https://topcryptocards.eu/${l}/blog/${BLOG_CAT_SLUG[l] ?? 'category'}/${cat}`,
    [cat],
  );

  // BreadcrumbList schema
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: l.home, item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/${lang}/blog` },
        { '@type': 'ListItem', position: 3, name: catTitle, item: `${BASE}/${lang}/blog/${catSlug}/${cat}` },
      ],
    };
    document.getElementById('schema-blogcat-bc')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-blogcat-bc'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-blogcat-bc')?.remove(); };
  }, [lang, cat, catTitle, catSlug, l.home]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPostsByCategory(lang, cat)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [lang, cat]);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const paginated = useMemo(() => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [posts, page]);

  const otherCats = CATEGORIES.filter(c => c !== cat);

  return (
    <div className="container-app py-12 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: l.home, href: `/${lang}` },
        { label: 'Blog', href: `/${lang}/blog` },
        { label: catTitle },
      ]} />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Layers className="w-4 h-4" />
          {catTitle}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          {catTitle}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {catDesc}
        </p>
      </div>

      {/* Category nav pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map(c => {
          const cLabel = (CAT_LABEL[c] ?? CAT_LABEL.card)[lang] ?? (CAT_LABEL[c] ?? CAT_LABEL.card).en;
          const cSlug = BLOG_CAT_SLUG[lang] ?? 'category';
          return (
            <Link
              key={c}
              to={`/${lang}/blog/${cSlug}/${c}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                c === cat
                  ? 'bg-cyan-accent text-bg border-cyan-accent font-bold'
                  : 'border-bg-border text-slate-300 hover:border-cyan-accent/40 hover:text-cyan-accent bg-bg-elevated'
              }`}
            >
              {cLabel}
            </Link>
          );
        })}
      </div>

      {/* Article grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-surface animate-pulse">
              <div className="h-48 bg-bg-elevated rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-bg-elevated rounded w-1/3" />
                <div className="h-6 bg-bg-elevated rounded w-4/5" />
                <div className="h-4 bg-bg-elevated rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-6">{l.noArticles}</p>
          <Link to={`/${lang}/blog`} className="btn-secondary inline-flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />{l.allBlog}
          </Link>
        </div>
      ) : (
        <>
          <p className="text-slate-400 text-sm mb-6">{posts.length} articles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(post => (
              <ArticleCard
                key={post.id}
                post={post}
                lang={lang}
                blogRoute={blogRoute}
                readDuration={l.readDuration}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {l.previous}
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
                {l.next}
              </button>
            </div>
          )}
        </>
      )}

      {/* Related thematic links */}
      {CAT_THEMATIC_LINKS[cat] && (
        <div className="mt-16 border-t border-bg-border pt-10">
          <h2 className="text-lg font-display font-bold text-white mb-4">{l.thematicLinks}</h2>
          <div className="flex flex-wrap gap-2">
            {CAT_THEMATIC_LINKS[cat].map(({ key, emoji, label }) => {
              const slug = THEMATIC_ROUTES[key]?.[lang as keyof typeof THEMATIC_ROUTES['best']] ?? THEMATIC_ROUTES[key]?.en;
              if (!slug) return null;
              const lbl = label[lang] ?? label.en;
              return (
                <Link
                  key={key}
                  to={`/${lang}/${slug}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
                >
                  <span aria-hidden="true">{emoji}</span>{lbl}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Other categories */}
      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{l.otherCategories}</p>
        <div className="flex flex-wrap gap-2">
          {otherCats.map(c => {
            const cLabel = (CAT_LABEL[c] ?? CAT_LABEL.card)[lang] ?? (CAT_LABEL[c] ?? CAT_LABEL.card).en;
            const cSlug = BLOG_CAT_SLUG[lang] ?? 'category';
            return (
              <Link
                key={c}
                to={`/${lang}/blog/${cSlug}/${c}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />{cLabel}
              </Link>
            );
          })}
          <Link
            to={`/${lang}/blog`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />{l.allBlog}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Article card ──────────────────────────────────────────────────────────────
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
        {(post.tags ?? []).length > 0 && (
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

        <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto pt-3 border-t border-bg-border/50 group-hover:border-cyan-accent/30 transition-colors">
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
