import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';

const SUPPORTED_LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en'] as const;
type Lang = typeof SUPPORTED_LANGS[number];
type ContentLang = 'fr' | 'de' | 'es' | 'it' | 'en';

/** Maps URL lang (be/at) to the content variant to use */
const CONTENT_LANG: Record<Lang, ContentLang> = {
  fr: 'fr', be: 'fr', de: 'de', at: 'de', es: 'es', it: 'it', en: 'en',
};

function useMethodologyLang(): Lang {
  const { lang } = useParams<{ lang?: string }>();
  return (SUPPORTED_LANGS as readonly string[]).includes(lang ?? '') ? lang as Lang : 'en';
}

/* ── Slugs ───────────────────────────────────────────────────────────────── */
export const METHODOLOGY_SLUGS: Record<Lang, string> = {
  fr: 'methodologie',
  be: 'methodologie',
  de: 'methodik',
  at: 'methodik',
  es: 'metodologia',
  it: 'metodologia',
  en: 'methodology',
};

/* ── Content ─────────────────────────────────────────────────────────────── */
interface Section { title: string; body: string }
interface Content {
  h1: string;
  intro: string;
  lastUpdated: string;
  sections: {
    overview: Section;
    criteria: Section & { items: { label: string; body: string }[] };
    trustScore: Section & { items: { label: string; body: string }[] };
    independence: Section;
    sources: Section;
    updates: Section;
  };
}

