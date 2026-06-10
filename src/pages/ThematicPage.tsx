import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import type { CryptoCard } from '../types/card';
import CardDetailDrawer from '../components/CardDetailDrawer';

const YEAR = new Date().getFullYear();

const LANG_TO_SEGMENT: Record<string, string> = {
  fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards',
};

const THEME_CONFIG: Record<string, Record<string, { title: string; h1: string; description: string; intro: string }>> = {
  best: {
    fr: { title: `Meilleure Carte Crypto ${YEAR} — Comparatif Complet | TopCryptoCards`, h1: `Les Meilleures Cartes Crypto en ${YEAR}`, description: `Comparez les meilleures cartes crypto disponibles en France. Cashback, frais, régulation : notre sélection complète mise à jour en ${YEAR}.`, intro: `Choisir la meilleure carte crypto n'est pas une décision à prendre à la légère. Cashback, frais annuels, staking requis, disponibilité en France, régulation : les critères sont nombreux et varient selon votre profil. Ce comparatif rassemble toutes les cartes crypto disponibles en ${YEAR}, classées par fiabilité et pertinence.` },
    de: { title: `Beste Krypto Karte ${YEAR} — Vollständiger Vergleich | TopCryptoCards`, h1: `Die besten Krypto-Karten ${YEAR}`, description: `Vergleichen Sie die besten Krypto-Karten in Deutschland. Cashback, Gebühren, Regulierung: unsere vollständige Auswahl ${YEAR}.`, intro: `Die Wahl der besten Krypto-Karte ist keine einfache Entscheidung. Cashback, Jahresgebühren, Staking-Anforderungen, Verfügbarkeit in Deutschland, Regulierung: die Kriterien sind zahlreich. Dieser Vergleich bringt alle in ${YEAR} verfügbaren Krypto-Karten zusammen.` },
    es: { title: `Mejor Tarjeta Crypto ${YEAR} — Comparativa Completa | TopCryptoCards`, h1: `Las Mejores Tarjetas Crypto en ${YEAR}`, description: `Compara las mejores tarjetas crypto disponibles en España. Cashback, comisiones, regulación: nuestra selección completa ${YEAR}.`, intro: `Elegir la mejor tarjeta crypto no es una decisión fácil. Cashback, comisiones anuales, staking requerido, disponibilidad en España, regulación: los criterios son numerosos. Esta comparativa reúne todas las tarjetas crypto disponibles en ${YEAR}.` },
    it: { title: `Migliore Carta Crypto ${YEAR} — Confronto Completo | TopCryptoCards`, h1: `Le Migliori Carte Crypto nel ${YEAR}`, description: `Confronta le migliori carte crypto disponibili in Italia. Cashback, commissioni, regolamentazione: la nostra selezione completa ${YEAR}.`, intro: `Scegliere la migliore carta crypto non è una decisione semplice. Cashback, costi annuali, staking richiesto, disponibilità in Italia, regolamentazione: i criteri sono numerosi. Questo confronto raccoglie tutte le carte crypto disponibili nel ${YEAR}.` },
    en: { title: `Best Crypto Card ${YEAR} — Full Comparison | TopCryptoCards`, h1: `The Best Crypto Cards in ${YEAR}`, description: `Compare the best crypto cards available in Europe. Cashback, fees, regulation: our complete selection updated for ${YEAR}.`, intro: `Choosing the best crypto card is not a simple decision. Cashback rates, annual fees, staking requirements, availability, and regulation all vary significantly. This comparison covers all crypto cards available in ${YEAR}, ranked by reliability and value.` },
  },
  cashback: {
    fr: { title: `Carte Crypto Cashback ${YEAR} — Jusqu'à 8% de Récompenses | TopCryptoCards`, h1: `Cartes Crypto avec le Meilleur Cashback`, description: `Classement des cartes crypto avec le meilleur cashback en ${YEAR}. De 1% à 8% selon les cartes, trouvez la plus rentable.`, intro: `Le cashback est l'avantage principal des cartes crypto : chaque achat vous rapporte des cryptomonnaies. Mais les taux varient considérablement, de 0.5% à 8% selon les cartes et les conditions. Ce classement compare les cartes crypto avec le meilleur cashback disponibles en ${YEAR}.` },
    de: { title: `Krypto Karte Cashback ${YEAR} — Bis zu 8% Belohnungen | TopCryptoCards`, h1: `Krypto-Karten mit dem besten Cashback`, description: `Ranking der Krypto-Karten mit dem besten Cashback ${YEAR}. Von 1% bis 8%, finden Sie die profitabelste.`, intro: `Cashback ist der Hauptvorteil von Krypto-Karten: Jeder Kauf bringt Ihnen Kryptowährungen ein. Die Sätze variieren jedoch erheblich, von 0,5% bis 8%. Dieses Ranking vergleicht Krypto-Karten mit dem besten Cashback in ${YEAR}.` },
    es: { title: `Tarjeta Crypto Cashback ${YEAR} — Hasta 8% de Recompensas | TopCryptoCards`, h1: `Tarjetas Crypto con el Mejor Cashback`, description: `Clasificación de tarjetas crypto con el mejor cashback en ${YEAR}. Del 1% al 8%, encuentra la más rentable.`, intro: `El cashback es la principal ventaja de las tarjetas crypto: cada compra te genera criptomonedas. Pero las tasas varían considerablemente, del 0,5% al 8%. Esta clasificación compara las tarjetas crypto con el mejor cashback disponibles en ${YEAR}.` },
    it: { title: `Carta Crypto Cashback ${YEAR} — Fino all'8% di Ricompense | TopCryptoCards`, h1: `Carte Crypto con il Miglior Cashback`, description: `Classifica delle carte crypto con il miglior cashback nel ${YEAR}. Dall'1% all'8%, trova la più redditizia.`, intro: `Il cashback è il principale vantaggio delle carte crypto: ogni acquisto ti fa guadagnare criptovalute. Ma i tassi variano notevolmente, dallo 0,5% all'8%. Questa classifica confronta le carte crypto con il miglior cashback disponibili nel ${YEAR}.` },
    en: { title: `Crypto Card Cashback ${YEAR} — Up to 8% Rewards | TopCryptoCards`, h1: `Crypto Cards with the Best Cashback`, description: `Ranking of crypto cards with the best cashback in ${YEAR}. From 1% to 8%, find the most profitable one.`, intro: `Cashback is the main advantage of crypto cards: every purchase earns you cryptocurrency. But rates vary significantly, from 0.5% to 8%. This ranking compares the best cashback crypto cards available in ${YEAR}.` },
  },
  'no-fees': {
    fr: { title: `Carte Crypto Sans Frais ${YEAR} — Gratuite et avec Cashback | TopCryptoCards`, h1: `Cartes Crypto Sans Frais Annuels en ${YEAR}`, description: `Les meilleures cartes crypto sans frais annuels en ${YEAR}. Cashback sans abonnement, sans engagement.`, intro: `Pourquoi payer un abonnement annuel pour une carte crypto quand des alternatives gratuites offrent d'excellents taux de cashback ? Ce comparatif liste toutes les cartes crypto sans frais annuels disponibles en ${YEAR}, classées par cashback décroissant.` },
    de: { title: `Kostenlose Krypto Karte ${YEAR} — Ohne Jahresgebühr | TopCryptoCards`, h1: `Kostenlose Krypto-Karten ohne Jahresgebühr`, description: `Die besten kostenlosen Krypto-Karten ${YEAR}. Cashback ohne Jahresgebühr.`, intro: `Warum eine Jahresgebühr für eine Krypto-Karte zahlen, wenn kostenlose Alternativen hervorragende Cashback-Raten bieten? Dieser Vergleich listet alle kostenlosen Krypto-Karten in ${YEAR}.` },
    es: { title: `Tarjeta Crypto Sin Comisiones ${YEAR} — Gratis y con Cashback | TopCryptoCards`, h1: `Tarjetas Crypto Gratuitas sin Cuota Anual`, description: `Las mejores tarjetas crypto sin comisiones anuales en ${YEAR}. Cashback sin suscripción.`, intro: `¿Por qué pagar una cuota anual por una tarjeta crypto cuando hay alternativas gratuitas con excelentes tasas de cashback? Esta comparativa lista todas las tarjetas crypto sin comisiones anuales disponibles en ${YEAR}.` },
    it: { title: `Carta Crypto Senza Costi ${YEAR} — Gratuita e con Cashback | TopCryptoCards`, h1: `Carte Crypto Gratuite Senza Costi Annuali`, description: `Le migliori carte crypto senza costi annuali nel ${YEAR}. Cashback senza abbonamento.`, intro: `Perché pagare un abbonamento annuale per una carta crypto quando esistono alternative gratuite con ottimi tassi di cashback? Questo confronto elenca tutte le carte crypto senza costi annuali disponibili nel ${YEAR}.` },
    en: { title: `Free Crypto Card ${YEAR} — No Annual Fees + Cashback | TopCryptoCards`, h1: `Crypto Cards with No Annual Fees`, description: `The best free crypto cards in ${YEAR}. Cashback with no subscription, no commitment.`, intro: `Why pay an annual fee for a crypto card when free alternatives offer excellent cashback rates? This comparison lists all no-fee crypto cards available in ${YEAR}, ranked by cashback rate.` },
  },
  'no-staking': {
    fr: { title: `Carte Crypto Sans Staking ${YEAR} — Cashback Sans Conditions | TopCryptoCards`, h1: `Cartes Crypto Sans Staking Requis`, description: `Cartes crypto avec cashback sans obligation de staking en ${YEAR}. Aucun dépôt bloqué requis.`, intro: `Le staking obligatoire est la principale contrainte des cartes crypto premium : il faut immobiliser des milliers d'euros en cryptomonnaies pour débloquer le cashback. Ces cartes offrent un cashback sans aucune obligation de staking, accessibles immédiatement.` },
    de: { title: `Krypto Karte Ohne Staking ${YEAR} — Cashback Ohne Bedingungen | TopCryptoCards`, h1: `Krypto-Karten Ohne Staking-Pflicht`, description: `Krypto-Karten mit Cashback ohne Staking-Anforderung ${YEAR}. Keine gesperrten Gelder erforderlich.`, intro: `Pflicht-Staking ist die Haupteinschränkung bei Premium-Krypto-Karten. Diese Karten bieten Cashback ohne jede Staking-Verpflichtung.` },
    es: { title: `Tarjeta Crypto Sin Staking ${YEAR} — Cashback Sin Condiciones | TopCryptoCards`, h1: `Tarjetas Crypto Sin Staking Requerido`, description: `Tarjetas crypto con cashback sin obligación de staking en ${YEAR}. Sin fondos bloqueados.`, intro: `El staking obligatorio es la principal restricción de las tarjetas crypto premium. Estas tarjetas ofrecen cashback sin ninguna obligación de staking.` },
    it: { title: `Carta Crypto Senza Staking ${YEAR} — Cashback Senza Condizioni | TopCryptoCards`, h1: `Carte Crypto Senza Staking Richiesto`, description: `Carte crypto con cashback senza obbligo di staking nel ${YEAR}. Nessun deposito bloccato.`, intro: `Lo staking obbligatorio è il principale limite delle carte crypto premium. Queste carte offrono cashback senza alcun obbligo di staking.` },
    en: { title: `Crypto Card No Staking ${YEAR} — Cashback Without Conditions | TopCryptoCards`, h1: `Crypto Cards Without Staking Requirements`, description: `Crypto cards with cashback and no staking requirement in ${YEAR}. No locked funds required.`, intro: `Mandatory staking is the main drawback of premium crypto cards. These cards offer cashback with no staking obligation whatsoever — your funds stay free.` },
  },
  france: {
    fr: { title: `Carte Crypto France ${YEAR} — Disponibles et Légales en France | TopCryptoCards`, h1: `Cartes Crypto Disponibles en France`, description: `Les meilleures cartes crypto disponibles et légales en France en ${YEAR}. Régulation AMF/ACPR vérifiée.`, intro: `Toutes les cartes crypto ne sont pas disponibles en France. Entre les restrictions géographiques, les exigences KYC et les questions de régulation, le choix se réduit. Ce comparatif liste uniquement les cartes accessibles aux résidents français en ${YEAR}.` },
    de: { title: `Krypto Karte Deutschland ${YEAR} — In Deutschland Verfügbar | TopCryptoCards`, h1: `Krypto-Karten Verfügbar in Deutschland`, description: `Die besten in Deutschland verfügbaren Krypto-Karten ${YEAR}. BaFin-Regulierung geprüft.`, intro: `Nicht alle Krypto-Karten sind in Deutschland verfügbar. Dieser Vergleich listet nur die für deutsche Einwohner zugänglichen Karten in ${YEAR}.` },
    es: { title: `Tarjeta Crypto España ${YEAR} — Disponibles en España | TopCryptoCards`, h1: `Tarjetas Crypto Disponibles en España`, description: `Las mejores tarjetas crypto disponibles en España en ${YEAR}. Regulación CNMV verificada.`, intro: `No todas las tarjetas crypto están disponibles en España. Esta comparativa lista únicamente las accesibles para residentes españoles en ${YEAR}.` },
    it: { title: `Carta Crypto Italia ${YEAR} — Disponibili in Italia | TopCryptoCards`, h1: `Carte Crypto Disponibili in Italia`, description: `Le migliori carte crypto disponibili in Italia nel ${YEAR}. Regolamentazione OAM verificata.`, intro: `Non tutte le carte crypto sono disponibili in Italia. Questo confronto elenca solo quelle accessibili ai residenti italiani nel ${YEAR}.` },
    en: { title: `Crypto Card Europe ${YEAR} — Available in UK & Europe | TopCryptoCards`, h1: `Crypto Cards Available in Europe`, description: `The best crypto cards available in Europe in ${YEAR}. FCA/MiCA regulated options included.`, intro: `Not all crypto cards are available across Europe. This comparison lists only cards accessible to European residents in ${YEAR}, with regulatory status verified.` },
  },
  virtual: {
    fr: { title: `Carte Crypto Virtuelle ${YEAR} — Paiements en Ligne | TopCryptoCards`, h1: `Cartes Crypto Virtuelles en ${YEAR}`, description: `Les meilleures cartes crypto virtuelles pour payer en ligne en ${YEAR}. Compatible Apple Pay, Google Pay.`, intro: `Les cartes crypto virtuelles sont idéales pour les achats en ligne et les paiements contactless via smartphone.` },
    de: { title: `Virtuelle Krypto Karte ${YEAR} — Online-Zahlungen | TopCryptoCards`, h1: `Virtuelle Krypto-Karten ${YEAR}`, description: `Die besten virtuellen Krypto-Karten für Online-Zahlungen ${YEAR}.`, intro: `Virtuelle Krypto-Karten sind ideal für Online-Einkäufe und kontaktlose Zahlungen per Smartphone.` },
    es: { title: `Tarjeta Crypto Virtual ${YEAR} — Pagos Online | TopCryptoCards`, h1: `Tarjetas Crypto Virtuales en ${YEAR}`, description: `Las mejores tarjetas crypto virtuales para pagos online en ${YEAR}.`, intro: `Las tarjetas crypto virtuales son ideales para compras online y pagos contactless.` },
    it: { title: `Carta Crypto Virtuale ${YEAR} — Pagamenti Online | TopCryptoCards`, h1: `Carte Crypto Virtuali nel ${YEAR}`, description: `Le migliori carte crypto virtuali per pagamenti online nel ${YEAR}.`, intro: `Le carte crypto virtuali sono ideali per gli acquisti online e i pagamenti contactless.` },
    en: { title: `Virtual Crypto Card ${YEAR} — Online Payments | TopCryptoCards`, h1: `Virtual Crypto Cards in ${YEAR}`, description: `The best virtual crypto cards for online payments in ${YEAR}.`, intro: `Virtual crypto cards are ideal for online shopping and contactless payments via smartphone.` },
  },
  beginner: {
    fr: { title: `Carte Crypto Débutant ${YEAR} — Simple, Sans Risque | TopCryptoCards`, h1: `Meilleures Cartes Crypto pour Débutants`, description: `Les cartes crypto les plus simples pour commencer en ${YEAR}. Sans staking, sans frais, sans complexité.`, intro: `Vous découvrez les cartes crypto et vous ne savez pas par où commencer ? Ces cartes ont été sélectionnées pour leur simplicité : aucun staking requis, aucun frais annuel, une interface accessible et un cashback immédiat dès le premier achat.` },
    de: { title: `Krypto Karte Einsteiger ${YEAR} — Einfach, Ohne Risiko | TopCryptoCards`, h1: `Beste Krypto-Karten für Einsteiger`, description: `Die einfachsten Krypto-Karten für den Einstieg ${YEAR}.`, intro: `Diese Karten wurden für ihre Einfachheit ausgewählt: kein Staking, keine Jahresgebühr, sofortiges Cashback.` },
    es: { title: `Tarjeta Crypto Principiante ${YEAR} — Simple y Sin Riesgo | TopCryptoCards`, h1: `Mejores Tarjetas Crypto para Principiantes`, description: `Las tarjetas crypto más sencillas para empezar en ${YEAR}.`, intro: `Estas tarjetas han sido seleccionadas por su simplicidad: sin staking, sin cuota anual, cashback inmediato.` },
    it: { title: `Carta Crypto Principiante ${YEAR} — Semplice, Senza Rischi | TopCryptoCards`, h1: `Migliori Carte Crypto per Principianti`, description: `Le carte crypto più semplici per iniziare nel ${YEAR}.`, intro: `Queste carte sono state selezionate per la loro semplicità: nessuno staking, nessun costo annuale, cashback immediato.` },
    en: { title: `Best Beginner Crypto Card ${YEAR} — Simple & Risk-Free | TopCryptoCards`, h1: `Best Crypto Cards for Beginners`, description: `The simplest crypto cards to get started in ${YEAR}. No staking, no fees, no complexity.`, intro: `New to crypto cards? These cards were selected for their simplicity: no staking required, no annual fee, and instant cashback from your very first purchase.` },
  },
};

