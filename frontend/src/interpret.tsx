import { Art, Card, CardKind, MajorArcana, Rank, Suit } from './cards';
import rawJson from '../assets/tarot_interpretations.json';

export interface Interpretation {
  fortuneTelling: string[],
  keywords: string[],
  meanings: {
    upright: string[],
    reversed: string[]
  }
}

/**
 * An interpretation for the tarot card with the given rank and suit. Note
 * that this only supports Rider-Waite-Smith cards, and should *not* be used
 * with the Silicon Dawn deck, since that deck has cards with no RWS counterpart
 * and significantly altered meanings for several cards.
 */
export function interpret(card: Card): Interpretation | undefined {
  if (card.art == Art.SiliconDawn) {
    return undefined;
  }
  switch (card.kind) {
    case CardKind.Major:
      return majorInterpretations.get(card.arcana);
    case CardKind.Minor: {
      const suits = minorInterpretations.get(card.rank);
      return suits ? suits.get(card.suit) : undefined;
    }
    default:
      return undefined;
  }
}

let majorInterpretations: Map<MajorArcana, Interpretation> = new Map();
let minorInterpretations: Map<Rank, Map<Suit, Interpretation>> = new Map();
for (const raw of rawJson.tarot_interpretations) {
  const cleaned = {
    fortuneTelling: raw.fortune_telling,
    keywords: raw.keywords,
    meanings: {
      upright: raw.meanings.light,
      reversed: raw.meanings.shadow
    }
  };
  if (raw.suit == "major") {
    majorInterpretations.set(raw.rank as MajorArcana, cleaned);
  } else {
    const rank = parseRawRank(raw.rank);
    const suit = parseRawSuit(raw.suit);
    if (!minorInterpretations.has(rank)) {
      minorInterpretations.set(rank, new Map());
    }
    minorInterpretations.get(rank)!.set(suit, {
      fortuneTelling: raw.fortune_telling,
      keywords: raw.keywords,
      meanings: {
        upright: raw.meanings.light,
        reversed: raw.meanings.shadow
      }
    });
  }
}

// Below is code for converting the JSON into something Typescript can handle.

function parseRawRank(rawRank: string | number): Rank {
  switch (rawRank) {
    case "page": return Rank.Progeny;
    case "knight": return Rank.Cavalier;
    case "queen": return Rank.Queen;
    case "king": return Rank.King;
    default:
      return rawRank as Rank;
  }
}

function parseRawSuit(rawSuit: string): Suit {
  switch (rawSuit) {
    case "cups": return Suit.Cups;
    case "swords": return Suit.Swords;
    case "wands": return Suit.Wands;
    case "pentacles": return Suit.Pentacles;
    default:
      throw new Error("Unknown raw suit `${rawSuit}`");
  }
}

// The interpretation interface in the raw data.
interface RawInterpretation {
  fortune_telling: string[],
  keywords: string[],
  meanings: {
    light: string[],
    shadow: string[]
  },
  rank: number,
  suit: string
}
