interface Oriented {
  reversed: boolean
};

/**
 * Shuffles the given array similarly to how a physical deck is shuffled: by
 * splitting it in two, turning the bottom half upside-down, and then
 * interleaving the cards in chunks starting from the bottom half.
 */
export function shuffle<T extends Oriented>(cards: Array<T>): Array<T>{
  if (cards.length == 1) {
    return cards;
  }

  // We'll cut the pile so that the left/top half has cut_point cards in it.
  const midpoint = Math.floor(cards.length / 2);
  const offset = Math.floor(cards.length / 6);
  const cutPoint = generateInteger(
    Math.max(midpoint - offset, 1),
    Math.min(midpoint + offset + 1, cards.length)
  );
  for (const card of cards.slice(cutPoint)) {
    card.reversed = !card.reversed;
  }
  const chunker = () => generateInteger(2, 4);
  const leftChunks = chunk(cards.slice(0, cutPoint), chunker);
  const rightChunks = chunk(cards.slice(cutPoint), chunker);

  let shuffled: Array<T> = [];
  for (let i = 0; i < Math.max(leftChunks.length, rightChunks.length); i++) {
    if (i < rightChunks.length) {
      shuffled = shuffled.concat(rightChunks[i]);
    }
    if (i < leftChunks.length) {
      shuffled = shuffled.concat(leftChunks[i]);
    }
  }
  return shuffled;
}

/**
 * Generates an integer in the range [low, high).
 */
function generateInteger(low: number, high: number): number {
  return Math.floor(low + Math.random() * (high - low));
}

/**
 * Splits the given array into chunks using the given function to determine the
 * size. The chunker must always return a number >= 1.
 */
function chunk<T>(array: Array<T>, chunker: () => number): Array<Array<T>> {
  const chunks = [];
  let offset = 0;
  while (offset < array.length) {
    const chunkSize = chunker();
    if (chunkSize < 1) {
      throw new Error(`Chunker gave invalid size ${chunkSize}`);
    }
    const end = offset + chunkSize;
    chunks.push(array.slice(offset, end));
    offset = end;
  }
  return chunks;
}
