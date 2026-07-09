import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import Breadcrumb from '../components/Breadcrumb';
import {
  AlertTriangle,
  ArrowRight,
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

import { THEMATIC_ROUTES } from '../config/routes';
import IndependentNotice from '../components/IndependentNotice';

const YEAR = new Date().getFullYear();

// Bloc éditorial sous le comparateur — enrichit le contenu pour Google
const COMPARE_EDITORIAL: Record<string, { h2: string; body: string; related: string; links: { key: string; emoji: string; label: string }[] }> = {
  fr: {
    h2: 'Comment utiliser notre comparateur de cartes crypto ?',
    body: `Notre comparateur vous permet de filtrer et trier plus de 15 cartes crypto selon vos critères : taux de cashback, frais annuels, staking requis, cryptomonnaies supportées et disponibilité par pays. Sélectionnez jusqu'à deux cartes pour une comparaison détaillée côte à côte, ou utilisez les filtres pour identifier rapidement les cartes qui correspondent à votre profil. Chaque carte est évaluée sur la base de données vérifiées et mises à jour régulièrement. Le tri par score de confiance vous aide à distinguer les émetteurs régulés et établis des nouveaux entrants. Pour aller plus loin, consultez nos avis individuels et notre simulateur de gains qui calcule votre cashback réel en fonction de vos dépenses mensuelles.`,
    related: 'Guides par type de carte',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Meilleures cartes' },
      { key: 'cashback',   emoji: '💰', label: 'Cashback élevé' },
      { key: 'no-fees',    emoji: '🆓', label: 'Sans frais annuels' },
      { key: 'no-staking', emoji: '🔓', label: 'Sans staking' },
      { key: 'travel',     emoji: '✈️', label: 'Cartes voyage' },
    ],
  },
  de: {
    h2: 'Wie nutzt man unseren Krypto-Karten-Vergleich?',
    body: `Unser Vergleichstool ermöglicht es Ihnen, über 15 Krypto-Karten nach Ihren Kriterien zu filtern und zu sortieren: Cashback-Rate, Jahresgebühren, erforderliches Staking, unterstützte Kryptowährungen und Länderverfügbarkeit. Wählen Sie bis zu zwei Karten für einen detaillierten Seite-an-Seite-Vergleich, oder nutzen Sie die Filter, um schnell Karten zu finden, die zu Ihrem Profil passen. Jede Karte wird anhand verifizierter und regelmäßig aktualisierter Daten bewertet. Die Sortierung nach Vertrauensscore hilft Ihnen, regulierte und etablierte Emittenten von Neueinsteigern zu unterscheiden. Für einen tieferen Einblick konsultieren Sie unsere individuellen Bewertungen und unseren Gewinn-Simulator.`,
    related: 'Ratgeber nach Kartentyp',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Beste Karten' },
      { key: 'cashback',   emoji: '💰', label: 'Hoher Cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'Ohne Jahresgebühr' },
      { key: 'no-staking', emoji: '🔓', label: 'Ohne Staking' },
      { key: 'travel',     emoji: '✈️', label: 'Reisekarten' },
    ],
  },
  es: {
    h2: '¿Cómo usar nuestro comparador de tarjetas crypto?',
    body: `Nuestro comparador te permite filtrar y ordenar más de 15 tarjetas crypto según tus criterios: tasa de cashback, comisiones anuales, staking requerido, criptomonedas admitidas y disponibilidad por país. Selecciona hasta dos tarjetas para una comparación detallada lado a lado, o utiliza los filtros para identificar rápidamente las tarjetas que se adaptan a tu perfil. Cada tarjeta se evalúa con datos verificados y actualizados regularmente. La ordenación por puntuación de confianza te ayuda a distinguir los emisores regulados y establecidos de los recién llegados. Para profundizar, consulta nuestras opiniones individuales y nuestro simulador de ganancias.`,
    related: 'Guías por tipo de tarjeta',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Mejores tarjetas' },
      { key: 'cashback',   emoji: '💰', label: 'Alto cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'Sin comisiones' },
      { key: 'no-staking', emoji: '🔓', label: 'Sin staking' },
      { key: 'travel',     emoji: '✈️', label: 'Tarjetas de viaje' },
    ],
  },
  it: {
    h2: 'Come usare il nostro comparatore di carte crypto?',
    body: `Il nostro comparatore ti permette di filtrare e ordinare oltre 15 carte crypto in base ai tuoi criteri: tasso di cashback, costi annuali, staking richiesto, criptovalute supportate e disponibilità per paese. Seleziona fino a due carte per un confronto dettagliato fianco a fianco, o usa i filtri per identificare rapidamente le carte che corrispondono al tuo profilo. Ogni carta viene valutata su dati verificati e aggiornati regolarmente. L'ordinamento per punteggio di fiducia ti aiuta a distinguere gli emittenti regolamentati e consolidati dai nuovi entranti. Per approfondire, consulta le nostre recensioni individuali e il nostro simulatore di guadagni.`,
    related: 'Guide per tipo di carta',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Migliori carte' },
      { key: 'cashback',   emoji: '💰', label: 'Alto cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'Senza costi annuali' },
      { key: 'no-staking', emoji: '🔓', label: 'Senza staking' },
      { key: 'travel',     emoji: '✈️', label: 'Carte viaggio' },
    ],
  },
  en: {
    h2: 'How to use our crypto card comparison tool?',
    body: `Our comparison tool lets you filter and sort 90+ crypto cards by your criteria: cashback rate, annual fees, staking requirements, supported cryptocurrencies and country availability. Select up to two cards for a detailed side-by-side comparison, or use the filters to quickly identify cards that match your profile. Every card is assessed against verified, regularly updated data. Sorting by trust score helps you distinguish regulated and established issuers from newer entrants. To go further, check our individual reviews and our earnings simulator, which calculates your real cashback based on your monthly spending habits.`,
    related: 'Guides by card type',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Best cards' },
      { key: 'cashback',   emoji: '💰', label: 'High cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'No annual fees' },
      { key: 'no-staking', emoji: '🔓', label: 'No staking' },
      { key: 'travel',     emoji: '✈️', label: 'Travel cards' },
    ],
  },
};

