import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const YEAR = new Date().getFullYear();

const LANG_TO_SEGMENT: Record<string, string> = {
  fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards',
};

const COMPARE_SEGMENT: Record<string, string> = {
  fr: 'comparer', de: 'vergleichen', es: 'comparar', it: 'confrontare', en: 'compare',
};

const UI: Record<string, Record<string, string>> = {
  title:       { fr: 'vs', de: 'vs', es: 'vs', it: 'vs', en: 'vs' },
  updated:     { fr: 'Mis à jour', de: 'Aktualisiert', es: 'Actualizado', it: 'Aggiornato', en: 'Updated' },
  cashback:    { fr: 'Cashback', de: 'Cashback', es: 'Cashback', it: 'Cashback', en: 'Cashback' },
  annual_fees: { fr: 'Frais annuels', de: 'Jahresgebühr', es: 'Cuota anual', it: 'Costo annuale', en: 'Annual fees' },
  staking:     { fr: 'Staking requis', de: 'Staking erforderlich', es: 'Staking requerido', it: 'Staking richiesto', en: 'Staking required' },
  network:     { fr: 'Réseau', de: 'Netzwerk', es: 'Red', it: 'Rete', en: 'Network' },
  virtual:     { fr: 'Carte virtuelle', de: 'Virtuelle Karte', es: 'Tarjeta virtual', it: 'Carta virtuale', en: 'Virtual card' },
  trust:       { fr: 'Score de confiance', de: 'Vertrauensscore', es: 'Puntuación confianza', it: 'Punteggio fiducia', en: 'Trust score' },
  free:        { fr: 'Gratuit', de: 'Kostenlos', es: 'Gratis', it: 'Gratuito', en: 'Free' },
  yes:         { fr: 'Oui', de: 'Ja', es: 'Sí', it: 'Sì', en: 'Yes' },
  no:          { fr: 'Non', de: 'Nein', es: 'No', it: 'No', en: 'No' },
  see_card:    { fr: 'Voir la carte', de: 'Karte ansehen', es: 'Ver tarjeta', it: 'Vedi carta', en: 'See card' },
  see_article: { fr: 'Lire l\'avis', de: 'Bewertung lesen', es: 'Leer opinión', it: 'Leggi recensione', en: 'Read review' },
  winner:      { fr: 'Notre choix', de: 'Unsere Wahl', es: 'Nuestra elección', it: 'La nostra scelta', en: 'Our pick' },
  no_staking:  { fr: 'Non requis', de: 'Nicht erforderlich', es: 'No requerido', it: 'Non richiesto', en: 'Not required' },
  not_found:   { fr: 'Carte introuvable', de: 'Karte nicht gefunden', es: 'Tarjeta no encontrada', it: 'Carta non trovata', en: 'Card not found' },
  loading:     { fr: 'Chargement…', de: 'Laden…', es: 'Cargando…', it: 'Caricamento…', en: 'Loading…' },
};

const t = (key: string, lang: string) => UI[key]?.[lang] || UI[key]?.['en'] || key;

interface Card {
  id: string;
  name: string;
  issuer: string;
  cashback_base: number;
  cashback_premium: number;
  annual_fees: number;
  staking_required: number;
  virtual_only: boolean;
  card_network: string;
  trust_score: number | null;
  real_card_image: string | null;
}

const INTRO: Record<string, (a: string, b: string, year: number) => string> = {
  fr: (a, b, y) => `Vous hésitez entre la ${a} et la ${b} ? Ce comparatif ${y} vous aide à choisir selon votre profil : cashback, frais annuels, staking requis et score de confiance sont analysés côte à côte.`,
  de: (a, b, y) => `Sie sind unschlüssig zwischen der ${a} und der ${b}? Dieser Vergleich ${y} hilft Ihnen bei der Wahl: Cashback, Jahresgebühren, Staking-Anforderungen und Vertrauensscore werden nebeneinandergestellt.`,
  es: (a, b, y) => `¿Dudas entre la ${a} y la ${b}? Esta comparativa ${y} te ayuda a elegir: cashback, comisiones anuales, staking requerido y puntuación de confianza se analizan en paralelo.`,
  it: (a, b, y) => `Indeciso tra la ${a} e la ${b}? Questo confronto ${y} ti aiuta a scegliere: cashback, costi annuali, staking richiesto e punteggio di fiducia analizzati fianco a fianco.`,
  en: (a, b, y) => `Can't decide between the ${a} and the ${b}? This ${y} comparison helps you choose: cashback rates, annual fees, staking requirements and trust scores are analysed side by side.`,
};

