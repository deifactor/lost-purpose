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
    if (!this.props.card) {
      return null;
    }
    const formatter = new CardFormatter();
    const cardName = formatter.format(this.props.card);
    const imagePath = ArtFinder.path(this.props.card);
    return (
      <div className="draw-result">
        <CardArtViewer
          src={imagePath}
          alt={cardName}
          reversed={this.props.card.reversed}
          width={311}
          height={528} />
        <div className="card-name">{cardName}</div>
      </div>
    );
  }
}
