import * as React from 'react';
import { InterpretationView } from './InterpretationView';
import * as Cards from '../cards/cards';
import { mount, render } from 'enzyme';

const magician: Cards.OrientedCard = {
  kind: Cards.CardKind.Major,
  arcana: Cards.MajorArcana.Magician,
  art: Cards.Art.RiderWaiteSmith,
  reversed: false
};
const siliconDawnMagician = { ...magician, art: Cards.Art.SiliconDawn };
const reversed = { ...magician, reversed: true };
const reversedSiliconDawn = { ...siliconDawnMagician, reversed: true };

describe("Rider-Waite-Smith descriptions", () => {
  const upright = render(<InterpretationView card={magician} />).text();
  it("should include the fortune-telling", () => {
    expect(upright).toMatch("one element of a much");
  });
  it("should include the keywords", () => {
    expect(upright).toMatch(/capability/i);
  });
  it("should include the meanings", () => {
    expect(upright).toMatch(/taking appropriate action/i);
    expect(upright).not.toMatch(/inflating your own ego/i);
  });

  it("should include the reversed meanings when reversed", () => {
    const rev = render(<InterpretationView card={reversed} />).text();
    expect(rev).toMatch(/inflating your own ego/i);
    expect(rev).not.toMatch(/taking appropriate action/);
  });
});

describe("Silicon Dawn descriptions", () => {
  it("should have the body", () => {
    expect(render(<InterpretationView card={siliconDawnMagician} />).text()).toMatch("MYSTICKQ");
  });
  it("should have the title for cards with a title", () => {
    const card: Cards.OrientedCard = {
      kind: Cards.CardKind.Minor,
      rank: Cards.Rank.Ten,
      suit: Cards.Suit.Pentacles,
      art: Cards.Art.SiliconDawn,
      reversed: false
    };
    expect(render(<InterpretationView card={card} />).text()).toMatch("Oppression");
  });

  it("should be the same when reversed", () => {
    const upright = render(<InterpretationView card={siliconDawnMagician} />).text();
    const reversedText = render(<InterpretationView card={reversedSiliconDawn} />).text();
    expect(upright).toEqual(reversedText);
  });
});
