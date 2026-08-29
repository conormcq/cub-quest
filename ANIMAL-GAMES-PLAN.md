# Cub Quest — animal games plan

Audience: around age 5. All games must be playable without reading. On-screen text is supplementary; goals, milestone facts, success messages and retry prompts are narrated automatically. Touch is primary, keyboard is optional. Games must keep working offline after first load.

## Product rules

- Game entry ultimately lives after that animal's quiz; during development a test mode may expose games early.
- One clear goal per game, explained aloud in one sentence.
- Sessions target 60–120 seconds.
- No fail screen. Mistakes bounce, slow, or gently reset the immediate action.
- Three narrated learning moments per game: early, middle, completion.
- Large touch targets, no text-dependent instructions, no timers that pressure the child.
- Reuse Cub Quest colors/fonts and draw simple game art in Canvas/SVG so games remain lightweight and offline.
- Shared shell handles overlay, close/replay, score/progress, narration, pause-on-popup and accessibility.

## Reusable game systems

1. **Free-move collector** — drag/tap to steer in two dimensions, collect targets, collide gently with scenery.
2. **Flight/swim runner** — continuous forward movement; touch controls height/lane, collect targets and pass obstacles.
3. **Jump/platform path** — tap a destination to leap/climb between safe points.
4. **Search/sonar puzzle** — send a pulse/reveal, then choose or navigate to the hidden target.

The animal modules configure these systems rather than cloning a full engine per animal.

## Games

| Animal | Game | Core play | Learning hook |
|---|---|---|---|
| Badger | **Badger Dash** | Free-move through woodland; collect 10 worms around rocks/logs/bushes. | Smell, nocturnal foraging, earthworms. Existing game remains the reference implementation. |
| Fox | **Fox Pounce** | Move through grass, follow rustling patches, tap to pounce on hidden food targets. | Hearing beneath grass/snow, pouncing, adaptable diet. |
| Bat | **Midge Munch** | Fly through dusk, tap an echolocation pulse to reveal nearby midges, then swoop through them. | Echolocation, insects, agile flight. |
| Hedgehog | **Leafy Hideaway** | Drag leaves, grass and twigs to the hedgehog's nest while avoiding unsuitable objects. | Nest building, nocturnal habits, what helps hedgehogs in gardens. |
| Barn Owl | **Silent Glide** | Glide between branches and through moonlit gaps; collect prey markers without touching branches. | Silent feathers, excellent hearing, night hunting. |
| Otter | **River Slide** | Swim and dive along a river, collect fish, surface through air bubbles, slip under logs. | Swimming, whiskers, holts/river life. |
| Pine Marten | **Treetop Trail** | Tap branches to jump/climb from tree to tree and collect berries; avoid dead-end branches. | Tree climbing, flexible ankles, woodland diet. |
| Stoat | **Stone Wall Sprint** | Dash through gaps in a stone-wall maze, follow scent markers and reach the den. | Long thin body, hunting routes, black tail tip. |
| Frog | **Lily Pad Leap** | Tap lily pads to jump across a pond and catch flies; pads wobble but never punish harshly. | Jumping, pond habitat, frog development. |
| Moth | **Moonlight Maze** | Fly toward the moon/flowers while lamps bend the flight path; steer away from lamp spirals. | Light orientation, nocturnal flight, bat interactions. |
| Grey Seal | **Seal Splash** | Dive through kelp, collect fish, surface at breathing zones and avoid rocks. | Diving, whiskers, pups/resting on shore. |
| Puffin | **Puffin Fishing** | Dive for small fish, then carry a growing beakful back to the burrow before returning for more. | Multiple fish in beak, pufflings, burrows. |
| Dolphin | **Echo Explorer** | Send sonar pulses; hidden fish appear as ripples, then swim to the matching target. | Echolocation, signature whistles, family groups. |
| Basking Shark | **Plankton Parade** | Steer a huge shark through plankton clouds with its mouth open; avoid rocks/boats and fill a plankton meter. | Filter feeding, harmlessness, enormous size. |

## Narrated milestone pattern

Each game has three short, child-friendly lines. Examples:

- Fox: "Great listening! Foxes can hear tiny animals moving under grass." / "That big fluffy tail is called a brush." / "Foxes can live in woods, fields and even towns."
- Bat: "Ping! Bats listen for echoes to find their way." / "Many Irish bats eat lots of tiny insects." / "Bats are not blind — their eyes work too."
- Hedgehog: "Hedgehogs make cosy nests from leaves and grass." / "Those spines help protect a hedgehog." / "A small gap under a garden fence can help hedgehogs travel safely."
- Barn owl: "Barn owl feathers help them fly very quietly." / "Their ears are slightly uneven, which helps pinpoint sounds." / "Barn owls screech — they do not make the classic hoot."
- Otter: "Otters have thick fur that helps keep them warm." / "Their whiskers can sense movement in the water." / "An otter's home can be called a holt."
- Pine marten: "Pine martens are brilliant tree climbers." / "They can turn their ankles to climb down trees head first." / "The pale patch on a pine marten's chest is called a bib."
- Stoat: "A stoat's long thin body helps it slip through small gaps." / "Look for the black tip on a stoat's tail." / "Ireland has stoats, but no native weasels."
- Frog: "Frogs use powerful back legs to jump." / "Frogspawn grows into tadpoles, then froglets." / "Some frogs spend winter tucked into mud at the bottom of ponds."
- Moth: "Moths often use the brightest natural light to help orient their bodies." / "Some moths can interfere with a bat's sonar." / "Ireland has around fifteen hundred kinds of moth."
- Grey seal: "A seal's whiskers can track movement in the water." / "Grey seal pups drink extremely rich milk." / "If you see a seal pup resting on shore, give it lots of space."
- Puffin: "Puffins can hold several fish across their beak at once." / "A baby puffin is called a puffling." / "Puffins nest in burrows near the sea."
- Dolphin: "Dolphins use clicks and echoes to explore underwater." / "Each dolphin can have its own signature whistle." / "Bottlenose dolphins often live in social family groups."
- Basking shark: "Basking sharks filter tiny plankton from the water." / "Those huge sharks are harmless to people." / "Basking sharks can grow to enormous sizes."

Exact wording should stay consistent with the lesson content when implemented.

## Implementation workstreams

### Shared shell
- `games/game-shell.js`: registration API, overlay, Canvas lifecycle, narration, milestone popup, pause/replay/close, touch + keyboard helpers.
- `games/game-lab.js`: development-only launcher activated by `?games=1`; no permanent home-screen clutter.
- Production gate API so a lesson can expose its game after its quiz when quizzes exist for all animals.

### Woodland module
Fox, Hedgehog, Pine Marten, Stoat, Frog.

### Air module
Bat, Barn Owl, Moth.

### Water module
Otter, Grey Seal, Puffin, Dolphin, Basking Shark.

## Acceptance criteria

- Each of the 13 new games can launch independently in Game Lab.
- Goal is narrated on open.
- Every milestone popup pauses play and is read aloud automatically.
- No game requires reading to continue.
- Touch works on iPhone/iPad; keyboard controls are a bonus.
- Closing a game stops narration and animation cleanly.
- Core game scripts are precached; audio/runtime assets retain the existing offline strategy.
- Normal Cub Quest navigation is unchanged when Game Lab is not enabled.
- Later production restriction is a single gate/config change, not a rewrite of each game.
