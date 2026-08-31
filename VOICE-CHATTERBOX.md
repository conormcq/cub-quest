# Local Chatterbox narration — how Louis's audio is voiced, and how to add more

This is the reference for any agent (or human) adding new narration lines to
Cub Quest. Read it before touching `audio/lines.json`, `audio/timings.json`,
or any `.mp3` under `audio/`.

## What voice this is

Every deployed narration clip (`audio/*.mp3` in this repo) is **Conor's own
voice**, produced by [Chatterbox Turbo](https://github.com/resemble-ai/chatterbox)
(Resemble AI), a zero-shot voice-cloning TTS model. There is no separately
trained checkpoint — the model is conditioned on a short reference recording
of Conor's voice at load time, then synthesizes arbitrary text in that voice.

This replaced an earlier synthetic-voice pipeline (Kokoro-82M, `bf_alice`,
`kokoro_onnx`) that some older docs/scripts in this repo still reference.
Kokoro is **not** the deployed voice anymore. Its renderer
(`audio/build_audio.py`, if present) is kept only as a fallback/reference —
do not use it to add new lines unless Chatterbox is explicitly ruled out.

## Where the actual workspace lives

The rendering workspace is **not** in this git repo — it's a sibling folder,
intentionally git-ignored:

```
~/Personal Projects/cub-quest-voice/
├── render_voice.py           the renderer (see below)
├── VOICE-DEVPLAN.md          full history/decision log — read this for "why"
├── VOICE-README.md           plain-language run instructions
├── voice/
│   └── reference_new_recording_25.wav   the approved reference clip Chatterbox clones from
├── audio/
│   └── lines.json            ⚠️ a COPY of this repo's audio/lines.json — see "gotcha" below
└── voice_out/
    ├── audio/*.mp3           rendered output lands here first
    ├── timings.json          derived word-timings for the rendered batch
    ├── render_config.json    the settings used for the last render (guards against silent drift)
    └── render_state.json     per-clip render metadata (gain, duration, word count)
```

`cub-quest-voice/` is a workspace, not a build artifact — nothing there is
deployed directly. Rendered output gets copied into **this** repo's `audio/`
folder as a separate step (see Workflow below).

## The hard constraint: this must run on Conor's Mac host

Chatterbox's weights are pulled from HuggingFace at first run (~1 GB). HuggingFace
is **blocked from every agent sandbox** — both the cloud container and the
`device_bash` VM on Conor's Mac were tested directly, neither can reach it. There
is no PyPI-bundled or GitHub-release-asset copy of the weights (unlike Kokoro,
which shipped as a GitHub release asset — that's the only reason Kokoro was
ever runnable by an agent at all).

**Consequence:** render only from the local Mac host, where the installed model
cache and MPS runtime are available. Codex desktop sessions with direct host
access can run this renderer; cloud containers and sandboxed bridge sessions
cannot. Check that no existing `render_voice.py` process is active before
starting a batch, and never start a duplicate render.

## Setup (already done once; only needed to recreate the environment)

```sh
cd ~/"Personal Projects"/cub-quest-voice
uv venv --python /opt/homebrew/bin/python3.11 .venv
uv pip install --python .venv/bin/python chatterbox-tts==0.1.7 "setuptools<81"
```

## Adding new narration lines — the actual workflow

1. **Write the line(s) in this repo's `audio/lines.json`** (the deployed
   source of truth). One key, one string, matching the existing naming
   convention (e.g. `qz_fox_q1`, `game_otter_fact_2`).
