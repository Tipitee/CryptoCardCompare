/**
 * Fee Calculator, "Is a paid tier worth it?" tool page
 * URL: /:lang/calculateur-frais-carte-crypto (etc.)
 * Purpose: ROI / break-even analysis for staking-gated or paid cards
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import Breadcrumb from '../components/Breadcrumb';
import { THEMATIC_ROUTES } from '../config/routes';

const YEAR = new Date().getFullYear();
const BASE = 'https://topcryptocards.eu';

/* ── i18n ─────────────────────────────────────────────────────────────────── */
const COPY: Record<string, {
  title: string; h1: string; desc: string; intro: string;
  labelSpend: string; labelSpendUnit: string;
  labelFreeRef: string;
  colCard: string; colAnnualCost: string; colExtraCashback: string;
  colBreakEven: string; colVerdict: string;
  worth: string; notWorth: string; neutral: string;
  months: string; breakEvenAt: string; never: string;
  freeBaseline: string; paidTier: string; stakingTier: string;
  ctaBest: string; ctaSimulator: string; ctaCashback: string;
  note: string; embedTitle: string; embedCopy: string; embedCopied: string;
  faqTitle: string; faqs: { q: string; a: string }[];
}> = {
  fr: {
    title:         `Calculateur Frais Carte Crypto ${YEAR}, Ça Vaut le Coup ? | TopCryptoCards`,
    h1:            `Calculateur Frais Carte Crypto ${YEAR}`,
    desc:          `Calculez si les frais ou le staking d'une carte crypto valent le coup selon vos dépenses ${YEAR}. Seuil de rentabilité en quelques secondes. Gratuit ✓`,
    intro:         `Vous envisagez une carte avec des frais ou du staking ? Entrez vos dépenses mensuelles et voyez immédiatement à partir de quel seuil chaque carte devient rentable par rapport à une carte gratuite à 1 % de cashback.`,
    labelSpend:    'Mes dépenses mensuelles',
    labelSpendUnit: '€/mois',
    labelFreeRef:  'Référence : carte gratuite à 1 % de cashback',
    colCard:       'Carte',
    colAnnualCost: 'Coût annuel',
    colExtraCashback: 'Cashback supplémentaire/mois',
    colBreakEven:  'Seuil de rentabilité',
    colVerdict:    'À votre niveau',
    worth:         '✅ Rentable',
    notWorth:      '❌ Pas rentable',
    neutral:       '⚖️ À la limite',
    months:        'mois',
    breakEvenAt:   'Rentable dès',
    never:         'Jamais rentable',
    freeBaseline:  'Carte gratuite (référence 1%)',
    paidTier:      'Carte à abonnement',
    stakingTier:   'Tier staking',
    ctaBest:       'Voir le classement complet →',
    ctaSimulator:  'Simulateur avancé par catégories →',
    ctaCashback:   'Calculateur cashback annuel →',
    note:          `Le seuil de rentabilité est calculé comme suit : coût annuel ÷ (cashback supplémentaire mensuel × 12). Le cashback supplémentaire = (taux premium - 1 %) × dépenses mensuelles. La dépréciation du token de staking n'est pas prise en compte.`,
    embedTitle:    'Intégrer ce calculateur',
    embedCopy:     'Copier le code',
    embedCopied:   'Copié !',
    faqTitle:      'Questions fréquentes',
    faqs: [
      { q: 'Comment calculez-vous le seuil de rentabilité ?', a: `Seuil de rentabilité (mois) = coût annuel ÷ (cashback supplémentaire mensuel). Le cashback supplémentaire est la différence entre le taux de la carte premium et une carte gratuite à 1 %, multipliée par vos dépenses mensuelles. Par exemple, si une carte premium offre 3 % au lieu de 1 %, avec 1 000 €/mois de dépenses : gain extra = 20 €/mois, et si son coût est de 180 €/an, le seuil de rentabilité est de 9 mois.` },
      { q: 'Faut-il inclure la valeur du token staké dans le calcul ?', a: `Non, ce calculateur est volontairement conservateur : il ne prend pas en compte la plus-value potentielle (ni la moins-value) du token de staking. Si le token s'apprécie, la rentabilité réelle est meilleure. Si le token se déprécie, le coût effectif du staking augmente.` },
      { q: 'Quelle est la carte gratuite de référence ?', a: `La référence est une carte avec 0 € de frais et 1 % de cashback (ex. MetaMask Card, Crypto.com Midnight Blue, Revolut Standard). Ce choix représente ce que vous obtenez sans aucun engagement financier.` },
      { q: 'Revolut Metal vaut-il le coup ?', a: `À 15 €/mois (180 €/an) et 1 % de cashback, Revolut Metal n'offre pas plus de cashback qu'une carte gratuite à 1 %, l'avantage différenciant est l'assurance voyage, le lounge, la concierge, pas le cashback. Pour le cashback pur, une carte gratuite à 2 % (Gnosis Pay, Nexo) est meilleure.` },
    ],
  },
  de: {
    title:         `Gebührenrechner Krypto-Karte ${YEAR}, Lohnt sich das? | TopCryptoCards`,
    h1:            `Krypto-Karte Gebührenrechner ${YEAR}`,
    desc:          `Berechnen Sie, ob die Gebühren oder das Staking einer Krypto-Karte sich in ${YEAR} lohnen. Rentabilitätsschwelle in Sekunden. Kostenlos ✓`,
    intro:         `Planen Sie eine Karte mit Gebühren oder Staking? Geben Sie Ihre monatlichen Ausgaben ein und sehen Sie sofort, ab welcher Schwelle jede Karte im Vergleich zu einer kostenlosen Karte mit 1 % Cashback rentabel wird.`,
    labelSpend:    'Monatliche Ausgaben',
    labelSpendUnit: '€/Monat',
    labelFreeRef:  'Referenz: Kostenlose Karte mit 1 % Cashback',
    colCard:       'Karte',
    colAnnualCost: 'Jahreskosten',
    colExtraCashback: 'Extra-Cashback/Monat',
    colBreakEven:  'Rentabilitätsschwelle',
    colVerdict:    'Bei Ihrem Niveau',
    worth:         '✅ Lohnend',
    notWorth:      '❌ Nicht lohnend',
    neutral:       '⚖️ Grenzwertig',
    months:        'Monate',
    breakEvenAt:   'Rentabel ab',
    never:         'Nie rentabel',
    freeBaseline:  'Kostenlose Karte (Referenz 1%)',
    paidTier:      'Abo-Karte',
    stakingTier:   'Staking-Tier',
    ctaBest:       'Zum vollständigen Ranking →',
    ctaSimulator:  'Erweiterter Simulator →',
    ctaCashback:   'Cashback-Rechner →',
    note:          `Die Rentabilitätsschwelle wird berechnet als: Jahreskosten ÷ (monatliches Extra-Cashback). Die Wertentwicklung des Staking-Tokens wird nicht berücksichtigt.`,
    embedTitle:    'Diesen Rechner einbetten',
    embedCopy:     'Code kopieren',
    embedCopied:   'Kopiert!',
    faqTitle:      'Häufige Fragen',
    faqs: [
      { q: 'Wie wird die Rentabilitätsschwelle berechnet?', a: `Rentabilitätsschwelle (Monate) = Jahreskosten ÷ (monatliches Extra-Cashback). Das Extra-Cashback ist die Differenz zwischen dem Premium-Cashback-Satz und 1 % (Basis), multipliziert mit den monatlichen Ausgaben.` },
      { q: 'Sollte der Token-Wert beim Staking berücksichtigt werden?', a: `Dieser Rechner ist bewusst konservativ und berücksichtigt keine potenziellen Kurs-gewinne oder -verluste des Staking-Tokens. In der Realität kann die tatsächliche Rentabilität je nach Token-Performance höher oder niedriger ausfallen.` },
      { q: 'Was ist die Referenzkarte?', a: `Die Referenz ist eine Karte mit 0 € Jahresgebühr und 1 % Cashback (z.B. MetaMask Card, Crypto.com Midnight Blue). Dies repräsentiert das, was Sie ohne finanzielles Engagement erhalten.` },
      { q: 'Lohnt sich Crypto.com Jade Green (2.000 € Staking)?', a: `Bei 2.000 € Staking und 3 % statt 1 % Cashback: Extra-Cashback = 2 % × monatliche Ausgaben. Bei 1.000 €/Monat = 20 €/Monat Extra. Rentabilitätsschwelle = 2.000 € ÷ (20 × 12) = 8,3 Jahre, nur bei Token-Kursstabilität.` },
    ],
  },
  es: {
    title:         `Calculadora Tarifas Tarjeta Crypto ${YEAR}, ¿Vale la Pena? | TopCryptoCards`,
    h1:            `Calculadora de Tarifas de Tarjeta Crypto ${YEAR}`,
    desc:          `Calcula si las comisiones o el staking de una tarjeta crypto valen la pena según tus gastos en ${YEAR}. Umbral de rentabilidad en segundos. Gratis ✓`,
    intro:         `¿Estás considerando una tarjeta con tarifas o staking? Introduce tus gastos mensuales y ve inmediatamente a partir de qué umbral cada tarjeta se vuelve rentable respecto a una tarjeta gratuita con 1 % de cashback.`,
    labelSpend:    'Mis gastos mensuales',
    labelSpendUnit: '€/mes',
    labelFreeRef:  'Referencia: tarjeta gratuita con 1 % de cashback',
    colCard:       'Tarjeta',
    colAnnualCost: 'Coste anual',
    colExtraCashback: 'Cashback extra/mes',
    colBreakEven:  'Umbral de rentabilidad',
    colVerdict:    'A tu nivel',
    worth:         '✅ Rentable',
    notWorth:      '❌ No rentable',
    neutral:       '⚖️ En el límite',
    months:        'meses',
    breakEvenAt:   'Rentable desde',
    never:         'Nunca rentable',
    freeBaseline:  'Tarjeta gratuita (referencia 1%)',
    paidTier:      'Tarjeta de suscripción',
    stakingTier:   'Tier staking',
    ctaBest:       'Ver el ranking completo →',
    ctaSimulator:  'Simulador avanzado →',
    ctaCashback:   'Calculadora cashback anual →',
    note:          `El umbral de rentabilidad se calcula como: coste anual ÷ (cashback extra mensual). La apreciación o depreciación del token de staking no se considera.`,
    embedTitle:    'Insertar esta calculadora',
    embedCopy:     'Copiar código',
    embedCopied:   '¡Copiado!',
    faqTitle:      'Preguntas frecuentes',
    faqs: [
      { q: '¿Cómo se calcula el umbral de rentabilidad?', a: `Umbral de rentabilidad (meses) = coste anual ÷ (cashback extra mensual). El cashback extra es la diferencia entre la tasa premium y el 1 % base, multiplicada por tus gastos mensuales.` },
      { q: '¿Se debería incluir el valor del token en el cálculo?', a: `Esta calculadora es deliberadamente conservadora y no tiene en cuenta ganancias ni pérdidas potenciales del token de staking. La rentabilidad real puede variar según la evolución del token.` },
      { q: '¿Cuál es la tarjeta de referencia?', a: `La referencia es una tarjeta con 0 € de cuota y 1 % de cashback (p.ej. MetaMask Card, Crypto.com Midnight Blue). Esto representa lo que obtienes sin compromiso financiero.` },
      { q: '¿Vale la pena Revolut Metal?', a: `A 15 €/mes y 1 % de cashback, Revolut Metal no ofrece más cashback que una tarjeta gratuita al 1 %. La ventaja diferenciadora son los seguros de viaje, el acceso a lounges y la concierge.` },
    ],
  },
  it: {
    title:         `Calcolatore Costi Carta Crypto ${YEAR}, Vale la Pena? | TopCryptoCards`,
    h1:            `Calcolatore Costi Carta Crypto ${YEAR}`,
    desc:          `Calcola se le commissioni o lo staking di una carta crypto valgono la pena in base alle tue spese nel ${YEAR}. Soglia di redditività in pochi secondi. Gratuito ✓`,
    intro:         `Stai valutando una carta con commissioni o staking? Inserisci le tue spese mensili e vedi immediatamente da quale soglia ogni carta diventa redditizia rispetto a una carta gratuita con 1 % di cashback.`,
    labelSpend:    'Le mie spese mensili',
    labelSpendUnit: '€/mese',
    labelFreeRef:  'Riferimento: carta gratuita con 1 % di cashback',
    colCard:       'Carta',
    colAnnualCost: 'Costo annuo',
    colExtraCashback: 'Cashback extra/mese',
    colBreakEven:  'Soglia di redditività',
    colVerdict:    'Al tuo livello',
    worth:         '✅ Redditizio',
    notWorth:      '❌ Non redditizio',
    neutral:       '⚖️ Al limite',
    months:        'mesi',
    breakEvenAt:   'Redditizio da',
    never:         'Mai redditizio',
    freeBaseline:  'Carta gratuita (riferimento 1%)',
    paidTier:      'Carta ad abbonamento',
    stakingTier:   'Tier staking',
    ctaBest:       'Vedi il ranking completo →',
    ctaSimulator:  'Simulatore avanzato →',
    ctaCashback:   'Calcolatore cashback annuale →',
    note:          `La soglia di redditività è calcolata come: costo annuo ÷ (cashback extra mensile). L'apprezzamento o la svalutazione del token di staking non è considerata.`,
    embedTitle:    'Incorpora questo calcolatore',
    embedCopy:     'Copia il codice',
    embedCopied:   'Copiato!',
    faqTitle:      'Domande frequenti',
    faqs: [
      { q: 'Come viene calcolata la soglia di redditività?', a: `Soglia di redditività (mesi) = costo annuo ÷ (cashback extra mensile). Il cashback extra è la differenza tra il tasso premium e l'1 % di base, moltiplicata per le spese mensili.` },
      { q: 'Si dovrebbe includere il valore del token nel calcolo?', a: `Questo calcolatore è volutamente conservativo e non tiene conto di potenziali plusvalenze o minusvalenze del token di staking. La redditività reale può variare in base all'andamento del token.` },
      { q: 'Qual è la carta di riferimento?', a: `Il riferimento è una carta con 0 € di quota annua e 1 % di cashback (es. MetaMask Card, Crypto.com Midnight Blue). Rappresenta ciò che si ottiene senza impegno finanziario.` },
      { q: 'Vale la pena Revolut Metal?', a: `A 15 €/mese e 1 % di cashback, Revolut Metal non offre più cashback di una carta gratuita all'1 %. Il vantaggio differenziante sono le assicurazioni viaggio, l'accesso alle lounge e il servizio di concierge.` },
    ],
  },
  en: {
    title:         `Crypto Card Fee Calculator ${YEAR}, Is It Worth It? | TopCryptoCards`,
    h1:            `Crypto Card Fee Calculator ${YEAR}`,
    desc:          `Calculate whether a crypto card's fees or staking requirement are worth it based on your spending in ${YEAR}. Break-even analysis in seconds. Free ✓`,
    intro:         `Considering a card with annual fees or a staking requirement? Enter your monthly spending and instantly see at what threshold each card becomes profitable compared to a free 1% cashback card.`,
    labelSpend:    'My monthly spending',
    labelSpendUnit: '€/month',
    labelFreeRef:  'Baseline: free card at 1% cashback',
    colCard:       'Card',
    colAnnualCost: 'Annual cost',
    colExtraCashback: 'Extra cashback/month',
    colBreakEven:  'Break-even point',
    colVerdict:    'At your level',
    worth:         '✅ Worth it',
    notWorth:      '❌ Not worth it',
    neutral:       '⚖️ Borderline',
    months:        'months',
    breakEvenAt:   'Worth it from',
    never:         'Never profitable',
    freeBaseline:  'Free card (1% baseline)',
    paidTier:      'Subscription card',
    stakingTier:   'Staking tier',
    ctaBest:       'See full ranking →',
    ctaSimulator:  'Advanced simulator by category →',
    ctaCashback:   'Annual cashback calculator →',
    note:          `Break-even is calculated as: annual cost ÷ (monthly extra cashback × 12). Extra cashback = (premium rate − 1%) × monthly spending. Token price appreciation or depreciation is not factored in.`,
    embedTitle:    'Embed this calculator',
    embedCopy:     'Copy code',
    embedCopied:   'Copied!',
    faqTitle:      'Frequently asked questions',
    faqs: [
      { q: 'How is the break-even point calculated?', a: `Break-even (months) = annual cost ÷ (monthly extra cashback). Extra cashback = (premium cashback rate − 1%) × monthly spending. For example: Revolut Metal costs €180/year but offers the same 1% cashback as a free card, extra cashback = 0, break-even = never.` },
      { q: 'Should I include the staking token value?', a: `This calculator is deliberately conservative and does not factor in potential token price gains or losses. If the staking token appreciates, the actual ROI is better. If it depreciates, the effective staking cost is higher.` },
      { q: 'What is the baseline free card?', a: `The baseline is a card with €0 annual fee and 1% cashback (e.g. MetaMask Card, Crypto.com Midnight Blue). This represents what you get with zero financial commitment.` },
      { q: 'Is Crypto.com Jade Green worth it?', a: `At €2,000 staking and 3% vs 1% cashback: extra cashback = 2% × monthly spend. At €1,000/month that's €20/month extra. Break-even = €2,000 ÷ (€20 × 12) = 8.3 years. Worth it only if CRO holds its value long-term.` },
    ],
  },
};

