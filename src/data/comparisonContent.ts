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
    es_intro: `La Nexo Card y la Bybit Card son dos de las tarjetas crypto más populares en Europa, pero se dirigen a perfiles muy diferentes. La Nexo Card ofrece hasta el 2% de cashback en BTC o NEXO sin staking requerido. La Bybit Card ofrece hasta el 10% en MNT, también sin staking pero basado en el volumen mensual de gastos. Ambas son gratuitas (0€ anuales) y disponibles en España.`,
    es_verdict: `Para gastos diarios moderados (menos de 500€/mes), la Nexo Card es la opción segura: 2% en BTC garantizado sin condición de volumen. Para quienes gastan más, la Bybit Card puede desbloquear tasas superiores. Puntuación: Nexo Card 4,2/5 vs Bybit Card 4,0/5.`,
    it_intro: `La Nexo Card e la Bybit Card sono tra le carte crypto più popolari in Europa, ma si rivolgono a profili molto diversi. La Nexo Card offre fino al 2% di cashback in BTC o NEXO senza staking. La Bybit Card può arrivare al 10% in MNT, anch'essa senza staking ma basata sul volume mensile di spesa. Entrambe sono gratuite (0€ annuali) e disponibili in Italia.`,
    it_verdict: `Per spese quotidiane moderate (meno di 500€/mese), la Nexo Card è la scelta sicura: 2% in BTC garantito senza condizioni di volume. Per chi spende di più, la Bybit Card può sbloccare tassi superiori. Punteggio: Nexo Card 4,2/5 vs Bybit Card 4,0/5.`,
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
    de_intro: `Die Nexo Card und die Crypto.com Midnight Blue stehen für zwei entgegengesetzte Philosophien: Die erste belohnt ohne Staking-Anforderungen (bis zu 2 % in BTC), während die zweite Crypto.coms Einsteigerkarte ist — kostenlos, kein Staking, aber begrenztes Cashback (1 % in CRO). Der Vergleich zeigt schnell, welche Karte den besseren Alltags-Wert bietet.`,
    de_verdict: `Die Nexo Card gewinnt klar beim Cashback (2 % BTC vs. 1 % CRO für die Midnight Blue). Die Midnight Blue lohnt sich hauptsächlich für bestehende Crypto.com-Nutzer. Für neue Nutzer ohne Staking-Wunsch ist die Nexo Card die beste Wahl 2026. Bewertung: Nexo Card 4,2/5 vs. Crypto.com Midnight Blue 3,8/5.`,
    en_intro: `The Nexo Card and Crypto.com Midnight Blue represent two opposite philosophies: the first rewards without staking requirements (up to 2% in BTC), while the second is Crypto.com's entry-level card — free, no staking, but limited cashback (1% in CRO). If you're comparing these two, you're likely wondering which offers the best value for everyday spending.`,
    en_verdict: `The Nexo Card clearly wins on cashback (2% BTC vs 1% CRO for the Midnight Blue). The Crypto.com Midnight Blue makes sense mainly if you're already a Crypto.com exchange user. For a new user seeking the best free no-staking card in the EU, the Nexo Card is the top pick in 2026. Score: Nexo Card 4.2/5 vs Crypto.com Midnight Blue 3.8/5.`,
    es_intro: `La Nexo Card y la Crypto.com Midnight Blue representan dos filosofías opuestas: la primera recompensa sin staking (hasta 2% en BTC), mientras la segunda es la tarjeta de entrada de Crypto.com — gratuita, sin staking, pero con cashback limitado (1% en CRO).`,
    es_verdict: `La Nexo Card gana claramente en cashback (2% BTC vs 1% CRO). La Midnight Blue solo se justifica si ya usas el exchange de Crypto.com. Para nuevos usuarios, la Nexo Card es la mejor opción sin staking. Puntuación: Nexo Card 4,2/5 vs Crypto.com Midnight Blue 3,8/5.`,
    it_intro: `La Nexo Card e la Crypto.com Midnight Blue rappresentano due filosofie opposte: la prima premia senza staking (fino al 2% in BTC), mentre la seconda è la carta entry-level di Crypto.com — gratuita, senza staking, ma con cashback limitato (1% in CRO).`,
    it_verdict: `La Nexo Card vince chiaramente sul cashback (2% BTC vs 1% CRO). La Midnight Blue si giustifica solo per utenti già attivi su Crypto.com. Per nuovi utenti, la Nexo Card è la scelta migliore. Punteggio: Nexo Card 4,2/5 vs Crypto.com Midnight Blue 3,8/5.`,
    faq: [
      { q: 'Crypto.com Midnight Blue vs Nexo Card : laquelle choisir sans staking ?', a: 'La Nexo Card offre 2 % de cashback en BTC sans staking, contre seulement 1 % en CRO pour la Midnight Blue. La Nexo Card est supérieure si vous ne souhaitez pas de staking.' },
      { q: 'La Crypto.com Midnight Blue a-t-elle un cashback ?', a: 'Oui, 1 % de cashback en CRO. Sans staking CRO requis, c\'est la carte d\'entrée de gamme de Crypto.com.' },
    ],
  },

  // ─── Nexo Card vs Crypto.com Ruby Steel ─────────────────────────────────────
  'crypto-com-ruby-steel-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Crypto.com Ruby Steel Card sont souvent comparées car elles ciblent un profil similaire : l'investisseur crypto actif cherchant du cashback sans immobiliser des dizaines de milliers d'euros. La Crypto.com Ruby Steel requiert un staking de 400 € en CRO pour un cashback de 2 % en CRO, tandis que la Nexo Card offre 2 % en BTC sans staking obligatoire. La différence clé : la valeur du CRO est volatile, celle du BTC aussi — mais le BTC est généralement considéré comme plus fiable comme réserve de valeur.`,
    fr_verdict: `Pour 2026, les deux cartes sont proches en cashback (2 % chacune), mais la Nexo Card prend l'avantage grâce à l'absence de staking et au cashback en BTC plutôt qu'en token propriétaire (CRO). Si vous détenez déjà des CRO sur Crypto.com, la Ruby Steel peut être logique. Sinon, la Nexo Card est la recommandation par défaut. Note : Nexo Card 4,2/5 vs Crypto.com Ruby Steel 4,0/5.`,
    de_intro: `Die Nexo Card und die Crypto.com Ruby Steel werden häufig verglichen, da sie ein ähnliches Profil ansprechen: aktive Krypto-Investoren, die Cashback suchen, ohne Zehntausende von Euro zu blockieren. Die Ruby Steel erfordert 400 € CRO-Staking für 2 % Cashback in CRO. Die Nexo Card bietet 2 % in BTC ohne Staking. Der entscheidende Unterschied: BTC gilt als verlässlichere Wertanlage als CRO.`,
    de_verdict: `2026 bieten beide Karten ähnliches Cashback (je 2 %), aber die Nexo Card hat dank fehlendem Staking und BTC-Belohnungen statt proprietärem Token den Vorteil. Wenn Sie bereits CRO bei Crypto.com halten, ist die Ruby Steel sinnvoll. Andernfalls ist die Nexo Card die Standardempfehlung. Bewertung: Nexo Card 4,2/5 vs. Crypto.com Ruby Steel 4,0/5.`,
    en_intro: `The Nexo Card and Crypto.com Ruby Steel are often compared as they target a similar profile: active crypto investors seeking cashback without locking up tens of thousands of euros. The Crypto.com Ruby Steel requires €400 CRO staking for 2% cashback in CRO, while the Nexo Card offers 2% in BTC with no mandatory staking. The key difference: CRO is more volatile than BTC.`,
    en_verdict: `For 2026, both cards offer similar cashback (2% each), but the Nexo Card has the edge thanks to no staking requirement and BTC rewards vs. a proprietary token (CRO). If you already hold CRO on Crypto.com, the Ruby Steel makes sense. Otherwise, the Nexo Card is the default recommendation. Score: Nexo Card 4.2/5 vs Crypto.com Ruby Steel 4.0/5.`,
    es_intro: `La Nexo Card y la Crypto.com Ruby Steel se comparan frecuentemente ya que apuntan a un perfil similar: inversores crypto activos que buscan cashback sin bloquear miles de euros. La Ruby Steel requiere 400€ de CRO en staking para el 2% en CRO, mientras la Nexo Card ofrece 2% en BTC sin staking obligatorio.`,
    es_verdict: `Ambas ofrecen cashback similar (2% cada una), pero la Nexo Card tiene ventaja sin staking y con BTC en lugar de token propietario. Si ya tienes CRO en Crypto.com, la Ruby Steel tiene sentido. De lo contrario, la Nexo Card es la recomendación. Puntuación: Nexo Card 4,2/5 vs Crypto.com Ruby Steel 4,0/5.`,
    it_intro: `La Nexo Card e la Crypto.com Ruby Steel sono spesso confrontate poiché si rivolgono a un profilo simile: investitori crypto attivi che cercano cashback senza bloccare decine di migliaia di euro. La Ruby Steel richiede 400€ di CRO in staking per il 2% in CRO; la Nexo Card offre il 2% in BTC senza staking obbligatorio.`,
    it_verdict: `Entrambe offrono cashback simile (2% ciascuna), ma la Nexo Card ha il vantaggio per assenza di staking e premi in BTC anziché token proprietario. Se hai già CRO su Crypto.com, la Ruby Steel ha senso. Altrimenti, la Nexo Card è la raccomandazione predefinita. Punteggio: Nexo Card 4,2/5 vs Crypto.com Ruby Steel 4,0/5.`,
    faq: [
      { q: 'Quel staking faut-il pour la Crypto.com Ruby Steel ?', a: 'La Crypto.com Ruby Steel Card nécessite un staking de 400 € en CRO pendant 180 jours pour obtenir les 2 % de cashback. La Nexo Card n\'impose aucune exigence de staking.' },
      { q: 'Le cashback Nexo est-il en BTC ou en NEXO ?', a: 'Au choix : 2 % en BTC ou 2 % en NEXO. Le cashback en BTC est généralement recommandé pour ceux qui cherchent à accumuler du Bitcoin.' },
    ],
  },

  // ─── Nexo Card vs Wirex Elite ────────────────────────────────────────────────
  'nexo-card-vs-wirex-elite': {
    fr_intro: `La Nexo Card et la Wirex Elite Card sont deux cartes crypto premium ciblant les utilisateurs à la recherche d'un cashback élevé en Europe. La Wirex Elite peut offrir jusqu'à 8 % de cashback en WXT (token natif Wirex), mais nécessite un abonnement mensuel (~9,99 €) et un certain montant de WXT. La Nexo Card propose 2 % en BTC sans abonnement ni staking. En termes de frais totaux, la Wirex Elite coûte ~120 €/an même sans staking.`,
    fr_verdict: `Si vous dépensez plus de 1 500 €/mois et êtes prêt à détenir des WXT, la Wirex Elite peut être rentable grâce à son cashback élevé. En dessous de ce seuil, les frais d'abonnement grignotent le bénéfice. La Nexo Card reste le choix par défaut pour la majorité des utilisateurs en France : 0 € de frais, 2 % BTC, sans contrainte. Note : Nexo Card 4,2/5 vs Wirex Elite 3,5/5.`,
    de_intro: `Die Nexo Card und die Wirex Elite Card sprechen beide Premium-Krypto-Nutzer an, die hohes Cashback suchen. Die Wirex Elite kann bis zu 8 % in WXT bieten, erfordert aber ein monatliches Abonnement (~9,99 €) und WXT-Bestände. Die Nexo Card bietet 2 % in BTC ohne Abonnement oder Staking. Die Wirex Elite kostet ~120 €/Jahr.`,
    de_verdict: `Wenn Sie mehr als 1.500 €/Monat ausgeben und WXT halten möchten, kann die Wirex Elite profitabel sein. Darunter fressen die Abo-Gebühren den Cashback-Vorteil auf. Die Nexo Card bleibt die Standardwahl: 0 € Gebühren, 2 % BTC, ohne Einschränkungen. Bewertung: Nexo Card 4,2/5 vs. Wirex Elite 3,5/5.`,
    en_intro: `The Nexo Card and Wirex Elite target premium crypto users seeking high cashback in Europe. The Wirex Elite can offer up to 8% cashback in WXT, but requires a monthly subscription (~€9.99) and some WXT holdings. The Nexo Card offers 2% in BTC with no subscription or staking. In total cost terms, the Wirex Elite costs ~€120/year even without staking.`,
    en_verdict: `If you spend over €1,500/month and are willing to hold WXT, the Wirex Elite can be profitable due to its high cashback. Below that threshold, subscription fees eat into the benefit. The Nexo Card remains the default choice for most EU users: €0 fees, 2% BTC, no constraints. Score: Nexo Card 4.2/5 vs Wirex Elite 3.5/5.`,
    es_intro: `La Nexo Card y la Wirex Elite apuntan a usuarios premium que buscan alto cashback en Europa. La Wirex Elite puede ofrecer hasta el 8% en WXT, pero requiere suscripción mensual (~9,99€) y tenencia de WXT. La Nexo Card ofrece 2% en BTC sin suscripción ni staking. La Wirex Elite cuesta ~120€/año.`,
    es_verdict: `Si gastas más de 1.500€/mes y estás dispuesto a tener WXT, la Wirex Elite puede ser rentable. Por debajo de ese umbral, la suscripción elimina la ventaja. La Nexo Card sigue siendo la elección predeterminada: 0€ de cuotas, 2% BTC sin restricciones. Puntuación: Nexo Card 4,2/5 vs Wirex Elite 3,5/5.`,
    it_intro: `La Nexo Card e la Wirex Elite si rivolgono a utenti crypto premium che cercano alto cashback in Europa. La Wirex Elite può offrire fino all'8% in WXT, ma richiede abbonamento mensile (~9,99€) e possesso di WXT. La Nexo Card offre 2% in BTC senza abbonamento né staking. La Wirex Elite costa ~120€/anno.`,
    it_verdict: `Se spendi più di 1.500€/mese e sei disposto a detenere WXT, la Wirex Elite può essere redditizia. Al di sotto di questa soglia, l'abbonamento annulla il vantaggio. La Nexo Card rimane la scelta predefinita: 0€ di costi, 2% BTC senza vincoli. Punteggio: Nexo Card 4,2/5 vs Wirex Elite 3,5/5.`,
    faq: [
      { q: 'La Wirex Elite est-elle vraiment gratuite ?', a: 'Non. La Wirex Elite (plan "Elite") coûte environ 9,99 €/mois. La Nexo Card, elle, est totalement gratuite.' },
      { q: 'Quelle carte offre le cashback le plus élevé ?', a: 'La Wirex Elite peut atteindre 8 % en WXT, contre 2 % en BTC pour la Nexo Card. Mais le WXT est un token plus volatil et moins liquide que le Bitcoin.' },
    ],
  },

  // ─── Bybit Card vs Binance Card ──────────────────────────────────────────────
  'binance-card-vs-bybit-card': {
    fr_intro: `La Bybit Card et la Binance Card sont les deux grandes cartes crypto des exchanges asiatiques disponibles en France. Toutes deux sont gratuites (0 € de frais annuels) et offrent un cashback élevé : jusqu'à 10 % en MNT pour la Bybit Card, jusqu'à 8 % en BNB pour la Binance Card. La Binance Card utilise le BNB (token bien établi, top 5 des cryptos), tandis que la Bybit Card récompense en MNT (Mantle Network). La Binance Card ne bloque pas le BNB sur votre compte — il suffit de le détenir.`,
    fr_verdict: `Les deux cartes sont excellentes pour les cashbacks élevés. La Binance Card marque des points avec le BNB — un token plus liquide et reconnu que le MNT. La Bybit Card peut offrir des taux plus élevés sur les premiers paliers de dépenses. Note globale : Bybit Card 4,0/5 vs Binance Card 3,9/5. Pour un utilisateur Binance actif, la Binance Card est naturelle. Pour un utilisateur Bybit, idem.`,
    de_intro: `Die Bybit Card und die Binance Card sind die beiden großen Krypto-Exchange-Karten asiatischer Plattformen, die in Deutschland verfügbar sind. Beide sind kostenlos (0 € Jahresgebühr) mit hohem Cashback: bis zu 10 % in MNT (Bybit) und bis zu 8 % in BNB (Binance). Die Binance Card belohnt in BNB (Top-5-Krypto), die Bybit Card in MNT. BNB muss nur gehalten, nicht gesperrt werden.`,
    de_verdict: `Beide Karten sind ausgezeichnet für hohes Cashback. Die Binance Card punktet mit BNB — einem liquiderem und anerkannterem Token als MNT. Die Bybit Card kann auf den ersten Ausgabenstufen höhere Sätze bieten. Bewertung: Bybit Card 4,0/5 vs. Binance Card 3,9/5.`,
    en_intro: `The Bybit Card and Binance Card are the two major crypto exchange cards from Asian platforms available in France. Both are free (€0 annual fees) with high cashback: up to 10% in MNT for Bybit, up to 8% in BNB for Binance. The Binance Card rewards in BNB (top-5 crypto), while Bybit rewards in MNT (Mantle Network). The Binance Card doesn't require locking BNB — just holding it.`,
    en_verdict: `Both cards are excellent for high cashback. The Binance Card scores points with BNB — a more liquid and recognized token than MNT. The Bybit Card can offer higher rates on initial spending tiers. Overall score: Bybit Card 4.0/5 vs Binance Card 3.9/5. For active Binance users, the Binance Card is natural. Same for Bybit users.`,
    es_intro: `La Bybit Card y la Binance Card son las dos grandes tarjetas crypto de exchanges asiáticos disponibles en España. Ambas son gratuitas (0€ anuales) con alto cashback: hasta 10% en MNT (Bybit) y hasta 8% en BNB (Binance). BNB solo necesita ser tenido, no bloqueado.`,
    es_verdict: `Ambas son excelentes para cashback alto. La Binance Card puntúa con BNB, más líquido que MNT. La Bybit Card puede ofrecer tasas más altas en los primeros tramos. Puntuación: Bybit Card 4,0/5 vs Binance Card 3,9/5.`,
    it_intro: `La Bybit Card e la Binance Card sono le due principali carte crypto di exchange asiatici disponibili in Italia. Entrambe gratuite (0€ annuali) con alto cashback: fino al 10% in MNT (Bybit) e fino all'8% in BNB (Binance). BNB va solo tenuto, non bloccato.`,
    it_verdict: `Entrambe sono eccellenti per cashback alto. La Binance Card ottiene punti con BNB, più liquido di MNT. La Bybit Card può offrire tassi più alti sui primi livelli di spesa. Punteggio: Bybit Card 4,0/5 vs Binance Card 3,9/5.`,
    faq: [
      { q: 'Faut-il bloquer ses BNB pour la Binance Card ?', a: 'Non. La Binance Card nécessite simplement de détenir du BNB sur votre compte Binance, sans blocage (contrairement au staking Crypto.com).' },
      { q: 'Quel est le cashback de la Bybit Card au premier palier ?', a: 'Le cashback Bybit Card varie de 2 % à 10 % en MNT selon les paliers de dépenses mensuelles. Le taux exact par palier est disponible sur le site Bybit.' },
    ],
  },

  // ─── Bybit Card vs Crypto.com Midnight Blue ──────────────────────────────────
  'bybit-card-vs-crypto-com-midnight-blue': {
    fr_intro: `La Bybit Card et la Crypto.com Midnight Blue Card sont deux cartes crypto gratuites sans staking requis, mais leurs cashbacks n'ont rien à voir. La Bybit Card offre jusqu'à 10 % en MNT basé sur le volume de dépenses, quand la Crypto.com Midnight Blue plafonne à 1 % en CRO. La différence principale : la Bybit Card est bien plus récompensante mais nécessite d'être client Bybit ; la Midnight Blue est l'option d'entrée Crypto.com, idéale pour démarrer sans engagement.`,
    fr_verdict: `Si vous cherchez le meilleur cashback sans staking, la Bybit Card gagne sans discussion. La Crypto.com Midnight Blue se justifie surtout si vous utilisez déjà l'app Crypto.com et ne souhaitez pas gérer un compte Bybit supplémentaire. Pour les nouveaux utilisateurs crypto, la Bybit Card est plus avantageuse. Note : Bybit Card 4,0/5 vs Crypto.com Midnight Blue 3,8/5.`,
    de_intro: `Die Bybit Card und die Crypto.com Midnight Blue sind beide kostenlose Krypto-Karten ohne Staking-Anforderungen, aber ihre Cashback-Sätze sind sehr unterschiedlich. Die Bybit Card bietet bis zu 10 % in MNT basierend auf dem monatlichen Ausgabevolumen, während die Midnight Blue bei 1 % in CRO gedeckelt ist.`,
    de_verdict: `Für das beste Cashback ohne Staking gewinnt die Bybit Card klar. Die Midnight Blue lohnt sich hauptsächlich für bestehende Crypto.com-Nutzer. Für neue Krypto-Nutzer ist die Bybit Card vorteilhafter. Bewertung: Bybit Card 4,0/5 vs. Crypto.com Midnight Blue 3,8/5.`,
    en_intro: `The Bybit Card and Crypto.com Midnight Blue are both free crypto cards with no staking required, but their cashback rates are vastly different. The Bybit Card offers up to 10% in MNT based on monthly spending, while the Crypto.com Midnight Blue caps at 1% in CRO. The main difference: the Bybit Card is far more rewarding but requires a Bybit account; the Midnight Blue is Crypto.com's entry option.`,
    en_verdict: `If you want the best no-staking cashback, the Bybit Card wins hands down. The Crypto.com Midnight Blue is justified mainly if you already use the Crypto.com app and don't want to manage an additional Bybit account. For new crypto users, the Bybit Card is more advantageous. Score: Bybit Card 4.0/5 vs Crypto.com Midnight Blue 3.8/5.`,
    es_intro: `La Bybit Card y la Crypto.com Midnight Blue son ambas gratuitas sin staking requerido, pero sus tasas de cashback son muy diferentes. La Bybit Card ofrece hasta el 10% en MNT según el volumen mensual de gastos, mientras la Midnight Blue se limita al 1% en CRO.`,
    es_verdict: `Para el mejor cashback sin staking, la Bybit Card gana sin discusión. La Midnight Blue se justifica principalmente para usuarios de Crypto.com ya existentes. Para nuevos usuarios, la Bybit Card es más ventajosa. Puntuación: Bybit Card 4,0/5 vs Crypto.com Midnight Blue 3,8/5.`,
    it_intro: `La Bybit Card e la Crypto.com Midnight Blue sono entrambe gratuite senza staking, ma con tassi di cashback molto diversi. La Bybit Card offre fino al 10% in MNT in base al volume mensile di spesa, mentre la Midnight Blue arriva al massimo all'1% in CRO.`,
    it_verdict: `Per il miglior cashback senza staking, la Bybit Card vince senza dubbio. La Midnight Blue si giustifica principalmente per utenti già attivi su Crypto.com. Per nuovi utenti, la Bybit Card è più vantaggiosa. Punteggio: Bybit Card 4,0/5 vs Crypto.com Midnight Blue 3,8/5.`,
    faq: [
      { q: 'La Bybit Card nécessite-t-elle du staking ?', a: 'Non. La Bybit Card calcule le cashback sur la base du volume mensuel de dépenses, sans staking de token requis.' },
      { q: 'Combien rapporte la Crypto.com Midnight Blue ?', a: '1 % de cashback en CRO. C\'est la carte d\'entrée de gamme de Crypto.com, sans avantages supplémentaires comme le Netflix gratuit ou les retraits ATM offerts.' },
    ],
  },

  // ─── Nexo Card vs Coinbase Card ──────────────────────────────────────────────
  'coinbase-card-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Coinbase Card sont deux cartes crypto recommandées pour les débutants en France : toutes deux gratuites, sans staking requis, et accessibles facilement. La Coinbase Card offre 4 % de cashback en XLM ou 1 % en BTC — un taux qui semble attractif, mais le XLM (Stellar) est un token risqué. La Nexo Card propose 2 % en BTC de façon stable. La Coinbase Card se distingue par sa sécurité perçue (plateforme réglementée Nasdaq) et sa facilité d'utilisation.`,
    fr_verdict: `Pour un utilisateur débutant valorisant la sécurité et la simplicité, la Coinbase Card est un excellent choix. Pour un utilisateur souhaitant maximiser le cashback en BTC (valeur refuge), la Nexo Card offre 2 % vs 1 % en BTC pour Coinbase (le 4 % en XLM est risqué). Note : Nexo Card 4,2/5 vs Coinbase Card 3,7/5. La Nexo Card l'emporte sur le cashback BTC ; la Coinbase Card sur la réputation réglementaire.`,
    de_intro: `Die Nexo Card und die Coinbase Card werden beide für Krypto-Einsteiger in der EU empfohlen: beide kostenlos, kein Staking erforderlich, einfach zu erhalten. Die Coinbase Card bietet 4 % Cashback in XLM oder 1 % in BTC. Die Nexo Card bietet stabile 2 % in BTC. Die Coinbase Card zeichnet sich durch ihre regulatorische Glaubwürdigkeit (Nasdaq-notierte Plattform) aus.`,
    de_verdict: `Für Einsteiger, die Sicherheit und Einfachheit priorisieren, ist die Coinbase Card eine ausgezeichnete Wahl. Für Nutzer, die BTC-Cashback maximieren möchten, bietet die Nexo Card 2 % vs. Coinbases 1 % in BTC. Bewertung: Nexo Card 4,2/5 vs. Coinbase Card 3,7/5.`,
    en_intro: `The Nexo Card and Coinbase Card are both recommended for crypto beginners in the EU: free, no staking required, and easy to obtain. The Coinbase Card offers 4% cashback in XLM or 1% in BTC — the XLM rate sounds attractive but Stellar is a risky token. The Nexo Card offers a stable 2% in BTC. The Coinbase Card stands out for its regulatory trust (Nasdaq-listed platform) and ease of use.`,
    en_verdict: `For beginners prioritizing security and simplicity, the Coinbase Card is an excellent choice. For users wanting to maximize BTC cashback, the Nexo Card offers 2% vs Coinbase's 1% in BTC (the 4% XLM option carries token risk). Score: Nexo Card 4.2/5 vs Coinbase Card 3.7/5. Nexo wins on BTC cashback; Coinbase wins on regulatory reputation.`,
    es_intro: `La Nexo Card y la Coinbase Card se recomiendan a principiantes en Europa: ambas gratuitas, sin staking requerido y fáciles de obtener. La Coinbase Card ofrece el 4% en XLM o el 1% en BTC. La Nexo Card ofrece 2% estable en BTC. La Coinbase Card destaca por su confianza regulatoria (cotizada en Nasdaq).`,
    es_verdict: `Para principiantes que priorizan seguridad y simplicidad, la Coinbase Card es una excelente elección. Para maximizar cashback en BTC, la Nexo Card ofrece 2% vs 1% en BTC de Coinbase. Puntuación: Nexo Card 4,2/5 vs Coinbase Card 3,7/5.`,
    it_intro: `La Nexo Card e la Coinbase Card sono entrambe raccomandate per principianti crypto nell'UE: gratuite, senza staking richiesto e facili da ottenere. La Coinbase Card offre il 4% in XLM o l'1% in BTC. La Nexo Card offre 2% stabile in BTC. La Coinbase Card si distingue per la sua affidabilità regolatoria (quotata al Nasdaq).`,
    it_verdict: `Per principianti che danno priorità a sicurezza e semplicità, la Coinbase Card è un'ottima scelta. Per massimizzare il cashback in BTC, la Nexo Card offre 2% vs 1% in BTC di Coinbase. Punteggio: Nexo Card 4,2/5 vs Coinbase Card 3,7/5.`,
    faq: [
      { q: 'Le 4 % de cashback Coinbase vaut-il vraiment 4 % ?', a: 'Attention : le 4 % est versé en XLM (Stellar), un token très volatile. Si vous choisissez 1 % en BTC, vous obtenez moins que la Nexo Card (2 % BTC).' },
      { q: 'La Coinbase Card est-elle disponible en France ?', a: 'Oui, la Coinbase Card Visa est disponible en France et dans la majorité des pays de l\'UE.' },
    ],
  },

  // ─── Nexo Card vs Binance Card ───────────────────────────────────────────────
  'binance-card-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Binance Card sont deux des cartes crypto les plus utilisées en France. La Nexo Card offre 2 % de cashback en BTC sans staking, tandis que la Binance Card peut atteindre 8 % de cashback en BNB selon votre balance BNB sur la plateforme. Les deux cartes sont gratuites. La grande différence : la Nexo Card ne dépend d'aucun token propriétaire volatile, là où la Binance Card vous expose aux variations du BNB.`,
    fr_verdict: `Si vous déteniez déjà des BNB et êtes client Binance actif, la Binance Card est clairement supérieure sur le cashback (jusqu'à 8 % vs 2 %). Pour les utilisateurs qui souhaitent un cashback en BTC simple et sans risque de token, la Nexo Card est plus fiable. Note : Nexo Card 4,2/5 vs Binance Card 3,9/5.`,
    de_intro: `Die Nexo Card und die Binance Card gehören zu den meistgenutzten Krypto-Karten in Europa. Die Nexo Card bietet 2 % Cashback in BTC ohne Staking, während die Binance Card je nach BNB-Guthaben bis zu 8 % in BNB erreichen kann. Beide Karten sind kostenlos. Der große Unterschied: Die Nexo Card hängt nicht von einem proprietären Token ab, die Binance Card setzt Sie BNB-Schwankungen aus.`,
    de_verdict: `Wenn Sie bereits BNB halten und aktiver Binance-Nutzer sind, ist die Binance Card beim Cashback klar überlegen (bis zu 8 % vs. 2 %). Für Nutzer, die einfaches BTC-Cashback ohne Token-Risiko wünschen, ist die Nexo Card zuverlässiger. Bewertung: Nexo Card 4,2/5 vs. Binance Card 3,9/5.`,
    en_intro: `The Nexo Card and Binance Card are two of the most-used crypto cards in France. The Nexo Card offers 2% cashback in BTC without staking, while the Binance Card can reach 8% cashback in BNB depending on your BNB balance on the platform. Both cards are free. The big difference: the Nexo Card doesn't depend on any volatile proprietary token, unlike the Binance Card which exposes you to BNB fluctuations.`,
    en_verdict: `If you already hold BNB and are an active Binance user, the Binance Card is clearly superior on cashback (up to 8% vs 2%). For users wanting simple BTC cashback without token risk, the Nexo Card is more reliable. Score: Nexo Card 4.2/5 vs Binance Card 3.9/5.`,
    es_intro: `La Nexo Card y la Binance Card son dos de las tarjetas crypto más utilizadas en Europa. La Nexo Card ofrece 2% en BTC sin staking, mientras la Binance Card puede alcanzar el 8% en BNB según tu saldo BNB. Ambas son gratuitas. La Nexo Card no depende de ningún token propietario volátil.`,
    es_verdict: `Si ya tienes BNB y eres usuario activo de Binance, la Binance Card es claramente superior en cashback (hasta 8% vs 2%). Para quienes quieren cashback simple en BTC sin riesgo de token, la Nexo Card es más fiable. Puntuación: Nexo Card 4,2/5 vs Binance Card 3,9/5.`,
    it_intro: `La Nexo Card e la Binance Card sono tra le carte crypto più utilizzate in Europa. La Nexo Card offre il 2% in BTC senza staking, mentre la Binance Card può raggiungere l'8% in BNB in base al saldo BNB. Entrambe gratuite. La Nexo Card non dipende da alcun token proprietario volatile.`,
    it_verdict: `Se hai già BNB e sei utente attivo di Binance, la Binance Card è chiaramente superiore sul cashback (fino all'8% vs 2%). Per chi vuole cashback semplice in BTC senza rischio token, la Nexo Card è più affidabile. Punteggio: Nexo Card 4,2/5 vs Binance Card 3,9/5.`,
    faq: [
      { q: 'Le cashback Binance Card est-il vraiment de 8 % ?', a: 'Le taux maximum de 8 % en BNB est réservé aux utilisateurs détenant un solde BNB important. Le taux de base est bien plus bas pour les petits détenteurs.' },
      { q: 'La Nexo Card est-elle disponible en France ?', a: 'Oui. La Nexo Card Mastercard est disponible dans tous les pays de l\'UE, France incluse.' },
    ],
  },

  // ─── OKX Card vs Bybit Card ──────────────────────────────────────────────────
  'bybit-card-vs-okx-card': {
    fr_intro: `La OKX Card et la Bybit Card sont deux cartes crypto issues de grandes plateformes d'exchange asiatiques, toutes deux disponibles en Europe. La Bybit Card offre jusqu'à 10 % de cashback en MNT basé sur le volume de dépenses, tandis que l'OKX Card propose jusqu'à 3 % en fonction du niveau OKB détenu. Les deux cartes sont gratuites (0 € de frais annuels). La Bybit Card est clairement plus généreuse sur le cashback.`,
    fr_verdict: `Pour le cashback, la Bybit Card (jusqu'à 10 % MNT) surpasse l'OKX Card (jusqu'à 3 %). Cependant, l'OKX Card marque des points sur l'interface utilisateur et la disponibilité de support. Si le cashback est votre priorité, choisissez Bybit. Si vous utilisez déjà OKX comme exchange principal, la OKX Card est le choix naturel. Note : Bybit Card 4,0/5 vs OKX Card 3,8/5.`,
    de_intro: `Die OKX Card und die Bybit Card kommen beide von großen asiatischen Exchange-Plattformen und sind in Europa verfügbar. Die Bybit Card bietet bis zu 10 % Cashback in MNT basierend auf dem Ausgabevolumen, die OKX Card bis zu 3 % basierend auf OKB-Beständen. Beide Karten sind kostenlos (0 € Jahresgebühr).`,
    de_verdict: `Beim Cashback übertrifft die Bybit Card (bis zu 10 % MNT) die OKX Card (bis zu 3 %). Die OKX Card punktet bei Benutzeroberfläche und Support. Wenn Cashback Ihre Priorität ist, wählen Sie Bybit. Wenn OKX Ihr Haupt-Exchange ist, ist die OKX Card die natürliche Wahl. Bewertung: Bybit Card 4,0/5 vs. OKX Card 3,8/5.`,
    en_intro: `The OKX Card and Bybit Card are both from major Asian exchange platforms, available across Europe. The Bybit Card offers up to 10% cashback in MNT based on spending volume, while the OKX Card offers up to 3% based on OKB holdings. Both cards are free (€0 annual fees). The Bybit Card is clearly more generous on cashback.`,
    en_verdict: `For cashback, the Bybit Card (up to 10% MNT) outperforms the OKX Card (up to 3%). However, the OKX Card scores points on user interface and support availability. If cashback is your priority, choose Bybit. If you're already using OKX as your main exchange, the OKX Card is the natural choice. Score: Bybit Card 4.0/5 vs OKX Card 3.8/5.`,
    es_intro: `La OKX Card y la Bybit Card son de grandes exchanges asiáticos, disponibles en Europa. La Bybit Card ofrece hasta el 10% en MNT según el volumen de gastos, mientras la OKX Card ofrece hasta el 3% según el nivel de OKB. Ambas gratuitas (0€ anuales).`,
    es_verdict: `En cashback, la Bybit Card (hasta 10% MNT) supera a la OKX Card (hasta 3%). La OKX Card puntúa en interfaz y soporte. Si el cashback es tu prioridad, elige Bybit. Si OKX es tu exchange principal, la OKX Card es la opción natural. Puntuación: Bybit Card 4,0/5 vs OKX Card 3,8/5.`,
    it_intro: `La OKX Card e la Bybit Card provengono entrambe da grandi exchange asiatici, disponibili in Europa. La Bybit Card offre fino al 10% in MNT basato sul volume di spesa, la OKX Card fino al 3% in base al livello OKB. Entrambe gratuite (0€ annuali).`,
    it_verdict: `Sul cashback, la Bybit Card (fino al 10% MNT) supera la OKX Card (fino al 3%). La OKX Card guadagna punti su interfaccia e supporto. Se il cashback è la tua priorità, scegli Bybit. Se OKX è il tuo exchange principale, la OKX Card è la scelta naturale. Punteggio: Bybit Card 4,0/5 vs OKX Card 3,8/5.`,
    faq: [
      { q: 'La OKX Card est-elle disponible en France ?', a: 'Oui, la OKX Card Mastercard est disponible dans l\'UE, France incluse.' },
      { q: 'Quel est le cashback de base de la OKX Card ?', a: 'Le cashback OKX Card dépend de votre niveau de détention OKB. Le taux de base (sans OKB) est généralement autour de 0,5-1 %.' },
    ],
  },

  // ─── Wirex Elite vs Bybit Card ───────────────────────────────────────────────
  'bybit-card-vs-wirex-elite': {
    fr_intro: `La Wirex Elite et la Bybit Card sont deux cartes crypto offrant des cashbacks parmi les plus élevés du marché européen. La Wirex Elite propose jusqu'à 8 % en WXT mais facture ~9,99 €/mois d'abonnement. La Bybit Card offre jusqu'à 10 % en MNT sans aucuns frais ni abonnement. Pour un dépensier modéré, les frais Wirex annulent rapidement l'avantage du cashback.`,
    fr_verdict: `Sur le rapport cashback / coût total, la Bybit Card l'emporte : 0 € de frais, cashback potentiellement supérieur. La Wirex Elite se justifie uniquement si vous utilisez activement l'écosystème Wirex (exchange, multi-devises). Pour la majorité des utilisateurs en France, la Bybit Card est plus avantageuse. Note : Bybit Card 4,0/5 vs Wirex Elite 3,5/5.`,
    de_intro: `Die Wirex Elite und die Bybit Card bieten beide einige der höchsten Cashback-Raten auf dem europäischen Markt. Die Wirex Elite bietet bis zu 8 % in WXT, berechnet aber ~9,99 €/Monat Abonnement. Die Bybit Card bietet bis zu 10 % in MNT ohne Gebühren oder Abonnement.`,
    de_verdict: `Beim Cashback-zu-Gesamtkosten-Verhältnis gewinnt die Bybit Card: 0 € Gebühren, potenziell höheres Cashback. Die Wirex Elite lohnt sich nur bei aktiver Nutzung des Wirex-Ökosystems. Bewertung: Bybit Card 4,0/5 vs. Wirex Elite 3,5/5.`,
    en_intro: `The Wirex Elite and Bybit Card both offer some of the highest cashback rates on the European crypto card market. The Wirex Elite offers up to 8% in WXT but charges ~€9.99/month subscription. The Bybit Card offers up to 10% in MNT with no fees or subscription. For moderate spenders, Wirex's subscription fees quickly negate the cashback advantage.`,
    en_verdict: `On cashback-to-total-cost ratio, the Bybit Card wins: €0 fees, potentially higher cashback. The Wirex Elite is only justified if you actively use the Wirex ecosystem (exchange, multi-currency). For most EU users, the Bybit Card is more advantageous. Score: Bybit Card 4.0/5 vs Wirex Elite 3.5/5.`,
    es_intro: `La Wirex Elite y la Bybit Card ofrecen algunos de los cashbacks más altos del mercado europeo de tarjetas crypto. La Wirex Elite ofrece hasta el 8% en WXT pero cobra ~9,99€/mes de suscripción. La Bybit Card ofrece hasta el 10% en MNT sin comisiones ni suscripción.`,
    es_verdict: `En relación cashback/coste total, la Bybit Card gana: 0€ de comisiones, cashback potencialmente superior. La Wirex Elite solo se justifica si usas activamente el ecosistema Wirex. Puntuación: Bybit Card 4,0/5 vs Wirex Elite 3,5/5.`,
    it_intro: `La Wirex Elite e la Bybit Card offrono entrambe alcuni dei cashback più alti del mercato europeo. La Wirex Elite offre fino all'8% in WXT ma addebita ~9,99€/mese di abbonamento. La Bybit Card offre fino al 10% in MNT senza commissioni né abbonamento.`,
    it_verdict: `Sul rapporto cashback/costo totale, la Bybit Card vince: 0€ di commissioni, cashback potenzialmente superiore. La Wirex Elite si giustifica solo se utilizzi attivamente l'ecosistema Wirex. Punteggio: Bybit Card 4,0/5 vs Wirex Elite 3,5/5.`,
    faq: [
      { q: 'La Wirex Elite a-t-elle des frais mensuels ?', a: 'Oui. Le plan Wirex Elite coûte environ 9,99 €/mois (environ 120 €/an), ce qui réduit significativement le gain net du cashback.' },
    ],
  },

  // ─── Coinbase Card vs Bitpanda Card ──────────────────────────────────────────
  'bitpanda-card-vs-coinbase-card': {
    fr_intro: `La Coinbase Card et la Bitpanda Card sont deux cartes crypto européennes reconnues pour leur sérieux et leur conformité réglementaire. La Coinbase Card offre 4 % en XLM ou 1 % en BTC sans staking. La Bitpanda Card propose jusqu'à 1 % en BEST (token Bitpanda), avec des avantages supplémentaires pour les détenteurs de BEST. Les deux plateformes sont régulées en Europe, ce qui en fait des choix fiables pour les utilisateurs prudents.`,
    fr_verdict: `Sur le cashback pur, la Coinbase Card (4 % XLM ou 1 % BTC) surpasse la Bitpanda Card (1 % BEST). Cependant, la Bitpanda Card est particulièrement intéressante pour les utilisateurs Bitpanda qui détiennent déjà du BEST. Pour les autres, la Coinbase Card offre plus de valeur. Note : Coinbase Card 3,7/5 vs Bitpanda Card 3,6/5.`,
    de_intro: `Die Coinbase Card und die Bitpanda Card sind beide EU-regulierte Krypto-Karten, die für ihre Zuverlässigkeit und Compliance bekannt sind. Die Coinbase Card bietet 4 % in XLM oder 1 % in BTC ohne Staking. Die Bitpanda Card bietet bis zu 1 % in BEST mit zusätzlichen Vorteilen für BEST-Inhaber.`,
    de_verdict: `Beim reinen Cashback übertrifft die Coinbase Card (4 % XLM oder 1 % BTC) die Bitpanda Card (1 % BEST). Die Bitpanda Card ist besonders interessant für bestehende Bitpanda-Nutzer mit BEST. Bewertung: Coinbase Card 3,7/5 vs. Bitpanda Card 3,6/5.`,
    en_intro: `The Coinbase Card and Bitpanda Card are both EU-regulated crypto cards known for their reliability and compliance. The Coinbase Card offers 4% in XLM or 1% in BTC with no staking. The Bitpanda Card offers up to 1% in BEST (Bitpanda token), with extra benefits for BEST holders. Both platforms are EU-regulated, making them safe choices for cautious users.`,
    en_verdict: `On pure cashback, the Coinbase Card (4% XLM or 1% BTC) outperforms the Bitpanda Card (1% BEST). However, the Bitpanda Card is particularly interesting for existing Bitpanda users who already hold BEST. For others, the Coinbase Card offers more value. Score: Coinbase Card 3.7/5 vs Bitpanda Card 3.6/5.`,
    es_intro: `La Coinbase Card y la Bitpanda Card son tarjetas crypto reguladas en la UE conocidas por su fiabilidad y cumplimiento normativo. La Coinbase Card ofrece 4% en XLM o 1% en BTC sin staking. La Bitpanda Card ofrece hasta 1% en BEST con ventajas adicionales para tenedores de BEST.`,
    es_verdict: `En cashback puro, la Coinbase Card (4% XLM o 1% BTC) supera a la Bitpanda Card (1% BEST). La Bitpanda Card es especialmente interesante para usuarios de Bitpanda que ya tienen BEST. Puntuación: Coinbase Card 3,7/5 vs Bitpanda Card 3,6/5.`,
    it_intro: `La Coinbase Card e la Bitpanda Card sono entrambe carte crypto regolamentate nell'UE, note per affidabilità e conformità. La Coinbase Card offre 4% in XLM o 1% in BTC senza staking. La Bitpanda Card offre fino all'1% in BEST con vantaggi aggiuntivi per i detentori di BEST.`,
    it_verdict: `Sul cashback puro, la Coinbase Card (4% XLM o 1% BTC) supera la Bitpanda Card (1% BEST). La Bitpanda Card è particolarmente interessante per utenti Bitpanda che hanno già BEST. Punteggio: Coinbase Card 3,7/5 vs Bitpanda Card 3,6/5.`,
    faq: [
      { q: 'La Bitpanda Card est-elle disponible en dehors de l\'Autriche ?', a: 'Oui. La Bitpanda Card Visa est disponible dans toute l\'UE, y compris la France, l\'Allemagne, l\'Espagne et l\'Italie.' },
    ],
  },

  // ─── 6 PAIRES MANQUANTES ──────────────────────────────────────────────────────

  // ─── Nexo Card vs OKX Card ───────────────────────────────────────────────────
  'nexo-card-vs-okx-card': {
    fr_intro: `La Nexo Card et la OKX Card s'adressent à deux types d'investisseurs crypto. La Nexo Card offre 2 % de cashback en BTC sans staking, idéale pour les utilisateurs cherchant de la simplicité. La OKX Card propose jusqu'à 3 % de cashback en OKB, basé sur votre niveau de détention OKB. Les deux cartes sont gratuites (0 € de frais annuels). La Nexo Card est plus accessible aux débutants, la OKX Card est plus avantageuse si vous êtes déjà actif sur l'exchange OKX.`,
    fr_verdict: `Pour un utilisateur sans token OKB, la Nexo Card est supérieure : 2 % en BTC garanti vs un cashback OKX qui peut être inférieur selon votre niveau OKB. Pour un trader actif sur OKX, la OKX Card peut offrir 3 % sans friction supplémentaire. Note : Nexo Card 4,2/5 vs OKX Card 3,8/5.`,
    de_intro: `Die Nexo Card und die OKX Card richten sich an zwei Typen von Krypto-Investoren. Die Nexo Card bietet 2 % Cashback in BTC ohne Staking für einfachsuchende Nutzer. Die OKX Card bietet bis zu 3 % in OKB, abhängig von Ihrem OKB-Bestandsniveau. Beide Karten sind kostenlos.`,
    de_verdict: `Für Nutzer ohne OKB-Bestände ist die Nexo Card überlegen: 2 % in BTC garantiert. Für aktive OKX-Trader kann die OKX Card bis zu 3 % bieten. Bewertung: Nexo Card 4,2/5 vs. OKX Card 3,8/5.`,
    en_intro: `The Nexo Card and OKX Card serve two types of crypto investors. The Nexo Card offers 2% cashback in BTC with no staking — ideal for users seeking simplicity. The OKX Card offers up to 3% cashback in OKB, based on your OKB holding level. Both cards are free (€0 annual fees). The Nexo Card is more beginner-friendly; the OKX Card is more advantageous if you're already active on the OKX exchange.`,
    en_verdict: `For users without OKB, the Nexo Card is superior: guaranteed 2% in BTC vs OKX cashback that may be lower depending on your OKB level. For active OKX traders, the OKX Card can offer 3% without extra friction. Score: Nexo Card 4.2/5 vs OKX Card 3.8/5.`,
    es_intro: `La Nexo Card y la OKX Card se dirigen a dos tipos de inversores crypto. La Nexo Card ofrece 2% en BTC sin staking, ideal para quienes buscan simplicidad. La OKX Card ofrece hasta 3% en OKB según el nivel de tenencia. Ambas son gratuitas (0€ anuales).`,
    es_verdict: `Para usuarios sin OKB, la Nexo Card es superior: 2% en BTC garantizado vs cashback OKX que puede ser menor según el nivel OKB. Para traders activos en OKX, la OKX Card puede ofrecer 3%. Puntuación: Nexo Card 4,2/5 vs OKX Card 3,8/5.`,
    it_intro: `La Nexo Card e la OKX Card si rivolgono a due tipi di investitori crypto. La Nexo Card offre il 2% in BTC senza staking, ideale per chi cerca semplicità. La OKX Card offre fino al 3% in OKB in base al livello di possesso. Entrambe gratuite (0€ annuali).`,
    it_verdict: `Per utenti senza OKB, la Nexo Card è superiore: 2% in BTC garantito vs cashback OKX che può essere inferiore. Per trader attivi su OKX, la OKX Card può offrire il 3%. Punteggio: Nexo Card 4,2/5 vs OKX Card 3,8/5.`,
    faq: [
      { q: 'La OKX Card offre-t-elle du cashback sans détenir de OKB ?', a: 'Le cashback de la OKX Card est lié à votre niveau de détention OKB. Sans OKB, le taux est réduit. La Nexo Card offre 2 % en BTC sans condition de token.' },
    ],
  },

  // ─── Binance Card vs Crypto.com Midnight Blue ────────────────────────────────
  'binance-card-vs-crypto-com-midnight-blue': {
    fr_intro: `La Binance Card et la Crypto.com Midnight Blue sont deux cartes crypto gratuites sans staking, mais avec des niveaux de cashback très différents. La Binance Card peut atteindre 8 % en BNB selon votre balance BNB ; la Midnight Blue plafonne à 1 % en CRO. Si vous possédez du BNB, la Binance Card est clairement supérieure. La Midnight Blue se justifie uniquement pour les utilisateurs déjà engagés dans l'écosystème Crypto.com.`,
    fr_verdict: `Pour le cashback pur, la Binance Card surpasse largement la Midnight Blue (jusqu'à 8 % BNB vs 1 % CRO). La Crypto.com Midnight Blue est pertinente uniquement si vous utilisez déjà l'app Crypto.com sans vouloir gérer un compte Binance. Note : Binance Card 3,9/5 vs Crypto.com Midnight Blue 3,8/5.`,
    de_intro: `Die Binance Card und die Crypto.com Midnight Blue sind beide kostenlose Krypto-Karten ohne Staking, aber mit sehr unterschiedlichen Cashback-Niveaus. Die Binance Card kann je nach BNB-Guthaben bis zu 8 % in BNB erreichen; die Midnight Blue ist bei 1 % in CRO gedeckelt.`,
    de_verdict: `Beim reinen Cashback übertrifft die Binance Card die Midnight Blue deutlich (bis zu 8 % BNB vs. 1 % CRO). Die Midnight Blue ist nur für bestehende Crypto.com-Nutzer relevant. Bewertung: Binance Card 3,9/5 vs. Crypto.com Midnight Blue 3,8/5.`,
    en_intro: `The Binance Card and Crypto.com Midnight Blue are both free crypto cards with no staking, but with very different cashback levels. The Binance Card can reach 8% in BNB based on your BNB balance; the Midnight Blue caps at 1% in CRO. If you hold BNB, the Binance Card is clearly superior. The Midnight Blue is only justified for users already committed to the Crypto.com ecosystem.`,
    en_verdict: `For pure cashback, the Binance Card vastly outperforms the Midnight Blue (up to 8% BNB vs 1% CRO). The Crypto.com Midnight Blue is relevant only if you already use the Crypto.com app without wanting to manage a Binance account. Score: Binance Card 3.9/5 vs Crypto.com Midnight Blue 3.8/5.`,
    es_intro: `La Binance Card y la Crypto.com Midnight Blue son ambas gratuitas sin staking, pero con niveles de cashback muy diferentes. La Binance Card puede alcanzar el 8% en BNB según el saldo; la Midnight Blue se limita al 1% en CRO.`,
    es_verdict: `En cashback puro, la Binance Card supera ampliamente a la Midnight Blue (hasta 8% BNB vs 1% CRO). La Midnight Blue solo es relevante para usuarios ya comprometidos con Crypto.com. Puntuación: Binance Card 3,9/5 vs Crypto.com Midnight Blue 3,8/5.`,
    it_intro: `La Binance Card e la Crypto.com Midnight Blue sono entrambe gratuite senza staking, ma con livelli di cashback molto diversi. La Binance Card può raggiungere l'8% in BNB in base al saldo; la Midnight Blue è limitata all'1% in CRO.`,
    it_verdict: `Sul cashback puro, la Binance Card supera nettamente la Midnight Blue (fino all'8% BNB vs 1% CRO). La Midnight Blue è rilevante solo per utenti già attivi su Crypto.com. Punteggio: Binance Card 3,9/5 vs Crypto.com Midnight Blue 3,8/5.`,
    faq: [
      { q: 'Faut-il staker du BNB pour la Binance Card ?', a: 'Non. La Binance Card ne requiert pas de staking au sens propre : il suffit de détenir du BNB sur votre compte Binance pour débloquer le cashback.' },
    ],
  },

  // ─── Bybit Card vs Coinbase Card ─────────────────────────────────────────────
  'bybit-card-vs-coinbase-card': {
    fr_intro: `La Bybit Card et la Coinbase Card représentent deux approches opposées : la Bybit Card maximise le cashback (jusqu'à 10 % en MNT) pour les gros dépensiers, tandis que la Coinbase Card privilégie la sécurité réglementaire et la facilité d'utilisation (1 % BTC ou 4 % XLM, sans staking). Toutes deux sont gratuites. La Coinbase est cotée au Nasdaq — référence de confiance pour les débutants.`,
    fr_verdict: `Si le cashback maximum est votre objectif, la Bybit Card gagne. Pour un débutant cherchant la carte la plus sûre et la plus simple, la Coinbase Card est préférable. La Bybit Card s'adresse aux utilisateurs actifs de l'exchange Bybit. Note : Bybit Card 4,0/5 vs Coinbase Card 3,7/5.`,
    de_intro: `Die Bybit Card und die Coinbase Card vertreten zwei entgegengesetzte Ansätze: Die Bybit Card maximiert Cashback (bis zu 10 % in MNT) für Vielausgeber, während die Coinbase Card regulatorische Sicherheit und Benutzerfreundlichkeit priorisiert (1 % BTC oder 4 % XLM, kein Staking). Beide kostenlos. Coinbase ist an der Nasdaq notiert.`,
    de_verdict: `Wenn maximales Cashback Ihr Ziel ist, gewinnt die Bybit Card. Für Einsteiger, die die sicherste und einfachste Karte suchen, ist die Coinbase Card vorzuziehen. Bewertung: Bybit Card 4,0/5 vs. Coinbase Card 3,7/5.`,
    en_intro: `The Bybit Card and Coinbase Card represent two opposite approaches: the Bybit Card maximizes cashback (up to 10% in MNT) for heavy spenders, while the Coinbase Card prioritizes regulatory safety and ease of use (1% BTC or 4% XLM, no staking). Both are free. Coinbase is Nasdaq-listed — a key trust signal for beginners.`,
    en_verdict: `If maximum cashback is your goal, the Bybit Card wins. For beginners seeking the safest and most user-friendly card, the Coinbase Card is preferable. The Bybit Card targets active Bybit exchange users. Score: Bybit Card 4.0/5 vs Coinbase Card 3.7/5.`,
    es_intro: `La Bybit Card y la Coinbase Card representan dos enfoques opuestos: la Bybit maximiza el cashback (hasta 10% en MNT) para grandes gastadores, mientras la Coinbase prioriza la seguridad regulatoria y facilidad de uso (1% BTC o 4% XLM, sin staking). Ambas gratuitas. Coinbase está cotizada en Nasdaq.`,
    es_verdict: `Si el cashback máximo es tu objetivo, la Bybit Card gana. Para principiantes que buscan la tarjeta más segura, la Coinbase Card es preferible. Puntuación: Bybit Card 4,0/5 vs Coinbase Card 3,7/5.`,
    it_intro: `La Bybit Card e la Coinbase Card rappresentano due approcci opposti: la Bybit massimizza il cashback (fino al 10% in MNT) per grandi spenditori, mentre la Coinbase priorizza sicurezza regolamentare e facilità d'uso (1% BTC o 4% XLM, senza staking). Entrambe gratuite. Coinbase è quotata al Nasdaq.`,
    it_verdict: `Se il cashback massimo è il tuo obiettivo, la Bybit Card vince. Per principianti che cercano la carta più sicura e semplice, la Coinbase Card è preferibile. Punteggio: Bybit Card 4,0/5 vs Coinbase Card 3,7/5.`,
    faq: [
      { q: 'La Coinbase Card est-elle adaptée aux débutants ?', a: 'Oui. La Coinbase Card est l\'une des cartes crypto les plus simples à utiliser, avec une interface intuitive et la sécurité d\'une plateforme Nasdaq.' },
    ],
  },

  // ─── Crypto.com Midnight Blue vs Wirex Elite ─────────────────────────────────
  'crypto-com-midnight-blue-vs-wirex-elite': {
    fr_intro: `La Crypto.com Midnight Blue et la Wirex Elite sont dans des catégories différentes : la première est une carte d'entrée de gamme gratuite (1 % cashback CRO, sans staking), la seconde est une carte premium avec abonnement (~9,99 €/mois) offrant jusqu'à 8 % en WXT. La comparaison se résume à la question : vaut-il mieux payer un abonnement pour un cashback plus élevé ?`,
    fr_verdict: `Pour des dépenses inférieures à 1 500 €/mois, la Crypto.com Midnight Blue est plus rentable malgré son cashback inférieur : les frais d'abonnement Wirex Elite (~120 €/an) annulent le gain supplémentaire. Au-delà, la Wirex Elite peut devenir intéressante. Note : Crypto.com Midnight Blue 3,8/5 vs Wirex Elite 3,5/5.`,
    de_intro: `Die Crypto.com Midnight Blue und die Wirex Elite befinden sich in verschiedenen Kategorien: Erstere ist eine kostenlose Einsteigerkarte (1 % CRO-Cashback, kein Staking), Letztere ist eine Premium-Karte mit Abonnement (~9,99 €/Monat) und bis zu 8 % in WXT.`,
    de_verdict: `Für Ausgaben unter 1.500 €/Monat ist die Midnight Blue rentabler: Das Wirex-Elite-Abonnement (~120 €/Jahr) macht den Cashback-Vorteil zunichte. Darüber kann die Wirex Elite interessant werden. Bewertung: Midnight Blue 3,8/5 vs. Wirex Elite 3,5/5.`,
    en_intro: `The Crypto.com Midnight Blue and Wirex Elite are in very different tiers: the first is a free entry-level card (1% CRO cashback, no staking), the second is a premium card with subscription (~€9.99/month) offering up to 8% in WXT. The comparison boils down to: is it worth paying a subscription for higher cashback?`,
    en_verdict: `For spending under €1,500/month, the Crypto.com Midnight Blue is more profitable despite its lower cashback: Wirex Elite's subscription fees (~€120/year) negate the additional gain. Above that threshold, the Wirex Elite can become worthwhile. Score: Midnight Blue 3.8/5 vs Wirex Elite 3.5/5.`,
    es_intro: `La Crypto.com Midnight Blue y la Wirex Elite están en categorías muy diferentes: la primera es una tarjeta de entrada gratuita (1% CRO, sin staking), la segunda es premium con suscripción (~9,99€/mes) que ofrece hasta 8% en WXT.`,
    es_verdict: `Para gastos inferiores a 1.500€/mes, la Midnight Blue es más rentable: la suscripción de Wirex Elite (~120€/año) anula la ventaja del cashback. Por encima de ese umbral, la Wirex Elite puede ser interesante. Puntuación: Midnight Blue 3,8/5 vs Wirex Elite 3,5/5.`,
    it_intro: `La Crypto.com Midnight Blue e la Wirex Elite sono in categorie molto diverse: la prima è una carta entry-level gratuita (1% CRO, senza staking), la seconda è premium con abbonamento (~9,99€/mese) che offre fino all'8% in WXT.`,
    it_verdict: `Per spese inferiori a 1.500€/mese, la Midnight Blue è più redditizia: l'abbonamento Wirex Elite (~120€/anno) annulla il vantaggio del cashback. Oltre quella soglia, la Wirex Elite può diventare interessante. Punteggio: Midnight Blue 3,8/5 vs Wirex Elite 3,5/5.`,
    faq: [
      { q: 'Peut-on passer de la Midnight Blue à une carte Crypto.com supérieure ?', a: 'Oui. Crypto.com propose plusieurs niveaux de cartes (Ruby, Jade, Obsidian). Vous pouvez upgrader en stakant davantage de CRO sur votre compte.' },
    ],
  },

  // ─── Bitpanda Card vs Nexo Card ──────────────────────────────────────────────
  'bitpanda-card-vs-nexo-card': {
    fr_intro: `La Bitpanda Card et la Nexo Card sont deux cartes crypto émises par des acteurs européens régulés — un point fort pour les utilisateurs qui valorisent la sécurité réglementaire. La Nexo Card offre 2 % de cashback en BTC sans staking. La Bitpanda Card propose jusqu'à 1 % en BEST (token Bitpanda), avec des avantages supplémentaires pour les utilisateurs de la plateforme Bitpanda.`,
    fr_verdict: `Sur le cashback pur, la Nexo Card (2 % BTC) surpasse la Bitpanda Card (1 % BEST). Cependant, la Bitpanda Card s'intègre parfaitement dans l'écosystème Bitpanda (gold, ETFs, crypto). Pour un utilisateur Bitpanda actif, les deux cartes peuvent être complémentaires. Note : Nexo Card 4,2/5 vs Bitpanda Card 3,6/5.`,
    de_intro: `Die Bitpanda Card und die Nexo Card sind beide von europäischen regulierten Akteuren ausgegeben — ein Pluspunkt für sicherheitsbewusste Nutzer. Die Nexo Card bietet 2 % Cashback in BTC ohne Staking. Die Bitpanda Card bietet bis zu 1 % in BEST, mit zusätzlichen Vorteilen für Bitpanda-Plattformnutzer.`,
    de_verdict: `Beim reinen Cashback übertrifft die Nexo Card (2 % BTC) die Bitpanda Card (1 % BEST). Die Bitpanda Card passt jedoch perfekt ins Bitpanda-Ökosystem (Gold, ETFs, Krypto). Bewertung: Nexo Card 4,2/5 vs. Bitpanda Card 3,6/5.`,
    en_intro: `The Bitpanda Card and Nexo Card are both issued by European regulated players — a strong point for users who value regulatory security. The Nexo Card offers 2% cashback in BTC with no staking. The Bitpanda Card offers up to 1% in BEST (Bitpanda token), with additional benefits for Bitpanda platform users.`,
    en_verdict: `On pure cashback, the Nexo Card (2% BTC) outperforms the Bitpanda Card (1% BEST). However, the Bitpanda Card integrates seamlessly into the Bitpanda ecosystem (gold, ETFs, crypto). For active Bitpanda users, both cards can be complementary. Score: Nexo Card 4.2/5 vs Bitpanda Card 3.6/5.`,
    es_intro: `La Bitpanda Card y la Nexo Card son emitidas por actores europeos regulados, un punto fuerte para usuarios que valoran la seguridad regulatoria. La Nexo Card ofrece 2% en BTC sin staking. La Bitpanda Card ofrece hasta 1% en BEST, con ventajas adicionales para usuarios de la plataforma Bitpanda.`,
    es_verdict: `En cashback puro, la Nexo Card (2% BTC) supera a la Bitpanda Card (1% BEST). Sin embargo, la Bitpanda Card se integra perfectamente en el ecosistema Bitpanda (oro, ETFs, crypto). Puntuación: Nexo Card 4,2/5 vs Bitpanda Card 3,6/5.`,
    it_intro: `La Bitpanda Card e la Nexo Card sono entrambe emesse da attori europei regolamentati — un punto di forza per utenti che valorizzano la sicurezza normativa. La Nexo Card offre il 2% in BTC senza staking. La Bitpanda Card offre fino all'1% in BEST, con vantaggi aggiuntivi per gli utenti della piattaforma Bitpanda.`,
    it_verdict: `Sul cashback puro, la Nexo Card (2% BTC) supera la Bitpanda Card (1% BEST). Tuttavia, la Bitpanda Card si integra perfettamente nell'ecosistema Bitpanda (oro, ETF, crypto). Punteggio: Nexo Card 4,2/5 vs Bitpanda Card 3,6/5.`,
    faq: [
      { q: 'La Bitpanda Card est-elle disponible en France ?', a: 'Oui. La Bitpanda Card Visa est disponible dans toute l\'UE, y compris la France et l\'Allemagne.' },
    ],
  },

  // ─── Binance Card vs OKX Card ────────────────────────────────────────────────
  'binance-card-vs-okx-card': {
    fr_intro: `La Binance Card et la OKX Card sont deux cartes crypto émises par les deux plus grands exchanges mondiaux. La Binance Card offre jusqu'à 8 % de cashback en BNB selon votre balance BNB, sans staking. La OKX Card propose jusqu'à 3 % en OKB selon votre niveau de détention OKB. Les deux cartes sont gratuites. Le BNB (top 5 mondial) est plus liquide et mieux établi que l'OKB.`,
    fr_verdict: `Si vous utilisez principalement Binance, la Binance Card est le choix naturel avec un cashback potentiellement bien supérieur (8 % vs 3 %). Pour les utilisateurs OKX, la OKX Card est préférable. Note : Binance Card 3,9/5 vs OKX Card 3,8/5.`,
    de_intro: `Die Binance Card und die OKX Card werden von den zwei größten Krypto-Exchanges der Welt ausgegeben. Die Binance Card bietet bis zu 8 % Cashback in BNB je nach BNB-Guthaben, ohne Staking. Die OKX Card bietet bis zu 3 % in OKB je nach OKB-Bestand. Beide kostenlos. BNB (Top-5-Krypto) ist liquider als OKB.`,
    de_verdict: `Wenn Sie hauptsächlich Binance nutzen, ist die Binance Card die natürliche Wahl mit potenziell viel höherem Cashback (8 % vs. 3 %). Für OKX-Nutzer ist die OKX Card vorzuziehen. Bewertung: Binance Card 3,9/5 vs. OKX Card 3,8/5.`,
    en_intro: `The Binance Card and OKX Card are issued by the two largest crypto exchanges globally. The Binance Card offers up to 8% cashback in BNB based on your BNB balance, without staking. The OKX Card offers up to 3% in OKB based on your OKB holding level. Both are free. BNB (top-5 crypto) is more liquid and established than OKB.`,
    en_verdict: `If you primarily use Binance, the Binance Card is the natural choice with potentially much higher cashback (8% vs 3%). For OKX users, the OKX Card is preferable. Score: Binance Card 3.9/5 vs OKX Card 3.8/5.`,
    es_intro: `La Binance Card y la OKX Card son emitidas por los dos mayores exchanges crypto del mundo. La Binance Card ofrece hasta el 8% en BNB según el saldo BNB, sin staking. La OKX Card ofrece hasta el 3% en OKB según el nivel de tenencia. Ambas gratuitas. BNB (top 5 global) es más líquido que OKB.`,
    es_verdict: `Si usas principalmente Binance, la Binance Card es la elección natural con cashback potencialmente mucho mayor (8% vs 3%). Para usuarios de OKX, la OKX Card es preferible. Puntuación: Binance Card 3,9/5 vs OKX Card 3,8/5.`,
    it_intro: `La Binance Card e la OKX Card sono emesse dai due maggiori exchange crypto al mondo. La Binance Card offre fino all'8% in BNB in base al saldo BNB, senza staking. La OKX Card offre fino al 3% in OKB in base al livello di possesso. Entrambe gratuite. BNB (top 5 globale) è più liquido di OKB.`,
    it_verdict: `Se usi principalmente Binance, la Binance Card è la scelta naturale con cashback potenzialmente molto superiore (8% vs 3%). Per utenti OKX, la OKX Card è preferibile. Punteggio: Binance Card 3,9/5 vs OKX Card 3,8/5.`,
    faq: [
      { q: 'BNB ou OKB : quel token est plus fiable pour le cashback ?', a: 'Le BNB est le token utilitaire de Binance, exchange numéro 1 mondial par volume. Il est nettement plus liquide et capitalisé que l\'OKB. Le cashback en BNB est donc généralement plus valorisable.' },
    ],
  },

  // ─── Coinbase Card vs Wirex Elite ────────────────────────────────────────────
  'coinbase-card-vs-wirex-elite': {
    fr_intro: `La Coinbase Card et la Wirex Elite Card ciblent des profils très différents. La Coinbase Card est gratuite, sans staking, avec 1 % en BTC ou 4 % en XLM — idéale pour les débutants et utilisateurs qui cherchent la sécurité réglementaire. La Wirex Elite est une carte premium avec abonnement (~9,99 €/mois) et jusqu'à 8 % en WXT — conçue pour les utilisateurs actifs de l'écosystème Wirex.`,
    fr_verdict: `Pour des dépenses raisonnables (moins de 2 000 €/mois), la Coinbase Card est plus rentable : 0 € de frais, cashback BTC sans risque. La Wirex Elite peut battre la Coinbase Card uniquement pour les très gros dépensiers prêts à détenir du WXT. Note : Coinbase Card 3,7/5 vs Wirex Elite 3,5/5.`,
    de_intro: `Die Coinbase Card und die Wirex Elite Card richten sich an sehr unterschiedliche Profile. Die Coinbase Card ist kostenlos, ohne Staking, mit 1 % in BTC oder 4 % in XLM — ideal für Einsteiger. Die Wirex Elite ist eine Premium-Karte mit Abonnement (~9,99 €/Monat) und bis zu 8 % in WXT.`,
    de_verdict: `Für moderate Ausgaben (unter 2.000 €/Monat) ist die Coinbase Card rentabler: 0 € Gebühren, risikofreies BTC-Cashback. Die Wirex Elite kann die Coinbase Card nur für Vielausgeber übertreffen, die bereit sind, WXT zu halten. Bewertung: Coinbase Card 3,7/5 vs. Wirex Elite 3,5/5.`,
    en_intro: `The Coinbase Card and Wirex Elite target very different profiles. The Coinbase Card is free, no staking, with 1% in BTC or 4% in XLM — ideal for beginners and users seeking regulatory safety. The Wirex Elite is a premium card with subscription (~€9.99/month) and up to 8% in WXT — designed for active Wirex ecosystem users.`,
    en_verdict: `For reasonable spending (under €2,000/month), the Coinbase Card is more profitable: €0 fees, risk-free BTC cashback. The Wirex Elite can only beat the Coinbase Card for very high spenders willing to hold WXT. Score: Coinbase Card 3.7/5 vs Wirex Elite 3.5/5.`,
    es_intro: `La Coinbase Card y la Wirex Elite se dirigen a perfiles muy diferentes. La Coinbase Card es gratuita, sin staking, con 1% en BTC o 4% en XLM — ideal para principiantes. La Wirex Elite es premium con suscripción (~9,99€/mes) y hasta 8% en WXT.`,
    es_verdict: `Para gastos razonables (menos de 2.000€/mes), la Coinbase Card es más rentable: 0€ de cuotas, cashback BTC sin riesgo. La Wirex Elite solo puede superar a la Coinbase Card para grandes gastadores con WXT. Puntuación: Coinbase Card 3,7/5 vs Wirex Elite 3,5/5.`,
    it_intro: `La Coinbase Card e la Wirex Elite si rivolgono a profili molto diversi. La Coinbase Card è gratuita, senza staking, con 1% in BTC o 4% in XLM — ideale per principianti. La Wirex Elite è premium con abbonamento (~9,99€/mese) e fino all'8% in WXT.`,
    it_verdict: `Per spese ragionevoli (meno di 2.000€/mese), la Coinbase Card è più redditizia: 0€ di commissioni, cashback BTC senza rischi. La Wirex Elite può superare la Coinbase Card solo per grandi spenditori disposti a detenere WXT. Punteggio: Coinbase Card 3,7/5 vs Wirex Elite 3,5/5.`,
    faq: [
      { q: 'La Coinbase Card est-elle plus sûre que la Wirex Elite ?', a: 'Les deux plateformes sont régulées en Europe. Coinbase est cotée au Nasdaq, ce qui lui confère une transparence publique supplémentaire. Wirex détient des licences e-money dans plusieurs pays de l\'UE.' },
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
