import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import type { CryptoCard } from '../types/card';
import { computeTrustScore } from '../utils/trustScore';

const REGULATION_SCORES: Record<string, number> = {
  banking: 100,
  mica_fca: 80,
  standard: 60,
  basic: 38,
};

const AUM_SCORES: Record<string, number> = {
  very_large: 100,
  large: 75,
  medium: 50,
  small: 40,
};

// Maps DB values to their i18n keys. Calling t() at the usage site keeps
// these as plain module-level constants (no rebuild on every render).
const REGULATION_I18N_KEY: Record<string, string> = {
  banking:  'trust_reg_banking',
  mica_fca: 'trust_reg_mica',
  standard: 'trust_reg_standard',
  basic:    'trust_reg_basic',
};

const AUM_I18N_KEY: Record<string, string> = {
  very_large: 'trust_aum_very_large',
  large:      'trust_aum_large',
  medium:     'trust_aum_medium',
  small:      'trust_aum_small',
};

// computeScore is now shared via src/utils/trustScore.ts

function scoreColor(score: number): string {
  if (score >= 65) return '#00FF85';
  if (score >= 42) return '#FFA500';
  return '#FF4444';
}

function scoreBgClass(score: number): string {
  if (score >= 65) return 'bg-green-accent/10 border-green-accent/30';
  if (score >= 42) return 'bg-amber-500/10 border-amber-500/30';
  return 'bg-red-500/10 border-red-500/20';
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-bg-border overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

interface Props {
  card: CryptoCard;
  variant?: 'badge' | 'detail';
}

export default function TrustBadge({ card, variant = 'badge' }: Props) {
  const { t } = useTranslation('common');
  const score = computeTrustScore(card);
  const color = scoreColor(score);
  const bd = card.trustBreakdown ?? {};

  const label =
    score >= 65 ? t('trust_very_reliable') :
    score >= 42 ? t('trust_moderate') :
    t('trust_caution');

  const regLabel  = bd.regulation ? t(REGULATION_I18N_KEY[bd.regulation] ?? bd.regulation) : ',';
  const aumLabel2 = bd.aum        ? t(AUM_I18N_KEY[bd.aum] ?? bd.aum)                      : ',';

  // Component scores for progress bars
  const ageScore = bd.age != null ? Math.min(Math.round((bd.age / 10) * 100), 100) : 25;
  const regScore = bd.regulation ? (REGULATION_SCORES[bd.regulation] ?? 38) : 38;
  const tpScore = bd.trustpilot != null ? Math.round((bd.trustpilot / 5) * 100) : 35;
  const aumScore = bd.aum ? (AUM_SCORES[bd.aum] ?? 40) : 40;

  if (variant === 'detail') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-display font-bold text-2xl ${scoreBgClass(score)}`}
            style={{ color }}
          >
            <Shield className="w-5 h-5" />
            {score}/100
          </div>
          <div>
            <div className="font-semibold text-white">{label}</div>
            <div className="text-xs text-slate-400">
              {t('trust_explanation')}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{t('trust_age')}</span>
              <span className="text-slate-300">{bd.age ? `${bd.age} ${t('trust_years')}` : ','}</span>
            </div>
            <ProgressBar value={ageScore} color={scoreColor(ageScore)} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{t('trust_regulation')}</span>
              <span className="text-slate-300">{regLabel}</span>
            </div>
            <ProgressBar value={regScore} color={scoreColor(regScore)} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{t('trust_trustpilot')}</span>
              <span className="text-slate-300">
                {bd.trustpilot != null ? `${bd.trustpilot}/5` : t('trust_not_available')}
              </span>
            </div>
            <ProgressBar value={tpScore} color={scoreColor(tpScore)} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{t('trust_aum')}</span>
              <span className="text-slate-300">{aumLabel2}</span>
            </div>
            <ProgressBar value={aumScore} color={scoreColor(aumScore)} />
          </div>
        </div>
      </div>
    );
  }

  // Badge variant, compact with CSS hover tooltip
  return (
    <div className="relative group/trust inline-block">
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold cursor-default select-none ${scoreBgClass(score)}`}
        style={{ color }}
      >
        <Shield className="w-3 h-3" />
        <span className="font-mono">{score}</span>
        <span className="font-normal opacity-70 text-[10px]">/ 100</span>
      </div>
      <div className="text-center text-[9px] font-medium mt-0.5 leading-tight" style={{ color }}>
        {label}
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full right-0 mb-2 w-52 p-3 rounded-xl bg-[#0e1320] border border-bg-border shadow-2xl opacity-0 pointer-events-none group-hover/trust:opacity-100 transition-opacity duration-200 z-[60]">
        <div className="font-semibold text-white text-xs mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" style={{ color }} />
          {t('trust_score')}, {score}/100
        </div>
        <div className="space-y-1.5 text-[11px]">
          <TooltipRow
            label={t('trust_age')}
            value={bd.age ? `${bd.age} ${t('trust_years')}` : ','}
            score={ageScore}
          />
          <TooltipRow
            label={t('trust_regulation')}
            value={regLabel}
            score={regScore}
          />
          <TooltipRow
            label={t('trust_trustpilot')}
            value={bd.trustpilot != null ? `${bd.trustpilot}/5` : t('trust_not_available')}
            score={tpScore}
          />
          <TooltipRow
            label={t('trust_aum')}
            value={aumLabel2}
            score={aumScore}
          />
        </div>
      </div>
    </div>
  );
}

function TooltipRow({ label, value, score }: { label: string; value: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="font-medium truncate" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