const THEME_FILTERS: Record<string, (card: any) => boolean> = {
  best:          () => true,
  cashback:      (c) => (c.cashback_premium || c.cashback_base || 0) > 0,
  'no-fees':     (c) => (c.annual_fees || 0) === 0,
  'no-staking':  (c) => (c.staking_required || 0) === 0,
  france:        (c) => Array.isArray(c.markets) ? c.markets.includes('fr') : true,
  virtual:       (c) => c.virtual_only === true,
  beginner:      (c) => (c.annual_fees || 0) === 0 && (c.staking_required || 0) === 0,
};

const THEME_SORT: Record<string, (a: any, b: any) => number> = {
  best:          (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  cashback:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-fees':     (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-staking':  (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  france:        (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  virtual:       (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  beginner:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
};

const THEME_LIMIT: Record<string, number> = {
  best: 15,
};

interface ThematicPageProps {
  theme: string;
}

export default function ThematicPage({ theme }: ThematicPageProps) {
  const { lang = 'fr' } = useParams<{ lang: string }>();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CryptoCard | null>(null);

  // Store cards used for drawer (full CryptoCard objects with all fields)
  const storeCards = useAppStore((s) => s.cards);

  useEffect(() => {
    supabase
      .from('cards')
      .select('id, name, issuer, cashback_base, cashback_premium, annual_fees, staking_required, virtual_only, card_network, markets, trust_score, real_card_image')
      .then(({ data, error }) => {
        if (error) console.error('ThematicPage error:', error);
        setCards(data || []);
        setLoading(false);
      });
  }, []);

  const config = THEME_CONFIG[theme]?.[lang] || THEME_CONFIG[theme]?.['en'];
  const filterFn = THEME_FILTERS[theme] || (() => true);
  const sortFn = THEME_SORT[theme] || (() => 0);

  const filteredCards = useMemo(() => {
    const sorted = [...cards].filter(filterFn).sort(sortFn);
    const limit = THEME_LIMIT[theme];
    return limit ? sorted.slice(0, limit) : sorted;
  }, [cards, theme]);

  const handleCardClick = (cardId: string) => {
    const fullCard = storeCards.find((c) => c.id === cardId);
    if (fullCard) setDetail(fullCard);
  };

  useEffect(() => {
    if (!config) return;
    document.title = config.title;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = config.description;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
  }, [config, theme, lang]);

  if (!config) return null;

  const freeLabel: Record<string, string> = { fr: 'Gratuit', de: 'Kostenlos', es: 'Gratis', it: 'Gratuito', en: 'Free' };
  const updatedLabel: Record<string, string> = { fr: 'Mis à jour', de: 'Aktualisiert', es: 'Actualizado', it: 'Aggiornato', en: 'Updated' };
  const cardsLabel: Record<string, string> = { fr: 'cartes', de: 'Karten', es: 'tarjetas', it: 'carte', en: 'cards' };
  const detailsLabel: Record<string, string> = { fr: 'Voir les détails', de: 'Details', es: 'Ver detalles', it: 'Dettagli', en: 'View details' };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-3">{config.h1}</h1>
      <p className="text-slate-400 text-sm mb-4">
        {updatedLabel[lang] || 'Updated'}{' '}
        {new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long' })}
        {' · '}
        <span className="text-cyan-400">{loading ? '…' : filteredCards.length}</span>
        {' '}
        {cardsLabel[lang] || 'cards'}
      </p>
      <p className="text-slate-300 mb-8 max-w-3xl leading-relaxed">{config.intro}</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-surface p-4 rounded-xl h-48 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <p className="text-slate-400">Aucune carte trouvée pour ce critère.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filteredCards.map((card: any) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="card-surface p-4 rounded-xl hover:border-cyan-500/50 border border-transparent transition-all text-left w-full focus:outline-none focus:border-cyan-500/50"
            >
              {card.real_card_image && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', width: '100%', aspectRatio: '1.586' }}>
                  <img
                    src={card.real_card_image}
                    alt={card.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                  />
                </div>
              )}
              <h2 className="text-white font-semibold text-base mb-1">{card.name}</h2>
              <p className="text-slate-400 text-sm">{card.issuer}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-3 text-xs">
                  {(card.cashback_premium || card.cashback_base) ? (
                    <span className="text-cyan-400 font-medium">
                      {card.cashback_premium || card.cashback_base}% cashback
                    </span>
                  ) : null}
                  <span className="text-slate-500">
                    {(card.annual_fees || 0) > 0
                      ? `${card.annual_fees} €/an`
                      : freeLabel[lang] || 'Free'}
                  </span>
                </div>
                <span className="text-xs text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
                  {detailsLabel[lang]} →
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <CardDetailDrawer card={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
