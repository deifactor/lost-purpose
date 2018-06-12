/// A false name is the display version of a 64-bit identifier. False names are
/// generated using a slightly modified version of the PGP word list with most
/// of the proper nouns (and a couple maybe-sensitive words) modified.
use byteorder::{BigEndian, ByteOrder};
use itertools::Itertools;
use std::collections::HashMap;

pub fn to_false_name(id: u64) -> String {
    let mut bytes = [0u8; 8];
    BigEndian::write_u64(&mut bytes, id);
    bytes
        .into_iter()
        .enumerate()
        .map(|(index, &byte)| {
            if index % 2 == 0 {
                BYTE_TO_WORD[byte as usize].0
            } else {
                BYTE_TO_WORD[byte as usize].1
            }
        })
        .join(" ")
}

/// This will fail if the string is not a valid false name. False names are not
/// sensitive to capitalization, punctuation between words, or space at the
/// start (so `'foo bar baz'`, `'Foo Bar BAZ'`, and `' foo-bar...baz '` are all
/// equivalent). However, it makes no attempts to correct typos.
pub fn from_false_name(false_name: &str) -> Result<u64, FalseNameError> {
    let false_name = false_name.to_lowercase();
    let bytes = false_name
        .split(|c| !char::is_ascii_alphabetic(&c))
        .filter(|s| !s.is_empty())
        .enumerate()
        .map(|(index, word)| word_to_byte(index, word))
        .collect::<Result<Vec<u8>, FalseNameError>>()?;
    if bytes.len() == 8 {
        Ok(BigEndian::read_u64(&bytes))
    } else {
        Err(FalseNameError::WrongWordCount { count: bytes.len() })
    }
}

/// Tries to convert the word to the corresponding byte. `index` is the index of
/// the word in the false name.
fn word_to_byte(index: usize, word: &str) -> Result<u8, FalseNameError> {
    // We need the explicit type annotation because lazy_static makes a wrapper.
    let (right, wrong): (&HashMap<_, _>, &HashMap<_, _>) = if index % 2 == 0 {
        (&EVEN_WORD_TO_BYTE, &ODD_WORD_TO_BYTE)
    } else {
        (&ODD_WORD_TO_BYTE, &EVEN_WORD_TO_BYTE)
    };
    if let Some(byte) = right.get(word) {
        Ok(*byte)
    } else if wrong.contains_key(word) {
        Err(FalseNameError::ParityError {
            word: word.to_string(),
        })
    } else {
        Err(FalseNameError::UnknownWord {
            word: word.to_string(),
        })
    }
}

/// An error that can occur when parsing a false name.
#[derive(Debug, PartialEq, Eq, Fail)]
pub enum FalseNameError {
    #[fail(display = "{} is not a valid word in a false name", word)]
    UnknownWord { word: String },

    #[fail(display = "False names should be 8 words, but got {}", count)]
    WrongWordCount { count: usize },

    #[fail(
        display = "{} wasn't an expected word at this position; did you forget or duplicate a word?",
        word
    )]
    ParityError { word: String },
}

