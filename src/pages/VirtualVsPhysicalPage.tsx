import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import Breadcrumb from '../components/Breadcrumb';
import { THEMATIC_ROUTES, VVP_SLUGS } from '../config/routes';

const BASE = 'https://topcryptocards.eu';
const YEAR = new Date().getFullYear();

/* ── SEO ─────────────────────────────────────────────────────────────────── */
const SEO: Record<string, { title: string; desc: string }> = {
  fr: {
    title: `Carte Crypto Virtuelle vs Physique ${YEAR} — Laquelle Choisir ?`,
    desc: `Carte crypto virtuelle ou physique en ${YEAR} ? Comparatif complet : cashback, retraits DAB, activation, sécurité. Crypto.com, Nexo, Revolut comparées. Gratuit ✓`,
  },
  de: {
    title: `Virtuelle vs. Physische Krypto-Karte ${YEAR} — Welche Wählen?`,
    desc: `Virtuelle oder physische Krypto-Karte in ${YEAR}? Vollständiger Vergleich: Cashback, Bargeldabhebungen, Aktivierung, Sicherheit. Crypto.com, Nexo, Revolut verglichen. ✓`,
  },
  es: {
    title: `Tarjeta Crypto Virtual vs Física ${YEAR} — ¿Cuál Elegir?`,
    desc: `¿Tarjeta crypto virtual o física en ${YEAR}? Comparativa completa: cashback, cajeros automáticos, activación, seguridad. Crypto.com, Nexo, Revolut comparadas. Gratis ✓`,
  },
  it: {
    title: `Carta Crypto Virtuale vs Fisica ${YEAR} — Quale Scegliere?`,
    desc: `Carta crypto virtuale o fisica nel ${YEAR}? Confronto completo: cashback, prelievi ATM, attivazione, sicurezza. Crypto.com, Nexo, Revolut confrontate. Gratuito ✓`,
  },
  en: {
    title: `Virtual vs Physical Crypto Card ${YEAR} — Which to Choose?`,
    desc: `Virtual or physical crypto card in ${YEAR}? Full comparison: cashback, ATM withdrawals, activation, security. Crypto.com, Nexo, Revolut compared. Free ✓`,
  },
};

/* ── Labels ──────────────────────────────────────────────────────────────── */
const HOME_LABEL: Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };
const GUIDES_LABEL: Record<string, string> = { fr: 'Guides', de: 'Ratgeber', es: 'Guías', it: 'Guide', en: 'Guides' };
const PAGE_TITLE: Record<string, string> = {
  fr: `Carte Crypto Virtuelle vs Physique : Comparatif ${YEAR}`,
  de: `Virtuelle vs. Physische Krypto-Karte: Vergleich ${YEAR}`,
  es: `Tarjeta Crypto Virtual vs Física: Comparativa ${YEAR}`,
  it: `Carta Crypto Virtuale vs Fisica: Confronto ${YEAR}`,
  en: `Virtual vs Physical Crypto Card: Full Comparison ${YEAR}`,
};
const INTRO: Record<string, string> = {
  fr: `Vous hésitez entre une carte crypto virtuelle et une carte physique ? Ces deux formats ont des usages distincts et des avantages bien différents. Une carte virtuelle s'active en quelques minutes et fonctionne immédiatement sur Apple Pay et Google Pay — idéale pour les achats en ligne. Une carte physique permet les retraits DAB, les paiements en magasin sans smartphone, et représente le choix évident pour un usage quotidien complet. La bonne nouvelle : la plupart des émetteurs proposent les deux avec un seul compte.`,
  de: `Unschlüssig zwischen einer virtuellen und einer physischen Krypto-Karte? Beide Formate haben unterschiedliche Anwendungsfälle und klare Vorteile. Eine virtuelle Karte wird in wenigen Minuten aktiviert und funktioniert sofort mit Apple Pay und Google Pay — ideal für Online-Käufe. Eine physische Karte ermöglicht Bargeldabhebungen am Geldautomaten, Einkäufe im Geschäft ohne Smartphone und ist die offensichtliche Wahl für den vollständigen Alltag. Die gute Nachricht: Die meisten Anbieter bieten beides mit einem einzigen Konto.`,
  es: `¿Dudas entre una tarjeta crypto virtual y una física? Ambos formatos tienen usos distintos y ventajas muy diferentes. Una tarjeta virtual se activa en minutos y funciona de inmediato en Apple Pay y Google Pay — ideal para compras online. Una tarjeta física permite retiradas en cajero automático, pagos en tienda sin smartphone, y es la opción obvia para un uso cotidiano completo. La buena noticia: la mayoría de emisores ofrecen ambas con una sola cuenta.`,
  it: `Indeciso tra una carta crypto virtuale e una fisica? Entrambi i formati hanno utilizzi distinti e vantaggi molto diversi. Una carta virtuale si attiva in pochi minuti e funziona immediatamente con Apple Pay e Google Pay — ideale per gli acquisti online. Una carta fisica permette prelievi ATM, pagamenti in negozio senza smartphone, ed è la scelta ovvia per un utilizzo quotidiano completo. La buona notizia: la maggior parte degli emittenti offre entrambe con un unico account.`,
  en: `Unsure whether to choose a virtual or physical crypto card? Both formats have distinct use cases and very different advantages. A virtual card activates in minutes and works immediately on Apple Pay and Google Pay — perfect for online shopping. A physical card enables ATM cash withdrawals, in-store payments without a smartphone, and is the obvious choice for full everyday use. The good news: most issuers offer both with a single account.`,
};

