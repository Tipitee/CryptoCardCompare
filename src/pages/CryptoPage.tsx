import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { CRYPTO_CONTENT } from '../data/cryptoContent';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { CRYPTO_COM_AFFILIATE } from '../utils/affiliateLink';

/* ── Static crypto metadata ─────────────────────────────────────────────── */
const CRYPTO_META: Record<string, { name: string; ticker: string; color: string; emoji: string }> = {
  btc:  { name: 'Bitcoin',   ticker: 'BTC',  color: '#F7931A', emoji: '₿'  },
  eth:  { name: 'Ethereum',  ticker: 'ETH',  color: '#627EEA', emoji: 'Ξ'  },
  xrp:  { name: 'XRP',       ticker: 'XRP',  color: '#00AAE4', emoji: '◈'  },
  bnb:  { name: 'BNB',       ticker: 'BNB',  color: '#F3BA2F', emoji: '⬡'  },
  sol:  { name: 'Solana',    ticker: 'SOL',  color: '#9945FF', emoji: '◎'  },
  ada:  { name: 'Cardano',   ticker: 'ADA',  color: '#3CC8C8', emoji: '₳'  },
  avax: { name: 'Avalanche', ticker: 'AVAX', color: '#E84142', emoji: '🔺' },
  doge: { name: 'Dogecoin',  ticker: 'DOGE', color: '#C2A633', emoji: 'Ð'  },
  usdt: { name: 'Tether',    ticker: 'USDT', color: '#26A17B', emoji: '₮'  },
  usdc: { name: 'USD Coin',  ticker: 'USDC', color: '#2775CA', emoji: '$'  },
};

const HOME_LABEL:    Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };
const CRYPTO_LABEL:  Record<string, string> = { fr: 'Cryptomonnaies', de: 'Kryptowährungen', es: 'Criptomonedas', it: 'Criptovalute', en: 'Cryptocurrencies' };
const FAQ_LABEL:     Record<string, string> = { fr: 'Questions fréquentes', de: 'Häufige Fragen', es: 'Preguntas frecuentes', it: 'Domande frequenti', en: 'FAQ' };
const CARDS_LABEL:   Record<string, string> = { fr: 'Cartes supportant', de: 'Karten für', es: 'Tarjetas para', it: 'Carte per', en: 'Cards supporting' };
const SEE_ALSO:      Record<string, string> = { fr: 'Autres cryptomonnaies', de: 'Andere Kryptowährungen', es: 'Otras criptomonedas', it: 'Altre criptovalute', en: 'Other cryptocurrencies' };
const COMPARE_CARDS: Record<string, string> = { fr: 'Comparer les cartes crypto', de: 'Krypto-Karten vergleichen', es: 'Comparar tarjetas crypto', it: 'Confronta le carte crypto', en: 'Compare crypto cards' };
const COMPARE_WITH_LABEL: Record<string, string> = { fr: 'Comparatifs populaires', de: 'Beliebte Vergleiche', es: 'Comparativas populares', it: 'Confronti popolari', en: 'Popular comparisons' };

