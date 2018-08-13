import * as React from "react";
import * as Cards from "./cards";
import * as ReactModal from 'react-modal';
import { Prompter } from "./prompter";
import './styles/modal.css';

interface Props {
  deck: Cards.Deck,
  onDraw: () => void,
  onShuffle: (fingerprint: number) => void
}

interface State {
  showPrompter: boolean
}

export default class Deck extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showPrompter: false };
    this.startShuffle = this.startShuffle.bind(this);
    this.handleFingerprintComputed = this.handleFingerprintComputed.bind(this);
  }

  private startShuffle() {
    this.setState({ showPrompter: true });
  }

  private handleFingerprintComputed(fingerprint: number) {
    this.props.onShuffle(fingerprint);
    setTimeout(() => this.setState({ showPrompter: false }), 4000);
  }

  render() {
    return (
      <div>
        <h3>{this.props.deck.name}</h3>
        <button onClick={this.props.onDraw}>Draw</button>
        <button onClick={this.startShuffle}>Shuffle</button>
        <ReactModal
          isOpen={this.state.showPrompter}
          className="modal"
          overlayClassName="overlay"
          style={{ content: { width: "500px" } }}
          closeTimeoutMS={200}>
          <Prompter onFingerprintComputed={this.handleFingerprintComputed} duration={3000} />
        </ReactModal>
      </div>
    );
  }
}
