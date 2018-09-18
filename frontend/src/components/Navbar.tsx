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
  const onNewDeck = (e: React.FormEvent) => {
    e.preventDefault();
    props.onNewDeck();
  }
  const handleDeckClick = (e: React.FormEvent, deck: Deck, index: number) => {
    e.preventDefault();
    props.onDeckSelect(deck, index);
  };
  const deckElements = props.decks.map((deck, index) =>
    <li key={index}>
      <a href="#" onClick={(e) => handleDeckClick(e, deck, index)}>
        {deck.name}
      </a>
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
            <li>
              <a href="#" onClick={onNewDeck}>Add new deck</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
