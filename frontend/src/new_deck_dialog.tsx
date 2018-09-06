import * as React from "react";
import update from "immutability-helper";

interface Props {
  onNewDeck: (name: string) => void
}

interface State {
  form: {
    name: string
  }
}


export class NewDeckDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        name: ''
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
    this.props.onNewDeck(this.state.form.name);
  }

  render() {
    return (
      <div className="new-deck">
        <div className="modal-title">New deck</div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={this.handleChange}
            value={this.state.form.name} />
          <button type="submit">Add new deck</button>
        </form>
      </div>
    );
  }
}
