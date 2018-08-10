import * as React from "react";
import * as Cards from "./cards";
import { shuffle } from "./shuffle";
import { CardFormatter } from "./card_formatter";
import Deck from "./deck_element";
import DeckList from "./deck_list";
import Login from "./login";
import { LFSR } from "./lfsr";
import * as uuid from "uuid";
import update from "immutability-helper";

interface Props {
}

interface State {
  // This is null if and only if there are no decks.
  currentDeckIndex: number | null,
  currentCard: string | null,
  decks: ReadonlyArray<Cards.Deck>,
}

const decksStorageKey = 'decks';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const savedDecks = localStorage.getItem(decksStorageKey);
    const decks = savedDecks ? JSON.parse(savedDecks) : [];
    this.state = { decks, currentDeckIndex: decks.length != 0 ? 0 : null, currentCard: null };

    this.handleNewDeckRequest = this.handleNewDeckRequest.bind(this);
    this.handleDeleteDeckRequest = this.handleDeleteDeckRequest.bind(this);
    this.handleChangeRequest = this.handleChangeRequest.bind(this);
    this.handleDraw = this.handleDraw.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
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
      decks: [...state.decks, newDeck],
      currentDeckIndex: state.decks.length
    }));
  }

  handleDeleteDeckRequest(index: number) {
    console.debug(`Deleting deck ${index}`);
    this.setState((state) =>
      update(state, { decks: { $splice: [[index, 1]] } })
    );
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

  private handleDraw() {
    this.setState((state) => {
      const index = this.state.currentDeckIndex;
      if (index === null) {
        throw new Error("null currentDeckIndex");
      }
      const topCard = state.decks[index].cards[0];
      console.info("Drew", topCard);
      const currentCard = new CardFormatter().format(topCard);
      const numCards = state.decks[index].cards.length;
      let newDecks = update(state.decks,
        { [index]: { cards: { $splice: [[0, 1]] } } });
      newDecks = update(newDecks,
        { [index]: { cards: { $push: [topCard] } } });
      return { decks: newDecks, currentCard }
    });
  }

  private handleShuffle(fingerprint: number) {
    const lfsr = new LFSR(fingerprint);
    console.debug("Shuffling deck");
    this.setState((state) => {
      const index = this.state.currentDeckIndex;
      if (index === null) {
        throw new Error("null currentDeckIndex");
      }
      let repeatedShuffle = function <T>(cards: Array<Cards.OrientedCard>) {
        // Five times is enough to get some actual mixing, but not enough to be completely random.
        for (let i = 0; i < 5; i++) {
          cards = shuffle(cards, lfsr);
        }
        return cards;
      }

      return update(state,
        { decks: { [index]: { cards: repeatedShuffle } } });
    });
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
        {currentDeck &&
          <Deck onDraw={this.handleDraw}
            onShuffle={this.handleShuffle}
            deck={currentDeck} />}
        {this.state.currentCard}
      </div>
    );
  }
}
