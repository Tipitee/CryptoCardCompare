import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from 'lucide-react';
import { fetchCards } from '../lib/supabase';
import type { CryptoCard } from '../types/card';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import Breadcrumb from '../components/Breadcrumb';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR, fmtPct } from '../utils/format';

const BASE = 'https://topcryptocards.eu';

/* ── i18n ───────────────────────────────────────────────────────────────────── */
const COPY: Record<string, {
  title: string; h1: string; description: string;
  intro: string; note: string;
  thLabel: string; thFees: string; thStaking: string;
  thCbBase: string; thCbMax: string; thWithdrawals: string;
  thNetwork: string; thMarkets: string; thDetails: string;
  free: string; yes: string; no: string; eu: string; fr: string; global: string;
  loading: string; compareLink: string; lastUpdated: string;
  perYear: string;
  bestLink: string; bestLabel: string; simLink: string; simLabel: string;
}> = {
  fr: {
    title:       `Frais Cartes Crypto ${new Date().getFullYear()} — Tableau Comparatif Complet | TopCryptoCards`,
    h1:          `Index des Frais des Cartes Crypto en ${new Date().getFullYear()}`,
    description: `Tableau complet des frais de toutes les cartes crypto disponibles en Europe : frais annuels, staking requis, cashback, retraits. Mis à jour ${new Date().getFullYear()}.`,
    intro:       `Un index des frais de cartes crypto est un tableau de référence listant, pour chaque carte Visa ou Mastercard crypto disponible en Europe, l'ensemble des coûts réels : frais annuels, montant de staking requis, taux de cashback de base et maximum, politique de retrait ATM et réseau de paiement. Ce tableau est mis à jour régulièrement à partir des données officielles des émetteurs.`,
    note:        `Les frais de staking sont exprimés en valeur nominale au moment de la mise à jour. La valeur réelle en euros dépend du cours du token au moment de l'engagement. Les frais de change (0% pour la plupart des cartes listées) et les limites mensuelles de cashback peuvent varier selon le niveau de carte.`,
    thLabel:     'Carte',
    thFees:      'Frais annuels',
    thStaking:   'Staking requis',
    thCbBase:    'Cashback base',
    thCbMax:     'Cashback max',
    thWithdrawals: 'Retrait ATM gratuit',
    thNetwork:   'Réseau',
    thMarkets:   'Marchés',
    thDetails:   'Détails',
    free:        'Gratuit',
    yes:         'Oui',
    no:          'Non',
    eu:          'EU',
    fr:          'FR',
    global:      'Mondial',
    loading:     'Chargement…',
    compareLink: 'Comparer les cartes en détail →',
    lastUpdated: `Données mises à jour en juillet ${new Date().getFullYear()}`,
    perYear:     '/an',
    bestLink:    'meilleure-carte-crypto',
    bestLabel:   'Voir le classement des meilleures cartes crypto →',
    simLink:     'simulateur',
    simLabel:    'Simuler mon cashback annuel →',
  },
  de: {
    title:       `Krypto-Karten Gebühren ${new Date().getFullYear()} — Vollständiger Vergleich | TopCryptoCards`,
    h1:          `Gebühren-Index Krypto-Karten ${new Date().getFullYear()}`,
    description: `Vollständige Gebührentabelle aller Krypto-Karten in Europa: Jahresgebühren, Staking, Cashback, Abhebungen. Aktualisiert ${new Date().getFullYear()}.`,
    intro:       `Ein Krypto-Karten-Gebührenindex ist eine Referenztabelle, die für jede in Europa verfügbare Visa- oder Mastercard-Kryptokarte alle tatsächlichen Kosten auflistet: Jahresgebühren, erforderlicher Staking-Betrag, Basis- und maximale Cashback-Sätze, ATM-Abhebungsrichtlinie und Zahlungsnetzwerk. Diese Tabelle wird regelmäßig anhand offizieller Emittentendaten aktualisiert.`,
    note:        `Staking-Beträge werden zum Nennwert zum Zeitpunkt der Aktualisierung angegeben. Der tatsächliche Euro-Wert hängt vom Token-Kurs zum Zeitpunkt der Verpflichtung ab.`,
    thLabel:     'Karte',
    thFees:      'Jahresgebühren',
    thStaking:   'Staking-Pflicht',
    thCbBase:    'Basis-Cashback',
    thCbMax:     'Max. Cashback',
    thWithdrawals: 'Gratis ATM-Abhebung',
    thNetwork:   'Netzwerk',
    thMarkets:   'Märkte',
    thDetails:   'Details',
    free:        'Kostenlos',
    yes:         'Ja',
    no:          'Nein',
    eu:          'EU',
    fr:          'FR',
    global:      'Weltweit',
    loading:     'Laden…',
    compareLink: 'Karten im Detail vergleichen →',
    lastUpdated: `Daten aktualisiert Juli ${new Date().getFullYear()}`,
    perYear:     '/Jahr',
    bestLink:    'beste-krypto-karte',
    bestLabel:   'Zum Ranking der besten Krypto-Karten →',
    simLink:     'simulator',
    simLabel:    'Meinen jährlichen Cashback simulieren →',
  },
  es: {
    title:       `Tarifas Tarjetas Crypto ${new Date().getFullYear()} — Comparativa Completa | TopCryptoCards`,
    h1:          `Índice de Tarifas de Tarjetas Crypto en ${new Date().getFullYear()}`,
    description: `Tabla completa de tarifas de todas las tarjetas crypto disponibles en Europa: cuota anual, staking, cashback, retiradas. Actualizado ${new Date().getFullYear()}.`,
    intro:       `Un índice de tarifas de tarjetas crypto es una tabla de referencia que lista, para cada tarjeta Visa o Mastercard crypto disponible en Europa, todos los costes reales: cuota anual, importe de staking requerido, tasas de cashback base y máxima, política de retirada en cajeros y red de pago. Esta tabla se actualiza regularmente con datos oficiales de los emisores.`,
    note:        `Los importes de staking se expresan en valor nominal en el momento de la actualización. El valor real en euros depende del precio del token en el momento del compromiso.`,
    thLabel:     'Tarjeta',
    thFees:      'Cuota anual',
    thStaking:   'Staking requerido',
    thCbBase:    'Cashback base',
    thCbMax:     'Cashback máx.',
    thWithdrawals: 'Retirada ATM gratis',
    thNetwork:   'Red',
    thMarkets:   'Mercados',
    thDetails:   'Detalles',
    free:        'Gratis',
    yes:         'Sí',
    no:          'No',
    eu:          'UE',
    fr:          'FR',
    global:      'Mundial',
    loading:     'Cargando…',
    compareLink: 'Comparar tarjetas en detalle →',
    lastUpdated: `Datos actualizados julio ${new Date().getFullYear()}`,
    perYear:     '/año',
    bestLink:    'mejor-tarjeta-crypto',
    bestLabel:   'Ver el ranking de las mejores tarjetas crypto →',
    simLink:     'simulador',
    simLabel:    'Simular mi cashback anual →',
  },
  it: {
    title:       `Tariffe Carte Crypto ${new Date().getFullYear()} — Confronto Completo | TopCryptoCards`,
    h1:          `Indice delle Tariffe delle Carte Crypto nel ${new Date().getFullYear()}`,
    description: `Tabella completa delle tariffe di tutte le carte crypto disponibili in Europa: quota annua, staking, cashback, prelievi. Aggiornato ${new Date().getFullYear()}.`,
    intro:       `Un indice delle tariffe delle carte crypto è una tabella di riferimento che elenca, per ogni carta Visa o Mastercard crypto disponibile in Europa, tutti i costi reali: quota annua, importo di staking richiesto, tassi di cashback base e massimo, politica di prelievo ATM e rete di pagamento. Questa tabella viene aggiornata regolarmente con i dati ufficiali degli emittenti.`,
    note:        `Gli importi di staking sono espressi al valore nominale al momento dell'aggiornamento. Il valore reale in euro dipende dal prezzo del token al momento dell'impegno.`,
    thLabel:     'Carta',
    thFees:      'Quota annua',
    thStaking:   'Staking richiesto',
    thCbBase:    'Cashback base',
    thCbMax:     'Cashback max.',
    thWithdrawals: 'Prelievo ATM gratuito',
    thNetwork:   'Rete',
    thMarkets:   'Mercati',
    thDetails:   'Dettagli',
    free:        'Gratuito',
    yes:         'Sì',
    no:          'No',
    eu:          'UE',
    fr:          'FR',
    global:      'Mondiale',
    loading:     'Caricamento…',
    compareLink: 'Confronta le carte in dettaglio →',
    lastUpdated: `Dati aggiornati luglio ${new Date().getFullYear()}`,
    perYear:     '/anno',
    bestLink:    'migliore-carta-crypto',
    bestLabel:   'Vedi il ranking delle migliori carte crypto →',
    simLink:     'simulatore',
    simLabel:    'Simula il mio cashback annuo →',
  },
  en: {
    title:       `Crypto Card Fees ${new Date().getFullYear()} — Complete Comparison Table | TopCryptoCards`,
    h1:          `Crypto Card Fee Index ${new Date().getFullYear()}`,
    description: `Complete fee table for all crypto cards available in Europe: annual fees, staking requirements, cashback rates, ATM withdrawals. Updated ${new Date().getFullYear()}.`,
    intro:       `A crypto card fee index is a reference table listing, for every Visa or Mastercard crypto card available in Europe, all the real costs: annual fees, required staking amount, base and maximum cashback rates, ATM withdrawal policy, and payment network. This table is updated regularly from official issuer data.`,
    note:        `Staking amounts are expressed at nominal value at the time of update. The actual euro value depends on the token price at the time of commitment. Exchange fees (0% for most listed cards) and monthly cashback caps may vary by card tier.`,
    thLabel:     'Card',
    thFees:      'Annual fees',
    thStaking:   'Staking required',
    thCbBase:    'Base cashback',
    thCbMax:     'Max cashback',
    thWithdrawals: 'Free ATM withdrawal',
    thNetwork:   'Network',
    thMarkets:   'Markets',
    thDetails:   'Details',
    free:        'Free',
    yes:         'Yes',
    no:          'No',
    eu:          'EU',
    fr:          'FR',
    global:      'Global',
    loading:     'Loading…',
    compareLink: 'Compare cards in detail →',
    lastUpdated: `Data updated July ${new Date().getFullYear()}`,
    perYear:     '/year',
    bestLink:    'best-crypto-card',
    bestLabel:   'See the best crypto card ranking →',
    simLink:     'simulator',
    simLabel:    'Simulate my annual cashback →',
  },
};

