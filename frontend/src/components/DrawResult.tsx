import * as React from "react";
import * as Cards from "../cards/cards";
import * as ArtFinder from "../cards/artFinder";
import { CardFormatter } from "../cards/cardFormatter";
import CardArtViewer from "./CardArtViewer";
import { InterpretationView } from "./InterpretationView";

import '../styles/draw_result.scss';

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
             <h2 className="card-name">{cardName}</h2>
             <InterpretationView card={card} />
           </React.Fragment>
          }
        </div>
      </div>
    );
  }
}
