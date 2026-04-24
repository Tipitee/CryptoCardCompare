import { useMemo } from 'react';
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
import { Info, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { SimulatorSpending } from '../types/card';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR } from '../utils/format';

const CATEGORIES: { key: keyof SimulatorSpending; label: string; hint: string }[] = [
  { key: 'online', label: 'Achats en ligne', hint: 'Amazon, Fnac, e-commerce' },
  { key: 'restaurants', label: 'Restaurants', hint: 'Déjeuners, dîners, cafés' },
  { key: 'travel', label: 'Voyages & Hôtels', hint: 'Billets, hébergements' },
  { key: 'streaming', label: 'Abonnements streaming', hint: 'Netflix, Spotify, Disney+' },
  { key: 'transport', label: 'Transports', hint: 'Uber, métro, essence' },
  { key: 'supermarket', label: 'Supermarché', hint: 'Courses alimentaires' },
  { key: 'misc', label: 'Divers', hint: 'Autres dépenses' },
];

export default function Simulator() {
  const cards = useAppStore((s) => s.cards);
  const spending = useAppStore((s) => s.spending);
  const setSpending = useAppStore((s) => s.setSpending);

  const monthlyTotal = useMemo(
    () => Object.values(spending).reduce((a, b) => a + b, 0),
    [spending]
  );
  const yearly = monthlyTotal * 12;

  const results = useMemo(() => {
    return cards
      .map((c) => {
        const rewards = yearly * (c.cashbackBase / 100);
        const net = rewards - c.annualFees;
        return { card: c, rewards, net };
      })
      .sort((a, b) => b.net - a.net);
  }, [cards, yearly]);

  const top5 = results.slice(0, 5).map((r) => ({
    name: r.card.name,
    net: Math.round(r.net),
    issuer: r.card.issuer,
  }));

  const best = results[0];

  return (
    <div className="container-app py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Simulateur de gains annuels
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Renseignez vos dépenses mensuelles par catégorie pour estimer le cashback généré et choisir la carte la plus rentable pour votre profil.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-2">
          <div className="card-surface p-6">
            <h2 className="text-lg font-display font-semibold text-white mb-4">
              Vos dépenses mensuelles
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
            <div className="mt-6 pt-6 border-t border-bg-border grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Mensuel</div>
                <div className="text-2xl font-display font-bold text-white">
                  {fmtEUR(monthlyTotal)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Annuel</div>
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
                Meilleure carte pour vous
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <SmartCardImage card={best.card} size="md" />
                <div className="flex-1">
                  <div className="font-display font-bold text-xl text-white">
                    {best.card.name}
                  </div>
                  <div className="text-sm text-slate-400 mb-3">{best.card.issuer}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Avec vos {fmtEUR(monthlyTotal)} de dépenses mensuelles, la carte{' '}
                    <strong className="text-white">{best.card.name}</strong> vous rapporterait environ{' '}
                    <strong className="text-green-accent">{fmtEUR(best.net)}</strong> nets par an après déduction des frais ({fmtEUR(best.card.annualFees)}).
                    {best.card.stakingRequired > 0 && (
                      <>
                        {' '}Un staking de {fmtEUR(best.card.stakingRequired)} est requis pour bénéficier du cashback maximal.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {top5.length > 0 && (
            <div className="card-surface p-6">
              <h2 className="text-lg font-display font-semibold text-white mb-4">
                Top 5 — Gains nets annuels
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
                    <Tooltip
                      cursor={{ fill: 'rgba(0,212,255,0.05)' }}
                      contentStyle={{
                        background: '#111624',
                        border: '1px solid #1F2739',
                        borderRadius: 8,
                        color: '#fff',
                      }}
                      formatter={(v: any) => [fmtEUR(Number(v) || 0), 'Gain net']}
                    />
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
                Détails par carte
              </h2>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="bg-bg-elevated/50 border-b border-bg-border">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Carte
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Cashback estimé
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Frais
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Gain net
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-mono w-5">
                            #{i + 1}
                          </span>
                          <span className="font-medium text-white">{r.card.name}</span>
                          {i === 0 && <span className="badge-best">Meilleur</span>}
                        </div>
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
            <p>
              Simulation indicative. Les taux de cashback varient selon le niveau de staking et les conditions de l'émetteur. Ne constitue pas un conseil financier.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