// Propagate be→fr and at→de aliases into COPY (with country-specific overrides)
COPY.be = {
  ...COPY.fr,
  title:       `Frais Cartes Crypto Belgique ${new Date().getFullYear()} — Comparatif | TopCryptoCards`,
  h1:          `Index des Frais des Cartes Crypto en Belgique ${new Date().getFullYear()}`,
  description: `Tableau complet des frais cartes crypto disponibles en Belgique : frais annuels, staking, cashback, retraits. Mis à jour ${new Date().getFullYear()}.`,
  intro:       `Un index des frais de cartes crypto est un tableau de référence listant, pour chaque carte Visa ou Mastercard crypto disponible en Belgique, l'ensemble des coûts réels : frais annuels, montant de staking requis, taux de cashback de base et maximum, politique de retrait ATM et réseau de paiement. Ce tableau couvre uniquement les cartes accessibles depuis la Belgique et est mis à jour régulièrement à partir des données officielles des émetteurs.`,
  bestLink:    'carte-crypto-belgique',
  bestLabel:   'Voir les meilleures cartes crypto en Belgique →',
};
COPY.at = {
  ...COPY.de,
  title:       `Krypto-Karten Gebühren Österreich ${new Date().getFullYear()} — Vergleich | TopCryptoCards`,
  h1:          `Gebühren-Index Krypto-Karten Österreich ${new Date().getFullYear()}`,
  description: `Vollständige Gebührentabelle aller Krypto-Karten in Österreich: Jahresgebühren, Staking, Cashback, Abhebungen. Aktualisiert ${new Date().getFullYear()}.`,
  intro:       `Ein Krypto-Karten-Gebührenindex ist eine Referenztabelle, die für jede in Österreich verfügbare Visa- oder Mastercard-Kryptokarte alle tatsächlichen Kosten auflistet: Jahresgebühren, erforderlicher Staking-Betrag, Basis- und maximale Cashback-Sätze, ATM-Abhebungsrichtlinie und Zahlungsnetzwerk. Diese Tabelle umfasst ausschließlich in Österreich verfügbare Karten und wird regelmäßig anhand offizieller Emittentendaten aktualisiert.`,
  bestLink:    'krypto-karte-oesterreich',
  bestLabel:   'Die besten Krypto-Karten in Österreich ansehen →',
};

