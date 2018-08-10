import * as React from "react";
import CRC32 = require('crc-32');

interface Props {
  // Invoked when we've computed a fingerprint from the user's input.
  onFingerprintComputed: (fingerprint: number) => void,
  // Number of milliseconds to fingerprint the input for.
  duration: number,
  children: React.ReactNode
}

interface State {
  // If we're currently in the middle of stretching the fingerprint, the intermediate fingerprint.
  fingerprint: number | null,
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
    this.setState({input: ""});
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
      this.setState({fingerprint});
      await delay(50);
    }
    console.debug(`Done stretching; result is ${fingerprint}`);
    this.setState({fingerprint: null});
    this.props.onFingerprintComputed(fingerprint);
  }

  render() {
    if (this.state.fingerprint !== null) {
      return <div className="fingerprint">{formatFingerprint(this.state.fingerprint)}</div>;
    } else {
      return <div>
        {this.props.children}
        <form onSubmit={this.handleInputSubmit}>
          <input type="text" onChange={this.handleInputChange} value={this.state.input} />
          <button type="submit">Ask</button>
        </form>
      </div>
    }
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