const COMPARE_SEO: Record<string, { title: string; desc: string }> = {
  fr: { title: `Comparateur Crypto ${YEAR} — Cashback & Frais | TopCryptoCards`, desc: `Comparez 90+ cartes crypto : cashback, frais annuels, staking. Crypto.com, Nexo, Bybit, Revolut — filtrez en quelques secondes. Gratuit ✓` },
  be: { title: `Comparateur Crypto ${YEAR} — Cashback & Frais | TopCryptoCards`, desc: `Comparez 90+ cartes crypto disponibles en Belgique : cashback, frais, staking. Crypto.com, Nexo, Bybit — filtrez en secondes. Gratuit ✓` },
  de: { title: `Krypto-Karten Vergleich ${YEAR} — Cashback | TopCryptoCards`, desc: `90+ Krypto-Karten vergleichen: Cashback, Jahresgebühren, Staking. Crypto.com, Nexo, Bybit, Revolut und mehr — in Sekunden filtern. Kostenlos ✓` },
  at: { title: `Krypto-Karten Vergleich ${YEAR} — Cashback | TopCryptoCards`, desc: `90+ Krypto-Karten für Österreich: Cashback, Gebühren, Staking. Crypto.com, Nexo, Bybit — in Sekunden filtern. Kostenlos ✓` },
  es: { title: `Comparador Crypto ${YEAR} — Cashback | TopCryptoCards`, desc: `Compara 90+ tarjetas crypto: cashback, comisiones, staking. Crypto.com, Nexo, Bybit, Revolut y más — filtra en segundos. Gratis ✓` },
  it: { title: `Comparatore Carte Crypto ${YEAR} — Cashback | TopCryptoCards`, desc: `Confronta 90+ carte crypto: cashback, commissioni, staking. Crypto.com, Nexo, Bybit, Revolut e altri — filtra in secondi. Gratuito ✓` },
  en: { title: `Crypto Card Comparison ${YEAR} — Cashback | TopCryptoCards`, desc: `Compare 90+ crypto cards: cashback rates, annual fees, staking. Crypto.com, Nexo, Bybit, Revolut — filter in seconds. Free ✓` },
};

const ALL_CRYPTOS = [
  'BTC', 'ETH', 'BNB', 'CRO', 'SOL', 'XRP', 'ADA', 'USDC', 'USDT', 'DOT', 'MATIC', 'AVAX', 'LINK',
];

type ViewMode = 'columns' | 'table';

const DATE_LOCALES: Record<string, string> = {
  fr: 'fr-FR', de: 'de-DE', es: 'es-ES', it: 'it-IT', en: 'en-GB',
};

