import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Star, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR, fmtPct } from '../utils/format';

export default function Favorites() {
  const cards = useAppStore((s) => s.cards);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const favCards = cards.filter((c) => favorites.includes(c.id));

  return (
    <div className="container-app py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Mes favoris</h1>
          <p className="text-slate-400">
            {favCards.length > 0
              ? `${favCards.length} carte${favCards.length > 1 ? 's' : ''} sauvegardée${favCards.length > 1 ? 's' : ''}.`
              : 'Vos cartes préférées apparaîtront ici.'}
          </p>
        </div>
        <Link to="/compare" className="btn-secondary hidden sm:inline-flex">
          Parcourir les cartes
        </Link>
      </header>

      {favCards.length === 0 ? (
        <div className="card-surface p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-cyan-accent" />
          </div>
          <h2 className="text-lg font-display font-semibold text-white mb-2">
            Aucun favori pour le moment
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Explorez le comparateur et cliquez sur l'étoile pour sauvegarder les cartes qui vous intéressent.
          </p>
          <Link to="/compare" className="btn-primary">
            Comparer les cartes
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favCards.map((c) => (
            <div
              key={c.id}
              className="card-surface p-5 hover:border-cyan-accent/40 hover:shadow-glow transition-all"
            >
              <div className="relative mb-4">
                <button
                  onClick={() => toggleFavorite(c.id)}
                  aria-label="Retirer des favoris"
                  className="absolute top-0 right-0 z-10 p-1.5 rounded-lg bg-bg-elevated/80 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex justify-center py-2">
                  <SmartCardImage card={c} size="md" />
                </div>
              </div>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <div className="font-display font-semibold text-white">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.issuer}</div>
                </div>
                {c.badge && <span className="badge-accent">{c.badge}</span>}
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <dt className="text-xs text-slate-500">Cashback max</dt>
                  <dd className="text-white font-semibold">{fmtPct(c.cashbackPremium)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Frais annuels</dt>
                  <dd className="text-white font-semibold">
                    {c.annualFees === 0 ? 'Gratuit' : fmtEUR(c.annualFees)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Staking requis</dt>
                  <dd className="text-white font-semibold">
                    {c.stakingRequired === 0 ? 'Aucun' : fmtEUR(c.stakingRequired)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Réseau</dt>
                  <dd className="text-white font-semibold">{c.cardNetwork}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-1 mb-4">
                {c.cryptos.slice(0, 5).map((cr) => (
                  <span key={cr} className="chip text-[10px] py-0.5">
                    {cr}
                  </span>
                ))}
                {c.cryptos.length > 5 && (
                  <span className="chip text-[10px] py-0.5">+{c.cryptos.length - 5}</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-bg-border">
                <span className="inline-flex items-center gap-1 text-xs text-green-accent">
                  <Star className="w-3 h-3" fill="currentColor" />
                  Dans vos favoris
                </span>
                <a
                  href={c.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-accent transition-colors"
                >
                  Voir l'offre
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
