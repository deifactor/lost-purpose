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
  name: {id: string; falseName: string} | null;
}

export default class App extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleIdCallback = this.handleIdCallback.bind(this);
  }

  handleIdCallback(name: Name) {
    this.setState({name});
  }

  render() {
    return (
      <Login
        apiBase={this.props.apiBase}
        onIdCallback={this.handleIdCallback}
      />
    );
  }
}
