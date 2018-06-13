import * as React from "react";

interface Props {
  apiBase: string;
}

interface State {
  falseName: string;
}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { falseName: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ falseName: e.currentTarget.value });
  }

  handleClick(e: React.FormEvent<HTMLButtonElement>) {
    debugger;
    const falseName = this.state.falseName;
    if (falseName == '') {
      return;
    }
    console.debug('Converting false name ', falseName);
  }

  render() {
    return (
      <div>
        <input type="text"
          placeholder="False name"
          onChange={this.handleChange}
          value={this.state.falseName}
        />
        <button
          onClick={this.handleClick}>
          speak thy name
        </button>
      </div>
    );
  }
}

