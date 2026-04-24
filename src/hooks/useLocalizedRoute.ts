import { useCallback } from 'react';
import { useLanguage } from './useLanguage';
import { buildLocalizedPath, getEquivalentRoute } from '../i18n/utils';
import type { Language } from '../i18n/types';

export function useLocalizedRoute() {
  const lang = useLanguage();

  const navigate = useCallback(
    (path: string) => {
      return buildLocalizedPath(lang, path);
    },
    [lang]
  );

  const getRoute = useCallback(
    (path: string) => {
      return buildLocalizedPath(lang, path);
    },
    [lang]
  );

  const changeLanguage = useCallback(
    (newLang: Language, currentPathname: string) => {
      return getEquivalentRoute(currentPathname, newLang);
    },
    []
  );

  return { navigate, getRoute, changeLanguage, currentLang: lang };
}
