import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  Clock,
  LayoutGrid,
  Link as LinkIcon,
  Plus,
  Rows3,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import CompareTable, { type SortKey } from '../components/CompareTable';
import CompareSideBySide from '../components/CompareSideBySide';
import {
  fetchRecentCompareSessions,
  saveCompareSession,
  type CompareSession,
} from '../lib/supabase';

const ALL_CRYPTOS = [
  'BTC', 'ETH', 'BNB', 'CRO', 'SOL', 'XRP', 'ADA', 'USDC', 'USDT', 'DOT', 'MATIC', 'AVAX', 'LINK',
];

type ViewMode = 'columns' | 'table';

export default function Compare() {
  const allCards = useAppStore((s) => s.cards);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const compareSelection = useAppStore((s) => s.compareSelection);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIds = useMemo(() => {
    const raw = searchParams.get('selected');
    return raw ? raw.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const isSelectionMode = selectedIds.length > 0;

  const selectedCards = useMemo(
    () =>
      selectedIds
        .map((id) => allCards.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [allCards, selectedIds]
  );

  const [viewMode, setViewMode] = useState<ViewMode>('columns');
  const [copied, setCopied] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recentSessions, setRecentSessions] = useState<CompareSession[]>([]);

  const [search, setSearch] = useState('');
  const [minCashback, setMinCashback] = useState(0);
  const [maxFees, setMaxFees] = useState(600);
  const [maxStaking, setMaxStaking] = useState(5000);
  const [franceOnly, setFranceOnly] = useState(false);
  const [freeWdOnly, setFreeWdOnly] = useState(false);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);

  const [sortKey, setSortKey] = useState<SortKey>('cashbackPremium');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (isSelectionMode && selectedIds.length >= 2) {
      saveCompareSession(selectedIds).catch(() => {});
    }
  }, [isSelectionMode, selectedIds]);

  useEffect(() => {
    fetchRecentCompareSessions(5).then(setRecentSessions).catch(() => {});
  }, [isSelectionMode]);

  const exitSelectionMode = () => {
    clearCompare();
    const next = new URLSearchParams(searchParams);
    next.delete('selected');
    setSearchParams(next, { replace: true });
  };

  const removeFromSelection = (id: string) => {
    const nextIds = selectedIds.filter((s) => s !== id);
    const next = new URLSearchParams(searchParams);
    if (nextIds.length === 0) {
      next.delete('selected');
      clearCompare();
    } else {
      next.set('selected', nextIds.join(','));
    }
    setSearchParams(next, { replace: true });
    if (compareSelection.includes(id)) toggleCompare(id);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const filteredTable = useMemo(() => {
    return allCards.filter((c) => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.issuer.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (c.cashbackBase < minCashback) return false;
      if (c.annualFees > maxFees) return false;
      if (c.stakingRequired > maxStaking) return false;
      if (franceOnly && !c.availableFrance) return false;
      if (freeWdOnly && !c.freeWithdrawals) return false;
      if (selectedCryptos.length > 0) {
        const hasAll = selectedCryptos.every((s) => c.cryptos.includes(s));
        if (!hasAll) return false;
      }
      return true;
    });
  }, [allCards, search, minCashback, maxFees, maxStaking, franceOnly, freeWdOnly, selectedCryptos]);

  const sortedTable = useMemo(() => {
    const arr = [...filteredTable];
    arr.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (sortKey === 'name') {
        av = a.name;
        bv = b.name;
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredTable, sortKey, sortDir]);

  const tableBest = useMemo(() => {
    if (filteredTable.length === 0) return null as null | Record<string, string>;
    const maxBase = Math.max(...filteredTable.map((c) => c.cashbackBase));
    const maxPrem = Math.max(...filteredTable.map((c) => c.cashbackPremium));
    const minFees = Math.min(...filteredTable.map((c) => c.annualFees));
    const minStake = Math.min(...filteredTable.map((c) => c.stakingRequired));
    const maxLimit = Math.max(...filteredTable.map((c) => c.dailyLimit));
    return {
      cashbackBase: filteredTable.find((c) => c.cashbackBase === maxBase)!.id,
      cashbackPremium: filteredTable.find((c) => c.cashbackPremium === maxPrem)!.id,
      annualFees: filteredTable.find((c) => c.annualFees === minFees)!.id,
      stakingRequired: filteredTable.find((c) => c.stakingRequired === minStake)!.id,
      dailyLimit: filteredTable.find((c) => c.dailyLimit === maxLimit)!.id,
    };
  }, [filteredTable]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  const toggleCrypto = (c: string) => {
    setSelectedCryptos((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const resetFilters = () => {
    setSearch('');
    setMinCashback(0);
    setMaxFees(600);
    setMaxStaking(5000);
    setFranceOnly(false);
    setFreeWdOnly(false);
    setSelectedCryptos([]);
  };

  const loadSession = (ids: string[]) => {
    const next = new URLSearchParams(searchParams);
    next.set('selected', ids.join(','));
    setSearchParams(next, { replace: false });
  };

  if (isSelectionMode) {
    const missing = selectedIds.filter((id) => !allCards.some((c) => c.id === id));
    const stats = summaryStats(selectedCards);

    return (
      <div className="container-app py-10">
        <header className="mb-6 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-cyan-accent font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Comparaison personnalisée
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                {selectedCards.length} carte{selectedCards.length > 1 ? 's' : ''} face à face
              </h1>
              <p className="text-slate-400 max-w-2xl text-sm">
                Les meilleures valeurs pour chaque critère sont mises en avant avec un badge vert.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/" className="btn-ghost text-sm">
                <Plus className="w-4 h-4" />
                Ajouter des cartes
              </Link>
              <button onClick={copyShareLink} className="btn-secondary text-sm">
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Lien copié' : 'Partager'}
              </button>
              <button onClick={exitSelectionMode} className="btn-secondary text-sm">
                <X className="w-4 h-4" />
                Voir toutes les cartes
              </button>
            </div>
          </div>

          {missing.length > 0 && (
            <div className="card-surface border-amber-400/40 bg-amber-400/5 p-3 flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-200">
                {missing.length} carte{missing.length > 1 ? 's' : ''} introuvable
                {missing.length > 1 ? 's' : ''} dans le catalogue actuel.
                <span className="text-slate-400"> ({missing.join(', ')})</span>
              </div>
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Cashback max moyen" value={`${stats.avgCashbackPremium.toFixed(2)} %`} />
              <StatCard label="Frais annuels min." value={stats.minFees === 0 ? 'Gratuit' : `${stats.minFees} €`} />
              <StatCard label="Staking min." value={stats.minStaking === 0 ? 'Aucun' : `${stats.minStaking} €`} />
              <StatCard label="Cryptos communes" value={`${stats.commonCryptos.length}`} />
            </div>
          )}
        </header>

        <CompareSideBySide
          cards={selectedCards}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onRemove={removeFromSelection}
        />

        {recentSessions.length > 1 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Comparaisons récentes
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentSessions
                .filter((s) => s.cardIds.join(',') !== selectedIds.join(','))
                .slice(0, 3)
                .map((s) => {
                  const names = s.cardIds
                    .map((id) => allCards.find((c) => c.id === id)?.name)
                    .filter(Boolean);
                  return (
                    <button
                      key={s.id}
                      onClick={() => loadSession(s.cardIds)}
                      className="card-surface p-3 text-left hover:border-cyan-accent/40 transition-colors"
                    >
                      <div className="text-xs text-slate-500 mb-1">
                        {new Date(s.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-sm text-slate-200 line-clamp-2">
                        {names.join(' · ') || `${s.cardIds.length} cartes`}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-accent">
                        <LinkIcon className="w-3 h-3" />
                        Rouvrir
                      </div>
                    </button>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    );
  }

  const filtersActive =
    search !== '' ||
    minCashback !== 0 ||
    maxFees !== 600 ||
    maxStaking !== 5000 ||
    franceOnly ||
    freeWdOnly ||
    selectedCryptos.length > 0;

  return (
    <div className="container-app py-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Comparateur de cartes</h1>
          <p className="text-slate-400 max-w-2xl">
            Filtrez, triez et sélectionnez plusieurs cartes pour une comparaison détaillée.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-bg-border bg-bg-elevated p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-bg-card text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={viewMode === 'table'}
            >
              <Rows3 className="w-3.5 h-3.5" />
              Tableau
            </button>
            <button
              onClick={() => setViewMode('columns')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'columns'
                  ? 'bg-bg-card text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={viewMode === 'columns'}
              disabled={compareSelection.length < 2}
              title={compareSelection.length < 2 ? 'Sélectionnez au moins 2 cartes' : undefined}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Côte-à-côte
            </button>
          </div>
        </div>
      </header>

      <div className="card-surface p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une carte ou un émetteur..."
              className="input-field"
            />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`btn-secondary text-sm ${filtersActive ? 'border-cyan-accent/60 text-white' : ''}`}
            aria-expanded={filtersOpen}
          >
            Filtres {filtersActive && <span className="badge-accent ml-1">Actifs</span>}
          </button>
          {filtersActive && (
            <button onClick={resetFilters} className="btn-ghost text-sm">
              <X className="w-4 h-4" />
              Réinitialiser
            </button>
          )}
          <div className="text-sm text-slate-400 ml-auto">
            {sortedTable.length} carte{sortedTable.length > 1 ? 's' : ''}
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-5 pt-5 border-t border-bg-border grid md:grid-cols-3 gap-5">
            <SliderControl
              label="Cashback minimum"
              value={minCashback}
              min={0}
              max={5}
              step={0.1}
              suffix=" %"
              onChange={setMinCashback}
            />
            <SliderControl
              label="Frais annuels max"
              value={maxFees}
              min={0}
              max={600}
              step={10}
              suffix=" €"
              onChange={setMaxFees}
            />
            <SliderControl
              label="Staking requis max"
              value={maxStaking}
              min={0}
              max={5000}
              step={50}
              suffix=" €"
              onChange={setMaxStaking}
            />
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={franceOnly}
                onChange={(e) => setFranceOnly(e.target.checked)}
                className="w-4 h-4 accent-cyan-accent"
              />
              Disponible en France uniquement
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={freeWdOnly}
                onChange={(e) => setFreeWdOnly(e.target.checked)}
                className="w-4 h-4 accent-cyan-accent"
              />
              Retraits gratuits
            </label>
            <div className="md:col-span-3">
              <div className="text-xs text-slate-400 mb-1.5">Cryptos supportées</div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_CRYPTOS.map((c) => {
                  const active = selectedCryptos.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCrypto(c)}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-cyan-accent/20 border-cyan-accent text-cyan-accent'
                          : 'bg-bg-elevated border-bg-border text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'columns' && compareSelection.length >= 2 ? (
        <CompareSideBySide
          cards={allCards.filter((c) => compareSelection.includes(c.id))}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onRemove={toggleCompare}
        />
      ) : (
        <CompareTable
          cards={sortedTable}
          favorites={favorites}
          compareSelection={compareSelection}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onToggleFavorite={toggleFavorite}
          onToggleCompare={toggleCompare}
          best={tableBest}
        />
      )}
    </div>
  );
}

function summaryStats(cards: { cashbackPremium: number; annualFees: number; stakingRequired: number; cryptos: string[] }[]) {
  if (cards.length === 0) return null;
  const avgCashbackPremium =
    cards.reduce((s, c) => s + c.cashbackPremium, 0) / cards.length;
  const minFees = Math.min(...cards.map((c) => c.annualFees));
  const minStaking = Math.min(...cards.map((c) => c.stakingRequired));
  const commonCryptos = cards
    .map((c) => new Set(c.cryptos))
    .reduce<Set<string> | null>((acc, s) => {
      if (acc === null) return new Set(s);
      return new Set([...acc].filter((x) => s.has(x)));
    }, null);
  return {
    avgCashbackPremium,
    minFees,
    minStaking,
    commonCryptos: Array.from(commonCryptos ?? []),
  };
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
        {label}
      </div>
      <div className="text-lg font-display font-bold text-white mt-0.5">{value}</div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          {label}
        </label>
        <span className="text-sm font-mono text-cyan-accent">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-accent"
      />
    </div>
  );
}