/// The PGP word list alternates between two-syllable and three-syllable words.
/// This makes a few alterations while trying to preserve the fact that the two
/// word lists are *mostly* (but not entirely!) alphabetical.
static BYTE_TO_WORD: [(&'static str, &'static str); 256] = [
    ("aardvark", "adroitness"),
    ("absurd", "adviser"),
    ("accrue", "aftermath"),
    ("acme", "aggregate"),
    ("adrift", "alkali"),
    ("adult", "almighty"),
    ("afflict", "amulet"),
    ("ahead", "amusement"),
    ("aimless", "antenna"),
    ("algol", "applicant"),
    ("allow", "aptitude"),
    ("alone", "armistice"),
    ("ammo", "article"),
    ("ancient", "asteroid"),
    ("apple", "atlantic"),
    ("artist", "atmosphere"),
    ("assume", "autopsy"),
    ("askew", "bathysphere"),
    ("atlas", "backwater"),
    ("awful", "barbecue"),
    ("baboon", "belowground"),
    ("backfield", "bifocals"),
    ("backward", "bodyguard"),
    ("banjo", "bookseller"),
    ("beaming", "borderline"),
    ("bedlamp", "bottomless"),
    ("beehive", "bracketed"),
    ("beeswax", "bravado"),
    ("befriend", "brazenness"),
    ("bending", "breakaway"),
    ("berserk", "burlington"),
    ("billiard", "businessman"),
    ("bison", "butterfat"),
    ("blackjack", "calumny"),
    ("blockade", "candidate"),
    ("blowtorch", "cannonball"),
    ("bluebird", "capable"),
    ("bombast", "caravan"),
    ("bookshelf", "caretaker"),
    ("brackish", "celebrate"),
    ("breadline", "cellulose"),
    ("breakup", "certify"),
    ("brickyard", "chambermaid"),
    ("briefcase", "champion"),
    ("burden", "chastity"),
    ("button", "clergyman"),
    ("buzzard", "coherence"),
    ("cement", "combustion"),
    ("chairlift", "commando"),
    ("chatter", "company"),
    ("checkup", "component"),
    ("chisel", "concurrent"),
    ("choking", "confidence"),
    ("chopper", "conformist"),
    ("choosy", "congregate"),
    ("clamshell", "consensus"),
    ("classic", "consulting"),
    ("classroom", "corporate"),
    ("cleanup", "corrosion"),
    ("clockwork", "councilman"),
    ("cobra", "crossover"),
    ("commence", "crucible"),
    ("concert", "cumbersome"),
    ("cowbell", "customer"),
    ("crackdown", "dakota"),
    ("cranky", "decadence"),
    ("crowfoot", "daffodil"),
    ("crucial", "decimal"),
    ("crumpled", "designing"),
    ("crusade", "detector"),
    ("cubic", "detergent"),
    ("dashboard", "determine"),
    ("deadbolt", "dictator"),
    ("deckhand", "dinosaur"),
    ("dogsled", "direction"),
    ("dragnet", "disable"),
    ("drainage", "disbelief"),
    ("dreadful", "disruptive"),
    ("drifter", "distortion"),
    ("dropper", "document"),
    ("drumbeat", "embezzle"),
    ("drunken", "enchanting"),
    ("duty", "enrollment"),
    ("dwelling", "enterprise"),
    ("eating", "equation"),
    ("edict", "equipment"),
    ("egghead", "escapade"),
    ("eightball", "estimate"),
    ("endorse", "everyday"),
    ("endow", "examine"),
    ("enlist", "existence"),
    ("erase", "exodus"),
    ("escape", "fascinate"),
    ("exceed", "filament"),
    ("eyeglass", "finicky"),
    ("eyetooth", "forever"),
    ("facial", "fortitude"),
    ("fallout", "frequency"),
    ("flagpole", "gadgetry"),
    ("flatfoot", "galvanic"),
    ("flytrap", "getaway"),
    ("fracture", "glossary"),
    ("framework", "gossamer"),
    ("freedom", "graduate"),
    ("frighten", "gravity"),
    ("gazelle", "guitarist"),
    ("geiger", "hamburger"),
    ("glitter", "hamilton"),
    ("glucose", "handiwork"),
    ("goggles", "hazardous"),
    ("goldfish", "headwaters"),
    ("gremlin", "hemisphere"),
    ("guidance", "hesitate"),
    ("hamlet", "hideaway"),
    ("highchair", "holiness"),
    ("hockey", "hurricane"),
    ("indoors", "hydraulic"),
    ("indulge", "impartial"),
    ("inverse", "impetus"),
    ("involve", "inception"),
    ("island", "indigo"),
    ("jawbone", "inertia"),
    ("keyboard", "infancy"),
    ("kickoff", "inferno"),
    ("kiwi", "informant"),
    ("klaxon", "insincere"),
    ("locale", "insurgent"),
    ("lockup", "integrate"),
    ("merit", "intention"),
    ("minnow", "inventive"),
    ("miser", "istanbul"),
    ("modern", "japery"),
    ("mural", "jupiter"),
    ("music", "leprosy"),
    ("necklace", "letterhead"),
    ("neptune", "liberty"),
    ("newborn", "maritime"),
    ("nightbird", "matchmaker"),
    ("oakland", "maverick"),
    ("obtuse", "medusa"),
    ("offload", "megaton"),
    ("optic", "microscope"),
    ("orca", "microwave"),
    ("payday", "midsummer"),
    ("peachy", "millionaire"),
    ("pheasant", "miracle"),
    ("physique", "misnomer"),
    ("playhouse", "molasses"),
    ("pluto", "molecule"),
    ("preclude", "montana"),
    ("prefer", "monument"),
    ("preshrunk", "mosquito"),
    ("printer", "narrative"),
    ("prowler", "nebula"),
    ("pupil", "newsletter"),
    ("puppy", "norwegian"),
    ("python", "october"),
    ("quadrant", "ohio"),
    ("quiver", "onlooker"),
    ("quota", "opulent"),
    ("ragtime", "orlando"),
    ("ratchet", "outfielder"),
    ("rebirth", "pacific"),
    ("reform", "pandemic"),
    ("regain", "pandora"),
    ("reindeer", "paperweight"),
    ("rematch", "paragon"),
    ("repay", "paragraph"),
    ("retouch", "paramount"),
    ("revenge", "passenger"),
    ("reward", "pedigree"),
    ("rhythm", "pegasus"),
    ("ribcage", "penetrate"),
    ("ringbolt", "perceptive"),
    ("robust", "performance"),
    ("rocker", "pharmacy"),
    ("ruffled", "phonetic"),
    ("sailboat", "photograph"),
    ("sawdust", "pioneer"),
    ("scallion", "pocketful"),
    ("scenic", "politeness"),
    ("scorecard", "positive"),
    ("scotland", "potato"),
    ("seabird", "processor"),
    ("select", "provincial"),
    ("sentence", "proximate"),
    ("shadow", "puberty"),
    ("shamrock", "publisher"),
    ("showgirl", "pyramid"),
    ("skullcap", "quantity"),
    ("skydive", "racketeer"),
    ("slingshot", "rebellion"),
    ("slowdown", "recipe"),
    ("snapline", "recover"),
    ("snapshot", "repellent"),
    ("snowcap", "replica"),
    ("snowslide", "reproduce"),
    ("solo", "resistor"),
    ("southward", "responsive"),
    ("soybean", "retraction"),
    ("spaniel", "retrieval"),
    ("spearhead", "retrospect"),
    ("spellbind", "revenue"),
    ("spheroid", "revival"),
    ("spigot", "revolver"),
    ("spindle", "sandalwood"),
    ("spyglass", "sardonic"),
    ("stagehand", "saturday"),
    ("stagnate", "savagery"),
    ("stairway", "scavenger"),
    ("standard", "sensation"),
    ("stapler", "sociable"),
    ("steamship", "souvenir"),
    ("sterling", "specialist"),
    ("stockman", "speculate"),
    ("stopwatch", "stethoscope"),
    ("stormy", "stupendous"),
    ("sugar", "supportive"),
    ("surmount", "surrender"),
    ("suspense", "suspicious"),
    ("sweatband", "sympathy"),
    ("swelter", "tambourine"),
    ("tactics", "telephone"),
    ("talon", "therapist"),
    ("tapeworm", "tobacco"),
    ("tempest", "tolerance"),
    ("tiger", "tomorrow"),
    ("tissue", "torpedo"),
    ("tonic", "tradition"),
    ("topmost", "travesty"),
    ("tracker", "trombonist"),
    ("transit", "truncated"),
    ("trauma", "typewriter"),
    ("treadmill", "ultimate"),
    ("trojan", "undaunted"),
    ("trouble", "underfoot"),
    ("tumor", "unicorn"),
    ("tunnel", "unify"),
    ("tycoon", "universe"),
    ("uncut", "unravel"),
    ("unearth", "upcoming"),
    ("unwind", "vacancy"),
    ("uproot", "vagabond"),
    ("upset", "vertigo"),
    ("upshot", "virginia"),
    ("vapor", "visitor"),
    ("village", "vocalist"),
    ("virus", "voyager"),
    ("vulcan", "warranty"),
    ("waffle", "waterloo"),
    ("wallet", "whimsical"),
    ("watchword", "wichita"),
    ("wayside", "wilmington"),
    ("willow", "wyoming"),
    ("woodlark", "yesteryear"),
    ("xylem", "yucatan"),
];

