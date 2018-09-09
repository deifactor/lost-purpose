import * as React from "react";
import * as Cards from "./cards";
import * as ArtFinder from "./art_finder";
import { CardFormatter } from "./card_formatter";
import CardArtViewer from "./card_art_viewer";
import { InterpretationView } from "./interpretation_view";

import './styles/draw_result.scss';

interface Props {
  card: Cards.OrientedCard | null
}

export default class DrawResult extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const formatter = new CardFormatter();
    const { card } = this.props;
    const cardName = card ? formatter.format(card) : undefined;
    const props = card ?
      {
        src: ArtFinder.path(card),
        alt: cardName,
        back: ArtFinder.back(card),
        reversed: card.reversed
      } : {};
    // XXX: Don't hardcode the width and the height.
    return (
      <div className="draw-result">
        <CardArtViewer
          {...props}
          width={311}
          height={528} />
        <div className="card-info">
          {card &&
           <React.Fragment>
             <div className="card-name">{cardName}</div>
             <InterpretationView card={card} />
           </React.Fragment>
          }
        </div>
      </div>
    );
  }
}
