/**
 * useHreflang — injects <link rel="alternate" hreflang="…"> tags into <head>
 * and removes them on unmount.
 *
 * Usage — builder function (most common):
 *   useHreflang(l => `https://topcryptocards.eu/${l}/blog`, []);
 *
 * Usage — with null guard (some langs have no URL):
 *   useHreflang(l => slugs[l] ? `https://topcryptocards.eu/${l}/${slugs[l]}` : null, [theme]);
 *
 * Usage — explicit entries (DB-driven variant slugs):
 *   useHreflang(
 *     variants.map(v => ({ lang: v.lang, href: `https://topcryptocards.eu/${v.lang}/blog/${v.slug}` })),
 *     [variants],
 *   );
 *
 * Usage — skip entirely (guard condition not met):
 *   useHreflang(null, []);
 *
 * Options:
 *   xDefault   — override the x-default href (default: FR entry href)
 *   noXDefault — omit the x-default link entirely
 */
import { useEffect } from 'react';

export const HREFLANG_BASE = 'https://topcryptocards.eu';
const LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en'] as const;
const ATTR = 'data-hreflang';

/**
 * Maps URL path slugs to valid BCP 47 language tags for hreflang attributes.
 * `be` and `at` are ISO 3166 country codes and NOT valid BCP 47 — must be mapped.
 * `en` alone is generic English; we use `en-GB` since we target the UK market.
 */
const HREFLANG_BCP47: Record<string, string> = {
  fr: 'fr',
  be: 'fr-BE',
  de: 'de',
  at: 'de-AT',
  es: 'es',
  it: 'it',
  en: 'en-GB',
};

export interface HreflangEntry {
  lang: string;
  href: string;
}

export interface HreflangOptions {
  /** Override x-default href (defaults to the FR entry href). */
  xDefault?: string;
  /** Omit x-default entirely. */
  noXDefault?: boolean;
}

type HreflangBuilder = (lang: string) => string | null | undefined;

export function useHreflang(
  input: HreflangBuilder | HreflangEntry[] | null,
  deps: unknown[],
  options: HreflangOptions = {},
): void {
  useEffect(() => {
    if (input === null) return;

    // Remove any hreflang links left by a previous render / page
    document.querySelectorAll(`link[${ATTR}]`).forEach(el => el.remove());

    // Resolve to a flat list of { lang, href } pairs
    const entries: HreflangEntry[] =
      typeof input === 'function'
        ? LANGS.flatMap(l => {
            const href = input(l);
            return href ? [{ lang: l, href }] : [];
          })
        : input;

    if (entries.length === 0) return;

    // Inject alternate links (using BCP 47 codes, not URL slugs)
    entries.forEach(({ lang, href }) => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.setAttribute('hreflang', HREFLANG_BCP47[lang] ?? lang);
      el.setAttribute('href', href);
      el.setAttribute(ATTR, 'true');
      document.head.appendChild(el);
    });

    // x-default (points to FR by convention unless overridden)
    if (!options.noXDefault) {
      const xHref = options.xDefault ?? entries.find(e => e.lang === 'fr')?.href;
      if (xHref) {
        const xd = document.createElement('link');
        xd.rel = 'alternate';
        xd.setAttribute('hreflang', 'x-default');
        xd.setAttribute('href', xHref);
        xd.setAttribute(ATTR, 'true');
        document.head.appendChild(xd);
      }
    }

    return () => {
      document.querySelectorAll(`link[${ATTR}]`).forEach(el => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
