import * as React from "react";
import { Link } from "react-router-dom";
import { Deck } from "../cards/cards";

import "../styles/navbar.scss";

type Props = {
  decks: ReadonlyArray<Deck>;
  // Called when the user chooses a deck.
  onSelectDeck: () => void;
  // Called when the user wants to add a new deck.
  onNewDeck: () => void;
};

export const Navbar: React.SFC<Props> = (props) => {
  const deckElements = props.decks.map((deck, index) => (
    <Link
      onClick={props.onSelectDeck}
      to={`/deck/${deck.id.substr(0, 8)}`}
      key={index}
    >
      {deck.name}
    </Link>));
  return (
    <nav className="navbar">
      <div className="dropdown">
        <div className="dropdown-header">
          Select a deck
        </div>
        <div className="dropdown-content">
          {deckElements}
          <a onClick={props.onNewDeck}>Add new deck</a>
        </div>
      </div>
      <Link className="item" to="/about">About</Link>
      <Link className="item" to="/backup-restore">Backup/Restore</Link>
    </nav>
  );
};
