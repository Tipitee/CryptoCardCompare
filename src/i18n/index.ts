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
import ptCommon from './locales/pt/common.json';
import ptCards from './locales/pt/cards.json';
import ptBlog from './locales/pt/blog.json';

import itCommon from './locales/it/common.json';
import itCards from './locales/it/cards.json';
import itBlog from './locales/it/blog.json';

import enCommon from './locales/en/common.json';
import enCards from './locales/en/cards.json';
import enBlog from './locales/en/blog.json';

export const SUPPORTED_LANGUAGES = ['fr', 'de', 'es', 'it', 'en', 'pt'] as const;
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
      pt: {
        common: ptCommon,
        cards: ptCards,
        blog: ptBlog,
      },
      // Belgium: French display content, Belgian market.
      // Reuses the FR bundle but overrides the market-named strings so pages say
      // "Belgique" instead of "France" (meta scope + market-based filters).
      be: {
        common: {
          ...frCommon,
          site_description: 'Comparez les meilleures cartes crypto : cashback, frais, staking et disponibilité en Belgique et en Europe.',
          footer_desc: 'Comparez les meilleures cartes crypto : cashback, frais, staking et disponibilité en Belgique et en Europe.',
          home_seo_intro: 'Comparez 80+ cartes crypto disponibles en Belgique en 2026, cashback Visa/Mastercard, frais annuels, staking requis et disponibilité en Europe. Données vérifiées et mises à jour régulièrement.',
          filter_france: 'Disponible Belgique',
          compare_filter_france: 'Disponible en Belgique uniquement',
        },
        cards: frCards,
        blog: frBlog,
      },
      // Austria: German display content, Austrian market (same pattern, Österreich).
      at: {
        common: {
          ...deCommon,
          site_description: 'Vergleichen Sie die besten Kryptokarten: Cashback, Gebühren, Staking und Verfügbarkeit in Österreich und Europa.',
          home_seo_intro: 'Vergleichen Sie die besten Krypto-Karten und Bitcoin Karten für Österreich 2026: Kryptowährung Karte ohne Jahresgebühr, ohne Staking. Unabhängiger Vergleich, regelmäßig aktualisiert. Kostenlos ✓',
          filter_france: 'In Österreich verfügbar',
          compare_filter_france: 'Nur in Österreich verfügbar',
        },
        cards: deCards,
        blog: deBlog,
      },
    },
    detection: {
      order: ['navigator'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;
