import * as React from 'react';
import * as Cards from '../cards/cards';
import { shuffle } from '../cards/shuffle';
import { DrawResult } from './DrawResult';
import * as ArtFinder from '../cards/artFinder';
import Deck from './Deck';
import { BackupRestore } from './BackupRestore';
import { Navbar } from './Navbar';
import { LFSR } from '../cards/lfsr';
import update from 'immutability-helper';
import ReactModal = require('react-modal');
import { NewDeckDialog } from './NewDeckDialog';
import { HashRouter, Route } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import '../styles/app.scss';
const aboutMarkdown = require('./About.md');

interface Props {
}

interface State {
  // This is null if and only if there are no decks.
  currentCard: Cards.OrientedCard | null,
  decks: ReadonlyArray<Cards.Deck>,
  showNewDeckDialog: boolean
}

const decksStorageKey = 'decks';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const savedDecks = localStorage.getItem(decksStorageKey);
    const decks = savedDecks ? JSON.parse(savedDecks) : [];
    this.state = {
      decks,
      currentCard: null,
      showNewDeckDialog: false
    };

    this.handleShowNewDeckDialog = this.handleShowNewDeckDialog.bind(this);
    this.handleCloseNewDeck = this.handleCloseNewDeck.bind(this);
    this.handleNewDeck = this.handleNewDeck.bind(this);
    this.handleDeleteDeck = this.handleDeleteDeck.bind(this);
    this.handleDraw = this.handleDraw.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
    this.saveState = this.saveState.bind(this);

    // Needed since componentWillUnmount isn't called if the user is reloading the page.
    window.addEventListener("beforeunload", this.saveState);
  }

  componentWillUnmount() {
    this.saveState();
    window.removeEventListener("beforeunload", this.saveState);
  }

  private handleShowNewDeckDialog() {
    this.setState({ showNewDeckDialog: true });
  }

  private handleCloseNewDeck() {
    this.setState({ showNewDeckDialog: false });
  }

  handleNewDeck(deck: Cards.Deck) {
    console.debug(`Creating new deck named ${deck.name}`);
    this.setState((state) => ({
      decks: [...state.decks, deck],
      showNewDeckDialog: false
    }));
  }

  handleDeleteDeck(deck: Cards.Deck) {
    const index = this.state.decks.indexOf(deck);
    if (index === null) {
      console.error('Attempted to delete a deck at index null?');
      return;
    }
    if (!confirm(`Are you sure you want to delete the deck "${deck.name}"? This cannot be undone.`)) {
      return;
    }

    console.debug(`Deleting deck ${index}`);
    this.setState((state) =>
      update(state, {
        decks: { $splice: [[index, 1]] },
        currentDeckIndex: { $set: null }
      })
    );
  }

  private handleRestore(value: string) {
    let decks: Cards.Deck[] | undefined;
    try {
      decks = JSON.parse(value);
    } catch (err) {
      console.log(err);
      alert('Could not restore backup.');
      return;
    }
    this.setState((state) =>
      update(state, {
        decks: { $set: decks! } }));
    alert('Restore successful.');
  }

  saveState() {
    console.log("Saving state to localStorage");
    window.localStorage.setItem(decksStorageKey, JSON.stringify(this.state.decks));
  }

  private handleDraw(deck: Cards.Deck) {
    this.setState((state) => {
      const index = this.state.decks.indexOf(deck)!;
      const topCard = deck.cards[0];
      console.info("Drew", topCard);
      const currentCard = topCard;
      const numCards = deck.cards.length;
      let newDecks = update(state.decks,
        { [index]: { cards: { $splice: [[0, 1]] } } });
      newDecks = update(newDecks,
        { [index]: { cards: { $push: [topCard] } } });
      return { decks: newDecks, currentCard }
    });
  }

  private handleShuffle(deck: Cards.Deck, fingerprint: number) {
    const lfsr = new LFSR(fingerprint);
    console.debug("Shuffling deck");
    this.setState((state) => {
      const index = this.state.decks.indexOf(deck)!;
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
    const deckRoutes = this.state.decks.map((deck) => (
      <Route
        key={deck.id}
        path={`/deck/${deck.id.substr(0, 8)}`}
        render={() => (
          <React.Fragment>
            <Deck
              onDraw={this.handleDraw.bind(this, deck)}
              onShuffle={this.handleShuffle.bind(this, deck)}
              onDelete={this.handleDeleteDeck.bind(this, deck)}
              deck={deck} />
            <div id="draw-result-container">
              <DrawResult card={this.state.currentCard} />
            </div>
          </React.Fragment>
        )} />
    ));
    return (
      <HashRouter>
        <div>
          <Navbar decks={this.state.decks}
            onNewDeck={this.handleShowNewDeckDialog} />
          {deckRoutes}
          <Route
            path="/about"
            render={() => <ReactMarkdown source={aboutMarkdown} />} />
          <Route
            path="/backup-restore"
            render={() => <BackupRestore
              value={JSON.stringify(this.state.decks)}
              onRestore={this.handleRestore} />} />

          <ReactModal
            isOpen={this.state.showNewDeckDialog}
            className="modal"
            overlayClassName="overlay"
            onRequestClose={this.handleCloseNewDeck}
            closeTimeoutMS={200}>
            <NewDeckDialog onNewDeck={this.handleNewDeck} />
          </ReactModal>
        </div>
      </HashRouter>
    );
  }
}
