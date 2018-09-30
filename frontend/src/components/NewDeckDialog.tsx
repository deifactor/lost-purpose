import delay from "delay";
import update from "immutability-helper";
import * as React from "react";
import ReactModal = require("react-modal");
import * as uuid from "uuid";
import * as Cards from "../cards/cards";
import { LFSR } from "../cards/lfsr";
import { shuffle } from "../cards/shuffle";
import { Prompter } from "./Prompter";

import "../styles/dialog_form.scss";

interface Props {
  onNewDeck: (deck: Cards.Deck) => void;
}

interface State {
  showPrompter: boolean;
  form: {
    name: string,
    deck: "silicon-dawn" | "rider-waite-smith" | "neon-moon",
    voidSuit: boolean,
    ninetyNines: boolean,
    extraArcana: boolean,
  };
}

const DECK_TO_ART = {
  "silicon-dawn": Cards.Art.SiliconDawn,
  "rider-waite-smith": Cards.Art.RiderWaiteSmith,
  "neon-moon": Cards.Art.RiderWaiteSmith,
};

export class NewDeckDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showPrompter: false,
      form: {
        name: "",
        deck: "rider-waite-smith",
        voidSuit: true,
        ninetyNines: true,
        extraArcana: true,
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFingerprintComputed = this.handleFingerprintComputed.bind(this);
  }

  public handleChange(e: React.ChangeEvent<Element & { name: string }>) {
    const target = e.target;
    switch (target.name) {
      case "name":
        const name = (target as HTMLInputElement).value;
        this.setState((state) =>
          update(state, { form: { name: { $set: name } } }));
        break;
      case "deck":
        const deck = (target as HTMLSelectElement).value;
        this.setState((state) =>
          update(state, { form: { deck: { $set: deck } } }));
        break;
      case "voidSuit":
      case "ninetyNines":
      case "extraArcana":
        const checked = (target as HTMLInputElement).checked;
        this.setState((state) =>
          update(state, { form: { [target.name]: { $set: checked } } }));
        break;
      default:
        throw new Error(`unknown input name ${target.name}`);
    }
  }

  public handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!this.state.form.name) {
      console.error("Cannot create a deck with an empty name");
      return;
    }
    this.setState({showPrompter: true});
  }

  public async handleFingerprintComputed(fingerprint: number) {
    let cards: Cards.OrientedCard[] = [];
    switch (this.state.form.deck) {
      case "silicon-dawn":
        cards = Cards.siliconDawn(this.state.form);
        break;
      case "rider-waite-smith":
        cards = Cards.standard();
        break;
      case "neon-moon":
        cards = Cards.standard(Cards.Art.NeonMoon);
        break;
    }
    const lfsr = new LFSR(fingerprint);
    // Ten times is enough to get some actual mixing.
    for (let i = 0; i < 10; i++) {
      cards = shuffle(cards, lfsr);
    }
    const deck = {
      cards,
      name: this.state.form.name,
      id: uuid.v4(),
    };
    await delay(4000);
    this.props.onNewDeck(deck);
  }

  public render() {
    const submissionDisabled = !this.state.form.name;

    return (
      <div className="new-deck">
        <div className="modal-title">New deck</div>
        <form className="dialog-form" onSubmit={this.handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoFocus={true}
            onChange={this.handleChange}
            value={this.state.form.name} />
          <label htmlFor="deck">Deck</label>
          <select
            id="deck"
            name="deck"
            onChange={this.handleChange}
            value={this.state.form.deck}>
            <option value="silicon-dawn">Silicon Dawn</option>
            <option value="rider-waite-smith">Rider-Waite-Smith</option>
            <option value="neon-moon">Neon Moon</option>
          </select>

          {this.state.form.deck == "silicon-dawn" &&
            <React.Fragment>
              <label htmlFor="voidSuit">VOID suit</label>
              <input id="voidSuit" name="voidSuit" type="checkbox" defaultChecked={this.state.form.voidSuit} />

              <label htmlFor="ninetyNines">99 of [suit]</label>
              <input id="ninetyNines" name="ninetyNines" type="checkbox" defaultChecked={this.state.form.ninetyNines} />

              <label htmlFor="extraArcana">Extra arcana</label>
              <input id="extraArcana" name="extraArcana" type="checkbox" defaultChecked={this.state.form.extraArcana} />
            </React.Fragment>
          }

          <div className="button-row">
            <button type="submit" disabled={submissionDisabled}>Create & shuffle deck</button>
          </div>
        </form>

        <ReactModal
          isOpen={this.state.showPrompter}
          className="modal"
          overlayClassName="overlay"
          closeTimeoutMS={200}>
          <Prompter onFingerprintComputed={this.handleFingerprintComputed} duration={3000} />
        </ReactModal>
      </div>
    );
  }
}
