import { MajorArcana, Card, OrientedCard, CardKind, Rank, Suit, Color } from "./cards";
import romanize = require('romanize');

export enum NumberFormat {
  Roman,
  Words,
  Numerals
}

export type Options = {
  /** If true, major arcana are formatted like "XIII, Death". Defaults to false. */
  romanNumeralMajorArcana: boolean
  /**
   * Determines how to format the numbers for minor arcana: "VIII of Cups", "Eight of Cups", or "8 of Cups".
   * Defaults to words.
   */
  minorArcanaRankFormat: NumberFormat
}

export class CardFormatter {
  options: Options

  constructor(options: Partial<Options> = {}) {
    this.options = {
      romanNumeralMajorArcana: false,
      minorArcanaRankFormat: NumberFormat.Words
    };
    this.options = Object.assign(this.options, options);
  }

  format(card: OrientedCard): string {
    const unoriented = this.formatUnoriented(card);
    const kind = card.kind;
    // The (VOID) cards and the 'extras' cannot be reversed.
    const shouldIndicateReversal = card.kind == CardKind.Major || (card.kind == CardKind.Minor && card.suit != Suit.Void);
    if (card.reversed && shouldIndicateReversal) {
      return `${unoriented}, reversed`;
    } else {
      return unoriented;
    }
  }

  private formatUnoriented(card: Card): string {
    switch (card.kind) {
      case CardKind.Major:
        return this.formatMajor(card.arcana);
      case CardKind.Minor:
        return `the ${this.formatRank(card.rank)} of ${CardFormatter.formatSuit.get(card.suit)}`;
      case CardKind.Extra:
        return CardFormatter.formatExtra.get(card.color)!;
    }
  }

  private formatMajor(arcana: MajorArcana): string {
    const name = CardFormatter.majorName.get(arcana)!;
    if (this.options.romanNumeralMajorArcana && MajorArcana.isStandard(arcana)) {
      return `${zeroAwareRomanize(arcana)}, ${name}`;
    } else {
      return name;
    }
  }

  private static majorName = new Map([
    [MajorArcana.Fool, "the Fool"],
    [MajorArcana.Magician, "the Magician"],
    [MajorArcana.HighPriestess, "the High Priestess"],
    [MajorArcana.Empress, "the Empress"],
    [MajorArcana.Emperor, "the Emperor"],
    [MajorArcana.HighPriest, "the High Priest"],
    [MajorArcana.Lovers, "the Lovers"],
    [MajorArcana.Chariot, "the Chariot"],
    [MajorArcana.Strength, "Strength"],
    [MajorArcana.Hermit, "the Hermit"],
    [MajorArcana.Fortune, "Fortune"],
    [MajorArcana.Justice, "Justice"],
    [MajorArcana.HangedMan, "the Hanged Man"],
    [MajorArcana.Death, "Death"],
    [MajorArcana.Temperance, "Temperance"],
    [MajorArcana.Devil, "the Devil"],
    [MajorArcana.Tower, "the Tower"],
    [MajorArcana.Star, "the Star"],
    [MajorArcana.Moon, "the Moon"],
    [MajorArcana.Sun, "the Sun"],
    [MajorArcana.Judgement, "Judgement"],
    [MajorArcana.World, "the World"],
    [MajorArcana.Maya, "Maya"],
    [MajorArcana.Vulture, "the Vulture"],
    [MajorArcana.SheIsLegend, "She-is-Legend"],
    [MajorArcana.History, "History"],
    [MajorArcana.AlephFour, "\u2135\u2084"],
  ]);

  private static numberWords = new Map([
    [Rank.Zero, "Zero"],
    [Rank.One, "Ace"],
    [Rank.Two, "Two"],
    [Rank.Three, "Three"],
    [Rank.Four, "Four"],
    [Rank.Five, "Five"],
    [Rank.Six, "Six"],
    [Rank.Seven, "Seven"],
    [Rank.Eight, "Eight"],
    [Rank.Nine, "Nine"],
    [Rank.Ten, "Ten"],
    [Rank.Progeny, "Progeny"],
    [Rank.Cavalier, "Cavalier"],
    [Rank.Queen, "Queen"],
    [Rank.King, "King"],
    [Rank.NinetyNine, "Ninety-Nine"]
  ]);

  private formatRank(rank: Rank): string {
    switch (this.options.minorArcanaRankFormat) {
      case NumberFormat.Roman: return zeroAwareRomanize(rank);
      case NumberFormat.Numerals: return String(rank);
      case NumberFormat.Words: {
        return CardFormatter.numberWords.get(rank)!;
      }
    }
  }

  private static formatSuit: Map<Suit, string> = new Map([
    [Suit.Wands, "Wands"],
    [Suit.Cups, "Cups"],
    [Suit.Swords, "Swords"],
    [Suit.Pentacles, "Pentacles"],
    [Suit.Void, "(VOID)"]
  ]);

  private static formatExtra = new Map([
    [Color.White, "A blank card"],
    [Color.Black, "The card with two backs"]
  ])
}

function zeroAwareRomanize(n: number): string {
  return n == 0 ? "0" : romanize(n);
}
