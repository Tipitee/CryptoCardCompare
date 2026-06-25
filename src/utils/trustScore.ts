import type { CryptoCard } from '../types/card';

const REGULATION_SCORES: Record<string, number> = {
  banking: 100,
  mica_fca: 80,
  standard: 60,
  basic: 38,
};

const AUM_SCORES: Record<string, number> = {
  very_large: 100,
  large: 75,
  medium: 50,
  small: 40,
};

/**
 * Compute the effective trust score for a card.
 * Mirrors the logic in TrustBadge — MUST stay in sync.
 * Uses trustBreakdown if available, falls back to raw trustScore.
 */
export function computeTrustScore(card: CryptoCard): number {
  const bd = card.trustBreakdown;
  if (bd) {
    const ageScore = bd.age != null
      ? Math.min(Math.round((bd.age / 10) * 100), 100)
      : 25;
    const regScore = REGULATION_SCORES[bd.regulation ?? ''] ?? 38;
    const tpScore = bd.trustpilot != null
      ? Math.round((bd.trustpilot / 5) * 100)
      : 35;
    const aumScore = AUM_SCORES[bd.aum ?? ''] ?? 40;
    return Math.round(regScore * 0.35 + tpScore * 0.25 + ageScore * 0.20 + aumScore * 0.20);
  }
  return card.trustScore ?? 0;
}
