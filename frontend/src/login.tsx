import * as React from "react";

interface Props {
  // A callback to invoke when we get an proper ID.
  onLogin: (name: { id: string; email: string }) => any;
  apiBase: string;
}

interface State {
  // The currently-entered email.
  email: string;
  // The latest error we got when trying to get the ID, if any.
  error: string | null;
}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { email: "", error: null };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ email: e.currentTarget.value });
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = this.state.email;
    if (email == '') {
      return;
    }

    console.trace("Logging in as", this.state.email);
    const response = await fetch(`${this.props.apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (response.ok) {
      this.setState({ error: null });
      const id: string = await response.json();
      console.log("Got id", id);
      this.props.onLogin({ id, email });
    } else {
      const error: string = await response.json();
      console.error("Error retrieving id: ", error);
      this.setState({ error: error });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text"
          placeholder="E-mail address"
          onChange={this.handleChange}
          value={this.state.email}
        />
        <button type="submit">
          login
        </button>
        {this.state.error && <div>{this.state.error}</div>}
      </form>
    );
  }
}

