// ─────────────────────────────────────────────────────────────────────────────
// cardReviews.ts
// Données structurées pour les pages /fr/avis/:slug
// Mise à jour : juin 2026
// ─────────────────────────────────────────────────────────────────────────────

export interface RatingBreakdown {
  cashback: number;   // /5
  frais: number;      // /5
  facilite: number;   // /5
  securite: number;   // /5
  support: number;    // /5
}

export interface CardReview {
  slug: string;
  cardName: string;
  issuer: string;
  network: 'Visa' | 'Mastercard';
  updatedAt: string;
  globalRating: number; // /5
  ratingBreakdown: RatingBreakdown;
  badge?: string; // 'Meilleur cashback' | 'Sans staking' | etc.
  keyStats: {
    cashbackMax: string;
    stakingRequis: string;
    fraisAnnuels: string;
    disponibilite: string;
  };
  pros: string[];
  cons: string[];
  verdict: string;
  sections: {
    presentation: string;
    cashback: string;
    frais: string;
    securite: string;
    experience: string;
  };
  affiliateLink: string;
  realCardImage?: string;
  metaTitle: string;
  metaDescription: string;
}

export const CARD_REVIEWS: CardReview[] = [
  // ─────────────────────────────────────────────── CRYPTO.COM ───
  {
    slug: 'crypto-com-card',
    cardName: 'Crypto.com Visa Card',
    issuer: 'Crypto.com',
    network: 'Visa',
    updatedAt: '2026-06-01',
    globalRating: 4.1,
    badge: 'La plus connue',
    ratingBreakdown: {
      cashback: 4.5,
      frais: 4.0,
      facilite: 4.2,
      securite: 4.0,
      support: 3.8,
    },
    keyStats: {
      cashbackMax: 'Jusqu\'à 5 % en CRO',
      stakingRequis: 'De 0 à 400 000 € en CRO selon le niveau',
      fraisAnnuels: '0 € (carte gratuite)',
      disponibilite: 'France, UE, UK, États-Unis et +',
    },
    pros: [
      'Carte gratuite sans frais annuels sur tous les niveaux',
      'Jusqu\'à 5 % de cashback en CRO sur le niveau Obsidian',
      'Accès aux lounges aéroports (niveaux Rose Gold et +)',
      'Remboursement Spotify, Netflix, Amazon Prime selon le niveau',
      'Retraits DAB gratuits jusqu\'à 400 € / mois (niveaux supérieurs)',
      'Application mobile complète et intuitive',
      'Acceptée partout dans le monde (réseau Visa)',
    ],
    cons: [
      'Cashback versé en CRO, un token volatil',
      'Staking élevé pour accéder aux meilleurs avantages (40 000 € pour le niveau Icy White)',
      'CRO stakés bloqués pendant 180 jours',
      'Le cashback de base (niveau Midnight Blue) est de 0 %',
      'Support client parfois lent par chat',
      'Taux de conversion pas toujours optimal',
    ],
    verdict: 'La Crypto.com Visa Card reste la référence des cartes crypto grand public grâce à son réseau mondial et ses avantages premium. Elle est idéale si vous êtes prêt à staker des CRO pour débloquer de vrais avantages. Pour un usage sans staking, d\'autres cartes offrent un meilleur rapport cashback/effort.',
    sections: {
      presentation: `La **Crypto.com Visa Card** est l'une des cartes crypto les plus répandues au monde, disponible dans plus de 40 pays. Elle fonctionne sur 5 niveaux (Midnight Blue, Ruby Steel, Jade Green / Royal Indigo, Frosted Rose Gold / Icy White, et Obsidian), chacun nécessitant un staking de CRO croissant sur 180 jours. La carte physique est envoyée gratuitement et aucun frais annuel n'est prélevé sur aucun niveau.`,
      cashback: `Le cashback varie de **0 % (Midnight Blue)** à **5 % (Obsidian)**, versé en CRO directement sur votre compte Crypto.com. Les niveaux intermédiaires offrent 1 % (Ruby Steel), 2 % (Jade/Indigo), et 3 % (Rose Gold/Icy White). En plus du cashback, les niveaux supérieurs remboursent intégralement des abonnements comme Spotify (jusqu'à 12,99 €/mois), Netflix (jusqu'à 13,99 €/mois) et Amazon Prime. À noter : le cashback est versé en CRO, dont la valeur fluctue avec le marché.`,
      frais: `**Aucun frais annuel** sur tous les niveaux — c'est un avantage majeur. Les frais de change (hors EUR) sont de 0 % pour les niveaux supérieurs, mais peuvent atteindre 0,5 % sur les niveaux inférieurs. Les retraits DAB sont gratuits jusqu'à 200 €/mois (Ruby Steel) ou 400 €/mois (niveaux supérieurs), avec 2 % de frais au-delà du plafond.`,
      securite: `Crypto.com est régulé dans plusieurs juridictions (licences MiCA en UE, FCA au Royaume-Uni, MSB aux États-Unis). La plateforme utilise la **2FA**, le **blocage de carte instantané** via l'app, des limites de transaction personnalisables, et stocke 100 % des actifs en cold storage pour les fonds utilisateurs. L'assurance des fonds est couverte jusqu'à certains seuils selon la juridiction.`,
      experience: `L'application Crypto.com est bien notée (4,5/5 sur l'App Store) et permet de gérer la carte, consulter l'historique des transactions, activer/désactiver la carte, et suivre son cashback en temps réel. La carte est compatible **Apple Pay** et **Google Pay**. Le support client répond principalement via chat in-app — les délais peuvent être longs en période de forte activité.`,
    },
    affiliateLink: 'https://crypto.com/app/refer',
    metaTitle: 'Crypto.com Visa Card Avis 2026 — Cashback, Frais & Notre Verdict',
    metaDescription: 'Avis complet sur la Crypto.com Visa Card : cashback jusqu\'à 5 % en CRO, 5 niveaux, staking requis, frais, avantages et inconvénients. Notre verdict objectif.',
  },

  // ─────────────────────────────────────────────── BINANCE ───
  {
    slug: 'binance-card',
    cardName: 'Binance Card',
    issuer: 'Binance',
    network: 'Visa',
    updatedAt: '2026-06-01',
    globalRating: 3.9,
    ratingBreakdown: {
      cashback: 4.2,
      frais: 4.5,
      facilite: 3.8,
      securite: 3.5,
      support: 3.4,
    },
    keyStats: {
      cashbackMax: 'Jusqu\'à 8 % en BNB',
      stakingRequis: 'BNB détenu sur le compte (non bloqué)',
      fraisAnnuels: '0 €',
      disponibilite: 'UE, UK (France incluse)',
    },
    pros: [
      'Jusqu\'à 8 % de cashback en BNB selon le solde',
      'Aucun staking requis — les BNB restent disponibles',
      'Aucun frais annuel ni frais de livraison',
      'Acceptée dans 200+ pays (réseau Visa)',
      'Compatible Apple Pay et Google Pay',
      'Intégrée nativement dans l\'application Binance',
    ],
    cons: [
      'Cashback versé en BNB (volatilité du token)',
      'Nécessite un compte Binance vérifié (KYC complet)',
      'Disponibilité limitée — non accessible aux résidents US',
      'Support Binance parfois difficile à joindre',
      'Incertitudes réglementaires autour de Binance en 2024-2025',
      'Le cashback maximal de 8 % est difficile à atteindre (solde BNB très élevé requis)',
    ],
    verdict: 'La Binance Card est une excellente option pour les utilisateurs déjà actifs sur Binance qui détiennent des BNB. Son avantage principal est que les BNB ne sont pas bloqués, ce qui la rend plus flexible que les cartes avec staking. En revanche, les incertitudes réglementaires autour de Binance et un cashback en BNB volatile tempèrent l\'enthousiasme.',
    sections: {
      presentation: `La **Binance Card** est une carte Visa prépayée émise en partenariat avec Moorwand et disponible dans l'Espace Économique Européen. Elle fonctionne directement depuis le wallet Binance de l'utilisateur, en convertissant les cryptos en euros au moment du paiement. La carte est liée au compte Binance et nécessite un KYC complet pour être obtenue.`,
      cashback: `Le cashback varie de **0,1 % à 8 % en BNB** selon le solde moyen de BNB détenu sur le compte au cours du mois précédent. Les niveaux indicatifs sont : \n- 0–1 BNB → 0,1 %\n- 1–3 BNB → 1 %\n- 3–10 BNB → 3 %\n- +10 BNB → 8 %\n\nLe cashback est crédité en BNB dans les 24h suivant chaque transaction. Contrairement à d'autres cartes, les BNB ne sont pas "stakés" et restent disponibles à tout moment.`,
      frais: `**0 € de frais annuels** et **0 € de frais de livraison** pour la carte physique. Les transactions en devises étrangères (hors EUR) sont converties via Binance avec un spread compétitif. Les retraits DAB sont gratuits dans certaines limites mensuelles. Aucun frais d'inactivité.`,
      securite: `Binance est l'exchange le plus grand au monde par volume mais a fait face à des amendes réglementaires importantes en 2023-2024 (DOJ, SEC, CFTC aux États-Unis). En Europe, Binance détient des licences dans plusieurs pays dont la France (enregistrée PSAN auprès de l'AMF jusqu'en 2023). La carte intègre les contrôles de sécurité standards : 2FA, blocage instantané, notifications en temps réel.`,
      experience: `La gestion de la carte se fait directement dans l'application Binance, qui est très complète. La carte est compatible **Apple Pay** et **Google Pay**. L'expérience d'utilisation est fluide pour les utilisateurs habitués à Binance. Le support client est toutefois critiqué pour ses délais de réponse parfois très longs.`,
    },
    affiliateLink: 'https://www.binance.com/fr/cards',
    metaTitle: 'Binance Card Avis 2026 — Jusqu\'à 8 % Cashback BNB, Notre Test',
    metaDescription: 'Avis Binance Card 2026 : cashback jusqu\'à 8 % en BNB, sans staking, sans frais annuels. Avantages, inconvénients et notre verdict complet.',
  },

  // ─────────────────────────────────────────────── BYBIT ───
  {
    slug: 'bybit-card',
    cardName: 'Bybit Card',
    issuer: 'Bybit',
    network: 'Mastercard',
    updatedAt: '2026-06-01',
    globalRating: 4.0,
    badge: 'Cashback élevé',
    ratingBreakdown: {
      cashback: 4.8,
      frais: 4.3,
      facilite: 3.9,
      securite: 3.7,
      support: 3.6,
    },
    keyStats: {
      cashbackMax: 'Jusqu\'à 10 % en MNT',
      stakingRequis: 'Non (basé sur le volume de dépenses)',
      fraisAnnuels: '0 €',
      disponibilite: 'UE (France incluse), certains pays d\'Asie',
    },
    pros: [
      'Cashback parmi les plus élevés du marché (jusqu\'à 10 %)',
      'Aucun staking requis pour accéder au cashback',
      'Aucun frais annuel',
      'Mastercard acceptée mondialement',
      'Compatible Apple Pay et Google Pay',
      'Gestion intuitive via l\'app Bybit',
    ],
    cons: [
      'Cashback versé en MNT (token Bybit, très volatil)',
      'Nécessite un compte Bybit avec KYC',
      'Le cashback de 10 % est plafonné et conditionné au volume mensuel',
      'Bybit a fait face à des restrictions réglementaires dans certains pays',
      'Liquidité du MNT limitée',
      'Non disponible aux résidents américains',
    ],
    verdict: 'La Bybit Card propose le cashback le plus élevé parmi toutes les cartes crypto sans staking requis. C\'est un atout majeur. Toutefois, le cashback versé en MNT (token Bybit) est très volatil, et la plateforme reste moins établie que Crypto.com ou Binance. Idéale pour les utilisateurs Bybit cherchant à maximiser leurs récompenses.',
    sections: {
      presentation: `La **Bybit Card** est une Mastercard prépayée émise par Bybit en partenariat avec des prestataires de paiement européens. Elle est liée directement au compte Bybit de l'utilisateur et permet de dépenser ses cryptos instantanément chez tout commerçant acceptant Mastercard. La carte est disponible dans la majorité des pays de l'UE.`,
      cashback: `Le cashback peut atteindre **10 % en MNT** selon le niveau de dépenses mensuelles. Les taux sont progressifs :\n- Dépenses < 1 000 € → 2 % en MNT\n- Dépenses 1 000–5 000 € → 5 % en MNT\n- Dépenses > 5 000 € → 10 % en MNT (plafonné)\n\nLe MNT est le token natif de Bybit, convertissable en BTC, ETH ou USDT sur la plateforme.`,
      frais: `**0 € de frais annuels**. La conversion des cryptos en EUR se fait au cours du marché au moment du paiement, avec un spread minimal. Les retraits DAB sont gratuits jusqu'à un certain plafond mensuel. Aucun frais de dormance ou d'inactivité.`,
      securite: `Bybit est un exchange de dérivés crypto majeur, régulé dans plusieurs juridictions. La carte intègre les protections standard : authentification biométrique, blocage instantané, alertes par notification. Bybit utilise le cold storage pour la majorité des fonds. À noter : Bybit a été interdit temporairement dans certains pays européens avant d'obtenir les licences requises.`,
      experience: `L'application Bybit est bien conçue et permet une gestion complète de la carte. Les transactions apparaissent en temps réel, et le cashback est crédité rapidement. La carte est compatible **Apple Pay** et **Google Pay**. Le support client est disponible 24h/24 via chat, avec des temps de réponse variables.`,
    },
    affiliateLink: 'https://www.bybit.com/en/card',
    metaTitle: 'Bybit Card Avis 2026 — 10 % Cashback Sans Staking, Notre Test',
    metaDescription: 'Avis Bybit Card 2026 : cashback jusqu\'à 10 % en MNT, sans staking requis, zéro frais annuels. Test complet, avantages et inconvénients.',
  },

  // ─────────────────────────────────────────────── OKX ───
  {
    slug: 'okx-card',
    cardName: 'OKX Card',
    issuer: 'OKX',
    network: 'Mastercard',
    updatedAt: '2026-06-01',
    globalRating: 3.8,
    ratingBreakdown: {
      cashback: 3.7,
      frais: 4.2,
      facilite: 4.0,
      securite: 3.8,
      support: 3.5,
    },
    keyStats: {
      cashbackMax: 'Jusqu\'à 3 % selon le niveau',
      stakingRequis: 'OKB optionnel pour améliorer le taux',
      fraisAnnuels: '0 €',
      disponibilite: 'UE (France incluse)',
    },
    pros: [
      'Aucun frais annuel',
      'Compatible avec 30+ cryptomonnaies',
      'Interface claire dans l\'app OKX',
      'Compatible Apple Pay et Google Pay',
      'Mastercard acceptée partout dans le monde',
      'Bonne intégration avec le DEX OKX Web3',
    ],
    cons: [
      'Cashback inférieur à la concurrence (max 3 %)',
      'Cashback versé en OKB (token OKX)',
      'Disponibilité géographique encore limitée',
      'OKX moins connu que Binance ou Crypto.com en France',
      'KYC obligatoire avec délai de vérification',
      'Support en anglais principalement',
    ],
    verdict: 'L\'OKX Card est une bonne option pour les utilisateurs de la plateforme OKX, avec une intégration native dans l\'écosystème OKX Web3. Le cashback est correct mais reste inférieur aux leaders du marché. Elle convient surtout si vous êtes déjà utilisateur d\'OKX et souhaitez centraliser vos activités.',
    sections: {
      presentation: `La **OKX Card** est une Mastercard prépayée émise par OKX, l'un des plus grands exchanges mondiaux. Elle permet de dépenser plus de 30 cryptomonnaies différentes directement chez les commerçants, avec conversion en temps réel. Disponible via l'application OKX, elle s'adresse aussi bien aux débutants qu'aux utilisateurs avancés de l'écosystème OKX.`,
      cashback: `Le cashback varie entre **1 % et 3 %** selon le niveau d'utilisation et le solde OKB détenu. Le cashback de base est de 1 % pour tous les utilisateurs, et peut monter à 3 % pour ceux qui détiennent un certain solde en OKB. Le cashback est versé en OKB, le token natif de la plateforme.`,
      frais: `**0 € de frais annuels**. Les transactions en devises étrangères sont converties au cours du marché. Les retraits DAB sont soumis à des frais minimes au-delà d'un certain plafond mensuel. Aucun frais de maintenance de compte.`,
      securite: `OKX est régulé dans plusieurs juridictions et a obtenu des licences en Europe. La plateforme utilise le cold storage pour 95 % des fonds et propose un système d'assurance pour les fonds en custody. La carte intègre l'authentification à deux facteurs, les notifications en temps réel et le blocage instantané.`,
      experience: `L'expérience utilisateur dans l'app OKX est globalement positive, avec une interface moderne. La carte est compatible **Apple Pay** et **Google Pay**. OKX se distingue par son intégration avec le Web3 — vous pouvez utiliser votre wallet OKX directement connecté à des dApps. Le support est disponible en anglais principalement.`,
    },
    affiliateLink: 'https://www.okx.com/fr/card',
    metaTitle: 'OKX Card Avis 2026 — Test Complet, Cashback & Frais',
    metaDescription: 'Avis OKX Card 2026 : cashback jusqu\'à 3 %, compatible 30+ cryptos, zéro frais annuels. Notre test complet avec avantages, inconvénients et verdict.',
  },

  // ─────────────────────────────────────────────── COINBASE ───
  {
    slug: 'coinbase-card',
    cardName: 'Coinbase Card',
    issuer: 'Coinbase',
    network: 'Visa',
    updatedAt: '2026-06-01',
    globalRating: 3.7,
    badge: 'Sans staking',
    ratingBreakdown: {
      cashback: 3.5,
      frais: 3.8,
      facilite: 4.5,
      securite: 4.5,
      support: 3.4,
    },
    keyStats: {
      cashbackMax: '4 % en XLM ou 1 % en BTC',
      stakingRequis: 'Aucun',
      fraisAnnuels: '0 €',
      disponibilite: 'UE, UK, États-Unis',
    },
    pros: [
      'Aucun staking requis — cashback immédiat',
      'Choix du type de cashback : BTC ou XLM',
      'Coinbase est l\'exchange le plus régulé au monde (côté en bourse)',
      'Sécurité exceptionnelle et transparence totale',
      'Compatible Apple Pay et Google Pay',
      'Interface très accessible aux débutants',
      'Visa acceptée partout',
    ],
    cons: [
      'Cashback de 4 % uniquement en XLM (token peu populaire)',
      'Cashback BTC limité à 1 %',
      'Frais de conversion Coinbase plus élevés que les concurrents',
      'Moins de fonctionnalités avancées que Binance ou OKX',
      'Support client parfois très lent',
      'Pas de remboursement d\'abonnements streaming',
    ],
    verdict: 'La Coinbase Card est la carte crypto idéale pour les débutants et ceux qui privilégient la sécurité et la régulation. Coinbase est l\'exchange le plus fiable du marché, coté au Nasdaq. Le cashback sans staking est un vrai avantage, mais les taux sont inférieurs à ceux de la concurrence, et les frais de Coinbase restent plus élevés que la moyenne.',
    sections: {
      presentation: `La **Coinbase Card** est une carte Visa émise par Coinbase, le seul exchange crypto coté en bourse (Nasdaq : COIN). Disponible en Europe et aux États-Unis, elle est liée directement au compte Coinbase de l'utilisateur et permet de dépenser n'importe quelle crypto en la convertissant en monnaie locale au moment du paiement. Aucun staking n'est requis pour profiter du cashback.`,
      cashback: `Coinbase propose deux options de cashback au choix :\n- **4 % en XLM** (Stellar Lumens)\n- **1 % en BTC** (Bitcoin)\n\nLe cashback est crédité instantanément après chaque transaction. La possibilité de choisir BTC comme cashback est un avantage unique sur le marché, même si le taux de 1 % est limité par rapport à la concurrence.`,
      frais: `**0 € de frais annuels** et **0 € de frais de livraison**. Cependant, Coinbase applique des frais de conversion légèrement plus élevés que ses concurrents (environ 1 à 2,5 % selon la devise et le montant). Les retraits DAB peuvent être soumis à des frais. Pas de frais d'inactivité.`,
      securite: `Coinbase est **la carte crypto la plus sûre du marché** d'un point de vue réglementaire. L'exchange est soumis aux régulations américaines les plus strictes, est coté au Nasdaq, publie ses comptes trimestriellement, et est régulé dans tous les pays où il opère. 98 % des fonds sont conservés en cold storage. Programme d'assurance sur les fonds en custody.`,
      experience: `L'application Coinbase est la plus simple d'utilisation du marché, pensée pour les novices. La carte est compatible **Apple Pay** et **Google Pay**. La gestion des cryptos, le suivi du cashback et les paramètres de la carte sont accessibles en quelques taps. Support client disponible par email et chat, mais avec des délais parfois importants.`,
    },
    affiliateLink: 'https://www.coinbase.com/fr/card',
    metaTitle: 'Coinbase Card Avis 2026 — 4 % Cashback Sans Staking, Notre Test',
    metaDescription: 'Avis Coinbase Card 2026 : cashback 4 % en XLM ou 1 % en BTC, aucun staking requis, plateforme la plus régulée. Test complet et verdict.',
  },

  // ─────────────────────────────────────────────── NEXO ───
  {
    slug: 'nexo-card',
    cardName: 'Nexo Card',
    issuer: 'Nexo',
    network: 'Mastercard',
    updatedAt: '2026-06-01',
    globalRating: 4.2,
    badge: 'Meilleure sans staking',
    ratingBreakdown: {
      cashback: 4.0,
      frais: 4.5,
      facilite: 4.3,
      securite: 4.2,
      support: 4.0,
    },
    keyStats: {
      cashbackMax: '2 % en BTC ou NEXO',
      stakingRequis: 'Aucun (NEXO en portefeuille optionnel)',
      fraisAnnuels: '0 €',
      disponibilite: 'UE (France incluse)',
    },
    pros: [
      'Cashback 2 % en BTC sans aucun staking requis',
      'Ligne de crédit crypto (dépenser sans vendre ses actifs)',
      'Aucun frais annuel',
      'Sécurité et conformité réglementaire solides',
      'Compatible Apple Pay et Google Pay',
      'Cashback disponible en BTC (actif de référence)',
      'Interface simple et efficace',
    ],
    cons: [
      'Cashback plafonné à 2 % (inférieur à certains concurrents avec staking)',
      'Fonctionnement en mode crédit peut être complexe à comprendre',
      'Nexo n\'est pas disponible dans tous les pays',
      'Token NEXO moins liquide que BTC ou ETH',
      'Pas d\'accès aux lounges aéroports',
      'Historique de la plateforme avec des controverses réglementaires aux US',
    ],
    verdict: 'La Nexo Card est notre recommandation n°1 pour ceux qui veulent du cashback sans jamais bloquer leurs cryptos. Le concept de "ligne de crédit crypto" est unique : vous dépensez sans vendre vos actifs, qui continuent de générer des intérêts. Avec 2 % de cashback en BTC, c\'est un des meilleurs rapports valeur/effort du marché.',
    sections: {
      presentation: `La **Nexo Card** fonctionne différemment des autres cartes crypto : au lieu de vendre vos cryptos pour payer, Nexo vous accorde une **ligne de crédit** garantie par vos actifs en collatéral. Vous dépensez en euros, Nexo rembourse à votre place, et vous remboursez Nexo à votre rythme (avec intérêts si vous choisissez de ne pas rembourser immédiatement). Vos cryptos restent en portefeuille et continuent de travailler.`,
      cashback: `Le cashback est de **2 % en BTC ou en NEXO** sur toutes les transactions, sans minimum de dépenses ni staking requis. Si vous détenez au moins 10 % de votre portefeuille en NEXO, vous débloquez le cashback en NEXO à taux majoré. Le cashback en BTC est particulièrement attractif car vous accumulez du Bitcoin à chaque achat.`,
      frais: `**0 € de frais annuels**. Pas de frais de change sur les devises étrangères (dépendamment du niveau de fidélité). Les intérêts sur la ligne de crédit sont variables selon le ratio LTV (Loan-to-Value) et votre niveau de fidélité. Si vous remboursez immédiatement chaque transaction (débit mode), il n'y a aucun intérêt à payer.`,
      securite: `Nexo est régulé en Europe et a obtenu des licences dans plusieurs pays. La plateforme utilise des solutions de custody institutionnel (BitGo, Ledger Vault) avec une assurance jusqu'à 775 millions de dollars. Nexo a fait face à des enquêtes réglementaires aux États-Unis (réglées en 2023). En Europe, la plateforme opère en conformité avec les régulations locales.`,
      experience: `L'application Nexo est moderne et intuitive. Elle permet de gérer la carte, suivre le cashback, ajuster la ligne de crédit et surveiller ses actifs en collatéral. La carte est compatible **Apple Pay** et **Google Pay**. Le support client est réactif et disponible en plusieurs langues dont le français.`,
    },
    affiliateLink: 'https://nexo.com/nexo-card',
    metaTitle: 'Nexo Card Avis 2026 — 2 % Cashback BTC Sans Staking, Notre Verdict',
    metaDescription: 'Avis Nexo Card 2026 : 2 % cashback en BTC sans staking, ligne de crédit crypto, zéro frais annuels. Meilleure carte sans staking selon nous.',
  },

  // ─────────────────────────────────────────────── BITPANDA ───
  {
    slug: 'bitpanda-card',
    cardName: 'Bitpanda Card',
    issuer: 'Bitpanda',
    network: 'Visa',
    updatedAt: '2026-06-01',
    globalRating: 3.6,
    ratingBreakdown: {
      cashback: 3.2,
      frais: 3.8,
      facilite: 4.2,
      securite: 4.0,
      support: 3.5,
    },
    keyStats: {
      cashbackMax: 'Jusqu\'à 1 % en BEST',
      stakingRequis: 'BEST optionnel pour avantages supplémentaires',
      fraisAnnuels: '0 €',
      disponibilite: 'Autriche, Allemagne, Espagne, France et UE',
    },
    pros: [
      'Plateforme européenne bien régulée (licence MiCA)',
      'Aucun frais annuel',
      'Interface simple et accessible',
      'Support en plusieurs langues européennes',
      'Compatible avec plus de 1 000 actifs crypto',
      'Bonne réputation en Europe centrale',
    ],
    cons: [
      'Cashback limité à 1 % en BEST (token Bitpanda)',
      'BEST est un token peu liquide avec faible capitalisation',
      'Offre moins compétitive que Bybit ou Crypto.com en termes de cashback',
      'Pas encore disponible dans tous les pays UE',
      'Fonctionnalités avancées limitées vs les grands exchanges',
      'Volume d\'exchange plus faible que Binance ou OKX',
    ],
    verdict: 'La Bitpanda Card est une option solide pour les européens qui cherchent une plateforme fiable et bien régulée. Bitpanda est l\'une des rares fintechs crypto avec une licence bancaire en Europe. En revanche, le cashback de 1 % en BEST est en dessous des offres concurrentes. À choisir pour sa fiabilité plutôt que pour sa performance cashback.',
    sections: {
      presentation: `**Bitpanda** est une fintech autrichienne fondée en 2014, l'une des premières plateformes crypto en Europe. La **Bitpanda Card** est une Visa prépayée qui permet de dépenser ses cryptos chez tous les commerçants acceptant Visa. Bitpanda dispose d'une licence bancaire européenne, ce qui la place parmi les plateformes crypto les plus sûres du continent.`,
      cashback: `La Bitpanda Card offre **1 % de cashback en BEST** (Bitpanda Ecosystem Token) sur toutes les dépenses. En détenant un certain solde en BEST, vous pouvez accéder à des avantages supplémentaires sur la plateforme (frais réduits, accès prioritaire). Le BEST peut être converti en d'autres cryptos ou en euros sur la plateforme Bitpanda.`,
      frais: `**0 € de frais annuels** et **0 € pour l'émission de la carte**. Les transactions en devises étrangères sont converties au cours du marché avec un spread compétitif. Les retraits DAB sont possibles avec des frais variables selon le montant et la fréquence.`,
      securite: `Bitpanda est **l'une des plateformes crypto les mieux régulées d'Europe** : elle détient une licence de prestataire de services de paiement (PSD2), a obtenu l'agrément PSAN en France et dispose d'une licence bancaire en Autriche. La plateforme n'a jamais subi de hack majeur depuis sa création en 2014. Fonds stockés en cold storage avec assurance.`,
      experience: `L'application Bitpanda est intuitive et disponible en plusieurs langues dont le français. Elle permet de gérer la carte, consulter l'historique des transactions et suivre son portefeuille d'actifs. La carte est compatible **Apple Pay** et **Google Pay**. Le support client est disponible par email et chat, avec une équipe francophone.`,
    },
    affiliateLink: 'https://www.bitpanda.com/fr/card',
    metaTitle: 'Bitpanda Card Avis 2026 — Test Complet, Cashback & Sécurité',
    metaDescription: 'Avis Bitpanda Card 2026 : cashback 1 % en BEST, plateforme européenne régulée, zéro frais annuels. Notre test complet de la carte Bitpanda.',
  },

  // ─────────────────────────────────────────────── WIREX ───
  {
    slug: 'wirex-card',
    cardName: 'Wirex Card',
    issuer: 'Wirex',
    network: 'Visa',
    updatedAt: '2026-06-01',
    globalRating: 3.5,
    ratingBreakdown: {
      cashback: 3.3,
      frais: 3.5,
      facilite: 3.8,
      securite: 3.7,
      support: 3.2,
    },
    keyStats: {
      cashbackMax: 'Jusqu\'à 8 % en WXT',
      stakingRequis: 'WXT optionnel pour améliorer le taux',
      fraisAnnuels: '0 à 9,99 € selon le plan',
      disponibilite: 'UE, UK, États-Unis, Asie-Pacifique',
    },
    pros: [
      'Large disponibilité géographique (150+ pays)',
      'Supporte 150+ cryptomonnaies et devises',
      'Cashback pouvant atteindre 8 % avec WXT',
      'Comptes multi-devises intégrés',
      'Bonne option pour les voyageurs fréquents',
      'Compatible Apple Pay',
    ],
    cons: [
      'Cashback versé en WXT (token Wirex avec faible liquidité)',
      'Frais annuels sur certains plans (jusqu\'à 9,99 €/mois)',
      'Interface moins moderne que la concurrence',
      'Support client parfois décevant',
      'Wirex a eu des problèmes de stabilité opérationnelle par le passé',
      'Token WXT peu populaire et difficile à revendre',
    ],
    verdict: 'La Wirex Card est intéressante pour sa couverture géographique exceptionnelle et son support multi-devises. Elle convient particulièrement aux voyageurs internationaux. En revanche, le cashback en WXT est peu attractif vu la faible liquidité du token, et les frais sur les plans premium réduisent l\'intérêt global. D\'autres cartes offrent un meilleur rapport qualité/prix.',
    sections: {
      presentation: `**Wirex** est une fintech britannique fondée en 2014, spécialisée dans les comptes multi-devises et les paiements crypto. La **Wirex Card** (Visa) est disponible dans plus de 150 pays et supporte plus de 150 cryptomonnaies et devises fiat. Elle s'adresse aux utilisateurs internationaux cherchant une solution multi-devises complète.`,
      cashback: `Le cashback Wirex (appelé **Cryptoback™**) varie selon le plan choisi :\n- Plan Standard (gratuit) : 0,5 % en WXT\n- Plan Premium (4,99 €/mois) : 1,5 % en WXT\n- Plan Elite (9,99 €/mois) : jusqu'à 8 % en WXT pour certaines catégories\n\nLe WXT est le token natif de Wirex. Il est nécessaire d'en détenir pour accéder aux meilleurs taux.`,
      frais: `Les frais varient selon le plan. Le plan Standard est **gratuit** mais avec des avantages limités. Les plans Premium et Elite coûtent respectivement 4,99 € et 9,99 €/mois. Les retraits DAB sont gratuits jusqu'à 200 €/mois sur le plan Standard. Les transactions en devises étrangères bénéficient d'un taux de change compétitif.`,
      securite: `Wirex est régulé par la FCA au Royaume-Uni et opère avec des licences dans l'UE. La plateforme utilise le chiffrement end-to-end et le 2FA. Les fonds sont ségrégués (non utilisés pour des activités de la plateforme). Wirex a connu quelques incidents opérationnels mineurs par le passé mais n'a pas subi de hack majeur.`,
      experience: `L'application Wirex est fonctionnelle mais moins moderne que celle de Crypto.com ou Binance. Elle permet la gestion de comptes en 150+ devises, la conversion instantanée et le suivi du cashback. La carte est compatible **Apple Pay**. Le support client est principalement en anglais, avec des délais de réponse variables.`,
    },
    affiliateLink: 'https://wirexapp.com/fr',
    metaTitle: 'Wirex Card Avis 2026 — Test Complet, Cashback WXT & Frais',
    metaDescription: 'Avis Wirex Card 2026 : cashback jusqu\'à 8 % en WXT, 150+ pays, multi-devises. Notre test complet avec avantages, inconvénients et verdict.',
  },

  // ─────────────────────────────────────────────── LEDGER ───
  {
    slug: 'ledger-card',
    cardName: 'Ledger Card',
    issuer: 'Ledger (Baanx)',
    network: 'Visa',
    updatedAt: '2026-06-01',
    globalRating: 3.9,
    ratingBreakdown: {
      cashback: 3.5,
      frais: 3.8,
      facilite: 3.6,
      securite: 5.0,
      support: 3.5,
    },
    keyStats: {
      cashbackMax: 'Jusqu\'à 2 % en BTC ou LDG',
      stakingRequis: 'LDG optionnel pour augmenter le taux',
      fraisAnnuels: '0 €',
      disponibilite: 'UE (France incluse)',
    },
    pros: [
      'Sécurité hardware unique — la meilleure du marché',
      'Linked directement au hardware wallet Ledger',
      'Aucun frais annuel',
      'Cashback en BTC possible',
      'Self-custody partielle : vos clés restent sous votre contrôle',
      'Idéale pour les utilisateurs avancés soucieux de la sécurité',
    ],
    cons: [
      'Nécessite un Ledger hardware wallet',
      'Configuration plus complexe que les cartes classiques',
      'Cashback limité à 2 %',
      'Token LDG avec faible liquidité',
      'Non disponible aux États-Unis',
      'Moins de fonctionnalités grand public',
    ],
    verdict: 'La Ledger Card est la référence en matière de sécurité — c\'est la seule carte crypto qui permet une gestion en self-custody partielle via le hardware wallet Ledger. Elle s\'adresse aux utilisateurs avancés qui ne veulent pas confier leurs clés à une plateforme tierce. Pour les débutants ou ceux qui cherchent du cashback élevé, d\'autres cartes sont plus adaptées.',
    sections: {
      presentation: `La **Ledger Card** est une collaboration entre Ledger (le fabricant du hardware wallet le plus populaire au monde) et Baanx (fintech de paiement). Elle permet de dépenser ses cryptos en maintenant un niveau de contrôle sur ses actifs supérieur à toutes les autres cartes crypto. La carte est une Visa disponible dans l'UE.`,
      cashback: `Le cashback est de **1 % en BTC** (par défaut) ou **2 % en LDG** (Ledger token) si vous détenez un solde minimum en LDG. Le cashback en BTC est particulièrement intéressant pour les investisseurs long terme qui cherchent à accumuler du Bitcoin passivement via leurs dépenses quotidiennes.`,
      frais: `**0 € de frais annuels**. Les transactions sont converties au cours du marché au moment du paiement. Les retraits DAB et les frais de change en devises étrangères sont compétitifs. Aucun frais d'inactivité.`,
      securite: `La Ledger Card se distingue par sa sécurité exceptionnelle : les actifs peuvent être stockés sur votre **hardware wallet Ledger** (cold storage physique), ce qui élimine le risque de hack exchange. C'est la seule carte du marché à offrir cette fonctionnalité. Ledger est le leader mondial du hardware wallet avec plus de 6 millions d'appareils vendus.`,
      experience: `La configuration initiale est plus complexe que les autres cartes (nécessite un Ledger hardware wallet et l'application Ledger Live). Une fois configurée, l'utilisation est fluide. La carte est compatible **Apple Pay** et **Google Pay**. Le support Ledger est disponible en plusieurs langues dont le français.`,
    },
    affiliateLink: 'https://ledger.com/ledger-card',
    metaTitle: 'Ledger Card Avis 2026 — La Carte Crypto la Plus Sécurisée',
    metaDescription: 'Avis Ledger Card 2026 : carte crypto liée au hardware wallet, cashback BTC, sécurité maximale. Test complet et verdict pour utilisateurs avancés.',
  },
];

// Helper : trouver un avis par slug
export function getReviewBySlug(slug: string): CardReview | undefined {
  return CARD_REVIEWS.find(r => r.slug === slug);
}

// Helper : avis liés (exclut l'avis courant)
export function getRelatedReviews(slug: string, count = 3): CardReview[] {
  return CARD_REVIEWS.filter(r => r.slug !== slug).slice(0, count);
}

// Toutes les notes agrégées pour le schema
export function getAggregateRating(): { ratingValue: number; ratingCount: number } {
  const avg = CARD_REVIEWS.reduce((sum, r) => sum + r.globalRating, 0) / CARD_REVIEWS.length;
  return { ratingValue: Math.round(avg * 10) / 10, ratingCount: CARD_REVIEWS.length };
}
