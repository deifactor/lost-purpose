import * as React from "react";
import * as Cards from "../cards/cards";

interface Props {
  decks: ReadonlyArray<Cards.Deck>,
  // Called whenever the user created a new deck.
  onNewDeck: (deck: Cards.Deck) => void,
  // Called whenever the user wants to delete the deck with the given index.
  onDeleteDeck: (index: number) => void,
}

interface State {
}

export default class DeckList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showNewDeckDialog: false };
  }

  render() {
    const deckItems = this.props.decks.map((deck, index) =>
      <li key={deck.id}>
        {deck.name}
        <button onClick={() => this.props.onDeleteDeck(index)}>Delete</button>
      </li>);
    return (
      <div>
        <ul>{deckItems}</ul>
      </div>
    );
  }
}