/* ── Comparison table ────────────────────────────────────────────────────── */
type RowStatus = 'yes' | 'no' | 'partial';
interface CompRow {
  criterion: string;
  virtual: { status: RowStatus; label: string };
  physical: { status: RowStatus; label: string };
}

const TABLE_HEADER: Record<string, { criterion: string; virtual: string; physical: string }> = {
  fr: { criterion: 'Critère', virtual: 'Carte virtuelle', physical: 'Carte physique' },
  de: { criterion: 'Kriterium', virtual: 'Virtuelle Karte', physical: 'Physische Karte' },
  es: { criterion: 'Criterio', virtual: 'Tarjeta virtual', physical: 'Tarjeta física' },
  it: { criterion: 'Criterio', virtual: 'Carta virtuale', physical: 'Carta fisica' },
  en: { criterion: 'Criterion', virtual: 'Virtual card', physical: 'Physical card' },
};

const TABLE_ROWS: Record<string, CompRow[]> = {
  fr: [
    { criterion: 'Activation', virtual: { status: 'yes', label: 'Instantanée (< 5 min)' }, physical: { status: 'partial', label: 'Livraison 5–15 jours' } },
    { criterion: 'Retraits DAB', virtual: { status: 'no', label: 'Impossible' }, physical: { status: 'yes', label: 'Jusqu\'à illimité (premium)' } },
    { criterion: 'Paiements en magasin', virtual: { status: 'partial', label: 'Via NFC (Apple/Google Pay)' }, physical: { status: 'yes', label: 'Direct, sans smartphone' } },
    { criterion: 'Achats en ligne', virtual: { status: 'yes', label: 'Idéale, numéro unique possible' }, physical: { status: 'yes', label: 'Oui, même numéro' } },
    { criterion: 'Sécurité anti-skimming', virtual: { status: 'yes', label: 'Impossible à skimmer' }, physical: { status: 'partial', label: 'Protégée par PIN + blocage app' } },
    { criterion: 'Cashback', virtual: { status: 'yes', label: 'Identique à la physique' }, physical: { status: 'yes', label: 'Identique à la virtuelle' } },
    { criterion: 'Frais annuels', virtual: { status: 'yes', label: 'Généralement gratuite' }, physical: { status: 'partial', label: 'Gratuite ou frais de livraison' } },
    { criterion: 'Disponibilité mondiale', virtual: { status: 'yes', label: 'Partout en ligne' }, physical: { status: 'yes', label: '200+ pays (Visa/Mastercard)' } },
  ],
  de: [
    { criterion: 'Aktivierung', virtual: { status: 'yes', label: 'Sofort (< 5 Min.)' }, physical: { status: 'partial', label: 'Lieferung 5–15 Tage' } },
    { criterion: 'Bargeldabhebungen', virtual: { status: 'no', label: 'Nicht möglich' }, physical: { status: 'yes', label: 'Bis unbegrenzt (Premium)' } },
    { criterion: 'Zahlungen im Geschäft', virtual: { status: 'partial', label: 'Via NFC (Apple/Google Pay)' }, physical: { status: 'yes', label: 'Direkt, ohne Smartphone' } },
    { criterion: 'Online-Käufe', virtual: { status: 'yes', label: 'Ideal, einmalige Kartennummer möglich' }, physical: { status: 'yes', label: 'Ja, gleiche Nummer' } },
    { criterion: 'Schutz vor Skimming', virtual: { status: 'yes', label: 'Kein Skimming möglich' }, physical: { status: 'partial', label: 'Geschützt durch PIN + App-Sperrung' } },
    { criterion: 'Cashback', virtual: { status: 'yes', label: 'Identisch zur physischen Karte' }, physical: { status: 'yes', label: 'Identisch zur virtuellen Karte' } },
    { criterion: 'Jahresgebühren', virtual: { status: 'yes', label: 'In der Regel kostenlos' }, physical: { status: 'partial', label: 'Kostenlos oder Liefergebühr' } },
    { criterion: 'Weltweite Akzeptanz', virtual: { status: 'yes', label: 'Überall online' }, physical: { status: 'yes', label: '200+ Länder (Visa/Mastercard)' } },
  ],
  es: [
    { criterion: 'Activación', virtual: { status: 'yes', label: 'Instantánea (< 5 min)' }, physical: { status: 'partial', label: 'Entrega 5–15 días' } },
    { criterion: 'Retiradas en cajero', virtual: { status: 'no', label: 'Imposible' }, physical: { status: 'yes', label: 'Hasta ilimitado (premium)' } },
    { criterion: 'Pagos en tienda', virtual: { status: 'partial', label: 'Via NFC (Apple/Google Pay)' }, physical: { status: 'yes', label: 'Directo, sin smartphone' } },
    { criterion: 'Compras online', virtual: { status: 'yes', label: 'Ideal, número único posible' }, physical: { status: 'yes', label: 'Sí, mismo número' } },
    { criterion: 'Seguridad anti-skimming', virtual: { status: 'yes', label: 'Imposible de skimear' }, physical: { status: 'partial', label: 'Protegida por PIN + bloqueo app' } },
    { criterion: 'Cashback', virtual: { status: 'yes', label: 'Idéntico a la física' }, physical: { status: 'yes', label: 'Idéntico a la virtual' } },
    { criterion: 'Cuotas anuales', virtual: { status: 'yes', label: 'Generalmente gratuita' }, physical: { status: 'partial', label: 'Gratuita o gastos de envío' } },
    { criterion: 'Disponibilidad mundial', virtual: { status: 'yes', label: 'En todo el mundo online' }, physical: { status: 'yes', label: '200+ países (Visa/Mastercard)' } },
  ],
  it: [
    { criterion: 'Attivazione', virtual: { status: 'yes', label: 'Istantanea (< 5 min)' }, physical: { status: 'partial', label: 'Consegna 5–15 giorni' } },
    { criterion: 'Prelievi ATM', virtual: { status: 'no', label: 'Impossibile' }, physical: { status: 'yes', label: 'Fino a illimitato (premium)' } },
    { criterion: 'Pagamenti in negozio', virtual: { status: 'partial', label: 'Via NFC (Apple/Google Pay)' }, physical: { status: 'yes', label: 'Diretto, senza smartphone' } },
    { criterion: 'Acquisti online', virtual: { status: 'yes', label: 'Ideale, numero unico possibile' }, physical: { status: 'yes', label: 'Sì, stesso numero' } },
    { criterion: 'Sicurezza anti-skimming', virtual: { status: 'yes', label: 'Impossibile da skimmare' }, physical: { status: 'partial', label: 'Protetta da PIN + blocco app' } },
    { criterion: 'Cashback', virtual: { status: 'yes', label: 'Identico alla fisica' }, physical: { status: 'yes', label: 'Identico alla virtuale' } },
    { criterion: 'Costi annuali', virtual: { status: 'yes', label: 'Generalmente gratuita' }, physical: { status: 'partial', label: 'Gratuita o spese di consegna' } },
    { criterion: 'Disponibilità mondiale', virtual: { status: 'yes', label: 'Ovunque online' }, physical: { status: 'yes', label: '200+ paesi (Visa/Mastercard)' } },
  ],
  en: [
    { criterion: 'Activation', virtual: { status: 'yes', label: 'Instant (< 5 min)' }, physical: { status: 'partial', label: 'Delivery 5–15 days' } },
    { criterion: 'ATM withdrawals', virtual: { status: 'no', label: 'Not possible' }, physical: { status: 'yes', label: 'Up to unlimited (premium)' } },
    { criterion: 'In-store payments', virtual: { status: 'partial', label: 'Via NFC (Apple/Google Pay)' }, physical: { status: 'yes', label: 'Direct, no smartphone needed' } },
    { criterion: 'Online purchases', virtual: { status: 'yes', label: 'Ideal, unique card numbers possible' }, physical: { status: 'yes', label: 'Yes, same number' } },
    { criterion: 'Anti-skimming security', virtual: { status: 'yes', label: 'Cannot be physically skimmed' }, physical: { status: 'partial', label: 'Protected by PIN + app lock' } },
    { criterion: 'Cashback', virtual: { status: 'yes', label: 'Identical to physical' }, physical: { status: 'yes', label: 'Identical to virtual' } },
    { criterion: 'Annual fees', virtual: { status: 'yes', label: 'Generally free' }, physical: { status: 'partial', label: 'Free or delivery fee' } },
    { criterion: 'Worldwide coverage', virtual: { status: 'yes', label: 'Everywhere online' }, physical: { status: 'yes', label: '200+ countries (Visa/Mastercard)' } },
  ],
};