const CONTENT: Record<ContentLang, Content> = {
  fr: {
    h1: 'Notre méthodologie de comparaison',
    intro: "TopCryptoCards évalue les cartes crypto selon des critères objectifs, vérifiés manuellement et mis à jour régulièrement. Cette page explique en détail comment nous sélectionnons, comparons et classons les cartes.",
    lastUpdated: 'Dernière mise à jour : juillet 2026',
    sections: {
      overview: {
        title: 'Vue d\'ensemble',
        body: "Nous couvrons les cartes crypto disponibles en Europe (zone SEPA). Chaque carte est évaluée sur la base de données publiques (sites officiels, conditions générales) et, lorsque possible, d'expériences d'utilisation directes. Aucune carte ne peut payer pour obtenir un meilleur classement.",
      },
      criteria: {
        title: 'Critères d\'évaluation',
        body: 'Les cartes sont comparées sur six axes principaux :',
        items: [
          { label: 'Cashback', body: "Taux de cashback réaliste pour le tier accessible sans condition, et taux maximum atteignable avec staking. Nous ne retenons pas les chiffres marketing — seulement ce qu'un utilisateur ordinaire peut espérer obtenir." },
          { label: 'Frais annuels', body: "Coût total annuel du tier (frais d'émission, frais de maintenance). Les cartes entièrement gratuites reçoivent un bonus." },
          { label: 'Staking requis', body: "Montant en crypto natif à immobiliser pour accéder aux avantages. Nous indiquons la valeur en euros au moment de la mise à jour." },
          { label: 'Disponibilité', body: "Pays dans lesquels la carte est effectivement livrable et utilisable, d'après les conditions officielles de l'émetteur." },
          { label: 'KYC', body: "Niveau de vérification d'identité requis : minimal (email seulement), standard (pièce d'identité), ou renforcé (justificatif de domicile + liveness)." },
          { label: 'Réseau', body: "Réseau de paiement (Visa, Mastercard) et type (physique, virtuelle, ou les deux)." },
        ],
      },
      trustScore: {
        title: 'Score de confiance (Trust Score)',
        body: 'Le Trust Score est notre note globale sur 10, calculée automatiquement à partir des données de chaque carte :',
        items: [
          { label: 'Cashback réaliste (30 %)', body: 'Taux du tier de base, sans condition de staking, plafonné à 5 % pour le calcul.' },
          { label: 'Frais (20 %)', body: 'Carte gratuite = 10 pts. Frais élevés = pénalité.' },
          { label: 'Staking (15 %)', body: 'Zéro staking requis = plein score. Staking élevé = pénalité.' },
          { label: 'Réseau (15 %)', body: 'Visa/Mastercard = plein score. Visa uniquement ou réseau moins universel = score réduit.' },
          { label: 'Disponibilité (10 %)', body: "Nombre de marchés couverts en Europe." },
          { label: 'Extras (10 %)', body: 'Lounges, assurances voyage, cashback en crypto, avantages partenaires.' },
        ],
      },
      independence: {
        title: 'Indépendance éditoriale',
        body: "Les relations d'affiliation — décrites en détail dans notre page de divulgation — n'influencent pas nos classements ni nos notes. Les cartes sans lien d'affiliation (Binance, Coinbase, Gemini, MetaMask, etc.) sont évaluées exactement de la même manière. Un émetteur ne peut pas payer pour améliorer son score ou sa position dans nos listes.",
      },
      sources: {
        title: 'Sources de données',
        body: "Toutes les données (cashback, frais, disponibilité, conditions de staking) sont extraites des sites officiels des émetteurs, de leurs conditions générales publiées et, pour certains produits, de nos propres tests. Nous citons la source pour chaque donnée sensible. En cas de désaccord entre notre affichage et les conditions actuelles d'un émetteur, les conditions officielles de l'émetteur prévalent.",
      },
      updates: {
        title: 'Fréquence de mise à jour',
        body: "Les données des cartes sont vérifiées mensuellement. Le site est entièrement rerenderisé toutes les nuits via notre pipeline GitHub Actions → Netlify, ce qui garantit que les articles de blog, les fiches cartes et les comparatifs reflètent l'état actuel de notre base de données. Les mises à jour majeures (nouveau produit, changement de cashback significatif) sont intégrées sous 48 h.",
      },
    },
  },
  de: {
    h1: 'Unsere Bewertungsmethodik',
    intro: "TopCryptoCards bewertet Krypto-Karten nach objektiven, manuell verifizierten und regelmäßig aktualisierten Kriterien. Diese Seite erläutert ausführlich, wie wir Karten auswählen, vergleichen und bewerten.",
    lastUpdated: 'Zuletzt aktualisiert: Juli 2026',
    sections: {
      overview: {
        title: 'Überblick',
        body: "Wir behandeln Krypto-Karten, die in Europa (SEPA-Raum) verfügbar sind. Jede Karte wird anhand öffentlich zugänglicher Daten (offizielle Webseiten, AGB) und, wenn möglich, eigener Nutzungserfahrungen bewertet. Keine Karte kann sich einen besseren Rang erkaufen.",
      },
      criteria: {
        title: 'Bewertungskriterien',
        body: 'Karten werden anhand von sechs Hauptkriterien verglichen:',
        items: [
          { label: 'Cashback', body: "Realistischer Cashback-Satz für das kostengünstigste Tier sowie maximaler erreichbarer Satz mit Staking. Wir verwenden keine Marketingzahlen — nur das, was ein normaler Nutzer realistisch erwarten kann." },
          { label: 'Jahresgebühren', body: "Gesamte Jahreskosten des Tiers (Ausgabegebühr, Wartungsgebühr). Vollständig kostenlose Karten erhalten einen Bonus." },
          { label: 'Erforderliches Staking', body: "Menge an nativer Kryptowährung, die für den Zugang zu Vorteilen gesperrt werden muss. Wir geben den Euro-Wert zum Aktualisierungszeitpunkt an." },
          { label: 'Verfügbarkeit', body: "Länder, in denen die Karte laut offiziellen Emittentenbedingungen tatsächlich lieferbar und nutzbar ist." },
          { label: 'KYC', body: "Erforderliches Identitätsprüfungsniveau: minimal (E-Mail), standard (Ausweis) oder erweitert (Wohnsitznachweis + Liveness-Check)." },
          { label: 'Netzwerk', body: "Zahlungsnetzwerk (Visa, Mastercard) und Kartentyp (physisch, virtuell oder beides)." },
        ],
      },
      trustScore: {
        title: 'Vertrauensscore (Trust Score)',
        body: 'Der Trust Score ist unsere Gesamtbewertung von 10, die automatisch aus den Daten jeder Karte berechnet wird:',
        items: [
          { label: 'Realistischer Cashback (30 %)', body: 'Cashback-Satz des Basis-Tiers ohne Staking-Bedingung, begrenzt auf 5 % für die Berechnung.' },
          { label: 'Gebühren (20 %)', body: 'Kostenlose Karte = 10 Punkte. Hohe Gebühren = Abzug.' },
          { label: 'Staking (15 %)', body: 'Kein Staking erforderlich = voller Score. Hohes Staking = Abzug.' },
          { label: 'Netzwerk (15 %)', body: 'Visa/Mastercard = voller Score. Nur Visa oder weniger universelles Netzwerk = reduzierter Score.' },
          { label: 'Verfügbarkeit (10 %)', body: 'Anzahl der abgedeckten europäischen Märkte.' },
          { label: 'Extras (10 %)', body: 'Lounges, Reiseversicherung, Krypto-Cashback, Partnervorteile.' },
        ],
      },
      independence: {
        title: 'Redaktionelle Unabhängigkeit',
        body: "Affiliate-Beziehungen — ausführlich auf unserer Offenlegungsseite beschrieben — beeinflussen weder unsere Rankings noch unsere Bewertungen. Karten ohne Affiliate-Link (Binance, Coinbase, Gemini, MetaMask usw.) werden auf identische Weise bewertet. Kein Emittent kann sich einen besseren Score oder eine bessere Position in unseren Listen erkaufen.",
      },
      sources: {
        title: 'Datenquellen',
        body: "Alle Daten (Cashback, Gebühren, Verfügbarkeit, Staking-Bedingungen) werden von offiziellen Emittenten-Webseiten, veröffentlichten AGB und für einige Produkte aus eigenen Tests entnommen. Bei Abweichungen zwischen unserer Darstellung und den aktuellen Bedingungen eines Emittenten gelten die offiziellen Bedingungen des Emittenten.",
      },
      updates: {
        title: 'Aktualisierungsfrequenz',
        body: "Kartendaten werden monatlich geprüft. Die gesamte Website wird jede Nacht über unsere GitHub Actions → Netlify-Pipeline neu gerendert, was sicherstellt, dass Blogartikel, Kartenseiten und Vergleiche den aktuellen Stand unserer Datenbank widerspiegeln. Wichtige Aktualisierungen (neues Produkt, erhebliche Cashback-Änderung) werden innerhalb von 48 Stunden integriert.",
      },
    },
  },
  es: {
    h1: 'Nuestra metodología de comparación',
    intro: "TopCryptoCards evalúa las tarjetas cripto según criterios objetivos, verificados manualmente y actualizados regularmente. Esta página explica en detalle cómo seleccionamos, comparamos y clasificamos las tarjetas.",
    lastUpdated: 'Última actualización: julio 2026',
    sections: {
      overview: {
        title: 'Visión general',
        body: "Cubrimos las tarjetas cripto disponibles en Europa (zona SEPA). Cada tarjeta se evalúa en base a datos públicos (sitios oficiales, condiciones generales) y, cuando es posible, experiencias de uso directo. Ninguna tarjeta puede pagar para obtener una mejor clasificación.",
      },
      criteria: {
        title: 'Criterios de evaluación',
        body: 'Las tarjetas se comparan en seis ejes principales:',
        items: [
          { label: 'Cashback', body: "Tasa de cashback realista para el nivel accesible sin condiciones, y tasa máxima alcanzable con staking. No utilizamos cifras de marketing — solo lo que un usuario ordinario puede esperar obtener." },
          { label: 'Comisiones anuales', body: "Coste total anual del nivel (comisión de emisión, comisión de mantenimiento). Las tarjetas completamente gratuitas reciben una bonificación." },
          { label: 'Staking requerido', body: "Cantidad de criptomoneda nativa que debe inmovilizarse para acceder a las ventajas. Indicamos el valor en euros en el momento de la actualización." },
          { label: 'Disponibilidad', body: "Países en los que la tarjeta es efectivamente entregable y utilizable, según las condiciones oficiales del emisor." },
          { label: 'KYC', body: "Nivel de verificación de identidad requerido: mínimo (solo email), estándar (documento de identidad) o reforzado (justificante de domicilio + liveness)." },
          { label: 'Red', body: "Red de pago (Visa, Mastercard) y tipo de tarjeta (física, virtual o ambas)." },
        ],
      },
      trustScore: {
        title: 'Puntuación de confianza (Trust Score)',
        body: 'El Trust Score es nuestra puntuación global sobre 10, calculada automáticamente a partir de los datos de cada tarjeta:',
        items: [
          { label: 'Cashback realista (30 %)', body: 'Tasa del nivel base, sin condición de staking, limitada al 5 % para el cálculo.' },
          { label: 'Comisiones (20 %)', body: 'Tarjeta gratuita = 10 pts. Comisiones altas = penalización.' },
          { label: 'Staking (15 %)', body: 'Sin staking requerido = puntuación máxima. Staking elevado = penalización.' },
          { label: 'Red (15 %)', body: 'Visa/Mastercard = puntuación máxima. Solo Visa o red menos universal = puntuación reducida.' },
          { label: 'Disponibilidad (10 %)', body: 'Número de mercados europeos cubiertos.' },
          { label: 'Extras (10 %)', body: 'Salas VIP, seguros de viaje, cashback en cripto, ventajas de socios.' },
        ],
      },
      independence: {
        title: 'Independencia editorial',
        body: "Las relaciones de afiliación — descritas en detalle en nuestra página de divulgación — no influyen en nuestras clasificaciones ni en nuestras notas. Las tarjetas sin enlace de afiliación (Binance, Coinbase, Gemini, MetaMask, etc.) se evalúan de exactamente la misma manera. Un emisor no puede pagar para mejorar su puntuación o su posición en nuestras listas.",
      },
      sources: {
        title: 'Fuentes de datos',
        body: "Todos los datos (cashback, comisiones, disponibilidad, condiciones de staking) se extraen de los sitios oficiales de los emisores, de sus condiciones generales publicadas y, para algunos productos, de nuestras propias pruebas. En caso de discrepancia entre nuestra presentación y las condiciones actuales de un emisor, prevalecen las condiciones oficiales del emisor.",
      },
      updates: {
        title: 'Frecuencia de actualización',
        body: "Los datos de las tarjetas se verifican mensualmente. El sitio se vuelve a renderizar completamente cada noche mediante nuestro pipeline GitHub Actions → Netlify, lo que garantiza que los artículos de blog, las fichas de tarjetas y los comparativos reflejen el estado actual de nuestra base de datos. Las actualizaciones importantes (nuevo producto, cambio significativo de cashback) se integran en menos de 48 horas.",
      },
    },
  },
  it: {
    h1: 'La nostra metodologia di confronto',
    intro: "TopCryptoCards valuta le carte cripto secondo criteri oggettivi, verificati manualmente e aggiornati regolarmente. Questa pagina spiega in dettaglio come selezioniamo, confrontiamo e classifichiamo le carte.",
    lastUpdated: 'Ultimo aggiornamento: luglio 2026',
    sections: {
      overview: {
        title: 'Panoramica',
        body: "Copriamo le carte cripto disponibili in Europa (area SEPA). Ogni carta viene valutata sulla base di dati pubblici (siti ufficiali, termini e condizioni) e, quando possibile, di esperienze d'uso dirette. Nessuna carta può pagare per ottenere una classificazione migliore.",
      },
      criteria: {
        title: 'Criteri di valutazione',
        body: 'Le carte vengono confrontate su sei assi principali:',
        items: [
          { label: 'Cashback', body: "Tasso di cashback realistico per il livello accessibile senza condizioni, e tasso massimo raggiungibile con lo staking. Non utilizziamo cifre di marketing — solo ciò che un utente ordinario può aspettarsi di ottenere." },
          { label: 'Commissioni annuali', body: "Costo totale annuale del livello (commissione di emissione, commissione di manutenzione). Le carte completamente gratuite ricevono un bonus." },
          { label: 'Staking richiesto', body: "Quantità di criptovaluta nativa da immobilizzare per accedere ai vantaggi. Indichiamo il valore in euro al momento dell'aggiornamento." },
          { label: 'Disponibilità', body: "Paesi in cui la carta è effettivamente consegnabile e utilizzabile, secondo le condizioni ufficiali dell'emittente." },
          { label: 'KYC', body: "Livello di verifica dell'identità richiesto: minimo (solo email), standard (documento d'identità) o rafforzato (giustificativo di residenza + liveness)." },
          { label: 'Rete', body: "Rete di pagamento (Visa, Mastercard) e tipo di carta (fisica, virtuale o entrambe)." },
        ],
      },
      trustScore: {
        title: 'Punteggio di fiducia (Trust Score)',
        body: 'Il Trust Score è il nostro punteggio globale su 10, calcolato automaticamente dai dati di ogni carta:',
        items: [
          { label: 'Cashback realistico (30 %)', body: "Tasso del livello base, senza condizione di staking, limitato al 5 % per il calcolo." },
          { label: 'Commissioni (20 %)', body: 'Carta gratuita = 10 pt. Commissioni elevate = penalità.' },
          { label: 'Staking (15 %)', body: 'Nessuno staking richiesto = punteggio pieno. Staking elevato = penalità.' },
          { label: 'Rete (15 %)', body: 'Visa/Mastercard = punteggio pieno. Solo Visa o rete meno universale = punteggio ridotto.' },
          { label: 'Disponibilità (10 %)', body: 'Numero di mercati europei coperti.' },
          { label: 'Extra (10 %)', body: 'Lounge, assicurazioni viaggio, cashback in cripto, vantaggi partner.' },
        ],
      },
      independence: {
        title: 'Indipendenza editoriale',
        body: "Le relazioni di affiliazione — descritte in dettaglio nella nostra pagina di divulgazione — non influenzano le nostre classifiche né i nostri punteggi. Le carte senza link di affiliazione (Binance, Coinbase, Gemini, MetaMask, ecc.) vengono valutate esattamente allo stesso modo. Nessun emittente può pagare per migliorare il proprio punteggio o la propria posizione nelle nostre liste.",
      },
      sources: {
        title: 'Fonti dei dati',
        body: "Tutti i dati (cashback, commissioni, disponibilità, condizioni di staking) sono estratti dai siti ufficiali degli emittenti, dalle loro condizioni generali pubblicate e, per alcuni prodotti, dai nostri test diretti. In caso di discrepanza tra la nostra presentazione e le condizioni attuali di un emittente, prevalgono le condizioni ufficiali dell'emittente.",
      },
      updates: {
        title: 'Frequenza di aggiornamento',
        body: "I dati delle carte vengono verificati mensilmente. Il sito viene completamente ri-renderizzato ogni notte tramite il nostro pipeline GitHub Actions → Netlify, il che garantisce che gli articoli del blog, le schede carte e i comparativi riflettano lo stato attuale del nostro database. Gli aggiornamenti importanti (nuovo prodotto, cambiamento significativo del cashback) vengono integrati entro 48 ore.",
      },
    },
  },
  en: {
    h1: 'Our Comparison Methodology',
    intro: "TopCryptoCards evaluates crypto cards using objective, manually verified, and regularly updated criteria. This page explains in detail how we select, compare, and rank cards.",
    lastUpdated: 'Last updated: July 2026',
    sections: {
      overview: {
        title: 'Overview',
        body: "We cover crypto cards available in Europe (SEPA zone). Each card is evaluated based on public data (official websites, terms and conditions) and, where possible, direct usage experience. No card can pay to achieve a better ranking.",
      },
      criteria: {
        title: 'Evaluation Criteria',
        body: 'Cards are compared across six main criteria:',
        items: [
          { label: 'Cashback', body: "Realistic cashback rate for the accessible tier without conditions, and maximum achievable rate with staking. We do not use marketing figures — only what an ordinary user can realistically expect to earn." },
          { label: 'Annual Fees', body: "Total annual cost of the tier (issuance fee, maintenance fee). Completely free cards receive a bonus." },
          { label: 'Required Staking', body: "Amount of native cryptocurrency to be locked to access benefits. We state the EUR value at the time of the update." },
          { label: 'Availability', body: "Countries where the card is effectively deliverable and usable, per the issuer's official terms." },
          { label: 'KYC', body: "Required identity verification level: minimal (email only), standard (ID document), or enhanced (proof of address + liveness check)." },
          { label: 'Network', body: "Payment network (Visa, Mastercard) and card type (physical, virtual, or both)." },
        ],
      },
      trustScore: {
        title: 'Trust Score',
        body: 'The Trust Score is our overall rating out of 10, automatically calculated from each card\'s data:',
        items: [
          { label: 'Realistic Cashback (30 %)', body: 'Base tier cashback rate without staking requirement, capped at 5 % for the calculation.' },
          { label: 'Fees (20 %)', body: 'Free card = 10 pts. High fees = penalty.' },
          { label: 'Staking (15 %)', body: 'No staking required = full score. High staking = penalty.' },
          { label: 'Network (15 %)', body: 'Visa/Mastercard = full score. Visa only or less universal network = reduced score.' },
          { label: 'Availability (10 %)', body: 'Number of European markets covered.' },
          { label: 'Extras (10 %)', body: 'Lounge access, travel insurance, crypto cashback, partner benefits.' },
        ],
      },
      independence: {
        title: 'Editorial Independence',
        body: "Affiliate relationships — described in detail on our disclosure page — do not influence our rankings or ratings. Cards without an affiliate link (Binance, Coinbase, Gemini, MetaMask, etc.) are evaluated in exactly the same way. No issuer can pay to improve their score or position in our lists.",
      },
      sources: {
        title: 'Data Sources',
        body: "All data (cashback, fees, availability, staking conditions) is sourced from issuers' official websites, their published terms and conditions, and for some products, our own direct testing. In the event of a discrepancy between our display and an issuer's current terms, the issuer's official terms prevail.",
      },
      updates: {
        title: 'Update Frequency',
        body: "Card data is verified monthly. The entire site is re-rendered nightly via our GitHub Actions → Netlify pipeline, ensuring blog articles, card pages and comparisons reflect the current state of our database. Major updates (new product, significant cashback change) are integrated within 48 hours.",
      },
    },
  },
};

