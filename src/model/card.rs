/// Lost Purpose supports the Rider-Waite tarot deck as its 'basic' deck. In
/// addition, it also supports the [Tarot of the Silicon
/// Dawn](http://egypt.urnash.com/tarot/) by [Egypt
/// Urnash](http://egypt.urnash.com). The Silicon Dawn deck adds 21 extra cards:
/// four 99s in each suit, five cards in the new (VOID) suit, nine new major
/// arcana (including four variations on the Fool), and two cards that defy
/// classification. The deck is unfortunately out of print and I'm not aware of
/// any place that sells it for less than a hundred dollars (because fuck you),
/// but her site links to a zip file with all the artwork and her own
/// explanations for each. The deck has been included with permission.
use std::slice;

#[derive(Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum Rank {
    /// Only used in Silicon Dawn.
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Progeny,
    Cavalier,
    Queen,
    King,
    /// Only used in Silicon Dawn.
    NinetyNine,
}

impl Rank {
    /// An iterator over the standard ranks in ascending order.
    pub fn standard() -> slice::Iter<'static, Self> {
        use self::Rank::*;
        [
            One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Progeny, Cavalier, Queen,
            King,
        ].into_iter()
    }
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum Suit {
    Wands,
    Cups,
    Swords,
    Pentacles,
    // Silicon Dawn only. Has a 0, Progeny, Cavalier, Queen, and King, but nothing else.
    VOID,
}

impl Suit {
    /// An iterator over the standard suits.
    pub fn standard() -> slice::Iter<'static, Self> {
        use self::Suit::*;
        [Wands, Cups, Swords, Pentacles].into_iter()
    }
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct MinorArcana {
    pub rank: Rank,
    pub suit: Suit,
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum MajorArcana {
    // Silicon Dawn has five fools but we don't distinguish between them here;
    // for now, we always use 0(0). TODO: deunify the Fools.
    Fool,
    Magician,
    HighPriestess,
    Empress,
    Emperor,
    HighPriest,
    Lovers,
    Chariot,
    Fortitude,
    Hermit,
    Fortune,
    Justice,
    HangedMan,
    Death,
    Temperance,
    Devil,
    Tower,
    Star,
    Moon,
    Sun,
    Judgement,
    Universe,
    // Silicon Dawn arcana
    Maya,
    Vulture,
    SheIsLegend,
    History,
    AlephFour,
}

impl MajorArcana {
    pub fn standard() -> slice::Iter<'static, Self> {
        use self::MajorArcana::*;
        [
            Fool,
            Magician,
            HighPriestess,
            Empress,
            Emperor,
            HighPriest,
            Lovers,
            Chariot,
            Fortitude,
            Hermit,
            Fortune,
            Justice,
            HangedMan,
            Death,
            Temperance,
            Devil,
            Tower,
            Star,
            Moon,
            Sun,
            Judgement,
            Universe,
        ].into_iter()
    }

    /// An iterator over the arcana *only* present in the Silicon Dawn arcana.
    pub fn silicon_dawn() -> slice::Iter<'static, Self> {
        use self::MajorArcana::*;
        [Maya, Vulture, SheIsLegend, History, AlephFour].into_iter()
    }
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum Card {
    Major(MajorArcana),
    Minor(MinorArcana),
    /// A Silicon Dawn card with a glossy white galaxy on the front and nothing
    /// else.
    White,
    /// A Silicon Dawn card that looks the same on both sides.
    Black,
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn count_ranks() {
        assert_eq!(Rank::standard().count(), 14)
    }

    #[test]
    fn count_suits() {
        assert_eq!(Suit::standard().count(), 4)
    }

    #[test]
    fn count_major_arcana() {
        assert_eq!(MajorArcana::standard().count(), 22);
        assert_eq!(MajorArcana::silicon_dawn().count(), 5)
    }
}
