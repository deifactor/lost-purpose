/// A deck is basically just a vector of `card::Card`s with some fancy dressing.
use card::*;

#[derive(Debug)]
pub struct Deck {
    cards: Vec<Card>,
}

impl Deck {
    /// Constructs a new deck with the standard 22 major arcana and 56 minor
    /// arcana. The order is unspecified but is *not* randomized.
    pub fn standard() -> Deck {
        let cards = iproduct!(Rank::standard(), Suit::standard())
            .map(|(&rank, &suit)| Card::Minor(MinorArcana { rank, suit }))
            .chain(MajorArcana::standard().map(|&arc| Card::Major(arc)))
            .collect();
        Deck {
            cards,
        }
    }

    /// Constructs a new Silicon Dawn deck. The order is unspecified but is
    /// *not* randomized.
    pub fn silicon_dawn() -> Deck {
        let minor = iproduct!(Rank::standard(), Suit::standard())
            .map(|(&rank, &suit)| Card::Minor(MinorArcana { rank, suit }));
        let ninety_nines = Suit::standard().map(|&suit| {
            Card::Minor(MinorArcana {
                rank: Rank::Numeric(99),
                suit,
            })
        });
        let voids = [
            Rank::Numeric(0),
            Rank::Progeny,
            Rank::Cavalier,
            Rank::Queen,
            Rank::King,
        ].into_iter()
            .map(|&rank| {
                Card::Minor(MinorArcana {
                    rank,
                    suit: Suit::VOID,
                })
            });
        let major = MajorArcana::standard()
            .chain(MajorArcana::silicon_dawn())
            .map(|&arc| Card::Major(arc));
        let extra = [Card::White, Card::Black].into_iter();
        let cards = minor
            .chain(ninety_nines)
            .chain(voids)
            .chain(major)
            .chain(extra.cloned())
            .collect();
        Deck {
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
        assert_eq!(Deck::standard().cards().len(), 78)
    }

    #[test]
    fn count_silicon_dawn() {
        assert_eq!(Deck::silicon_dawn().cards().len(), 94)
    }
}
