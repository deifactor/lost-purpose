import * as React from "react";
import * as Cards from "./cards";

interface Props {
  deck: Cards.Deck
}

interface State {
}

export default class Deck extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <h3>{this.props.deck.name}</h3>
      </div>
    );
  }
}