COPY.be = COPY.fr;
COPY.at = COPY.de;

/* ── Card data ────────────────────────────────────────────────────────────── */
interface CardEntry {
  name: string;
  type: 'staking' | 'paid' | 'free';
  annualCost: number;          // in EUR (annual fee OR staking opportunity cost)
  cashbackRate: number;        // %
  token?: string;
  cardId: string;
}

const FREE_RATE = 1; // reference baseline

const CARDS: CardEntry[] = [
  // Free tiers (for comparison)
  { name: 'MetaMask Card',              type: 'free',    annualCost: 0,     cashbackRate: 1,    token: 'ETH',  cardId: 'metamask-card' },
  { name: 'Nexo Card',                  type: 'free',    annualCost: 0,     cashbackRate: 2,    token: 'BTC',  cardId: 'nexo-card' },
  { name: 'Gnosis Pay',                 type: 'free',    annualCost: 0,     cashbackRate: 2,    token: 'GNO',  cardId: 'gnosis-pay-card' },
  // Paid (subscription)
  { name: 'Revolut Metal',              type: 'paid',    annualCost: 180,   cashbackRate: 1,    cardId: 'revolut-metal' },
  // Staking tiers, opportunity cost = staking_amount × 5% (rough DeFi yield)
  { name: 'Crypto.com Ruby Steel (2%)', type: 'staking', annualCost: 200 * 0.05, cashbackRate: 2, token: 'CRO', cardId: 'crypto-com-ruby-steel' },
  { name: 'Crypto.com Jade Green (3%)', type: 'staking', annualCost: 2000 * 0.05, cashbackRate: 3, token: 'CRO', cardId: 'crypto-com-jade-green' },
  { name: 'Crypto.com Icy White (5%)',  type: 'staking', annualCost: 20000 * 0.05, cashbackRate: 5, token: 'CRO', cardId: 'crypto-com-icy-white' },
  { name: 'Crypto.com Obsidian (8%)',   type: 'staking', annualCost: 150000 * 0.05, cashbackRate: 8, token: 'CRO', cardId: 'crypto-com-obsidian' },
];

