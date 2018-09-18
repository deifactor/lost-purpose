import * as React from 'react';
import { Deck } from '../cards/cards';
import { Link } from 'react-router-dom';

import '../styles/navbar.scss';

interface Props {
  decks: ReadonlyArray<Deck>,
  // Called when the user wants to add a new deck.
  onNewDeck: () => void
}

export const Navbar: React.SFC<Props> = (props) => {
  const deckElements = props.decks.map((deck, index) =>
    <Link to={`/deck/${deck.id.substr(0, 8)}`} key={index}>
      <li>{deck.name}</li>
    </Link>);
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
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
