/**
 * Cashback Calculator, standalone tool page
 * URL: /:lang/calculateur-cashback-crypto (etc.)
 * Purpose: earn backlinks from bloggers embedding this tool
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ExternalLink, TrendingUp } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import Breadcrumb from '../components/Breadcrumb';
import { THEMATIC_ROUTES } from '../config/routes';

const YEAR = new Date().getFullYear();

/* ── i18n ─────────────────────────────────────────────────────────────────── */
const COPY: Record<string, {
  title: string; h1: string; desc: string; intro: string;
  labelSpend: string; labelSpendUnit: string;
  colCard: string; colRate: string; colAnnual: string; colToken: string;
  noStaking: string; withStaking: string; bestValue: string;
  ctaSimulator: string; ctaBest: string;
  note: string; embedTitle: string; embedCopy: string; embedCopied: string;
  faqTitle: string; faqs: { q: string; a: string }[];
}> = {
  fr: {
    title:        `Calculateur Cashback Carte Crypto ${YEAR}, Combien gagnez-vous ? | TopCryptoCards`,
    h1:           `Calculateur Cashback Carte Crypto ${YEAR}`,
    desc:         `Calculez votre cashback annuel avec chaque carte crypto en ${YEAR}. Entrez vos dépenses mensuelles, comparez les gains instantanément. Gratuit ✓`,
    intro:        `Entrez votre dépense mensuelle totale et découvrez combien chaque carte crypto vous rapporte par an en cashback. Les résultats sont triés du meilleur au moins bon. Aucune inscription requise.`,
    labelSpend:   'Mes dépenses mensuelles',
    labelSpendUnit: '€/mois',
    colCard:      'Carte',
    colRate:      'Taux cashback',
    colAnnual:    'Gain annuel estimé',
    colToken:     'Token reçu',
    noStaking:    'Sans staking',
    withStaking:  'Avec staking',
    bestValue:    '⭐ Meilleur rapport',
    ctaSimulator: 'Simulateur avancé par catégories →',
    ctaBest:      'Voir le classement complet des cartes →',
    note:         `Les gains sont calculés sur la base du taux de cashback × dépenses mensuelles × 12. La valeur en euros du cashback dépend du cours du token à la date de conversion. Les taux affichés correspondent aux conditions standards de chaque émetteur en ${YEAR}.`,
    embedTitle:   'Intégrer ce calculateur',
    embedCopy:    'Copier le code',
    embedCopied:  'Copié !',
    faqTitle:     'Questions fréquentes',
    faqs: [
      { q: 'Comment est calculé le cashback annuel ?', a: `Le cashback annuel = taux de cashback × dépenses mensuelles × 12. Par exemple, avec 1 000 €/mois et un taux de 2 %, vous gagnez 240 € de cashback en crypto par an.` },
      { q: 'Faut-il faire du staking pour obtenir le cashback ?', a: `Non, plusieurs cartes offrent un cashback sans staking : Gnosis Pay (2 % en GNO), Nexo Card (2 % en BTC), Brighty (1,75 % en USDC), MetaMask Card (1 % en ETH). Les cartes Crypto.com nécessitent du staking pour les meilleurs taux.` },
      { q: 'En quelle crypto est versé le cashback ?', a: `Cela dépend de la carte : Nexo Card en BTC ou NEXO, Gnosis Pay en GNO, Brighty en USDC (stablecoin), MetaMask Card en ETH, Crypto.com en CRO. Le cashback en BTC est le plus stable long terme.` },
      { q: 'Ce calculateur est-il exact ?', a: `Les taux affichés sont basés sur les conditions officielles de chaque émetteur en ${YEAR}. Les plafonds mensuels de cashback, les promotions temporaires et la dépréciation possible du token ne sont pas pris en compte. Utilisez notre simulateur avancé pour une estimation par catégories de dépenses.` },
    ],
  },
  de: {
    title:        `Cashback Rechner Krypto-Karte ${YEAR}, Wie viel verdienen Sie? | TopCryptoCards`,
    h1:           `Krypto-Karte Cashback-Rechner ${YEAR}`,
    desc:         `Berechnen Sie Ihr jährliches Cashback mit jeder Krypto-Karte in ${YEAR}. Monatliche Ausgaben eingeben, Gewinne sofort vergleichen. Kostenlos ✓`,
    intro:        `Geben Sie Ihre monatlichen Gesamtausgaben ein und entdecken Sie, wie viel Ihnen jede Krypto-Karte pro Jahr an Cashback einbringt. Keine Anmeldung erforderlich.`,
    labelSpend:   'Monatliche Ausgaben',
    labelSpendUnit: '€/Monat',
    colCard:      'Karte',
    colRate:      'Cashback-Rate',
    colAnnual:    'Geschätzter Jahresgewinn',
    colToken:     'Token',
    noStaking:    'Ohne Staking',
    withStaking:  'Mit Staking',
    bestValue:    '⭐ Bestes Preis-Leistungs-Verhältnis',
    ctaSimulator: 'Erweiterter Simulator nach Kategorien →',
    ctaBest:      'Vollständiges Karten-Ranking ansehen →',
    note:         `Die Gewinne werden berechnet als Cashback-Rate × monatliche Ausgaben × 12. Der Euro-Wert des Cashbacks hängt vom Token-Kurs zum Konvertierungszeitpunkt ab.`,
    embedTitle:   'Diesen Rechner einbetten',
    embedCopy:    'Code kopieren',
    embedCopied:  'Kopiert!',
    faqTitle:     'Häufige Fragen',
    faqs: [
      { q: 'Wie wird das jährliche Cashback berechnet?', a: `Jahres-Cashback = Cashback-Rate × monatliche Ausgaben × 12. Beispiel: 1.000 €/Monat × 2 % = 240 € Krypto-Cashback pro Jahr.` },
      { q: 'Ist Staking für Cashback erforderlich?', a: `Nein, mehrere Karten bieten Cashback ohne Staking: Gnosis Pay (2 % in GNO), Nexo Card (2 % in BTC), Brighty (1,75 % in USDC), MetaMask Card (1 % in ETH).` },
      { q: 'In welcher Krypto wird Cashback ausgezahlt?', a: `Je nach Karte: Nexo Card in BTC oder NEXO, Gnosis Pay in GNO, Brighty in USDC, MetaMask Card in ETH, Crypto.com in CRO.` },
      { q: 'Ist dieser Rechner genau?', a: `Die angezeigten Raten basieren auf offiziellen Bedingungen in ${YEAR}. Monatliche Cashback-Obergrenzen und Token-Wertentwicklung sind nicht berücksichtigt. Nutzen Sie unseren erweiterten Simulator für eine Kategorie-basierte Schätzung.` },
    ],
  },
  es: {
    title:        `Calculadora Cashback Tarjeta Crypto ${YEAR}, ¿Cuánto ganas? | TopCryptoCards`,
    h1:           `Calculadora de Cashback para Tarjeta Crypto ${YEAR}`,
    desc:         `Calcula tu cashback anual con cada tarjeta crypto en ${YEAR}. Introduce tus gastos mensuales y compara las ganancias al instante. Gratis ✓`,
    intro:        `Introduce tu gasto mensual total y descubre cuánto te reporta cada tarjeta crypto al año en cashback. Resultados ordenados de mayor a menor. Sin registro.`,
    labelSpend:   'Mis gastos mensuales',
    labelSpendUnit: '€/mes',
    colCard:      'Tarjeta',
    colRate:      'Tasa de cashback',
    colAnnual:    'Ganancia anual estimada',
    colToken:     'Token recibido',
    noStaking:    'Sin staking',
    withStaking:  'Con staking',
    bestValue:    '⭐ Mejor relación calidad-precio',
    ctaSimulator: 'Simulador avanzado por categorías →',
    ctaBest:      'Ver el ranking completo de tarjetas →',
    note:         `Las ganancias se calculan como: tasa de cashback × gastos mensuales × 12. El valor en euros depende del precio del token en el momento de la conversión.`,
    embedTitle:   'Insertar esta calculadora',
    embedCopy:    'Copiar código',
    embedCopied:  '¡Copiado!',
    faqTitle:     'Preguntas frecuentes',
    faqs: [
      { q: '¿Cómo se calcula el cashback anual?', a: `Cashback anual = tasa de cashback × gastos mensuales × 12. Ejemplo: 1.000 €/mes × 2 % = 240 € en crypto al año.` },
      { q: '¿Se necesita staking para el cashback?', a: `No. Gnosis Pay (2 % en GNO), Nexo Card (2 % en BTC), Brighty (1,75 % en USDC) y MetaMask Card (1 % en ETH) ofrecen cashback sin staking.` },
      { q: '¿En qué cripto se paga el cashback?', a: `Depende de la tarjeta: Nexo Card en BTC o NEXO, Gnosis Pay en GNO, Brighty en USDC, MetaMask Card en ETH, Crypto.com en CRO.` },
      { q: '¿Es exacta esta calculadora?', a: `Las tasas mostradas se basan en las condiciones oficiales en ${YEAR}. Los límites mensuales de cashback no están incluidos. Usa el simulador avanzado para una estimación más precisa.` },
    ],
  },
  it: {
    title:        `Calcolatore Cashback Carta Crypto ${YEAR}, Quanto guadagni? | TopCryptoCards`,
    h1:           `Calcolatore Cashback Carta Crypto ${YEAR}`,
    desc:         `Calcola il tuo cashback annuale con ogni carta crypto nel ${YEAR}. Inserisci le spese mensili e confronta i guadagni istantaneamente. Gratuito ✓`,
    intro:        `Inserisci la tua spesa mensile totale e scopri quanto ti rende ogni carta crypto all'anno in cashback. Risultati ordinati dal migliore al peggiore. Nessuna registrazione richiesta.`,
    labelSpend:   'Le mie spese mensili',
    labelSpendUnit: '€/mese',
    colCard:      'Carta',
    colRate:      'Tasso cashback',
    colAnnual:    'Guadagno annuale stimato',
    colToken:     'Token ricevuto',
    noStaking:    'Senza staking',
    withStaking:  'Con staking',
    bestValue:    '⭐ Miglior rapporto qualità-prezzo',
    ctaSimulator: 'Simulatore avanzato per categorie →',
    ctaBest:      'Vedi il ranking completo delle carte →',
    note:         `I guadagni sono calcolati come: tasso cashback × spese mensili × 12. Il valore in euro del cashback dipende dal corso del token al momento della conversione.`,
    embedTitle:   'Incorpora questo calcolatore',
    embedCopy:    'Copia il codice',
    embedCopied:  'Copiato!',
    faqTitle:     'Domande frequenti',
    faqs: [
      { q: 'Come viene calcolato il cashback annuale?', a: `Cashback annuale = tasso cashback × spese mensili × 12. Esempio: 1.000 €/mese × 2 % = 240 € in crypto all'anno.` },
      { q: 'È necessario lo staking per il cashback?', a: `No. Gnosis Pay (2 % in GNO), Nexo Card (2 % in BTC), Brighty (1,75 % in USDC) e MetaMask Card (1 % in ETH) offrono cashback senza staking.` },
      { q: 'In quale crypto viene pagato il cashback?', a: `Dipende dalla carta: Nexo Card in BTC o NEXO, Gnosis Pay in GNO, Brighty in USDC, MetaMask Card in ETH, Crypto.com in CRO.` },
      { q: 'Questo calcolatore è preciso?', a: `I tassi mostrati si basano sulle condizioni ufficiali nel ${YEAR}. I limiti mensili di cashback non sono inclusi. Usa il simulatore avanzato per una stima più precisa.` },
    ],
  },
  en: {
    title:        `Crypto Card Cashback Calculator ${YEAR}, How Much Do You Earn? | TopCryptoCards`,
    h1:           `Crypto Card Cashback Calculator ${YEAR}`,
    desc:         `Calculate your annual cashback with every crypto card in ${YEAR}. Enter your monthly spending and compare earnings instantly. Free ✓`,
    intro:        `Enter your total monthly spending and see how much each crypto card earns you in cashback per year. Results sorted best to worst. No signup required.`,
    labelSpend:   'My monthly spending',
    labelSpendUnit: '€/month',
    colCard:      'Card',
    colRate:      'Cashback rate',
    colAnnual:    'Estimated annual earnings',
    colToken:     'Token received',
    noStaking:    'No staking',
    withStaking:  'With staking',
    bestValue:    '⭐ Best value',
    ctaSimulator: 'Advanced simulator by spending category →',
    ctaBest:      'See the full card ranking →',
    note:         `Earnings calculated as: cashback rate × monthly spending × 12. The euro value of cashback depends on token price at conversion time. Rates shown are based on official conditions in ${YEAR}.`,
    embedTitle:   'Embed this calculator',
    embedCopy:    'Copy code',
    embedCopied:  'Copied!',
    faqTitle:     'Frequently asked questions',
    faqs: [
      { q: 'How is annual cashback calculated?', a: `Annual cashback = cashback rate × monthly spending × 12. Example: €1,000/month × 2% = €240 in crypto cashback per year.` },
      { q: 'Do you need staking to get cashback?', a: `No. Gnosis Pay (2% in GNO), Nexo Card (2% in BTC), Brighty (1.75% in USDC), and MetaMask Card (1% in ETH) all offer cashback with no staking required.` },
      { q: 'Which cryptocurrency is cashback paid in?', a: `It depends on the card: Nexo Card in BTC or NEXO, Gnosis Pay in GNO, Brighty in USDC (stablecoin), MetaMask Card in ETH, Crypto.com in CRO.` },
      { q: 'Is this calculator accurate?', a: `Rates shown are based on official issuer conditions in ${YEAR}. Monthly cashback caps and token price changes are not factored in. Use our advanced simulator for a category-by-category estimate.` },
    ],
  },
};

