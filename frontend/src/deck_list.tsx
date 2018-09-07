import * as React from "react";
import * as Cards from "./cards";

interface Props {
  decks: ReadonlyArray<Cards.Deck>,
  // Called whenever the user wants to create a new deck.
  onNewDeck: (newDeckName: string) => void,
  // Called whenever the user wants to delete the deck with the given index.
  onDeleteDeck: (index: number) => void,
  // Called when the user selects a given deck.
  onChange: (index: number) => void
}

interface State {
  newDeckName: string
}

export default class DeckList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { newDeckName: '' };

    this.handleNewDeckButton = this.handleNewDeckButton.bind(this);
    this.handleNewDeckNameChange = this.handleNewDeckNameChange.bind(this);
  }

  handleNewDeckNameChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ newDeckName: e.currentTarget.value });
  }

  handleNewDeckButton(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!this.state.newDeckName) {
      console.error('Cannot create a deck with an empty name');
      return;
    }
    this.props.onNewDeck(this.state.newDeckName);
    this.setState({ newDeckName: '' });
  }

  handleDeckClick(e: React.MouseEvent, index: number) {
    e.preventDefault();
    this.props.onChange(index);
  }

  render() {
    const deckItems = this.props.decks.map((deck, index) =>
      <li key={deck.id}>
        <a href="#" onClick={(e) => this.handleDeckClick(e, index)}>{deck.name}</a>
        <button onClick={() => this.props.onDeleteDeck(index)}>Delete</button>
      </li>);
    return (
      <div>
        <ul>{deckItems}</ul>
        <form onSubmit={this.handleNewDeckButton}>
          <input type="text"
            placeholder="Deck name"
            onChange={this.handleNewDeckNameChange}
            value={this.state.newDeckName}
          />
          <button type="submit">Add new deck</button>
        </form>
      </div>
    );
  }
}
