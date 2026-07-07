import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import Breadcrumb from '../components/Breadcrumb';

const THEMATIC_SLUGS: Record<string, Record<string, string>> = {
  fr: { best: 'meilleure-carte-crypto', cashback: 'carte-crypto-cashback', noFees: 'carte-crypto-sans-frais', noStaking: 'carte-crypto-sans-staking' },
  de: { best: 'beste-krypto-karte', cashback: 'krypto-karte-cashback', noFees: 'krypto-karte-ohne-jahresgebuehr', noStaking: 'krypto-karte-ohne-staking' },
  es: { best: 'mejor-tarjeta-cripto', cashback: 'tarjeta-cripto-cashback', noFees: 'tarjeta-cripto-sin-comisiones', noStaking: 'tarjeta-cripto-sin-staking' },
  it: { best: 'migliore-carta-cripto', cashback: 'carta-cripto-cashback', noFees: 'carta-cripto-senza-commissioni', noStaking: 'carta-cripto-senza-staking' },
  en: { best: 'best-crypto-card', cashback: 'crypto-card-cashback', noFees: 'crypto-card-no-fees', noStaking: 'crypto-card-no-staking' },
};
const CRYPTOLIST_EDITORIAL: Record<string, { h2: string; body: string; related: string; links: { emoji: string; label: string; slug: string }[] }> = {
  fr: {
    h2: 'Crypto et carte bancaire : ce que vous devez savoir',
    body: `Le choix d'une carte crypto dépend en grande partie des cryptomonnaies que vous détenez ou souhaitez utiliser. Certaines cartes comme la Crypto.com Obsidian n'acceptent que des cryptos natives (CRO, BTC, ETH) pour les dépenses cashback, tandis que d'autres comme la Gnosis Pay fonctionnent avec des stablecoins (USDC, EURE) pour une utilisation quotidienne sans volatilité. Bitcoin reste la crypto la plus universellement supportée, mais Ethereum et les stablecoins dominent pour les paiements en ligne. Avant de choisir votre carte, vérifiez quelles cryptos sont acceptées pour le staking, quelles conversions sont automatiques et si des frais de change s'appliquent. Nos fiches individuelles pour chaque crypto vous indiquent précisément quelles cartes les supportent.`,
    related: 'Trouver la bonne carte',
    links: [
      { emoji: '⭐', label: 'Meilleures cartes', slug: 'best' },
      { emoji: '💰', label: 'Cartes cashback', slug: 'cashback' },
      { emoji: '🆓', label: 'Sans frais', slug: 'noFees' },
      { emoji: '🔓', label: 'Sans staking', slug: 'noStaking' },
    ],
  },
  de: {
    h2: 'Krypto und Bankkarte: Was Sie wissen müssen',
    body: `Die Wahl einer Krypto-Karte hängt stark davon ab, welche Kryptowährungen Sie halten oder verwenden möchten. Einige Karten wie die Crypto.com Obsidian akzeptieren nur native Kryptos (CRO, BTC, ETH) für Cashback-Ausgaben, während andere wie Gnosis Pay mit Stablecoins (USDC, EURE) für den täglichen Gebrauch ohne Volatilität funktionieren. Bitcoin bleibt die am universellsten unterstützte Krypto, aber Ethereum und Stablecoins dominieren bei Online-Zahlungen. Prüfen Sie vor der Kartenwahl, welche Kryptos für Staking akzeptiert werden, welche Konvertierungen automatisch erfolgen und ob Wechselgebühren anfallen. Unsere individuellen Krypto-Guides zeigen genau, welche Karten sie unterstützen.`,
    related: 'Die richtige Karte finden',
    links: [
      { emoji: '⭐', label: 'Beste Karten', slug: 'best' },
      { emoji: '💰', label: 'Cashback-Karten', slug: 'cashback' },
      { emoji: '🆓', label: 'Ohne Gebühren', slug: 'noFees' },
      { emoji: '🔓', label: 'Ohne Staking', slug: 'noStaking' },
    ],
  },
  es: {
    h2: 'Cripto y tarjeta bancaria: lo que debes saber',
    body: `La elección de una tarjeta crypto depende en gran medida de las criptomonedas que posees o deseas utilizar. Algunas tarjetas como la Crypto.com Obsidian solo aceptan criptos nativas (CRO, BTC, ETH) para el cashback, mientras que otras como Gnosis Pay funcionan con stablecoins (USDC, EURE) para uso diario sin volatilidad. Bitcoin sigue siendo la cripto más universalmente compatible, pero Ethereum y los stablecoins dominan para pagos online. Antes de elegir tu tarjeta, comprueba qué criptos se aceptan para el staking, qué conversiones son automáticas y si se aplican comisiones de cambio. Nuestras fichas individuales para cada cripto indican exactamente qué tarjetas las soportan.`,
    related: 'Encontrar la tarjeta adecuada',
    links: [
      { emoji: '⭐', label: 'Mejores tarjetas', slug: 'best' },
      { emoji: '💰', label: 'Tarjetas cashback', slug: 'cashback' },
      { emoji: '🆓', label: 'Sin comisiones', slug: 'noFees' },
      { emoji: '🔓', label: 'Sin staking', slug: 'noStaking' },
    ],
  },
  it: {
    h2: 'Cripto e carta bancaria: cosa devi sapere',
    body: `La scelta di una carta crypto dipende in gran parte dalle criptovalute che detieni o desideri utilizzare. Alcune carte come la Crypto.com Obsidian accettano solo cripto native (CRO, BTC, ETH) per il cashback, mentre altre come Gnosis Pay funzionano con stablecoin (USDC, EURE) per l'uso quotidiano senza volatilità. Bitcoin rimane la cripto più universalmente supportata, ma Ethereum e gli stablecoin dominano per i pagamenti online. Prima di scegliere la tua carta, verifica quali cripto sono accettate per lo staking, quali conversioni sono automatiche e se si applicano commissioni di cambio. Le nostre schede individuali per ogni cripto indicano esattamente quali carte le supportano.`,
    related: 'Trovare la carta giusta',
    links: [
      { emoji: '⭐', label: 'Migliori carte', slug: 'best' },
      { emoji: '💰', label: 'Carte cashback', slug: 'cashback' },
      { emoji: '🆓', label: 'Senza costi', slug: 'noFees' },
      { emoji: '🔓', label: 'Senza staking', slug: 'noStaking' },
    ],
  },
  en: {
    h2: 'Crypto and payment card: what you need to know',
    body: `Choosing a crypto card depends heavily on which cryptocurrencies you hold or plan to use. Some cards like the Crypto.com Obsidian only accept native cryptos (CRO, BTC, ETH) for cashback spending, while others like Gnosis Pay work with stablecoins (USDC, EURE) for everyday use without volatility. Bitcoin remains the most universally supported crypto, but Ethereum and stablecoins dominate for online payments. Before choosing your card, check which cryptos are accepted for staking, which conversions happen automatically, and whether exchange fees apply. Our individual guides for each crypto tell you exactly which cards support them.`,
    related: 'Find the right card',
    links: [
      { emoji: '⭐', label: 'Best cards', slug: 'best' },
      { emoji: '💰', label: 'Cashback cards', slug: 'cashback' },
      { emoji: '🆓', label: 'No fees', slug: 'noFees' },
      { emoji: '🔓', label: 'No staking', slug: 'noStaking' },
    ],
  },
};

