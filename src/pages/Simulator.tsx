import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, ChevronDown, ChevronRight, ExternalLink, Info, TrendingUp, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import type { SimulatorSpending } from '../types/card';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR } from '../utils/format';
import { THEMATIC_ROUTES } from '../config/routes';

const YEAR = new Date().getFullYear();
const SIM_SEO: Record<string, { title: string; desc: string }> = {
  fr: { title: `Simulateur de Gains Cartes Crypto ${YEAR} | TopCryptoCards`, desc: `Calculez vos gains annuels avec chaque carte crypto selon vos dépenses. Crypto.com, Nexo, Bybit, Binance comparés en temps réel. Gratuit ✓` },
  de: { title: `Krypto Karten Gewinn-Simulator ${YEAR} | TopCryptoCards`, desc: `Berechnen Sie Ihre jährlichen Gewinne mit jeder Krypto-Karte: Crypto.com, Nexo, Bybit, Binance. Ausgaben eingeben — Ergebnis sofort sehen. Kostenlos ✓` },
  es: { title: `Simulador de Ganancias Tarjetas Crypto ${YEAR} | TopCryptoCards`, desc: `Calcula tus ganancias anuales con cada tarjeta crypto: Crypto.com, Nexo, Bybit, Binance. Introduce tus gastos, ve el resultado en segundos. Gratis ✓` },
  it: { title: `Simulatore di Guadagni Carte Crypto ${YEAR} | TopCryptoCards`, desc: `Calcola i tuoi guadagni annuali con ogni carta crypto: Crypto.com, Nexo, Bybit, Binance. Inserisci le spese, vedi il risultato in secondi. Gratuito ✓` },
  en: { title: `Crypto Card Earnings Simulator ${YEAR} | TopCryptoCards`, desc: `Calculate your annual earnings with each crypto card: Crypto.com, Nexo, Bybit, Binance. Enter your spending — see results instantly. Free ✓` },
};

