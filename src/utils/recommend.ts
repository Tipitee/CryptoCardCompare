import type { CryptoCard, QuizAnswers } from '../types/card';

export interface ScoredCard {
  card: CryptoCard;
  score: number;
  reasons: string[];
  drawbacks: string[];
  stakingMet: boolean;
  effectiveCashback: number;
}

// Diminishing-returns weight so 20% cards don't trivially crush 3% cards.
// 1%→10, 3%→24, 5%→31, 8%→37, 10%→40, 20%→49
function premiumScore(pct: number): number {
  return Math.round(20 * Math.log2(1 + pct));
}

// ─── Localized strings ───────────────────────────────────────────────────────
type Lang = 'fr' | 'de' | 'es' | 'it' | 'en';

function getLabels(lang: string) {
  const l = (lang as Lang) in LABELS ? (lang as Lang) : 'en';
  return LABELS[l];
}

const LABELS: Record<Lang, {
  highCashback:     (pct: number) => string;
  cashbackNoStake:  (pct: number) => string;
  noAnnualFees:     string;
  noStaking:        string;
  freeAtm:          string;
  easyToUse:        string;
  travelPerks:      string;
  profitability:    (net: number) => string;
  stakingRequired:  (amount: number) => string;
  annualFees:       (amount: number) => string;
  notAvailableFR:   string;
  paidAtm:          string;
}> = {
  fr: {
    highCashback:    (pct) => `Cashback élevé jusqu'à ${pct}%`,
    cashbackNoStake: (pct) => `${pct}% de cashback sans staking requis`,
    noAnnualFees:    'Aucun frais annuel',
    noStaking:       'Aucun staking requis',
    freeAtm:         'Retraits ATM gratuits',
    easyToUse:       'Simple à prendre en main, sans staking ni frais',
    travelPerks:     'Avantages voyage inclus',
    profitability:   (net) => `Rentabilité positive pour votre budget (~${net} € net/an)`,
    stakingRequired: (amt) => `Staking de ${amt} € requis pour le cashback maximum`,
    annualFees:      (amt) => `Frais annuels de ${amt} €`,
    notAvailableFR:  'Non disponible en France',
    paidAtm:         'Retraits ATM payants',
  },
  be: {
    highCashback:    (pct: number) => `Cashback élevé jusqu'à ${pct}%`,
    cashbackNoStake: (pct: number) => `${pct}% de cashback sans staking requis`,
    noAnnualFees:    'Aucun frais annuel',
    noStaking:       'Aucun staking requis',
    freeAtm:         'Retraits ATM gratuits',
    easyToUse:       'Simple à prendre en main, sans staking ni frais',
    travelPerks:     'Avantages voyage inclus',
    profitability:   (net: number) => `Rentabilité positive pour votre budget (~${net} € net/an)`,
    stakingRequired: (amt: number) => `Staking de ${amt} € requis pour le cashback maximum`,
    annualFees:      (amt: number) => `Frais annuels de ${amt} €`,
    notAvailableFR:  'Non disponible en Belgique',
    paidAtm:         'Retraits ATM payants',
  },
  de: {
    highCashback:    (pct) => `Hoher Cashback bis zu ${pct}%`,
    cashbackNoStake: (pct) => `${pct}% Cashback ohne Staking`,
    noAnnualFees:    'Keine Jahresgebühr',
    noStaking:       'Kein Staking erforderlich',
    freeAtm:         'Kostenlose Geldautomaten-Abhebungen',
    easyToUse:       'Einfach zu nutzen, kein Staking, keine Gebühren',
    travelPerks:     'Reisevorteile inklusive',
    profitability:   (net) => `Positiver ROI für Ihr Budget (~${net} € netto/Jahr)`,
    stakingRequired: (amt) => `${amt} € Staking für maximalen Cashback erforderlich`,
    annualFees:      (amt) => `Jahresgebühr ${amt} €`,
    notAvailableFR:  'Nicht in Frankreich verfügbar',
    paidAtm:         'Geldautomaten-Abhebungen kostenpflichtig',
  },
  at: {
    highCashback:    (pct: number) => `Hoher Cashback bis zu ${pct}%`,
    cashbackNoStake: (pct: number) => `${pct}% Cashback ohne Staking`,
    noAnnualFees:    'Keine Jahresgebühr',
    noStaking:       'Kein Staking erforderlich',
    freeAtm:         'Kostenlose Geldautomaten-Abhebungen',
    easyToUse:       'Einfach zu nutzen, kein Staking, keine Gebühren',
    travelPerks:     'Reisevorteile inklusive',
    profitability:   (net: number) => `Positiver ROI für Ihr Budget (~${net} € netto/Jahr)`,
    stakingRequired: (amt: number) => `${amt} € Staking für maximalen Cashback erforderlich`,
    annualFees:      (amt: number) => `Jahresgebühr ${amt} €`,
    notAvailableFR:  'Nicht in Österreich verfügbar',
    paidAtm:         'Geldautomaten-Abhebungen kostenpflichtig',
  },
  es: {
    highCashback:    (pct) => `Alto cashback hasta el ${pct}%`,
    cashbackNoStake: (pct) => `${pct}% de cashback sin staking`,
    noAnnualFees:    'Sin cuota anual',
    noStaking:       'Sin staking requerido',
    freeAtm:         'Retiradas en cajero gratuitas',
    easyToUse:       'Fácil de usar, sin staking ni cuotas',
    travelPerks:     'Ventajas de viaje incluidas',
    profitability:   (net) => `Rentabilidad positiva para tu presupuesto (~${net} € neto/año)`,
    stakingRequired: (amt) => `${amt} € de staking requeridos para el cashback máximo`,
    annualFees:      (amt) => `Cuota anual de ${amt} €`,
    notAvailableFR:  'No disponible en Francia',
    paidAtm:         'Retiradas en cajero con comisión',
  },
  it: {
    highCashback:    (pct) => `Alto cashback fino al ${pct}%`,
    cashbackNoStake: (pct) => `${pct}% di cashback senza staking`,
    noAnnualFees:    'Nessun costo annuale',
    noStaking:       'Nessuno staking richiesto',
    freeAtm:         'Prelievi ATM gratuiti',
    easyToUse:       'Facile da usare, senza staking né costi',
    travelPerks:     'Vantaggi viaggio inclusi',
    profitability:   (net) => `Redditività positiva per il tuo budget (~${net} € netto/anno)`,
    stakingRequired: (amt) => `${amt} € di staking richiesti per il cashback massimo`,
    annualFees:      (amt) => `Costo annuale di ${amt} €`,
    notAvailableFR:  'Non disponibile in Francia',
    paidAtm:         'Prelievi ATM a pagamento',
  },
  en: {
    highCashback:    (pct) => `High cashback up to ${pct}%`,
    cashbackNoStake: (pct) => `${pct}% cashback with no staking required`,
    noAnnualFees:    'No annual fee',
    noStaking:       'No staking required',
    freeAtm:         'Free ATM withdrawals',
    easyToUse:       'Easy to use — no staking, no fees',
    travelPerks:     'Travel perks included',
    profitability:   (net) => `Positive ROI for your budget (~€${net} net/year)`,
    stakingRequired: (amt) => `€${amt} staking required for maximum cashback`,
    annualFees:      (amt) => `€${amt} annual fee`,
    notAvailableFR:  'Not available in France',
    paidAtm:         'ATM withdrawals are charged',
  },
};

