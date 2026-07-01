/**
 * generate-review-translations.mjs
 *
 * Translates all card review content from French into DE, ES, IT, EN
 * using the Claude API, then writes src/data/cardReviewsI18n.ts.
 *
 * Usage (run on your Mac from project root):
 *   node scripts/generate-review-translations.mjs
 *
 * Requires: ANTHROPIC_API_KEY in .env
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load API key from .env ────────────────────────────────────────────────────
const envPath = path.join(ROOT, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/ANTHROPIC_API_KEY=(.+)/);
if (!apiKeyMatch) { console.error('ANTHROPIC_API_KEY not found in .env'); process.exit(1); }
const ANTHROPIC_API_KEY = apiKeyMatch[1].trim();

// ── FR source data ────────────────────────────────────────────────────────────
// All translatable fields from cardReviews.ts
const FR_REVIEWS = [
  {
    slug: 'crypto-com-card',
    cardName: 'Crypto.com Visa Card',
    badge: 'La plus connue',
    keyStats: { cashbackMax: "Jusqu'à 5 % en CRO", stakingRequis: 'De 0 à 400 000 € en CRO selon le niveau', fraisAnnuels: '0 € (carte gratuite)', disponibilite: 'France, UE, UK, États-Unis et +' },
    pros: ["Carte gratuite sans frais annuels sur tous les niveaux","Jusqu'à 5 % de cashback en CRO sur le niveau Obsidian","Accès aux lounges aéroports (niveaux Rose Gold et +)","Remboursement Spotify, Netflix, Amazon Prime selon le niveau","Retraits DAB gratuits jusqu'à 400 € / mois (niveaux supérieurs)","Application mobile complète et intuitive","Acceptée partout dans le monde (réseau Visa)"],
    cons: ["Cashback versé en CRO, un token volatil","Staking élevé pour accéder aux meilleurs avantages (40 000 € pour le niveau Icy White)","CRO stakés bloqués pendant 180 jours","Le cashback de base (niveau Midnight Blue) est de 0 %","Support client parfois lent par chat","Taux de conversion pas toujours optimal"],
    verdict: "La Crypto.com Visa Card reste la référence des cartes crypto grand public grâce à son réseau mondial et ses avantages premium. Elle est idéale si vous êtes prêt à staker des CRO pour débloquer de vrais avantages. Pour un usage sans staking, d'autres cartes offrent un meilleur rapport cashback/effort.",
    sections: {
      presentation: "La **Crypto.com Visa Card** est l'une des cartes crypto les plus répandues au monde, disponible dans plus de 40 pays. Elle fonctionne sur 5 niveaux (Midnight Blue, Ruby Steel, Jade Green / Royal Indigo, Frosted Rose Gold / Icy White, et Obsidian), chacun nécessitant un staking de CRO croissant sur 180 jours. La carte physique est envoyée gratuitement et aucun frais annuel n'est prélevé sur aucun niveau.",
      cashback: "Le cashback varie de **0 % (Midnight Blue)** à **5 % (Obsidian)**, versé en CRO directement sur votre compte Crypto.com. Les niveaux intermédiaires offrent 1 % (Ruby Steel), 2 % (Jade/Indigo), et 3 % (Rose Gold/Icy White). En plus du cashback, les niveaux supérieurs remboursent intégralement des abonnements comme Spotify, Netflix et Amazon Prime. À noter : le cashback est versé en CRO, dont la valeur fluctue avec le marché.",
      frais: "**Aucun frais annuel** sur tous les niveaux. Les frais de change (hors EUR) sont de 0 % pour les niveaux supérieurs, mais peuvent atteindre 0,5 % sur les niveaux inférieurs. Les retraits DAB sont gratuits jusqu'à 200 €/mois (Ruby Steel) ou 400 €/mois (niveaux supérieurs), avec 2 % de frais au-delà du plafond.",
      securite: "Crypto.com est régulé dans plusieurs juridictions (licences MiCA en UE, FCA au Royaume-Uni, MSB aux États-Unis). La plateforme utilise la **2FA**, le **blocage de carte instantané** via l'app, des limites de transaction personnalisables, et stocke 100 % des actifs en cold storage pour les fonds utilisateurs.",
      experience: "L'application Crypto.com est bien notée (4,5/5 sur l'App Store) et permet de gérer la carte, consulter l'historique des transactions, activer/désactiver la carte, et suivre son cashback en temps réel. La carte est compatible **Apple Pay** et **Google Pay**. Le support client répond principalement via chat in-app.",
    },
    metaTitle: 'Crypto.com Visa Card Avis 2026 — Cashback, Frais & Notre Verdict',
    metaDescription: "Avis complet sur la Crypto.com Visa Card : cashback jusqu'à 5 % en CRO, 5 niveaux, staking requis, frais, avantages et inconvénients. Notre verdict objectif.",
  },
  {
    slug: 'binance-card',
    cardName: 'Binance Card',
    keyStats: { cashbackMax: "Jusqu'à 8 % en BNB", stakingRequis: 'BNB détenu sur le compte (non bloqué)', fraisAnnuels: '0 €', disponibilite: 'UE, UK (France incluse)' },
    pros: ["Jusqu'à 8 % de cashback en BNB selon le solde","Aucun staking requis — les BNB restent disponibles","Aucun frais annuel ni frais de livraison","Acceptée dans 200+ pays (réseau Visa)","Compatible Apple Pay et Google Pay","Intégrée nativement dans l'application Binance"],
    cons: ["Cashback versé en BNB (volatilité du token)","Nécessite un compte Binance vérifié (KYC complet)","Disponibilité limitée — non accessible aux résidents US","Support Binance parfois difficile à joindre","Incertitudes réglementaires autour de Binance en 2024-2025","Le cashback maximal de 8 % est difficile à atteindre (solde BNB très élevé requis)"],
    verdict: "La Binance Card est une excellente option pour les utilisateurs déjà actifs sur Binance qui détiennent des BNB. Son avantage principal est que les BNB ne sont pas bloqués, ce qui la rend plus flexible que les cartes avec staking. En revanche, les incertitudes réglementaires autour de Binance et un cashback en BNB volatile tempèrent l'enthousiasme.",
    sections: {
      presentation: "La **Binance Card** est une carte Visa prépayée émise en partenariat avec Moorwand et disponible dans l'Espace Économique Européen. Elle fonctionne directement depuis le wallet Binance de l'utilisateur, en convertissant les cryptos en euros au moment du paiement.",
      cashback: "Le cashback varie de **0,1 % à 8 % en BNB** selon le solde moyen de BNB détenu sur le compte au cours du mois précédent. Contrairement à d'autres cartes, les BNB ne sont pas \"stakés\" et restent disponibles à tout moment.",
      frais: "**0 € de frais annuels** et **0 € de frais de livraison** pour la carte physique. Les transactions en devises étrangères (hors EUR) sont converties via Binance avec un spread compétitif. Aucun frais d'inactivité.",
      securite: "Binance est l'exchange le plus grand au monde par volume mais a fait face à des amendes réglementaires importantes en 2023-2024. En Europe, Binance détient des licences dans plusieurs pays. La carte intègre les contrôles de sécurité standards : 2FA, blocage instantané, notifications en temps réel.",
      experience: "La gestion de la carte se fait directement dans l'application Binance, qui est très complète. La carte est compatible **Apple Pay** et **Google Pay**. L'expérience d'utilisation est fluide pour les utilisateurs habitués à Binance.",
    },
    metaTitle: "Binance Card Avis 2026 — Jusqu'à 8 % Cashback BNB, Notre Test",
    metaDescription: "Avis Binance Card 2026 : cashback jusqu'à 8 % en BNB, sans staking, sans frais annuels. Avantages, inconvénients et notre verdict complet.",
  },
  {
    slug: 'bybit-card',
    cardName: 'Bybit Card',
    badge: 'Cashback élevé',
    keyStats: { cashbackMax: "Jusqu'à 10 % en MNT", stakingRequis: 'Non (basé sur le volume de dépenses)', fraisAnnuels: '0 €', disponibilite: "UE (France incluse), certains pays d'Asie" },
    pros: ["Cashback parmi les plus élevés du marché (jusqu'à 10 %)","Aucun staking requis pour accéder au cashback","Aucun frais annuel","Mastercard acceptée mondialement","Compatible Apple Pay et Google Pay","Gestion intuitive via l'app Bybit"],
    cons: ["Cashback versé en MNT (token Bybit, très volatil)","Nécessite un compte Bybit avec KYC","Le cashback de 10 % est plafonné et conditionné au volume mensuel","Bybit a fait face à des restrictions réglementaires dans certains pays","Liquidité du MNT limitée","Non disponible aux résidents américains"],
    verdict: "La Bybit Card propose le cashback le plus élevé parmi toutes les cartes crypto sans staking requis. C'est un atout majeur. Toutefois, le cashback versé en MNT (token Bybit) est très volatil, et la plateforme reste moins établie que Crypto.com ou Binance. Idéale pour les utilisateurs Bybit cherchant à maximiser leurs récompenses.",
    sections: {
      presentation: "La **Bybit Card** est une Mastercard prépayée émise par Bybit en partenariat avec des prestataires de paiement européens. Elle est liée directement au compte Bybit de l'utilisateur et permet de dépenser ses cryptos instantanément chez tout commerçant acceptant Mastercard.",
      cashback: "Le cashback peut atteindre **10 % en MNT** selon le niveau de dépenses mensuelles. Les taux sont progressifs selon les tranches de dépenses. Le MNT est le token natif de Bybit, convertissable en BTC, ETH ou USDT sur la plateforme.",
      frais: "**0 € de frais annuels**. La conversion des cryptos en EUR se fait au cours du marché au moment du paiement. Les retraits DAB sont gratuits jusqu'à un certain plafond mensuel. Aucun frais de dormance ou d'inactivité.",
      securite: "Bybit est un exchange de dérivés crypto majeur, régulé dans plusieurs juridictions. La carte intègre les protections standard : authentification biométrique, blocage instantané, alertes par notification. Bybit utilise le cold storage pour la majorité des fonds.",
      experience: "L'application Bybit est bien conçue et permet une gestion complète de la carte. Les transactions apparaissent en temps réel, et le cashback est crédité rapidement. La carte est compatible **Apple Pay** et **Google Pay**.",
    },
    metaTitle: 'Bybit Card Avis 2026 — 10 % Cashback Sans Staking, Notre Test',
    metaDescription: 'Avis Bybit Card 2026 : cashback jusqu\'à 10 % en MNT, sans staking requis, zéro frais annuels. Test complet, avantages et inconvénients.',
  },
  {
    slug: 'okx-card',
    cardName: 'OKX Card',
    keyStats: { cashbackMax: "Jusqu'à 3 % selon le niveau", stakingRequis: 'OKB optionnel pour améliorer le taux', fraisAnnuels: '0 €', disponibilite: 'UE (France incluse)' },
    pros: ["Aucun frais annuel","Compatible avec 30+ cryptomonnaies","Interface claire dans l'app OKX","Compatible Apple Pay et Google Pay","Mastercard acceptée partout dans le monde","Bonne intégration avec le DEX OKX Web3"],
    cons: ["Cashback inférieur à la concurrence (max 3 %)","Cashback versé en OKB (token OKX)","Disponibilité géographique encore limitée","OKX moins connu que Binance ou Crypto.com en France","KYC obligatoire avec délai de vérification","Support en anglais principalement"],
    verdict: "L'OKX Card est une bonne option pour les utilisateurs de la plateforme OKX, avec une intégration native dans l'écosystème OKX Web3. Le cashback est correct mais reste inférieur aux leaders du marché. Elle convient surtout si vous êtes déjà utilisateur d'OKX.",
    sections: {
      presentation: "La **OKX Card** est une Mastercard prépayée émise par OKX, l'un des plus grands exchanges mondiaux. Elle permet de dépenser plus de 30 cryptomonnaies différentes directement chez les commerçants, avec conversion en temps réel.",
      cashback: "Le cashback varie entre **1 % et 3 %** selon le niveau d'utilisation et le solde OKB détenu. Le cashback de base est de 1 % pour tous les utilisateurs. Le cashback est versé en OKB, le token natif de la plateforme.",
      frais: "**0 € de frais annuels**. Les transactions en devises étrangères sont converties au cours du marché. Aucun frais de maintenance de compte.",
      securite: "OKX est régulé dans plusieurs juridictions et a obtenu des licences en Europe. La plateforme utilise le cold storage pour 95 % des fonds et propose un système d'assurance pour les fonds en custody. La carte intègre la 2FA, les notifications en temps réel et le blocage instantané.",
      experience: "L'expérience utilisateur dans l'app OKX est globalement positive, avec une interface moderne. La carte est compatible **Apple Pay** et **Google Pay**. Le support est disponible en anglais principalement.",
    },
    metaTitle: 'OKX Card Avis 2026 — Test Complet, Cashback & Frais',
    metaDescription: "Avis OKX Card 2026 : cashback jusqu'à 3 %, compatible 30+ cryptos, zéro frais annuels. Notre test complet avec avantages, inconvénients et verdict.",
  },
  {
    slug: 'coinbase-card',
    cardName: 'Coinbase Card',
    badge: 'Sans staking',
    keyStats: { cashbackMax: '4 % en XLM ou 1 % en BTC', stakingRequis: 'Aucun', fraisAnnuels: '0 €', disponibilite: 'UE, UK, États-Unis' },
    pros: ["Aucun staking requis — cashback immédiat","Choix du type de cashback : BTC ou XLM","Coinbase est l'exchange le plus régulé au monde (côté en bourse)","Sécurité exceptionnelle et transparence totale","Compatible Apple Pay et Google Pay","Interface très accessible aux débutants","Visa acceptée partout"],
    cons: ["Cashback de 4 % uniquement en XLM (token peu populaire)","Cashback BTC limité à 1 %","Frais de conversion Coinbase plus élevés que les concurrents","Moins de fonctionnalités avancées que Binance ou OKX","Support client parfois très lent","Pas de remboursement d'abonnements streaming"],
    verdict: "La Coinbase Card est la carte crypto idéale pour les débutants et ceux qui privilégient la sécurité et la régulation. Coinbase est l'exchange le plus fiable du marché, coté au Nasdaq. Le cashback sans staking est un vrai avantage, mais les taux sont inférieurs à ceux de la concurrence.",
    sections: {
      presentation: "La **Coinbase Card** est une carte Visa émise par Coinbase, le seul exchange crypto coté en bourse (Nasdaq : COIN). Disponible en Europe et aux États-Unis, elle est liée directement au compte Coinbase de l'utilisateur. Aucun staking n'est requis pour profiter du cashback.",
      cashback: "Coinbase propose deux options de cashback au choix : **4 % en XLM** (Stellar Lumens) ou **1 % en BTC** (Bitcoin). Le cashback est crédité instantanément après chaque transaction.",
      frais: "**0 € de frais annuels** et **0 € de frais de livraison**. Cependant, Coinbase applique des frais de conversion légèrement plus élevés que ses concurrents (environ 1 à 2,5 % selon la devise). Pas de frais d'inactivité.",
      securite: "Coinbase est **la carte crypto la plus sûre du marché** d'un point de vue réglementaire. L'exchange est soumis aux régulations américaines, est coté au Nasdaq, et publie ses comptes trimestriellement. 98 % des fonds sont conservés en cold storage.",
      experience: "L'application Coinbase est la plus simple d'utilisation du marché, pensée pour les novices. La carte est compatible **Apple Pay** et **Google Pay**. La gestion des cryptos, le suivi du cashback et les paramètres sont accessibles en quelques taps.",
    },
    metaTitle: 'Coinbase Card Avis 2026 — 4 % Cashback Sans Staking, Notre Test',
    metaDescription: "Avis Coinbase Card 2026 : cashback 4 % en XLM ou 1 % en BTC, aucun staking requis, plateforme la plus régulée. Test complet et verdict.",
  },
  {
    slug: 'nexo-card',
    cardName: 'Nexo Card',
    badge: 'Meilleure sans staking',
    keyStats: { cashbackMax: '2 % en BTC ou NEXO', stakingRequis: 'Aucun (NEXO en portefeuille optionnel)', fraisAnnuels: '0 €', disponibilite: 'UE (France incluse)' },
    pros: ["Cashback 2 % en BTC sans aucun staking requis","Ligne de crédit crypto (dépenser sans vendre ses actifs)","Aucun frais annuel","Sécurité et conformité réglementaire solides","Compatible Apple Pay et Google Pay","Cashback disponible en BTC (actif de référence)","Interface simple et efficace"],
    cons: ["Cashback plafonné à 2 % (inférieur à certains concurrents avec staking)","Fonctionnement en mode crédit peut être complexe à comprendre","Nexo n'est pas disponible dans tous les pays","Token NEXO moins liquide que BTC ou ETH","Pas d'accès aux lounges aéroports","Historique de la plateforme avec des controverses réglementaires aux US"],
    verdict: "La Nexo Card est notre recommandation n°1 pour ceux qui veulent du cashback sans jamais bloquer leurs cryptos. Le concept de \"ligne de crédit crypto\" est unique : vous dépensez sans vendre vos actifs, qui continuent de générer des intérêts. Avec 2 % de cashback en BTC, c'est un des meilleurs rapports valeur/effort du marché.",
    sections: {
      presentation: "La **Nexo Card** fonctionne différemment des autres cartes crypto : au lieu de vendre vos cryptos pour payer, Nexo vous accorde une **ligne de crédit** garantie par vos actifs en collatéral. Vos cryptos restent en portefeuille et continuent de travailler.",
      cashback: "Le cashback est de **2 % en BTC ou en NEXO** sur toutes les transactions, sans minimum de dépenses ni staking requis. Si vous détenez au moins 10 % de votre portefeuille en NEXO, vous débloquez le cashback en NEXO à taux majoré.",
      frais: "**0 € de frais annuels**. Pas de frais de change sur les devises étrangères (selon le niveau de fidélité). Les intérêts sur la ligne de crédit sont variables selon le ratio LTV. Si vous remboursez immédiatement chaque transaction (débit mode), il n'y a aucun intérêt à payer.",
      securite: "Nexo est régulé en Europe et a obtenu des licences dans plusieurs pays. La plateforme utilise des solutions de custody institutionnel (BitGo, Ledger Vault) avec une assurance jusqu'à 775 millions de dollars. Nexo a fait face à des enquêtes réglementaires aux États-Unis (réglées en 2023).",
      experience: "L'application Nexo est moderne et intuitive. Elle permet de gérer la carte, suivre le cashback, ajuster la ligne de crédit et surveiller ses actifs en collatéral. La carte est compatible **Apple Pay** et **Google Pay**. Le support client est réactif et disponible en plusieurs langues dont le français.",
    },
    metaTitle: 'Nexo Card Avis 2026 — 2 % Cashback BTC Sans Staking, Notre Verdict',
    metaDescription: "Avis Nexo Card 2026 : 2 % cashback en BTC sans staking, ligne de crédit crypto, zéro frais annuels. Meilleure carte sans staking selon nous.",
  },
  {
    slug: 'bitpanda-card',
    cardName: 'Bitpanda Card',
    keyStats: { cashbackMax: "Jusqu'à 1 % en BEST", stakingRequis: 'BEST optionnel pour avantages supplémentaires', fraisAnnuels: '0 €', disponibilite: 'Autriche, Allemagne, Espagne, France et UE' },
    pros: ["Plateforme européenne bien régulée (licence MiCA)","Aucun frais annuel","Interface simple et accessible","Support en plusieurs langues européennes","Compatible avec plus de 1 000 actifs crypto","Bonne réputation en Europe centrale"],
    cons: ["Cashback limité à 1 % en BEST (token Bitpanda)","BEST est un token peu liquide avec faible capitalisation","Offre moins compétitive que Bybit ou Crypto.com en termes de cashback","Pas encore disponible dans tous les pays UE","Fonctionnalités avancées limitées vs les grands exchanges","Volume d'exchange plus faible que Binance ou OKX"],
    verdict: "La Bitpanda Card est une option solide pour les européens qui cherchent une plateforme fiable et bien régulée. Bitpanda est l'une des rares fintechs crypto avec une licence bancaire en Europe. En revanche, le cashback de 1 % en BEST est en dessous des offres concurrentes.",
    sections: {
      presentation: "**Bitpanda** est une fintech autrichienne fondée en 2014, l'une des premières plateformes crypto en Europe. La **Bitpanda Card** est une Visa prépayée qui permet de dépenser ses cryptos chez tous les commerçants acceptant Visa. Bitpanda dispose d'une licence bancaire européenne.",
      cashback: "La Bitpanda Card offre **1 % de cashback en BEST** (Bitpanda Ecosystem Token) sur toutes les dépenses. En détenant un certain solde en BEST, vous pouvez accéder à des avantages supplémentaires sur la plateforme. Le BEST peut être converti en d'autres cryptos ou en euros sur la plateforme Bitpanda.",
      frais: "**0 € de frais annuels** et **0 € pour l'émission de la carte**. Les transactions en devises étrangères sont converties au cours du marché avec un spread compétitif.",
      securite: "Bitpanda est **l'une des plateformes crypto les mieux régulées d'Europe** : elle détient une licence PSD2, a obtenu l'agrément PSAN en France et dispose d'une licence bancaire en Autriche. La plateforme n'a jamais subi de hack majeur depuis 2014.",
      experience: "L'application Bitpanda est intuitive et disponible en plusieurs langues dont le français. La carte est compatible **Apple Pay** et **Google Pay**. Le support client est disponible par email et chat, avec une équipe francophone.",
    },
    metaTitle: 'Bitpanda Card Avis 2026 — Test Complet, Cashback & Sécurité',
    metaDescription: "Avis Bitpanda Card 2026 : cashback 1 % en BEST, plateforme européenne régulée, zéro frais annuels. Notre test complet de la carte Bitpanda.",
  },
  {
    slug: 'wirex-card',
    cardName: 'Wirex Card',
    keyStats: { cashbackMax: "Jusqu'à 8 % en WXT", stakingRequis: 'WXT optionnel pour améliorer le taux', fraisAnnuels: '0 à 9,99 € selon le plan', disponibilite: 'UE, UK, États-Unis, Asie-Pacifique' },
    pros: ["Large disponibilité géographique (150+ pays)","Supporte 150+ cryptomonnaies et devises","Cashback pouvant atteindre 8 % avec WXT","Comptes multi-devises intégrés","Bonne option pour les voyageurs fréquents","Compatible Apple Pay"],
    cons: ["Cashback versé en WXT (token Wirex avec faible liquidité)","Frais annuels sur certains plans (jusqu'à 9,99 €/mois)","Interface moins moderne que la concurrence","Support client parfois décevant","Wirex a eu des problèmes de stabilité opérationnelle par le passé","Token WXT peu populaire et difficile à revendre"],
    verdict: "La Wirex Card est intéressante pour sa couverture géographique exceptionnelle et son support multi-devises. Elle convient particulièrement aux voyageurs internationaux. En revanche, le cashback en WXT est peu attractif vu la faible liquidité du token.",
    sections: {
      presentation: "**Wirex** est une fintech britannique fondée en 2014, spécialisée dans les comptes multi-devises et les paiements crypto. La **Wirex Card** (Visa) est disponible dans plus de 150 pays et supporte plus de 150 cryptomonnaies et devises fiat.",
      cashback: "Le cashback Wirex (appelé **Cryptoback™**) varie selon le plan choisi : Plan Standard (gratuit) : 0,5 % en WXT ; Plan Premium (4,99 €/mois) : 1,5 % en WXT ; Plan Elite (9,99 €/mois) : jusqu'à 8 % en WXT pour certaines catégories.",
      frais: "Les frais varient selon le plan. Le plan Standard est **gratuit** mais avec des avantages limités. Les plans Premium et Elite coûtent respectivement 4,99 € et 9,99 €/mois. Les retraits DAB sont gratuits jusqu'à 200 €/mois sur le plan Standard.",
      securite: "Wirex est régulé par la FCA au Royaume-Uni et opère avec des licences dans l'UE. La plateforme utilise le chiffrement end-to-end et la 2FA. Les fonds sont ségrégués.",
      experience: "L'application Wirex est fonctionnelle mais moins moderne que celle de Crypto.com ou Binance. Elle permet la gestion de comptes en 150+ devises, la conversion instantanée et le suivi du cashback. La carte est compatible **Apple Pay**.",
    },
    metaTitle: 'Wirex Card Avis 2026 — Test Complet, Cashback WXT & Frais',
    metaDescription: "Avis Wirex Card 2026 : cashback jusqu'à 8 % en WXT, 150+ pays, multi-devises. Notre test complet avec avantages, inconvénients et verdict.",
  },
  {
    slug: 'ledger-card',
    cardName: 'Ledger Card',
    keyStats: { cashbackMax: "Jusqu'à 2 % en BTC ou LDG", stakingRequis: 'LDG optionnel pour augmenter le taux', fraisAnnuels: '0 €', disponibilite: 'UE (France incluse)' },
    pros: ["Sécurité hardware unique — la meilleure du marché","Linked directement au hardware wallet Ledger","Aucun frais annuel","Cashback en BTC possible","Self-custody partielle : vos clés restent sous votre contrôle","Idéale pour les utilisateurs avancés soucieux de la sécurité"],
    cons: ["Nécessite un Ledger hardware wallet","Configuration plus complexe que les cartes classiques","Cashback limité à 2 %","Token LDG avec faible liquidité","Non disponible aux États-Unis","Moins de fonctionnalités grand public"],
    verdict: "La Ledger Card est la référence en matière de sécurité — c'est la seule carte crypto qui permet une gestion en self-custody partielle via le hardware wallet Ledger. Elle s'adresse aux utilisateurs avancés qui ne veulent pas confier leurs clés à une plateforme tierce.",
    sections: {
      presentation: "La **Ledger Card** est une collaboration entre Ledger (le fabricant du hardware wallet le plus populaire au monde) et Baanx (fintech de paiement). Elle permet de dépenser ses cryptos en maintenant un niveau de contrôle sur ses actifs supérieur à toutes les autres cartes crypto.",
      cashback: "Le cashback est de **1 % en BTC** (par défaut) ou **2 % en LDG** (Ledger token) si vous détenez un solde minimum en LDG. Le cashback en BTC est particulièrement intéressant pour les investisseurs long terme.",
      frais: "**0 € de frais annuels**. Les transactions sont converties au cours du marché au moment du paiement. Les retraits DAB et les frais de change en devises étrangères sont compétitifs. Aucun frais d'inactivité.",
      securite: "La Ledger Card se distingue par sa sécurité exceptionnelle : les actifs peuvent être stockés sur votre **hardware wallet Ledger** (cold storage physique), ce qui élimine le risque de hack exchange. Ledger est le leader mondial du hardware wallet avec plus de 6 millions d'appareils vendus.",
      experience: "La configuration initiale est plus complexe que les autres cartes (nécessite un Ledger hardware wallet et l'application Ledger Live). Une fois configurée, l'utilisation est fluide. La carte est compatible **Apple Pay** et **Google Pay**.",
    },
    metaTitle: 'Ledger Card Avis 2026 — La Carte Crypto la Plus Sécurisée',
    metaDescription: "Avis Ledger Card 2026 : carte crypto liée au hardware wallet, cashback BTC, sécurité maximale. Test complet et verdict pour utilisateurs avancés.",
  },
  {
    slug: 'revolut-card',
    cardName: 'Revolut Crypto Card',
    badge: 'Carte physique 2026',
    keyStats: { cashbackMax: 'Aucun cashback crypto (RevPoints Premium+)', stakingRequis: 'Aucun', fraisAnnuels: '0 € (plan Standard)', disponibilite: 'France, UE, UK (hors Hongrie, Suisse, Portugal)' },
    pros: ["Carte physique crypto lancée en mai 2026 — première du genre chez Revolut","Paiement direct en crypto chez tous les marchands Visa","Conversion crypto → EUR instantanée au moment du paiement","Aucun frais d'échange supplémentaire sur les paiements crypto","Compatible Apple Pay et Google Pay","Plus de 30 cryptomonnaies supportées","Interface et app Revolut très bien notées (4,5/5)","Cartes virtuelles incluses"],
    cons: ["Aucun cashback en crypto (uniquement des RevPoints pour les abonnements Premium+)","Plan Standard limité à 1 000 €/mois d'échange sans frais (1 % au-delà)","Support client critiqué pour ses délais de réponse","Produit crypto encore récent chez Revolut — historique limité","RevPoints difficilement convertibles en valeur réelle"],
    verdict: "La Revolut Crypto Card est idéale si vous utilisez déjà Revolut et voulez simplement dépenser vos cryptos en toute simplicité. En revanche, si le cashback est votre priorité, d'autres cartes (Nexo, Bleap, Plutus) sont bien supérieures.",
    sections: {
      presentation: "**Revolut** est la néobanque la plus utilisée en Europe (45+ millions de clients). En mai 2026, Revolut a lancé sa première **carte physique crypto** — un Visa avec LED intégré. La carte permet de dépenser ses cryptos directement chez n'importe quel marchand Visa.",
      cashback: "Revolut ne propose **pas de cashback en crypto** sur sa carte. Les abonnements Premium et Ultra offrent des **RevPoints** convertibles en miles aériens ou remises voyages. Ce n'est pas du cashback crypto à proprement parler.",
      frais: "Le plan **Standard est gratuit**. Il inclut jusqu'à 1 000 €/mois d'échange crypto sans frais supplémentaires (1 % au-delà). Aucun frais annuel sur la carte.",
      securite: "Revolut est régulé au Royaume-Uni par la **FCA** et dispose de licences EMI dans plusieurs pays de l'UE. La plateforme stocke la majorité des actifs en cold storage et propose la 2FA, le blocage de carte instantané.",
      experience: "L'application Revolut est la meilleure de sa catégorie en termes d'UX (4,7/5 App Store). La gestion de la carte, des cryptos et des devises se fait depuis une seule interface. Le support client est le point faible : souvent limité au chat in-app.",
    },
    metaTitle: "Revolut Crypto Card Avis 2026 — Paiement Crypto Sans Cashback",
    metaDescription: "Avis Revolut Crypto Card 2026 : première carte physique crypto de Revolut, paiement Visa, aucun frais d'échange. Disponible en France et dans toute l'UE.",
  },
  {
    slug: 'bleap-card',
    cardName: 'Bleap Card',
    badge: 'Self-custody USDC',
    keyStats: { cashbackMax: "Jusqu'à 20 % sur catégories sélectionnées (2 % standard)", stakingRequis: 'Aucun', fraisAnnuels: '0 € (gratuit)', disponibilite: 'France, UE, Suisse' },
    pros: ["2 % de cashback standard en USDC sur tous les achats","Jusqu'à 20 % de cashback sur gaming, streaming et certains marchands","Wallet self-custody — vos fonds restent dans votre wallet jusqu'au paiement","Aucun frais de change (0 % FX markup)","Aucun frais annuel","Compatible Apple Pay et Google Pay","Carte virtuelle disponible instantanément","Cashback versé en USDC (stablecoin) — pas de volatilité"],
    cons: ["Marque encore peu connue et support client limité","Les 20 % de cashback sont réservés à quelques catégories spécifiques","Pas de Trustpilot établi — difficile d'évaluer la satisfaction client","Relativement récent (2023) — historique limité","Configuration plus technique qu'une carte classique (self-custody)"],
    verdict: "Bleap est l'une des meilleures cartes pour le cashback pur sans staking : 2 % en USDC garanti, 0 frais, self-custody. Le seul bémol est la maturité de la plateforme — encore jeune et peu connue. Si vous cherchez le meilleur cashback sans contrainte et acceptez d'aller vers une marque émergente, Bleap est un excellent choix.",
    sections: {
      presentation: "**Bleap** est une fintech lancée en 2023 proposant une Mastercard self-custody avec jusqu'à 20 % de cashback en USDC. Le principe est innovant : vos cryptos restent dans votre wallet non-custodial jusqu'au moment exact du paiement. La carte est disponible dans l'EEA (dont la France).",
      cashback: "Le cashback standard est de **2 % en USDC** sur tous les achats, sans condition de staking ni abonnement. Sur les **catégories spéciales** (gaming, streaming, certains marchands partenaires), le cashback peut atteindre **20 %**. Le cashback est versé directement dans votre wallet non-custodial en USDC.",
      frais: "**Aucun frais annuel, aucun frais de change (0 % FX markup), aucun frais de transaction**. C'est l'une des structures de frais les plus légères du marché.",
      securite: "Bleap utilise la technologie **MPC (Multi-Party Computation)** pour sécuriser les transactions self-custody sans exposer les clés privées. Vos fonds restent dans votre wallet jusqu'au paiement — aucun tiers ne détient vos actifs.",
      experience: "L'application Bleap est disponible sur iOS et Android. La configuration du wallet self-custody est guidée mais requiert une compréhension basique des wallets crypto. La carte virtuelle est disponible instantanément après l'inscription. Compatible Apple Pay et Google Pay.",
    },
    metaTitle: 'Bleap Card Avis 2026 — 2% Cashback USDC, Self-Custody, 0 Frais',
    metaDescription: "Avis Bleap Card 2026 : Mastercard self-custody avec 2% cashback en USDC, jusqu'à 20% sur certaines catégories, aucun frais. Disponible en France et dans l'UE.",
  },
  {
    slug: 'plutus-card',
    cardName: 'Plutus Card',
    badge: '3-9% cashback PLU',
    keyStats: { cashbackMax: "Jusqu'à 9 % en PLU (avec staking max + perks)", stakingRequis: '0 (Starter) — jusqu\'à 8 000 PLU (Legend)', fraisAnnuels: '6,99 €/mois Starter (83,88 €/an)', disponibilite: 'France, UE, Royaume-Uni' },
    pros: ["3 % de cashback en PLU dès le plan Starter (sans staking)","Jusqu'à 9 % de cashback avec staking PLU et perks cumulés","Perks : 100 % cashback Netflix, Spotify, Amazon, PlayStation (selon niveau)","Non-custodial — vous contrôlez vos PLU","Disponible en France, UE et Royaume-Uni depuis 2015","Plus de 50 perks disponibles au catalogue"],
    cons: ["Abonnement mensuel obligatoire dès le Starter (6,99 €/mois)","Plan gratuit supprimé en 2026","Plafond de dépenses éligibles au cashback limité (250 £/mois en Starter)","Cashback versé en PLU — token volatil et peu liquide","Frais FX de 2,5 % en devises étrangères","Staking PLU élevé pour les meilleurs taux (8 000 PLU ≈ plusieurs milliers d'euros)"],
    verdict: "Plutus offre le cashback le plus élevé sans staking immédiat (3 % dès le Starter), mais l'abonnement mensuel obligatoire de 6,99 € réduit la rentabilité réelle. Les perks (Netflix, Spotify gratuits) peuvent compenser si vous les utilisez tous.",
    sections: {
      presentation: "**Plutus** est l'une des pionnières des cartes crypto en Europe, fondée en 2015. C'est une Visa non-custodiale disponible au Royaume-Uni et dans l'EEA. La carte fonctionne sur un système de niveaux basés sur le staking PLU (le token natif Plutus) et sur un abonnement mensuel.",
      cashback: "Le cashback est versé en **PLU (token Plutus)** et varie selon le plan : 3 % Starter, 4 % Everyday, 5 % Premium, 6 % Hero, 7 % Veteran, 8 % Legend. Les **perks** permettent d'ajouter jusqu'à 1 % supplémentaire. Le taux combiné peut atteindre **9 %** au niveau Legend.",
      frais: "Abonnement obligatoire : **6,99 €/mois** (Starter) jusqu'à **49,99 €/mois** (Legend). Frais de change en devises étrangères : **2,5 %**. Carte physique : **9,99 £** d'émission.",
      securite: "Plutus est régulé dans l'UE et au Royaume-Uni sous licence EMI. La carte est émise par un partenaire agréé FCA. Les PLU sont non-custodials — vous gérez votre wallet. Plutus a un historique de 10 ans sans incident majeur de sécurité.",
      experience: "L'application Plutus est disponible sur iOS et Android. La gestion des perks, du staking PLU et du cashback se fait depuis l'app. La carte est compatible Apple Pay. Le support client est disponible par chat.",
    },
    metaTitle: 'Plutus Card Avis 2026 — Cashback 3-9% en PLU, Perks Netflix Spotify',
    metaDescription: "Avis Plutus Card 2026 : Visa non-custodiale avec 3% cashback PLU sans staking, jusqu'à 9% avec staking max. Perks Netflix, Spotify, Amazon. Disponible en France.",
  },
  {
    slug: 'gnosis-pay-card',
    cardName: 'Gnosis Pay Card',
    badge: 'On-chain Visa',
    keyStats: { cashbackMax: "Jusqu'à 5 % en GNO", stakingRequis: '≥ 0,1 GNO (pour 1 %) — jusqu\'à 100 GNO+ (pour 4-5 %)', fraisAnnuels: '0 € (30 € one-time à l\'émission)', disponibilite: 'Europe (UE + UK)' },
    pros: ["Seule carte Visa directement connectée à la blockchain (Gnosis Chain)","Self-custody réel — vos fonds restent dans votre Safe wallet","Cashback en GNO (jusqu'à 5 %) sur les dépenses hebdomadaires","Paiement en EURe (stablecoin euro on-chain) directement depuis votre wallet","Aucun frais annuel (30 € one-time seulement)","Compatible Apple Pay et Google Pay","Pas d'exchange centralisé impliqué"],
    cons: ["Configuration technique — nécessite un Safe wallet et des bases Web3","Pas accessible aux débutants","Stabilisation fee de ~1,5 % sur les paiements EURe","Volume de dépenses hebdomadaires plafonné selon les GNO détenus","GNO est un token peu liquide, à faible capitalisation","Pas de Trustpilot établi"],
    verdict: "Gnosis Pay est la carte la plus innovante du marché pour les utilisateurs avancés Web3 : paiement directement depuis un Safe wallet, zéro intermédiaire centralisé, cashback en GNO. En revanche, elle est trop technique pour le grand public.",
    sections: {
      presentation: "**Gnosis Pay** est le projet de paiement de la Gnosis Chain. C'est la première carte Visa au monde directement connectée à la blockchain : vos fonds restent dans un **Safe wallet** non-custodial et sont convertis en EURe au moment du paiement. Aucun exchange centralisé n'est impliqué.",
      cashback: "Le cashback est versé en **GNO** selon les GNO détenus dans votre Safe : 1 % avec ≥ 0,1 GNO, 2 % avec ≥ 1 GNO, 3 % avec ≥ 10 GNO, 4 % avec ≥ 100 GNO. Un bonus de 1 % supplémentaire est accordé aux détenteurs du NFT OG Gnosis Pay (5 % maximum).",
      frais: "**Aucun frais annuel** (30 € de frais d'émission one-time pour la carte physique). Un **stabilization fee de ~1,5 %** s'applique lors de la conversion des cryptos en EURe. Aucun frais supplémentaire sur les dépenses en zone euro.",
      securite: "Gnosis Pay offre la sécurité maximale du marché : vos fonds sont dans un **Safe multisig**. Aucun exchange centralisé ne détient vos actifs. La Gnosis Chain est une blockchain publique auditée et décentralisée.",
      experience: "La configuration de Gnosis Pay requiert de créer un **Safe wallet** sur la Gnosis Chain. Une fois configurée, l'utilisation est identique à une carte Visa classique. Compatible Apple Pay. Le support est disponible via la communauté Discord Gnosis.",
    },
    metaTitle: 'Gnosis Pay Card Avis 2026 — La Carte Visa On-Chain avec Cashback GNO',
    metaDescription: "Avis Gnosis Pay Card 2026 : seule carte Visa directement sur blockchain, self-custody Safe wallet, cashback jusqu'à 5% en GNO. Pour utilisateurs Web3 avancés en Europe.",
  },
  {
    slug: 'trade-republic-card',
    cardName: 'Trade Republic Card',
    badge: '1% Saveback ETF',
    keyStats: { cashbackMax: '2 % Saveback en payant avec crypto', stakingRequis: "Aucun (plan d'épargne 50 €/mois requis)", fraisAnnuels: '0 € (5 € one-time pour la carte physique)', disponibilite: 'France, Allemagne, Espagne, Italie et UE' },
    pros: ["1 % Saveback automatique en ETF ou crypto sur chaque achat","2 % Saveback quand vous payez directement avec votre crypto","Aucun frais annuel (5 € one-time seulement)","IBAN européen inclus avec transferts SEPA","Aucun frais de change en zone euro","Plateforme régulée BaFin (Allemagne) — très haute sécurité réglementaire","8 % d'intérêts sur les liquidités (jusqu'à un certain seuil)","Application très bien notée et intuitive"],
    cons: ["Le Saveback va dans des ETF/actions/crypto — pas de cashback cash direct","Plan d'épargne mensuel de 50 € obligatoire pour garder le Saveback","Plafond Saveback : 15 €/mois (cash) ou 30 €/mois (crypto payment)","Pas réellement une carte crypto native — c'est une carte de brokerage","Retraits DAB limités à 1 500 €/jour"],
    verdict: "Trade Republic n'est pas une carte crypto au sens strict, mais c'est l'une des meilleures cartes pour les investisseurs européens : chaque achat est automatiquement investi (ETF, actions, ou crypto). Si vous êtes déjà client Trade Republic ou que vous voulez investir passivement sans effort, c'est une carte difficile à battre en Europe.",
    sections: {
      presentation: "**Trade Republic** est le broker en ligne le plus populaire d'Europe avec plus de 8 millions d'utilisateurs. Sa carte Visa inclut le **Saveback** : 1 % de chaque paiement est automatiquement investi dans l'actif de votre choix (ETF, actions, Bitcoin, ETH…).",
      cashback: "Le Saveback fonctionne ainsi : **1 %** de chaque achat payé avec vos liquidités est investi automatiquement dans votre plan d'épargne mensuel. **2 %** si vous payez directement avec vos cryptomonnaies. Condition : maintenir un plan d'épargne mensuel actif de minimum 50 €.",
      frais: "La carte est **gratuite** (5 € one-time pour la carte physique Classic). Aucun frais de change dans la zone euro. Les dépôts génèrent **8 % d'intérêts annuels** (selon conditions). Aucun frais de garde ni de transaction sur les ETF.",
      securite: "Trade Republic est régulé par la **BaFin** et dispose d'une licence bancaire complète depuis 2023. Les fonds cash sont protégés par le **fonds de garantie des dépôts allemand** jusqu'à 100 000 €.",
      experience: "L'application Trade Republic est l'une des mieux notées du secteur (4,7/5 App Store). Interface épurée, achat d'ETF/crypto en 3 clics. Compatible Apple Pay et Google Pay. SEPA instantané inclus.",
    },
    metaTitle: 'Trade Republic Card Avis 2026 — 1% Saveback Automatique en ETF ou Crypto',
    metaDescription: "Avis Trade Republic Card 2026 : Visa gratuite avec 1% Saveback automatique en ETF ou crypto, 2% en payant avec crypto. Régulée BaFin. Disponible en France et UE.",
  },
  {
    slug: 'deblock-card',
    cardName: 'Deblock Card',
    badge: 'Néobanque française',
    keyStats: { cashbackMax: '1 % (plan Premium)', stakingRequis: 'Aucun', fraisAnnuels: '0 € (plan Standard gratuit)', disponibilite: 'France, UE (IBAN français)' },
    pros: ["IBAN français — virements SEPA instantanés inclus","Wallet self-custody intégré (vous gardez vos clés privées)","Première fintech française agréée MiCA par l'AMF (n° A2025-001)","Régulée ACPR en tant qu'établissement de monnaie électronique","Aucun staking requis pour le cashback","Accès à plus de 150 cryptomonnaies","Cartes virtuelles à usage unique (sécurité en ligne)","Compatible Apple Pay et Google Pay","Fonctionnalité d'arrondi automatique en Bitcoin sur chaque achat"],
    cons: ["Cashback limité à 1 % sur le plan Premium (payant)","Plan Standard sans cashback","Plafond de retrait DAB gratuit faible en Standard (100 €/mois)","Relativement jeune (fondée en 2022) — historique limité","Cryptos disponibles moins nombreuses que les grands exchanges"],
    verdict: "Deblock est la meilleure carte crypto pour les Français qui veulent garder le contrôle de leurs actifs (self-custody) tout en bénéficiant d'un vrai compte courant français. La régulation AMF + ACPR + MiCA en fait l'option la plus sécurisée réglementairement du marché français.",
    sections: {
      presentation: "**Deblock** est une néobanque française fondée en 2022 par d'anciens dirigeants de Revolut et Ledger. Elle combine un compte courant avec IBAN français et une carte Visa avec un portefeuille crypto en self-custody. En 2025, Deblock est devenue la première entreprise française à obtenir l'agrément CASP sous MiCA auprès de l'AMF.",
      cashback: "Le cashback est disponible uniquement sur les plans **Premium** (14,99 €/mois ou 10 €/mois en annuel). Le taux est de **1 % sur tous les achats**, crédité directement dans la crypto de votre choix. En mai 2026, Deblock a introduit l'**arrondi automatique en Bitcoin** : chaque paiement peut être arrondi à l'euro supérieur, la différence étant automatiquement investie en BTC.",
      frais: "Le plan **Standard est entièrement gratuit** : carte Visa physique et virtuelle, IBAN FR, virements SEPA inclus, retraits DAB jusqu'à 100 €/mois sans frais. Les frais de change crypto en Standard sont de 1,99 %. Le plan **Premium** réduit ce spread à 0,49 %.",
      securite: "Deblock est l'acteur le mieux régulé du marché français des cartes crypto : **agréée ACPR** (établissement de monnaie électronique), **agréée AMF** sous MiCA (n° A2025-001 — première en France). Le wallet crypto est en **self-custody** : vos clés privées ne sont jamais détenues par Deblock.",
      experience: "L'application Deblock est disponible sur iOS et Android et est très bien notée pour sa simplicité. La carte est compatible **Apple Pay** et **Google Pay**. Le support client est disponible en français via chat in-app.",
    },
    metaTitle: 'Deblock Card Avis 2026 — Néobanque Française Avec Wallet Crypto Self-Custody',
    metaDescription: "Avis complet Deblock 2026 : IBAN français, wallet self-custody, régulation AMF + MiCA, cashback 1 %. La néobanque crypto la mieux régulée en France.",
  },
  {
    slug: 'kraken-card',
    cardName: 'Kraken Krak Card',
    badge: 'Exchange US sécurisé',
    keyStats: { cashbackMax: '1-2 % en crypto (selon actif choisi)', stakingRequis: 'Aucun', fraisAnnuels: '0 €', disponibilite: 'UE (France, Allemagne, Espagne, Italie…)' },
    pros: ["Kraken : l'exchange US le plus sécurisé de l'histoire (jamais hacké)","Zéro frais annuels","Cashback en crypto au choix (BTC, ETH, SOL…)","Aucun staking requis pour le cashback","Disponible dans toute l'UE dont la France","Compatible Apple Pay et Google Pay","Interface Kraken de référence pour les traders avancés","Support client reconnu comme l'un des meilleurs du secteur"],
    cons: ["Cashback modeste (1-2%) comparé aux cartes des exchanges asiatiques","Fonds hébergés sur l'exchange Kraken (pas de self-custody)","Kraken basé aux États-Unis — soumis aux réglementations US","Moins de tokens pris en charge que certains concurrents","KYC complet requis"],
    verdict: "La carte Kraken est le meilleur choix pour les utilisateurs qui privilégient la sécurité et la fiabilité d'un exchange éprouvé. Kraken n'a jamais subi de hack majeur depuis sa création en 2011, ce qui en fait l'acteur le plus sûr du secteur. Le cashback de 1-2% est modeste mais sans staking.",
    sections: {
      presentation: "**Kraken** est l'un des plus anciens exchanges crypto (fondé en 2011 à San Francisco), et reste l'une des seules grandes plateformes à n'avoir jamais subi de hack majeur. La carte **Krak Card** est la carte Visa officielle de Kraken, disponible en Europe.",
      cashback: "Le cashback est de **1% à 2%** sur tous les paiements, crédité dans la **crypto de votre choix** parmi les actifs disponibles sur Kraken (BTC, ETH, SOL, XRP, USDC, etc.). Aucun staking ni détention minimale de token n'est requis.",
      frais: "La carte Krak est **entièrement gratuite** : aucun frais annuel, aucun frais de carte. Les frais de change en devises étrangères sont nuls. Kraken applique des frais de trading habituels sur l'exchange.",
      securite: "Kraken est **l'exchange le plus sécurisé du secteur** : fondé en 2011, il n'a jamais subi de hack majeur. La plateforme est régulée aux États-Unis (FinCEN), au Royaume-Uni (FCA), et en Europe (BaFin, AMF).",
      experience: "L'application Kraken Pro est l'une des mieux notées du secteur pour les traders avancés. La gestion de la carte est intégrée directement dans l'app Kraken. Compatible **Apple Pay** et **Google Pay**. Le support client Kraken est disponible 24h/24.",
    },
    metaTitle: 'Kraken Krak Card Avis 2026 — Cashback 1-2% Sans Staking, Exchange le Plus Sûr',
    metaDescription: "Avis complet Kraken Krak Card 2026 : carte Visa gratuite avec cashback 1-2% en crypto au choix, sans staking. L'exchange crypto le plus sécurisé depuis 2011. Disponible en France et UE.",
  },
  {
    slug: 'metamask-card',
    cardName: 'MetaMask Card',
    badge: 'Web3 native',
    keyStats: { cashbackMax: '1-3 % en ETH', stakingRequis: 'Aucun', fraisAnnuels: '199 €/an', disponibilite: 'France, UE' },
    pros: ["Connectée directement à votre wallet MetaMask — vraie self-custody","Cashback 1-3% en ETH sur tous les paiements","Compatible avec tous les tokens EVM (ETH, USDC, WBTC, DAI, MATIC…)","Aucun staking requis","Acceptée dans 200+ pays via Mastercard","Apple Pay et Google Pay compatibles","Frais de change FX nuls"],
    cons: ["Frais annuels élevés : 199 €/an","Réservée aux utilisateurs maîtrisant les wallets crypto","Support moins réactif que les néobanques","Pas d'IBAN"],
    verdict: "MetaMask Card est la carte de référence pour les utilisateurs Web3 confirmés qui souhaitent dépenser leurs actifs EVM sans renoncer à la self-custody. Les 199€ annuels la rendent peu compétitive face aux cartes gratuites, mais la proposition unique (MetaMask natif + self-custody + cashback ETH) justifie l'investissement pour les vrais maximalists Ethereum.",
    sections: {
      presentation: "**MetaMask Card** est la carte Mastercard officielle de MetaMask, le wallet Web3 le plus utilisé au monde avec plus de 30 millions d'utilisateurs actifs. Développée par **ConsenSys**, elle est directement connectée à votre wallet MetaMask.",
      cashback: "Le cashback est de **1% à 3%** en ETH, crédité directement dans votre wallet MetaMask. Aucun staking de token propriétaire n'est requis — le cashback est universel sur tous les paiements.",
      frais: "La carte MetaMask coûte **199 €/an** — l'un des frais les plus élevés du marché. En contrepartie : zéro frais de change sur les transactions en devises étrangères.",
      securite: "La sécurité est le point fort de MetaMask Card : vos fonds restent dans votre **wallet MetaMask en self-custody**. ConsenSys est l'une des entreprises Ethereum les plus établies (fondée par Joe Lubin, co-fondateur d'Ethereum).",
      experience: "L'expérience est conçue pour les utilisateurs avancés déjà familiers avec MetaMask. La gestion de la carte se fait via l'application MetaMask. Compatible **Apple Pay** et **Google Pay**.",
    },
    metaTitle: 'MetaMask Card Avis 2026 — Cashback ETH Self-Custody, 199€/an',
    metaDescription: "Avis MetaMask Card 2026 : carte Mastercard Web3 native avec 1-3% cashback en ETH, self-custody, compatible tokens EVM. 199€/an. Disponible en France et UE.",
  },
  {
    slug: 'ether-fi-card',
    cardName: 'Ether.fi Cash',
    badge: 'DeFi native',
    keyStats: { cashbackMax: '2-3 % en ETH ou weETH', stakingRequis: 'Aucun', fraisAnnuels: '0 €', disponibilite: 'France, UE' },
    pros: ["Zéro frais annuels","Cashback 2-3% en ETH sur tous les paiements","Self-custody — vos fonds restent dans votre wallet Ether.fi","Accès natif au restaking via EigenLayer (weETH)","Compatible ETH, USDC, USDT, WBTC","DeFi native — intégration parfaite avec l'écosystème Ethereum","Aucun staking de token propriétaire requis"],
    cons: ["Nécessite une bonne connaissance de DeFi","Protocole jeune (2022) — historique limité","Support client moins développé que les acteurs établis","Disponibilité géographique en expansion"],
    verdict: "Ether.fi Cash est la meilleure carte crypto pour les utilisateurs DeFi qui veulent maintenir leur exposition ETH/EigenLayer tout en dépensant. Zéro frais + 2-3% cashback ETH + self-custody = combinaison imbattable pour les holders ETH actifs.",
    sections: {
      presentation: "**Ether.fi** est un protocole de **liquid restaking** sur Ethereum, fondé en 2022. Son produit **Cash** est une carte Visa connectée à votre wallet Ether.fi qui vous permet de dépenser vos actifs crypto tout en maintenant votre exposition au restaking EigenLayer.",
      cashback: "Le cashback est de **2% à 3%** en ETH ou weETH, crédité directement dans votre wallet Ether.fi. Aucun staking de token propriétaire n'est requis. Le weETH génère en plus un rendement de restaking EigenLayer.",
      frais: "La carte Ether.fi Cash est **entièrement gratuite** : 0 € de frais annuels. Zéro frais de change en devises étrangères. C'est l'une des rares cartes combinant cashback généreux (2-3%) et zéro frais.",
      securite: "Ether.fi maintient la **self-custody** : vos fonds restent dans votre wallet Ether.fi. La société est auditée par des firmes reconnues (Trail of Bits, Sigma Prime). Le protocole gère plusieurs milliards de dollars de TVL via EigenLayer.",
      experience: "L'application Ether.fi est disponible sur iOS et Android. La configuration initiale nécessite une familiarisation avec les wallets crypto et DeFi. Interface en anglais principalement — support disponible via Discord et email.",
    },
    metaTitle: 'Ether.fi Cash Avis 2026 — Carte DeFi, 2-3% Cashback ETH, Self-Custody',
    metaDescription: "Avis Ether.fi Cash 2026 : carte Visa DeFi native avec 2-3% cashback en ETH, self-custody, accès EigenLayer restaking. Gratuite. Disponible en France et UE.",
  },
  {
    slug: 'bitget-card',
    cardName: 'Bitget Card',
    badge: 'Top 5 exchange mondial',
    keyStats: { cashbackMax: 'Aucun sur le plan standard', stakingRequis: 'Aucun', fraisAnnuels: '0 €', disponibilite: 'France, UE, 180+ pays' },
    pros: ["Zéro frais annuels et zéro frais de carte","Intégration directe avec le compte Bitget","Conversion instantanée BTC, ETH, BGB, USDT, USDC","Acceptée dans 180+ pays via Visa","Apple Pay et Google Pay compatibles","Disponible en France et dans toute l'UE"],
    cons: ["Cashback nul sur le plan standard","Nécessite un compte Bitget actif","Fonds sur l'exchange (pas de self-custody)","Bitget basé aux Seychelles — régulation offshore","Support en français limité"],
    verdict: "La carte Bitget convient parfaitement aux utilisateurs déjà actifs sur l'exchange Bitget qui souhaitent accéder facilement à leurs fonds dans la vie quotidienne. L'absence de cashback sur le plan standard est un point négatif, mais la simplicité d'utilisation et les zéro frais compensent.",
    sections: {
      presentation: "**Bitget** est l'un des cinq plus grands exchanges crypto mondiaux (fondé en 2018), reconnu pour son service de **copy trading** et ses produits dérivés. La **Bitget Card** est la carte Visa officielle permettant de dépenser directement les actifs de votre compte Bitget.",
      cashback: "Le plan standard de la Bitget Card **ne propose pas de cashback**. Bitget propose des programmes de récompenses périodiques via son système de points et campagnes promotionnelles.",
      frais: "La carte Bitget est **entièrement gratuite** : 0 € de frais annuels. Zéro frais de change en devises étrangères (conversion au taux spot Bitget).",
      securite: "Bitget dispose d'un **fonds de protection de 300 M$** (Bitget Protection Fund). L'exchange est régulé dans plusieurs juridictions. Bitget est **basé aux Seychelles**, ce qui représente une régulation moins contraignante qu'en UE.",
      experience: "L'application Bitget est disponible sur iOS et Android et est intuitive pour les traders. La carte se gère directement dans l'app. Compatible **Apple Pay** et **Google Pay**. Support client disponible 24h/24 en anglais.",
    },
    metaTitle: 'Bitget Card Avis 2026 — Carte Visa Crypto Sans Frais, Top 5 Exchange',
    metaDescription: "Avis Bitget Card 2026 : carte Visa crypto sans frais annuels, intégration directe exchange Bitget. Disponible en France et 180+ pays. Cashback limité sur le plan standard.",
  },
  {
    slug: 'kucard',
    cardName: 'KuCard',
    badge: 'Exchange 2017',
    keyStats: { cashbackMax: '1-3 % en KCS', stakingRequis: 'Détention de KCS recommandée', fraisAnnuels: '0 €', disponibilite: 'France, UE' },
    pros: ["Zéro frais annuels","Cashback 1-3% en KCS sur tous les paiements","Intégration directe avec le compte KuCoin","KuCoin : l'un des exchanges les plus anciens (2017)","Disponible en France et dans toute l'UE","Acceptée dans 180+ pays via Visa"],
    cons: ["Cashback en KCS — token volatile","Fonds sur l'exchange (pas de self-custody)","KuCoin basé aux Seychelles — régulation offshore","KuCoin a été sanctionné par le DOJ US en 2024","Support en français limité"],
    verdict: "La KuCard convient aux utilisateurs actifs sur KuCoin qui souhaitent un cashback en KCS sur leurs dépenses quotidiennes. L'ancienneté de l'exchange (2017) est un point positif, mais la sanction DOJ US en 2024 et la régulation offshore restent des points de vigilance.",
    sections: {
      presentation: "**KuCoin** est l'un des exchanges crypto les plus anciens et les plus importants au monde, fondé en 2017 à Singapour. La **KuCard** est la carte Visa officielle de KuCoin, disponible en Europe et dans 180+ pays.",
      cashback: "Le cashback est de **1% à 3%** en KCS (KuCoin Token), crédité directement dans votre compte KuCoin. Le taux de cashback augmente avec votre niveau de détention de KCS.",
      frais: "La KuCard est **entièrement gratuite** : 0 € de frais annuels. Aucun frais de change en devises étrangères. Les frais de trading standard de KuCoin s'appliquent lors de la conversion crypto.",
      securite: "KuCoin a subi un **hack important en 2020** (285 M$ dérobés) mais a intégralement remboursé les utilisateurs. En 2024, KuCoin a accepté un accord avec le DOJ américain pour défaut de programme AML/KYC.",
      experience: "L'application KuCoin est disponible sur iOS et Android. La KuCard se gère dans l'onglet dédié de l'app. Compatible **Apple Pay** et **Google Pay**. Interface disponible en plusieurs langues dont le français.",
    },
    metaTitle: 'KuCard Avis 2026 — Carte Visa KuCoin, Cashback 1-3% en KCS',
    metaDescription: "Avis KuCard 2026 : carte Visa de KuCoin avec cashback 1-3% en KCS, zéro frais annuels. L'exchange crypto depuis 2017. Disponible en France et UE.",
  },
  {
    slug: 'young-platform-card',
    cardName: 'Young Platform Card',
    badge: 'N°1 Italie — MiCA',
    keyStats: { cashbackMax: '0,3-3,6 % en YNG', stakingRequis: 'Détention YNG pour les niveaux élevés', fraisAnnuels: '0 €', disponibilite: 'Principalement Italie' },
    pros: ["Première plateforme crypto italienne agréée MiCA","Cashback 0,3% à 3,6% en YNG selon le niveau","Zéro frais annuels","Leader incontestable du marché crypto en Italie","Interface et support en italien natif","Plus de 200 cryptomonnaies disponibles","Application mobile très bien notée"],
    cons: ["Principalement disponible en Italie","Cashback en YNG — token de la plateforme, moins liquide","Cashback de base faible (0,3%) sans staking","Moins connu en dehors de l'Italie"],
    verdict: "Young Platform est la référence absolue pour les utilisateurs italiens : première plateforme crypto italienne, agréée MiCA, avec une carte Visa gratuite et un cashback jusqu'à 3,6% en YNG. Si vous êtes en Italie, c'est le choix évident.",
    sections: {
      presentation: "**Young Platform** est la principale plateforme crypto italienne, fondée à Turin en 2019. Avec plus d'1 million d'utilisateurs enregistrés en Italie. En 2025, Young Platform est devenue la **première plateforme crypto italienne certifiée MiCA**.",
      cashback: "Le cashback varie de **0,3% (niveau Bronze)** à **3,6% (niveau Platinum)** en token YNG. Pour atteindre les niveaux supérieurs, il faut détenir un montant croissant de YNG. Le cashback est crédité en YNG directement dans votre compte Young Platform.",
      frais: "La carte Young Platform est **entièrement gratuite** : 0 € de frais annuels. Aucun frais de change dans la zone euro. Les frais de trading sur l'exchange sont parmi les plus compétitifs du marché italien.",
      securite: "Young Platform est **agréée MiCA** (première en Italie) et suit les plus hauts standards de sécurité européens. La plateforme est régulée par les autorités financières italiennes (OAM). Young Platform n'a jamais subi de hack ou d'incident de sécurité majeur depuis 2019.",
      experience: "L'application Young Platform est disponible sur iOS et Android et est **très bien notée** par les utilisateurs italiens (4,6/5 App Store). Interface entièrement en **italien**, support client en italien.",
    },
    metaTitle: 'Young Platform Card Avis 2026 — Carte Crypto N°1 Italie, Cashback YNG',
    metaDescription: "Avis Young Platform Card 2026 : carte Visa crypto leader en Italie. Cashback 0,3-3,6% en YNG, zéro frais, agréée MiCA. La plateforme crypto de référence pour les Italiens.",
  },
  {
    slug: 'bit2me-card',
    cardName: 'Bit2Me Card',
    badge: "N°1 Espagne depuis 2014",
    keyStats: { cashbackMax: '2-7 % en B2M', stakingRequis: 'Détention B2M pour les niveaux élevés', fraisAnnuels: '0 €', disponibilite: 'Principalement Espagne' },
    pros: ["Exchange crypto le plus ancien d'Espagne (depuis 2014)","Cashback 2-7% en B2M sur tous les paiements","Zéro frais annuels","Régulé par la CNMV espagnole","Support en espagnol natif","Plus de 100 cryptomonnaies disponibles","Première société espagnole à obtenir la licence VASP complète"],
    cons: ["Principalement disponible en Espagne","Cashback en B2M — token moins liquide que ETH/BTC","Présence limitée hors du marché hispanophone"],
    verdict: "Bit2Me est le choix incontournable pour les utilisateurs espagnols souhaitant une carte crypto de confiance avec un cashback généreux. Avec 10 ans d'expérience, la régulation CNMV et jusqu'à 7% de cashback en B2M, c'est l'offre la plus complète et la plus régulée du marché espagnol.",
    sections: {
      presentation: "**Bit2Me** est l'exchange crypto le plus ancien d'Espagne, fondé à Valence en **2014** par Leif Ferreira. Avec plus d'1 million d'utilisateurs, c'est la plateforme de référence du marché crypto espagnol. Bit2Me a été la **première société espagnole à obtenir la licence VASP complète**.",
      cashback: "Le cashback varie de **2% (niveau Base)** à **7% (niveau Elite)** en token B2M. Les niveaux sont déterminés par votre détention de B2M. Le cashback est crédité en B2M directement dans votre compte Bit2Me.",
      frais: "La carte Bit2Me est **entièrement gratuite** : 0 € de frais annuels. Aucun frais de change dans la zone euro.",
      securite: "Bit2Me est **régulé par la CNMV** et la Banco de España. La plateforme n'a jamais subi de hack majeur depuis 2014. Bit2Me est également l'une des premières plateformes espagnoles à avoir entamé son processus d'agrément MiCA.",
      experience: "L'application Bit2Me est disponible sur iOS et Android avec une interface entièrement en **espagnol**. Support client en espagnol disponible 24h/24. Compatible avec les principaux wallets mobiles.",
    },
    metaTitle: 'Bit2Me Card Avis 2026 — Carte Crypto N°1 Espagne, Cashback 2-7% B2M',
    metaDescription: "Avis Bit2Me Card 2026 : carte Mastercard de l'exchange espagnol depuis 2014. Cashback 2-7% en B2M, zéro frais, régulé CNMV. La référence du marché crypto espagnol.",
  },
  {
    slug: 'brighty-card',
    cardName: 'Brighty Card',
    badge: 'App épargne EU',
    keyStats: { cashbackMax: '0,5-1,75 % en crypto', stakingRequis: 'Aucun', fraisAnnuels: '0 €', disponibilite: 'France, Allemagne, Espagne, Italie' },
    pros: ["Zéro frais annuels","IBAN européen inclus (virements SEPA)","Disponible en France, Allemagne, Espagne et Italie","Interface simple adaptée aux débutants","Fonctionnalités d'épargne automatique en crypto","Compatible BTC, ETH, USDC, USDT, SOL"],
    cons: ["Cashback faible (0,5-1,75%)","Protocole jeune (2022)","Pas d'Apple Pay / Google Pay","Plafond de retrait DAB bas (3 000 €/mois)","Support principalement en anglais"],
    verdict: "Brighty est une option solide pour les utilisateurs européens cherchant une carte crypto simple avec IBAN et fonctionnalités d'épargne, sans frais. Le cashback est modeste mais l'application est bien conçue.",
    sections: {
      presentation: "**Brighty** est une application de savings et de crypto fondée en **2022** à Varsovie, Pologne. Elle propose une approche hybride : compte courant (IBAN européen) + wallet crypto + carte Visa. L'accent est mis sur **l'épargne automatique** et la gestion simplifiée des actifs crypto et fiat.",
      cashback: "Le cashback est de **0,5%** sur le plan Starter et peut atteindre **1,75%** sur le plan Premium. Il est crédité en crypto (BTC, ETH ou USDC selon votre choix). Le cashback est universel sur tous les paiements par carte.",
      frais: "Brighty est **entièrement gratuite** : 0 € de frais annuels. L'IBAN européen et les virements SEPA sont inclus. Aucun frais de change dans la zone euro.",
      securite: "Brighty est émise via **Wireflexion sp. z o.o.**, un établissement de paiement régulé en Pologne (UE). Les fonds fiat sont protégés jusqu'à 100 000 € via le système de garantie des dépôts européen.",
      experience: "L'application Brighty est disponible sur iOS et Android. Interface épurée adaptée aux débutants. La gestion du compte, de la carte et des crypto se fait depuis une seule interface. Support client en anglais principalement.",
    },
    metaTitle: 'Brighty Card Avis 2026 — Carte Visa Crypto EU, IBAN, 0,5-1,75% Cashback',
    metaDescription: "Avis Brighty Card 2026 : carte Visa crypto EU avec IBAN européen et cashback 0,5-1,75%. Zéro frais annuels. Disponible en France, Allemagne, Espagne et Italie.",
  },
  {
    slug: 'whitebit-card',
    cardName: 'WhiteBIT Nóva',
    badge: "Jusqu'à 10% cashback",
    keyStats: { cashbackMax: '1-10 % en WBT', stakingRequis: 'Staking WBT pour les niveaux élevés', fraisAnnuels: '0 €', disponibilite: 'France, UE' },
    pros: ["Cashback jusqu'à 10% en WBT — parmi les plus élevés du marché","Zéro frais annuels","Disponible en France et dans toute l'UE","Apple Pay compatible","Aucun frais de change FX","Retrait DAB gratuit","Exchange WhiteBIT fondé en 2018 — expérience solide"],
    cons: ["Cashback 10% soumis à des conditions de staking WBT importantes","WBT token moins connu — liquidité plus faible que BTC/ETH","WhiteBIT basé en Estonie — moins connu en Europe de l'Ouest","Fonds sur l'exchange (pas de self-custody)"],
    verdict: "WhiteBIT Nóva offre l'un des cashbacks théoriques les plus élevés du marché (10% en WBT), mais ce taux maximal est conditionné à un staking WBT conséquent. Pour les utilisateurs actifs de l'exchange WhiteBIT, c'est une excellente option.",
    sections: {
      presentation: "**WhiteBIT** est l'un des plus grands exchanges crypto d'Europe de l'Est, fondé en **2018** à Tallinn, Estonie. La carte **Nóva** est la carte Visa officielle de WhiteBIT, émise en partenariat avec **Wallester AS** (établissement de paiement régulé en Estonie/UE).",
      cashback: "Le cashback varie de **1% (sans staking)** à **10% (niveau Diamond avec staking WBT maximal)**. Les niveaux intermédiaires : Standard (0 WBT, 1%), Silver (500 WBT, 2%), Gold (5 000 WBT, 5%), Platinum (25 000 WBT, 8%), Diamond (100 000 WBT, 10%). Le cashback est crédité en WBT.",
      frais: "La carte WhiteBIT Nóva est **entièrement gratuite** : 0 € de frais annuels. Zéro frais de change en devises étrangères. Retraits DAB gratuits jusqu'au plafond mensuel.",
      securite: "WhiteBIT est **régulé en Estonie** (UE) et a obtenu le **score de sécurité maximum de CER.live**. La carte est émise via Wallester AS, un établissement de paiement régulé par la Banque d'Estonie.",
      experience: "L'application WhiteBIT est disponible sur iOS et Android. La gestion de la carte Nóva est intégrée dans l'app principale. Interface disponible en plusieurs langues dont le français. Compatible **Apple Pay**.",
    },
    metaTitle: "WhiteBIT Nóva Card Avis 2026 — Jusqu'à 10% Cashback WBT, Zéro Frais",
    metaDescription: "Avis WhiteBIT Nóva Card 2026 : carte Visa avec cashback 1-10% en WBT, zéro frais annuels. Exchange européen depuis 2018. Disponible en France et UE.",
  },
];

// ── Translation prompt ────────────────────────────────────────────────────────
function buildPrompt(card, targetLang) {
  const LANG_NAMES = { de: 'German', es: 'Spanish', it: 'Italian', en: 'English' };
  const langName = LANG_NAMES[targetLang];

  return `You are a professional crypto-finance copywriter. Translate the following card review content from French to ${langName}.

Rules:
- Keep **bold** markdown markers intact
- Keep numbers, percentages, brand names, crypto token names (BTC, ETH, CRO, etc.) unchanged
- Keep the same tone (informative but direct, slight enthusiasm for positives)
- metaTitle and metaDescription must be SEO-optimized in ${langName} (under 60 and 155 chars respectively)
- badge is a short tag (2-4 words max) — translate concisely
- keyStats values should be translated naturally (e.g. "Jusqu'à 8 % en BNB" → "Up to 8% in BNB")
- Do NOT translate proper nouns like card names, platform names
- Return ONLY valid JSON, no markdown code fences, no explanation

Input JSON (French):
${JSON.stringify({
  badge: card.badge,
  keyStats: card.keyStats,
  pros: card.pros,
  cons: card.cons,
  verdict: card.verdict,
  sections: card.sections,
  metaTitle: card.metaTitle,
  metaDescription: card.metaDescription,
}, null, 2)}

Return the same JSON structure translated to ${langName}.`;
}

// ── Claude API call (with retry) ─────────────────────────────────────────────
async function translateCard(card, targetLang, attempt = 1) {
  const prompt = buildPrompt(card, targetLang);

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (networkErr) {
    if (attempt < 3) {
      const wait = attempt * 2000;
      process.stdout.write(` [retry ${attempt}/3 in ${wait/1000}s] `);
      await new Promise(r => setTimeout(r, wait));
      return translateCard(card, targetLang, attempt + 1);
    }
    throw networkErr;
  }

  if (!response.ok) {
    const err = await response.text();
    // Retry on 529 (overloaded) or 5xx
    if ((response.status === 529 || response.status >= 500) && attempt < 3) {
      const wait = attempt * 2000;
      process.stdout.write(` [retry ${attempt}/3 in ${wait/1000}s] `);
      await new Promise(r => setTimeout(r, wait));
      return translateCard(card, targetLang, attempt + 1);
    }
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  // Strip any accidental markdown fences
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  return JSON.parse(clean);
}

// ── Load existing translations (skip already-done entries) ───────────────────
const outputPath = path.join(ROOT, 'src', 'data', 'cardReviewsI18n.ts');
let RESULTS = {};
if (fs.existsSync(outputPath)) {
  try {
    const existing = fs.readFileSync(outputPath, 'utf-8');
    const match = existing.match(/export const REVIEW_I18N[^=]+=\s*(\{[\s\S]*?\});\s*\nexport function/);
    if (match) {
      const parsed = JSON.parse(match[1]);
      // Keep only successfully translated entries (non-null values)
      for (const [k, v] of Object.entries(parsed)) {
        if (v !== null && v !== undefined) RESULTS[k] = v;
      }
      console.log(`\nLoaded ${Object.keys(RESULTS).length} existing translations from ${outputPath}`);
    }
  } catch (e) {
    console.log('\nCould not parse existing file — starting fresh.');
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TARGET_LANGS = ['de', 'es', 'it', 'en'];
const TOTAL = FR_REVIEWS.length * TARGET_LANGS.length;
let done = 0;
let skipped = 0;

const toTranslate = [];
for (const card of FR_REVIEWS) {
  for (const lang of TARGET_LANGS) {
    const key = `${card.slug}__${lang}`;
    if (RESULTS[key]) { skipped++; } else { toTranslate.push({ card, lang, key }); }
  }
}

console.log(`Translating ${toTranslate.length} missing (${skipped} already done) out of ${TOTAL} total\n`);

for (const { card, lang, key } of toTranslate) {
  process.stdout.write(`  [${++done}/${toTranslate.length}] ${card.slug} → ${lang} ... `);

  try {
    const translated = await translateCard(card, lang);
    RESULTS[key] = translated;
    console.log('✓');
  } catch (err) {
    console.log(`✗ ERROR: ${err.message}`);
    // Leave key absent so next run retries it
  }

  // Small delay to avoid rate limits
  await new Promise(r => setTimeout(r, 300));
}

// ── Write output file ─────────────────────────────────────────────────────────

const fileContent = `// ─────────────────────────────────────────────────────────────────────────────
// cardReviewsI18n.ts
// AUTO-GENERATED by scripts/generate-review-translations.mjs
// DO NOT EDIT MANUALLY — re-run the script to regenerate
// Generated: ${new Date().toISOString()}
// ─────────────────────────────────────────────────────────────────────────────

export interface CardReviewI18n {
  badge?: string;
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
  metaTitle: string;
  metaDescription: string;
}

/** Key format: "\${slug}__\${lang}" — e.g. "crypto-com-card__en" */
export const REVIEW_I18N: Record<string, CardReviewI18n> = ${JSON.stringify(RESULTS, null, 2)};

export function getReviewI18n(slug: string, lang: string): CardReviewI18n | undefined {
  if (lang === 'fr') return undefined; // FR content lives in cardReviews.ts
  return REVIEW_I18N[\`\${slug}__\${lang}\`] ?? undefined;
}
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');

const failed = Object.values(RESULTS).filter(v => v === null).length;
console.log(`\n✅ Done! Written to src/data/cardReviewsI18n.ts`);
if (failed > 0) {
  console.log(`⚠️  ${failed} translations failed — re-run the script to retry.`);
}
