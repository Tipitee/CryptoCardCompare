import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { Shield, BarChart3, RefreshCw, Star, BookOpen } from 'lucide-react';

const BASE = 'https://topcryptocards.eu';

const ABOUT_SLUGS: Record<string, string> = {
  fr: 'a-propos', de: 'ueber-uns', es: 'sobre-nosotros', it: 'chi-siamo', en: 'about',
};

const ABOUT_SEO: Record<string, { title: string; desc: string }> = {
  fr: {
    title: 'À Propos de TopCryptoCards — Méthodologie & Équipe',
    desc: "Découvrez qui nous sommes, comment nous évaluons les cartes crypto et notre engagement pour des données fiables et à jour. Indépendant, gratuit, mis à jour mensuellement.",
  },
  de: {
    title: 'Über TopCryptoCards — Methodik & Team',
    desc: "Erfahren Sie, wer wir sind, wie wir Krypto-Karten bewerten und warum unsere Daten zuverlässig sind. Unabhängig, kostenlos, monatlich aktualisiert.",
  },
  es: {
    title: 'Sobre TopCryptoCards — Metodología & Equipo',
    desc: "Descubre quiénes somos, cómo evaluamos las tarjetas crypto y nuestro compromiso con datos fiables y actualizados. Independiente, gratuito, actualizado mensualmente.",
  },
  it: {
    title: 'Chi Siamo — TopCryptoCards Metodologia & Team',
    desc: "Scopri chi siamo, come valutiamo le carte crypto e il nostro impegno per dati affidabili e aggiornati. Indipendente, gratuito, aggiornato mensilmente.",
  },
  en: {
    title: 'About TopCryptoCards — Methodology & Team',
    desc: "Learn who we are, how we evaluate crypto cards, and our commitment to reliable, up-to-date data. Independent, free, updated monthly.",
  },
};

