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

export const DrawResult: React.SFC<Props> = (props) => {
  const formatter = new CardFormatter();
  const { card } = this.props;
  const cardName = card ? formatter.format(card) : undefined;
  const viewerProps = card ?
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
        {...viewerProps}
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