lazy_static! {
    /// Maps the even-index words to their corresponding byte.
    static ref EVEN_WORD_TO_BYTE: HashMap<&'static str, u8> = {
        BYTE_TO_WORD
            .into_iter()
            .enumerate()
            .map(|(index, (even, _))| (*even, index as u8))
            .collect()
    };

    /// Maps the odd-index words to their corresponding byte.
    static ref ODD_WORD_TO_BYTE: HashMap<&'static str, u8> = {
        BYTE_TO_WORD
            .into_iter()
            .enumerate()
            .map(|(index, (_, odd))| (*odd, index as u8))
            .collect()
    };
}

#[cfg(test)]
mod test {
    use super::*;

    mod to_false_name {
        use super::*;

        #[test]
        fn all_zeros() {
            assert_eq!(
                to_false_name(0),
                "aardvark adroitness aardvark adroitness aardvark adroitness aardvark adroitness"
            );
        }

        #[test]
        fn all_ones() {
            assert_eq!(
                to_false_name(0xffffffffffffffff),
                "xylem yucatan xylem yucatan xylem yucatan xylem yucatan"
            );
        }

        #[test]
        fn proper_endianness() {
            assert_eq!(
                to_false_name(0xd7fa3f197daa29f8),
                "stopwatch whimsical cowbell bottomless klaxon pedigree breakup warranty"
            )
        }
    }

