import { useCallback } from 'react';
import { useLanguage } from './useLanguage';
import { buildLocalizedPath, getEquivalentRoute } from '../i18n/utils';
import { ROUTE_TRANSLATIONS, type Language } from '../i18n/types';

export function useLocalizedRoute() {
  const lang = useLanguage();

  const navigate = useCallback(
    (path: string) => {
      return buildLocalizedPath(lang, path);
    },
    [lang]
  );

  // Translates a canonical route key (e.g. 'compare') to the localized segment
  // then builds the full path. Falls back to the key itself if not found.
  const getRoute = useCallback(
    (key: string) => {
      if (key === '' || key === '/') return buildLocalizedPath(lang, '');
      const segment = ROUTE_TRANSLATIONS[lang]?.[key] ?? key;
      return buildLocalizedPath(lang, segment);
    },
    [lang]
  );

  // Returns just the localized path segment for a canonical key
  const getLocalizedSegment = useCallback(
    (key: string) => {
      return ROUTE_TRANSLATIONS[lang]?.[key] ?? key;
    },
    [lang]
  );

  const changeLanguage = useCallback(
    (newLang: Language, currentPathname: string) => {
      return getEquivalentRoute(currentPathname, newLang);
    },
    []
  );

  return { navigate, getRoute, getLocalizedSegment, changeLanguage, currentLang: lang };
}
