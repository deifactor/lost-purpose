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
    const imageClassName = classNames({ reversed: this.props.reversed });
    const imgSrc = this.props.src || this.props.back;
    return (
      <div className="card-art-viewer">
        <div className="container">
          <img
            width={this.props.width}
            height={this.props.height}
            alt={this.props.alt}
            className={imageClassName}
            src={this.props.src || this.props.back} />
        </div>
      </div>
    );
  }
}
