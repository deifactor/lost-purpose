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
}

export default class CardArtViewer extends React.Component<Props, State> {
  static defaultProps = {
    reversed: false,
    // A 1x1 default gif.
    back: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
  }

  constructor(props: Props) {
    super(props);
  }

  render() {
    const imageClassName = classNames("front", { reversed: this.props.reversed });
    const imgSrc = this.props.src || this.props.back;
    const className = classNames('card-art-viewer', {facedown: !this.props.src});
    return (
      <div className={className}>
        {this.props.src &&
          <img
            className={imageClassName}
            width={this.props.width}
            height={this.props.height}
            alt={this.props.alt}
            src={this.props.src} />}
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
