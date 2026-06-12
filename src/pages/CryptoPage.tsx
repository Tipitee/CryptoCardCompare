import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import SmartCardImage from '../components/SmartCardImage';
import { CRYPTO_CONTENT } from '../data/cryptoContent';

/* ── Static crypto metadata ─────────────────────────────────────────────── */
const CRYPTO_META: Record<string, {
  name: string; ticker: string; color: string; emoji: string;
}> = {
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

const HOME_LABEL:    Record<string, string> = { fr: 'Accueil',          de: 'Startseite',       es: 'Inicio',       it: 'Home',         en: 'Home' };
const CRYPTO_LABEL:  Record<string, string> = { fr: 'Cryptomonnaies',   de: 'Kryptowährungen',  es: 'Criptomonedas',it: 'Criptovalute', en: 'Cryptocurrencies' };
const CARDS_LABEL:   Record<string, string> = { fr: 'Cartes supportant',de: 'Karten für',       es: 'Tarjetas para',it: 'Carte per',    en: 'Cards supporting' };
const FAQ_LABEL:     Record<string, string> = { fr: 'Questions fréquentes', de: 'Häufige Fragen', es: 'Preguntas frecuentes', it: 'Domande frequenti', en: 'Frequently asked questions' };
const NO_CARDS_MSG:  Record<string, string> = { fr: 'Aucune carte ne mentionne explicitement ce token.', de: 'Keine Karte erwähnt diesen Token explizit.', es: 'Ninguna tarjeta menciona este token explícitamente.', it: 'Nessuna carta menziona esplicitamente questo token.', en: 'No card explicitly mentions this token.' };
const NOT_FOUND_MSG: Record<string, string> = { fr: 'Crypto non trouvée.', de: 'Krypto nicht gefunden.', es: 'Cripto no encontrada.', it: 'Cripto non trovata.', en: 'Crypto not found.' };

export default function CryptoPage() {
  const { lang = 'fr', symbol = 'btc' } = useParams<{ lang: string; symbol: string }>();
  const sym  = symbol.toLowerCase();
  const meta = CRYPTO_META[sym];

  // Get the copy for this lang, fall back to 'fr' if translation not yet available
  const copy = CRYPTO_CONTENT[sym]?.[lang] ?? CRYPTO_CONTENT[sym]?.['fr'];

  const [cards, setCards]             = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  /* Fetch cards that support this crypto — optional, gracefully degrades */
  useEffect(() => {
    if (!meta) { setLoadingCards(false); return; }
    supabase
      .from('cards')
      .select('id, name, issuer, cashback_base, cashback_premium, annual_fees, real_card_image, affiliate_link, markets')
      .contains('cryptos', [meta.ticker])
      .then(({ data, error }) => {
        if (error) { setLoadingCards(false); return; }
        const marketFilter = (c: any) => !Array.isArray(c.markets) || c.markets.includes(lang);
        setCards((data ?? []).filter(marketFilter));
        setLoadingCards(false);
      })
      .catch(() => setLoadingCards(false));
  }, [sym, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Inject FAQ Schema.org JSON-LD into <head> */
  useEffect(() => {
    if (!copy?.faq?.length) return;
    const id = 'faq-jsonld-crypto';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
    return () => { document.getElementById(id)?.remove(); };
  }, [sym, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useSeoMeta({
    title:       copy?.meta_title       ?? (meta ? `${meta.name} (${meta.ticker}) | TopCryptoCards` : 'TopCryptoCards'),
    description: copy?.meta_description ?? '',
  });

  if (!meta || !copy) {
    return (
      <div className="container-app py-20 text-center text-slate-400">
        {NOT_FOUND_MSG[lang] ?? NOT_FOUND_MSG.en}
      </div>
    );
  }

  return (
    <div className="container-app py-10 max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: HOME_LABEL[lang]   ?? 'Home',   href: `/${lang}` },
        { label: CRYPTO_LABEL[lang] ?? 'Cryptos', href: `/${lang}/cryptos` },
        { label: `${meta.name} (${meta.ticker})` },
      ]} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
          style={{ backgroundColor: meta.color + '22', border: `2px solid ${meta.color}44` }}
        >
          <span style={{ color: meta.color }}>{meta.emoji}</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
            {copy.h1}
          </h1>
        </div>
      </div>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      <div
        className="card-article mb-10"
        dangerouslySetInnerHTML={{ __html: copy.intro }}
      />

      {/* ── Article sections ─────────────────────────────────────────── */}
      <div className="space-y-10 mb-12">
        {copy.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span
                className="inline-block w-1 h-6 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {section.title}
            </h2>
            <div
              className="card-article"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        ))}
      </div>

      {/* ── Supported cards ──────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-5">
          {CARDS_LABEL[lang] ?? CARDS_LABEL.en} {meta.ticker}
        </h2>

        {loadingCards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-bg-elevated rounded-xl animate-pulse" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <p className="text-slate-400">{NO_CARDS_MSG[lang] ?? NO_CARDS_MSG.en}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-bg-border hover:border-cyan-accent/30 transition-all"
              >
                <SmartCardImage card={card} size="sm" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm truncate">{card.name}</div>
                  <div className="text-xs text-slate-500">{card.issuer}</div>
                  {(card.cashback_premium || card.cashback_base) > 0 && (
                    <div className="text-xs text-cyan-accent mt-0.5">
                      {((card.cashback_premium || card.cashback_base) * 100).toFixed(1)}% cashback
                    </div>
                  )}
                </div>
                {card.affiliate_link && (
                  <a
                    href={card.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-lg bg-cyan-accent/10 text-cyan-accent hover:bg-cyan-accent/20 transition-colors"
                    aria-label={`Voir l'offre ${card.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      {copy.faq.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-5">
            {FAQ_LABEL[lang] ?? FAQ_LABEL.en}
          </h2>
          <div className="space-y-4">
            {copy.faq.map(({ q, a }, i) => (
              <details
                key={i}
                className="group rounded-xl bg-bg-card border border-bg-border overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none font-semibold text-white hover:text-cyan-accent transition-colors">
                  {q}
                  <span className="shrink-0 text-slate-500 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-bg-border">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}