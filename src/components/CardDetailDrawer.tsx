import { useEffect } from 'react';
import { Check, ExternalLink, Star, X } from 'lucide-react';
import type { CryptoCard } from '../types/card';
import SmartCardImage from './SmartCardImage';
import CryptoIcon from './CryptoIcon';
import { useAppStore } from '../store/useAppStore';
import { fmtEUR, fmtPct } from '../utils/format';

interface Props {
  card: CryptoCard | null;
  onClose: () => void;
}

export default function CardDetailDrawer({ card, onClose }: Props) {
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

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
            Détails de la carte
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
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
          <div className="text-slate-400 mb-5">{card.issuer}</div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Stat label="Cashback de base" value={fmtPct(card.cashbackBase)} />
            <Stat label="Cashback max" value={fmtPct(card.cashbackPremium)} highlight />
            <Stat
              label="Frais annuels"
              value={card.annualFees === 0 ? 'Gratuit' : fmtEUR(card.annualFees)}
            />
            <Stat
              label="Staking"
              value={card.stakingRequired === 0 ? 'Aucun' : fmtEUR(card.stakingRequired)}
            />
            <Stat label="Limite quotidienne" value={fmtEUR(card.dailyLimit)} />
            <Stat label="Réseau" value={card.cardNetwork} />
          </div>

          <section className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Cryptomonnaies supportées
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

          {card.extras.length > 0 && (
            <section className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Avantages inclus
              </h3>
              <ul className="space-y-1.5">
                {card.extras.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-accent shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-6 grid grid-cols-2 gap-2 text-xs">
            <Pill ok={card.availableFrance} label="France" />
            <Pill ok={card.availableEU} label="Europe (UE)" />
            <Pill ok={card.freeWithdrawals} label="Retraits gratuits" />
            <Pill ok={card.stakingRequired === 0} label="Sans staking" />
          </section>

          <div className="flex gap-2">
            <button
              onClick={() => toggleFavorite(card.id)}
              className={`btn-secondary flex-1 ${
                isFav ? 'border-green-accent/50 text-green-accent' : ''
              }`}
            >
              <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
              Favoris
            </button>
            <a
              href={card.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1"
            >
              Voir l'offre
              <ExternalLink className="w-4 h-4" />
            </a>
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
