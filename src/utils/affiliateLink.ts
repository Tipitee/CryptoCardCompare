/**
 * Centralised affiliate link resolver.
 * Crypto.com cards always use the tracked affiliate URL regardless of what's
 * stored in Supabase / static data.
 */
export const CRYPTO_COM_AFFILIATE =
  'https://cryptocom.sjv.io/c/7394525/2051372/25666';

export function getAffiliateLink(card: {
  issuer: string;
  affiliateLink: string;
}): string {
  if (card.issuer === 'Crypto.com') return CRYPTO_COM_AFFILIATE;
  return card.affiliateLink;
}
