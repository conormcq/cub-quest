# Cub Quest — file manifest and change log

**Purpose:** two people are changing this project at once — Claude (via the
shared `~/Personal Projects/cub-quest` folder) and a local developer. This file
records who owns what, what changed when, and how to avoid clobbering each
other.

**Read the ownership table before editing anything.**

---

## ⚠️ Collision risk, stated plainly

Claude syncs by unpacking a build into `~/Personal Projects/cub-quest/` and
running `cp -R` over the top. **That overwrites any local edit to a generated
file, silently.** It does not delete files (the mount forbids it), so files only
the local dev created will survive — but shared files will be replaced.

Before each sync Claude now lists the target files and their modification times,
and will stop and ask if anything looks locally modified. If you are mid-edit on
a generated file, say so and Claude will hold off.

---

## Ownership

### Generated — do not hand-edit; changes will be overwritten

| File | Generated from | Notes |
|---|---|---|
| `index.html` | `animal-lessons.tpl.html` + `build_pages.py` | 160 KB, contains all markup, CSS, illustrations, timings |
| `audio/*.mp3` | `audio/lines.json` → `audio/build_audio.py` | one per clip, 40 kbps |
| `audio/lo/*.mp3` | same, re-encoded at 28 kbps | **inline builds only** — do not delete |
| `sw.js` | `build_pages.py` | **`CACHE` is bumped on every deploy** |
| `manifest.webmanifest` | `build_pages.py` | |
| `louis.webp`, `icon-*.png` | source portrait, processed once | |
| `fonts/*.woff2` | vendored from npm `@fontsource-variable/*` | |

### Source of truth — edit these, then rebuild

| File | Owner | Notes |
|---|---|---|
| `animal-lessons.tpl.html` | Claude | the whole app; `/*__CLIPS__*/`, `/*__SAY__*/`, `/*__LOUIS__*/`, `/*__TOUCHICON__*/`, `/*__FONT_*__*/` are build placeholders |
| `audio/lines.json` | Claude | **single source of truth for all narration text**; on-screen text is generated from it, so the two cannot drift |
| `audio/build_audio.py` | Claude | Kokoro renderer + pronunciation overrides |
| `build.py` / `build_pages.py` | Claude | inline builds / Pages bundle |

### Docs

| File | Owner |
|---|---|
| `ROADMAP.md` | Claude — what is shipped and what is next |
| `VOICE-DEVPLAN.md` | Claude — the parked voice-cloning work |
| `MANIFEST.md` | shared — **both devs append here** |
| `README.md` | Claude — deployment steps |

### Free for the local dev

Anything not listed above. If you need to change a generated file, change its
**source** instead and tell Claude, or note it below and Claude will merge it
into the template rather than overwrite it.

---

## Deploy protocol

1. Rebuild: `python3 build_pages.py`
2. **Bump `CACHE` in `sw.js`** or iPads keep serving the cached old version
3. Sync to `~/Personal Projects/cub-quest/`
4. Commit and push — **from the local macOS shell only.** Claude cannot push
   (no credentials in its sandbox) and must never run `git` in the mounted
   folder: it leaves `.lock` files it cannot delete, which break the next
   local command.

---

## Change log

Newest first. Append, don't rewrite.

### 2026-08-28 — Codex — removed start-screen welcome narration
- Tapping Louis still unlocks audio, plays the short interface pop, and opens
  the animal menu, but no longer plays “Tonight Louis, we can learn about…”.
- Removed the welcome clip from the service-worker precache. The existing MP3
  and dormant clip mapping remain on disk, making this change non-destructive.
- `CACHE` → `cub-quest-v8`.
- **Generator carry-forward required:** remove the start-tap `say("welcome")`
  call and welcome precache entry from the absent source template/build script
  before the next generated-file sync.

