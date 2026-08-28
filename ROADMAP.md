# Cub Quest — roadmap

Audio read-along lessons about Irish wildlife, for a pre-reader.

## Shipped

Ten lessons, twelve cards each — 120 cards, 131 audio clips.

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

## Phase 4 — a seashore chapter

A third palette: daylight, blue-green, sand.

- **Grey seal** — Ireland has a large share of the world population
- **Puffin** — Skellig and the Saltees
- **Bottlenose dolphin** — the Shannon estuary resident group
- **Shore crab**
- **Basking shark** — enormous and completely harmless

## Beyond content

- **Listening quiz** — voice asks a question, child taps one of three pictures.
  Audio-only, no reading. Offered early on and set aside.
- **Find the animal** — hide and seek in the woods, with cheers and gentle
  "try again" audio.
- **Simpler sentences** — an option to match a school reading scheme, with
  shorter lines and more sight words.
- **Chapter grouping** in the menu, needed once there are more than eight lessons.

## Technical notes for future work

- Each lesson costs roughly **0.9 MB** of audio (12 clips at 40 kbps) and about
  10 KB of `index.html` for its timings. Seven lessons is 6.8 MB; the service
  worker precaches all of it on first visit.
- Adding a lesson means: research → 12 scripts in `audio/lines.json` → render
  with `audio/build_audio.py` → SVG scenes in the template → an entry in
  `LESSONS` → `build_pages.py`.
- **Bump `CACHE` in `sw.js`** on every deploy or iPads keep the old version.
- Any new theme needs the token structure described in the design notes: define
  the complete palette on `:root`, and never let a colour exist only inside a
  media query.
