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

export function scoreCards(cards: CryptoCard[], a: QuizAnswers): ScoredCard[] {
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
    if (c.cashbackPremium >= 3) reasons.push(`Cashback élevé jusqu'à ${c.cashbackPremium}%`);

    // Base quality signal: the real rate the user will actually get
    const baseW = a.priority === 'cashback' ? 7 : 3.5;
    score += effectiveCashback * baseW;
    if (effectiveCashback >= 2 && c.stakingRequired === 0) {
      reasons.push(`${effectiveCashback}% de cashback sans staking requis`);
    }

    if (a.priority === 'zero_fees') {
      if (c.annualFees === 0) {
        score += 20;
        reasons.push('Aucun frais annuel');
      } else {
        score -= c.annualFees / 20;
      }
    } else {
      score -= c.annualFees / 40;
    }

    if (a.priority === 'staking_fair') {
      if (c.stakingRequired === 0) {
        score += 15;
        reasons.push('Aucun staking requis');
      } else {
        score -= c.stakingRequired / 250;
      }
    }

    if (a.priority === 'withdrawals' || a.travel === 'often' || a.travel === 'regular') {
      if (c.freeWithdrawals) {
        score += 10;
        if (a.priority === 'withdrawals') reasons.push('Retraits ATM gratuits');
      }
    }

    if (a.priority === 'ease' && (a.crypto_relation === 'beginner' || a.crypto_relation === 'basics')) {
      if (c.stakingRequired === 0 && c.annualFees === 0) {
        score += 12;
        reasons.push('Simple à prendre en main, sans staking ni frais');
      }
    }

    if (a.travel === 'often' || a.travel === 'regular') {
      if (c.extras.some((e) => /salon|aéroport|voyage|assurance/i.test(e))) {
        score += 8;
        reasons.push('Avantages voyage inclus');
      }
    }

    if (budget > 500 && c.cashbackPremium >= 2) {
      score += 5;
    }

    // Profitability calculated on the rate the user will actually receive
    const estAnnualCashback = budget * 12 * (effectiveCashback / 100);
    if (estAnnualCashback > c.annualFees + 20) {
      reasons.push(
        `Rentabilité positive pour votre budget (~${Math.round(estAnnualCashback - c.annualFees)} € net/an)`
      );
    }

    if (c.stakingRequired > 0) {
      drawbacks.push(`Staking de ${c.stakingRequired} € requis pour le cashback maximum`);
    }
    if (c.annualFees > 0) {
      drawbacks.push(`Frais annuels de ${c.annualFees} €`);
    }
    if (a.geo === 'france' && !c.availableFrance) {
      drawbacks.push('Non disponible en France');
    }
    if (!c.freeWithdrawals) {
      drawbacks.push('Retraits ATM payants');
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
