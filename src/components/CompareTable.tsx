import { ArrowDown, ArrowUp, ArrowUpDown, Check, ExternalLink, Plus, Star, X } from 'lucide-react';
import type { CryptoCard } from '../types/card';
import SmartCardImage from './SmartCardImage';
import { fmtEUR, fmtPct } from '../utils/format';

export type SortKey =
  | 'name'
  | 'cashbackBase'
  | 'cashbackPremium'
  | 'annualFees'
  | 'stakingRequired'
  | 'dailyLimit';

interface Props {
  cards: CryptoCard[];
  favorites: string[];
  compareSelection: string[];
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  best: Record<string, string> | null;
}

export default function CompareTable({
  cards,
  favorites,
  compareSelection,
  sortKey,
  sortDir,
  onSort,
  onToggleFavorite,
  onToggleCompare,
  best,
}: Props) {
  const ariaSort = (key: SortKey): 'ascending' | 'descending' | 'none' =>
    sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <div className="card-surface overflow-x-auto scrollbar-thin">
      <table role="table" className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-bg-border bg-bg-elevated/50">
            <ThCell
              className="sticky left-0 z-10 bg-bg-elevated text-left min-w-[300px]"
              ariaSort={ariaSort('name')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="name"
              onClick={() => onSort('name')}
            >
              Carte
            </ThCell>
            <ThCell
              ariaSort={ariaSort('cashbackBase')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="cashbackBase"
              onClick={() => onSort('cashbackBase')}
            >
              Cashback base
            </ThCell>
            <ThCell
              ariaSort={ariaSort('cashbackPremium')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="cashbackPremium"
              onClick={() => onSort('cashbackPremium')}
            >
              Cashback max
            </ThCell>
            <ThCell
              ariaSort={ariaSort('annualFees')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="annualFees"
              onClick={() => onSort('annualFees')}
            >
              Frais annuels
            </ThCell>
            <ThCell
              ariaSort={ariaSort('stakingRequired')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="stakingRequired"
              onClick={() => onSort('stakingRequired')}
            >
              Staking requis
            </ThCell>
            <ThCell>Cryptos</ThCell>
            <ThCell>France</ThCell>
            <ThCell>Réseau</ThCell>
            <ThCell>Retraits gratuits</ThCell>
            <ThCell>Actions</ThCell>
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => (
            <Row
              key={c.id}
              card={c}
              isFav={favorites.includes(c.id)}
              inCompare={compareSelection.includes(c.id)}
              best={best}
              onToggleFav={() => onToggleFavorite(c.id)}
              onToggleCompare={() => onToggleCompare(c.id)}
            />
          ))}
          {cards.length === 0 && (
            <tr>
              <td colSpan={10} className="p-10 text-center text-slate-500">
                Aucune carte ne correspond aux filtres sélectionnés.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ThCell({
  children,
  onClick,
  ariaSort,
  className,
  sortKey,
  dir,
  myKey,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaSort?: 'ascending' | 'descending' | 'none';
  className?: string;
  sortKey?: SortKey;
  dir?: 'asc' | 'desc';
  myKey?: string;
}) {
  const active = onClick && sortKey === myKey;
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
        onClick ? 'cursor-pointer hover:text-white' : ''
      } ${active ? 'text-cyan-accent' : 'text-slate-400'} ${className ?? ''}`}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {onClick &&
          (active ? (
            dir === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 opacity-50" />
          ))}
      </span>
    </th>
  );
}

function Row({
  card,
  isFav,
  inCompare,
  best,
  onToggleFav,
  onToggleCompare,
}: {
  card: CryptoCard;
  isFav: boolean;
  inCompare: boolean;
  best: Record<string, string> | null;
  onToggleFav: () => void;
  onToggleCompare: () => void;
}) {
  const isBest = (key: string) => best && best[key] === card.id;
  return (
    <tr className="border-b border-bg-border hover:bg-bg-elevated/40 transition-colors">
      <td className="sticky left-0 z-10 bg-bg-card hover:bg-bg-elevated/80 px-4 py-3 min-w-[300px]">
        <div className="flex items-center gap-3">
          <SmartCardImage card={card} size="xs" />
          <div>
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              {card.name}
              {card.badge && <span className="badge-accent">{card.badge}</span>}
            </div>
            <div className="text-xs text-slate-500">{card.issuer}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={isBest('cashbackBase') ? 'badge-best' : 'text-slate-200'}>
          {fmtPct(card.cashbackBase)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={isBest('cashbackPremium') ? 'badge-best' : 'text-slate-200 font-medium'}>
          {fmtPct(card.cashbackPremium)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={isBest('annualFees') ? 'badge-best' : 'text-slate-200'}>
          {card.annualFees === 0 ? 'Gratuit' : fmtEUR(card.annualFees)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={isBest('stakingRequired') ? 'badge-best' : 'text-slate-200'}>
          {card.stakingRequired === 0 ? 'Aucun' : fmtEUR(card.stakingRequired)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {card.cryptos.slice(0, 4).map((cr) => (
            <span key={cr} className="chip text-[10px] py-0.5 px-1.5">
              {cr}
            </span>
          ))}
          {card.cryptos.length > 4 && (
            <span className="chip text-[10px] py-0.5 px-1.5">+{card.cryptos.length - 4}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {card.availableFrance ? (
          <Check className="w-4 h-4 text-green-accent inline" />
        ) : (
          <X className="w-4 h-4 text-slate-600 inline" />
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-slate-300">{card.cardNetwork}</td>
      <td className="px-4 py-3 text-center">
        {card.freeWithdrawals ? (
          <Check className="w-4 h-4 text-green-accent inline" />
        ) : (
          <X className="w-4 h-4 text-slate-600 inline" />
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleCompare}
            aria-label={inCompare ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
            aria-pressed={inCompare}
            className={`p-1.5 rounded-lg transition-colors ${
              inCompare
                ? 'bg-cyan-accent text-bg-base'
                : 'text-slate-500 hover:text-white hover:bg-bg-elevated'
            }`}
          >
            {inCompare ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleFav}
            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`p-1.5 rounded-lg transition-colors ${
              isFav
                ? 'text-green-accent bg-green-accent/10 hover:bg-green-accent/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-bg-elevated'
            }`}
          >
            <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <a
            href={card.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-accent px-2 py-1 rounded border border-bg-border hover:border-cyan-accent/40 transition-colors"
          >
            Offre
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </td>
    </tr>
  );
}
