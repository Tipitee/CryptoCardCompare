/**
 * E-E-A-T author data — referenced from Article JSON-LD and visible bylines.
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
  thomas: {
    id: 'thomas',
    name: 'Thomas Petit',
    urls: {
      fr: '/fr/auteurs/thomas',
      de: '/de/autoren/thomas',
      es: '/es/autores/thomas',
      it: '/it/autori/thomas',
      en: '/en/authors/thomas',
    },
    bio: {
      fr: "Analyste cartes crypto. Teste personnellement chaque carte comparée sur TopCryptoCards depuis 2024.",
      de: "Krypto-Karten-Analyst. Testet seit 2024 persönlich jede auf TopCryptoCards verglichene Karte.",
      es: "Analista de tarjetas cripto. Prueba personalmente cada tarjeta comparada en TopCryptoCards desde 2024.",
      it: "Analista di carte crypto. Testa personalmente ogni carta confrontata su TopCryptoCards dal 2024.",
      en: "Crypto card analyst. Personally tests every card compared on TopCryptoCards since 2024.",
    },
    sameAs: [
      // 'https://www.linkedin.com/in/…',
      // 'https://x.com/…',
    ],
    avatar: '/authors/thomas.jpg',
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
