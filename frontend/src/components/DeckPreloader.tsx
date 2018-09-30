import * as React from "react";
import * as artFinder from "../cards/artFinder";
import * as Cards from "../cards/cards";

type Props = {
  count: number;
  deck: Cards.Deck;
};

/** Preloads art assets for a deck. Does not render anything into the DOM. */
export const DeckPreloader: React.SFC<Props> = (props) => {
  props.deck.cards.forEach((card, index) => {
    if (index >= props.count) {
      return;
    }
    new Image().src = artFinder.path(card);
    new Image().src = artFinder.back(card);
  });
  return null;
};
