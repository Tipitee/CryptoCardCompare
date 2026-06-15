import { useMemo, useState } from 'react';
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
import { AlertTriangle, Info, TrendingUp, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import type { SimulatorSpending } from '../types/card';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR } from '../utils/format';

const YEAR = new Date().getFullYear();
const SIM_SEO: Record<string, { title: string; desc: string }> = {
  fr: { title: `Simulateur de Gains Cartes Crypto ${YEAR} | TopCryptoCards`, desc: `Simulez vos gains annuels avec une carte crypto selon vos dépenses mensuelles. Trouvez la carte la plus rentable pour vous.` },
  de: { title: `Krypto Karten Gewinn-Simulator ${YEAR} | TopCryptoCards`, desc: `Simulieren Sie Ihre jährlichen Gewinne mit einer Krypto-Karte basierend auf Ihren monatlichen Ausgaben.` },
  es: { title: `Simulador de Ganancias Tarjetas Crypto ${YEAR} | TopCryptoCards`, desc: `Simula tus ganancias anuales con una tarjeta crypto según tus gastos mensuales.` },
  it: { title: `Simulatore di Guadagni Carte Crypto ${YEAR} | TopCryptoCards`, desc: `Simula i tuoi guadagni annuali con una carta crypto in base alle tue spese mensili.` },
  en: { title: `Crypto Card Earnings Simulator ${YEAR} | TopCryptoCards`, desc: `Simulate your annual earnings with a crypto card based on your monthly spending. Find the most profitable card for you.` },
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
  useSeoMeta({ title: simSeo.title, description: simSeo.desc });
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

  const top5: ChartEntry[] = results.slice(0, 5).map((r) => ({
    name: r.card.name,
    net: Math.round(r.net),
    issuer: r.card.issuer,
    stakingMet: r.stakingMet,
    bestCategoryLabel: r.bestCategory
      ? (CATEGORIES.find((c) => c.key === r.bestCategory)?.badgeLabel ?? null)
      : null,
  }));

  const best = results[0];

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
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              simMode === 'base'
                ? 'bg-cyan-accent/15 text-cyan-accent border-r border-cyan-accent/30'
                : 'bg-bg-elevated text-slate-400 border-r border-bg-border hover:text-white'
            }`}
          >
            {t('sim_mode_base')}
          </button>
          <button
            onClick={() => handleModeChange('optimistic')}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
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
                      className="input-field w-24 text-right font-mono text-sm py-1"
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
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_staking')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_rate')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_cashback')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_fees')}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {t('sim_col_net')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={r.card.id}
                      className="border-b border-bg-border last:border-0 hover:bg-bg-elevated/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-500 font-mono w-5">
                            #{i + 1}
                          </span>
                          <span className="font-medium text-white">{r.card.name}</span>
                          {i === 0 && <span className="badge-best">{t('sim_badge_best')}</span>}
                          {r.bestCategory && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                              <Zap className="w-2.5 h-2.5" />
                              {CATEGORIES.find((c) => c.key === r.bestCategory)?.badgeLabel}
                            </span>
                          )}
                        </div>
                        {simMode === 'base' && r.card.cashbackPremium > r.effectiveRate && (
                          <div className="ml-7 mt-0.5 text-xs text-slate-500">
                            {t('sim_potential_prefix')}{' '}
                            <span className="text-amber-400/80">{r.card.cashbackPremium}%</span>
                            {' '}{t('sim_potential_suffix')}
                          </div>
                        )}
                        {simMode === 'optimistic' && r.card.cashbackBase < r.effectiveRate && r.stakingMet && (
                          <div className="ml-7 mt-0.5 text-xs text-slate-500">
                            {t('sim_mode_base_rate_note')}{' '}
                            <span className="text-slate-400">{r.card.cashbackBase}%</span>
                          </div>
                        )}
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
                          <div className="text-xs text-slate-500 text-right">
                            ({r.card.cashbackBase}% {t('sim_rate_with_staking')})
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        {fmtEUR(r.rewards)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">
                        {r.card.annualFees === 0 ? '—' : fmtEUR(r.card.annualFees)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-green-accent">
                        {fmtEUR(r.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-500 p-4">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{t('sim_disclaimer')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
