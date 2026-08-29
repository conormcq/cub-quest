# Cub Quest — roadmap

Audio read-along lessons about Irish wildlife, for a pre-reader.

## Shipped

Fourteen lessons, twelve cards each — 168 cards and 194 audio clips when the
celebrations, badger quiz, and dormant welcome are included.

| Lesson | Notes |
|---|---|
| Badgers | setts, earthworms, cubs, tidy bedding |
| Foxes | *madra rua*, the brush, the pounce, urban foxes |
| Bats | echolocation, the blindness myth, 3,000 midges |
| Hedgehogs | 5,000 spines, self-anointing, the apple myth, how to help one |
| Barn Owls | silent flight, lopsided ears, pellets, screech not hoot |
| Otters | two coats, whisker-hunting, holts, five-toed prints |
| Pine Martens | *cat crainn*, unique bibs, spinning ankles, the squirrel story |
| Stoats | *easóg*, no weasels in Ireland, the black tail tip, the long wait |
| Frogs | *loscán*, spawn to froglet in fourteen weeks, asleep in pond mud |
| Moths | 1,500 Irish species, jamming bat sonar, why they circle a lamp |
| Grey Seals | *rón mór*, 60% fat milk, whisker-tracking, what to do if you find a pup |
| Puffins | *puifín*, 83 fish at once, the beak that peels, the puffling |
| Dolphins | the Shannon family, signature whistles, Europe's first sanctuary |
| Basking Sharks | *liamhán gréine*, 1,500 unused teeth, warm-blooded surprise |

All six are nocturnal or crepuscular, which is why the single night-woodland
theme works for all of them.

## Phase 2 — more night animals

No new theme needed; these drop straight into the existing design.

1. ~~Pine marten~~ — **shipped**. Note the framing used: the marten does not
   *protect* red squirrels and has no intent. Reds coevolved with martens and
   know to keep away; greys arrived from North America and never learned. The
   researchers themselves say the mechanism is still not understood, so the
   card says what happened, not why.
2. ~~Stoat~~ — **shipped**. Note: the "dancing to hypnotise rabbits" story is
   folklore and may actually be a symptom of a parasitic nose worm, so it is not
   in the lesson.
3. ~~Common frog~~ — **shipped**. The old "introduced in the 17th century" claim
   is out of date; genetics show two postglacial colonisations, so the lesson
   treats the frog as native.
4. ~~Moth~~ — **shipped**. The light card says scientists worked out why moths get
   *stuck circling* a lamp (they tilt their backs toward the brightest light),
   not why they fly to it from a distance — that part is still unexplained.

**Phase 2 is complete.** Everything below needs new theme work.

## Phase 3 — a daylight chapter

Needs a second palette and a light theme. This is the real engineering work:
the CSS is currently one committed dark world, so chapters would each carry
their own token set, and the menu would need grouping once there are more than
eight lessons.

- **Red squirrel** — pairs beautifully with the pine marten story
- **Robin** — the one bird every child already knows
- **Rabbit**
- **Bumblebee**
- **Butterfly**

## Phase 4 — the seashore chapter — **shipped**

Grey seal, puffin, bottlenose dolphin and basking shark are all in.

**The theme decision, for the record:** no daylight theme was built. Each card
already carries its own scene colours — the frog cards have blue water, the sett
cards brown earth — so a bright sea-and-sky square reads perfectly well on the
night chrome, like a lit window. It also gives the chapter a visual identity for
free. A whole second token set would have been days of work for a worse result.

Still open if wanted: **shore crab**, **red squirrel**, **robin**, **rabbit**,
**bumblebee** — the land daytime animals, which would sit in the same framed-
daylight style with no theming work either.

## Exits and accessibility — done

Every screen now has the same two ways out, in the same place, at 64 px:

- **Step back one level** — `Animals` on a lesson grid, `Pictures` on a card.
- **All the way home** — Louis's face, labelled `Start`, on every screen.

