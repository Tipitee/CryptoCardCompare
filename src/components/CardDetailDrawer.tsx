import { useEffect } from 'react';
import { AlertTriangle, ArrowRight, Check, ExternalLink, Shield, Star, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { CryptoCard } from '../types/card';
import { getExtraLabel } from '../i18n/extrasLabels';
import SmartCardImage from './SmartCardImage';
import CryptoIcon from './CryptoIcon';
import TrustBadge from './TrustBadge';
import { useAppStore } from '../store/useAppStore';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { fmtEUR, fmtPct } from '../utils/format';
import { getAffiliateLink } from '../utils/affiliateLink';

interface Props {
  card: CryptoCard | null;
  onClose: () => void;
}

export default function CardDetailDrawer({ card, onClose }: Props) {
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const { t } = useTranslation(['cards', 'common']);
  const navigate = useNavigate();
  const { getLocalizedSegment, currentLang } = useLocalizedRoute();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (card) {
      window.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [card, onClose]);

  if (!card) return null;
  const isFav = favorites.includes(card.id);

  // Only show valid market code keys — filter out internal meta keys (note_en, vip_only, etc.)
  const VALID_MARKET_KEYS = new Set(['fr', 'de', 'es', 'it', 'en', 'uk', 'us']);
  const restrictionEntries = Object.entries(card.marketRestrictions)
    .filter(([k, v]) => VALID_MARKET_KEYS.has(k) && typeof v === 'string' && v.length > 0);
  const localNote: string | undefined =
    (card.marketRestrictions[`note_${currentLang}`] as string | undefined) ||
    (card.marketRestrictions['note_en'] as string | undefined) ||
    undefined;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative w-full max-w-md bg-bg-card border-l border-bg-border h-full overflow-y-auto scrollbar-thin animate-slide-up"
      >
        <div className="sticky top-0 z-10 bg-bg-card/95 backdrop-blur-md border-b border-bg-border px-5 py-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            {t('cards:card_extras')}
          </span>
          <button
            onClick={onClose}
            aria-label={t('common:btn_back')}
            className="p-1.5 rounded-lg hover:bg-bg-elevated text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-col items-center gap-3 mb-6 py-4">
            <SmartCardImage card={card} size="lg" className="mx-auto" />
          </div>

          <h2 id="drawer-title" className="text-2xl font-display font-bold text-white">
            {card.name}
          </h2>
          <div className="text-slate-400 mb-3">{card.issuer}</div>

          {card.virtualOnly && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {t('cards:virtual_only_warning')}
            </div>
          )}

          {localNote && (
            <div className="mb-4 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{localNote}</span>
            </div>
          )}

          {restrictionEntries.length > 0 && (
            <div className="mb-4 space-y-1">
              {restrictionEntries.map(([market, reason]) => (
                <div
                  key={market}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span><span className="font-semibold uppercase">{market}</span> — {reason}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Stat label={t('cards:cashback_base')} value={fmtPct(card.cashbackBase)} />
            <Stat label={t('cards:cashback_premium')} value={fmtPct(card.cashbackPremium)} highlight />
            <Stat
              label={t('cards:card_fees')}
              value={card.annualFees === 0 ? t('common:home_card_free') : fmtEUR(card.annualFees)}
            />
            <Stat
              label={t('cards:card_staking')}
              value={card.stakingRequired === 0 ? t('common:compare_stat_none') : fmtEUR(card.stakingRequired)}
            />
            <Stat label={t('cards:card_daily_limit')} value={fmtEUR(card.dailyLimit)} />
            <Stat label={t('cards:card_network')} value={card.cardNetwork} />
          </div>

          <section className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {t('cards:card_cryptos')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {card.cryptos.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-bg-elevated border border-bg-border"
                >
                  <CryptoIcon symbol={c} size={16} />
                  <span className="text-xs text-slate-300 font-medium">{c}</span>
                </div>
              ))}
            </div>
          </section>

          {card.extras.filter(e => e !== 'virtual_only').length > 0 && (
            <section className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {t('cards:card_extras')}
              </h3>
              <ul className="space-y-1.5">
                {card.extras.filter(e => e !== 'virtual_only').map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-accent shrink-0 mt-0.5" />
                    <span>{getExtraLabel(e, currentLang)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-6 grid grid-cols-2 gap-2 text-xs">
            <Pill ok={card.availableFrance} label={t('cards:card_available_france')} />
            <Pill ok={card.availableEU} label={t('cards:card_available_eu')} />
            <Pill ok={card.freeWithdrawals} label={t('cards:card_free_withdrawals')} />
            <Pill ok={card.stakingRequired === 0} label={t('common:filter_no_staking')} />
          </section>

          {false && card.trustScore !== undefined && (
            <section className="mb-6 p-4 rounded-xl bg-bg-elevated border border-bg-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                {t('common:trust_score')}
              </h3>
              <TrustBadge card={card} variant="detail" />
            </section>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                const segment = getLocalizedSegment('cards');
                onClose();
                navigate(`/${currentLang}/${segment}/${card.id}`);
              }}
              className="btn-secondary w-full"
            >
              <ArrowRight className="w-4 h-4" />
              {t('common:card_detail_view_page')}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(card.id)}
                className={`btn-secondary flex-1 ${
                  isFav ? 'border-green-accent/50 text-green-accent' : ''
                }`}
              >
                <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                {t('common:nav_favorites')}
              </button>
              <a
                href={getAffiliateLink(card)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
              >
                {t('common:quiz_see_offer')}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-3 rounded-lg bg-bg-elevated border border-bg-border">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
      <div className={`text-base font-semibold ${highlight ? 'text-cyan-accent' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 border ${
        ok
          ? 'bg-green-accent/5 border-green-accent/30 text-green-accent'
          : 'bg-bg-elevated border-bg-border text-slate-500'
      }`}
    >
      {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </div>
  );
}