    mod from_false_name {
        use super::*;

        #[test]
        fn too_few_words() {
            assert_eq!(
                from_false_name(
                    "aardvark adroitness aardvark adroitness aardvark adroitness aardvark"
                ),
                Err(FalseNameError::WrongWordCount { count: 7 })
            )
        }

        #[test]
        fn too_many_words() {
            assert_eq!(
                from_false_name(
                    "aardvark adroitness aardvark adroitness aardvark adroitness aardvark adroitness aardvark"
                ),
                Err(FalseNameError::WrongWordCount { count: 9 })
            )
        }

        #[test]
        fn parity_error() {
            assert_eq!(
                from_false_name(
                    "aardvark adroitness aardvark adroitness aardvark adroitness aardvark xylem"
                ),
                Err(FalseNameError::ParityError {
                    word: "xylem".into()
                })
            )
        }

        #[test]
        fn successful() {
            assert_eq!(
                from_false_name(
                    "stopwatch whimsical cowbell bottomless klaxon pedigree breakup warranty"
                ),
                Ok(0xd7fa3f197daa29f8)
            )
        }

        #[test]
        fn ignores_capitalization() {
            assert_eq!(
                from_false_name(
                    "stopwatCh whimSical Cowbell BOTTOMLESS klaxon pedigree bReAkUp warranty"
                ),
                Ok(0xd7fa3f197daa29f8)
            )
        }

        #[test]
        fn ignores_punctuation() {
            assert_eq!(
                from_false_name(
                    "stopwatch ?! whimsical.cowbell ??? bottomless... klaxon  - pedigree, breakup-warranty"
                ),
                Ok(0xd7fa3f197daa29f8)
            )
        }
    }
}
