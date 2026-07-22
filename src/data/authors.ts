/**
 * E-E-A-T author data, referenced from Article JSON-LD and visible bylines.
 * Fill in real details; Google's quality raters and systems look for a real,
 * verifiable person behind YMYL finance content.
 */

export interface Author {
  id: string;
  name: string;
  /** Path to the author page, per language */
  urls: Record<string, string>;
  /** Short bio per language (1–2 sentences, shown under articles) */
  bio: Record<string, string>;
  /** Public profiles that prove the person exists (LinkedIn, X, etc.) */
  sameAs: string[];
  avatar?: string;
}

export const AUTHORS: Record<string, Author> = {
  tipitee: {
    id: 'tipitee',
    name: 'Tipitee',
    urls: {
      fr: '/fr/auteurs/tipitee',
      de: '/de/autoren/tipitee',
      es: '/es/autores/tipitee',
      it: '/it/autori/tipitee',
      en: '/en/authors/tipitee',
    },
    bio: {
      fr: "Analyste cartes crypto (@about_crypto). Teste personnellement chaque carte comparée sur TopCryptoCards depuis 2024.",
      de: "Krypto-Karten-Analyst (@about_crypto). Testet seit 2024 persönlich jede auf TopCryptoCards verglichene Karte.",
      es: "Analista de tarjetas cripto (@about_crypto). Prueba personalmente cada tarjeta comparada en TopCryptoCards desde 2024.",
      it: "Analista di carte crypto (@about_crypto). Testa personalmente ogni carta confrontata su TopCryptoCards dal 2024.",
      en: "Crypto card analyst (@about_crypto). Personally tests every card compared on TopCryptoCards since 2024.",
    },
    sameAs: [
      'https://x.com/about_crypto',
      'https://linkedin.com/company/topcryptocards',
    ],
    avatar: '/authors/tipitee.png',
  },
};

/** Build a schema.org Person node for JSON-LD (attach as `author` on Article). */
export function authorJsonLd(authorId: string, lang: string) {
  const a = AUTHORS[authorId];
  if (!a) return undefined;
  return {
    '@type': 'Person',
    name: a.name,
    url: `https://topcryptocards.eu${a.urls[lang] || a.urls.en}`,
    ...(a.sameAs.length ? { sameAs: a.sameAs } : {}),
  };
}
