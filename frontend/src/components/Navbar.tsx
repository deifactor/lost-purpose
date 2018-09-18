import * as React from 'react';
import { Deck } from '../cards/cards';

import '../styles/navbar.scss';

interface Props {
  decks: ReadonlyArray<Deck>,
  // Called whenever the user selects a deck.
  onDeckSelect: (deck: Deck, index: number) => void
  // Called when the user wants to add a new deck.
  onNewDeck: () => void
}

export const Navbar: React.SFC<Props> = (props) => {
  const deckElements = props.decks.map((deck, index) =>
    <li key={index}
      onClick={() => props.onDeckSelect(deck, index)}>
      {deck.name}
    </li>);
  return (
    <nav className="navbar">
      <ul>
        <li>
          <div className="navbar-content">
            Select a deck
          </div>
          <ul className="dropdown-content">
            {deckElements}
            <li onClick={props.onNewDeck}>Add new deck</li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
