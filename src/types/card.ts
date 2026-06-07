export interface CryptoCard {
  id: string;
  name: string;
  issuer: string;
  cashbackBase: number;
  cashbackNoStaking: number;
  cashbackPremium: number;
  annualFees: number;
  stakingRequired: number;
  cryptos: string[];
  availableFrance: boolean;
  availableEU: boolean;
  cardNetwork: string;
  dailyLimit: number;
  freeWithdrawals: boolean;
  extras: string[];
  affiliateLink: string;
  badge: string | null;
  colorPrimary: string;
  colorSecondary: string;
  realCardImage?: string | null;
  imageAlt?: string | null;
  markets: string[];
  status: 'active' | 'discontinued' | 'coming_soon';
  virtualOnly: boolean;
  marketRestrictions: Record<string, string>;
  categoryRates?: {
    online?: number;
    restaurants?: number;
    travel?: number;
    streaming?: number;
    transport?: number;
    supermarket?: number;
    misc?: number;
  };
  trustScore?: number;
  foundedYear?: number;
  regulationLevel?: string;
  trustpilotScore?: number | null;
  aumTier?: string;
  trustBreakdown?: {
    age?: number;
    regulation?: string;
    trustpilot?: number | null;
    aum?: string;
  };
}

export interface QuizAnswers {
  budget?: 'lt200' | '200-500' | '500-1500' | 'gt1500';
  priority?: 'cashback' | 'zero_fees' | 'ease' | 'staking_fair' | 'withdrawals';
  staking?: 'none' | 'up_500' | 'up_2500' | 'more';
  crypto_relation?: 'beginner' | 'basics' | 'regular' | 'advanced';
  travel?: 'never' | 'few' | 'regular' | 'often';
  geo?: 'france' | 'eu' | 'international';
}

export interface SimulatorSpending {
  online: number;
  restaurants: number;
  travel: number;
  streaming: number;
  transport: number;
  supermarket: number;
  misc: number;
}
