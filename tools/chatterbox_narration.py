#!/usr/bin/env python3
"""Generate Cub Quest narration previews with a Chatterbox reference voice.

The deployed index contains the narration words as JSON in ``var SAY``. This
tool reads those words so preview text stays in sync without hand-copying it.
It intentionally writes outside ``audio/`` by default: replacing live clips
also requires regenerated word timings, which this preview step does not do.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
import re
import subprocess
from pathlib import Path

import numpy as np
import torch
import torchaudio
from chatterbox.tts_turbo import ChatterboxTurboTTS


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INDEX = ROOT / "index.html"
DEFAULT_REFERENCE = ROOT / ".local/chatterbox/reference/voice-reference.wav"
DEFAULT_OUTPUT = ROOT / ".local/chatterbox/output"


def parser() -> argparse.ArgumentParser:
    command = argparse.ArgumentParser(description=__doc__)
    command.add_argument(
        "ids",
        nargs="+",
        help="Narration IDs from index.html, for example: hello stripes night",
    )
    command.add_argument("--index", type=Path, default=DEFAULT_INDEX)
    command.add_argument("--reference", type=Path, default=DEFAULT_REFERENCE)
    command.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    command.add_argument(
        "--device",
        choices=("auto", "mps", "cuda", "cpu"),
        default="auto",
    )
    command.add_argument("--seed", type=int, default=20260829)
    command.add_argument("--temperature", type=float, default=0.8)
    command.add_argument("--top-p", type=float, default=0.95)
    command.add_argument("--top-k", type=int, default=1000)
    command.add_argument("--bitrate", default="40k")
    command.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing preview files with the same IDs.",
    )
    command.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the resolved narration text without loading the model.",
    )
    return command


def load_narration(index_path: Path) -> dict[str, str]:
    source = index_path.read_text(encoding="utf-8")
    match = re.search(r"var SAY\s*=\s*(\{.*?\});\s*var ac=", source, re.DOTALL)
    if not match:
        raise RuntimeError(f"Could not find the SAY narration data in {index_path}")
    records = json.loads(match.group(1))
    return {key: " ".join(value["w"]) for key, value in records.items()}


def choose_device(requested: str) -> str:
    if requested != "auto":
        return requested
    if torch.backends.mps.is_available():
        return "mps"
    if torch.cuda.is_available():
        return "cuda"
    return "cpu"


def seed_everything(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)


def encode_mp3(wav_path: Path, mp3_path: Path, bitrate: str) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(wav_path),
            "-ac",
            "1",
            "-ar",
            "24000",
            "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-b:a",
            bitrate,
            str(mp3_path),
        ],
        check=True,
    )


def main() -> None:
    args = parser().parse_args()
    lines = load_narration(args.index)
    missing = [line_id for line_id in args.ids if line_id not in lines]
    if missing:
        available = ", ".join(sorted(lines))
        raise SystemExit(f"Unknown narration IDs: {', '.join(missing)}\nAvailable: {available}")

    for line_id in args.ids:
        print(f"{line_id}: {lines[line_id]}")
    if args.dry_run:
        return

    if not args.reference.is_file():
        raise SystemExit(f"Reference WAV not found: {args.reference}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    device = choose_device(args.device)
    print(f"Loading Chatterbox on {device} …", flush=True)
    model = ChatterboxTurboTTS.from_pretrained(device=device)
    model.prepare_conditionals(str(args.reference))

    reference_hash = hashlib.sha256(args.reference.read_bytes()).hexdigest()
    run_metadata = {
        "model": "ResembleAI/chatterbox-turbo",
        "device": device,
        "reference": str(args.reference),
        "reference_sha256": reference_hash,
        "seed": args.seed,
        "temperature": args.temperature,
        "top_p": args.top_p,
        "top_k": args.top_k,
        "bitrate": args.bitrate,
        "target_lufs": -16,
        "clips": {},
    }
    metadata_path = args.output_dir / "generation.json"
    if metadata_path.exists():
        previous = json.loads(metadata_path.read_text(encoding="utf-8"))
        if previous.get("reference_sha256") == reference_hash:
            run_metadata["clips"].update(previous.get("clips", {}))

    for offset, line_id in enumerate(args.ids):
        wav_path = args.output_dir / f"{line_id}.wav"
        mp3_path = args.output_dir / f"{line_id}.mp3"
        if not args.overwrite and (wav_path.exists() or mp3_path.exists()):
            raise SystemExit(
                f"Preview already exists for {line_id}; pass --overwrite to replace it."
            )

        clip_seed = args.seed + offset
        seed_everything(clip_seed)
        print(f"Generating {line_id} (seed {clip_seed}) …", flush=True)
        waveform = model.generate(
            lines[line_id],
            temperature=args.temperature,
            top_p=args.top_p,
            top_k=args.top_k,
        ).detach().cpu()
        torchaudio.save(str(wav_path), waveform, model.sr)
        encode_mp3(wav_path, mp3_path, args.bitrate)
        duration = waveform.shape[-1] / model.sr
        run_metadata["clips"][line_id] = {
            "text": lines[line_id],
            "seed": clip_seed,
            "duration_seconds": round(duration, 3),
            "wav": wav_path.name,
            "mp3": mp3_path.name,
        }
        print(f"Wrote {mp3_path} ({duration:.1f}s)")

    metadata_path.write_text(
        json.dumps(run_metadata, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {metadata_path}")


if __name__ == "__main__":
    main()
