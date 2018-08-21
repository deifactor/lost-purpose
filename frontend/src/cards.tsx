export interface Deck {
  cards: Array<OrientedCard>,
  name: string,
  /** UUIDv4 format ID. */
  id: string
}

export function standard(): Array<OrientedCard> {
  const cards: Array<OrientedCard> = [];
  const art = Art.SiliconDawn;
  for (const major of MajorArcana.standard()) {
    cards.push({ kind: CardKind.Major, arcana: major, reversed: false, art });
  }
  for (const rank of Rank.standard()) {
    for (const suit of Suit.standard()) {
      cards.push({ kind: CardKind.Minor, rank, suit, reversed: false, art });
    }
  }
  return cards;
}

export function siliconDawn(): Array<OrientedCard> {
  let cards = standard();
  const art = Art.SiliconDawn;
  cards = cards.concat([
    { kind: CardKind.Extra, color: Color.Black, reversed: false, art },
    { kind: CardKind.Extra, color: Color.White, reversed: false, art }
  ])
  const voidRanks = [Rank.Zero, Rank.Progeny, Rank.Cavalier, Rank.Queen, Rank.King];
  const voids = voidRanks.map((rank): OrientedCard => ({ kind: CardKind.Minor, rank: rank, suit: Suit.Void, reversed: false, art }));
  const ninetyNines = Suit.standard().map((suit): OrientedCard => ({ kind: CardKind.Minor, rank: Rank.NinetyNine, suit, reversed: false, art }));
  const extraArcana = MajorArcana.siliconDawn().map((arcana): OrientedCard => ({ kind: CardKind.Major, arcana, reversed: false, art }));
  cards = cards
    .concat(extraArcana)
    .concat(voids)
    .concat(ninetyNines);

  return cards;
}

export enum CardKind {
  Major,
  Minor,
  Extra
}

export interface MajorCard {
  kind: CardKind.Major,
  arcana: MajorArcana
}

export interface MinorCard {
  kind: CardKind.Minor,
  rank: Rank,
  suit: Suit
}

/**
 * Silicon Dawn also includes one card that has a black face and one with a
 * white face.
 */
export interface ExtraCard {
  kind: CardKind.Extra,
  color: Color
}

export enum Art {
  SiliconDawn
};

export type Card = (MajorCard | MinorCard | ExtraCard) & { art: Art };
export type OrientedCard = Card & { reversed: boolean };

export function isStandardMajorArcana(majorArcana: MajorArcana) {
  return majorArcana <= MajorArcana.World;
}

// The Arcana are the means by which all is revealed.
export enum MajorArcana {
  Fool = 0,
  Magician,
  HighPriestess,
  Empress,
  Emperor,
  HighPriest,
  Lovers,
  Chariot,
  Strength,
  Hermit,
  Fortune,
  Justice,
  HangedMan,
  Death,
  Temperance,
  Devil,
  Tower,
  Star,
  Moon,
  Sun,
  Judgement,
  World,
  // Silicon dawn only.
  Maya,
  Vulture,
  SheIsLegend,
  History,
  AlephFour
}

export namespace MajorArcana {
  export function standard() {
    return [
      MajorArcana.Fool,
      MajorArcana.Magician,
      MajorArcana.HighPriestess,
      MajorArcana.Empress,
      MajorArcana.Emperor,
      MajorArcana.HighPriest,
      MajorArcana.Lovers,
      MajorArcana.Chariot,
      MajorArcana.Strength,
      MajorArcana.Hermit,
      MajorArcana.Fortune,
      MajorArcana.Justice,
      MajorArcana.HangedMan,
      MajorArcana.Death,
      MajorArcana.Temperance,
      MajorArcana.Devil,
      MajorArcana.Tower,
      MajorArcana.Star,
      MajorArcana.Moon,
      MajorArcana.Sun,
      MajorArcana.Judgement,
      MajorArcana.World,
    ];
  }

  export function siliconDawn() {
    return [
      MajorArcana.Maya,
      MajorArcana.Vulture,
      MajorArcana.SheIsLegend,
      MajorArcana.History,
      MajorArcana.AlephFour
    ];
  }

  export function isStandard(arcana: MajorArcana): boolean {
    return arcana <= MajorArcana.World;
  }
}

export enum Rank {
  // Silicon dawn only.
  Zero = 0,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Progeny,
  Cavalier,
  Queen,
  King,
  // Silicon dawn only.
  NinetyNine = 99,
}

export namespace Rank {
  export function standard() {
    return [
      Rank.One,
      Rank.Two,
      Rank.Three,
      Rank.Four,
      Rank.Five,
      Rank.Six,
      Rank.Seven,
      Rank.Eight,
      Rank.Nine,
      Rank.Ten,
      Rank.Progeny,
      Rank.Cavalier,
      Rank.Queen,
      Rank.King,
    ];
  }
}

export enum Suit {
  Wands,
  Cups,
  Swords,
  Pentacles,
  // Silicon Dawn only. Has a 0, Progeny, Cavalier, Queen, and King, but nothing else.
  Void
}

export namespace Suit {
  export function standard() {
    return [
      Suit.Wands,
      Suit.Cups,
      Suit.Swords,
      Suit.Pentacles
    ];
  }
}

export enum Color {
  White,
  Black
}