/* Comparison pairs editorially relevant to each crypto */
const CRYPTO_PAIRS: Record<string, string[]> = {
  btc:  ['coinbase-card-vs-nexo-card', 'kraken-krak-card-vs-nexo-card', 'binance-standard-vs-nexo-card', 'bybit-card-vs-nexo-card'],
  eth:  ['coinbase-card-vs-nexo-card', 'bitpanda-card-vs-coinbase-card', 'bybit-card-vs-coinbase-card', 'deblock-card-vs-coinbase-card'],
  bnb:  ['binance-card-vs-bybit-card', 'binance-standard-vs-nexo-card', 'binance-standard-vs-crypto-com-midnight-blue', 'binance-standard-vs-revolut-metal'],
  sol:  ['bybit-card-vs-nexo-card', 'bybit-card-vs-okx-card', 'nexo-card-vs-okx-card', 'bybit-card-vs-crypto-com-midnight-blue'],
  xrp:  ['kraken-krak-card-vs-nexo-card', 'nexo-card-vs-wirex-elite', 'nexo-card-vs-revolut-metal', 'crypto-com-midnight-blue-vs-kraken-krak-card'],
  ada:  ['bitpanda-card-vs-nexo-card', 'binance-card-vs-bybit-card', 'bybit-card-vs-nexo-card', 'bitpanda-card-vs-coinbase-card'],
  avax: ['bybit-card-vs-crypto-com-midnight-blue', 'coinbase-card-vs-crypto-com-midnight-blue', 'bybit-card-vs-nexo-card', 'nexo-card-vs-okx-card'],
  doge: ['coinbase-card-vs-nexo-card', 'crypto-com-midnight-blue-vs-kraken-krak-card', 'bybit-card-vs-nexo-card', 'coinbase-card-vs-crypto-com-midnight-blue'],
  usdt: ['nexo-card-vs-wirex-elite', 'nexo-card-vs-revolut-metal', 'deblock-card-vs-nexo-card', 'bybit-card-vs-wirex-elite'],
  usdc: ['nexo-card-vs-wirex-elite', 'deblock-card-vs-nexo-card', 'deblock-card-vs-wirex-elite', 'nexo-card-vs-revolut-metal'],
};

function pairToLabel(slug: string): string {
  return slug.split('-vs-').map(part =>
    part.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  ).join(' vs ');
}

/* Thematic page slugs per language (mirrors Layout.tsx) */
const THEMATIC_SLUGS: Record<string, { best: string; cashback: string; noFees: string; noStaking: string }> = {
  fr: { best: 'meilleure-carte-crypto', cashback: 'carte-crypto-cashback', noFees: 'carte-crypto-sans-frais', noStaking: 'carte-crypto-sans-staking' },
  de: { best: 'beste-krypto-karte', cashback: 'krypto-karte-cashback', noFees: 'krypto-karte-ohne-jahresgebuehr', noStaking: 'krypto-karte-ohne-staking' },
  es: { best: 'mejor-tarjeta-cripto', cashback: 'tarjeta-cripto-cashback', noFees: 'tarjeta-cripto-sin-comisiones', noStaking: 'tarjeta-cripto-sin-staking' },
  it: { best: 'migliore-carta-cripto', cashback: 'carta-cripto-cashback', noFees: 'carta-cripto-senza-commissioni', noStaking: 'carta-cripto-senza-staking' },
  en: { best: 'best-crypto-card', cashback: 'crypto-card-cashback', noFees: 'crypto-card-no-fees', noStaking: 'crypto-card-no-staking' },
};
const THEMATIC_LINK_LABELS: Record<string, { best: string; cashback: string; noFees: string; noStaking: string }> = {
  fr: { best: 'Meilleures cartes', cashback: 'Cartes avec cashback', noFees: 'Cartes sans frais', noStaking: 'Sans staking' },
  de: { best: 'Beste Karten', cashback: 'Karten mit Cashback', noFees: 'Kostenlose Karten', noStaking: 'Ohne Staking' },
  es: { best: 'Mejores tarjetas', cashback: 'Con cashback', noFees: 'Sin comisiones', noStaking: 'Sin staking' },
  it: { best: 'Migliori carte', cashback: 'Con cashback', noFees: 'Senza costi', noStaking: 'Senza staking' },
  en: { best: 'Best cards', cashback: 'Cards with cashback', noFees: 'No-fee cards', noStaking: 'No-staking' },
};

