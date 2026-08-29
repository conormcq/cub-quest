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
- Cleaned reference: `../cub-quest-voice/voice/reference_clean.wav`
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
.venv/bin/python render_voice.py --check
.venv/bin/python render_voice.py --only hello,stripes,night
```

Use `--overwrite` only when intentionally regenerating earlier results. The
workspace now has all 183 total clip entries, but `--all` should wait until the
six checks and badger chapter pass listening review. The deployed app remains
unchanged until the staged MP3s and timings are approved and Claude rebuilds it.
