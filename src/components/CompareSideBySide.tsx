import { Check, ExternalLink, Minus, Plus, Star, Trophy, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CryptoCard } from '../types/card';
import SmartCardImage from './SmartCardImage';
import { fmtEUR, fmtPct, translateBadge } from '../utils/format';
import { getAffiliateLink } from '../utils/affiliateLink';
import { trackAffiliateClick } from '../utils/analytics';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

interface Props {
  cards: CryptoCard[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

type MetricKind = 'pct' | 'eur' | 'eur_or_free' | 'eur_or_none' | 'bool' | 'text' | 'list' | 'number_eur';

interface MetricDef {
  key: string;
  kind: MetricKind;
  higherIsBetter?: boolean;
  lowerIsBetter?: boolean;
  get: (c: CryptoCard) => number | string | boolean | string[];
}

// Labels per metric key per language
const METRIC_LABELS: Record<string, Record<string, string>> = {
  cashbackBase:     { fr: 'Cashback de base',     de: 'Basis-Cashback',       es: 'Cashback base',         it: 'Cashback base',          en: 'Base cashback' },
  cashbackPremium:  { fr: 'Cashback max',          de: 'Max. Cashback',        es: 'Cashback máx.',         it: 'Cashback max.',           en: 'Max cashback' },
  annualFees:       { fr: 'Frais annuels',         de: 'Jahresgebühren',       es: 'Comisiones anuales',    it: 'Costi annuali',           en: 'Annual fees' },
  stakingRequired:  { fr: 'Staking requis',        de: 'Staking erforderlich', es: 'Staking requerido',     it: 'Staking richiesto',       en: 'Staking required' },
  dailyLimit:       { fr: 'Plafond journalier',    de: 'Tageslimit',           es: 'Límite diario',         it: 'Limite giornaliero',      en: 'Daily limit' },
  cardNetwork:      { fr: 'Réseau',                de: 'Netzwerk',             es: 'Red',                   it: 'Rete',                    en: 'Network' },
  availableFrance:  { fr: 'Disponible France',     de: 'Verfügbar FR',         es: 'Disponible Francia',    it: 'Disponibile Francia',     en: 'Available France' },
  availableEU:      { fr: 'Disponible UE',         de: 'Verfügbar EU',         es: 'Disponible UE',         it: 'Disponibile UE',          en: 'Available EU' },
  freeWithdrawals:  { fr: 'Retraits gratuits',     de: 'Gratis-Abhebungen',    es: 'Retiros gratuitos',     it: 'Prelievi gratuiti',       en: 'Free withdrawals' },
  cryptos:          { fr: 'Cryptos supportées',    de: 'Unterstützte Kryptos', es: 'Criptos admitidas',     it: 'Criptovalute supportate', en: 'Supported cryptos' },
  extras:           { fr: 'Avantages inclus',      de: 'Enthaltene Vorteile',  es: 'Ventajas incluidas',    it: 'Vantaggi inclusi',        en: 'Included benefits' },
};

const FREE_LABEL:  Record<string, string> = { fr: 'Gratuit', de: 'Kostenlos', es: 'Gratis',  it: 'Gratuito', en: 'Free' };
const NONE_LABEL:  Record<string, string> = { fr: 'Aucun',   de: 'Keins',     es: 'Ninguno', it: 'Nessuno',  en: 'None' };
const BEST_LABEL:  Record<string, string> = { fr: 'Meilleur', de: 'Beste',    es: 'Mejor',   it: 'Migliore', en: 'Best' };
const EMPTY_LABEL: Record<string, string> = {
  fr: 'Aucune carte sélectionnée à comparer.',
  de: 'Keine Karte zur Vergleich ausgewählt.',
  es: 'Ninguna tarjeta seleccionada para comparar.',
  it: 'Nessuna carta selezionata per il confronto.',
  en: 'No card selected for comparison.',
};
const CHOOSE_LABEL: Record<string, string> = {
  fr: 'Choisir des cartes', de: 'Karten wählen', es: 'Elegir tarjetas', it: 'Scegli carte', en: 'Choose cards',
};
const REMOVE_LABEL: Record<string, string> = {
  fr: 'Retirer de la comparaison', de: 'Aus Vergleich entfernen',
  es: 'Quitar de la comparación', it: 'Rimuovi dal confronto', en: 'Remove from comparison',
};
const ADD_FAV_LABEL:    Record<string, string> = { fr: 'Ajouter aux favoris',  de: 'Zu Favoriten', es: 'Añadir a favoritos', it: 'Aggiungi ai preferiti', en: 'Add to favourites' };
const REMOVE_FAV_LABEL: Record<string, string> = { fr: 'Retirer des favoris', de: 'Aus Favoriten', es: 'Quitar de favoritos', it: 'Rimuovi dai preferiti', en: 'Remove from favourites' };
const SEE_OFFER_LABEL:  Record<string, string> = { fr: "Voir l'offre", de: 'Angebot', es: 'Ver oferta', it: 'Vedi offerta', en: 'See offer' };
const COMPARE_LABEL:    Record<string, string> = { fr: 'Comparaison détaillée', de: 'Detaillierter Vergleich', es: 'Comparación detallada', it: 'Confronto dettagliato', en: 'Detailed comparison' };
const DETAILS_LABEL:    Record<string, string> = { fr: 'Détails', de: 'Details', es: 'Detalles', it: 'Dettagli', en: 'Details' };

const METRICS: MetricDef[] = [
  { key: 'cashbackBase',    kind: 'pct',         higherIsBetter: true,  get: (c) => c.cashbackBase },
  { key: 'cashbackPremium', kind: 'pct',         higherIsBetter: true,  get: (c) => c.cashbackPremium },
  { key: 'annualFees',      kind: 'eur_or_free', lowerIsBetter: true,   get: (c) => c.annualFees },
  { key: 'stakingRequired', kind: 'eur_or_none', lowerIsBetter: true,   get: (c) => c.stakingRequired },
  { key: 'dailyLimit',      kind: 'number_eur',  higherIsBetter: true,  get: (c) => c.dailyLimit },
  { key: 'cardNetwork',     kind: 'text',                               get: (c) => c.cardNetwork },
  { key: 'availableFrance', kind: 'bool',                               get: (c) => c.availableFrance },
  { key: 'availableEU',     kind: 'bool',                               get: (c) => c.availableEU },
  { key: 'freeWithdrawals', kind: 'bool',                               get: (c) => c.freeWithdrawals },
  { key: 'cryptos',         kind: 'list',                               get: (c) => c.cryptos },
  { key: 'extras',          kind: 'list',                               get: (c) => c.extras },
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

function formatValue(metric: MetricDef, card: CryptoCard, lang: string) {
  const v = metric.get(card);
  const free = FREE_LABEL[lang] ?? FREE_LABEL.en;
  const none = NONE_LABEL[lang] ?? NONE_LABEL.en;
  switch (metric.kind) {
    case 'pct':
      return <span className="font-mono font-semibold">{fmtPct(v as number)}</span>;
    case 'eur':
      return <span className="font-mono font-semibold">{fmtEUR(v as number)}</span>;
    case 'eur_or_free':
      return (
        <span className="font-mono font-semibold">
          {(v as number) === 0 ? free : fmtEUR(v as number)}
        </span>
      );
    case 'eur_or_none':
      return (
        <span className="font-mono font-semibold">
          {(v as number) === 0 ? none : fmtEUR(v as number)}
        </span>
      );
    case 'number_eur':
      return (
        <span className="font-mono font-semibold">
          {(v as number) === 0 ? ',' : fmtEUR(v as number)}
        </span>
      );
    case 'bool':
      return v ? (
        <Check className="w-5 h-5 text-green-accent" />
      ) : (
        <Minus className="w-5 h-5 text-slate-500" />
      );
    case 'text':
      return <span className="font-medium">{v as string}</span>;
    case 'list': {
      const arr = v as string[];
      if (arr.length === 0) return <span className="text-slate-500">,</span>;
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
  const lang = useLanguage();
  const cardSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';

  if (cards.length === 0) {
    return (
      <div className="card-surface p-12 text-center">
        <div className="text-slate-400 mb-5">{EMPTY_LABEL[lang] ?? EMPTY_LABEL.en}</div>
        <Link to={`/${lang}`} className="btn-primary">
          <Plus className="w-4 h-4" />
          {CHOOSE_LABEL[lang] ?? CHOOSE_LABEL.en}
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
                aria-label={REMOVE_LABEL[lang] ?? REMOVE_LABEL.en}
                className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleFavorite(card.id)}
                aria-label={isFav ? (REMOVE_FAV_LABEL[lang] ?? REMOVE_FAV_LABEL.en) : (ADD_FAV_LABEL[lang] ?? ADD_FAV_LABEL.en)}
                className={`absolute top-3 left-3 p-2 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center ${
                  isFav
                    ? 'text-green-accent bg-green-accent/10 hover:bg-green-accent/20'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-bg-elevated'
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
              <div className="text-xs text-slate-400 mt-0.5">{card.issuer}</div>
              {card.badge && <span className="badge-accent mt-2">{translateBadge(card.badge, lang)}</span>}

              <Link
                to={`/${lang}/${cardSlug}/${card.id}`}
                className="mt-3 btn-ghost w-full text-xs"
              >
                {DETAILS_LABEL[lang] ?? DETAILS_LABEL.en}
              </Link>

              <a
                href={getAffiliateLink(card)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-2 btn-secondary w-full text-xs"
                onClick={() => trackAffiliateClick(card.name, card.issuer, getAffiliateLink(card), 'compare_tool', lang)}
              >
                {SEE_OFFER_LABEL[lang] ?? SEE_OFFER_LABEL.en}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="card-surface overflow-hidden">
        <div
          role="table"
          aria-label={COMPARE_LABEL[lang] ?? COMPARE_LABEL.en}
          className="divide-y divide-bg-border"
        >
          {METRICS.map((metric, rowIdx) => (
            <div
              key={metric.key}
              role="row"
              className={`grid grid-cols-[90px_1fr] sm:grid-cols-[minmax(130px,180px)_1fr] md:grid-cols-[200px_1fr] ${
                rowIdx % 2 === 0 ? 'bg-bg-card' : 'bg-bg-elevated/30'
              }`}
            >
              <div
                role="rowheader"
                className="px-4 py-3 text-xs uppercase tracking-wide font-semibold text-slate-400 border-r border-bg-border flex items-center"
              >
                {METRIC_LABELS[metric.key]?.[lang] ?? METRIC_LABELS[metric.key]?.en ?? metric.key}
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
                        {formatValue(metric, card, lang)}
                        {isBest && (
                          <span
                            title={BEST_LABEL[lang] ?? 'Best'}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-green-accent/15 text-green-accent border border-green-accent/30"
                          >
                            <Trophy className="w-3 h-3" />
                            {BEST_LABEL[lang] ?? 'Best'}
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
