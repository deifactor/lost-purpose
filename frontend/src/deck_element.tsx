import * as React from "react";
import * as Cards from "./cards";

interface Props {
  deck: Cards.Deck,
  onDraw: () => void,
  onShuffle: () => void
}

interface State {
}

export default class Deck extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <h3>{this.props.deck.name}</h3>
        <button onClick={this.props.onDraw}>Draw</button>
        <button onClick={this.props.onShuffle}>Shuffle</button>
      </div>
    );
  }
}