/* ── Meta ─────────────────────────────────────────────────────────────────── */
const META: Record<ContentLang, { title: string; description: string }> = {
  fr: { title: 'Méthodologie — TopCryptoCards', description: 'Découvrez comment TopCryptoCards évalue et classe les cartes crypto : critères, Trust Score, indépendance éditoriale.' },
  de: { title: 'Bewertungsmethodik — TopCryptoCards', description: 'Erfahren Sie, wie TopCryptoCards Krypto-Karten bewertet und rankt: Kriterien, Trust Score, redaktionelle Unabhängigkeit.' },
  es: { title: 'Metodología — TopCryptoCards', description: 'Descubra cómo TopCryptoCards evalúa y clasifica las tarjetas cripto: criterios, Trust Score, independencia editorial.' },
  it: { title: 'Metodologia — TopCryptoCards', description: 'Scopri come TopCryptoCards valuta e classifica le carte cripto: criteri, Trust Score, indipendenza editoriale.' },
  en: { title: 'Methodology — TopCryptoCards', description: 'Discover how TopCryptoCards evaluates and ranks crypto cards: criteria, Trust Score, editorial independence.' },
};

const DISCLOSURE_SLUGS: Record<Lang, string> = {
  fr: 'divulgation-affilies',
  be: 'divulgation-affilies',
  de: 'affiliate-offenlegung',
  at: 'affiliate-offenlegung',
  es: 'divulgacion-afiliados',
  it: 'divulgazione-affiliati',
  en: 'affiliate-disclosure',
};