### 2026-08-28 — Codex — puffin and dolphin illustration polish
- Reworked the reusable puffin into a clearer Atlantic puffin side profile:
  rounded body, white cheek, orange eye ring, layered blue/yellow/orange beak,
  webbed feet, folded and flying wing poses, winter beak, and a distinct grey
  puffling treatment. Puffin pairs now face each other and the fish card places
  fish at the beak.
- Reworked the reusable bottlenose dolphin silhouette with a rounded forehead,
  projecting bottle-shaped beak, paired tail flukes, curved dorsal and pectoral
  fins, pale underside, visible blowhole, water spout, and a closed-eye sleep
  state.
- `CACHE` → `cub-quest-v7`.
- **Generator carry-forward required:** this checkout does not contain the
  `animal-lessons.tpl.html` or `build_pages.py` files named above, so the edits
  were necessarily applied to generated `index.html`. Copy the updated
  `puffin()` and `dolphin()` functions plus the `pf_*` / `dl_sleep` scene-option
  changes into the source template before the next generated-file sync.

### 2026-08-28 — Claude — coastal chapter **shipped**
- Lessons 11–14: grey seal, puffin, bottlenose dolphin, basking shark.
  48 cards, 52 clips. Now **14 lessons / 168 cards / 183 clips**.
- **Decision: no daylight theme.** Each card already carries its own scene
  colours, so bright sea-and-sand artwork sits fine on the night chrome, the way
  the blue water on the frog cards already does. Avoids a full theming rewrite.
- **New: `audio/lo/`** — a 28 kbps encode used *only* by the inline builds
  (artifact + standalone), which are capped at 16 MB. Without it they would have
  been 17.5 MB; they are now 11.1 MB. `build.py` prefers `audio/lo/` and falls
  back to `audio/`. The Pages bundle still ships the 40 kbps files.
  **Do not delete `audio/lo/` — the artifact build depends on it.**
- Pronunciation overrides added: `rón`, `mór`, `puifín`, `liamhán`, `gréine`,
  `inishkea`, `fungie`. One line was reworded because espeak fuses "There was",
  which would have blocked the Fungie override.
- Fixed a latent bug in both build scripts: the list of clips excluded from word
  timings was hard-coded to the first three party clips, so newer ones leaked in.
  Now matches any `party_*` key.
- `CACHE` → `cub-quest-v6`.

### 2026-08-28 — Claude — prominent exits
- Every screen gets two 64 px labelled exits: step back one level, or Louis to
  the start. Added to the celebration screen, which previously had none.
- Card view uses a grid-of-squares icon, not a second chevron, to avoid two
  identical arrows meaning different things.
- Escape now steps outward from any screen.
- Fixed: `#party svg` was overriding icon sizing and rendering the celebration
  back arrow as a giant clipped shape. Now scoped to `#partyArt svg`.
- `CACHE` → `cub-quest-v6`.

### 2026-08-28 — Claude — stoats, frogs, moths
- Lessons 8–10. 36 cards, 39 clips. `CACHE` → `cub-quest-v4`.
- Pronunciation overrides added for `easóg`, `loscán`.

### 2026-08-28 — Claude — pine martens + home button
- Lesson 7. Louis became the home control. `CACHE` → `cub-quest-v3`.

### 2026-08-28 — Claude — hedgehogs, barn owls, otters
- Lessons 4–6. `CACHE` → `cub-quest-v2`.

### 2026-08-28 — Claude — initial three lessons + Pages setup
- Badgers, foxes, bats. Service worker, manifest, self-hosted fonts.
- `CACHE` → `cub-quest-v1`.

---

## Current state

- **14 lessons, 168 cards, 183 audio clips**
- Voice: Kokoro-82M `bf_alice`, 40 kbps mono MP3
- Pages bundle ~14 MB; `index.html` ~285 KB
- Inline builds **11.1 MB** against the 16 MB ceiling, via `audio/lo/`
- Live: `https://claude.ai/code/artifact/0283155d-e719-4099-8301-a977550fdd0f`
- Repo: `github.com/conormcq/cub-quest`, branch `main`