const COMPARE_PREFIX: Record<string, string> = {
  fr: 'comparer', de: 'vergleichen', es: 'comparar', it: 'confrontare', en: 'compare',
};

const QUICK_COMPARE_LABELS: Record<string, { title: string; hint: string; cardA: string; cardB: string; btn: string; selectHint: string }> = {
  fr: { title: 'Comparer deux cartes en détail', hint: 'Cliquez sur une carte dans la liste pour la sélectionner', cardA: 'Carte A', cardB: 'Carte B', btn: 'Comparer', selectHint: 'ou cliquez sur une carte ci-dessous' },
  de: { title: 'Zwei Karten detailliert vergleichen', hint: 'Klicken Sie auf eine Karte in der Liste, um sie auszuwählen', cardA: 'Karte A', cardB: 'Karte B', btn: 'Vergleichen', selectHint: 'oder klicken Sie unten auf eine Karte' },
  es: { title: 'Comparar dos tarjetas en detalle', hint: 'Haga clic en una tarjeta de la lista para seleccionarla', cardA: 'Tarjeta A', cardB: 'Tarjeta B', btn: 'Comparar', selectHint: 'o haga clic en una tarjeta abajo' },
  it: { title: 'Confronta due carte in dettaglio', hint: 'Fai clic su una carta nell\'elenco per selezionarla', cardA: 'Carta A', cardB: 'Carta B', btn: 'Confronta', selectHint: 'o fai clic su una carta qui sotto' },
  en: { title: 'Compare two cards in detail', hint: 'Click any card in the list to select it', cardA: 'Card A', cardB: 'Card B', btn: 'Compare', selectHint: 'or click a card below' },
};

const COMPARE_ROUTE: Record<string, string> = { fr: 'comparer', de: 'vergleich', es: 'comparar', it: 'confronto', en: 'compare' };

