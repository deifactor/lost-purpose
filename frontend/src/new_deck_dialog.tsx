import * as React from "react";
import update from "immutability-helper";

interface Props {
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
    }
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        </form>
      </div>
    );
  }
}
