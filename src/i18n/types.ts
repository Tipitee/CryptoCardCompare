export const LANGUAGES = {
  fr: { code: 'fr', nativeName: 'Français',   flag: '🇫🇷' },
  de: { code: 'de', nativeName: 'Deutsch',     flag: '🇩🇪' },
  es: { code: 'es', nativeName: 'Español',     flag: '🇪🇸' },
  it: { code: 'it', nativeName: 'Italiano',    flag: '🇮🇹' },
  en: { code: 'en', nativeName: 'English',     flag: '🇬🇧' },
  // Country-market locales (use fr/de display content, be/at market filtering)
  be: { code: 'be', nativeName: 'Belgique',    flag: '🇧🇪' },
  at: { code: 'at', nativeName: 'Österreich',  flag: '🇦🇹' },
} as const;

export type Language = keyof typeof LANGUAGES;

/** Maps country-market locales to their display language. */
export const LOCALE_DISPLAY_LANG: Partial<Record<Language, Language>> = { be: 'fr', at: 'de' };

/** Returns the display language for content lookups (be→fr, at→de, others unchanged). */
export function displayLang(lang: Language | string): Language {
  return (LOCALE_DISPLAY_LANG[lang as Language] ?? (isValidLanguage(lang) ? lang : 'fr')) as Language;
}

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
    brands:         'marques',
    about:          'a-propos',
    contact:        'contact',
    authors:        'auteurs',
    feeIndex:       'frais-cartes-crypto',
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
    brands:         'marken',
    about:          'ueber-uns',
    contact:        'kontakt',
    authors:        'autoren',
    feeIndex:       'krypto-karten-gebuehren',
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
    brands:         'marcas',
    about:          'sobre-nosotros',
    contact:        'contacto',
    authors:        'autores',
    feeIndex:       'tarifas-tarjetas-crypto',
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
    brands:         'marche',
    about:          'chi-siamo',
    contact:        'contatti',
    authors:        'autori',
    feeIndex:       'tariffe-carte-crypto',
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
    brands:         'brands',
    about:          'about',
    contact:        'contact',
    authors:        'authors',
    feeIndex:       'crypto-card-fees',
  },
  // Belgium: French content + Belgian market — same slugs as /fr/
  be: {
    compare:        'comparer',
    simulator:      'simulateur',
    recommendation: 'recommandation',
    favorites:      'favoris',
    blog:           'blog',
    cards:          'cartes',
    reviews:        'avis',
    cryptos:        'cryptos',
    comparisons:    'comparer',
    brands:         'marques',
    about:          'a-propos',
    contact:        'contact',
    authors:        'auteurs',
    feeIndex:       'frais-cartes-crypto',
  },
  // Austria: German content + Austrian market — same slugs as /de/
  at: {
    compare:        'vergleich',
    simulator:      'simulator',
    recommendation: 'empfehlung',
    favorites:      'favoriten',
    blog:           'blog',
    cards:          'karten',
    reviews:        'bewertungen',
    cryptos:        'cryptos',
    comparisons:    'vergleichen',
    brands:         'marken',
    about:          'ueber-uns',
    contact:        'kontakt',
    authors:        'autoren',
    feeIndex:       'krypto-karten-gebuehren',
  },
};
