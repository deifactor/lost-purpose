import * as React from "react";
import * as Cards from "./cards";
import update from "immutability-helper";
import * as uuid from "uuid";

interface Props {
  onNewDeck: (deck: Cards.Deck) => void
}

interface State {
  form: {
    name: string,
    deck: "silicon-dawn"
  }
}

const DECK_TO_ART = {
  "silicon-dawn": Cards.Art.SiliconDawn
};

export class NewDeckDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        name: '',
        deck: "silicon-dawn"
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<Element & { name: string }>) {
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
          update(state, { form: { name: { $set: deck } } }));
      default:
        throw new Error(`unknown input name ${target.name}`);
    }
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!this.state.form.name) {
      console.error("Cannot create a deck with an empty name");
      return;
    }
    const deck = {
      cards: Cards.standard(),
      name: this.state.form.name,
      id: uuid.v4()
    };
    this.props.onNewDeck(deck);
  }

  render() {
    return (
      <div className="new-deck">
        <div className="modal-title">New deck</div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={this.handleChange}
              value={this.state.form.name} />
            <button type="submit">Add new deck</button>
          </div>
          <div>
            <label htmlFor="deck">Deck</label>
            <select
              id="deck"
              name="deck"
              onChange={this.handleChange}
              value={this.state.form.deck}>
              <option value="silicon-dawn">Silicon Dawn</option>
            </select>
          </div>
        </form>
      </div>
    );
  }
}
