import { useEffect, useMemo, useState } from 'react';
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
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { fmtEUR, fmtPct } from '../utils/format';
import { BRAND_CONFIG } from '../data/brandConfig';
const YEAR = new Date().getFullYear();
const COMPARE_PREFIX: Record<string, string> = {
  fr: 'comparer', de: 'vergleichen', es: 'comparar', it: 'confrontare', en: 'compare',
};
const HOME_SEO: Record<string, { title: string; desc: string }> = {
  fr: { title: `Comparatif Cartes Crypto ${YEAR} — Cashback, Frais, Avis | TopCryptoCards`, desc: `Comparez les meilleures cartes crypto en France. Cashback, frais, disponibilité : notre sélection complète ${YEAR}.` },
  de: { title: `Krypto Karten Vergleich ${YEAR} — Cashback, Gebühren | TopCryptoCards`, desc: `Vergleichen Sie die besten Krypto-Karten in Deutschland. Cashback, Gebühren, Verfügbarkeit: unsere vollständige Auswahl ${YEAR}.` },
  es: { title: `Comparativa Tarjetas Crypto ${YEAR} — Cashback, Comisiones | TopCryptoCards`, desc: `Compara las mejores tarjetas crypto en España. Cashback, comisiones, disponibilidad: nuestra selección completa ${YEAR}.` },
  it: { title: `Confronto Carte Crypto ${YEAR} — Cashback, Commissioni | TopCryptoCards`, desc: `Confronta le migliori carte crypto in Italia. Cashback, commissioni, disponibilità: la nostra selezione completa ${YEAR}.` },
  en: { title: `Best Crypto Cards ${YEAR} — Cashback, Fees Compared | TopCryptoCards`, desc: `Compare the best crypto cards in Europe. Cashback, fees, availability: our complete selection for ${YEAR}.` },
};
import SmartCardImage from '../components/SmartCardImage';
import CardDetailDrawer from '../components/CardDetailDrawer';
import TrustBadge from '../components/TrustBadge';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import type { CryptoCard } from '../types/card';

type FilterKey = 'all' | 'no_fees' | 'high_cashback' | 'no_staking' | 'france';

