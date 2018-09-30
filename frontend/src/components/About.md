# about the tarot of the lost purpose

## origin story

the tarot of the lost purpose began on june 8, 2018, with me thinking:

> you know, i like tarot cards, but shuffling is annoying. computers can
> shuffle, but the problem is that they shuffle things *too well*. they're way
> better at it than humans. but what if i made a program that shuffled badly?

but also

> man, i really want an excuse to fuck around with rust and react.

sadly, the rust backend atrophied when i decided to do everything on the
frontend, but i wound up using it for the asciifier, so hey.

## why do i have to make a deck?

because Lost Purpose actually does store the state of your deck, including
whether each card is reversed or not, and actually uses a vague simulation of
how humans shuffle, where the RNG is a function of the query you type in.

of course, it would also be possible to just use a real RNG and pick a card at
random, but that isn't really fun, is it?

## what's in a name?

originally it was called 'skarot', for
'[skeumorphic](https://en.wikipedia.org/wiki/Skeuomorph) tarot', but i later
decided i didn't like that name. then
[@millenomi](https://twitter.com/@millenomi), who's the reason i'm interested in
tarot in the first place¹ suggested 'lost purpose', both because:

- a skeumorphism is something that's lost its purpose
- tarot is something you turn to when you've lost your purpose

## do you actually believe in the occult?

me, personally? nah. the shuffling algorithm is *entirely* deterministic (modulo
a huge lag spike decreasing the number of crc32 stretches). but what i do
believe is that the cards you draw can serve as an impulse to view your
situation in a certain way, or act as symmetry-breaking for indecision. and i
think they're just pretty to look at.

after writing the above, i asked a fresh, shuffled silicon dawn deck whether the
occult is real, and it gave me History reversed. history upright "\[...\]may be a
reminder that the whole deck can just be an elaborate way of talking to
yourself\[...\]", so i guess reversed means 'yes, i am real, and i will doom you
for doubting me'? i'm not making this up because you wouldn't believe me if i
did.

## credits

the Rider-Waite-Smith deck was drawn by [Pamela Coleman
Smith](https://en.wikipedia.org/wiki/Pamela_Colman_Smith). this is the original
version, free of US Games's revisions. the interpretations are by [Mark
McElroy](http://www.madebymark.com/2014/07/06/my-latest-book-belongs-to-you/).
both the art and the interpretations are public domain (the former by age, the
latter by the author's graces).

the Silicon Dawn deck is by [Egypt Urnash](http://egypt.urnash.com/tarot/), and
is used here with her explicit permission. it's a good deck (especially if
you're queer, furry, transhuman, or a queer furry transhuman), though sadly out
of print at the moment (mid-september 2018). the interpretations are also used
with her permission, as Silicon Dawn deviates significantly from
Rider-Waite-Smith interpretations.

the Neon Moon deck is by [Pixel Occult](http://www.neonmoontarot.com/), and is
also used with explicit permission. the colors work *really* well with the
asciifier, and i'm happy that the creator was cool enough to let me use them :)

the asciifying process is done using [a program i wrote
myself](https://github.com/deifactor/ascender). it's done entirely
automatically; i'm sure that you could hand-tune the characters to produce
vastly more intelligible output.

the code itself is all me (Ash), but relies on more libraries than i can count.

---

¹ and who is also very cute
