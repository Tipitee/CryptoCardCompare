import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  Heart,
  Plus,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Star,
  X,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { fmtEUR, fmtPct } from '../utils/format';
import SmartCardImage from '../components/SmartCardImage';
import CardDetailDrawer from '../components/CardDetailDrawer';
import type { CryptoCard } from '../types/card';

type FilterKey = 'all' | 'no_fees' | 'high_cashback' | 'no_staking' | 'france';

export default function Home() {
  const cards = useAppStore((s) => s.cards);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const compareSelection = useAppStore((s) => s.compareSelection);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [detail, setDetail] = useState<CryptoCard | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { getRoute } = useLocalizedRoute();

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t('filter_all') },
    { key: 'no_fees', label: t('filter_no_fees') },
    { key: 'high_cashback', label: t('filter_high_cashback') },
    { key: 'no_staking', label: t('filter_no_staking') },
    { key: 'france', label: t('filter_france') },
  ];

  const selectedCards = cards.filter((c) => compareSelection.includes(c.id));
  const goCompare = () => {
    if (compareSelection.length === 0) return;
    navigate(`${getRoute('comparer')}?selected=${compareSelection.join(',')}`);
  };

  const topCashback = [...cards].sort((a, b) => b.cashbackPremium - a.cashbackPremium)[0];
  const topNoFees = [...cards]
    .filter((c) => c.annualFees === 0 && c.stakingRequired === 0)
    .sort((a, b) => b.cashbackBase - a.cashbackBase)[0];
  const topBalanced = [...cards]
    .filter((c) => c.availableFrance && c.stakingRequired <= 500)
    .sort(
      (a, b) =>
        b.cashbackPremium - b.annualFees / 100 - (a.cashbackPremium - a.annualFees / 100)
    )[0];

  const podium = [topCashback, topNoFees, topBalanced].filter(Boolean) as CryptoCard[];

  const filtered = useMemo(() => {
    switch (filter) {
      case 'no_fees':
        return cards.filter((c) => c.annualFees === 0);
      case 'high_cashback':
        return cards.filter((c) => c.cashbackPremium >= 3);
      case 'no_staking':
        return cards.filter((c) => c.stakingRequired === 0);
      case 'france':
        return cards.filter((c) => c.availableFrance);
      default:
        return cards;
    }
  }, [cards, filter]);

  const heroCards = cards.slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(closest-side, #00D4FF, transparent)' }}
        />

        <div className="relative container-app pt-16 md:pt-24 pb-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-elevated border border-bg-border text-xs text-slate-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-accent animate-pulse" />
              {cards.length} cartes analysées en continu
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-balance mb-6 animate-slide-up">
              La <span className="text-cyan-accent">meilleure carte crypto</span>
              <br />
              pour votre profil
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 text-balance">
              Comparez visuellement les cartes, simulez vos gains annuels et obtenez une
              recommandation personnalisée en 6 questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/compare" className="btn-primary">
                Comparer les cartes
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/recommendation" className="btn-secondary">
                <Sparkles className="w-4 h-4" />
                Quiz personnalisé
              </Link>
            </div>
          </div>

          <div className="relative h-[340px] sm:h-[400px] hidden lg:block">
            {heroCards[2] && (
              <div
                className="absolute top-6 right-20 opacity-60 blur-[0.5px]"
                style={{ transform: 'rotate(-10deg) scale(0.85)' }}
              >
                <SmartCardImage card={heroCards[2]} size="lg" tilt={false} />
              </div>
            )}
            {heroCards[1] && (
              <div
                className="absolute top-16 right-32 opacity-85"
                style={{ transform: 'rotate(-4deg)' }}
              >
                <SmartCardImage card={heroCards[1]} size="lg" tilt={false} />
              </div>
            )}
            {heroCards[0] && (
              <div
                className="absolute top-28 right-10"
                style={{ transform: 'rotate(5deg)' }}
              >
                <SmartCardImage card={heroCards[0]} size="lg" />
              </div>
            )}
          </div>
        </div>

        <div className="relative container-app pb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Cartes comparées', value: `${cards.length || 14}` },
              { label: 'Cryptos supportées', value: '15+' },
              { label: 'Critères analysés', value: '10' },
              { label: 'Gratuit & sans compte', value: '100%' },
            ].map((stat) => (
              <div key={stat.label} className="card-surface p-4 text-left">
                <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Notre Top 3 du moment
            </h2>
            <p className="text-slate-400">Les cartes qui se démarquent selon différents critères.</p>
          </div>
          <Link to="/compare" className="btn-ghost hidden sm:inline-flex">
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {podium.map((card, idx) => {
            const labels = [
              { title: 'Cashback maximum', icon: TrendingUp, color: 'text-green-accent' },
              { title: 'Zéro frais & staking', icon: ShieldCheck, color: 'text-cyan-accent' },
              { title: 'Meilleur équilibre', icon: Wallet, color: 'text-cyan-accent' },
            ];
            const l = labels[idx];
            return (
              <button
                key={card.id}
                onClick={() => setDetail(card)}
                className="card-surface p-6 text-left hover:border-cyan-accent/40 hover:shadow-glow transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold mb-4">
                  <l.icon className={`w-4 h-4 ${l.color}`} />
                  <span className={l.color}>{l.title}</span>
                </div>
                <div className="flex justify-center mb-5">
                  <SmartCardImage card={card} size="md" />
                </div>
                <div className="font-display font-bold text-white text-lg">{card.name}</div>
                <div className="text-xs text-slate-500 mb-4">{card.issuer}</div>
                <dl className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-slate-500">Cashback</dt>
                    <dd className="text-white font-semibold">{fmtPct(card.cashbackPremium)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Frais</dt>
                    <dd className="text-white font-semibold">
                      {card.annualFees === 0 ? 'Gratuit' : fmtEUR(card.annualFees)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Staking</dt>
                    <dd className="text-white font-semibold">
                      {card.stakingRequired === 0 ? 'Aucun' : fmtEUR(card.stakingRequired)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-cyan-accent group-hover:gap-2.5 transition-all">
                  Voir les détails
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="container-app py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Toutes les cartes crypto
            </h2>
            <p className="text-slate-400">
              Cliquez sur une carte pour découvrir ses caractéristiques détaillées.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filter === f.key
                    ? 'bg-cyan-accent/15 border-cyan-accent text-cyan-accent'
                    : 'bg-bg-elevated border-bg-border text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((card) => {
            const isFav = favorites.includes(card.id);
            const inCompare = compareSelection.includes(card.id);
            return (
              <div
                key={card.id}
                className={`card-surface p-5 relative group transition-all ${
                  inCompare
                    ? 'border-cyan-accent shadow-glow'
                    : 'hover:border-cyan-accent/40 hover:shadow-glow'
                }`}
              >
                <div className="absolute top-4 right-4 z-10 flex gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(card.id);
                    }}
                    aria-label={inCompare ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
                    aria-pressed={inCompare}
                    className={`p-2 rounded-lg transition-all ${
                      inCompare
                        ? 'bg-cyan-accent text-bg-base shadow-glow'
                        : 'bg-bg-elevated/70 text-slate-400 hover:text-white hover:bg-cyan-accent/20'
                    }`}
                  >
                    {inCompare ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(card.id);
                    }}
                    aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    className={`p-2 rounded-lg transition-colors ${
                      isFav
                        ? 'text-green-accent bg-green-accent/10'
                        : 'text-slate-500 hover:text-white bg-bg-elevated/70'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <button
                  onClick={() => setDetail(card)}
                  className="w-full text-left"
                >
                  <div className="flex justify-center py-2 mb-4">
                    <SmartCardImage card={card} size="md" />
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-display font-semibold text-white">{card.name}</div>
                    {card.badge && <span className="badge-accent">{card.badge}</span>}
                  </div>
                  <div className="text-xs text-slate-500 mb-4">{card.issuer}</div>

                  <dl className="grid grid-cols-3 gap-2 text-xs border-t border-bg-border pt-3">
                    <div>
                      <dt className="text-slate-500">Cashback</dt>
                      <dd className="text-white font-semibold">{fmtPct(card.cashbackPremium)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Frais/an</dt>
                      <dd className="text-white font-semibold">
                        {card.annualFees === 0 ? 'Gratuit' : fmtEUR(card.annualFees)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Staking</dt>
                      <dd className="text-white font-semibold">
                        {card.stakingRequired === 0 ? '—' : fmtEUR(card.stakingRequired)}
                      </dd>
                    </div>
                  </dl>
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full card-surface p-10 text-center text-slate-500">
              Aucune carte ne correspond à ce filtre.
            </div>
          )}
        </div>
      </section>

      <section className="container-app py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">
          Comment nous pouvons vous aider
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: BarChart3,
              title: 'Comparer',
              desc: 'Tableau interactif avec tri et filtres avancés.',
              to: '/compare',
            },
            {
              icon: Calculator,
              title: 'Simuler',
              desc: 'Calcul de vos gains annuels selon vos dépenses.',
              to: '/simulator',
            },
            {
              icon: Sparkles,
              title: 'Recommandation',
              desc: 'Quiz personnalisé pour trouver votre carte idéale.',
              to: '/recommendation',
            },
            {
              icon: Heart,
              title: 'Favoris',
              desc: 'Sauvegardez les cartes qui vous intéressent.',
              to: '/favorites',
            },
          ].map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="card-surface p-6 hover:border-cyan-accent/40 hover:shadow-glow transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-cyan-accent" />
              </div>
              <h3 className="font-display font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {compareSelection.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 animate-slide-up">
          <div className="card-surface shadow-2xl border-cyan-accent/40 px-4 py-3 flex items-center gap-3 max-w-3xl w-full">
            <div className="flex -space-x-3 shrink-0">
              {selectedCards.slice(0, 4).map((c) => (
                <div key={c.id} className="ring-2 ring-bg-card rounded-lg">
                  <SmartCardImage card={c} size="xs" tilt={false} />
                </div>
              ))}
              {selectedCards.length > 4 && (
                <div className="w-9 h-[90px] rounded-lg bg-bg-elevated border border-bg-border flex items-center justify-center text-xs font-semibold text-slate-300 ring-2 ring-bg-card">
                  +{selectedCards.length - 4}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <div className="text-sm font-semibold text-white">
                {compareSelection.length} carte{compareSelection.length > 1 ? 's' : ''} sélectionnée
                {compareSelection.length > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {selectedCards.map((c) => c.name).join(' · ')}
              </div>
            </div>
            <button
              onClick={clearCompare}
              aria-label="Vider la sélection"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={goCompare}
              disabled={compareSelection.length < 2}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comparer
              {compareSelection.length >= 2 && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      <CardDetailDrawer card={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
