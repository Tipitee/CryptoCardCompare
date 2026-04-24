import type { CryptoCard } from '../types/card';

export interface DetectedCard {
  card: CryptoCard;
  matchType: 'name' | 'issuer' | 'tag';
  confidence: number;
}

export function detectCardsInPost(
  title: string,
  excerpt: string,
  tags: string[],
  cards: CryptoCard[]
): DetectedCard[] {
  const text = `${title} ${excerpt} ${tags.join(' ')}`.toLowerCase();
  const detected: DetectedCard[] = [];
  const seen = new Set<string>();

  for (const card of cards) {
    if (seen.has(card.id)) continue;

    let confidence = 0;
    let matchType: 'name' | 'issuer' | 'tag' = 'name';

    const cardName = card.name.toLowerCase();
    const issuer = card.issuer.toLowerCase();

    if (text.includes(cardName) && cardName.length > 2) {
      confidence = 0.9;
      matchType = 'name';
    } else if (text.includes(issuer) && issuer.length > 2) {
      confidence = 0.7;
      matchType = 'issuer';
    } else {
      for (const tag of tags) {
        const lowerTag = tag.toLowerCase();
        if (
          cardName.includes(lowerTag) ||
          issuer.includes(lowerTag) ||
          lowerTag.includes(cardName.split(' ')[0])
        ) {
          confidence = 0.5;
          matchType = 'tag';
          break;
        }
      }
    }

    if (confidence > 0) {
      detected.push({ card, matchType, confidence });
      seen.add(card.id);
    }
  }

  detected.sort((a, b) => b.confidence - a.confidence);
  return detected.slice(0, 2);
}
