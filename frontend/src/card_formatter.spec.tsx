import { CardFormatter, NumberFormat } from './card_formatter';
import { OrientedCard, Art, CardKind, MajorArcana, Rank, Suit, Color } from './cards';

const art = Art.SiliconDawn;

describe("CardFormatter", () => {
  describe("roman numeral formatting", () => {
    const options = {
      romanNumeralMajorArcana: true,
      minorArcanaRankFormat: NumberFormat.Roman
    }
    const formatter = new CardFormatter({ romanNumeralMajorArcana: true, minorArcanaRankFormat: NumberFormat.Roman });
    it("should format the Fool correctly", () => {
      const fool: OrientedCard = {
        kind: CardKind.Major,
        arcana: MajorArcana.Fool,
        reversed: false,
        art
      }
      expect(formatter.format(fool)).toBe("0, the Fool");
    });

    it("should format the zero of (VOID) correctly", () => {
      expect(formatter.format({ kind: CardKind.Minor, rank: Rank.Zero, suit: Suit.Void, reversed: false, art })).toBe("the 0 of (VOID)");
    });
  });

  describe("major arcana name formatting", () => {
    const formatter = new CardFormatter();
    it("should include 'the' when appropriate", () => {
      expect(formatter.format({ kind: CardKind.Major, arcana: MajorArcana.Magician, reversed: false, art }))
        .toBe("the Magician");
    });
    it("should not include 'the' when not appropriate", () => {
      expect(formatter.format({ kind: CardKind.Major, arcana: MajorArcana.Death, reversed: false, art }))
        .toBe("Death");
    });
  });

  describe("reversed card handling", () => {
    const formatter = new CardFormatter();
    it("should indicate when a card is reversed", () => {
      expect(formatter.format({ kind: CardKind.Major, arcana: MajorArcana.Tower, reversed: true, art }))
        .toContain("reversed");
      expect(formatter.format({ kind: CardKind.Minor, rank: Rank.Four, suit: Suit.Cups, reversed: true, art }))
        .toContain("reversed");
    });
    it("should not indicate when the (VOID) is reversed", () => {
      expect(formatter.format({ kind: CardKind.Minor, rank: Rank.Queen, suit: Suit.Void, reversed: true, art })).not.toContain("reversed");
    });
    it("should not indicate when an 'extra' card is reversed", () => {
      expect(formatter.format({ kind: CardKind.Extra, color: Color.White, reversed: true, art })).not.toContain("reversed");
    });
  });
})
