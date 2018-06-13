import * as React from "react";
import Login from "./login";

interface Props {
  apiBase: string;
}

export default class App extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Login
        apiBase={this.props.apiBase}
      />
    );
  }
}
