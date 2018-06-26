import * as React from "react";

interface Props {
  apiBase: string;
}

interface Deck {
  name: string,
  position: number
}

interface State {
  // We always store the decks in sorted order, regardless of how
  // they're returned from the database.
  decks: Deck[],
  newDeckName: string
}

export default class DeckList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { decks: [], newDeckName: '' };

    this.handleNewDeckButton = this.handleNewDeckButton.bind(this);
    this.handleNewDeckNameChange = this.handleNewDeckNameChange.bind(this);
  }

  componentDidMount() {
    this.refreshDeckList();
  }

  handleNewDeckNameChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ newDeckName: e.currentTarget.value });
  }

  async handleNewDeckButton(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.info("Creating a new deck named", this.state.newDeckName);
    const response = await fetch(`${this.props.apiBase}/deck`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.state.newDeckName, type: 'Standard' })
    });
    this.setState({ newDeckName: '' });
    this.refreshDeckList();
  }

  async refreshDeckList() {
    console.info("Getting deck list");
    const response = await fetch(`${this.props.apiBase}/deck`, {
      credentials: 'same-origin'
    });
    if (response.ok) {
      this.setState({ decks: await response.json() });
    } else {
      const error: string = await response.json();
      console.error("Error getting deck list:", error);
    }
  }

  render() {
    const deckItems = this.state.decks.map((deck) =>
      <li>{deck.name}</li>);
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
