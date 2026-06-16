import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
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

const HOME_LABEL:    Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };
const CRYPTO_LABEL:  Record<string, string> = { fr: 'Cryptomonnaies', de: 'Kryptowährungen', es: 'Criptomonedas', it: 'Criptovalute', en: 'Cryptocurrencies' };
const FAQ_LABEL:     Record<string, string> = { fr: 'Questions fréquentes', de: 'Häufige Fragen', es: 'Preguntas frecuentes', it: 'Domande frequenti', en: 'FAQ' };
const CARDS_LABEL:   Record<string, string> = { fr: 'Cartes supportant', de: 'Karten für', es: 'Tarjetas para', it: 'Carte per', en: 'Cards supporting' };
const SEE_ALSO:      Record<string, string> = { fr: 'Autres cryptomonnaies', de: 'Andere Kryptowährungen', es: 'Otras criptomonedas', it: 'Altre criptovalute', en: 'Other cryptocurrencies' };
const COMPARE_CARDS: Record<string, string> = { fr: 'Comparer les cartes crypto', de: 'Krypto-Karten vergleichen', es: 'Comparar tarjetas crypto', it: 'Confronta le carte crypto', en: 'Compare crypto cards' };

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

/* ── Featured snippet blocks (position-zero answer, ~50 words, per crypto × lang) ── */
const CRYPTO_SNIPPET: Record<string, Record<string, string>> = {
  btc: {
    fr: `Le <strong>Bitcoin (BTC)</strong> est la première cryptomonnaie mondiale, créée en 2009. <strong>Décentralisé</strong> et résistant à l'inflation, il est accepté par les meilleures <strong>cartes crypto</strong> comme Crypto.com ou Binance Card, qui offrent du <strong>cashback en Bitcoin</strong> sur vos achats quotidiens.`,
    de: `<strong>Bitcoin (BTC)</strong> ist die weltweit erste Kryptowährung, gegründet 2009. Dezentral und inflationsresistent, wird er von den besten <strong>Krypto-Karten</strong> wie Crypto.com oder Binance Card unterstützt — mit <strong>Bitcoin-Cashback</strong> auf Alltagsausgaben.`,
    en: `<strong>Bitcoin (BTC)</strong> is the world's first cryptocurrency, launched in 2009. Decentralized and inflation-resistant, it is supported by leading <strong>crypto cards</strong> like Crypto.com and Binance Card, letting you earn <strong>Bitcoin cashback</strong> on everyday spending.`,
    es: `<strong>Bitcoin (BTC)</strong> es la primera criptomoneda del mundo, creada en 2009. Descentralizada y resistente a la inflación, es compatible con las mejores <strong>tarjetas crypto</strong> como Crypto.com o Binance Card, que ofrecen <strong>cashback en Bitcoin</strong>.`,
    it: `<strong>Bitcoin (BTC)</strong> è la prima criptovaluta al mondo, creata nel 2009. Decentralizzata e resistente all'inflazione, è supportata dalle migliori <strong>carte crypto</strong> come Crypto.com e Binance Card, che offrono <strong>cashback in Bitcoin</strong>.`,
  },
  eth: {
    fr: `<strong>Ethereum (ETH)</strong> est la blockchain de référence pour les <strong>smart contracts</strong> et la DeFi. La plupart des <strong>cartes crypto</strong> supportent ETH : Crypto.com, Nexo ou Coinbase Card permettent de dépenser vos ETH et de recevoir du <strong>cashback en Ethereum</strong>.`,
    de: `<strong>Ethereum (ETH)</strong> ist die führende Blockchain für <strong>Smart Contracts</strong> und DeFi. Die meisten Krypto-Karten unterstützen ETH-Guthaben — Karten wie Crypto.com oder Nexo zahlen <strong>ETH-Cashback</strong> bei täglichen Ausgaben.`,
    en: `<strong>Ethereum (ETH)</strong> is the leading blockchain for <strong>smart contracts</strong> and DeFi. Most crypto debit cards support ETH balances — Crypto.com and Nexo let you spend ETH daily and earn <strong>Ethereum cashback</strong> on purchases.`,
    es: `<strong>Ethereum (ETH)</strong> es la blockchain líder para <strong>contratos inteligentes</strong> y DeFi. La mayoría de tarjetas crypto admiten saldo en ETH — Crypto.com o Nexo permiten gastar ETH y obtener <strong>cashback en Ethereum</strong>.`,
    it: `<strong>Ethereum (ETH)</strong> è la blockchain leader per <strong>smart contract</strong> e DeFi. La maggior parte delle carte crypto supporta saldi in ETH — Crypto.com e Nexo consentono di spendere ETH e ottenere <strong>cashback in Ethereum</strong>.`,
  },
  xrp: {
    fr: `<strong>XRP</strong> est le token natif du réseau Ripple, conçu pour des <strong>paiements transfrontaliers rapides</strong> à bas coût. Plusieurs <strong>cartes crypto compatibles XRP</strong> permettent de payer avec vos XRP ou d'en recevoir en cashback sur vos dépenses quotidiennes.`,
    de: `<strong>XRP</strong> ist der native Token des Ripple-Netzwerks für <strong>schnelle, günstige Auslandszahlungen</strong>. Mehrere Krypto-Karten akzeptieren XRP als Sicherheit oder zahlen <strong>Cashback in XRP</strong> — ideal zum täglichen Einsatz Ihrer Kryptowährung.`,
    en: `<strong>XRP</strong> is the native token of the Ripple network, designed for <strong>fast, low-cost cross-border payments</strong>. Several crypto cards accept XRP as collateral or pay <strong>XRP cashback</strong>, letting you put your XRP to work daily.`,
    es: `<strong>XRP</strong> es el token nativo de la red Ripple, diseñado para <strong>pagos transfronterizos rápidos y económicos</strong>. Varias tarjetas crypto aceptan XRP como garantía o pagan <strong>cashback en XRP</strong> en compras diarias.`,
    it: `<strong>XRP</strong> è il token nativo della rete Ripple, progettato per <strong>pagamenti transfrontalieri veloci ed economici</strong>. Diverse carte crypto accettano XRP come garanzia o pagano <strong>cashback in XRP</strong> sugli acquisti quotidiani.`,
  },
  bnb: {
    fr: `<strong>BNB</strong> est le token natif de Binance, l'un des plus grands exchanges mondiaux. La <strong>Binance Card Visa</strong> permet de dépenser BNB partout dans le monde, avec des <strong>réductions sur les frais de trading</strong> et du cashback pour les détenteurs de BNB.`,
    de: `<strong>BNB</strong> ist der native Token von Binance, einer der größten Krypto-Börsen. Die <strong>Binance Visa Card</strong> ermöglicht weltweite BNB-Zahlungen mit <strong>Trading-Gebührenrabatten</strong> und Cashback für BNB-Inhaber.`,
    en: `<strong>BNB</strong> is the native token of Binance, one of the world's largest exchanges. The <strong>Binance Visa Card</strong> lets you spend BNB globally, with <strong>trading fee discounts</strong> and cashback rewards for BNB holders.`,
    es: `<strong>BNB</strong> es el token nativo de Binance, uno de los mayores exchanges del mundo. La <strong>Binance Visa Card</strong> permite gastar BNB globalmente, con <strong>descuentos en comisiones</strong> y cashback para holders de BNB.`,
    it: `<strong>BNB</strong> è il token nativo di Binance, uno dei maggiori exchange al mondo. La <strong>Binance Visa Card</strong> consente di spendere BNB ovunque, con <strong>sconti sulle commissioni di trading</strong> e cashback per i holder di BNB.`,
  },
  sol: {
    fr: `<strong>Solana (SOL)</strong> est une blockchain haute performance réputée pour ses <strong>transactions ultra-rapides</strong> et ses frais quasi nuls. Compatible avec plusieurs <strong>cartes crypto</strong>, vous pouvez dépenser vos SOL au quotidien et recevoir du <strong>cashback en Solana</strong> via Crypto.com ou Nexo.`,
    de: `<strong>Solana (SOL)</strong> ist eine Hochleistungs-Blockchain mit <strong>ultraschnellen Transaktionen</strong> und minimalen Gebühren. Krypto-Karten wie Crypto.com oder Nexo unterstützen SOL-Guthaben und bieten <strong>SOL-Cashback</strong> auf Alltagsausgaben.`,
    en: `<strong>Solana (SOL)</strong> is a high-performance blockchain known for <strong>ultra-fast transactions</strong> and minimal fees. Cards like Crypto.com and Nexo support SOL balances, letting you spend SOL daily and earn <strong>SOL cashback</strong> on purchases.`,
    es: `<strong>Solana (SOL)</strong> es una blockchain de alto rendimiento conocida por <strong>transacciones ultra-rápidas</strong> y bajas comisiones. Cartas como Crypto.com o Nexo admiten saldo en SOL y ofrecen <strong>cashback en SOL</strong> en compras diarias.`,
    it: `<strong>Solana (SOL)</strong> è una blockchain ad alte prestazioni nota per <strong>transazioni ultra-veloci</strong> e commissioni minime. Carte come Crypto.com e Nexo supportano saldi in SOL e offrono <strong>cashback in SOL</strong> sugli acquisti.`,
  },
  ada: {
    fr: `<strong>Cardano (ADA)</strong> est une blockchain basée sur la recherche académique, avec un protocole de <strong>preuve d'enjeu (PoS)</strong> éco-efficace. Certaines <strong>cartes crypto</strong> acceptent ADA comme garantie ou cashback, vous permettant de monétiser vos holdings ADA au quotidien.`,
    de: `<strong>Cardano (ADA)</strong> ist eine wissenschaftsbasierte Blockchain mit energieeffizientem <strong>Proof-of-Stake-Protokoll</strong>. Einige Krypto-Karten akzeptieren ADA als Sicherheit oder zahlen <strong>Cashback in ADA</strong> auf tägliche Ausgaben.`,
    en: `<strong>Cardano (ADA)</strong> is a research-driven blockchain with an energy-efficient <strong>Proof-of-Stake protocol</strong>. Some crypto cards accept ADA as collateral or pay <strong>ADA cashback</strong>, letting you monetize your Cardano holdings in daily spending.`,
    es: `<strong>Cardano (ADA)</strong> es una blockchain basada en investigación con un eficiente <strong>protocolo Proof-of-Stake</strong>. Algunas tarjetas crypto aceptan ADA como garantía o pagan <strong>cashback en ADA</strong> en compras diarias.`,
    it: `<strong>Cardano (ADA)</strong> è una blockchain basata sulla ricerca con un efficiente <strong>protocollo Proof-of-Stake</strong>. Alcune carte crypto accettano ADA come garanzia o pagano <strong>cashback in ADA</strong> sugli acquisti quotidiani.`,
  },
  avax: {
    fr: `<strong>Avalanche (AVAX)</strong> est une blockchain rapide et évolutive avec des <strong>subnets</strong> personnalisables. Compatible avec plusieurs <strong>cartes crypto</strong>, AVAX peut être utilisé comme garantie ou cashback pour dépenser votre crypto Avalanche au quotidien.`,
    de: `<strong>Avalanche (AVAX)</strong> ist eine schnelle, skalierbare Blockchain mit anpassbaren <strong>Subnets</strong>. AVAX wird von mehreren Krypto-Karten als Sicherheit akzeptiert und ermöglicht <strong>tägliche Zahlungen</strong> mit Ihrer Kryptowährung.`,
    en: `<strong>Avalanche (AVAX)</strong> is a fast, scalable blockchain with customizable <strong>subnets</strong>. AVAX is supported by several crypto cards as collateral or cashback, letting you <strong>spend your Avalanche crypto</strong> in everyday purchases.`,
    es: `<strong>Avalanche (AVAX)</strong> es una blockchain rápida y escalable con <strong>subnets personalizables</strong>. AVAX es aceptado por varias tarjetas crypto como garantía o cashback, permitiéndote <strong>gastar tu crypto Avalanche</strong> a diario.`,
    it: `<strong>Avalanche (AVAX)</strong> è una blockchain veloce e scalabile con <strong>subnet personalizzabili</strong>. AVAX è supportato da diverse carte crypto come garanzia o cashback, consentendoti di <strong>spendere la tua crypto Avalanche</strong> quotidianamente.`,
  },
  doge: {
    fr: `<strong>Dogecoin (DOGE)</strong> est une cryptomonnaie populaire née comme un mème, rendue célèbre par sa communauté et Elon Musk. Plusieurs <strong>cartes crypto</strong> supportent DOGE, vous permettant de <strong>dépenser vos Dogecoin</strong> partout où Visa ou Mastercard est accepté.`,
    de: `<strong>Dogecoin (DOGE)</strong> ist eine als Meme entstandene Kryptowährung, bekannt durch ihre Community und Elon Musk. Mehrere Krypto-Karten unterstützen DOGE und erlauben, <strong>Dogecoin täglich auszugeben</strong> — überall dort, wo Visa oder Mastercard akzeptiert wird.`,
    en: `<strong>Dogecoin (DOGE)</strong> is a meme-born cryptocurrency popularized by its community and Elon Musk. Several crypto cards support DOGE, letting you <strong>spend your Dogecoin</strong> anywhere Visa or Mastercard is accepted.`,
    es: `<strong>Dogecoin (DOGE)</strong> es una criptomoneda meme popularizada por su comunidad y Elon Musk. Varias tarjetas crypto admiten DOGE, permitiéndote <strong>gastar tus Dogecoin</strong> donde se acepte Visa o Mastercard.`,
    it: `<strong>Dogecoin (DOGE)</strong> è una criptovaluta nata come meme, resa popolare dalla sua community ed Elon Musk. Diverse carte crypto supportano DOGE, permettendoti di <strong>spendere i tuoi Dogecoin</strong> ovunque sia accettata Visa o Mastercard.`,
  },
  usdt: {
    fr: `<strong>USDT (Tether)</strong> est le <strong>stablecoin</strong> le plus utilisé au monde, indexé sur le dollar américain. Accepté par quasiment toutes les <strong>cartes crypto</strong> — Crypto.com, Nexo, Wirex — il est idéal pour des <strong>paiements stables</strong> sans risque de volatilité.`,
    de: `<strong>USDT (Tether)</strong> ist der meistgenutzte <strong>Stablecoin</strong> weltweit, 1:1 an den US-Dollar gekoppelt. Fast alle Krypto-Karten wie Crypto.com, Nexo oder Wirex unterstützen USDT — ideal für <strong>stabile Krypto-Zahlungen</strong> ohne Kursschwankungen.`,
    en: `<strong>USDT (Tether)</strong> is the world's most widely used <strong>stablecoin</strong>, pegged 1:1 to the US dollar. Nearly all crypto cards — Crypto.com, Nexo, Wirex — support USDT, making it ideal for <strong>stable crypto payments</strong> without volatility risk.`,
    es: `<strong>USDT (Tether)</strong> es el <strong>stablecoin</strong> más utilizado del mundo, vinculado 1:1 al dólar. Casi todas las tarjetas crypto — Crypto.com, Nexo, Wirex — lo admiten, ideal para <strong>pagos crypto estables</strong> sin riesgo de volatilidad.`,
    it: `<strong>USDT (Tether)</strong> è lo <strong>stablecoin</strong> più utilizzato al mondo, ancorato 1:1 al dollaro. Quasi tutte le carte crypto — Crypto.com, Nexo, Wirex — supportano USDT, ideale per <strong>pagamenti crypto stabili</strong> senza volatilità.`,
  },
  usdc: {
    fr: `<strong>USDC (USD Coin)</strong> est un <strong>stablecoin réglementé</strong> émis par Circle, indexé 1:1 sur le dollar. Transparent et audité régulièrement, il est supporté par des <strong>cartes crypto</strong> comme Coinbase Card ou Nexo pour des <strong>paiements stables</strong> sans volatilité.`,
    de: `<strong>USDC (USD Coin)</strong> ist ein <strong>regulierter Stablecoin</strong> von Circle, 1:1 an den US-Dollar gekoppelt. Transparent und regelmäßig geprüft, wird er von Krypto-Karten wie Coinbase Card oder Nexo für <strong>stabile Zahlungen</strong> ohne Volatilität unterstützt.`,
    en: `<strong>USDC (USD Coin)</strong> is a <strong>regulated stablecoin</strong> issued by Circle, pegged 1:1 to the US dollar. Transparent and regularly audited, it is supported by crypto cards like Coinbase Card and Nexo for <strong>stable payments</strong> without volatility.`,
    es: `<strong>USDC (USD Coin)</strong> es un <strong>stablecoin regulado</strong> emitido por Circle, vinculado 1:1 al dólar. Transparente y auditado, es compatible con tarjetas como Coinbase Card o Nexo para <strong>pagos estables</strong> sin volatilidad.`,
    it: `<strong>USDC (USD Coin)</strong> è uno <strong>stablecoin regolamentato</strong> emesso da Circle, ancorato 1:1 al dollaro. Trasparente e verificato regolarmente, è supportato da carte come Coinbase Card e Nexo per <strong>pagamenti stabili</strong> senza volatilità.`,
  },
};

