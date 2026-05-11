import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import frCommon from './locales/fr/common.json';
import frCards from './locales/fr/cards.json';
import frBlog from './locales/fr/blog.json';

import deCommon from './locales/de/common.json';
import deCards from './locales/de/cards.json';
import deBlog from './locales/de/blog.json';

import esCommon from './locales/es/common.json';
import esCards from './locales/es/cards.json';
import esBlog from './locales/es/blog.json';

import itCommon from './locales/it/common.json';
import itCards from './locales/it/cards.json';
import itBlog from './locales/it/blog.json';

import enCommon from './locales/en/common.json';
import enCards from './locales/en/cards.json';
import enBlog from './locales/en/blog.json';

export const SUPPORTED_LANGUAGES = ['fr', 'de', 'es', 'it', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'cards', 'blog'],
    resources: {
      fr: {
        common: frCommon,
        cards: frCards,
        blog: frBlog,
      },
      de: {
        common: deCommon,
        cards: deCards,
        blog: deBlog,
      },
      es: {
        common: esCommon,
        cards: esCards,
        blog: esBlog,
      },
      it: {
        common: itCommon,
        cards: itCards,
        blog: itBlog,
      },
      en: {
        common: enCommon,
        cards: enCards,
        blog: enBlog,
      },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;
