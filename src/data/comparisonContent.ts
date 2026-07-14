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
  /** FAQ items (DE) */
  de_faq?: { q: string; a: string }[];
  /** FAQ items (ES) */
  es_faq?: { q: string; a: string }[];
  /** FAQ items (IT) */
  it_faq?: { q: string; a: string }[];
  /** FAQ items (EN) */
  en_faq?: { q: string; a: string }[];
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
    es_intro: `La Nexo Card y la Bybit Card están entre las tarjetas cripto más populares de Europa, aunque apuntan a perfiles muy diferentes. La Nexo Card ofrece hasta un 2 % de cashback en BTC o NEXO sin staking requerido. La Bybit Card puede alcanzar el 10 % en MNT según el volumen de gasto mensual. Ambas son gratuitas y están disponibles en toda la UE.`,
    es_verdict: `Para gastos moderados (menos de 500 €/mes), la Nexo Card es la apuesta segura: 2 % de cashback en BTC garantizado sin condiciones de volumen. Para grandes gastadores, la Bybit Card puede desbloquear tasas considerablemente más altas. Puntuación: Nexo Card 4,2/5 vs Bybit Card 4,0/5.`,
    it_intro: `La Nexo Card e la Bybit Card sono tra le carte crypto più popolari in Europa, pur rivolgendosi a profili molto diversi. La Nexo Card offre fino al 2 % di cashback in BTC o NEXO senza staking richiesto. La Bybit Card può raggiungere il 10 % in MNT in base al volume mensile di spesa. Entrambe sono gratuite e disponibili in tutta l'UE.`,
    it_verdict: `Per spese moderate (meno di 500 €/mese), la Nexo Card è la scelta sicura: 2 % di cashback in BTC garantito senza condizioni di volume. Per i grandi spenditori, la Bybit Card può sbloccare tassi decisamente più elevati. Punteggio: Nexo Card 4,2/5 vs Bybit Card 4,0/5.`,
    en_intro: `The Nexo Card and Bybit Card are among the most popular crypto cards in Europe, but they target very different profiles. The Nexo Card offers up to 2% cashback in BTC or NEXO with no staking required — a major advantage for users who don't want to lock up capital. The Bybit Card offers cashback up to 10% in MNT, also without staking but based on monthly spending volume. Both cards are free (€0 annual fees) and available across the EU.`,
    en_verdict: `For moderate daily spending (under €500/month), the Nexo Card is the safe bet: guaranteed 2% cashback in BTC with no volume conditions. For high spenders, the Bybit Card can unlock significantly higher rates through its MNT cashback tiers. Our overall score: Nexo Card 4.2/5 vs Bybit Card 4.0/5.`,
    faq: [
      { q: 'Nexo Card ou Bybit Card : laquelle a le meilleur cashback ?', a: 'La Bybit Card peut atteindre 10 % de cashback en MNT pour les très gros dépensiers, contre 2 % en BTC pour la Nexo Card. Cependant, la Nexo Card ne dépend pas du volume mensuel, ce qui la rend plus prévisible.' },
      { q: 'La Nexo Card nécessite-t-elle du staking ?', a: 'Non. La Nexo Card verse jusqu\'à 2 % de cashback en BTC sans staking obligatoire. Avoir des NEXO en portefeuille peut améliorer le taux, mais c\'est optionnel.' },
      { q: 'La Bybit Card est-elle disponible en France ?', a: 'Oui. La Bybit Card est disponible en France et dans la majorité des pays de l\'UE via Mastercard.' },
    ],
    de_faq: [
      { q: 'Nexo Card oder Bybit Card: Welche bietet das bessere Cashback?', a: 'Die Bybit Card kann bis zu 10 % Cashback in MNT für Vielausgeber erreichen, verglichen mit 2 % in BTC für die Nexo Card. Allerdings ist die Nexo Card nicht vom Monatsvolumen abhängig, was sie vorhersehbarer macht.' },
      { q: 'Benötigt die Nexo Card Staking?', a: 'Nein. Die Nexo Card zahlt bis zu 2 % Cashback in BTC ohne obligatorisches Staking. NEXO im Wallet zu halten kann die Rate verbessern, ist aber optional.' },
      { q: 'Ist die Bybit Card in Deutschland verfügbar?', a: 'Ja. Die Bybit Card ist in Deutschland und den meisten EU-Ländern über Mastercard verfügbar.' },
    ],
    es_faq: [
      { q: 'Nexo Card o Bybit Card: ¿cuál tiene el mejor cashback?', a: 'La Bybit Card puede alcanzar el 10 % de cashback en MNT para grandes gastadores, frente al 2 % en BTC de la Nexo Card. Sin embargo, la Nexo Card no depende del volumen mensual, lo que la hace más predecible.' },
      { q: '¿La Nexo Card requiere staking?', a: 'No. La Nexo Card paga hasta el 2 % de cashback en BTC sin staking obligatorio. Tener NEXO en cartera puede mejorar la tasa, pero es opcional.' },
      { q: '¿La Bybit Card está disponible en España?', a: 'Sí. La Bybit Card está disponible en España y en la mayoría de países de la UE a través de Mastercard.' },
    ],
    it_faq: [
      { q: 'Nexo Card o Bybit Card: quale ha il miglior cashback?', a: 'La Bybit Card può raggiungere il 10 % di cashback in MNT per i grandi spenditori, contro il 2 % in BTC della Nexo Card. Tuttavia, la Nexo Card non dipende dal volume mensile, rendendola più prevedibile.' },
      { q: 'La Nexo Card richiede staking?', a: 'No. La Nexo Card paga fino al 2 % di cashback in BTC senza staking obbligatorio. Avere NEXO nel portafoglio può migliorare il tasso, ma è facoltativo.' },
      { q: 'La Bybit Card è disponibile in Italia?', a: 'Sì. La Bybit Card è disponibile in Italia e nella maggior parte dei paesi dell\'UE tramite Mastercard.' },
    ],
    en_faq: [
      { q: 'Nexo Card or Bybit Card: which has the better cashback?', a: 'The Bybit Card can reach 10% cashback in MNT for high spenders, versus 2% in BTC for the Nexo Card. However, the Nexo Card doesn\'t depend on monthly volume, making it more predictable.' },
      { q: 'Does the Nexo Card require staking?', a: 'No. The Nexo Card pays up to 2% cashback in BTC with no mandatory staking. Holding NEXO in your wallet can improve the rate, but it\'s optional.' },
      { q: 'Is the Bybit Card available in Europe?', a: 'Yes. The Bybit Card is available across the EU via Mastercard.' },
    ],
  },

  // ─── Nexo Card vs Crypto.com Midnight Blue ────────────────────────────────────
  'crypto-com-midnight-blue-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Crypto.com Midnight Blue Card représentent deux philosophies opposées : la première récompense sans condition de staking (jusqu'à 2 % en BTC), quand la seconde est la carte d'entrée de gamme de Crypto.com — gratuite, sans staking, mais sans cashback significatif (1 % en CRO). Si vous comparez ces deux cartes, c'est probablement pour savoir laquelle offre le meilleur rapport qualité/prix au quotidien.`,
    fr_verdict: `La Nexo Card l'emporte clairement sur le cashback (2 % BTC vs 1 % CRO pour la Midnight Blue). La Crypto.com Midnight Blue se justifie principalement si vous êtes déjà client Crypto.com et utilisez leur exchange. Pour un nouvel utilisateur cherchant la meilleure carte gratuite sans staking en France, la Nexo Card est le meilleur choix en 2026. Note : Nexo Card 4,2/5 vs Crypto.com Midnight Blue 3,8/5.`,
    de_intro: `Die Nexo Card und die Crypto.com Midnight Blue vertreten zwei entgegengesetzte Philosophien: Erstere belohnt ohne Staking-Anforderungen (bis zu 2 % in BTC), während die Midnight Blue die Einstiegskarte von Crypto.com ist — kostenlos, kein Staking, aber nur 1 % Cashback in CRO.`,
    de_verdict: `Die Nexo Card gewinnt klar beim Cashback (2 % BTC vs. 1 % CRO). Die Midnight Blue ist sinnvoll, wenn Sie bereits Crypto.com-Kunde sind. Für neue EU-Nutzer, die die beste kostenlose No-Staking-Karte suchen, ist die Nexo Card 2026 die Topwahl. Bewertung: Nexo Card 4,2/5 vs. Crypto.com Midnight Blue 3,8/5.`,
    es_intro: `La Nexo Card y la Crypto.com Midnight Blue representan dos filosofías opuestas: la primera recompensa sin staking (hasta un 2 % en BTC), mientras que la Midnight Blue es la tarjeta de entrada de Crypto.com — gratuita, sin staking, pero con cashback limitado (1 % en CRO).`,
    es_verdict: `La Nexo Card gana claramente en cashback (2 % BTC vs. 1 % CRO). La Midnight Blue tiene sentido si ya eres cliente de Crypto.com. Para un nuevo usuario que busca la mejor tarjeta gratuita sin staking en la UE, la Nexo Card es la opción top en 2026. Puntuación: Nexo Card 4,2/5 vs Crypto.com Midnight Blue 3,8/5.`,
    it_intro: `La Nexo Card e la Crypto.com Midnight Blue rappresentano due filosofie opposte: la prima premia senza staking (fino al 2 % in BTC), mentre la Midnight Blue è la carta base di Crypto.com — gratuita, senza staking, ma con cashback limitato (1 % in CRO).`,
    it_verdict: `La Nexo Card vince chiaramente sul cashback (2 % BTC vs. 1 % CRO). La Midnight Blue è giustificata principalmente se sei già cliente Crypto.com. Per un nuovo utente nell'UE che cerca la migliore carta gratuita senza staking, la Nexo Card è la scelta top nel 2026. Punteggio: Nexo Card 4,2/5 vs Crypto.com Midnight Blue 3,8/5.`,
    en_intro: `The Nexo Card and Crypto.com Midnight Blue represent two opposite philosophies: the first rewards without staking requirements (up to 2% in BTC), while the second is Crypto.com's entry-level card — free, no staking, but limited cashback (1% in CRO). If you're comparing these two, you're likely wondering which offers the best value for everyday spending.`,
    en_verdict: `The Nexo Card clearly wins on cashback (2% BTC vs 1% CRO for the Midnight Blue). The Crypto.com Midnight Blue makes sense mainly if you're already a Crypto.com exchange user. For a new user seeking the best free no-staking card in the EU, the Nexo Card is the top pick in 2026. Score: Nexo Card 4.2/5 vs Crypto.com Midnight Blue 3.8/5.`,
    faq: [
      { q: 'Crypto.com Midnight Blue vs Nexo Card : laquelle choisir sans staking ?', a: 'La Nexo Card offre 2 % de cashback en BTC sans staking, contre seulement 1 % en CRO pour la Midnight Blue. La Nexo Card est supérieure si vous ne souhaitez pas de staking.' },
      { q: 'La Crypto.com Midnight Blue a-t-elle un cashback ?', a: 'Oui, 1 % de cashback en CRO. Sans staking CRO requis, c\'est la carte d\'entrée de gamme de Crypto.com.' },
    ],
    de_faq: [
      { q: 'Crypto.com Midnight Blue vs Nexo Card: Welche ohne Staking wählen?', a: 'Die Nexo Card bietet 2 % Cashback in BTC ohne Staking, verglichen mit nur 1 % in CRO für die Midnight Blue. Die Nexo Card ist überlegen, wenn Sie kein Staking wünschen.' },
      { q: 'Hat die Crypto.com Midnight Blue Cashback?', a: 'Ja, 1 % Cashback in CRO. Es ist die Einstiegskarte von Crypto.com ohne Staking-Anforderungen, aber ohne Premium-Vorteile.' },
    ],
    es_faq: [
      { q: 'Crypto.com Midnight Blue vs Nexo Card: ¿cuál elegir sin staking?', a: 'La Nexo Card ofrece un 2 % de cashback en BTC sin staking, frente al 1 % en CRO de la Midnight Blue. La Nexo Card es superior si no deseas staking.' },
      { q: '¿La Crypto.com Midnight Blue tiene cashback?', a: 'Sí, un 1 % en CRO. Es la tarjeta de entrada de Crypto.com, sin staking requerido pero sin ventajas premium.' },
    ],
    it_faq: [
      { q: 'Crypto.com Midnight Blue vs Nexo Card: quale scegliere senza staking?', a: 'La Nexo Card offre il 2 % di cashback in BTC senza staking, contro solo l\'1 % in CRO della Midnight Blue. La Nexo Card è superiore se non vuoi fare staking.' },
      { q: 'La Crypto.com Midnight Blue ha cashback?', a: 'Sì, l\'1 % in CRO. È la carta base di Crypto.com, senza staking richiesto ma senza vantaggi premium.' },
    ],
    en_faq: [
      { q: 'Crypto.com Midnight Blue vs Nexo Card: which to choose without staking?', a: 'The Nexo Card offers 2% cashback in BTC with no staking, versus only 1% in CRO for the Midnight Blue. The Nexo Card is superior if you don\'t want to stake.' },
      { q: 'Does the Crypto.com Midnight Blue have cashback?', a: 'Yes, 1% in CRO. It\'s Crypto.com\'s entry-level card with no staking required, but no premium benefits.' },
    ],
  },

  // ─── Nexo Card vs Crypto.com Ruby Steel ─────────────────────────────────────
  'crypto-com-ruby-steel-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Crypto.com Ruby Steel Card sont souvent comparées car elles ciblent un profil similaire : l'investisseur crypto actif cherchant du cashback sans immobiliser des dizaines de milliers d'euros. La Crypto.com Ruby Steel requiert un staking de 400 € en CRO pour un cashback de 2 % en CRO, tandis que la Nexo Card offre 2 % en BTC sans staking obligatoire. La différence clé : la valeur du CRO est volatile, celle du BTC aussi — mais le BTC est généralement considéré comme plus fiable comme réserve de valeur.`,
    fr_verdict: `Pour 2026, les deux cartes sont proches en cashback (2 % chacune), mais la Nexo Card prend l'avantage grâce à l'absence de staking et au cashback en BTC plutôt qu'en token propriétaire (CRO). Si vous détenez déjà des CRO sur Crypto.com, la Ruby Steel peut être logique. Sinon, la Nexo Card est la recommandation par défaut. Note : Nexo Card 4,2/5 vs Crypto.com Ruby Steel 4,0/5.`,
    de_intro: `Die Nexo Card und die Crypto.com Ruby Steel werden oft verglichen, da sie ein ähnliches Profil ansprechen: aktive Krypto-Investoren, die Cashback ohne immenses Kapital suchen. Die Ruby Steel erfordert 400 € CRO-Staking für 2 % Cashback in CRO, während die Nexo Card 2 % in BTC ohne obligatorisches Staking bietet. Der Unterschied: CRO ist volatiler als BTC.`,
    de_verdict: `Beide Karten bieten ähnliches Cashback (2 %), aber die Nexo Card hat den Vorteil durch fehlendes Staking und BTC-Belohnungen statt eines proprietären Tokens (CRO). Falls Sie bereits CRO halten, kann die Ruby Steel sinnvoll sein. Sonst: Nexo Card. Bewertung: Nexo Card 4,2/5 vs. Crypto.com Ruby Steel 4,0/5.`,
    es_intro: `La Nexo Card y la Crypto.com Ruby Steel se comparan frecuentemente ya que apuntan a un perfil similar: inversores cripto activos que buscan cashback sin inmovilizar grandes capitales. La Ruby Steel requiere staking de 400 € en CRO para el 2 % de cashback en CRO, mientras que la Nexo Card ofrece un 2 % en BTC sin staking obligatorio. La diferencia clave: el CRO es más volátil que el BTC.`,
    es_verdict: `Ambas cartas ofrecen cashback similar (2 % cada una), pero la Nexo Card tiene ventaja gracias a la ausencia de staking y a las recompensas en BTC frente a un token propietario (CRO). Si ya tienes CRO en Crypto.com, la Ruby Steel tiene sentido. Si no, la Nexo Card es la recomendación por defecto. Puntuación: Nexo Card 4,2/5 vs Crypto.com Ruby Steel 4,0/5.`,
    it_intro: `La Nexo Card e la Crypto.com Ruby Steel sono spesso confrontate perché si rivolgono a un profilo simile: investitori crypto attivi che cercano cashback senza immobilizzare grandi capitali. La Ruby Steel richiede 400 € di staking in CRO per il 2 % di cashback in CRO, mentre la Nexo Card offre il 2 % in BTC senza staking obbligatorio. La differenza chiave: il CRO è più volatile del BTC.`,
    it_verdict: `Entrambe le carte offrono cashback simile (2 % ciascuna), ma la Nexo Card ha il vantaggio grazie all'assenza di staking e alle ricompense in BTC anziché in un token proprietario (CRO). Se hai già CRO su Crypto.com, la Ruby Steel ha senso. Altrimenti, la Nexo Card è la raccomandazione predefinita. Punteggio: Nexo Card 4,2/5 vs Crypto.com Ruby Steel 4,0/5.`,
    en_intro: `The Nexo Card and Crypto.com Ruby Steel are often compared as they target a similar profile: active crypto investors seeking cashback without locking up tens of thousands of euros. The Crypto.com Ruby Steel requires €400 CRO staking for 2% cashback in CRO, while the Nexo Card offers 2% in BTC with no mandatory staking. The key difference: CRO is more volatile than BTC.`,
    en_verdict: `For 2026, both cards offer similar cashback (2% each), but the Nexo Card has the edge thanks to no staking requirement and BTC rewards vs. a proprietary token (CRO). If you already hold CRO on Crypto.com, the Ruby Steel makes sense. Otherwise, the Nexo Card is the default recommendation. Score: Nexo Card 4.2/5 vs Crypto.com Ruby Steel 4.0/5.`,
    faq: [
      { q: 'Quel staking faut-il pour la Crypto.com Ruby Steel ?', a: 'La Crypto.com Ruby Steel Card nécessite un staking de 400 € en CRO pendant 180 jours pour obtenir les 2 % de cashback. La Nexo Card n\'impose aucune exigence de staking.' },
      { q: 'Le cashback Nexo est-il en BTC ou en NEXO ?', a: 'Au choix : 2 % en BTC ou 2 % en NEXO. Le cashback en BTC est généralement recommandé pour ceux qui cherchent à accumuler du Bitcoin.' },
    ],
    de_faq: [
      { q: 'Wie viel Staking braucht man für die Crypto.com Ruby Steel?', a: 'Die Crypto.com Ruby Steel erfordert ein Staking von 400 € in CRO für 180 Tage, um 2 % Cashback zu erhalten. Die Nexo Card hat keine Staking-Anforderungen.' },
      { q: 'Wird das Nexo-Cashback in BTC oder NEXO ausgezahlt?', a: 'Zur Wahl: 2 % in BTC oder 2 % in NEXO. BTC-Cashback wird generell für diejenigen empfohlen, die Bitcoin akkumulieren möchten.' },
    ],
    es_faq: [
      { q: '¿Cuánto staking se necesita para la Crypto.com Ruby Steel?', a: 'La Crypto.com Ruby Steel requiere un staking de 400 € en CRO durante 180 días para obtener el 2 % de cashback. La Nexo Card no tiene requisitos de staking.' },
      { q: '¿El cashback de Nexo se paga en BTC o en NEXO?', a: 'A elegir: 2 % en BTC o 2 % en NEXO. El cashback en BTC suele recomendarse para quienes quieren acumular Bitcoin.' },
    ],
    it_faq: [
      { q: 'Quanto staking serve per la Crypto.com Ruby Steel?', a: 'La Crypto.com Ruby Steel richiede uno staking di 400 € in CRO per 180 giorni per ottenere il 2 % di cashback. La Nexo Card non ha requisiti di staking.' },
      { q: 'Il cashback Nexo viene pagato in BTC o in NEXO?', a: 'A scelta: 2 % in BTC o 2 % in NEXO. Il cashback in BTC è generalmente consigliato per chi vuole accumulare Bitcoin.' },
    ],
    en_faq: [
      { q: 'How much staking does the Crypto.com Ruby Steel require?', a: 'The Crypto.com Ruby Steel requires staking €400 in CRO for 180 days to earn 2% cashback. The Nexo Card has no staking requirements.' },
      { q: 'Is Nexo cashback paid in BTC or NEXO?', a: 'Your choice: 2% in BTC or 2% in NEXO. BTC cashback is generally recommended for those looking to accumulate Bitcoin.' },
    ],
  },

  // ─── Nexo Card vs Wirex Elite ────────────────────────────────────────────────
  'nexo-card-vs-wirex-elite': {
    fr_intro: `La Nexo Card et la Wirex Elite Card sont deux cartes crypto premium ciblant les utilisateurs à la recherche d'un cashback élevé en Europe. La Wirex Elite peut offrir jusqu'à 8 % de cashback en WXT (token natif Wirex), mais nécessite un abonnement mensuel (~9,99 €) et un certain montant de WXT. La Nexo Card propose 2 % en BTC sans abonnement ni staking. En termes de frais totaux, la Wirex Elite coûte ~120 €/an même sans staking.`,
    fr_verdict: `Si vous dépensez plus de 1 500 €/mois et êtes prêt à détenir des WXT, la Wirex Elite peut être rentable grâce à son cashback élevé. En dessous de ce seuil, les frais d'abonnement grignotent le bénéfice. La Nexo Card reste le choix par défaut pour la majorité des utilisateurs en France : 0 € de frais, 2 % BTC, sans contrainte. Note : Nexo Card 4,2/5 vs Wirex Elite 3,5/5.`,
    de_intro: `Die Nexo Card und die Wirex Elite richten sich an Premium-Krypto-Nutzer mit hohem Cashback-Bedarf in Europa. Die Wirex Elite bietet bis zu 8 % Cashback in WXT, erfordert jedoch ein monatliches Abonnement (~9,99 €) und WXT-Bestände. Die Nexo Card bietet 2 % in BTC ohne Abonnement oder Staking. In Gesamtkosten: die Wirex Elite kostet ~120 €/Jahr, auch ohne Staking.`,
    de_verdict: `Über 1.500 €/Monat Ausgaben und Bereitschaft, WXT zu halten, kann die Wirex Elite rentabel sein. Darunter fressen die Abonnementgebühren den Vorteil auf. Die Nexo Card bleibt die Standardwahl für die meisten EU-Nutzer: 0 € Gebühren, 2 % BTC. Bewertung: Nexo Card 4,2/5 vs. Wirex Elite 3,5/5.`,
    es_intro: `La Nexo Card y la Wirex Elite apuntan a usuarios premium de cripto que buscan alto cashback en Europa. La Wirex Elite puede ofrecer hasta un 8 % de cashback en WXT, pero requiere una suscripción mensual (~9,99 €) y cierta cantidad de WXT. La Nexo Card ofrece un 2 % en BTC sin suscripción ni staking. En coste total, la Wirex Elite cuesta ~120 €/año incluso sin staking.`,
    es_verdict: `Por encima de 1.500 €/mes y con disposición a tener WXT, la Wirex Elite puede ser rentable. Por debajo de ese umbral, las cuotas de suscripción anulan la ventaja. La Nexo Card sigue siendo la elección por defecto para la mayoría de usuarios en la UE: 0 € de comisiones, 2 % BTC. Puntuación: Nexo Card 4,2/5 vs Wirex Elite 3,5/5.`,
    it_intro: `La Nexo Card e la Wirex Elite si rivolgono agli utenti premium di crypto alla ricerca di cashback elevato in Europa. La Wirex Elite può offrire fino all'8 % di cashback in WXT, ma richiede un abbonamento mensile (~9,99 €) e alcuni WXT in portafoglio. La Nexo Card offre il 2 % in BTC senza abbonamento né staking. In termini di costo totale, la Wirex Elite costa ~120 €/anno anche senza staking.`,
    it_verdict: `Con spese superiori a 1.500 €/mese e disponibilità a detenere WXT, la Wirex Elite può essere profittevole. Al di sotto di questa soglia, le quote di abbonamento annullano il vantaggio. La Nexo Card rimane la scelta predefinita per la maggior parte degli utenti nell'UE: 0 € di costi, 2 % BTC. Punteggio: Nexo Card 4,2/5 vs Wirex Elite 3,5/5.`,
    en_intro: `The Nexo Card and Wirex Elite target premium crypto users seeking high cashback in Europe. The Wirex Elite can offer up to 8% cashback in WXT, but requires a monthly subscription (~€9.99) and some WXT holdings. The Nexo Card offers 2% in BTC with no subscription or staking. In total cost terms, the Wirex Elite costs ~€120/year even without staking.`,
    en_verdict: `If you spend over €1,500/month and are willing to hold WXT, the Wirex Elite can be profitable due to its high cashback. Below that threshold, subscription fees eat into the benefit. The Nexo Card remains the default choice for most EU users: €0 fees, 2% BTC, no constraints. Score: Nexo Card 4.2/5 vs Wirex Elite 3.5/5.`,
    faq: [
      { q: 'La Wirex Elite est-elle vraiment gratuite ?', a: 'Non. La Wirex Elite (plan "Elite") coûte environ 9,99 €/mois. La Nexo Card, elle, est totalement gratuite.' },
      { q: 'Quelle carte offre le cashback le plus élevé ?', a: 'La Wirex Elite peut atteindre 8 % en WXT, contre 2 % en BTC pour la Nexo Card. Mais le WXT est un token plus volatil et moins liquide que le Bitcoin.' },
    ],
    de_faq: [
      { q: 'Ist die Wirex Elite wirklich kostenlos?', a: 'Nein. Die Wirex Elite kostet etwa 9,99 €/Monat. Die Nexo Card hingegen ist vollständig kostenlos.' },
      { q: 'Welche Karte bietet das höchste Cashback?', a: 'Die Wirex Elite kann bis zu 8 % in WXT erreichen, verglichen mit 2 % in BTC für die Nexo Card. WXT ist jedoch ein volatileres und weniger liquides Token als Bitcoin.' },
    ],
    es_faq: [
      { q: '¿La Wirex Elite es realmente gratuita?', a: 'No. La Wirex Elite cuesta unos 9,99 €/mes. La Nexo Card, en cambio, es totalmente gratuita.' },
      { q: '¿Qué tarjeta ofrece el cashback más alto?', a: 'La Wirex Elite puede alcanzar el 8 % en WXT, frente al 2 % en BTC de la Nexo Card. Pero el WXT es un token más volátil y menos líquido que el Bitcoin.' },
    ],
    it_faq: [
      { q: 'La Wirex Elite è davvero gratuita?', a: 'No. La Wirex Elite costa circa 9,99 €/mese. La Nexo Card è invece completamente gratuita.' },
      { q: 'Quale carta offre il cashback più alto?', a: 'La Wirex Elite può raggiungere l\'8 % in WXT, contro il 2 % in BTC della Nexo Card. Ma il WXT è un token più volatile e meno liquido rispetto al Bitcoin.' },
    ],
    en_faq: [
      { q: 'Is the Wirex Elite really free?', a: 'No. The Wirex Elite costs around €9.99/month. The Nexo Card, however, is completely free.' },
      { q: 'Which card offers the highest cashback?', a: 'The Wirex Elite can reach 8% in WXT, versus 2% in BTC for the Nexo Card. But WXT is a more volatile and less liquid token than Bitcoin.' },
    ],
  },

  // ─── Bybit Card vs Binance Card ──────────────────────────────────────────────
  'binance-card-vs-bybit-card': {
    fr_intro: `La Bybit Card et la Binance Card sont les deux grandes cartes crypto des exchanges asiatiques disponibles en France. Toutes deux sont gratuites (0 € de frais annuels) et offrent un cashback élevé : jusqu'à 10 % en MNT pour la Bybit Card, jusqu'à 8 % en BNB pour la Binance Card. La Binance Card utilise le BNB (token bien établi, top 5 des cryptos), tandis que la Bybit Card récompense en MNT (Mantle Network). La Binance Card ne bloque pas le BNB sur votre compte — il suffit de le détenir.`,
    fr_verdict: `Les deux cartes sont excellentes pour les cashbacks élevés. La Binance Card marque des points avec le BNB — un token plus liquide et reconnu que le MNT. La Bybit Card peut offrir des taux plus élevés sur les premiers paliers de dépenses. Note globale : Bybit Card 4,0/5 vs Binance Card 3,9/5. Pour un utilisateur Binance actif, la Binance Card est naturelle. Pour un utilisateur Bybit, idem.`,
    de_intro: `Die Bybit Card und die Binance Card sind die zwei wichtigsten Krypto-Karten asiatischer Exchange-Plattformen in Europa. Beide sind kostenlos (0 € Jahresgebühr) mit hohem Cashback: bis zu 10 % in MNT für Bybit, bis zu 8 % in BNB für Binance. Die Binance Card belohnt in BNB (Top-5-Krypto), während Bybit in MNT (Mantle Network) belohnt. Die Binance Card erfordert kein BNB-Sperren — nur halten.`,
    de_verdict: `Beide Karten sind ausgezeichnet für hohes Cashback. Die Binance Card punktet mit BNB — einem liquideren und bekannteren Token als MNT. Die Bybit Card kann in den ersten Ausgabenstufen höhere Raten bieten. Gesamtbewertung: Bybit Card 4,0/5 vs. Binance Card 3,9/5.`,
    es_intro: `La Bybit Card y la Binance Card son las dos grandes tarjetas cripto de plataformas de exchange asiáticas disponibles en Europa. Ambas son gratuitas (0 € anuales) con alto cashback: hasta un 10 % en MNT para Bybit, hasta un 8 % en BNB para Binance. La Binance Card recompensa en BNB (top 5 cripto), mientras Bybit lo hace en MNT (Mantle Network). La Binance Card no requiere bloquear BNB — solo tenerlo.`,
    es_verdict: `Ambas tarjetas son excelentes para cashback elevado. La Binance Card gana puntos con el BNB — un token más líquido y reconocido que el MNT. La Bybit Card puede ofrecer tasas más altas en los primeros tramos de gasto. Puntuación: Bybit Card 4,0/5 vs Binance Card 3,9/5.`,
    it_intro: `La Bybit Card e la Binance Card sono le due principali carte crypto delle piattaforme di exchange asiatiche disponibili in Europa. Entrambe sono gratuite (0 € annuali) con cashback elevato: fino al 10 % in MNT per Bybit, fino all'8 % in BNB per Binance. La Binance Card premia in BNB (top 5 crypto), mentre Bybit premia in MNT (Mantle Network). La Binance Card non richiede il blocco di BNB — solo detenerlo.`,
    it_verdict: `Entrambe le carte sono eccellenti per cashback elevato. La Binance Card guadagna punti con il BNB — un token più liquido e riconosciuto del MNT. La Bybit Card può offrire tassi più alti nei primi livelli di spesa. Punteggio: Bybit Card 4,0/5 vs Binance Card 3,9/5.`,
    en_intro: `The Bybit Card and Binance Card are the two major crypto exchange cards from Asian platforms available in France. Both are free (€0 annual fees) with high cashback: up to 10% in MNT for Bybit, up to 8% in BNB for Binance. The Binance Card rewards in BNB (top-5 crypto), while Bybit rewards in MNT (Mantle Network). The Binance Card doesn't require locking BNB — just holding it.`,
    en_verdict: `Both cards are excellent for high cashback. The Binance Card scores points with BNB — a more liquid and recognized token than MNT. The Bybit Card can offer higher rates on initial spending tiers. Overall score: Bybit Card 4.0/5 vs Binance Card 3.9/5. For active Binance users, the Binance Card is natural. Same for Bybit users.`,
    faq: [
      { q: 'Faut-il bloquer ses BNB pour la Binance Card ?', a: 'Non. La Binance Card nécessite simplement de détenir du BNB sur votre compte Binance, sans blocage (contrairement au staking Crypto.com).' },
      { q: 'Quel est le cashback de la Bybit Card au premier palier ?', a: 'Le cashback Bybit Card varie de 2 % à 10 % en MNT selon les paliers de dépenses mensuelles. Le taux exact par palier est disponible sur le site Bybit.' },
    ],
    de_faq: [
      { q: 'Muss man BNB für die Binance Card sperren?', a: 'Nein. Die Binance Card erfordert nur das Halten von BNB auf Ihrem Binance-Konto, ohne Sperrung (im Gegensatz zum Crypto.com-Staking).' },
      { q: 'Wie hoch ist das Cashback der Bybit Card auf dem ersten Niveau?', a: 'Das Cashback der Bybit Card variiert von 2 % bis 10 % in MNT je nach monatlichem Ausgabenvolumen. Genaue Beträge pro Stufe sind auf der Bybit-Website verfügbar.' },
    ],
    es_faq: [
      { q: '¿Hay que bloquear BNB para la Binance Card?', a: 'No. La Binance Card solo requiere tener BNB en tu cuenta de Binance, sin bloqueo (a diferencia del staking de Crypto.com).' },
      { q: '¿Cuál es el cashback de la Bybit Card en el primer tramo?', a: 'El cashback de la Bybit Card varía del 2 % al 10 % en MNT según los tramos de gasto mensual. Las tasas exactas por tramo están disponibles en el sitio web de Bybit.' },
    ],
    it_faq: [
      { q: 'Bisogna bloccare i BNB per la Binance Card?', a: 'No. La Binance Card richiede solo di detenere BNB nel proprio conto Binance, senza blocco (a differenza dello staking di Crypto.com).' },
      { q: 'Qual è il cashback della Bybit Card al primo livello?', a: 'Il cashback della Bybit Card varia dal 2 % al 10 % in MNT in base ai livelli di spesa mensile. Le percentuali esatte per livello sono disponibili sul sito Bybit.' },
    ],
    en_faq: [
      { q: 'Do you need to lock up BNB for the Binance Card?', a: 'No. The Binance Card only requires holding BNB in your Binance account, with no lock-up (unlike Crypto.com staking).' },
      { q: 'What\'s the cashback rate on the first Bybit Card tier?', a: 'The Bybit Card cashback ranges from 2% to 10% in MNT based on monthly spending tiers. Exact rates per tier are available on the Bybit website.' },
    ],
  },

  // ─── Bybit Card vs Crypto.com Midnight Blue ──────────────────────────────────
  'bybit-card-vs-crypto-com-midnight-blue': {
    fr_intro: `La Bybit Card et la Crypto.com Midnight Blue Card sont deux cartes crypto gratuites sans staking requis, mais leurs cashbacks n'ont rien à voir. La Bybit Card offre jusqu'à 10 % en MNT basé sur le volume de dépenses, quand la Crypto.com Midnight Blue plafonne à 1 % en CRO. La différence principale : la Bybit Card est bien plus récompensante mais nécessite d'être client Bybit ; la Midnight Blue est l'option d'entrée Crypto.com, idéale pour démarrer sans engagement.`,
    fr_verdict: `Si vous cherchez le meilleur cashback sans staking, la Bybit Card gagne sans discussion. La Crypto.com Midnight Blue se justifie surtout si vous utilisez déjà l'app Crypto.com et ne souhaitez pas gérer un compte Bybit supplémentaire. Pour les nouveaux utilisateurs crypto, la Bybit Card est plus avantageuse. Note : Bybit Card 4,0/5 vs Crypto.com Midnight Blue 3,8/5.`,
    de_intro: `Die Bybit Card und die Crypto.com Midnight Blue sind beide kostenlose Krypto-Karten ohne Staking-Anforderungen, aber ihre Cashback-Raten sind grundlegend verschieden. Die Bybit Card bietet bis zu 10 % in MNT basierend auf dem monatlichen Ausgabevolumen, während die Midnight Blue bei 1 % in CRO endet.`,
    de_verdict: `Beim besten No-Staking-Cashback gewinnt die Bybit Card eindeutig. Die Midnight Blue ist sinnvoll, wenn Sie die Crypto.com App bereits nutzen. Für neue Krypto-Nutzer: die Bybit Card ist vorteilhafter. Bewertung: Bybit Card 4,0/5 vs. Crypto.com Midnight Blue 3,8/5.`,
    es_intro: `La Bybit Card y la Crypto.com Midnight Blue son dos tarjetas cripto gratuitas sin staking requerido, pero sus tasas de cashback son completamente diferentes. La Bybit Card ofrece hasta un 10 % en MNT según el volumen mensual de gasto, mientras que la Midnight Blue tiene un tope del 1 % en CRO.`,
    es_verdict: `Para el mejor cashback sin staking, la Bybit Card gana con claridad. La Midnight Blue tiene sentido principalmente si ya usas la app de Crypto.com. Para nuevos usuarios de cripto, la Bybit Card es más ventajosa. Puntuación: Bybit Card 4,0/5 vs Crypto.com Midnight Blue 3,8/5.`,
    it_intro: `La Bybit Card e la Crypto.com Midnight Blue sono entrambe carte crypto gratuite senza staking richiesto, ma le loro tassi di cashback sono completamente diverse. La Bybit Card offre fino al 10 % in MNT in base al volume mensile di spesa, mentre la Midnight Blue si ferma all'1 % in CRO.`,
    it_verdict: `Per il miglior cashback senza staking, la Bybit Card vince nettamente. La Midnight Blue ha senso principalmente se usi già l'app Crypto.com. Per i nuovi utenti crypto, la Bybit Card è più vantaggiosa. Punteggio: Bybit Card 4,0/5 vs Crypto.com Midnight Blue 3,8/5.`,
    en_intro: `The Bybit Card and Crypto.com Midnight Blue are both free crypto cards with no staking required, but their cashback rates are vastly different. The Bybit Card offers up to 10% in MNT based on monthly spending, while the Crypto.com Midnight Blue caps at 1% in CRO. The main difference: the Bybit Card is far more rewarding but requires a Bybit account; the Midnight Blue is Crypto.com's entry option.`,
    en_verdict: `If you want the best no-staking cashback, the Bybit Card wins hands down. The Crypto.com Midnight Blue is justified mainly if you already use the Crypto.com app and don't want to manage an additional Bybit account. For new crypto users, the Bybit Card is more advantageous. Score: Bybit Card 4.0/5 vs Crypto.com Midnight Blue 3.8/5.`,
    faq: [
      { q: 'La Bybit Card nécessite-t-elle du staking ?', a: 'Non. La Bybit Card calcule le cashback sur la base du volume mensuel de dépenses, sans staking de token requis.' },
      { q: 'Combien rapporte la Crypto.com Midnight Blue ?', a: '1 % de cashback en CRO. C\'est la carte d\'entrée de gamme de Crypto.com, sans avantages supplémentaires comme le Netflix gratuit ou les retraits ATM offerts.' },
    ],
    de_faq: [
      { q: 'Benötigt die Bybit Card Staking?', a: 'Nein. Die Bybit Card berechnet Cashback auf Basis des monatlichen Ausgabenvolumens ohne Token-Staking.' },
      { q: 'Wie viel bringt die Crypto.com Midnight Blue?', a: '1 % Cashback in CRO. Es ist die Einstiegskarte von Crypto.com ohne Premium-Vorteile wie kostenloses Netflix oder ATM-Abhebungen.' },
    ],
    es_faq: [
      { q: '¿La Bybit Card requiere staking?', a: 'No. La Bybit Card calcula el cashback en función del volumen mensual de gasto, sin staking de token requerido.' },
      { q: '¿Cuánto rinde la Crypto.com Midnight Blue?', a: 'Un 1 % de cashback en CRO. Es la tarjeta de entrada de Crypto.com, sin ventajas premium como Netflix gratis o retiradas en cajero.' },
    ],
    it_faq: [
      { q: 'La Bybit Card richiede staking?', a: 'No. La Bybit Card calcola il cashback in base al volume mensile di spesa, senza staking di token richiesto.' },
      { q: 'Quanto rende la Crypto.com Midnight Blue?', a: 'L\'1 % di cashback in CRO. È la carta base di Crypto.com, senza vantaggi premium come Netflix gratuito o prelievi ATM gratuiti.' },
    ],
    en_faq: [
      { q: 'Does the Bybit Card require staking?', a: 'No. The Bybit Card calculates cashback based on monthly spending volume with no token staking required.' },
      { q: 'How much does the Crypto.com Midnight Blue earn?', a: '1% cashback in CRO. It\'s Crypto.com\'s entry-level card with no premium perks like free Netflix or ATM withdrawals.' },
    ],
  },

  // ─── Nexo Card vs Coinbase Card ──────────────────────────────────────────────
  'coinbase-card-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Coinbase Card sont deux cartes crypto recommandées pour les débutants en France : toutes deux gratuites, sans staking requis, et accessibles facilement. La Coinbase Card offre 4 % de cashback en XLM ou 1 % en BTC — un taux qui semble attractif, mais le XLM (Stellar) est un token risqué. La Nexo Card propose 2 % en BTC de façon stable. La Coinbase Card se distingue par sa sécurité perçue (plateforme réglementée Nasdaq) et sa facilité d'utilisation.`,
    fr_verdict: `Pour un utilisateur débutant valorisant la sécurité et la simplicité, la Coinbase Card est un excellent choix. Pour un utilisateur souhaitant maximiser le cashback en BTC (valeur refuge), la Nexo Card offre 2 % vs 1 % en BTC pour Coinbase (le 4 % en XLM est risqué). Note : Nexo Card 4,2/5 vs Coinbase Card 3,7/5. La Nexo Card l'emporte sur le cashback BTC ; la Coinbase Card sur la réputation réglementaire.`,
    de_intro: `Die Nexo Card und die Coinbase Card sind für Krypto-Einsteiger in der EU empfehlenswert: kostenlos, kein Staking, leicht erhältlich. Die Coinbase Card bietet 4 % Cashback in XLM oder 1 % in BTC — der XLM-Satz klingt attraktiv, aber Stellar ist ein riskantes Token. Die Nexo Card bietet stabile 2 % in BTC. Die Coinbase Card punktet durch regulatorisches Vertrauen (Nasdaq-notierte Plattform).`,
    de_verdict: `Für Einsteiger, die Sicherheit und Einfachheit priorisieren, ist die Coinbase Card eine exzellente Wahl. Für Nutzer, die BTC-Cashback maximieren wollen, bietet die Nexo Card 2 % vs. 1 % BTC bei Coinbase (4 % XLM trägt Token-Risiko). Bewertung: Nexo Card 4,2/5 vs. Coinbase Card 3,7/5.`,
    es_intro: `La Nexo Card y la Coinbase Card son recomendadas para principiantes en cripto en la UE: gratuitas, sin staking requerido y fáciles de obtener. La Coinbase Card ofrece un 4 % de cashback en XLM o un 1 % en BTC — la tasa XLM suena atractiva pero Stellar es un token arriesgado. La Nexo Card ofrece un estable 2 % en BTC. La Coinbase Card destaca por su confianza regulatoria (cotizada en Nasdaq).`,
    es_verdict: `Para principiantes que priorizan seguridad y simplicidad, la Coinbase Card es una excelente elección. Para quienes quieren maximizar el cashback en BTC, la Nexo Card ofrece el 2 % frente al 1 % BTC de Coinbase (el 4 % en XLM conlleva riesgo de token). Puntuación: Nexo Card 4,2/5 vs Coinbase Card 3,7/5.`,
    it_intro: `La Nexo Card e la Coinbase Card sono consigliate ai principianti nel crypto nell'UE: gratuite, senza staking richiesto e facili da ottenere. La Coinbase Card offre il 4 % di cashback in XLM o il 1 % in BTC — la tariffa XLM suona attraente ma Stellar è un token rischioso. La Nexo Card offre un stabile 2 % in BTC. La Coinbase Card si distingue per la fiducia normativa (quotata al Nasdaq).`,
    it_verdict: `Per i principianti che danno priorità a sicurezza e semplicità, la Coinbase Card è una scelta eccellente. Per gli utenti che vogliono massimizzare il cashback in BTC, la Nexo Card offre il 2 % contro il 1 % BTC di Coinbase (il 4 % in XLM comporta rischio token). Punteggio: Nexo Card 4,2/5 vs Coinbase Card 3,7/5.`,
    en_intro: `The Nexo Card and Coinbase Card are both recommended for crypto beginners in the EU: free, no staking required, and easy to obtain. The Coinbase Card offers 4% cashback in XLM or 1% in BTC — the XLM rate sounds attractive but Stellar is a risky token. The Nexo Card offers a stable 2% in BTC. The Coinbase Card stands out for its regulatory trust (Nasdaq-listed platform) and ease of use.`,
    en_verdict: `For beginners prioritizing security and simplicity, the Coinbase Card is an excellent choice. For users wanting to maximize BTC cashback, the Nexo Card offers 2% vs Coinbase's 1% in BTC (the 4% XLM option carries token risk). Score: Nexo Card 4.2/5 vs Coinbase Card 3.7/5. Nexo wins on BTC cashback; Coinbase wins on regulatory reputation.`,
    faq: [
      { q: 'Le 4 % de cashback Coinbase vaut-il vraiment 4 % ?', a: 'Attention : le 4 % est versé en XLM (Stellar), un token très volatile. Si vous choisissez 1 % en BTC, vous obtenez moins que la Nexo Card (2 % BTC).' },
      { q: 'La Coinbase Card est-elle disponible en France ?', a: 'Oui, la Coinbase Card Visa est disponible en France et dans la majorité des pays de l\'UE.' },
    ],
    de_faq: [
      { q: 'Entspricht das 4 %-Cashback der Coinbase wirklich 4 %?', a: 'Achtung: Die 4 % werden in XLM (Stellar) ausgezahlt, einem sehr volatilen Token. Wählen Sie 1 % in BTC, erhalten Sie weniger als bei der Nexo Card (2 % BTC).' },
      { q: 'Ist die Coinbase Card in Deutschland verfügbar?', a: 'Ja, die Coinbase Card Visa ist in Deutschland und den meisten EU-Ländern verfügbar.' },
    ],
    es_faq: [
      { q: '¿El 4 % de cashback de Coinbase equivale realmente al 4 %?', a: 'Atención: el 4 % se paga en XLM (Stellar), un token muy volátil. Si eliges el 1 % en BTC, obtienes menos que con la Nexo Card (2 % BTC).' },
      { q: '¿La Coinbase Card está disponible en España?', a: 'Sí, la Coinbase Card Visa está disponible en España y en la mayoría de países de la UE.' },
    ],
    it_faq: [
      { q: 'Il 4 % di cashback Coinbase vale davvero il 4 %?', a: 'Attenzione: il 4 % viene pagato in XLM (Stellar), un token molto volatile. Se scegli l\'1 % in BTC, ottieni meno rispetto alla Nexo Card (2 % BTC).' },
      { q: 'La Coinbase Card è disponibile in Italia?', a: 'Sì, la Coinbase Card Visa è disponibile in Italia e nella maggior parte dei paesi dell\'UE.' },
    ],
    en_faq: [
      { q: 'Is the Coinbase 4% cashback really worth 4%?', a: 'Caution: the 4% is paid in XLM (Stellar), a highly volatile token. If you choose 1% in BTC, you get less than the Nexo Card (2% BTC).' },
      { q: 'Is the Coinbase Card available in Europe?', a: 'Yes, the Coinbase Card Visa is available in most EU countries.' },
    ],
  },

  // ─── Nexo Card vs Binance Card ───────────────────────────────────────────────
  'binance-card-vs-nexo-card': {
    fr_intro: `La Nexo Card et la Binance Card sont deux des cartes crypto les plus utilisées en France. La Nexo Card offre 2 % de cashback en BTC sans staking, tandis que la Binance Card peut atteindre 8 % de cashback en BNB selon votre balance BNB sur la plateforme. Les deux cartes sont gratuites. La grande différence : la Nexo Card ne dépend d'aucun token propriétaire volatile, là où la Binance Card vous expose aux variations du BNB.`,
    fr_verdict: `Si vous déteniez déjà des BNB et êtes client Binance actif, la Binance Card est clairement supérieure sur le cashback (jusqu'à 8 % vs 2 %). Pour les utilisateurs qui souhaitent un cashback en BTC simple et sans risque de token, la Nexo Card est plus fiable. Note : Nexo Card 4,2/5 vs Binance Card 3,9/5.`,
    de_intro: `Die Nexo Card und die Binance Card sind zwei der meistgenutzten Krypto-Karten in Europa. Die Nexo Card bietet 2 % Cashback in BTC ohne Staking, während die Binance Card bis zu 8 % in BNB erreichen kann, abhängig vom BNB-Guthaben auf der Plattform. Beide Karten sind kostenlos. Der große Unterschied: Die Nexo Card ist unabhängig von einem volatilen proprietären Token.`,
    de_verdict: `Wenn Sie bereits BNB halten und aktiver Binance-Nutzer sind, ist die Binance Card beim Cashback klar überlegen (bis zu 8 % vs. 2 %). Für einfaches BTC-Cashback ohne Token-Risiko ist die Nexo Card zuverlässiger. Bewertung: Nexo Card 4,2/5 vs. Binance Card 3,9/5.`,
    es_intro: `La Nexo Card y la Binance Card son dos de las tarjetas cripto más utilizadas en Europa. La Nexo Card ofrece un 2 % de cashback en BTC sin staking, mientras que la Binance Card puede alcanzar un 8 % en BNB según el saldo de BNB en la plataforma. Ambas son gratuitas. La gran diferencia: la Nexo Card no depende de ningún token propietario volátil.`,
    es_verdict: `Si ya tienes BNB y eres un usuario activo de Binance, la Binance Card es claramente superior en cashback (hasta un 8 % vs. el 2 %). Para cashback sencillo en BTC sin riesgo de token, la Nexo Card es más fiable. Puntuación: Nexo Card 4,2/5 vs Binance Card 3,9/5.`,
    it_intro: `La Nexo Card e la Binance Card sono due delle carte crypto più utilizzate in Europa. La Nexo Card offre il 2 % di cashback in BTC senza staking, mentre la Binance Card può raggiungere l'8 % in BNB in base al saldo BNB sulla piattaforma. Entrambe sono gratuite. La grande differenza: la Nexo Card non dipende da alcun token proprietario volatile.`,
    it_verdict: `Se possiedi già BNB e sei un utente attivo di Binance, la Binance Card è chiaramente superiore nel cashback (fino all'8 % vs. il 2 %). Per un semplice cashback in BTC senza rischio token, la Nexo Card è più affidabile. Punteggio: Nexo Card 4,2/5 vs Binance Card 3,9/5.`,
    en_intro: `The Nexo Card and Binance Card are two of the most-used crypto cards in France. The Nexo Card offers 2% cashback in BTC without staking, while the Binance Card can reach 8% cashback in BNB depending on your BNB balance on the platform. Both cards are free. The big difference: the Nexo Card doesn't depend on any volatile proprietary token, unlike the Binance Card which exposes you to BNB fluctuations.`,
    en_verdict: `If you already hold BNB and are an active Binance user, the Binance Card is clearly superior on cashback (up to 8% vs 2%). For users wanting simple BTC cashback without token risk, the Nexo Card is more reliable. Score: Nexo Card 4.2/5 vs Binance Card 3.9/5.`,
    faq: [
      { q: 'Le cashback Binance Card est-il vraiment de 8 % ?', a: 'Le taux maximum de 8 % en BNB est réservé aux utilisateurs détenant un solde BNB important. Le taux de base est bien plus bas pour les petits détenteurs.' },
      { q: 'La Nexo Card est-elle disponible en France ?', a: 'Oui. La Nexo Card Mastercard est disponible dans tous les pays de l\'UE, France incluse.' },
    ],
    de_faq: [
      { q: 'Ist das 8 %-Cashback der Binance Card realistisch?', a: 'Der Höchstsatz von 8 % in BNB ist nur für Nutzer mit hohem BNB-Guthaben vorbehalten. Der Basissatz ist für kleine Inhaber deutlich niedriger.' },
      { q: 'Ist die Nexo Card in Deutschland verfügbar?', a: 'Ja. Die Nexo Card Mastercard ist in allen EU-Ländern einschließlich Deutschland verfügbar.' },
    ],
    es_faq: [
      { q: '¿El 8 % de cashback de la Binance Card es realista?', a: 'La tasa máxima del 8 % en BNB está reservada a usuarios con grandes saldos en BNB. La tasa base es mucho más baja para pequeños tenedores.' },
      { q: '¿La Nexo Card está disponible en España?', a: 'Sí. La Nexo Card Mastercard está disponible en todos los países de la UE, incluida España.' },
    ],
    it_faq: [
      { q: 'L\'8 % di cashback della Binance Card è realistico?', a: 'Il tasso massimo dell\'8 % in BNB è riservato agli utenti con grandi saldi BNB. Il tasso base è molto più basso per i piccoli detentori.' },
      { q: 'La Nexo Card è disponibile in Italia?', a: 'Sì. La Nexo Card Mastercard è disponibile in tutti i paesi dell\'UE, inclusa l\'Italia.' },
    ],
    en_faq: [
      { q: 'Is the Binance Card\'s 8% cashback realistic?', a: 'The maximum 8% in BNB is reserved for users with large BNB balances. The base rate is much lower for small holders.' },
      { q: 'Is the Nexo Card available in Europe?', a: 'Yes. The Nexo Card Mastercard is available in all EU countries.' },
    ],
  },

  // ─── OKX Card vs Bybit Card ──────────────────────────────────────────────────
  'bybit-card-vs-okx-card': {
    fr_intro: `La OKX Card et la Bybit Card sont deux cartes crypto issues de grandes plateformes d'exchange asiatiques, toutes deux disponibles en Europe. La Bybit Card offre jusqu'à 10 % de cashback en MNT basé sur le volume de dépenses, tandis que l'OKX Card propose jusqu'à 3 % en fonction du niveau OKB détenu. Les deux cartes sont gratuites (0 € de frais annuels). La Bybit Card est clairement plus généreuse sur le cashback.`,
    fr_verdict: `Pour le cashback, la Bybit Card (jusqu'à 10 % MNT) surpasse l'OKX Card (jusqu'à 3 %). Cependant, l'OKX Card marque des points sur l'interface utilisateur et la disponibilité de support. Si le cashback est votre priorité, choisissez Bybit. Si vous utilisez déjà OKX comme exchange principal, la OKX Card est le choix naturel. Note : Bybit Card 4,0/5 vs OKX Card 3,8/5.`,
    de_intro: `Die OKX Card und die Bybit Card kommen beide von großen asiatischen Exchange-Plattformen und sind in Europa verfügbar. Die Bybit Card bietet bis zu 10 % Cashback in MNT basierend auf dem Ausgabevolumen, während die OKX Card bis zu 3 % basierend auf OKB-Beständen bietet. Beide Karten sind kostenlos (0 € Jahresgebühr).`,
    de_verdict: `Beim Cashback gewinnt die Bybit Card (bis zu 10 % MNT) gegenüber der OKX Card (bis zu 3 %). Die OKX Card punktet mit Benutzeroberfläche und Support. Wenn Cashback Priorität hat: Bybit. Wenn OKX Ihr Haupt-Exchange ist: OKX Card. Bewertung: Bybit Card 4,0/5 vs. OKX Card 3,8/5.`,
    es_intro: `La OKX Card y la Bybit Card provienen de grandes plataformas de exchange asiáticas, ambas disponibles en Europa. La Bybit Card ofrece hasta un 10 % de cashback en MNT según el volumen de gasto, mientras que la OKX Card ofrece hasta un 3 % según los OKB que tengas. Ambas son gratuitas (0 € anuales).`,
    es_verdict: `Para cashback, la Bybit Card (hasta 10 % MNT) supera a la OKX Card (hasta 3 %). La OKX Card gana puntos en interfaz y soporte. Si el cashback es tu prioridad, elige Bybit. Si ya usas OKX como tu exchange principal, la OKX Card es la elección natural. Puntuación: Bybit Card 4,0/5 vs OKX Card 3,8/5.`,
    it_intro: `La OKX Card e la Bybit Card provengono entrambe da grandi piattaforme di exchange asiatiche, disponibili in Europa. La Bybit Card offre fino al 10 % di cashback in MNT in base al volume di spesa, mentre la OKX Card offre fino al 3 % in base alle detenzioni di OKB. Entrambe sono gratuite (0 € annuali).`,
    it_verdict: `Per il cashback, la Bybit Card (fino al 10 % MNT) supera la OKX Card (fino al 3 %). La OKX Card guadagna punti sull'interfaccia e il supporto. Se il cashback è la tua priorità, scegli Bybit. Se usi già OKX come exchange principale, la OKX Card è la scelta naturale. Punteggio: Bybit Card 4,0/5 vs OKX Card 3,8/5.`,
    en_intro: `The OKX Card and Bybit Card are both from major Asian exchange platforms, available across Europe. The Bybit Card offers up to 10% cashback in MNT based on spending volume, while the OKX Card offers up to 3% based on OKB holdings. Both cards are free (€0 annual fees). The Bybit Card is clearly more generous on cashback.`,
    en_verdict: `For cashback, the Bybit Card (up to 10% MNT) outperforms the OKX Card (up to 3%). However, the OKX Card scores points on user interface and support availability. If cashback is your priority, choose Bybit. If you're already using OKX as your main exchange, the OKX Card is the natural choice. Score: Bybit Card 4.0/5 vs OKX Card 3.8/5.`,
    faq: [
      { q: 'La OKX Card est-elle disponible en France ?', a: 'Oui, la OKX Card Mastercard est disponible dans l\'UE, France incluse.' },
      { q: 'Quel est le cashback de base de la OKX Card ?', a: 'Le cashback OKX Card dépend de votre niveau de détention OKB. Le taux de base (sans OKB) est généralement autour de 0,5-1 %.' },
    ],
    de_faq: [
      { q: 'Ist die OKX Card in Deutschland verfügbar?', a: 'Ja, die OKX Card Mastercard ist in der EU einschließlich Deutschland verfügbar.' },
      { q: 'Wie hoch ist das Basis-Cashback der OKX Card?', a: 'Das Cashback der OKX Card hängt von Ihrem OKB-Bestand ab. Der Basissatz (ohne OKB) liegt typischerweise bei etwa 0,5–1 %.' },
    ],
    es_faq: [
      { q: '¿La OKX Card está disponible en España?', a: 'Sí, la OKX Card Mastercard está disponible en la UE, incluida España.' },
      { q: '¿Cuál es el cashback base de la OKX Card?', a: 'El cashback de la OKX Card depende de tu nivel de tenencia de OKB. La tasa base (sin OKB) suele ser de alrededor del 0,5–1 %.' },
    ],
    it_faq: [
      { q: 'La OKX Card è disponibile in Italia?', a: 'Sì, la OKX Card Mastercard è disponibile nell\'UE, inclusa l\'Italia.' },
      { q: 'Qual è il cashback base della OKX Card?', a: 'Il cashback della OKX Card dipende dal tuo livello di detenzione di OKB. Il tasso base (senza OKB) è generalmente intorno allo 0,5–1 %.' },
    ],
    en_faq: [
      { q: 'Is the OKX Card available in Europe?', a: 'Yes, the OKX Card Mastercard is available in the EU.' },
      { q: 'What\'s the base cashback rate on the OKX Card?', a: 'The OKX Card cashback depends on your OKB holding level. The base rate (without OKB) is typically around 0.5–1%.' },
    ],
  },

  // ─── Wirex Elite vs Bybit Card ───────────────────────────────────────────────
  'bybit-card-vs-wirex-elite': {
    fr_intro: `La Wirex Elite et la Bybit Card sont deux cartes crypto offrant des cashbacks parmi les plus élevés du marché européen. La Wirex Elite propose jusqu'à 8 % en WXT mais facture ~9,99 €/mois d'abonnement. La Bybit Card offre jusqu'à 10 % en MNT sans aucuns frais ni abonnement. Pour un dépensier modéré, les frais Wirex annulent rapidement l'avantage du cashback.`,
    fr_verdict: `Sur le rapport cashback / coût total, la Bybit Card l'emporte : 0 € de frais, cashback potentiellement supérieur. La Wirex Elite se justifie uniquement si vous utilisez activement l'écosystème Wirex (exchange, multi-devises). Pour la majorité des utilisateurs en France, la Bybit Card est plus avantageuse. Note : Bybit Card 4,0/5 vs Wirex Elite 3,5/5.`,
    de_intro: `Die Wirex Elite und die Bybit Card bieten beide einige der höchsten Cashback-Raten auf dem europäischen Krypto-Kartenmarkt. Die Wirex Elite bietet bis zu 8 % in WXT, berechnet aber ~9,99 €/Monat Abonnement. Die Bybit Card bietet bis zu 10 % in MNT ohne Gebühren oder Abonnement. Für moderate Ausgaben neutralisieren Wirex-Abonnementgebühren schnell den Cashback-Vorteil.`,
    de_verdict: `Beim Cashback-/Gesamtkosten-Verhältnis gewinnt die Bybit Card: 0 € Gebühren, potenziell höherer Cashback. Die Wirex Elite lohnt sich nur, wenn Sie das Wirex-Ökosystem aktiv nutzen. Für die meisten EU-Nutzer: Bybit Card. Bewertung: Bybit Card 4,0/5 vs. Wirex Elite 3,5/5.`,
    es_intro: `La Wirex Elite y la Bybit Card ofrecen algunas de las tasas de cashback más altas del mercado europeo de tarjetas cripto. La Wirex Elite ofrece hasta un 8 % en WXT pero cobra ~9,99 €/mes de suscripción. La Bybit Card ofrece hasta un 10 % en MNT sin comisiones ni suscripción. Para gastos moderados, las cuotas de suscripción de Wirex neutralizan rápidamente la ventaja del cashback.`,
    es_verdict: `En relación cashback/coste total, la Bybit Card gana: 0 € de comisiones, cashback potencialmente superior. La Wirex Elite solo se justifica si usas activamente el ecosistema Wirex. Para la mayoría de usuarios en la UE, la Bybit Card es más ventajosa. Puntuación: Bybit Card 4,0/5 vs Wirex Elite 3,5/5.`,
    it_intro: `La Wirex Elite e la Bybit Card offrono alcuni dei tassi di cashback più elevati sul mercato europeo delle carte crypto. La Wirex Elite offre fino all'8 % in WXT ma addebita ~9,99 €/mese di abbonamento. La Bybit Card offre fino al 10 % in MNT senza costi né abbonamento. Per spese moderate, le quote di abbonamento Wirex neutralizzano rapidamente il vantaggio del cashback.`,
    it_verdict: `Nel rapporto cashback/costo totale, la Bybit Card vince: 0 € di costi, cashback potenzialmente superiore. La Wirex Elite è giustificata solo se usi attivamente l'ecosistema Wirex. Per la maggior parte degli utenti nell'UE: Bybit Card. Punteggio: Bybit Card 4,0/5 vs Wirex Elite 3,5/5.`,
    en_intro: `The Wirex Elite and Bybit Card both offer some of the highest cashback rates on the European crypto card market. The Wirex Elite offers up to 8% in WXT but charges ~€9.99/month subscription. The Bybit Card offers up to 10% in MNT with no fees or subscription. For moderate spenders, Wirex's subscription fees quickly negate the cashback advantage.`,
    en_verdict: `On cashback-to-total-cost ratio, the Bybit Card wins: €0 fees, potentially higher cashback. The Wirex Elite is only justified if you actively use the Wirex ecosystem (exchange, multi-currency). For most EU users, the Bybit Card is more advantageous. Score: Bybit Card 4.0/5 vs Wirex Elite 3.5/5.`,
    faq: [
      { q: 'La Wirex Elite a-t-elle des frais mensuels ?', a: 'Oui. Le plan Wirex Elite coûte environ 9,99 €/mois (environ 120 €/an), ce qui réduit significativement le gain net du cashback.' },
    ],
    de_faq: [
      { q: 'Hat die Wirex Elite monatliche Gebühren?', a: 'Ja. Das Wirex Elite-Abo kostet etwa 9,99 €/Monat (ca. 120 €/Jahr), was den Netto-Cashback-Gewinn erheblich reduziert.' },
    ],
    es_faq: [
      { q: '¿La Wirex Elite tiene cuotas mensuales?', a: 'Sí. El plan Wirex Elite cuesta unos 9,99 €/mes (unos 120 €/año), lo que reduce significativamente el beneficio neto del cashback.' },
    ],
    it_faq: [
      { q: 'La Wirex Elite ha canoni mensili?', a: 'Sì. Il piano Wirex Elite costa circa 9,99 €/mese (circa 120 €/anno), il che riduce significativamente il guadagno netto del cashback.' },
    ],
    en_faq: [
      { q: 'Does the Wirex Elite have monthly fees?', a: 'Yes. The Wirex Elite plan costs around €9.99/month (~€120/year), significantly reducing the net cashback benefit.' },
    ],
  },

  // ─── Coinbase Card vs Bitpanda Card ──────────────────────────────────────────
  'bitpanda-card-vs-coinbase-card': {
    fr_intro: `La Coinbase Card et la Bitpanda Card sont deux cartes crypto européennes reconnues pour leur sérieux et leur conformité réglementaire. La Coinbase Card offre 4 % en XLM ou 1 % en BTC sans staking. La Bitpanda Card propose jusqu'à 1 % en BEST (token Bitpanda), avec des avantages supplémentaires pour les détenteurs de BEST. Les deux plateformes sont régulées en Europe, ce qui en fait des choix fiables pour les utilisateurs prudents.`,
    fr_verdict: `Sur le cashback pur, la Coinbase Card (4 % XLM ou 1 % BTC) surpasse la Bitpanda Card (1 % BEST). Cependant, la Bitpanda Card est particulièrement intéressante pour les utilisateurs Bitpanda qui détiennent déjà du BEST. Pour les autres, la Coinbase Card offre plus de valeur. Note : Coinbase Card 3,7/5 vs Bitpanda Card 3,6/5.`,
    de_intro: `Die Coinbase Card und die Bitpanda Card sind beide EU-regulierte Krypto-Karten, bekannt für ihre Zuverlässigkeit und Konformität. Die Coinbase Card bietet 4 % in XLM oder 1 % in BTC ohne Staking. Die Bitpanda Card bietet bis zu 1 % in BEST (Bitpanda Token), mit Zusatzvorteilen für BEST-Halter. Beide Plattformen sind EU-reguliert und damit sichere Optionen für vorsichtige Nutzer.`,
    de_verdict: `Beim reinen Cashback übertrifft die Coinbase Card (4 % XLM oder 1 % BTC) die Bitpanda Card (1 % BEST). Die Bitpanda Card ist jedoch besonders attraktiv für bestehende Bitpanda-Nutzer, die bereits BEST halten. Für andere bietet die Coinbase Card mehr Wert. Bewertung: Coinbase Card 3,7/5 vs. Bitpanda Card 3,6/5.`,
    es_intro: `La Coinbase Card y la Bitpanda Card son dos tarjetas cripto reguladas en la UE, reconocidas por su fiabilidad y cumplimiento normativo. La Coinbase Card ofrece un 4 % en XLM o un 1 % en BTC sin staking. La Bitpanda Card ofrece hasta un 1 % en BEST (token Bitpanda), con ventajas adicionales para los poseedores de BEST. Ambas plataformas están reguladas en la UE, lo que las convierte en opciones seguras para usuarios prudentes.`,
    es_verdict: `En cashback puro, la Coinbase Card (4 % XLM o 1 % BTC) supera a la Bitpanda Card (1 % BEST). Sin embargo, la Bitpanda Card es especialmente interesante para los usuarios de Bitpanda que ya tienen BEST. Para los demás, la Coinbase Card ofrece más valor. Puntuación: Coinbase Card 3,7/5 vs Bitpanda Card 3,6/5.`,
    it_intro: `La Coinbase Card e la Bitpanda Card sono entrambe carte crypto regolamentate nell'UE, note per la loro affidabilità e conformità. La Coinbase Card offre il 4 % in XLM o l'1 % in BTC senza staking. La Bitpanda Card offre fino all'1 % in BEST (token Bitpanda), con vantaggi aggiuntivi per i detentori di BEST. Entrambe le piattaforme sono regolamentate nell'UE, rendendole scelte sicure per gli utenti prudenti.`,
    it_verdict: `Sul cashback puro, la Coinbase Card (4 % XLM o 1 % BTC) supera la Bitpanda Card (1 % BEST). Tuttavia, la Bitpanda Card è particolarmente interessante per gli utenti Bitpanda che già detengono BEST. Per gli altri, la Coinbase Card offre più valore. Punteggio: Coinbase Card 3,7/5 vs Bitpanda Card 3,6/5.`,
    en_intro: `The Coinbase Card and Bitpanda Card are both EU-regulated crypto cards known for their reliability and compliance. The Coinbase Card offers 4% in XLM or 1% in BTC with no staking. The Bitpanda Card offers up to 1% in BEST (Bitpanda token), with extra benefits for BEST holders. Both platforms are EU-regulated, making them safe choices for cautious users.`,
    en_verdict: `On pure cashback, the Coinbase Card (4% XLM or 1% BTC) outperforms the Bitpanda Card (1% BEST). However, the Bitpanda Card is particularly interesting for existing Bitpanda users who already hold BEST. For others, the Coinbase Card offers more value. Score: Coinbase Card 3.7/5 vs Bitpanda Card 3.6/5.`,
    faq: [
      { q: 'La Bitpanda Card est-elle disponible en dehors de l\'Autriche ?', a: 'Oui. La Bitpanda Card Visa est disponible dans toute l\'UE, y compris la France, l\'Allemagne, l\'Espagne et l\'Italie.' },
    ],
    de_faq: [
      { q: 'Ist die Bitpanda Card außerhalb Österreichs verfügbar?', a: 'Ja. Die Bitpanda Card Visa ist in der gesamten EU verfügbar, einschließlich Deutschland, Frankreich, Spanien und Italien.' },
    ],
    es_faq: [
      { q: '¿La Bitpanda Card está disponible fuera de Austria?', a: 'Sí. La Bitpanda Card Visa está disponible en toda la UE, incluidos Alemania, Francia, España e Italia.' },
    ],
    it_faq: [
      { q: 'La Bitpanda Card è disponibile fuori dall\'Austria?', a: 'Sì. La Bitpanda Card Visa è disponibile in tutta l\'UE, inclusi Germania, Francia, Spagna e Italia.' },
    ],
    en_faq: [
      { q: 'Is the Bitpanda Card available outside Austria?', a: 'Yes. The Bitpanda Card Visa is available across the EU, including Germany, France, Spain, and Italy.' },
    ],
  },


  // ─── Deblock Card vs Nexo Card ───────────────────────────────────────────────
  'deblock-card-vs-nexo-card': {
    fr_intro: `Deblock et Nexo Card sont deux cartes crypto sans staking requis, mais elles s'adressent à des profils très différents. La **Deblock Card** est une néobanque française avec IBAN FR, wallet self-custody, et la meilleure régulation du marché (AMF + ACPR + MiCA). La **Nexo Card** se distingue par son cashback jusqu'à 2 % en BTC, bien supérieur au 1 % de Deblock Premium. Si vous habitez en France et que la sécurité réglementaire est votre priorité, Deblock est un choix unique. Si le cashback en Bitcoin est votre objectif principal, Nexo l'emporte.`,
    fr_verdict: `Deblock gagne sur la régulation, le IBAN français et la self-custody. Nexo gagne sur le cashback (2 % BTC vs 1 % max chez Deblock) et les cryptos supportées. Notre recommandation : choisissez **Deblock** si vous voulez un vrai compte courant français crypto-compatible ; choisissez **Nexo** si vous maximisez le cashback BTC. Note : Deblock 4,2/5 vs Nexo Card 4,2/5 — ex aequo sur le global, différents sur les critères.`,
    de_intro: `Deblock und Nexo Card sind zwei Krypto-Karten ohne Staking-Anforderungen, aber sie richten sich an sehr unterschiedliche Profile. Die **Deblock Card** ist eine französische Neobank mit französischer IBAN, Self-Custody-Wallet und der besten Regulierung auf dem Markt (AMF + ACPR + MiCA). Die **Nexo Card** zeichnet sich durch bis zu 2 % Cashback in BTC aus, was deutlich mehr ist als die 1 % von Deblock Premium.`,
    de_verdict: `Deblock punktet bei Regulierung, französischer IBAN und Self-Custody. Nexo punktet beim Cashback (2 % BTC vs. max. 1 % bei Deblock). Unsere Empfehlung: Wählen Sie **Deblock**, wenn Sie ein echtes französisches Girokonto mit Krypto wollen; wählen Sie **Nexo**, wenn Sie BTC-Cashback maximieren möchten.`,
    es_intro: `Deblock y Nexo Card son dos tarjetas cripto sin requisito de staking, pero están orientadas a perfiles muy distintos. La **Deblock Card** es un neobanco francés con IBAN FR, wallet de autocustodia y la mejor regulación del mercado (AMF + ACPR + MiCA). La **Nexo Card** destaca por su cashback de hasta el 2 % en BTC, muy superior al 1 % de Deblock Premium.`,
    es_verdict: `Deblock gana en regulación, IBAN francés y autocustodia. Nexo gana en cashback (2 % BTC vs máx. 1 % en Deblock). Nuestra recomendación: elige **Deblock** si quieres una cuenta corriente francesa con integración cripto; elige **Nexo** si tu objetivo principal es maximizar el cashback en BTC. Puntuación: Deblock 4,2/5 vs Nexo Card 4,2/5.`,
    it_intro: `Deblock e Nexo Card sono entrambe carte crypto senza requisito di staking, ma si rivolgono a profili molto diversi. La **Deblock Card** è una neobank francese con IBAN francese, wallet self-custody e la migliore regolamentazione del mercato (AMF + ACPR + MiCA). La **Nexo Card** si distingue con un cashback fino al 2 % in BTC, significativamente superiore all'1 % di Deblock Premium.`,
    it_verdict: `Deblock vince su regolamentazione, IBAN francese e self-custody. Nexo vince sul cashback (2 % BTC vs max 1 % di Deblock). Il nostro consiglio: scegli **Deblock** se vuoi un vero conto corrente francese con integrazione crypto; scegli **Nexo** se vuoi massimizzare il cashback in BTC. Punteggio: Deblock 4,2/5 vs Nexo Card 4,2/5.`,
    en_intro: `Deblock and Nexo Card are both crypto cards with no staking requirement, but they serve very different profiles. The **Deblock Card** is a French neobank with a French IBAN, self-custody wallet, and the best regulatory standing on the French market (AMF + ACPR + MiCA). The **Nexo Card** stands out with up to 2% cashback in BTC — significantly more than Deblock's 1% on the Premium plan.`,
    en_verdict: `Deblock wins on regulation, French IBAN, and self-custody. Nexo wins on cashback (2% BTC vs max 1% at Deblock). Our recommendation: choose **Deblock** if you want a proper French current account with crypto integration; choose **Nexo** if maximising BTC cashback is your primary goal. Score: Deblock 4.2/5 vs Nexo Card 4.2/5 — tied overall, different on individual criteria.`,
    faq: [
      { q: 'Deblock ou Nexo Card : laquelle est disponible en France ?', a: 'Les deux cartes sont disponibles en France. Deblock propose en plus un IBAN français (virements SEPA instantanés inclus), ce qu\'aucune autre carte crypto du marché n\'offre.' },
      { q: 'Quelle carte offre le meilleur cashback sans staking ?', a: 'La Nexo Card offre jusqu\'à 2 % de cashback en BTC sans staking obligatoire. La Deblock Card offre 1 % sur son plan Premium. Nexo l\'emporte sur ce critère.' },
      { q: 'Qu\'est-ce que le self-custody de Deblock ?', a: 'Avec Deblock, vos clés privées crypto vous appartiennent — Deblock ne les détient jamais. C\'est une différence majeure avec Nexo, où vos cryptos sont hébergées par la plateforme. Self-custody = vous êtes le seul propriétaire de vos actifs.' },
    ],
    de_faq: [
      { q: 'Deblock oder Nexo Card: Welche ist in Deutschland verfügbar?', a: 'Beide Karten sind in Deutschland verfügbar. Deblock bietet zusätzlich eine französische IBAN an (inklusive sofortiger SEPA-Überweisungen), was sonst keine andere Krypto-Karte bietet.' },
      { q: 'Welche Karte bietet das beste Cashback ohne Staking?', a: 'Die Nexo Card bietet bis zu 2 % Cashback in BTC ohne obligatorisches Staking. Die Deblock Card bietet 1 % im Premium-Abo. Nexo punktet bei diesem Kriterium.' },
      { q: 'Was ist Self-Custody bei Deblock?', a: 'Bei Deblock gehören Ihre privaten Schlüssel nur Ihnen — Deblock hält sie nie. Dies ist ein wesentlicher Unterschied zu Nexo, wo Ihre Kryptos auf der Plattform gehostet werden. Self-Custody = Sie sind der einzige Eigentümer Ihrer Assets.' },
    ],
    es_faq: [
      { q: 'Deblock o Nexo Card: ¿cuál está disponible en España?', a: 'Ambas tarjetas están disponibles en España. Deblock ofrece además un IBAN francés (con transferencias SEPA instantáneas incluidas), algo que ninguna otra tarjeta cripto ofrece.' },
      { q: '¿Qué tarjeta ofrece el mejor cashback sin staking?', a: 'La Nexo Card ofrece hasta un 2 % de cashback en BTC sin staking obligatorio. La Deblock Card ofrece un 1 % en su plan Premium. Nexo gana en este criterio.' },
      { q: '¿Qué es la autocustodia (self-custody) de Deblock?', a: 'Con Deblock, tus claves privadas te pertenecen — Deblock nunca las guarda. Esta es una diferencia clave respecto a Nexo, donde tus criptos están alojadas en la plataforma. Autocustodia = tú eres el único propietario de tus activos.' },
    ],
    it_faq: [
      { q: 'Deblock o Nexo Card: quale è disponibile in Italia?', a: 'Entrambe le carte sono disponibili in Italia. Deblock offre in aggiunta un IBAN francese (con bonifici SEPA istantanei inclusi), qualcosa che nessun\'altra carta crypto sul mercato offre.' },
      { q: 'Quale carta offre il miglior cashback senza staking?', a: 'La Nexo Card offre fino al 2 % di cashback in BTC senza staking obbligatorio. La Deblock Card offre l\'1 % nel piano Premium. Nexo vince su questo criterio.' },
      { q: 'Che cos\'è la self-custody di Deblock?', a: 'Con Deblock, le tue chiavi private ti appartengono — Deblock non le detiene mai. Questa è una differenza fondamentale rispetto a Nexo, dove le tue criptovalute sono ospitate sulla piattaforma. Self-custody = sei l\'unico proprietario dei tuoi asset.' },
    ],
    en_faq: [
      { q: 'Deblock or Nexo Card: which is available in Europe?', a: 'Both cards are available across the EU. Deblock additionally offers a French IBAN (with instant SEPA transfers included), something no other crypto card on the market provides.' },
      { q: 'Which card offers the best cashback without staking?', a: 'The Nexo Card offers up to 2% cashback in BTC with no mandatory staking. The Deblock Card offers 1% on its Premium plan. Nexo wins on this criterion.' },
      { q: 'What is Deblock\'s self-custody feature?', a: 'With Deblock, your private keys belong only to you — Deblock never holds them. This is a key difference from Nexo, where your crypto is hosted on the platform. Self-custody = you are the sole owner of your assets.' },
    ],
  },

  // ─── Deblock Card vs Coinbase Card ──────────────────────────────────────────
  'deblock-card-vs-coinbase-card': {
    fr_intro: `Deblock et Coinbase Card sont deux cartes crypto fortement axées sur la conformité réglementaire. La **Deblock Card** est régulée en France (AMF, ACPR, MiCA) et propose un IBAN français avec wallet self-custody. La **Coinbase Card** s'appuie sur Coinbase, exchange coté au Nasdaq, et offre jusqu'à 4 % de cashback en XLM ou 1 % en BTC sans staking. Pour les utilisateurs français qui veulent un ancrage local, Deblock est unique. Pour le cashback pur, Coinbase peut faire mieux.`,
    fr_verdict: `Deblock est imbattable sur la régulation française et le IBAN local. Coinbase gagne sur le cashback potentiel (4 % XLM vs 1 % Deblock) et la profondeur de l\'exchange. Notre verdict : **Deblock** pour les Français qui veulent une solution tout-en-un banque + crypto ; **Coinbase Card** pour ceux qui sont déjà clients Coinbase et veulent maximiser leurs rewards. Note : Deblock 4,2/5 vs Coinbase Card 3,7/5.`,
    de_intro: `Deblock und Coinbase Card sind beide stark auf regulatorische Konformität ausgerichtet. Die **Deblock Card** ist in Frankreich reguliert (AMF, ACPR, MiCA) und bietet eine französische IBAN mit Self-Custody-Wallet. Die **Coinbase Card** wird von dem an der Nasdaq notierten Coinbase unterstützt und bietet bis zu 4 % Cashback in XLM oder 1 % in BTC ohne Staking.`,
    de_verdict: `Deblock ist bei der französischen Regulierung und der lokalen IBAN unschlagbar. Coinbase punktet beim potenziellen Cashback (4 % XLM vs. 1 % Deblock) und der Exchange-Tiefe. Unser Fazit: **Deblock** für französische Nutzer mit All-in-one-Banking+Krypto; **Coinbase Card** für bestehende Coinbase-Kunden, die ihre Rewards maximieren möchten. Bewertung: Deblock 4,2/5 vs. Coinbase Card 3,7/5.`,
    es_intro: `Deblock y Coinbase Card son dos tarjetas cripto centradas en el cumplimiento normativo. La **Deblock Card** está regulada en Francia (AMF, ACPR, MiCA) y ofrece un IBAN francés con wallet de autocustodia. La **Coinbase Card** está respaldada por Coinbase, cotizada en el Nasdaq, y ofrece hasta un 4 % de cashback en XLM o un 1 % en BTC sin staking.`,
    es_verdict: `Deblock es imbatible en regulación francesa e IBAN local. Coinbase gana en cashback potencial (4 % XLM vs 1 % Deblock) y profundidad de exchange. Nuestro veredicto: **Deblock** para usuarios franceses con solución todo-en-uno banca + cripto; **Coinbase Card** para clientes de Coinbase que quieren maximizar sus recompensas. Puntuación: Deblock 4,2/5 vs Coinbase Card 3,7/5.`,
    it_intro: `Deblock e Coinbase Card sono entrambe carte crypto fortemente orientate alla conformità normativa. La **Deblock Card** è regolamentata in Francia (AMF, ACPR, MiCA) e offre un IBAN francese con wallet self-custody. La **Coinbase Card** è supportata da Coinbase, quotata al Nasdaq, e offre fino al 4 % di cashback in XLM o l'1 % in BTC senza staking.`,
    it_verdict: `Deblock è imbattibile sulla regolamentazione francese e l'IBAN locale. Coinbase vince sul cashback potenziale (4 % XLM vs 1 % Deblock) e la profondità dell'exchange. Il nostro verdetto: **Deblock** per gli utenti francesi con soluzione tutto-in-uno banca + crypto; **Coinbase Card** per i clienti Coinbase che vogliono massimizzare le ricompense. Punteggio: Deblock 4,2/5 vs Coinbase Card 3,7/5.`,
    en_intro: `Deblock and Coinbase Card are both compliance-focused crypto cards. The **Deblock Card** is regulated in France (AMF, ACPR, MiCA) and offers a French IBAN with a self-custody wallet. The **Coinbase Card** is backed by Nasdaq-listed Coinbase and offers up to 4% cashback in XLM or 1% in BTC with no staking required.`,
    en_verdict: `Deblock is unbeatable on French regulation and local IBAN. Coinbase wins on potential cashback (4% XLM vs 1% Deblock) and exchange depth. Our verdict: **Deblock** for French users wanting an all-in-one banking + crypto solution; **Coinbase Card** for existing Coinbase users wanting to maximise rewards. Score: Deblock 4.2/5 vs Coinbase Card 3.7/5.`,
    faq: [
      { q: 'La Coinbase Card est-elle disponible en France ?', a: 'Oui, la Coinbase Card est disponible dans l\'UE dont la France. En revanche, elle ne propose pas d\'IBAN français — il s\'agit d\'une carte adossée à votre compte Coinbase.' },
      { q: 'Deblock ou Coinbase Card pour un débutant en France ?', a: 'Deblock est plus adapté aux débutants français : IBAN local, interface simple, support en français, et régulation française rassurante. Coinbase est idéal si vous utilisez déjà l\'exchange Coinbase.' },
    ],
    de_faq: [
      { q: 'Ist die Coinbase Card in Deutschland verfügbar?', a: 'Ja, die Coinbase Card ist in der EU einschließlich Deutschland verfügbar. Sie bietet jedoch keine deutsche IBAN — es ist eine Karte, die mit Ihrem Coinbase-Konto verknüpft ist.' },
      { q: 'Deblock oder Coinbase Card für Einsteiger?', a: 'Deblock eignet sich besser für EU-Einsteiger: einfache Oberfläche, regulierte Neobank, lokale IBAN. Coinbase ist ideal, wenn Sie bereits die Coinbase-Exchange nutzen.' },
    ],
    es_faq: [
      { q: '¿La Coinbase Card está disponible en España?', a: 'Sí, la Coinbase Card está disponible en la UE, incluida España. Sin embargo, no ofrece un IBAN español — es una tarjeta vinculada a tu cuenta de Coinbase.' },
      { q: '¿Deblock o Coinbase Card para un principiante?', a: 'Deblock es más adecuado para principiantes en la UE: interfaz sencilla, neobanco regulado, IBAN local. Coinbase es ideal si ya usas el exchange de Coinbase.' },
    ],
    it_faq: [
      { q: 'La Coinbase Card è disponibile in Italia?', a: 'Sì, la Coinbase Card è disponibile nell\'UE, inclusa l\'Italia. Tuttavia, non offre un IBAN italiano — è una carta collegata al tuo conto Coinbase.' },
      { q: 'Deblock o Coinbase Card per un principiante?', a: 'Deblock è più adatto ai principianti nell\'UE: interfaccia semplice, neobank regolamentata, IBAN locale. Coinbase è ideale se usi già l\'exchange Coinbase.' },
    ],
    en_faq: [
      { q: 'Is the Coinbase Card available in Europe?', a: 'Yes, the Coinbase Card is available in the EU. However, it doesn\'t offer a local IBAN — it\'s a card linked to your Coinbase account.' },
      { q: 'Deblock or Coinbase Card for a beginner?', a: 'Deblock is better suited for EU beginners: simple interface, regulated neobank, local IBAN. Coinbase is ideal if you already use the Coinbase exchange.' },
    ],
  },

  // ─── Deblock Card vs Wirex ──────────────────────────────────────────────────
  'deblock-card-vs-wirex-elite': {
    fr_intro: `Deblock et Wirex sont deux approches très différentes de la carte crypto. La **Deblock Card** est une néobanque française avec IBAN local et wallet self-custody, orientée conformité et sécurité. **Wirex** est un acteur international plus orienté cashback (jusqu'à 8 % en WXT) et multi-devises. Si vous voyagez beaucoup et voulez des comptes multi-devises, Wirex peut être intéressant. Pour un usage centré sur la France avec les meilleures garanties réglementaires, Deblock s'impose.`,
    fr_verdict: `Wirex l\'emporte sur les fonctionnalités multi-devises et le cashback potentiel en WXT. Deblock l\'emporte sur la régulation française, le IBAN local, et la self-custody. Note : Deblock 4,2/5 vs Wirex 3,5/5 — Deblock est recommandé pour les utilisateurs français.`,
    de_intro: `Deblock und Wirex verfolgen sehr unterschiedliche Ansätze bei Krypto-Karten. Die **Deblock Card** ist eine französische Neobank mit lokaler IBAN und Self-Custody-Wallet, ausgerichtet auf Konformität und Sicherheit. **Wirex** ist international ausgerichtet mit Cashback bis zu 8 % in WXT und Multi-Währungskonten.`,
    de_verdict: `Wirex punktet bei Multi-Währungsfunktionen und potenziellem WXT-Cashback. Deblock punktet bei der französischen Regulierung, der lokalen IBAN und der Self-Custody. Bewertung: Deblock 4,2/5 vs. Wirex 3,5/5 — Deblock wird für französische Nutzer empfohlen.`,
    es_intro: `Deblock y Wirex adoptan enfoques muy diferentes para las tarjetas cripto. La **Deblock Card** es un neobanco francés con IBAN local y wallet de autocustodia, centrado en el cumplimiento y la seguridad. **Wirex** está más orientado internacionalmente, con cashback de hasta un 8 % en WXT y cuentas multidivisa.`,
    es_verdict: `Wirex gana en funcionalidades multidivisa y cashback potencial en WXT. Deblock gana en regulación francesa, IBAN local y autocustodia. Puntuación: Deblock 4,2/5 vs Wirex 3,5/5 — Deblock es recomendado para usuarios franceses.`,
    it_intro: `Deblock e Wirex adottano approcci molto diversi alle carte crypto. La **Deblock Card** è una neobank francese con IBAN locale e wallet self-custody, orientata alla conformità e alla sicurezza. **Wirex** è più orientata a livello internazionale, con cashback fino all'8 % in WXT e conti multivaluta.`,
    it_verdict: `Wirex vince sulle funzionalità multivaluta e il potenziale cashback in WXT. Deblock vince sulla regolamentazione francese, l'IBAN locale e la self-custody. Punteggio: Deblock 4,2/5 vs Wirex 3,5/5 — Deblock è consigliato per gli utenti francesi.`,
    en_intro: `Deblock and Wirex take very different approaches to crypto cards. The **Deblock Card** is a French neobank with a local IBAN and self-custody wallet, focused on compliance and security. **Wirex** is a more internationally-oriented product with cashback up to 8% in WXT and multi-currency accounts.`,
    en_verdict: `Wirex wins on multi-currency features and potential WXT cashback. Deblock wins on French regulation, local IBAN, and self-custody. Score: Deblock 4.2/5 vs Wirex 3.5/5 — Deblock is recommended for French users.`,
    faq: [
      { q: 'Deblock ou Wirex pour voyager ?', a: 'Wirex est historiquement fort sur les multi-devises et les voyages. Cependant, Deblock ne facture pas de frais de change sur les paiements en euros dans l\'UE, ce qui le rend compétitif pour les voyages intra-européens.' },
    ],
    de_faq: [
      { q: 'Deblock oder Wirex für Reisen?', a: 'Wirex ist historisch stark bei Multi-Währungen und Reisen. Deblock berechnet jedoch keine Wechselkursgebühren bei EUR-Zahlungen in der EU, was es für innereeuropäische Reisen wettbewerbsfähig macht.' },
    ],
    es_faq: [
      { q: '¿Deblock o Wirex para viajar?', a: 'Wirex es históricamente fuerte en multicurrencia y viajes. Sin embargo, Deblock no cobra comisiones de cambio en pagos en euros dentro de la UE, lo que lo hace competitivo para viajes intraeuropeos.' },
    ],
    it_faq: [
      { q: 'Deblock o Wirex per viaggiare?', a: 'Wirex è storicamente forte su multi-valuta e viaggi. Tuttavia, Deblock non applica commissioni di cambio sui pagamenti in euro nell\'UE, rendendola competitiva per i viaggi intraeuropei.' },
    ],
    en_faq: [
      { q: 'Deblock or Wirex for travel?', a: 'Wirex has historically been strong on multi-currency and travel. However, Deblock doesn\'t charge FX fees on EUR payments within the EU, making it competitive for intra-European travel.' },
    ],
  },

  // ─── Revolut Metal vs Nexo Card ──────────────────────────────────────────────
  'nexo-card-vs-revolut-metal': {
    fr_intro: `La Revolut Metal et la Nexo Card représentent deux philosophies opposées : la première est une néobanque européenne qui intègre la crypto comme fonctionnalité parmi d'autres, la seconde est une carte crypto-native pensée pour les détenteurs d'actifs numériques. La Revolut Metal facture 13,99 €/mois et offre jusqu'à 1 % de cashback en crypto sur les dépenses éligibles, en plus d'un accès aux lounges aéroportuaires et à une assurance voyage premium. La Nexo Card, elle, est entièrement gratuite (0 €/an) et reverse jusqu'à 2 % de cashback en BTC ou NEXO sans aucun staking requis. Les deux cartes sont disponibles en France et dans l'UE, mais s'adressent à des profils très différents.`,
    fr_verdict: `Si vous utilisez déjà Revolut comme compte principal et souhaitez un seul produit pour tout gérer, la Revolut Metal est justifiée malgré son abonnement mensuel. En revanche, pour maximiser le cashback crypto sans frais fixes, la Nexo Card est imbattable : 2 % en BTC garanti, sans engagement. Notre note : Nexo Card 4,2/5 vs Revolut Metal 3,9/5 pour un usage crypto-first.`,
    de_intro: `Die Revolut Metal und die Nexo Card vertreten zwei entgegengesetzte Philosophien: Die erste ist eine europäische Neobank, die Krypto als zusätzliche Funktion integriert, die zweite ist eine krypto-native Karte für Inhaber digitaler Assets. Die Revolut Metal kostet 13,99 €/Monat und bietet bis zu 1 % Cashback in Krypto auf berechtigte Ausgaben sowie Zugang zu Flughafenlounges und Premium-Reiseversicherung. Die Nexo Card ist vollständig kostenlos (0 €/Jahr) und zahlt bis zu 2 % Cashback in BTC oder NEXO ohne Staking. Beide Karten sind in Deutschland und der EU verfügbar, sprechen aber sehr unterschiedliche Profile an.`,
    de_verdict: `Wenn Sie Revolut bereits als Hauptkonto nutzen und alles in einem Produkt verwalten möchten, ist die Revolut Metal trotz der monatlichen Gebühr gerechtfertigt. Wer jedoch Krypto-Cashback ohne Fixkosten maximieren will, findet in der Nexo Card die beste Option: 2 % in BTC garantiert, ohne Vertragsbindung. Unsere Bewertung: Nexo Card 4,2/5 vs. Revolut Metal 3,9/5 für krypto-first-Nutzung.`,
    es_intro: `La Revolut Metal y la Nexo Card representan dos filosofías opuestas: la primera es un neobanco europeo que integra crypto como funcionalidad adicional, la segunda es una tarjeta crypto-nativa pensada para titulares de activos digitales. La Revolut Metal cuesta 13,99 €/mes y ofrece hasta un 1 % de cashback en crypto en gastos elegibles, además de acceso a salas VIP de aeropuertos y seguro de viaje premium. La Nexo Card es completamente gratuita (0 €/año) y devuelve hasta un 2 % de cashback en BTC o NEXO sin staking requerido. Ambas están disponibles en España y la UE.`,
    es_verdict: `Si ya usas Revolut como cuenta principal y quieres un solo producto para gestionarlo todo, la Revolut Metal se justifica a pesar de la cuota mensual. Para maximizar el cashback crypto sin costes fijos, la Nexo Card es imbatible: 2 % en BTC garantizado, sin compromiso. Nuestra puntuación: Nexo Card 4,2/5 vs Revolut Metal 3,9/5 para uso crypto-first.`,
    it_intro: `La Revolut Metal e la Nexo Card rappresentano due filosofie opposte: la prima è una neobank europea che integra il crypto come funzionalità aggiuntiva, la seconda è una carta crypto-nativa per i detentori di asset digitali. La Revolut Metal costa 13,99 €/mese e offre fino all'1 % di cashback in crypto sulle spese idonee, oltre all'accesso alle lounge aeroportuali e un'assicurazione viaggio premium. La Nexo Card è completamente gratuita (0 €/anno) e restituisce fino al 2 % di cashback in BTC o NEXO senza staking richiesto. Entrambe sono disponibili in Italia e nell'UE.`,
    it_verdict: `Se usi già Revolut come conto principale e vuoi un unico prodotto per gestire tutto, la Revolut Metal è giustificata nonostante l'abbonamento mensile. Per massimizzare il cashback crypto senza costi fissi, la Nexo Card è imbattibile: 2 % in BTC garantito, senza vincoli. Il nostro punteggio: Nexo Card 4,2/5 vs Revolut Metal 3,9/5 per un uso crypto-first.`,
    en_intro: `The Revolut Metal and Nexo Card represent two opposing philosophies: the first is a European neobank that integrates crypto as an additional feature, the second is a crypto-native card built for holders of digital assets. Revolut Metal costs €13.99/month and offers up to 1% cashback in crypto on eligible spending, plus airport lounge access and premium travel insurance. The Nexo Card is completely free (€0/year) and pays up to 2% cashback in BTC or NEXO with no staking required. Both are available across the EU.`,
    en_verdict: `If you already use Revolut as your main account and want a single product to manage everything, Revolut Metal is justified despite the monthly fee. To maximize crypto cashback with no fixed costs, the Nexo Card is unbeatable: guaranteed 2% in BTC, no commitment. Our score: Nexo Card 4.2/5 vs Revolut Metal 3.9/5 for crypto-first use.`,
    faq: [
      { q: 'Revolut Metal ou Nexo Card : laquelle est la moins chère ?', a: 'La Nexo Card est entièrement gratuite (0 €/an). La Revolut Metal coûte 13,99 €/mois soit environ 168 €/an. Pour un usage purement crypto, la Nexo Card est donc bien plus économique.' },
      { q: 'Laquelle offre le meilleur cashback crypto ?', a: 'La Nexo Card offre jusqu\'à 2 % en BTC sans conditions particulières. La Revolut Metal propose jusqu\'à 1 % en crypto. La Nexo Card est supérieure sur le cashback crypto pur.' },
      { q: 'Revolut Metal est-elle disponible en France ?', a: 'Oui, Revolut Metal est disponible en France via l\'abonnement Metal de Revolut, qui inclut une carte Mastercard physique et des avantages bancaires complets.' },
    ],
    de_faq: [
      { q: 'Revolut Metal oder Nexo Card: Welche ist günstiger?', a: 'Die Nexo Card ist vollständig kostenlos (0 €/Jahr). Die Revolut Metal kostet 13,99 €/Monat, also rund 168 €/Jahr. Für rein krypto-fokussierte Nutzung ist die Nexo Card deutlich wirtschaftlicher.' },
      { q: 'Welche bietet das bessere Krypto-Cashback?', a: 'Die Nexo Card bietet bis zu 2 % in BTC ohne besondere Bedingungen. Die Revolut Metal bis zu 1 % in Krypto. Die Nexo Card ist beim reinen Krypto-Cashback überlegen.' },
      { q: 'Ist die Revolut Metal in Deutschland verfügbar?', a: 'Ja, die Revolut Metal ist in Deutschland über das Metal-Abonnement von Revolut erhältlich, das eine physische Mastercard und umfassende Bankvorteile umfasst.' },
    ],
    es_faq: [
      { q: 'Revolut Metal o Nexo Card: ¿cuál es más barata?', a: 'La Nexo Card es completamente gratuita (0 €/año). La Revolut Metal cuesta 13,99 €/mes, unos 168 €/año. Para un uso puramente crypto, la Nexo Card es mucho más económica.' },
      { q: '¿Cuál ofrece mejor cashback en crypto?', a: 'La Nexo Card ofrece hasta el 2 % en BTC sin condiciones especiales. La Revolut Metal hasta el 1 % en crypto. La Nexo Card es superior en cashback crypto puro.' },
      { q: '¿La Revolut Metal está disponible en España?', a: 'Sí, la Revolut Metal está disponible en España a través de la suscripción Metal de Revolut, que incluye una Mastercard física y ventajas bancarias completas.' },
    ],
    it_faq: [
      { q: 'Revolut Metal o Nexo Card: quale è più economica?', a: 'La Nexo Card è completamente gratuita (0 €/anno). La Revolut Metal costa 13,99 €/mese, circa 168 €/anno. Per un uso puramente crypto, la Nexo Card è molto più conveniente.' },
      { q: 'Quale offre il miglior cashback crypto?', a: 'La Nexo Card offre fino al 2 % in BTC senza condizioni particolari. La Revolut Metal fino all\'1 % in crypto. La Nexo Card è superiore nel cashback crypto puro.' },
      { q: 'La Revolut Metal è disponibile in Italia?', a: 'Sì, la Revolut Metal è disponibile in Italia tramite l\'abbonamento Metal di Revolut, che include una Mastercard fisica e vantaggi bancari completi.' },
    ],
    en_faq: [
      { q: 'Revolut Metal or Nexo Card: which is cheaper?', a: 'The Nexo Card is completely free (€0/year). Revolut Metal costs €13.99/month, roughly €168/year. For purely crypto-focused use, the Nexo Card is far more economical.' },
      { q: 'Which offers better crypto cashback?', a: 'The Nexo Card offers up to 2% in BTC with no special conditions. Revolut Metal offers up to 1% in crypto. The Nexo Card is superior for pure crypto cashback.' },
      { q: 'Is Revolut Metal available across the EU?', a: 'Yes, Revolut Metal is available across the EU via Revolut\'s Metal subscription, which includes a physical Mastercard and comprehensive banking benefits.' },
    ],
  },

  // ─── Revolut Metal vs Bybit Card ─────────────────────────────────────────────
  'bybit-card-vs-revolut-metal': {
    fr_intro: `La Revolut Metal et la Bybit Card occupent des segments bien distincts du marché. Revolut Metal est un abonnement premium (13,99 €/mois) qui transforme votre compte bancaire en hub polyvalent : change de devises, assurance voyage, cashback jusqu'à 1 % en crypto. La Bybit Card est gratuite (0 €/an) et concentrée sur une chose : le cashback crypto, pouvant atteindre jusqu'à 10 % en MNT selon le volume mensuel de dépenses. Pour un utilisateur actif de Bybit souhaitant maximiser ses récompenses, la Bybit Card est clairement supérieure en rendement. Revolut Metal séduit ceux qui veulent un produit bancaire complet avec une touche crypto.`,
    fr_verdict: `La Bybit Card gagne sur le cashback pur si vous dépensez régulièrement. La Revolut Metal vaut son abonnement si vous exploitez l'ensemble de ses fonctionnalités bancaires. Pour un usage crypto-first, nous recommandons la Bybit Card. Note : Bybit Card 4,0/5 vs Revolut Metal 3,9/5 (cashback crypto).`,
    de_intro: `Revolut Metal und Bybit Card bedienen sehr unterschiedliche Segmente. Die Revolut Metal ist ein Premium-Abonnement (13,99 €/Monat), das Ihr Bankkonto in einen vielseitigen Hub verwandelt: Währungswechsel, Reiseversicherung, bis zu 1 % Cashback in Krypto. Die Bybit Card ist kostenlos (0 €/Jahr) und fokussiert auf Krypto-Cashback von bis zu 10 % in MNT je nach monatlichem Ausgabevolumen. Für aktive Bybit-Nutzer, die ihre Prämien maximieren wollen, ist die Bybit Card beim Ertrag klar überlegen.`,
    de_verdict: `Die Bybit Card gewinnt beim reinen Cashback, wenn Sie regelmäßig ausgeben. Revolut Metal lohnt sich, wenn Sie alle Bankfunktionen nutzen. Für krypto-first-Nutzung empfehlen wir die Bybit Card. Bewertung: Bybit Card 4,0/5 vs. Revolut Metal 3,9/5 (Krypto-Cashback).`,
    es_intro: `La Revolut Metal y la Bybit Card ocupan segmentos muy distintos. La Revolut Metal es una suscripción premium (13,99 €/mes) que convierte tu cuenta bancaria en un hub versátil: cambio de divisas, seguro de viaje, cashback de hasta el 1 % en crypto. La Bybit Card es gratuita (0 €/año) y se centra en el cashback crypto, pudiendo alcanzar hasta el 10 % en MNT según el volumen mensual de gasto. Para usuarios activos de Bybit que quieren maximizar recompensas, la Bybit Card es claramente superior en rendimiento.`,
    es_verdict: `La Bybit Card gana en cashback puro si gastas regularmente. La Revolut Metal vale su suscripción si aprovechas todas sus funciones bancarias. Para uso crypto-first, recomendamos la Bybit Card. Puntuación: Bybit Card 4,0/5 vs Revolut Metal 3,9/5 (cashback crypto).`,
    it_intro: `La Revolut Metal e la Bybit Card occupano segmenti molto diversi. La Revolut Metal è un abbonamento premium (13,99 €/mese) che trasforma il tuo conto bancario in un hub versatile: cambio valute, assicurazione viaggio, cashback fino all'1 % in crypto. La Bybit Card è gratuita (0 €/anno) e concentrata sul cashback crypto, che può raggiungere fino al 10 % in MNT in base al volume mensile di spesa. Per gli utenti attivi di Bybit che vogliono massimizzare i premi, la Bybit Card è chiaramente superiore in termini di rendimento.`,
    it_verdict: `La Bybit Card vince sul cashback puro se si spende regolarmente. La Revolut Metal vale l'abbonamento se si sfruttano tutte le sue funzioni bancarie. Per un uso crypto-first, consigliamo la Bybit Card. Punteggio: Bybit Card 4,0/5 vs Revolut Metal 3,9/5 (cashback crypto).`,
    en_intro: `Revolut Metal and the Bybit Card occupy very different market segments. Revolut Metal is a premium subscription (€13.99/month) that turns your bank account into a versatile hub: currency exchange, travel insurance, up to 1% cashback in crypto. The Bybit Card is free (€0/year) and focused on crypto cashback, reaching up to 10% in MNT based on monthly spending volume. For active Bybit users looking to maximize rewards, the Bybit Card clearly wins on yield. Revolut Metal appeals to those wanting a complete banking product with a crypto touch.`,
    en_verdict: `The Bybit Card wins on pure cashback if you spend regularly. Revolut Metal is worth its subscription if you use all its banking features. For crypto-first use, we recommend the Bybit Card. Score: Bybit Card 4.0/5 vs Revolut Metal 3.9/5 (crypto cashback).`,
    faq: [
      { q: 'Bybit Card ou Revolut Metal : laquelle a le meilleur cashback ?', a: 'La Bybit Card peut atteindre jusqu\'à 10 % en MNT pour les gros dépensiers. Revolut Metal plafonne à 1 % en crypto. La Bybit Card est bien supérieure sur le cashback pur.' },
      { q: 'La Revolut Metal vaut-elle son abonnement de 13,99 €/mois ?', a: 'Cela dépend de votre usage. Si vous profitez du change sans frais, des assurances voyages et du cashback, l\'abonnement se rentabilise. Pour le seul cashback crypto, la Bybit Card gratuite est plus avantageuse.' },
      { q: 'La Bybit Card est-elle disponible en France ?', a: 'Oui. La Bybit Card est disponible en France et dans toute l\'UE via Mastercard.' },
    ],
    de_faq: [
      { q: 'Bybit Card oder Revolut Metal: Welche hat das bessere Cashback?', a: 'Die Bybit Card kann bis zu 10 % in MNT für Vielausgeber erreichen. Die Revolut Metal begrenzt sich auf 1 % in Krypto. Die Bybit Card ist beim reinen Cashback deutlich überlegen.' },
      { q: 'Lohnt sich das Abonnement der Revolut Metal von 13,99 €/Monat?', a: 'Das hängt von der Nutzung ab. Wenn Sie gebührenfreien Währungswechsel, Reiseversicherungen und Cashback nutzen, amortisiert sich das Abonnement. Für reines Krypto-Cashback ist die kostenlose Bybit Card vorteilhafter.' },
      { q: 'Ist die Bybit Card in Deutschland verfügbar?', a: 'Ja. Die Bybit Card ist in Deutschland und in der gesamten EU über Mastercard verfügbar.' },
    ],
    es_faq: [
      { q: 'Bybit Card o Revolut Metal: ¿cuál tiene mejor cashback?', a: 'La Bybit Card puede alcanzar hasta el 10 % en MNT para grandes gastadores. La Revolut Metal se limita al 1 % en crypto. La Bybit Card es muy superior en cashback puro.' },
      { q: '¿Vale la pena la suscripción de 13,99 €/mes de Revolut Metal?', a: 'Depende del uso. Si aprovechas el cambio sin comisiones, los seguros de viaje y el cashback, la suscripción se rentabiliza. Para solo cashback crypto, la Bybit Card gratuita es más ventajosa.' },
      { q: '¿La Bybit Card está disponible en España?', a: 'Sí. La Bybit Card está disponible en España y en toda la UE a través de Mastercard.' },
    ],
    it_faq: [
      { q: 'Bybit Card o Revolut Metal: quale ha il miglior cashback?', a: 'La Bybit Card può raggiungere fino al 10 % in MNT per i grandi spenditori. La Revolut Metal si limita all\'1 % in crypto. La Bybit Card è nettamente superiore nel cashback puro.' },
      { q: 'Vale la pena l\'abbonamento da 13,99 €/mese della Revolut Metal?', a: 'Dipende dall\'uso. Se sfrutti il cambio valuta senza commissioni, le assicurazioni viaggio e il cashback, l\'abbonamento si ripaga. Per il solo cashback crypto, la Bybit Card gratuita è più vantaggiosa.' },
      { q: 'La Bybit Card è disponibile in Italia?', a: 'Sì. La Bybit Card è disponibile in Italia e in tutta l\'UE tramite Mastercard.' },
    ],
    en_faq: [
      { q: 'Bybit Card or Revolut Metal: which has better cashback?', a: 'The Bybit Card can reach up to 10% in MNT for high spenders. Revolut Metal caps at 1% in crypto. The Bybit Card is far superior for pure cashback.' },
      { q: 'Is Revolut Metal\'s €13.99/month subscription worth it?', a: 'It depends on your usage. If you use fee-free currency exchange, travel insurance, and cashback, the subscription pays off. For crypto cashback alone, the free Bybit Card is more advantageous.' },
      { q: 'Is the Bybit Card available across the EU?', a: 'Yes. The Bybit Card is available across the EU via Mastercard.' },
    ],
  },

  // ─── Revolut Metal vs Crypto.com Midnight Blue ───────────────────────────────
  'crypto-com-midnight-blue-vs-revolut-metal': {
    fr_intro: `La Revolut Metal et la Crypto.com Midnight Blue couvrent deux univers différents. Revolut Metal (13,99 €/mois) est la référence des néobanques premium : assurance voyage, change sans frais, cashback 1 % en crypto. La Midnight Blue est l'entrée de gamme de Crypto.com — entièrement gratuite (0 €/an) — et offre 1 % de cashback en CRO sans staking requis. Les deux cartes sont disponibles dans toute l'UE. La grande différence : Revolut Metal est un produit bancaire à part entière, tandis que la Midnight Blue est une carte crypto-native accessible sans engagement.`,
    fr_verdict: `Pour un profil mixte (banque + crypto), Revolut Metal offre un écosystème plus complet. Pour le crypto pur à coût zéro, la Midnight Blue est solide. Note : ex æquo sur le cashback (1 % chacune), mais la Midnight Blue gagne sur le prix. Revolut Metal 3,8/5 vs Midnight Blue 3,6/5 (cashback crypto).`,
    de_intro: `Revolut Metal und die Crypto.com Midnight Blue decken zwei verschiedene Bereiche ab. Revolut Metal (13,99 €/Monat) ist die Referenz unter den Premium-Neobanken: Reiseversicherung, gebührenfreier Währungswechsel, 1 % Cashback in Krypto. Die Midnight Blue ist das Einstiegsmodell von Crypto.com — völlig kostenlos (0 €/Jahr) — und bietet 1 % Cashback in CRO ohne Staking. Beide Karten sind in der gesamten EU verfügbar.`,
    de_verdict: `Für ein gemischtes Profil (Bank + Krypto) bietet Revolut Metal ein vollständigeres Ökosystem. Für reines Krypto ohne Kosten ist die Midnight Blue solide. Beim Cashback stehen beide bei 1 %, aber die Midnight Blue punktet beim Preis. Revolut Metal 3,8/5 vs. Midnight Blue 3,6/5.`,
    es_intro: `La Revolut Metal y la Crypto.com Midnight Blue cubren dos universos distintos. La Revolut Metal (13,99 €/mes) es la referencia entre los neobancos premium: seguro de viaje, cambio sin comisiones, cashback del 1 % en crypto. La Midnight Blue es la gama de entrada de Crypto.com — completamente gratuita (0 €/año) — y ofrece el 1 % de cashback en CRO sin staking requerido. Ambas están disponibles en toda la UE.`,
    es_verdict: `Para un perfil mixto (banco + crypto), la Revolut Metal ofrece un ecosistema más completo. Para crypto puro a coste cero, la Midnight Blue es sólida. Empate en cashback (1 % cada una), pero la Midnight Blue gana en precio. Revolut Metal 3,8/5 vs Midnight Blue 3,6/5.`,
    it_intro: `La Revolut Metal e la Crypto.com Midnight Blue coprono due universi diversi. La Revolut Metal (13,99 €/mese) è il riferimento tra i neobank premium: assicurazione viaggio, cambio senza commissioni, cashback dell'1 % in crypto. La Midnight Blue è l'entry level di Crypto.com — completamente gratuita (0 €/anno) — e offre l'1 % di cashback in CRO senza staking richiesto. Entrambe sono disponibili in tutta l'UE.`,
    it_verdict: `Per un profilo misto (banca + crypto), la Revolut Metal offre un ecosistema più completo. Per il crypto puro a costo zero, la Midnight Blue è solida. Parità sul cashback (1 % ciascuna), ma la Midnight Blue vince sul prezzo. Revolut Metal 3,8/5 vs Midnight Blue 3,6/5.`,
    en_intro: `Revolut Metal and the Crypto.com Midnight Blue cover two different worlds. Revolut Metal (€13.99/month) is the reference among premium neobanks: travel insurance, fee-free currency exchange, 1% cashback in crypto. The Midnight Blue is Crypto.com's entry-level card — completely free (€0/year) — offering 1% cashback in CRO with no staking required. Both are available across the EU.`,
    en_verdict: `For a mixed profile (banking + crypto), Revolut Metal offers a more complete ecosystem. For pure crypto at zero cost, the Midnight Blue is solid. Tied on cashback (1% each), but the Midnight Blue wins on price. Revolut Metal 3.8/5 vs Midnight Blue 3.6/5.`,
    faq: [
      { q: 'Revolut Metal ou Crypto.com Midnight Blue : laquelle est la plus adaptée aux débutants ?', a: 'La Midnight Blue est plus simple à prendre en main : aucun abonnement, 1 % de cashback en CRO, disponible rapidement via l\'app Crypto.com. Revolut Metal demande un abonnement mais offre plus de fonctionnalités bancaires.' },
      { q: 'Les deux cartes proposent-elles un cashback identique ?', a: 'Oui, les deux offrent 1 % de cashback — en CRO pour la Midnight Blue, en crypto au choix pour Revolut Metal. Le choix dépend donc de votre préférence entre CRO et d\'autres cryptos.' },
      { q: 'Faut-il du staking pour la Crypto.com Midnight Blue ?', a: 'Non. La Midnight Blue ne requiert aucun staking. C\'est l\'un de ses atouts : le cashback CRO est accessible sans immobiliser de capital.' },
    ],
    de_faq: [
      { q: 'Revolut Metal oder Crypto.com Midnight Blue: Welche eignet sich besser für Einsteiger?', a: 'Die Midnight Blue ist einfacher zu handhaben: kein Abonnement, 1 % Cashback in CRO, schnell über die Crypto.com-App verfügbar. Revolut Metal erfordert ein Abonnement, bietet aber mehr Bankfunktionen.' },
      { q: 'Bieten beide Karten identisches Cashback?', a: 'Ja, beide bieten 1 % Cashback — in CRO für die Midnight Blue, in Krypto nach Wahl für Revolut Metal. Die Wahl hängt von der Präferenz zwischen CRO und anderen Kryptos ab.' },
      { q: 'Ist Staking für die Crypto.com Midnight Blue erforderlich?', a: 'Nein. Die Midnight Blue erfordert kein Staking. Das ist einer ihrer Vorteile: Das CRO-Cashback ist zugänglich, ohne Kapital zu binden.' },
    ],
    es_faq: [
      { q: 'Revolut Metal o Crypto.com Midnight Blue: ¿cuál es más adecuada para principiantes?', a: 'La Midnight Blue es más sencilla: sin suscripción, 1 % de cashback en CRO, disponible rápidamente a través de la app de Crypto.com. La Revolut Metal requiere suscripción pero ofrece más funciones bancarias.' },
      { q: '¿Ambas tarjetas ofrecen el mismo cashback?', a: 'Sí, ambas ofrecen el 1 % de cashback — en CRO para la Midnight Blue, en crypto a elección para la Revolut Metal. La elección depende de tu preferencia entre CRO y otras criptos.' },
      { q: '¿La Crypto.com Midnight Blue requiere staking?', a: 'No. La Midnight Blue no requiere staking. Ese es uno de sus puntos fuertes: el cashback en CRO es accesible sin inmovilizar capital.' },
    ],
    it_faq: [
      { q: 'Revolut Metal o Crypto.com Midnight Blue: quale è più adatta ai principianti?', a: 'La Midnight Blue è più semplice: nessun abbonamento, 1 % di cashback in CRO, disponibile rapidamente tramite l\'app Crypto.com. La Revolut Metal richiede un abbonamento ma offre più funzioni bancarie.' },
      { q: 'Entrambe le carte offrono lo stesso cashback?', a: 'Sì, entrambe offrono l\'1 % di cashback — in CRO per la Midnight Blue, in crypto a scelta per la Revolut Metal. La scelta dipende dalla preferenza tra CRO e altre criptovalute.' },
      { q: 'La Crypto.com Midnight Blue richiede staking?', a: 'No. La Midnight Blue non richiede staking. È uno dei suoi punti di forza: il cashback in CRO è accessibile senza immobilizzare capitale.' },
    ],
    en_faq: [
      { q: 'Revolut Metal or Crypto.com Midnight Blue: which is better for beginners?', a: 'The Midnight Blue is simpler to get started with: no subscription, 1% cashback in CRO, quickly available via the Crypto.com app. Revolut Metal requires a subscription but offers more banking features.' },
      { q: 'Do both cards offer the same cashback?', a: 'Yes, both offer 1% cashback — in CRO for the Midnight Blue, in crypto of your choice for Revolut Metal. The choice depends on your preference between CRO and other cryptos.' },
      { q: 'Does the Crypto.com Midnight Blue require staking?', a: 'No. The Midnight Blue requires no staking. This is one of its strengths: CRO cashback is accessible without locking up capital.' },
    ],
  },

  // ─── Revolut Metal vs Binance Standard ───────────────────────────────────────
  'binance-standard-vs-revolut-metal': {
    fr_intro: `La Revolut Metal et la Binance Card (standard) sont deux produits complémentaires qui s'adressent à des profils différents. Revolut Metal est une néobanque premium (13,99 €/mois) avec assurance voyage, change multi-devises et cashback crypto. La Binance Card standard est gratuite (0 €/an) et offre du cashback en BNB sur les dépenses du quotidien, avec un niveau de cashback lié au solde BNB détenu. Les deux sont disponibles dans la majorité des pays de l'UE via Visa.`,
    fr_verdict: `Si vous utilisez Binance activement et détenez des BNB, la Binance Card complète naturellement votre écosystème. Pour un compte bancaire full-features avec une couche crypto, Revolut Metal reste la référence. Note : Revolut Metal 3,8/5 vs Binance Card 3,5/5 pour la polyvalence bancaire.`,
    de_intro: `Revolut Metal und die Binance Card (Standard) sprechen unterschiedliche Profile an. Revolut Metal ist eine Premium-Neobank (13,99 €/Monat) mit Reiseversicherung, Multi-Währungs-Wechsel und Krypto-Cashback. Die Binance Card Standard ist kostenlos (0 €/Jahr) und bietet Cashback in BNB auf alltägliche Ausgaben, abhängig vom gehaltenen BNB-Guthaben. Beide sind in den meisten EU-Ländern über Visa verfügbar.`,
    de_verdict: `Wenn Sie Binance aktiv nutzen und BNB halten, ergänzt die Binance Card Ihr Ökosystem natürlich. Für ein vollwertiges Bankkonto mit Krypto-Ebene bleibt Revolut Metal die Referenz. Bewertung: Revolut Metal 3,8/5 vs. Binance Card 3,5/5 für Bankvielseitigkeit.`,
    es_intro: `La Revolut Metal y la Binance Card (estándar) se dirigen a perfiles diferentes. La Revolut Metal es un neobanco premium (13,99 €/mes) con seguro de viaje, cambio multidivisa y cashback en crypto. La Binance Card estándar es gratuita (0 €/año) y ofrece cashback en BNB en gastos cotidianos, vinculado al saldo de BNB mantenido. Ambas están disponibles en la mayoría de países de la UE vía Visa.`,
    es_verdict: `Si usas Binance activamente y tienes BNB, la Binance Card complementa naturalmente tu ecosistema. Para una cuenta bancaria completa con capa crypto, la Revolut Metal sigue siendo la referencia. Puntuación: Revolut Metal 3,8/5 vs Binance Card 3,5/5 para versatilidad bancaria.`,
    it_intro: `La Revolut Metal e la Binance Card (standard) si rivolgono a profili diversi. La Revolut Metal è una neobank premium (13,99 €/mese) con assicurazione viaggio, cambio multivaluta e cashback in crypto. La Binance Card standard è gratuita (0 €/anno) e offre cashback in BNB sulle spese quotidiane, legato al saldo BNB detenuto. Entrambe sono disponibili nella maggior parte dei paesi UE tramite Visa.`,
    it_verdict: `Se usi Binance attivamente e detieni BNB, la Binance Card si integra naturalmente nel tuo ecosistema. Per un conto bancario completo con livello crypto, la Revolut Metal rimane il riferimento. Punteggio: Revolut Metal 3,8/5 vs Binance Card 3,5/5 per versatilità bancaria.`,
    en_intro: `Revolut Metal and the Binance Card (standard) target different profiles. Revolut Metal is a premium neobank (€13.99/month) with travel insurance, multi-currency exchange and crypto cashback. The Binance Standard Card is free (€0/year) and offers cashback in BNB on everyday spending, linked to the BNB balance held. Both are available in most EU countries via Visa.`,
    en_verdict: `If you actively use Binance and hold BNB, the Binance Card naturally complements your ecosystem. For a full-featured bank account with a crypto layer, Revolut Metal remains the reference. Score: Revolut Metal 3.8/5 vs Binance Card 3.5/5 for banking versatility.`,
    faq: [
      { q: 'Binance Card ou Revolut Metal : laquelle a le plus de fonctionnalités bancaires ?', a: 'Revolut Metal dispose de plus de fonctionnalités bancaires : compte multi-devises, virement international, assurance voyage, carte de débit standard. La Binance Card est avant tout une carte de cashback en BNB.' },
      { q: 'Faut-il détenir des BNB pour profiter du cashback de la Binance Card ?', a: 'Oui. Le niveau de cashback de la Binance Card est lié au solde BNB du compte. Plus vous détenez de BNB, plus le taux est élevé.' },
      { q: 'La Binance Card est-elle disponible en France ?', a: 'Oui, la Binance Card est disponible en France via Visa. Vérifiez cependant les restrictions en vigueur selon les mises à jour réglementaires Binance en Europe.' },
    ],
    de_faq: [
      { q: 'Binance Card oder Revolut Metal: Welche hat mehr Bankfunktionen?', a: 'Die Revolut Metal hat mehr Bankfunktionen: Multi-Währungs-Konto, internationale Überweisungen, Reiseversicherung, Standard-Debitkarte. Die Binance Card ist in erster Linie eine BNB-Cashback-Karte.' },
      { q: 'Muss man BNB halten, um das Cashback der Binance Card zu nutzen?', a: 'Ja. Das Cashback-Niveau der Binance Card hängt vom BNB-Guthaben ab. Je mehr BNB Sie halten, desto höher ist der Cashback-Satz.' },
      { q: 'Ist die Binance Card in Deutschland verfügbar?', a: 'Ja, die Binance Card ist in Deutschland über Visa verfügbar. Prüfen Sie jedoch die aktuellen regulatorischen Einschränkungen von Binance in Europa.' },
    ],
    es_faq: [
      { q: 'Binance Card o Revolut Metal: ¿cuál tiene más funciones bancarias?', a: 'La Revolut Metal tiene más funciones bancarias: cuenta multidivisa, transferencias internacionales, seguro de viaje, tarjeta de débito estándar. La Binance Card es principalmente una tarjeta de cashback en BNB.' },
      { q: '¿Hay que tener BNB para aprovechar el cashback de la Binance Card?', a: 'Sí. El nivel de cashback de la Binance Card está vinculado al saldo de BNB de la cuenta. Cuanto más BNB tengas, mayor es la tasa.' },
      { q: '¿La Binance Card está disponible en España?', a: 'Sí, la Binance Card está disponible en España vía Visa. Verifica las restricciones regulatorias de Binance en Europa.' },
    ],
    it_faq: [
      { q: 'Binance Card o Revolut Metal: quale ha più funzioni bancarie?', a: 'La Revolut Metal ha più funzioni bancarie: conto multivaluta, bonifici internazionali, assicurazione viaggio, carta di debito standard. La Binance Card è principalmente una carta cashback in BNB.' },
      { q: 'Bisogna detenere BNB per sfruttare il cashback della Binance Card?', a: 'Sì. Il livello di cashback della Binance Card è legato al saldo BNB del conto. Più BNB si detengono, più alto è il tasso.' },
      { q: 'La Binance Card è disponibile in Italia?', a: 'Sì, la Binance Card è disponibile in Italia tramite Visa. Verificare le eventuali restrizioni normative di Binance in Europa.' },
    ],
    en_faq: [
      { q: 'Binance Card or Revolut Metal: which has more banking features?', a: 'Revolut Metal has more banking features: multi-currency account, international transfers, travel insurance, standard debit card. The Binance Card is primarily a BNB cashback card.' },
      { q: 'Do you need to hold BNB to benefit from the Binance Card cashback?', a: 'Yes. The Binance Card cashback level is linked to the account\'s BNB balance. The more BNB you hold, the higher the cashback rate.' },
      { q: 'Is the Binance Card available across the EU?', a: 'Yes, the Binance Card is available across the EU via Visa. Check the current regulatory restrictions for Binance in Europe.' },
    ],
  },

  // ─── Kraken KRAK Card vs Nexo Card ───────────────────────────────────────────
  'kraken-krak-card-vs-nexo-card': {
    fr_intro: `La Kraken KRAK Card et la Nexo Card sont deux cartes crypto-natives destinées aux utilisateurs déjà familiers avec les exchanges centralisés. La KRAK Card offre du cashback en BTC avec des niveaux liés à l'activité Kraken, sans staking requis. La Nexo Card propose jusqu'à 2 % de cashback en BTC ou NEXO, également sans staking obligatoire. Les deux sont gratuites (0 €/an) et disponibles en Europe. Le choix dépend souvent de l'exchange que vous utilisez déjà.`,
    fr_verdict: `Si vous êtes utilisateur de Kraken, la KRAK Card s'intègre naturellement à votre workflow. Pour un cashback en BTC sans conditions d'activité sur un exchange, la Nexo Card reste plus accessible. Note : Nexo Card 4,2/5 vs KRAK Card 3,8/5.`,
    de_intro: `Die Kraken KRAK Card und die Nexo Card sind zwei krypto-native Karten für erfahrene Nutzer zentralisierter Börsen. Die KRAK Card bietet Cashback in BTC, abhängig von der Kraken-Aktivität, ohne Staking. Die Nexo Card bietet bis zu 2 % Cashback in BTC oder NEXO, ebenfalls ohne obligatorisches Staking. Beide sind kostenlos und in Europa verfügbar.`,
    de_verdict: `Wenn Sie Kraken-Nutzer sind, integriert sich die KRAK Card natürlich in Ihren Workflow. Für BTC-Cashback ohne Aktivitätsbedingungen einer Börse ist die Nexo Card zugänglicher. Bewertung: Nexo Card 4,2/5 vs. KRAK Card 3,8/5.`,
    es_intro: `La Kraken KRAK Card y la Nexo Card son dos tarjetas crypto-nativas para usuarios ya familiarizados con los exchanges centralizados. La KRAK Card ofrece cashback en BTC con niveles vinculados a la actividad en Kraken, sin staking requerido. La Nexo Card propone hasta el 2 % de cashback en BTC o NEXO, también sin staking obligatorio. Ambas son gratuitas y están disponibles en Europa.`,
    es_verdict: `Si eres usuario de Kraken, la KRAK Card se integra naturalmente en tu flujo de trabajo. Para cashback en BTC sin condiciones de actividad en un exchange, la Nexo Card es más accesible. Puntuación: Nexo Card 4,2/5 vs KRAK Card 3,8/5.`,
    it_intro: `La Kraken KRAK Card e la Nexo Card sono due carte crypto-native per utenti già familiari con gli exchange centralizzati. La KRAK Card offre cashback in BTC con livelli legati all'attività su Kraken, senza staking richiesto. La Nexo Card propone fino al 2 % di cashback in BTC o NEXO, anch'essa senza staking obbligatorio. Entrambe sono gratuite e disponibili in Europa.`,
    it_verdict: `Se sei un utente di Kraken, la KRAK Card si integra naturalmente nel tuo flusso di lavoro. Per cashback in BTC senza condizioni di attività su un exchange, la Nexo Card è più accessibile. Punteggio: Nexo Card 4,2/5 vs KRAK Card 3,8/5.`,
    en_intro: `The Kraken KRAK Card and Nexo Card are two crypto-native cards for users already familiar with centralized exchanges. The KRAK Card offers cashback in BTC with levels tied to Kraken activity, no staking required. The Nexo Card offers up to 2% cashback in BTC or NEXO, also with no mandatory staking. Both are free (€0/year) and available across Europe.`,
    en_verdict: `If you're a Kraken user, the KRAK Card integrates naturally into your workflow. For BTC cashback without exchange activity conditions, the Nexo Card is more accessible. Score: Nexo Card 4.2/5 vs KRAK Card 3.8/5.`,
    faq: [
      { q: 'KRAK Card ou Nexo Card : laquelle offre le meilleur cashback en BTC ?', a: 'La Nexo Card offre jusqu\'à 2 % en BTC sans condition d\'activité particulière. Le cashback de la KRAK Card dépend de votre activité sur Kraken. Pour un cashback BTC prévisible, la Nexo Card est plus fiable.' },
      { q: 'Faut-il être client de Kraken pour obtenir la KRAK Card ?', a: 'Oui. La KRAK Card est liée à un compte Kraken actif. Si vous utilisez déjà l\'exchange, c\'est une carte naturellement complémentaire.' },
      { q: 'La Nexo Card nécessite-t-elle un compte Nexo ?', a: 'Oui. La Nexo Card est liée à un compte Nexo. Le cashback en NEXO ou BTC est versé directement sur votre portefeuille Nexo.' },
    ],
    de_faq: [
      { q: 'KRAK Card oder Nexo Card: Welche bietet das bessere BTC-Cashback?', a: 'Die Nexo Card bietet bis zu 2 % in BTC ohne besondere Aktivitätsbedingung. Das Cashback der KRAK Card hängt von Ihrer Kraken-Aktivität ab. Für vorhersehbares BTC-Cashback ist die Nexo Card zuverlässiger.' },
      { q: 'Muss man Kraken-Kunde sein, um die KRAK Card zu erhalten?', a: 'Ja. Die KRAK Card ist mit einem aktiven Kraken-Konto verknüpft. Wenn Sie die Börse bereits nutzen, ist es eine natürlich ergänzende Karte.' },
      { q: 'Benötigt die Nexo Card ein Nexo-Konto?', a: 'Ja. Die Nexo Card ist mit einem Nexo-Konto verknüpft. Das Cashback in NEXO oder BTC wird direkt in Ihr Nexo-Wallet eingezahlt.' },
    ],
    es_faq: [
      { q: 'KRAK Card o Nexo Card: ¿cuál ofrece mejor cashback en BTC?', a: 'La Nexo Card ofrece hasta el 2 % en BTC sin condición de actividad especial. El cashback de la KRAK Card depende de tu actividad en Kraken. Para cashback en BTC predecible, la Nexo Card es más fiable.' },
      { q: '¿Hay que ser cliente de Kraken para obtener la KRAK Card?', a: 'Sí. La KRAK Card está vinculada a una cuenta activa de Kraken. Si ya usas el exchange, es una tarjeta que se complementa naturalmente.' },
      { q: '¿La Nexo Card requiere una cuenta Nexo?', a: 'Sí. La Nexo Card está vinculada a una cuenta Nexo. El cashback en NEXO o BTC se abona directamente en tu cartera Nexo.' },
    ],
    it_faq: [
      { q: 'KRAK Card o Nexo Card: quale offre il miglior cashback in BTC?', a: 'La Nexo Card offre fino al 2 % in BTC senza condizioni di attività particolari. Il cashback della KRAK Card dipende dall\'attività su Kraken. Per un cashback BTC prevedibile, la Nexo Card è più affidabile.' },
      { q: 'Bisogna essere clienti di Kraken per ottenere la KRAK Card?', a: 'Sì. La KRAK Card è collegata a un conto Kraken attivo. Se si usa già l\'exchange, è una carta naturalmente complementare.' },
      { q: 'La Nexo Card richiede un conto Nexo?', a: 'Sì. La Nexo Card è collegata a un conto Nexo. Il cashback in NEXO o BTC viene accreditato direttamente nel portafoglio Nexo.' },
    ],
    en_faq: [
      { q: 'KRAK Card or Nexo Card: which offers better BTC cashback?', a: 'The Nexo Card offers up to 2% in BTC with no special activity conditions. The KRAK Card cashback depends on your Kraken activity. For predictable BTC cashback, the Nexo Card is more reliable.' },
      { q: 'Do you need to be a Kraken customer to get the KRAK Card?', a: 'Yes. The KRAK Card is linked to an active Kraken account. If you already use the exchange, it\'s a naturally complementary card.' },
      { q: 'Does the Nexo Card require a Nexo account?', a: 'Yes. The Nexo Card is linked to a Nexo account. Cashback in NEXO or BTC is paid directly into your Nexo wallet.' },
    ],
  },

  // ─── OKX Card vs Nexo Card ───────────────────────────────────────────────────
  'nexo-card-vs-okx-card': {
    fr_intro: `La OKX Card et la Nexo Card sont deux cartes crypto gratuites (0 €/an) disponibles en Europe, mais avec des modèles de récompenses différents. OKX Card offre du cashback en OKB sur les dépenses, avec des niveaux qui peuvent être attractifs pour les utilisateurs actifs de l'exchange OKX. Nexo Card propose jusqu'à 2 % en BTC ou NEXO sans staking requis, ce qui la rend accessible à tout utilisateur crypto. Les deux ciblent les utilisateurs des exchanges respectifs.`,
    fr_verdict: `Si vous utilisez OKX comme exchange principal, la OKX Card intègre naturellement vos récompenses. Pour un cashback en BTC sans dépendance à un exchange particulier, la Nexo Card est plus universelle. Note : Nexo Card 4,2/5 vs OKX Card 3,7/5.`,
    de_intro: `Die OKX Card und die Nexo Card sind zwei kostenlose Krypto-Karten (0 €/Jahr) in Europa mit unterschiedlichen Belohnungsmodellen. Die OKX Card bietet Cashback in OKB auf Ausgaben, mit Stufen, die für aktive OKX-Nutzer attraktiv sein können. Die Nexo Card bietet bis zu 2 % in BTC oder NEXO ohne Staking, was sie für jeden Krypto-Nutzer zugänglich macht.`,
    de_verdict: `Wenn Sie OKX als Hauptbörse nutzen, integriert die OKX Card Ihre Prämien natürlich. Für BTC-Cashback ohne Abhängigkeit von einer bestimmten Börse ist die Nexo Card universeller. Bewertung: Nexo Card 4,2/5 vs. OKX Card 3,7/5.`,
    es_intro: `La OKX Card y la Nexo Card son dos tarjetas crypto gratuitas (0 €/año) disponibles en Europa, con modelos de recompensas diferentes. La OKX Card ofrece cashback en OKB en los gastos, con niveles atractivos para los usuarios activos del exchange OKX. La Nexo Card propone hasta el 2 % en BTC o NEXO sin staking requerido, haciéndola accesible a cualquier usuario crypto.`,
    es_verdict: `Si usas OKX como exchange principal, la OKX Card integra naturalmente tus recompensas. Para cashback en BTC sin dependencia de un exchange en particular, la Nexo Card es más universal. Puntuación: Nexo Card 4,2/5 vs OKX Card 3,7/5.`,
    it_intro: `La OKX Card e la Nexo Card sono due carte crypto gratuite (0 €/anno) disponibili in Europa, con modelli di ricompensa diversi. La OKX Card offre cashback in OKB sulle spese, con livelli che possono essere attraenti per gli utenti attivi dell'exchange OKX. La Nexo Card propone fino al 2 % in BTC o NEXO senza staking richiesto, rendendola accessibile a qualsiasi utente crypto.`,
    it_verdict: `Se si usa OKX come exchange principale, la OKX Card integra naturalmente le ricompense. Per cashback in BTC senza dipendenza da un exchange specifico, la Nexo Card è più universale. Punteggio: Nexo Card 4,2/5 vs OKX Card 3,7/5.`,
    en_intro: `The OKX Card and Nexo Card are two free (€0/year) crypto cards available in Europe, with different reward models. The OKX Card offers cashback in OKB on spending, with tiers that can be attractive for active OKX exchange users. The Nexo Card offers up to 2% in BTC or NEXO with no staking required, making it accessible to any crypto user.`,
    en_verdict: `If you use OKX as your main exchange, the OKX Card naturally integrates your rewards. For BTC cashback without dependence on a specific exchange, the Nexo Card is more universal. Score: Nexo Card 4.2/5 vs OKX Card 3.7/5.`,
    faq: [
      { q: 'OKX Card ou Nexo Card : laquelle est la plus accessible sans exchange actif ?', a: 'La Nexo Card. Son cashback en BTC n\'est pas conditionné à une activité de trading particulière. La OKX Card est plus avantageuse si vous tradez régulièrement sur OKX.' },
      { q: 'Les deux cartes sont-elles disponibles en France ?', a: 'Oui, les deux cartes sont disponibles en France et dans la plupart des pays de l\'UE.' },
      { q: 'OKX Card offre-t-elle du cashback en BTC ?', a: 'Non. La OKX Card verse le cashback en OKB, le token natif d\'OKX. Si vous souhaitez du cashback en BTC, la Nexo Card est plus adaptée.' },
    ],
    de_faq: [
      { q: 'OKX Card oder Nexo Card: Welche ist ohne aktive Börse zugänglicher?', a: 'Die Nexo Card. Ihr BTC-Cashback ist nicht an bestimmte Trading-Aktivitäten gebunden. Die OKX Card ist vorteilhafter, wenn Sie regelmäßig auf OKX handeln.' },
      { q: 'Sind beide Karten in Deutschland verfügbar?', a: 'Ja, beide Karten sind in Deutschland und den meisten EU-Ländern verfügbar.' },
      { q: 'Bietet die OKX Card Cashback in BTC?', a: 'Nein. Die OKX Card zahlt Cashback in OKB, dem nativen Token von OKX. Für Cashback in BTC ist die Nexo Card besser geeignet.' },
    ],
    es_faq: [
      { q: 'OKX Card o Nexo Card: ¿cuál es más accesible sin un exchange activo?', a: 'La Nexo Card. Su cashback en BTC no está condicionado a ninguna actividad de trading específica. La OKX Card es más ventajosa si operas regularmente en OKX.' },
      { q: '¿Ambas tarjetas están disponibles en España?', a: 'Sí, ambas tarjetas están disponibles en España y en la mayoría de países de la UE.' },
      { q: '¿La OKX Card ofrece cashback en BTC?', a: 'No. La OKX Card paga el cashback en OKB, el token nativo de OKX. Si quieres cashback en BTC, la Nexo Card es más adecuada.' },
    ],
    it_faq: [
      { q: 'OKX Card o Nexo Card: quale è più accessibile senza un exchange attivo?', a: 'La Nexo Card. Il suo cashback in BTC non è condizionato da attività di trading particolari. La OKX Card è più vantaggiosa se si fa trading regolarmente su OKX.' },
      { q: 'Entrambe le carte sono disponibili in Italia?', a: 'Sì, entrambe le carte sono disponibili in Italia e nella maggior parte dei paesi UE.' },
      { q: 'La OKX Card offre cashback in BTC?', a: 'No. La OKX Card paga il cashback in OKB, il token nativo di OKX. Per cashback in BTC, la Nexo Card è più adatta.' },
    ],
    en_faq: [
      { q: 'OKX Card or Nexo Card: which is more accessible without an active exchange?', a: 'The Nexo Card. Its BTC cashback isn\'t conditional on specific trading activity. The OKX Card is more advantageous if you trade regularly on OKX.' },
      { q: 'Are both cards available across the EU?', a: 'Yes, both cards are available across the EU.' },
      { q: 'Does the OKX Card offer BTC cashback?', a: 'No. The OKX Card pays cashback in OKB, OKX\'s native token. For BTC cashback, the Nexo Card is more suitable.' },
    ],
  },

  // ─── Coinbase Card vs Bybit Card ─────────────────────────────────────────────
  'bybit-card-vs-coinbase-card': {
    fr_intro: `La Coinbase Card et la Bybit Card illustrent deux approches du cashback crypto. La Coinbase Card, disponible en Europe, offre jusqu'à 4 % de récompenses en crypto (XLM, ETH ou d'autres tokens) selon le choix de l'utilisateur, sans staking. La Bybit Card offre jusqu'à 10 % en MNT selon le volume mensuel de dépenses, sans staking non plus. Les deux sont gratuites (0 €/an). La Coinbase Card séduit les débutants par sa simplicité ; la Bybit Card attire les dépensiers réguliers.`,
    fr_verdict: `Pour un débutant qui veut du cashback simple en ETH ou BTC, la Coinbase Card est plus intuitive. Pour maximiser le cashback sur un volume de dépenses élevé, la Bybit Card est imbattable. Note : Coinbase Card 3,8/5 vs Bybit Card 4,0/5.`,
    de_intro: `Die Coinbase Card und die Bybit Card zeigen zwei Ansätze für Krypto-Cashback. Die Coinbase Card bietet bis zu 4 % Belohnungen in Krypto (XLM, ETH oder anderen Token) ohne Staking. Die Bybit Card bietet bis zu 10 % in MNT je nach monatlichem Ausgabevolumen, ebenfalls ohne Staking. Beide sind kostenlos (0 €/Jahr). Die Coinbase Card überzeugt Einsteiger durch ihre Einfachheit; die Bybit Card zieht Vielausgeber an.`,
    de_verdict: `Für Einsteiger, die einfaches Cashback in ETH oder BTC wollen, ist die Coinbase Card intuitiver. Für maximales Cashback bei hohem Ausgabevolumen ist die Bybit Card unschlagbar. Bewertung: Coinbase Card 3,8/5 vs. Bybit Card 4,0/5.`,
    es_intro: `La Coinbase Card y la Bybit Card ilustran dos enfoques del cashback crypto. La Coinbase Card ofrece hasta el 4 % de recompensas en crypto (XLM, ETH u otros tokens) sin staking. La Bybit Card ofrece hasta el 10 % en MNT según el volumen mensual de gasto, también sin staking. Ambas son gratuitas (0 €/año). La Coinbase Card atrae a los principiantes por su sencillez; la Bybit Card atrae a los grandes gastadores.`,
    es_verdict: `Para un principiante que quiere cashback sencillo en ETH o BTC, la Coinbase Card es más intuitiva. Para maximizar el cashback con un alto volumen de gasto, la Bybit Card es imbatible. Puntuación: Coinbase Card 3,8/5 vs Bybit Card 4,0/5.`,
    it_intro: `La Coinbase Card e la Bybit Card illustrano due approcci al cashback crypto. La Coinbase Card offre fino al 4 % di premi in crypto (XLM, ETH o altri token) senza staking. La Bybit Card offre fino al 10 % in MNT in base al volume mensile di spesa, anch'essa senza staking. Entrambe sono gratuite (0 €/anno). La Coinbase Card attrae i principianti per la sua semplicità; la Bybit Card attrae i grandi spenditori.`,
    it_verdict: `Per un principiante che vuole cashback semplice in ETH o BTC, la Coinbase Card è più intuitiva. Per massimizzare il cashback con un alto volume di spesa, la Bybit Card è imbattibile. Punteggio: Coinbase Card 3,8/5 vs Bybit Card 4,0/5.`,
    en_intro: `The Coinbase Card and Bybit Card illustrate two crypto cashback approaches. The Coinbase Card offers up to 4% rewards in crypto (XLM, ETH or other tokens) with no staking. The Bybit Card offers up to 10% in MNT based on monthly spending volume, also with no staking. Both are free (€0/year). The Coinbase Card appeals to beginners through its simplicity; the Bybit Card draws regular high spenders.`,
    en_verdict: `For a beginner wanting simple cashback in ETH or BTC, the Coinbase Card is more intuitive. To maximize cashback on high spending volume, the Bybit Card is unbeatable. Score: Coinbase Card 3.8/5 vs Bybit Card 4.0/5.`,
    faq: [
      { q: 'Coinbase Card ou Bybit Card : laquelle est la plus adaptée aux débutants ?', a: 'La Coinbase Card. Son interface et le choix flexible de crypto en cashback (ETH, BTC, XLM…) la rendent plus accessible aux nouveaux entrants dans l\'univers crypto.' },
      { q: 'Bybit Card : le cashback à 10 % est-il accessible facilement ?', a: 'Le taux de 10 % en MNT est réservé aux plus gros dépensiers. Les paliers inférieurs restent attractifs dès un volume de dépenses modéré. Consultez les conditions Bybit actuelles.' },
      { q: 'Coinbase Card est-elle disponible en France ?', a: 'Oui, la Coinbase Card est disponible en France et dans la plupart des pays de l\'UE.' },
    ],
    de_faq: [
      { q: 'Coinbase Card oder Bybit Card: Welche eignet sich besser für Einsteiger?', a: 'Die Coinbase Card. Ihre Oberfläche und die flexible Wahl der Cashback-Krypto (ETH, BTC, XLM…) machen sie für Krypto-Neueinsteiger zugänglicher.' },
      { q: 'Bybit Card: Ist das Cashback von 10 % leicht zugänglich?', a: 'Der Satz von 10 % in MNT ist den größten Ausgaben vorbehalten. Niedrigere Stufen bleiben bei moderatem Ausgabevolumen attraktiv. Aktuelle Bybit-Bedingungen prüfen.' },
      { q: 'Ist die Coinbase Card in Deutschland verfügbar?', a: 'Ja, die Coinbase Card ist in Deutschland und den meisten EU-Ländern verfügbar.' },
    ],
    es_faq: [
      { q: 'Coinbase Card o Bybit Card: ¿cuál es más adecuada para principiantes?', a: 'La Coinbase Card. Su interfaz y la elección flexible de crypto en cashback (ETH, BTC, XLM…) la hacen más accesible para los recién llegados al mundo crypto.' },
      { q: 'Bybit Card: ¿es fácil acceder al cashback del 10 %?', a: 'La tasa del 10 % en MNT está reservada para los mayores gastadores. Los tramos inferiores siguen siendo atractivos con un volumen de gasto moderado. Consulta las condiciones actuales de Bybit.' },
      { q: '¿La Coinbase Card está disponible en España?', a: 'Sí, la Coinbase Card está disponible en España y en la mayoría de países de la UE.' },
    ],
    it_faq: [
      { q: 'Coinbase Card o Bybit Card: quale è più adatta ai principianti?', a: 'La Coinbase Card. La sua interfaccia e la scelta flessibile di crypto in cashback (ETH, BTC, XLM…) la rendono più accessibile ai nuovi utenti del mondo crypto.' },
      { q: 'Bybit Card: il cashback del 10 % è facilmente accessibile?', a: 'Il tasso del 10 % in MNT è riservato ai maggiori spenditori. I livelli inferiori rimangono attraenti con un volume di spesa moderato. Verificare le condizioni Bybit aggiornate.' },
      { q: 'La Coinbase Card è disponibile in Italia?', a: 'Sì, la Coinbase Card è disponibile in Italia e nella maggior parte dei paesi UE.' },
    ],
    en_faq: [
      { q: 'Coinbase Card or Bybit Card: which is better for beginners?', a: 'The Coinbase Card. Its interface and flexible choice of cashback crypto (ETH, BTC, XLM…) make it more accessible for crypto newcomers.' },
      { q: 'Bybit Card: is the 10% cashback easily accessible?', a: 'The 10% MNT rate is reserved for the highest spenders. Lower tiers remain attractive at moderate spending volumes. Check current Bybit conditions.' },
      { q: 'Is the Coinbase Card available across the EU?', a: 'Yes, the Coinbase Card is available across the EU.' },
    ],
  },

  // ─── Bitpanda Card vs Revolut Metal ──────────────────────────────────────────
  'bitpanda-card-vs-revolut-metal': {
    fr_intro: `La Bitpanda Card et la Revolut Metal ciblent toutes deux les utilisateurs européens, mais avec des positionnements très différents. La Bitpanda Card est gratuite (0 €/an) et offre du cashback en BEST (token Bitpanda) sur les dépenses, sans staking. Elle est particulièrement populaire en Allemagne et en Autriche, marchés historiques de Bitpanda. La Revolut Metal (13,99 €/mois) est plus polyvalente : cashback crypto, assurance voyage, change multi-devises, disponible dans toute l'UE.`,
    fr_verdict: `Pour un utilisateur de Bitpanda en Allemagne ou en Autriche, la Bitpanda Card complète naturellement l'écosystème. Pour un produit bancaire complet avec une couche crypto, Revolut Metal est plus riche en fonctionnalités. Note : Revolut Metal 3,8/5 vs Bitpanda Card 3,5/5 pour la polyvalence.`,
    de_intro: `Die Bitpanda Card und die Revolut Metal richten sich beide an europäische Nutzer, aber mit sehr unterschiedlichen Positionierungen. Die Bitpanda Card ist kostenlos (0 €/Jahr) und bietet Cashback in BEST (Bitpanda-Token) auf Ausgaben ohne Staking. Sie ist besonders in Deutschland und Österreich, den historischen Märkten von Bitpanda, beliebt. Die Revolut Metal (13,99 €/Monat) ist vielseitiger: Krypto-Cashback, Reiseversicherung, Multi-Währungs-Wechsel, in der gesamten EU verfügbar.`,
    de_verdict: `Für Bitpanda-Nutzer in Deutschland oder Österreich ergänzt die Bitpanda Card das Ökosystem natürlich. Für ein vollständiges Bankprodukt mit Krypto-Ebene ist Revolut Metal funktionsreicher. Bewertung: Revolut Metal 3,8/5 vs. Bitpanda Card 3,5/5 für Vielseitigkeit.`,
    es_intro: `La Bitpanda Card y la Revolut Metal se dirigen ambas a usuarios europeos, pero con posicionamientos muy diferentes. La Bitpanda Card es gratuita (0 €/año) y ofrece cashback en BEST (token Bitpanda) en los gastos sin staking. Es especialmente popular en Alemania y Austria, mercados históricos de Bitpanda. La Revolut Metal (13,99 €/mes) es más versátil: cashback crypto, seguro de viaje, cambio multidivisa, disponible en toda la UE.`,
    es_verdict: `Para un usuario de Bitpanda en Alemania o Austria, la Bitpanda Card complementa naturalmente el ecosistema. Para un producto bancario completo con capa crypto, la Revolut Metal tiene más funciones. Puntuación: Revolut Metal 3,8/5 vs Bitpanda Card 3,5/5 para versatilidad.`,
    it_intro: `La Bitpanda Card e la Revolut Metal si rivolgono entrambe agli utenti europei, ma con posizionamenti molto diversi. La Bitpanda Card è gratuita (0 €/anno) e offre cashback in BEST (token Bitpanda) sulle spese senza staking. È particolarmente popolare in Germania e Austria, mercati storici di Bitpanda. La Revolut Metal (13,99 €/mese) è più versatile: cashback crypto, assicurazione viaggio, cambio multivaluta, disponibile in tutta l'UE.`,
    it_verdict: `Per un utente di Bitpanda in Germania o Austria, la Bitpanda Card si integra naturalmente nell'ecosistema. Per un prodotto bancario completo con livello crypto, la Revolut Metal è più ricca di funzionalità. Punteggio: Revolut Metal 3,8/5 vs Bitpanda Card 3,5/5 per versatilità.`,
    en_intro: `The Bitpanda Card and Revolut Metal both target European users, but with very different positioning. The Bitpanda Card is free (€0/year) and offers cashback in BEST (Bitpanda token) on spending with no staking. It's especially popular in Germany and Austria, Bitpanda's historic markets. Revolut Metal (€13.99/month) is more versatile: crypto cashback, travel insurance, multi-currency exchange, available across the EU.`,
    en_verdict: `For a Bitpanda user in Germany or Austria, the Bitpanda Card naturally complements the ecosystem. For a full-featured banking product with a crypto layer, Revolut Metal is richer in features. Score: Revolut Metal 3.8/5 vs Bitpanda Card 3.5/5 for versatility.`,
    faq: [
      { q: 'Bitpanda Card ou Revolut Metal : laquelle est disponible en Allemagne ?', a: 'Les deux. La Bitpanda Card est historiquement forte en Allemagne et en Autriche. Revolut Metal est disponible dans toute l\'UE, Allemagne incluse.' },
      { q: 'Le cashback en BEST de la Bitpanda Card est-il intéressant ?', a: 'BEST est le token natif de Bitpanda. Son intérêt dépend de votre conviction sur ce token. Si vous utilisez déjà l\'écosystème Bitpanda, le cashback en BEST est un bonus naturel.' },
      { q: 'Faut-il du staking pour la Bitpanda Card ?', a: 'Non. La Bitpanda Card ne requiert pas de staking pour bénéficier du cashback. C\'est un avantage par rapport aux cartes Crypto.com qui exigent souvent un dépôt de CRO.' },
    ],
    de_faq: [
      { q: 'Bitpanda Card oder Revolut Metal: Welche ist in Deutschland verfügbar?', a: 'Beide. Die Bitpanda Card ist historisch stark in Deutschland und Österreich. Revolut Metal ist in der gesamten EU einschließlich Deutschland verfügbar.' },
      { q: 'Ist das BEST-Cashback der Bitpanda Card attraktiv?', a: 'BEST ist Bitpandas nativer Token. Sein Wert hängt von Ihrer Überzeugung für diesen Token ab. Wenn Sie das Bitpanda-Ökosystem bereits nutzen, ist das BEST-Cashback ein natürlicher Bonus.' },
      { q: 'Ist Staking für die Bitpanda Card erforderlich?', a: 'Nein. Die Bitpanda Card erfordert kein Staking für das Cashback. Das ist ein Vorteil gegenüber Crypto.com-Karten, die oft eine CRO-Einlage verlangen.' },
    ],
    es_faq: [
      { q: 'Bitpanda Card o Revolut Metal: ¿cuál está disponible en Alemania?', a: 'Ambas. La Bitpanda Card es históricamente fuerte en Alemania y Austria. La Revolut Metal está disponible en toda la UE, incluida Alemania.' },
      { q: '¿El cashback en BEST de la Bitpanda Card es interesante?', a: 'BEST es el token nativo de Bitpanda. Su interés depende de tu convicción sobre ese token. Si ya usas el ecosistema Bitpanda, el cashback en BEST es un bonus natural.' },
      { q: '¿La Bitpanda Card requiere staking?', a: 'No. La Bitpanda Card no requiere staking para el cashback. Es una ventaja respecto a las tarjetas Crypto.com, que a menudo exigen un depósito de CRO.' },
    ],
    it_faq: [
      { q: 'Bitpanda Card o Revolut Metal: quale è disponibile in Germania?', a: 'Entrambe. La Bitpanda Card è storicamente forte in Germania e Austria. La Revolut Metal è disponibile in tutta l\'UE, Germania compresa.' },
      { q: 'Il cashback in BEST della Bitpanda Card è interessante?', a: 'BEST è il token nativo di Bitpanda. Il suo interesse dipende dalla fiducia in questo token. Se si usa già l\'ecosistema Bitpanda, il cashback in BEST è un bonus naturale.' },
      { q: 'La Bitpanda Card richiede staking?', a: 'No. La Bitpanda Card non richiede staking per il cashback. È un vantaggio rispetto alle carte Crypto.com, che spesso richiedono un deposito di CRO.' },
    ],
    en_faq: [
      { q: 'Bitpanda Card or Revolut Metal: which is available in Germany?', a: 'Both. The Bitpanda Card is historically strong in Germany and Austria. Revolut Metal is available across the EU, including Germany.' },
      { q: 'Is the Bitpanda Card\'s BEST cashback worthwhile?', a: 'BEST is Bitpanda\'s native token. Its value depends on your conviction about that token. If you already use the Bitpanda ecosystem, BEST cashback is a natural bonus.' },
      { q: 'Does the Bitpanda Card require staking?', a: 'No. The Bitpanda Card requires no staking for cashback. This is an advantage over Crypto.com cards, which often require a CRO deposit.' },
    ],
  },

  'binance-standard-vs-crypto-com-midnight-blue': {
    fr_intro: `La Binance Standard Card affronte ici la Crypto.com Midnight Blue, deux cartes entrée de gamme des plus grands exchanges. Toutes deux sont gratuites, sans staking requis, mais leurs modèles de récompenses divergent : la Binance Standard redistribue en BNB, tandis que la Midnight Blue offre 1% de cashback en CRO sans conditions. Si vous détenez déjà du BNB ou utilisez l'écosystème Binance, la Standard Card s'impose naturellement. Sinon, la Midnight Blue est plus neutre et accessible.`,
    fr_verdict: `Pour un débutant sans engagement dans un écosystème particulier, la Crypto.com Midnight Blue offre un cashback plus prévisible. Pour un utilisateur Binance, la Standard Card s'intègre mieux. Aucune des deux n'est un choix premium, mais elles restent les meilleures options gratuites sur leurs exchanges respectifs.`,
    de_intro: `Die Binance Standard Card trifft auf die Crypto.com Midnight Blue — zwei Einstiegskarten der größten Exchanges. Beide sind kostenlos, ohne Staking, aber mit unterschiedlichen Belohnungsmodellen: Binance Standard in BNB, Midnight Blue mit 1% CRO-Cashback. Für bestehende Binance-Nutzer ist die Standard Card die naheliegende Wahl.`,
    de_verdict: `Für Einsteiger ohne Ökosystem-Bindung bietet die Midnight Blue vorhersehbareres Cashback. Für Binance-Nutzer ist die Standard Card die bessere Wahl. Keine ist Premium, aber beide sind die besten kostenlosen Optionen ihrer jeweiligen Plattformen.`,
    es_intro: `La Binance Standard Card se enfrenta a la Crypto.com Midnight Blue, dos tarjetas de entrada de los mayores exchanges. Ambas son gratuitas, sin staking, pero con modelos de recompensas distintos: Binance en BNB, Midnight Blue con 1% cashback en CRO. Para usuarios de Binance, la Standard Card es la elección natural.`,
    es_verdict: `Para principiantes sin compromiso con un ecosistema, la Midnight Blue ofrece cashback más predecible. Para usuarios de Binance, la Standard Card encaja mejor. Ninguna es premium, pero son las mejores opciones gratuitas en sus plataformas.`,
    it_intro: `La Binance Standard Card affronta la Crypto.com Midnight Blue, due carte entry-level dei più grandi exchange. Entrambe gratuite, senza staking, ma con modelli di ricompense diversi: Binance in BNB, Midnight Blue con 1% cashback in CRO. Per gli utenti Binance, la Standard Card è la scelta naturale.`,
    it_verdict: `Per i principianti senza impegno in un ecosistema, la Midnight Blue offre un cashback più prevedibile. Per gli utenti Binance, la Standard Card si adatta meglio. Nessuna delle due è premium, ma sono le migliori opzioni gratuite sulle rispettive piattaforme.`,
    en_intro: `The Binance Standard Card faces the Crypto.com Midnight Blue — two entry-level cards from the largest exchanges. Both are free with no staking required, but their reward models differ: Binance Standard pays in BNB, while Midnight Blue offers 1% CRO cashback unconditionally. If you already hold BNB or use the Binance ecosystem, the Standard Card is the natural pick.`,
    en_verdict: `For beginners without ecosystem commitment, the Crypto.com Midnight Blue offers more predictable cashback. For Binance users, the Standard Card integrates better. Neither is premium, but both are the best free options on their respective platforms.`,
    faq: [
      { q: 'La Binance Standard Card est-elle disponible en Europe ?', a: 'Oui, la Binance Card est disponible dans la plupart des pays européens. Vérifiez la disponibilité dans votre pays sur le site Binance.' },
      { q: 'Faut-il staker du CRO pour la Crypto.com Midnight Blue ?', a: 'Non. La Midnight Blue est le seul niveau Crypto.com ne nécessitant aucun staking de CRO, ce qui la rend accessible immédiatement.' },
      { q: 'Quelle carte offre le meilleur cashback entre les deux ?', a: 'La Crypto.com Midnight Blue offre 1% fixe en CRO. La Binance Standard offre un cashback variable en BNB selon les transactions. Pour un cashback stable, la Midnight Blue est plus fiable.' },
    ],
    de_faq: [
      { q: 'Ist die Binance Standard Card in Europa verfügbar?', a: 'Ja, die Binance Card ist in den meisten europäischen Ländern verfügbar. Prüfen Sie die Verfügbarkeit in Ihrem Land auf der Binance-Website.' },
      { q: 'Muss man CRO für die Crypto.com Midnight Blue staken?', a: 'Nein. Die Midnight Blue ist das einzige Crypto.com-Level, das kein CRO-Staking erfordert, was sie sofort zugänglich macht.' },
      { q: 'Welche Karte bietet besseres Cashback?', a: 'Die Crypto.com Midnight Blue bietet feste 1% in CRO. Die Binance Standard bietet variables Cashback in BNB. Für stabiles Cashback ist die Midnight Blue zuverlässiger.' },
    ],
    es_faq: [
      { q: '¿La Binance Standard Card está disponible en Europa?', a: 'Sí, la Binance Card está disponible en la mayoría de países europeos. Verifica la disponibilidad en tu país en el sitio de Binance.' },
      { q: '¿Hay que hacer staking de CRO para la Midnight Blue?', a: 'No. La Midnight Blue es el único nivel de Crypto.com que no requiere staking de CRO, haciéndola accesible de inmediato.' },
      { q: '¿Cuál ofrece mejor cashback?', a: 'La Crypto.com Midnight Blue ofrece 1% fijo en CRO. La Binance Standard ofrece cashback variable en BNB. Para cashback estable, la Midnight Blue es más fiable.' },
    ],
    it_faq: [
      { q: 'La Binance Standard Card è disponibile in Europa?', a: 'Sì, la Binance Card è disponibile nella maggior parte dei paesi europei. Verifica la disponibilità nel tuo paese sul sito Binance.' },
      { q: 'Bisogna fare staking di CRO per la Crypto.com Midnight Blue?', a: 'No. La Midnight Blue è l\'unico livello Crypto.com che non richiede staking di CRO, rendendola immediatamente accessibile.' },
      { q: 'Quale carta offre il miglior cashback?', a: 'La Crypto.com Midnight Blue offre 1% fisso in CRO. La Binance Standard offre cashback variabile in BNB. Per un cashback stabile, la Midnight Blue è più affidabile.' },
    ],
    en_faq: [
      { q: 'Is the Binance Standard Card available in Europe?', a: 'Yes, the Binance Card is available in most European countries. Check availability in your country on the Binance website.' },
      { q: 'Do you need to stake CRO for the Crypto.com Midnight Blue?', a: 'No. The Midnight Blue is the only Crypto.com tier requiring no CRO staking, making it immediately accessible.' },
      { q: 'Which card offers better cashback?', a: 'The Crypto.com Midnight Blue offers a fixed 1% in CRO. The Binance Standard offers variable BNB cashback. For stable cashback, the Midnight Blue is more reliable.' },
    ],
  },

  'binance-standard-vs-nexo-card': {
    fr_intro: `Binance Standard Card contre Nexo Card : deux cartes crypto sans frais annuels, mais avec des philosophies très différentes. La Binance Standard récompense en BNB, dans l'écosystème Binance. La Nexo Card offre 2% de cashback en BTC ou NEXO, sans staking requis, avec un compte crypto comme collatéral. Pour le cashback pur, Nexo est supérieure. Pour les utilisateurs déjà dans l'écosystème Binance, la Standard Card est plus naturelle.`,
    fr_verdict: `La Nexo Card offre un cashback en BTC plus attractif et ne nécessite pas de staking. La Binance Standard est pertinente uniquement pour les utilisateurs actifs de l'exchange Binance. Pour la plupart des investisseurs crypto en Europe, Nexo est le meilleur choix entre les deux.`,
    de_intro: `Binance Standard Card gegen Nexo Card: zwei Krypto-Karten ohne Jahresgebühr, aber mit sehr unterschiedlichen Philosophien. Binance Standard belohnt in BNB; Nexo bietet 2% Cashback in BTC oder NEXO ohne Staking-Pflicht. Für reines Cashback ist Nexo überlegen.`,
    de_verdict: `Die Nexo Card bietet attraktiveres BTC-Cashback ohne Staking. Die Binance Standard ist nur für aktive Binance-Nutzer relevant. Für die meisten europäischen Krypto-Investoren ist Nexo die bessere Wahl.`,
    es_intro: `Binance Standard Card vs Nexo Card: dos tarjetas sin cuota anual, pero con filosofías muy diferentes. Binance Standard recompensa en BNB; Nexo ofrece 2% cashback en BTC o NEXO sin staking. Para cashback puro, Nexo es superior.`,
    es_verdict: `La Nexo Card ofrece cashback en BTC más atractivo sin staking. La Binance Standard solo es relevante para usuarios activos del exchange Binance. Para la mayoría de inversores crypto europeos, Nexo es la mejor elección.`,
    it_intro: `Binance Standard Card contro Nexo Card: due carte senza quota annua, ma con filosofie molto diverse. Binance Standard ricompensa in BNB; Nexo offre 2% cashback in BTC o NEXO senza staking. Per il cashback puro, Nexo è superiore.`,
    it_verdict: `La Nexo Card offre cashback in BTC più attraente senza staking. La Binance Standard è rilevante solo per gli utenti attivi dell\'exchange Binance. Per la maggior parte degli investitori crypto europei, Nexo è la scelta migliore.`,
    en_intro: `Binance Standard Card vs Nexo Card: two no-annual-fee crypto cards with very different philosophies. Binance Standard rewards in BNB within the Binance ecosystem; Nexo Card offers 2% cashback in BTC or NEXO with no staking required. For pure cashback, Nexo is superior.`,
    en_verdict: `The Nexo Card offers more attractive BTC cashback without staking. The Binance Standard is relevant only for active Binance exchange users. For most European crypto investors, Nexo is the better pick between the two.`,
    faq: [
      { q: 'La Nexo Card est-elle vraiment gratuite ?', a: 'Oui, la Nexo Card n\'a pas de frais annuels. Elle fonctionne avec des fonds crypto comme collatéral, mais sans obligation de bloquer du NEXO pour accéder au cashback de base.' },
      { q: 'Le cashback Binance Standard est-il intéressant ?', a: 'Il dépend entièrement du cours du BNB. Si le BNB se déprécie, votre cashback perd de la valeur. Nexo offre l\'option BTC, plus stable et universellement reconnue.' },
      { q: 'Peut-on avoir les deux cartes simultanément ?', a: 'Oui, techniquement. Mais il faut avoir des fonds sur les deux plateformes. Si vous devez choisir, Nexo est recommandée pour son cashback supérieur.' },
    ],
    de_faq: [
      { q: 'Ist die Nexo Card wirklich kostenlos?', a: 'Ja, die Nexo Card hat keine Jahresgebühr. Sie funktioniert mit Krypto-Sicherheiten, erfordert aber kein NEXO-Staking für das Basis-Cashback.' },
      { q: 'Ist das Cashback der Binance Standard attraktiv?', a: 'Es hängt vom BNB-Kurs ab. Wenn BNB fällt, verliert Ihr Cashback an Wert. Nexo bietet die BTC-Option, stabiler und universell anerkannt.' },
      { q: 'Kann man beide Karten gleichzeitig haben?', a: 'Ja, technisch gesehen. Aber Sie benötigen Mittel auf beiden Plattformen. Falls Sie wählen müssen, wird Nexo wegen des besseren Cashbacks empfohlen.' },
    ],
    es_faq: [
      { q: '¿La Nexo Card es realmente gratuita?', a: 'Sí, la Nexo Card no tiene cuota anual. Funciona con fondos crypto como garantía, pero sin obligación de bloquear NEXO para el cashback básico.' },
      { q: '¿Es interesante el cashback de la Binance Standard?', a: 'Depende del precio del BNB. Si el BNB baja, tu cashback pierde valor. Nexo ofrece la opción BTC, más estable y universalmente reconocida.' },
      { q: '¿Se pueden tener ambas tarjetas simultáneamente?', a: 'Sí, técnicamente. Pero hay que tener fondos en ambas plataformas. Si hay que elegir, Nexo es recomendada por su cashback superior.' },
    ],
    it_faq: [
      { q: 'La Nexo Card è davvero gratuita?', a: 'Sì, la Nexo Card non ha quota annua. Funziona con fondi crypto come garanzia, ma senza obbligo di bloccare NEXO per il cashback base.' },
      { q: 'Il cashback della Binance Standard è interessante?', a: 'Dipende dal prezzo del BNB. Se il BNB scende, il tuo cashback perde valore. Nexo offre l\'opzione BTC, più stabile e universalmente riconosciuta.' },
      { q: 'Si possono avere entrambe le carte contemporaneamente?', a: 'Sì, tecnicamente. Ma occorre avere fondi su entrambe le piattaforme. Se si deve scegliere, Nexo è consigliata per il cashback superiore.' },
    ],
    en_faq: [
      { q: 'Is the Nexo Card really free?', a: 'Yes, the Nexo Card has no annual fee. It works with crypto as collateral, but no NEXO staking is required to access basic cashback.' },
      { q: 'Is the Binance Standard cashback worthwhile?', a: 'It depends entirely on the BNB price. If BNB depreciates, your cashback loses value. Nexo offers the BTC option, which is more stable and universally recognized.' },
      { q: 'Can you have both cards simultaneously?', a: 'Yes, technically. But you need funds on both platforms. If you must choose, Nexo is recommended for its superior cashback.' },
    ],
  },

  'bitpanda-card-vs-crypto-com-midnight-blue': {
    fr_intro: `La Bitpanda Card affronte la Crypto.com Midnight Blue — deux cartes gratuites ciblant le marché européen. La Bitpanda Card est particulièrement forte en Autriche et Allemagne, avec un cashback en BEST token. La Midnight Blue offre 1% en CRO, accessible sans staking. Si vous utilisez déjà Bitpanda comme exchange principal, la Bitpanda Card est cohérente. Sinon, la Midnight Blue reste l'entrée de gamme Crypto.com la plus accessible.`,
    fr_verdict: `Pour les utilisateurs de l'écosystème Bitpanda (notamment DACH), la Bitpanda Card est le choix naturel. Pour les autres, la Midnight Blue offre un cashback en CRO plus neutre et universellement disponible en Europe.`,
    de_intro: `Die Bitpanda Card trifft auf die Crypto.com Midnight Blue — zwei kostenlose Karten für den europäischen Markt. Bitpanda ist besonders stark in Österreich und Deutschland, mit Cashback in BEST-Token. Die Midnight Blue bietet 1% in CRO ohne Staking. Für bestehende Bitpanda-Nutzer ist die Bitpanda Card die logische Wahl.`,
    de_verdict: `Für Bitpanda-Ökosystem-Nutzer (besonders DACH) ist die Bitpanda Card die natürliche Wahl. Für andere bietet die Midnight Blue neutraleres CRO-Cashback, das in ganz Europa verfügbar ist.`,
    es_intro: `La Bitpanda Card se enfrenta a la Crypto.com Midnight Blue — dos tarjetas gratuitas dirigidas al mercado europeo. Bitpanda es especialmente fuerte en Austria y Alemania, con cashback en token BEST. La Midnight Blue ofrece 1% en CRO sin staking. Para usuarios de Bitpanda, la Bitpanda Card es coherente.`,
    es_verdict: `Para usuarios del ecosistema Bitpanda (especialmente DACH), la Bitpanda Card es la elección natural. Para los demás, la Midnight Blue ofrece cashback en CRO más neutro y disponible en toda Europa.`,
    it_intro: `La Bitpanda Card affronta la Crypto.com Midnight Blue — due carte gratuite per il mercato europeo. Bitpanda è particolarmente forte in Austria e Germania, con cashback in token BEST. La Midnight Blue offre 1% in CRO senza staking. Per gli utenti Bitpanda, la Bitpanda Card è coerente.`,
    it_verdict: `Per gli utenti dell\'ecosistema Bitpanda (specialmente DACH), la Bitpanda Card è la scelta naturale. Per gli altri, la Midnight Blue offre cashback in CRO più neutro e disponibile in tutta Europa.`,
    en_intro: `The Bitpanda Card faces the Crypto.com Midnight Blue — two free cards targeting the European market. Bitpanda is particularly strong in Austria and Germany, with cashback in BEST token. The Midnight Blue offers 1% in CRO with no staking required. For existing Bitpanda users, the Bitpanda Card is the coherent choice.`,
    en_verdict: `For Bitpanda ecosystem users (especially DACH), the Bitpanda Card is the natural choice. For others, the Midnight Blue offers more neutral CRO cashback available across Europe.`,
    faq: [
      { q: 'La Bitpanda Card est-elle disponible hors de l\'Autriche ?', a: 'Oui, la Bitpanda Card est disponible dans de nombreux pays européens, notamment en Allemagne, France et Espagne. Vérifiez la disponibilité dans votre pays sur le site Bitpanda.' },
      { q: 'Quel cashback est le plus intéressant : BEST ou CRO ?', a: 'Les deux dépendent du cours du token. Le CRO est généralement plus liquide et mieux connu. Le BEST peut être plus attractif si vous croyez au projet Bitpanda.' },
      { q: 'Ces deux cartes nécessitent-elles du staking ?', a: 'Non. La Bitpanda Card et la Midnight Blue sont toutes deux accessibles sans staking, ce qui les rend idéales pour les débutants.' },
    ],
    de_faq: [
      { q: 'Ist die Bitpanda Card außerhalb Österreichs verfügbar?', a: 'Ja, die Bitpanda Card ist in vielen europäischen Ländern verfügbar, darunter Deutschland, Frankreich und Spanien.' },
      { q: 'Welches Cashback ist besser: BEST oder CRO?', a: 'Beide hängen vom Token-Kurs ab. CRO ist generell liquider und bekannter. BEST kann attraktiver sein, wenn Sie an das Bitpanda-Projekt glauben.' },
      { q: 'Erfordern beide Karten Staking?', a: 'Nein. Sowohl die Bitpanda Card als auch die Midnight Blue sind ohne Staking zugänglich, ideal für Einsteiger.' },
    ],
    es_faq: [
      { q: '¿La Bitpanda Card está disponible fuera de Austria?', a: 'Sí, la Bitpanda Card está disponible en muchos países europeos, incluyendo Alemania, Francia y España.' },
      { q: '¿Qué cashback es mejor: BEST o CRO?', a: 'Ambos dependen del precio del token. CRO es generalmente más líquido y conocido. BEST puede ser más atractivo si crees en el proyecto Bitpanda.' },
      { q: '¿Ambas tarjetas requieren staking?', a: 'No. Tanto la Bitpanda Card como la Midnight Blue son accesibles sin staking, ideales para principiantes.' },
    ],
    it_faq: [
      { q: 'La Bitpanda Card è disponibile fuori dall\'Austria?', a: 'Sì, la Bitpanda Card è disponibile in molti paesi europei, tra cui Germania, Francia e Spagna.' },
      { q: 'Quale cashback è migliore: BEST o CRO?', a: 'Entrambi dipendono dal prezzo del token. CRO è generalmente più liquido e conosciuto. BEST può essere più attraente se si crede nel progetto Bitpanda.' },
      { q: 'Entrambe le carte richiedono staking?', a: 'No. Sia la Bitpanda Card che la Midnight Blue sono accessibili senza staking, ideali per i principianti.' },
    ],
    en_faq: [
      { q: 'Is the Bitpanda Card available outside Austria?', a: 'Yes, the Bitpanda Card is available in many European countries, including Germany, France and Spain. Check availability on the Bitpanda website.' },
      { q: 'Which cashback is better: BEST or CRO?', a: 'Both depend on the token price. CRO is generally more liquid and widely known. BEST may be more attractive if you believe in the Bitpanda project.' },
      { q: 'Do both cards require staking?', a: 'No. Both the Bitpanda Card and the Midnight Blue are accessible without staking, making them ideal for beginners.' },
    ],
  },

  'bitpanda-card-vs-nexo-card': {
    fr_intro: `Bitpanda Card contre Nexo Card : deux alternatives sérieuses à Crypto.com pour les Européens. La Bitpanda Card offre un cashback en BEST token sur l'exchange autrichien. La Nexo Card propose 2% en BTC ou NEXO sans frais ni staking requis. Pour le cashback maximal et la flexibilité, Nexo prend l'avantage. Pour les utilisateurs déjà présents sur Bitpanda, la Bitpanda Card est plus cohérente.`,
    fr_verdict: `Si vous cherchez le meilleur cashback sans staking entre les deux, la Nexo Card gagne avec 2% en BTC. La Bitpanda Card est pertinente si vous utilisez déjà l'exchange et croyez au token BEST. Pour un investisseur crypto sans exchange de prédilection, Nexo est la recommandation.`,
    de_intro: `Bitpanda Card gegen Nexo Card: zwei ernsthafte europäische Alternativen zu Crypto.com. Bitpanda bietet Cashback in BEST-Token; Nexo bietet 2% in BTC oder NEXO ohne Staking. Für maximales Cashback und Flexibilität hat Nexo die Nase vorn.`,
    de_verdict: `Für das beste Cashback ohne Staking gewinnt die Nexo Card mit 2% in BTC. Die Bitpanda Card ist relevant, wenn Sie den Exchange bereits nutzen und an BEST glauben. Für Krypto-Investoren ohne bevorzugten Exchange ist Nexo die Empfehlung.`,
    es_intro: `Bitpanda Card vs Nexo Card: dos alternativas serias a Crypto.com para los europeos. Bitpanda ofrece cashback en token BEST; Nexo propone 2% en BTC o NEXO sin staking. Para el cashback máximo y la flexibilidad, Nexo tiene ventaja.`,
    es_verdict: `Si buscas el mejor cashback sin staking, la Nexo Card gana con 2% en BTC. La Bitpanda Card es relevante si ya usas el exchange y crees en el token BEST. Para inversores crypto sin exchange preferido, Nexo es la recomendación.`,
    it_intro: `Bitpanda Card contro Nexo Card: due alternative serie a Crypto.com per gli europei. Bitpanda offre cashback in token BEST; Nexo propone 2% in BTC o NEXO senza staking. Per il cashback massimo e la flessibilità, Nexo ha il vantaggio.`,
    it_verdict: `Per il miglior cashback senza staking, la Nexo Card vince con il 2% in BTC. La Bitpanda Card è rilevante se si usa già l\'exchange e si crede nel token BEST. Per gli investitori crypto senza exchange preferito, Nexo è la raccomandazione.`,
    en_intro: `Bitpanda Card vs Nexo Card: two serious European alternatives to Crypto.com. Bitpanda offers cashback in BEST token on the Austrian exchange; Nexo proposes 2% in BTC or NEXO with no fees or staking required. For maximum cashback and flexibility, Nexo holds the advantage.`,
    en_verdict: `For the best no-staking cashback between the two, the Nexo Card wins with 2% in BTC. The Bitpanda Card is relevant if you already use the exchange and believe in the BEST token. For crypto investors without a preferred exchange, Nexo is the recommendation.`,
    faq: [
      { q: 'La Bitpanda Card et la Nexo Card sont-elles disponibles en France ?', a: 'Oui, les deux cartes sont disponibles en France et dans l\'UE. Bitpanda est également présent dans de nombreux pays europé ens.' },
      { q: 'Nexo Card nécessite-t-elle d\'avoir des fonds sur la plateforme ?', a: 'Oui, la Nexo Card fonctionne avec vos crypto comme collatéral. Il faut déposer des actifs sur Nexo pour utiliser la carte, mais pas de staking de NEXO pour le cashback de base.' },
      { q: 'Laquelle convient mieux à un débutant ?', a: 'Les deux sont accessibles sans staking. La Nexo Card est légèrement plus simple et offre du cashback en BTC, plus universellement compris. La Bitpanda Card conviendra mieux aux utilisateurs de l\'exchange Bitpanda.' },
    ],
    de_faq: [
      { q: 'Sind die Bitpanda Card und die Nexo Card in Deutschland verfügbar?', a: 'Ja, beide Karten sind in Deutschland und der EU verfügbar. Bitpanda ist in Deutschland besonders präsent.' },
      { q: 'Erfordert die Nexo Card Mittel auf der Plattform?', a: 'Ja, die Nexo Card funktioniert mit Krypto als Sicherheit. Sie müssen Vermögenswerte auf Nexo einzahlen, aber kein NEXO staken für Basis-Cashback.' },
      { q: 'Welche eignet sich besser für Einsteiger?', a: 'Beide sind ohne Staking zugänglich. Die Nexo Card ist etwas einfacher und bietet BTC-Cashback. Die Bitpanda Card eignet sich besser für Exchange-Nutzer.' },
    ],
    es_faq: [
      { q: '¿La Bitpanda Card y la Nexo Card están disponibles en España?', a: 'Sí, ambas tarjetas están disponibles en España y la UE. Bitpanda tiene presencia en muchos países europeos.' },
      { q: '¿La Nexo Card requiere fondos en la plataforma?', a: 'Sí, la Nexo Card funciona con crypto como garantía. Debes depositar activos en Nexo, pero no hacer staking de NEXO para el cashback básico.' },
      { q: '¿Cuál es mejor para principiantes?', a: 'Ambas son accesibles sin staking. La Nexo Card es ligeramente más simple y ofrece cashback en BTC. La Bitpanda Card es mejor para usuarios del exchange Bitpanda.' },
    ],
    it_faq: [
      { q: 'La Bitpanda Card e la Nexo Card sono disponibili in Italia?', a: 'Sì, entrambe le carte sono disponibili in Italia e nell\'UE. Bitpanda è presente in molti paesi europei.' },
      { q: 'La Nexo Card richiede fondi sulla piattaforma?', a: 'Sì, la Nexo Card funziona con crypto come garanzia. Bisogna depositare asset su Nexo, ma non fare staking di NEXO per il cashback base.' },
      { q: 'Quale è meglio per i principianti?', a: 'Entrambe sono accessibili senza staking. La Nexo Card è leggermente più semplice e offre cashback in BTC. La Bitpanda Card è meglio per gli utenti dell\'exchange Bitpanda.' },
    ],
    en_faq: [
      { q: 'Are the Bitpanda Card and Nexo Card available in the UK?', a: 'The Nexo Card is available in the EU. Bitpanda availability varies — check the Bitpanda website for your country. Both are primarily EU-focused.' },
      { q: 'Does the Nexo Card require funds on the platform?', a: 'Yes, the Nexo Card works with crypto as collateral. You need to deposit assets on Nexo to use the card, but no NEXO staking is required for basic cashback.' },
      { q: 'Which is better for beginners?', a: 'Both are accessible without staking. The Nexo Card is slightly simpler and offers BTC cashback. The Bitpanda Card suits existing exchange users better.' },
    ],
  },

  'coinbase-card-vs-crypto-com-midnight-blue': {
    fr_intro: `Coinbase Card contre Crypto.com Midnight Blue : deux cartes gratuites et sans staking ciblant les investisseurs crypto débutants et intermédiaires. La Coinbase Card offre jusqu'à 4% de cashback en crypto au choix (BTC, ETH, XLM…). La Midnight Blue propose 1% fixe en CRO. Pour un cashback maximal, la Coinbase Card domine clairement. La Midnight Blue est plus simple mais moins généreuse.`,
    fr_verdict: `La Coinbase Card gagne sur le cashback (jusqu'à 4% vs 1%), la diversité des cryptos récompensées et la réputation de Coinbase, exchange coté en bourse. La Midnight Blue reste une entrée de gamme Crypto.com correcte, mais est en retrait face à Coinbase pour les utilisateurs non engagés dans l'écosystème CRO.`,
    de_intro: `Coinbase Card gegen Crypto.com Midnight Blue: zwei kostenlose Karten ohne Staking. Die Coinbase Card bietet bis zu 4% Cashback in Krypto der Wahl. Die Midnight Blue 1% fest in CRO. Für maximales Cashback dominiert die Coinbase Card klar.`,
    de_verdict: `Die Coinbase Card gewinnt beim Cashback (bis zu 4% vs 1%), der Vielfalt der Belohnungskryptos und dem Ruf von Coinbase als börsennotiertem Exchange. Die Midnight Blue ist ein solides Einstiegsangebot, aber unterlegen.`,
    es_intro: `Coinbase Card vs Crypto.com Midnight Blue: dos tarjetas gratuitas sin staking. La Coinbase Card ofrece hasta 4% cashback en crypto a elegir. La Midnight Blue 1% fijo en CRO. Para cashback máximo, la Coinbase Card domina claramente.`,
    es_verdict: `La Coinbase Card gana en cashback (hasta 4% vs 1%), diversidad de cryptos recompensadas y reputación de Coinbase como exchange cotizado en bolsa. La Midnight Blue es una entrada de gama correcta, pero inferior frente a Coinbase.`,
    it_intro: `Coinbase Card contro Crypto.com Midnight Blue: due carte gratuite senza staking. La Coinbase Card offre fino al 4% cashback in crypto a scelta. La Midnight Blue 1% fisso in CRO. Per il cashback massimo, la Coinbase Card domina chiaramente.`,
    it_verdict: `La Coinbase Card vince sul cashback (fino al 4% vs 1%), la diversità delle crypto premiate e la reputazione di Coinbase come exchange quotato. La Midnight Blue è un buon entry-level, ma inferiore rispetto a Coinbase.`,
    en_intro: `Coinbase Card vs Crypto.com Midnight Blue: two free cards with no staking targeting beginner and intermediate crypto investors. The Coinbase Card offers up to 4% cashback in your choice of crypto (BTC, ETH, XLM…). The Midnight Blue offers a flat 1% in CRO. For maximum cashback, the Coinbase Card clearly dominates.`,
    en_verdict: `The Coinbase Card wins on cashback (up to 4% vs 1%), the diversity of reward cryptos, and Coinbase's reputation as a publicly listed exchange. The Midnight Blue remains a decent Crypto.com entry-level card but falls short compared to Coinbase for users not committed to the CRO ecosystem.`,
    faq: [
      { q: 'La Coinbase Card est-elle disponible en Europe ?', a: 'Oui, la Coinbase Card est disponible dans de nombreux pays européens, dont la France, l\'Allemagne et l\'Espagne. Vérifiez les disponibilités sur coinbase.com.' },
      { q: 'Faut-il staker du CRO pour la Midnight Blue ?', a: 'Non. La Midnight Blue est le niveau d\'entrée Crypto.com, accessible sans staking de CRO. C\'est son principal avantage face aux autres niveaux de la gamme.' },
      { q: 'Peut-on choisir le BTC comme cashback sur la Coinbase Card ?', a: 'Oui, la Coinbase Card permet de choisir parmi plusieurs cryptos pour le cashback, dont le BTC et l\'ETH. C\'est un avantage majeur par rapport au cashback fixe en CRO de la Midnight Blue.' },
    ],
    de_faq: [
      { q: 'Ist die Coinbase Card in Europa verfügbar?', a: 'Ja, die Coinbase Card ist in vielen europäischen Ländern verfügbar, darunter Deutschland, Frankreich und Spanien.' },
      { q: 'Muss man CRO für die Midnight Blue staken?', a: 'Nein. Die Midnight Blue ist das Einstiegs-Level von Crypto.com, ohne CRO-Staking zugänglich. Das ist ihr Hauptvorteil.' },
      { q: 'Kann man BTC als Cashback auf der Coinbase Card wählen?', a: 'Ja, die Coinbase Card erlaubt die Wahl unter mehreren Kryptowährungen für Cashback, einschließlich BTC und ETH.' },
    ],
    es_faq: [
      { q: '¿La Coinbase Card está disponible en Europa?', a: 'Sí, la Coinbase Card está disponible en muchos países europeos, incluyendo Francia, Alemania y España.' },
      { q: '¿Hay que hacer staking de CRO para la Midnight Blue?', a: 'No. La Midnight Blue es el nivel de entrada de Crypto.com, accesible sin staking de CRO.' },
      { q: '¿Se puede elegir BTC como cashback en la Coinbase Card?', a: 'Sí, la Coinbase Card permite elegir entre varias criptomonedas para el cashback, incluyendo BTC y ETH.' },
    ],
    it_faq: [
      { q: 'La Coinbase Card è disponibile in Europa?', a: 'Sì, la Coinbase Card è disponibile in molti paesi europei, tra cui Francia, Germania e Spagna.' },
      { q: 'Bisogna fare staking di CRO per la Midnight Blue?', a: 'No. La Midnight Blue è il livello entry-level di Crypto.com, accessibile senza staking di CRO.' },
      { q: 'Si può scegliere BTC come cashback sulla Coinbase Card?', a: 'Sì, la Coinbase Card permette di scegliere tra diverse criptovalute per il cashback, tra cui BTC ed ETH.' },
    ],
    en_faq: [
      { q: 'Is the Coinbase Card available in Europe?', a: 'Yes, the Coinbase Card is available in many European countries including France, Germany and Spain. Check coinbase.com for availability.' },
      { q: 'Do you need to stake CRO for the Midnight Blue?', a: 'No. The Midnight Blue is Crypto.com\'s entry level, accessible without CRO staking. That is its main advantage over other tiers.' },
      { q: 'Can you choose BTC as cashback on the Coinbase Card?', a: 'Yes, the Coinbase Card lets you choose from several cryptocurrencies for cashback, including BTC and ETH — a major advantage over the Midnight Blue\'s fixed CRO cashback.' },
    ],
  },

  'crypto-com-midnight-blue-vs-kraken-krak-card': {
    fr_intro: `Crypto.com Midnight Blue face à la Kraken KRAK Card : deux cartes sans frais annuels issues d'exchanges bien établis. La Midnight Blue offre 1% de cashback en CRO. La KRAK Card de Kraken propose jusqu'à 4% de cashback en BTC sans staking requis, ce qui en fait l'une des offres cashback les plus attractives du marché. Si le cashback est votre priorité, la KRAK Card l'emporte largement.`,
    fr_verdict: `La Kraken KRAK Card est supérieure sur le cashback (4% BTC vs 1% CRO) sans staking. La Midnight Blue reste plus accessible si vous êtes déjà sur Crypto.com. Mais pour un investisseur cherchant la meilleure carte crypto gratuite, la KRAK Card est un choix difficile à battre en 2026.`,
    de_intro: `Crypto.com Midnight Blue gegen die Kraken KRAK Card: zwei kostenlose Karten etablierter Exchanges. Die Midnight Blue bietet 1% CRO-Cashback. Die KRAK Card bietet bis zu 4% BTC-Cashback ohne Staking — eine der attraktivsten Angebote am Markt. Beim Cashback gewinnt die KRAK Card klar.`,
    de_verdict: `Die Kraken KRAK Card ist beim Cashback überlegen (4% BTC vs 1% CRO) ohne Staking. Die Midnight Blue ist zugänglicher für bestehende Crypto.com-Nutzer. Für Investoren, die die beste kostenlose Krypto-Karte suchen, ist die KRAK Card 2026 schwer zu schlagen.`,
    es_intro: `Crypto.com Midnight Blue vs Kraken KRAK Card: dos tarjetas gratuitas de exchanges establecidos. La Midnight Blue ofrece 1% cashback en CRO. La KRAK Card ofrece hasta 4% cashback en BTC sin staking — una de las ofertas más atractivas del mercado. En cashback, la KRAK Card gana claramente.`,
    es_verdict: `La Kraken KRAK Card es superior en cashback (4% BTC vs 1% CRO) sin staking. La Midnight Blue es más accesible para usuarios de Crypto.com. Para inversores que buscan la mejor tarjeta crypto gratuita, la KRAK Card es difícil de superar en 2026.`,
    it_intro: `Crypto.com Midnight Blue vs Kraken KRAK Card: due carte gratuite di exchange affermati. La Midnight Blue offre 1% cashback in CRO. La KRAK Card offre fino al 4% cashback in BTC senza staking — una delle offerte più attraenti del mercato. Sul cashback, la KRAK Card vince chiaramente.`,
    it_verdict: `La Kraken KRAK Card è superiore sul cashback (4% BTC vs 1% CRO) senza staking. La Midnight Blue è più accessibile per gli utenti Crypto.com. Per gli investitori che cercano la migliore carta crypto gratuita, la KRAK Card è difficile da battere nel 2026.`,
    en_intro: `Crypto.com Midnight Blue vs Kraken KRAK Card: two no-annual-fee cards from well-established exchanges. The Midnight Blue offers 1% cashback in CRO. The Kraken KRAK Card offers up to 4% cashback in BTC with no staking required — making it one of the most attractive cashback offers on the market. On cashback alone, the KRAK Card wins clearly.`,
    en_verdict: `The Kraken KRAK Card is superior on cashback (4% BTC vs 1% CRO) without staking. The Midnight Blue remains more accessible if you're already on Crypto.com. But for investors seeking the best free crypto card in 2026, the KRAK Card is hard to beat.`,
    faq: [
      { q: 'La Kraken KRAK Card est-elle disponible en France ?', a: 'La KRAK Card de Kraken est disponible dans plusieurs pays européens. Vérifiez la disponibilité dans votre pays sur kraken.com, car le déploiement est progressif.' },
      { q: 'Faut-il staker du CRO pour la Midnight Blue ?', a: 'Non. La Midnight Blue ne nécessite aucun staking de CRO. C\'est le niveau d\'entrée le plus accessible de Crypto.com.' },
      { q: 'La KRAK Card est-elle vraiment sans frais annuels ?', a: 'Oui, la Kraken KRAK Card est proposée sans frais annuels. Son cashback de 4% en BTC sans staking en fait l\'une des meilleures offres de sa catégorie.' },
    ],
    de_faq: [
      { q: 'Ist die Kraken KRAK Card in Deutschland verfügbar?', a: 'Die KRAK Card ist in mehreren europäischen Ländern verfügbar. Überprüfen Sie die Verfügbarkeit auf kraken.com, da der Rollout schrittweise erfolgt.' },
      { q: 'Muss man CRO für die Midnight Blue staken?', a: 'Nein. Die Midnight Blue erfordert kein CRO-Staking. Es ist das zugänglichste Einstiegs-Level von Crypto.com.' },
      { q: 'Ist die KRAK Card wirklich ohne Jahresgebühr?', a: 'Ja, die Kraken KRAK Card hat keine Jahresgebühr. Ihr 4% BTC-Cashback ohne Staking macht sie zu einem der besten Angebote ihrer Kategorie.' },
    ],
    es_faq: [
      { q: '¿La Kraken KRAK Card está disponible en España?', a: 'La KRAK Card está disponible en varios países europeos. Verifica la disponibilidad en kraken.com, ya que el despliegue es progresivo.' },
      { q: '¿Hay que hacer staking de CRO para la Midnight Blue?', a: 'No. La Midnight Blue no requiere staking de CRO. Es el nivel de entrada más accesible de Crypto.com.' },
      { q: '¿La KRAK Card es realmente sin cuota anual?', a: 'Sí, la Kraken KRAK Card no tiene cuota anual. Su 4% cashback en BTC sin staking la hace una de las mejores ofertas de su categoría.' },
    ],
    it_faq: [
      { q: 'La Kraken KRAK Card è disponibile in Italia?', a: 'La KRAK Card è disponibile in diversi paesi europei. Verifica la disponibilità su kraken.com, poiché il lancio è progressivo.' },
      { q: 'Bisogna fare staking di CRO per la Midnight Blue?', a: 'No. La Midnight Blue non richiede staking di CRO. È il livello entry-level più accessibile di Crypto.com.' },
      { q: 'La KRAK Card è davvero senza quota annua?', a: 'Sì, la Kraken KRAK Card non ha quota annua. Il suo 4% cashback in BTC senza staking la rende una delle migliori offerte della categoria.' },
    ],
    en_faq: [
      { q: 'Is the Kraken KRAK Card available in Europe?', a: 'The KRAK Card is available in several European countries. Check kraken.com for availability in your country, as the rollout is gradual.' },
      { q: 'Does the Midnight Blue require CRO staking?', a: 'No. The Midnight Blue requires no CRO staking. It is Crypto.com\'s most accessible entry-level tier.' },
      { q: 'Is the KRAK Card truly free of annual fees?', a: 'Yes, the Kraken KRAK Card has no annual fee. Its 4% BTC cashback without staking makes it one of the best offers in its category.' },
    ],
  },

  // ─── Gnosis Pay vs Nexo Card ─────────────────────────────────────────────────
  'gnosis-pay-card-vs-nexo-card': {
    fr_intro: `Gnosis Pay et la Nexo Card représentent deux visions très différentes de la carte crypto : la première est entièrement on-chain (self-custody, blockchain Gnosis), quand la seconde repose sur un modèle traditionnel de garde confiée. Toutes deux offrent 2 % de cashback sans staking requis — mais en des tokens très différents : GNO pour Gnosis Pay, BTC ou NEXO pour la Nexo Card. La grande différence : Gnosis Pay intègre un IBAN européen (compte SEPA on-chain), ce qui en fait bien plus qu'une simple carte.`,
    fr_verdict: `Si vous privilégiez la souveraineté financière et l'intégration DeFi, Gnosis Pay est un choix unique en son genre : IBAN on-chain, 2 % en GNO, pas de garde tierce. Si vous voulez un cashback en BTC avec un écosystème plus établi (earn, prêts crypto), la Nexo Card reste difficile à battre. Note globale : Gnosis Pay 4,1/5 vs Nexo Card 4,2/5.`,
    de_intro: `Gnosis Pay und die Nexo Card vertreten zwei sehr unterschiedliche Ansätze: Erstere ist vollständig on-chain (Self-Custody, Gnosis-Blockchain), während die Nexo Card auf einem traditionellen Verwahrungs-Modell basiert. Beide bieten 2 % Cashback ohne Staking-Pflicht — aber in verschiedenen Token: GNO bei Gnosis Pay, BTC oder NEXO bei der Nexo Card. Der große Unterschied: Gnosis Pay integriert eine europäische IBAN (on-chain SEPA-Konto).`,
    de_verdict: `Wenn Sie finanzielle Souveränität und DeFi-Integration bevorzugen, ist Gnosis Pay einzigartig: On-Chain-IBAN, 2 % in GNO, keine Drittverwahrungs. Wer BTC-Cashback mit einem etablierteren Ökosystem (Earn, Krypto-Kredite) möchte, findet in der Nexo Card die bessere Wahl. Gesamtwertung: Gnosis Pay 4,1/5 vs. Nexo Card 4,2/5.`,
    es_intro: `Gnosis Pay y la Nexo Card representan dos visiones muy diferentes de la tarjeta crypto: la primera es completamente on-chain (autocustodia, blockchain Gnosis), mientras que la Nexo Card se basa en un modelo de custodia tradicional. Ambas ofrecen un 2 % de cashback sin staking requerido, pero en tokens muy distintos: GNO para Gnosis Pay, BTC o NEXO para la Nexo Card. La gran diferencia: Gnosis Pay integra un IBAN europeo on-chain.`,
    es_verdict: `Si priorizas la soberanía financiera y la integración DeFi, Gnosis Pay es única: IBAN on-chain, 2 % en GNO, sin custodia de terceros. Si quieres cashback en BTC con un ecosistema más consolidado (earn, préstamos crypto), la Nexo Card sigue siendo difícil de superar. Puntuación: Gnosis Pay 4,1/5 vs Nexo Card 4,2/5.`,
    it_intro: `Gnosis Pay e la Nexo Card rappresentano due visioni molto diverse della carta crypto: la prima è completamente on-chain (self-custody, blockchain Gnosis), mentre la Nexo Card si basa su un modello di custodia tradizionale. Entrambe offrono il 2 % di cashback senza staking richiesto, ma in token molto diversi: GNO per Gnosis Pay, BTC o NEXO per la Nexo Card. La grande differenza: Gnosis Pay integra un IBAN europeo on-chain.`,
    it_verdict: `Se si privilegia la sovranità finanziaria e l'integrazione DeFi, Gnosis Pay è unica: IBAN on-chain, 2 % in GNO, nessuna custodia di terzi. Chi vuole cashback in BTC con un ecosistema più consolidato (earn, prestiti crypto) troverà nella Nexo Card la scelta migliore. Punteggio: Gnosis Pay 4,1/5 vs Nexo Card 4,2/5.`,
    en_intro: `Gnosis Pay and the Nexo Card represent two very different visions of the crypto card: Gnosis Pay is fully on-chain (self-custody, Gnosis blockchain), while the Nexo Card uses a traditional custodial model. Both offer 2% cashback with no staking required — but in very different tokens: GNO for Gnosis Pay, BTC or NEXO for the Nexo Card. The key differentiator: Gnosis Pay integrates a European IBAN (on-chain SEPA account), making it much more than just a card.`,
    en_verdict: `If you prioritise financial sovereignty and DeFi integration, Gnosis Pay is in a class of its own: on-chain IBAN, 2% in GNO, no third-party custody. If you want BTC cashback with a more established ecosystem (earn, crypto loans), the Nexo Card remains hard to beat. Overall score: Gnosis Pay 4.1/5 vs Nexo Card 4.2/5.`,
    faq: [
      { q: 'Gnosis Pay ou Nexo Card : laquelle offre le meilleur cashback ?', a: 'Toutes deux offrent 2 % de cashback sans staking. Gnosis Pay le verse en GNO, la Nexo Card en BTC ou NEXO. Si vous préférez recevoir du Bitcoin, la Nexo Card est plus directe.' },
      { q: 'Gnosis Pay est-elle vraiment en self-custody ?', a: 'Oui. Gnosis Pay fonctionne via un smart contract wallet sur la blockchain Gnosis. Vous gardez le contrôle de vos clés privées, contrairement aux cartes custodiales classiques.' },
      { q: 'Qu\'est-ce que l\'IBAN on-chain de Gnosis Pay ?', a: 'Gnosis Pay intègre un IBAN européen directement lié à votre portefeuille on-chain. Vous pouvez recevoir des virements SEPA, convertir des euros en crypto et dépenser avec votre carte Mastercard, le tout sans intermédiaire bancaire traditionnel.' },
    ],
    de_faq: [
      { q: 'Gnosis Pay oder Nexo Card: Welche bietet das bessere Cashback?', a: 'Beide bieten 2 % Cashback ohne Staking. Gnosis Pay zahlt in GNO, die Nexo Card in BTC oder NEXO. Wer lieber Bitcoin erhält, ist mit der Nexo Card besser bedient.' },
      { q: 'Ist Gnosis Pay wirklich Self-Custody?', a: 'Ja. Gnosis Pay funktioniert über ein Smart-Contract-Wallet auf der Gnosis-Blockchain. Sie behalten die Kontrolle über Ihre privaten Schlüssel — anders als bei klassischen Custodial-Karten.' },
      { q: 'Was ist die On-Chain-IBAN von Gnosis Pay?', a: 'Gnosis Pay integriert eine europäische IBAN direkt in Ihr On-Chain-Wallet. Sie können SEPA-Überweisungen empfangen, Euro in Krypto umwandeln und mit Ihrer Mastercard bezahlen — alles ohne traditionellen Bankzwischenhändler.' },
    ],
    es_faq: [
      { q: 'Gnosis Pay o Nexo Card: ¿cuál ofrece el mejor cashback?', a: 'Ambas ofrecen un 2 % de cashback sin staking. Gnosis Pay lo paga en GNO, la Nexo Card en BTC o NEXO. Si prefieres recibir Bitcoin, la Nexo Card es más directa.' },
      { q: '¿Gnosis Pay es realmente self-custody?', a: 'Sí. Gnosis Pay funciona a través de un smart contract wallet en la blockchain Gnosis. Mantienes el control de tus claves privadas, a diferencia de las tarjetas custodiales clásicas.' },
      { q: '¿Qué es el IBAN on-chain de Gnosis Pay?', a: 'Gnosis Pay integra un IBAN europeo directamente vinculado a tu cartera on-chain. Puedes recibir transferencias SEPA, convertir euros en crypto y gastar con tu Mastercard, todo sin intermediario bancario tradicional.' },
    ],
    it_faq: [
      { q: 'Gnosis Pay o Nexo Card: quale offre il miglior cashback?', a: 'Entrambe offrono il 2 % di cashback senza staking. Gnosis Pay lo paga in GNO, la Nexo Card in BTC o NEXO. Se preferisci ricevere Bitcoin, la Nexo Card è più diretta.' },
      { q: 'Gnosis Pay è davvero self-custody?', a: 'Sì. Gnosis Pay funziona tramite un smart contract wallet sulla blockchain Gnosis. Mantieni il controllo delle tue chiavi private, a differenza delle carte custodiali classiche.' },
      { q: "Cos'è l'IBAN on-chain di Gnosis Pay?", a: "Gnosis Pay integra un IBAN europeo direttamente collegato al tuo wallet on-chain. Puoi ricevere bonifici SEPA, convertire euro in crypto e spendere con la tua Mastercard, il tutto senza intermediari bancari tradizionali." },
    ],
    en_faq: [
      { q: 'Gnosis Pay or Nexo Card: which has better cashback?', a: 'Both offer 2% cashback with no staking. Gnosis Pay pays in GNO, the Nexo Card in BTC or NEXO. If you prefer receiving Bitcoin, the Nexo Card is more straightforward.' },
      { q: 'Is Gnosis Pay truly self-custody?', a: 'Yes. Gnosis Pay runs via a smart contract wallet on the Gnosis blockchain. You retain control of your private keys — unlike traditional custodial cards.' },
      { q: "What is Gnosis Pay's on-chain IBAN?", a: 'Gnosis Pay integrates a European IBAN directly into your on-chain wallet. You can receive SEPA transfers, convert euros to crypto, and spend with your Mastercard — all without a traditional banking intermediary.' },
    ],
  },

  // ─── Gnosis Pay vs MetaMask Card ─────────────────────────────────────────────
  'gnosis-pay-card-vs-metamask-card': {
    fr_intro: `Gnosis Pay et la MetaMask Card sont les deux seules cartes crypto entièrement en self-custody disponibles en Europe en 2026. Gnosis Pay fonctionne sur la blockchain Gnosis avec un IBAN on-chain intégré et 2 % de cashback en GNO. La MetaMask Card repose sur le wallet MetaMask (Ethereum et multi-chain) avec un cashback en ETH ou en crypto via votre portefeuille. Les deux cartes ciblent les utilisateurs DeFi-native qui ne veulent pas confier leurs fonds à un tiers.`,
    fr_verdict: `Gnosis Pay est plus abouti côté paiements traditionnels (IBAN SEPA, virements reçus) et offre un cashback clair à 2 % en GNO. La MetaMask Card offre une intégration plus profonde avec l'écosystème Ethereum et multi-chain DeFi. Pour un usage quotidien avec des fonctionnalités bancaires, Gnosis Pay s'impose. Pour les utilisateurs hardcore DeFi sur Ethereum, la MetaMask Card est plus cohérente. Note : Gnosis Pay 4,1/5 vs MetaMask Card 3,9/5.`,
    de_intro: `Gnosis Pay und die MetaMask Card sind die beiden einzigen vollständig selbstverwalteten Krypto-Karten, die 2026 in Europa erhältlich sind. Gnosis Pay läuft auf der Gnosis-Blockchain mit integrierter On-Chain-IBAN und 2 % Cashback in GNO. Die MetaMask Card basiert auf dem MetaMask-Wallet (Ethereum und Multi-Chain) mit Cashback in ETH oder Krypto über Ihr Wallet.`,
    de_verdict: `Gnosis Pay ist bei traditionellen Zahlungsfunktionen ausgereifter (SEPA-IBAN, eingehende Überweisungen) und bietet klares 2 % GNO-Cashback. Die MetaMask Card bietet tiefere Integration mit dem Ethereum- und Multi-Chain-DeFi-Ökosystem. Für den Alltag mit Banking-Features ist Gnosis Pay führend. Für hardcore Ethereum-DeFi-Nutzer ist die MetaMask Card konsequenter. Wertung: Gnosis Pay 4,1/5 vs. MetaMask Card 3,9/5.`,
    es_intro: `Gnosis Pay y la MetaMask Card son las dos únicas tarjetas crypto completamente en autocustodia disponibles en Europa en 2026. Gnosis Pay funciona en la blockchain Gnosis con un IBAN on-chain integrado y un 2 % de cashback en GNO. La MetaMask Card se basa en el wallet MetaMask (Ethereum y multi-chain) con cashback en ETH o crypto a través de tu cartera.`,
    es_verdict: `Gnosis Pay está más desarrollada en pagos tradicionales (IBAN SEPA, transferencias recibidas) y ofrece un cashback claro del 2 % en GNO. La MetaMask Card ofrece una integración más profunda con el ecosistema DeFi de Ethereum y multi-chain. Para uso diario con funcionalidades bancarias, Gnosis Pay lidera. Para usuarios hardcore de DeFi en Ethereum, la MetaMask Card es más coherente. Puntuación: Gnosis Pay 4,1/5 vs MetaMask Card 3,9/5.`,
    it_intro: `Gnosis Pay e la MetaMask Card sono le uniche due carte crypto completamente in self-custody disponibili in Europa nel 2026. Gnosis Pay funziona sulla blockchain Gnosis con un IBAN on-chain integrato e il 2 % di cashback in GNO. La MetaMask Card si basa sul wallet MetaMask (Ethereum e multi-chain) con cashback in ETH o crypto tramite il tuo portafoglio.`,
    it_verdict: `Gnosis Pay è più matura sui pagamenti tradizionali (IBAN SEPA, bonifici in entrata) e offre un cashback chiaro del 2 % in GNO. La MetaMask Card offre un'integrazione più profonda con l'ecosistema DeFi di Ethereum e multi-chain. Per l'uso quotidiano con funzionalità bancarie, Gnosis Pay è in testa. Per gli utenti hardcore DeFi su Ethereum, la MetaMask Card è più coerente. Punteggio: Gnosis Pay 4,1/5 vs MetaMask Card 3,9/5.`,
    en_intro: `Gnosis Pay and the MetaMask Card are the only two fully self-custody crypto cards available in Europe in 2026. Gnosis Pay runs on the Gnosis blockchain with an integrated on-chain IBAN and 2% cashback in GNO. The MetaMask Card is built on the MetaMask wallet (Ethereum and multi-chain) with cashback in ETH or crypto directly to your wallet. Both target DeFi-native users who don't want to trust a third party with their funds.`,
    en_verdict: `Gnosis Pay is more mature on traditional payment features (SEPA IBAN, incoming bank transfers) and offers clear 2% GNO cashback. The MetaMask Card provides deeper integration with the Ethereum and multi-chain DeFi ecosystem. For everyday use with banking features, Gnosis Pay leads. For hardcore Ethereum DeFi users, the MetaMask Card is more coherent. Score: Gnosis Pay 4.1/5 vs MetaMask Card 3.9/5.`,
    faq: [
      { q: 'Gnosis Pay ou MetaMask Card : laquelle est la plus facile à utiliser au quotidien ?', a: 'Gnosis Pay est plus simple pour les paiements quotidiens grâce à son intégration IBAN et son app dédiée. La MetaMask Card nécessite une familiarité plus poussée avec les wallets Web3.' },
      { q: 'La MetaMask Card est-elle disponible en France ?', a: 'La MetaMask Card est disponible dans plusieurs pays européens via Mastercard. Vérifiez la disponibilité actuelle sur metamask.io, car le déploiement est progressif.' },
      { q: 'Les deux cartes sont-elles vraiment en self-custody ?', a: 'Oui. Gnosis Pay et la MetaMask Card fonctionnent toutes deux avec vos propres clés privées : vous gardez le contrôle de vos fonds à tout moment, sans intermédiaire custodial.' },
    ],
    de_faq: [
      { q: 'Gnosis Pay oder MetaMask Card: Welche ist im Alltag einfacher zu nutzen?', a: 'Gnosis Pay ist für tägliche Zahlungen einfacher dank IBAN-Integration und dedizierter App. Die MetaMask Card erfordert mehr Vertrautheit mit Web3-Wallets.' },
      { q: 'Ist die MetaMask Card in Deutschland verfügbar?', a: 'Die MetaMask Card ist in mehreren europäischen Ländern über Mastercard verfügbar. Überprüfen Sie die aktuelle Verfügbarkeit auf metamask.io, da der Rollout schrittweise erfolgt.' },
      { q: 'Sind beide Karten wirklich Self-Custody?', a: 'Ja. Gnosis Pay und die MetaMask Card funktionieren beide mit Ihren eigenen privaten Schlüsseln: Sie behalten jederzeit die Kontrolle über Ihre Mittel, ohne Custodial-Intermediär.' },
    ],
    es_faq: [
      { q: 'Gnosis Pay o MetaMask Card: ¿cuál es más fácil de usar en el día a día?', a: 'Gnosis Pay es más sencilla para pagos diarios gracias a su integración IBAN y app dedicada. La MetaMask Card requiere mayor familiaridad con los wallets Web3.' },
      { q: '¿La MetaMask Card está disponible en España?', a: 'La MetaMask Card está disponible en varios países europeos a través de Mastercard. Consulta la disponibilidad actual en metamask.io, ya que el despliegue es progresivo.' },
      { q: '¿Las dos tarjetas son realmente self-custody?', a: 'Sí. Gnosis Pay y la MetaMask Card funcionan con tus propias claves privadas: mantienes el control de tus fondos en todo momento, sin intermediario custodial.' },
    ],
    it_faq: [
      { q: 'Gnosis Pay o MetaMask Card: quale è più facile da usare quotidianamente?', a: 'Gnosis Pay è più semplice per i pagamenti quotidiani grazie alla sua integrazione IBAN e all\'app dedicata. La MetaMask Card richiede maggiore familiarità con i wallet Web3.' },
      { q: 'La MetaMask Card è disponibile in Italia?', a: 'La MetaMask Card è disponibile in diversi paesi europei tramite Mastercard. Verifica la disponibilità attuale su metamask.io, poiché il lancio è progressivo.' },
      { q: 'Le due carte sono davvero self-custody?', a: 'Sì. Gnosis Pay e la MetaMask Card funzionano entrambe con le tue chiavi private: mantieni il controllo dei tuoi fondi in ogni momento, senza intermediari custodiali.' },
    ],
    en_faq: [
      { q: 'Gnosis Pay or MetaMask Card: which is easier for everyday use?', a: 'Gnosis Pay is simpler for daily payments thanks to its IBAN integration and dedicated app. The MetaMask Card requires more familiarity with Web3 wallets.' },
      { q: 'Is the MetaMask Card available in Europe?', a: 'The MetaMask Card is available in several European countries via Mastercard. Check current availability at metamask.io, as the rollout is gradual.' },
      { q: 'Are both cards truly self-custody?', a: 'Yes. Both Gnosis Pay and the MetaMask Card run on your own private keys — you retain full control of your funds at all times, with no custodial intermediary.' },
    ],
  },

  // ─── Gnosis Pay vs Revolut Metal ─────────────────────────────────────────────
  'gnosis-pay-card-vs-revolut-metal': {
    fr_intro: `Gnosis Pay et Revolut Metal proposent toutes deux un IBAN européen et une carte Mastercard — mais leurs philosophies sont radicalement opposées. Revolut Metal est une néobanque traditionnelle centralisée (15 €/mois) avec un cashback de 1 % en crypto. Gnosis Pay est entièrement on-chain : self-custody, IBAN SEPA intégré à la blockchain Gnosis, et 2 % de cashback en GNO sans frais d'abonnement. Pour ceux qui veulent un seul compte qui combine crypto et banque, ces deux produits sont les candidats naturels à comparer en 2026.`,
    fr_verdict: `Pour l'utilisateur crypto-native qui veut garder le contrôle de ses fonds, Gnosis Pay s'impose : 0 € d'abonnement, 2 % de cashback en GNO, IBAN on-chain. Pour l'utilisateur qui veut l'écosystème complet Revolut (multi-devises, trading actions, assurance voyage) avec un peu de crypto, la Metal reste pertinente à 15 €/mois. Note : Gnosis Pay 4,1/5 vs Revolut Metal 3,9/5 sur le rapport qualité/prix global.`,
    de_intro: `Gnosis Pay und Revolut Metal bieten beide eine europäische IBAN und eine Mastercard — aber mit grundlegend verschiedenen Philosophien. Revolut Metal ist eine zentralisierte traditionelle Neobank (15 €/Monat) mit 1 % Krypto-Cashback. Gnosis Pay ist vollständig on-chain: Self-Custody, SEPA-IBAN direkt auf der Gnosis-Blockchain, und 2 % GNO-Cashback ohne Abonnementgebühr. Für alle, die ein einziges Konto für Krypto und Banking suchen, sind diese beiden Produkte die natürlichen Vergleichskandidaten 2026.`,
    de_verdict: `Für den Krypto-nativen Nutzer, der die Kontrolle über seine Gelder behalten will, setzt Gnosis Pay sich durch: 0 € Abo, 2 % Cashback in GNO, On-Chain-IBAN. Für den Nutzer, der das vollständige Revolut-Ökosystem möchte (Multiwährung, Aktienhandel, Reiseversicherung) mit etwas Krypto, bleibt die Metal bei 15 €/Monat relevant. Wertung: Gnosis Pay 4,1/5 vs. Revolut Metal 3,9/5.`,
    es_intro: `Gnosis Pay y Revolut Metal ofrecen ambas un IBAN europeo y una Mastercard, pero sus filosofías son radicalmente opuestas. Revolut Metal es una neobank centralizada tradicional (15 €/mes) con un 1 % de cashback en crypto. Gnosis Pay es completamente on-chain: autocustodia, IBAN SEPA integrado en la blockchain Gnosis, y un 2 % de cashback en GNO sin cuota de suscripción. Para quienes buscan una única cuenta que combine crypto y banca, estos dos productos son los candidatos naturales a comparar en 2026.`,
    es_verdict: `Para el usuario crypto-nativo que quiere mantener el control de sus fondos, Gnosis Pay se impone: 0 € de suscripción, 2 % de cashback en GNO, IBAN on-chain. Para el usuario que quiere el ecosistema completo de Revolut (multidivisa, trading de acciones, seguro de viaje) con algo de crypto, la Metal sigue siendo relevante a 15 €/mes. Puntuación: Gnosis Pay 4,1/5 vs Revolut Metal 3,9/5.`,
    it_intro: `Gnosis Pay e Revolut Metal offrono entrambe un IBAN europeo e una Mastercard, ma con filosofie radicalmente opposte. Revolut Metal è una neobank centralizzata tradizionale (15 €/mese) con cashback dell'1 % in crypto. Gnosis Pay è completamente on-chain: self-custody, IBAN SEPA integrato sulla blockchain Gnosis, e cashback del 2 % in GNO senza canone di abbonamento. Per chi cerca un unico conto che combini crypto e banca, questi due prodotti sono i candidati naturali al confronto nel 2026.`,
    it_verdict: `Per l'utente crypto-nativo che vuole mantenere il controllo dei propri fondi, Gnosis Pay si impone: 0 € di abbonamento, 2 % di cashback in GNO, IBAN on-chain. Per l'utente che vuole l'ecosistema completo Revolut (multivaluta, trading azionario, assicurazione viaggio) con un po' di crypto, la Metal rimane rilevante a 15 €/mese. Punteggio: Gnosis Pay 4,1/5 vs Revolut Metal 3,9/5.`,
    en_intro: `Gnosis Pay and Revolut Metal both offer a European IBAN and a Mastercard — but with radically different philosophies. Revolut Metal is a centralised traditional neobank (€15/month) with 1% crypto cashback. Gnosis Pay is fully on-chain: self-custody, SEPA IBAN built directly on the Gnosis blockchain, and 2% GNO cashback with no subscription fee. For users who want a single account combining crypto and banking, these two are the natural comparison in 2026.`,
    en_verdict: `For the crypto-native user who wants to retain control of their funds, Gnosis Pay wins: €0 subscription, 2% cashback in GNO, on-chain IBAN. For the user who wants the full Revolut ecosystem (multi-currency, stock trading, travel insurance) with some crypto exposure, the Metal remains relevant at €15/month. Score: Gnosis Pay 4.1/5 vs Revolut Metal 3.9/5.`,
    faq: [
      { q: 'Gnosis Pay vs Revolut Metal : laquelle a le meilleur rapport qualité/prix ?', a: 'Gnosis Pay est gratuite (0 €/an) avec 2 % de cashback en GNO. Revolut Metal coûte 180 €/an pour 1 % de cashback en crypto. Sur le seul critère cashback, Gnosis Pay est nettement plus rentable.' },
      { q: 'Gnosis Pay a-t-elle un vrai IBAN comme Revolut ?', a: 'Oui. Gnosis Pay propose un IBAN européen fonctionnel pour les virements SEPA entrants. La différence : il est on-chain, ce qui signifie que vos fonds restent dans votre wallet crypto plutôt que chez un dépositaire.' },
      { q: 'Peut-on utiliser les deux cartes ensemble ?', a: 'Oui, beaucoup d\'utilisateurs combinent Revolut (pour la gestion multi-devises et les fonctions bancaires classiques) et Gnosis Pay (pour le cashback crypto et la DeFi). Les deux sont complémentaires.' },
    ],
    de_faq: [
      { q: 'Gnosis Pay vs. Revolut Metal: Welche bietet das beste Preis-Leistungs-Verhältnis?', a: 'Gnosis Pay ist kostenlos (0 €/Jahr) mit 2 % GNO-Cashback. Revolut Metal kostet 180 €/Jahr für 1 % Krypto-Cashback. Beim reinen Cashback-Kriterium ist Gnosis Pay deutlich rentabler.' },
      { q: 'Hat Gnosis Pay eine echte IBAN wie Revolut?', a: 'Ja. Gnosis Pay bietet eine funktionale europäische IBAN für eingehende SEPA-Überweisungen. Der Unterschied: Sie ist on-chain, was bedeutet, dass Ihre Gelder in Ihrem Krypto-Wallet verbleiben.' },
      { q: 'Kann man beide Karten gleichzeitig nutzen?', a: 'Ja, viele Nutzer kombinieren Revolut (für Multiwährungs-Management) und Gnosis Pay (für Krypto-Cashback und DeFi). Beide ergänzen sich gut.' },
    ],
    es_faq: [
      { q: 'Gnosis Pay vs Revolut Metal: ¿cuál ofrece mejor relación calidad-precio?', a: 'Gnosis Pay es gratuita (0 €/año) con un 2 % de cashback en GNO. Revolut Metal cuesta 180 €/año para un 1 % de cashback en crypto. Solo en el criterio de cashback, Gnosis Pay es claramente más rentable.' },
      { q: '¿Gnosis Pay tiene un IBAN real como Revolut?', a: 'Sí. Gnosis Pay ofrece un IBAN europeo funcional para transferencias SEPA entrantes. La diferencia: es on-chain, lo que significa que tus fondos permanecen en tu wallet crypto.' },
      { q: '¿Se pueden usar las dos tarjetas juntas?', a: 'Sí, muchos usuarios combinan Revolut (para gestión multidivisa) y Gnosis Pay (para cashback crypto y DeFi). Son complementarias.' },
    ],
    it_faq: [
      { q: 'Gnosis Pay vs Revolut Metal: quale offre il miglior rapporto qualità-prezzo?', a: 'Gnosis Pay è gratuita (0 €/anno) con il 2 % di cashback in GNO. Revolut Metal costa 180 €/anno per l\'1 % di cashback in crypto. Solo sul criterio cashback, Gnosis Pay è nettamente più conveniente.' },
      { q: 'Gnosis Pay ha un IBAN reale come Revolut?', a: 'Sì. Gnosis Pay offre un IBAN europeo funzionale per i bonifici SEPA in entrata. La differenza: è on-chain, il che significa che i tuoi fondi rimangono nel tuo wallet crypto.' },
      { q: 'Si possono usare entrambe le carte insieme?', a: 'Sì, molti utenti combinano Revolut (per la gestione multivaluta) e Gnosis Pay (per il cashback crypto e la DeFi). Sono complementari.' },
    ],
    en_faq: [
      { q: 'Gnosis Pay vs Revolut Metal: which offers better value?', a: 'Gnosis Pay is free (€0/year) with 2% cashback in GNO. Revolut Metal costs €180/year for 1% crypto cashback. On the cashback criterion alone, Gnosis Pay is clearly more profitable.' },
      { q: 'Does Gnosis Pay have a real IBAN like Revolut?', a: 'Yes. Gnosis Pay provides a functional European IBAN for incoming SEPA transfers. The difference: it is on-chain, meaning your funds remain in your crypto wallet rather than with a custodian.' },
      { q: 'Can you use both cards at the same time?', a: 'Yes, many users combine Revolut (for multi-currency management and traditional banking features) and Gnosis Pay (for crypto cashback and DeFi). They complement each other well.' },
    ],
  },

  // ─── MetaMask Card vs Nexo Card ──────────────────────────────────────────────
  'metamask-card-vs-nexo-card': {
    fr_intro: `MetaMask Card et Nexo Card sont toutes deux des cartes sans staking, sans frais annuels, et offrant du cashback crypto — mais sur des modèles diamétralement opposés. MetaMask Card est en self-custody : votre wallet Ethereum reste le vôtre, le cashback est versé en ETH ou en stablecoin directement on-chain. La Nexo Card est custodiale : Nexo gère vos fonds, le cashback est versé en BTC (jusqu'à 2 %) ou en NEXO. L'une est pour les puristes DeFi, l'autre pour ceux qui veulent la simplicité avec un cashback fiable en Bitcoin.`,
    fr_verdict: `Si vous êtes développeur ou utilisateur avancé DeFi sur Ethereum, la MetaMask Card est la plus cohérente : vos fonds restent dans votre wallet, votre cashback s'accumule on-chain. Pour l'utilisateur qui veut 2 % de cashback garanti en BTC avec une interface simple, la Nexo Card est le choix le plus mature. Note : Nexo Card 4,2/5 vs MetaMask Card 3,9/5.`,
    de_intro: `MetaMask Card und Nexo Card sind beide Karten ohne Staking, ohne Jahresgebühr und mit Krypto-Cashback — aber auf grundlegend entgegengesetzten Modellen. MetaMask Card ist Self-Custody: Ihr Ethereum-Wallet bleibt Ihres, Cashback wird in ETH oder Stablecoin direkt on-chain ausgezahlt. Die Nexo Card ist Custodial: Nexo verwaltet Ihre Gelder, Cashback wird in BTC (bis zu 2 %) oder NEXO ausgezahlt.`,
    de_verdict: `Wenn Sie DeFi-Entwickler oder fortgeschrittener Ethereum-Nutzer sind, ist die MetaMask Card am konsequentesten: Ihre Gelder bleiben in Ihrem Wallet, Cashback akkumuliert sich on-chain. Für Nutzer, die 2 % garantierten BTC-Cashback mit einfacher Bedienung wünschen, ist die Nexo Card die ausgereiftere Wahl. Wertung: Nexo Card 4,2/5 vs. MetaMask Card 3,9/5.`,
    es_intro: `MetaMask Card y Nexo Card son ambas tarjetas sin staking, sin cuota anual y con cashback crypto, pero en modelos diametralmente opuestos. MetaMask Card es self-custody: tu wallet Ethereum sigue siendo tuyo, el cashback se paga en ETH o stablecoin directamente on-chain. La Nexo Card es custodial: Nexo gestiona tus fondos, el cashback se paga en BTC (hasta un 2 %) o en NEXO.`,
    es_verdict: `Si eres desarrollador o usuario avanzado de DeFi en Ethereum, la MetaMask Card es la más coherente: tus fondos permanecen en tu wallet, el cashback se acumula on-chain. Para el usuario que quiere un 2 % de cashback garantizado en BTC con una interfaz sencilla, la Nexo Card es la elección más madura. Puntuación: Nexo Card 4,2/5 vs MetaMask Card 3,9/5.`,
    it_intro: `MetaMask Card e Nexo Card sono entrambe carte senza staking, senza costi annuali e con cashback crypto, ma su modelli diametralmente opposti. MetaMask Card è in self-custody: il tuo wallet Ethereum rimane tuo, il cashback viene erogato in ETH o stablecoin direttamente on-chain. La Nexo Card è custodiale: Nexo gestisce i tuoi fondi, il cashback viene erogato in BTC (fino al 2 %) o in NEXO.`,
    it_verdict: `Se sei uno sviluppatore o utente avanzato DeFi su Ethereum, la MetaMask Card è la più coerente: i tuoi fondi rimangono nel tuo wallet, il cashback si accumula on-chain. Per l'utente che vuole il 2 % di cashback garantito in BTC con un'interfaccia semplice, la Nexo Card è la scelta più matura. Punteggio: Nexo Card 4,2/5 vs MetaMask Card 3,9/5.`,
    en_intro: `MetaMask Card and Nexo Card are both no-staking, no-annual-fee cards with crypto cashback — but on diametrically opposite models. MetaMask Card is self-custody: your Ethereum wallet stays yours, cashback is paid in ETH or stablecoin directly on-chain. The Nexo Card is custodial: Nexo manages your funds, cashback is paid in BTC (up to 2%) or NEXO. One is for DeFi purists, the other for users who want simplicity with reliable Bitcoin cashback.`,
    en_verdict: `If you're a developer or advanced DeFi user on Ethereum, the MetaMask Card is the most coherent choice: your funds stay in your wallet, cashback accumulates on-chain. For the user who wants guaranteed 2% BTC cashback with a simple interface, the Nexo Card is the more mature product. Score: Nexo Card 4.2/5 vs MetaMask Card 3.9/5.`,
    faq: [
      { q: 'MetaMask Card ou Nexo Card : laquelle est la plus sûre ?', a: 'La MetaMask Card, en self-custody, vous donne le contrôle total de vos clés privées. La Nexo Card est custodiale mais Nexo est régulé dans plusieurs pays de l\'UE et a une forte réputation de liquidité. "Pas vos clés, pas vos cryptos" avantage MetaMask ; pour la facilité et le cashback en BTC, Nexo est plus fiable pour la plupart des utilisateurs.' },
      { q: 'La MetaMask Card propose-t-elle un cashback en ETH ?', a: 'Oui. La MetaMask Card propose un cashback en ETH ou en stablecoin selon le mode choisi. Le cashback est crédité directement dans votre wallet MetaMask, on-chain.' },
      { q: 'Faut-il du staking pour les deux cartes ?', a: 'Non. Ni la MetaMask Card ni la Nexo Card n\'exigent de staking pour obtenir leur cashback de base. C\'est l\'un de leurs principaux avantages communs.' },
    ],
    de_faq: [
      { q: 'MetaMask Card oder Nexo Card: Welche ist sicherer?', a: 'Die MetaMask Card (Self-Custody) gibt Ihnen volle Kontrolle über Ihre privaten Schlüssel. Die Nexo Card ist Custodial, aber Nexo ist in mehreren EU-Ländern reguliert. "Nicht Ihre Schlüssel, nicht Ihre Krypto" begünstigt MetaMask; für Einfachheit und BTC-Cashback ist Nexo für die meisten Nutzer die zuverlässigere Wahl.' },
      { q: 'Bietet die MetaMask Card ETH-Cashback?', a: 'Ja. Die MetaMask Card bietet Cashback in ETH oder Stablecoin je nach gewähltem Modus. Cashback wird direkt in Ihr MetaMask-Wallet gutgeschrieben, on-chain.' },
      { q: 'Ist Staking für beide Karten erforderlich?', a: 'Nein. Weder die MetaMask Card noch die Nexo Card verlangen Staking für ihren Basis-Cashback. Das ist einer ihrer gemeinsamen Hauptvorteile.' },
    ],
    es_faq: [
      { q: 'MetaMask Card o Nexo Card: ¿cuál es más segura?', a: 'La MetaMask Card (self-custody) te da control total sobre tus claves privadas. La Nexo Card es custodial, pero Nexo está regulada en varios países de la UE. "Sin tus claves, sin tus cryptos" favorece a MetaMask; para simplicidad y cashback en BTC, Nexo es más fiable para la mayoría.' },
      { q: '¿La MetaMask Card ofrece cashback en ETH?', a: 'Sí. La MetaMask Card ofrece cashback en ETH o stablecoin según el modo elegido. El cashback se acredita directamente en tu wallet MetaMask, on-chain.' },
      { q: '¿Se necesita staking para las dos tarjetas?', a: 'No. Ni la MetaMask Card ni la Nexo Card exigen staking para su cashback base. Es una de sus principales ventajas comunes.' },
    ],
    it_faq: [
      { q: 'MetaMask Card o Nexo Card: quale è più sicura?', a: 'La MetaMask Card (self-custody) ti dà il controllo totale sulle tue chiavi private. La Nexo Card è custodiale ma Nexo è regolamentata in diversi paesi UE. "Non le tue chiavi, non le tue crypto" avvantaggia MetaMask; per semplicità e cashback in BTC, Nexo è più affidabile per la maggior parte degli utenti.' },
      { q: 'La MetaMask Card offre cashback in ETH?', a: 'Sì. La MetaMask Card offre cashback in ETH o stablecoin in base alla modalità scelta. Il cashback viene accreditato direttamente nel tuo wallet MetaMask, on-chain.' },
      { q: 'È necessario lo staking per entrambe le carte?', a: 'No. Né la MetaMask Card né la Nexo Card richiedono staking per il loro cashback base. È uno dei loro principali vantaggi comuni.' },
    ],
    en_faq: [
      { q: 'MetaMask Card or Nexo Card: which is safer?', a: 'The MetaMask Card (self-custody) gives you full control over your private keys. The Nexo Card is custodial but Nexo is regulated in several EU countries. "Not your keys, not your crypto" favours MetaMask; for simplicity and BTC cashback, Nexo is the more reliable choice for most users.' },
      { q: 'Does MetaMask Card offer ETH cashback?', a: 'Yes. MetaMask Card offers cashback in ETH or stablecoin depending on the mode selected. Cashback is credited directly to your MetaMask wallet, on-chain.' },
      { q: 'Is staking required for either card?', a: 'No. Neither MetaMask Card nor Nexo Card requires staking for their base cashback. This is one of their key shared advantages over premium staking-based cards.' },
    ],
  },

  // ─── MetaMask Card vs Revolut Metal ──────────────────────────────────────────
  'metamask-card-vs-revolut-metal': {
    fr_intro: `MetaMask Card et Revolut Metal incarnent deux visions opposées de la carte de paiement moderne. Revolut Metal est une néobanque premium (15 €/mois) avec une offre complète : multi-devises, trading d'actions, assurance voyage, et 1 % de cashback en crypto. MetaMask Card est une carte Web3 en self-custody : aucun frais d'abonnement, cashback en ETH on-chain, et aucun intermédiaire bancaire. Pour les utilisateurs qui ont déjà MetaMask, la transition est naturelle. Pour les autres, Revolut Metal offre un écosystème plus familier.`,
    fr_verdict: `Si vous utilisez Revolut comme banque principale et voulez juste ajouter un peu de crypto, la Metal s'impose. Si vous êtes un utilisateur Ethereum actif qui veut une carte directement connectée à votre wallet sans intermédiaire, la MetaMask Card est plus cohérente — et gratuite. Note : Revolut Metal 3,9/5 vs MetaMask Card 3,9/5 (profils très différents).`,
    de_intro: `MetaMask Card und Revolut Metal verkörpern zwei gegensätzliche Visionen der modernen Zahlungskarte. Revolut Metal ist eine Premium-Neobank (15 €/Monat) mit vollständigem Angebot: Multi-Währung, Aktienhandel, Reiseversicherung und 1 % Krypto-Cashback. MetaMask Card ist eine Web3-Karte in Self-Custody: keine Abonnementgebühr, ETH-Cashback on-chain, kein Bankzwischenhändler.`,
    de_verdict: `Wer Revolut als Hauptbank nutzt und nur etwas Krypto hinzufügen möchte, sollte zur Metal greifen. Für aktive Ethereum-Nutzer, die eine Karte direkt an ihr Wallet ohne Intermediär wollen, ist die MetaMask Card kohärenter — und kostenlos. Wertung: Revolut Metal 3,9/5 vs. MetaMask Card 3,9/5 (sehr unterschiedliche Profile).`,
    es_intro: `MetaMask Card y Revolut Metal encarnan dos visiones opuestas de la tarjeta de pago moderna. Revolut Metal es una neobank premium (15 €/mes) con oferta completa: multidivisa, trading de acciones, seguro de viaje y 1 % de cashback en crypto. MetaMask Card es una tarjeta Web3 en autocustodia: sin cuota de suscripción, cashback en ETH on-chain, sin intermediario bancario.`,
    es_verdict: `Si usas Revolut como banco principal y solo quieres añadir algo de crypto, la Metal es la opción. Si eres usuario activo de Ethereum y quieres una tarjeta conectada directamente a tu wallet sin intermediarios, la MetaMask Card es más coherente — y gratuita. Puntuación: Revolut Metal 3,9/5 vs MetaMask Card 3,9/5 (perfiles muy diferentes).`,
    it_intro: `MetaMask Card e Revolut Metal incarnano due visioni opposte della carta di pagamento moderna. Revolut Metal è una neobank premium (15 €/mese) con un'offerta completa: multivaluta, trading azionario, assicurazione viaggio e cashback dell'1 % in crypto. MetaMask Card è una carta Web3 in self-custody: nessuna quota di abbonamento, cashback in ETH on-chain, nessun intermediario bancario.`,
    it_verdict: `Se usi Revolut come banca principale e vuoi solo aggiungere un po' di crypto, la Metal si impone. Se sei un utente Ethereum attivo che vuole una carta direttamente connessa al tuo wallet senza intermediari, la MetaMask Card è più coerente — e gratuita. Punteggio: Revolut Metal 3,9/5 vs MetaMask Card 3,9/5 (profili molto diversi).`,
    en_intro: `MetaMask Card and Revolut Metal represent two opposing visions of the modern payment card. Revolut Metal is a premium neobank (€15/month) with a complete offering: multi-currency, stock trading, travel insurance, and 1% crypto cashback. MetaMask Card is a self-custody Web3 card: no subscription fee, ETH cashback on-chain, and no banking intermediary. For existing MetaMask users, the transition is natural. For others, Revolut Metal offers a more familiar ecosystem.`,
    en_verdict: `If you use Revolut as your main bank and just want to add some crypto exposure, the Metal is the natural choice. If you're an active Ethereum user who wants a card connected directly to your wallet without any intermediary, the MetaMask Card is more coherent — and free. Score: Revolut Metal 3.9/5 vs MetaMask Card 3.9/5 (very different target profiles).`,
    faq: [
      { q: 'MetaMask Card est-elle disponible en Europe comme Revolut ?', a: 'La MetaMask Card est disponible dans plusieurs pays européens via Mastercard, avec un déploiement progressif. Revolut est disponible dans toute l\'UE. Vérifiez la disponibilité actuelle sur metamask.io.' },
      { q: 'La MetaMask Card peut-elle remplacer Revolut comme compte principal ?', a: 'Non. MetaMask Card n\'a pas d\'IBAN natif ni de gestion multi-devises comme Revolut. C\'est une carte de dépenses liée à votre wallet crypto Ethereum, pas un substitut complet à un compte bancaire.' },
      { q: 'Laquelle est gratuite entre MetaMask Card et Revolut Metal ?', a: 'MetaMask Card est gratuite (0 €/an). Revolut Metal coûte 180 €/an (15 €/mois). Revolut propose un plan gratuit avec fonctions limitées, mais sans accès aux fonctions Metal.' },
    ],
    de_faq: [
      { q: 'Ist die MetaMask Card in Europa wie Revolut verfügbar?', a: 'Die MetaMask Card ist in mehreren europäischen Ländern über Mastercard verfügbar, mit schrittweisem Rollout. Revolut ist in der gesamten EU verfügbar. Aktuelle Verfügbarkeit auf metamask.io prüfen.' },
      { q: 'Kann die MetaMask Card Revolut als Hauptkonto ersetzen?', a: 'Nein. MetaMask Card hat keine native IBAN oder Multiwährungs-Verwaltung wie Revolut. Es ist eine Ausgabenkarte, die mit Ihrem Ethereum-Krypto-Wallet verknüpft ist, kein vollständiger Bankkontoersatz.' },
      { q: 'Welche ist kostenlos — MetaMask Card oder Revolut Metal?', a: 'MetaMask Card ist kostenlos (0 €/Jahr). Revolut Metal kostet 180 €/Jahr (15 €/Monat). Revolut bietet einen kostenlosen Plan mit eingeschränkten Funktionen, aber ohne Zugang zu Metal-Features.' },
    ],
    es_faq: [
      { q: '¿La MetaMask Card está disponible en Europa como Revolut?', a: 'La MetaMask Card está disponible en varios países europeos a través de Mastercard, con despliegue progresivo. Revolut está disponible en toda la UE. Verifica la disponibilidad actual en metamask.io.' },
      { q: '¿Puede la MetaMask Card reemplazar a Revolut como cuenta principal?', a: 'No. MetaMask Card no tiene IBAN nativo ni gestión multidivisa como Revolut. Es una tarjeta de gastos vinculada a tu wallet crypto Ethereum, no un sustituto completo de una cuenta bancaria.' },
      { q: '¿Cuál es gratuita entre MetaMask Card y Revolut Metal?', a: 'MetaMask Card es gratuita (0 €/año). Revolut Metal cuesta 180 €/año (15 €/mes). Revolut ofrece un plan gratuito con funciones limitadas, pero sin acceso a las funciones Metal.' },
    ],
    it_faq: [
      { q: 'La MetaMask Card è disponibile in Europa come Revolut?', a: 'La MetaMask Card è disponibile in diversi paesi europei tramite Mastercard, con lancio progressivo. Revolut è disponibile in tutta la UE. Verifica la disponibilità attuale su metamask.io.' },
      { q: 'La MetaMask Card può sostituire Revolut come conto principale?', a: 'No. MetaMask Card non ha IBAN nativo né gestione multivaluta come Revolut. È una carta di spesa collegata al tuo wallet crypto Ethereum, non un sostituto completo di un conto bancario.' },
      { q: 'Quale è gratuita tra MetaMask Card e Revolut Metal?', a: 'MetaMask Card è gratuita (0 €/anno). Revolut Metal costa 180 €/anno (15 €/mese). Revolut offre un piano gratuito con funzioni limitate, ma senza accesso alle funzioni Metal.' },
    ],
    en_faq: [
      { q: 'Is MetaMask Card available in Europe like Revolut?', a: 'MetaMask Card is available in several European countries via Mastercard, with a gradual rollout. Revolut is available across the entire EU. Check current availability at metamask.io.' },
      { q: 'Can MetaMask Card replace Revolut as a main account?', a: 'No. MetaMask Card does not have a native IBAN or multi-currency management like Revolut. It is a spending card linked to your Ethereum crypto wallet, not a full bank account replacement.' },
      { q: 'Which is free — MetaMask Card or Revolut Metal?', a: 'MetaMask Card is free (€0/year). Revolut Metal costs €180/year (€15/month). Revolut offers a free plan with limited features, but without access to Metal-tier features.' },
    ],
  },

};

export function getSpecificComparison(id1: string, id2: string): ComparisonContent | null {
  const key = normalizePairKey(id1, id2);
  return COMPARISONS[key] ?? null;
}
