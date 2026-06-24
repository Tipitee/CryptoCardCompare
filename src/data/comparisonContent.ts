/**
 * Specific comparison content for the top card pairs.
 * Key format: `${id1}-vs-${id2}` (alphabetically sorted to handle both directions).
 * ComparisonPage.tsx checks both `a-vs-b` and `b-vs-a` orderings.
 */

export interface ComparisonSpecific {
  /** FR intro (replaces generic first block) */
  fr_intro: string;
  /** FR verdict (replaces generic last block) */
  fr_verdict: string;
  /** DE intro */
  de_intro?: string;
  /** DE verdict */
  de_verdict?: string;
  /** EN intro */
  en_intro?: string;
  /** EN verdict */
  en_verdict?: string;
  /** ES intro */
  es_intro?: string;
  /** ES verdict */
  es_verdict?: string;
  /** IT intro */
  it_intro?: string;
  /** IT verdict */
  it_verdict?: string;
  /** FAQ items (FR) */
  faq?: { q: string; a: string }[];
}

/** Normalize a pair key so order doesn't matter */
export function normalizePairKey(id1: string, id2: string): string {
  return [id1, id2].sort().join('-vs-');
}

const COMPARISONS: Record<string, ComparisonSpecific> = {

  // ─── Nexo Card vs Bybit Card ─────────────────────────────────────────────────
  'bybit-card-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Bybit Card sont deux des cartes crypto les plus populaires en Europe, mais elles s'adressent à des profils très différents. La Nexo Card offre jusqu'à 2 % de cashback en BTC ou NEXO sans aucun staking requis — un avantage considérable pour les utilisateurs qui ne souhaitent pas immobiliser de capital. La Bybit Card propose quant à elle un cashback pouvant atteindre 10 % en MNT, sans staking non plus mais basé sur le volume mensuel de dépenses. Les deux cartes sont gratuites (0 € de frais annuels) et disponibles en France.`,
    fr_verdict: `Pour les dépenses quotidiennes modérées (moins de 500 €/mois), la Nexo Card est la valeur sûre : 2 % de cashback en BTC garanti, sans condition de volume. Pour les gros dépensiers, la Bybit Card peut débloquer des taux bien supérieurs selon les paliers de cashback MNT. Notre note globale : Nexo Card 4,2/5 vs Bybit Card 4,0/5.`,
    de_intro: `Die Nexo Card und die Bybit Card gehören zu den beliebtesten Krypto-Karten in Europa, richten sich aber an sehr unterschiedliche Profile. Die Nexo Card bietet bis zu 2 % Cashback in BTC oder NEXO ohne jegliche Staking-Anforderungen. Die Bybit Card kann bis zu 10 % Cashback in MNT bieten, ebenfalls ohne Staking, aber abhängig vom monatlichen Ausgabevolumen. Beide Karten sind kostenlos (0 € Jahresgebühr) und in Deutschland verfügbar.`,
    de_verdict: `Für moderate tägliche Ausgaben (unter 500 €/Monat) ist die Nexo Card die sichere Wahl: 2 % Cashback in BTC garantiert, ohne Volumenbedingungen. Für Vielausgeber kann die Bybit Card deutlich höhere Raten auf Basis der MNT-Cashback-Stufen freischalten. Unsere Gesamtbewertung: Nexo Card 4,2/5 vs. Bybit Card 4,0/5.`,
    en_intro: `The Nexo Card and Bybit Card are among the most popular crypto cards in Europe, but they target very different profiles. The Nexo Card offers up to 2% cashback in BTC or NEXO with no staking required — a major advantage for users who don't want to lock up capital. The Bybit Card offers cashback up to 10% in MNT, also without staking but based on monthly spending volume. Both cards are free (€0 annual fees) and available across the EU.`,
    en_verdict: `For moderate daily spending (under €500/month), the Nexo Card is the safe bet: guaranteed 2% cashback in BTC with no volume conditions. For high spenders, the Bybit Card can unlock significantly higher rates through its MNT cashback tiers. Our overall score: Nexo Card 4.2/5 vs Bybit Card 4.0/5.`,
    faq: [
      { q: 'Nexo Card ou Bybit Card : laquelle a le meilleur cashback ?', a: 'La Bybit Card peut atteindre 10 % de cashback en MNT pour les très gros dépensiers, contre 2 % en BTC pour la Nexo Card. Cependant, la Nexo Card ne dépend pas du volume mensuel, ce qui la rend plus prévisible.' },
      { q: 'La Nexo Card nécessite-t-elle du staking ?', a: 'Non. La Nexo Card verse jusqu\'à 2 % de cashback en BTC sans staking obligatoire. Avoir des NEXO en portefeuille peut améliorer le taux, mais c\'est optionnel.' },
      { q: 'La Bybit Card est-elle disponible en France ?', a: 'Oui. La Bybit Card est disponible en France et dans la majorité des pays de l\'UE via Mastercard.' },
    ],
  },

  // ─── Nexo Card vs Crypto.com Midnight Blue ────────────────────────────────────
  'crypto-com-midnight-blue-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Crypto.com Midnight Blue Card représentent deux philosophies opposées : la première récompense sans condition de staking (jusqu'à 2 % en BTC), quand la seconde est la carte d'entrée de gamme de Crypto.com — gratuite, sans staking, mais sans cashback significatif (1 % en CRO). Si vous comparez ces deux cartes, c'est probablement pour savoir laquelle offre le meilleur rapport qualité/prix au quotidien.`,
    fr_verdict: `La Nexo Card l'emporte clairement sur le cashback (2 % BTC vs 1 % CRO pour la Midnight Blue). La Crypto.com Midnight Blue se justifie principalement si vous êtes déjà client Crypto.com et utilisez leur exchange. Pour un nouvel utilisateur cherchant la meilleure carte gratuite sans staking en France, la Nexo Card est le meilleur choix en 2026. Note : Nexo Card 4,2/5 vs Crypto.com Midnight Blue 3,8/5.`,
    en_intro: `The Nexo Card and Crypto.com Midnight Blue represent two opposite philosophies: the first rewards without staking requirements (up to 2% in BTC), while the second is Crypto.com's entry-level card — free, no staking, but limited cashback (1% in CRO). If you're comparing these two, you're likely wondering which offers the best value for everyday spending.`,
    en_verdict: `The Nexo Card clearly wins on cashback (2% BTC vs 1% CRO for the Midnight Blue). The Crypto.com Midnight Blue makes sense mainly if you're already a Crypto.com exchange user. For a new user seeking the best free no-staking card in the EU, the Nexo Card is the top pick in 2026. Score: Nexo Card 4.2/5 vs Crypto.com Midnight Blue 3.8/5.`,
    faq: [
      { q: 'Crypto.com Midnight Blue vs Nexo Card : laquelle choisir sans staking ?', a: 'La Nexo Card offre 2 % de cashback en BTC sans staking, contre seulement 1 % en CRO pour la Midnight Blue. La Nexo Card est supérieure si vous ne souhaitez pas de staking.' },
      { q: 'La Crypto.com Midnight Blue a-t-elle un cashback ?', a: 'Oui, 1 % de cashback en CRO. Sans staking CRO requis, c\'est la carte d\'entrée de gamme de Crypto.com.' },
    ],
  },

  // ─── Nexo Card vs Crypto.com Ruby Steel ─────────────────────────────────────
  'crypto-com-ruby-steel-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Crypto.com Ruby Steel Card sont souvent comparées car elles ciblent un profil similaire : l'investisseur crypto actif cherchant du cashback sans immobiliser des dizaines de milliers d'euros. La Crypto.com Ruby Steel requiert un staking de 400 € en CRO pour un cashback de 2 % en CRO, tandis que la Nexo Card offre 2 % en BTC sans staking obligatoire. La différence clé : la valeur du CRO est volatile, celle du BTC aussi — mais le BTC est généralement considéré comme plus fiable comme réserve de valeur.`,
    fr_verdict: `Pour 2026, les deux cartes sont proches en cashback (2 % chacune), mais la Nexo Card prend l'avantage grâce à l'absence de staking et au cashback en BTC plutôt qu'en token propriétaire (CRO). Si vous détenez déjà des CRO sur Crypto.com, la Ruby Steel peut être logique. Sinon, la Nexo Card est la recommandation par défaut. Note : Nexo Card 4,2/5 vs Crypto.com Ruby Steel 4,0/5.`,
    en_intro: `The Nexo Card and Crypto.com Ruby Steel are often compared as they target a similar profile: active crypto investors seeking cashback without locking up tens of thousands of euros. The Crypto.com Ruby Steel requires €400 CRO staking for 2% cashback in CRO, while the Nexo Card offers 2% in BTC with no mandatory staking. The key difference: CRO is more volatile than BTC.`,
    en_verdict: `For 2026, both cards offer similar cashback (2% each), but the Nexo Card has the edge thanks to no staking requirement and BTC rewards vs. a proprietary token (CRO). If you already hold CRO on Crypto.com, the Ruby Steel makes sense. Otherwise, the Nexo Card is the default recommendation. Score: Nexo Card 4.2/5 vs Crypto.com Ruby Steel 4.0/5.`,
    faq: [
      { q: 'Quel staking faut-il pour la Crypto.com Ruby Steel ?', a: 'La Crypto.com Ruby Steel Card nécessite un staking de 400 € en CRO pendant 180 jours pour obtenir les 2 % de cashback. La Nexo Card n\'impose aucune exigence de staking.' },
      { q: 'Le cashback Nexo est-il en BTC ou en NEXO ?', a: 'Au choix : 2 % en BTC ou 2 % en NEXO. Le cashback en BTC est généralement recommandé pour ceux qui cherchent à accumuler du Bitcoin.' },
    ],
  },

  // ─── Nexo Card vs Wirex Elite ────────────────────────────────────────────────
  'nexo-card-vs-wirex-elite': {
    fr_intro: `La Nexo Card et la Wirex Elite Card sont deux cartes crypto premium ciblant les utilisateurs à la recherche d'un cashback élevé en Europe. La Wirex Elite peut offrir jusqu'à 8 % de cashback en WXT (token natif Wirex), mais nécessite un abonnement mensuel (~9,99 €) et un certain montant de WXT. La Nexo Card propose 2 % en BTC sans abonnement ni staking. En termes de frais totaux, la Wirex Elite coûte ~120 €/an même sans staking.`,
    fr_verdict: `Si vous dépensez plus de 1 500 €/mois et êtes prêt à détenir des WXT, la Wirex Elite peut être rentable grâce à son cashback élevé. En dessous de ce seuil, les frais d'abonnement grignotent le bénéfice. La Nexo Card reste le choix par défaut pour la majorité des utilisateurs en France : 0 € de frais, 2 % BTC, sans contrainte. Note : Nexo Card 4,2/5 vs Wirex Elite 3,5/5.`,
    en_intro: `The Nexo Card and Wirex Elite target premium crypto users seeking high cashback in Europe. The Wirex Elite can offer up to 8% cashback in WXT, but requires a monthly subscription (~€9.99) and some WXT holdings. The Nexo Card offers 2% in BTC with no subscription or staking. In total cost terms, the Wirex Elite costs ~€120/year even without staking.`,
    en_verdict: `If you spend over €1,500/month and are willing to hold WXT, the Wirex Elite can be profitable due to its high cashback. Below that threshold, subscription fees eat into the benefit. The Nexo Card remains the default choice for most EU users: €0 fees, 2% BTC, no constraints. Score: Nexo Card 4.2/5 vs Wirex Elite 3.5/5.`,
    faq: [
      { q: 'La Wirex Elite est-elle vraiment gratuite ?', a: 'Non. La Wirex Elite (plan "Elite") coûte environ 9,99 €/mois. La Nexo Card, elle, est totalement gratuite.' },
      { q: 'Quelle carte offre le cashback le plus élevé ?', a: 'La Wirex Elite peut atteindre 8 % en WXT, contre 2 % en BTC pour la Nexo Card. Mais le WXT est un token plus volatil et moins liquide que le Bitcoin.' },
    ],
  },

  // ─── Bybit Card vs Binance Card ──────────────────────────────────────────────
  'binance-card-vs-bybit-card': {
    fr_intro: `La Bybit Card et la Binance Card sont les deux grandes cartes crypto des exchanges asiatiques disponibles en France. Toutes deux sont gratuites (0 € de frais annuels) et offrent un cashback élevé : jusqu'à 10 % en MNT pour la Bybit Card, jusqu'à 8 % en BNB pour la Binance Card. La Binance Card utilise le BNB (token bien établi, top 5 des cryptos), tandis que la Bybit Card récompense en MNT (Mantle Network). La Binance Card ne bloque pas le BNB sur votre compte — il suffit de le détenir.`,
    fr_verdict: `Les deux cartes sont excellentes pour les cashbacks élevés. La Binance Card marque des points avec le BNB — un token plus liquide et reconnu que le MNT. La Bybit Card peut offrir des taux plus élevés sur les premiers paliers de dépenses. Note globale : Bybit Card 4,0/5 vs Binance Card 3,9/5. Pour un utilisateur Binance actif, la Binance Card est naturelle. Pour un utilisateur Bybit, idem.`,
    en_intro: `The Bybit Card and Binance Card are the two major crypto exchange cards from Asian platforms available in France. Both are free (€0 annual fees) with high cashback: up to 10% in MNT for Bybit, up to 8% in BNB for Binance. The Binance Card rewards in BNB (top-5 crypto), while Bybit rewards in MNT (Mantle Network). The Binance Card doesn't require locking BNB — just holding it.`,
    en_verdict: `Both cards are excellent for high cashback. The Binance Card scores points with BNB — a more liquid and recognized token than MNT. The Bybit Card can offer higher rates on initial spending tiers. Overall score: Bybit Card 4.0/5 vs Binance Card 3.9/5. For active Binance users, the Binance Card is natural. Same for Bybit users.`,
    faq: [
      { q: 'Faut-il bloquer ses BNB pour la Binance Card ?', a: 'Non. La Binance Card nécessite simplement de détenir du BNB sur votre compte Binance, sans blocage (contrairement au staking Crypto.com).' },
      { q: 'Quel est le cashback de la Bybit Card au premier palier ?', a: 'Le cashback Bybit Card varie de 2 % à 10 % en MNT selon les paliers de dépenses mensuelles. Le taux exact par palier est disponible sur le site Bybit.' },
    ],
  },

  // ─── Bybit Card vs Crypto.com Midnight Blue ──────────────────────────────────
  'bybit-card-vs-crypto-com-midnight-blue': {
    fr_intro: `La Bybit Card et la Crypto.com Midnight Blue Card sont deux cartes crypto gratuites sans staking requis, mais leurs cashbacks n'ont rien à voir. La Bybit Card offre jusqu'à 10 % en MNT basé sur le volume de dépenses, quand la Crypto.com Midnight Blue plafonne à 1 % en CRO. La différence principale : la Bybit Card est bien plus récompensante mais nécessite d'être client Bybit ; la Midnight Blue est l'option d'entrée Crypto.com, idéale pour démarrer sans engagement.`,
    fr_verdict: `Si vous cherchez le meilleur cashback sans staking, la Bybit Card gagne sans discussion. La Crypto.com Midnight Blue se justifie surtout si vous utilisez déjà l'app Crypto.com et ne souhaitez pas gérer un compte Bybit supplémentaire. Pour les nouveaux utilisateurs crypto, la Bybit Card est plus avantageuse. Note : Bybit Card 4,0/5 vs Crypto.com Midnight Blue 3,8/5.`,
    en_intro: `The Bybit Card and Crypto.com Midnight Blue are both free crypto cards with no staking required, but their cashback rates are vastly different. The Bybit Card offers up to 10% in MNT based on monthly spending, while the Crypto.com Midnight Blue caps at 1% in CRO. The main difference: the Bybit Card is far more rewarding but requires a Bybit account; the Midnight Blue is Crypto.com's entry option.`,
    en_verdict: `If you want the best no-staking cashback, the Bybit Card wins hands down. The Crypto.com Midnight Blue is justified mainly if you already use the Crypto.com app and don't want to manage an additional Bybit account. For new crypto users, the Bybit Card is more advantageous. Score: Bybit Card 4.0/5 vs Crypto.com Midnight Blue 3.8/5.`,
    faq: [
      { q: 'La Bybit Card nécessite-t-elle du staking ?', a: 'Non. La Bybit Card calcule le cashback sur la base du volume mensuel de dépenses, sans staking de token requis.' },
      { q: 'Combien rapporte la Crypto.com Midnight Blue ?', a: '1 % de cashback en CRO. C\'est la carte d\'entrée de gamme de Crypto.com, sans avantages supplémentaires comme le Netflix gratuit ou les retraits ATM offerts.' },
    ],
  },

  // ─── Nexo Card vs Coinbase Card ──────────────────────────────────────────────
  'coinbase-card-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Coinbase Card sont deux cartes crypto recommandées pour les débutants en France : toutes deux gratuites, sans staking requis, et accessibles facilement. La Coinbase Card offre 4 % de cashback en XLM ou 1 % en BTC — un taux qui semble attractif, mais le XLM (Stellar) est un token risqué. La Nexo Card propose 2 % en BTC de façon stable. La Coinbase Card se distingue par sa sécurité perçue (plateforme réglementée Nasdaq) et sa facilité d'utilisation.`,
    fr_verdict: `Pour un utilisateur débutant valorisant la sécurité et la simplicité, la Coinbase Card est un excellent choix. Pour un utilisateur souhaitant maximiser le cashback en BTC (valeur refuge), la Nexo Card offre 2 % vs 1 % en BTC pour Coinbase (le 4 % en XLM est risqué). Note : Nexo Card 4,2/5 vs Coinbase Card 3,7/5. La Nexo Card l'emporte sur le cashback BTC ; la Coinbase Card sur la réputation réglementaire.`,
    en_intro: `The Nexo Card and Coinbase Card are both recommended for crypto beginners in the EU: free, no staking required, and easy to obtain. The Coinbase Card offers 4% cashback in XLM or 1% in BTC — the XLM rate sounds attractive but Stellar is a risky token. The Nexo Card offers a stable 2% in BTC. The Coinbase Card stands out for its regulatory trust (Nasdaq-listed platform) and ease of use.`,
    en_verdict: `For beginners prioritizing security and simplicity, the Coinbase Card is an excellent choice. For users wanting to maximize BTC cashback, the Nexo Card offers 2% vs Coinbase's 1% in BTC (the 4% XLM option carries token risk). Score: Nexo Card 4.2/5 vs Coinbase Card 3.7/5. Nexo wins on BTC cashback; Coinbase wins on regulatory reputation.`,
    faq: [
      { q: 'Le 4 % de cashback Coinbase vaut-il vraiment 4 % ?', a: 'Attention : le 4 % est versé en XLM (Stellar), un token très volatile. Si vous choisissez 1 % en BTC, vous obtenez moins que la Nexo Card (2 % BTC).' },
      { q: 'La Coinbase Card est-elle disponible en France ?', a: 'Oui, la Coinbase Card Visa est disponible en France et dans la majorité des pays de l\'UE.' },
    ],
  },

  // ─── Nexo Card vs Binance Card ───────────────────────────────────────────────
  'binance-card-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Binance Card sont deux des cartes crypto les plus utilisées en France. La Nexo Card offre 2 % de cashback en BTC sans staking, tandis que la Binance Card peut atteindre 8 % de cashback en BNB selon votre balance BNB sur la plateforme. Les deux cartes sont gratuites. La grande différence : la Nexo Card ne dépend d'aucun token propriétaire volatile, là où la Binance Card vous expose aux variations du BNB.`,
    fr_verdict: `Si vous déteniez déjà des BNB et êtes client Binance actif, la Binance Card est clairement supérieure sur le cashback (jusqu'à 8 % vs 2 %). Pour les utilisateurs qui souhaitent un cashback en BTC simple et sans risque de token, la Nexo Card est plus fiable. Note : Nexo Card 4,2/5 vs Binance Card 3,9/5.`,
    en_intro: `The Nexo Card and Binance Card are two of the most-used crypto cards in France. The Nexo Card offers 2% cashback in BTC without staking, while the Binance Card can reach 8% cashback in BNB depending on your BNB balance on the platform. Both cards are free. The big difference: the Nexo Card doesn't depend on any volatile proprietary token, unlike the Binance Card which exposes you to BNB fluctuations.`,
    en_verdict: `If you already hold BNB and are an active Binance user, the Binance Card is clearly superior on cashback (up to 8% vs 2%). For users wanting simple BTC cashback without token risk, the Nexo Card is more reliable. Score: Nexo Card 4.2/5 vs Binance Card 3.9/5.`,
    faq: [
      { q: 'Le cashback Binance Card est-il vraiment de 8 % ?', a: 'Le taux maximum de 8 % en BNB est réservé aux utilisateurs détenant un solde BNB important. Le taux de base est bien plus bas pour les petits détenteurs.' },
      { q: 'La Nexo Card est-elle disponible en France ?', a: 'Oui. La Nexo Card Mastercard est disponible dans tous les pays de l\'UE, France incluse.' },
    ],
  },

  // ─── OKX Card vs Bybit Card ──────────────────────────────────────────────────
  'bybit-card-vs-okx-card': {
    fr_intro: `La OKX Card et la Bybit Card sont deux cartes crypto issues de grandes plateformes d'exchange asiatiques, toutes deux disponibles en Europe. La Bybit Card offre jusqu'à 10 % de cashback en MNT basé sur le volume de dépenses, tandis que l'OKX Card propose jusqu'à 3 % en fonction du niveau OKB détenu. Les deux cartes sont gratuites (0 € de frais annuels). La Bybit Card est clairement plus généreuse sur le cashback.`,
    fr_verdict: `Pour le cashback, la Bybit Card (jusqu'à 10 % MNT) surpasse l'OKX Card (jusqu'à 3 %). Cependant, l'OKX Card marque des points sur l'interface utilisateur et la disponibilité de support. Si le cashback est votre priorité, choisissez Bybit. Si vous utilisez déjà OKX comme exchange principal, la OKX Card est le choix naturel. Note : Bybit Card 4,0/5 vs OKX Card 3,8/5.`,
    en_intro: `The OKX Card and Bybit Card are both from major Asian exchange platforms, available across Europe. The Bybit Card offers up to 10% cashback in MNT based on spending volume, while the OKX Card offers up to 3% based on OKB holdings. Both cards are free (€0 annual fees). The Bybit Card is clearly more generous on cashback.`,
    en_verdict: `For cashback, the Bybit Card (up to 10% MNT) outperforms the OKX Card (up to 3%). However, the OKX Card scores points on user interface and support availability. If cashback is your priority, choose Bybit. If you're already using OKX as your main exchange, the OKX Card is the natural choice. Score: Bybit Card 4.0/5 vs OKX Card 3.8/5.`,
    faq: [
      { q: 'La OKX Card est-elle disponible en France ?', a: 'Oui, la OKX Card Mastercard est disponible dans l\'UE, France incluse.' },
      { q: 'Quel est le cashback de base de la OKX Card ?', a: 'Le cashback OKX Card dépend de votre niveau de détention OKB. Le taux de base (sans OKB) est généralement autour de 0,5-1 %.' },
    ],
  },

  // ─── Wirex Elite vs Bybit Card ───────────────────────────────────────────────
  'bybit-card-vs-wirex-elite': {
    fr_intro: `La Wirex Elite et la Bybit Card sont deux cartes crypto offrant des cashbacks parmi les plus élevés du marché européen. La Wirex Elite propose jusqu'à 8 % en WXT mais facture ~9,99 €/mois d'abonnement. La Bybit Card offre jusqu'à 10 % en MNT sans aucuns frais ni abonnement. Pour un dépensier modéré, les frais Wirex annulent rapidement l'avantage du cashback.`,
    fr_verdict: `Sur le rapport cashback / coût total, la Bybit Card l'emporte : 0 € de frais, cashback potentiellement supérieur. La Wirex Elite se justifie uniquement si vous utilisez activement l'écosystème Wirex (exchange, multi-devises). Pour la majorité des utilisateurs en France, la Bybit Card est plus avantageuse. Note : Bybit Card 4,0/5 vs Wirex Elite 3,5/5.`,
    en_intro: `The Wirex Elite and Bybit Card both offer some of the highest cashback rates on the European crypto card market. The Wirex Elite offers up to 8% in WXT but charges ~€9.99/month subscription. The Bybit Card offers up to 10% in MNT with no fees or subscription. For moderate spenders, Wirex's subscription fees quickly negate the cashback advantage.`,
    en_verdict: `On cashback-to-total-cost ratio, the Bybit Card wins: €0 fees, potentially higher cashback. The Wirex Elite is only justified if you actively use the Wirex ecosystem (exchange, multi-currency). For most EU users, the Bybit Card is more advantageous. Score: Bybit Card 4.0/5 vs Wirex Elite 3.5/5.`,
    faq: [
      { q: 'La Wirex Elite a-t-elle des frais mensuels ?', a: 'Oui. Le plan Wirex Elite coûte environ 9,99 €/mois (environ 120 €/an), ce qui réduit significativement le gain net du cashback.' },
    ],
  },

  // ─── Coinbase Card vs Bitpanda Card ──────────────────────────────────────────
  'bitpanda-card-vs-coinbase-card': {
    fr_intro: `La Coinbase Card et la Bitpanda Card sont deux cartes crypto européennes reconnues pour leur sérieux et leur conformité réglementaire. La Coinbase Card offre 4 % en XLM ou 1 % en BTC sans staking. La Bitpanda Card propose jusqu'à 1 % en BEST (token Bitpanda), avec des avantages supplémentaires pour les détenteurs de BEST. Les deux plateformes sont régulées en Europe, ce qui en fait des choix fiables pour les utilisateurs prudents.`,
    fr_verdict: `Sur le cashback pur, la Coinbase Card (4 % XLM ou 1 % BTC) surpasse la Bitpanda Card (1 % BEST). Cependant, la Bitpanda Card est particulièrement intéressante pour les utilisateurs Bitpanda qui détiennent déjà du BEST. Pour les autres, la Coinbase Card offre plus de valeur. Note : Coinbase Card 3,7/5 vs Bitpanda Card 3,6/5.`,
    en_intro: `The Coinbase Card and Bitpanda Card are both EU-regulated crypto cards known for their reliability and compliance. The Coinbase Card offers 4% in XLM or 1% in BTC with no staking. The Bitpanda Card offers up to 1% in BEST (Bitpanda token), with extra benefits for BEST holders. Both platforms are EU-regulated, making them safe choices for cautious users.`,
    en_verdict: `On pure cashback, the Coinbase Card (4% XLM or 1% BTC) outperforms the Bitpanda Card (1% BEST). However, the Bitpanda Card is particularly interesting for existing Bitpanda users who already hold BEST. For others, the Coinbase Card offers more value. Score: Coinbase Card 3.7/5 vs Bitpanda Card 3.6/5.`,
    faq: [
      { q: 'La Bitpanda Card est-elle disponible en dehors de l\'Autriche ?', a: 'Oui. La Bitpanda Card Visa est disponible dans toute l\'UE, y compris la France, l\'Allemagne, l\'Espagne et l\'Italie.' },
    ],
  },


  // ─── Deblock Card vs Nexo Card ───────────────────────────────────────────────
  'deblock-card-vs-nexo-card': {
    fr_intro: `Deblock et Nexo Card sont deux cartes crypto sans staking requis, mais elles s'adressent à des profils très différents. La **Deblock Card** est une néobanque française avec IBAN FR, wallet self-custody, et la meilleure régulation du marché (AMF + ACPR + MiCA). La **Nexo Card** se distingue par son cashback jusqu'à 2 % en BTC, bien supérieur au 1 % de Deblock Premium. Si vous habitez en France et que la sécurité réglementaire est votre priorité, Deblock est un choix unique. Si le cashback en Bitcoin est votre objectif principal, Nexo l'emporte.`,
    fr_verdict: `Deblock gagne sur la régulation, le IBAN français et la self-custody. Nexo gagne sur le cashback (2 % BTC vs 1 % max chez Deblock) et les cryptos supportées. Notre recommandation : choisissez **Deblock** si vous voulez un vrai compte courant français crypto-compatible ; choisissez **Nexo** si vous maximisez le cashback BTC. Note : Deblock 4,2/5 vs Nexo Card 4,2/5 — ex aequo sur le global, différents sur les critères.`,
    de_intro: `Deblock und Nexo Card sind zwei Krypto-Karten ohne Staking-Anforderungen, aber sie richten sich an sehr unterschiedliche Profile. Die **Deblock Card** ist eine französische Neobank mit französischer IBAN, Self-Custody-Wallet und der besten Regulierung auf dem Markt (AMF + ACPR + MiCA). Die **Nexo Card** zeichnet sich durch bis zu 2 % Cashback in BTC aus, was deutlich mehr ist als die 1 % von Deblock Premium.`,
    de_verdict: `Deblock punktet bei Regulierung, französischer IBAN und Self-Custody. Nexo punktet beim Cashback (2 % BTC vs. max. 1 % bei Deblock). Unsere Empfehlung: Wählen Sie **Deblock**, wenn Sie ein echtes französisches Girokonto mit Krypto wollen; wählen Sie **Nexo**, wenn Sie BTC-Cashback maximieren möchten.`,
    en_intro: `Deblock and Nexo Card are both crypto cards with no staking requirement, but they serve very different profiles. The **Deblock Card** is a French neobank with a French IBAN, self-custody wallet, and the best regulatory standing on the French market (AMF + ACPR + MiCA). The **Nexo Card** stands out with up to 2% cashback in BTC — significantly more than Deblock's 1% on the Premium plan.`,
    en_verdict: `Deblock wins on regulation, French IBAN, and self-custody. Nexo wins on cashback (2% BTC vs max 1% at Deblock). Our recommendation: choose **Deblock** if you want a proper French current account with crypto integration; choose **Nexo** if maximising BTC cashback is your primary goal. Score: Deblock 4.2/5 vs Nexo Card 4.2/5 — tied overall, different on individual criteria.`,
    faq: [
      { q: 'Deblock ou Nexo Card : laquelle est disponible en France ?', a: 'Les deux cartes sont disponibles en France. Deblock propose en plus un IBAN français (virements SEPA instantanés inclus), ce qu\'aucune autre carte crypto du marché n\'offre.' },
      { q: 'Quelle carte offre le meilleur cashback sans staking ?', a: 'La Nexo Card offre jusqu\'à 2 % de cashback en BTC sans staking obligatoire. La Deblock Card offre 1 % sur son plan Premium. Nexo l\'emporte sur ce critère.' },
      { q: 'Qu\'est-ce que le self-custody de Deblock ?', a: 'Avec Deblock, vos clés privées crypto vous appartiennent — Deblock ne les détient jamais. C\'est une différence majeure avec Nexo, où vos cryptos sont hébergées par la plateforme. Self-custody = vous êtes le seul propriétaire de vos actifs.' },
    ],
  },

  // ─── Deblock Card vs Coinbase Card ──────────────────────────────────────────
  'deblock-card-vs-coinbase-card': {
    fr_intro: `Deblock et Coinbase Card sont deux cartes crypto fortement axées sur la conformité réglementaire. La **Deblock Card** est régulée en France (AMF, ACPR, MiCA) et propose un IBAN français avec wallet self-custody. La **Coinbase Card** s'appuie sur Coinbase, exchange coté au Nasdaq, et offre jusqu'à 4 % de cashback en XLM ou 1 % en BTC sans staking. Pour les utilisateurs français qui veulent un ancrage local, Deblock est unique. Pour le cashback pur, Coinbase peut faire mieux.`,
    fr_verdict: `Deblock est imbattable sur la régulation française et le IBAN local. Coinbase gagne sur le cashback potentiel (4 % XLM vs 1 % Deblock) et la profondeur de l\'exchange. Notre verdict : **Deblock** pour les Français qui veulent une solution tout-en-un banque + crypto ; **Coinbase Card** pour ceux qui sont déjà clients Coinbase et veulent maximiser leurs rewards. Note : Deblock 4,2/5 vs Coinbase Card 3,7/5.`,
    en_intro: `Deblock and Coinbase Card are both compliance-focused crypto cards. The **Deblock Card** is regulated in France (AMF, ACPR, MiCA) and offers a French IBAN with a self-custody wallet. The **Coinbase Card** is backed by Nasdaq-listed Coinbase and offers up to 4% cashback in XLM or 1% in BTC with no staking required.`,
    en_verdict: `Deblock is unbeatable on French regulation and local IBAN. Coinbase wins on potential cashback (4% XLM vs 1% Deblock) and exchange depth. Our verdict: **Deblock** for French users wanting an all-in-one banking + crypto solution; **Coinbase Card** for existing Coinbase users wanting to maximise rewards. Score: Deblock 4.2/5 vs Coinbase Card 3.7/5.`,
    faq: [
      { q: 'La Coinbase Card est-elle disponible en France ?', a: 'Oui, la Coinbase Card est disponible dans l\'UE dont la France. En revanche, elle ne propose pas d\'IBAN français — il s\'agit d\'une carte adossée à votre compte Coinbase.' },
      { q: 'Deblock ou Coinbase Card pour un débutant en France ?', a: 'Deblock est plus adapté aux débutants français : IBAN local, interface simple, support en français, et régulation française rassurante. Coinbase est idéal si vous utilisez déjà l\'exchange Coinbase.' },
    ],
  },

  // ─── Deblock Card vs Wirex ──────────────────────────────────────────────────
  'deblock-card-vs-wirex-elite': {
    fr_intro: `Deblock et Wirex sont deux approches très différentes de la carte crypto. La **Deblock Card** est une néobanque française avec IBAN local et wallet self-custody, orientée conformité et sécurité. **Wirex** est un acteur international plus orienté cashback (jusqu'à 8 % en WXT) et multi-devises. Si vous voyagez beaucoup et voulez des comptes multi-devises, Wirex peut être intéressant. Pour un usage centré sur la France avec les meilleures garanties réglementaires, Deblock s'impose.`,
    fr_verdict: `Wirex l\'emporte sur les fonctionnalités multi-devises et le cashback potentiel en WXT. Deblock l\'emporte sur la régulation française, le IBAN local, et la self-custody. Note : Deblock 4,2/5 vs Wirex 3,5/5 — Deblock est recommandé pour les utilisateurs français.`,
    en_intro: `Deblock and Wirex take very different approaches to crypto cards. The **Deblock Card** is a French neobank with a local IBAN and self-custody wallet, focused on compliance and security. **Wirex** is a more internationally-oriented product with cashback up to 8% in WXT and multi-currency accounts.`,
    en_verdict: `Wirex wins on multi-currency features and potential WXT cashback. Deblock wins on French regulation, local IBAN, and self-custody. Score: Deblock 4.2/5 vs Wirex 3.5/5 — Deblock is recommended for French users.`,
    faq: [
      { q: 'Deblock ou Wirex pour voyager ?', a: 'Wirex est historiquement fort sur les multi-devises et les voyages. Cependant, Deblock ne facture pas de frais de change sur les paiements en euros dans l\'UE, ce qui le rend compétitif pour les voyages intra-européens.' },
    ],
  },

};

/**
 * Get specific comparison content for a pair of card IDs.
 * Returns null if no specific content exists (fall back to generic).
 */
export function getSpecificComparison(id1: string, id2: string): ComparisonSpecific | null {
  const key = normalizePairKey(id1, id2);
  return COMPARISONS[key] ?? null;
}
