/**
 * alternatives pages — "[Brand] alternatives" × 10 brands × 5 content langs
 * BE uses FR slugs/content, AT uses DE slugs/content.
 */

export type AltBrandId =
  | 'revolut' | 'crypto-com' | 'binance' | 'bybit' | 'nexo'
  | 'bitpanda' | 'wirex' | 'coinbase' | 'kraken' | 'metamask';

export type AltCopy = {
  title: string;        // ≤60 chars SEO title
  h1: string;           // H1
  description: string;  // meta desc 120-155 chars
  intro: string;        // 2-3 sentence intro paragraph
  reason: string;       // Why look for alternatives (1 sentence)
  faq: [string, string][]; // [question, answer]
};

export type AltBrandConfig = {
  brandId: AltBrandId;
  displayName: string;
  /** URL slugs for each content lang (be = fr, at = de) */
  slugs: Record<string, string>;
  copy: Record<string, AltCopy>; // fr | de | es | it | en
};

const YEAR = 2026;

export const ALT_BRANDS: AltBrandConfig[] = [
  // ─── REVOLUT ───────────────────────────────────────────────────────────────
  {
    brandId: 'revolut',
    displayName: 'Revolut',
    slugs: {
      fr: 'alternatives-revolut',
      be: 'alternatives-revolut',
      de: 'revolut-alternativen',
      at: 'revolut-alternativen',
      es: 'alternativas-revolut',
      it: 'alternative-revolut',
      en: 'revolut-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives à Revolut ${YEAR} — Meilleures Cartes Crypto`,
        h1: `Les Meilleures Alternatives à Revolut en ${YEAR}`,
        description: `Revolut n'est pas une carte crypto pure. Découvrez les 5 meilleures alternatives avec cashback en crypto, sans frais et sans staking imposé.`,
        intro: `Revolut est une néobanque polyvalente mais n'offre pas de cashback en cryptomonnaie sur ses achats. Si vous cherchez une carte qui récompense chaque dépense en BTC ou ETH, plusieurs alternatives crypto-natives existent en ${YEAR}.`,
        reason: `Revolut n'offre pas de cashback en crypto et ses avantages premium nécessitent un abonnement mensuel coûteux.`,
        faq: [
          ['Pourquoi chercher une alternative à Revolut ?', `Revolut ne verse pas de cashback en cryptomonnaie sur les achats quotidiens. Les cartes crypto comme Gnosis Pay, MetaMask Card ou Nexo offrent un cashback direct en BTC, ETH ou GNO sur chaque transaction.`],
          ['Quelle est la meilleure alternative à Revolut pour le cashback crypto ?', `Gnosis Pay offre 2% en GNO sans staking. MetaMask Card offre 1% en ETH. Nexo Card offre jusqu'à 2% en BTC selon le ratio NEXO dans votre portefeuille.`],
          ['Les alternatives à Revolut sont-elles disponibles en France ?', `Oui — toutes les cartes listées ici sont disponibles pour les résidents français via des prestataires régulés MiCA.`],
        ],
      },
      de: {
        title: `Revolut Alternativen ${YEAR} — Beste Krypto-Karten`,
        h1: `Die besten Revolut Alternativen in ${YEAR}`,
        description: `Revolut bietet kein Krypto-Cashback. Entdecken Sie die 5 besten Krypto-Karten-Alternativen mit BTC/ETH-Belohnungen ohne Staking-Pflicht.`,
        intro: `Revolut ist eine vielseitige Neobank, bietet jedoch kein Kryptowährungs-Cashback auf Alltagskäufe. Wer mit jeder Zahlung BTC oder ETH verdienen möchte, findet ${YEAR} mehrere krypto-native Alternativen in Europa.`,
        reason: `Revolut bietet kein Krypto-Cashback und Premium-Vorteile erfordern ein kostenpflichtiges Monatsabonnement.`,
        faq: [
          ['Warum eine Revolut-Alternative suchen?', `Revolut zahlt kein Krypto-Cashback auf tägliche Einkäufe. Krypto-Karten wie Gnosis Pay, MetaMask Card oder Nexo vergüten jede Transaktion direkt in BTC, ETH oder GNO.`],
          ['Was ist die beste Revolut-Alternative für Krypto-Cashback?', `Gnosis Pay bietet 2% in GNO ohne Staking. MetaMask Card 1% in ETH. Nexo Card bis zu 2% in BTC abhängig vom NEXO-Portfolio-Anteil.`],
          ['Sind Revolut-Alternativen in Deutschland verfügbar?', `Ja — alle hier gelisteten Karten sind für deutsche Nutzer über MiCA-regulierte Anbieter verfügbar.`],
        ],
      },
      es: {
        title: `Alternativas a Revolut ${YEAR} — Mejores Tarjetas Crypto`,
        h1: `Las Mejores Alternativas a Revolut en ${YEAR}`,
        description: `Revolut no ofrece cashback en cripto. Descubre las 5 mejores alternativas con recompensas en BTC/ETH sin staking obligatorio.`,
        intro: `Revolut es un neobanco versátil pero no ofrece cashback en criptomonedas en las compras diarias. Si buscas una tarjeta que recompense cada gasto en BTC o ETH, hay varias alternativas cripto-nativas disponibles en ${YEAR}.`,
        reason: `Revolut no ofrece cashback en cripto y sus ventajas premium requieren una suscripción mensual costosa.`,
        faq: [
          ['¿Por qué buscar una alternativa a Revolut?', `Revolut no paga cashback en criptomonedas en compras cotidianas. Tarjetas como Gnosis Pay, MetaMask Card o Nexo recompensan cada transacción directamente en BTC, ETH o GNO.`],
          ['¿Cuál es la mejor alternativa a Revolut para cashback en cripto?', `Gnosis Pay ofrece 2% en GNO sin staking. MetaMask Card 1% en ETH. Nexo Card hasta 2% en BTC según el ratio NEXO en tu cartera.`],
          ['¿Están disponibles las alternativas a Revolut en España?', `Sí — todas las tarjetas listadas aquí están disponibles para residentes españoles a través de proveedores regulados por MiCA.`],
        ],
      },
      it: {
        title: `Alternative a Revolut ${YEAR} — Migliori Carte Crypto`,
        h1: `Le Migliori Alternative a Revolut nel ${YEAR}`,
        description: `Revolut non offre cashback in cripto. Scopri le 5 migliori alternative con ricompense in BTC/ETH senza staking obbligatorio.`,
        intro: `Revolut è una neobank versatile ma non offre cashback in criptovalute sugli acquisti quotidiani. Se cerchi una carta che premi ogni spesa in BTC o ETH, nel ${YEAR} esistono diverse alternative crypto-native in Europa.`,
        reason: `Revolut non offre cashback in cripto e i vantaggi premium richiedono un costoso abbonamento mensile.`,
        faq: [
          ['Perché cercare un’alternativa a Revolut?', `Revolut non paga cashback in criptovaluta sugli acquisti quotidiani. Carte come Gnosis Pay, MetaMask Card o Nexo ricompensano ogni transazione direttamente in BTC, ETH o GNO.`],
          ['Qual è la migliore alternativa a Revolut per il cashback in cripto?', `Gnosis Pay offre 2% in GNO senza staking. MetaMask Card 1% in ETH. Nexo Card fino al 2% in BTC in base al ratio NEXO nel portafoglio.`],
          ['Le alternative a Revolut sono disponibili in Italia?', `Sì — tutte le carte elencate qui sono disponibili per i residenti italiani tramite fornitori regolamentati MiCA.`],
        ],
      },
      en: {
        title: `Revolut Alternatives ${YEAR} — Best Crypto Cards`,
        h1: `The Best Revolut Alternatives in ${YEAR}`,
        description: `Revolut doesn't offer crypto cashback. Discover the 5 best alternatives with BTC/ETH rewards and no mandatory staking.`,
        intro: `Revolut is a versatile neobank but doesn't offer cryptocurrency cashback on everyday purchases. If you want a card that rewards every spend in BTC or ETH, several crypto-native alternatives are available in ${YEAR}.`,
        reason: `Revolut doesn't offer crypto cashback and its premium perks require a costly monthly subscription.`,
        faq: [
          ['Why look for a Revolut alternative?', `Revolut doesn't pay crypto cashback on daily purchases. Cards like Gnosis Pay, MetaMask Card or Nexo reward each transaction directly in BTC, ETH or GNO.`],
          ['What is the best Revolut alternative for crypto cashback?', `Gnosis Pay offers 2% in GNO with no staking. MetaMask Card offers 1% in ETH. Nexo Card offers up to 2% in BTC based on your NEXO portfolio ratio.`],
          ['Are Revolut alternatives available in the UK?', `Yes — all cards listed here are available to UK residents through MiCA-compliant or FCA-authorised providers.`],
        ],
      },
    },
  },

  // ─── CRYPTO.COM ────────────────────────────────────────────────────────────
  {
    brandId: 'crypto-com',
    displayName: 'Crypto.com',
    slugs: {
      fr: 'alternatives-crypto-com',
      be: 'alternatives-crypto-com',
      de: 'crypto-com-alternativen',
      at: 'crypto-com-alternativen',
      es: 'alternativas-crypto-com',
      it: 'alternative-crypto-com',
      en: 'crypto-com-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Crypto.com ${YEAR} — Sans Staking CRO`,
        h1: `Meilleures Alternatives à Crypto.com en ${YEAR}`,
        description: `Crypto.com exige du staking CRO pour ses meilleurs taux. Trouvez les cartes crypto avec cashback sans immobilisation de capital.`,
        intro: `La carte Crypto.com offre jusqu'à 8% de cashback, mais les meilleurs taux nécessitent de bloquer des dizaines de milliers d'euros en CRO. Pour éviter ce risque de dépréciation du token, plusieurs alternatives offrent un bon cashback sans staking en ${YEAR}.`,
        reason: `Le staking CRO requis expose l'utilisateur à la volatilité d'un token propriétaire, et le seuil d'entrée est élevé (de 350 à 400 000 CRO).`,
        faq: [
          ['Quelle carte crypto offre du cashback sans staking CRO ?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH), Nexo Card (jusqu'à 2% BTC) et Brighty App offrent toutes du cashback sans nécessiter de staker le token de la plateforme.`],
          ['Crypto.com est-il le meilleur choix pour le cashback ?', `Pour les taux les plus élevés (5-8%), oui — mais le coût caché du staking CRO peut annuler les gains si CRO se déprécie. Pour 0-350€ de staking, les alternatives à 1-2% sont souvent plus rentables.`],
          ['Les alternatives à Crypto.com sont-elles disponibles en Europe ?', `Oui, toutes les cartes alternatives listées ici sont disponibles pour les résidents de l'Union Européenne.`],
        ],
      },
      de: {
        title: `Crypto.com Alternativen ${YEAR} — Ohne CRO-Staking`,
        h1: `Beste Crypto.com Alternativen in ${YEAR}`,
        description: `Crypto.com verlangt CRO-Staking für die besten Raten. Finden Sie Krypto-Karten mit Cashback ohne Kapitalimmobilisierung.`,
        intro: `Die Crypto.com Visa bietet bis zu 8% Cashback, aber die besten Tarife erfordern das Staking erheblicher CRO-Beträge. Um das Token-Abwertungsrisiko zu vermeiden, bieten mehrere Alternativen gutes Cashback ohne Staking in ${YEAR}.`,
        reason: `Das erforderliche CRO-Staking setzt Nutzer der Volatilität eines proprietären Tokens aus, mit hohen Einstiegshürden (350 bis 400.000 CRO).`,
        faq: [
          ['Welche Krypto-Karte bietet Cashback ohne CRO-Staking?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH), Nexo Card (bis 2% BTC) und Brighty bieten alle Cashback ohne Plattform-Token-Staking.`],
          ['Ist Crypto.com die beste Wahl für Cashback?', `Für die höchsten Raten (5-8%) ja — aber die versteckten Staking-Kosten können die Gewinne eliminieren, wenn CRO an Wert verliert. Alternativen mit 1-2% sind oft rentabler.`],
          ['Sind Crypto.com-Alternativen in Deutschland verfügbar?', `Ja, alle alternativen Karten sind für EU-Residenten verfügbar.`],
        ],
      },
      es: {
        title: `Alternativas Crypto.com ${YEAR} — Sin Staking CRO`,
        h1: `Mejores Alternativas a Crypto.com en ${YEAR}`,
        description: `Crypto.com exige staking de CRO para sus mejores tasas. Encuentra tarjetas crypto con cashback sin inmovilización de capital.`,
        intro: `La tarjeta Crypto.com ofrece hasta 8% de cashback, pero las mejores tasas requieren bloquear grandes cantidades de CRO. Para evitar el riesgo de depreciación del token, varias alternativas ofrecen buen cashback sin staking en ${YEAR}.`,
        reason: `El staking de CRO requerido expone al usuario a la volatilidad de un token propietario, con altos umbrales de entrada.`,
        faq: [
          ['¿Qué tarjeta crypto ofrece cashback sin staking de CRO?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH), Nexo Card (hasta 2% BTC) y Brighty ofrecen cashback sin necesidad de stakear tokens de plataforma.`],
          ['¿Es Crypto.com la mejor opción para cashback?', `Para las tasas más altas (5-8%) sí, pero el coste oculto del staking puede anular las ganancias si CRO se deprecia.`],
          ['¿Están disponibles las alternativas a Crypto.com en España?', `Sí, todas las tarjetas alternativas listadas están disponibles para residentes en la UE.`],
        ],
      },
      it: {
        title: `Alternative Crypto.com ${YEAR} — Senza Staking CRO`,
        h1: `Migliori Alternative a Crypto.com nel ${YEAR}`,
        description: `Crypto.com richiede staking di CRO per i migliori tassi. Trova carte crypto con cashback senza immobilizzazione di capitale.`,
        intro: `La carta Crypto.com offre fino all'8% di cashback, ma i migliori tassi richiedono di bloccare importanti quantità di CRO. Per evitare il rischio di deprezzamento del token, diverse alternative offrono buon cashback senza staking nel ${YEAR}.`,
        reason: `Lo staking CRO richiesto espone l'utente alla volatilità di un token proprietario, con soglie d'ingresso elevate.`,
        faq: [
          ['Quale carta crypto offre cashback senza staking CRO?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH), Nexo Card (fino al 2% BTC) e Brighty offrono cashback senza staking.`],
          ['Crypto.com è la scelta migliore per il cashback?', `Per i tassi più alti (5-8%) sì, ma il costo nascosto dello staking può annullare i guadagni se CRO si svaluta.`],
          ['Le alternative a Crypto.com sono disponibili in Italia?', `Sì, tutte le carte alternative elencate sono disponibili per i residenti UE.`],
        ],
      },
      en: {
        title: `Crypto.com Alternatives ${YEAR} — No CRO Staking`,
        h1: `Best Crypto.com Alternatives in ${YEAR}`,
        description: `Crypto.com requires CRO staking for its best rates. Find crypto cards with cashback and no capital lockup.`,
        intro: `The Crypto.com Visa offers up to 8% cashback, but the best tiers require staking significant amounts of CRO. To avoid token depreciation risk, several alternatives offer good cashback with no staking in ${YEAR}.`,
        reason: `Required CRO staking exposes users to the volatility of a proprietary token, with high entry thresholds (350 to 400,000 CRO).`,
        faq: [
          ['Which crypto card offers cashback without CRO staking?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH), Nexo Card (up to 2% BTC) and Brighty all offer cashback without platform token staking.`],
          ['Is Crypto.com the best choice for cashback?', `For the highest rates (5-8%), yes — but the hidden staking cost can eliminate gains if CRO depreciates. Alternatives at 1-2% are often more profitable.`],
          ['Are Crypto.com alternatives available in Europe?', `Yes, all alternative cards listed here are available for EU residents.`],
        ],
      },
    },
  },

  // ─── BINANCE ───────────────────────────────────────────────────────────────
  {
    brandId: 'binance',
    displayName: 'Binance',
    slugs: {
      fr: 'alternatives-binance',
      be: 'alternatives-binance',
      de: 'binance-alternativen',
      at: 'binance-alternativen',
      es: 'alternativas-binance',
      it: 'alternative-binance',
      en: 'binance-card-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Binance Card ${YEAR} — Cartes Crypto EU`,
        h1: `Meilleures Alternatives à la Binance Card en ${YEAR}`,
        description: `Binance a arrêté sa Visa Card en Europe. Découvrez les 5 meilleures alternatives crypto disponibles en UE avec cashback et sans frais annuels.`,
        intro: `Depuis l'arrêt de la Binance Visa Card en Europe (2023), les utilisateurs européens ont besoin d'alternatives fiables. Plusieurs cartes crypto MiCA-conformes offrent des avantages équivalents voire supérieurs en ${YEAR}.`,
        reason: `La Binance Visa Card n'est plus disponible en Europe depuis 2023 suite à l'arrêt du partenariat avec Mastercard/Visa.`,
        faq: [
          ['Quelle carte remplace la Binance Card en Europe ?', `Gnosis Pay, MetaMask Card, Nexo Card et Bybit Card sont les principales alternatives disponibles en UE avec cashback crypto.`],
          ['Les alternatives à Binance Card sont-elles sûres ?', `Toutes les alternatives listées sont opérées par des sociétés régulées sous MiCA ou avec des licences e-money européennes.`],
          ['Y a-t-il une carte crypto sans frais disponible en France ?', `Oui — MetaMask Card, Gnosis Pay et Brighty App sont sans frais annuels avec cashback en crypto.`],
        ],
      },
      de: {
        title: `Binance Card Alternativen ${YEAR} — EU Krypto-Karten`,
        h1: `Beste Alternativen zur Binance Card in ${YEAR}`,
        description: `Binance hat seine Visa Card in Europa eingestellt. Entdecken Sie die 5 besten Krypto-Alternativen in der EU mit Cashback.`,
        intro: `Nach der Einstellung der Binance Visa Card in Europa (2023) benötigen europäische Nutzer zuverlässige Alternativen. Mehrere MiCA-konforme Krypto-Karten bieten gleichwertige oder bessere Vorteile in ${YEAR}.`,
        reason: `Die Binance Visa Card ist seit 2023 in Europa nicht mehr verfügbar, nachdem die Partnerschaft mit Mastercard/Visa beendet wurde.`,
        faq: [
          ['Welche Karte ersetzt die Binance Card in Europa?', `Gnosis Pay, MetaMask Card, Nexo Card und Bybit Card sind die wichtigsten Alternativen in der EU mit Krypto-Cashback.`],
          ['Sind Binance Card-Alternativen sicher?', `Alle gelisteten Alternativen werden von MiCA-regulierten Unternehmen oder Inhabern europäischer E-Money-Lizenzen betrieben.`],
          ['Gibt es in Deutschland eine kostenlose Krypto-Karte?', `Ja — MetaMask Card, Gnosis Pay und Brighty sind ohne Jahresgebühren mit Krypto-Cashback erhältlich.`],
        ],
      },
      es: {
        title: `Alternativas Binance Card ${YEAR} — Tarjetas Crypto UE`,
        h1: `Mejores Alternativas a la Binance Card en ${YEAR}`,
        description: `Binance dejó de ofrecer su Visa Card en Europa. Descubre las 5 mejores alternativas crypto disponibles en la UE con cashback.`,
        intro: `Desde que Binance retiró su Visa Card de Europa (2023), los usuarios europeos necesitan alternativas fiables. Varias tarjetas crypto compatibles con MiCA ofrecen ventajas equivalentes o superiores en ${YEAR}.`,
        reason: `La Binance Visa Card ya no está disponible en Europa desde 2023 tras la cancelación del acuerdo con Mastercard/Visa.`,
        faq: [
          ['¿Qué tarjeta reemplaza a la Binance Card en Europa?', `Gnosis Pay, MetaMask Card, Nexo Card y Bybit Card son las principales alternativas en la UE con cashback crypto.`],
          ['¿Son seguras las alternativas a Binance Card?', `Todas las alternativas listadas están operadas por empresas reguladas por MiCA o con licencias europeas de dinero electrónico.`],
          ['¿Hay alguna tarjeta crypto gratuita disponible en España?', `Sí — MetaMask Card, Gnosis Pay y Brighty están disponibles sin comisiones anuales con cashback en cripto.`],
        ],
      },
      it: {
        title: `Alternative Binance Card ${YEAR} — Carte Crypto UE`,
        h1: `Migliori Alternative alla Binance Card nel ${YEAR}`,
        description: `Binance ha interrotto la sua Visa Card in Europa. Scopri le 5 migliori alternative crypto disponibili nell'UE con cashback.`,
        intro: `Da quando Binance ha ritirato la sua Visa Card dall'Europa (2023), gli utenti europei hanno bisogno di alternative affidabili. Diverse carte crypto conformi a MiCA offrono vantaggi equivalenti o superiori nel ${YEAR}.`,
        reason: `La Binance Visa Card non è più disponibile in Europa dal 2023 dopo la fine del partenariato con Mastercard/Visa.`,
        faq: [
          ['Quale carta sostituisce la Binance Card in Europa?', `Gnosis Pay, MetaMask Card, Nexo Card e Bybit Card sono le principali alternative nell'UE con cashback crypto.`],
          ['Le alternative alla Binance Card sono sicure?', `Tutte le alternative elencate sono gestite da aziende regolamentate MiCA o titolari di licenze e-money europee.`],
          ['Esiste una carta crypto gratuita disponibile in Italia?', `Sì — MetaMask Card, Gnosis Pay e Brighty sono disponibili senza canone annuale con cashback in cripto.`],
        ],
      },
      en: {
        title: `Binance Card Alternatives ${YEAR} — EU Crypto Cards`,
        h1: `Best Binance Card Alternatives in ${YEAR}`,
        description: `Binance stopped its Visa Card in Europe. Discover the 5 best crypto card alternatives available in the EU with cashback.`,
        intro: `Since Binance withdrew its Visa Card from Europe (2023), European users need reliable alternatives. Several MiCA-compliant crypto cards offer equivalent or superior benefits in ${YEAR}.`,
        reason: `The Binance Visa Card has been unavailable in Europe since 2023 following the end of its Mastercard/Visa partnership.`,
        faq: [
          ['What card replaces the Binance Card in Europe?', `Gnosis Pay, MetaMask Card, Nexo Card and Bybit Card are the main alternatives in the EU with crypto cashback.`],
          ['Are Binance Card alternatives safe?', `All listed alternatives are operated by MiCA-regulated companies or holders of European e-money licences.`],
          ['Is there a free crypto card available in the UK?', `Yes — MetaMask Card, Gnosis Pay and Brighty are available with no annual fees and crypto cashback.`],
        ],
      },
    },
  },

  // ─── BYBIT ─────────────────────────────────────────────────────────────────
  {
    brandId: 'bybit',
    displayName: 'Bybit',
    slugs: {
      fr: 'alternatives-bybit',
      be: 'alternatives-bybit',
      de: 'bybit-alternativen',
      at: 'bybit-alternativen',
      es: 'alternativas-bybit',
      it: 'alternative-bybit',
      en: 'bybit-card-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Bybit Card ${YEAR} — Cartes Crypto Europe`,
        h1: `Meilleures Alternatives à la Bybit Card en ${YEAR}`,
        description: `Bybit Card disponible dans certains pays seulement. Comparez les alternatives crypto avec cashback disponibles dans toute l'Europe.`,
        intro: `La Bybit Card est une solide carte crypto avec cashback, mais sa disponibilité en Europe est parfois limitée selon les pays. Des alternatives plus largement accessibles offrent des avantages comparables en ${YEAR}.`,
        reason: `La disponibilité de Bybit Card varie selon les pays européens et l'exchange n'est pas encore pleinement MiCA-conforme.`,
        faq: [
          ['Quelle alternative à Bybit Card est disponible partout en Europe ?', `Gnosis Pay et MetaMask Card sont disponibles dans toute l'UE. Nexo Card et Crypto.com sont également accessibles avec MiCA.`],
          ['Bybit Card offre-t-elle plus de cashback que ses alternatives ?', `Bybit offre jusqu'à 10% de cashback en BIT/USDT selon le tier. Les alternatives comme Crypto.com (8%) ou Nexo (2%) offrent des taux compétitifs sans la contrainte de token propriétaire.`],
          ['Y a-t-il une alternative à Bybit sans staking requis ?', `Oui — Gnosis Pay (2% GNO sans staking), MetaMask Card (1% ETH sans staking) et Brighty sont disponibles sans exigence de staking.`],
        ],
      },
      de: {
        title: `Bybit Card Alternativen ${YEAR} — Krypto-Karten Europa`,
        h1: `Beste Bybit Card Alternativen in ${YEAR}`,
        description: `Bybit Card nur in bestimmten Ländern. Vergleichen Sie Krypto-Alternativen mit Cashback für ganz Europa.`,
        intro: `Die Bybit Card ist eine solide Krypto-Karte mit Cashback, aber ihre Verfügbarkeit in Europa ist je nach Land unterschiedlich. Breiter verfügbare Alternativen bieten vergleichbare Vorteile in ${YEAR}.`,
        reason: `Die Verfügbarkeit der Bybit Card variiert je nach europäischem Land und der Exchange ist noch nicht vollständig MiCA-konform.`,
        faq: [
          ['Welche Bybit Card-Alternative ist überall in Europa verfügbar?', `Gnosis Pay und MetaMask Card sind in der gesamten EU verfügbar. Nexo Card und Crypto.com sind ebenfalls über MiCA zugänglich.`],
          ['Bietet Bybit Card mehr Cashback als Alternativen?', `Bybit bietet bis zu 10% in BIT/USDT je nach Tier. Alternativen wie Crypto.com (8%) oder Nexo (2%) bieten wettbewerbsfähige Raten.`],
          ['Gibt es eine Bybit-Alternative ohne Staking?', `Ja — Gnosis Pay (2% GNO), MetaMask Card (1% ETH) und Brighty sind ohne Staking verfügbar.`],
        ],
      },
      es: {
        title: `Alternativas Bybit Card ${YEAR} — Tarjetas Crypto Europa`,
        h1: `Mejores Alternativas a la Bybit Card en ${YEAR}`,
        description: `Bybit Card disponible solo en algunos países. Compara alternativas crypto con cashback disponibles en toda Europa.`,
        intro: `La Bybit Card es una sólida tarjeta crypto con cashback, pero su disponibilidad en Europa varía según el país. Alternativas más ampliamente accesibles ofrecen ventajas comparables en ${YEAR}.`,
        reason: `La disponibilidad de Bybit Card varía según los países europeos y el exchange aún no es completamente compatible con MiCA.`,
        faq: [
          ['¿Qué alternativa a Bybit Card está disponible en toda Europa?', `Gnosis Pay y MetaMask Card están disponibles en toda la UE. Nexo Card y Crypto.com también son accesibles con MiCA.`],
          ['¿Ofrece Bybit Card más cashback que sus alternativas?', `Bybit ofrece hasta 10% en BIT/USDT según el tier. Alternativas como Crypto.com (8%) o Nexo (2%) ofrecen tasas competitivas.`],
          ['¿Hay alguna alternativa a Bybit sin staking?', `Sí — Gnosis Pay (2% GNO), MetaMask Card (1% ETH) y Brighty están disponibles sin requisitos de staking.`],
        ],
      },
      it: {
        title: `Alternative Bybit Card ${YEAR} — Carte Crypto Europa`,
        h1: `Migliori Alternative alla Bybit Card nel ${YEAR}`,
        description: `Bybit Card disponibile solo in alcuni paesi. Confronta le alternative crypto con cashback disponibili in tutta Europa.`,
        intro: `La Bybit Card è una solida carta crypto con cashback, ma la sua disponibilità in Europa varia a seconda del paese. Alternative più ampiamente accessibili offrono vantaggi comparabili nel ${YEAR}.`,
        reason: `La disponibilità di Bybit Card varia a seconda dei paesi europei e l'exchange non è ancora pienamente conforme a MiCA.`,
        faq: [
          ['Quale alternativa a Bybit Card è disponibile ovunque in Europa?', `Gnosis Pay e MetaMask Card sono disponibili in tutta l'UE. Nexo Card e Crypto.com sono anch'esse accessibili tramite MiCA.`],
          ['Bybit Card offre più cashback rispetto alle alternative?', `Bybit offre fino al 10% in BIT/USDT a seconda del tier. Alternative come Crypto.com (8%) o Nexo (2%) offrono tassi competitivi.`],
          ['Esiste un’alternativa a Bybit senza staking?', `Sì — Gnosis Pay (2% GNO), MetaMask Card (1% ETH) e Brighty sono disponibili senza requisiti di staking.`],
        ],
      },
      en: {
        title: `Bybit Card Alternatives ${YEAR} — Crypto Cards Europe`,
        h1: `Best Bybit Card Alternatives in ${YEAR}`,
        description: `Bybit Card available in some countries only. Compare crypto alternatives with cashback available across Europe.`,
        intro: `The Bybit Card is a solid crypto card with cashback, but its availability in Europe varies by country. More widely accessible alternatives offer comparable benefits in ${YEAR}.`,
        reason: `Bybit Card availability varies across European countries and the exchange is not yet fully MiCA-compliant.`,
        faq: [
          ['Which Bybit Card alternative is available across Europe?', `Gnosis Pay and MetaMask Card are available across the EU. Nexo Card and Crypto.com are also accessible via MiCA.`],
          ['Does Bybit Card offer more cashback than alternatives?', `Bybit offers up to 10% in BIT/USDT depending on tier. Alternatives like Crypto.com (8%) or Nexo (2%) offer competitive rates.`],
          ['Is there a Bybit alternative with no staking?', `Yes — Gnosis Pay (2% GNO), MetaMask Card (1% ETH) and Brighty are available with no staking requirements.`],
        ],
      },
    },
  },

  // ─── NEXO ──────────────────────────────────────────────────────────────────
  {
    brandId: 'nexo',
    displayName: 'Nexo',
    slugs: {
      fr: 'alternatives-nexo',
      be: 'alternatives-nexo',
      de: 'nexo-alternativen',
      at: 'nexo-alternativen',
      es: 'alternativas-nexo',
      it: 'alternative-nexo',
      en: 'nexo-card-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Nexo Card ${YEAR} — Cartes Crypto Sans Staking`,
        h1: `Meilleures Alternatives à la Nexo Card en ${YEAR}`,
        description: `Nexo Card exige un ratio NEXO pour le meilleur cashback BTC. Découvrez des cartes crypto avec cashback sans token imposé.`,
        intro: `La Nexo Card offre jusqu'à 2% de cashback en BTC, mais seulement si vous détenez au moins 10% de votre portefeuille en tokens NEXO. Si vous ne souhaitez pas vous exposer à ce token, plusieurs alternatives offrent du cashback libre en ${YEAR}.`,
        reason: `Le cashback maximum de Nexo nécessite un ratio NEXO dans le portefeuille, exposant l'utilisateur à un token propriétaire.`,
        faq: [
          ['Quelle alternative à Nexo offre du cashback BTC sans token ?', `Gnosis Pay offre 2% en GNO sans exigence de portefeuille. MetaMask Card offre 1% en ETH directement. Crypto.com Ruby offre 2% avec 350 CRO de staking.`],
          ['Nexo Card est-elle disponible partout en Europe ?', `Oui, Nexo opère sous licence e-money européenne et est disponible dans la plupart des pays UE.`],
          ['Y a-t-il une carte avec plus de 2% de cashback sans staking ?', `Non — 2% est généralement le plafond pour les cartes sans staking ni token imposé. Les taux plus élevés (3-8%) nécessitent toujours un staking ou des conditions.`],
        ],
      },
      de: {
        title: `Nexo Card Alternativen ${YEAR} — Ohne NEXO-Token`,
        h1: `Beste Nexo Card Alternativen in ${YEAR}`,
        description: `Nexo Card erfordert NEXO-Portfolio-Ratio für bestes BTC-Cashback. Entdecken Sie Krypto-Karten ohne Token-Pflicht.`,
        intro: `Die Nexo Card bietet bis zu 2% BTC-Cashback, aber nur wenn mindestens 10% des Portfolios in NEXO-Token gehalten werden. Wer dieses Token nicht halten möchte, findet in ${YEAR} mehrere Token-freie Alternativen.`,
        reason: `Nexos maximales Cashback erfordert ein NEXO-Portfolio-Verhältnis, das Nutzer einem proprietären Token aussetzt.`,
        faq: [
          ['Welche Nexo-Alternative bietet BTC-Cashback ohne Token?', `Gnosis Pay bietet 2% in GNO ohne Portfolio-Anforderung. MetaMask Card 1% in ETH. Crypto.com Ruby 2% mit 350 CRO Staking.`],
          ['Ist Nexo Card überall in Europa verfügbar?', `Ja, Nexo operiert unter europäischer E-Money-Lizenz und ist in den meisten EU-Ländern verfügbar.`],
          ['Gibt es eine Karte mit über 2% Cashback ohne Staking?', `Nein — 2% ist generell die Obergrenze für Karten ohne Staking oder Token-Pflicht.`],
        ],
      },
      es: {
        title: `Alternativas Nexo Card ${YEAR} — Sin Token NEXO`,
        h1: `Mejores Alternativas a la Nexo Card en ${YEAR}`,
        description: `Nexo Card exige ratio NEXO para el mejor cashback BTC. Descubre tarjetas crypto con cashback sin token impuesto.`,
        intro: `La Nexo Card ofrece hasta 2% de cashback en BTC, pero solo si mantienes al menos el 10% de tu cartera en tokens NEXO. Si no deseas exposición a este token, varias alternativas ofrecen cashback libre en ${YEAR}.`,
        reason: `El cashback máximo de Nexo requiere un ratio de NEXO en la cartera, exponiendo al usuario a un token propietario.`,
        faq: [
          ['¿Qué alternativa a Nexo ofrece cashback BTC sin token?', `Gnosis Pay ofrece 2% en GNO sin requisito de cartera. MetaMask Card 1% en ETH. Crypto.com Ruby 2% con 350 CRO en staking.`],
          ['¿Está disponible Nexo Card en toda Europa?', `Sí, Nexo opera bajo licencia europea de dinero electrónico y está disponible en la mayoría de los países de la UE.`],
          ['¿Hay alguna tarjeta con más del 2% de cashback sin staking?', `No — el 2% es generalmente el techo para tarjetas sin staking ni token impuesto.`],
        ],
      },
      it: {
        title: `Alternative Nexo Card ${YEAR} — Senza Token NEXO`,
        h1: `Migliori Alternative alla Nexo Card nel ${YEAR}`,
        description: `Nexo Card richiede ratio NEXO per il miglior cashback BTC. Scopri carte crypto con cashback senza token obbligatorio.`,
        intro: `La Nexo Card offre fino al 2% di cashback in BTC, ma solo se si detiene almeno il 10% del portafoglio in token NEXO. Per chi non vuole esposizione a questo token, nel ${YEAR} esistono diverse alternative.`,
        reason: `Il cashback massimo di Nexo richiede un ratio NEXO nel portafoglio, esponendo l'utente a un token proprietario.`,
        faq: [
          ['Quale alternativa a Nexo offre cashback BTC senza token?', `Gnosis Pay offre 2% in GNO senza requisiti di portafoglio. MetaMask Card 1% in ETH. Crypto.com Ruby 2% con 350 CRO in staking.`],
          ['Nexo Card è disponibile ovunque in Europa?', `Sì, Nexo opera con licenza e-money europea ed è disponibile nella maggior parte dei paesi UE.`],
          ['Esiste una carta con più del 2% di cashback senza staking?', `No — il 2% è generalmente il tetto per le carte senza staking o token obbligatorio.`],
        ],
      },
      en: {
        title: `Nexo Card Alternatives ${YEAR} — No NEXO Token Required`,
        h1: `Best Nexo Card Alternatives in ${YEAR}`,
        description: `Nexo Card requires a NEXO portfolio ratio for best BTC cashback. Find crypto cards with cashback and no token required.`,
        intro: `The Nexo Card offers up to 2% cashback in BTC, but only if you hold at least 10% of your portfolio in NEXO tokens. If you prefer not to hold this token, several alternatives offer free-choice cashback in ${YEAR}.`,
        reason: `Nexo's maximum cashback requires a NEXO portfolio ratio, exposing users to a proprietary token.`,
        faq: [
          ['Which Nexo alternative offers BTC cashback without tokens?', `Gnosis Pay offers 2% in GNO with no portfolio requirement. MetaMask Card 1% in ETH directly. Crypto.com Ruby 2% with 350 CRO staking.`],
          ['Is Nexo Card available across Europe?', `Yes, Nexo operates under a European e-money licence and is available in most EU countries.`],
          ['Is there a card with over 2% cashback and no staking?', `No — 2% is generally the ceiling for cards with no staking or mandatory token holding.`],
        ],
      },
    },
  },

  // ─── BITPANDA ──────────────────────────────────────────────────────────────
  {
    brandId: 'bitpanda',
    displayName: 'Bitpanda',
    slugs: {
      fr: 'alternatives-bitpanda',
      be: 'alternatives-bitpanda',
      de: 'bitpanda-alternativen',
      at: 'bitpanda-alternativen',
      es: 'alternativas-bitpanda',
      it: 'alternative-bitpanda',
      en: 'bitpanda-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Bitpanda ${YEAR} — Cartes Crypto Europe`,
        h1: `Meilleures Alternatives à Bitpanda en ${YEAR}`,
        description: `Bitpanda principalement disponible en Autriche et Allemagne. Alternatives crypto avec cashback disponibles dans toute l'Europe.`,
        intro: `Bitpanda est une plateforme solide basée à Vienne, mais son écosystème de cartes est principalement orienté vers les marchés autrichien et allemand. Des alternatives pan-européennes offrent une disponibilité plus large en ${YEAR}.`,
        reason: `Bitpanda est davantage orienté DACH (Allemagne, Autriche, Suisse) et sa carte crypto peut être moins accessible dans d'autres marchés européens.`,
        faq: [
          ['Quelle alternative à Bitpanda est disponible en France ?', `Gnosis Pay, MetaMask Card, Nexo Card et Brighty sont toutes disponibles en France avec du cashback crypto.`],
          ['Bitpanda Card offre-t-elle du cashback ?', `Oui, Bitpanda propose des récompenses via son programme BEST, mais le cashback direct en crypto est limité par rapport à d'autres cartes.`],
          ['Les alternatives à Bitpanda sont-elles MiCA-conformes ?', `Oui, toutes les alternatives listées opèrent sous licences MiCA ou équivalentes européennes.`],
        ],
      },
      de: {
        title: `Bitpanda Alternativen ${YEAR} — Krypto-Karten Europa`,
        h1: `Beste Bitpanda Alternativen in ${YEAR}`,
        description: `Bitpanda hauptsächlich in Österreich und Deutschland. Krypto-Alternativen mit Cashback in ganz Europa verfügbar.`,
        intro: `Bitpanda ist eine solide Plattform aus Wien, aber ihr Karten-Ökosystem ist hauptsächlich auf den österreichischen und deutschen Markt ausgerichtet. Paneuropäische Alternativen bieten in ${YEAR} eine breitere Verfügbarkeit.`,
        reason: `Bitpanda ist stärker auf den DACH-Raum ausgerichtet und die Krypto-Karte ist in anderen europäischen Märkten weniger zugänglich.`,
        faq: [
          ['Welche Bitpanda-Alternative ist in Deutschland verfügbar?', `Gnosis Pay, MetaMask Card, Nexo Card und Brighty sind alle in Deutschland mit Krypto-Cashback verfügbar.`],
          ['Bietet Bitpanda Card Cashback?', `Ja, Bitpanda bietet Belohnungen über das BEST-Programm, aber direktes Krypto-Cashback ist im Vergleich zu anderen Karten begrenzt.`],
          ['Sind Bitpanda-Alternativen MiCA-konform?', `Ja, alle gelisteten Alternativen operieren unter MiCA oder gleichwertigen europäischen Lizenzen.`],
        ],
      },
      es: {
        title: `Alternativas Bitpanda ${YEAR} — Tarjetas Crypto Europa`,
        h1: `Mejores Alternativas a Bitpanda en ${YEAR}`,
        description: `Bitpanda principalmente disponible en Austria y Alemania. Alternativas crypto con cashback disponibles en toda Europa.`,
        intro: `Bitpanda es una plataforma sólida con sede en Viena, pero su ecosistema de tarjetas está principalmente orientado a los mercados austriaco y alemán. Las alternativas paneuropeas ofrecen mayor disponibilidad en ${YEAR}.`,
        reason: `Bitpanda está más orientado al mercado DACH y su tarjeta crypto puede ser menos accesible en otros mercados europeos.`,
        faq: [
          ['¿Qué alternativa a Bitpanda está disponible en España?', `Gnosis Pay, MetaMask Card, Nexo Card y Brighty están disponibles en España con cashback en cripto.`],
          ['¿Ofrece cashback la tarjeta Bitpanda?', `Sí, Bitpanda ofrece recompensas a través de su programa BEST, pero el cashback directo en cripto es limitado comparado con otras tarjetas.`],
          ['¿Son las alternativas a Bitpanda compatibles con MiCA?', `Sí, todas las alternativas listadas operan bajo licencias MiCA o equivalentes europeas.`],
        ],
      },
      it: {
        title: `Alternative Bitpanda ${YEAR} — Carte Crypto Europa`,
        h1: `Migliori Alternative a Bitpanda nel ${YEAR}`,
        description: `Bitpanda principalmente disponibile in Austria e Germania. Alternative crypto con cashback disponibili in tutta Europa.`,
        intro: `Bitpanda è una piattaforma solida con sede a Vienna, ma il suo ecosistema di carte è principalmente orientato ai mercati austriaco e tedesco. Le alternative paneuropee offrono una disponibilità più ampia nel ${YEAR}.`,
        reason: `Bitpanda è più orientata al mercato DACH e la sua carta crypto può essere meno accessibile in altri mercati europei.`,
        faq: [
          ['Quale alternativa a Bitpanda è disponibile in Italia?', `Gnosis Pay, MetaMask Card, Nexo Card e Brighty sono tutte disponibili in Italia con cashback crypto.`],
          ['Bitpanda Card offre cashback?', `Sì, Bitpanda offre ricompense tramite il programma BEST, ma il cashback diretto in cripto è limitato rispetto ad altre carte.`],
          ['Le alternative a Bitpanda sono conformi a MiCA?', `Sì, tutte le alternative elencate operano con licenze MiCA o equivalenti europee.`],
        ],
      },
      en: {
        title: `Bitpanda Alternatives ${YEAR} — Crypto Cards Europe`,
        h1: `Best Bitpanda Alternatives in ${YEAR}`,
        description: `Bitpanda mainly available in Austria and Germany. Crypto card alternatives with cashback available across Europe.`,
        intro: `Bitpanda is a solid Vienna-based platform but its card ecosystem is primarily oriented towards the Austrian and German markets. Pan-European alternatives offer broader availability in ${YEAR}.`,
        reason: `Bitpanda is more focused on the DACH market and its crypto card may be less accessible in other European markets.`,
        faq: [
          ['Which Bitpanda alternative is available across Europe?', `Gnosis Pay, MetaMask Card, Nexo Card and Brighty are all available across Europe with crypto cashback.`],
          ['Does Bitpanda Card offer cashback?', `Yes, Bitpanda offers rewards through its BEST programme, but direct crypto cashback is limited compared to other cards.`],
          ['Are Bitpanda alternatives MiCA-compliant?', `Yes, all listed alternatives operate under MiCA or equivalent European licences.`],
        ],
      },
    },
  },

  // ─── WIREX ─────────────────────────────────────────────────────────────────
  {
    brandId: 'wirex',
    displayName: 'Wirex',
    slugs: {
      fr: 'alternatives-wirex',
      be: 'alternatives-wirex',
      de: 'wirex-alternativen',
      at: 'wirex-alternativen',
      es: 'alternativas-wirex',
      it: 'alternative-wirex',
      en: 'wirex-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Wirex ${YEAR} — Meilleures Cartes Crypto`,
        h1: `Meilleures Alternatives à Wirex en ${YEAR}`,
        description: `Wirex est l'une des premières cartes crypto mais ses récompenses sont limitées. Découvrez les alternatives avec plus de cashback en ${YEAR}.`,
        intro: `Wirex est l'une des pionnières des cartes crypto (lancée en 2014), mais les nouvelles cartes DeFi-natives offrent des taux de cashback plus élevés et plus de flexibilité. En ${YEAR}, plusieurs alternatives surpassent Wirex sur le cashback pur.`,
        reason: `Wirex propose des récompenses en WXT (token propriétaire) qui peuvent être moins attractives que du cashback en BTC ou ETH.`,
        faq: [
          ['Quelle alternative à Wirex offre le meilleur cashback crypto ?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH) et Nexo Card (2% BTC) offrent des taux compétitifs sans token propriétaire imposé.`],
          ['Wirex est-elle encore une bonne carte en ${YEAR} ?', `Wirex reste une option valide, notamment pour les marchés émergents où d'autres cartes ne sont pas disponibles. En Europe, les alternatives modernes offrent généralement de meilleurs avantages.`],
          ['Y a-t-il des alternatives à Wirex disponibles dans toute l’Europe ?', `Oui — Gnosis Pay, MetaMask Card et Nexo Card sont toutes disponibles dans l'UE.`],
        ],
      },
      de: {
        title: `Wirex Alternativen ${YEAR} — Bessere Krypto-Karten`,
        h1: `Beste Wirex Alternativen in ${YEAR}`,
        description: `Wirex ist eine der ersten Krypto-Karten, aber neuere DeFi-Karten bieten mehr Cashback. Entdecken Sie die besten Alternativen in ${YEAR}.`,
        intro: `Wirex gehört zu den Pionieren der Krypto-Karten (seit 2014), aber neuere DeFi-native Karten bieten höhere Cashback-Raten und mehr Flexibilität. In ${YEAR} übertreffen mehrere Alternativen Wirex beim reinen Cashback.`,
        reason: `Wirex bietet Belohnungen in WXT (proprietäres Token), die weniger attraktiv sein können als BTC- oder ETH-Cashback.`,
        faq: [
          ['Welche Wirex-Alternative bietet das beste Krypto-Cashback?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH) und Nexo Card (2% BTC) bieten wettbewerbsfähige Raten ohne proprietären Token.`],
          ['Ist Wirex in ${YEAR} noch eine gute Karte?', `Wirex bleibt eine valide Option, insbesondere für Märkte, in denen andere Karten nicht verfügbar sind. In Europa bieten moderne Alternativen meist bessere Vorteile.`],
          ['Gibt es Wirex-Alternativen in ganz Europa?', `Ja — Gnosis Pay, MetaMask Card und Nexo Card sind alle in der EU verfügbar.`],
        ],
      },
      es: {
        title: `Alternativas Wirex ${YEAR} — Mejores Tarjetas Crypto`,
        h1: `Mejores Alternativas a Wirex en ${YEAR}`,
        description: `Wirex es una de las primeras tarjetas crypto pero sus recompensas son limitadas. Descubre alternativas con más cashback en ${YEAR}.`,
        intro: `Wirex es una pionera en tarjetas crypto (lanzada en 2014), pero las nuevas tarjetas DeFi-nativas ofrecen tasas de cashback más altas y más flexibilidad. En ${YEAR}, varias alternativas superan a Wirex en cashback puro.`,
        reason: `Wirex ofrece recompensas en WXT (token propietario) que pueden ser menos atractivas que el cashback en BTC o ETH.`,
        faq: [
          ['¿Qué alternativa a Wirex ofrece el mejor cashback crypto?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH) y Nexo Card (2% BTC) ofrecen tasas competitivas sin token propietario impuesto.`],
          ['¿Sigue siendo Wirex una buena tarjeta en ${YEAR}?', `Wirex sigue siendo una opción válida, especialmente para mercados emergentes. En Europa, las alternativas modernas generalmente ofrecen mejores ventajas.`],
          ['¿Hay alternativas a Wirex disponibles en toda Europa?', `Sí — Gnosis Pay, MetaMask Card y Nexo Card están disponibles en la UE.`],
        ],
      },
      it: {
        title: `Alternative Wirex ${YEAR} — Migliori Carte Crypto`,
        h1: `Migliori Alternative a Wirex nel ${YEAR}`,
        description: `Wirex è una delle prime carte crypto ma le sue ricompense sono limitate. Scopri alternative con più cashback nel ${YEAR}.`,
        intro: `Wirex è una delle pioniere delle carte crypto (lanciata nel 2014), ma le nuove carte DeFi-native offrono tassi di cashback più elevati e più flessibilità. Nel ${YEAR}, diverse alternative superano Wirex nel cashback puro.`,
        reason: `Wirex offre ricompense in WXT (token proprietario) che possono essere meno attraenti del cashback in BTC o ETH.`,
        faq: [
          ['Quale alternativa a Wirex offre il miglior cashback crypto?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH) e Nexo Card (2% BTC) offrono tassi competitivi senza token proprietario.`],
          ['Wirex è ancora una buona carta nel ${YEAR}?', `Wirex rimane un'opzione valida, specialmente per mercati emergenti. In Europa, le alternative moderne offrono generalmente vantaggi migliori.`],
          ['Ci sono alternative a Wirex disponibili in tutta Europa?', `Sì — Gnosis Pay, MetaMask Card e Nexo Card sono tutte disponibili nell'UE.`],
        ],
      },
      en: {
        title: `Wirex Alternatives ${YEAR} — Better Crypto Cards`,
        h1: `Best Wirex Alternatives in ${YEAR}`,
        description: `Wirex is one of the first crypto cards but newer DeFi cards offer more cashback. Discover the best alternatives in ${YEAR}.`,
        intro: `Wirex is one of the pioneers of crypto cards (launched 2014), but newer DeFi-native cards offer higher cashback rates and more flexibility. In ${YEAR}, several alternatives outperform Wirex on pure cashback.`,
        reason: `Wirex offers rewards in WXT (proprietary token) which can be less attractive than BTC or ETH cashback.`,
        faq: [
          ['Which Wirex alternative offers the best crypto cashback?', `Gnosis Pay (2% GNO), MetaMask Card (1% ETH) and Nexo Card (2% BTC) offer competitive rates without a mandatory proprietary token.`],
          ['Is Wirex still a good card in ${YEAR}?', `Wirex remains a valid option, particularly for emerging markets where other cards are unavailable. In Europe, modern alternatives generally offer better benefits.`],
          ['Are there Wirex alternatives available across Europe?', `Yes — Gnosis Pay, MetaMask Card and Nexo Card are all available in the EU.`],
        ],
      },
    },
  },

  // ─── COINBASE ──────────────────────────────────────────────────────────────
  {
    brandId: 'coinbase',
    displayName: 'Coinbase',
    slugs: {
      fr: 'alternatives-coinbase',
      be: 'alternatives-coinbase',
      de: 'coinbase-alternativen',
      at: 'coinbase-alternativen',
      es: 'alternativas-coinbase',
      it: 'alternative-coinbase',
      en: 'coinbase-card-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Coinbase Card ${YEAR} — Cartes Crypto Europe`,
        h1: `Meilleures Alternatives à la Coinbase Card en ${YEAR}`,
        description: `Coinbase Card peu disponible en France et UE. Trouvez des alternatives crypto-natives avec cashback disponibles en Europe.`,
        intro: `La Coinbase Card est populaire aux États-Unis et au Royaume-Uni, mais sa disponibilité en France et dans plusieurs pays UE reste limitée. Des alternatives crypto MiCA-conformes offrent des avantages comparables avec une meilleure couverture européenne en ${YEAR}.`,
        reason: `Coinbase Card a une disponibilité limitée en France et dans plusieurs pays UE, et le cashback en crypto est conditionné à la devise sélectionnée.`,
        faq: [
          ['Quelle carte crypto est disponible en France à la place de Coinbase Card ?', `Gnosis Pay, MetaMask Card, Nexo Card, Brighty et Crypto.com sont toutes disponibles en France avec du cashback crypto.`],
          ['Coinbase Card offre-t-elle du cashback en crypto ?', `Oui, jusqu'à 4% en XLM ou 1% en BTC, mais uniquement sur certaines devises et sous conditions.`],
          ['Y a-t-il une alternative à Coinbase Card sans condition de devise ?', `Oui — MetaMask Card (1% ETH), Gnosis Pay (2% GNO) et Nexo (2% BTC) offrent du cashback sans restriction de devise.`],
        ],
      },
      de: {
        title: `Coinbase Card Alternativen ${YEAR} — Krypto-Karten Europa`,
        h1: `Beste Coinbase Card Alternativen in ${YEAR}`,
        description: `Coinbase Card in Deutschland und EU kaum verfügbar. Entdecken Sie Krypto-Alternativen mit Cashback für Europa.`,
        intro: `Die Coinbase Card ist in den USA und im Vereinigten Königreich beliebt, aber ihre Verfügbarkeit in Deutschland und mehreren EU-Ländern ist begrenzt. MiCA-konforme Krypto-Alternativen bieten in ${YEAR} vergleichbare Vorteile mit besserer EU-Abdeckung.`,
        reason: `Coinbase Card ist in Deutschland und mehreren EU-Ländern nur eingeschränkt verfügbar.`,
        faq: [
          ['Welche Krypto-Karte ist in Deutschland statt Coinbase Card verfügbar?', `Gnosis Pay, MetaMask Card, Nexo Card, Brighty und Crypto.com sind in Deutschland mit Krypto-Cashback verfügbar.`],
          ['Bietet Coinbase Card Krypto-Cashback?', `Ja, bis zu 4% in XLM oder 1% in BTC, aber nur für bestimmte Währungen und unter Bedingungen.`],
          ['Gibt es eine Coinbase Card-Alternative ohne Währungsbeschränkung?', `Ja — MetaMask Card (1% ETH), Gnosis Pay (2% GNO) und Nexo (2% BTC) bieten Cashback ohne Währungsbeschränkungen.`],
        ],
      },
      es: {
        title: `Alternativas Coinbase Card ${YEAR} — Tarjetas Crypto Europa`,
        h1: `Mejores Alternativas a la Coinbase Card en ${YEAR}`,
        description: `Coinbase Card poco disponible en España y UE. Encuentra alternativas crypto-nativas con cashback disponibles en Europa.`,
        intro: `La Coinbase Card es popular en EE.UU. y el Reino Unido, pero su disponibilidad en España y varios países de la UE es limitada. Las alternativas crypto conformes con MiCA ofrecen ventajas comparables con mejor cobertura europea en ${YEAR}.`,
        reason: `Coinbase Card tiene disponibilidad limitada en España y varios países de la UE.`,
        faq: [
          ['¿Qué tarjeta crypto está disponible en España en lugar de Coinbase Card?', `Gnosis Pay, MetaMask Card, Nexo Card, Brighty y Crypto.com están disponibles en España con cashback en cripto.`],
          ['¿Ofrece cashback en cripto la Coinbase Card?', `Sí, hasta 4% en XLM o 1% en BTC, pero solo para ciertas divisas y bajo condiciones.`],
          ['¿Hay alguna alternativa a Coinbase Card sin restricciones de divisa?', `Sí — MetaMask Card (1% ETH), Gnosis Pay (2% GNO) y Nexo (2% BTC) ofrecen cashback sin restricciones de divisa.`],
        ],
      },
      it: {
        title: `Alternative Coinbase Card ${YEAR} — Carte Crypto Europa`,
        h1: `Migliori Alternative alla Coinbase Card nel ${YEAR}`,
        description: `Coinbase Card poco disponibile in Italia e UE. Trova alternative crypto-native con cashback disponibili in Europa.`,
        intro: `La Coinbase Card è popolare negli USA e nel Regno Unito, ma la sua disponibilità in Italia e in diversi paesi UE è limitata. Le alternative crypto conformi a MiCA offrono vantaggi comparabili con una migliore copertura europea nel ${YEAR}.`,
        reason: `Coinbase Card ha disponibilità limitata in Italia e in diversi paesi UE.`,
        faq: [
          ['Quale carta crypto è disponibile in Italia al posto di Coinbase Card?', `Gnosis Pay, MetaMask Card, Nexo Card, Brighty e Crypto.com sono disponibili in Italia con cashback crypto.`],
          ['Coinbase Card offre cashback in cripto?', `Sì, fino al 4% in XLM o 1% in BTC, ma solo per alcune valute e sotto condizioni.`],
          ['Esiste un’alternativa a Coinbase Card senza restrizioni di valuta?', `Sì — MetaMask Card (1% ETH), Gnosis Pay (2% GNO) e Nexo (2% BTC) offrono cashback senza restrizioni di valuta.`],
        ],
      },
      en: {
        title: `Coinbase Card Alternatives ${YEAR} — EU Crypto Cards`,
        h1: `Best Coinbase Card Alternatives in ${YEAR}`,
        description: `Coinbase Card barely available in Europe. Find crypto-native alternatives with cashback available across the EU.`,
        intro: `The Coinbase Card is popular in the US and UK, but its availability across France and several EU countries remains limited. MiCA-compliant crypto alternatives offer comparable benefits with better European coverage in ${YEAR}.`,
        reason: `Coinbase Card has limited availability in France and several EU countries, and crypto cashback is conditional on the selected currency.`,
        faq: [
          ['Which crypto card is available in Europe instead of Coinbase Card?', `Gnosis Pay, MetaMask Card, Nexo Card, Brighty and Crypto.com are all available in Europe with crypto cashback.`],
          ['Does Coinbase Card offer crypto cashback?', `Yes, up to 4% in XLM or 1% in BTC, but only for certain currencies and with conditions.`],
          ['Is there a Coinbase Card alternative with no currency restrictions?', `Yes — MetaMask Card (1% ETH), Gnosis Pay (2% GNO) and Nexo (2% BTC) offer cashback with no currency restrictions.`],
        ],
      },
    },
  },

  // ─── KRAKEN ────────────────────────────────────────────────────────────────
  {
    brandId: 'kraken',
    displayName: 'Kraken',
    slugs: {
      fr: 'alternatives-kraken',
      be: 'alternatives-kraken',
      de: 'kraken-alternativen',
      at: 'kraken-alternativen',
      es: 'alternativas-kraken',
      it: 'alternative-kraken',
      en: 'kraken-card-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives Kraken Card ${YEAR} — Cartes Crypto Europe`,
        h1: `Meilleures Alternatives à la Kraken Card en ${YEAR}`,
        description: `Kraken Card encore récente et disponibilité limitée. Découvrez les alternatives avec plus de cashback et une couverture européenne complète.`,
        intro: `La Kraken Card est une entrée récente sur le marché des cartes crypto, avec des fonctionnalités encore en développement. Des concurrents plus établis offrent un cashback plus généreux et une disponibilité plus large en ${YEAR}.`,
        reason: `La Kraken Card est encore récente avec une disponibilité limitée en Europe et des fonctionnalités en cours de déploiement.`,
        faq: [
          ['Quelle carte crypto est plus complète que la Kraken Card ?', `Crypto.com, Nexo Card et Gnosis Pay offrent des écosystèmes plus matures avec un historique prouvé de fiabilité.`],
          ['Kraken Card est-elle disponible en France ?', `La disponibilité de Kraken Card en Europe est encore partielle. Vérifiez le site officiel pour votre pays.`],
          ['Y a-t-il une alternative à Kraken Card avec plus de cashback ?', `Oui — Crypto.com offre jusqu'à 8%, Nexo Card jusqu'à 2% BTC, Gnosis Pay 2% GNO.`],
        ],
      },
      de: {
        title: `Kraken Card Alternativen ${YEAR} — Krypto-Karten`,
        h1: `Beste Kraken Card Alternativen in ${YEAR}`,
        description: `Kraken Card noch neu und eingeschränkt verfügbar. Entdecken Sie Alternativen mit mehr Cashback und vollständiger EU-Abdeckung.`,
        intro: `Die Kraken Card ist ein neuerer Einstieg auf dem Krypto-Kartenmarkt mit noch in Entwicklung befindlichen Funktionen. Etabliertere Konkurrenten bieten in ${YEAR} großzügigeres Cashback und breitere Verfügbarkeit.`,
        reason: `Die Kraken Card ist noch relativ neu mit begrenzter EU-Verfügbarkeit und Funktionen, die noch ausgerollt werden.`,
        faq: [
          ['Welche Krypto-Karte ist umfassender als die Kraken Card?', `Crypto.com, Nexo Card und Gnosis Pay bieten ausgefeiltere Ökosysteme mit nachgewiesener Zuverlässigkeit.`],
          ['Ist Kraken Card in Deutschland verfügbar?', `Die Verfügbarkeit der Kraken Card in Europa ist noch teilweise. Prüfen Sie die offizielle Website für Ihr Land.`],
          ['Gibt es eine Kraken Card-Alternative mit mehr Cashback?', `Ja — Crypto.com bis zu 8%, Nexo Card bis zu 2% BTC, Gnosis Pay 2% GNO.`],
        ],
      },
      es: {
        title: `Alternativas Kraken Card ${YEAR} — Tarjetas Crypto`,
        h1: `Mejores Alternativas a la Kraken Card en ${YEAR}`,
        description: `Kraken Card aún nueva y disponibilidad limitada. Descubre alternativas con más cashback y cobertura europea completa.`,
        intro: `La Kraken Card es una incorporación reciente al mercado de tarjetas crypto, con funcionalidades aún en desarrollo. Los competidores más establecidos ofrecen un cashback más generoso y mayor disponibilidad en ${YEAR}.`,
        reason: `La Kraken Card es todavía relativamente nueva con disponibilidad limitada en Europa y funcionalidades en proceso de despliegue.`,
        faq: [
          ['¿Qué tarjeta crypto es más completa que la Kraken Card?', `Crypto.com, Nexo Card y Gnosis Pay ofrecen ecosistemas más maduros con historial probado de fiabilidad.`],
          ['¿Está disponible la Kraken Card en España?', `La disponibilidad de Kraken Card en Europa es aún parcial. Consulta el sitio oficial para tu país.`],
          ['¿Hay alguna alternativa a Kraken Card con más cashback?', `Sí — Crypto.com hasta 8%, Nexo Card hasta 2% BTC, Gnosis Pay 2% GNO.`],
        ],
      },
      it: {
        title: `Alternative Kraken Card ${YEAR} — Carte Crypto`,
        h1: `Migliori Alternative alla Kraken Card nel ${YEAR}`,
        description: `Kraken Card ancora nuova e disponibilità limitata. Scopri alternative con più cashback e copertura europea completa.`,
        intro: `La Kraken Card è una novità recente nel mercato delle carte crypto, con funzionalità ancora in sviluppo. I concorrenti più affermati offrono cashback più generoso e maggiore disponibilità nel ${YEAR}.`,
        reason: `La Kraken Card è ancora relativamente nuova con disponibilità limitata in Europa e funzionalità in fase di lancio.`,
        faq: [
          ['Quale carta crypto è più completa della Kraken Card?', `Crypto.com, Nexo Card e Gnosis Pay offrono ecosistemi più maturi con un comprovato track record di affidabilità.`],
          ['La Kraken Card è disponibile in Italia?', `La disponibilità di Kraken Card in Europa è ancora parziale. Verifica il sito ufficiale per il tuo paese.`],
          ['Esiste un’alternativa a Kraken Card con più cashback?', `Sì — Crypto.com fino all'8%, Nexo Card fino al 2% BTC, Gnosis Pay 2% GNO.`],
        ],
      },
      en: {
        title: `Kraken Card Alternatives ${YEAR} — Crypto Cards Europe`,
        h1: `Best Kraken Card Alternatives in ${YEAR}`,
        description: `Kraken Card still new and limited availability. Discover alternatives with more cashback and full European coverage.`,
        intro: `The Kraken Card is a recent entrant in the crypto card market, with features still being rolled out. More established competitors offer more generous cashback and wider availability in ${YEAR}.`,
        reason: `The Kraken Card is relatively new with limited European availability and features still being deployed.`,
        faq: [
          ['Which crypto card is more complete than the Kraken Card?', `Crypto.com, Nexo Card and Gnosis Pay offer more mature ecosystems with a proven reliability track record.`],
          ['Is Kraken Card available in the UK?', `Kraken Card availability in Europe is still partial. Check the official website for your country.`],
          ['Is there a Kraken Card alternative with more cashback?', `Yes — Crypto.com up to 8%, Nexo Card up to 2% BTC, Gnosis Pay 2% GNO.`],
        ],
      },
    },
  },

  // ─── METAMASK ──────────────────────────────────────────────────────────────
  {
    brandId: 'metamask',
    displayName: 'MetaMask',
    slugs: {
      fr: 'alternatives-metamask',
      be: 'alternatives-metamask',
      de: 'metamask-alternativen',
      at: 'metamask-alternativen',
      es: 'alternativas-metamask',
      it: 'alternative-metamask',
      en: 'metamask-card-alternatives',
    },
    copy: {
      fr: {
        title: `Alternatives MetaMask Card ${YEAR} — Plus de 1% Cashback`,
        h1: `Meilleures Alternatives à MetaMask Card en ${YEAR}`,
        description: `MetaMask Card fixe à 1% cashback ETH. Comparez les cartes avec plus de cashback ou une diversité de cryptos.`,
        intro: `MetaMask Card est une excellente entrée en matière (1% ETH, 0€/an, sans staking), mais son taux de cashback fixe peut sembler limité. Si vous cherchez un taux plus élevé ou des récompenses dans une autre crypto, plusieurs alternatives s'offrent à vous en ${YEAR}.`,
        reason: `MetaMask Card est limitée à 1% de cashback fixe en ETH, sans possibilité de passer à un tier premium.`,
        faq: [
          ['Quelle carte offre plus de cashback que MetaMask Card ?', `Gnosis Pay offre 2% en GNO. Nexo Card offre jusqu'à 2% en BTC. Crypto.com offre jusqu'à 8% en CRO selon le staking.`],
          ['MetaMask Card vs Gnosis Pay : laquelle choisir ?', `Pour du cashback sans staking, Gnosis Pay (2% GNO) bat MetaMask Card (1% ETH) en termes de taux. MetaMask Card est meilleure si vous ne voulez pas exposer à GNO.`],
          ['Y a-t-il des alternatives à MetaMask Card avec du cashback en BTC ?', `Oui — Nexo Card offre jusqu'à 2% en BTC selon le ratio NEXO dans votre portefeuille.`],
        ],
      },
      de: {
        title: `MetaMask Card Alternativen ${YEAR} — Mehr als 1% Cashback`,
        h1: `Beste MetaMask Card Alternativen in ${YEAR}`,
        description: `MetaMask Card fest bei 1% ETH Cashback. Vergleichen Sie Karten mit mehr Cashback oder anderen Kryptowährungen.`,
        intro: `MetaMask Card ist ein hervorragender Einstieg (1% ETH, 0€/Jahr, kein Staking), aber der feste Cashback-Satz kann begrenzt wirken. Wer einen höheren Satz oder Belohnungen in einer anderen Krypto sucht, findet in ${YEAR} mehrere Alternativen.`,
        reason: `MetaMask Card ist auf 1% festes ETH-Cashback beschränkt, ohne Möglichkeit zu einem Premium-Tier aufzusteigen.`,
        faq: [
          ['Welche Karte bietet mehr Cashback als MetaMask Card?', `Gnosis Pay bietet 2% in GNO. Nexo Card bis zu 2% in BTC. Crypto.com bis zu 8% in CRO je nach Staking.`],
          ['MetaMask Card vs Gnosis Pay: Was wählen?', `Für Cashback ohne Staking schlägt Gnosis Pay (2% GNO) MetaMask Card (1% ETH) beim Satz. MetaMask Card ist besser, wenn Sie keine GNO-Exposition wollen.`],
          ['Gibt es Alternativen zu MetaMask Card mit BTC-Cashback?', `Ja — Nexo Card bietet bis zu 2% in BTC abhängig vom NEXO-Portfolio-Verhältnis.`],
        ],
      },
      es: {
        title: `Alternativas MetaMask Card ${YEAR} — Más del 1% Cashback`,
        h1: `Mejores Alternativas a MetaMask Card en ${YEAR}`,
        description: `MetaMask Card fija al 1% cashback ETH. Compara tarjetas con más cashback o diversidad de criptos.`,
        intro: `MetaMask Card es una excelente entrada (1% ETH, 0€/año, sin staking), pero su tasa de cashback fija puede parecer limitada. Si buscas una tasa más alta o recompensas en otra cripto, hay varias alternativas disponibles en ${YEAR}.`,
        reason: `MetaMask Card está limitada a un cashback fijo del 1% en ETH, sin posibilidad de pasar a un tier premium.`,
        faq: [
          ['¿Qué tarjeta ofrece más cashback que MetaMask Card?', `Gnosis Pay ofrece 2% en GNO. Nexo Card hasta 2% en BTC. Crypto.com hasta 8% en CRO según staking.`],
          ['MetaMask Card vs Gnosis Pay: ¿cuál elegir?', `Para cashback sin staking, Gnosis Pay (2% GNO) supera a MetaMask Card (1% ETH) en tasa. MetaMask Card es mejor si no quieres exposición a GNO.`],
          ['¿Hay alternativas a MetaMask Card con cashback en BTC?', `Sí — Nexo Card ofrece hasta 2% en BTC según el ratio NEXO en tu cartera.`],
        ],
      },
      it: {
        title: `Alternative MetaMask Card ${YEAR} — Più dell'1% Cashback`,
        h1: `Migliori Alternative a MetaMask Card nel ${YEAR}`,
        description: `MetaMask Card fissa all'1% cashback ETH. Confronta carte con più cashback o diversità di crypto.`,
        intro: `MetaMask Card è un ottimo punto di partenza (1% ETH, 0€/anno, nessuno staking), ma il suo tasso di cashback fisso può sembrare limitato. Se cerchi un tasso più alto o ricompense in un'altra crypto, nel ${YEAR} esistono diverse alternative.`,
        reason: `MetaMask Card è limitata a un cashback fisso dell'1% in ETH, senza possibilità di passare a un tier premium.`,
        faq: [
          ['Quale carta offre più cashback di MetaMask Card?', `Gnosis Pay offre 2% in GNO. Nexo Card fino al 2% in BTC. Crypto.com fino all'8% in CRO in base allo staking.`],
          ['MetaMask Card vs Gnosis Pay: quale scegliere?', `Per cashback senza staking, Gnosis Pay (2% GNO) batte MetaMask Card (1% ETH) sul tasso. MetaMask Card è migliore se non si vuole esposizione a GNO.`],
          ['Ci sono alternative a MetaMask Card con cashback in BTC?', `Sì — Nexo Card offre fino al 2% in BTC in base al ratio NEXO nel portafoglio.`],
        ],
      },
      en: {
        title: `MetaMask Card Alternatives ${YEAR} — More than 1% Cashback`,
        h1: `Best MetaMask Card Alternatives in ${YEAR}`,
        description: `MetaMask Card fixed at 1% ETH cashback. Compare cards with more cashback or different crypto rewards.`,
        intro: `MetaMask Card is an excellent entry point (1% ETH, €0/year, no staking), but its fixed cashback rate can feel limiting. If you want a higher rate or rewards in a different crypto, several alternatives are available in ${YEAR}.`,
        reason: `MetaMask Card is limited to 1% fixed ETH cashback with no option to upgrade to a premium tier.`,
        faq: [
          ['Which card offers more cashback than MetaMask Card?', `Gnosis Pay offers 2% in GNO. Nexo Card offers up to 2% in BTC. Crypto.com up to 8% in CRO depending on staking.`],
          ['MetaMask Card vs Gnosis Pay: which to choose?', `For cashback with no staking, Gnosis Pay (2% GNO) beats MetaMask Card (1% ETH) on rate. MetaMask Card is better if you don't want GNO exposure.`],
          ['Are there MetaMask Card alternatives with BTC cashback?', `Yes — Nexo Card offers up to 2% in BTC depending on your NEXO portfolio ratio.`],
        ],
      },
    },
  },
];

/** Quick lookup: brandId → config */
export const ALT_BRAND_MAP: Record<AltBrandId, AltBrandConfig> = Object.fromEntries(
  ALT_BRANDS.map(b => [b.brandId, b])
) as Record<AltBrandId, AltBrandConfig>;

/** Flat list of all [lang, slug, brandId] triples — for route generation in App.tsx */
export const ALT_ROUTES: Array<{ lang: string; slug: string; brandId: AltBrandId }> =
  ALT_BRANDS.flatMap(brand =>
    Object.entries(brand.slugs).map(([lang, slug]) => ({ lang, slug, brandId: brand.brandId }))
  );
