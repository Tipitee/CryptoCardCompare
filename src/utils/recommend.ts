import type { CryptoCard, QuizAnswers } from '../types/card';

export interface ScoredCard {
  card: CryptoCard;
  score: number;
  reasons: string[];
  drawbacks: string[];
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

    let score = 40;

    const cashbackWeight = a.priority === 'cashback' ? 10 : 5;
    score += c.cashbackPremium * cashbackWeight;
    if (c.cashbackPremium >= 3) reasons.push(`Cashback élevé jusqu'à ${c.cashbackPremium}%`);

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

    const estAnnualCashback = budget * 12 * (c.cashbackBase / 100);
    if (estAnnualCashback > c.annualFees + 20) {
      reasons.push(`Rentabilité positive pour votre budget (~${Math.round(estAnnualCashback - c.annualFees)} € net/an)`);
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

    score = Math.max(0, Math.min(100, Math.round(score)));

    results.push({ card: c, score, reasons: reasons.slice(0, 3), drawbacks: drawbacks.slice(0, 2) });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
