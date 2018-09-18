import * as React from "react";
import * as Cards from "../cards/cards";
import { shuffle } from "../cards/shuffle";
import DrawResult from "./DrawResult";
import * as ArtFinder from "../cards/artFinder";
import Deck from "./Deck";
import DeckList from "./DeckList";
import { Navbar } from './Navbar';
import { LFSR } from "../cards/lfsr";
import update from "immutability-helper";

import '../styles/app.scss';

interface Props {
}

interface State {
  // This is null if and only if there are no decks.
  currentDeckIndex: number | null,
  currentCard: Cards.OrientedCard | null,
  decks: ReadonlyArray<Cards.Deck>,
}

const decksStorageKey = 'decks';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const savedDecks = localStorage.getItem(decksStorageKey);
    const decks = savedDecks ? JSON.parse(savedDecks) : [];
    this.state = { decks, currentDeckIndex: decks.length != 0 ? 0 : null, currentCard: null };

    this.handleNewDeck = this.handleNewDeck.bind(this);
    this.handleDeleteDeck = this.handleDeleteDeck.bind(this);
    this.handleSelectDeck = this.handleSelectDeck.bind(this);
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

  handleNewDeck(deck: Cards.Deck) {
    console.debug(`Creating new deck named ${deck.name}`);
    this.setState((state) => ({
      decks: [...state.decks, deck],
      currentDeckIndex: state.decks.length
    }));
  }

  handleDeleteDeck(index: number) {
    console.debug(`Deleting deck ${index}`);
    this.setState((state) =>
      update(state, { decks: { $splice: [[index, 1]] } })
    );
  }

  handleSelectDeck(deck: Cards.Deck, index: number) {
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
      const currentCard = topCard;
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
        // Ten times is enough to get some actual mixing.
        for (let i = 0; i < 10; i++) {
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
        <Navbar decks={this.state.decks}
                onDeckSelect={this.handleSelectDeck} />
        <DeckList decks={this.state.decks}
          onNewDeck={this.handleNewDeck}
          onDeleteDeck={this.handleDeleteDeck}
        />
        {currentDeck &&
          <Deck onDraw={this.handleDraw}
            onShuffle={this.handleShuffle}
            deck={currentDeck} />}
        <div id="draw-result-container">
          <DrawResult card={this.state.currentCard} />
        </div>
      </div>
    );
  }
}
