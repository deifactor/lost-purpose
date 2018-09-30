# Tarot of the Lost Purpose

[![Build Status](https://travis-ci.org/deifactor/lost-purpose.svg?branch=master)](https://travis-ci.org/deifactor/lost-purpose) [![codecov](https://codecov.io/gh/deifactor/lost-purpose/branch/master/graph/badge.svg)](https://codecov.io/gh/deifactor/lost-purpose)

If you want to try the Tarot of the Lost Purpose out for yourself, see [the
official instance](https://synthetic.zone/lost-purpose).

Tarot of the Lost Purpose (or just Lost Purpose) is a
[skeuomorphic](https://en.wikipedia.org/wiki/Skeuomorph) tarot deck web
application: it simulates tarot decks in significantly more detail than is
necessary, and makes several design decisions with the explicit purpose of
*feeling* like a tarot deck.

* It uses a [linear-feedback shift
  register](https://en.wikipedia.org/wiki/Linear-feedback_shift_register) for
  random number generation, seeded using a user-provided string with
  [CRC32](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) repeatedly
  applied. It does this in order to simulate the fact that humans are quite bad
  at 'randomly' shuffling.
* Instead of implementing a perfect [Fisher-Yates
  shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle), it
  implements a 'chunked riffle shuffle' where the deck is randomly cut and
  randomly-sized chunks from each half are interleaved.

For a more rambly about page, read [the about page](frontend/src/components/About.md).

## Silicon Dawn

Lost Purpose also supports the [Tarot of the Silicon
Dawn](http://egypt.urnash.com/tarot/), which augments the traditional tarot deck
with:
* Five extra major arcana
* The (VOID) suit, with five ranks (including a 0).
* The 99s of all four traditional suits
* Two extra cards that defy categorization.

The deck is worth a shot if you're queer/transhuman/generally Weird, but sadly
out of print (as of August 2018) and unreasonably expensive to buy second-hand.
Egypt Urnash has kindly given me permission to use the art assets and her
interpretations.

## Licensing

All of my own work (everything outside of `frontend/assets`) is licensed under
the MIT license found in `LICENSE`. The assets are licensed using the
per-directory `LICENSE` files.
