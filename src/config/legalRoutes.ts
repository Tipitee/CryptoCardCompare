// Light-weight legal route constants.
// Kept separate from LegalPage.tsx so the footer (Layout) can import slugs/labels
// WITHOUT pulling the whole LegalPage component (and its content) into the eager bundle.

export const SUPPORTED_LEGAL_LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en', 'pt'] as const;
export type LegalLang = typeof SUPPORTED_LEGAL_LANGS[number];

export const LEGAL_SLUGS: Record<LegalLang, string> = {
  fr: 'mentions-legales',
  be: 'mentions-legales',
  de: 'rechtliches',
  at: 'rechtliches',
  es: 'aviso-legal',
  it: 'avviso-legale',
  en: 'legal-notice',
  pt: 'legal-notice',
};

export const LEGAL_NAV_LABELS: Record<LegalLang, string> = {
  fr: 'Mentions légales',
  be: 'Mentions légales',
  de: 'Rechtliches',
  at: 'Rechtliches',
  es: 'Aviso legal',
  it: 'Avviso legale',
  en: 'Legal Notice',
  pt: 'Aviso legal',
};
