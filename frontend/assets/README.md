This folder stores art and data assets. In general, the stuff here wasn't
written by me (meaning Ash, the author of Lost Purpose).

## Tarot card meanings

`tarot_interpretations.json` stores a list of interpretations of Tarot. The
underlying writing is by [Mark
McElroy](http://www.madebymark.com/2014/07/06/my-latest-book-belongs-to-you/),
with the translation to JSON done by [Darius
Kazemi](https://github.com/dariusk/corpora). Both the original and JSON forms
are public domain.

To replicate, run

```sh
    curl "https://raw.githubusercontent.com/dariusk/corpora/23ae2da2c70db54420bc86994e6702a2d6a60c1a/data/divination/tarot_interpretations.json" | \
     sed 's/coins/pentacles/g' | \
     jq -c . > \
     tarot_interpretations.json
```

## Art assets

The card art assets are stored using the following pattern:

- `NN.jpg` for major arcana (e.g., `01.jpg` for the Magician, `13.png` for Death)
- `rank-suit.jpg` for minor arcana (e.g., `08-pentacles.png`, `queen-wands.png`).

Note that the Silicon Dawn assets are not committed and won't be unless Egypt
Urnash gives me the go-ahead.

### ASCII generation

To generate ASCII art assets, build the `cli` binary from
http://github.com/deifactor/ascender, then run

    npm asciify -- /path/to/cli/binary

```fish
set dir silicon-dawn
set font /System/Library/Fonts/Menlo.ttc
for i in frontend/assets/$dir/*.jpg
  /path/to/cli \
    --font $font \
    --ascii-width 70 \
    --font-height 10 \
    $i frontend/assets/$dir-ascii/(string replace jpg png (basename $i)) \
    > /dev/null
  echo $i
end
```

from the repository root.

This also works for `rider-waite-smith`; just modify the `set dir` line
accordingly. You then need to crop the borders using

    mogrify -shave 61x61 crop -0-45 *.jpg

