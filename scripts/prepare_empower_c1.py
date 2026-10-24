#!/usr/bin/env python3
"""
Готовит записи Empower C1 для раздела «Мой английский»:
  * сжимает mp3 из папки audio/ в лёгкий моно-m4a и кладёт в public/audio/empower-c1/unitN/;
  * переводит субтитры .vtt в JSON с репликами (lib/study/cues/unit-N.json).

Запуск из корня проекта: python3 scripts/prepare_empower_c1.py
Исходники: audio/Empower C1/694_2- Empower 2nd C1 Student's Book Audio/Unit N/
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "audio" / "Empower C1" / "694_2- Empower 2nd C1 Student's Book Audio"
OUT_AUDIO = ROOT / "public" / "audio" / "empower-c1"
OUT_CUES = ROOT / "lib" / "study" / "cues"

TRACKS = {
    1: ["01-06", "01-10", "01-21"],
    2: ["02-05", "02-06", "02-11"],
    3: ["03-03", "03-14", "03-17"],
    4: ["04-04", "04-06", "04-19"],
    5: ["05-08", "05-09", "05-21"],
    6: ["06-03", "06-11", "06-18"],
    7: ["07-08", "07-11", "07-23"],
    8: ["08-01", "08-04", "08-18"],
    9: ["09-06", "09-07", "09-18"],
    10: ["10-03", "10-16", "10-24"],
}

TIME = re.compile(r"(\d+):(\d+):(\d+)\.(\d+)")


def seconds(stamp: str) -> float:
    h, m, s, ms = TIME.match(stamp).groups()
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


def parse_vtt(path: Path):
    text = path.read_text(encoding="utf-8-sig")
    cues = []
    speaker = ""
    for block in re.split(r"\n\s*\n", text):
        lines = [line.strip() for line in block.strip().splitlines() if line.strip()]
        if not lines or lines[0] == "WEBVTT" or "-->" not in lines[0]:
            continue
        start, end = (part.strip() for part in lines[0].split("-->"))
        body = " ".join(lines[1:])
        match = re.match(r"^([A-Z][\w .'-]{0,30}):\s*(.*)$", body)
        if match:
            name, body = match.group(1), match.group(2)
            if name.lower() == "narrator":
                speaker = ""
                if not body or body.lower().startswith("track"):
                    continue
                # «Narrator: Claudio» и подобные подписи — это метка, а не речь
                if len(body.split()) <= 2:
                    continue
            else:
                speaker = name
        if not body:
            continue
        cues.append([round(seconds(start), 2), round(seconds(end), 2), speaker, body])
    return cues


def main():
    OUT_CUES.mkdir(parents=True, exist_ok=True)
    for unit, tracks in TRACKS.items():
        folder = SRC / f"Unit {unit}"
        out_dir = OUT_AUDIO / f"unit{unit}"
        out_dir.mkdir(parents=True, exist_ok=True)
        data = {}
        for track in tracks:
            base = f"Empower Advanced Class Audio Track {track}"
            mp3, vtt = folder / f"{base}.mp3", folder / f"{base}.vtt"
            target = out_dir / f"{track}.m4a"
            if not target.exists():
                subprocess.run(
                    ["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-vn", "-ac", "1",
                     "-ar", "24000", "-c:a", "aac", "-b:a", "32k", str(target)],
                    check=True,
                )
            data[track] = parse_vtt(vtt)
        (OUT_CUES / f"unit-{unit}.json").write_text(
            json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
        )
        print(f"unit {unit}: {', '.join(tracks)}")


if __name__ == "__main__":
    main()