// Fallbacks for be/at
COPY.be = COPY.fr;
COPY.at = COPY.de;

/* ── Card data (no Supabase needed, fast, embeddable) ────────────────────── */
interface CardRow {
  name: string;
  brand: string;
  rateNoStaking: number;   // base cashback %
  rateWithStaking: number; // premium cashback %
  token: string;
  stakingRequired: number; // EUR equivalent
  annualFee: number;
  cardId: string;
}

const CARDS: CardRow[] = [
  { name: 'Crypto.com Obsidian',     brand: 'crypto-com',     rateNoStaking: 0,    rateWithStaking: 8,    token: 'CRO',   stakingRequired: 150000, annualFee: 0, cardId: 'crypto-com-obsidian' },
  { name: 'Crypto.com Icy White',    brand: 'crypto-com',     rateNoStaking: 0,    rateWithStaking: 5,    token: 'CRO',   stakingRequired: 20000,  annualFee: 0, cardId: 'crypto-com-icy-white' },
  { name: 'Crypto.com Jade Green',   brand: 'crypto-com',     rateNoStaking: 0,    rateWithStaking: 3,    token: 'CRO',   stakingRequired: 2000,   annualFee: 0, cardId: 'crypto-com-jade-green' },
  { name: 'Bybit Card',              brand: 'bybit',          rateNoStaking: 2,    rateWithStaking: 2,    token: 'MNT',   stakingRequired: 0,      annualFee: 0, cardId: 'bybit-card' },
  { name: 'Gnosis Pay',              brand: 'gnosis',         rateNoStaking: 2,    rateWithStaking: 2,    token: 'GNO',   stakingRequired: 0,      annualFee: 0, cardId: 'gnosis-pay-card' },
  { name: 'Nexo Card',               brand: 'nexo',           rateNoStaking: 2,    rateWithStaking: 2,    token: 'BTC',   stakingRequired: 0,      annualFee: 0, cardId: 'nexo-card' },
  { name: 'Bitpanda Card',           brand: 'bitpanda',       rateNoStaking: 2,    rateWithStaking: 2,    token: 'BEST',  stakingRequired: 0,      annualFee: 0, cardId: 'bitpanda-card' },
  { name: 'OKX Card',                brand: 'okx',            rateNoStaking: 1.5,  rateWithStaking: 2,    token: 'OKB',   stakingRequired: 0,      annualFee: 0, cardId: 'okx-card' },
  { name: 'Crypto.com Ruby Steel',   brand: 'crypto-com',     rateNoStaking: 0,    rateWithStaking: 2,    token: 'CRO',   stakingRequired: 200,    annualFee: 0, cardId: 'crypto-com-ruby-steel' },
  { name: 'Brighty Card',            brand: 'brighty',        rateNoStaking: 1.75, rateWithStaking: 1.75, token: 'USDC',  stakingRequired: 0,      annualFee: 0, cardId: 'brighty-card' },
  { name: 'MetaMask Card',           brand: 'metamask',       rateNoStaking: 1,    rateWithStaking: 1,    token: 'ETH',   stakingRequired: 0,      annualFee: 0, cardId: 'metamask-card' },
  { name: 'Revolut Metal',           brand: 'revolut',        rateNoStaking: 1,    rateWithStaking: 1,    token: 'Crypto', stakingRequired: 0,     annualFee: 180, cardId: 'revolut-metal' },
  { name: 'Wirex Elite',             brand: 'wirex',          rateNoStaking: 2,    rateWithStaking: 2,    token: 'WXT',   stakingRequired: 0,      annualFee: 0, cardId: 'wirex-elite' },
  { name: 'Crypto.com Midnight Blue',brand: 'crypto-com',     rateNoStaking: 1,    rateWithStaking: 1,    token: 'CRO',   stakingRequired: 0,      annualFee: 0, cardId: 'crypto-com-midnight-blue' },
];

