# Local Chatterbox narration

Cub Quest can generate voice-cloned narration previews locally with
[Resemble AI's Chatterbox Turbo](https://github.com/resemble-ai/chatterbox).
Turbo is the project's recommended lower-compute English narration model.
Chatterbox uses zero-shot conditioning: it derives the voice from the reference
recording when the model loads, rather than creating a separately trained
checkpoint.

## Local setup

The installed runtime is intentionally ignored by Git:

- Python 3.11 virtual environment: `.local/chatterbox/.venv`
- Prepared reference: `.local/chatterbox/reference/voice-reference.wav`
- Generated auditions: `.local/chatterbox/output/`
- Hugging Face model files: the user's normal Hugging Face cache

Recreate the environment if needed:

```sh
uv venv --python /opt/homebrew/bin/python3.11 .local/chatterbox/.venv
uv pip install --python .local/chatterbox/.venv/bin/python \
  chatterbox-tts==0.1.7 "setuptools<81"
```

Prepare an M4A reference as 24 kHz mono WAV:

```sh
ffmpeg -i "/path/to/reference.m4a" -ac 1 -ar 24000 -c:a pcm_s16le \
  -af "highpass=f=65,lowpass=f=11000,alimiter=limit=0.95" \
  .local/chatterbox/reference/voice-reference.wav
```

## Generate auditions

Narration IDs and text are read from the deployed `index.html`, keeping preview
copy consistent with the current app:

```sh
.local/chatterbox/.venv/bin/python tools/chatterbox_narration.py \
  hello stripes night
```

Use `--dry-run` to inspect resolved text without loading the model. Use
`--overwrite` only when intentionally replacing an earlier audition.

Preview files are not copied over `audio/*.mp3` automatically. The app's word
highlight timings must be regenerated before any new narration is deployed;
otherwise the spoken words and on-screen highlighting will drift apart.
