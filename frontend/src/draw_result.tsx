import * as React from "react";
import * as Cards from "./cards";
import * as ArtFinder from "./art_finder";
import { CardFormatter } from "./card_formatter";
import CardArtViewer from "./card_art_viewer";

import './styles/draw_result.css';

interface Props {
  card: Cards.OrientedCard | null
}

export default class DrawResult extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const formatter = new CardFormatter();
    const cardName = this.props.card ? formatter.format(this.props.card) : undefined;
    const imagePath = this.props.card ? ArtFinder.path(this.props.card) : undefined;
    // XXX: Don't hardcode the width and the height.
    return (
      <div className="draw-result">
        <CardArtViewer
          src={imagePath}
          alt={cardName}
          reversed={this.props.card ? this.props.card.reversed : undefined}
          width={311}
          height={528} />
        <div className="card-name">{cardName}</div>
      </div>
    );
  }
}