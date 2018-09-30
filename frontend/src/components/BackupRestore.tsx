import * as React from "react";

import "../styles/backup-restore.scss";

type Props = {
  value: string;
  onRestore: (value: string) => void;
};

type State = {
  restoreValue: string;
};

export class BackupRestore extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { restoreValue: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <div className="backup-restore">
        <section>
          <h2>Backup</h2>
          <p>
            To backup the state of your decks, copy the below text and store it somewhere safe.
            This includes everything about your decks, including their names, the order of the cards,
            and so on.
          </p>
          <textarea readOnly={true} value={this.props.value} />
        </section>
        <hr />
        <section>
          <h2>Restore</h2>
          <p>
            To restore the state of your decks, paste one of your previous backups into the below
            dialog, then click the button. Note that this will <i>permanently</i> overwrite your
            current decks.
          </p>
          <textarea onChange={this.handleChange} value={this.state.restoreValue} />
          <div className="restore-button-container">
            <button onClick={() => this.props.onRestore(this.state.restoreValue)}>Restore</button>
          </div>
        </section>
      </div>
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ restoreValue: e.target.value });
  }
}
