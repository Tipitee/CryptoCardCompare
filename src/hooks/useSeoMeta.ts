import { useEffect } from 'react';

export interface SeoMetaOptions {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  canonical?: string; // override — defaults to current URL without query/hash
  lang?: string; // for og:locale
  noindex?: boolean; // sets robots to "noindex, follow" when true
}

/**
 * Sets <title>, meta description, OG tags, Twitter Cards, and canonical link.
 * Cleans up on unmount (restores previous values).
 */
const OG_LOCALE: Record<string, string> = { fr: 'fr_FR', de: 'de_DE', es: 'es_ES', it: 'it_IT', en: 'en_US', be: 'fr_BE', at: 'de_AT' };

export function useSeoMeta({ title, description, image, type = 'website', canonical, lang, noindex }: SeoMetaOptions) {
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
      upsertMeta('name',     'twitter:site',      '@TopCryptoCards'),
      ...(lang ? [upsertMeta('property', 'og:locale', OG_LOCALE[lang] ?? 'en_US')] : []),
      ...(noindex !== undefined ? [upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')] : []),
    ];

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
    };
  }, [title, description, image, type, canonical, lang, noindex]);
}