const GUIDES_TITLE: Record<string, string> = {
  fr: 'Guides thématiques', de: 'Thematische Ratgeber', es: 'Guías temáticas', it: 'Guide tematiche', en: 'Thematic Guides',
};
const GUIDES_LINKS: Record<string, { label: string; icon: string; key: string }[]> = {
  fr: [
    { key: 'best', label: 'Meilleures cartes crypto', icon: '⭐' },
    { key: 'cashback', label: 'Cartes avec cashback', icon: '💰' },
    { key: 'noFees', label: 'Cartes sans frais', icon: '🆓' },
    { key: 'noStaking', label: 'Cartes sans staking', icon: '🔓' },
  ],
  de: [
    { key: 'best', label: 'Beste Krypto-Karten', icon: '⭐' },
    { key: 'cashback', label: 'Karten mit Cashback', icon: '💰' },
    { key: 'noFees', label: 'Kostenlose Karten', icon: '🆓' },
    { key: 'noStaking', label: 'Karten ohne Staking', icon: '🔓' },
  ],
  es: [
    { key: 'best', label: 'Mejores tarjetas crypto', icon: '⭐' },
    { key: 'cashback', label: 'Tarjetas con cashback', icon: '💰' },
    { key: 'noFees', label: 'Tarjetas sin comisiones', icon: '🆓' },
    { key: 'noStaking', label: 'Tarjetas sin staking', icon: '🔓' },
  ],
  it: [
    { key: 'best', label: 'Migliori carte crypto', icon: '⭐' },
    { key: 'cashback', label: 'Carte con cashback', icon: '💰' },
    { key: 'noFees', label: 'Carte senza costi', icon: '🆓' },
    { key: 'noStaking', label: 'Carte senza staking', icon: '🔓' },
  ],
  en: [
    { key: 'best', label: 'Best crypto cards', icon: '⭐' },
    { key: 'cashback', label: 'Cards with cashback', icon: '💰' },
    { key: 'noFees', label: 'No-fee cards', icon: '🆓' },
    { key: 'noStaking', label: 'No-staking cards', icon: '🔓' },
  ],
};

