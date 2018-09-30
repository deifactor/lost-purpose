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

## is anything transmitted to the server?

everything is done clientside, including the shuffling and the deck storage. i
can't see your queries, the names of your decks, the state of your decks,
anything.

in the future i may implement some kind of data sync so you can share the state
of your decks between computers, but that will be opt-in, and the queries will
never leave your computer.

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
occult is real, and it gave me History reversed. history upright "...may be a
reminder that the whole deck can just be an elaborate way of talking to
yourself...", so i guess reversed means 'yes, i am real, and i will doom you for
doubting me'? i'm not making this up because you wouldn't believe me if i did.

## contact

if you want to get in contact with me, here are your options from best to worst:

- [send me a message on Mastodon](https://cybre.space/@hierarchon)
- [send me a message on Twitter](https://twitter.com/hierarchon) (public DMs are on)
- [e-mail me](mailto:relativistic.policeman+tarot@gmail.com)

---

¹ and who is also very cute
