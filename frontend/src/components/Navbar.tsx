import * as React from 'react';
import { Deck } from '../cards/cards';

import '../styles/navbar.scss';

interface Props {
  decks: ReadonlyArray<Deck>,
  // Called whenever the user selects a deck.
  onDeckSelect: (deck: Deck, index: number) => void
}

export const Navbar: React.SFC<Props> = (props) => {
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
          </ul>
        </li>
      </ul>
    </nav>
  );
}
