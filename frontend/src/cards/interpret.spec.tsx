import { Art, Card, CardKind, Color, MajorArcana, Rank, siliconDawn, standard, Suit } from "./cards";
import * as interpret from "./interpret";

describe("RWS tarot meaning data", () => {
  const table = standard().map((card) => [card]);
  describe.each(table)("%j", (card) => {
    const interpretation = interpret.rws(card);
    it("should have an interpretation", () => {
      expect(interpretation).toBeTruthy();
      expect(interpretation!.fortuneTelling).not.toHaveLength(0);
      expect(interpretation!.keywords).not.toHaveLength(0);
      expect(interpretation!.meanings.upright).not.toHaveLength(0);
      expect(interpretation!.meanings.reversed).not.toHaveLength(0);
    });
  });

  const alephFour: Card = {
    kind: CardKind.Major,
    arcana: MajorArcana.AlephFour,
    art: Art.SiliconDawn,
  };
  const ninetyNineSwords: Card = {
    kind: CardKind.Minor,
    rank: Rank.NinetyNine,
    suit: Suit.Swords,
    art: Art.SiliconDawn,
  };
  const queenOfVoid: Card = {
    kind: CardKind.Minor,
    rank: Rank.Queen,
    suit: Suit.Void,
    art: Art.SiliconDawn,
  };
  const extra: Card = {
    kind: CardKind.Extra,
    color: Color.Black,
    art: Art.SiliconDawn,
  };
  describe.each([alephFour, ninetyNineSwords, queenOfVoid, extra])("%j", (card) => {
    it("should not have an interpretation", () => {
      expect(interpret.rws(card)).toBeFalsy();
    });
  });
});

describe("Silicon Dawn tarot meaning data", () => {
  const table = siliconDawn();
  describe.each(siliconDawn())("%j", (card) => {
    it("should have an interpretation", () => {
      const interpretation = interpret.siliconDawn(card);
      expect(interpretation).toBeTruthy();
      expect(interpretation!.title).toBeTruthy();
      expect(interpretation!.meaning).not.toHaveLength(0);
    });
  });
});