export default function Compare() {
  const { t } = useTranslation('common');
  const lang = useLanguage();
  const compareSeo = COMPARE_SEO[lang] || COMPARE_SEO.en;
  useSeoMeta({ title: compareSeo.title, description: compareSeo.desc, lang });

  // ── Hreflang ─────────────────────────────────────────────────────────────────
  useHreflang(l => COMPARE_ROUTE[l] ? `https://topcryptocards.eu/${l}/${COMPARE_ROUTE[l]}` : null, []);

  // ── Schema.org WebApplication ─────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const RT: Record<string, string> = COMPARE_ROUTE;
    const seg = RT[lang] ?? 'compare';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: compareSeo.title,
      description: compareSeo.desc,
      url: `${BASE}/${lang}/${seg}`,
      inLanguage: lang,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: BASE },
    };
    document.getElementById('schema-compare')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-compare';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-compare')?.remove(); };
  }, [lang, compareSeo]);

  // ── FAQ schema (editorial how-to bloc) ───────────────────────────────────────
  useEffect(() => {
    const ed = COMPARE_EDITORIAL[lang] ?? COMPARE_EDITORIAL.en;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: ed.h2, acceptedAnswer: { '@type': 'Answer', text: ed.body } }],
    };
    document.getElementById('schema-compare-faq')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-compare-faq'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-compare-faq')?.remove(); };
  }, [lang]);

  // ── BreadcrumbList schema ────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const RT: Record<string, string> = { fr: 'comparer', de: 'vergleich', es: 'comparar', it: 'confronto', en: 'compare' };
    const labels: Record<string, [string, string]> = {
      fr: ['Accueil', 'Comparer'], de: ['Startseite', 'Vergleich'], es: ['Inicio', 'Comparar'], it: ['Home', 'Confronto'], en: ['Home', 'Compare'],
    };
    const [homeL, pageL] = labels[lang] ?? labels.en;
    const seg = RT[lang] ?? 'compare';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeL, item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: pageL, item: `${BASE}/${lang}/${seg}` },
      ],
    };
    document.getElementById('schema-compare-breadcrumb')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-compare-breadcrumb'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-compare-breadcrumb')?.remove(); };
  }, [lang]);

  const navigate = useNavigate();
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

  // Quick Compare state
  const [quickA, setQuickA] = useState('');
  const [quickB, setQuickB] = useState('');

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

  const doNavigate = (a: string, b: string) => {
    const prefix = COMPARE_PREFIX[lang] ?? 'compare';
    navigate(`/${lang}/${prefix}/${a}-vs-${b}`);
  };

  const handleQuickCompare = () => {
    if (!quickA || !quickB || quickA === quickB) return;
    doNavigate(quickA, quickB);
  };

  // Click on a card in the table: first click → A, second click → B + navigate
  const handleCardClick = (id: string) => {
    if (id === quickA) {
      // Deselect A, promote B to A if set
      setQuickA(quickB);
      setQuickB('');
    } else if (id === quickB) {
      // Deselect B
      setQuickB('');
    } else if (quickA === '') {
      // Nothing selected → set as A
      setQuickA(id);
    } else if (quickB === '') {
      // A already set → set as B and navigate
      setQuickB(id);
      doNavigate(quickA, id);
    } else {
      // Both set → replace A, clear B
      setQuickA(id);
      setQuickB('');
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
      if (franceOnly && !c.markets.includes(lang)) return false;
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
                {t('compare_custom_title')}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                {selectedCards.length}{' '}
                {selectedCards.length > 1 ? t('compare_cards_count_plural') : t('compare_cards_count')}{' '}
                {t('compare_cards_face')}
              </h1>
              <p className="text-slate-400 max-w-2xl text-sm">
                {t('compare_custom_desc')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/" className="btn-ghost text-sm">
                <Plus className="w-4 h-4" />
                {t('compare_add_cards')}
              </Link>
              <button onClick={copyShareLink} className="btn-secondary text-sm">
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? t('compare_link_copied') : t('compare_share')}
              </button>
              <button onClick={exitSelectionMode} className="btn-secondary text-sm">
                <X className="w-4 h-4" />
                {t('compare_view_all')}
              </button>
            </div>
          </div>

          {missing.length > 0 && (
            <div className="card-surface border-amber-400/40 bg-amber-400/5 p-3 flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-200">
                {missing.length}{' '}
                {missing.length > 1
                  ? `${t('compare_cards_count_plural')} ${t('compare_missing_cards_plural')}`
                  : `${t('compare_cards_count')} ${t('compare_missing_cards')}`}
                <span className="text-slate-400"> ({missing.join(', ')})</span>
              </div>
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label={t('compare_stat_avg_cashback')} value={`${stats.avgCashbackPremium.toFixed(2)} %`} />
              <StatCard label={t('compare_stat_min_fees')} value={stats.minFees === 0 ? t('compare_stat_free') : `${stats.minFees} €`} />
              <StatCard label={t('compare_stat_min_staking')} value={stats.minStaking === 0 ? t('compare_stat_none') : `${stats.minStaking} €`} />
              <StatCard label={t('compare_stat_common_cryptos')} value={`${stats.commonCryptos.length}`} />
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
              {t('compare_recent')}
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
                      <div className="text-xs text-slate-400 mb-1">
                        {new Date(s.createdAt).toLocaleDateString(DATE_LOCALES[lang] ?? 'fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-sm text-slate-200 line-clamp-2">
                        {names.join(' · ') || `${s.cardIds.length} ${t('compare_cards_count_plural')}`}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-accent">
                        <LinkIcon className="w-3 h-3" />
                        {t('compare_reopen')}
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

  const qcLabels = QUICK_COMPARE_LABELS[lang] ?? QUICK_COMPARE_LABELS.en;
  const sortedForSelect = [...allCards].sort((a, b) => (b.trustScore ?? 0) - (a.trustScore ?? 0));
  const cardAName = allCards.find((c) => c.id === quickA)?.name;
  const cardBName = allCards.find((c) => c.id === quickB)?.name;

  const compareBreadcrumb: Record<string, string> = { fr: 'Comparer', de: 'Vergleich', es: 'Comparar', it: 'Confronto', en: 'Compare' };
  const homeBreadcrumb: Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };

  return (
    <div className="container-app py-10">
      <Breadcrumb items={[
        { label: homeBreadcrumb[lang] ?? 'Home', href: `/${lang}` },
        { label: compareBreadcrumb[lang] ?? 'Compare' },
      ]} />
      <header className="mb-8 mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('compare_title')}</h1>
          <p className="text-slate-400 max-w-2xl">
            {t('compare_desc')}
          </p>
          <div className="mt-2">
            <IndependentNotice />
          </div>
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
              {t('compare_view_table')}
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
              title={compareSelection.length < 2 ? t('compare_view_min_2') : undefined}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {t('compare_view_side')}
            </button>
          </div>
        </div>
      </header>

      {/* ── Quick Compare ── */}
      <div className="card-surface p-5 mb-6 border-cyan-accent/20">
        <div className="text-xs font-semibold uppercase tracking-wider text-cyan-accent mb-1 flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5" />
          {qcLabels.title}
        </div>
        <p className="text-xs text-slate-400 mb-4">{qcLabels.hint}</p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Slot A */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-accent flex items-center justify-center text-bg text-[10px] font-bold z-10">
              A
            </div>
            <select
              value={quickA}
              onChange={(e) => setQuickA(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">{qcLabels.cardA}</option>
              {sortedForSelect.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === quickB}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 font-semibold text-sm hidden sm:block">VS</span>

          {/* Slot B */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-accent flex items-center justify-center text-bg text-[10px] font-bold z-10">
              B
            </div>
            <select
              value={quickB}
              onChange={(e) => setQuickB(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">{qcLabels.cardB}</option>
              {sortedForSelect.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === quickA}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleQuickCompare}
            disabled={!quickA || !quickB || quickA === quickB}
            className="btn-primary text-sm whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {qcLabels.btn}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Live selection status */}
        {(quickA || quickB) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            {quickA && (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-400">
                <span className="w-4 h-4 rounded-full bg-cyan-accent text-bg text-[9px] font-bold flex items-center justify-center">A</span>
                {cardAName}
                <button onClick={() => setQuickA('')} className="text-cyan-400/60 hover:text-cyan-400 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {quickA && !quickB && (
              <span className="text-slate-400 italic">{qcLabels.selectHint}</span>
            )}
            {quickB && (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-accent/10 border border-green-accent/30 text-green-400">
                <span className="w-4 h-4 rounded-full bg-green-accent text-bg text-[9px] font-bold flex items-center justify-center">B</span>
                {cardBName}
                <button onClick={() => setQuickB('')} className="text-green-400/60 hover:text-green-400 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="card-surface p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('compare_search_placeholder')}
              className="input-field"
            />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`btn-secondary text-sm ${filtersActive ? 'border-cyan-accent/60 text-white' : ''}`}
            aria-expanded={filtersOpen}
          >
            {t('compare_filters_btn')} {filtersActive && <span className="badge-accent ml-1">{t('compare_filters_active')}</span>}
          </button>
          {filtersActive && (
            <button onClick={resetFilters} className="btn-ghost text-sm">
              <X className="w-4 h-4" />
              {t('compare_filters_reset')}
            </button>
          )}
          <div className="text-sm text-slate-400 ml-auto">
            {sortedTable.length}{' '}
            {sortedTable.length > 1 ? t('compare_cards_count_plural') : t('compare_cards_count')}
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-5 pt-5 border-t border-bg-border grid md:grid-cols-3 gap-5">
            <SliderControl
              label={t('compare_filter_cashback_min')}
              value={minCashback}
              min={0}
              max={5}
              step={0.1}
              suffix=" %"
              onChange={setMinCashback}
            />
            <SliderControl
              label={t('compare_filter_fees_max')}
              value={maxFees}
              min={0}
              max={600}
              step={10}
              suffix=" €"
              onChange={setMaxFees}
            />
            <SliderControl
              label={t('compare_filter_staking_max')}
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
              {t('compare_filter_france')}
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={freeWdOnly}
                onChange={(e) => setFreeWdOnly(e.target.checked)}
                className="w-4 h-4 accent-cyan-accent"
              />
              {t('compare_filter_free_wd')}
            </label>
            <div className="md:col-span-3">
              <div className="text-xs text-slate-400 mb-1.5">{t('compare_filter_cryptos')}</div>
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
          onCardClick={handleCardClick}
          quickSelectA={quickA}
          quickSelectB={quickB}
        />
      )}

      {/* Bloc éditorial — thin content fix */}
      {(() => {
        const ed = COMPARE_EDITORIAL[lang] ?? COMPARE_EDITORIAL.en;
        return (
          <div className="mt-14 border-t border-bg-border pt-10">
            <h2 className="text-xl font-display font-bold text-white mb-4">{ed.h2}</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mb-8">{ed.body}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{ed.related}</p>
            <div className="flex flex-wrap gap-2">
              {ed.links.map(({ key, emoji, label }) => {
                const slug = THEMATIC_ROUTES[key]?.[lang as keyof typeof THEMATIC_ROUTES['best']] ?? THEMATIC_ROUTES[key]?.en;
                if (!slug) return null;
                return (
                  <Link key={key} to={`/${lang}/${slug}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
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
      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
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
