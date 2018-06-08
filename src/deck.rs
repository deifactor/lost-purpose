/// A deck is basically just a vector of `card::Card`s with some fancy dressing.
/// In particular, we allow decks to be named (in case someone might want
/// different decks?), define a method for shuffling a deck using an RNG and so
/// on.
use itertools::Itertools;

use card::*;

#[derive(Debug)]
pub struct Deck {
    name: String,
    cards: Vec<Card>,
}

impl Deck {
    /// Constructs a new deck with the standard 22 major arcana and 56 minor
    /// arcana. The order is unspecified but is *not* randomized.
    pub fn standard<S: Into<String>>(name: S) -> Deck {
        let cards = Rank::standard()
            .cartesian_product(Suit::standard())
            .map(|(&rank, &suit)| Card::Minor(MinorArcana { rank, suit }))
            .chain(MajorArcana::standard().map(|&arc| Card::Major(arc)))
            .collect();
        Deck {
            name: name.into(),
            cards,
        }
    }

    pub fn cards(&self) -> &Vec<Card> {
        &self.cards
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn count_standard_deck() {
        assert_eq!(Deck::standard("").cards().len(), 78)
    }
}
