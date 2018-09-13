import { rws } from './interpret';
import { Card, CardKind, MajorArcana, Rank, Suit, Art, standard, Color } from './cards';

describe("RWS tarot meaning data", () => {
  const table = standard().map((card) => [card]);
  describe.each(table)('%j', (card) => {
    const interpretation = rws(card);
    it("should have an interpretation", () => {
      expect(interpretation).toBeTruthy();
      expect(interpretation!.fortuneTelling).not.toHaveLength(0);
      expect(interpretation!.keywords).not.toHaveLength(0);
      expect(interpretation!.meanings.upright).not.toHaveLength(0);
      expect(interpretation!.meanings.reversed).not.toHaveLength(0);
    });
  });

  const aleph_four: Card = {
    kind: CardKind.Major,
    arcana: MajorArcana.AlephFour,
    art: Art.SiliconDawn
  };
  const ninety_nine_swords: Card = {
    kind: CardKind.Minor,
    rank: Rank.NinetyNine,
    suit: Suit.Swords,
    art: Art.SiliconDawn
  };
  const queen_of_void: Card = {
    kind: CardKind.Minor,
    rank: Rank.Queen,
    suit: Suit.Void,
    art: Art.SiliconDawn
  };
  const extra: Card = {
    kind: CardKind.Extra,
    color: Color.Black,
    art: Art.SiliconDawn
  };
  describe.each([aleph_four, ninety_nine_swords, queen_of_void, extra])('%j', (card) => {
    it("should not have an interpretation", () => {
      expect(rws(card)).toBeFalsy();
    })
  });
});
