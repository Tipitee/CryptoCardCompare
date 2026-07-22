/**
 * GA4 event tracking via gtag.js (already loaded in index.html)
 * No GTM needed, fires directly to G-HGWKLHZTET
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Track an affiliate link click.
 * @param cardName  Display name of the card (e.g. "Crypto.com Ruby")
 * @param brand     Issuer name (e.g. "Crypto.com")
 * @param url       Destination affiliate URL
 * @param source    Page/component where the click happened
 * @param lang      Current UI language
 */
export function trackAffiliateClick(
  cardName: string,
  brand: string,
  url: string,
  source: 'card_detail' | 'card_drawer' | 'review' | 'brand_page' | 'comparison' | 'compare_tool' | 'recommendation' | 'favorites' | 'crypto_page',
  lang: string,
): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'affiliate_click', {
    card_name:   cardName,
    brand,
    destination: url,
    source_page: source,
    language:    lang,
  });
}