const SIM_EDITORIAL: Record<string, { h2: string; body: string; related: string; links: { key: string; emoji: string; label: string }[] }> = {
  fr: {
    h2: 'Comment utiliser notre simulateur de gains crypto ?',
    body: `Notre simulateur de cashback crypto vous permet de comparer en temps réel les gains annuels de plus de 20 cartes crypto selon vos habitudes de dépenses. Renseignez vos dépenses mensuelles par catégorie — alimentation, transport, voyages, restaurants, abonnements — et l'outil calcule automatiquement les récompenses nettes en tenant compte des frais annuels et des exigences de staking. Deux modes sont disponibles : "Base" (conditions standard sans staking) et "Optimiste" (avec staking activé pour débloquer les meilleurs taux). Les résultats sont triés par gain net annuel estimé, ce qui vous évite les comparaisons laborieuses. Retrouvez aussi nos avis complets et notre comparateur pour affiner votre choix.`,
    related: 'Guides thématiques',
    links: [
      { key: 'best', emoji: '🏆', label: 'Meilleures cartes crypto' },
      { key: 'cashback', emoji: '💰', label: 'Cartes avec cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Sans frais annuels' },
      { key: 'travel', emoji: '✈️', label: 'Cartes voyage' },
      { key: 'no-staking', emoji: '🔓', label: 'Sans staking requis' },
    ],
  },
  de: {
    h2: 'Wie nutzen Sie unseren Krypto-Gewinn-Simulator?',
    body: `Unser Krypto-Cashback-Simulator vergleicht in Echtzeit die jährlichen Gewinne von über 20 Krypto-Karten basierend auf Ihren Ausgabengewohnheiten. Geben Sie Ihre monatlichen Ausgaben nach Kategorien ein — Lebensmittel, Transport, Reisen, Restaurants, Abonnements — und das Tool berechnet automatisch die Nettorewards unter Berücksichtigung von Jahresgebühren und Staking-Anforderungen. Zwei Modi stehen zur Verfügung: "Basis" (Standardbedingungen ohne Staking) und "Optimistisch" (mit aktiviertem Staking für die besten Tarife). Die Ergebnisse werden nach geschätztem jährlichem Nettogewinn sortiert. Nutzen Sie auch unsere vollständigen Bewertungen und den Vergleich, um Ihre Wahl zu verfeinern.`,
    related: 'Thematische Guides',
    links: [
      { key: 'best', emoji: '🏆', label: 'Beste Krypto-Karten' },
      { key: 'cashback', emoji: '💰', label: 'Karten mit Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Ohne Jahresgebühren' },
      { key: 'travel', emoji: '✈️', label: 'Reisekarten' },
      { key: 'no-staking', emoji: '🔓', label: 'Ohne Staking-Pflicht' },
    ],
  },
  es: {
    h2: '¿Cómo usar nuestro simulador de ganancias crypto?',
    body: `Nuestro simulador de cashback crypto compara en tiempo real las ganancias anuales de más de 20 tarjetas crypto según tus hábitos de gasto. Introduce tus gastos mensuales por categoría — alimentación, transporte, viajes, restaurantes, suscripciones — y la herramienta calcula automáticamente las recompensas netas teniendo en cuenta las comisiones anuales y los requisitos de staking. Hay dos modos disponibles: "Base" (condiciones estándar sin staking) y "Optimista" (con staking activado para desbloquear las mejores tasas). Los resultados se ordenan por ganancia neta anual estimada. Consulta también nuestros análisis completos y el comparador para afinar tu elección.`,
    related: 'Guías temáticas',
    links: [
      { key: 'best', emoji: '🏆', label: 'Mejores tarjetas crypto' },
      { key: 'cashback', emoji: '💰', label: 'Tarjetas con cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Sin comisiones anuales' },
      { key: 'travel', emoji: '✈️', label: 'Tarjetas de viaje' },
      { key: 'no-staking', emoji: '🔓', label: 'Sin staking requerido' },
    ],
  },
  it: {
    h2: 'Come usare il nostro simulatore di guadagni crypto?',
    body: `Il nostro simulatore di cashback crypto confronta in tempo reale i guadagni annuali di oltre 20 carte crypto in base alle tue abitudini di spesa. Inserisci le tue spese mensili per categoria — alimentari, trasporti, viaggi, ristoranti, abbonamenti — e lo strumento calcola automaticamente i premi netti tenendo conto delle commissioni annuali e dei requisiti di staking. Sono disponibili due modalità: "Base" (condizioni standard senza staking) e "Ottimistica" (con staking attivato per sbloccare le tariffe migliori). I risultati sono ordinati per guadagno netto annuale stimato. Consulta anche le nostre recensioni complete e il comparatore per affinare la tua scelta.`,
    related: 'Guide tematiche',
    links: [
      { key: 'best', emoji: '🏆', label: 'Migliori carte crypto' },
      { key: 'cashback', emoji: '💰', label: 'Carte con cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Senza commissioni annuali' },
      { key: 'travel', emoji: '✈️', label: 'Carte viaggio' },
      { key: 'no-staking', emoji: '🔓', label: 'Senza staking richiesto' },
    ],
  },
  en: {
    h2: 'How to use our crypto earnings simulator?',
    body: `Our crypto cashback simulator compares in real time the annual earnings of over 20 crypto cards based on your spending habits. Enter your monthly spending by category — groceries, transport, travel, restaurants, subscriptions — and the tool automatically calculates net rewards taking into account annual fees and staking requirements. Two modes are available: "Base" (standard conditions without staking) and "Optimistic" (with staking enabled to unlock the best rates). Results are sorted by estimated annual net gain, saving you tedious manual comparisons. Also check our full reviews and comparison tool to narrow down your choice.`,
    related: 'Thematic guides',
    links: [
      { key: 'best', emoji: '🏆', label: 'Best crypto cards' },
      { key: 'cashback', emoji: '💰', label: 'Cashback cards' },
      { key: 'no-fees', emoji: '🚫', label: 'No annual fees' },
      { key: 'travel', emoji: '✈️', label: 'Travel cards' },
      { key: 'no-staking', emoji: '🔓', label: 'No staking required' },
    ],
  },
};

type SimMode = 'base' | 'optimistic';

function loadMode(): SimMode {
  try {
    const v = localStorage.getItem('ccc_sim_mode');
    if (v === 'base' || v === 'optimistic') return v;
  } catch {
    // ignore
  }
  return 'base';
}

