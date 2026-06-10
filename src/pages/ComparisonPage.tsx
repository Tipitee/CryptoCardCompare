import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import type { CryptoCard } from '../types/card';
import CardDetailDrawer from '../components/CardDetailDrawer';
import { fmtEUR, fmtPct } from '../utils/format';

const CARD_SEGMENT: Record<string, string> = {
  fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards',
};

const LABELS: Record<string, {
  vs: string;
  fees: string;
  cashback: string;
  staking: string;
  dailyLimit: string;
  freeWd: string;
  availableFrance: string;
  availableEU: string;
  network: string;
  cryptos: string;
  winner: string;
  free: string;
  none: string;
  yes: string;
  no: string;
  viewDetail: string;
  getCard: string;
  intro: string;
}> = {
  fr: { vs: 'contre', fees: 'Frais annuels', cashback: 'Cashback max', staking: 'Staking requis', dailyLimit: 'Limite journalière', freeWd: 'Retraits gratuits', availableFrance: 'Disponible en France', availableEU: 'Disponible en Europe', network: 'Réseau', cryptos: 'Cryptos acceptées', winner: 'Meilleur', free: 'Gratuit', none: 'Aucun', yes: 'Oui', no: 'Non', viewDetail: 'Voir la fiche', getCard: 'Obtenir la carte', intro: 'Comparaison détaillée de' },
  de: { vs: 'gegen', fees: 'Jahresgebühren', cashback: 'Max. Cashback', staking: 'Staking erforderlich', dailyLimit: 'Tageslimit', freeWd: 'Kostenlose Abhebungen', availableFrance: 'In Frankreich verfügbar', availableEU: 'In der EU verfügbar', network: 'Netzwerk', cryptos: 'Akzeptierte Kryptos', winner: 'Besser', free: 'Kostenlos', none: 'Keins', yes: 'Ja', no: 'Nein', viewDetail: 'Details', getCard: 'Karte holen', intro: 'Detaillierter Vergleich von' },
  es: { vs: 'vs', fees: 'Cuotas anuales', cashback: 'Cashback máx', staking: 'Staking requerido', dailyLimit: 'Límite diario', freeWd: 'Retiros gratuitos', availableFrance: 'Disponible en Francia', availableEU: 'Disponible en Europa', network: 'Red', cryptos: 'Criptos aceptadas', winner: 'Mejor', free: 'Gratis', none: 'Ninguno', yes: 'Sí', no: 'No', viewDetail: 'Ver ficha', getCard: 'Obtener tarjeta', intro: 'Comparativa detallada de' },
  it: { vs: 'vs', fees: 'Costi annuali', cashback: 'Cashback max', staking: 'Staking richiesto', dailyLimit: 'Limite giornaliero', freeWd: 'Prelievi gratuiti', availableFrance: 'Disponibile in Francia', availableEU: 'Disponibile in Europa', network: 'Rete', cryptos: 'Criptovalute accettate', winner: 'Migliore', free: 'Gratuito', none: 'Nessuno', yes: 'Sì', no: 'No', viewDetail: 'Vedi scheda', getCard: 'Ottieni carta', intro: 'Confronto dettagliato di' },
  en: { vs: 'vs', fees: 'Annual fees', cashback: 'Max cashback', staking: 'Staking required', dailyLimit: 'Daily limit', freeWd: 'Free withdrawals', availableFrance: 'Available in France', availableEU: 'Available in EU', network: 'Network', cryptos: 'Accepted cryptos', winner: 'Better', free: 'Free', none: 'None', yes: 'Yes', no: 'No', viewDetail: 'View details', getCard: 'Get card', intro: 'Detailed comparison of' },
};

