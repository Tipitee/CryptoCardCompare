import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Trash2 } from 'lucide-react';
import { THEMATIC_ROUTES } from '../config/routes';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useLocalizedRoute } from '../hooks/useLocalizedRoute';
import { useSeoMeta } from '../hooks/useSeoMeta';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR, fmtPct, translateBadge } from '../utils/format';
import { getAffiliateLink } from '../utils/affiliateLink';
import { trackAffiliateClick } from '../utils/analytics';
import { ROUTE_TRANSLATIONS } from '../i18n/types';

const YEAR = new Date().getFullYear();

const FAV_EDITORIAL: Record<string, { h2: string; body: string; related: string; links: { key: string; emoji: string; label: string }[] }> = {
  fr: {
    h2: 'Comment utiliser vos favoris ?',
    body: `La liste de favoris vous permet de sauvegarder en un clic les cartes crypto qui vous intéressent, pour les retrouver facilement lors de votre prochaine visite. Utilisez le comparateur pour filtrer les cartes par cashback, frais ou staking, puis cliquez sur l'étoile pour ajouter une carte à vos favoris. Vous pouvez ensuite les comparer côte à côte ou simuler vos gains potentiels avec notre simulateur de cashback.`,
    related: 'Explorer par thème',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Meilleures cartes' },
      { key: 'cashback',   emoji: '💰', label: 'Cashback élevé' },
      { key: 'no-fees',    emoji: '🆓', label: 'Sans frais annuels' },
      { key: 'no-staking', emoji: '🔓', label: 'Sans staking' },
    ],
  },
  de: {
    h2: 'Wie nutzen Sie Ihre Favoriten?',
    body: `Die Favoritenliste ermöglicht es Ihnen, Krypto-Karten, die Sie interessieren, mit einem Klick zu speichern und sie bei Ihrem nächsten Besuch leicht wiederzufinden. Verwenden Sie den Vergleich, um Karten nach Cashback, Gebühren oder Staking zu filtern, und klicken Sie auf den Stern, um eine Karte zu Ihren Favoriten hinzuzufügen. Anschließend können Sie sie nebeneinander vergleichen oder Ihre potenziellen Gewinne mit unserem Cashback-Simulator berechnen.`,
    related: 'Nach Typ erkunden',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Beste Karten' },
      { key: 'cashback',   emoji: '💰', label: 'Hoher Cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'Ohne Jahresgebühr' },
      { key: 'no-staking', emoji: '🔓', label: 'Ohne Staking' },
    ],
  },
  es: {
    h2: '¿Cómo usar tus favoritos?',
    body: `La lista de favoritos te permite guardar con un clic las tarjetas crypto que te interesan, para encontrarlas fácilmente en tu próxima visita. Usa el comparador para filtrar tarjetas por cashback, comisiones o staking, luego haz clic en la estrella para añadir una tarjeta a tus favoritos. A continuación puedes compararlas lado a lado o simular tus ganancias potenciales con nuestro simulador de cashback.`,
    related: 'Explorar por tipo',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Mejores tarjetas' },
      { key: 'cashback',   emoji: '💰', label: 'Alto cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'Sin comisiones' },
      { key: 'no-staking', emoji: '🔓', label: 'Sin staking' },
    ],
  },
  it: {
    h2: 'Come usare i tuoi preferiti?',
    body: `La lista dei preferiti ti permette di salvare con un clic le carte crypto che ti interessano, per ritrovarle facilmente alla prossima visita. Usa il comparatore per filtrare le carte per cashback, costi o staking, poi clicca sulla stella per aggiungere una carta ai tuoi preferiti. Potrai quindi confrontarle fianco a fianco o simulare i tuoi guadagni potenziali con il nostro simulatore di cashback.`,
    related: 'Esplora per tipo',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Migliori carte' },
      { key: 'cashback',   emoji: '💰', label: 'Alto cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'Senza costi annuali' },
      { key: 'no-staking', emoji: '🔓', label: 'Senza staking' },
    ],
  },
  en: {
    h2: 'How to use your favorites?',
    body: `The favorites list lets you save crypto cards you're interested in with a single click, so you can find them easily on your next visit. Use the comparison tool to filter cards by cashback, fees or staking, then click the star to add a card to your favorites. You can then compare them side by side or estimate your potential earnings with our cashback simulator.`,
    related: 'Explore by type',
    links: [
      { key: 'best',       emoji: '⭐', label: 'Best cards' },
      { key: 'cashback',   emoji: '💰', label: 'High cashback' },
      { key: 'no-fees',    emoji: '🆓', label: 'No annual fees' },
      { key: 'no-staking', emoji: '🔓', label: 'No staking' },
    ],
  },
};

const BRAND_LABEL: Record<string, string> = {
  fr: 'Marque', de: 'Marke', es: 'Marca', it: 'Marchio', en: 'Brand',
};

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
  const cardSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
  const ui = UI[lang] || UI.en;
  const favSeo = FAV_SEO[lang] || FAV_SEO.en;
  // noindex: user-specific page (localStorage), crawlers see empty state
  useSeoMeta({ title: favSeo.title, description: favSeo.desc, lang, noindex: true });

  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const SLUGS: Record<string, string> = { fr: 'favoris', de: 'favoriten', es: 'favoritos', it: 'preferiti', en: 'favorites' };
    document.querySelectorAll('link[data-hreflang-favorites]').forEach(el => el.remove());
    ['fr', 'de', 'es', 'it', 'en'].forEach(l => {
      const el = document.createElement('link');
      el.rel = 'alternate'; el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/${SLUGS[l]}`);
      el.setAttribute('data-hreflang-favorites', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate'; xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/favoris`);
    xd.setAttribute('data-hreflang-favorites', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-favorites]').forEach(el => el.remove()); };
  }, []);


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
                <Link to={`/${lang}/${cardSlug}/${c.id}`} className="group/name">
                  <div className="font-display font-semibold text-white group-hover/name:text-cyan-accent transition-colors">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.issuer}</div>
                </Link>
                {c.badge && <span className="badge-accent">{translateBadge(c.badge, lang)}</span>}
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
                <div className="flex items-center gap-3">
                  {c.brandId && (
                    <Link
                      to={`/${lang}/${brandsSlug}/${c.brandId}`}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-accent transition-colors"
                    >
                      {BRAND_LABEL[lang] || BRAND_LABEL.en}
                    </Link>
                  )}
                </div>
                <a
                  href={getAffiliateLink(c)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-accent transition-colors"
                  onClick={() => trackAffiliateClick(c.name, c.issuer, getAffiliateLink(c), 'favorites', lang)}
                >
                  {ui.see_offer}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bloc éditorial — internal links + UX hint */}
      {(() => {
        const ed = FAV_EDITORIAL[lang] ?? FAV_EDITORIAL.en;
        return (
          <div className="mt-14 border-t border-bg-border pt-10">
            <h2 className="text-xl font-display font-bold text-white mb-4">{ed.h2}</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mb-8">{ed.body}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{ed.related}</p>
            <div className="flex flex-wrap gap-2">
              {ed.links.map(({ key, emoji, label }) => {
                const slug = THEMATIC_ROUTES[key]?.[lang as keyof typeof THEMATIC_ROUTES['best']] ?? THEMATIC_ROUTES[key]?.en;
                if (!slug) return null;
                return (
                  <Link key={key} to={`/${lang}/${slug}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
                    <span aria-hidden="true">{emoji}</span>{label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
