"""
Озвучка записей к урокам нейросетевым голосом Kokoro (локально).

    KOKORO_DIR=/путь/к/папке python3 scripts/generate_lesson_audio.py content/lessons/audio/lessons-8-9.audio.json

Файл-описание: {"clips": [{"id": "lesson-8/jobs", "gap": 0.6, "parts": [{"voice": "bf_emma", "text": "..."}]}]}
Каждый клип пишется в public/audio/lessons/<id>.mp3. Настройка Kokoro и ffmpeg — как в
scripts/generate_oge_audio.py. Голоса: bf_ / bm_ — британские, af_ / am_ — американские.
"""
import ctypes
import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KOKORO_DIR = os.environ.get("KOKORO_DIR") or sys.exit("Укажите KOKORO_DIR — папку с моделью Kokoro")
spec_path = sys.argv[1] if len(sys.argv) > 1 else sys.exit("Укажите файл-описание клипов")
clips = json.load(open(spec_path, encoding="utf8"))["clips"]

import espeakng_loader  # noqa: E402

data_parent = os.path.dirname(espeakng_loader.get_data_path())
ctypes.cdll.LoadLibrary(espeakng_loader.get_library_path()).espeak_ng_InitializePath.argtypes = [ctypes.c_char_p]

from kokoro_onnx import Kokoro  # noqa: E402
from kokoro_onnx.config import EspeakConfig  # noqa: E402

kokoro = Kokoro(
    f"{KOKORO_DIR}/kokoro-v1.0.int8.onnx",
    f"{KOKORO_DIR}/voices-v1.0.bin",
    espeak_config=EspeakConfig(data_path=data_parent),
)
SR = 24000
SPEED = 0.95


def clean(text: str) -> str:
    text = text.replace("’", "'").replace("‘", "'")
    return re.sub(r"\s+—\s+", ", ", text)


def chunks(text: str, limit: int = 220):
    parts = re.split(r"(?<=[.!?])\s+", clean(text).strip())
    current = ""
    for part in parts:
        if current and len(current) + len(part) + 1 > limit:
            yield current
            current = part
        else:
            current = f"{current} {part}".strip()
    if current:
        yield current


def speak(voice: str, text: str) -> list:
    lang = "en-gb" if voice.startswith("b") else "en-us"
    pieces = []
    for index, piece in enumerate(chunks(text)):
        if index:
            pieces.append(np.zeros(int(0.3 * SR), dtype=np.float32))
        audio, _ = kokoro.create(piece, voice=voice, speed=SPEED, lang=lang)
        pieces.append(audio.astype(np.float32))
    return pieces


for clip in clips:
    pieces = [np.zeros(int(0.5 * SR), dtype=np.float32)]
    for part in clip["parts"]:
        pieces += speak(part["voice"], part["text"])
        pieces.append(np.zeros(int(clip.get("gap", 0.7) * SR), dtype=np.float32))
    audio = np.concatenate(pieces)
    out = f"{ROOT}/public/audio/lessons/{clip['id']}.mp3"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = f"{tmp}/clip.wav"
        sf.write(wav, audio, SR)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-ar", "24000",
             "-af", "loudnorm=I=-18:TP=-2:LRA=11", "-c:a", "libmp3lame", "-b:a", "48k", out],
            check=True,
        )
    print(f"{clip['id']}: {round(len(audio) / SR)} сек")