function Winner({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-accent/15 text-green-accent border border-green-accent/30">
      <Check className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

export default function ComparisonPage() {
  const { lang = 'fr', slug = '' } = useParams<{ lang: string; slug: string }>();
  const allCards = useAppStore((s) => s.cards);
  const [detail, setDetail] = useState<CryptoCard | null>(null);

  const L = LABELS[lang] || LABELS.en;
  const segment = CARD_SEGMENT[lang] || 'cards';

  // Parse slug: "card1-id-vs-card2-id" — split on "-vs-"
  const vsIndex = slug.indexOf('-vs-');
  const id1 = vsIndex > -1 ? slug.slice(0, vsIndex) : '';
  const id2 = vsIndex > -1 ? slug.slice(vsIndex + 4) : '';

  const card1 = allCards.find((c) => c.id === id1) ?? null;
  const card2 = allCards.find((c) => c.id === id2) ?? null;

  // SEO
  useEffect(() => {
    if (!card1 || !card2) return;
    document.title = `${card1.name} ${L.vs} ${card2.name} ${new Date().getFullYear()} — TopCryptoCards`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = `${L.intro} ${card1.name} et ${card2.name} : cashback, frais, staking, disponibilité. Quelle carte est la meilleure ?`;
  }, [card1, card2, lang]);

  if (!card1 || !card2) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-slate-400">Chargement…</p>
      </div>
    );
  }

  type Row = {
    label: string;
    v1: string | number;
    v2: string | number;
    winner: 1 | 2 | null;
    bool?: boolean;
  };

  const rows: Row[] = [
    {
      label: L.cashback,
      v1: fmtPct(card1.cashbackPremium),
      v2: fmtPct(card2.cashbackPremium),
      winner: card1.cashbackPremium > card2.cashbackPremium ? 1 : card2.cashbackPremium > card1.cashbackPremium ? 2 : null,
    },
    {
      label: L.fees,
      v1: card1.annualFees === 0 ? L.free : fmtEUR(card1.annualFees),
      v2: card2.annualFees === 0 ? L.free : fmtEUR(card2.annualFees),
      winner: card1.annualFees < card2.annualFees ? 1 : card2.annualFees < card1.annualFees ? 2 : null,
    },
    {
      label: L.staking,
      v1: card1.stakingRequired === 0 ? L.none : fmtEUR(card1.stakingRequired),
      v2: card2.stakingRequired === 0 ? L.none : fmtEUR(card2.stakingRequired),
      winner: card1.stakingRequired < card2.stakingRequired ? 1 : card2.stakingRequired < card1.stakingRequired ? 2 : null,
    },
    {
      label: L.dailyLimit,
      v1: fmtEUR(card1.dailyLimit),
      v2: fmtEUR(card2.dailyLimit),
      winner: card1.dailyLimit > card2.dailyLimit ? 1 : card2.dailyLimit > card1.dailyLimit ? 2 : null,
    },
    {
      label: L.network,
      v1: card1.cardNetwork,
      v2: card2.cardNetwork,
      winner: null,
    },
    {
      label: L.freeWd,
      v1: card1.freeWithdrawals ? L.yes : L.no,
      v2: card2.freeWithdrawals ? L.yes : L.no,
      winner: card1.freeWithdrawals && !card2.freeWithdrawals ? 1 : card2.freeWithdrawals && !card1.freeWithdrawals ? 2 : null,
      bool: true,
    },
    {
      label: L.availableFrance,
      v1: card1.availableFrance ? L.yes : L.no,
      v2: card2.availableFrance ? L.yes : L.no,
      winner: null,
      bool: true,
    },
    {
      label: L.availableEU,
      v1: card1.availableEU ? L.yes : L.no,
      v2: card2.availableEU ? L.yes : L.no,
      winner: null,
      bool: true,
    },
  ];

  const score1 = rows.filter((r) => r.winner === 1).length;
  const score2 = rows.filter((r) => r.winner === 2).length;

  return (
    <div className="container-app py-10 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
        {card1.name} <span className="text-slate-500 font-normal text-xl">vs</span> {card2.name}
      </h1>

      {/* Card headers — clickable */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[card1, card2].map((card, idx) => (
          <div key={card.id} className={`card-surface p-5 text-center ${idx === 0 ? 'border-cyan-accent/30' : 'border-green-accent/30'}`}>
            <button
              onClick={() => setDetail(card)}
              className="w-full focus:outline-none group"
            >
              <div style={{ borderRadius: '12px', overflow: 'hidden', width: '100%', aspectRatio: '1.586', marginBottom: '12px' }}>
                <img
                  src={card.realCardImage}
                  alt={card.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <div className="font-display font-bold text-white text-lg group-hover:text-cyan-accent transition-colors">
                {card.name}
              </div>
            </button>
            <div className="text-sm text-slate-400 mt-1 mb-4">{card.issuer}</div>
            <div className={`text-2xl font-display font-bold mb-1 ${idx === 0 ? 'text-cyan-accent' : 'text-green-accent'}`}>
              {score1 > score2 && idx === 0 ? '🏆 ' : score2 > score1 && idx === 1 ? '🏆 ' : ''}
              {idx === 0 ? score1 : score2} / {rows.filter((r) => r.winner !== null).length}
            </div>
            <p className="text-xs text-slate-500 mb-4">{L.winner}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setDetail(card)}
                className="btn-secondary text-sm w-full"
              >
                {L.viewDetail}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href={card.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm w-full"
              >
                {L.getCard}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="card-surface overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated/50 border-b border-bg-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide w-1/3">
                Critère
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-cyan-accent uppercase tracking-wide w-1/3">
                {card1.name}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-green-accent uppercase tracking-wide w-1/3">
                {card2.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-bg-border last:border-0">
                <td className="px-4 py-3 text-slate-400 text-xs">{row.label}</td>
                <td className={`px-4 py-3 text-center font-medium ${row.winner === 1 ? 'text-white' : 'text-slate-400'}`}>
                  <span className={row.bool ? (row.v1 === L.yes ? 'text-green-accent' : 'text-slate-500') : ''}>
                    {row.v1}
                  </span>
                  {row.winner === 1 && (
                    <div className="mt-1"><Winner label={L.winner} /></div>
                  )}
                </td>
                <td className={`px-4 py-3 text-center font-medium ${row.winner === 2 ? 'text-white' : 'text-slate-400'}`}>
                  <span className={row.bool ? (row.v2 === L.yes ? 'text-green-accent' : 'text-slate-500') : ''}>
                    {row.v2}
                  </span>
                  {row.winner === 2 && (
                    <div className="mt-1"><Winner label={L.winner} /></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cryptos */}
      <div className="card-surface p-5 mb-8">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">{L.cryptos}</h3>
        <div className="grid grid-cols-2 gap-6">
          {[card1, card2].map((card) => (
            <div key={card.id}>
              <div className="text-xs text-slate-500 mb-2">{card.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {card.cryptos.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded text-xs font-mono bg-bg-elevated border border-bg-border text-slate-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back links */}
      <div className="flex gap-3 justify-center">
        <Link to={`/${lang}/${segment}/${card1.id}`} className="btn-ghost text-sm">
          Fiche {card1.name}
        </Link>
        <Link to={`/${lang}/${segment}/${card2.id}`} className="btn-ghost text-sm">
          Fiche {card2.name}
        </Link>
      </div>

      <CardDetailDrawer card={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