type ChartEntry = {
  name: string;
  net: number;
  issuer: string;
  stakingMet: boolean;
  bestCategoryLabel: string | null;
};

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ payload: ChartEntry }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div style={{ background: '#111624', border: '1px solid #1F2739', borderRadius: 8, padding: '10px 14px', color: '#fff' }}>
      <div className="font-semibold text-sm">{label}</div>
      <div className="font-mono text-green-400 mt-1">{fmtEUR(item.net)}</div>
      {item.bestCategoryLabel && (
        <div className="flex items-center gap-1 text-amber-300 text-xs mt-1.5">
          <Zap className="w-3 h-3" />
          <span>{item.bestCategoryLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function Simulator() {
  const { t } = useTranslation('common');
  const lang = useLanguage();
  const simSeo = SIM_SEO[lang] || SIM_SEO.en;
  useSeoMeta({ title: simSeo.title, description: simSeo.desc, lang });

  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const SIM_SLUGS: Record<string, string> = { fr: 'simulateur', de: 'simulator', es: 'simulador', it: 'simulatore', en: 'simulator' };
    document.querySelectorAll('link[data-hreflang-simulator]').forEach(el => el.remove());
    Object.entries(SIM_SLUGS).forEach(([l, slug]) => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'alternate');
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/${slug}`);
      el.setAttribute('data-hreflang-simulator', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.setAttribute('rel', 'alternate');
    xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/simulateur`);
    xd.setAttribute('data-hreflang-simulator', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-simulator]').forEach(el => el.remove()); };
  }, [lang]);

  // ── Schema.org SoftwareApplication ───────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const SIM_SLUGS: Record<string, string> = { fr: 'simulateur', de: 'simulator', es: 'simulador', it: 'simulatore', en: 'simulator' };
    const seg = SIM_SLUGS[lang] ?? 'simulator';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: simSeo.title,
      description: simSeo.desc,
      url: `${BASE}/${lang}/${seg}`,
      inLanguage: lang,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: BASE },
    };
    document.getElementById('schema-simulator')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-simulator';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-simulator')?.remove(); };
  }, [lang, simSeo]);

  const cards = useAppStore((s) => s.cards);
  const spending = useAppStore((s) => s.spending);
  const setSpending = useAppStore((s) => s.setSpending);
  const stakingBudget = useAppStore((s) => s.stakingBudget);
  const setStakingBudget = useAppStore((s) => s.setStakingBudget);

  const [simMode, setSimMode] = useState<SimMode>(loadMode);

  const handleModeChange = (mode: SimMode) => {
    setSimMode(mode);
    try { localStorage.setItem('ccc_sim_mode', mode); } catch { /* ignore */ }
  };

  const CATEGORIES: { key: keyof SimulatorSpending; label: string; hint: string; badgeLabel: string }[] = [
    { key: 'online', label: t('sim_cat_online'), hint: t('sim_cat_online_hint'), badgeLabel: t('sim_cat_online_badge') },
    { key: 'restaurants', label: t('sim_cat_restaurants'), hint: t('sim_cat_restaurants_hint'), badgeLabel: t('sim_cat_restaurants_badge') },
    { key: 'travel', label: t('sim_cat_travel'), hint: t('sim_cat_travel_hint'), badgeLabel: t('sim_cat_travel_badge') },
    { key: 'streaming', label: t('sim_cat_streaming'), hint: t('sim_cat_streaming_hint'), badgeLabel: t('sim_cat_streaming_badge') },
    { key: 'transport', label: t('sim_cat_transport'), hint: t('sim_cat_transport_hint'), badgeLabel: t('sim_cat_transport_badge') },
    { key: 'supermarket', label: t('sim_cat_supermarket'), hint: t('sim_cat_supermarket_hint'), badgeLabel: t('sim_cat_supermarket_badge') },
    { key: 'misc', label: t('sim_cat_misc'), hint: t('sim_cat_misc_hint'), badgeLabel: t('sim_cat_misc_badge') },
  ];

  const monthlyTotal = useMemo(
    () => Object.values(spending).reduce((a, b) => a + b, 0),
    [spending]
  );
  const yearly = monthlyTotal * 12;

  const results = useMemo(() => {
    // Annual spending per category
    const annualByCategory = (Object.keys(spending) as (keyof SimulatorSpending)[]).reduce(
      (acc, k) => ({ ...acc, [k]: spending[k] * 12 }),
      {} as Record<keyof SimulatorSpending, number>
    );

    return cards
      .map((c) => {
        const stakingMet = c.stakingRequired <= stakingBudget;
        const rates = c.categoryRates ?? {};

        // Default flat rate when no specific category rate is set
        const defaultRate = stakingMet
          ? (simMode === 'optimistic' ? c.cashbackPremium : c.cashbackBase)
          : c.cashbackNoStaking;

        // Per-category calculation
        const rewards = (Object.entries(annualByCategory) as [keyof SimulatorSpending, number][]).reduce(
          (sum, [cat, amount]) => {
            // Category rates only apply when staking is met; otherwise use default (noStaking)
            const catRate = (stakingMet ? (rates[cat] ?? defaultRate) : defaultRate) / 100;
            return sum + amount * catRate;
          },
          0
        );

        const effectiveRate = yearly > 0 ? (rewards / yearly) * 100 : defaultRate;
        const net = rewards - c.annualFees;
        const ratePenalized = !stakingMet && c.cashbackNoStaking < c.cashbackBase;

        // Find the category where this card provides the biggest boost over its default rate
        let bestCategory: keyof SimulatorSpending | null = null;
        let bestBoostValue = 0;
        if (stakingMet && Object.keys(rates).length > 0) {
          for (const [cat, amount] of Object.entries(annualByCategory) as [keyof SimulatorSpending, number][]) {
            const catRate = rates[cat];
            if (catRate !== undefined && catRate > defaultRate) {
              const boostValue = (catRate - defaultRate) * (amount / 100);
              if (boostValue > bestBoostValue) {
                bestBoostValue = boostValue;
                bestCategory = cat;
              }
            }
          }
          // Only show badge when boost is meaningful (> €1/year)
          if (bestBoostValue < 1) bestCategory = null;
        }

        // Rate is "custom" when any category deviates from default
        const hasCustomRates = stakingMet && Object.keys(rates).some(
          (cat) => rates[cat as keyof typeof rates] !== undefined && rates[cat as keyof typeof rates] !== defaultRate
        );

        return { card: c, rewards, net, effectiveRate, stakingMet, ratePenalized, bestCategory, hasCustomRates };
      })
      .sort((a, b) => {
        const diff = b.net - a.net;
        if (Math.abs(diff) > 0.01) return diff;
        const premiumDiff = b.card.cashbackPremium - a.card.cashbackPremium;
        if (Math.abs(premiumDiff) > 0.001) return premiumDiff;
        if (a.card.freeWithdrawals !== b.card.freeWithdrawals) {
          return a.card.freeWithdrawals ? -1 : 1;
        }
        return a.card.stakingRequired - b.card.stakingRequired;
      });
  }, [cards, spending, yearly, stakingBudget, simMode]);

  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';

  // ── Phase 4: group results by brand ──────────────────────────────────────
  const brandedResults = useMemo(() => {
    const groups = new Map<string, typeof results>();
    for (const r of results) {
      const key = r.card.brandId ?? `__single__${r.card.id}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }
    return Array.from(groups.entries())
      .map(([key, rows]) => {
        // Best tier = highest net gain among tiers the user can afford
        const affordable = rows.filter((r) => r.stakingMet);
        const primary = affordable[0] ?? rows[0];
        return {
          primary,
          allTiers: rows,
          isBrand: !key.startsWith('__single__'),
          brandId: key.startsWith('__single__') ? null : (rows[0].card.brandId ?? null),
          tierCount: rows.length,
        };
      })
      .sort((a, b) => b.primary.net - a.primary.net);
  }, [results]);

  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const toggleBrand = (key: string) =>
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const top5: ChartEntry[] = brandedResults.slice(0, 5).map(({ primary: r }) => ({
    name: r.card.tierLabel
      ? `${r.card.issuer} · ${r.card.tierLabel}`
      : r.card.name,
    net: Math.round(r.net),
    issuer: r.card.issuer,
    stakingMet: r.stakingMet,
    bestCategoryLabel: r.bestCategory
      ? (CATEGORIES.find((c) => c.key === r.bestCategory)?.badgeLabel ?? null)
      : null,
  }));

  const best = brandedResults[0]?.primary;

  return (
    <div className="container-app py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t('sim_title')}
        </h1>
        <p className="text-slate-400 max-w-2xl">
          {t('sim_desc')}
        </p>
      </header>

      {/* Mode toggle */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-sm font-medium text-slate-300 shrink-0">{t('sim_mode_label')}</span>
        <div className="flex rounded-lg border border-bg-border overflow-hidden shrink-0">
          <button
            onClick={() => handleModeChange('base')}
            className={`px-4 py-2.5 text-sm font-semibold transition-all min-h-[44px] ${
              simMode === 'base'
                ? 'bg-cyan-accent/15 text-cyan-accent border-r border-cyan-accent/30'
                : 'bg-bg-elevated text-slate-400 border-r border-bg-border hover:text-white'
            }`}
          >
            {t('sim_mode_base')}
          </button>
          <button
            onClick={() => handleModeChange('optimistic')}
            className={`px-4 py-2.5 text-sm font-semibold transition-all min-h-[44px] ${
              simMode === 'optimistic'
                ? 'bg-amber-500/15 text-amber-400'
                : 'bg-bg-elevated text-slate-400 hover:text-white'
            }`}
          >
            {t('sim_mode_optimistic')}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {simMode === 'base' ? t('sim_mode_info_base') : t('sim_mode_info_optimistic')}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-2">
          <div className="card-surface p-6">
            <h2 className="text-lg font-display font-semibold text-white mb-4">
              {t('sim_spending_title')}
            </h2>
            <div className="space-y-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.key}>
                  <label className="flex justify-between text-sm text-slate-300 mb-1.5">
                    <span>
                      {cat.label}
                      <span className="text-xs text-slate-500 ml-2">{cat.hint}</span>
                    </span>
                    <span className="font-mono text-cyan-accent">
                      {fmtEUR(spending[cat.key])}
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={10}
                      value={spending[cat.key]}
                      onChange={(e) =>
                        setSpending({ [cat.key]: parseInt(e.target.value) } as Partial<SimulatorSpending>)
                      }
                      className="flex-1 accent-cyan-accent"
                    />
                    <input
                      type="number"
                      min={0}
                      value={spending[cat.key]}
                      onChange={(e) =>
                        setSpending({
                          [cat.key]: Math.max(0, parseInt(e.target.value) || 0),
                        } as Partial<SimulatorSpending>)
                      }
                      className="input-field w-20 sm:w-24 text-right font-mono text-sm py-1 min-w-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-bg-border">
              <label className="flex justify-between text-sm text-slate-300 mb-1.5">
                <span>
                  {t('sim_staking_budget_label')}
                  <span className="text-xs text-slate-500 ml-2">{t('sim_staking_budget_hint')}</span>
                </span>
                <span className="font-mono text-amber-400">
                  {fmtEUR(stakingBudget)}
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={stakingBudget}
                  onChange={(e) => setStakingBudget(parseInt(e.target.value))}
                  className="flex-1 accent-amber-400"
                />
                <input
                  type="number"
                  min={0}
                  value={stakingBudget}
                  onChange={(e) =>
                    setStakingBudget(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="input-field w-24 text-right font-mono text-sm py-1"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-bg-border grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">{t('sim_monthly')}</div>
                <div className="text-2xl font-display font-bold text-white">
                  {fmtEUR(monthlyTotal)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">{t('sim_yearly')}</div>
                <div className="text-2xl font-display font-bold text-cyan-accent">
                  {fmtEUR(yearly)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-3 space-y-6">
          {best && (
            <div className="card-surface p-6 bg-gradient-to-br from-cyan-accent/5 to-green-accent/5 border-green-accent/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-green-accent mb-3">
                <TrendingUp className="w-4 h-4" />
                {t('sim_best_card')}
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <SmartCardImage card={best.card} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-display font-bold text-xl text-white">
                      {best.card.name}
                    </div>
                    {best.bestCategory && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                        <Zap className="w-3 h-3" />
                        {CATEGORIES.find((c) => c.key === best.bestCategory)?.badgeLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400 mb-3">{best.card.issuer}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t('sim_best_desc_pre')} {fmtEUR(monthlyTotal)} {t('sim_best_desc_mid')}{' '}
                    <strong className="text-white">{best.card.name}</strong> {t('sim_best_desc_post')}{' '}
                    <strong className="text-green-accent">{fmtEUR(best.net)}</strong> {t('sim_best_desc_net')} ({fmtEUR(best.card.annualFees)}).
                  </p>
                  {simMode === 'base' && best.card.cashbackPremium > best.effectiveRate && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 px-3 py-2 text-xs text-cyan-300">
                      <Zap className="w-4 h-4 shrink-0 mt-0.5 text-cyan-accent" />
                      <span>
                        {t('sim_premium_hint_pre')}{' '}
                        <strong className="text-white">{best.card.cashbackPremium}%</strong>{' '}
                        {t('sim_premium_hint_post')}{' '}
                        <strong className="text-amber-300">{fmtEUR(best.card.stakingRequired)}</strong>
                      </span>
                    </div>
                  )}
                  {simMode === 'optimistic' && best.stakingMet && best.card.cashbackBase < best.effectiveRate && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-300">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>{t('sim_mode_info_optimistic')}</span>
                    </div>
                  )}
                  {best.card.stakingRequired > 0 && !best.stakingMet && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>
                        {t('sim_staking_warning_pre')}{' '}
                        <strong className="text-amber-200">{fmtEUR(best.card.stakingRequired)}</strong>{' '}
                        {t('sim_staking_warning_post')}
                      </span>
                    </div>
                  )}
                  {best.card.stakingRequired > 0 && best.stakingMet && (
                    <div className="mt-2 text-xs text-slate-500">
                      {t('sim_best_staking')} {fmtEUR(best.card.stakingRequired)} {t('sim_best_staking_post')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {top5.length > 0 && (
            <div className="card-surface p-6">
              <h2 className="text-lg font-display font-semibold text-white mb-4">
                {t('sim_top5_title')}
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top5} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#1F2739" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#1F2739' }}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#1F2739' }}
                      tickFormatter={(v) => `${v}€`}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                    <Bar dataKey="net" radius={[6, 6, 0, 0]}>
                      {top5.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? '#00FF85' : '#00D4FF'} opacity={1 - i * 0.12} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="card-surface overflow-hidden">
            <div className="p-5 border-b border-bg-border">
              <h2 className="text-lg font-display font-semibold text-white">
                {t('sim_table_title')}
              </h2>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="bg-bg-elevated/50 border-b border-bg-border">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_card')}
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">
                      Tier
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_staking')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_rate')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">
                      {t('sim_col_cashback')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">
                      {t('sim_col_fees')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_net')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brandedResults.map(({ primary: r, allTiers, isBrand, brandId, tierCount }, i) => {
                    const expandKey = brandId ?? r.card.id;
                    const isExpanded = expandedBrands.has(expandKey);
                    const hasMoreTiers = isBrand && tierCount > 1;

                    return (
                      <>
                        {/* ── Primary row (best tier) ─────────────────── */}
                        <tr
                          key={r.card.id}
                          className={`border-b border-bg-border hover:bg-bg-elevated/30 ${
                            i === 0 ? 'bg-green-accent/3' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-slate-500 font-mono w-5">#{i + 1}</span>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-medium text-white">{r.card.issuer}</span>
                                  {i === 0 && <span className="badge-best">{t('sim_badge_best')}</span>}
                                  {r.bestCategory && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                                      <Zap className="w-2.5 h-2.5" />
                                      {CATEGORIES.find((c) => c.key === r.bestCategory)?.badgeLabel}
                                    </span>
                                  )}
                                </div>
                                {simMode === 'base' && r.card.cashbackPremium > r.effectiveRate && (
                                  <div className="mt-0.5 text-xs text-slate-500">
                                    {t('sim_potential_prefix')}{' '}
                                    <span className="text-amber-400/80">{r.card.cashbackPremium}%</span>
                                    {' '}{t('sim_potential_suffix')}
                                  </div>
                                )}
                              </div>
                              {/* Brand page link */}
                              {brandId && (
                                <Link
                                  to={`/${lang}/${brandsSlug}/${brandId}`}
                                  className="text-slate-500 hover:text-cyan-accent transition-colors"
                                  title={t('see_all_tiers_tooltip')}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </td>

                          {/* Tier label */}
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5">
                              {r.card.tierLabel && (
                                <span className="text-xs text-cyan-accent/80 font-medium">
                                  {r.card.tierLabel}
                                </span>
                              )}
                              {hasMoreTiers && (
                                <button
                                  onClick={() => toggleBrand(expandKey)}
                                  className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-white border border-bg-border rounded px-1.5 py-0.5 transition-colors"
                                >
                                  {isExpanded ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                  {tierCount} tiers
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-right">
                            {r.card.stakingRequired === 0 ? (
                              <span className="text-slate-500">—</span>
                            ) : (
                              <span className={`inline-flex items-center gap-1 text-xs font-mono ${r.stakingMet ? 'text-green-accent' : 'text-amber-400'}`}>
                                {!r.stakingMet && <AlertTriangle className="w-3 h-3" />}
                                {fmtEUR(r.card.stakingRequired)}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <span
                              className={`font-mono text-sm font-semibold ${r.ratePenalized ? 'text-amber-400' : 'text-slate-200'}`}
                              title={r.hasCustomRates ? t('sim_rate_weighted_tooltip') : undefined}
                            >
                              {r.hasCustomRates ? '~' : ''}{r.effectiveRate.toFixed(1)}%
                            </span>
                            {r.ratePenalized && (
                              <div className="text-xs text-slate-500">
                                ({r.card.cashbackBase}% {t('sim_rate_with_staking')})
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 text-right font-mono text-slate-300 hidden md:table-cell">
                            {fmtEUR(r.rewards)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-400 hidden md:table-cell">
                            {r.card.annualFees === 0 ? '—' : fmtEUR(r.card.annualFees)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-green-accent">
                            {fmtEUR(r.net)}
                          </td>
                        </tr>

                        {/* ── Expanded: other tiers ───────────────────── */}
                        {isExpanded && allTiers
                          .filter((t2) => t2.card.id !== r.card.id)
                          .map((t2) => (
                            <tr
                              key={t2.card.id}
                              className="border-b border-bg-border/50 bg-bg-elevated/20 text-slate-400"
                            >
                              <td className="pl-10 pr-4 py-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-slate-600">↳</span>
                                  <span className="text-xs">{t2.card.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2 hidden sm:table-cell">
                                <span className="text-xs text-slate-500">{t2.card.tierLabel ?? '—'}</span>
                              </td>
                              <td className="px-4 py-2 text-right">
                                {t2.card.stakingRequired === 0 ? (
                                  <span className="text-slate-600 text-xs">—</span>
                                ) : (
                                  <span className={`text-xs font-mono ${t2.stakingMet ? 'text-green-accent/60' : 'text-amber-400/60'}`}>
                                    {!t2.stakingMet && <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />}
                                    {fmtEUR(t2.card.stakingRequired)}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <span className="text-xs font-mono text-slate-400">
                                  {t2.effectiveRate.toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right text-xs font-mono hidden md:table-cell">
                                {fmtEUR(t2.rewards)}
                              </td>
                              <td className="px-4 py-2 text-right text-xs font-mono hidden md:table-cell">
                                {t2.card.annualFees === 0 ? '—' : fmtEUR(t2.card.annualFees)}
                              </td>
                              <td className="px-4 py-2 text-right text-xs font-mono text-slate-300">
                                {fmtEUR(t2.net)}
                              </td>
                            </tr>
                          ))}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-500 p-4">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{t('sim_disclaimer')}</p>
          </div>
        </section>

        {/* Bloc éditorial — thin content fix + internal links */}
        {(() => {
          const ed = SIM_EDITORIAL[lang] ?? SIM_EDITORIAL.en;
          return (
            <div className="mt-14 border-t border-bg-border pt-10">
              <h2 className="text-xl font-display font-bold text-white mb-4">{ed.h2}</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mb-8">{ed.body}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{ed.related}</p>
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
    </div>
  );
}
