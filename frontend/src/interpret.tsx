import { Art, Card, CardKind, Color, MajorArcana, Rank, Suit } from './cards';
import rawJson from '../assets/tarot_interpretations.json';
import siliconDawnJson from '../assets/silicon-dawn/interpretations.json';

export interface RWSInterpretation {
  fortuneTelling: string[],
  keywords: string[],
  meanings: {
    upright: string[],
    reversed: string[]
  }
}

export interface SiliconDawnInterpretation {
  title: string,
  // Each element of this list should be its own paragraph.
  meaning: string[]
}

/**
 * An interpretation for the tarot card with the given rank and suit. Calling
 * this with Silicon Dawn cards produces undefined behavior, as those cards use
 * significantly different symbolism.
 */
export function rws(card: Card): RWSInterpretation | undefined {
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

export function siliconDawn(card: Card): SiliconDawnInterpretation | undefined {
  if (card.art != Art.SiliconDawn) {
    return undefined;
  }
  switch (card.kind) {
    case CardKind.Major:
      return siliconDawnJson.majors[card.arcana];
    case CardKind.Minor:
      const rank = card.rank == 99 ? 15 : card.rank;
      const minor = siliconDawnJson.minors[rank][card.suit];
      if (minor == null) {
        // Should never happen. The only nulls are for rank 0, 'normal' suits.
        throw new Error(`Unexpected null with card ${card}`)
      }
      return minor;
    case CardKind.Extra:
      switch (card.color) {
        case Color.Black:
          return siliconDawnJson.extras.black;
        case Color.White:
          return siliconDawnJson.extras.white;
      }
  }
}

let majorInterpretations: Map<MajorArcana, RWSInterpretation> = new Map();
let minorInterpretations: Map<Rank, Map<Suit, RWSInterpretation>> = new Map();
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