type SortKey = 'name' | 'annualFees' | 'stakingRequired' | 'cashbackBase' | 'cashbackPremium';

export default function FeeIndexPage() {
  const lang = useLanguage();
  const c = COPY[lang] ?? COPY.en;
  const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;

  const [cards, setCards] = useState<CryptoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('annualFees');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchCards(lang)
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [lang]);

  /* ── SEO ───────────────────────────────────────────────────────────────────── */
  useSeoMeta({ title: c.title, description: c.description, lang });

  useHreflang(
    (l) => {
      const slug = ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS]?.feeIndex;
      return slug ? `${BASE}/${l}/${slug}` : null;
    },
    [],
  );

  /* ── Schema.org Dataset ────────────────────────────────────────────────────── */
  useEffect(() => {
    document.getElementById('schema-fee-index')?.remove();
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: c.h1,
      description: c.description,
      url: `${BASE}/${lang}/${rt.feeIndex ?? 'crypto-card-fees'}`,
      inLanguage: lang,
      publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: BASE },
      license: 'https://creativecommons.org/licenses/by/4.0/',
      dateModified: new Date().toISOString().split('T')[0],
      variableMeasured: ['Annual fees', 'Staking required', 'Cashback rate', 'ATM withdrawal'],
    };
    const el = document.createElement('script');
    el.id = 'schema-fee-index';
    el.type = 'application/ld+json';
    el.text = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-fee-index')?.remove(); };
  }, [lang, c.h1, c.description, rt.feeIndex]);

  /* ── Sorting ────────────────────────────────────────────────────────────────── */
  const sorted = useMemo(() => {
    return [...cards].sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortKey === 'name') { av = a.name; bv = b.name; }
      else if (sortKey === 'annualFees') { av = a.annualFees; bv = b.annualFees; }
      else if (sortKey === 'stakingRequired') { av = a.stakingRequired; bv = b.stakingRequired; }
      else if (sortKey === 'cashbackBase') { av = a.cashbackBase; bv = b.cashbackBase; }
      else if (sortKey === 'cashbackPremium') { av = a.cashbackPremium; bv = b.cashbackPremium; }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [cards, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  }

  const cardSlug = rt.cards ?? 'cards';
  const compareSlug = rt.compare ?? 'compare';

  const breadcrumb = [
    { label: ({ fr: 'Accueil', be: 'Accueil', de: 'Startseite', at: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' } as Record<string,string>)[lang] ?? 'Home', href: `/${lang}` },
    { label: c.h1 },
  ];

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      {/* Breadcrumb */}
      <div className="container-app pt-6 pb-2">
        <Breadcrumb items={breadcrumb} />
      </div>

      {/* Hero */}
      <div className="container-app pb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{c.h1}</h1>
        <p className="text-slate-300 text-base leading-relaxed max-w-3xl">{c.intro}</p>
      </div>

      {/* Table */}
      <div className="container-app">
        {loading ? (
          <div className="card-surface p-10 text-center text-slate-400 animate-pulse">{c.loading}</div>
        ) : (
          <div className="card-surface overflow-x-auto scrollbar-thin">
            <table className="min-w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-bg-border bg-bg-elevated/50">
                  {/* Card name */}
                  <th
                    className="sticky left-0 z-10 bg-bg-elevated px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-white min-w-[180px] shadow-[4px_0_8px_rgba(0,0,0,0.4)]"
                    onClick={() => handleSort('name')}
                  >
                    <span className="inline-flex items-center gap-1">{c.thLabel} <SortIcon k="name" /></span>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => handleSort('annualFees')}>
                    <span className="inline-flex items-center gap-1">{c.thFees} <SortIcon k="annualFees" /></span>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => handleSort('stakingRequired')}>
                    <span className="inline-flex items-center gap-1">{c.thStaking} <SortIcon k="stakingRequired" /></span>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => handleSort('cashbackBase')}>
                    <span className="inline-flex items-center gap-1">{c.thCbBase} <SortIcon k="cashbackBase" /></span>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => handleSort('cashbackPremium')}>
                    <span className="inline-flex items-center gap-1">{c.thCbMax} <SortIcon k="cashbackPremium" /></span>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{c.thWithdrawals}</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{c.thNetwork}</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{c.thMarkets}</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{c.thDetails}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((card) => {
                  const markets = card.markets?.length
                    ? card.markets.map(m => m === 'global' ? c.global : m.toUpperCase())
                    : [c.global];

                  return (
                    <tr key={card.id} className="border-b border-bg-border hover:bg-bg-elevated/40 transition-colors">
                      {/* Name — sticky */}
                      <td className="sticky left-0 z-10 bg-bg-card px-4 py-3 shadow-[4px_0_8px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center gap-2">
                          <SmartCardImage card={card} size="xs" />
                          <div>
                            <div className="font-semibold text-white text-sm leading-tight">{card.name}</div>
                            <div className="text-xs text-slate-400">{card.issuer}</div>
                          </div>
                        </div>
                      </td>
                      {/* Annual fees */}
                      <td className="px-4 py-3 text-center">
                        {card.annualFees === 0
                          ? <span className="text-green-accent font-semibold">{c.free}</span>
                          : <span className="text-white font-semibold">{fmtEUR(card.annualFees)}{c.perYear}</span>
                        }
                      </td>
                      {/* Staking */}
                      <td className="px-4 py-3 text-center">
                        {card.stakingRequired === 0
                          ? <span className="text-green-accent font-semibold">—</span>
                          : <span className="text-amber-400 font-semibold">{fmtEUR(card.stakingRequired)}</span>
                        }
                      </td>
                      {/* Cashback base */}
                      <td className="px-4 py-3 text-center font-semibold text-cyan-accent">
                        {card.cashbackBase > 0 ? fmtPct(card.cashbackBase) : '—'}
                      </td>
                      {/* Cashback max */}
                      <td className="px-4 py-3 text-center font-semibold text-cyan-accent">
                        {card.cashbackPremium > 0 ? fmtPct(card.cashbackPremium) : '—'}
                      </td>
                      {/* Free withdrawals */}
                      <td className="px-4 py-3 text-center">
                        {card.freeWithdrawals
                          ? <span className="text-green-accent">{c.yes}</span>
                          : <span className="text-slate-400">{c.no}</span>
                        }
                      </td>
                      {/* Network */}
                      <td className="px-4 py-3 text-center text-slate-300 whitespace-nowrap">{card.cardNetwork}</td>
                      {/* Markets */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-slate-300 text-xs">{markets.join(', ')}</span>
                      </td>
                      {/* Detail link */}
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/${lang}/${cardSlug}/${card.id}`}
                          className="text-cyan-accent hover:underline text-xs inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {c.thDetails}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Note */}
        <p className="mt-4 text-xs text-slate-400 leading-relaxed max-w-3xl">{c.note}</p>
        <p className="mt-1 text-xs text-slate-600">{c.lastUpdated}</p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to={`/${lang}/${compareSlug}`}
            className="inline-flex items-center gap-2 text-cyan-accent hover:underline font-medium"
          >
            {c.compareLink}
          </Link>
          <Link
            to={`/${lang}/${c.bestLink}`}
            className="inline-flex items-center gap-2 text-cyan-accent hover:underline font-medium"
          >
            {c.bestLabel}
          </Link>
          <Link
            to={`/${lang}/${c.simLink}`}
            className="inline-flex items-center gap-2 text-cyan-accent hover:underline font-medium"
          >
            {c.simLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
