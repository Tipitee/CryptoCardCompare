// Static metadata for brand pages — supplements data from Supabase.
// brandId must match the brand_id column in the cards table.

const YEAR = new Date().getFullYear();

export interface BrandMeta {
  brandId: string;
  displayName: string;
  website: string;
  /** Affiliate URL — overrides website link when set (e.g. Crypto.com tracked link) */
  affiliateLink?: string;
  twitter?: string;
  founded: number;
  hq: string;         // country of headquarters
  /** Regulatory bodies, e.g. "FCA (UK), MAS (SG)" */
  regulation?: string;
  // SEO per language
  seo: Record<string, {
    title: string;
    description: string;
    intro: string;
    outro: string;
    /** Overall rating out of 5 */
    rating?: number;
    /** Pros list (advantages) */
    pros?: string[];
    /** Cons list (disadvantages) */
    cons?: string[];
    /** Brand-level FAQ shown on the brand page */
    faq?: Array<{ q: string; a: string }>;
  }>;
}

export const BRAND_CONFIG: Record<string, BrandMeta> = {
  'crypto-com': {
    brandId: 'crypto-com',
    displayName: 'Crypto.com',
    website: 'https://crypto.com',
    affiliateLink: 'https://cryptocom.sjv.io/c/7394525/2051372/25666',
    twitter: 'https://twitter.com/cryptocom',
    founded: 2016,
    hq: 'Singapour',
    regulation: 'MAS (Singapour), FCA (UK)',
    seo: {
      fr: {
        title: `Cartes Crypto.com ${YEAR} — Comparatif Midnight Blue vs Obsidian | TopCryptoCards`,
        description: `Comparez tous les niveaux de la carte Crypto.com en ${YEAR} : Midnight Blue, Ruby Steel, Jade Green, Frosted Rose, Obsidian. Cashback CRO, avantages et conditions.`,
        intro: `Crypto.com propose 5 niveaux de carte Visa, du plan gratuit Midnight Blue à la carte Obsidian réservée aux détenteurs de 400 000 CRO (~200 000€). Le cashback varie de 0% (sans CRO) à 8% en CRO selon le tier. Ce comparatif vous aide à trouver le niveau le plus adapté à votre profil.`,
        outro: `Pour la majorité des utilisateurs, la carte Ruby Steel (400 CRO stakés, ~200€) offre le meilleur rapport qualité-cashback avec ses 2% + avantages Spotify. Au-delà, le staking requis croît exponentiellement pour des bénéfices additionnels limités.`,
        faq: [
          { q: 'Quel staking faut-il pour la carte Crypto.com Ruby Steel ?', a: 'La Ruby Steel nécessite un staking de 400 CRO (~200€) pendant 180 jours. C\'est le tier d\'entrée offrant 2% de cashback en CRO + avantages Spotify.' },
          { q: 'La carte Crypto.com Midnight Blue est-elle vraiment gratuite ?', a: 'Oui, la Midnight Blue ne nécessite aucun staking et aucun frais annuel. Le cashback est limité à 1% en CRO, sans avantages comme le Netflix ou le Spotify.' },
          { q: 'Le cashback Crypto.com est-il versé en CRO ou en euros ?', a: 'Le cashback est exclusivement versé en CRO, le token natif de Crypto.com. Sa valeur varie selon le cours du CRO — ce qui représente un risque supplémentaire.' },
          { q: 'Peut-on utiliser la carte Crypto.com en France et en Europe en 2026 ?', a: 'Oui, toutes les cartes Crypto.com Visa sont disponibles en France, Allemagne, Espagne, Italie et dans toute l\'UE. La carte fonctionne partout où Visa est accepté.' },
          { q: 'Quelle est la différence entre les 5 tiers Crypto.com ?', a: 'Midnight Blue (gratuit, 1% CRO), Ruby Steel (400 CRO, 2% + Spotify), Jade/Indigo (4 000 CRO, 3% + Netflix), Frosted Rose (40 000 CRO, 5% + Spotify+Netflix+Amazon), Obsidian (400 000 CRO, 8% + avantages premium). Le staking est bloqué 180 jours.' },
        ],
      },
      de: {
        title: `Crypto.com Karten ${YEAR} — Vergleich Midnight Blue vs Obsidian | TopCryptoCards`,
        description: `Vergleichen Sie alle Crypto.com Karten-Tiers ${YEAR}: Midnight Blue, Ruby Steel, Jade Green, Frosted Rose, Obsidian. CRO Cashback, Vorteile und Bedingungen.`,
        intro: `Crypto.com bietet 5 Visa-Karten-Stufen an, von der kostenlosen Midnight Blue bis zur Obsidian-Karte, die 400.000 CRO Staking erfordert. Das Cashback reicht von 0% bis 8% in CRO, je nach Tier.`,
        outro: `Für die meisten Nutzer bietet die Ruby Steel Karte (400 CRO gestaked, ~200€) das beste Preis-Leistungs-Verhältnis mit 2% Cashback und Spotify-Vorteil. Darüber hinaus wächst das erforderliche Staking exponentiell.`,
        faq: [
          { q: 'Wie viel Staking braucht man für die Crypto.com Ruby Steel?', a: 'Die Ruby Steel erfordert 400 CRO (~200€) Staking für 180 Tage. Sie bietet 2% Cashback in CRO und Spotify-Vorteil.' },
          { q: 'Ist die Crypto.com Midnight Blue wirklich kostenlos?', a: 'Ja, die Midnight Blue erfordert kein Staking und hat keine Jahresgebühr. Das Cashback beträgt 1% in CRO.' },
          { q: 'Ist die Crypto.com Karte in Deutschland verfügbar?', a: 'Ja, alle Crypto.com Visa-Karten sind in Deutschland und der gesamten EU verfügbar.' },
        ],
      },
      es: {
        title: `Tarjetas Crypto.com ${YEAR} — Comparativa Midnight Blue vs Obsidian | TopCryptoCards`,
        description: `Compara todos los niveles de la tarjeta Crypto.com en ${YEAR}: Midnight Blue, Ruby Steel, Jade Green, Frosted Rose, Obsidian. Cashback CRO, ventajas y condiciones.`,
        intro: `Crypto.com ofrece 5 niveles de tarjeta Visa, desde el plan gratuito Midnight Blue hasta la tarjeta Obsidian que requiere 400.000 CRO en staking. El cashback varía del 0% al 8% en CRO según el tier.`,
        outro: `Para la mayoría de usuarios, la tarjeta Ruby Steel (400 CRO, ~200€) ofrece la mejor relación calidad-precio con 2% de cashback y ventaja de Spotify.`,
        faq: [
          { q: '¿Cuánto staking necesita la tarjeta Crypto.com Ruby Steel?', a: 'La Ruby Steel requiere 400 CRO (~200€) en staking durante 180 días y ofrece 2% de cashback en CRO.' },
          { q: '¿La tarjeta Crypto.com Midnight Blue es realmente gratuita?', a: 'Sí, la Midnight Blue no requiere staking ni cuota anual. El cashback es del 1% en CRO.' },
          { q: '¿La tarjeta Crypto.com está disponible en España?', a: 'Sí, todas las tarjetas Crypto.com Visa están disponibles en España y en toda la UE.' },
        ],
      },
      it: {
        title: `Carte Crypto.com ${YEAR} — Confronto Midnight Blue vs Obsidian | TopCryptoCards`,
        description: `Confronta tutti i livelli della carta Crypto.com nel ${YEAR}: Midnight Blue, Ruby Steel, Jade Green, Frosted Rose, Obsidian. Cashback CRO, vantaggi e condizioni.`,
        intro: `Crypto.com offre 5 livelli di carta Visa, dal piano gratuito Midnight Blue alla carta Obsidian che richiede 400.000 CRO in staking. Il cashback varia dallo 0% all'8% in CRO a seconda del tier.`,
        outro: `Per la maggior parte degli utenti, la carta Ruby Steel (400 CRO, ~200€) offre il miglior rapporto qualità-prezzo con il 2% di cashback e il vantaggio Spotify.`,
        faq: [
          { q: 'Quanto staking serve per la carta Crypto.com Ruby Steel?', a: 'La Ruby Steel richiede 400 CRO (~200€) in staking per 180 giorni e offre il 2% di cashback in CRO.' },
          { q: 'La carta Crypto.com Midnight Blue è davvero gratuita?', a: 'Sì, la Midnight Blue non richiede staking né canone annuale. Il cashback è dell\'1% in CRO.' },
          { q: 'La carta Crypto.com è disponibile in Italia?', a: 'Sì, tutte le carte Crypto.com Visa sono disponibili in Italia e in tutta l\'UE.' },
        ],
      },
      en: {
        title: `Crypto.com Cards ${YEAR} — Compare Midnight Blue vs Obsidian | TopCryptoCards`,
        description: `Compare all Crypto.com card tiers in ${YEAR}: Midnight Blue, Ruby Steel, Jade Green, Frosted Rose, Obsidian. CRO cashback, perks and conditions.`,
        intro: `Crypto.com offers 5 Visa card tiers, from the free Midnight Blue to the Obsidian card requiring 400,000 CRO staking (~$200K). Cashback ranges from 0% (no staking) to 8% in CRO. This comparison helps you find the right tier for your profile.`,
        outro: `For most users, the Ruby Steel card (400 CRO staked, ~$200) offers the best value with 2% cashback plus Spotify perks. Beyond that, staking requirements grow exponentially for diminishing returns.`,
        faq: [
          { q: 'How much staking is required for the Crypto.com Ruby Steel card?', a: 'The Ruby Steel requires staking 400 CRO (~$200) for 180 days. It offers 2% cashback in CRO plus a Spotify subscription reimbursement.' },
          { q: 'Is the Crypto.com Midnight Blue card truly free?', a: 'Yes, the Midnight Blue requires no staking and has no annual fee. Cashback is 1% in CRO with no additional perks.' },
          { q: 'Is Crypto.com cashback paid in CRO or euros?', a: 'Cashback is exclusively paid in CRO, Crypto.com\'s native token. Its value fluctuates with the CRO market price, adding currency risk.' },
          { q: 'Is the Crypto.com card available in Europe in 2026?', a: 'Yes, all Crypto.com Visa cards are available across France, Germany, Spain, Italy and the EU. The card works anywhere Visa is accepted.' },
          { q: 'What is the difference between the 5 Crypto.com card tiers?', a: 'Midnight Blue (free, 1% CRO), Ruby Steel (400 CRO, 2% + Spotify), Jade/Indigo (4,000 CRO, 3% + Netflix), Frosted Rose (40,000 CRO, 5% + Spotify+Netflix+Amazon), Obsidian (400,000 CRO, 8% + premium perks). Staking is locked for 180 days.' },
        ],
      },
    },
  },

  'wirex': {
    brandId: 'wirex',
    displayName: 'Wirex',
    website: 'https://wirexapp.com',
    founded: 2014,
    hq: 'Royaume-Uni',
    seo: {
      fr: {
        title: `Cartes Wirex ${YEAR} — Standard, Premium et Elite comparées | TopCryptoCards`,
        description: `Comparez les 3 niveaux de carte Wirex en ${YEAR} : Standard, Premium et Elite. Cashback WXT, crypto rewards et avantages par tier.`,
        intro: `Wirex, pionnier des cartes crypto depuis 2014, propose plusieurs niveaux d'abonnement donnant accès à des taux de cashback croissants en WXT, son token natif. Ce comparatif détaille les différences entre chaque tier.`,
        outro: `Le tier Elite de Wirex offre jusqu'à 8% de cashback mais nécessite un abonnement et un staking WXT significatif. Pour débuter, le plan Standard sans engagement reste une excellente porte d'entrée.`,
      },
      de: {
        title: `Wirex Karten ${YEAR} — Standard, Premium und Elite im Vergleich | TopCryptoCards`,
        description: `Vergleichen Sie die 3 Wirex-Karten-Tiers ${YEAR}: Standard, Premium und Elite. WXT Cashback und Vorteile.`,
        intro: `Wirex, Pionier der Krypto-Karten seit 2014, bietet mehrere Abonnementstufen an, die zunehmende Cashback-Sätze in WXT, seinem nativen Token, ermöglichen.`,
        outro: `Die Elite-Stufe von Wirex bietet bis zu 8% Cashback, erfordert jedoch ein erhebliches WXT-Staking. Für den Einstieg ist der Standard-Plan ohne Verpflichtung ein guter Ausgangspunkt.`,
      },
      es: {
        title: `Tarjetas Wirex ${YEAR} — Standard, Premium y Elite comparadas | TopCryptoCards`,
        description: `Compara los 3 niveles de tarjeta Wirex en ${YEAR}: Standard, Premium y Elite. Cashback WXT y ventajas por tier.`,
        intro: `Wirex, pionero de las tarjetas crypto desde 2014, ofrece varios niveles de suscripción con tasas de cashback crecientes en WXT, su token nativo.`,
        outro: `El nivel Elite de Wirex ofrece hasta 8% de cashback, pero requiere un staking WXT significativo. Para empezar, el plan Standard sin compromiso es un excelente punto de entrada.`,
      },
      it: {
        title: `Carte Wirex ${YEAR} — Standard, Premium ed Elite a confronto | TopCryptoCards`,
        description: `Confronta i 3 livelli di carta Wirex nel ${YEAR}: Standard, Premium ed Elite. Cashback WXT e vantaggi per tier.`,
        intro: `Wirex, pioniere delle carte crypto dal 2014, offre diversi livelli di abbonamento con tassi di cashback crescenti in WXT, il suo token nativo.`,
        outro: `Il livello Elite di Wirex offre fino all'8% di cashback, ma richiede un significativo staking WXT. Per iniziare, il piano Standard senza impegno è un ottimo punto di partenza.`,
      },
      en: {
        title: `Wirex Cards ${YEAR} — Standard, Premium and Elite compared | TopCryptoCards`,
        description: `Compare Wirex card tiers in ${YEAR}: Standard, Premium, and Elite. WXT cashback rates and perks by tier.`,
        intro: `Wirex, a crypto card pioneer since 2014, offers multiple subscription tiers with increasing WXT cashback rates. This comparison breaks down the key differences between each level.`,
        outro: `Wirex Elite offers up to 8% cashback but requires significant WXT staking. For beginners, the Standard plan with no commitment is an excellent entry point.`,
      },
    },
  },

  'nexo': {
    brandId: 'nexo',
    displayName: 'Nexo',
    website: 'https://nexo.io',
    founded: 2018,
    hq: 'Suisse',
    regulation: 'FINMA (Suisse)',
    seo: {
      fr: {
        title: `Carte Nexo ${YEAR} — Cashback BTC, conditions et avis | TopCryptoCards`,
        description: `Tout sur la carte Nexo en ${YEAR} : cashback en BTC ou NEXO, tiers de loyauté (Base, Silver, Gold, Platinum), frais et restrictions UK.`,
        intro: `La carte Nexo se distingue par son cashback en BTC (jusqu'à 2%) sans staking de token tiers — à condition de détenir un portefeuille Nexo d'au moins 5 000$. Les 4 tiers de loyauté (Base, Silver, Gold, Platinum) sont déterminés par le ratio crypto/NEXO dans votre portefeuille.`,
        outro: `Attention : le cashback Nexo est désactivé pour les utilisateurs UK (restriction réglementaire). Pour les utilisateurs EU, un portefeuille minimum de 5 000$ est requis. Au-delà de ces conditions, la carte offre une des propositions cashback BTC les plus directes du marché.`,
      },
      de: {
        title: `Nexo Karte ${YEAR} — BTC Cashback, Bedingungen und Erfahrungen | TopCryptoCards`,
        description: `Alles über die Nexo Karte ${YEAR}: BTC oder NEXO Cashback, Loyalitäts-Tiers, Gebühren und UK-Einschränkungen.`,
        intro: `Die Nexo Karte besticht durch BTC Cashback (bis zu 2%) ohne das Staking von Dritttoken — vorausgesetzt, Sie haben ein Nexo-Portfolio von mindestens 5.000 $. Die 4 Loyalitätsstufen werden durch das Krypto/NEXO-Verhältnis in Ihrem Portfolio bestimmt.`,
        outro: `Achtung: Nexo-Cashback ist für UK-Nutzer deaktiviert (regulatorische Einschränkung). Für EU-Nutzer ist ein Mindestportfolio von 5.000 $ erforderlich.`,
      },
      es: {
        title: `Tarjeta Nexo ${YEAR} — Cashback BTC, condiciones y opiniones | TopCryptoCards`,
        description: `Todo sobre la tarjeta Nexo en ${YEAR}: cashback en BTC o NEXO, niveles de lealtad, comisiones y restricciones UK.`,
        intro: `La tarjeta Nexo destaca por su cashback en BTC (hasta 2%) sin staking de tokens de terceros — siempre que mantengas un portfolio Nexo de al menos 5.000$. Los 4 niveles de lealtad se determinan por el ratio crypto/NEXO en tu cartera.`,
        outro: `Atención: el cashback de Nexo está desactivado para usuarios del UK (restricción regulatoria). Para usuarios de la UE, se requiere un portfolio mínimo de 5.000$.`,
      },
      it: {
        title: `Carta Nexo ${YEAR} — Cashback BTC, condizioni e recensioni | TopCryptoCards`,
        description: `Tutto sulla carta Nexo nel ${YEAR}: cashback in BTC o NEXO, livelli fedeltà, commissioni e restrizioni UK.`,
        intro: `La carta Nexo si distingue per il suo cashback in BTC (fino al 2%) senza staking di token di terze parti — a condizione di avere un portfolio Nexo di almeno 5.000$. I 4 livelli di fedeltà sono determinati dal rapporto crypto/NEXO nel tuo portafoglio.`,
        outro: `Attenzione: il cashback Nexo è disabilitato per gli utenti UK (restrizione normativa). Per gli utenti UE, è richiesto un portfolio minimo di 5.000$.`,
      },
      en: {
        title: `Nexo Card ${YEAR} — BTC Cashback, Conditions & Review | TopCryptoCards`,
        description: `Everything about the Nexo card in ${YEAR}: BTC or NEXO cashback, loyalty tiers (Base, Silver, Gold, Platinum), fees and UK restrictions.`,
        intro: `The Nexo card stands out for its BTC cashback (up to 2%) without requiring third-party token staking — provided you hold a Nexo portfolio of at least $5,000. The 4 loyalty tiers (Base, Silver, Gold, Platinum) are determined by the crypto/NEXO ratio in your portfolio.`,
        outro: `Note: Nexo cashback is disabled for UK users (regulatory restriction). For EU users, a minimum $5,000 portfolio is required. Beyond these conditions, the card offers one of the most direct BTC cashback propositions on the market.`,
        faq: [
          { q: 'How does the Nexo loyalty tier system work?', a: 'Nexo has 4 tiers: Base, Silver, Gold, Platinum. Your tier is determined by the ratio of NEXO tokens in your portfolio vs total assets. More NEXO = higher tier = higher BTC cashback (up to 2%).' },
          { q: 'Is the Nexo card available in the UK?', a: 'The Nexo card is available in the UK but the cashback feature is disabled for UK residents due to regulatory restrictions.' },
          { q: 'What is the minimum portfolio required for Nexo card?', a: 'A minimum portfolio of $5,000 in your Nexo account is required to use the card\'s cashback features.' },
          { q: 'Does the Nexo card require staking?', a: 'No staking is strictly required, but holding NEXO tokens in your portfolio improves your loyalty tier and cashback rate (up to 2% BTC vs 0.5% at Base tier).' },
        ],
      },
    },
  },

  'bybit': {
    brandId: 'bybit',
    displayName: 'Bybit',
    website: 'https://bybit.com',
    founded: 2018,
    hq: 'Dubaï',
    regulation: 'MiCA (EEA), VARA (Dubaï)',
    seo: {
      fr: {
        title: `Carte Bybit ${YEAR} — Cashback crypto, conditions et avis | TopCryptoCards`,
        description: `Tout sur la carte Bybit Card en ${YEAR} : cashback en BIT, frais, disponibilité en Europe et conditions d'utilisation.`,
        intro: `La Bybit Card est une carte Visa débitée directement depuis votre compte Bybit. Cashback en BIT selon votre volume de trading, disponible dans toute l'EEA depuis l'obtention de sa licence MiCA.`,
        outro: `La Bybit Card convient particulièrement aux traders actifs sur Bybit qui souhaitent utiliser leurs gains directement. Le cashback est lié au volume de trading mensuel.`,
      },
      de: { title: `Bybit Karte ${YEAR} — Krypto-Cashback und Bedingungen | TopCryptoCards`, description: `Alles über die Bybit Card ${YEAR}: BIT Cashback, Gebühren, Verfügbarkeit in Europa.`, intro: `Die Bybit Card ist eine Visa-Karte, die direkt von Ihrem Bybit-Konto belastet wird. Cashback in BIT abhängig von Ihrem Trading-Volumen.`, outro: `Die Bybit Card eignet sich besonders für aktive Bybit-Trader, die ihre Gewinne direkt nutzen möchten.` },
      es: { title: `Tarjeta Bybit ${YEAR} — Cashback crypto y condiciones | TopCryptoCards`, description: `Todo sobre la Bybit Card en ${YEAR}: cashback en BIT, comisiones, disponibilidad en Europa.`, intro: `La Bybit Card es una tarjeta Visa debitada directamente desde tu cuenta Bybit. Cashback en BIT según tu volumen de trading.`, outro: `La Bybit Card es especialmente adecuada para traders activos en Bybit que quieren usar sus ganancias directamente.` },
      it: { title: `Carta Bybit ${YEAR} — Cashback crypto e condizioni | TopCryptoCards`, description: `Tutto sulla Bybit Card nel ${YEAR}: cashback in BIT, commissioni, disponibilità in Europa.`, intro: `La Bybit Card è una carta Visa addebitata direttamente dal tuo conto Bybit. Cashback in BIT in base al tuo volume di trading.`, outro: `La Bybit Card è particolarmente adatta ai trader attivi su Bybit che vogliono usare i propri guadagni direttamente.` },
      en: { title: `Bybit Card ${YEAR} — Crypto Cashback, Conditions & Review | TopCryptoCards`, description: `Everything about the Bybit Card in ${YEAR}: BIT cashback, fees, European availability.`, intro: `The Bybit Card is a Visa debit card charged directly from your Bybit account. BIT cashback based on monthly trading volume, available across the EEA under MiCA licensing.`, outro: `The Bybit Card is best suited for active Bybit traders who want to spend their gains directly. Cashback is tied to monthly trading volume.` },
    },
  },

  'binance': {
    brandId: 'binance',
    displayName: 'Binance',
    website: 'https://binance.com',
    founded: 2017,
    hq: 'Non communiqué',
    regulation: 'MiCA (EEA), FCA (UK)',
    seo: {
      fr: { title: `Carte Binance ${YEAR} — Cashback BNB, conditions et avis | TopCryptoCards`, description: `Tout sur la Binance Card en ${YEAR} : cashback jusqu'à 8% en BNB, frais, disponibilité en Europe (hors UK).`, intro: `La Binance Card est une carte Visa débitée depuis votre portefeuille Binance. Cashback en BNB jusqu'à 8% selon votre solde BNB. Non disponible au Royaume-Uni.`, outro: `La Binance Card est idéale pour les utilisateurs Binance actifs. Le cashback maximal de 8% nécessite un solde BNB conséquent (~6 000€+).` },
      de: { title: `Binance Karte ${YEAR} — BNB Cashback und Bedingungen | TopCryptoCards`, description: `Alles über die Binance Card ${YEAR}: bis zu 8% BNB Cashback, Gebühren, Verfügbarkeit in Europa (ohne UK).`, intro: `Die Binance Card ist eine Visa-Karte, die von Ihrer Binance-Wallet belastet wird. Cashback in BNB bis zu 8% abhängig von Ihrem BNB-Guthaben. Im UK nicht verfügbar.`, outro: `Die Binance Card ist ideal für aktive Binance-Nutzer. Das maximale Cashback von 8% erfordert ein erhebliches BNB-Guthaben.` },
      es: { title: `Tarjeta Binance ${YEAR} — Cashback BNB y condiciones | TopCryptoCards`, description: `Todo sobre la Binance Card en ${YEAR}: cashback hasta 8% en BNB, comisiones, disponibilidad en Europa (sin UK).`, intro: `La Binance Card es una tarjeta Visa debitada desde tu monedero Binance. Cashback en BNB hasta 8% según tu saldo BNB. No disponible en el Reino Unido.`, outro: `La Binance Card es ideal para usuarios activos de Binance. El cashback máximo del 8% requiere un saldo BNB considerable.` },
      it: { title: `Carta Binance ${YEAR} — Cashback BNB e condizioni | TopCryptoCards`, description: `Tutto sulla Binance Card nel ${YEAR}: cashback fino all'8% in BNB, commissioni, disponibilità in Europa (escluso UK).`, intro: `La Binance Card è una carta Visa addebitata dal tuo portafoglio Binance. Cashback in BNB fino all'8% in base al tuo saldo BNB. Non disponibile nel Regno Unito.`, outro: `La Binance Card è ideale per gli utenti attivi di Binance. Il cashback massimo dell'8% richiede un saldo BNB considerevole.` },
      en: { title: `Binance Card ${YEAR} — BNB Cashback, Conditions & Review | TopCryptoCards`, description: `Everything about the Binance Card in ${YEAR}: up to 8% BNB cashback, fees, Europe availability (no UK).`, intro: `The Binance Card is a Visa debit card charged from your Binance wallet. Up to 8% cashback in BNB based on your BNB balance. Not available in the UK.`, outro: `The Binance Card is best for active Binance users. The maximum 8% cashback requires a significant BNB balance (~$6,000+).` },
    },
  },

  'okx': {
    brandId: 'okx',
    displayName: 'OKX',
    website: 'https://okx.com',
    founded: 2017,
    hq: 'Seychelles',
    seo: {
      fr: { title: `Carte OKX ${YEAR} — Cashback USDG (VIP uniquement) | TopCryptoCards`, description: `Carte OKX disponible en EEA depuis janvier 2026. Cashback 2-5% en USDG réservé aux utilisateurs VIP OKX (100K$+ d'actifs).`, intro: `La carte OKX, lancée dans l'EEA en janvier 2026, propose un cashback en USDG (stablecoin) allant de 2% à 5%. Attention : ce cashback est réservé aux utilisateurs VIP OKX, ce qui requiert un seuil minimum de 100 000$ d'actifs sur la plateforme ou 5M$ de volume mensuel.`, outro: `Pour un utilisateur standard, la carte OKX n'offre pas de cashback. Elle reste intéressante pour ses fonctionnalités de paiement et l'accès aux crypto directement depuis OKX, mais les utilisateurs non-VIP n'en tireront pas de rendement supplémentaire.` },
      de: { title: `OKX Karte ${YEAR} — USDG Cashback (Nur VIP) | TopCryptoCards`, description: `OKX Karte in EEA seit Januar 2026. 2-5% USDG Cashback nur für OKX VIP Nutzer (100K$+ Vermögen).`, intro: `Die OKX-Karte, seit Januar 2026 in der EEA verfügbar, bietet USDG-Cashback von 2-5%. Achtung: Dieses Cashback ist auf OKX VIP-Nutzer beschränkt, was ein Mindestvermögen von 100.000$ oder 5M$ Monatsvolumen erfordert.`, outro: `Für Standard-Nutzer bietet die OKX-Karte kein Cashback. Sie ist trotzdem für Zahlungsfunktionen und direkten Krypto-Zugriff interessant.` },
      es: { title: `Tarjeta OKX ${YEAR} — Cashback USDG (Solo VIP) | TopCryptoCards`, description: `Tarjeta OKX disponible en EEA desde enero de 2026. Cashback 2-5% en USDG solo para usuarios VIP OKX (100K$+ en activos).`, intro: `La tarjeta OKX, lanzada en la EEA en enero de 2026, ofrece cashback en USDG del 2-5%. Atención: este cashback está reservado a usuarios VIP de OKX, lo que requiere un mínimo de 100.000$ en activos o 5M$ de volumen mensual.`, outro: `Para un usuario estándar, la tarjeta OKX no ofrece cashback. Sigue siendo interesante por sus funciones de pago y acceso a cripto directamente desde OKX.` },
      it: { title: `Carta OKX ${YEAR} — Cashback USDG (Solo VIP) | TopCryptoCards`, description: `Carta OKX disponibile in EEA da gennaio 2026. Cashback 2-5% in USDG riservato agli utenti VIP OKX (100K$+ di asset).`, intro: `La carta OKX, lanciata nell'EEA a gennaio 2026, offre cashback in USDG dal 2% al 5%. Attenzione: questo cashback è riservato agli utenti VIP OKX, il che richiede un minimo di 100.000$ di asset o 5M$ di volume mensile.`, outro: `Per un utente standard, la carta OKX non offre cashback. Rimane interessante per le funzionalità di pagamento e l'accesso alle cripto direttamente da OKX.` },
      en: { title: `OKX Card ${YEAR} — USDG Cashback (VIP Only) | TopCryptoCards`, description: `OKX Card available in EEA since January 2026. 2-5% USDG cashback for OKX VIP users only ($100K+ in assets).`, intro: `The OKX Card, launched in the EEA in January 2026, offers USDG cashback from 2% to 5%. Important: this cashback is reserved for OKX VIP users, requiring at least $100K in assets or $5M monthly volume on the platform.`, outro: `For standard users, the OKX Card offers no cashback. It remains useful for payment features and direct crypto access from OKX, but non-VIP users won't earn any rewards.` },
    },
  },

  'coinbase': {
    brandId: 'coinbase',
    displayName: 'Coinbase',
    website: 'https://coinbase.com',
    founded: 2012,
    hq: 'États-Unis',
    regulation: 'FCA (UK), SEC/FinCEN (US)',
    seo: {
      fr: { title: `Carte Coinbase ${YEAR} — Disponible en Europe (0% cashback) | TopCryptoCards`, description: `Carte Coinbase Card disponible en Europe en ${YEAR}. Attention : le programme de récompenses est US uniquement — 0% cashback pour les utilisateurs EU/UK.`, intro: `La Coinbase Card est disponible en Europe, mais son programme de récompenses crypto est réservé aux utilisateurs américains. En EU/UK, la carte fonctionne comme une simple carte Visa débit crypto sans cashback.`, outro: `Si vous recherchez du cashback en Europe, d'autres cartes comme Crypto.com ou Wirex sont plus adaptées. La Coinbase Card reste utile pour accéder facilement à vos fonds Coinbase depuis la carte.` },
      de: { title: `Coinbase Karte ${YEAR} — In Europa verfügbar (0% Cashback) | TopCryptoCards`, description: `Coinbase Card in Europa verfügbar ${YEAR}. Achtung: Das Prämienprogramm gilt nur für US-Nutzer — 0% Cashback für EU/UK-Nutzer.`, intro: `Die Coinbase Card ist in Europa verfügbar, aber ihr Krypto-Prämienprogramm ist auf US-Nutzer beschränkt. In der EU/UK funktioniert die Karte als einfache Visa-Debitkarte ohne Cashback.`, outro: `Wenn Sie in Europa Cashback suchen, sind andere Karten wie Crypto.com oder Wirex besser geeignet.` },
      es: { title: `Tarjeta Coinbase ${YEAR} — Disponible en Europa (0% cashback) | TopCryptoCards`, description: `Coinbase Card disponible en Europa en ${YEAR}. Atención: el programa de recompensas es solo para EE.UU. — 0% cashback para usuarios EU/UK.`, intro: `La Coinbase Card está disponible en Europa, pero su programa de recompensas crypto está reservado a usuarios estadounidenses. En UE/UK, la tarjeta funciona como una simple tarjeta Visa débito sin cashback.`, outro: `Si buscas cashback en Europa, otras tarjetas como Crypto.com o Wirex son más adecuadas.` },
      it: { title: `Carta Coinbase ${YEAR} — Disponibile in Europa (0% cashback) | TopCryptoCards`, description: `Coinbase Card disponibile in Europa nel ${YEAR}. Attenzione: il programma premi è solo per gli USA — 0% cashback per utenti EU/UK.`, intro: `La Coinbase Card è disponibile in Europa, ma il suo programma premi crypto è riservato agli utenti americani. In UE/UK, la carta funziona come una semplice carta Visa di debito senza cashback.`, outro: `Se cerchi cashback in Europa, altre carte come Crypto.com o Wirex sono più adatte.` },
      en: { title: `Coinbase Card ${YEAR} — Available in Europe (0% cashback) | TopCryptoCards`, description: `Coinbase Card available in Europe in ${YEAR}. Note: the rewards program is US-only — EU/UK users earn 0% cashback.`, intro: `The Coinbase Card is available in Europe, but its crypto rewards program is US-only. In the EU/UK, the card works as a standard Visa debit card with no cashback.`, outro: `If you're looking for cashback in Europe, other cards like Crypto.com or Wirex are better suited. The Coinbase Card remains useful for easy access to your Coinbase funds.` },
    },
  },

  'bitpanda': {
    brandId: 'bitpanda',
    displayName: 'Bitpanda',
    website: 'https://bitpanda.com',
    founded: 2014,
    hq: 'Autriche',
    regulation: 'FMA (Autriche), BaFin (Allemagne)',
    seo: {
      fr: { title: `Carte Bitpanda ${YEAR} — Cashback BEST, conditions et avis | TopCryptoCards`, description: `Tout sur la Bitpanda Card en ${YEAR} : cashback en BEST, disponible en Europe (hors UK).`, intro: `La Bitpanda Card, émise par la néobanque autrichienne Bitpanda, offre un cashback en BEST (son token natif) sur chaque achat. Disponible dans l'UE uniquement, pas au UK.`, outro: `Bitpanda est l'une des plateformes les plus régulées d'Europe. Sa carte est idéale pour les utilisateurs de l'écosystème Bitpanda souhaitant un cashback en BEST.` },
      de: { title: `Bitpanda Karte ${YEAR} — BEST Cashback und Bedingungen | TopCryptoCards`, description: `Alles über die Bitpanda Card ${YEAR}: BEST Cashback, nur in der EU verfügbar, nicht im UK.`, intro: `Die Bitpanda Card, herausgegeben vom österreichischen Neobroker Bitpanda, bietet BEST-Cashback bei jedem Kauf. Nur in der EU verfügbar.`, outro: `Bitpanda ist eine der am stärksten regulierten Plattformen in Europa. Ideal für Nutzer des Bitpanda-Ökosystems.` },
      es: { title: `Tarjeta Bitpanda ${YEAR} — Cashback BEST y condiciones | TopCryptoCards`, description: `Todo sobre la Bitpanda Card en ${YEAR}: cashback en BEST, disponible en Europa (sin UK).`, intro: `La Bitpanda Card, emitida por el neobróker austriaco Bitpanda, ofrece cashback en BEST en cada compra. Solo disponible en la UE.`, outro: `Bitpanda es una de las plataformas más reguladas de Europa. Ideal para usuarios del ecosistema Bitpanda.` },
      it: { title: `Carta Bitpanda ${YEAR} — Cashback BEST e condizioni | TopCryptoCards`, description: `Tutto sulla Bitpanda Card nel ${YEAR}: cashback in BEST, disponibile in Europa (escluso UK).`, intro: `La Bitpanda Card, emessa dal neobroker austriaco Bitpanda, offre cashback in BEST su ogni acquisto. Disponibile solo nell'UE.`, outro: `Bitpanda è una delle piattaforme più regolamentate d'Europa. Ideale per gli utenti dell'ecosistema Bitpanda.` },
      en: { title: `Bitpanda Card ${YEAR} — BEST Cashback, Conditions & Review | TopCryptoCards`, description: `Everything about the Bitpanda Card in ${YEAR}: BEST cashback, EU-only (not UK).`, intro: `The Bitpanda Card, issued by Austrian neobroker Bitpanda, earns BEST cashback on every purchase. Available in the EU only — not in the UK.`, outro: `Bitpanda is one of Europe's most regulated platforms. The card is ideal for Bitpanda ecosystem users who want BEST cashback.` },
    },
  },

  'kraken': {
    brandId: 'kraken',
    displayName: 'Krak (Kraken)',
    website: 'https://krak.com',
    founded: 2011,
    hq: 'États-Unis',
    seo: {
      fr: { title: `Carte Krak (Kraken) ${YEAR} — 1% cashback cash | TopCryptoCards`, description: `Tout sur la Krak Card de Kraken en ${YEAR} : 1% de cashback en cash, disponible en EU et UK.`, intro: `Krak est la carte Visa de Kraken, l'une des plus anciennes exchanges crypto fondées en 2011. Elle offre 1% de cashback en cash (EUR ou GBP), sans token propriétaire.`, outro: `La Krak Card est idéale pour ceux qui préfèrent un cashback simple en cash plutôt qu'en token propriétaire. Disponible en UE et UK.` },
      de: { title: `Krak Karte (Kraken) ${YEAR} — 1% Cash Cashback | TopCryptoCards`, description: `Alles über die Krak Card von Kraken ${YEAR}: 1% Cash Cashback, verfügbar in EU und UK.`, intro: `Krak ist die Visa-Karte von Kraken, einer der ältesten Krypto-Börsen, gegründet 2011. Sie bietet 1% Cashback in Cash (EUR oder GBP) ohne proprietäres Token.`, outro: `Die Krak Card ist ideal für diejenigen, die ein einfaches Cash-Cashback statt eines proprietären Tokens bevorzugen.` },
      es: { title: `Tarjeta Krak (Kraken) ${YEAR} — 1% cashback en efectivo | TopCryptoCards`, description: `Todo sobre la Krak Card de Kraken en ${YEAR}: 1% cashback en efectivo, disponible en EU y UK.`, intro: `Krak es la tarjeta Visa de Kraken, uno de los exchanges crypto más antiguos fundado en 2011. Ofrece 1% de cashback en efectivo (EUR o GBP) sin token propietario.`, outro: `La Krak Card es ideal para quienes prefieren un cashback simple en efectivo en lugar de un token propio.` },
      it: { title: `Carta Krak (Kraken) ${YEAR} — 1% cashback in contanti | TopCryptoCards`, description: `Tutto sulla Krak Card di Kraken nel ${YEAR}: 1% cashback in contanti, disponibile in EU e UK.`, intro: `Krak è la carta Visa di Kraken, uno degli exchange crypto più antichi, fondato nel 2011. Offre l'1% di cashback in contanti (EUR o GBP) senza token proprietario.`, outro: `La Krak Card è ideale per chi preferisce un cashback semplice in contanti piuttosto che un token proprietario.` },
      en: { title: `Krak Card (Kraken) ${YEAR} — 1% Cash Cashback | TopCryptoCards`, description: `Everything about the Krak Card by Kraken in ${YEAR}: 1% cash cashback, available in EU and UK.`, intro: `Krak is Kraken's Visa card, from one of the oldest crypto exchanges founded in 2011. It offers 1% cashback in cash (EUR or GBP), with no proprietary token required.`, outro: `The Krak Card is ideal for those who prefer simple cash cashback over proprietary tokens. Available across the EU and UK.` },
    },
  },

  'deblock': {
    brandId: 'deblock',
    displayName: 'Deblock',
    website: 'https://deblock.com',
    founded: 2022,
    hq: 'France',
    seo: {
      fr: { title: `Carte Deblock ${YEAR} — Néobanque française IBAN FR + self-custody | TopCryptoCards`, description: `Deblock Card en ${YEAR} : IBAN français, self-custody, licence ACPR/AMF, cashback 1% sur Premium. La première vraie néobanque crypto française.`, intro: `Deblock est la première néobanque crypto française agréée ACPR avec licence bancaire MiCA. Elle propose un IBAN FR, une carte Visa physique et le self-custody — vos clés, vos cryptos. Le cashback de 1% est disponible sur le plan Premium.`, outro: `Pour les résidents français cherchant une solution crypto avec IBAN français et régulation locale AMF/ACPR, Deblock est un choix naturel. Le plan Standard est gratuit, Premium à 9,90€/mois.` },
      de: { title: `Deblock Karte ${YEAR} — Französische Neobank IBAN FR + Self-Custody | TopCryptoCards`, description: `Deblock Card ${YEAR}: Französische IBAN, Self-Custody, ACPR/AMF-Lizenz, 1% Cashback auf Premium.`, intro: `Deblock ist die erste französische Krypto-Neobank mit ACPR-Banklizenz und MiCA-Compliance. Sie bietet eine französische IBAN, eine physische Visa-Karte und Self-Custody.`, outro: `Für Nutzer, die eine Krypto-Lösung mit französischer IBAN und lokaler AMF/ACPR-Regulierung suchen, ist Deblock eine natürliche Wahl.` },
      es: { title: `Tarjeta Deblock ${YEAR} — Neobanco francés IBAN FR + self-custody | TopCryptoCards`, description: `Deblock Card en ${YEAR}: IBAN francés, self-custody, licencia ACPR/AMF, 1% cashback en Premium.`, intro: `Deblock es el primer neobanco crypto francés autorizado por la ACPR con licencia bancaria MiCA. Ofrece un IBAN francés, una tarjeta Visa física y self-custody.`, outro: `Para residentes que buscan una solución crypto con IBAN francés y regulación AMF/ACPR, Deblock es una elección natural.` },
      it: { title: `Carta Deblock ${YEAR} — Neobanca francese IBAN FR + self-custody | TopCryptoCards`, description: `Deblock Card nel ${YEAR}: IBAN francese, self-custody, licenza ACPR/AMF, 1% cashback su Premium.`, intro: `Deblock è la prima neobanca crypto francese autorizzata dall'ACPR con licenza bancaria MiCA. Offre un IBAN francese, una carta Visa fisica e il self-custody.`, outro: `Per chi cerca una soluzione crypto con IBAN francese e regolamentazione AMF/ACPR, Deblock è una scelta naturale.` },
      en: { title: `Deblock Card ${YEAR} — French Neobank FR IBAN + Self-Custody | TopCryptoCards`, description: `Deblock Card in ${YEAR}: French IBAN, self-custody, ACPR/AMF licence, 1% cashback on Premium.`, intro: `Deblock is the first French crypto neobank licensed by the ACPR with MiCA-compliant banking status. It offers a French IBAN, a physical Visa card, and self-custody — your keys, your crypto. 1% cashback available on the Premium plan.`, outro: `For French residents seeking crypto with a local IBAN and AMF/ACPR regulation, Deblock is a natural choice. Standard plan is free, Premium at €9.90/month.` },
    },
  },

  'revolut': {
    brandId: 'revolut',
    displayName: 'Revolut',
    website: 'https://revolut.com',
    founded: 2015,
    hq: 'Royaume-Uni',
    regulation: 'FCA (UK), licences EMI UE',
    seo: {
      fr: {
        title: `Carte Revolut Crypto ${YEAR} — Paiements crypto sans cashback | TopCryptoCards`,
        description: `Revolut et les cryptos en ${YEAR} : paiements en crypto, carte Metal, RevPoints. 0% cashback crypto pour tous les tiers.`,
        intro: `Revolut n'est pas une carte crypto au sens strict : il n'y a pas de cashback en cryptomonnaies. En revanche, c'est une excellente carte multi-devises avec paiement en crypto possible et RevPoints sur les plans Premium+. La carte physique crypto lancée en mai 2026 permet de dépenser ses cryptos chez tous les marchands Visa, avec conversion automatique au moment du paiement.`,
        outro: `Si vous cherchez du cashback crypto, Revolut n'est pas le bon choix — des cartes comme Nexo ou Bleap sont bien supérieures. En revanche, pour une carte multi-devises premium avec accès aux crypto et une app irréprochable, Revolut reste le meilleur de sa catégorie — notamment pour les voyageurs fréquents.`,
        rating: 3.9,
        pros: [
          'Carte physique crypto lancée en mai 2026 — dépense directe en crypto chez tous les marchands Visa',
          'Conversion crypto → EUR instantanée, sans frais supplémentaires (dans la limite mensuelle)',
          'Plus de 30 cryptomonnaies supportées pour le paiement',
          'Application Revolut notée 4,7/5 — meilleure UX du secteur',
          'Plan Standard entièrement gratuit, compatible Apple Pay & Google Pay',
          'Régulé FCA (UK) + licences EMI dans l\'UE — l\'une des fintech les plus solides d\'Europe',
        ],
        cons: [
          'Aucun cashback en crypto — uniquement des RevPoints sur les plans payants',
          'Limite d\'échange à 1 000 €/mois sans frais sur le plan Standard (1 % au-delà)',
          'Support client critiqué : réponses lentes, uniquement via chat in-app',
          'RevPoints peu valorisables — difficiles à convertir en valeur réelle',
        ],
        faq: [
          { q: 'La carte Revolut offre-t-elle du cashback en crypto ?', a: 'Non. Revolut ne propose pas de cashback en cryptomonnaies. Les plans Premium (9,99€/mois) et Ultra (45€/mois) offrent des RevPoints, convertibles en miles ou remises voyages, mais ce n\'est pas du cashback crypto à proprement parler.' },
          { q: 'Comment fonctionne la carte physique crypto Revolut lancée en 2026 ?', a: 'La carte Revolut Crypto Card (lancée mai 2026) est une Visa physique qui permet de payer directement avec ses cryptos chez n\'importe quel marchand Visa. La conversion crypto → EUR se fait automatiquement au moment du paiement, sans frais supplémentaires dans la limite mensuelle.' },
          { q: 'Quelle est la différence entre Revolut Standard, Premium et Ultra ?', a: 'Standard est gratuit (1 000€/mois d\'échange sans frais). Premium à 9,99€/mois ajoute des RevPoints (1 pt/4€) et des limites plus élevées. Ultra à 45€/mois offre 1 pt/1€, cashback métal et avantages premium. Aucun tier ne propose de cashback crypto.' },
          { q: 'La carte Revolut est-elle disponible en France en 2026 ?', a: 'Oui, Revolut et sa carte crypto sont disponibles en France et dans toute l\'EEA (hors Hongrie, Suisse et Portugal). La carte physique crypto se commande directement depuis l\'app Revolut.' },
        ],
      },
      de: {
        title: `Revolut Krypto Karte ${YEAR} — Krypto-Zahlungen ohne Cashback | TopCryptoCards`,
        description: `Revolut und Krypto ${YEAR}: Krypto-Zahlungen, Metal-Karte, RevPoints. 0% Krypto-Cashback für alle Tiers.`,
        intro: `Revolut ist keine Krypto-Karte im eigentlichen Sinne: Es gibt kein Krypto-Cashback. Dafür ist es eine ausgezeichnete Multi-Währungskarte mit Krypto-Zahlungsmöglichkeit und RevPoints auf Premium+-Plänen. Die im Mai 2026 gestartete physische Krypto-Karte ermöglicht direkte Krypto-Zahlungen bei allen Visa-Händlern.`,
        outro: `Wer Krypto-Cashback sucht, ist bei Revolut falsch — Nexo oder Bleap sind besser geeignet. Für eine Premium-Multi-Währungskarte mit Krypto-Zugang und der besten App auf dem Markt ist Revolut jedoch unschlagbar — besonders für Vielreisende.`,
        rating: 3.9,
        pros: [
          'Physische Krypto-Karte seit Mai 2026 — direkte Krypto-Zahlungen bei allen Visa-Händlern',
          'Sofortige Krypto → EUR-Konvertierung ohne zusätzliche Gebühren (innerhalb des Monatslimits)',
          'Mehr als 30 Kryptowährungen für Zahlungen unterstützt',
          'Revolut-App mit 4,7/5 bewertet — beste UX der Branche',
          'Standard-Plan komplett kostenlos, Apple Pay & Google Pay kompatibel',
          'FCA (UK) reguliert + EMI-Lizenzen in der EU — eine der solidesten Fintechs Europas',
        ],
        cons: [
          'Kein Krypto-Cashback — nur RevPoints auf kostenpflichtigen Plänen',
          'Tausch-Limit von 1.000 €/Monat gebührenfrei im Standard-Plan (1% darüber hinaus)',
          'Kundensupport kritisiert: langsame Antworten, nur über In-App-Chat',
          'RevPoints schwer zu verwerten — kaum in realen Wert umwandelbar',
        ],
        faq: [
          { q: 'Bietet die Revolut-Karte Krypto-Cashback?', a: 'Nein. Revolut bietet kein Krypto-Cashback. Premium- (9,99€/Monat) und Ultra-Pläne (45€/Monat) bieten RevPoints, die in Meilen oder Reiserabatte umgewandelt werden können, aber kein Krypto-Cashback.' },
          { q: 'Wie funktioniert die physische Krypto-Karte von Revolut (2026)?', a: 'Die im Mai 2026 gestartete Revolut Crypto Card ist eine physische Visa-Karte, mit der Krypto direkt bei jedem Visa-Händler bezahlt werden kann. Die Konvertierung von Krypto in EUR erfolgt automatisch beim Bezahlen.' },
          { q: 'Ist die Revolut-Karte in Deutschland verfügbar?', a: 'Ja, Revolut und seine Krypto-Karte sind in Deutschland und der gesamten EEA verfügbar (außer Ungarn, Schweiz und Portugal).' },
        ],
      },
      es: {
        title: `Tarjeta Revolut Crypto ${YEAR} — Pagos crypto sin cashback | TopCryptoCards`,
        description: `Revolut y las criptos en ${YEAR}: pagos en crypto, tarjeta Metal, RevPoints. 0% cashback crypto.`,
        intro: `Revolut no es una tarjeta crypto en el sentido estricto: no hay cashback en criptomonedas. Sin embargo, es una excelente tarjeta multidivisa con opción de pago en cripto y RevPoints en los planes Premium+. La tarjeta física crypto lanzada en mayo de 2026 permite gastar criptos en cualquier comercio Visa, con conversión automática en el momento del pago.`,
        outro: `Si buscas cashback crypto, Revolut no es la mejor opción — tarjetas como Nexo o Bleap son superiores. Para una tarjeta multidivisa premium con acceso a cripto y la mejor app del mercado, Revolut es insuperable — especialmente para viajeros frecuentes.`,
        rating: 3.9,
        pros: [
          'Tarjeta física crypto desde mayo 2026 — pago directo en cripto en todos los comercios Visa',
          'Conversión cripto → EUR instantánea sin comisiones adicionales (dentro del límite mensual)',
          'Más de 30 criptomonedas admitidas para pago',
          'App Revolut valorada 4,7/5 — mejor UX del sector',
          'Plan Standard totalmente gratuito, compatible con Apple Pay y Google Pay',
          'Regulado por la FCA (UK) + licencias EMI en la UE — una de las fintech más sólidas de Europa',
        ],
        cons: [
          'Sin cashback en cripto — solo RevPoints en planes de pago',
          'Límite de cambio de 1.000 €/mes sin comisiones en el plan Standard (1% por encima)',
          'Soporte al cliente criticado: respuestas lentas, solo por chat in-app',
          'RevPoints difíciles de valorar — complicados de convertir en valor real',
        ],
        faq: [
          { q: '¿La tarjeta Revolut ofrece cashback en cripto?', a: 'No. Revolut no ofrece cashback en criptomonedas. Los planes Premium (9,99€/mes) y Ultra (45€/mes) ofrecen RevPoints canjeables en millas o descuentos de viaje, pero no son cashback crypto.' },
          { q: '¿Cómo funciona la tarjeta física crypto de Revolut lanzada en 2026?', a: 'La Revolut Crypto Card (lanzada en mayo 2026) es una tarjeta Visa física que permite pagar directamente con criptos en cualquier comercio Visa. La conversión cripto → EUR se hace automáticamente en el momento del pago.' },
          { q: '¿Está disponible la tarjeta Revolut en España en 2026?', a: 'Sí, Revolut y su tarjeta crypto están disponibles en España y en toda la EEA (excepto Hungría, Suiza y Portugal).' },
        ],
      },
      it: {
        title: `Carta Revolut Crypto ${YEAR} — Pagamenti crypto senza cashback | TopCryptoCards`,
        description: `Revolut e le cripto nel ${YEAR}: pagamenti in cripto, carta Metal, RevPoints. 0% cashback cripto.`,
        intro: `Revolut non è una carta crypto in senso stretto: non c'è cashback in criptovalute. Tuttavia, è un'ottima carta multivaluta con possibilità di pagamento in cripto e RevPoints sui piani Premium+. La carta fisica crypto lanciata a maggio 2026 permette di spendere criptovalute presso qualsiasi esercente Visa, con conversione automatica al momento del pagamento.`,
        outro: `Se cerchi cashback crypto, Revolut non è la scelta giusta — Nexo o Bleap sono superiori. Per una carta multivaluta premium con accesso alle cripto e la migliore app del mercato, Revolut è insuperabile — specialmente per i viaggiatori frequenti.`,
        rating: 3.9,
        pros: [
          'Carta fisica crypto da maggio 2026 — pagamento diretto in cripto presso tutti gli esercenti Visa',
          'Conversione cripto → EUR istantanea senza commissioni aggiuntive (entro il limite mensile)',
          'Oltre 30 criptovalute supportate per i pagamenti',
          'App Revolut valutata 4,7/5 — migliore UX del settore',
          'Piano Standard completamente gratuito, compatibile con Apple Pay e Google Pay',
          'Regolamentata dalla FCA (UK) + licenze EMI nell\'UE — una delle fintech più solide d\'Europa',
        ],
        cons: [
          'Nessun cashback in cripto — solo RevPoints sui piani a pagamento',
          'Limite di cambio di 1.000 €/mese senza commissioni nel piano Standard (1% oltre)',
          'Assistenza clienti criticata: risposte lente, solo via chat in-app',
          'RevPoints difficili da valorizzare — complicati da convertire in valore reale',
        ],
        faq: [
          { q: 'La carta Revolut offre cashback in cripto?', a: 'No. Revolut non offre cashback in criptovalute. I piani Premium (9,99€/mese) e Ultra (45€/mese) offrono RevPoints convertibili in miglia o sconti viaggi, ma non sono cashback crypto.' },
          { q: 'Come funziona la carta fisica crypto di Revolut lanciata nel 2026?', a: 'La Revolut Crypto Card (lanciata a maggio 2026) è una carta Visa fisica che permette di pagare direttamente con le cripto presso qualsiasi esercente Visa. La conversione cripto → EUR avviene automaticamente al momento del pagamento.' },
          { q: 'La carta Revolut è disponibile in Italia nel 2026?', a: 'Sì, Revolut e la sua carta crypto sono disponibili in Italia e in tutta l\'EEA (tranne Ungheria, Svizzera e Portogallo).' },
        ],
      },
      en: {
        title: `Revolut Crypto Card ${YEAR} — Crypto Payments Without Cashback | TopCryptoCards`,
        description: `Revolut and crypto in ${YEAR}: crypto payments, Metal card, RevPoints. 0% crypto cashback on all tiers.`,
        intro: `Revolut is not a crypto card in the strict sense — there's no crypto cashback. However, it's an excellent multi-currency card with crypto payment capability and RevPoints on Premium+ plans. The physical crypto card launched in May 2026 lets you spend your crypto at any Visa merchant, with automatic conversion at the point of sale.`,
        outro: `If you're looking for crypto cashback, Revolut isn't the right choice — cards like Nexo or Bleap are far better. But for a premium multi-currency card with crypto access and the best app on the market, Revolut is unmatched — especially for frequent travellers.`,
        rating: 3.9,
        pros: [
          'Physical crypto card since May 2026 — spend crypto directly at any Visa merchant',
          'Instant crypto → EUR conversion with no extra fees (within monthly limit)',
          'Over 30 cryptocurrencies supported for payments',
          'Revolut app rated 4.7/5 — best UX in the industry',
          'Standard plan completely free, Apple Pay & Google Pay compatible',
          'FCA (UK) regulated + EMI licences across the EU — one of Europe\'s most solid fintechs',
        ],
        cons: [
          'No crypto cashback — only RevPoints on paid plans',
          'Exchange limit of €1,000/month fee-free on Standard plan (1% above)',
          'Customer support criticised: slow responses, in-app chat only',
          'RevPoints hard to value — difficult to convert into real-world worth',
        ],
        faq: [
          { q: 'Does the Revolut card offer crypto cashback?', a: 'No. Revolut does not offer crypto cashback. Premium (€9.99/month) and Ultra (€45/month) plans offer RevPoints redeemable for airline miles or travel discounts, but these are not crypto cashback.' },
          { q: 'How does the Revolut physical crypto card launched in 2026 work?', a: 'The Revolut Crypto Card (launched May 2026) is a physical Visa card that lets you pay with crypto at any Visa merchant. The crypto → EUR conversion happens automatically at the point of sale, with no extra fees within the monthly limit.' },
          { q: 'What\'s the difference between Revolut Standard, Premium and Ultra?', a: 'Standard is free (€1,000/month fee-free exchange). Premium at €9.99/month adds RevPoints (1 pt/€4) and higher limits. Ultra at €45/month offers 1 pt/€1, metal cashback and premium perks. No tier offers crypto cashback.' },
          { q: 'Is the Revolut card available in the UK and EU in 2026?', a: 'Yes, Revolut and its crypto card are available across the EEA and the UK (except Hungary, Switzerland and Portugal). The physical crypto card can be ordered directly from the Revolut app.' },
        ],
      },
    },
  },

  'ledger': {
    brandId: 'ledger',
    displayName: 'Ledger',
    website: 'https://ledger.com',
    founded: 2014,
    hq: 'France',
    seo: {
      fr: { title: `Carte Ledger ${YEAR} — Cashback BTC ou LDG, EEA + UK | TopCryptoCards`, description: `Ledger CL Card (Baanx) en ${YEAR} : 1% cashback en BTC ou 2% en LDG, disponible EEA et UK.`, intro: `La Ledger CL Card, développée avec Baanx, permet de payer directement depuis un hardware wallet Ledger avec 1% de cashback en BTC ou 2% en LDG (Ledger token).`, outro: `Pour les utilisateurs de hardware wallet Ledger, cette carte est une extension naturelle de leur setup crypto. Le cashback BTC sans token propriétaire requis est un avantage notable.` },
      de: { title: `Ledger Karte ${YEAR} — BTC oder LDG Cashback | TopCryptoCards`, description: `Ledger CL Card (Baanx) ${YEAR}: 1% BTC oder 2% LDG Cashback, verfügbar in EEA und UK.`, intro: `Die Ledger CL Card, entwickelt mit Baanx, ermöglicht Zahlungen direkt von einer Ledger Hardware-Wallet mit 1% BTC oder 2% LDG Cashback.`, outro: `Für Ledger Hardware-Wallet-Nutzer ist diese Karte eine natürliche Erweiterung ihres Krypto-Setups.` },
      es: { title: `Tarjeta Ledger ${YEAR} — Cashback BTC o LDG | TopCryptoCards`, description: `Ledger CL Card (Baanx) en ${YEAR}: 1% cashback en BTC o 2% en LDG, disponible en EEA y UK.`, intro: `La Ledger CL Card, desarrollada con Baanx, permite pagar directamente desde una hardware wallet Ledger con 1% de cashback en BTC o 2% en LDG.`, outro: `Para usuarios de hardware wallet Ledger, esta tarjeta es una extensión natural de su setup crypto.` },
      it: { title: `Carta Ledger ${YEAR} — Cashback BTC o LDG | TopCryptoCards`, description: `Ledger CL Card (Baanx) nel ${YEAR}: 1% cashback in BTC o 2% in LDG, disponibile in EEA e UK.`, intro: `La Ledger CL Card, sviluppata con Baanx, permette di pagare direttamente da un hardware wallet Ledger con l'1% di cashback in BTC o il 2% in LDG.`, outro: `Per gli utenti di hardware wallet Ledger, questa carta è un'estensione naturale del loro setup crypto.` },
      en: { title: `Ledger Card ${YEAR} — BTC or LDG Cashback | TopCryptoCards`, description: `Ledger CL Card (Baanx) in ${YEAR}: 1% BTC or 2% LDG cashback, available across EEA and UK.`, intro: `The Ledger CL Card, developed with Baanx, lets you spend directly from a Ledger hardware wallet with 1% BTC or 2% LDG cashback.`, outro: `For Ledger hardware wallet users, this card is a natural extension of their crypto setup. The BTC cashback option with no proprietary token requirement is a notable advantage.` },
    },
  },

  'trade-republic': {
    brandId: 'trade-republic',
    displayName: 'Trade Republic',
    website: 'https://traderepublic.com',
    founded: 2015,
    hq: 'Allemagne',
    seo: {
      fr: { title: `Carte Trade Republic ${YEAR} — 1% Saveback ETF ou crypto | TopCryptoCards`, description: `Trade Republic Card en ${YEAR} : 1% Saveback automatique en ETF ou crypto sur chaque achat. Disponible EU (hors UK).`, intro: `La carte Trade Republic fonctionne différemment : au lieu d'un cashback direct, chaque achat génère un Saveback de 1% investi automatiquement en ETF ou en crypto. Disponible en UE uniquement.`, outro: `La Trade Republic Card est unique dans sa catégorie : c'est la seule carte qui transforme vos dépenses en épargne automatique en ETF. Parfaite pour les investisseurs long terme.` },
      de: { title: `Trade Republic Karte ${YEAR} — 1% Saveback ETF oder Krypto | TopCryptoCards`, description: `Trade Republic Card ${YEAR}: 1% automatisches Saveback in ETF oder Krypto bei jedem Kauf. Nur in der EU verfügbar.`, intro: `Die Trade Republic Karte funktioniert anders: Jeder Kauf generiert ein 1% Saveback, das automatisch in ETFs oder Krypto investiert wird.`, outro: `Die Trade Republic Karte ist einzigartig: Sie ist die einzige Karte, die Ihre Ausgaben in automatische ETF-Ersparnisse umwandelt. Perfekt für Langzeitinvestoren.` },
      es: { title: `Tarjeta Trade Republic ${YEAR} — 1% Saveback ETF o crypto | TopCryptoCards`, description: `Trade Republic Card en ${YEAR}: 1% Saveback automático en ETF o crypto en cada compra. Solo disponible en UE.`, intro: `La tarjeta Trade Republic funciona de manera diferente: cada compra genera un Saveback del 1% invertido automáticamente en ETF o crypto.`, outro: `La Trade Republic Card es única en su categoría: es la única tarjeta que convierte tus gastos en ahorro automático en ETF. Perfecta para inversores a largo plazo.` },
      it: { title: `Carta Trade Republic ${YEAR} — 1% Saveback ETF o crypto | TopCryptoCards`, description: `Trade Republic Card nel ${YEAR}: 1% Saveback automatico in ETF o crypto su ogni acquisto. Solo disponibile in UE.`, intro: `La carta Trade Republic funziona diversamente: ogni acquisto genera un Saveback dell'1% investito automaticamente in ETF o crypto.`, outro: `La Trade Republic Card è unica nella sua categoria: è l'unica carta che trasforma le tue spese in risparmio automatico in ETF. Perfetta per gli investitori a lungo termine.` },
      en: { title: `Trade Republic Card ${YEAR} — 1% ETF or Crypto Saveback | TopCryptoCards`, description: `Trade Republic Card in ${YEAR}: 1% automatic Saveback in ETF or crypto on every purchase. EU only (not UK).`, intro: `The Trade Republic card works differently: every purchase generates a 1% Saveback automatically invested in ETFs or crypto. Available in the EU only.`, outro: `The Trade Republic Card is unique in its category: it's the only card that converts your spending into automatic ETF savings. Perfect for long-term investors.` },
    },
  },

  'bleap': {
    brandId: 'bleap',
    displayName: 'Bleap',
    website: 'https://bleap.finance',
    founded: 2023,
    hq: 'Portugal',
    seo: {
      fr: { title: `Carte Bleap ${YEAR} — 2% cashback USDC self-custody | TopCryptoCards`, description: `Bleap Card en ${YEAR} : 2% de cashback en USDC, self-custody Mastercard, jusqu'à 20% sur catégories spécifiques.`, intro: `Bleap est une fintech portugaise lancée en 2023 qui marie self-custody et cashback USDC. 2% de base sur tous les achats, jusqu'à 20% sur certaines catégories partenaires.`, outro: `Bleap est l'une des nouvelles générations de cartes crypto avec self-custody natif. Le cashback en USDC (stablecoin) élimine le risque de volatilité des récompenses.` },
      de: { title: `Bleap Karte ${YEAR} — 2% USDC Cashback Self-Custody | TopCryptoCards`, description: `Bleap Card ${YEAR}: 2% USDC Cashback, Self-Custody Mastercard, bis zu 20% in bestimmten Kategorien.`, intro: `Bleap ist ein portugiesisches Fintech, gegründet 2023, das Self-Custody und USDC-Cashback vereint. 2% Basis-Cashback auf alle Käufe.`, outro: `Bleap gehört zur neuen Generation von Krypto-Karten mit nativem Self-Custody. USDC-Cashback eliminiert das Volatilitätsrisiko.` },
      es: { title: `Tarjeta Bleap ${YEAR} — 2% cashback USDC self-custody | TopCryptoCards`, description: `Bleap Card en ${YEAR}: 2% cashback en USDC, Mastercard self-custody, hasta 20% en categorías específicas.`, intro: `Bleap es una fintech portuguesa lanzada en 2023 que combina self-custody y cashback USDC. 2% de base en todas las compras.`, outro: `Bleap es una de las nuevas generaciones de tarjetas crypto con self-custody nativo. El cashback en USDC elimina el riesgo de volatilidad de las recompensas.` },
      it: { title: `Carta Bleap ${YEAR} — 2% cashback USDC self-custody | TopCryptoCards`, description: `Bleap Card nel ${YEAR}: 2% cashback in USDC, Mastercard self-custody, fino al 20% su categorie specifiche.`, intro: `Bleap è una fintech portoghese lanciata nel 2023 che combina self-custody e cashback USDC. Il 2% di base su tutti gli acquisti.`, outro: `Bleap appartiene alla nuova generazione di carte crypto con self-custody nativo. Il cashback in USDC elimina il rischio di volatilità delle ricompense.` },
      en: { title: `Bleap Card ${YEAR} — 2% USDC Self-Custody Cashback | TopCryptoCards`, description: `Bleap Card in ${YEAR}: 2% USDC cashback, self-custody Mastercard, up to 20% on specific categories.`, intro: `Bleap is a Portuguese fintech launched in 2023 combining self-custody and USDC cashback. 2% base cashback on all purchases, up to 20% on partner categories.`, outro: `Bleap is part of the new generation of crypto cards with native self-custody. USDC cashback eliminates reward volatility risk.` },
    },
  },

  'plutus': {
    brandId: 'plutus',
    displayName: 'Plutus',
    website: 'https://plutus.it',
    founded: 2015,
    hq: 'Royaume-Uni',
    seo: {
      fr: { title: `Carte Plutus ${YEAR} — 3-9% cashback PLU + Perks | TopCryptoCards`, description: `Plutus Card en ${YEAR} : 3 à 9% de cashback en PLU selon le niveau, avec perks Netflix/Spotify/Amazon. À partir de 6,99€/mois.`, intro: `Plutus propose plusieurs tiers (Starter, Everyday, Premium, Hero...) avec un cashback en PLU allant de 3% à 9%. En plus du cashback, chaque tier inclut des "Perks" — des remboursements sur des abonnements comme Netflix, Spotify ou Amazon Prime.`, outro: `Plutus a abandonné le plan gratuit en 2026 — le Starter coûte désormais 6,99€/mois. Le cashback en PLU est soumis à la volatilité du token. À prendre en compte dans le calcul de rentabilité.` },
      de: { title: `Plutus Karte ${YEAR} — 3-9% PLU Cashback + Perks | TopCryptoCards`, description: `Plutus Card ${YEAR}: 3-9% PLU Cashback je nach Tier, mit Perks (Netflix/Spotify/Amazon). Ab 6,99€/Monat.`, intro: `Plutus bietet mehrere Tiers (Starter, Everyday, Premium, Hero...) mit PLU-Cashback von 3-9%. Zusätzlich enthält jede Stufe "Perks" — Rückerstattungen für Abonnements wie Netflix oder Spotify.`, outro: `Plutus hat den kostenlosen Plan 2026 abgeschafft — Starter kostet jetzt 6,99€/Monat. PLU-Cashback unterliegt der Token-Volatilität.` },
      es: { title: `Tarjeta Plutus ${YEAR} — 3-9% cashback PLU + Perks | TopCryptoCards`, description: `Plutus Card en ${YEAR}: 3-9% cashback en PLU según nivel, con perks (Netflix/Spotify/Amazon). Desde 6,99€/mes.`, intro: `Plutus ofrece varios niveles (Starter, Everyday, Premium, Hero...) con cashback en PLU del 3-9%. Además del cashback, cada nivel incluye "Perks" — reembolsos en suscripciones como Netflix o Spotify.`, outro: `Plutus eliminó el plan gratuito en 2026 — el Starter ahora cuesta 6,99€/mes. El cashback en PLU está sujeto a la volatilidad del token.` },
      it: { title: `Carta Plutus ${YEAR} — 3-9% cashback PLU + Perks | TopCryptoCards`, description: `Plutus Card nel ${YEAR}: 3-9% cashback in PLU per livello, con perks (Netflix/Spotify/Amazon). Da 6,99€/mese.`, intro: `Plutus offre diversi livelli (Starter, Everyday, Premium, Hero...) con cashback in PLU dal 3% al 9%. Oltre al cashback, ogni livello include "Perks" — rimborsi su abbonamenti come Netflix o Spotify.`, outro: `Plutus ha eliminato il piano gratuito nel 2026 — lo Starter ora costa 6,99€/mese. Il cashback in PLU è soggetto alla volatilità del token.` },
      en: { title: `Plutus Card ${YEAR} — 3-9% PLU Cashback + Perks | TopCryptoCards`, description: `Plutus Card in ${YEAR}: 3-9% PLU cashback by tier, with perks (Netflix/Spotify/Amazon). From €6.99/month.`, intro: `Plutus offers multiple tiers (Starter, Everyday, Premium, Hero, and more) with PLU cashback from 3% to 9%. Each tier also includes "Perks" — credits for subscriptions like Netflix, Spotify, or Amazon Prime.`, outro: `Plutus dropped the free plan in 2026 — Starter now costs €6.99/month. PLU cashback is subject to token price volatility, which should factor into your profitability calculation.` },
    },
  },

  'gnosis': {
    brandId: 'gnosis',
    displayName: 'Gnosis Pay',
    website: 'https://gnosispay.com',
    founded: 2017,
    hq: 'Allemagne',
    seo: {
      fr: { title: `Carte Gnosis Pay ${YEAR} — 1-5% GNO cashback on-chain | TopCryptoCards`, description: `Gnosis Pay Card en ${YEAR} : carte Visa on-chain connectée à votre Safe wallet. Cashback en GNO de 1% à 5%.`, intro: `Gnosis Pay est unique : c'est une carte Visa directement connectée à la blockchain Gnosis, avec self-custody via un Safe wallet. Le cashback en GNO varie de 1% (0.1 GNO détenu) à 5% (100+ GNO + OG NFT).`, outro: `Gnosis Pay représente l'avenir des cartes crypto : on-chain, self-custody, sans intermédiaire. Idéale pour les utilisateurs DeFi familiers avec la Gnosis Chain.` },
      de: { title: `Gnosis Pay Karte ${YEAR} — 1-5% GNO On-Chain Cashback | TopCryptoCards`, description: `Gnosis Pay Card ${YEAR}: On-Chain Visa-Karte mit Safe-Wallet. GNO Cashback von 1-5%.`, intro: `Gnosis Pay ist einzigartig: Es ist eine Visa-Karte, die direkt mit der Gnosis Blockchain verbunden ist, mit Self-Custody über ein Safe Wallet.`, outro: `Gnosis Pay repräsentiert die Zukunft von Krypto-Karten: On-Chain, Self-Custody, ohne Zwischenhändler.` },
      es: { title: `Tarjeta Gnosis Pay ${YEAR} — 1-5% cashback GNO on-chain | TopCryptoCards`, description: `Gnosis Pay Card en ${YEAR}: tarjeta Visa on-chain conectada a tu Safe wallet. Cashback en GNO del 1-5%.`, intro: `Gnosis Pay es única: es una tarjeta Visa conectada directamente a la blockchain Gnosis, con self-custody mediante Safe wallet.`, outro: `Gnosis Pay representa el futuro de las tarjetas crypto: on-chain, self-custody, sin intermediarios.` },
      it: { title: `Carta Gnosis Pay ${YEAR} — 1-5% cashback GNO on-chain | TopCryptoCards`, description: `Gnosis Pay Card nel ${YEAR}: carta Visa on-chain collegata al tuo Safe wallet. Cashback in GNO dall'1% al 5%.`, intro: `Gnosis Pay è unica: è una carta Visa collegata direttamente alla blockchain Gnosis, con self-custody tramite Safe wallet.`, outro: `Gnosis Pay rappresenta il futuro delle carte crypto: on-chain, self-custody, senza intermediari.` },
      en: { title: `Gnosis Pay Card ${YEAR} — 1-5% GNO On-Chain Cashback | TopCryptoCards`, description: `Gnosis Pay Card in ${YEAR}: on-chain Visa card connected to your Safe wallet. 1-5% GNO cashback.`, intro: `Gnosis Pay is unique: it's a Visa card directly connected to the Gnosis blockchain, with self-custody via a Safe wallet. GNO cashback ranges from 1% (0.1 GNO held) to 5% (100+ GNO + OG NFT).`, outro: `Gnosis Pay represents the future of crypto cards: on-chain, self-custody, no intermediaries. Ideal for DeFi users familiar with the Gnosis Chain.` },
    },
  },
};

/** Returns brand metadata or a minimal fallback if not in config. */
export function getBrandMeta(brandId: string): BrandMeta {
  return BRAND_CONFIG[brandId] ?? {
    brandId,
    displayName: brandId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    website: '#',
    founded: 0,
    hq: '',
    seo: {
      fr: { title: brandId, description: '', intro: '', outro: '' },
      de: { title: brandId, description: '', intro: '', outro: '' },
      es: { title: brandId, description: '', intro: '', outro: '' },
      it: { title: brandId, description: '', intro: '', outro: '' },
      en: { title: brandId, description: '', intro: '', outro: '' },
    },
  };
}