export default function CryptoPage() {
  const { lang = 'fr', symbol = 'btc' } = useParams<{ lang: string; symbol: string }>();
  const sym  = symbol.toLowerCase();
  const meta = CRYPTO_META[sym];
  const copy = CRYPTO_CONTENT[sym]?.[lang] ?? CRYPTO_CONTENT[sym]?.['fr'];

  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    if (!meta?.ticker) return;
    supabase
      .from('cards')
      .select('id, name, issuer, cashback_base, cashback_premium, affiliate_link, markets')
      .contains('cryptos', [meta.ticker])
      .then(({ data, error }) => {
        if (error || !data) return;
        const filtered = data.filter(
          (c: any) => !Array.isArray(c.markets) || c.markets.includes(lang)
        );
        setCards(filtered);
      })
      .catch(() => { /* column may not exist yet — silent fail */ });
  }, [sym, lang]); // eslint-disable-line

  const cryptoYear = new Date().getFullYear();
  useSeoMeta({
    title:       copy?.meta_title       ?? `${meta?.name ?? sym} ${cryptoYear} — Cartes Crypto & Cashback | TopCryptoCards`,
    description: copy?.meta_description ?? `Meilleures cartes crypto compatibles ${meta?.name ?? sym} en ${cryptoYear}. Cashback en ${meta?.ticker ?? sym}, comparatif complet sur TopCryptoCards.`,
  });

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

      {/* Featured snippet — direct answer block for Google position zero */}
      {CRYPTO_SNIPPET[sym]?.[lang] && (
        <div
          className="max-w-3xl mb-6 p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-slate-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: CRYPTO_SNIPPET[sym][lang] || CRYPTO_SNIPPET[sym]['en'] || '' }}
        />
      )}

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
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-bg-card border border-bg-border hover:border-cyan-accent/30 transition-all"
              >
                <div className="min-w-0">
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
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
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
