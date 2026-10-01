import { useEffect } from 'react';

export interface SeoMetaOptions {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  canonical?: string; // override, defaults to current URL without query/hash
  lang?: string; // for og:locale
  noindex?: boolean; // sets robots to "noindex, follow" when true
  /**
   * Quality gate (SEO prune, 2026-09): the be (Belgium) and at (Austria) markets
   * reuse the fr / de content verbatim on most page types (cards, reviews, blog,
   * compare, alternatives, brands) — Google already dedupes these against fr/de.
   * So be/at pages are noindex,follow BY DEFAULT. A page whose be/at variant is
   * genuinely market-specific (localized regulation/tax, e.g. thematic pages, and
   * the market homepage) must opt back in with indexInMarket. This inversion is
   * leak-proof: any new be/at page type is noindexed unless it explicitly opts in.
   */
  indexInMarket?: boolean;
}

const DUPLICATE_MARKETS = new Set(['be', 'at']);

/**
 * Sets <title>, meta description, OG tags, Twitter Cards, and canonical link.
 * Cleans up on unmount (restores previous values).
 */
const OG_LOCALE: Record<string, string> = { fr: 'fr_FR', de: 'de_DE', es: 'es_ES', it: 'it_IT', en: 'en_GB', be: 'fr_BE', at: 'de_AT', pt: 'pt_PT' };
const ALL_OG_LOCALES = ['fr_FR', 'fr_BE', 'de_DE', 'de_AT', 'es_ES', 'it_IT', 'en_GB', 'pt_PT'];

export function useSeoMeta({ title, description, image, type = 'website', canonical, lang, noindex, indexInMarket }: SeoMetaOptions) {
  // be/at reuse fr/de content on most page types → noindex,follow by default
  // unless the page opts back in (genuinely market-specific content).
  const effectiveNoindex = noindex || (!!lang && DUPLICATE_MARKETS.has(lang) && !indexInMarket) || undefined;
  useEffect(() => {
    const defaultImage = 'https://topcryptocards.eu/og-default.jpg';
    const ogImage = image || defaultImage;
    const canonicalUrl = canonical || (window.location.origin + window.location.pathname);
    const url = window.location.href;

    // ── Title ──────────────────────────────────────────────────────────────────
    const prevTitle = document.title;
    document.title = title;

    // ── Canonical ─────────────────────────────────────────────────────────────
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const canonicalWasNew = !canonicalEl;
    const prevCanonical = canonicalEl?.href || '';
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonicalUrl;

    // ── Meta helper ───────────────────────────────────────────────────────────
    type MetaTrack = { el: Element; wasNew: boolean; prev: string };
    function upsertMeta(attr: string, key: string, value: string): MetaTrack {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      const wasNew = !el;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute('content') || '';
      el.setAttribute('content', value);
      return { el: el as Element, wasNew, prev };
    }

    // ── All meta tags ─────────────────────────────────────────────────────────
    const metas: MetaTrack[] = [
      upsertMeta('name',     'description',       description),
      upsertMeta('property', 'og:title',          title),
      upsertMeta('property', 'og:description',    description),
      upsertMeta('property', 'og:image',          ogImage),
      upsertMeta('property', 'og:url',            url),
      upsertMeta('property', 'og:type',           type),
      upsertMeta('property', 'og:site_name',      'TopCryptoCards'),
      upsertMeta('name',     'twitter:card',      'summary_large_image'),
      upsertMeta('name',     'twitter:title',     title),
      upsertMeta('name',     'twitter:description', description),
      upsertMeta('name',     'twitter:image',     ogImage),
      upsertMeta('name',     'twitter:site',      '@cryptocards_eu'),
      ...(lang ? [upsertMeta('property', 'og:locale', OG_LOCALE[lang] ?? 'en_US')] : []),
      ...(effectiveNoindex !== undefined ? [upsertMeta('name', 'robots', effectiveNoindex ? 'noindex, follow' : 'index, follow')] : []),
    ];

    // ── og:locale:alternate (multiple tags, managed separately) ──────────────
    // Remove any pre-existing alternate tags, then create one per other locale.
    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(el => el.remove());
    const alternateEls: HTMLMetaElement[] = [];
    if (lang) {
      const currentLocale = OG_LOCALE[lang] ?? 'en_GB';
      ALL_OG_LOCALES.filter(l => l !== currentLocale).forEach(l => {
        const el = document.createElement('meta');
        el.setAttribute('property', 'og:locale:alternate');
        el.setAttribute('content', l);
        document.head.appendChild(el);
        alternateEls.push(el);
      });
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      document.title = prevTitle;

      if (canonicalWasNew) {
        canonicalEl?.parentNode?.removeChild(canonicalEl);
      } else if (canonicalEl) {
        canonicalEl.href = prevCanonical;
      }

      metas.forEach(({ el, wasNew, prev }) => {
        if (wasNew) {
          el.parentNode?.removeChild(el);
        } else {
          (el as HTMLMetaElement).setAttribute('content', prev);
        }
      });

      alternateEls.forEach(el => el.parentNode?.removeChild(el));
    };
  }, [title, description, image, type, canonical, lang, effectiveNoindex]);
}