const ABOUT_CONTENT: Record<string, {
  hero: string;
  heroSub: string;
  missionTitle: string;
  missionBody: string;
  methodTitle: string;
  criteria: { icon: string; title: string; body: string }[];
  updateTitle: string;
  updateBody: string;
  independenceTitle: string;
  independenceBody: string;
  disclosureTitle: string;
  disclosureBody: string;
  ctaTitle: string;
  ctaCompare: string;
  ctaSimulator: string;
  ctaReviews: string;
}> = {
  fr: {
    hero: 'À propos de TopCryptoCards',
    heroSub: "Le comparateur indépendant des cartes crypto en Europe. Données vérifiées, mises à jour mensuellement, sans agenda commercial caché.",
    missionTitle: 'Notre mission',
    missionBody: `TopCryptoCards est né d'un constat simple : comparer les cartes crypto est complexe. Les cashback varient selon le niveau de staking, les frais sont parfois cachés, et les conditions changent régulièrement. Notre objectif est de centraliser toutes ces données de manière claire, structurée et à jour, pour que chaque utilisateur puisse faire un choix éclairé — qu'il soit novice en crypto ou utilisateur expérimenté.

Nous couvrons plus de 20 cartes émises par des acteurs réglementés en Europe : Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, Plutus, Wirex, Revolut Metal, et d'autres. Chaque carte est évaluée sur les mêmes critères objectifs.`,
    methodTitle: 'Notre méthodologie',
    criteria: [
      {
        icon: '💰',
        title: 'Taux de cashback réels',
        body: 'Nous distinguons le cashback de base (sans staking), le cashback premium (avec staking activé) et le cashback sans staking. Les données proviennent directement des pages officielles de chaque émetteur et sont vérifiées manuellement.',
      },
      {
        icon: '💶',
        title: 'Frais annuels réels',
        body: 'Les frais incluent les abonnements mensuels convertis en annuel, les frais de carte physique et les coûts de maintien du niveau. Nous excluons les frais d\'émission uniques sauf s\'ils sont systématiques.',
      },
      {
        icon: '🔒',
        title: 'Exigences de staking',
        body: 'Le montant de staking requis est exprimé en euros au taux de marché au moment de la collecte. Nous indiquons clairement lorsque le staking est optionnel ou obligatoire pour débloquer le cashback.',
      },
      {
        icon: '🛡️',
        title: 'Score de confiance',
        body: 'Le trust score reflète la régulation (licence EMI, agrément PSAN, conformité MiCA), l\'ancienneté de la plateforme, la liquidité et les incidents de sécurité passés. Il ne constitue pas un conseil financier.',
      },
      {
        icon: '🌍',
        title: 'Disponibilité par marché',
        body: 'Chaque carte est marquée selon sa disponibilité en France, en zone euro et à l\'international. Nous vérifions les restrictions géographiques sur les apps stores et les pages officielles.',
      },
      {
        icon: '📅',
        title: 'Fréquence de mise à jour',
        body: 'Les données sont révisées au minimum une fois par mois. En cas de changement tarifaire majeur (annoncé sur les sites officiels ou les forums), nous mettons à jour dans les 72h.',
      },
    ],
    updateTitle: 'Nos sources',
    updateBody: `Nos données proviennent exclusivement de sources primaires : sites officiels des émetteurs, applications mobiles, annonces dans les forums officiels (Discord, Reddit, Telegram) et communiqués de presse. Nous n'utilisons pas de données agrégées tierces comme source principale. Lorsqu'une information est incertaine ou contestée, nous l'indiquons clairement.`,
    independenceTitle: 'Indépendance éditoriale',
    independenceBody: `TopCryptoCards est un site éditorial indépendant. Nos classements et évaluations sont déterminés uniquement par nos critères objectifs — jamais par des accords commerciaux. Certaines cartes affichées incluent des liens affiliés : si vous utilisez ces liens pour vous inscrire, nous percevons une commission sans frais supplémentaires pour vous. Cette rémunération ne modifie pas nos notations ni l'ordre de nos comparaisons.`,
    disclosureTitle: 'Divulgation des liens affiliés',
    disclosureBody: `Conformément aux réglementations européennes sur la publicité en ligne, tous les liens affiliés sont identifiés par l'attribut rel="sponsored". La présence d'un lien affilié n'influence pas notre évaluation de la carte concernée. Vous pouvez consulter notre page de divulgation complète pour plus de détails.`,
    ctaTitle: 'Prêt à comparer ?',
    ctaCompare: 'Comparer les cartes',
    ctaSimulator: 'Simuler mes gains',
    ctaReviews: 'Lire les avis',
  },
  de: {
    hero: 'Über TopCryptoCards',
    heroSub: "Der unabhängige Krypto-Karten-Vergleich für Europa. Verifizierte Daten, monatlich aktualisiert, ohne versteckte kommerzielle Agenda.",
    missionTitle: 'Unsere Mission',
    missionBody: `TopCryptoCards entstand aus einer einfachen Beobachtung: Der Vergleich von Krypto-Karten ist komplex. Cashback-Raten variieren je nach Staking-Level, Gebühren sind manchmal versteckt, und Konditionen ändern sich regelmäßig. Unser Ziel ist es, all diese Daten klar, strukturiert und aktuell zu zentralisieren, damit jeder Nutzer eine fundierte Entscheidung treffen kann — ob Krypto-Anfänger oder erfahrener Nutzer.

Wir decken mehr als 20 Karten von in Europa regulierten Anbietern ab: Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, Plutus, Wirex, Revolut Metal und andere. Jede Karte wird nach denselben objektiven Kriterien bewertet.`,
    methodTitle: 'Unsere Methodik',
    criteria: [
      {
        icon: '💰',
        title: 'Tatsächliche Cashback-Raten',
        body: 'Wir unterscheiden zwischen Basis-Cashback (ohne Staking), Premium-Cashback (mit aktiviertem Staking) und Cashback ohne Staking. Die Daten stammen direkt von den offiziellen Seiten jedes Emittenten und werden manuell verifiziert.',
      },
      {
        icon: '💶',
        title: 'Tatsächliche Jahresgebühren',
        body: 'Die Gebühren umfassen monatliche Abonnements (auf Jahresbasis umgerechnet), physische Kartengebühren und Kosten für die Aufrechterhaltung des Levels. Wir schließen einmalige Ausgabegebühren aus, es sei denn, sie sind systematisch.',
      },
      {
        icon: '🔒',
        title: 'Staking-Anforderungen',
        body: 'Der erforderliche Staking-Betrag wird in Euro zum Marktkurs zum Zeitpunkt der Datenerhebung angegeben. Wir weisen klar darauf hin, ob Staking optional oder obligatorisch ist, um Cashback freizuschalten.',
      },
      {
        icon: '🛡️',
        title: 'Vertrauensbewertung',
        body: 'Der Trust-Score spiegelt die Regulierung (EMI-Lizenz, MiCA-Konformität), die Plattformreife, die Liquidität und vergangene Sicherheitsvorfälle wider. Er stellt keine Finanzberatung dar.',
      },
      {
        icon: '🌍',
        title: 'Verfügbarkeit nach Markt',
        body: 'Jede Karte ist entsprechend ihrer Verfügbarkeit in Deutschland, im Euroraum und international gekennzeichnet. Wir prüfen geografische Beschränkungen in den App-Stores und auf offiziellen Seiten.',
      },
      {
        icon: '📅',
        title: 'Aktualisierungsfrequenz',
        body: 'Die Daten werden mindestens einmal im Monat überarbeitet. Bei wesentlichen Tarifänderungen (auf offiziellen Websites oder Foren angekündigt) aktualisieren wir innerhalb von 72 Stunden.',
      },
    ],
    updateTitle: 'Unsere Quellen',
    updateBody: `Unsere Daten stammen ausschließlich aus Primärquellen: offizielle Emittenten-Websites, mobile Apps, Ankündigungen in offiziellen Foren (Discord, Reddit, Telegram) und Pressemitteilungen. Wir verwenden keine aggregierten Drittanbieterdaten als Hauptquelle. Wenn eine Information unsicher oder umstritten ist, weisen wir klar darauf hin.`,
    independenceTitle: 'Redaktionelle Unabhängigkeit',
    independenceBody: `TopCryptoCards ist eine unabhängige redaktionelle Website. Unsere Rankings und Bewertungen werden ausschließlich durch unsere objektiven Kriterien bestimmt — niemals durch kommerzielle Vereinbarungen. Einige angezeigte Karten enthalten Affiliate-Links: Wenn Sie diese Links zur Anmeldung verwenden, erhalten wir eine Provision ohne zusätzliche Kosten für Sie. Diese Vergütung ändert unsere Bewertungen oder die Reihenfolge unserer Vergleiche nicht.`,
    disclosureTitle: 'Offenlegung von Affiliate-Links',
    disclosureBody: `Gemäß den europäischen Vorschriften zur Online-Werbung sind alle Affiliate-Links mit dem Attribut rel="sponsored" gekennzeichnet. Das Vorhandensein eines Affiliate-Links beeinflusst unsere Bewertung der betreffenden Karte nicht. Weitere Informationen finden Sie auf unserer vollständigen Offenlegungsseite.`,
    ctaTitle: 'Bereit zum Vergleichen?',
    ctaCompare: 'Karten vergleichen',
    ctaSimulator: 'Gewinne simulieren',
    ctaReviews: 'Bewertungen lesen',
  },
  es: {
    hero: 'Sobre TopCryptoCards',
    heroSub: "El comparador independiente de tarjetas crypto en Europa. Datos verificados, actualizados mensualmente, sin agenda comercial oculta.",
    missionTitle: 'Nuestra misión',
    missionBody: `TopCryptoCards nació de una observación simple: comparar tarjetas crypto es complejo. Los cashback varían según el nivel de staking, las comisiones a veces están ocultas y las condiciones cambian regularmente. Nuestro objetivo es centralizar todos estos datos de manera clara, estructurada y actualizada, para que cada usuario pueda tomar una decisión informada, sea principiante en crypto o usuario experimentado.

Cubrimos más de 20 tarjetas emitidas por actores regulados en Europa: Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, Plutus, Wirex, Revolut Metal y otros. Cada tarjeta se evalúa con los mismos criterios objetivos.`,
    methodTitle: 'Nuestra metodología',
    criteria: [
      {
        icon: '💰',
        title: 'Tasas de cashback reales',
        body: 'Distinguimos entre cashback base (sin staking), cashback premium (con staking activado) y cashback sin staking. Los datos provienen directamente de las páginas oficiales de cada emisor y se verifican manualmente.',
      },
      {
        icon: '💶',
        title: 'Comisiones anuales reales',
        body: 'Las comisiones incluyen suscripciones mensuales convertidas a anuales, comisiones de tarjeta física y costes de mantenimiento del nivel. Excluimos las comisiones de emisión únicas salvo que sean sistemáticas.',
      },
      {
        icon: '🔒',
        title: 'Requisitos de staking',
        body: 'El importe de staking requerido se expresa en euros al tipo de mercado en el momento de la recopilación. Indicamos claramente cuando el staking es opcional u obligatorio para desbloquear el cashback.',
      },
      {
        icon: '🛡️',
        title: 'Puntuación de confianza',
        body: 'El trust score refleja la regulación (licencia EMI, conformidad MiCA), la madurez de la plataforma, la liquidez y los incidentes de seguridad pasados. No constituye asesoramiento financiero.',
      },
      {
        icon: '🌍',
        title: 'Disponibilidad por mercado',
        body: 'Cada tarjeta está etiquetada según su disponibilidad en España, en la zona euro e internacionalmente. Verificamos las restricciones geográficas en las tiendas de apps y las páginas oficiales.',
      },
      {
        icon: '📅',
        title: 'Frecuencia de actualización',
        body: 'Los datos se revisan como mínimo una vez al mes. En caso de cambio tarifario importante (anunciado en sitios oficiales o foros), actualizamos en 72 horas.',
      },
    ],
    updateTitle: 'Nuestras fuentes',
    updateBody: `Nuestros datos provienen exclusivamente de fuentes primarias: sitios oficiales de los emisores, aplicaciones móviles, anuncios en foros oficiales (Discord, Reddit, Telegram) y notas de prensa. No utilizamos datos agregados de terceros como fuente principal. Cuando una información es incierta o disputada, lo indicamos claramente.`,
    independenceTitle: 'Independencia editorial',
    independenceBody: `TopCryptoCards es un sitio editorial independiente. Nuestros rankings y evaluaciones están determinados únicamente por nuestros criterios objetivos, nunca por acuerdos comerciales. Algunas tarjetas mostradas incluyen enlaces de afiliados: si utilizas estos enlaces para registrarte, recibimos una comisión sin coste adicional para ti. Esta remuneración no modifica nuestras valoraciones ni el orden de nuestras comparativas.`,
    disclosureTitle: 'Divulgación de enlaces de afiliados',
    disclosureBody: `De conformidad con las normativas europeas sobre publicidad online, todos los enlaces de afiliados están identificados con el atributo rel="sponsored". La presencia de un enlace de afiliado no influye en nuestra evaluación de la tarjeta en cuestión. Puedes consultar nuestra página de divulgación completa para más detalles.`,
    ctaTitle: '¿Listo para comparar?',
    ctaCompare: 'Comparar tarjetas',
    ctaSimulator: 'Simular ganancias',
    ctaReviews: 'Leer opiniones',
  },
  it: {
    hero: 'Chi Siamo — TopCryptoCards',
    heroSub: "Il comparatore indipendente di carte crypto in Europa. Dati verificati, aggiornati mensilmente, senza agenda commerciale nascosta.",
    missionTitle: 'La nostra missione',
    missionBody: `TopCryptoCards è nato da una semplice osservazione: confrontare le carte crypto è complesso. I cashback variano in base al livello di staking, le commissioni sono a volte nascoste e le condizioni cambiano regolarmente. Il nostro obiettivo è centralizzare tutti questi dati in modo chiaro, strutturato e aggiornato, affinché ogni utente possa fare una scelta informata, che sia un principiante nel settore crypto o un utente esperto.

Copriamo più di 20 carte emesse da operatori regolamentati in Europa: Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, Plutus, Wirex, Revolut Metal e altri. Ogni carta è valutata secondo gli stessi criteri oggettivi.`,
    methodTitle: 'La nostra metodologia',
    criteria: [
      {
        icon: '💰',
        title: 'Tassi di cashback reali',
        body: 'Distinguiamo tra cashback base (senza staking), cashback premium (con staking attivato) e cashback senza staking. I dati provengono direttamente dalle pagine ufficiali di ogni emittente e sono verificati manualmente.',
      },
      {
        icon: '💶',
        title: 'Commissioni annuali reali',
        body: 'Le commissioni includono gli abbonamenti mensili convertiti in annuali, le commissioni per la carta fisica e i costi di mantenimento del livello. Escludiamo le commissioni di emissione una tantum, salvo che siano sistematiche.',
      },
      {
        icon: '🔒',
        title: 'Requisiti di staking',
        body: 'L\'importo di staking richiesto è espresso in euro al tasso di mercato al momento della raccolta. Indichiamo chiaramente quando lo staking è opzionale od obbligatorio per sbloccare il cashback.',
      },
      {
        icon: '🛡️',
        title: 'Punteggio di fiducia',
        body: 'Il trust score riflette la regolamentazione (licenza EMI, conformità MiCA), la maturità della piattaforma, la liquidità e gli incidenti di sicurezza passati. Non costituisce una consulenza finanziaria.',
      },
      {
        icon: '🌍',
        title: 'Disponibilità per mercato',
        body: 'Ogni carta è etichettata in base alla sua disponibilità in Italia, nella zona euro e a livello internazionale. Verifichiamo le restrizioni geografiche negli app store e nelle pagine ufficiali.',
      },
      {
        icon: '📅',
        title: 'Frequenza di aggiornamento',
        body: 'I dati vengono rivisti almeno una volta al mese. In caso di variazione tariffaria importante (annunciata sui siti ufficiali o sui forum), aggiorniamo entro 72 ore.',
      },
    ],
    updateTitle: 'Le nostre fonti',
    updateBody: `I nostri dati provengono esclusivamente da fonti primarie: siti ufficiali degli emittenti, applicazioni mobili, annunci nei forum ufficiali (Discord, Reddit, Telegram) e comunicati stampa. Non utilizziamo dati aggregati di terzi come fonte principale. Quando un'informazione è incerta o contestata, lo indichiamo chiaramente.`,
    independenceTitle: 'Indipendenza editoriale',
    independenceBody: `TopCryptoCards è un sito editoriale indipendente. I nostri ranking e valutazioni sono determinati esclusivamente dai nostri criteri oggettivi, mai da accordi commerciali. Alcune carte visualizzate includono link di affiliazione: se utilizzi questi link per registrarti, riceviamo una commissione senza costi aggiuntivi per te. Questa remunerazione non modifica le nostre valutazioni né l'ordine dei nostri confronti.`,
    disclosureTitle: 'Dichiarazione sui link di affiliazione',
    disclosureBody: `In conformità con le normative europee sulla pubblicità online, tutti i link di affiliazione sono identificati dall'attributo rel="sponsored". La presenza di un link di affiliazione non influisce sulla nostra valutazione della carta in questione. Puoi consultare la nostra pagina di divulgazione completa per maggiori dettagli.`,
    ctaTitle: 'Pronto a confrontare?',
    ctaCompare: 'Confronta le carte',
    ctaSimulator: 'Simula i guadagni',
    ctaReviews: 'Leggi le recensioni',
  },
  en: {
    hero: 'About TopCryptoCards',
    heroSub: "Europe's independent crypto card comparison tool. Verified data, updated monthly, with no hidden commercial agenda.",
    missionTitle: 'Our mission',
    missionBody: `TopCryptoCards was born from a simple observation: comparing crypto cards is complex. Cashback rates vary by staking level, fees are sometimes hidden, and conditions change regularly. Our goal is to centralise all this data in a clear, structured and up-to-date way so that every user can make an informed choice — whether they're a crypto beginner or an experienced user.

We cover more than 20 cards issued by regulated providers in Europe: Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, Plutus, Wirex, Revolut Metal, and others. Every card is evaluated against the same objective criteria.`,
    methodTitle: 'Our methodology',
    criteria: [
      {
        icon: '💰',
        title: 'Actual cashback rates',
        body: 'We distinguish between base cashback (no staking), premium cashback (staking enabled) and cashback without staking. Data comes directly from each issuer\'s official pages and is manually verified.',
      },
      {
        icon: '💶',
        title: 'Actual annual fees',
        body: 'Fees include monthly subscriptions converted to annual, physical card fees and level maintenance costs. We exclude one-time issuance fees unless they are systematic.',
      },
      {
        icon: '🔒',
        title: 'Staking requirements',
        body: 'The required staking amount is expressed in euros at the market rate at the time of data collection. We clearly indicate when staking is optional or mandatory to unlock cashback.',
      },
      {
        icon: '🛡️',
        title: 'Trust score',
        body: 'The trust score reflects regulation (EMI licence, MiCA compliance), platform maturity, liquidity and past security incidents. It does not constitute financial advice.',
      },
      {
        icon: '🌍',
        title: 'Availability by market',
        body: 'Each card is labelled by its availability in the UK/EU and internationally. We verify geographic restrictions on app stores and official pages.',
      },
      {
        icon: '📅',
        title: 'Update frequency',
        body: 'Data is reviewed at least once a month. In the event of a major pricing change (announced on official sites or forums), we update within 72 hours.',
      },
    ],
    updateTitle: 'Our sources',
    updateBody: `Our data comes exclusively from primary sources: official issuer websites, mobile apps, announcements on official forums (Discord, Reddit, Telegram) and press releases. We do not use aggregated third-party data as a primary source. When information is uncertain or disputed, we say so clearly.`,
    independenceTitle: 'Editorial independence',
    independenceBody: `TopCryptoCards is an independent editorial site. Our rankings and evaluations are determined solely by our objective criteria — never by commercial agreements. Some cards displayed include affiliate links: if you use these links to sign up, we receive a commission at no additional cost to you. This remuneration does not alter our ratings or the order of our comparisons.`,
    disclosureTitle: 'Affiliate link disclosure',
    disclosureBody: `In accordance with European regulations on online advertising, all affiliate links are identified by the rel="sponsored" attribute. The presence of an affiliate link does not influence our evaluation of the card concerned. You can consult our full disclosure page for more details.`,
    ctaTitle: 'Ready to compare?',
    ctaCompare: 'Compare cards',
    ctaSimulator: 'Simulate earnings',
    ctaReviews: 'Read reviews',
  },
};

