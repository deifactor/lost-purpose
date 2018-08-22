/**
 * A function for finding the path to the art asset for a given card. This is
 * separate from the card loic so that we don't have to mess around with
 * webpack's require.context when testing pure logic.
 */
import { Card, Art, CardKind, MajorArcana, Rank, Suit, Color } from "./cards";

const siliconDawnAscii = require.context("../assets/silicon-dawn-ascii", true, /\.png$/);

export function path(card: Card) {
  return context(card.art)(`./${fileName(card)}.png`);
}

export function thumbnail(card: Card) {
  return context(card.art)(`./thumbs/${fileName(card)}.png`);
}

export function back(card: Card) {
  switch (card.art) {
    case Art.SiliconDawn: return siliconDawnAscii("./black.png");
  }
}

/**
 * Finds the filename of the card in the repository/as the input to file-loader.
 */
function fileName(card: Card): string {
  switch (card.kind) {
    case CardKind.Major:
      switch (card.arcana) {
        case MajorArcana.Maya: return "8½";
        case MajorArcana.Vulture: return "13x";
        case MajorArcana.SheIsLegend: return "VIII";
        case MajorArcana.History: return "X";
        case MajorArcana.AlephFour: return "N4";
        default:
          return twoDigitNumber(card.arcana);
      }
    case CardKind.Minor:
      return `${twoDigitNumber(card.rank)}-${suitComponent(card.suit)}`;
    case CardKind.Extra:
      switch (card.color) {
        case Color.White: return "white";
        case Color.Black: return "black";
      }
  }
  throw new Error(`Impossible card ${JSON.stringify(card)}`);
}

function twoDigitNumber(n: number) {
  return n < 10 ? "0" + n.toString() : n.toString();
}

function suitComponent(suit: Suit) {
  switch (suit) {
    case Suit.Cups: return "cups";
    case Suit.Pentacles: return "pent";
    case Suit.Swords: return "swords";
    case Suit.Wands: return "wands";
    case Suit.Void: return "VOID';"
  }
}

function context(art: Art): (id: string) => string {
  switch (art) {
    case Art.SiliconDawn: return siliconDawnAscii;
  }
}