const CASHBACK_TEXT: Record<string, (winner: string, val: number, loser: string) => string> = {
  fr: (w, v, l) => `Sur le cashback, la ${w} prend l'avantage avec ${v}% contre la ${l}. C'est souvent le critère décisif pour les utilisateurs qui paient régulièrement par carte.`,
  de: (w, v, l) => `Beim Cashback hat die ${w} mit ${v}% gegenüber der ${l} die Nase vorn. Das ist oft das entscheidende Kriterium für regelmäßige Kartennutzer.`,
  es: (w, v, l) => `En cashback, la ${w} tiene ventaja con ${v}% frente a la ${l}. Suele ser el criterio decisivo para quienes pagan habitualmente con tarjeta.`,
  it: (w, v, l) => `Sul cashback, la ${w} è avvantaggiata con ${v}% rispetto alla ${l}. È spesso il criterio decisivo per chi paga regolarmente con carta.`,
  en: (w, v, l) => `On cashback, the ${w} takes the lead with ${v}% against the ${l}. This is often the deciding factor for regular card users.`,
};

const FEES_TEXT: Record<string, (name: string) => string> = {
  fr: (n) => `La ${n} est gratuite, ce qui la rend accessible sans engagement financier initial.`,
  de: (n) => `Die ${n} ist kostenlos und daher ohne finanzielle Vorverpflichtung zugänglich.`,
  es: (n) => `La ${n} es gratuita, lo que la hace accesible sin compromiso financiero inicial.`,
  it: (n) => `La ${n} è gratuita, il che la rende accessibile senza impegno finanziario iniziale.`,
  en: (n) => `The ${n} is free, making it accessible with no upfront financial commitment.`,
};

const VERDICT_TEXT: Record<string, (winner: string, loser: string) => string> = {
  fr: (w, l) => `Au global, la ${w} ressort en tête de ce comparatif. Elle offre un meilleur rapport qualité/conditions que la ${l} sur la majorité des critères analysés. Cela dit, le choix final dépend de votre usage : si un critère spécifique est prioritaire pour vous, la ${l} peut rester pertinente.`,
  de: (w, l) => `Insgesamt liegt die ${w} in diesem Vergleich vorne. Sie bietet ein besseres Preis-Leistungs-Verhältnis als die ${l} bei den meisten analysierten Kriterien. Die endgültige Wahl hängt jedoch von Ihrem Nutzungsverhalten ab.`,
  es: (w, l) => `En general, la ${w} sale adelante en esta comparativa. Ofrece mejor relación calidad/condiciones que la ${l} en la mayoría de criterios analizados. Aun así, la elección final depende de tu uso.`,
  it: (w, l) => `Nel complesso, la ${w} si distingue in questo confronto. Offre un miglior rapporto qualità/condizioni rispetto alla ${l} sulla maggior parte dei criteri analizzati. Tuttavia, la scelta finale dipende dal vostro utilizzo.`,
  en: (w, l) => `Overall, the ${w} comes out ahead in this comparison. It offers a better value-to-conditions ratio than the ${l} across most of the criteria analysed. That said, the final choice depends on your usage.`,
};

function ComparisonText({ cardA, cardB, lang, cashbackA, cashbackB, winner }: {
  cardA: Card; cardB: Card; lang: string;
  cashbackA: number; cashbackB: number; winner: Card | null;
}) {
  const intro = (INTRO[lang] || INTRO.en)(cardA.name, cardB.name, YEAR);

  let cashbackSentence = '';
  if (cashbackA !== cashbackB) {
    const [winCard, winVal, loseCard] = cashbackA > cashbackB
      ? [cardA.name, cashbackA, cardB.name]
      : [cardB.name, cashbackB, cardA.name];
    cashbackSentence = (CASHBACK_TEXT[lang] || CASHBACK_TEXT.en)(winCard, winVal, loseCard);
  }

  const freeCards = [cardA, cardB].filter(c => c.annual_fees === 0);
  const freesSentence = freeCards.length === 1
    ? (FEES_TEXT[lang] || FEES_TEXT.en)(freeCards[0].name)
    : freeCards.length === 2
      ? (FEES_TEXT[lang] || FEES_TEXT.en)(`${cardA.name} et ${cardB.name}`)
      : '';

  const verdictSentence = winner
    ? (VERDICT_TEXT[lang] || VERDICT_TEXT.en)(winner.name, winner.id === cardA.id ? cardB.name : cardA.name)
    : '';

  return (
    <>
      <p>{intro}</p>
      {cashbackSentence && <p>{cashbackSentence}</p>}
      {freesSentence && <p>{freesSentence}</p>}
      {verdictSentence && <p>{verdictSentence}</p>}
    </>
  );
}

