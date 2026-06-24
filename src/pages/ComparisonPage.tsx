import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  ExternalLink,
  Minus,
  Star,
  X,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import type { CryptoCard } from '../types/card';
import SmartCardImage from '../components/SmartCardImage';
import CardDetailDrawer from '../components/CardDetailDrawer';
import { fmtEUR, fmtPct } from '../utils/format';
import { getAffiliateLink } from '../utils/affiliateLink';
import { getSpecificComparison } from '../data/comparisonContent';
import { fetchCardById } from '../lib/supabase';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

// ─── SEO copy per language ────────────────────────────────────────────────────

const YEAR = new Date().getFullYear();
const COMPARISON_SEO: Record<string, { suffix: string; desc: (n1: string, n2: string) => string }> = {
  fr: { suffix: `Comparatif ${YEAR} | TopCryptoCards`, desc: (n1, n2) => `Comparaison détaillée ${n1} vs ${n2} : cashback, frais annuels, staking requis. Quelle carte crypto choisir en ${YEAR} ?` },
  de: { suffix: `Vergleich ${YEAR} | TopCryptoCards`, desc: (n1, n2) => `Detaillierter Vergleich ${n1} vs ${n2}: Cashback, Jahresgebühren, Staking. Welche Krypto-Karte in ${YEAR} wählen?` },
  es: { suffix: `Comparativa ${YEAR} | TopCryptoCards`, desc: (n1, n2) => `Comparación detallada ${n1} vs ${n2}: cashback, comisiones, staking. ¿Qué tarjeta crypto elegir en ${YEAR}?` },
  it: { suffix: `Confronto ${YEAR} | TopCryptoCards`, desc: (n1, n2) => `Confronto dettagliato ${n1} vs ${n2}: cashback, commissioni, staking. Quale carta crypto scegliere nel ${YEAR}?` },
  en: { suffix: `Comparison ${YEAR} | TopCryptoCards`, desc: (n1, n2) => `Detailed comparison of ${n1} vs ${n2}: cashback rates, annual fees, staking requirements. Which crypto card to choose in ${YEAR}?` },
};

type SeoBlock = { heading: string; body: string };