2. **Sync that file into the voice workspace.** `cub-quest-voice/audio/lines.json`
   is a plain copy and does drift behind this repo — it is *not* read live.
   Before rendering, overwrite it with this repo's current `audio/lines.json`
   (whole-file copy is fine; it's just a script input, not tracked by git).
3. **Hand off to Conor** (or whoever's on the Mac) to run, from
   `~/Personal Projects/cub-quest-voice/`:
   ```sh
   source .venv/bin/activate
   python render_voice.py --only key_one,key_two,key_three
   ```
   Omit `--overwrite` unless intentionally re-rendering a clip that already
   has an mp3 — by default it skips anything already rendered. Runtime is
   roughly proportional to line count; on Apple Silicon (MPS) it's fast per
   clip (well under a minute each).
4. **Bring the output back** into this repo:
   - Copy the new `voice_out/audio/<key>.mp3` files into this repo's `audio/`.
   - Merge (don't overwrite) the new entries from `voice_out/timings.json`
     into this repo's `audio/timings.json` — it's a flat `{key: {w, t}}` map,
     so a shallow merge that adds new keys and leaves existing keys untouched
     is correct and safe.
5. **Rebuild and bump the cache**: `node scripts/build.mjs` (or the
   project's `npm run build`), then bump the service-worker cache version in
   `sw.js` (`SHELL_CACHE`/`RUNTIME_CACHE`) so devices don't keep serving the
   old bundle without the new audio.
6. Commit normally. (If you're an agent working through the `device_bash`
   bridge on Conor's mounted folder: never run `git` there — it has
   repeatedly left stray `.git/index.lock` files behind that block the next
   real commit. Prepare/edit files, then have a human or Codex run the git
   commands.)

### Gotcha: two copies of `lines.json`

`cub-quest-voice/audio/lines.json` and this repo's `audio/lines.json` are
**not the same file** and have gone out of sync before (once by dozens of
entries). Always treat **this repo's copy as authoritative** and re-copy it
into the voice workspace immediately before any render — don't trust the
workspace copy to already be current.

## Animal mini-game narration

`badger-ui.js` and `games/game-shell.js` load one `_open` line and three
`_fact_N` lines per animal, plus `game_bat_pulse` and `game_dolphin_pulse`.
All 58 clips are deployed Chatterbox MP3s generated from the approved original
sample, with matching manifest and timing entries. System speech remains only
as an error fallback if a recorded clip cannot be loaded.

To check current gaps yourself (missing mp3, or missing timings) without git:

```sh
cd ~/"Personal Projects"/cub-quest
python3 -c "
import json, os
lines = json.load(open('audio/lines.json'))
timings = json.load(open('audio/timings.json'))
no_audio = [k for k in lines if not os.path.exists(f'audio/{k}.mp3')]
no_timing = [k for k in lines if k not in timings]
print(len(no_audio), 'keys with text but no mp3:', no_audio)
print(len(no_timing), 'keys with text but no timings entry:', no_timing)
"
```

## Technical parameters (do not change casually)

From `render_voice.py`:

| Parameter | Value | Why |
|---|---|---|
| Model | `ChatterboxTurboTTS`, official Turbo English checkpoint | via `chatterbox.tts_turbo`, `chatterbox-tts==0.1.7` |
| Device | `mps` (auto-detected on Apple Silicon) | falls back to `cuda`/`cpu` if unavailable |
| Reference clip | `voice/reference_new_recording_25.wav` | see "Reference clip" below |
| `temperature` | `0.8` | Chatterbox Turbo's recommended default |
| `top_p` | `0.95` | ″ |
| `top_k` | `1000` | ″ |
| `BASE_SEED` | `20260829` | deterministic per-sentence seed (`sha256(seed:clip:sentence_index)`), so a re-render of the same clip/settings is reproducible |
| Sample rate | `22050 Hz`, mono | |
| Output bitrate | `48k` MP3 (`libmp3lame`) | |
| Target loudness | `-18.0 LUFS`, measured then applied as a **fixed linear gain** | see linearity note below |
| `LEAD_MS` | `120` | silence before the first word, added to every timestamp |
| Sentence gaps | `.`→300ms, `!`/`?`→360ms, `:`→260ms, `;`→240ms, default 300ms | inserted between sentences |
| Output filters | `highpass=90Hz, afftdn (denoise), lowpass=10500Hz, volume=<measured gain>dB, alimiter=0.84, adelay=120ms, apad=0.35s, aresample=22050` | applied once via ffmpeg, in this fixed order |

### Why the pipeline must stay exactly like this

- **Sentence-at-a-time synthesis is required.** Splitting text finer (e.g. at
  commas) makes every fragment take sentence-final intonation and sounds
  choppy. Never feed `model.generate()` anything shorter than a full sentence.
- **Word timings are derived, not measured.** There's no forced-alignment
  model here — a syllable-weighted cost function (`cost()` in the script)
  divides each sentence's *known, real* rendered duration proportionally
  across its words. This is coarser than a real aligner but self-consistent,
  and it's what the read-along word-highlighting in the app relies on.
- **The ffmpeg chain must stay linear.** No `loudnorm` (a *dynamic* processor)
  applied after the fact — loudness is measured once per clip
  (`measured_gain()`) and then applied as one fixed dB gain. Any non-linear
  processing after word-boundary timestamps are computed will desync the
  read-along highlighting from the audio. If you need different loudness,
  change `TARGET_LUFS` and re-render — don't post-process finished mp3s.
- **Trim silence before measuring duration**, or timings drift later and
  later through the clip as dead air accumulates.

### Pronunciation respellings

Chatterbox takes plain text (no phoneme input), so tricky words are corrected
by respelling them in the source text before synthesis — done automatically
by `respell()` using the `RESPELL` dict in `render_voice.py`:

| Word | Respelled as | Why |
|---|---|---|
| `live` (as in "badgers live in a sett") | `liv` | avoid reading as "live TV" |
| `sow` (female badger) | `sao` | avoid rhyming with "so" |
| `crainn` (Irish) | `kreen` | |
| `easóg` (Irish, stoat) | `assohg` | |
| `loscán` (Irish, frog) | `losskawn` | |
| `shhh` | `shhh` | kept as a sound, not spelled out phonetically |
| `slurrrp` | `slurp` | ″ |
| `louis` | `Louie` | so it reads "LOO-ee", not "LEW-iss" |

If a new line introduces another awkward word (another Irish word, an unusual
name, an onomatopoeia), add it to `RESPELL` in `render_voice.py` and confirm
by ear with `python render_voice.py --check` (which renders a handful of
short sample clips) before doing a full render — respellings for this engine
are found by listening, not by rule.

### Reference clip

`voice/reference_new_recording_25.wav` — cleaned from the original
`New Recording 25` sample, processed once: down-mixed to mono 24kHz, denoised
(spectral gate), best ~16s window selected (starts/ends on speech, not
silence), high-pass + shelf EQ, loudness-normalized to -19 LUFS. Don't
re-cut or replace this file casually — the whole deployed voice is
conditioned on it, and swapping it changes how every future render sounds
relative to the ~250 existing clips already out in the wild build.

The 58 game instructions, echo prompts, and milestone facts use the approved
`reference_new_recording_25.wav` sample and the same Turbo, filtering,
loudness, and timing settings as the lessons. Run `npm run sync:game-audio`
after a game-voice render to copy only those clips and merge their timings
without overwriting newer quiz narration.

## If a render batch looks wrong

`render_config.json` records the exact settings used for the last batch and
the script refuses to add to an existing `voice_out/audio/` directory under
different settings (it exits with an error instead of silently mixing
incompatible clips). If that happens, start a fresh output directory rather
than overriding it.

A bad clone is worse than a good synthetic voice for something a 5-year-old
will hear hundreds of times — if new lines sound off, that's worth flagging
to Conor before merging them in, same as the original full-voice rollout was
gated on him listening first.
