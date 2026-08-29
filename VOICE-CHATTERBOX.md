# Local Chatterbox narration

The canonical voice-cloning workspace is
`~/Personal Projects/cub-quest-voice/`. It contains the cleaned reference,
source narration manifest, timing-aware renderer, pronunciation checks, and
staged audio. Read its `VOICE-DEVPLAN.md` and `VOICE-README.md` before running
another batch.

The local engine is [Resemble AI's Chatterbox Turbo](https://github.com/resemble-ai/chatterbox),
the project's recommended lower-compute English narration model. Chatterbox
uses zero-shot conditioning: it derives the voice from the reference recording
when the model loads rather than producing a separately trained checkpoint.

## Local setup

The installed runtime is intentionally ignored by Git:

- Python 3.11 virtual environment: `../cub-quest-voice/.venv`
- Approved reference: `../cub-quest-voice/voice/reference_new_recording_25.wav`
- Generated auditions and timed audio: `../cub-quest-voice/voice_out/`
- Hugging Face model files: the user's normal Hugging Face cache

Recreate the environment if needed:

```sh
cd ../cub-quest-voice
uv venv --python /opt/homebrew/bin/python3.11 .venv
uv pip install --python .venv/bin/python \
  chatterbox-tts==0.1.7 "setuptools<81"
```

## Generate auditions and timed narration

```sh
.venv/bin/python render_voice.py --check \
  --reference voice/reference_new_recording_25.wav
.venv/bin/python render_voice.py --only hello,stripes,night \
  --reference voice/reference_new_recording_25.wav
```

Use `--overwrite` only when intentionally regenerating earlier results. The
approved rollout uses the original `New Recording 25` sample, not the later
more-Irish experiment. The complete 194-clip render is deployed across the app;
`audio/lines.json` and `audio/timings.json` preserve the text and timing
manifests used by the current build.

The original 191-clip batch is 45.66 minutes of mono 22.05 kHz MP3 audio. All
clips decode successfully, have finite unclipped samples, stay between -21.4
and -17.4 LUFS, and have complete, monotonic timings bounded by their audio.
The three later quiz prompts were rendered with the same reference and settings;
they are unclipped and measure between -19.1 and -18.1 LUFS.
