/// An implementation of a [linear-feedback shift
/// register](https://en.wikipedia.org/wiki/Linear-feedback_shift_register).
/// **Do not use this for actual cryptography**! skarot only uses this because
/// it's *intentionally* not high-quality and LFSRs have personal significance
/// to the author (they were one of the first random number generators she
/// remembers reading about).
use rand_core::{impls, Error, RngCore};

#[derive(Clone, Debug)]
pub struct Lfsr {
    feed: u64,
    state: u64,
}

impl Lfsr {
    /// Constructs a new LFSR. The feed should be taken from one of [this list
    /// of feedback terms](http://users.ece.cmu.edu/~koopman/lfsr/index.html),
    /// since those produce maximal length sequences for all states. Note that
    /// supplying all zeroes as the state will result in it always returning
    /// zeros.
    pub fn new(feed: u64, state: u64) -> Lfsr {
        Lfsr { feed, state }
    }

    /// Constructs a new LFSR with a 64-bit state.
    pub fn new_64(state: u64) -> Lfsr {
        Lfsr {
            feed: 0x800000000000000D,
            state,
        }
    }

    pub fn next_bit(&mut self) -> bool {
        let bit = self.state & 1;
        self.state >>= 1;
        bit == 1
    }
}

impl RngCore for Lfsr {
    fn next_u64(&mut self) -> u64 {
        let mut out: u64 = 0;
        for _ in 0..64 {
            let bit = self.next_bit();
            if bit {
                self.state ^= self.feed;
                out |= 1
            }
            out <<= 1;
        }
        out
    }

    fn next_u32(&mut self) -> u32 {
        self.next_u64() as u32
    }

    fn fill_bytes(&mut self, dest: &mut [u8]) {
        impls::fill_bytes_via_next(self, dest)
    }

    fn try_fill_bytes(&mut self, dest: &mut [u8]) -> Result<(), Error> {
        Ok(self.fill_bytes(dest))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_zero_state() {
        let mut lfsr = Lfsr::new_64(0);
        assert_eq!(lfsr.next_u64(), 0);
        assert_eq!(lfsr.next_u64(), 0);
    }

    #[test]
    fn output_is_not_zero() {
        let mut lfsr = Lfsr::new_64(0x1);
        assert_ne!(lfsr.next_u64(), 0);
    }
}
