import * as React from "react";
import { OrientedCard } from './cards';
import { rws } from './interpret';

interface Props {
  card: OrientedCard
}

export const InterpretationView: React.SFC<Props> = (props) => {
  const { card } = props;
  let interpretation = rws(card);
  if (!interpretation) {
    return (
      <div className="interpretation">
        Unable to interpret card
      </div>
    );
  }

  const { fortuneTelling, keywords } = interpretation;

  const meanings = (card.reversed
    ? interpretation.meanings.reversed
    : interpretation.meanings.upright);
  const orientation = card.reversed ? "Reversed" : "Upright";

  return (
    <div className="interpretation">
      <h3>Fortune-telling</h3>
      <div>{listify(fortuneTelling)}</div>

      <h3>Keywords</h3>
      <div>{listify(keywords)}</div>

      <h3>{orientation} meanings</h3>
      <div>{listify(meanings)}</div>
    </div>
  );
}

function listify(strings: string[]): string {
  return strings.map((str) => str.toLocaleLowerCase()).join(" // ");
}
