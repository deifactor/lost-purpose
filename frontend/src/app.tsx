import * as React from "react";
import Login from "./login";

interface Props {
  apiBase: string;
}

interface Name {
  id: string;
  falseName: string;
}


interface State {
  name?: Name;
}

const nameStorageKey = 'name';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const savedName = localStorage.getItem(nameStorageKey);
    if (savedName != null) {
      this.state = { name: JSON.parse(savedName) };
    } else {
      this.state = {};
    }
    this.handleIdCallback = this.handleIdCallback.bind(this);
  }

  handleIdCallback(name: Name) {
    this.setState({ name });
    localStorage.setItem(nameStorageKey, JSON.stringify(name));
  }

  render() {
    const login =
      <Login
        apiBase={this.props.apiBase}
        onIdCallback={this.handleIdCallback}
      />;
    if (!this.state.name) {
      return <div>{login}</div>;
    } else {
      return <div>
        {login}
        <div>Your false name is {this.state.name.falseName}</div>
      </div>
    }
  }
}
