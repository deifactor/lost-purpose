This folder stores art assets. In general, the stuff here wasn't written by me
(meaning Ash, the author of Lost Purpose).

The card art assets are stored using the following pattern:

- `NN.jpg` for major arcana (e.g., `01.jpg` for the Magician, `13.png` for Death)
- `rank-suit.jpg` for minor arcana (e.g., `08-pentacles.png`, `queen-wands.png`).

Note that the Silicon Dawn assets are not committed and won't be unless Egypt
Urnash gives me the go-ahead.

## ASCII generation

To generate ASCII art assets, run

```fish
set font /System/Library/Fonts/Menlo.ttc
cargo build -p ascender --release --bin cli
set dir silicon-dawn
for i in frontend/assets/$dir/*.jpg
  ./target/release/cli \
    --font $font \
    --ascii-width 70 \
    --font-height 10 \
    $i frontend/assets/$dir-ascii/(string replace jpg png (basename $i)) \
    > /dev/null
  ./target/release/cli \
    --font $font \
    --ascii-width 35 \
    --font-height 10 \
    $i frontend/assets/$dir-ascii/thumbs/(string replace jpg png (basename $i)) \
    > /dev/null
  echo $i
end
```

from the repository root.

This also works for `rider-waite-smith`; just modify the `set dir` line
accordingly. You then need to crop the borders using

    mogrify -shave 61x61 crop -0-45 *.jpg