/* ── Component ────────────────────────────────────────────────────────────── */
export default function CashbackCalculatorPage() {
  const lang = useLanguage();
  const copy = COPY[lang] ?? COPY.fr;

  const [spend, setSpend] = useState(1000);
  const [mode, setMode] = useState<'base' | 'staking'>('base');
  const [copied, setCopied] = useState(false);

  useHreflang(
    (l) => {
      const slug = ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.cashbackCalculator;
      return slug ? `https://topcryptocards.eu/${l}/${slug}` : null;
    },
    [],
  );

  useSeoMeta({
    title: copy.title,
    description: copy.desc,
    canonical: `https://topcryptocards.eu/${lang}/${ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cashbackCalculator ?? ROUTE_TRANSLATIONS.fr.cashbackCalculator}`,
    ogType: 'website',
    ogTitle: copy.title,
    ogDescription: copy.desc,
  });

  const results = useMemo(() => {
    return CARDS
      .map(c => {
        const rate = mode === 'staking' ? c.rateWithStaking : c.rateNoStaking;
        const annual = Math.round(spend * (rate / 100) * 12);
        const net = annual - c.annualFee;
        return { ...c, rate, annual, net };
      })
      .filter(c => c.rate > 0)
      .sort((a, b) => b.net - a.net);
  }, [spend, mode]);

  const bestNet = results[0]?.net ?? 0;

  const simSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.simulator ?? 'simulateur';
  const bestSlug = THEMATIC_ROUTES.best?.[lang as keyof typeof THEMATIC_ROUTES.best] ?? 'meilleure-carte-crypto';
  const feeSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.feeIndex ?? 'frais-cartes-crypto';

  const embedCode = `<iframe src="https://topcryptocards.eu/${lang}/${ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cashbackCalculator ?? 'calculateur-cashback-crypto'}" width="100%" height="600" frameborder="0" title="Cashback Calculator, TopCryptoCards"></iframe>`;

  function handleCopy() {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const breadcrumbItems = [
    { label: lang === 'de' || lang === 'at' ? 'Startseite' : lang === 'es' ? 'Inicio' : lang === 'it' ? 'Home' : lang === 'en' ? 'Home' : 'Accueil', href: `/${lang}` },
    { label: copy.h1 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-bg-card to-bg-elevated border border-bg-border p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex-shrink-0">
            <Calculator className="w-7 h-7 text-cyan-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{copy.h1}</h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">{copy.intro}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-bg-card rounded-xl border border-bg-border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
          <div className="flex-1 w-full">
            <div className="flex items-baseline justify-between mb-3">
              <label className="text-sm text-slate-400">{copy.labelSpend}</label>
              <span className="text-2xl font-bold text-cyan-accent">{spend.toLocaleString()} <span className="text-base font-normal text-slate-400">{copy.labelSpendUnit}</span></span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={spend}
              onChange={e => setSpend(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-accent"
              style={{ background: `linear-gradient(to right, #00D4FF ${(spend - 100) / 49}%, #1F2739 ${(spend - 100) / 49}%)` }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1.5">
              <span>100 €</span><span>5 000 €</span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setMode('base')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'base' ? 'bg-cyan-accent text-bg text-black' : 'bg-bg-elevated border border-bg-border text-slate-300 hover:border-cyan-accent/40 hover:text-white'}`}
            >
              {copy.noStaking}
            </button>
            <button
              onClick={() => setMode('staking')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'staking' ? 'bg-cyan-accent text-black' : 'bg-bg-elevated border border-bg-border text-slate-300 hover:border-cyan-accent/40 hover:text-white'}`}
            >
              {copy.withStaking}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl border border-bg-border overflow-hidden mb-8">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 bg-bg-elevated border-b border-bg-border text-xs font-medium text-slate-500 uppercase tracking-wide">
          <span>{copy.colCard}</span>
          <span className="text-center w-14">{copy.colRate}</span>
          <span className="text-center w-16 hidden sm:block">{copy.colToken}</span>
          <span className="text-right w-24">{copy.colAnnual}</span>
        </div>
        {/* Rows */}
        {results.map((c, i) => {
          const barPct = bestNet > 0 ? Math.max(0, Math.round((c.net / bestNet) * 100)) : 0;
          return (
            <div
              key={c.cardId}
              className={`px-4 py-4 border-b border-bg-border last:border-0 transition-colors ${i === 0 ? 'bg-green-accent/5' : 'bg-bg-card hover:bg-bg-elevated'}`}
            >
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                {/* Card name */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-100 text-sm">{c.name}</span>
                    {i === 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-green-accent/15 text-green-accent border border-green-accent/30">
                        {copy.bestValue}
                      </span>
                    )}
                    {c.annualFee > 0 && (
                      <span className="text-xs text-slate-500">−{c.annualFee}€/an</span>
                    )}
                    {c.stakingRequired > 0 && mode === 'staking' && (
                      <span className="text-xs text-orange-400">staking ~{c.stakingRequired >= 1000 ? `${(c.stakingRequired / 1000).toFixed(0)}k` : c.stakingRequired}€</span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${i === 0 ? 'bg-green-accent' : 'bg-cyan-accent/50'}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
                {/* Rate */}
                <div className="text-center w-14">
                  <span className="text-cyan-accent font-bold text-sm">{c.rate}%</span>
                </div>
                {/* Token */}
                <div className="text-center w-16 hidden sm:block">
                  <span className="text-xs text-slate-500 bg-bg-elevated px-2 py-0.5 rounded-full">{c.token}</span>
                </div>
                {/* Annual gain */}
                <div className="text-right w-24">
                  <span className={`font-bold text-sm ${c.net > 0 ? 'text-green-accent' : 'text-red-400'}`}>
                    {c.net > 0 ? '+' : ''}{c.net} €
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link
          to={`/${lang}/${simSlug}`}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <TrendingUp className="w-4 h-4" />
          {copy.ctaSimulator}
        </Link>
        <Link
          to={`/${lang}/${bestSlug}`}
          className="btn-secondary flex items-center gap-2 justify-center"
        >
          {copy.ctaBest}
        </Link>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-500 mb-10 leading-relaxed">{copy.note}</p>

      {/* Embed section */}
      <div className="bg-bg-elevated rounded-xl border border-bg-border p-6 mb-10">
        <h2 className="text-base font-semibold text-slate-200 mb-3">{copy.embedTitle}</h2>
        <pre className="bg-bg-card border border-bg-border rounded-lg p-4 text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap break-all">
          {embedCode}
        </pre>
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-cyan-accent text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {copied ? copy.embedCopied : copy.embedCopy}
          </button>
          <p className="text-xs text-slate-500">
            Source: <a href="https://topcryptocards.eu" className="text-cyan-accent/70 hover:text-cyan-accent underline">TopCryptoCards.eu</a>
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{copy.faqTitle}</h2>
        <div className="space-y-3">
          {copy.faqs.map((faq, i) => (
            <details key={i} className="bg-bg-card rounded-xl border border-bg-border p-4 cursor-pointer group">
              <summary className="font-semibold text-slate-200 list-none flex justify-between items-center gap-3">
                <span>{faq.q}</span>
                <span className="text-slate-500 group-open:rotate-180 transition-transform flex-shrink-0">▾</span>
              </summary>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Schema.org SoftwareApplication */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: copy.h1,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        description: copy.desc,
        url: `https://topcryptocards.eu/${lang}/${ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cashbackCalculator}`,
        publisher: {
          '@type': 'Organization',
          name: 'TopCryptoCards',
          url: 'https://topcryptocards.eu',
        },
        featureList: copy.faqs.map(f => f.q),
      })}} />
    </div>
  );
}