const YEAR = new Date().getFullYear();

const CRYPTOS = [
  { symbol: 'btc',  name: 'Bitcoin',  ticker: 'BTC',  color: '#F7931A', emoji: '₿',  desc: { fr: 'La première cryptomonnaie, réserve de valeur numérique', de: 'Die erste Kryptowährung, digitaler Wertspeicher', es: 'La primera criptomoneda, reserva de valor digital', it: 'La prima criptovaluta, riserva di valore digitale', en: 'The first cryptocurrency, digital store of value' } },
  { symbol: 'eth',  name: 'Ethereum', ticker: 'ETH',  color: '#627EEA', emoji: 'Ξ',  desc: { fr: 'La blockchain des smart contracts et de la DeFi', de: 'Die Blockchain für Smart Contracts und DeFi', es: 'La blockchain de los contratos inteligentes y DeFi', it: 'La blockchain degli smart contract e della DeFi', en: 'The blockchain for smart contracts and DeFi' } },
  { symbol: 'xrp',  name: 'XRP',      ticker: 'XRP',  color: '#00AAE4', emoji: '◈',  desc: { fr: 'Solution de paiement transfrontalier ultra-rapide', de: 'Ultraschnelle grenzüberschreitende Zahlungslösung', es: 'Solución de pagos transfronterizos ultrarrápidos', it: 'Soluzione di pagamento transfrontaliero ultraveloce', en: 'Ultra-fast cross-border payment solution' } },
  { symbol: 'bnb',  name: 'BNB',      ticker: 'BNB',  color: '#F3BA2F', emoji: '⬡',  desc: { fr: "Token natif de l'écosystème Binance", de: 'Nativer Token des Binance-Ökosystems', es: 'Token nativo del ecosistema Binance', it: "Token nativo dell'ecosistema Binance", en: 'Native token of the Binance ecosystem' } },
  { symbol: 'sol',  name: 'Solana',   ticker: 'SOL',  color: '#9945FF', emoji: '◎',  desc: { fr: 'Blockchain haute performance, transactions quasi-gratuites', de: 'Hochleistungs-Blockchain, nahezu kostenlose Transaktionen', es: 'Blockchain de alto rendimiento, transacciones casi gratuitas', it: 'Blockchain ad alte prestazioni, transazioni quasi gratuite', en: 'High-performance blockchain with near-zero transaction fees' } },
  { symbol: 'ada',  name: 'Cardano',  ticker: 'ADA',  color: '#0D1E2D', emoji: '₳',  desc: { fr: 'Blockchain académique et durable, preuve d\'enjeu', de: 'Akademische und nachhaltige Blockchain, Proof-of-Stake', es: 'Blockchain académica y sostenible, prueba de participación', it: 'Blockchain accademica e sostenibile, proof-of-stake', en: 'Academic, sustainable blockchain using proof-of-stake' } },
  { symbol: 'avax', name: 'Avalanche',ticker: 'AVAX', color: '#E84142', emoji: '🔺', desc: { fr: 'Plateforme de contrats intelligents haute vitesse', de: 'Hochgeschwindigkeits-Smart-Contract-Plattform', es: 'Plataforma de contratos inteligentes de alta velocidad', it: 'Piattaforma di smart contract ad alta velocità', en: 'High-speed smart contracts platform with fast finality' } },
  { symbol: 'doge', name: 'Dogecoin', ticker: 'DOGE', color: '#C2A633', emoji: 'Ð',  desc: { fr: 'La crypto des paiements du quotidien, community-driven', de: 'Die Kryptowährung für alltägliche Zahlungen, community-driven', es: 'La cripto para pagos cotidianos, impulsada por la comunidad', it: 'La cripto per i pagamenti quotidiani, community-driven', en: 'The everyday payments crypto, community-driven' } },
  { symbol: 'usdt', name: 'Tether',   ticker: 'USDT', color: '#26A17B', emoji: '₮',  desc: { fr: 'Stablecoin indexé sur le dollar, liquidité maximale', de: 'Dollar-gekoppelter Stablecoin, maximale Liquidität', es: 'Stablecoin indexado al dólar, máxima liquidez', it: 'Stablecoin ancorato al dollaro, massima liquidità', en: 'Dollar-pegged stablecoin with maximum liquidity' } },
  { symbol: 'usdc', name: 'USD Coin', ticker: 'USDC', color: '#2775CA', emoji: '$',  desc: { fr: 'Stablecoin réglementé, audité par Circle', de: 'Regulierter Stablecoin, von Circle geprüft', es: 'Stablecoin regulado, auditado por Circle', it: 'Stablecoin regolamentato, verificato da Circle', en: 'Regulated stablecoin audited by Circle' } },
];