function getSeoText(
  lang: string,
  card1: CryptoCard | null,
  card2: CryptoCard | null
): SeoBlock[] {
  const n1 = card1?.name ?? '…';
  const n2 = card2?.name ?? '…';

  const blocks: Record<string, SeoBlock[]> = {
    fr: [
      {
        heading: `${n1} vs ${n2} : quelle carte crypto choisir ?`,
        body: `Comparer ${n1} et ${n2} est une démarche essentielle avant de s'engager avec l'une ou l'autre de ces cartes crypto. Ces deux produits s'adressent à des profils différents d'investisseurs : là où l'une mise sur un cashback élevé pour les détenteurs de tokens natifs, l'autre peut séduire par des frais annuels réduits ou une plus grande accessibilité géographique. Notre comparatif met en regard leurs principales caractéristiques pour vous aider à prendre une décision éclairée.`,
      },
      {
        heading: `Cashback et récompenses : avantage ${n1} ou ${n2} ?`,
        body: `Le cashback est souvent le premier critère de sélection d'une carte crypto. ${n1} et ${n2} proposent toutes deux des niveaux de récompenses variables selon le montant de tokens stakés. En règle générale, plus le staking est élevé, plus le taux de cashback est intéressant — parfois jusqu'à 5 % ou plus. Il convient de calculer si le rendement supplémentaire justifie l'immobilisation d'un capital important, en tenant compte de la volatilité des cryptoactifs.`,
      },
      {
        heading: `Frais, staking et conditions d'utilisation`,
        body: `Au-delà du cashback, les frais annuels et les exigences de staking jouent un rôle déterminant dans la rentabilité réelle d'une carte. ${n1} et ${n2} se distinguent sur ces points : l'une peut être gratuite sous conditions, tandis que l'autre nécessite un engagement en tokens. Les retraits ATM, les devises étrangères et les éventuelles commissions mensuelles doivent également entrer dans votre analyse.`,
      },
      {
        heading: `Notre verdict : ${n1} vs ${n2}`,
        body: `En définitive, le choix entre ${n1} et ${n2} dépend de votre profil d'utilisation. Si vous voyagez fréquemment et recherchez des retraits gratuits à l'étranger, certaines cartes se démarquent clairement. Si, en revanche, vous souhaitez maximiser vos récompenses crypto au quotidien et êtes prêt à staker des tokens, d'autres critères priment. Utilisez notre simulateur pour estimer votre gain annuel réel avec chacune de ces cartes selon vos habitudes de dépenses.`,
      },
    ],
    de: [
      {
        heading: `${n1} vs ${n2}: Welche Krypto-Karte ist die richtige?`,
        body: `Der Vergleich von ${n1} und ${n2} ist unerlässlich, bevor man sich für eine der beiden Krypto-Karten entscheidet. Diese Produkte richten sich an unterschiedliche Anlegerprofile: Während die eine auf hohen Cashback für Native-Token-Inhaber setzt, punktet die andere möglicherweise mit niedrigeren Jahresgebühren oder besserer geografischer Verfügbarkeit. Unser Vergleich stellt die wichtigsten Merkmale gegenüber, damit Sie eine fundierte Entscheidung treffen können.`,
      },
      {
        heading: `Cashback und Prämien: Vorteil ${n1} oder ${n2}?`,
        body: `Cashback ist oft das wichtigste Auswahlkriterium für eine Krypto-Karte. Sowohl ${n1} als auch ${n2} bieten variable Prämien je nach gestakten Token-Beträgen. Als Faustregel gilt: Je höher das Staking, desto besser die Cashback-Rate — manchmal bis zu 5 % oder mehr. Sie sollten berechnen, ob die zusätzliche Rendite die Kapitalimmobilisierung rechtfertigt, unter Berücksichtigung der Volatilität von Krypto-Assets.`,
      },
      {
        heading: `Gebühren, Staking und Nutzungsbedingungen`,
        body: `Neben dem Cashback spielen Jahresgebühren und Staking-Anforderungen eine entscheidende Rolle für die tatsächliche Rentabilität einer Karte. ${n1} und ${n2} unterscheiden sich in diesen Punkten: Eine kann unter bestimmten Bedingungen kostenlos sein, während die andere ein Token-Engagement erfordert. Auch Geldautomaten-Abhebungen, Fremdwährungsgebühren und eventuelle Monatsprovisionen sollten in Ihre Analyse einfließen.`,
      },
      {
        heading: `Unser Urteil: ${n1} vs ${n2}`,
        body: `Letztendlich hängt die Wahl zwischen ${n1} und ${n2} von Ihrem Nutzungsprofil ab. Wenn Sie häufig reisen und kostenlose Auslandsabhebungen suchen, stechen bestimmte Karten klar hervor. Wenn Sie hingegen Ihre täglichen Krypto-Prämien maximieren möchten und bereit sind, Token zu staken, haben andere Kriterien Vorrang. Nutzen Sie unseren Simulator, um Ihre tatsächliche Jahresrendite mit jeder Karte gemäß Ihren Ausgabengewohnheiten zu berechnen.`,
      },
    ],
    es: [
      {
        heading: `${n1} vs ${n2}: ¿qué tarjeta crypto elegir?`,
        body: `Comparar ${n1} y ${n2} es un paso esencial antes de comprometerse con cualquiera de estas tarjetas crypto. Estos productos están dirigidos a perfiles de inversores diferentes: mientras una apuesta por un alto cashback para los poseedores de tokens nativos, la otra puede resultar atractiva por sus bajas comisiones anuales o mayor accesibilidad geográfica. Nuestra comparativa pone frente a frente sus principales características para ayudarle a tomar una decisión informada.`,
      },
      {
        heading: `Cashback y recompensas: ¿ventaja ${n1} o ${n2}?`,
        body: `El cashback suele ser el primer criterio de selección de una tarjeta crypto. Tanto ${n1} como ${n2} ofrecen niveles de recompensas variables según los tokens en staking. Como regla general, cuanto mayor es el staking, más interesante es la tasa de cashback, a veces hasta el 5% o más. Conviene calcular si el rendimiento adicional justifica la inmovilización de capital, teniendo en cuenta la volatilidad de los criptoactivos.`,
      },
      {
        heading: `Comisiones, staking y condiciones de uso`,
        body: `Más allá del cashback, las comisiones anuales y los requisitos de staking son determinantes para la rentabilidad real de una tarjeta. ${n1} y ${n2} se distinguen en estos aspectos: una puede ser gratuita bajo ciertas condiciones, mientras la otra requiere un compromiso en tokens. Los retiros en cajero, las divisas extranjeras y las posibles comisiones mensuales también deben tenerse en cuenta en su análisis.`,
      },
      {
        heading: `Nuestro veredicto: ${n1} vs ${n2}`,
        body: `En definitiva, la elección entre ${n1} y ${n2} depende de su perfil de uso. Si viaja con frecuencia y busca retiros gratuitos en el extranjero, algunas tarjetas destacan claramente. Si, por el contrario, desea maximizar sus recompensas crypto diarias y está dispuesto a hacer staking de tokens, otros criterios prevalecen. Utilice nuestro simulador para estimar su rendimiento anual real con cada una de estas tarjetas según sus hábitos de gasto.`,
      },
    ],
    it: [
      {
        heading: `${n1} vs ${n2}: quale carta crypto scegliere?`,
        body: `Confrontare ${n1} e ${n2} è un passo fondamentale prima di scegliere una delle due carte crypto. Questi prodotti si rivolgono a profili di investitori diversi: mentre l'una punta su un cashback elevato per i detentori di token nativi, l'altra può risultare attraente per le commissioni annuali ridotte o per una maggiore accessibilità geografica. Il nostro confronto mette a confronto le loro principali caratteristiche per aiutarvi a prendere una decisione informata.`,
      },
      {
        heading: `Cashback e premi: vantaggio ${n1} o ${n2}?`,
        body: `Il cashback è spesso il primo criterio di selezione di una carta crypto. Sia ${n1} che ${n2} offrono livelli di ricompensa variabili in base ai token in staking. In genere, più alto è lo staking, più interessante è il tasso di cashback, a volte fino al 5% o più. È opportuno calcolare se il rendimento aggiuntivo giustifica l'immobilizzazione del capitale, tenendo conto della volatilità dei cripto-asset.`,
      },
      {
        heading: `Commissioni, staking e condizioni d'uso`,
        body: `Oltre al cashback, le commissioni annuali e i requisiti di staking svolgono un ruolo determinante nella redditività reale di una carta. ${n1} e ${n2} si differenziano su questi punti: una può essere gratuita a determinate condizioni, mentre l'altra richiede un impegno in token. Anche i prelievi ATM, le valute estere e le eventuali commissioni mensili devono rientrare nella vostra analisi.`,
      },
      {
        heading: `Il nostro verdetto: ${n1} vs ${n2}`,
        body: `In definitiva, la scelta tra ${n1} e ${n2} dipende dal vostro profilo d'uso. Se viaggiate spesso e cercate prelievi gratuiti all'estero, alcune carte si distinguono chiaramente. Se invece desiderate massimizzare le vostre ricompense crypto quotidiane e siete disposti a fare staking di token, altri criteri prevalgono. Utilizzate il nostro simulatore per stimare il vostro rendimento annuo reale con ciascuna di queste carte in base alle vostre abitudini di spesa.`,
      },
    ],
    en: [
      {
        heading: `${n1} vs ${n2}: which crypto card should you choose?`,
        body: `Comparing ${n1} and ${n2} is an essential step before committing to either of these crypto cards. These products target different investor profiles: while one focuses on high cashback for native token holders, the other may appeal through lower annual fees or broader geographic availability. Our comparison puts their key features side by side to help you make an informed decision.`,
      },
      {
        heading: `Cashback and rewards: advantage ${n1} or ${n2}?`,
        body: `Cashback is often the primary selection criterion for a crypto card. Both ${n1} and ${n2} offer variable reward levels depending on staked token amounts. As a general rule, the higher the staking, the better the cashback rate — sometimes up to 5% or more. It's worth calculating whether the extra return justifies locking up capital, taking into account the volatility of crypto assets.`,
      },
      {
        heading: `Fees, staking requirements and conditions`,
        body: `Beyond cashback, annual fees and staking requirements play a decisive role in a card's real profitability. ${n1} and ${n2} differ on these points: one may be free under certain conditions, while the other requires a token commitment. ATM withdrawals, foreign-currency charges and any monthly commissions should also factor into your analysis.`,
      },
      {
        heading: `Our verdict: ${n1} vs ${n2}`,
        body: `Ultimately, the choice between ${n1} and ${n2} comes down to your usage profile. If you travel frequently and want free international withdrawals, certain cards stand out clearly. If you want to maximise daily crypto rewards and are willing to stake tokens, other criteria take precedence. Use our simulator to estimate your real annual gain with each card based on your spending habits.`,
      },
    ],
  };

  return blocks[lang] ?? blocks.en;
}

