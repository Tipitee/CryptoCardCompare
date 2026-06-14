// ─────────────────────────────────────────────────────────────────────────────
// cardReviewsI18n.ts — Translations for card reviews (EN / DE / ES / IT)
// FR content lives in cardReviews.ts (source of truth)
// ─────────────────────────────────────────────────────────────────────────────

export interface CardReviewI18nContent {
  badge?: string;
  pros: string[];
  cons: string[];
  verdict: string;
  keyStats: {
    cashbackMax: string;
    stakingRequis: string;
    fraisAnnuels: string;
    disponibilite: string;
  };
  metaTitle: string;
  metaDescription: string;
}

// [slug][lang] → translated content
export const CARD_REVIEWS_I18N: Record<string, Record<string, CardReviewI18nContent>> = {

  // ──────────────────────────────────────────── CRYPTO.COM ──
  'crypto-com-card': {
    en: {
      badge: 'Best known',
      pros: [
        'Free card with no annual fee on any tier',
        'Up to 5% cashback in CRO (Obsidian tier)',
        'Airport lounge access from Rose Gold tier',
        'Spotify, Netflix, Amazon Prime reimbursed by tier',
        'Free ATM withdrawals up to €400/month (higher tiers)',
        'Full-featured mobile app',
        'Accepted worldwide (Visa network)',
      ],
      cons: [
        'Cashback paid in CRO, a volatile token',
        'High staking for best tiers (€40,000 for Icy White)',
        'CRO value erosion reduces effective cashback over time',
      ],
      verdict: 'The Crypto.com Card is the most popular crypto card on the market. With up to 5% cashback, it is unbeatable — but only if you are comfortable holding CRO. The benefits scale with your staking level, making it ideal for crypto enthusiasts with significant CRO holdings.',
      keyStats: {
        cashbackMax: 'Up to 5% in CRO',
        stakingRequis: '€0–€400,000 in CRO by tier',
        fraisAnnuels: '€0 (free card)',
        disponibilite: 'France, EU, UK, USA and more',
      },
      metaTitle: 'Crypto.com Card Review 2026 — Cashback, Fees & Full Test',
      metaDescription: 'Our comprehensive Crypto.com Card review 2026: up to 5% cashback in CRO, staking requirements, fees and user experience. Is it worth it?',
    },
    de: {
      badge: 'Bekannteste Karte',
      pros: [
        'Kostenlose Karte ohne Jahresgebühren auf allen Stufen',
        'Bis zu 5% Cashback in CRO (Obsidian-Stufe)',
        'Flughafen-Lounge-Zugang ab Rose-Gold-Stufe',
        'Spotify, Netflix, Amazon Prime je nach Stufe erstattet',
        'Kostenlose Geldautomaten-Abhebungen bis €400/Monat',
        'Vollständige mobile App',
        'Weltweit akzeptiert (Visa-Netzwerk)',
      ],
      cons: [
        'Cashback wird in CRO ausgezahlt (volatiles Token)',
        'Hohes Staking für beste Stufen (€40.000 für Icy White)',
        'CRO-Wertverlust reduziert effektiven Cashback',
      ],
      verdict: 'Die Crypto.com Karte ist die bekannteste Krypto-Karte. Mit bis zu 5% Cashback unschlagbar – aber nur, wenn Sie bereit sind, CRO zu halten. Die Vorteile skalieren mit Ihrem Staking-Level.',
      keyStats: {
        cashbackMax: 'Bis zu 5% in CRO',
        stakingRequis: '€0–€400.000 in CRO je Stufe',
        fraisAnnuels: '€0 (kostenlose Karte)',
        disponibilite: 'Frankreich, EU, UK, USA und mehr',
      },
      metaTitle: 'Crypto.com Karte Test 2026 — Cashback, Gebühren & vollständiger Test',
      metaDescription: 'Unser umfassender Crypto.com Karten-Test 2026: bis zu 5% Cashback in CRO, Staking-Anforderungen, Gebühren und Nutzererfahrung.',
    },
    es: {
      badge: 'La más conocida',
      pros: [
        'Tarjeta gratuita sin comisión anual en cualquier nivel',
        'Hasta 5% de cashback en CRO (nivel Obsidian)',
        'Acceso a salas VIP aeropuerto desde nivel Rose Gold',
        'Spotify, Netflix, Amazon Prime reembolsados según nivel',
        'Retiros gratuitos en cajero hasta €400/mes',
        'Aplicación móvil completa e intuitiva',
        'Aceptada en todo el mundo (red Visa)',
      ],
      cons: [
        'Cashback pagado en CRO, un token volátil',
        'Alto staking para los mejores niveles (€40.000 para Icy White)',
        'La depreciación del CRO reduce el cashback efectivo',
      ],
      verdict: 'La Crypto.com Card es la tarjeta cripto más popular del mercado. Con hasta 5% de cashback es imbatible, pero solo si estás cómodo manteniendo CRO. Los beneficios escalan con tu nivel de staking.',
      keyStats: {
        cashbackMax: 'Hasta 5% en CRO',
        stakingRequis: '€0–€400.000 en CRO según nivel',
        fraisAnnuels: '€0 (tarjeta gratuita)',
        disponibilite: 'Francia, UE, Reino Unido, EE.UU. y más',
      },
      metaTitle: 'Crypto.com Card Opiniones 2026 — Cashback, Comisiones y Prueba Completa',
      metaDescription: 'Nuestra completa opinión sobre la Crypto.com Card 2026: hasta 5% de cashback en CRO, requisitos de staking, comisiones y experiencia.',
    },
    it: {
      badge: 'La più conosciuta',
      pros: [
        'Carta gratuita senza commissioni annuali su qualsiasi livello',
        'Fino al 5% di cashback in CRO (livello Obsidian)',
        'Accesso alle lounge aeroportuali dal livello Rose Gold',
        'Spotify, Netflix, Amazon Prime rimborsati per livello',
        'Prelievi ATM gratuiti fino a €400/mese',
        'App mobile completa e intuitiva',
        'Accettata in tutto il mondo (rete Visa)',
      ],
      cons: [
        'Cashback pagato in CRO, un token volatile',
        'Alto staking per i livelli migliori (€40.000 per Icy White)',
        'La svalutazione del CRO riduce il cashback effettivo',
      ],
      verdict: 'La Crypto.com Card è la carta crypto più popolare sul mercato. Con fino al 5% di cashback è imbattibile — ma solo se siete disposti a detenere CRO. I benefici scalano con il livello di staking.',
      keyStats: {
        cashbackMax: 'Fino al 5% in CRO',
        stakingRequis: '€0–€400.000 in CRO per livello',
        fraisAnnuels: '€0 (carta gratuita)',
        disponibilite: 'Francia, UE, UK, USA e altro',
      },
      metaTitle: 'Crypto.com Card Recensione 2026 — Cashback, Commissioni e Test Completo',
      metaDescription: 'La nostra recensione completa della Crypto.com Card 2026: fino al 5% di cashback in CRO, requisiti di staking, commissioni ed esperienza utente.',
    },
  },

  // ──────────────────────────────────────────── BINANCE ──
  'binance-card': {
    en: {
      badge: 'Best flexibility',
      pros: [
        'Up to 8% cashback in BNB',
        'Spend 100+ cryptocurrencies directly',
        'No annual fees',
        'Deep Binance ecosystem integration',
        'Instant conversion at point of sale',
      ],
      cons: [
        'Cashback requires BNB staking',
        'Limited geographic availability',
        'Dependent on Binance platform stability',
      ],
      verdict: 'The Binance Card is the natural choice for existing Binance users. It offers excellent flexibility to spend any crypto with up to 8% cashback in BNB. The main limitation is geographic availability and the BNB staking requirement.',
      keyStats: {
        cashbackMax: 'Up to 8% in BNB',
        stakingRequis: 'Yes (BNB)',
        fraisAnnuels: '€0',
        disponibilite: 'EU + selected countries',
      },
      metaTitle: 'Binance Card Review 2026 — Cashback, Fees & Full Test',
      metaDescription: 'Our complete Binance Card review 2026: up to 8% BNB cashback, staking requirements, availability and user experience.',
    },
    de: {
      badge: 'Beste Flexibilität',
      pros: [
        'Bis zu 8% Cashback in BNB',
        'Über 100 Kryptowährungen direkt ausgeben',
        'Keine Jahresgebühren',
        'Tiefe Integration ins Binance-Ökosystem',
        'Sofortige Konvertierung am Point of Sale',
      ],
      cons: [
        'Cashback erfordert BNB-Staking',
        'Begrenzte geografische Verfügbarkeit',
        'Abhängig von der Stabilität der Binance-Plattform',
      ],
      verdict: 'Die Binance Karte ist die natürliche Wahl für bestehende Binance-Nutzer. Sie bietet hervorragende Flexibilität mit bis zu 8% Cashback in BNB. Die Haupteinschränkungen sind geografische Verfügbarkeit und BNB-Staking.',
      keyStats: {
        cashbackMax: 'Bis zu 8% in BNB',
        stakingRequis: 'Ja (BNB)',
        fraisAnnuels: '€0',
        disponibilite: 'EU + ausgewählte Länder',
      },
      metaTitle: 'Binance Karte Test 2026 — Cashback, Gebühren & vollständiger Test',
      metaDescription: 'Unser vollständiger Binance Karten-Test 2026: bis zu 8% BNB-Cashback, Staking-Anforderungen, Verfügbarkeit und Nutzererfahrung.',
    },
    es: {
      badge: 'Mejor flexibilidad',
      pros: [
        'Hasta 8% de cashback en BNB',
        'Gasta más de 100 criptomonedas directamente',
        'Sin comisiones anuales',
        'Integración profunda con el ecosistema Binance',
        'Conversión instantánea en el punto de venta',
      ],
      cons: [
        'El cashback requiere staking de BNB',
        'Disponibilidad geográfica limitada',
        'Dependiente de la estabilidad de la plataforma Binance',
      ],
      verdict: 'La Binance Card es la elección natural para los usuarios existentes de Binance. Ofrece excelente flexibilidad para gastar cualquier cripto con hasta 8% de cashback en BNB.',
      keyStats: {
        cashbackMax: 'Hasta 8% en BNB',
        stakingRequis: 'Sí (BNB)',
        fraisAnnuels: '€0',
        disponibilite: 'UE + países seleccionados',
      },
      metaTitle: 'Binance Card Opiniones 2026 — Cashback, Comisiones y Prueba Completa',
      metaDescription: 'Nuestra completa opinión sobre la Binance Card 2026: hasta 8% de cashback en BNB, requisitos de staking y disponibilidad.',
    },
    it: {
      badge: 'Migliore flessibilità',
      pros: [
        'Fino all\'8% di cashback in BNB',
        'Spendi oltre 100 criptovalute direttamente',
        'Nessuna commissione annuale',
        'Profonda integrazione con l\'ecosistema Binance',
        'Conversione istantanea al punto vendita',
      ],
      cons: [
        'Il cashback richiede staking di BNB',
        'Disponibilità geografica limitata',
        'Dipendente dalla stabilità della piattaforma Binance',
      ],
      verdict: 'La Binance Card è la scelta naturale per gli utenti Binance esistenti. Offre eccellente flessibilità per spendere qualsiasi crypto con fino all\'8% di cashback in BNB.',
      keyStats: {
        cashbackMax: 'Fino all\'8% in BNB',
        stakingRequis: 'Sì (BNB)',
        fraisAnnuels: '€0',
        disponibilite: 'UE + paesi selezionati',
      },
      metaTitle: 'Binance Card Recensione 2026 — Cashback, Commissioni e Test Completo',
      metaDescription: 'La nostra recensione completa della Binance Card 2026: fino all\'8% di cashback in BNB, requisiti di staking e disponibilità.',
    },
  },

  // ──────────────────────────────────────────── BYBIT ──
  'bybit-card': {
    en: {
      badge: 'Best for traders',
      pros: [
        'Up to 10% cashback for active Bybit users',
        'No annual fees',
        'Accepted worldwide (Mastercard)',
        'Seamless Bybit exchange integration',
        'USDT cashback — stable value',
      ],
      cons: [
        'Best rates reserved for active Bybit traders',
        'Cashback in USDT, not native crypto',
      ],
      verdict: 'The Bybit Card is particularly suited for active Bybit traders, offering up to 10% cashback in USDT with no staking required. Benefits depend on trading activity, making it ideal for high-volume Bybit users.',
      keyStats: {
        cashbackMax: 'Up to 10% in USDT',
        stakingRequis: 'None required',
        fraisAnnuels: '€0',
        disponibilite: 'EEA + 50 countries',
      },
      metaTitle: 'Bybit Card Review 2026 — Cashback, Fees & Full Test',
      metaDescription: 'Our comprehensive Bybit Card review 2026: up to 10% cashback in USDT, no staking required, fees and experience.',
    },
    de: {
      badge: 'Beste für Trader',
      pros: [
        'Bis zu 10% Cashback für aktive Bybit-Nutzer',
        'Keine Jahresgebühren',
        'Weltweit akzeptiert (Mastercard)',
        'Nahtlose Bybit-Exchange-Integration',
        'USDT-Cashback — stabiler Wert',
      ],
      cons: [
        'Beste Konditionen für aktive Bybit-Trader reserviert',
        'Cashback in USDT, nicht nativer Token',
      ],
      verdict: 'Die Bybit Karte eignet sich besonders für aktive Bybit-Trader mit bis zu 10% Cashback in USDT ohne Staking-Anforderungen.',
      keyStats: {
        cashbackMax: 'Bis zu 10% in USDT',
        stakingRequis: 'Keines erforderlich',
        fraisAnnuels: '€0',
        disponibilite: 'EWR + 50 Länder',
      },
      metaTitle: 'Bybit Karte Test 2026 — Cashback, Gebühren & vollständiger Test',
      metaDescription: 'Unser umfassender Bybit Karten-Test 2026: bis zu 10% Cashback in USDT, kein Staking erforderlich.',
    },
    es: {
      badge: 'Mejor para traders',
      pros: [
        'Hasta 10% de cashback para traders activos de Bybit',
        'Sin comisiones anuales',
        'Aceptada en todo el mundo (Mastercard)',
        'Integración perfecta con Bybit exchange',
        'Cashback en USDT — valor estable',
      ],
      cons: [
        'Mejores tasas reservadas para traders activos de Bybit',
        'Cashback en USDT, no cripto nativa',
      ],
      verdict: 'La Bybit Card es especialmente adecuada para traders activos de Bybit, ofreciendo hasta 10% de cashback en USDT sin staking requerido.',
      keyStats: {
        cashbackMax: 'Hasta 10% en USDT',
        stakingRequis: 'Ninguno requerido',
        fraisAnnuels: '€0',
        disponibilite: 'EEE + 50 países',
      },
      metaTitle: 'Bybit Card Opiniones 2026 — Cashback, Comisiones y Prueba Completa',
      metaDescription: 'Nuestra completa opinión sobre la Bybit Card 2026: hasta 10% de cashback en USDT, sin staking requerido.',
    },
    it: {
      badge: 'Migliore per trader',
      pros: [
        'Fino al 10% di cashback per trader attivi Bybit',
        'Nessuna commissione annuale',
        'Accettata in tutto il mondo (Mastercard)',
        'Integrazione perfetta con Bybit exchange',
        'Cashback in USDT — valore stabile',
      ],
      cons: [
        'Tariffe migliori riservate ai trader attivi Bybit',
        'Cashback in USDT, non crypto nativa',
      ],
      verdict: 'La Bybit Card è particolarmente adatta per i trader attivi di Bybit, offrendo fino al 10% di cashback in USDT senza staking richiesto.',
      keyStats: {
        cashbackMax: 'Fino al 10% in USDT',
        stakingRequis: 'Nessuno richiesto',
        fraisAnnuels: '€0',
        disponibilite: 'SEE + 50 paesi',
      },
      metaTitle: 'Bybit Card Recensione 2026 — Cashback, Commissioni e Test Completo',
      metaDescription: 'La nostra recensione completa della Bybit Card 2026: fino al 10% di cashback in USDT, nessuno staking richiesto.',
    },
  },

  // ──────────────────────────────────────────── OKX ──
  'okx-card': {
    en: {
      badge: 'Best Web3 integration',
      pros: [
        'Native integration with OKX Web3 wallet',
        'Up to 5% cashback in OKB',
        'No annual fees',
        'Apple Pay & Google Pay compatible',
        'Supports 50+ cryptocurrencies',
      ],
      cons: [
        'Cashback requires OKB staking',
        'Limited availability outside Europe',
        'OKB token subject to volatility',
      ],
      verdict: 'The OKX Card stands out for its native Web3 wallet integration, making it the best choice for DeFi users. Cashback of up to 5% in OKB is competitive, but requires staking.',
      keyStats: {
        cashbackMax: 'Up to 5% in OKB',
        stakingRequis: 'Yes (OKB)',
        fraisAnnuels: '€0',
        disponibilite: 'Europe + selected markets',
      },
      metaTitle: 'OKX Card Review 2026 — Cashback, Web3 & Full Test',
      metaDescription: 'Our OKX Card review 2026: up to 5% OKB cashback, Web3 wallet integration, fees and experience. Best for DeFi users?',
    },
    de: {
      badge: 'Beste Web3-Integration',
      pros: [
        'Native Integration mit OKX Web3-Wallet',
        'Bis zu 5% Cashback in OKB',
        'Keine Jahresgebühren',
        'Apple Pay & Google Pay kompatibel',
        'Unterstützt 50+ Kryptowährungen',
      ],
      cons: [
        'Cashback erfordert OKB-Staking',
        'Begrenzte Verfügbarkeit außerhalb Europas',
        'OKB-Token unterliegt Volatilität',
      ],
      verdict: 'Die OKX Karte besticht durch ihre native Web3-Wallet-Integration und ist die beste Wahl für DeFi-Nutzer. Cashback bis zu 5% in OKB ist wettbewerbsfähig, erfordert aber Staking.',
      keyStats: {
        cashbackMax: 'Bis zu 5% in OKB',
        stakingRequis: 'Ja (OKB)',
        fraisAnnuels: '€0',
        disponibilite: 'Europa + ausgewählte Märkte',
      },
      metaTitle: 'OKX Karte Test 2026 — Cashback, Web3 & vollständiger Test',
      metaDescription: 'Unser OKX Karten-Test 2026: bis zu 5% OKB-Cashback, Web3-Wallet-Integration und Nutzererfahrung.',
    },
    es: {
      badge: 'Mejor integración Web3',
      pros: [
        'Integración nativa con la wallet Web3 de OKX',
        'Hasta 5% de cashback en OKB',
        'Sin comisiones anuales',
        'Compatible con Apple Pay y Google Pay',
        'Soporta más de 50 criptomonedas',
      ],
      cons: [
        'El cashback requiere staking de OKB',
        'Disponibilidad limitada fuera de Europa',
        'El token OKB está sujeto a volatilidad',
      ],
      verdict: 'La OKX Card destaca por su integración nativa con la wallet Web3, siendo la mejor opción para usuarios DeFi. El cashback de hasta 5% en OKB es competitivo, pero requiere staking.',
      keyStats: {
        cashbackMax: 'Hasta 5% en OKB',
        stakingRequis: 'Sí (OKB)',
        fraisAnnuels: '€0',
        disponibilite: 'Europa + mercados seleccionados',
      },
      metaTitle: 'OKX Card Opiniones 2026 — Cashback, Web3 y Prueba Completa',
      metaDescription: 'Nuestra opinión sobre la OKX Card 2026: hasta 5% de cashback en OKB, integración Web3 y experiencia.',
    },
    it: {
      badge: 'Migliore integrazione Web3',
      pros: [
        'Integrazione nativa con il wallet Web3 di OKX',
        'Fino al 5% di cashback in OKB',
        'Nessuna commissione annuale',
        'Compatibile con Apple Pay e Google Pay',
        'Supporta oltre 50 criptovalute',
      ],
      cons: [
        'Il cashback richiede staking di OKB',
        'Disponibilità limitata fuori dall\'Europa',
        'Il token OKB è soggetto a volatilità',
      ],
      verdict: 'La OKX Card si distingue per l\'integrazione nativa del wallet Web3, rendendola la scelta migliore per gli utenti DeFi. Cashback fino al 5% in OKB è competitivo, ma richiede staking.',
      keyStats: {
        cashbackMax: 'Fino al 5% in OKB',
        stakingRequis: 'Sì (OKB)',
        fraisAnnuels: '€0',
        disponibilite: 'Europa + mercati selezionati',
      },
      metaTitle: 'OKX Card Recensione 2026 — Cashback, Web3 e Test Completo',
      metaDescription: 'La nostra recensione della OKX Card 2026: fino al 5% di cashback in OKB, integrazione Web3 ed esperienza utente.',
    },
  },

  // ──────────────────────────────────────────── COINBASE ──
  'coinbase-card': {
    en: {
      badge: 'Best for beginners',
      pros: [
        'Cashback in BTC or ETH — free choice',
        'No staking required',
        'Simple and intuitive interface',
        'Directly linked to Coinbase account',
        'Trusted regulated US exchange',
      ],
      cons: [
        'Maximum 4% cashback (lower than competitors with staking)',
        'Available only in selected countries',
        'Requires Coinbase account',
      ],
      verdict: 'The Coinbase Card is the easiest crypto card to get started with: no staking required, cashback in BTC or ETH, and a simple interface. The 4% maximum cashback is lower than some competitors, but the simplicity makes it perfect for beginners.',
      keyStats: {
        cashbackMax: 'Up to 4% in BTC/ETH',
        stakingRequis: 'None',
        fraisAnnuels: '€0',
        disponibilite: 'USA, UK, selective EU',
      },
      metaTitle: 'Coinbase Card Review 2026 — Cashback, Fees & Full Test',
      metaDescription: 'Our Coinbase Card review 2026: up to 4% cashback in BTC or ETH, no staking needed. Perfect for crypto beginners.',
    },
    de: {
      badge: 'Beste für Einsteiger',
      pros: [
        'Cashback in BTC oder ETH — freie Wahl',
        'Kein Staking erforderlich',
        'Einfache und intuitive Benutzeroberfläche',
        'Direkt mit Coinbase-Konto verknüpft',
        'Vertrauenswürdige, regulierte US-Börse',
      ],
      cons: [
        'Maximal 4% Cashback (niedriger als Konkurrenten mit Staking)',
        'Nur in ausgewählten Ländern verfügbar',
        'Erfordert Coinbase-Konto',
      ],
      verdict: 'Die Coinbase Karte ist die einfachste Krypto-Karte für Einsteiger: kein Staking erforderlich, Cashback in BTC oder ETH, einfache Benutzeroberfläche. Perfekt für Krypto-Anfänger.',
      keyStats: {
        cashbackMax: 'Bis zu 4% in BTC/ETH',
        stakingRequis: 'Keines',
        fraisAnnuels: '€0',
        disponibilite: 'USA, UK, ausgewählte EU',
      },
      metaTitle: 'Coinbase Karte Test 2026 — Cashback, Gebühren & vollständiger Test',
      metaDescription: 'Unser Coinbase Karten-Test 2026: bis zu 4% Cashback in BTC oder ETH, kein Staking erforderlich. Perfekt für Krypto-Einsteiger.',
    },
    es: {
      badge: 'Mejor para principiantes',
      pros: [
        'Cashback en BTC o ETH — elección libre',
        'Sin staking requerido',
        'Interfaz simple e intuitiva',
        'Vinculada directamente a la cuenta Coinbase',
        'Exchange estadounidense regulado y de confianza',
      ],
      cons: [
        'Máximo 4% de cashback (menor que competidores con staking)',
        'Disponible solo en países seleccionados',
        'Requiere cuenta Coinbase',
      ],
      verdict: 'La Coinbase Card es la tarjeta cripto más fácil para empezar: sin staking, cashback en BTC o ETH, interfaz simple. El máximo del 4% es menor que algunos competidores, pero la simplicidad la hace perfecta para principiantes.',
      keyStats: {
        cashbackMax: 'Hasta 4% en BTC/ETH',
        stakingRequis: 'Ninguno',
        fraisAnnuels: '€0',
        disponibilite: 'EE.UU., Reino Unido, UE selectiva',
      },
      metaTitle: 'Coinbase Card Opiniones 2026 — Cashback, Comisiones y Prueba Completa',
      metaDescription: 'Nuestra opinión sobre la Coinbase Card 2026: hasta 4% de cashback en BTC o ETH, sin staking. Perfecta para principiantes.',
    },
    it: {
      badge: 'Migliore per principianti',
      pros: [
        'Cashback in BTC o ETH — scelta libera',
        'Nessuno staking richiesto',
        'Interfaccia semplice e intuitiva',
        'Direttamente collegata al conto Coinbase',
        'Exchange americano regolamentato e affidabile',
      ],
      cons: [
        'Massimo 4% di cashback (inferiore ai concorrenti con staking)',
        'Disponibile solo in paesi selezionati',
        'Richiede un account Coinbase',
      ],
      verdict: 'La Coinbase Card è la carta crypto più semplice per iniziare: nessuno staking richiesto, cashback in BTC o ETH, interfaccia semplice. Perfetta per i principianti.',
      keyStats: {
        cashbackMax: 'Fino al 4% in BTC/ETH',
        stakingRequis: 'Nessuno',
        fraisAnnuels: '€0',
        disponibilite: 'USA, UK, UE selettiva',
      },
      metaTitle: 'Coinbase Card Recensione 2026 — Cashback, Commissioni e Test Completo',
      metaDescription: 'La nostra recensione della Coinbase Card 2026: fino al 4% di cashback in BTC o ETH, nessuno staking. Perfetta per i principianti.',
    },
  },

  // ──────────────────────────────────────────── NEXO ──
  'nexo-card': {
    en: {
      badge: 'Best without staking',
      pros: [
        'Up to 2% cashback without mandatory staking',
        'Supports 40+ cryptocurrencies and stablecoins',
        'No annual fees',
        'Access to Nexo credit lines',
        'Available in 200+ countries',
      ],
      cons: [
        '2% maximum cashback (less than Crypto.com with staking)',
        'Tied to the Nexo ecosystem',
        'Cashback in BTC or NEXO token',
      ],
      verdict: 'The Nexo Card is the best option for users who want cashback without mandatory staking. With up to 2% in BTC or NEXO and availability in 200+ countries, it is a solid everyday card.',
      keyStats: {
        cashbackMax: 'Up to 2% in BTC/NEXO',
        stakingRequis: 'None mandatory',
        fraisAnnuels: '€0',
        disponibilite: 'EEA + 200 countries',
      },
      metaTitle: 'Nexo Card Review 2026 — Cashback Without Staking & Full Test',
      metaDescription: 'Our Nexo Card review 2026: up to 2% cashback in BTC without mandatory staking, fees and user experience.',
    },
    de: {
      badge: 'Beste ohne Staking',
      pros: [
        'Bis zu 2% Cashback ohne obligatorisches Staking',
        'Unterstützt 40+ Kryptowährungen und Stablecoins',
        'Keine Jahresgebühren',
        'Zugang zu Nexo-Kreditlinien',
        'In 200+ Ländern verfügbar',
      ],
      cons: [
        'Maximal 2% Cashback (weniger als Crypto.com mit Staking)',
        'An das Nexo-Ökosystem gebunden',
        'Cashback in BTC oder NEXO-Token',
      ],
      verdict: 'Die Nexo Karte ist die beste Option für Nutzer, die Cashback ohne obligatorisches Staking wünschen. Mit bis zu 2% in BTC oder NEXO und Verfügbarkeit in 200+ Ländern ist sie eine solide Alltagskarte.',
      keyStats: {
        cashbackMax: 'Bis zu 2% in BTC/NEXO',
        stakingRequis: 'Keines obligatorisch',
        fraisAnnuels: '€0',
        disponibilite: 'EWR + 200 Länder',
      },
      metaTitle: 'Nexo Karte Test 2026 — Cashback ohne Staking & vollständiger Test',
      metaDescription: 'Unser Nexo Karten-Test 2026: bis zu 2% Cashback in BTC ohne obligatorisches Staking.',
    },
    es: {
      badge: 'Mejor sin staking',
      pros: [
        'Hasta 2% de cashback sin staking obligatorio',
        'Soporta más de 40 criptomonedas y stablecoins',
        'Sin comisiones anuales',
        'Acceso a líneas de crédito Nexo',
        'Disponible en más de 200 países',
      ],
      cons: [
        'Máximo 2% de cashback (menos que Crypto.com con staking)',
        'Vinculada al ecosistema Nexo',
        'Cashback en BTC o token NEXO',
      ],
      verdict: 'La Nexo Card es la mejor opción para usuarios que quieren cashback sin staking obligatorio. Con hasta 2% en BTC o NEXO y disponibilidad en 200+ países, es una sólida tarjeta de uso diario.',
      keyStats: {
        cashbackMax: 'Hasta 2% en BTC/NEXO',
        stakingRequis: 'Ninguno obligatorio',
        fraisAnnuels: '€0',
        disponibilite: 'EEE + 200 países',
      },
      metaTitle: 'Nexo Card Opiniones 2026 — Cashback Sin Staking y Prueba Completa',
      metaDescription: 'Nuestra opinión sobre la Nexo Card 2026: hasta 2% de cashback en BTC sin staking obligatorio.',
    },
    it: {
      badge: 'Migliore senza staking',
      pros: [
        'Fino al 2% di cashback senza staking obbligatorio',
        'Supporta oltre 40 criptovalute e stablecoin',
        'Nessuna commissione annuale',
        'Accesso alle linee di credito Nexo',
        'Disponibile in oltre 200 paesi',
      ],
      cons: [
        'Massimo 2% di cashback (meno di Crypto.com con staking)',
        'Legata all\'ecosistema Nexo',
        'Cashback in BTC o token NEXO',
      ],
      verdict: 'La Nexo Card è la migliore opzione per chi vuole cashback senza staking obbligatorio. Con fino al 2% in BTC o NEXO e disponibilità in 200+ paesi, è una solida carta per uso quotidiano.',
      keyStats: {
        cashbackMax: 'Fino al 2% in BTC/NEXO',
        stakingRequis: 'Nessuno obbligatorio',
        fraisAnnuels: '€0',
        disponibilite: 'SEE + 200 paesi',
      },
      metaTitle: 'Nexo Card Recensione 2026 — Cashback Senza Staking e Test Completo',
      metaDescription: 'La nostra recensione della Nexo Card 2026: fino al 2% di cashback in BTC senza staking obbligatorio.',
    },
  },

  // ──────────────────────────────────────────── BITPANDA ──
  'bitpanda-card': {
    en: {
      badge: 'Best EU integration',
      pros: [
        'Perfect integration with Bitpanda (European exchange)',
        'Cashback in BEST token',
        'Simple and regulated interface',
        'Ideal for European residents',
        'Licensed by Austrian regulator',
      ],
      cons: [
        'Low maximum cashback (1%)',
        'Available in Europe only',
        'Requires BEST staking',
      ],
      verdict: 'The Bitpanda Card is the ideal choice for European users seeking a simple, regulated crypto card. The 1% cashback is modest, but the platform\'s reliability and European focus make it trustworthy.',
      keyStats: {
        cashbackMax: 'Up to 1% in BEST',
        stakingRequis: 'Yes (BEST)',
        fraisAnnuels: '€0',
        disponibilite: 'Europe only',
      },
      metaTitle: 'Bitpanda Card Review 2026 — Cashback, Fees & Full Test',
      metaDescription: 'Our Bitpanda Card review 2026: up to 1% cashback in BEST, European regulation and user experience.',
    },
    de: {
      badge: 'Beste EU-Integration',
      pros: [
        'Perfekte Integration mit Bitpanda (europäische Börse)',
        'Cashback im BEST-Token',
        'Einfache und regulierte Benutzeroberfläche',
        'Ideal für europäische Einwohner',
        'Lizenziert durch österreichische Aufsichtsbehörde',
      ],
      cons: [
        'Niedriger maximaler Cashback (1%)',
        'Nur in Europa verfügbar',
        'Erfordert BEST-Staking',
      ],
      verdict: 'Die Bitpanda Karte ist die ideale Wahl für europäische Nutzer, die eine einfache, regulierte Krypto-Karte suchen. Der 1% Cashback ist bescheiden, aber die Zuverlässigkeit der Plattform macht sie vertrauenswürdig.',
      keyStats: {
        cashbackMax: 'Bis zu 1% in BEST',
        stakingRequis: 'Ja (BEST)',
        fraisAnnuels: '€0',
        disponibilite: 'Nur Europa',
      },
      metaTitle: 'Bitpanda Karte Test 2026 — Cashback, Gebühren & vollständiger Test',
      metaDescription: 'Unser Bitpanda Karten-Test 2026: bis zu 1% Cashback in BEST, europäische Regulierung.',
    },
    es: {
      badge: 'Mejor integración UE',
      pros: [
        'Integración perfecta con Bitpanda (exchange europeo)',
        'Cashback en token BEST',
        'Interfaz simple y regulada',
        'Ideal para residentes europeos',
        'Licenciada por regulador austriaco',
      ],
      cons: [
        'Cashback máximo bajo (1%)',
        'Disponible solo en Europa',
        'Requiere staking de BEST',
      ],
      verdict: 'La Bitpanda Card es la elección ideal para usuarios europeos que buscan una tarjeta cripto simple y regulada. El 1% de cashback es modesto, pero la fiabilidad de la plataforma la hace confiable.',
      keyStats: {
        cashbackMax: 'Hasta 1% en BEST',
        stakingRequis: 'Sí (BEST)',
        fraisAnnuels: '€0',
        disponibilite: 'Solo Europa',
      },
      metaTitle: 'Bitpanda Card Opiniones 2026 — Cashback, Comisiones y Prueba Completa',
      metaDescription: 'Nuestra opinión sobre la Bitpanda Card 2026: hasta 1% de cashback en BEST, regulación europea.',
    },
    it: {
      badge: 'Migliore integrazione UE',
      pros: [
        'Integrazione perfetta con Bitpanda (exchange europeo)',
        'Cashback in token BEST',
        'Interfaccia semplice e regolamentata',
        'Ideale per i residenti europei',
        'Autorizzata dal regolatore austriaco',
      ],
      cons: [
        'Cashback massimo basso (1%)',
        'Disponibile solo in Europa',
        'Richiede staking di BEST',
      ],
      verdict: 'La Bitpanda Card è la scelta ideale per gli utenti europei che cercano una carta crypto semplice e regolamentata. L\'1% di cashback è modesto, ma l\'affidabilità della piattaforma la rende affidabile.',
      keyStats: {
        cashbackMax: 'Fino all\'1% in BEST',
        stakingRequis: 'Sì (BEST)',
        fraisAnnuels: '€0',
        disponibilite: 'Solo Europa',
      },
      metaTitle: 'Bitpanda Card Recensione 2026 — Cashback, Commissioni e Test Completo',
      metaDescription: 'La nostra recensione della Bitpanda Card 2026: fino all\'1% di cashback in BEST, regolamentazione europea.',
    },
  },

  // ──────────────────────────────────────────── WIREX ──
  'wirex-card': {
    en: {
      badge: 'Best multi-currency',
      pros: [
        'Support for 150+ currencies and cryptos',
        'Interbank exchange rates',
        'Intuitive app',
        'Multiple currency accounts in one card',
        'No standard annual fee',
      ],
      cons: [
        'Modest cashback (1.5% max in WXT)',
        'Optional monthly fees for some benefits',
        'WXT token is less known',
      ],
      verdict: 'The Wirex Card is the top choice for international travellers and multi-currency users. With 150+ currencies supported and interbank rates, it is excellent for frequent travellers, even if cashback is not the highest.',
      keyStats: {
        cashbackMax: 'Up to 1.5% in WXT',
        stakingRequis: 'None',
        fraisAnnuels: '€0 (standard plan)',
        disponibilite: 'Worldwide (180+ countries)',
      },
      metaTitle: 'Wirex Card Review 2026 — Multi-Currency, Cashback & Full Test',
      metaDescription: 'Our Wirex Card review 2026: 150+ currencies, interbank rates, up to 1.5% cashback. Best for travellers?',
    },
    de: {
      badge: 'Beste Multi-Währung',
      pros: [
        'Unterstützung für 150+ Währungen und Kryptos',
        'Interbanken-Wechselkurse',
        'Intuitive App',
        'Mehrere Währungskonten auf einer Karte',
        'Keine Standard-Jahresgebühr',
      ],
      cons: [
        'Bescheidener Cashback (max. 1,5% in WXT)',
        'Optionale monatliche Gebühren für einige Vorteile',
        'WXT-Token weniger bekannt',
      ],
      verdict: 'Die Wirex Karte ist die Top-Wahl für Vielreisende und Multi-Währungs-Nutzer. Mit 150+ unterstützten Währungen und Interbanken-Kursen excellent für häufige Reisende.',
      keyStats: {
        cashbackMax: 'Bis zu 1,5% in WXT',
        stakingRequis: 'Keines',
        fraisAnnuels: '€0 (Standardplan)',
        disponibilite: 'Weltweit (180+ Länder)',
      },
      metaTitle: 'Wirex Karte Test 2026 — Multi-Währung, Cashback & vollständiger Test',
      metaDescription: 'Unser Wirex Karten-Test 2026: 150+ Währungen, Interbanken-Kurse, bis zu 1,5% Cashback.',
    },
    es: {
      badge: 'Mejor multidivisa',
      pros: [
        'Soporte para más de 150 divisas y criptos',
        'Tipos de cambio interbancarios',
        'Aplicación intuitiva',
        'Múltiples cuentas en divisas en una sola tarjeta',
        'Sin comisión anual estándar',
      ],
      cons: [
        'Cashback modesto (máximo 1,5% en WXT)',
        'Comisiones mensuales opcionales para algunos beneficios',
        'Token WXT menos conocido',
      ],
      verdict: 'La Wirex Card es la mejor opción para viajeros internacionales y usuarios multidivisa. Con más de 150 divisas soportadas y tipos interbancarios, es excelente para viajeros frecuentes.',
      keyStats: {
        cashbackMax: 'Hasta 1,5% en WXT',
        stakingRequis: 'Ninguno',
        fraisAnnuels: '€0 (plan estándar)',
        disponibilite: 'Mundial (más de 180 países)',
      },
      metaTitle: 'Wirex Card Opiniones 2026 — Multidivisa, Cashback y Prueba Completa',
      metaDescription: 'Nuestra opinión sobre la Wirex Card 2026: más de 150 divisas, tipos interbancarios, hasta 1,5% de cashback.',
    },
    it: {
      badge: 'Migliore multi-valuta',
      pros: [
        'Supporto per oltre 150 valute e criptovalute',
        'Tassi di cambio interbancari',
        'App intuitiva',
        'Più conti valutari in una sola carta',
        'Nessuna commissione annuale standard',
      ],
      cons: [
        'Cashback modesto (massimo 1,5% in WXT)',
        'Commissioni mensili opzionali per alcuni vantaggi',
        'Token WXT meno conosciuto',
      ],
      verdict: 'La Wirex Card è la scelta principale per viaggiatori internazionali e utenti multi-valuta. Con oltre 150 valute supportate e tassi interbancari, è eccellente per chi viaggia spesso.',
      keyStats: {
        cashbackMax: 'Fino all\'1,5% in WXT',
        stakingRequis: 'Nessuno',
        fraisAnnuels: '€0 (piano standard)',
        disponibilite: 'Mondiale (180+ paesi)',
      },
      metaTitle: 'Wirex Card Recensione 2026 — Multi-Valuta, Cashback e Test Completo',
      metaDescription: 'La nostra recensione della Wirex Card 2026: oltre 150 valute, tassi interbancari, fino all\'1,5% di cashback.',
    },
  },

  // ──────────────────────────────────────────── LEDGER ──
  'ledger-card': {
    en: {
      badge: 'Best security',
      pros: [
        'Assets stored on Ledger hardware wallet (cold storage)',
        'Cashback in BTC',
        'No annual fees',
        'Apple Pay & Google Pay compatible',
        'Unique self-custody model',
      ],
      cons: [
        'Complex initial setup (requires a Ledger device)',
        'Maximum 2% cashback',
        'Requires Ledger Live app knowledge',
      ],
      verdict: 'The Ledger Card is the benchmark for crypto card security — the only card that allows partial self-custody via a hardware wallet. It targets advanced users who don\'t want to entrust their keys to a third party.',
      keyStats: {
        cashbackMax: 'Up to 2% in BTC/LDG',
        stakingRequis: 'None',
        fraisAnnuels: '€0',
        disponibilite: 'EU (Visa)',
      },
      metaTitle: 'Ledger Card Review 2026 — The Most Secure Crypto Card',
      metaDescription: 'Our Ledger Card review 2026: BTC cashback, hardware wallet security, self-custody model and user experience.',
    },
    de: {
      badge: 'Beste Sicherheit',
      pros: [
        'Vermögenswerte auf Ledger Hardware Wallet gespeichert (Cold Storage)',
        'Cashback in BTC',
        'Keine Jahresgebühren',
        'Apple Pay & Google Pay kompatibel',
        'Einzigartiges Self-Custody-Modell',
      ],
      cons: [
        'Komplexe Ersteinrichtung (erfordert Ledger-Gerät)',
        'Maximal 2% Cashback',
        'Erfordert Kenntnis der Ledger Live App',
      ],
      verdict: 'Die Ledger Karte ist der Maßstab für Krypto-Kartensicherheit — die einzige Karte, die partielles Self-Custody über ein Hardware Wallet ermöglicht. Richtet sich an fortgeschrittene Nutzer.',
      keyStats: {
        cashbackMax: 'Bis zu 2% in BTC/LDG',
        stakingRequis: 'Keines',
        fraisAnnuels: '€0',
        disponibilite: 'EU (Visa)',
      },
      metaTitle: 'Ledger Karte Test 2026 — Die sicherste Krypto-Karte',
      metaDescription: 'Unser Ledger Karten-Test 2026: BTC-Cashback, Hardware-Wallet-Sicherheit und Self-Custody-Modell.',
    },
    es: {
      badge: 'Mejor seguridad',
      pros: [
        'Activos almacenados en hardware wallet Ledger (cold storage)',
        'Cashback en BTC',
        'Sin comisiones anuales',
        'Compatible con Apple Pay y Google Pay',
        'Modelo único de autocustodia',
      ],
      cons: [
        'Configuración inicial compleja (requiere dispositivo Ledger)',
        'Cashback máximo del 2%',
        'Requiere conocimiento de la app Ledger Live',
      ],
      verdict: 'La Ledger Card es el referente en seguridad de tarjetas cripto — la única tarjeta que permite custodia parcial mediante hardware wallet. Dirigida a usuarios avanzados que no quieren confiar sus claves a terceros.',
      keyStats: {
        cashbackMax: 'Hasta 2% en BTC/LDG',
        stakingRequis: 'Ninguno',
        fraisAnnuels: '€0',
        disponibilite: 'UE (Visa)',
      },
      metaTitle: 'Ledger Card Opiniones 2026 — La Tarjeta Cripto Más Segura',
      metaDescription: 'Nuestra opinión sobre la Ledger Card 2026: cashback en BTC, seguridad hardware wallet y modelo de autocustodia.',
    },
    it: {
      badge: 'Migliore sicurezza',
      pros: [
        'Attivi archiviati su hardware wallet Ledger (cold storage)',
        'Cashback in BTC',
        'Nessuna commissione annuale',
        'Compatibile con Apple Pay e Google Pay',
        'Modello unico di auto-custodia',
      ],
      cons: [
        'Configurazione iniziale complessa (richiede dispositivo Ledger)',
        'Cashback massimo del 2%',
        'Richiede conoscenza dell\'app Ledger Live',
      ],
      verdict: 'La Ledger Card è il riferimento per la sicurezza delle carte crypto — l\'unica carta che consente la custodia parziale tramite hardware wallet. Si rivolge agli utenti avanzati che non vogliono affidare le proprie chiavi a terzi.',
      keyStats: {
        cashbackMax: 'Fino al 2% in BTC/LDG',
        stakingRequis: 'Nessuno',
        fraisAnnuels: '€0',
        disponibilite: 'UE (Visa)',
      },
      metaTitle: 'Ledger Card Recensione 2026 — La Carta Crypto Più Sicura',
      metaDescription: 'La nostra recensione della Ledger Card 2026: cashback in BTC, sicurezza hardware wallet e modello di auto-custodia.',
    },
  },
};

// Returns translated content, falls back to FR from cardReviews.ts fields
export function getReviewI18n(slug: string, lang: string): CardReviewI18nContent | null {
  return CARD_REVIEWS_I18N[slug]?.[lang] || null;
}
