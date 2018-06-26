import * as React from "react";
import Login from "./login";

interface Props {
  apiBase: string;
}

interface User {
  id: string;
  email: string;
}


interface State {
  user?: User;
}

const userStorageKey = 'user';

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const savedUser = localStorage.getItem(userStorageKey);
    if (savedUser != null) {
      this.state = { user: JSON.parse(savedUser) };
    } else {
      this.state = {};
    }
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(user: User) {
    this.setState({ user });
    localStorage.setItem(userStorageKey, JSON.stringify(user));
  }

  render() {
    const login =
      <Login
        apiBase={this.props.apiBase}
        onLogin={this.handleLogin}
      />;
    if (!this.state.user) {
      return <div>{login}</div>;
    } else {
      return <div>
        {login}
        <div>Your e-mail address is {this.state.user.email}</div>
      </div>
    }
  }
}
