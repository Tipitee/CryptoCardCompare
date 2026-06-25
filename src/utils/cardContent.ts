/**
 * cardContent.ts
 *
 * Generates rich textual content for card detail pages that have no Supabase article.
 * All content is derived from real card data — each card produces unique copy.
 * FR is the primary language (high-quality editorial tone); other langs are localized equivalents.
 */

import type { CryptoCard } from '../types/card';

export interface CardFaqItem {
  q: string;
  a: string;
}

export interface CardGeneratedContent {
  /** Two-paragraph intro describing the card */
  intro: string[];
  /** 3–5 "pour qui" bullet points */
  forWhom: string[];
  /** Up to 6 advantages */
  pros: string[];
  /** Up to 5 disadvantages */
  cons: string[];
  /** 5 FAQ items with detailed answers */
  faq: CardFaqItem[];
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtEur(n: number): string {
  return `${n.toLocaleString('fr-FR')} €`;
}

/** Max cashback across all tiers */
function maxCb(card: CryptoCard): number {
  return Math.max(card.cashbackBase, card.cashbackNoStaking, card.cashbackPremium);
}

/** Does the card have any cashback at all? */
function hasCashback(card: CryptoCard): boolean {
  return maxCb(card) > 0;
}

// ─── FRENCH ──────────────────────────────────────────────────────────────────

function generateFR(card: CryptoCard): CardGeneratedContent {
  const {
    name, issuer, cardNetwork,
    cashbackBase, cashbackNoStaking, cashbackPremium,
    annualFees, stakingRequired,
    availableFrance, availableEU,
    virtualOnly, freeWithdrawals,
    cryptos, extras, dailyLimit,
  } = card;

  const network = cardNetwork || 'Visa/Mastercard';
  const cardType = virtualOnly ? 'virtuelle' : 'physique et virtuelle';

  // ── Intro paragraphe 1 : présentation générale
  let p1 = `La ${name} est une carte crypto ${cardType} proposée par ${issuer}, opérée sur le réseau ${network}.`;

  // ── Intro paragraphe 2 : cashback + frais + dispo
  let cbSentence = '';
  if (cashbackPremium > 0 && stakingRequired > 0 && cashbackBase > 0) {
    cbSentence = `Elle offre un cashback de ${cashbackBase}% sur toutes tes dépenses, pouvant grimper jusqu'à ${cashbackPremium}% pour les utilisateurs qui s'engagent à staker au moins ${fmtEur(stakingRequired)} en tokens natifs.`;
  } else if (cashbackPremium > 0 && stakingRequired > 0 && cashbackBase === 0) {
    cbSentence = `Son cashback de ${cashbackPremium}% est réservé aux utilisateurs ayant staké ${fmtEur(stakingRequired)} — sans staking, la carte reste utilisable mais sans remboursement sur les achats.`;
  } else if (cashbackNoStaking > 0 && stakingRequired === 0) {
    cbSentence = `Elle reverse ${cashbackNoStaking}% de cashback en cryptomonnaies sur tes achats du quotidien, sans exiger le moindre staking — un avantage rare dans ce secteur.`;
  } else if (cashbackBase > 0) {
    cbSentence = `Elle propose un cashback de ${cashbackBase}% remboursé en cryptomonnaies, directement crédité sur ton portefeuille après chaque achat.`;
  } else {
    cbSentence = `Elle ne propose pas de programme de cashback classique, mais se distingue par d'autres avantages adaptés à un profil spécifique d'utilisateurs.`;
  }

  let feesSentence = '';
  if (annualFees === 0) {
    feesSentence = `Sans frais annuels, son modèle économique est ouvert à tous sans engagement financier initial.`;
  } else if (annualFees <= 50) {
    feesSentence = `Avec des frais modérés de ${fmtEur(annualFees)}/an, elle cible les utilisateurs qui souhaitent accéder à des fonctionnalités avancées sans débourser une fortune.`;
  } else {
    feesSentence = `Ses frais annuels de ${fmtEur(annualFees)} positionnent la ${name} comme une carte premium, destinée aux utilisateurs exigeants qui maximisent leurs usages.`;
  }

  let availSentence = '';
  if (availableFrance) {
    availSentence = `Elle est disponible en France et dans l'ensemble de l'Union européenne.`;
  } else if (availableEU) {
    availSentence = `Elle est accessible dans certains pays européens, mais n'est pas encore disponible en France — à surveiller pour une prochaine ouverture.`;
  } else {
    availSentence = `Sa zone de disponibilité reste limitée géographiquement ; il est recommandé de vérifier l'éligibilité selon ton pays de résidence avant toute demande.`;
  }

  const p2 = [cbSentence, feesSentence, availSentence].filter(Boolean).join(' ');

  // ── Pour qui
  const forWhom: string[] = [];
  if (annualFees === 0 && stakingRequired === 0) {
    forWhom.push('Les débutants qui veulent se lancer dans les crypto-paiements sans frais ni engagement');
  } else if (annualFees === 0) {
    forWhom.push('Ceux qui souhaitent profiter d\'une carte crypto sans abonnement annuel');
  }
  if (cashbackPremium >= 4) {
    forWhom.push(`Les gros dépensiers cherchant à maximiser leur cashback (jusqu'à ${cashbackPremium}% en tokens)`);
  } else if (cashbackPremium > 0 || cashbackBase > 0 || cashbackNoStaking > 0) {
    forWhom.push('Les utilisateurs qui veulent accumuler des cryptos passivement sur leurs dépenses');
  }
  if (stakingRequired === 0 && hasCashback(card)) {
    forWhom.push('Les investisseurs qui préfèrent garder leurs cryptos liquides et non bloquées');
  }
  if (availableFrance) {
    forWhom.push('Les résidents français souhaitant une carte crypto accessible et réglementée');
  }
  if (virtualOnly) {
    forWhom.push('Les acheteurs en ligne qui n\'ont pas besoin d\'une carte physique');
  } else if (freeWithdrawals) {
    forWhom.push('Les voyageurs qui retirent régulièrement des espèces à l\'étranger');
  }
  if (extras.includes('lounge_access')) {
    forWhom.push('Les grands voyageurs désireux d\'accéder aux salons VIP dans les aéroports');
  }
  if (extras.includes('self_custody')) {
    forWhom.push('Les utilisateurs attachés à la garde de leurs clés privées (self-custody)');
  }

  // ── Pros
  const pros: string[] = [];
  if (annualFees === 0) pros.push('Aucun frais annuel — carte entièrement gratuite');
  if (stakingRequired === 0 && hasCashback(card)) pros.push('Cashback disponible sans staking requis');
  if (cashbackPremium >= 3) pros.push(`Cashback premium attractif jusqu'à ${cashbackPremium}%`);
  else if (cashbackBase > 0) pros.push(`Cashback de ${cashbackBase}% sur tous les achats`);
  else if (cashbackNoStaking > 0) pros.push(`Cashback de ${cashbackNoStaking}% sans condition de staking`);
  if (availableFrance) pros.push('Disponible en France et dans toute l\'UE');
  if (freeWithdrawals) pros.push('Retraits aux DAB gratuits');
  if (extras.includes('lounge_access')) pros.push('Accès aux salons d\'aéroport inclus');
  if (extras.includes('travel_insurance')) pros.push('Assurance voyage incluse');
  if (extras.includes('self_custody')) pros.push('Carte en auto-garde (self-custody)');
  if (network === 'Visa') pros.push('Acceptée dans plus de 100 millions de points de vente dans le monde');
  if (cryptos.length >= 10) pros.push(`Large choix de ${cryptos.length} cryptomonnaies supportées`);

  // ── Cons
  const cons: string[] = [];
  if (stakingRequired > 0) cons.push(`Staking de ${fmtEur(stakingRequired)} requis pour le cashback premium`);
  if (annualFees > 0) cons.push(`Frais annuels de ${fmtEur(annualFees)}`);
  if (!availableFrance) cons.push('Non disponible en France pour le moment');
  if (!hasCashback(card)) cons.push('Pas de programme de cashback classique');
  else if (cashbackBase === 0 && cashbackNoStaking === 0 && stakingRequired > 0) cons.push('Aucun cashback sans staking');
  if (!freeWithdrawals) cons.push('Retraits aux DAB soumis à des frais');
  if (dailyLimit > 0 && dailyLimit < 5000) cons.push(`Limite journalière de ${fmtEur(dailyLimit)}`);

  // ── FAQ (5 questions riches)
  const faq: CardFaqItem[] = [];

  // Q1 : cashback
  if (hasCashback(card)) {
    let cbAnswer = '';
    if (cashbackPremium > 0 && stakingRequired > 0 && cashbackBase > 0) {
      cbAnswer = `La ${name} fonctionne sur deux paliers : un cashback de ${cashbackBase}% est disponible sans condition, et ce taux monte à ${cashbackPremium}% si tu stakes au moins ${fmtEur(stakingRequired)} en tokens natifs. Le cashback est versé en cryptomonnaies sur ton compte.`;
    } else if (cashbackPremium > 0 && stakingRequired > 0) {
      cbAnswer = `La ${name} offre ${cashbackPremium}% de cashback en cryptomonnaies, mais uniquement pour les détenteurs ayant staké au moins ${fmtEur(stakingRequired)} en tokens. Sans staking, la carte ne reverse pas de cashback sur les achats.`;
    } else if (cashbackNoStaking > 0 && stakingRequired === 0) {
      cbAnswer = `La ${name} propose ${cashbackNoStaking}% de cashback en cryptomonnaies sur toutes tes dépenses, sans aucune obligation de staking. Le remboursement est automatique et crédité directement sur ton portefeuille.`;
    } else {
      cbAnswer = `La ${name} offre ${cashbackBase}% de cashback sur tes achats, crédité en cryptomonnaies. C'est un taux de base appliqué à l'ensemble de tes dépenses, sans conditions particulières.`;
    }
    faq.push({ q: `Quel cashback propose la ${name} ?`, a: cbAnswer });
  } else {
    faq.push({
      q: `La ${name} propose-t-elle du cashback ?`,
      a: `La ${name} ne dispose pas de programme de cashback classique. Elle se distingue plutôt par ses autres fonctionnalités — comme${extras.length > 0 ? ' ' + formatExtras(extras, 'fr') : ' sa disponibilité et sa facilité d\'utilisation'}.`,
    });
  }

  // Q2 : disponibilité France
  faq.push({
    q: `La ${name} est-elle disponible en France ?`,
    a: availableFrance
      ? `Oui, la ${name} est pleinement disponible en France. Tu peux l'obtenir directement depuis le site d'${issuer}, sous réserve de satisfaire aux conditions KYC habituelles (vérification d'identité). Elle est également accessible dans l'ensemble de l'Union européenne.`
      : availableEU
        ? `La ${name} n'est pas encore disponible en France à ce jour, mais elle est accessible dans certains pays de l'Union européenne. Il est conseillé de consulter régulièrement le site officiel d'${issuer} pour les mises à jour de disponibilité.`
        : `La ${name} n'est pas disponible en France ni dans toute l'Union européenne. Sa zone de couverture est limitée ; vérifie l'éligibilité directement sur le site d'${issuer} selon ton pays de résidence.`,
  });

  // Q3 : staking
  faq.push({
    q: `Faut-il staker des cryptos pour utiliser la ${name} ?`,
    a: stakingRequired > 0
      ? `Pour profiter du cashback premium de ${cashbackPremium}%, la ${name} exige de bloquer ${fmtEur(stakingRequired)} en tokens natifs d'${issuer}. Ces tokens sont déposés sur ton compte et restent généralement restituables, mais peuvent être soumis à une période de blocage. Sans staking, la carte reste utilisable pour tes paiements${cashbackBase > 0 ? `, avec un cashback réduit de ${cashbackBase}%` : ', mais sans remboursement sur tes achats'}.`
      : `Non, la ${name} ne nécessite aucun staking. Tu peux profiter de toutes ses fonctionnalités — y compris le cashback — sans avoir à bloquer la moindre cryptomonnaie. C'est l'un de ses atouts majeurs pour les utilisateurs qui préfèrent garder leurs actifs liquides.`,
  });

  // Q4 : frais
  faq.push({
    q: `Quels sont les frais annuels de la ${name} ?`,
    a: annualFees === 0
      ? `La ${name} est entièrement gratuite : aucun frais annuel, aucun abonnement mensuel. Ce modèle sans frais la rend particulièrement attractive pour les débutants ou ceux qui veulent tester les paiements en crypto sans engagement financier.`
      : `La ${name} est proposée à ${fmtEur(annualFees)}/an. Ces frais couvrent l'accès à l'ensemble des fonctionnalités de la carte${extras.includes('lounge_access') ? ', dont l\'accès aux salons d\'aéroport' : ''}${extras.includes('travel_insurance') ? ', l\'assurance voyage' : ''}. Rapportés au cashback potentiel, ils peuvent être rapidement amortis si tu utilises régulièrement ta carte.`,
  });

  // Q5 : cryptos supportées
  const cryptoList = cryptos.slice(0, 8).join(', ');
  faq.push({
    q: `Quelles cryptomonnaies sont acceptées par la ${name} ?`,
    a: cryptos.length >= 5
      ? `La ${name} supporte ${cryptos.length} cryptomonnaies, dont ${cryptoList}${cryptos.length > 8 ? ', et bien d\'autres' : ''}. Tu peux généralement dépenser directement depuis ton portefeuille crypto, avec conversion automatique en monnaie locale au moment du paiement.`
      : cryptos.length > 0
        ? `La ${name} accepte les cryptomonnaies suivantes : ${cryptoList}. La conversion en devise locale s'effectue automatiquement lors du paiement.`
        : `La ${name} fonctionne avec les principales cryptomonnaies de la plateforme ${issuer}. Consulte le site officiel pour la liste à jour des actifs supportés.`,
  });

  return {
    intro: [p1, p2],
    forWhom: forWhom.slice(0, 5),
    pros: pros.slice(0, 6),
    cons: cons.slice(0, 5),
    faq,
  };
}

// ─── GERMAN ──────────────────────────────────────────────────────────────────

function generateDE(card: CryptoCard): CardGeneratedContent {
  const {
    name, issuer, cardNetwork,
    cashbackBase, cashbackNoStaking, cashbackPremium,
    annualFees, stakingRequired,
    availableFrance: _af, availableEU,
    virtualOnly, freeWithdrawals,
    cryptos, extras, dailyLimit,
  } = card;
  const network = cardNetwork || 'Visa/Mastercard';
  const cardType = virtualOnly ? 'virtuelle' : 'physische und virtuelle';

  let p1 = `Die ${name} ist eine ${cardType} Krypto-Karte von ${issuer}, die im ${network}-Netzwerk betrieben wird.`;

  let cbSentence = '';
  if (cashbackPremium > 0 && stakingRequired > 0 && cashbackBase > 0) {
    cbSentence = `Sie bietet ${cashbackBase}% Cashback auf alle Einkäufe, der auf bis zu ${cashbackPremium}% steigt, wenn mindestens ${stakingRequired} € in nativen Token gestakt werden.`;
  } else if (cashbackPremium > 0 && stakingRequired > 0) {
    cbSentence = `Das ${cashbackPremium}% Cashback ist nur für Nutzer verfügbar, die mindestens ${stakingRequired} € gestakt haben — ohne Staking gibt es kein Cashback.`;
  } else if (cashbackNoStaking > 0 && stakingRequired === 0) {
    cbSentence = `Sie gibt ${cashbackNoStaking}% Cashback in Kryptowährungen zurück, ohne jegliche Staking-Anforderungen.`;
  } else if (cashbackBase > 0) {
    cbSentence = `Sie bietet ${cashbackBase}% Cashback auf alltägliche Einkäufe in Kryptowährungen.`;
  } else {
    cbSentence = `Sie bietet kein klassisches Cashback-Programm, punktet aber durch andere Vorteile.`;
  }

  const feesSentence = annualFees === 0
    ? `Ohne Jahresgebühren ist sie für alle zugänglich.`
    : `Mit ${annualFees} €/Jahr richtet sie sich an anspruchsvollere Nutzer.`;

  const availSentence = availableEU
    ? `Sie ist in Deutschland und der gesamten EU verfügbar.`
    : `Die geografische Verfügbarkeit ist begrenzt — bitte auf der offiziellen Website prüfen.`;

  const p2 = [cbSentence, feesSentence, availSentence].join(' ');

  const forWhom: string[] = [];
  if (annualFees === 0 && stakingRequired === 0) forWhom.push('Einsteiger, die ohne Gebühren und Staking mit Krypto-Zahlungen beginnen möchten');
  if (cashbackPremium > 0) forWhom.push('Nutzer, die Krypto passiv durch ihre täglichen Ausgaben anhäufen möchten');
  if (stakingRequired === 0 && hasCashback(card)) forWhom.push('Anleger, die ihre Kryptowährungen liquid halten möchten');
  if (availableEU) forWhom.push('EU-Bürger, die eine regulierte Krypto-Karte suchen');
  if (extras.includes('lounge_access')) forWhom.push('Vielreisende, die VIP-Lounges an Flughäfen nutzen möchten');

  const pros: string[] = [];
  if (annualFees === 0) pros.push('Keine Jahresgebühren');
  if (stakingRequired === 0 && hasCashback(card)) pros.push('Cashback ohne Staking-Pflicht');
  if (cashbackPremium >= 3) pros.push(`Attraktives Premium-Cashback bis zu ${cashbackPremium}%`);
  else if (cashbackBase > 0) pros.push(`${cashbackBase}% Cashback auf alle Einkäufe`);
  if (availableEU) pros.push('Verfügbar in Deutschland und der EU');
  if (freeWithdrawals) pros.push('Kostenlose Geldabhebungen am Geldautomaten');
  if (extras.includes('lounge_access')) pros.push('Zugang zu Flughafenlounges inklusive');

  const cons: string[] = [];
  if (stakingRequired > 0) cons.push(`Mindest-Staking von ${stakingRequired} € erforderlich`);
  if (annualFees > 0) cons.push(`Jahresgebühr von ${annualFees} €`);
  if (!availableEU) cons.push('Begrenzte Verfügbarkeit in Europa');
  if (!hasCashback(card)) cons.push('Kein klassisches Cashback-Programm');
  if (!freeWithdrawals) cons.push('Gebührenpflichtige Geldabhebungen');
  if (dailyLimit > 0 && dailyLimit < 5000) cons.push(`Tageslimit von ${dailyLimit} €`);

  const faq: CardFaqItem[] = [
    {
      q: `Welches Cashback bietet die ${name}?`,
      a: hasCashback(card)
        ? cashbackPremium > 0 && stakingRequired > 0
          ? `Die ${name} bietet ${cashbackBase > 0 ? cashbackBase + '% Basis-Cashback und bis zu ' : ''}${cashbackPremium}% bei einem Mindest-Staking von ${stakingRequired} €.`
          : `Die ${name} bietet ${cashbackNoStaking || cashbackBase}% Cashback in Kryptowährungen ohne Staking-Anforderung.`
        : `Die ${name} hat kein Standard-Cashback-Programm.`,
    },
    {
      q: `Ist die ${name} in Deutschland verfügbar?`,
      a: availableEU
        ? `Ja, die ${name} ist in Deutschland und der gesamten EU erhältlich.`
        : `Die ${name} ist derzeit in Deutschland nicht verfügbar. Bitte die offizielle Website von ${issuer} auf Updates prüfen.`,
    },
    {
      q: `Erfordert die ${name} Staking?`,
      a: stakingRequired > 0
        ? `Ja, für das Premium-Cashback von ${cashbackPremium}% sind ${stakingRequired} € in nativen Token erforderlich. Ohne Staking ist die Karte weiterhin nutzbar${cashbackBase > 0 ? `, mit ${cashbackBase}% Cashback` : ', aber ohne Cashback'}.`
        : `Nein, die ${name} erfordert kein Staking. Alle Vorteile sind ohne das Sperren von Kryptowährungen zugänglich.`,
    },
    {
      q: `Welche Jahresgebühren hat die ${name}?`,
      a: annualFees === 0
        ? `Die ${name} ist kostenlos — keine Jahresgebühren, kein Abonnement.`
        : `Die ${name} kostet ${annualFees} €/Jahr. Bei regelmäßiger Nutzung amortisieren sich diese Kosten durch das Cashback schnell.`,
    },
    {
      q: `Welche Kryptowährungen unterstützt die ${name}?`,
      a: cryptos.length >= 3
        ? `Die ${name} unterstützt ${cryptos.length} Kryptowährungen, darunter ${cryptos.slice(0, 6).join(', ')}.`
        : `Die ${name} unterstützt die wichtigsten Kryptowährungen von ${issuer}. Aktuelle Liste auf der offiziellen Website.`,
    },
  ];

  return { intro: [p1, p2], forWhom: forWhom.slice(0, 5), pros: pros.slice(0, 6), cons: cons.slice(0, 5), faq };
}

// ─── SPANISH ─────────────────────────────────────────────────────────────────

function generateES(card: CryptoCard): CardGeneratedContent {
  const {
    name, issuer, cardNetwork,
    cashbackBase, cashbackNoStaking, cashbackPremium,
    annualFees, stakingRequired,
    availableFrance: _af, availableEU,
    virtualOnly, freeWithdrawals,
    cryptos, extras, dailyLimit,
  } = card;
  const network = cardNetwork || 'Visa/Mastercard';
  const cardType = virtualOnly ? 'virtual' : 'física y virtual';

  const p1 = `La ${name} es una tarjeta cripto ${cardType} emitida por ${issuer} que opera en la red ${network}.`;

  let cbSentence = '';
  if (cashbackPremium > 0 && stakingRequired > 0 && cashbackBase > 0) {
    cbSentence = `Ofrece un cashback base del ${cashbackBase}%, que puede alcanzar el ${cashbackPremium}% para usuarios que hagan staking de al menos ${stakingRequired} € en tokens nativos.`;
  } else if (cashbackPremium > 0 && stakingRequired > 0) {
    cbSentence = `Su cashback del ${cashbackPremium}% está reservado a usuarios con un staking mínimo de ${stakingRequired} €.`;
  } else if (cashbackNoStaking > 0 && stakingRequired === 0) {
    cbSentence = `Devuelve un ${cashbackNoStaking}% en criptomonedas sobre todas tus compras, sin ningún requisito de staking.`;
  } else if (cashbackBase > 0) {
    cbSentence = `Ofrece un ${cashbackBase}% de cashback en criptomonedas sobre tus compras diarias.`;
  } else {
    cbSentence = `No dispone de programa de cashback tradicional, pero destaca por otras ventajas específicas.`;
  }

  const feesSentence = annualFees === 0
    ? `Sin cuotas anuales, es accesible para todos sin compromiso financiero inicial.`
    : `Con una cuota anual de ${annualFees} €, está orientada a usuarios que buscan maximizar sus ventajas.`;

  const availSentence = availableEU
    ? `Está disponible en España y en el conjunto de la Unión Europea.`
    : `Su disponibilidad geográfica es limitada; consulta el sitio oficial de ${issuer} según tu país.`;

  const p2 = [cbSentence, feesSentence, availSentence].join(' ');

  const forWhom: string[] = [];
  if (annualFees === 0 && stakingRequired === 0) forWhom.push('Principiantes que quieren iniciarse en los pagos cripto sin costes ni compromisos');
  if (cashbackPremium > 0) forWhom.push('Usuarios que desean acumular criptomonedas pasivamente con sus gastos diarios');
  if (stakingRequired === 0 && hasCashback(card)) forWhom.push('Inversores que prefieren mantener sus criptos líquidas');
  if (availableEU) forWhom.push('Residentes en España y la UE que buscan una tarjeta cripto regulada');
  if (extras.includes('lounge_access')) forWhom.push('Grandes viajeros que desean acceso a salas VIP en aeropuertos');

  const pros: string[] = [];
  if (annualFees === 0) pros.push('Sin cuota anual');
  if (stakingRequired === 0 && hasCashback(card)) pros.push('Cashback sin obligación de staking');
  if (cashbackPremium >= 3) pros.push(`Cashback premium atractivo hasta el ${cashbackPremium}%`);
  else if (cashbackBase > 0) pros.push(`${cashbackBase}% de cashback en todas las compras`);
  if (availableEU) pros.push('Disponible en España y toda la UE');
  if (freeWithdrawals) pros.push('Retiradas en cajero automático gratuitas');
  if (extras.includes('lounge_access')) pros.push('Acceso a salas VIP en aeropuertos');

  const cons: string[] = [];
  if (stakingRequired > 0) cons.push(`Staking mínimo de ${stakingRequired} € requerido`);
  if (annualFees > 0) cons.push(`Cuota anual de ${annualFees} €`);
  if (!availableEU) cons.push('Disponibilidad limitada en Europa');
  if (!hasCashback(card)) cons.push('Sin programa de cashback tradicional');
  if (!freeWithdrawals) cons.push('Retiradas en cajero con comisiones');
  if (dailyLimit > 0 && dailyLimit < 5000) cons.push(`Límite diario de ${dailyLimit} €`);

  const faq: CardFaqItem[] = [
    {
      q: `¿Qué cashback ofrece la ${name}?`,
      a: hasCashback(card)
        ? cashbackPremium > 0 && stakingRequired > 0
          ? `La ${name} ofrece ${cashbackBase > 0 ? cashbackBase + '% de cashback base y hasta ' : ''}${cashbackPremium}% con un staking mínimo de ${stakingRequired} €.`
          : `La ${name} devuelve el ${cashbackNoStaking || cashbackBase}% en criptomonedas sin requisitos de staking.`
        : `La ${name} no tiene programa de cashback estándar.`,
    },
    {
      q: `¿Está disponible la ${name} en España?`,
      a: availableEU
        ? `Sí, la ${name} está disponible en España y en toda la Unión Europea.`
        : `La ${name} no está disponible en España actualmente. Consulta el sitio oficial de ${issuer} para novedades.`,
    },
    {
      q: `¿La ${name} requiere staking?`,
      a: stakingRequired > 0
        ? `Sí, para el cashback premium del ${cashbackPremium}% se requiere un staking de ${stakingRequired} €. Sin staking, la tarjeta sigue siendo utilizable${cashbackBase > 0 ? ` con un cashback del ${cashbackBase}%` : ' pero sin cashback'}.`
        : `No, la ${name} no requiere staking. Todas las ventajas están disponibles sin bloquear criptomonedas.`,
    },
    {
      q: `¿Cuáles son las tarifas anuales de la ${name}?`,
      a: annualFees === 0
        ? `La ${name} es completamente gratuita — sin cuota anual ni suscripción mensual.`
        : `La ${name} tiene una cuota de ${annualFees} €/año. Con un uso regular, el cashback puede compensar fácilmente este coste.`,
    },
    {
      q: `¿Qué criptomonedas acepta la ${name}?`,
      a: cryptos.length >= 3
        ? `La ${name} soporta ${cryptos.length} criptomonedas, entre ellas ${cryptos.slice(0, 6).join(', ')}.`
        : `La ${name} funciona con las principales criptomonedas de ${issuer}. Consulta la lista actualizada en el sitio oficial.`,
    },
  ];

  return { intro: [p1, p2], forWhom: forWhom.slice(0, 5), pros: pros.slice(0, 6), cons: cons.slice(0, 5), faq };
}

// ─── ITALIAN ─────────────────────────────────────────────────────────────────

function generateIT(card: CryptoCard): CardGeneratedContent {
  const {
    name, issuer, cardNetwork,
    cashbackBase, cashbackNoStaking, cashbackPremium,
    annualFees, stakingRequired,
    availableFrance: _af, availableEU,
    virtualOnly, freeWithdrawals,
    cryptos, extras, dailyLimit,
  } = card;
  const network = cardNetwork || 'Visa/Mastercard';
  const cardType = virtualOnly ? 'virtuale' : 'fisica e virtuale';

  const p1 = `La ${name} è una carta crypto ${cardType} emessa da ${issuer} e operata sulla rete ${network}.`;

  let cbSentence = '';
  if (cashbackPremium > 0 && stakingRequired > 0 && cashbackBase > 0) {
    cbSentence = `Offre un cashback di base del ${cashbackBase}%, che può arrivare al ${cashbackPremium}% per gli utenti che effettuano uno staking minimo di ${stakingRequired} € in token nativi.`;
  } else if (cashbackPremium > 0 && stakingRequired > 0) {
    cbSentence = `Il cashback del ${cashbackPremium}% è riservato agli utenti con uno staking minimo di ${stakingRequired} €.`;
  } else if (cashbackNoStaking > 0 && stakingRequired === 0) {
    cbSentence = `Restituisce il ${cashbackNoStaking}% in criptovalute su tutti gli acquisti, senza alcun requisito di staking.`;
  } else if (cashbackBase > 0) {
    cbSentence = `Offre il ${cashbackBase}% di cashback in criptovalute sugli acquisti quotidiani.`;
  } else {
    cbSentence = `Non dispone di un programma cashback classico, ma si distingue per altre funzionalità.`;
  }

  const feesSentence = annualFees === 0
    ? `Senza costi annuali, è accessibile a tutti senza impegno finanziario iniziale.`
    : `Con un costo di ${annualFees} €/anno, si rivolge a utenti che vogliono massimizzare i vantaggi crypto.`;

  const availSentence = availableEU
    ? `È disponibile in Italia e in tutta l'Unione Europea.`
    : `La disponibilità geografica è limitata; verifica l'idoneità sul sito ufficiale di ${issuer}.`;

  const p2 = [cbSentence, feesSentence, availSentence].join(' ');

  const forWhom: string[] = [];
  if (annualFees === 0 && stakingRequired === 0) forWhom.push('I principianti che vogliono iniziare con i pagamenti crypto senza costi né impegni');
  if (cashbackPremium > 0) forWhom.push('Gli utenti che vogliono accumulare crypto passivamente sulle spese quotidiane');
  if (stakingRequired === 0 && hasCashback(card)) forWhom.push('Gli investitori che preferiscono mantenere le proprie crypto liquide');
  if (availableEU) forWhom.push('I residenti in Italia e nell\'UE alla ricerca di una carta crypto regolamentata');
  if (extras.includes('lounge_access')) forWhom.push('I grandi viaggiatori che desiderano accedere alle lounge VIP degli aeroporti');

  const pros: string[] = [];
  if (annualFees === 0) pros.push('Nessun costo annuale');
  if (stakingRequired === 0 && hasCashback(card)) pros.push('Cashback senza obbligo di staking');
  if (cashbackPremium >= 3) pros.push(`Cashback premium fino al ${cashbackPremium}%`);
  else if (cashbackBase > 0) pros.push(`${cashbackBase}% di cashback su tutti gli acquisti`);
  if (availableEU) pros.push('Disponibile in Italia e in tutta l\'UE');
  if (freeWithdrawals) pros.push('Prelievi ATM gratuiti');
  if (extras.includes('lounge_access')) pros.push('Accesso alle lounge aeroportuali incluso');

  const cons: string[] = [];
  if (stakingRequired > 0) cons.push(`Staking minimo di ${stakingRequired} € richiesto`);
  if (annualFees > 0) cons.push(`Costo annuale di ${annualFees} €`);
  if (!availableEU) cons.push('Disponibilità limitata in Europa');
  if (!hasCashback(card)) cons.push('Nessun programma cashback standard');
  if (!freeWithdrawals) cons.push('Prelievi ATM con commissioni');
  if (dailyLimit > 0 && dailyLimit < 5000) cons.push(`Limite giornaliero di ${dailyLimit} €`);

  const faq: CardFaqItem[] = [
    {
      q: `Quale cashback offre la ${name}?`,
      a: hasCashback(card)
        ? cashbackPremium > 0 && stakingRequired > 0
          ? `La ${name} offre ${cashbackBase > 0 ? cashbackBase + '% di cashback base e fino al ' : ''}${cashbackPremium}% con uno staking minimo di ${stakingRequired} €.`
          : `La ${name} restituisce il ${cashbackNoStaking || cashbackBase}% in criptovalute senza requisiti di staking.`
        : `La ${name} non ha un programma cashback standard.`,
    },
    {
      q: `La ${name} è disponibile in Italia?`,
      a: availableEU
        ? `Sì, la ${name} è disponibile in Italia e in tutta l'Unione Europea.`
        : `La ${name} non è attualmente disponibile in Italia. Controlla il sito ufficiale di ${issuer} per aggiornamenti.`,
    },
    {
      q: `La ${name} richiede staking?`,
      a: stakingRequired > 0
        ? `Sì, per il cashback premium del ${cashbackPremium}% è necessario uno staking di ${stakingRequired} €. Senza staking, la carta è comunque utilizzabile${cashbackBase > 0 ? ` con il ${cashbackBase}% di cashback` : ' ma senza cashback'}.`
        : `No, la ${name} non richiede staking. Tutti i vantaggi sono accessibili senza bloccare criptovalute.`,
    },
    {
      q: `Quali sono i costi annuali della ${name}?`,
      a: annualFees === 0
        ? `La ${name} è completamente gratuita — nessun costo annuale né abbonamento.`
        : `La ${name} costa ${annualFees} €/anno. Con un utilizzo regolare, il cashback può compensare facilmente questo costo.`,
    },
    {
      q: `Quali criptovalute supporta la ${name}?`,
      a: cryptos.length >= 3
        ? `La ${name} supporta ${cryptos.length} criptovalute, tra cui ${cryptos.slice(0, 6).join(', ')}.`
        : `La ${name} funziona con le principali criptovalute di ${issuer}. Consulta la lista aggiornata sul sito ufficiale.`,
    },
  ];

  return { intro: [p1, p2], forWhom: forWhom.slice(0, 5), pros: pros.slice(0, 6), cons: cons.slice(0, 5), faq };
}

// ─── ENGLISH ─────────────────────────────────────────────────────────────────

function generateEN(card: CryptoCard): CardGeneratedContent {
  const {
    name, issuer, cardNetwork,
    cashbackBase, cashbackNoStaking, cashbackPremium,
    annualFees, stakingRequired,
    availableFrance: _af, availableEU,
    virtualOnly, freeWithdrawals,
    cryptos, extras, dailyLimit,
  } = card;
  const network = cardNetwork || 'Visa/Mastercard';
  const cardType = virtualOnly ? 'virtual' : 'physical and virtual';

  const p1 = `The ${name} is a ${cardType} crypto card issued by ${issuer}, operating on the ${network} network.`;

  let cbSentence = '';
  if (cashbackPremium > 0 && stakingRequired > 0 && cashbackBase > 0) {
    cbSentence = `It offers a base cashback of ${cashbackBase}%, rising to ${cashbackPremium}% for users who stake at least €${stakingRequired} in native tokens.`;
  } else if (cashbackPremium > 0 && stakingRequired > 0) {
    cbSentence = `Its ${cashbackPremium}% cashback is available only to users staking at least €${stakingRequired} — without staking, no cashback applies.`;
  } else if (cashbackNoStaking > 0 && stakingRequired === 0) {
    cbSentence = `It returns ${cashbackNoStaking}% cashback in crypto on all purchases, with no staking required — a genuine differentiator in this space.`;
  } else if (cashbackBase > 0) {
    cbSentence = `It offers ${cashbackBase}% cashback in cryptocurrency on everyday spending.`;
  } else {
    cbSentence = `It does not feature a traditional cashback program, but stands out through other specific advantages.`;
  }

  const feesSentence = annualFees === 0
    ? `With no annual fees, it's accessible to everyone without any upfront financial commitment.`
    : `At €${annualFees}/year, it targets users ready to invest in maximising their crypto benefits.`;

  const availSentence = availableEU
    ? `It is available across the European Union.`
    : `Geographic availability is limited — check eligibility on ${issuer}'s official website.`;

  const p2 = [cbSentence, feesSentence, availSentence].join(' ');

  const forWhom: string[] = [];
  if (annualFees === 0 && stakingRequired === 0) forWhom.push('Beginners looking to get started with crypto payments, fee-free and commitment-free');
  if (cashbackPremium > 0) forWhom.push('Users who want to passively accumulate crypto on everyday spending');
  if (stakingRequired === 0 && hasCashback(card)) forWhom.push('Investors who want to keep their crypto holdings liquid');
  if (availableEU) forWhom.push('European residents looking for a regulated crypto card');
  if (extras.includes('lounge_access')) forWhom.push('Frequent travellers seeking airport lounge access');

  const pros: string[] = [];
  if (annualFees === 0) pros.push('No annual fee');
  if (stakingRequired === 0 && hasCashback(card)) pros.push('Cashback with no staking requirement');
  if (cashbackPremium >= 3) pros.push(`Attractive premium cashback up to ${cashbackPremium}%`);
  else if (cashbackBase > 0) pros.push(`${cashbackBase}% cashback on all purchases`);
  if (availableEU) pros.push('Available across the EU');
  if (freeWithdrawals) pros.push('Free ATM withdrawals');
  if (extras.includes('lounge_access')) pros.push('Airport lounge access included');
  if (extras.includes('travel_insurance')) pros.push('Travel insurance included');

  const cons: string[] = [];
  if (stakingRequired > 0) cons.push(`Minimum staking of €${stakingRequired} required`);
  if (annualFees > 0) cons.push(`Annual fee of €${annualFees}`);
  if (!availableEU) cons.push('Limited availability in Europe');
  if (!hasCashback(card)) cons.push('No standard cashback programme');
  if (!freeWithdrawals) cons.push('ATM withdrawals incur fees');
  if (dailyLimit > 0 && dailyLimit < 5000) cons.push(`Daily spending limit of €${dailyLimit}`);

  const faq: CardFaqItem[] = [
    {
      q: `What cashback does the ${name} offer?`,
      a: hasCashback(card)
        ? cashbackPremium > 0 && stakingRequired > 0
          ? `The ${name} offers ${cashbackBase > 0 ? cashbackBase + '% base cashback and up to ' : ''}${cashbackPremium}% with a minimum stake of €${stakingRequired} in native tokens.`
          : `The ${name} returns ${cashbackNoStaking || cashbackBase}% cashback in crypto with no staking requirement.`
        : `The ${name} does not have a standard cashback programme.`,
    },
    {
      q: `Is the ${name} available in Europe?`,
      a: availableEU
        ? `Yes, the ${name} is available across the European Union.`
        : `The ${name} is not currently available in the EU. Check ${issuer}'s official website for updates.`,
    },
    {
      q: `Does the ${name} require staking?`,
      a: stakingRequired > 0
        ? `Yes, to unlock the ${cashbackPremium}% premium cashback, a minimum staking of €${stakingRequired} in native tokens is required. Without staking, the card is still usable${cashbackBase > 0 ? ` with ${cashbackBase}% cashback` : ' but without cashback'}.`
        : `No, the ${name} requires no staking. All benefits are accessible without locking up any cryptocurrency.`,
    },
    {
      q: `What are the annual fees for the ${name}?`,
      a: annualFees === 0
        ? `The ${name} is completely free — no annual fee, no monthly subscription.`
        : `The ${name} costs €${annualFees}/year. With regular use, cashback earnings can quickly offset this cost.`,
    },
    {
      q: `Which cryptocurrencies does the ${name} support?`,
      a: cryptos.length >= 3
        ? `The ${name} supports ${cryptos.length} cryptocurrencies, including ${cryptos.slice(0, 6).join(', ')}.`
        : `The ${name} works with ${issuer}'s main cryptocurrencies. See the full updated list on the official website.`,
    },
  ];

  return { intro: [p1, p2], forWhom: forWhom.slice(0, 5), pros: pros.slice(0, 6), cons: cons.slice(0, 5), faq };
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatExtras(extras: string[], _lang: string): string {
  const labels: Record<string, string> = {
    lounge_access: "l'accès aux salons d'aéroport",
    travel_insurance: "l'assurance voyage",
    self_custody: "la garde de vos clés privées",
    cashback_crypto: "le cashback en cryptos",
    metal_card: "sa carte en métal",
    concierge: "le service conciergerie",
  };
  return extras
    .slice(0, 3)
    .map(e => labels[e] || e)
    .join(', ');
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

export function generateCardContent(card: CryptoCard, lang: string): CardGeneratedContent {
  switch (lang) {
    case 'de': return generateDE(card);
    case 'es': return generateES(card);
    case 'it': return generateIT(card);
    case 'en': return generateEN(card);
    default:   return generateFR(card);
  }
}
