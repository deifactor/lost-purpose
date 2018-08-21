import * as React from "react";
import * as Cards from "./cards";
import * as ArtFinder from "./art_finder";
import { CardFormatter } from "./card_formatter";

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
      <div>
        <img src={imagePath} alt={cardName}/>
        <div>{cardName}</div>
      </div>
    );
  }
}
