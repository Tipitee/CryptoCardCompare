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
    compare:        'comparer',
    simulator:      'simulateur',
    recommendation: 'recommandation',
    favorites:      'favoris',
    blog:           'blog',
    cards:          'cartes',
    reviews:        'avis',
    cryptos:        'cryptos',
    comparisons:    'comparer',
  },
  de: {
    compare:        'vergleich',
    simulator:      'simulator',
    recommendation: 'empfehlung',
    favorites:      'favoriten',
    blog:           'blog',
    cards:          'karten',
    reviews:        'bewertungen',
    cryptos:        'cryptos',
    comparisons:    'vergleichen',
  },
  es: {
    compare:        'comparar',
    simulator:      'simulador',
    recommendation: 'recomendacion',
    favorites:      'favoritos',
    blog:           'blog',
    cards:          'tarjetas',
    reviews:        'opiniones',
    cryptos:        'cryptos',
    comparisons:    'comparar',
  },
  it: {
    compare:        'confronto',
    simulator:      'simulatore',
    recommendation: 'raccomandazione',
    favorites:      'preferiti',
    blog:           'blog',
    cards:          'carte',
    reviews:        'recensioni',
    cryptos:        'cryptos',
    comparisons:    'confrontare',
  },
  en: {
    compare:        'compare',
    simulator:      'simulator',
    recommendation: 'recommendation',
    favorites:      'favorites',
    blog:           'blog',
    cards:          'cards',
    reviews:        'reviews',
    cryptos:        'cryptos',
    comparisons:    'compare',
  },
};
