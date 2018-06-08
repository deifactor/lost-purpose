/// Skarot supports the Rider-Waite tarot deck as its 'basic' deck. In addition,
/// it also supports the [Tarot of the Silicon
/// Dawn](http://egypt.urnash.com/tarot/) by [Egypt
/// Urnash](http://egypt.urnash.com). The Silicon Dawn deck adds 21 extra cards:
/// four 99s in each suit, five cards in the new (VOID) suit, nine new major
/// arcana (including four variations on the Fool), and two cards that defy
/// classification. The deck is unfortunately out of print and I'm not aware of
/// any place that sells it for less than a hundred dollars (because fuck you),
/// but her site links to a zip file with all the artwork and her own
/// explanations for each. The deck has been included with permission.

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
enum Rank {
    // 1-10, plus 0 or 99 for Silicon Dawn
    Numeric(u8),
    Progeny,
    Cavalier,
    Queen,
    King
}

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
enum Suit {
    Wands,
    Cups,
    Swords,
    Pentacles,
    // Silicon Dawn only. Has a 0, Progeny, Cavalier, Queen, and King, but nothing else.
    VOID
}

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
struct MinorArcana {
    rank: Rank,
    suit: Suit
}

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
enum MajorArcana {
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
    AlephFour
}

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
enum Card {
    Major(MajorArcana),
    Minor(MinorArcana),
    /// A Silicon Dawn card with a glossy white galaxy on the front and nothing
    /// else.
    White,
    /// A Silicon Dawn card that looks the same on both sides.
    Black
}