export function scoreCards(cards: CryptoCard[], a: QuizAnswers, lang = 'fr'): ScoredCard[] {
  const lbl = getLabels(lang);

  const budget =
    a.budget === 'lt200'
      ? 150
      : a.budget === '200-500'
      ? 350
      : a.budget === '500-1500'
      ? 1000
      : a.budget === 'gt1500'
      ? 2000
      : 500;

  const stakingCap =
    a.staking === 'none'
      ? 0
      : a.staking === 'up_500'
      ? 500
      : a.staking === 'up_2500'
      ? 2500
      : a.staking === 'more'
      ? Infinity
      : Infinity;

  const results: ScoredCard[] = [];

  for (const c of cards) {
    const reasons: string[] = [];
    const drawbacks: string[] = [];

    if (a.geo === 'france' && !c.availableFrance) continue;
    if (a.geo === 'eu' && !c.availableEU) continue;
    if (c.stakingRequired > stakingCap) continue;

    const stakingMet = c.stakingRequired <= stakingCap;
    // Effective rate: base rate if staking is met, no-staking rate otherwise
    const effectiveCashback = stakingMet ? c.cashbackBase : c.cashbackNoStaking;

    let score = 40;

    // Premium potential with diminishing returns — avoids saturation at 100
    const premiumW = a.priority === 'cashback' ? 1.5 : 0.75;
    score += premiumScore(c.cashbackPremium) * premiumW;
    if (c.cashbackPremium >= 3) reasons.push(lbl.highCashback(c.cashbackPremium));

    // Base quality signal: the real rate the user will actually get
    const baseW = a.priority === 'cashback' ? 7 : 3.5;
    score += effectiveCashback * baseW;
    if (effectiveCashback >= 2 && c.stakingRequired === 0) {
      reasons.push(lbl.cashbackNoStake(effectiveCashback));
    }

    if (a.priority === 'zero_fees') {
      if (c.annualFees === 0) {
        score += 20;
        reasons.push(lbl.noAnnualFees);
      } else {
        score -= c.annualFees / 20;
      }
    } else {
      score -= c.annualFees / 40;
    }

    if (a.priority === 'staking_fair') {
      if (c.stakingRequired === 0) {
        score += 15;
        reasons.push(lbl.noStaking);
      } else {
        score -= c.stakingRequired / 250;
      }
    }

    if (a.priority === 'withdrawals' || a.travel === 'often' || a.travel === 'regular') {
      if (c.freeWithdrawals) {
        score += 10;
        if (a.priority === 'withdrawals') reasons.push(lbl.freeAtm);
      }
    }

    if (a.priority === 'ease' && (a.crypto_relation === 'beginner' || a.crypto_relation === 'basics')) {
      if (c.stakingRequired === 0 && c.annualFees === 0) {
        score += 12;
        reasons.push(lbl.easyToUse);
      }
    }

    if (a.travel === 'often' || a.travel === 'regular') {
      if (c.extras.some((e) => /salon|aéroport|voyage|assurance|lounge|airport|travel|insurance/i.test(e))) {
        score += 8;
        reasons.push(lbl.travelPerks);
      }
    }

    if (budget > 500 && c.cashbackPremium >= 2) {
      score += 5;
    }

    // Profitability calculated on the rate the user will actually receive
    const estAnnualCashback = budget * 12 * (effectiveCashback / 100);
    if (estAnnualCashback > c.annualFees + 20) {
      reasons.push(lbl.profitability(Math.round(estAnnualCashback - c.annualFees)));
    }

    if (c.stakingRequired > 0) {
      drawbacks.push(lbl.stakingRequired(c.stakingRequired));
    }
    if (c.annualFees > 0) {
      drawbacks.push(lbl.annualFees(c.annualFees));
    }
    if (a.geo === 'france' && !c.availableFrance) {
      drawbacks.push(lbl.notAvailableFR);
    }
    if (!c.freeWithdrawals) {
      drawbacks.push(lbl.paidAtm);
    }

    score = Math.max(0, Math.round(score));

    results.push({
      card: c,
      score,
      reasons: reasons.slice(0, 3),
      drawbacks: drawbacks.slice(0, 2),
      stakingMet,
      effectiveCashback,
    });
  }

  results.sort((a, b) => {
    const diff = b.score - a.score;
    if (Math.abs(diff) > 2) return diff;
    // Tiebreaker 1: higher effective cashback (real rate user actually gets)
    const effDiff = b.effectiveCashback - a.effectiveCashback;
    if (Math.abs(effDiff) > 0.001) return effDiff;
    // Tiebreaker 2: free withdrawals first
    if (a.card.freeWithdrawals !== b.card.freeWithdrawals) {
      return a.card.freeWithdrawals ? -1 : 1;
    }
    // Tiebreaker 3: lower staking requirement
    return a.card.stakingRequired - b.card.stakingRequired;
  });

  // Normalize scores so the top card = 100, preserving relative differences
  const maxScore = results[0]?.score ?? 1;
  if (maxScore > 0) {
    for (const r of results) {
      r.score = Math.round((r.score / maxScore) * 100);
    }
  }

  return results;
}