/* ── Editorial sections ──────────────────────────────────────────────────── */
interface Section { h2: string; p: string }
const SECTIONS: Record<string, Section[]> = {
  fr: [
    {
      h2: 'Quand choisir une carte crypto virtuelle ?',
      p: `La carte virtuelle est le choix idéal si vous effectuez principalement des achats en ligne : e-commerce, abonnements, plateformes de streaming. Elle s'active instantanément après validation du KYC — généralement en moins d'une heure — et se connecte directement à Apple Pay et Google Pay pour des paiements NFC en magasin. Avantage sécurité majeur : votre numéro de carte physique ne circule jamais en ligne, ce qui réduit considérablement le risque de fraude. Gnosis Pay et MetaMask Card poussent ce concept encore plus loin avec des numéros de carte éphémères et une intégration directe avec votre wallet self-custody. Pour un utilisateur qui se déplace peu et privilégie les achats numériques, la carte virtuelle seule est souvent suffisante.`,
    },
    {
      h2: 'Quand choisir une carte crypto physique ?',
      p: `La carte physique devient indispensable dès que vous avez besoin de retirer des espèces ou de payer dans des commerces qui n'acceptent pas les paiements NFC. À l'étranger notamment, de nombreux pays (zones rurales, pays émergents) restent fortement orientés cash — une carte virtuelle seule ne suffit plus. La livraison prend généralement entre 5 et 15 jours ouvrés selon votre pays et le tier choisi. Crypto.com propose cinq niveaux de carte physique, de la Ruby (staking 500 USDC) à l'Obsidian (staking 400 000 USDC, métal brossé). Nexo et Bybit offrent des plafonds de retrait DAB attractifs dès les premiers niveaux, sans staking obligatoire pour Nexo. En ${YEAR}, la carte physique est recommandée à tout utilisateur qui voyage ou vit dans des zones moins équipées en terminaux NFC.`,
    },
    {
      h2: `Cartes offrant les deux formats : Crypto.com, Revolut, Nexo, Bybit`,
      p: `La majorité des grandes plateformes crypto proposent aujourd'hui les deux formats avec un seul compte. Crypto.com active automatiquement la version virtuelle de votre carte dès la validation KYC — la physique est commandée ensuite depuis l'application. Revolut fonctionne exactement de la même façon : carte virtuelle disponible en quelques secondes, carte physique livrée en 5 à 10 jours. Nexo et Bybit suivent le même modèle. Cette complémentarité est la solution idéale : vous utilisez la virtuelle pour vos achats en ligne dès maintenant, et la physique pour les retraits DAB et les voyages. Le cashback s'applique sur les deux formats au même taux, vous ne perdez donc rien à les combiner.`,
    },
  ],
  de: [
    {
      h2: 'Wann sollten Sie eine virtuelle Krypto-Karte wählen?',
      p: `Die virtuelle Karte ist die ideale Wahl, wenn Sie hauptsächlich online einkaufen: E-Commerce, Abonnements, Streaming-Plattformen. Sie wird sofort nach der KYC-Validierung aktiviert — in der Regel in weniger als einer Stunde — und verbindet sich direkt mit Apple Pay und Google Pay für NFC-Zahlungen im Geschäft. Großer Sicherheitsvorteil: Ihre physische Kartennummer zirkuliert nie online, was das Betrugsrisiko erheblich reduziert. Gnosis Pay und MetaMask Card gehen noch weiter mit temporären Kartennummern und direkter Integration mit Ihrem Self-Custody-Wallet. Für einen Nutzer, der wenig reist und digitale Käufe bevorzugt, reicht die virtuelle Karte allein oft aus.`,
    },
    {
      h2: 'Wann sollten Sie eine physische Krypto-Karte wählen?',
      p: `Die physische Karte wird unverzichtbar, sobald Sie Bargeld abheben oder in Geschäften bezahlen müssen, die keine NFC-Zahlungen akzeptieren. Gerade im Ausland bleiben viele Länder (ländliche Gebiete, Schwellenländer) stark bargeldorientiert — eine virtuelle Karte allein reicht dann nicht mehr. Die Lieferung dauert in der Regel 5 bis 15 Werktage, je nach Land und gewähltem Tier. Crypto.com bietet fünf Stufen physischer Karten an, von der Ruby (Staking 500 USDC) bis zur Obsidian (Staking 400.000 USDC, gebürstetes Metall). Nexo und Bybit bieten attraktive Geldabhebungslimits schon ab den ersten Stufen — Nexo ohne obligatorisches Staking. In ${YEAR} ist die physische Karte für alle Nutzer empfohlen, die reisen oder in Gebieten mit weniger NFC-Terminals leben.`,
    },
    {
      h2: `Karten mit beiden Formaten: Crypto.com, Revolut, Nexo, Bybit`,
      p: `Die meisten großen Krypto-Plattformen bieten heute beide Formate mit einem einzigen Konto an. Crypto.com aktiviert automatisch die virtuelle Version Ihrer Karte nach der KYC-Validierung — die physische wird anschließend über die App bestellt. Revolut funktioniert genauso: virtuelle Karte in Sekunden verfügbar, physische Karte in 5 bis 10 Tagen geliefert. Nexo und Bybit folgen demselben Modell. Diese Komplementarität ist die ideale Lösung: Sie nutzen die virtuelle Karte für Online-Einkäufe sofort, und die physische für Bargeldabhebungen und Reisen. Der Cashback gilt für beide Formate zum gleichen Satz — Sie verlieren also nichts, wenn Sie beide kombinieren.`,
    },
  ],
  es: [
    {
      h2: '¿Cuándo elegir una tarjeta crypto virtual?',
      p: `La tarjeta virtual es la opción ideal si realizas principalmente compras online: e-commerce, suscripciones, plataformas de streaming. Se activa instantáneamente tras la validación del KYC — normalmente en menos de una hora — y se conecta directamente a Apple Pay y Google Pay para pagos NFC en tienda. Gran ventaja de seguridad: tu número de tarjeta físico nunca circula online, lo que reduce considerablemente el riesgo de fraude. Gnosis Pay y MetaMask Card llevan este concepto más lejos con números de tarjeta efímeros e integración directa con tu wallet de autocustodia. Para un usuario que viaja poco y prefiere las compras digitales, la tarjeta virtual sola suele ser suficiente.`,
    },
    {
      h2: '¿Cuándo elegir una tarjeta crypto física?',
      p: `La tarjeta física se vuelve indispensable en cuanto necesitas retirar efectivo o pagar en comercios que no aceptan pagos NFC. En el extranjero especialmente, muchos países (zonas rurales, países emergentes) siguen orientados al efectivo — una tarjeta virtual sola ya no es suficiente. La entrega tarda normalmente entre 5 y 15 días laborables según tu país y el nivel elegido. Crypto.com ofrece cinco niveles de tarjeta física, desde la Ruby (staking 500 USDC) hasta la Obsidian (staking 400.000 USDC, metal cepillado). Nexo y Bybit ofrecen límites de retirada en cajero atractivos desde los primeros niveles, sin staking obligatorio para Nexo. En ${YEAR}, la tarjeta física es recomendable para cualquier usuario que viaje o viva en zonas con menos terminales NFC.`,
    },
    {
      h2: `Tarjetas con ambos formatos: Crypto.com, Revolut, Nexo, Bybit`,
      p: `La mayoría de las grandes plataformas crypto ofrecen hoy ambos formatos con una sola cuenta. Crypto.com activa automáticamente la versión virtual de tu tarjeta tras la validación KYC — la física se pide después desde la aplicación. Revolut funciona exactamente igual: tarjeta virtual disponible en segundos, tarjeta física entregada en 5 a 10 días. Nexo y Bybit siguen el mismo modelo. Esta complementariedad es la solución ideal: usas la virtual para tus compras online desde ya, y la física para las retiradas en cajero y los viajes. El cashback se aplica en ambos formatos al mismo porcentaje, así que no pierdes nada combinándolas.`,
    },
  ],
  it: [
    {
      h2: 'Quando scegliere una carta crypto virtuale?',
      p: `La carta virtuale è la scelta ideale se effettui principalmente acquisti online: e-commerce, abbonamenti, piattaforme di streaming. Si attiva istantaneamente dopo la validazione del KYC — generalmente in meno di un'ora — e si connette direttamente ad Apple Pay e Google Pay per i pagamenti NFC in negozio. Importante vantaggio di sicurezza: il tuo numero di carta fisico non circola mai online, riducendo considerevolmente il rischio di frode. Gnosis Pay e MetaMask Card spingono questo concetto ancora più in là con numeri di carta temporanei e integrazione diretta con il tuo wallet self-custody. Per un utente che viaggia poco e preferisce gli acquisti digitali, la carta virtuale da sola è spesso sufficiente.`,
    },
    {
      h2: 'Quando scegliere una carta crypto fisica?',
      p: `La carta fisica diventa indispensabile non appena hai bisogno di prelevare contante o pagare in negozi che non accettano pagamenti NFC. All'estero soprattutto, molti paesi (zone rurali, paesi emergenti) rimangono fortemente orientati al contante — una carta virtuale da sola non basta più. La consegna richiede generalmente tra 5 e 15 giorni lavorativi a seconda del paese e del livello scelto. Crypto.com offre cinque livelli di carta fisica, dalla Ruby (staking 500 USDC) all'Obsidian (staking 400.000 USDC, metallo spazzolato). Nexo e Bybit offrono limiti di prelievo ATM interessanti già dai primi livelli — Nexo senza staking obbligatorio. Nel ${YEAR}, la carta fisica è consigliata a tutti gli utenti che viaggiano o vivono in zone meno attrezzate con terminali NFC.`,
    },
    {
      h2: `Carte con entrambi i formati: Crypto.com, Revolut, Nexo, Bybit`,
      p: `La maggior parte delle grandi piattaforme crypto offre oggi entrambi i formati con un unico account. Crypto.com attiva automaticamente la versione virtuale della tua carta dopo la validazione KYC — quella fisica viene ordinata successivamente dall'app. Revolut funziona esattamente allo stesso modo: carta virtuale disponibile in pochi secondi, carta fisica consegnata in 5-10 giorni. Nexo e Bybit seguono lo stesso modello. Questa complementarietà è la soluzione ideale: usi la virtuale per i tuoi acquisti online fin da subito, e la fisica per i prelievi ATM e i viaggi. Il cashback si applica su entrambi i formati allo stesso tasso — non perdi nulla combinandole.`,
    },
  ],
  en: [
    {
      h2: 'When to choose a virtual crypto card?',
      p: `A virtual card is the ideal choice if you mainly shop online: e-commerce, subscriptions, streaming platforms. It activates instantly after KYC validation — typically in under an hour — and connects directly to Apple Pay and Google Pay for NFC payments in stores. Major security advantage: your physical card number never circulates online, significantly reducing fraud risk. Gnosis Pay and MetaMask Card take this further with ephemeral card numbers and direct integration with your self-custody wallet. For users who travel infrequently and prefer digital purchases, the virtual card alone is often sufficient.`,
    },
    {
      h2: 'When to choose a physical crypto card?',
      p: `A physical card becomes essential whenever you need to withdraw cash or pay at merchants that don't accept NFC payments. When traveling especially, many countries (rural areas, emerging markets) remain heavily cash-oriented — a virtual card alone won't cut it. Delivery typically takes 5 to 15 business days depending on your country and chosen tier. Crypto.com offers five levels of physical card, from the Ruby (500 USDC staking) to the Obsidian (400,000 USDC staking, brushed metal). Nexo and Bybit offer attractive ATM withdrawal limits from entry tiers — Nexo with no mandatory staking. In ${YEAR}, the physical card is recommended for any user who travels or lives in areas with fewer NFC terminals.`,
    },
    {
      h2: `Cards offering both formats: Crypto.com, Revolut, Nexo, Bybit`,
      p: `Most major crypto platforms now offer both formats with a single account. Crypto.com automatically activates the virtual version of your card after KYC validation — the physical one is ordered afterwards from the app. Revolut works exactly the same way: virtual card available in seconds, physical card delivered in 5 to 10 days. Nexo and Bybit follow the same model. This complementarity is the ideal solution: use the virtual card for online purchases right now, and the physical card for ATM withdrawals and travel. Cashback applies to both formats at the same rate — so you lose nothing by combining them.`,
    },
  ],
};

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
interface FaqItem { q: string; a: string }
const FAQ: Record<string, FaqItem[]> = {
  fr: [
    { q: 'Peut-on avoir à la fois une carte virtuelle et une physique ?', a: 'Oui, chez Crypto.com, Revolut, Nexo et Bybit, les deux formats sont inclus dans le même compte. La virtuelle est activée en premier, la physique est commandée ensuite.' },
    { q: 'Le cashback est-il le même sur la carte virtuelle et physique ?', a: 'Oui, le taux de cashback est identique quelle que soit la forme de la carte. Il dépend du niveau de compte (staking), pas du format de la carte.' },
    { q: 'Peut-on retirer des espèces avec une carte virtuelle ?', a: 'Non, les retraits DAB nécessitent une carte physique. C\'est la principale limitation de la carte virtuelle.' },
    { q: 'Quelle carte choisir pour voyager ?', a: 'La carte physique est indispensable en voyage : retraits DAB, paiements dans les pays moins équipés en NFC. Crypto.com et Bybit ont les meilleurs plafonds de retrait à l\'étranger.' },
    { q: 'La carte virtuelle est-elle plus sécurisée que la physique ?', a: 'Les deux ont des avantages différents. La virtuelle ne peut pas être skimmée physiquement. La physique ne peut pas être utilisée pour des achats en ligne frauduleux si le numéro est différent de la virtuelle.' },
  ],
  de: [
    { q: 'Kann man sowohl eine virtuelle als auch eine physische Karte haben?', a: 'Ja, bei Crypto.com, Revolut, Nexo und Bybit sind beide Formate im selben Konto enthalten. Die virtuelle wird zuerst aktiviert, die physische anschließend bestellt.' },
    { q: 'Ist der Cashback bei virtueller und physischer Karte gleich?', a: 'Ja, der Cashback-Satz ist unabhängig vom Kartenformat identisch. Er hängt vom Kontoniveau (Staking) ab, nicht vom Format.' },
    { q: 'Kann man mit einer virtuellen Karte Bargeld abheben?', a: 'Nein, Geldautomatenabhebungen erfordern eine physische Karte. Das ist die Haupteinschränkung der virtuellen Karte.' },
    { q: 'Welche Karte für Reisen wählen?', a: 'Die physische Karte ist auf Reisen unverzichtbar: Bargeldabhebungen, Zahlungen in Ländern mit weniger NFC-Terminals. Crypto.com und Bybit haben die besten Abhebungslimits im Ausland.' },
    { q: 'Ist die virtuelle Karte sicherer als die physische?', a: 'Beide haben unterschiedliche Sicherheitsvorteile. Die virtuelle kann nicht physisch geskimmt werden. Die physische kann nicht für Online-Betrug genutzt werden, wenn die Nummer von der virtuellen abweicht.' },
  ],
  es: [
    { q: '¿Se puede tener tanto una tarjeta virtual como una física?', a: 'Sí, en Crypto.com, Revolut, Nexo y Bybit, ambos formatos están incluidos en la misma cuenta. La virtual se activa primero, la física se pide después.' },
    { q: '¿El cashback es el mismo en la tarjeta virtual y la física?', a: 'Sí, el porcentaje de cashback es idéntico independientemente del formato de la tarjeta. Depende del nivel de cuenta (staking), no del formato.' },
    { q: '¿Se puede retirar efectivo con una tarjeta virtual?', a: 'No, las retiradas en cajero automático requieren una tarjeta física. Es la principal limitación de la tarjeta virtual.' },
    { q: '¿Qué tarjeta elegir para viajar?', a: 'La tarjeta física es indispensable al viajar: retiradas en cajero, pagos en países con menos terminales NFC. Crypto.com y Bybit tienen los mejores límites de retirada en el extranjero.' },
    { q: '¿Es la tarjeta virtual más segura que la física?', a: 'Ambas tienen ventajas de seguridad diferentes. La virtual no puede ser skimeada físicamente. La física no puede usarse para compras online fraudulentas si el número difiere del de la virtual.' },
  ],
  it: [
    { q: 'Si può avere sia una carta virtuale che una fisica?', a: 'Sì, presso Crypto.com, Revolut, Nexo e Bybit, entrambi i formati sono inclusi nello stesso account. La virtuale viene attivata per prima, quella fisica viene ordinata successivamente.' },
    { q: 'Il cashback è lo stesso sulla carta virtuale e fisica?', a: 'Sì, il tasso di cashback è identico indipendentemente dal formato della carta. Dipende dal livello dell\'account (staking), non dal formato.' },
    { q: 'Si può prelevare contante con una carta virtuale?', a: 'No, i prelievi ATM richiedono una carta fisica. È il principale limite della carta virtuale.' },
    { q: 'Quale carta scegliere per viaggiare?', a: 'La carta fisica è indispensabile in viaggio: prelievi ATM, pagamenti in paesi meno attrezzati con terminali NFC. Crypto.com e Bybit hanno i migliori limiti di prelievo all\'estero.' },
    { q: 'La carta virtuale è più sicura di quella fisica?', a: 'Entrambe hanno vantaggi di sicurezza diversi. La virtuale non può essere skimmata fisicamente. La fisica non può essere usata per acquisti online fraudolenti se il numero differisce da quello della virtuale.' },
  ],
  en: [
    { q: 'Can you have both a virtual and a physical card?', a: 'Yes, at Crypto.com, Revolut, Nexo, and Bybit, both formats are included in the same account. The virtual is activated first, the physical is ordered afterwards.' },
    { q: 'Is cashback the same on a virtual and physical card?', a: 'Yes, the cashback rate is identical regardless of card format. It depends on account tier (staking), not on the card format.' },
    { q: 'Can you withdraw cash with a virtual card?', a: 'No, ATM withdrawals require a physical card. That is the main limitation of virtual cards.' },
    { q: 'Which card to choose for travel?', a: 'The physical card is essential for travel: ATM withdrawals, payments in countries with fewer NFC terminals. Crypto.com and Bybit have the best withdrawal limits abroad.' },
    { q: 'Is the virtual card more secure than the physical?', a: 'Both have different security advantages. The virtual card cannot be physically skimmed. The physical card cannot be used for online fraud if its number differs from the virtual card.' },
  ],
};

