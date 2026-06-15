import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Star, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR, fmtPct } from '../utils/format';

const YEAR = new Date().getFullYear();

const FAV_SEO: Record<string, { title: string; desc: string }> = {
  fr: { title: `Mes Cartes Crypto Favorites ${YEAR} | TopCryptoCards`, desc: 'Retrouvez toutes vos cartes crypto préférées en un seul endroit.' },
  de: { title: `Meine Lieblings-Krypto-Karten ${YEAR} | TopCryptoCards`, desc: 'Finden Sie alle Ihre bevorzugten Krypto-Karten an einem Ort.' },
  es: { title: `Mis Tarjetas Crypto Favoritas ${YEAR} | TopCryptoCards`, desc: 'Encuentra todas tus tarjetas crypto favoritas en un solo lugar.' },
  it: { title: `Le Mie Carte Crypto Preferite ${YEAR} | TopCryptoCards`, desc: 'Trova tutte le tue carte crypto preferite in un unico posto.' },
  en: { title: `My Favorite Crypto Cards ${YEAR} | TopCryptoCards`, desc: 'Find all your favorite crypto cards in one place.' },
};

const UI: Record<string, {
  title: string;
  desc_n: (n: number) => string;
  desc_empty: string;
  browse: string;
  compare: string;
  empty_title: string;
  empty_desc: string;
  in_fav: string;
  see_offer: string;
  free: string;
  none_staking: string;
  cashback: string;
  fees: string;
  staking: string;
  network: string;
}> = {
  fr: {
    title: 'Mes favoris',
    desc_n: (n) => `${n} carte${n > 1 ? 's' : ''} sauvegardée${n > 1 ? 's' : ''}.`,
    desc_empty: 'Vos cartes préférées apparaîtront ici.',
    browse: 'Parcourir les cartes',
    compare: 'Comparer les cartes',
    empty_title: 'Aucun favori pour le moment',
    empty_desc: "Explorez le comparateur et cliquez sur l'étoile pour sauvegarder les cartes qui vous intéressent.",
    in_fav: 'Dans vos favoris',
    see_offer: "Voir l'offre",
    free: 'Gratuit',
    none_staking: 'Aucun',
    cashback: 'Cashback max',
    fees: 'Frais annuels',
    staking: 'Staking requis',
    network: 'Réseau',
  },
  de: {
    title: 'Meine Favoriten',
    desc_n: (n) => `${n} Karte${n > 1 ? 'n' : ''} gespeichert.`,
    desc_empty: 'Ihre bevorzugten Karten werden hier angezeigt.',
    browse: 'Karten durchsuchen',
    compare: 'Karten vergleichen',
    empty_title: 'Noch keine Favoriten',
    empty_desc: 'Durchsuchen Sie den Vergleich und klicken Sie auf den Stern, um Karten zu speichern.',
    in_fav: 'In Ihren Favoriten',
    see_offer: 'Angebot ansehen',
    free: 'Kostenlos',
    none_staking: 'Kein',
    cashback: 'Max. Cashback',
    fees: 'Jahresgebühr',
    staking: 'Staking erforderlich',
    network: 'Netzwerk',
  },
  es: {
    title: 'Mis favoritos',
    desc_n: (n) => `${n} tarjeta${n > 1 ? 's' : ''} guardada${n > 1 ? 's' : ''}.`,
    desc_empty: 'Tus tarjetas preferidas aparecerán aquí.',
    browse: 'Explorar tarjetas',
    compare: 'Comparar tarjetas',
    empty_title: 'Sin favoritos por ahora',
    empty_desc: 'Explora el comparador y haz clic en la estrella para guardar tarjetas.',
    in_fav: 'En tus favoritos',
    see_offer: 'Ver oferta',
    free: 'Gratis',
    none_staking: 'Ninguno',
    cashback: 'Cashback máx.',
    fees: 'Cuotas anuales',
    staking: 'Staking requerido',
    network: 'Red',
  },
  it: {
    title: 'I miei preferiti',
    desc_n: (n) => `${n} carta${n > 1 ? 'e' : ''} salvata${n > 1 ? 'e' : ''}.`,
    desc_empty: 'Le tue carte preferite appariranno qui.',
    browse: 'Sfoglia le carte',
    compare: 'Confronta le carte',
    empty_title: 'Nessun preferito per ora',
    empty_desc: 'Esplora il comparatore e clicca sulla stella per salvare le carte.',
    in_fav: 'Nei tuoi preferiti',
    see_offer: "Vedi l'offerta",
    free: 'Gratuito',
    none_staking: 'Nessuno',
    cashback: 'Cashback max',
    fees: 'Quote annuali',
    staking: 'Staking richiesto',
    network: 'Rete',
  },
  en: {
    title: 'My Favorites',
    desc_n: (n) => `${n} card${n > 1 ? 's' : ''} saved.`,
    desc_empty: 'Your preferred cards will appear here.',
    browse: 'Browse cards',
    compare: 'Compare cards',
    empty_title: 'No favorites yet',
    empty_desc: "Browse the comparison and click the star to save cards you're interested in.",
    in_fav: 'In your favorites',
    see_offer: 'See offer',
    free: 'Free',
    none_staking: 'None',
    cashback: 'Max cashback',
    fees: 'Annual fees',
    staking: 'Staking required',
    network: 'Network',
  },
};

export default function Favorites() {
  const cards = useAppStore((s) => s.cards);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const lang = useLanguage();
  const { getRoute } = useLocalizedRoute();
  const ui = UI[lang] || UI.en;
  const favSeo = FAV_SEO[lang] || FAV_SEO.en;
  useSeoMeta({ title: favSeo.title, description: favSeo.desc });

  const favCards = cards.filter((c) => favorites.includes(c.id));

  return (
    <div className="container-app py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{ui.title}</h1>
          <p className="text-slate-400">
            {favCards.length > 0 ? ui.desc_n(favCards.length) : ui.desc_empty}
          </p>
        </div>
        <Link to={getRoute('compare')} className="btn-secondary hidden sm:inline-flex">
          {ui.browse}
        </Link>
      </header>

      {favCards.length === 0 ? (
        <div className="card-surface p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-cyan-accent" />
          </div>
          <h2 className="text-lg font-display font-semibold text-white mb-2">
            {ui.empty_title}
          </h2>
          <p className="text-sm text-slate-400 mb-6">{ui.empty_desc}</p>
          <Link to={getRoute('compare')} className="btn-primary">
            {ui.compare}
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
                  aria-label={`Remove ${c.name} from favorites`}
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
                  <dt className="text-xs text-slate-500">{ui.cashback}</dt>
                  <dd className="text-white font-semibold">{fmtPct(c.cashbackPremium)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.fees}</dt>
                  <dd className="text-white font-semibold">
                    {c.annualFees === 0 ? ui.free : fmtEUR(c.annualFees)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.staking}</dt>
                  <dd className="text-white font-semibold">
                    {c.stakingRequired === 0 ? ui.none_staking : fmtEUR(c.stakingRequired)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.network}</dt>
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
                  {ui.in_fav}
                </span>
                <a
                  href={c.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-accent transition-colors"
                >
                  {ui.see_offer}
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