const SEO: Record<string, { title: string; desc: string; h1: string; intro: string }> = {
  fr: { title: `Guide Cryptomonnaies ${YEAR} — Cartes Crypto | TopCryptoCards`, desc: `Tout savoir sur les 10 principales cryptomonnaies : Bitcoin, Ethereum, XRP, Solana… et quelles cartes crypto les supportent en ${YEAR}.`, h1: `Guide des Principales Cryptomonnaies`, intro: `Bitcoin, Ethereum, XRP, Solana… Chaque cryptomonnaie a ses spécificités : cas d'usage, vitesse de transaction, niveau de décentralisation. Retrouvez notre guide complet pour chaque crypto et découvrez quelles cartes crypto les supportent.` },
  de: { title: `Kryptowährungs-Guide ${YEAR} — Krypto-Karten | TopCryptoCards`, desc: `Alles über die 10 wichtigsten Kryptowährungen: Bitcoin, Ethereum, XRP, Solana… und welche Krypto-Karten sie unterstützen in ${YEAR}.`, h1: `Guide zu den wichtigsten Kryptowährungen`, intro: `Bitcoin, Ethereum, XRP, Solana… Jede Kryptowährung hat ihre Besonderheiten: Anwendungsfälle, Transaktionsgeschwindigkeit, Dezentralisierungsgrad. Finden Sie unseren vollständigen Leitfaden und entdecken Sie, welche Krypto-Karten sie unterstützen.` },
  es: { title: `Guía Criptomonedas ${YEAR} — Tarjetas Crypto | TopCryptoCards`, desc: `Todo sobre las 10 principales criptomonedas: Bitcoin, Ethereum, XRP, Solana… y qué tarjetas crypto las soportan en ${YEAR}.`, h1: `Guía de las Principales Criptomonedas`, intro: `Bitcoin, Ethereum, XRP, Solana… Cada criptomoneda tiene sus características: casos de uso, velocidad de transacción, nivel de descentralización. Encuentra nuestra guía completa y descubre qué tarjetas crypto las soportan.` },
  it: { title: `Guida Criptovalute ${YEAR} — Carte Crypto | TopCryptoCards`, desc: `Tutto sulle 10 principali criptovalute: Bitcoin, Ethereum, XRP, Solana… e quali carte crypto le supportano nel ${YEAR}.`, h1: `Guida alle Principali Criptovalute`, intro: `Bitcoin, Ethereum, XRP, Solana… Ogni criptovaluta ha le sue caratteristiche: casi d'uso, velocità di transazione, livello di decentralizzazione. Trova la nostra guida completa e scopri quali carte crypto le supportano.` },
  en: { title: `Crypto Guide ${YEAR} — Best Crypto Cards | TopCryptoCards`, desc: `Everything about the top 10 cryptocurrencies: Bitcoin, Ethereum, XRP, Solana… and which crypto cards support them in ${YEAR}.`, h1: `Guide to the Top Cryptocurrencies`, intro: `Bitcoin, Ethereum, XRP, Solana… each cryptocurrency has its own characteristics: use cases, transaction speed, decentralization level. Find our complete guide for each crypto and discover which crypto cards support them.` },
};

const HOME_LABEL: Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };
const CRYPTO_SEGMENT: Record<string, string> = { fr: 'cryptos', de: 'cryptos', es: 'cryptos', it: 'cryptos', en: 'cryptos' };

