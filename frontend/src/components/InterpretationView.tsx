import * as React from 'react';
import { Art, OrientedCard } from '../cards/cards';
import * as interpret from '../cards/interpret';

interface Props {
  card: OrientedCard
}

export const InterpretationView: React.SFC<Props> = (props) => {
  const { card } = props;
  if (card.art == Art.SiliconDawn) {
    return renderSiliconDawn(card);
  } else {
    return renderRws(card);
  }
}

function renderRws(card: OrientedCard): JSX.Element {
  let interpretation = interpret.rws(card);
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

function renderSiliconDawn(card: OrientedCard): JSX.Element {
  let interpretation = interpret.siliconDawn(card);
  if (!interpretation) {
    return (
      <div className="interpretation">
        Unable to interpret card
      </div>
    );
  }

  const { title, meaning } = interpretation;

  function renderLine(line: string, index: number) {
    // Ugly hack to make the 99 of Cups render properly.
    if (line.startsWith("<pre>")) {
      return <pre key={index}>{line.slice("<pre>".length)}</pre>
    } else {
      return <p key={index}>{line}</p>
    }
  }

  return (
    <div className="interpretation">
      <h3>{title}</h3>
      {meaning.map(renderLine)}
    </div>
  );
}

function listify(strings: string[]): string {
  return strings.map((str) => str.toLocaleLowerCase()).join(" // ");
}
