import * as _ from 'lodash';
import { shuffle } from './shuffle';

function faceUpDeck(values: Array<number>): Array<{ value: number, reversed: boolean }> {
  return values.map((value) => ({ value, reversed: false }));
}

describe("shuffling", () => {
  it("should should leave an empty deck empty", () => {
    expect(shuffle([])).toHaveLength(0);
  });

  describe("reordering", () => {
    it("should swap the cards in a two-card deck", () => {
      expect(shuffle(faceUpDeck([0, 1])).map((x) => x.value))
        .toEqual([1, 0]);
    });

    it("should leave the elements in a hundred-card deck the same", () => {
      const shuffled = shuffle(faceUpDeck(_.range(100)));
      expect(shuffled).toHaveLength(100);
      expect(shuffled.map((x) => x.value))
        .toEqual(expect.arrayContaining(_.range(100)));
    });
  });

  describe("reversing", () => {
    it("should reverse one half of a two-card deck", () => {
      expect(shuffle(faceUpDeck([0, 1])).map((x) => x.reversed))
        .toEqual([true, false]);
    });

    it("should reverse roughly half of a thousand-card deck", () => {
      const shuffled = shuffle(faceUpDeck(_.range(1000)));
      const reversedCount = shuffled.filter((x) => x.reversed).length;
      expect(reversedCount).toBeLessThan(800);
      expect(reversedCount).toBeGreaterThan(200);
    });
  });
});