// ─── Row definition ───────────────────────────────────────────────────────────

interface CompareRow {
  label: string;
  key: keyof CryptoCard;
  format: (val: unknown) => string;
  lowerIsBetter?: boolean;
}

function getRows(t: (k: string) => string): CompareRow[] {
  return [
    { label: t('detail_cashback_base'), key: 'cashbackBase', format: (v) => fmtPct(v as number) },
    { label: t('detail_cashback_premium'), key: 'cashbackPremium', format: (v) => fmtPct(v as number) },
    { label: t('detail_annual_fees'), key: 'annualFees', format: (v) => (v as number) === 0 ? t('detail_free') : fmtEUR(v as number), lowerIsBetter: true },
    { label: t('detail_staking_required'), key: 'stakingRequired', format: (v) => (v as number) === 0 ? t('detail_none') : fmtEUR(v as number), lowerIsBetter: true },
    { label: t('detail_daily_limit'), key: 'dailyLimit', format: (v) => fmtEUR(v as number) },
    { label: t('detail_network'), key: 'cardNetwork', format: (v) => String(v) },
  ];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function winner(row: CompareRow, c1: CryptoCard, c2: CryptoCard): 'c1' | 'c2' | 'tie' {
  const v1 = c1[row.key] as number;
  const v2 = c2[row.key] as number;
  if (typeof v1 !== 'number' || typeof v2 !== 'number') return 'tie';
  if (v1 === v2) return 'tie';
  if (row.lowerIsBetter) return v1 < v2 ? 'c1' : 'c2';
  return v1 > v2 ? 'c1' : 'c2';
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.min(100, (score / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-accent to-green-accent rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-mono font-semibold text-white w-10 text-right">
        {score}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('common');
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const [detail, setDetail] = useState<CryptoCard | null>(null);
  const [card1, setCard1] = useState<CryptoCard | null>(null);
  const [card2, setCard2] = useState<CryptoCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Parse slug
  const vsIndex = (slug ?? '').indexOf('-vs-');
  const id1 = vsIndex > -1 ? (slug ?? '').slice(0, vsIndex) : '';
  const id2 = vsIndex > -1 ? (slug ?? '').slice(vsIndex + 4) : '';

  // Fetch both cards directly — avoids depending on the market-filtered store
  useEffect(() => {
    if (!id1 || !id2) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    setNotFound(false);
    Promise.all([fetchCardById(id1), fetchCardById(id2)]).then(([c1, c2]) => {
      if (!c1 || !c2) setNotFound(true);
      else { setCard1(c1); setCard2(c2); }
      setLoading(false);
    });
  }, [id1, id2]);

  const rows = getRows(t);
  const genericBlocks = getSeoText(lang, card1, card2);
  const specificContent = card1 && card2 ? getSpecificComparison(card1.id, card2.id) : null;

  // Merge: replace intro (block 0) and verdict (block 3) with specific content when available
  const seoBlocks = genericBlocks.map((block, i) => {
    if (!specificContent) return block;
    const langKey = lang as string;
    if (i === 0) {
      const intro = (specificContent as Record<string, string>)[`${langKey}_intro`] ?? specificContent.fr_intro;
      return intro ? { ...block, body: intro } : block;
    }
    if (i === genericBlocks.length - 1) {
      const verdict = (specificContent as Record<string, string>)[`${langKey}_verdict`] ?? specificContent.fr_verdict;
      return verdict ? { ...block, body: verdict } : block;
    }
    return block;
  });

  const comparisonSeo = COMPARISON_SEO[lang] || COMPARISON_SEO.en;
  useSeoMeta({
    title: card1 && card2
      ? `${card1.name} vs ${card2.name} — ${comparisonSeo.suffix}`
      : `TopCryptoCards`,
    description: card1 && card2
      ? comparisonSeo.desc(card1.name, card2.name)
      : '',
  });

  // Not found state
  if (notFound) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-slate-400 text-lg mb-6">{t('comparison_not_found')}</p>
        <Link to={getRoute('compare')} className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          {t('comparison_back')}
        </Link>
      </div>
    );
  }

  // Loading state
  if (loading || !card1 || !card2) {
    return (
      <div className="container-app py-20 text-center">
        <div className="animate-pulse text-slate-500">{t('comparison_loading')}</div>
      </div>
    );
  }

  const isFav1 = favorites.includes(card1.id);
  const isFav2 = favorites.includes(card2.id);

  // Scores (simple sum-based proxy)
  const score1 = Math.round(
    card1.cashbackPremium * 10 +
    (card1.annualFees === 0 ? 15 : Math.max(0, 15 - card1.annualFees / 20)) +
    (card1.stakingRequired === 0 ? 20 : Math.max(0, 20 - card1.stakingRequired / 500)) +
    (card1.availableFrance ? 5 : 0) +
    (card1.freeWithdrawals ? 10 : 0)
  );
  const score2 = Math.round(
    card2.cashbackPremium * 10 +
    (card2.annualFees === 0 ? 15 : Math.max(0, 15 - card2.annualFees / 20)) +
    (card2.stakingRequired === 0 ? 20 : Math.max(0, 20 - card2.stakingRequired / 500)) +
    (card2.availableFrance ? 5 : 0) +
    (card2.freeWithdrawals ? 10 : 0)
  );
  const maxScore = Math.max(score1, score2, 1);

  return (
    <div className="container-app py-10 max-w-5xl">
      {/* Back link */}
      <Link
        to={getRoute('compare')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('comparison_back')}
      </Link>

      {/* Page title */}
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {card1.name}{' '}
        <span className="text-slate-500 font-normal">vs</span>{' '}
        {card2.name}
      </h1>
      <p className="text-slate-400 text-sm mb-10">
        {t('comparison_subtitle')}
      </p>

      {/* ── Card headers ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[{ card: card1, isFav: isFav1 }, { card: card2, isFav: isFav2 }].map(({ card, isFav }) => (
          <div key={card.id} className="card-surface p-5 flex flex-col items-center text-center gap-4">
            {/* Clickable image */}
            <div
              onClick={() => setDetail(card)}
              className="cursor-pointer hover:opacity-80 transition-opacity rounded-xl w-fit"
              title={card.name}
            >
              <SmartCardImage card={card} size="lg" />
            </div>

            {/* Name */}
            <div>
              <button
                onClick={() => setDetail(card)}
                className="font-display font-bold text-lg text-white hover:text-cyan-accent transition-colors"
              >
                {card.name}
              </button>
              <div className="text-sm text-slate-400">{card.issuer}</div>
              {card.badge && (
                <span className="badge-accent mt-1 inline-block">{card.badge}</span>
              )}
            </div>

            {/* Score */}
            <div className="w-full">
              <div className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider">
                {t('comparison_score')}
              </div>
              <ScoreBar score={card === card1 ? score1 : score2} max={maxScore} />
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full justify-center">
              <button
                onClick={() => toggleFavorite(card.id)}
                className={`btn-secondary text-xs ${isFav ? 'border-green-accent/50 text-green-accent' : ''}`}
              >
                <Star className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? t('comparison_in_fav') : t('comparison_add_fav')}
              </button>
              <button
                onClick={() => setDetail(card)}
                className="btn-ghost border border-bg-border text-xs"
              >
                {t('comparison_details')}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <a
                href={getAffiliateLink(card)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost border border-bg-border text-xs"
              >
                {t('comparison_offer')}
                <ExternalLink className="w-3 h-3" />
              </a>
              {card.brandId && (() => {
                const bSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
                return (
                  <Link
                    to={`/${lang}/${bSlug}/${card.brandId}`}
                    className="btn-ghost border border-bg-border text-xs"
                  >
                    {lang === 'fr' ? 'Tous les niveaux' : lang === 'de' ? 'Alle Stufen' : lang === 'es' ? 'Todos los niveles' : lang === 'it' ? 'Tutti i livelli' : 'All tiers'}
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* ── Comparison table ────────────────────────────────────── */}
      <div className="card-surface overflow-x-auto -mx-4 sm:mx-0 mb-8">
        <div className="min-w-[480px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bg-border bg-bg-elevated/50">
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-cyan-accent w-[42%]">
                {card1.name}
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-[16%]">
                {t('comparison_criteria')}
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-green-accent w-[42%]">
                {card2.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const w = winner(row, card1, card2);
              const val1 = row.format(card1[row.key]);
              const val2 = row.format(card2[row.key]);
              return (
                <tr
                  key={row.key as string}
                  className="border-b border-bg-border/50 hover:bg-bg-elevated/20 transition-colors"
                >
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 font-semibold ${
                        w === 'c1' ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {w === 'c1' && (
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      {val1}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-slate-500 font-medium text-xs">{row.label}</td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 font-semibold ${
                        w === 'c2' ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {w === 'c2' && (
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      {val2}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Boolean rows */}
            {(
              [
                { label: t('detail_available_france') || 'Disponible en France', key: 'availableFrance' },
                { label: t('detail_free_withdrawals') || 'Retraits gratuits', key: 'freeWithdrawals' },
              ] as { label: string; key: keyof CryptoCard }[]
            ).map((row) => {
              const v1 = !!card1[row.key];
              const v2 = !!card2[row.key];
              const w = v1 === v2 ? 'tie' : v1 ? 'c1' : 'c2';
              return (
                <tr
                  key={row.key as string}
                  className="border-b border-bg-border/50 hover:bg-bg-elevated/20 transition-colors"
                >
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center justify-center gap-1 ${w === 'c1' ? 'text-white' : 'text-slate-500'}`}>
                      {w === 'c1' && <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {v1 ? (
                        <Check className="w-4 h-4 text-green-accent" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600" />
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-slate-500 font-medium text-xs">{row.label}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center justify-center gap-1 ${w === 'c2' ? 'text-white' : 'text-slate-500'}`}>
                      {w === 'c2' && <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {v2 ? (
                        <Check className="w-4 h-4 text-green-accent" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600" />
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* ── Cryptos section ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[card1, card2].map((card) => (
          <div key={card.id} className="card-surface p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-slate-400">{t('detail_cryptos') || 'Cryptos supportées'}</span>
              <span className="badge-accent">{card.cryptos.length}</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {card.cryptos.map((cr) => (
                <span key={cr} className="chip text-xs px-2 py-0.5">
                  {cr}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Common / unique cryptos */}
      {(() => {
        const set1 = new Set(card1.cryptos);
        const set2 = new Set(card2.cryptos);
        const common = card1.cryptos.filter((c) => set2.has(c));
        const only1 = card1.cryptos.filter((c) => !set2.has(c));
        const only2 = card2.cryptos.filter((c) => !set1.has(c));
        if (common.length === 0 && only1.length === 0 && only2.length === 0) return null;
        return (
          <div className="card-surface p-5 mb-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {common.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-accent" />
                  {t('comparison_common_cryptos') || 'En commun'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {common.map((cr) => <span key={cr} className="chip text-xs">{cr}</span>)}
                </div>
              </div>
            )}
            {only1.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-accent/70 mb-2 flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5" />
                  {t('comparison_only_in') || 'Uniquement dans'} {card1.name}
                </div>
                <div className="flex flex-wrap gap-1">
                  {only1.map((cr) => <span key={cr} className="chip text-xs bg-cyan-accent/5 border-cyan-accent/20">{cr}</span>)}
                </div>
              </div>
            )}
            {only2.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-green-accent/70 mb-2 flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5" />
                  {t('comparison_only_in') || 'Uniquement dans'} {card2.name}
                </div>
                <div className="flex flex-wrap gap-1">
                  {only2.map((cr) => <span key={cr} className="chip text-xs bg-green-accent/5 border-green-accent/20">{cr}</span>)}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── SEO text section ────────────────────────────────────── */}
      <section className="mt-6 space-y-8">
        {seoBlocks.map((block, i) => (
          <div key={i}>
            <h2 className="text-lg font-display font-semibold text-white mb-3">
              {block.heading}
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              {block.body}
            </p>
          </div>
        ))}
      </section>

      {/* ── FAQ section (specific pairs only) ───────────────────── */}
      {specificContent?.faq && specificContent.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-display font-semibold text-white mb-5">
            {lang === 'fr' ? 'Questions fréquentes' : lang === 'de' ? 'Häufige Fragen' : lang === 'es' ? 'Preguntas frecuentes' : lang === 'it' ? 'Domande frequenti' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {specificContent.faq.map((item, i) => (
              <div key={i} className="card-surface p-5">
                <h3 className="text-sm font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA strip */}
      <div className="mt-12 card-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-300">
          {t('comparison_cta_text') || 'Vous hésitez encore ? Essayez notre simulateur pour estimer vos gains réels.'}
        </p>
        <Link to={getRoute('simulator')} className="btn-primary text-sm whitespace-nowrap">
          {t('comparison_cta_btn') || 'Simuler mes gains'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <CardDetailDrawer card={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
