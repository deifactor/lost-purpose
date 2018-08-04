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

const userStorageKey = 'user';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { decks: [] };

    this.handleNewDeckRequest = this.handleNewDeckRequest.bind(this);
    this.handleDeleteDeckRequest = this.handleDeleteDeckRequest.bind(this);
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

  render() {
    return (
      <DeckList decks={this.state.decks}
        onNewDeckRequest={this.handleNewDeckRequest}
        onDeleteDeckRequest={this.handleDeleteDeckRequest} />
    );
  }
}
