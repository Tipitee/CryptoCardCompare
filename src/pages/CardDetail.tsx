import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ExternalLink,
  Shield,
  Star,
  X,
} from 'lucide-react';
import type { CryptoCard } from '../types/card';
import { fetchCardById } from '../lib/supabase';
import SmartCardImage from '../components/SmartCardImage';
import CryptoIcon from '../components/CryptoIcon';
import TrustBadge from '../components/TrustBadge';
import { useAppStore } from '../store/useAppStore';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { fmtEUR, fmtPct } from '../utils/format';

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['cards', 'common']);
  const { getRoute } = useLocalizedRoute();
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const [card, setCard] = useState<CryptoCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    fetchCardById(id)
      .then((c) => {
        if (!c) setNotFound(true);
        else setCard(c);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-app py-12 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-bg-elevated rounded w-32" />
          <div className="flex gap-6">
            <div className="h-48 w-72 bg-bg-elevated rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-bg-elevated rounded w-1/2" />
              <div className="h-5 bg-bg-elevated rounded w-1/3" />
              <div className="h-24 bg-bg-elevated rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="container-app py-24 text-center">
        <Shield className="w-14 h-14 text-slate-600 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          {t('common:card_not_found_title')}
        </h1>
        <p className="text-slate-500 mb-8">{t('common:card_not_found_desc')}</p>
        <Link to={getRoute('compare')} className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          {t('common:btn_back')}
        </Link>
      </div>
    );
  }

  const isFav = favorites.includes(card.id);
  const restrictionEntries = Object.entries(card.marketRestrictions);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="container-app pt-6 pb-2">
        <Link
          to={getRoute('compare')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common:card_detail_back')}
        </Link>
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${card.colorPrimary}18 0%, ${card.colorSecondary}10 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg/80 pointer-events-none" />
        <div className="container-app py-10 relative">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <SmartCardImage card={card} size="lg" className="shrink-0" />
            <div className="flex-1 min-w-0">
              {card.badge && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 border"
                  style={{
                    color: card.colorPrimary,
                    borderColor: `${card.colorPrimary}40`,
                    background: `${card.colorPrimary}12`,
                  }}
                >
                  {card.badge}
                </span>
              )}
              <h1 className="text-4xl font-display font-bold text-white mb-1">
                {card.name}
              </h1>
              <p className="text-slate-400 text-lg mb-4">{card.issuer}</p>

              {card.virtualOnly && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {t('cards:virtual_only_warning')}
                </div>
              )}

              {restrictionEntries.length > 0 && (
                <div className="mb-4 space-y-1">
                  {restrictionEntries.map(([market, reason]) => (
                    <div
                      key={market}
                      className="inline-flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs mr-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold uppercase">{market}</span> — {reason}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => toggleFavorite(card.id)}
                  className={`btn-secondary ${isFav ? 'border-green-accent/50 text-green-accent' : ''}`}
                >
                  <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  {t('common:nav_favorites')}
                </button>
                <a
                  href={card.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  {t('common:quiz_see_offer')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key stats */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {t('cards:card_extras')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard label={t('cards:cashback_base')} value={fmtPct(card.cashbackBase)} />
                <StatCard
                  label={t('cards:cashback_premium')}
                  value={fmtPct(card.cashbackPremium)}
                  highlight
                  color={card.colorPrimary}
                />
                <StatCard
                  label={t('cards:card_fees')}
                  value={card.annualFees === 0 ? t('common:home_card_free') : fmtEUR(card.annualFees)}
                />
                <StatCard
                  label={t('cards:card_staking')}
                  value={card.stakingRequired === 0 ? t('common:compare_stat_none') : fmtEUR(card.stakingRequired)}
                />
                <StatCard label={t('cards:card_daily_limit')} value={fmtEUR(card.dailyLimit)} />
                <StatCard label={t('cards:card_network')} value={card.cardNetwork} />
              </div>
            </section>

            {/* Availability */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {t('common:card_detail_availability')}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <Pill ok={card.availableFrance} label={t('cards:card_available_france')} />
                <Pill ok={card.availableEU} label={t('cards:card_available_eu')} />
                <Pill ok={card.freeWithdrawals} label={t('cards:card_free_withdrawals')} />
                <Pill ok={card.stakingRequired === 0} label={t('common:filter_no_staking')} />
              </div>
            </section>

            {/* Extras */}
            {card.extras.filter((e) => e !== 'virtual_only').length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  {t('cards:card_extras')}
                </h2>
                <ul className="space-y-2">
                  {card.extras
                    .filter((e) => e !== 'virtual_only')
                    .map((e) => (
                      <li key={e} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-green-accent shrink-0 mt-0.5" />
                        <span>{t(`cards:${e}`, { defaultValue: e })}</span>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            {/* Supported cryptos */}
            {card.cryptos.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  {t('cards:card_cryptos')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {card.cryptos.map((c) => (
                    <div
                      key={c}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-bg-border"
                    >
                      <CryptoIcon symbol={c} size={16} />
                      <span className="text-sm text-slate-300 font-medium">{c}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust score */}
            {card.trustScore !== undefined && (
              <div className="p-5 rounded-2xl bg-bg-elevated border border-bg-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {t('common:trust_score')}
                </h3>
                <TrustBadge card={card} variant="detail" />
              </div>
            )}

            {/* CTA */}
            <div className="p-5 rounded-2xl border border-bg-border bg-bg-elevated">
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                {t('common:card_detail_cta_desc')}
              </p>
              <a
                href={card.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                {t('common:quiz_see_offer')}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-bg-elevated border border-bg-border">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div
        className={`text-lg font-semibold ${highlight ? '' : 'text-white'}`}
        style={highlight && color ? { color } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`px-3 py-2 rounded-lg flex items-center gap-2 border text-sm ${
        ok
          ? 'bg-green-accent/5 border-green-accent/30 text-green-accent'
          : 'bg-bg-elevated border-bg-border text-slate-500'
      }`}
    >
      {ok ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
      {label}
    </div>
  );
}