export default function CryptoPage() {
  const { lang = 'fr', symbol = 'btc' } = useParams<{ lang: string; symbol: string }>();
  const { t } = useTranslation('common');
  const sym  = symbol.toLowerCase();
  const meta = CRYPTO_META[sym];
  const copy = CRYPTO_CONTENT[sym]?.[lang] ?? CRYPTO_CONTENT[sym]?.['fr'];

  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    if (!meta?.ticker) return;
    supabase
      .from('cards')
      .select('id, name, issuer, cashback_base, cashback_premium, affiliate_link, markets, brand_id')
      .contains('cryptos', [meta.ticker])
      .then(({ data, error }) => {
        if (error || !data) return;
        const filtered = data.filter(
          (c: any) => !Array.isArray(c.markets) || c.markets.includes(lang)
        );
        setCards(filtered);
      });
  }, [sym, lang]); // eslint-disable-line

  const YEAR = new Date().getFullYear();
  const CRYPTO_TITLE_FALLBACK: Record<string, (name: string) => string> = {
    fr: (n) => `${n} et cartes crypto — Cashback & Guide ${YEAR} | TopCryptoCards`,
    de: (n) => `${n} Krypto-Karte — Cashback & Ratgeber ${YEAR} | TopCryptoCards`,
    es: (n) => `${n} y tarjetas crypto — Cashback & Guía ${YEAR} | TopCryptoCards`,
    it: (n) => `${n} e carte crypto — Cashback & Guida ${YEAR} | TopCryptoCards`,
    en: (n) => `${n} Crypto Card — Cashback & Guide ${YEAR} | TopCryptoCards`,
  };
  const CRYPTO_DESC_FALLBACK: Record<string, (name: string) => string> = {
    fr: (n) => `Quelles cartes crypto acceptent le ${n} en ${YEAR} ? Cashback, frais, staking : comparatif complet des meilleures cartes. Gratuit ✓`,
    de: (n) => `Welche Krypto-Karten akzeptieren ${n} in ${YEAR}? Cashback, Gebühren, Staking: vollständiger Vergleich der besten Karten. Kostenlos ✓`,
    es: (n) => `¿Qué tarjetas crypto aceptan ${n} en ${YEAR}? Cashback, comisiones, staking: comparativa completa de las mejores tarjetas. Gratis ✓`,
    it: (n) => `Quali carte crypto accettano ${n} nel ${YEAR}? Cashback, commissioni, staking: confronto completo delle migliori carte. Gratuito ✓`,
    en: (n) => `Which crypto cards support ${n} in ${YEAR}? Cashback, fees, staking: full comparison of the best cards. Free ✓`,
  };
  const cryptoName = meta?.name ?? sym.toUpperCase();
  const fallbackTitle = (CRYPTO_TITLE_FALLBACK[lang] ?? CRYPTO_TITLE_FALLBACK.en)(cryptoName);
  const fallbackDesc = (CRYPTO_DESC_FALLBACK[lang] ?? CRYPTO_DESC_FALLBACK.en)(cryptoName);
  useSeoMeta({
    title:       copy?.meta_title       ?? fallbackTitle,
    description: copy?.meta_description ?? fallbackDesc,
    lang,
  });

  // ── Hreflang ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    document.querySelectorAll('link[data-hreflang-crypto]').forEach(el => el.remove());
    const langs = ['fr', 'de', 'es', 'it', 'en'];
    langs.forEach(l => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/cryptos/${sym}`);
      el.setAttribute('data-hreflang-crypto', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate';
    xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/cryptos/${sym}`);
    xd.setAttribute('data-hreflang-crypto', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-crypto]').forEach(el => el.remove()); };
  }, [sym]);

  // ── Schema.org WebPage ───────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const pageTitle = copy?.meta_title ?? fallbackTitle;
    const pageDesc  = copy?.meta_description ?? '';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description: pageDesc,
      url: `${BASE}/${lang}/cryptos/${sym}`,
      inLanguage: lang,
      publisher: {
        '@type': 'Organization',
        name: 'TopCryptoCards',
        url: BASE,
      },
    };
    document.getElementById('schema-cryptopage-webpage')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-cryptopage-webpage';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-cryptopage-webpage')?.remove(); };
  }, [lang, sym, copy, fallbackTitle]);

  // ── Schema.org FAQPage ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!copy?.faq?.length) return;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faq.map(({ q, a }: { q: string; a: string }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    };

    document.getElementById('schema-faq-crypto')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-faq-crypto';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(el);

    return () => { document.getElementById('schema-faq-crypto')?.remove(); };
  }, [copy, sym, lang]);

  // ── BreadcrumbList schema ────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const cryptoName = CRYPTO_META[sym]?.name ?? sym.toUpperCase();
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: HOME_LABEL[lang] ?? 'Home', item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: CRYPTO_LABEL[lang] ?? 'Cryptocurrencies', item: `${BASE}/${lang}/cryptos` },
        { '@type': 'ListItem', position: 3, name: cryptoName, item: `${BASE}/${lang}/cryptos/${sym}` },
      ],
    };
    document.getElementById('schema-cryptopage-breadcrumb')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-cryptopage-breadcrumb'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-cryptopage-breadcrumb')?.remove(); };
  }, [lang, sym]);

  if (!meta || !copy) {
    return (
      <div className="container-app py-20 text-center text-slate-400">
        Crypto not found.
      </div>
    );
  }

  return (
    <div className="container-app py-10 max-w-4xl mx-auto">

      <Breadcrumb items={[
        { label: HOME_LABEL[lang]   ?? 'Home',    href: `/${lang}` },
        { label: CRYPTO_LABEL[lang] ?? 'Cryptos', href: `/${lang}/cryptos` },
        { label: `${meta.name} (${meta.ticker})` },
      ]} />

      {/* Hero */}
      <div className="flex items-center gap-5 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
          style={{ backgroundColor: meta.color + '22', border: `2px solid ${meta.color}44` }}
        >
          <span style={{ color: meta.color }}>{meta.emoji}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
          {copy.h1}
        </h1>
      </div>

      {/* Intro */}
      <div
        className="card-article mb-10"
        dangerouslySetInnerHTML={{ __html: copy.intro }}
      />

      {/* Sections */}
      <div className="space-y-10 mb-12">
        {copy.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
              {section.title}
            </h2>
            <div
              className="card-article"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        ))}
      </div>

      {/* Cards supporting this crypto */}
      {cards.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-5">
            {CARDS_LABEL[lang] ?? CARDS_LABEL.en} {meta.ticker}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => {
              const cardSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';
              const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
              const affiliateHref = card.issuer === 'Crypto.com' ? CRYPTO_COM_AFFILIATE : card.affiliate_link;
              return (
                <div
                  key={card.id}
                  className="rounded-xl bg-bg-card border border-bg-border hover:border-cyan-accent/30 transition-all overflow-hidden"
                >
                  <Link
                    to={`/${lang}/${cardSlug}/${card.id}`}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-sm truncate group-hover:text-cyan-accent">{card.name}</div>
                      <div className="text-xs text-slate-500">{card.issuer}</div>
                      {(card.cashback_premium || card.cashback_base) > 0 && (
                        <div className="text-xs text-cyan-accent mt-0.5">
                          {((card.cashback_premium || card.cashback_base) * 100).toFixed(1)}% cashback
                        </div>
                      )}
                    </div>
                    {affiliateHref && (
                      <a
                        href={affiliateHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="shrink-0 p-2 rounded-lg bg-cyan-accent/10 text-cyan-accent hover:bg-cyan-accent/20 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </Link>
                  {card.brand_id && (
                    <div className="px-4 pb-3 flex items-center gap-3 text-xs">
                      <Link to={`/${lang}/${cardSlug}/${card.id}`} className="text-slate-500 hover:text-cyan-accent transition-colors flex items-center gap-0.5">
                        <ChevronRight className="w-3 h-3" />
                        {t('see_details')}
                      </Link>
                      <span className="text-slate-700">·</span>
                      <Link to={`/${lang}/${brandsSlug}/${card.brand_id}`} className="text-slate-500 hover:text-cyan-accent transition-colors flex items-center gap-0.5">
                        <ChevronRight className="w-3 h-3" />
                        {t('brand_page')}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Internal linking: thematic guides ────────────────────────── */}
      {(() => {
        const slugs = THEMATIC_SLUGS[lang] ?? THEMATIC_SLUGS.en;
        const tLabels = THEMATIC_LINK_LABELS[lang] ?? THEMATIC_LINK_LABELS.en;
        const guides = [
          { slug: slugs.best, label: tLabels.best, icon: '⭐' },
          { slug: slugs.cashback, label: tLabels.cashback, icon: '💰' },
          { slug: slugs.noFees, label: tLabels.noFees, icon: '🆓' },
          { slug: slugs.noStaking, label: tLabels.noStaking, icon: '🔓' },
        ];
        return (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-3">
              {COMPARE_CARDS[lang] ?? COMPARE_CARDS.en}
            </h2>
            <div className="flex flex-wrap gap-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  to={`/${lang}/${g.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
                >
                  <span className="text-base leading-none">{g.icon}</span>
                  {g.label}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* ── Internal linking: comparison pairs for this crypto ──────── */}
      {(() => {
        const pairs = CRYPTO_PAIRS[sym] ?? [];
        if (pairs.length === 0) return null;
        const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;
        const compSeg = rt.comparisons ?? 'compare';
        return (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-3">
              {COMPARE_WITH_LABEL[lang] ?? COMPARE_WITH_LABEL.en}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pairs.map(slug => (
                <Link
                  key={slug}
                  to={`/${lang}/${compSeg}/${slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
                >
                  <span className="shrink-0">⚖️</span>
                  <span className="leading-tight">{pairToLabel(slug)}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* ── Internal linking: other cryptos ─────────────────────────── */}
      {(() => {
        const others = Object.entries(CRYPTO_META)
          .filter(([k]) => k !== sym)
          .slice(0, 6);
        return (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-3">
              {SEE_ALSO[lang] ?? SEE_ALSO.en}
            </h2>
            <div className="flex flex-wrap gap-2">
              {others.map(([symbol, m]) => (
                <Link
                  key={symbol}
                  to={`/${lang}/cryptos/${symbol}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-white hover:border-cyan-accent/40 transition-all"
                >
                  <span style={{ color: m.color }} className="font-bold text-sm">{m.emoji}</span>
                  {m.name}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* ── Internal linking: CryptoList + Simulator + ReviewList ───── */}
      {(() => {
        const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;
        const CRYPTOLIST_LABEL: Record<string, string> = { fr: 'Toutes les cryptos', de: 'Alle Kryptowährungen', es: 'Todas las criptos', it: 'Tutte le crypto', en: 'All cryptos' };
        const SIMULATOR_LABEL: Record<string, string> = { fr: 'Simulateur de gains', de: 'Gewinn-Simulator', es: 'Simulador de ganancias', it: 'Simulatore di guadagni', en: 'Earnings simulator' };
        const REVIEWS_LABEL: Record<string, string> = { fr: 'Avis cartes crypto', de: 'Krypto-Karten Bewertungen', es: 'Reseñas tarjetas cripto', it: 'Recensioni carte cripto', en: 'Crypto card reviews' };
        return (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link to={`/${lang}/${rt.cryptos ?? 'cryptos'}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
              <span>🪙</span>{CRYPTOLIST_LABEL[lang] ?? CRYPTOLIST_LABEL.en}
            </Link>
            <Link to={`/${lang}/${rt.simulator ?? 'simulator'}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
              <span>🧮</span>{SIMULATOR_LABEL[lang] ?? SIMULATOR_LABEL.en}
            </Link>
            <Link to={`/${lang}/${rt.reviews ?? 'reviews'}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
              <span>⭐</span>{REVIEWS_LABEL[lang] ?? REVIEWS_LABEL.en}
            </Link>
          </div>
        );
      })()}

      {/* FAQ */}
      {copy.faq.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-5">
            {FAQ_LABEL[lang] ?? 'FAQ'}
          </h2>
          <div className="space-y-3">
            {copy.faq.map((item, i) => (
              <div key={i} className="rounded-xl bg-bg-card border border-bg-border overflow-hidden">
                <div className="p-4 font-semibold text-white text-sm">
                  {item.q}
                </div>
                <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-bg-border">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
