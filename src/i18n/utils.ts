import { LANGUAGES, ROUTE_TRANSLATIONS, LOCALE_DISPLAY_LANG, type Language, isValidLanguage } from './types';
import { THEMATIC_ROUTES, VVP_SLUGS } from '../config/routes';

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

  if (parts.length === 0) {
    return `/${newLang}`;
  }

  // parts[0] is always the current lang prefix — skip it
  const routeParts = parts.slice(1);

  if (routeParts.length === 0) {
    return `/${newLang}`;
  }

  const slug = routeParts[0];

  // Resolve display languages for both current and new (handles be→fr, at→de)
  const currentDisplayLang = LOCALE_DISPLAY_LANG[currentLang] ?? currentLang;
  const newDisplayLang = LOCALE_DISPLAY_LANG[newLang] ?? newLang;

  const routeKey = Object.entries(ROUTE_TRANSLATIONS[currentDisplayLang] ?? ROUTE_TRANSLATIONS[currentLang] ?? {}).find(
    ([_, value]) => value === slug
  )?.[0] as keyof typeof ROUTE_TRANSLATIONS.fr | undefined;

  if (routeKey) {
    const newRoute = (ROUTE_TRANSLATIONS[newLang] ?? ROUTE_TRANSLATIONS[newDisplayLang])?.[routeKey];
    if (!newRoute) return `/${newLang}`;
    if (routeParts.length === 1) return `/${newLang}/${newRoute}`;
    const restOfPath = routeParts.slice(1).join('/');
    return `/${newLang}/${newRoute}/${restOfPath}`;
  }

  // Check thematic routes (e.g. carte-crypto-belgique → krypto-karte-belgien)
  for (const slugsByLang of Object.values(THEMATIC_ROUTES)) {
    if (slugsByLang[currentLang] === slug || slugsByLang[currentDisplayLang] === slug) {
      const newSlug = slugsByLang[newLang] ?? slugsByLang[newDisplayLang];
      if (newSlug) return `/${newLang}/${newSlug}`;
      break;
    }
  }

  // Check Virtual vs Physical page slugs
  const currentVvp = VVP_SLUGS[currentLang] ?? VVP_SLUGS[currentDisplayLang];
  if (currentVvp === slug) {
    const newVvp = VVP_SLUGS[newLang] ?? VVP_SLUGS[newDisplayLang];
    if (newVvp) return `/${newLang}/${newVvp}`;
  }

  return `/${newLang}`;
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
