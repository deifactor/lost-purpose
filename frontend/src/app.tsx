import * as React from "react";
import * as Cards from "./cards";
import DeckList from "./deck_list";
import Login from "./login";
import * as uuid from "uuid";

interface Props {
}

interface State {
  decks: Array<Cards.Deck>,
}

const decksStorageKey = 'decks';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const savedDecks = localStorage.getItem(decksStorageKey);
    const decks = savedDecks ? JSON.parse(savedDecks) : [];
    this.state = { decks };

    this.handleNewDeckRequest = this.handleNewDeckRequest.bind(this);
    this.handleDeleteDeckRequest = this.handleDeleteDeckRequest.bind(this);
    this.saveState = this.saveState.bind(this);

    // Needed since componentWillUnmount isn't called if the user is reloading the page.
    window.addEventListener("beforeunload", this.saveState);
  }

  componentWillUnmount() {
    this.saveState();
    window.removeEventListener("beforeunload", this.saveState);
  }

  handleNewDeckRequest(newDeckName: string) {
    const newDeck = {
      cards: Cards.standard(),
      name: newDeckName,
      id: uuid.v4()
    };
    this.setState((state) => ({
      decks: [...state.decks, newDeck]
    }));
  }

  handleDeleteDeckRequest(index: number) {
    this.setState((state) => {
      const newDecks = state.decks;
      newDecks.splice(index, 1);
      return { decks: newDecks }
    });
  }

  saveState() {
    console.log("Saving state to localStorage");
    window.localStorage.setItem(decksStorageKey, JSON.stringify(this.state.decks));
  }

  render() {
    return (
      <DeckList decks={this.state.decks}
        onNewDeckRequest={this.handleNewDeckRequest}
        onDeleteDeckRequest={this.handleDeleteDeckRequest} />
    );
  }
}