// ── Phase 3: brand-grouping labels ───────────────────────────────────────────
const TIERS_LABEL: Record<string, string> = {
  fr: 'niveaux', de: 'Stufen', es: 'niveles', it: 'livelli', en: 'tiers',
};
const ABOUT_LABEL: Record<string, string> = {
  fr: 'À propos de', de: 'Über', es: 'Sobre', it: 'Su', en: 'About',
};
const UP_TO: Record<string, string> = {
  fr: "Jusqu'à", de: 'Bis zu', es: 'Hasta', it: 'Fino a', en: 'Up to',
};
const FROM_LABEL: Record<string, string> = {
  fr: 'Dès', de: 'Ab', es: 'Desde', it: 'Da', en: 'From',
};
export default function Home() {
  const cards = useAppStore((s) => s.cards);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const compareSelection = useAppStore((s) => s.compareSelection);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [minTrust, setMinTrust] = useState<0 | 50 | 75>(0);
  const [sortBy, setSortBy] = useState<'trust' | 'cashback' | 'fees'>('trust');
  const [visibleCount, setVisibleCount] = useState(24);
  const [detail, setDetail] = useState<CryptoCard | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { getRoute } = useLocalizedRoute();
  const lang = useLanguage();
  const homeSeo = HOME_SEO[lang] || HOME_SEO.en;
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
  useSeoMeta({ title: homeSeo.title, description: homeSeo.desc });

  // ── Hreflang ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    document.querySelectorAll('link[data-hreflang-home]').forEach(el => el.remove());
    ['fr', 'de', 'es', 'it', 'en'].forEach(l => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}`);
      el.setAttribute('data-hreflang-home', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate'; xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr`);
    xd.setAttribute('data-hreflang-home', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-home]').forEach(el => el.remove()); };
  }, []);

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TopCryptoCards',
      url: 'https://topcryptocards.eu',
      description: homeSeo.desc,
      inLanguage: lang,
      sameAs: [],
    };
    document.getElementById('schema-org-home')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-org-home';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-org-home')?.remove(); };
  }, [lang, homeSeo.desc]);
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
    if (compareSelection.length === 2) {
      const prefix = COMPARE_PREFIX[lang] ?? 'compare';
      const [a, b] = compareSelection;
      navigate(`/${lang}/${prefix}/${a}-vs-${b}`);
    } else {
      navigate(`${getRoute('compare')}?selected=${compareSelection.join(',')}`);
    }
  };
  // Slot 1: highest cashback premium among trusted cards (trustScore >= 50)
  const topCashback = [...cards]
    .filter((c) => (c.trustScore ?? 0) >= 50)
    .sort((a, b) => {
      const diff = b.cashbackPremium - a.cashbackPremium;
      if (Math.abs(diff) > 0.001) return diff;
      return a.stakingRequired - b.stakingRequired;
    })[0];
  // Slot 2: best no-staking / no-fees card — sorted by real base rate, then premium
  const topNoFees = [...cards]
    .filter((c) => c.annualFees === 0 && c.stakingRequired === 0)
    .sort((a, b) => {
      const diff = b.cashbackNoStaking - a.cashbackNoStaking;
      if (Math.abs(diff) > 0.001) return diff;
      return b.cashbackPremium - a.cashbackPremium;
    })[0];
  // Slot 3: balanced pick — real base rate (cashbackNoStaking) minus fee drag.
  const topBalanced = [...cards]
    .filter((c) => c.availableFrance && c.annualFees < 100)
    .sort((a, b) => {
      const scoreA = a.cashbackNoStaking - a.annualFees / 100;
      const scoreB = b.cashbackNoStaking - b.annualFees / 100;
      const diff = scoreB - scoreA;
      if (Math.abs(diff) > 0.001) return diff;
      return b.cashbackPremium - a.cashbackPremium;
    })[0];
  const usedIds = new Set<string>();
  const podium: CryptoCard[] = [];
  for (const candidate of [topCashback, topNoFees, topBalanced]) {
    if (candidate && !usedIds.has(candidate.id)) {
      usedIds.add(candidate.id);
      podium.push(candidate);
    } else if (candidate && usedIds.has(candidate.id)) {
      const fallback = [...cards]
        .filter((c) => !usedIds.has(c.id))
        .sort((a, b) => b.cashbackNoStaking - a.cashbackNoStaking)[0];
      if (fallback) {
        usedIds.add(fallback.id);
        podium.push(fallback);
      }
    }
  }
  // Guarantee: at least one Crypto.com card must appear in the podium.
  const hasCryptoCom = podium.some((c) => c.issuer === 'Crypto.com');
  if (!hasCryptoCom) {
    // Best Crypto.com card by cashbackPremium
    const bestCryptoCom = [...cards]
      .filter((c) => c.issuer === 'Crypto.com')
      .sort((a, b) => b.cashbackPremium - a.cashbackPremium)[0];
    if (bestCryptoCom) {
      // Replace last slot if it's not already Crypto.com; drop the previous occupant
      podium[podium.length - 1] = bestCryptoCom;
    }
  }
  // ── Phase 3: group cards by brand, one representative per brand ──────────
  const brandReps = useMemo(() => {
    const groups: Record<string, CryptoCard[]> = {};
    for (const card of cards) {
      const key = card.brandId ?? `__single__${card.id}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(card);
    }
    return Object.entries(groups).map(([key, brandCards]) => {
      // Best representative = highest cashbackPremium, tie-break by trustScore
      const representative = [...brandCards].sort((a, b) => {
        const diff = b.cashbackPremium - a.cashbackPremium;
        if (Math.abs(diff) > 0.001) return diff;
        return (b.trustScore ?? 0) - (a.trustScore ?? 0);
      })[0];
      const isSingle = key.startsWith('__single__');
      return {
        card: representative,
        tierCount: isSingle ? 1 : brandCards.length,
        brandId: isSingle ? null : key,
        minFees: Math.min(...brandCards.map((c) => c.annualFees)),
        maxCashback: Math.max(...brandCards.map((c) => c.cashbackPremium)),
        hasNoStaking: brandCards.some((c) => c.stakingRequired === 0),
      };
    });
  }, [cards]);

  const filtered = useMemo(() => {
    let result = brandReps;
    switch (filter) {
      case 'no_fees':
        result = result.filter(({ minFees }) => minFees === 0);
        break;
      case 'high_cashback':
        result = result.filter(({ maxCashback }) => maxCashback >= 3);
        break;
      case 'no_staking':
        result = result.filter(({ hasNoStaking }) => hasNoStaking);
        break;
      case 'france':
        result = result.filter(({ card }) => card.availableFrance);
        break;
    }
    if (minTrust > 0) {
      result = result.filter(({ card }) => (card.trustScore ?? 0) >= minTrust);
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'cashback') return b.maxCashback - a.maxCashback;
      if (sortBy === 'fees') return a.minFees - b.minFees;
      return (b.card.trustScore ?? 0) - (a.card.trustScore ?? 0);
    });
  }, [brandReps, filter, minTrust, sortBy]);
  const heroCards = cards.slice(0, 3);
  useEffect(() => {
    if (cards.length === 0) return;
    const segment = { fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards' }[lang] || 'cards';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: homeSeo.title,
      description: homeSeo.desc,
      url: window.location.href,
      numberOfItems: Math.min(cards.length, 10),
      itemListElement: cards.slice(0, 10).map((card, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: card.name,
        url: `https://topcryptocards.eu/${lang}/${segment}/${card.id}`,
        image: card.realCardImage || '',
      })),
    };
    document.getElementById('schema-item-list')?.remove();
    const schemaEl = document.createElement('script');
    schemaEl.id = 'schema-item-list';
    schemaEl.type = 'application/ld+json';
    schemaEl.textContent = JSON.stringify(schema);
    document.head.appendChild(schemaEl);
    return () => { document.getElementById('schema-item-list')?.remove(); };
  }, [cards, lang, homeSeo]);
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
              {cards.length} {t('home_hero_badge')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-balance mb-6 animate-slide-up">
              {t('home_hero_title_1')} <span className="text-cyan-accent">{t('home_hero_title_2')}</span>
              <br />
              {t('home_hero_title_3')}
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 text-balance">
              {t('home_hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to={getRoute('compare')} className="btn-primary">
                {t('home_hero_btn_compare')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={getRoute('recommendation')} className="btn-secondary">
                <Sparkles className="w-4 h-4" />
                {t('home_hero_btn_quiz')}
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
                <SmartCardImage card={heroCards[0]} size="lg" priority />
              </div>
            )}
          </div>
        </div>
        <div className="relative container-app pb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: t('home_stats_cards'), value: `${cards.length}` },
              { label: t('home_stats_cryptos'), value: '15+' },
              { label: t('home_stats_criteria'), value: '10' },
              { label: t('home_stats_free'), value: '100%' },
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
              {t('home_top3_title')}
            </h2>
            <p className="text-slate-400">{t('home_top3_desc')}</p>
          </div>
          <Link to={getRoute('compare')} className="btn-ghost hidden sm:inline-flex">
            {t('home_top3_view_all')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {podium.slice(0, 3).map((card, idx) => {
            const labels = [
              { title: t('home_top3_cashback'), icon: TrendingUp, color: 'text-green-accent' },
              { title: t('home_top3_no_fees'), icon: ShieldCheck, color: 'text-cyan-accent' },
              { title: t('home_top3_balanced'), icon: Wallet, color: 'text-cyan-accent' },
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
                    <dt className="text-slate-500">{t('home_card_fees_label')}</dt>
                    <dd className="text-white font-semibold">
                      {card.annualFees === 0 ? t('home_card_free') : fmtEUR(card.annualFees)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t('home_card_staking')}</dt>
                    <dd className="text-white font-semibold">
                      {card.stakingRequired === 0 ? t('compare_stat_none') : fmtEUR(card.stakingRequired)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-cyan-accent group-hover:gap-2.5 transition-all">
                  {t('btn_details')}
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
              {t('home_all_title')}
            </h2>
            <p className="text-slate-400">
              {t('home_all_desc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setVisibleCount(24); }}
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
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-slate-400 shrink-0">{t('sort_by')} :</span>
          <div className="flex gap-1.5">
            {([
              { key: 'trust', label: t('sort_trust') },
              { key: 'cashback', label: t('sort_cashback') },
              { key: 'fees', label: t('sort_fees') },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setSortBy(key); setVisibleCount(24); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  sortBy === key
                    ? 'bg-cyan-accent/15 border-cyan-accent text-cyan-accent'
                    : 'bg-bg-elevated border-bg-border text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs text-slate-400 shrink-0">{t('trust_min_filter')}</span>
          <div className="flex gap-1.5">
            {([0, 50, 75] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMinTrust(v)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  minTrust === v
                    ? v === 0
                      ? 'bg-slate-700/60 border-slate-500 text-white'
                      : v === 50
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-green-accent/10 border-green-accent/40 text-green-accent'
                    : 'bg-bg-elevated border-bg-border text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {v === 0 ? t('trust_filter_all') : v === 50 ? `≥50 ${t('trust_moderate')}` : `≥75 ${t('trust_very_reliable')}`}
              </button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(0, visibleCount).map(({ card, tierCount, brandId, maxCashback, minFees }) => {
            const isFav = favorites.includes(card.id);
            const inCompare = compareSelection.includes(card.id);
            const isMultiTier = tierCount > 1;
            const tiersLbl = TIERS_LABEL[lang] ?? 'tiers';
            const displayName = card.name.toLowerCase().includes(card.issuer.toLowerCase())
              ? card.name
              : `${card.name} (${card.issuer})`;

            return (
              <div
                key={card.id}
                className={`card-surface p-5 relative group transition-all flex flex-col ${
                  inCompare
                    ? 'border-cyan-accent shadow-glow'
                    : 'hover:border-cyan-accent/40 hover:shadow-glow'
                }`}
              >
                {/* Tier badge — top left, absolute so it doesn't affect layout */}
                {isMultiTier && (
                  <Link
                    to={`/${lang}/${brandsSlug}/${brandId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[10px] font-bold px-2 py-0.5 rounded-full hover:bg-brand-accent/20 transition-colors"
                  >
                    <span>{tierCount}</span>
                    <span>{tiersLbl}</span>
                  </Link>
                )}

                {/* Fav + Compare — top right, absolute */}
                <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCompare(card.id); }}
                    aria-label={inCompare ? t('home_compare_remove_label') : t('home_compare_add_label')}
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
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(card.id); }}
                    aria-label={isFav ? t('home_fav_remove_label') : t('home_fav_add_label')}
                    className={`p-2 rounded-lg transition-colors ${
                      isFav
                        ? 'text-green-accent bg-green-accent/10'
                        : 'text-slate-500 hover:text-white bg-bg-elevated/70'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* ── Clickable card body — flex-1 so it fills the card ── */}
                {/* pt-8 reserves space for the absolute-positioned badges above the image, same for every card */}
                <button onClick={() => setDetail(card)} className="w-full text-left flex flex-col flex-1 pt-8">
                  {/* Image — natural size (size="md" = w-72 h-44), centered */}
                  <div className="flex justify-center mb-4">
                    <SmartCardImage card={card} size="md" />
                  </div>

                  {/* Name + badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="font-display font-semibold text-white leading-snug">{displayName}</div>
                    {card.badge && (
                      <span className="badge-accent shrink-0">{t('badge_' + card.badge, { defaultValue: card.badge })}</span>
                    )}
                  </div>

                  {/* Stats */}
                  <dl className="grid grid-cols-3 gap-2 text-xs border-t border-bg-border pt-3">
                    <div>
                      <dt className="text-slate-500">Cashback</dt>
                      <dd className="text-white font-semibold">
                        {maxCashback > 0
                          ? <><span className="text-slate-400 text-[10px]">{UP_TO[lang] ?? 'Up to'} </span>{fmtPct(maxCashback)}</>
                          : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{t('home_card_fees')}</dt>
                      <dd className="text-white font-semibold">
                        {minFees === 0
                          ? t('home_card_free')
                          : <><span className="text-slate-400 text-[10px]">{FROM_LABEL[lang] ?? 'From'} </span>{fmtEUR(minFees)}</>}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{t('home_card_staking')}</dt>
                      <dd className="text-white font-semibold">
                        {card.stakingRequired === 0 ? t('home_card_staking_none') : fmtEUR(card.stakingRequired)}
                      </dd>
                    </div>
                  </dl>

                  {/* Spacer — pushes trust badge to the bottom of the button area */}
                  <div className="flex-1" />

                  {/* Trust badge — pinned to bottom, always same position across cards */}
                  <div className="mt-3 pt-3 border-t border-bg-border flex justify-end min-h-[2rem] items-center">
                    {card.trustScore !== undefined && <TrustBadge card={card} />}
                  </div>
                </button>

                {/* CTA — pinned at card bottom, same height whether present or not */}
                <div className="mt-2 h-8 flex items-center">
                  {brandId && (
                    <Link
                      to={`/${lang}/${brandsSlug}/${brandId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 w-full h-full text-xs rounded-lg transition-colors text-brand-accent/80 hover:text-brand-accent border border-brand-accent/20 hover:border-brand-accent/40"
                    >
                      <span className="truncate">
                        {ABOUT_LABEL[lang] ?? 'About'} {(brandId && BRAND_CONFIG[brandId]?.displayName) ?? card.issuer}
                      </span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full card-surface p-10 text-center text-slate-500">
              {t('home_no_results')}
            </div>
          )}
        </div>
        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((n) => n + 24)}
              className="btn-secondary"
            >
              {t('home_show_more')}
              <span className="ml-1 text-slate-400 text-xs">({filtered.length - visibleCount} {t('home_remaining')})</span>
            </button>
          </div>
        )}
      </section>
      <section className="container-app py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">
          {t('home_help_title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: BarChart3,
              title: t('home_help_compare'),
              desc: t('home_help_compare_desc'),
              to: getRoute('compare'),
            },
            {
              icon: Calculator,
              title: t('home_help_simulator'),
              desc: t('home_help_simulator_desc'),
              to: getRoute('simulator'),
            },
            {
              icon: Sparkles,
              title: t('home_help_recommendation'),
              desc: t('home_help_recommendation_desc'),
              to: getRoute('recommendation'),
            },
            {
              icon: Heart,
              title: t('home_help_favorites'),
              desc: t('home_help_favorites_desc'),
              to: getRoute('favorites'),
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
                {compareSelection.length}{' '}
                {compareSelection.length > 1
                  ? t('home_compare_bar_label_plural')
                  : t('home_compare_bar_label')}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {selectedCards.map((c) => c.name).join(' · ')}
              </div>
            </div>
            <button
              onClick={clearCompare}
              aria-label={t('home_compare_clear_label')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={goCompare}
              disabled={compareSelection.length < 2}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('home_compare_btn')}
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