/* ── Component ────────────────────────────────────────────────────────────── */
export default function FeeCalculatorPage() {
  const lang = useLanguage();
  const copy = COPY[lang] ?? COPY.fr;

  const [spend, setSpend] = useState(1000);
  const [copied, setCopied] = useState(false);

  useHreflang(
    (l) => {
      const slug = ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.feeCalculator;
      return slug ? `${BASE}/${l}/${slug}` : null;
    },
    [],
  );

  const slug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.feeCalculator ?? ROUTE_TRANSLATIONS.fr.feeCalculator;

  useSeoMeta({
    title: copy.title,
    description: copy.desc,
    canonical: `${BASE}/${lang}/${slug}`,
    ogType: 'website',
    ogTitle: copy.title,
    ogDescription: copy.desc,
  });

  const freeMonthly = spend * (FREE_RATE / 100);

  const results = useMemo(() => {
    return CARDS
      .filter(c => c.type !== 'free') // only paid/staking, those need ROI analysis
      .map(c => {
        const extraMonthly = spend * ((c.cashbackRate - FREE_RATE) / 100);
        const extraAnnual = extraMonthly * 12;
        const netAnnual = extraAnnual - c.annualCost;
        let breakEvenMonths: number | null = null;
        if (extraAnnual > 0) {
          breakEvenMonths = Math.ceil(c.annualCost / extraMonthly);
        }
        return { ...c, extraMonthly, extraAnnual, netAnnual, breakEvenMonths };
      })
      .sort((a, b) => b.netAnnual - a.netAnnual);
  }, [spend]);

  function verdict(netAnnual: number, breakEvenMonths: number | null) {
    if (breakEvenMonths === null) return copy.never;
    if (netAnnual > 0) {
      return `${copy.worth} (+${Math.round(netAnnual)}€/an)`;
    }
    if (netAnnual > -30) return `${copy.neutral} (${Math.round(netAnnual)}€/an)`;
    return `${copy.notWorth} (${Math.round(netAnnual)}€/an)`;
  }

  function verdictColor(netAnnual: number, breakEvenMonths: number | null) {
    if (breakEvenMonths === null) return 'text-red-600';
    if (netAnnual > 0) return 'text-green-700';
    if (netAnnual > -30) return 'text-orange-600';
    return 'text-red-600';
  }

  const bestSlug = THEMATIC_ROUTES.best?.[lang as keyof typeof THEMATIC_ROUTES.best] ?? 'meilleure-carte-crypto';
  const simSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.simulator ?? 'simulateur';
  const cbSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cashbackCalculator ?? 'calculateur-cashback-crypto';
  const embedCode = `<iframe src="${BASE}/${lang}/${slug}" width="100%" height="600" frameborder="0" title="Crypto Card Fee Calculator, TopCryptoCards"></iframe>`;

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

      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{copy.h1}</h1>
      </div>
      <p className="text-gray-600 mb-8">{copy.intro}</p>

      {/* Spend slider */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {copy.labelSpend}, <span className="text-blue-600 font-bold">{spend} {copy.labelSpendUnit}</span>
        </label>
        <input
          type="range" min={100} max={5000} step={100} value={spend}
          onChange={e => setSpend(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>100 €</span><span>5 000 €</span>
        </div>
      </div>

      {/* Baseline reference box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>{copy.labelFreeRef}</strong>, {spend} € × 1 % × 12 = <strong>{Math.round(freeMonthly * 12)} €/an</strong>
        </div>
      </div>

      {/* Results table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">{copy.colCard}</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium">{copy.colAnnualCost}</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium">{copy.colExtraCashback}</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium">{copy.colBreakEven}</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">{copy.colVerdict}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {results.map((c) => (
              <tr key={c.cardId} className={c.netAnnual > 0 ? 'bg-green-50' : ''}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{c.name}</div>
                  {c.token && <div className="text-xs text-gray-400">{c.token}</div>}
                  <div className="text-xs text-gray-400">
                    {c.type === 'staking' ? copy.stakingTier : copy.paidTier} · {c.cashbackRate}% cashback
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">{c.annualCost.toFixed(0)} €/an</td>
                <td className="px-4 py-3 text-center">
                  {c.extraMonthly > 0
                    ? <span className="text-green-700 font-medium">+{c.extraMonthly.toFixed(1)} €</span>
                    : <span className="text-gray-400">0 €</span>
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  {c.breakEvenMonths === null
                    ? <span className="text-red-500 flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" />{copy.never}</span>
                    : <span className="text-gray-700">{copy.breakEvenAt} {c.breakEvenMonths} {copy.months}</span>
                  }
                </td>
                <td className={`px-4 py-3 text-right font-semibold text-xs ${verdictColor(c.netAnnual, c.breakEvenMonths)}`}>
                  {verdict(c.netAnnual, c.breakEvenMonths)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <p className="text-xs text-gray-500 mb-8 leading-relaxed">{copy.note}</p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <Link to={`/${lang}/${cbSlug}`} className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors">
          {copy.ctaCashback}
        </Link>
        <Link to={`/${lang}/${simSlug}`} className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors">
          {copy.ctaSimulator}
        </Link>
        <Link to={`/${lang}/${bestSlug}`} className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors">
          {copy.ctaBest}
        </Link>
      </div>

      {/* Embed */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{copy.embedTitle}</h2>
        <pre className="bg-white border border-gray-200 rounded-lg p-4 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap break-all">{embedCode}</pre>
        <button onClick={handleCopy} className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          {copied ? copy.embedCopied : copy.embedCopy}
        </button>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{copy.faqTitle}</h2>
        <div className="space-y-4">
          {copy.faqs.map((faq, i) => (
            <details key={i} className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer group">
              <summary className="font-semibold text-gray-800 list-none flex justify-between items-center">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: copy.h1,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        description: copy.desc,
        url: `${BASE}/${lang}/${slug}`,
        publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: BASE },
        featureList: copy.faqs.map(f => f.q),
      })}} />
    </div>
  );
}
