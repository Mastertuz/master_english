"""
Озвучка вариантов ОГЭ нейросетевым голосом Kokoro (локально, без интернета).

    KOKORO_DIR=/путь/к/папке python3 scripts/generate_oge_audio.py variant-2

В KOKORO_DIR лежат kokoro-v1.0.int8.onnx и voices-v1.0.bin (GitHub-релиз
thewh1teagle/kokoro-onnx, model-files-v1.0), а в её venv/ — пакеты kokoro-onnx
и soundfile. Нужен ffmpeg. Берёт тексты из lib/oge/audio/<id>.script.json, пишет:
  public/audio/oge/<id>/listening.mp3, speaking.mp3
  lib/oge/audio/<id>.marks.json — таймкоды для кода варианта
Голос каждой роли задан в script.json (voices и voice у монологов).
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
KOKORO_DIR = os.environ.get("KOKORO_DIR")
if not KOKORO_DIR:
    sys.exit("Укажите KOKORO_DIR — папку с моделью Kokoro")

variant_id = sys.argv[1] if len(sys.argv) > 1 else sys.exit("Укажите вариант: variant-2")
script = json.load(open(f"{ROOT}/lib/oge/audio/{variant_id}.script.json", encoding="utf8"))
out_dir = f"{ROOT}/public/audio/oge/{variant_id}"
os.makedirs(out_dir, exist_ok=True)

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
NARRATOR = "bm_daniel"
SPEED = 0.95


def clean(text: str) -> str:
    text = text.replace("’", "'").replace("‘", "'")
    return re.sub(r"\s+—\s+", ", ", text)


def chunks(text: str, limit: int = 220):
    """Режем текст по предложениям: модель принимает не больше ~500 фонем за раз."""
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


class Track:
    def __init__(self):
        self.pieces: list[np.ndarray] = []
        self.samples = 0

    @property
    def t(self) -> float:
        return self.samples / SR

    def _add(self, audio: np.ndarray) -> float:
        start = self.t
        self.pieces.append(audio.astype(np.float32))
        self.samples += len(audio)
        return start

    def silence(self, seconds: float) -> float:
        return self._add(np.zeros(int(seconds * SR), dtype=np.float32))

    def speak(self, voice: str, text: str) -> float:
        lang = "en-gb" if voice.startswith("b") else "en-us"
        start = self.t
        first = True
        for piece in chunks(text):
            if not first:
                self.silence(0.3)
            audio, _ = kokoro.create(piece, voice=voice, speed=SPEED, lang=lang)
            self._add(audio)
            first = False
        return start

    def narrate(self, text: str) -> float:
        return self.speak(NARRATOR, text)

    def save(self, name: str):
        audio = np.concatenate(self.pieces)
        with tempfile.TemporaryDirectory() as tmp:
            wav = f"{tmp}/{name}.wav"
            sf.write(wav, audio, SR)
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-ar", "24000",
                 "-af", "loudnorm=I=-18:TP=-2:LRA=11", "-c:a", "libmp3lame", "-b:a", "40k", f"{out_dir}/{name}.mp3"],
                check=True,
            )


def voice_of(who: str) -> str:
    return script["voices"].get(who, NARRATOR)


def play_text(track: Track, item: dict):
    if "lines" in item:
        for line in item["lines"]:
            track.speak(voice_of(line["who"]), line["text"])
            track.silence(0.5)
    else:
        track.speak(item["voice"], item["text"])
    track.silence(2.5)


def r(value: float) -> float:
    return round(value, 1)


# ─────────────── Аудирование ───────────────

L = Track()
marks = []
p1 = L.t
marks.append({"label": "Задания 1–4", "at": 0})
L.narrate("Tasks one to four. You will hear four short texts, marked A, B, C and D. In tasks one to four, choose the correct answer: one, two or three. You will hear the recording twice. You have thirty seconds to look through the tasks.")
L.silence(30)
L.narrate("Now we are ready to start.")
L.silence(1.5)
part1_codes = [{"label": "Инструкция", "at": p1}]
part1_starts = []
for item in script["part1"]:
    at = L.t
    part1_starts.append(at)
    part1_codes.append({"label": item["title"], "at": at})
    L.narrate(f"{item['title']}.")
    L.silence(0.6)
    play_text(L, item)
L.narrate("You have twenty seconds to complete the task.")
L.silence(20)
L.narrate("Now you will hear the texts again.")
L.silence(1.5)
for item in script["part1"]:
    part1_codes.append({"label": f"{item['title']} · 2-й раз", "at": L.t})
    L.narrate(f"{item['title']}.")
    L.silence(0.6)
    play_text(L, item)
L.narrate("This is the end of the task. You now have twenty seconds to check your answers.")
L.silence(20)

p5 = L.t
marks.append({"label": "Задание 5", "at": p5})
L.narrate("Task five. You are preparing a thematic radio programme with statements of five different people, marked A, B, C, D and E. Match each statement with the heading from the list, one to six. Use each heading only once. There is one extra heading. You will hear the recording twice. You have twenty seconds to look through the task.")
L.silence(20)
L.narrate("Now we are ready to start.")
L.silence(1.5)
part5_codes = [{"label": "Инструкция", "at": p5}]
presenter_at = L.t
part5_codes.append({"label": "Ведущий", "at": presenter_at})
L.speak(voice_of("Presenter"), script["part5"]["presenter"])
L.silence(1.5)
part5_starts = []
for item in script["part5"]["speakers"]:
    at = L.t
    part5_starts.append(at)
    part5_codes.append({"label": item["title"], "at": at})
    L.narrate(f"{item['title']}.")
    L.silence(0.5)
    play_text(L, item)
L.narrate("You have twenty seconds to complete the task.")
L.silence(20)
L.narrate("Now you will hear the texts again.")
L.silence(1.5)
for item in script["part5"]["speakers"]:
    part5_codes.append({"label": f"{item['title'].replace('Speaker ', '')} · 2-й раз", "at": L.t})
    L.narrate(f"{item['title']}.")
    L.silence(0.5)
    play_text(L, item)
L.narrate("This is the end of the task. You now have twenty seconds to check your answers.")
L.silence(20)

p6 = L.t
marks.append({"label": "Задания 6–11", "at": p6})
L.narrate("Tasks six to eleven. You are helping your friend, a young radio journalist, to analyse an interview he has prepared for a radio programme. Listen to the recording and fill in the table. You may write no more than one word, without articles, from the text you hear. Write numbers in words. You will hear the recording twice. You have thirty seconds to look through the tasks.")
L.silence(30)
L.narrate("Now we are ready to start.")
L.silence(1.5)


def interview():
    for line in script["part6"]:
        L.speak(voice_of(line["who"]), line["text"])
        L.silence(0.5)
    L.silence(1.5)


interview_at = L.t
interview()
L.narrate("You have twenty seconds to complete the task.")
L.silence(20)
L.narrate("Now you will hear the text again.")
L.silence(1.5)
second_at = L.t
interview()
L.narrate("This is the end of the task. You now have twenty seconds to check your answers.")
L.silence(20)
end_at = L.t
L.narrate("This is the end of the listening test.")
listening = {
    "marks": marks,
    "part1": {"timecodes": part1_codes, "starts": part1_starts},
    "part5": {"timecodes": part5_codes, "presenterAt": presenter_at, "starts": part5_starts},
    "part6": {
        "timecodes": [
            {"label": "Инструкция", "at": p6},
            {"label": "Интервью", "at": interview_at},
            {"label": "Интервью · 2-й раз", "at": second_at},
            {"label": "Конец записи", "at": end_at},
        ],
        "transcriptAt": interview_at,
    },
}
L.save("listening")

# ─────────────── Устная часть: телефонный опрос ───────────────

S = Track()
assistant = voice_of("Assistant")
questions = []
for index, question in enumerate(script["speaking"]["questions"]):
    start = S.t
    if index == 0:
        S.speak(assistant, script["speaking"]["intro"])
        S.silence(0.5)
    S.speak(assistant, question)
    questions.append({"start": start, "end": S.t + 0.2})
    S.silence(40)
outro_start = S.t
S.speak(assistant, script["speaking"]["outro"])
speaking = {"questions": questions, "outro": {"start": outro_start, "end": S.t + 0.2}}
S.save("speaking")


def round_deep(value):
    if isinstance(value, float):
        return r(value)
    if isinstance(value, list):
        return [round_deep(v) for v in value]
    if isinstance(value, dict):
        return {k: round_deep(v) for k, v in value.items()}
    return value


with open(f"{ROOT}/lib/oge/audio/{variant_id}.marks.json", "w", encoding="utf8") as f:
    json.dump(round_deep({"listening": listening, "speaking": speaking}), f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"{variant_id}: готово, запись {r(L.t / 60)} мин, опрос {r(S.t / 60)} мин")
