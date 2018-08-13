import * as React from "react";
import CRC32 = require('crc-32');
import './styles/prompter.css';
import classNames = require('classnames');

interface Props {
  // Invoked when we've computed a fingerprint from the user's input.
  onFingerprintComputed: (fingerprint: number) => void,
  // Number of milliseconds to fingerprint the input for.
  duration: number,
}

interface State {
  // If we're currently in the middle of stretching the fingerprint, the intermediate fingerprint.
  fingerprint: number | null,
  // Whether the current fingerprint has finished being computed.
  finished: boolean,
  input: string
}

/**
 * Asks the user for a string (i.e., the question they want to ask the Tarot deck)
 * and repeatedly CRC32s their input until a second has passed.
 */
export class Prompter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.duration <= 0) {
      throw new Error(`Duration {props.duration} should be positive`);
    }
    this.state = {
      fingerprint: null,
      finished: false,
      input: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
  }

  private handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ input: e.currentTarget.value });
  }

  private async handleInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (this.state.input == "") {
      return;
    }
    this.setState({ input: "" });
    console.log(`User asked: ${this.state.input}`);
    const start = new Date().getTime();
    let fingerprint = CRC32.str(this.state.input);
    while (new Date().getTime() - start < this.props.duration) {
      for (let i = 0; i < 100; i++) {
        fingerprint = CRC32.str(fingerprint.toString(16));
        if (fingerprint < 0) {
          fingerprint += Math.pow(2, 32);
        }
      }
      this.setState({ fingerprint });
      await delay(50);
    }
    console.debug(`Done stretching; result is ${fingerprint}`);
    this.setState({ finished: true });
    this.props.onFingerprintComputed(fingerprint);
    // No need to clear the state since we'll get unmounted when the modal closes.
  }

  render() {
    const fingerprinting = this.state.fingerprint !== null;
    const title = this.state.finished ? "entropy extracted" :
      fingerprinting ? "contemplating..." :
        "input query";
    const formClasses = classNames({ visible: !fingerprinting, invisible: fingerprinting });
    const fingerprintClasses = classNames(
      'fingerprint',
      { visible: fingerprinting, invisible: !fingerprinting },
      { finished: this.state.finished });
    return (
      <div className="prompter">
        <div className="modal-title">{title}</div>
        <div className="body">
          <form onSubmit={this.handleInputSubmit} className={classNames(formClasses)}>
            <input type="text" onChange={this.handleInputChange} value={this.state.input} />
            <button type="submit">Ask</button>
          </form>
          <div className={classNames(fingerprintClasses)}>
            {formatFingerprint(this.state.fingerprint || 0)}
          </div>
        </div>
      </div>
    );
  }
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatFingerprint(fingerprint: number): string {
  let str = fingerprint.toString(16);
  while (str.length < 8) {
    str = "0" + str;
  }
  return str;
}
