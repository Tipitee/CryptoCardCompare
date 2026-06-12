import { useParams } from 'react-router-dom';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import { CRYPTO_CONTENT } from '../data/cryptoContent';

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

const HOME_LABEL:   Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };
const CRYPTO_LABEL: Record<string, string> = { fr: 'Cryptomonnaies', de: 'Kryptowährungen', es: 'Criptomonedas', it: 'Criptovalute', en: 'Cryptocurrencies' };
const FAQ_LABEL:    Record<string, string> = { fr: 'Questions fréquentes', de: 'Häufige Fragen', es: 'Preguntas frecuentes', it: 'Domande frequenti', en: 'FAQ' };

export default function CryptoPage() {
  const { lang = 'fr', symbol = 'btc' } = useParams<{ lang: string; symbol: string }>();
  const sym  = symbol.toLowerCase();
  const meta = CRYPTO_META[sym];
  const copy = CRYPTO_CONTENT[sym]?.[lang] ?? CRYPTO_CONTENT[sym]?.['fr'];

  useSeoMeta({
    title:       copy?.meta_title       ?? `${meta?.name ?? sym} | TopCryptoCards`,
    description: copy?.meta_description ?? '',
  });

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