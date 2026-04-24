import { Check, ExternalLink, Minus, Plus, Star, Trophy, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CryptoCard } from '../types/card';
import SmartCardImage from './SmartCardImage';
import { fmtEUR, fmtPct } from '../utils/format';

interface Props {
  cards: CryptoCard[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

type MetricKind = 'pct' | 'eur' | 'eur_or_free' | 'eur_or_none' | 'bool' | 'text' | 'list' | 'number_eur';

interface MetricDef {
  key: string;
  label: string;
  kind: MetricKind;
  higherIsBetter?: boolean;
  lowerIsBetter?: boolean;
  get: (c: CryptoCard) => number | string | boolean | string[];
}

const METRICS: MetricDef[] = [
  {
    key: 'cashbackBase',
    label: 'Cashback de base',
    kind: 'pct',
    higherIsBetter: true,
    get: (c) => c.cashbackBase,
  },
  {
    key: 'cashbackPremium',
    label: 'Cashback max',
    kind: 'pct',
    higherIsBetter: true,
    get: (c) => c.cashbackPremium,
  },
  {
    key: 'annualFees',
    label: 'Frais annuels',
    kind: 'eur_or_free',
    lowerIsBetter: true,
    get: (c) => c.annualFees,
  },
  {
    key: 'stakingRequired',
    label: 'Staking requis',
    kind: 'eur_or_none',
    lowerIsBetter: true,
    get: (c) => c.stakingRequired,
  },
  {
    key: 'dailyLimit',
    label: 'Plafond journalier',
    kind: 'number_eur',
    higherIsBetter: true,
    get: (c) => c.dailyLimit,
  },
  {
    key: 'cardNetwork',
    label: 'Réseau',
    kind: 'text',
    get: (c) => c.cardNetwork,
  },
  {
    key: 'availableFrance',
    label: 'Disponible France',
    kind: 'bool',
    get: (c) => c.availableFrance,
  },
  {
    key: 'availableEU',
    label: 'Disponible UE',
    kind: 'bool',
    get: (c) => c.availableEU,
  },
  {
    key: 'freeWithdrawals',
    label: 'Retraits gratuits',
    kind: 'bool',
    get: (c) => c.freeWithdrawals,
  },
  {
    key: 'cryptos',
    label: 'Cryptos supportées',
    kind: 'list',
    get: (c) => c.cryptos,
  },
  {
    key: 'extras',
    label: 'Avantages inclus',
    kind: 'list',
    get: (c) => c.extras,
  },
];

function computeBest(metric: MetricDef, cards: CryptoCard[]): Set<string> {
  const best = new Set<string>();
  if (cards.length === 0) return best;
  if (metric.kind === 'bool') {
    const anyTrue = cards.some((c) => metric.get(c) === true);
    if (!anyTrue) return best;
    for (const c of cards) if (metric.get(c) === true) best.add(c.id);
    if (best.size === cards.length) best.clear();
    return best;
  }
  if (metric.higherIsBetter || metric.lowerIsBetter) {
    const values = cards.map((c) => metric.get(c) as number);
    const target = metric.higherIsBetter ? Math.max(...values) : Math.min(...values);
    const allEqual = values.every((v) => v === target);
    if (allEqual) return best;
    for (const c of cards) if ((metric.get(c) as number) === target) best.add(c.id);
  }
  return best;
}

function formatValue(metric: MetricDef, card: CryptoCard) {
  const v = metric.get(card);
  switch (metric.kind) {
    case 'pct':
      return <span className="font-mono font-semibold">{fmtPct(v as number)}</span>;
    case 'eur':
      return <span className="font-mono font-semibold">{fmtEUR(v as number)}</span>;
    case 'eur_or_free':
      return (
        <span className="font-mono font-semibold">
          {(v as number) === 0 ? 'Gratuit' : fmtEUR(v as number)}
        </span>
      );
    case 'eur_or_none':
      return (
        <span className="font-mono font-semibold">
          {(v as number) === 0 ? 'Aucun' : fmtEUR(v as number)}
        </span>
      );
    case 'number_eur':
      return (
        <span className="font-mono font-semibold">
          {(v as number) === 0 ? '—' : fmtEUR(v as number)}
        </span>
      );
    case 'bool':
      return v ? (
        <Check className="w-5 h-5 text-green-accent" />
      ) : (
        <Minus className="w-5 h-5 text-slate-600" />
      );
    case 'text':
      return <span className="font-medium">{v as string}</span>;
    case 'list': {
      const arr = v as string[];
      if (arr.length === 0) return <span className="text-slate-600">—</span>;
      return (
        <div className="flex flex-wrap gap-1 justify-center">
          {arr.slice(0, 8).map((item) => (
            <span
              key={item}
              className="px-2 py-0.5 rounded-md text-[11px] bg-bg-elevated border border-bg-border text-slate-300"
            >
              {item}
            </span>
          ))}
          {arr.length > 8 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-bg-elevated border border-bg-border text-slate-400">
              +{arr.length - 8}
            </span>
          )}
        </div>
      );
    }
  }
}

export default function CompareSideBySide({
  cards,
  favorites,
  onToggleFavorite,
  onRemove,
}: Props) {
  if (cards.length === 0) {
    return (
      <div className="card-surface p-12 text-center">
        <div className="text-slate-400 mb-5">Aucune carte sélectionnée à comparer.</div>
        <Link to="/" className="btn-primary">
          <Plus className="w-4 h-4" />
          Choisir des cartes
        </Link>
      </div>
    );
  }

  const bestByMetric: Record<string, Set<string>> = {};
  for (const m of METRICS) bestByMetric[m.key] = computeBest(m, cards);

  const colCount = cards.length;
  const colsClass =
    colCount === 2
      ? 'md:grid-cols-2'
      : colCount === 3
      ? 'md:grid-cols-3'
      : colCount === 4
      ? 'md:grid-cols-2 lg:grid-cols-4'
      : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-1 ${colsClass} gap-4`}>
        {cards.map((card) => {
          const isFav = favorites.includes(card.id);
          return (
            <div
              key={card.id}
              className="card-surface p-5 relative flex flex-col items-center text-center hover:border-cyan-accent/40 transition-colors"
            >
              <button
                onClick={() => onRemove(card.id)}
                aria-label="Retirer de la comparaison"
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleFavorite(card.id)}
                aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                className={`absolute top-3 left-3 p-1.5 rounded-lg transition-colors ${
                  isFav
                    ? 'text-green-accent bg-green-accent/10 hover:bg-green-accent/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-bg-elevated'
                }`}
              >
                <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
              </button>

              <div className="mt-4 mb-4">
                <SmartCardImage card={card} size="md" />
              </div>
              <div className="font-display font-bold text-white text-base leading-tight">
                {card.name}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{card.issuer}</div>
              {card.badge && <span className="badge-accent mt-2">{card.badge}</span>}

              <a
                href={card.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 btn-secondary w-full text-xs"
              >
                Voir l'offre
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="card-surface overflow-hidden">
        <div
          role="table"
          aria-label="Comparaison détaillée"
          className="divide-y divide-bg-border"
        >
          {METRICS.map((metric, rowIdx) => (
            <div
              key={metric.key}
              role="row"
              className={`grid grid-cols-[minmax(130px,180px)_1fr] md:grid-cols-[200px_1fr] ${
                rowIdx % 2 === 0 ? 'bg-bg-card' : 'bg-bg-elevated/30'
              }`}
            >
              <div
                role="rowheader"
                className="px-4 py-3 text-xs uppercase tracking-wide font-semibold text-slate-400 border-r border-bg-border flex items-center"
              >
                {metric.label}
              </div>
              <div
                className={`grid grid-cols-1 ${colsClass} divide-x divide-bg-border`}
              >
                {cards.map((card) => {
                  const isBest = bestByMetric[metric.key]?.has(card.id);
                  return (
                    <div
                      key={card.id}
                      role="cell"
                      className={`px-4 py-3 flex items-center justify-center text-center min-h-[54px] text-slate-200 ${
                        isBest ? 'bg-cyan-accent/5' : ''
                      }`}
                    >
                      <div className="relative inline-flex items-center gap-2">
                        {formatValue(metric, card)}
                        {isBest && (
                          <span
                            title="Meilleure valeur"
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-green-accent/15 text-green-accent border border-green-accent/30"
                          >
                            <Trophy className="w-3 h-3" />
                            Best
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
