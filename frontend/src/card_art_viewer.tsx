import * as React from "react";
import * as Cards from "./cards";
import classNames = require('classnames');

import './styles/card_art_viewer.css';

interface Props {
  /** The currently-displayed image. If null, the card back is displayed. */
  src: string | undefined,
  /** Alt text for the image. */
  alt: string | undefined,
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
  displayedSrc: string | undefined
}

export default class CardArtViewer extends React.Component<Props, State> {
  static defaultProps = {
    reversed: false,
    // A 1x1 default gif.
    back: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
  }

  constructor(props: Props) {
    super(props);
    this.state = { facedown: true, displayedSrc: undefined };
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!state.displayedSrc && props.src) {
      // Initial transformation showing the first card.
      return { facedown: false, displayedSrc: props.src };
    } else if (state.displayedSrc != props.src) {
      return { facedown: true };
    }
  }

  private handleTransitionEnd() {
    if (this.state.facedown) {
      this.setState({
        facedown: false,
        displayedSrc: this.props.src
      });
    }
  }

  render() {
    const imageClassName = classNames("front", { reversed: this.props.reversed });
    const { displayedSrc } = this.state;
    const className = classNames('card-art-viewer', { facedown: this.state.facedown });
    return (
      <div className={className}
        onTransitionEnd={this.handleTransitionEnd}>
        {displayedSrc &&
          <img
            className={imageClassName}
            width={this.props.width}
            height={this.props.height}
            alt={this.props.alt}
            src={displayedSrc} />}
        <img
          className="back"
          width={this.props.width}
          height={this.props.height}
          alt="card back"
          src={this.props.back} />
      </div>
    );
  }
}
