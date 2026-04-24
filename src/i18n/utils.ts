import { LANGUAGES, ROUTE_TRANSLATIONS, type Language, isValidLanguage } from './types';

export function getLanguageFromPath(pathname: string): Language {
  const parts = pathname.split('/').filter(Boolean);
  const potentialLang = parts[0];
  return isValidLanguage(potentialLang) ? potentialLang : 'fr';
}

export function getLanguageName(lang: Language): string {
  return LANGUAGES[lang].nativeName;
}

export function getLanguageFlag(lang: Language): string {
  return LANGUAGES[lang].flag;
}

export function getLocalizedRoute(
  routeName: keyof typeof ROUTE_TRANSLATIONS.fr,
  lang: Language
): string {
  return ROUTE_TRANSLATIONS[lang][routeName];
}

export function buildLocalizedPath(lang: Language, path: string): string {
  if (path === '/' || path === '') {
    return `/${lang}`;
  }
  if (path.startsWith('/')) {
    return `/${lang}${path}`;
  }
  return `/${lang}/${path}`;
}

export function getSupportedLanguages(): Language[] {
  return Object.keys(LANGUAGES) as Language[];
}

export function getEquivalentRoute(
  pathname: string,
  newLang: Language
): string {
  const currentLang = getLanguageFromPath(pathname);
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0 || parts[0] === currentLang) {
    return `/${newLang}`;
  }

  const routeParts = parts.slice(1);

  const routeKey = Object.entries(ROUTE_TRANSLATIONS[currentLang]).find(
    ([_, value]) => value === routeParts[0]
  )?.[0] as keyof typeof ROUTE_TRANSLATIONS.fr | undefined;

  if (!routeKey) {
    return `/${newLang}`;
  }

  const newRoute = getLocalizedRoute(routeKey, newLang);

  if (routeParts.length === 1) {
    return `/${newLang}/${newRoute}`;
  }

  const restOfPath = routeParts.slice(1).join('/');
  return `/${newLang}/${newRoute}/${restOfPath}`;
}

export function initializeLanguage(): Language {
  const stored = localStorage.getItem('preferredLang');
  if (stored && isValidLanguage(stored)) {
    return stored;
  }

  const navigator =
    window.navigator.language || (window.navigator as any).userLanguage;
  const browserLang = navigator.split('-')[0];
  return isValidLanguage(browserLang) ? browserLang : 'fr';
}
