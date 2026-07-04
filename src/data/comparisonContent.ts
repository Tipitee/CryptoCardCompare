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

};

/**
 * Get specific comparison content for a pair of card IDs.
 * Returns null if no specific content exists (fall back to generic).
 */
export function getSpecificComparison(id1: string, id2: string): ComparisonSpecific | null {
  const key = normalizePairKey(id1, id2);
  return COMPARISONS[key] ?? null;
}
