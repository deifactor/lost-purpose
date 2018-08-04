import * as React from "react";
import * as Cards from "./cards";

interface Props {
  decks: Array<Cards.Deck>,
  // Called whenever the user wants to create a new deck.
  onNewDeckRequest: (newDeckName: string) => void
  // Called whenever the user wants to delete the deck with the given index.
  onDeleteDeckRequest: (index: number) => void
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
    this.props.onNewDeckRequest(this.state.newDeckName);
    this.setState({ newDeckName: '' });
  }

  render() {
    const deckItems = this.props.decks.map((deck, index) =>
      <li>{deck.name} <button onClick={() => this.props.onDeleteDeckRequest(index)}>Delete</button></li>);
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