const DISCLOSURE_LABEL: Record<Lang, string> = {
  fr: "notre page de divulgation des affiliés",
  be: "notre page de divulgation des affiliés",
  de: "unsere Affiliate-Offenlegungsseite",
  at: "unsere Affiliate-Offenlegungsseite",
  es: "nuestra página de divulgación de afiliados",
  it: "la nostra pagina di divulgazione degli affiliati",
  en: "our affiliate disclosure page",
};

/* ── Component ───────────────────────────────────────────────────────────── */
const MethodologyPage: React.FC = () => {
  const lang = useMethodologyLang();
  const cl = CONTENT_LANG[lang];
  const c = CONTENT[cl];
  const meta = META[cl];

  useSeoMeta({ title: meta.title, description: meta.description, lang });
  useHreflang(l => `https://topcryptocards.eu/${l}/${METHODOLOGY_SLUGS[l as Lang] ?? 'methodology'}`, []);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Header */}
      <header className="border-b border-bg-border bg-bg-elevated">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to={`/${lang}`} className="text-brand-accent font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            TopCryptoCards
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-text-secondary text-sm">{meta.title.split(' — ')[0]}</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-3">{c.h1}</h1>
        <p className="text-slate-400 text-sm mb-2">{c.lastUpdated}</p>
        <p className="text-text-secondary leading-relaxed mb-10">{c.intro}</p>

        {/* Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{c.sections.overview.title}</h2>
          <p className="text-text-secondary leading-relaxed">{c.sections.overview.body}</p>
        </section>

        {/* Criteria */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{c.sections.criteria.title}</h2>
          <p className="text-text-secondary leading-relaxed mb-4">{c.sections.criteria.body}</p>
          <div className="space-y-3">
            {c.sections.criteria.items.map((item) => (
              <div key={item.label} className="p-4 rounded-xl border border-bg-border bg-bg-elevated">
                <p className="font-semibold text-white mb-1">{item.label}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Score */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{c.sections.trustScore.title}</h2>
          <p className="text-text-secondary leading-relaxed mb-4">{c.sections.trustScore.body}</p>
          <div className="rounded-xl border border-bg-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {c.sections.trustScore.items.map((item, i) => (
                  <tr key={item.label} className={i % 2 === 0 ? 'bg-bg-base' : 'bg-bg-elevated'}>
                    <td className="px-4 py-3 font-medium text-white w-48 align-top">{item.label}</td>
                    <td className="px-4 py-3 text-text-secondary leading-relaxed">{item.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Independence */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{c.sections.independence.title}</h2>
          <p className="text-text-secondary leading-relaxed">
            {/* Replace "notre page de divulgation" with a link */}
            {c.sections.independence.body.split(DISCLOSURE_LABEL[lang]).map((part, i) =>
              i === 0 ? (
                <React.Fragment key={i}>
                  {part}
                  <Link to={`/${lang}/${DISCLOSURE_SLUGS[lang]}`} className="text-brand-accent hover:underline">
                    {DISCLOSURE_LABEL[lang]}
                  </Link>
                </React.Fragment>
              ) : (
                <React.Fragment key={i}>{part}</React.Fragment>
              )
            )}
          </p>
        </section>

        {/* Sources */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{c.sections.sources.title}</h2>
          <p className="text-text-secondary leading-relaxed">{c.sections.sources.body}</p>
        </section>

        {/* Updates */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-3">{c.sections.updates.title}</h2>
          <p className="text-text-secondary leading-relaxed">{c.sections.updates.body}</p>
        </section>

        {/* Back link */}
        <div className="border-t border-bg-border pt-6">
          <Link to={`/${lang}`} className="text-brand-accent hover:underline text-sm">
            ← TopCryptoCards
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MethodologyPage;
