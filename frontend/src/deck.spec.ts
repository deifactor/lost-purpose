import { Deck, MajorArcana, Rank, Suit } from '../src/deck';

describe("decks", () => {
  it("should have the right number of cards in a standard deck", () => {
    expect(Deck.standard().cards.length).toBe(22 + 4 * 14);
  });

  it("should have the right number of cards in a Silicon Dawn deck", () => {
    // 22 standard major arcana, 5 extra major arcana, 2 'extra' cards, 15 ranks
    // in 4 suits each, and the five VOIDs.
    expect(Deck.siliconDawn().cards.length).toBe(22 + 5 + 2 + 4 * 15 + 5)
  });

  it("should start face-up", () => {
    expect(Deck.standard().cards.filter((card) => card.reversed === false).length).toBe(78);
    expect(Deck.siliconDawn().cards.filter((card) => card.reversed === false).length).toBe(78);
  });
});

describe("the major arcana", () => {
  it("should have the right count of standard arcana", () => {
    expect(MajorArcana.standard().length).toBe(22);
  });

  it("should have the right count of Silicon Dawn arcana", () => {
    expect(MajorArcana.siliconDawn().length).toBe(5);
  })
});

describe("the ranks", () => {
  it("should have the right count of standard ranks", () => {
    expect(Rank.standard().length).toBe(14);
  });
});

describe("the suits", () => {
  it("should have the right count of standard suits", () => {
    expect(Suit.standard().length).toBe(4);
  });
});