/* ── CTA labels ──────────────────────────────────────────────────────────── */
const CTA_VIRTUAL: Record<string, string> = {
  fr: 'Voir les meilleures cartes virtuelles →',
  de: 'Beste virtuelle Karten ansehen →',
  es: 'Ver las mejores tarjetas virtuales →',
  it: 'Vedi le migliori carte virtuali →',
  en: 'Browse best virtual cards →',
};
const CTA_PHYSICAL: Record<string, string> = {
  fr: 'Voir les meilleures cartes physiques →',
  de: 'Beste physische Karten ansehen →',
  es: 'Ver las mejores tarjetas físicas →',
  it: 'Vedi le migliori carte fisiche →',
  en: 'Browse best physical cards →',
};
const FAQ_TITLE: Record<string, string> = {
  fr: 'Questions fréquentes',
  de: 'Häufige Fragen',
  es: 'Preguntas frecuentes',
  it: 'Domande frequenti',
  en: 'Frequently asked questions',
};
const SEE_ALSO_TITLE: Record<string, string> = {
  fr: 'Comparez aussi',
  de: 'Auch vergleichen',
  es: 'También compara',
  it: 'Confronta anche',
  en: 'Also compare',
};

/* ── Status icon ─────────────────────────────────────────────────────────── */
function StatusIcon({ status }: { status: RowStatus }) {
  if (status === 'yes')     return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
  if (status === 'no')      return <XCircle     className="w-5 h-5 text-red-400 shrink-0" />;
  return                           <HelpCircle  className="w-5 h-5 text-amber-400 shrink-0" />;
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function VirtualVsPhysicalPage() {
  const lang = useLanguage();
  const seo  = SEO[lang]          ?? SEO.en;
  const rows = TABLE_ROWS[lang]   ?? TABLE_ROWS.en;
  const head = TABLE_HEADER[lang] ?? TABLE_HEADER.en;
  const secs = SECTIONS[lang]     ?? SECTIONS.en;
  const faqs = FAQ[lang]          ?? FAQ.en;

  useSeoMeta({ title: seo.title, description: seo.desc, lang });

  /* Hreflang */
  useHreflang(l => `https://topcryptocards.eu/${l}/${VVP_SLUGS[l as keyof typeof VVP_SLUGS] ?? l}`, []);

  /* Schema.org */
  useEffect(() => {
    document.getElementById('schema-vvp')?.remove();
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    const el = document.createElement('script');
    el.id = 'schema-vvp'; el.type = 'application/ld+json';
    el.text = JSON.stringify(faqSchema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-vvp')?.remove(); };
  }, [faqs]);

  const virtualSlug  = THEMATIC_ROUTES.virtual[lang as keyof typeof THEMATIC_ROUTES.virtual]   ?? THEMATIC_ROUTES.virtual.en;
  const physicalSlug = THEMATIC_ROUTES.physical[lang as keyof typeof THEMATIC_ROUTES.physical] ?? THEMATIC_ROUTES.physical.en;

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      {/* Breadcrumb */}
      <div className="container-app pt-6 pb-2">
        <Breadcrumb items={[
          { label: HOME_LABEL[lang] ?? 'Home', href: `/${lang}` },
          { label: GUIDES_LABEL[lang] ?? 'Guides', href: `/${lang}` },
          { label: PAGE_TITLE[lang] ?? PAGE_TITLE.en },
        ]} />
      </div>

      {/* H1 + Intro */}
      <div className="container-app pt-4 pb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
          {PAGE_TITLE[lang] ?? PAGE_TITLE.en}
        </h1>
        <p className="text-slate-300 text-base leading-relaxed max-w-3xl">
          {INTRO[lang] ?? INTRO.en}
        </p>
      </div>

      {/* Comparison table */}
      <div className="container-app pb-10">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-bg-border">
                <th className="text-left py-3 px-4 text-slate-400 font-medium w-1/3">{head.criterion}</th>
                <th className="text-left py-3 px-4 text-cyan-accent font-semibold w-1/3">📱 {head.virtual}</th>
                <th className="text-left py-3 px-4 text-emerald-400 font-semibold w-1/3">💳 {head.physical}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-bg-border/50 ${i % 2 === 0 ? 'bg-bg-elevated/30' : ''}`}>
                  <td className="py-3 px-4 text-slate-300 font-medium">{row.criterion}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <StatusIcon status={row.virtual.status} />
                      <span className="text-slate-300">{row.virtual.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <StatusIcon status={row.physical.status} />
                      <span className="text-slate-300">{row.physical.label}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editorial sections */}
      <div className="container-app pb-10 space-y-8 max-w-3xl">
        {secs.map((sec, i) => (
          <section key={i}>
            <h2 className="font-display text-xl font-bold text-white mb-3">{sec.h2}</h2>
            <p className="text-slate-300 leading-relaxed">{sec.p}</p>
          </section>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="container-app pb-10">
        <div className="flex flex-wrap gap-4">
          <Link
            to={`/${lang}/${virtualSlug}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-elevated border border-bg-border text-cyan-accent hover:border-cyan-accent/50 transition-colors text-sm font-medium"
          >
            {CTA_VIRTUAL[lang] ?? CTA_VIRTUAL.en}
          </Link>
          <Link
            to={`/${lang}/${physicalSlug}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-elevated border border-bg-border text-emerald-400 hover:border-emerald-400/50 transition-colors text-sm font-medium"
          >
            {CTA_PHYSICAL[lang] ?? CTA_PHYSICAL.en}
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="container-app pb-10 max-w-3xl">
        <h2 className="font-display text-xl font-bold text-white mb-6">
          {FAQ_TITLE[lang] ?? FAQ_TITLE.en}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card-surface p-5">
              <p className="font-semibold text-white mb-2">{faq.q}</p>
              <p className="text-slate-300 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* See also */}
      <div className="container-app pb-4">
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-3">
          {SEE_ALSO_TITLE[lang] ?? SEE_ALSO_TITLE.en}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={`/${lang}/${virtualSlug}`}
            className="px-4 py-2 rounded-lg bg-bg-elevated border border-bg-border text-slate-300 hover:text-white hover:border-slate-500 text-sm transition-colors">
            📱 {head.virtual}
          </Link>
          <Link to={`/${lang}/${physicalSlug}`}
            className="px-4 py-2 rounded-lg bg-bg-elevated border border-bg-border text-slate-300 hover:text-white hover:border-slate-500 text-sm transition-colors">
            💳 {head.physical}
          </Link>
        </div>
      </div>
    </div>
  );
}
