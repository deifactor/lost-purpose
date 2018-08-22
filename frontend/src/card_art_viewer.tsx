import * as React from "react";
import * as Cards from "./cards";
import classNames = require('classnames');
import delay from "delay";

import './styles/card_art_viewer.css';

interface Props {
  /** The currently-displayed image. If null, the card back is displayed. */
  src?: string,
  /** Alt text for the image. */
  alt?: string,
  /** If true, the card should be displayed reversed (upside-down). */
  reversed?: boolean,
  width: number,
  height: number,
  /** What to use for the card back. If null, uses solid black. */
  back?: string
}

interface State {
  facedown: boolean,
  /**
   * The image that we're *actually* currently displaying. This doesn't change
   * when src changes until after the card's been flipped face-down.
   */
  displayed: { src: string, reversed: boolean } | undefined
}

export default class CardArtViewer extends React.Component<Props, State> {
  static defaultProps = {
    reversed: false,
  }

  constructor(props: Props) {
    super(props);
    this.state = { facedown: true, displayed: undefined };
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    const { displayed, facedown } = state;
    if (facedown && props.src) {
      // If we're face down and the user draws again, just flip us up. This
      // should only happen either on the first draw or if the user draws in the
      // small delay between facedown and faceup, but it also avoids a bug where we
      // somehow forget to turn faceup and we get stuck.
      return { facedown: false, displayed: { src: props.src, reversed: props.reversed || false } }
    } else if (displayed && displayed.src != props.src) {
      return { facedown: true };
    } else {
      return null;
    }
  }

  private async handleTransitionEnd() {
    if (!this.state.facedown) {
      return;
    }
    // Aesthetic delay. Not necessary, but it looks nice.
    await delay(100);
    if (this.props.src) {
      this.setState({
        facedown: false,
        displayed: { src: this.props.src, reversed: this.props.reversed || false }
      });
    }
  }

  render() {
    const { displayed } = this.state;
    const className = classNames('card-art-viewer', { facedown: this.state.facedown });
    const backClass = classNames('back', { 'has-back': this.props.back });
    const backSrc = this.props.back ||
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    return (
      <div className={className}
        onTransitionEnd={this.handleTransitionEnd}>
        {displayed &&
          <img
            className={classNames("front", { reversed: displayed.reversed })}
            width={this.props.width}
            height={this.props.height}
            alt={this.props.alt}
            src={displayed.src} />}
        <img
          className={backClass}
          width={this.props.width}
          height={this.props.height}
          alt="card back"
          src={backSrc} />
      </div>
    );
  }
}
