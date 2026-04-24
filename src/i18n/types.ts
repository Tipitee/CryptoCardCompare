export const LANGUAGES = {
  fr: { code: 'fr', nativeName: 'Français', flag: '🇫🇷' },
  de: { code: 'de', nativeName: 'Deutsch', flag: '🇩🇪' },
  es: { code: 'es', nativeName: 'Español', flag: '🇪🇸' },
  it: { code: 'it', nativeName: 'Italiano', flag: '🇮🇹' },
  en: { code: 'en', nativeName: 'English', flag: '🇬🇧' },
} as const;

export type Language = keyof typeof LANGUAGES;

export function isValidLanguage(lang: string): lang is Language {
  return lang in LANGUAGES;
}

export const ROUTE_TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    compare: 'comparer',
    simulator: 'simulateur',
    recommendation: 'recommandation',
    favorites: 'favoris',
    blog: 'blog',
  },
  de: {
    compare: 'vergleich',
    simulator: 'simulator',
    recommendation: 'empfehlung',
    favorites: 'favoriten',
    blog: 'blog',
  },
  es: {
    compare: 'comparar',
    simulator: 'simulador',
    recommendation: 'recomendacion',
    favorites: 'favoritos',
    blog: 'blog',
  },
  it: {
    compare: 'confronto',
    simulator: 'simulatore',
    recommendation: 'raccomandazione',
    favorites: 'preferiti',
    blog: 'blog',
  },
  en: {
    compare: 'compare',
    simulator: 'simulator',
    recommendation: 'recommendation',
    favorites: 'favorites',
    blog: 'blog',
  },
};
