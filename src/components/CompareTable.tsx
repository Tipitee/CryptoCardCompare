import { ArrowDown, ArrowUp, ArrowUpDown, Check, ExternalLink, Plus, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { CryptoCard } from '../types/card';
import SmartCardImage from './SmartCardImage';
import { fmtEUR, fmtPct, translateBadge } from '../utils/format';
import { getAffiliateLink } from '../utils/affiliateLink';
import { trackAffiliateClick } from '../utils/analytics';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

const SCROLL_HINT: Record<string, string> = {
  fr: 'Faites défiler pour voir plus',
  de: 'Wischen für mehr',
  es: 'Desliza para ver más',
  it: 'Scorri per vedere altro',
  en: 'Scroll for more',
};

// ── i18n label maps ────────────────────────────────────────────────────────────
const TH: Record<string, Record<string, string>> = {
  card:       { fr: 'Carte',            de: 'Karte',             es: 'Tarjeta',          it: 'Carta',           en: 'Card' },
  cbBase:     { fr: 'Cashback base',    de: 'Basis-Cashback',    es: 'Cashback base',    it: 'Cashback base',   en: 'Base cashback' },
  cbMax:      { fr: 'Cashback max',     de: 'Max. Cashback',     es: 'Cashback máx.',    it: 'Cashback max.',   en: 'Max cashback' },
  fees:       { fr: 'Frais annuels',    de: 'Jahresgebühren',    es: 'Comisiones',       it: 'Costi annuali',   en: 'Annual fees' },
  staking:    { fr: 'Staking requis',   de: 'Staking erf.',      es: 'Staking req.',     it: 'Staking rich.',   en: 'Staking req.' },
  cryptos:    { fr: 'Cryptos',          de: 'Kryptos',           es: 'Criptos',          it: 'Criptovalute',    en: 'Cryptos' },
  france:     { fr: 'France',           de: 'Frankreich',        es: 'Francia',          it: 'Francia',         en: 'France' },
  network:    { fr: 'Réseau',           de: 'Netzwerk',          es: 'Red',              it: 'Rete',            en: 'Network' },
  withdrawals:{ fr: 'Retraits gratuits',de: 'Gratis-Abhebungen', es: 'Retiros gratis',   it: 'Prelievi gratis', en: 'Free withdrawals' },
  actions:    { fr: 'Actions',          de: 'Aktionen',          es: 'Acciones',         it: 'Azioni',          en: 'Actions' },
};
const FREE_L:    Record<string, string> = { fr: 'Gratuit',   de: 'Kostenlos',  es: 'Gratis',   it: 'Gratuito',  en: 'Free' };
const NONE_L:    Record<string, string> = { fr: 'Aucun',     de: 'Keins',      es: 'Ninguno',  it: 'Nessuno',   en: 'None' };
const NO_CARDS:  Record<string, string> = {
  fr: 'Aucune carte ne correspond aux filtres sélectionnés.',
  de: 'Keine Karte entspricht den ausgewählten Filtern.',
  es: 'Ninguna tarjeta coincide con los filtros seleccionados.',
  it: 'Nessuna carta corrisponde ai filtri selezionati.',
  en: 'No card matches the selected filters.',
};
const ADD_CMP:   Record<string, string> = { fr: 'Ajouter à la comparaison',  de: 'Zum Vergleich', es: 'Añadir a comparación', it: 'Aggiungi al confronto', en: 'Add to comparison' };
const REM_CMP:   Record<string, string> = { fr: 'Retirer de la comparaison', de: 'Aus Vergleich', es: 'Quitar de comparación', it: 'Rimuovi dal confronto', en: 'Remove from comparison' };
const ADD_FAV:   Record<string, string> = { fr: 'Ajouter aux favoris',  de: 'Zu Favoriten', es: 'Añadir a favoritos', it: 'Aggiungi ai preferiti', en: 'Add to favourites' };
const REM_FAV:   Record<string, string> = { fr: 'Retirer des favoris', de: 'Aus Favoriten', es: 'Quitar de favoritos', it: 'Rimuovi dai preferiti', en: 'Remove from favourites' };
const SELECTED:  Record<string, string> = { fr: 'Sélectionnée', de: 'Ausgewählt', es: 'Seleccionada', it: 'Selezionata', en: 'Selected' };
const CLICK_SEL: Record<string, string> = { fr: 'Cliquer pour sélectionner', de: 'Zum Auswählen klicken', es: 'Clic para seleccionar', it: 'Clicca per selezionare', en: 'Click to select' };
const DETAILS_L: Record<string, string> = { fr: 'Détails', de: 'Details', es: 'Detalles', it: 'Dettagli', en: 'Details' };
const OFFER_L:   Record<string, string> = { fr: 'Offre', de: 'Angebot', es: 'Oferta', it: 'Offerta', en: 'Offer' };

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
  // Quick-select A/B
  onCardClick?: (id: string) => void;
  quickSelectA?: string;
  quickSelectB?: string;
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
  onCardClick,
  quickSelectA,
  quickSelectB,
}: Props) {
  const lang = useLanguage();
  const ariaSort = (key: SortKey): 'ascending' | 'descending' | 'none' =>
    sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
  const th = (key: string) => TH[key]?.[lang] ?? TH[key]?.en ?? key;

  // ── Scroll affordance ───────────────────────────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      const scrollable = el.scrollWidth - el.clientWidth > 4;
      setCanScrollRight(scrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
      if (el.scrollLeft > 10) setHintDismissed(true);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [cards.length]);

  return (
    <div className="relative">
      {/* Right-edge gradient — visible only when more content to scroll */}
      {canScrollRight && (
        <div
          className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-bg-card/90 to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />
      )}
      {/* Mobile scroll hint — shown once until user scrolls */}
      {canScrollRight && !hintDismissed && (
        <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-bg-elevated/90 backdrop-blur-sm text-slate-400 text-xs px-3 py-1.5 rounded-full border border-bg-border pointer-events-none animate-pulse">
          <span>←</span>
          <span>{SCROLL_HINT[lang] ?? SCROLL_HINT.en}</span>
          <span>→</span>
        </div>
      )}
    <div ref={scrollRef} className="card-surface overflow-x-auto scrollbar-thin">
      <table role="table" className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-bg-border bg-bg-elevated/50">
            <ThCell
              className="sticky left-0 z-10 bg-bg-elevated text-left min-w-[200px] sm:min-w-[300px] shadow-[4px_0_8px_rgba(0,0,0,0.4)]"
              ariaSort={ariaSort('name')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="name"
              onClick={() => onSort('name')}
            >
              {th('card')}
            </ThCell>
            <ThCell
              ariaSort={ariaSort('cashbackBase')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="cashbackBase"
              onClick={() => onSort('cashbackBase')}
            >
              {th('cbBase')}
            </ThCell>
            <ThCell
              ariaSort={ariaSort('cashbackPremium')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="cashbackPremium"
              onClick={() => onSort('cashbackPremium')}
            >
              {th('cbMax')}
            </ThCell>
            <ThCell
              ariaSort={ariaSort('annualFees')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="annualFees"
              onClick={() => onSort('annualFees')}
            >
              {th('fees')}
            </ThCell>
            <ThCell
              ariaSort={ariaSort('stakingRequired')}
              sortKey={sortKey}
              dir={sortDir}
              myKey="stakingRequired"
              onClick={() => onSort('stakingRequired')}
            >
              {th('staking')}
            </ThCell>
            <ThCell>{th('cryptos')}</ThCell>
            <ThCell>{th('france')}</ThCell>
            <ThCell>{th('network')}</ThCell>
            <ThCell>{th('withdrawals')}</ThCell>
            <ThCell>{th('actions')}</ThCell>
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
              onCardClick={onCardClick ? () => onCardClick(c.id) : undefined}
              quickSlot={
                quickSelectA === c.id ? 'A' : quickSelectB === c.id ? 'B' : null
              }
            />
          ))}
          {cards.length === 0 && (
            <tr>
              <td colSpan={10} className="p-10 text-center text-slate-400">
                {NO_CARDS[lang] ?? NO_CARDS.en}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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
  onCardClick,
  quickSlot,
}: {
  card: CryptoCard;
  isFav: boolean;
  inCompare: boolean;
  best: Record<string, string> | null;
  onToggleFav: () => void;
  onToggleCompare: () => void;
  onCardClick?: () => void;
  quickSlot: 'A' | 'B' | null;
}) {
  const lang = useLanguage();
  const cardSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';
  const isBest = (key: string) => best && best[key] === card.id;
  const free = FREE_L[lang] ?? FREE_L.en;
  const none = NONE_L[lang] ?? NONE_L.en;

  const slotColor =
    quickSlot === 'A'
      ? 'bg-cyan-accent text-bg font-bold'
      : 'bg-green-accent text-bg font-bold';

  return (
    <tr
      className={`border-b border-bg-border transition-colors ${
        quickSlot
          ? quickSlot === 'A'
            ? 'bg-cyan-accent/5 hover:bg-cyan-accent/10'
            : 'bg-green-accent/5 hover:bg-green-accent/10'
          : 'hover:bg-bg-elevated/40'
      }`}
    >
      <td className={`sticky left-0 z-10 px-4 py-3 min-w-[200px] sm:min-w-[300px] shadow-[4px_0_8px_rgba(0,0,0,0.4)] ${
        quickSlot
          ? quickSlot === 'A'
            ? 'bg-cyan-accent/5'
            : 'bg-green-accent/5'
          : 'bg-bg-card hover:bg-bg-elevated/80'
      }`}>
        <div className="flex items-center gap-3">
          {/* Clickable image + name area */}
          <button
            onClick={onCardClick}
            disabled={!onCardClick}
            className={`flex items-center gap-3 flex-1 text-left ${onCardClick ? 'cursor-pointer group' : ''}`}
            title={onCardClick ? (quickSlot ? `${SELECTED[lang] ?? SELECTED.en} ${quickSlot}` : (CLICK_SEL[lang] ?? CLICK_SEL.en)) : undefined}
          >
            <div className="relative shrink-0">
              <SmartCardImage card={card} size="xs" />
              {quickSlot && (
                <span
                  className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow ${slotColor}`}
                >
                  {quickSlot}
                </span>
              )}
            </div>
            <div>
              <div className={`font-semibold text-sm flex items-center gap-2 transition-colors ${
                onCardClick ? 'group-hover:text-cyan-accent' : ''
              } ${quickSlot === 'A' ? 'text-cyan-accent' : quickSlot === 'B' ? 'text-green-accent' : 'text-white'}`}>
                {card.name}
                {card.badge && <span className="badge-accent">{translateBadge(card.badge, lang)}</span>}
              </div>
              <div className="text-xs text-slate-400">{card.issuer}</div>
            </div>
          </button>
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
          {card.annualFees === 0 ? free : fmtEUR(card.annualFees)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={isBest('stakingRequired') ? 'badge-best' : 'text-slate-200'}>
          {card.stakingRequired === 0 ? none : fmtEUR(card.stakingRequired)}
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
            onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            aria-label={inCompare ? (REM_CMP[lang] ?? REM_CMP.en) : (ADD_CMP[lang] ?? ADD_CMP.en)}
            aria-pressed={inCompare}
            className={`p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
              inCompare
                ? 'bg-cyan-accent text-bg-base'
                : 'text-slate-400 hover:text-white hover:bg-bg-elevated'
            }`}
          >
            {inCompare ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
            aria-label={isFav ? (REM_FAV[lang] ?? REM_FAV.en) : (ADD_FAV[lang] ?? ADD_FAV.en)}
            className={`p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isFav
                ? 'text-green-accent bg-green-accent/10 hover:bg-green-accent/20'
                : 'text-slate-400 hover:text-slate-300 hover:bg-bg-elevated'
            }`}
          >
            <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/${lang}/${cardSlug}/${card.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-accent px-2 py-1 rounded border border-bg-border hover:border-cyan-accent/40 transition-colors"
          >
            {DETAILS_L[lang] ?? DETAILS_L.en}
          </Link>
          <a
            href={getAffiliateLink(card)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={(e) => { e.stopPropagation(); trackAffiliateClick(card.name, card.issuer, getAffiliateLink(card), 'compare_tool', lang); }}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-accent px-2 py-1 rounded border border-bg-border hover:border-cyan-accent/40 transition-colors"
          >
            {OFFER_L[lang] ?? OFFER_L.en}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </td>
    </tr>
  );
}