Both carry a small uppercase label beneath, which costs a child nothing and
tells an adult exactly what the button does. Escape now steps outward from
wherever you are, and the celebration screen — previously a dead end offering
only "Go again" — has both exits alongside it.

The card view deliberately uses a **grid-of-squares** icon rather than a second
left-chevron, because the bottom row already has chevrons for moving between
cards and two identical arrows meaning different things is exactly the kind of
thing a five-year-old gets wrong.

## End-of-lesson quiz — badger only, awaiting review

Shipped for badgers on 2026-08-29, then reworked the same day into its
current shape: the quiz is a **permanent 13th tile in the lesson's picture
grid**, directly after the twelve fact cards. It is always visible in that
position and shows a padlock until unlocked, then a bright
question-mark badge, with a small pulsing glow to invite a tap. Tapping it
while locked gives the same gentle "nudge" wiggle used elsewhere for an
unnoticed first card; it does not open anything until unlocked.

**"Heard" now means at least half-listened, not listened-to-the-end.** A
card counts once the child has played at least 50% of its audio — tracked
live during playback, so the quiz tile can unlock mid-listen on the last
card rather than waiting for it to finish. The celebration screen still only
appears at a card's natural end (never mid-playback, so it can't interrupt
a clip), but by the time it can appear the quiz is always already unlocked,
since both share the same "every card heard" condition.

Answering is unchanged: 3 random questions per session, drawn from the
lesson's full pool, tapping one of 3 pictures — voice asks, child taps, no
reading required, wrong taps just invite another try, so every session ends
right on every question, closing on a themed well-done screen. A correct tap
now springs the chosen picture forward with a green check, fills the matching
progress moon, dims the alternatives, and releases a brief coloured sparkle
burst; reduced-motion users get the clear state change without animation.

**The pool is now 10 questions for badgers** (up from 7): the original 4 fact
questions, 3 simple-addition questions (using the animals as counting
examples — a worm found then one more; badger cubs playing then one more
joins; berries on the bush; answers are counted pictures via the reusable
`countTile(n, drawItem)` helper, not numerals, true to the pre-reader
design), and 3 new fact questions added this round: does a badger live alone
or with its family (reuses the `family()`/`hello()` card art plus a small new
flock-of-birds decoy), what a tidy badger brings into its home (reuses
`tidy()`/`sett()`/`berries()` card art, no new SVG needed), and how a badger
finds food in the dark — a cross-species contrast reusing the bat's
echolocation and the barn owl's night-hunting art alongside the badger's own
`nose()` card.

**Conor is reviewing the badger version before it goes on the other 13
lessons.** Once approved, extending it means: pick 4ish fact-question angles
per animal (what it is vs. lookalikes, where it lives, a behaviour, its food
is the badger template — not every animal needs all four) plus a few
addition questions with that lesson's own small objects, aiming for at least
10 questions total per lesson, write the narration lines into
`audio/lines.json`, render, and add a `quiz` array + `quizDoneClip` to that
lesson's `LESSONS` entry, reusing existing card/scene art for choices
wherever a natural decoy already exists in another lesson (as the badger
version does throughout) rather than drawing new SVG.

## Beyond content

- **Find the animal** — hide and seek in the woods, with cheers and gentle
  "try again" audio.
- **Simpler sentences** — an option to match a school reading scheme, with
  shorter lines and more sight words.
- **Chapter grouping** in the menu, needed once there are more than eight lessons.

## Technical notes for future work

- Each lesson costs roughly **1.1 MB** of audio (12 clips at 48 kbps) and about
  10 KB of `index.html` for its timings. The service worker precaches all active
  clips on the first visit.
- Adding a lesson means: research → 12 scripts in `audio/lines.json` → sync the
  narration manifest to `../cub-quest-voice` and render with Chatterbox → merge
  `audio/timings.json` into the read-along data → add the scenes and `LESSONS`
  entry → rebuild the deployable site.
- **Bump `CACHE` in `sw.js`** on every deploy or iPads keep the old version.
- Any new theme needs the token structure described in the design notes: define
  the complete palette on `:root`, and never let a colour exist only inside a
  media query.