export default function CryptoList() {
  const { lang = 'fr' } = useParams<{ lang: string }>();
  const { t } = useTranslation('common');
  const seo = SEO[lang] || SEO.en;
  const segment = CRYPTO_SEGMENT[lang] || 'cryptos';
  const slugs = THEMATIC_SLUGS[lang] || THEMATIC_SLUGS.en;
  const guideLinks = GUIDES_LINKS[lang] || GUIDES_LINKS.en;

  useSeoMeta({ title: seo.title, description: seo.desc, lang });

  useHreflang(l => `https://topcryptocards.eu/${l}/cryptos`, []);

  // Schema.org CollectionPage
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: seo.h1,
      description: seo.desc,
      url: `${BASE}/${lang}/cryptos`,
      inLanguage: lang,
      publisher: {
        '@type': 'Organization',
        name: 'TopCryptoCards',
        url: BASE,
      },
      hasPart: CRYPTOS.map((c) => ({
        '@type': 'WebPage',
        name: c.name,
        url: `${BASE}/${lang}/cryptos/${c.symbol}`,
      })),
    };
    document.getElementById('schema-cryptolist')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-cryptolist';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-cryptolist')?.remove(); };
  }, [lang, seo]);

  // ── BreadcrumbList schema ────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: HOME_LABEL[lang] ?? 'Home', item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: seo.h1, item: `${BASE}/${lang}/cryptos` },
      ],
    };
    document.getElementById('schema-cryptolist-breadcrumb')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-cryptolist-breadcrumb'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-cryptolist-breadcrumb')?.remove(); };
  }, [lang, seo]);

  return (
    <div className="container-app py-10">
      <Breadcrumb items={[
        { label: HOME_LABEL[lang] || 'Home', href: `/${lang}` },
        { label: seo.h1 },
      ]} />

      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 mt-4">
        {seo.h1}
      </h1>
      <p className="text-slate-400 text-lg mb-10 max-w-2xl">{seo.intro}</p>

      {/* Thematic guide links */}
      <div className="mb-10">
        <h2 className="text-base font-semibold text-slate-400 mb-3">
          {GUIDES_TITLE[lang] || GUIDES_TITLE.en}
        </h2>
        <div className="flex flex-wrap gap-2">
          {guideLinks.map((g) => (
            <Link
              key={g.key}
              to={`/${lang}/${slugs[g.key as keyof typeof slugs]}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
            >
              <span className="text-base leading-none">{g.icon}</span>
              {g.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CRYPTOS.map((crypto) => (
          <Link
            key={crypto.symbol}
            to={`/${lang}/${segment}/${crypto.symbol}`}
            className="group block p-5 rounded-2xl bg-bg-card border border-bg-border hover:border-cyan-accent/40 transition-all hover:shadow-lg hover:shadow-cyan-accent/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                style={{ backgroundColor: crypto.color + '33', border: `2px solid ${crypto.color}66` }}
              >
                <span style={{ color: crypto.color }}>{crypto.emoji}</span>
              </div>
              <div>
                <div className="font-bold text-white text-base group-hover:text-cyan-accent transition-colors">{crypto.name}</div>
                <div className="text-xs text-slate-500 font-mono">{crypto.ticker}</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {crypto.desc[lang as keyof typeof crypto.desc] || crypto.desc.en}
            </p>
            <div className="mt-3 text-xs text-cyan-accent/70 group-hover:text-cyan-accent transition-colors">
              {t('read_guide')}
            </div>
          </Link>
        ))}
      </div>

      {/* Bloc éditorial — thin content fix + liens thématiques */}
      {(() => {
        const ed = CRYPTOLIST_EDITORIAL[lang] ?? CRYPTOLIST_EDITORIAL.en;
        const slugs = THEMATIC_SLUGS[lang] ?? THEMATIC_SLUGS.en;
        return (
          <div className="mt-14 border-t border-bg-border pt-10">
            <h2 className="text-xl font-display font-bold text-white mb-4">{ed.h2}</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mb-8">{ed.body}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{ed.related}</p>
            <div className="flex flex-wrap gap-2">
              {ed.links.map(({ emoji, label, slug }) => {
                const href = slugs[slug as keyof typeof slugs];
                if (!href) return null;
                return (
                  <Link key={slug} to={`/${lang}/${href}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
                    <span aria-hidden="true">{emoji}</span>{label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
