import * as React from "react";
import * as Cards from "./cards";
import Deck from "./deck_element";
import DeckList from "./deck_list";
import Login from "./login";
import * as uuid from "uuid";

interface Props {
}

interface State {
  // This is null if and only if there are no decks.
  currentDeckIndex: number | null,
  decks: Array<Cards.Deck>,
}

const decksStorageKey = 'decks';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const savedDecks = localStorage.getItem(decksStorageKey);
    const decks = savedDecks ? JSON.parse(savedDecks) : [];
    this.state = { decks, currentDeckIndex: decks.length != 0 ? 0 : null };

    this.handleNewDeckRequest = this.handleNewDeckRequest.bind(this);
    this.handleDeleteDeckRequest = this.handleDeleteDeckRequest.bind(this);
    this.handleChangeRequest = this.handleChangeRequest.bind(this);
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
    console.debug(`Creating new deck named ${newDeckName}`);
    this.setState((state) => ({
      decks: [...state.decks, newDeck]
    }));
  }

  handleDeleteDeckRequest(index: number) {
    console.debug(`Deleting deck ${index}`);
    this.setState((state) => {
      const newDecks = state.decks;
      newDecks.splice(index, 1);
      return { decks: newDecks }
    });
  }

  handleChangeRequest(index: number) {
    console.debug(`Selecting deck ${index}`);
    this.setState((state) => ({
      currentDeckIndex: index
    }));
  }

  saveState() {
    console.log("Saving state to localStorage");
    window.localStorage.setItem(decksStorageKey, JSON.stringify(this.state.decks));
  }

  currentDeck(): Cards.Deck | null {
    if (this.state.currentDeckIndex !== null) {
      return this.state.decks[this.state.currentDeckIndex];
    } else {
      return null;
    }
  }

  render() {
    const currentDeck = this.currentDeck();
    return (
      <div>
        <DeckList decks={this.state.decks}
          onNewDeckRequest={this.handleNewDeckRequest}
          onDeleteDeckRequest={this.handleDeleteDeckRequest}
          onChangeRequest={this.handleChangeRequest}
        />
        {currentDeck && <Deck deck={currentDeck} />}
      </div>
    );
  }
}
