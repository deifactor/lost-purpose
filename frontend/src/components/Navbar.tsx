import * as React from 'react';
import { Deck } from '../cards/cards';

import '../styles/navbar.scss';

interface Props {
  decks: ReadonlyArray<Deck>
}

export const Navbar: React.SFC<Props> = (props) => {
  const deckElements = props.decks.map((deck, index) =>
    <li key={index}>
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
            <li>Add new deck</li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
