import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isValidLanguage } from '../i18n/types';

export default function LanguageSync() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    const syncLanguage = async () => {
      if (lang && isValidLanguage(lang) && i18n.language !== lang) {
        await i18n.changeLanguage(lang);
      }
    };
    syncLanguage();
  }, [lang, i18n]);

  return null;
}
