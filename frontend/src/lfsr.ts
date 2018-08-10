/**
 * An implementation of a linear-feedback shift register. **Do not use this
 * for actual cryptography!** It's *intentionally* not high-quality and LFSRs
 * have personal significance to the author (they were one of the first random)
 * (number generators she remembers reading about).
 */

export class LFSR {
  feed: number;
  state: number;

  // feed and state must be <= MAX_SAFE_INTEGER. The feed values should be taken from http://users.ece.cmu.edu/~koopman/lfsr/index.html.
  constructor(state: number, feed?: number) {
    if (!feed) {
      feed = 0x8000000000004;
    }
    if (feed > Number.MAX_SAFE_INTEGER || state > Number.MAX_SAFE_INTEGER) {
      throw new Error("Feed and state must be <= MAX_SAFE_INTEGER");
    }
    this.feed = feed;
    this.state = state;
  }

  // In general you shouldn't need this, but it being public makes testing vastly easier.
  public nextBit(): number {
    const bit = this.state & 1;
    this.state >>= 1;
    if (bit) {
      this.state ^= this.feed;
    }
    return bit;
  }

  // Generates uniformly-distributed random number in the range [0, 1) similar to Math.random().
  public random(): number {
    let out = 0;
    for (let i = 1; i < 53; i++) {
      out += this.nextBit() * Math.pow(2, -i);
    }
    return out;
  }
}