export default function About() {
  const lang = useLanguage();
  const c = ABOUT_CONTENT[lang] ?? ABOUT_CONTENT.en;
  const seo = ABOUT_SEO[lang] ?? ABOUT_SEO.en;
  const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;

  useSeoMeta({ title: seo.title, description: seo.desc, lang });

  // ── Hreflang ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.querySelectorAll('link[data-hreflang-about]').forEach(el => el.remove());
    Object.entries(ABOUT_SLUGS).forEach(([l, slug]) => {
      const el = document.createElement('link');
      el.rel = 'alternate'; el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/${slug}`);
      el.setAttribute('data-hreflang-about', 'true');
      document.head.appendChild(el);
    });
    const xd = document.createElement('link');
    xd.rel = 'alternate'; xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', `${BASE}/fr/a-propos`);
    xd.setAttribute('data-hreflang-about', 'true');
    document.head.appendChild(xd);
    return () => { document.querySelectorAll('link[data-hreflang-about]').forEach(el => el.remove()); };
  }, []);

  // ── Schema.org AboutPage + Organization ──────────────────────────────────────
  useEffect(() => {
    const slug = ABOUT_SLUGS[lang] ?? 'about';
    const pageUrl = `${BASE}/${lang}/${slug}`;
    const schema = [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: seo.title,
        description: seo.desc,
        url: pageUrl,
        inLanguage: lang,
        publisher: {
          '@type': 'Organization',
          name: 'TopCryptoCards',
          url: BASE,
          sameAs: ['https://twitter.com/TopCryptoCards'],
          logo: { '@type': 'ImageObject', url: `${BASE}/logo.png`, width: 200, height: 60 },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TopCryptoCards',
        url: BASE,
        sameAs: ['https://twitter.com/TopCryptoCards'],
        description: seo.desc,
        logo: { '@type': 'ImageObject', url: `${BASE}/logo.png`, width: 200, height: 60 },
        foundingDate: '2023',
        areaServed: { '@type': 'Place', name: 'Europe' },
        knowsAbout: ['crypto cards', 'cryptocurrency', 'cashback', 'fintech', 'MiCA regulation'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: lang === 'fr' ? 'Accueil' : lang === 'de' ? 'Startseite' : lang === 'es' ? 'Inicio' : lang === 'it' ? 'Home' : 'Home', item: `${BASE}/${lang}` },
          { '@type': 'ListItem', position: 2, name: seo.title, item: pageUrl },
        ],
      },
    ];
    document.getElementById('schema-about')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-about'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-about')?.remove(); };
  }, [lang, seo]);

  return (
    <div className="container-app py-10 max-w-4xl">
      {/* Hero */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{c.hero}</h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">{c.heroSub}</p>
      </header>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-xl font-display font-bold text-white mb-4">{c.missionTitle}</h2>
        {c.missionBody.split('\n\n').map((para, i) => (
          <p key={i} className="text-slate-400 leading-relaxed mb-4">{para}</p>
        ))}
      </section>

      {/* Methodology criteria grid */}
      <section className="mb-12">
        <h2 className="text-xl font-display font-bold text-white mb-6">{c.methodTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {c.criteria.map((crit, i) => {
            return (
              <div key={i} className="card-surface p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">{crit.icon}</span>
                  <h3 className="font-semibold text-white text-sm">{crit.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{crit.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sources */}
      <section className="mb-12 card-surface p-6">
        <div className="flex items-center gap-3 mb-3">
          <RefreshCw className="w-5 h-5 text-cyan-accent shrink-0" />
          <h2 className="text-lg font-display font-bold text-white">{c.updateTitle}</h2>
        </div>
        <p className="text-slate-400 leading-relaxed text-sm">{c.updateBody}</p>
      </section>

      {/* Independence */}
      <section className="mb-12 card-surface p-6 border-green-accent/20">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-green-accent shrink-0" />
          <h2 className="text-lg font-display font-bold text-white">{c.independenceTitle}</h2>
        </div>
        <p className="text-slate-400 leading-relaxed text-sm">{c.independenceBody}</p>
      </section>

      {/* Affiliate disclosure */}
      <section className="mb-12 card-surface p-6 border-amber-400/20">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-lg font-display font-bold text-white">{c.disclosureTitle}</h2>
        </div>
        <p className="text-slate-400 leading-relaxed text-sm">
          {c.disclosureBody}{' '}
          <Link to="/affiliate-disclosure" className="text-cyan-accent hover:underline">
            {lang === 'fr' ? 'Voir la divulgation complète' :
             lang === 'de' ? 'Vollständige Offenlegung anzeigen' :
             lang === 'es' ? 'Ver la divulgación completa' :
             lang === 'it' ? 'Vedi la divulgazione completa' :
             'View full disclosure'}
          </Link>
        </p>
      </section>

      {/* CTA */}
      <section className="card-surface p-8 text-center border-cyan-accent/20">
        <h2 className="text-xl font-display font-bold text-white mb-2">{c.ctaTitle}</h2>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link to={`/${lang}/${rt.compare}`} className="btn-primary text-sm">
            <BarChart3 className="w-4 h-4" />
            {c.ctaCompare}
          </Link>
          <Link to={`/${lang}/${rt.simulator}`} className="btn-secondary text-sm">
            <Star className="w-4 h-4" />
            {c.ctaSimulator}
          </Link>
          <Link to={`/${lang}/${rt.reviews}`} className="btn-ghost border border-bg-border text-sm">
            <BookOpen className="w-4 h-4" />
            {c.ctaReviews}
          </Link>
        </div>
      </section>
    </div>
  );
}
