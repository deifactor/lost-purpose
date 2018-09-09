import * as React from "react";
import { OrientedCard } from './cards';
import { interpret } from './interpret';

interface Props {
  card: OrientedCard
}

export const InterpretationView: React.SFC<Props> = (props) => {
  const { card } = props;
  let interpretation = interpret(card);
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
      <div>{fortuneTelling.join(", ")}</div>

      <h3>Keywords</h3>
      <div>{keywords.join(", ")}</div>

      <h3>{orientation} meanings</h3>
      <div>{meanings.join(", ")}</div>
    </div>
  );
}
