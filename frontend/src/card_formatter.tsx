import { MajorArcana, Card, OrientedCard, CardKind, Rank, Suit, Color } from "./cards";
import { romanize } from "romanize";

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
    if (card.reversed) {
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
        return `${this.formatRank(card.rank)} of ${this.formatSuit(card.suit)}`;
      case CardKind.Extra:
        return this.formatExtra(card.color);
    }
  }

  private formatMajor(arcana: MajorArcana): string {
    const name = this.majorName(arcana);
    if (this.options.romanNumeralMajorArcana && MajorArcana.isStandard(arcana)) {
      return `${romanize(arcana)}, ${name}`;
    } else {
      return name;
    }
  }

  private majorName(arcana: MajorArcana): string {
    switch (arcana) {
      case MajorArcana.Fool: return "the Fool";
      case MajorArcana.Magician: return "the Magician";
      case MajorArcana.HighPriestess: return "the High Priestess";
      case MajorArcana.Empress: return "the Empress";
      case MajorArcana.Emperor: return "the Emperor";
      case MajorArcana.HighPriest: return "the High Priest";
      case MajorArcana.Lovers: return "the Lovers";
      case MajorArcana.Chariot: return "the Chariot";
      case MajorArcana.Strength: return "Strength";
      case MajorArcana.Hermit: return "the Hermit";
      case MajorArcana.Fortune: return "Fortune";
      case MajorArcana.Justice: return "Justice";
      case MajorArcana.HangedMan: return "the Hanged Man";
      case MajorArcana.Death: return "Death";
      case MajorArcana.Temperance: return "Temperance";
      case MajorArcana.Devil: return "the Devil";
      case MajorArcana.Tower: return "the Tower";
      case MajorArcana.Star: return "the Star";
      case MajorArcana.Moon: return "the Moon";
      case MajorArcana.Sun: return "the Sun";
      case MajorArcana.Judgement: return "Judgement";
      case MajorArcana.World: return "the World";
      case MajorArcana.Maya: return "Maya";
      case MajorArcana.Vulture: return "the Vulture";
      case MajorArcana.SheIsLegend: return "She-is-Legend";
      case MajorArcana.History: return "History";
      case MajorArcana.AlephFour: return "\u2135\u2084";
    }
  }

  private formatRank(rank: Rank): string {
    switch (this.options.minorArcanaRankFormat) {
      case NumberFormat.Roman: return romanize(rank);
      case NumberFormat.Numerals: return String(rank);
      case NumberFormat.Words:
        switch (rank) {
          case Rank.Zero: return "Zero";
          case Rank.One: return "Ace";
          case Rank.Two: return "Two";
          case Rank.Three: return "Three";
          case Rank.Four: return "Four";
          case Rank.Five: return "Five";
          case Rank.Six: return "Six";
          case Rank.Seven: return "Seven";
          case Rank.Eight: return "Eight";
          case Rank.Nine: return "Nine";
          case Rank.Ten: return "Ten";
          case Rank.Progeny: return "Progeny";
          case Rank.Cavalier: return "Cavalier";
          case Rank.Queen: return "Queen";
          case Rank.King: return "King";
          case Rank.NinetyNine: return "Ninety-Nine";
          default:
            throw new Error(`Unknown rank ${rank}`);
        }
    }
  }

  private formatSuit(suit: Suit): string {
    switch (suit) {
      case Suit.Wands: return "Wands";
      case Suit.Cups: return "Cups";
      case Suit.Swords: return "Swords";
      case Suit.Pentacles: return "Pentacles";
      case Suit.Void: return "VOID";
    }
  }

  private formatExtra(extra: Color): string {
    switch (extra) {
      case Color.White: return "A blank card";
      case Color.Black: return "The card with two backs";
    }
  }

}