function better(a: number | null, b: number | null, higherIsBetter = true): [boolean, boolean] {
  if (a === null || b === null) return [false, false];
  if (a === b) return [false, false];
  return higherIsBetter ? [a > b, a < b] : [a < b, a > b];
}

export default function ComparisonPage() {
  const { lang = 'fr', slug = '' } = useParams<{ lang: string; slug: string }>();
  const [cardA, setCardA] = useState<Card | null>(null);
  const [cardB, setCardB] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const parts = slug.split('-vs-');
  const idA = parts[0] || '';
  const idB = parts.slice(1).join('-vs-') || '';

  useEffect(() => {
    if (!idA || !idB) { setLoading(false); setError('invalid'); return; }

    const COLS = 'id, name, issuer, cashback_base, cashback_premium, annual_fees, staking_required, virtual_only, card_network, trust_score, real_card_image';

    Promise.all([
      supabase.from('cards').select(COLS).eq('id', idA).single(),
      supabase.from('cards').select(COLS).eq('id', idB).single(),
    ]).then(([resA, resB]) => {
      if (resA.error || !resA.data) setError('notfoundA');
      else setCardA(resA.data as Card);
      if (resB.error || !resB.data) setError('notfoundB');
      else setCardB(resB.data as Card);
      setLoading(false);
    });
  }, [idA, idB]);

  const segment = LANG_TO_SEGMENT[lang] || 'cards';

  // SEO
  useEffect(() => {
    if (!cardA || !cardB) return;
    const title = `${cardA.name} vs ${cardB.name} ${YEAR} — Comparatif | TopCryptoCards`;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = `Comparatif ${cardA.name} vs ${cardB.name} en ${YEAR} : cashback, frais, staking, réseau. Quelle carte crypto choisir ?`;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = window.location.origin + window.location.pathname;
  }, [cardA, cardB]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center text-slate-400">
        {t('loading', lang)}
      </div>
    );
  }

  if (error || !cardA || !cardB) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center text-slate-400">
        {t('not_found', lang)}
      </div>
    );
  }

  const cashbackA = cardA.cashback_premium || cardA.cashback_base || 0;
  const cashbackB = cardB.cashback_premium || cardB.cashback_base || 0;
  const [cbAwin, cbBwin] = better(cashbackA, cashbackB, true);
  const [feesAwin, feesBwin] = better(cardA.annual_fees, cardB.annual_fees, false);
  const [stakingAwin, stakingBwin] = better(cardA.staking_required, cardB.staking_required, false);
  const [trustAwin, trustBwin] = better(cardA.trust_score ?? 0, cardB.trust_score ?? 0, true);

  const scoreA = [cbAwin, feesAwin, stakingAwin, trustAwin].filter(Boolean).length;
  const scoreB = [cbBwin, feesBwin, stakingBwin, trustBwin].filter(Boolean).length;
  const winner = scoreA > scoreB ? cardA : scoreB > scoreA ? cardB : null;

  const Row = ({
    label, valA, valB, winA, winB,
  }: { label: string; valA: string; valB: string; winA: boolean; winB: boolean }) => (
    <tr className="border-b border-slate-800">
      <td className="py-3 px-4 text-slate-400 text-sm">{label}</td>
      <td className={`py-3 px-4 text-center text-sm font-medium ${winA ? 'text-cyan-400' : 'text-white'}`}>
        {winA && <span className="mr-1">✓</span>}{valA}
      </td>
      <td className={`py-3 px-4 text-center text-sm font-medium ${winB ? 'text-cyan-400' : 'text-white'}`}>
        {winB && <span className="mr-1">✓</span>}{valB}
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <p className="text-slate-400 text-xs mb-4">
        {t('updated', lang)} {new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long' })}
      </p>
      <h1 className="text-3xl font-bold text-white mb-8">
        {cardA.name} <span className="text-cyan-400">vs</span> {cardB.name} {YEAR}
      </h1>

      {/* Card headers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[cardA, cardB].map((card) => (
          <div key={card.id} className="card-surface p-5 rounded-xl text-center">
            {card.real_card_image && (
              <div style={{ borderRadius: '12px', overflow: 'hidden', width: '100%', aspectRatio: '1.586', marginBottom: '12px' }}>
  <img src={card.real_card_image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
</div>
            )}
            <h2 className="text-white font-semibold text-lg">{card.name}</h2>
            <p className="text-slate-400 text-sm mb-4">{card.issuer}</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Link
                to={`/${lang}/${segment}/${card.id}`}
                className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full hover:bg-cyan-500/30 transition-colors"
              >
                {t('see_card', lang)}
              </Link>
              <Link
                to={`/${lang}/${segment}/${card.id}`}
                className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-600 transition-colors"
              >
                {t('see_article', lang)}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="card-surface rounded-xl overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3 px-4 text-left text-slate-500 text-xs uppercase tracking-wider w-1/3"></th>
              <th className="py-3 px-4 text-center text-white font-semibold">{cardA.name}</th>
              <th className="py-3 px-4 text-center text-white font-semibold">{cardB.name}</th>
            </tr>
          </thead>
          <tbody>
            <Row
              label={t('cashback', lang)}
              valA={cashbackA > 0 ? `${cashbackA}%` : '—'}
              valB={cashbackB > 0 ? `${cashbackB}%` : '—'}
              winA={cbAwin}
              winB={cbBwin}
            />
            <Row
              label={t('annual_fees', lang)}
              valA={cardA.annual_fees > 0 ? `${cardA.annual_fees} €/an` : t('free', lang)}
              valB={cardB.annual_fees > 0 ? `${cardB.annual_fees} €/an` : t('free', lang)}
              winA={feesAwin}
              winB={feesBwin}
            />
            <Row
              label={t('staking', lang)}
              valA={cardA.staking_required > 0 ? `${cardA.staking_required} €` : t('no_staking', lang)}
              valB={cardB.staking_required > 0 ? `${cardB.staking_required} €` : t('no_staking', lang)}
              winA={stakingAwin}
              winB={stakingBwin}
            />
            <Row
              label={t('network', lang)}
              valA={cardA.card_network}
              valB={cardB.card_network}
              winA={false}
              winB={false}
            />
            <Row
              label={t('virtual', lang)}
              valA={cardA.virtual_only ? t('yes', lang) : t('no', lang)}
              valB={cardB.virtual_only ? t('yes', lang) : t('no', lang)}
              winA={false}
              winB={false}
            />
            {(cardA.trust_score !== null || cardB.trust_score !== null) && (
              <Row
                label={t('trust', lang)}
                valA={cardA.trust_score !== null ? `${cardA.trust_score}/100` : '—'}
                valB={cardB.trust_score !== null ? `${cardB.trust_score}/100` : '—'}
                winA={trustAwin}
                winB={trustBwin}
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Winner banner */}
      {winner && (
        <div className="card-surface border border-cyan-500/30 rounded-xl p-5 mb-8 text-center">
          <p className="text-slate-400 text-sm mb-1">{t('winner', lang)}</p>
          <p className="text-white font-bold text-xl text-cyan-400">{winner.name}</p>
        </div>
      )}

      {/* SEO text */}
      <div className="prose prose-invert max-w-none text-slate-300 space-y-4 mb-10 text-sm leading-relaxed">
        <ComparisonText cardA={cardA} cardB={cardB} lang={lang}
          cashbackA={cashbackA} cashbackB={cashbackB} winner={winner} />
      </div>

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${cardA.name} vs ${cardB.name} ${YEAR}`,
        description: `Comparatif ${cardA.name} vs ${cardB.name} : cashback, frais, staking.`,
        url: window.location.href,
      }) }} />
    </div>
  );
}
