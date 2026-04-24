import { useParams } from 'react-router-dom';
import { isValidLanguage, type Language } from '../i18n/types';

export function useLanguage(): Language {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang;

  if (lang && isValidLanguage(lang)) {
    return lang;
  }

  return 'fr';
}
