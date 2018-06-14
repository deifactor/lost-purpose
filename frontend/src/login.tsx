import * as React from "react";

interface Props {
  // A callback to invoke when we get an proper ID.
  onIdCallback: (name: {id: string; falseName: string}) => any;
  apiBase: string;
}

interface State {
  // The currently-entered false name.
  falseName: string;
  // The latest error we got when trying to get the ID, if any.
  error: string | null;
}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { falseName: "", error: null };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ falseName: e.currentTarget.value });
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const falseName = this.state.falseName;
    if (falseName == '') {
      return;
    }

    console.trace("Requesting false name", this.state.falseName);
    const response = await fetch(`${this.props.apiBase}/id/${this.state.falseName}`);
    if (response.ok) {
      this.setState({error: null});
      const id: string = await response.json();
      console.log("Got id", id);
      this.props.onIdCallback({id, falseName});
    } else {
      const error: {err: string}  = await response.json();
      console.error("Error retrieving id", error);
      this.setState({error: error.err});
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text"
          placeholder="False name"
          onChange={this.handleChange}
          value={this.state.falseName}
        />
        <button type="submit">
          speak thy name
        </button>
        {this.state.error && <div>{this.state.error}</div>}
      </form>
    );
  }
}

