#!/usr/bin/env python3
"""
Разбирает исходные HTML-уроки из content/lessons и складывает их
в content/lessons/lessons.json — оттуда их читает scripts/import-lessons.ts.

Запуск:  python3 scripts/convert-lessons.py
"""
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "lessons"

# Аудио переименовано в public/audio; Track-003 в исходниках отсутствует
AUDIO = {
    "Track-002.mp3": "/audio/track-002.mp3",
    "English for most common airport customs questions.mp3": "/audio/airport-customs.mp3",
    "Checking in at the Hotel How to Check in at a Hotel Beginner Travel English.mp3": "/audio/hotel-checkin-1.mp3",
    "English for Hotel and Tourism Checking into a hotel FREE Course (link in description).mp3": "/audio/hotel-checkin-2.mp3",
}


def text_of(fragment: str) -> str:
    """HTML → чистый текст."""
    if not fragment:
        return ""
    fragment = re.sub(r"<br\s*/?>", "\n", fragment)
    fragment = re.sub(r"</(p|div|li|h[1-6])>", "\n", fragment)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment)
    fragment = re.sub(r"[ \t]+", " ", fragment)
    fragment = re.sub(r"\n\s*\n+", "\n", fragment)
    return fragment.strip()


def audio_url(src: str) -> str:
    name = html.unescape(src).split("/")[-1]
    try:
        name = re.sub(r"%([0-9A-Fa-f]{2})", lambda m: chr(int(m.group(1), 16)), name)
    except ValueError:
        pass
    return AUDIO.get(name, "")


def find_all(pattern: str, source: str):
    return re.findall(pattern, source, re.S)


def split_blocks(source: str):
    """Режет страницу на <div class="block">…</div> по балансу div."""
    blocks = []
    for match in re.finditer(r'<div class="block[^"]*">', source):
        start = match.end()
        depth = 1
        pos = start
        for tag in re.finditer(r"<(/?)div\b", source[start:]):
            depth += -1 if tag.group(1) else 1
            if depth == 0:
                pos = start + tag.start()
                break
        blocks.append(source[start:pos])
    return blocks


def parse_tasks(block: str, default_kind: str = ""):
    """Задания вида <div class="task" data-answer data-explain>."""
    tasks = []
    for match in re.finditer(
        r'<div class="task"([^>]*)>(.*?)(?=<div class="task"|$)', block, re.S
    ):
        attrs, body = match.group(1), match.group(2)
        answer = re.search(r'data-answer="([^"]*)"', attrs)
        explain = re.search(r'data-explain="([^"]*)"', attrs)

        prompt_match = re.search(r"<p>(.*?)</p>", body, re.S)
        prompt = text_of(prompt_match.group(1)) if prompt_match else ""
        if not prompt:
            continue

        options = [
            html.unescape(value)
            for value in find_all(r'<button class="option" data-value="([^"]*)"', body)
        ]
        labels = [
            text_of(label)
            for label in find_all(
                r'<button class="option" data-value="[^"]*">(.*?)</button>', body
            )
        ]

        kind = default_kind or ("choice" if options else "fill")
        tasks.append(
            {
                "kind": kind,
                "prompt": prompt,
                # показываем подписи, а сверяем по data-value
                "options": labels if labels else [],
                "optionValues": options,
                "answer": html.unescape(answer.group(1)) if answer else "",
                "explanation": html.unescape(explain.group(1)) if explain else "",
            }
        )
    return tasks


# Блоки боковой колонки, которые не нужны в приложении: их содержимое
# уже выводится отдельно (план занятия — из тайминга, ссылка на домашку —
# карточкой над материалом)
SKIP_BLOCK_TITLES = {"Фокус урока", "После урока"}


def parse_block(block: str):
    # Заголовок блока — <h2>, но в боковой колонке (словарь урока) стоит <h3>:
    # без этого блок лексики приезжал в приложение без названия
    title_match = re.search(r"<h2>(.*?)</h2>", block, re.S) or re.search(
        r"<h3>(.*?)</h3>", block, re.S
    )
    title = text_of(title_match.group(1)) if title_match else ""

    head = block[: title_match.start()] if title_match else ""
    body = block[title_match.end():] if title_match else block

    paragraphs = [
        text_of(p)
        for p in find_all(r"<p[^>]*>(.*?)</p>", body)
        if text_of(p) and 'class="task"' not in p
    ]
    # абзацы внутри заданий убираем — они попадут в сами задания
    task_prompts = {t["prompt"] for t in parse_tasks(body)}
    paragraphs = [p for p in paragraphs if p not in task_prompts]

    rules = [text_of(li) for li in find_all(r"<li>(.*?)</li>", body)]
    formulas = [text_of(f) for f in find_all(r'<div class="formula"[^>]*>(.*?)</div>', body)]
    examples = [text_of(e) for e in find_all(r'<div class="example"[^>]*>(.*?)</div>', body)]
    # В блоке говорения образец ответа набран курсивом — раньше он терялся
    examples += [
        text_of(e)
        for e in find_all(r"<em>(.*?)</em>", body)
        if text_of(e) and text_of(e) not in examples
    ]
    prompts = [text_of(s) for s in find_all(r'<div class="mini-list">(.*?)</div>', body)]
    if prompts:
        prompts = [
            text_of(s)
            for s in find_all(r"<span>(.*?)</span>", " ".join(find_all(r'<div class="mini-list">(.*?)</div>', body)))
        ]

    vocab = []
    for word_html in find_all(r'<div class="word">(.*?)</div>', body):
        en = re.search(r"<b>(.*?)</b>", word_html, re.S)
        ru = re.search(r"<span>(.*?)</span>", word_html, re.S)
        if en and ru:
            vocab.append({"en": text_of(en.group(1)), "ru": text_of(ru.group(1))})

    audio_match = re.search(r'<audio[^>]*src="([^"]+)"', body)
    audio = audio_url(audio_match.group(1)) if audio_match else ""
    audio_title_match = re.search(r'<div class="audio-card[^"]*"><b>(.*?)</b>', body, re.S)
    audio_title = text_of(audio_title_match.group(1)) if audio_title_match else ""

    reading_match = re.search(r'<div class="mono">(.*?)</div>', body, re.S)
    reading = text_of(reading_match.group(1)) if reading_match else ""

    script_match = re.search(r'<div class="script">(.*?)</div>', body, re.S)
    transcript = text_of(script_match.group(1)) if script_match else ""

    tasks = parse_tasks(body)

    if vocab:
        kind = "vocab"
    elif audio:
        kind = "listening"
    elif reading:
        kind = "reading"
    elif rules or formulas:
        kind = "rule"
    elif re.match(r"^(Диалог|Монолог|Speaking|Warm-up)", title):
        kind = "speaking"
    elif tasks:
        kind = "tasks"
    else:
        kind = "text"

    return {
        "kind": kind,
        "title": title,
        "paragraphs": paragraphs,
        "rules": rules,
        "formulas": formulas,
        "examples": examples,
        "prompts": prompts,
        "vocab": vocab,
        "audioUrl": audio,
        "audioTitle": audio_title,
        "transcript": transcript,
        "text": reading,
        "tasks": tasks,
    }


def parse_lesson(path: pathlib.Path):
    source = path.read_text(encoding="utf-8", errors="ignore")

    topic = text_of(re.search(r"<h1>(.*?)</h1>", source, re.S).group(1))
    goal_match = re.search(r"<h1>.*?</h1>\s*<p>(.*?)</p>", source, re.S)
    goal = text_of(goal_match.group(1)) if goal_match else ""
    goal = re.sub(r"^Цель:\s*", "", goal)

    duration_match = re.search(r'<span class="chip">(\d+)\s*минут', source)
    duration = int(duration_match.group(1)) if duration_match else 60

    hero_match = re.search(r'<div class="photo"><img src="([^"]+)"', source)
    hero = html.unescape(hero_match.group(1)) if hero_match else ""

    timeline = []
    for slot in find_all(r'<div class="slot">(.*?)</div>\s*(?=<div class="slot">|</div>)', source):
        time = re.search(r"<time>(.*?)</time>", slot, re.S)
        name = re.search(r"<strong>(.*?)</strong>", slot, re.S)
        note = re.search(r"<span>(.*?)</span>", slot, re.S)
        if time and name:
            timeline.append(
                {
                    "time": text_of(time.group(1)),
                    "title": text_of(name.group(1)),
                    "note": text_of(note.group(1)) if note else "",
                }
            )

    blocks = [
        block
        for block in (parse_block(b) for b in split_blocks(source))
        if block["title"] not in SKIP_BLOCK_TITLES
    ]

    words = []
    for block in blocks:
        for item in block["vocab"]:
            words.append({"english": item["en"], "russian": item["ru"]})

    return {
        "topic": topic,
        "goal": goal,
        "durationMin": duration,
        "heroImage": hero,
        "timeline": timeline,
        "blocks": blocks,
        "words": words,
    }


def parse_homework(path: pathlib.Path):
    source = path.read_text(encoding="utf-8", errors="ignore")

    title = text_of(re.search(r"<h1>(.*?)</h1>", source, re.S).group(1))
    intro_match = re.search(r"<h1>.*?</h1>\s*<p>(.*?)</p>", source, re.S)
    intro = text_of(intro_match.group(1)) if intro_match else ""

    tasks = []
    for block in split_blocks(source):
        parsed = parse_block(block)
        section = parsed["title"]

        audio = parsed["audioUrl"]
        reading = parsed["text"]

        if parsed["tasks"]:
            for task in parsed["tasks"]:
                if audio:
                    kind = "LISTENING"
                elif reading:
                    kind = "READING"
                else:
                    kind = "CHOICE" if task["optionValues"] else "FILL"

                tasks.append(
                    {
                        "section": section,
                        "kind": kind,
                        "prompt": task["prompt"],
                        "options": task["options"],
                        "optionValues": task["optionValues"],
                        "answer": task["answer"],
                        "explanation": task["explanation"],
                        "audioUrl": audio,
                        "transcript": parsed["transcript"],
                        "text": reading,
                    }
                )
        else:
            # Writing / Speaking — проверяет преподаватель
            prompt = "\n".join(parsed["paragraphs"] + parsed["prompts"]).strip()
            if not prompt:
                continue

            min_words = re.search(r'data-min-words="(\d+)"', block)
            sample = re.search(r'data-text="([^"]*)"', block)

            tasks.append(
                {
                    "section": section,
                    "kind": "TEACHER",
                    "prompt": prompt,
                    "options": [],
                    "optionValues": [],
                    "answer": "",
                    "explanation": html.unescape(sample.group(1)) if sample else "",
                    "rule": f"Минимум {min_words.group(1)} слов" if min_words else "",
                    "audioUrl": "",
                    "transcript": "",
                    "text": reading,
                }
            )

    return {"title": title, "intro": intro, "tasks": tasks}


def parse_a2_test(path: pathlib.Path):
    source = path.read_text(encoding="utf-8", errors="ignore")
    array_match = re.search(r"const questions = \[(.*?)\];", source, re.S)
    if not array_match:
        return None

    questions = []
    for item in re.finditer(
        r'\{\s*skill:\s*"([^"]*)",\s*q:\s*"((?:[^"\\]|\\.)*)",\s*options:\s*\[(.*?)\],\s*answer:\s*"((?:[^"\\]|\\.)*)"\s*\}',
        array_match.group(1),
        re.S,
    ):
        skill, question, options_raw, answer = item.groups()
        options = [
            opt.strip().strip('"').replace('\\"', '"')
            for opt in re.findall(r'"((?:[^"\\]|\\.)*)"', options_raw)
        ]
        answer = answer.replace('\\"', '"')
        if answer not in options:
            continue
        questions.append(
            {
                "text": question.replace('\\"', '"'),
                "options": options,
                "correct": options.index(answer),
                "explanation": f"Тема: {skill}. Правильный вариант — «{answer}».",
            }
        )

    return {
        "title": "Универсальный тест уровня A2",
        "description": "30 вопросов на грамматику и лексику уровня A2",
        "level": "A2",
        "questions": questions,
    }


LESSONS = [
    {
        "number": 0,
        "file": "trial.html",
        "homework": "trial-homework.html",
        "level": "A1",
        "bookTitle": "Essential Grammar in Use, R. Murphy",
        "bookRef": "Units 1-14, Present Simple и Past Simple",
        "description": "Пробное занятие: повторяем базовые времена перед началом курса",
    },
    {
        "number": 1,
        "file": "lesson1.html",
        "homework": "lesson1-homework.html",
        "level": "A2",
        "bookTitle": "Open World Key (A2), Cambridge",
        "bookRef": "Unit 1, аудио Track 002",
        "description": "Первое прибытие: аэропорт, документы, объявления и Present Simple / Continuous",
    },
    {
        "number": 2,
        "file": "lesson2.html",
        "homework": "lesson2-homework.html",
        "level": "B1",
        "bookTitle": "Empower B1 Student's Book, Cambridge",
        "bookRef": "Unit 2, Present Perfect и планы",
        "description": "Бронирование отеля, опыт путешествий, планы и общение на ресепшене",
    },
    {
        "number": 3,
        "file": "lesson3.html",
        "homework": "lesson3-homework.html",
        "level": "A2",
        "bookTitle": "Open World Key (A2), Cambridge",
        "bookRef": "Unit 3, аудио Track 003",
        "description": "Покупки, сравнение товаров, возврат, обмен и решение проблемы",
    },
]


def main():
    lessons = []
    for meta in LESSONS:
        lesson = parse_lesson(SRC / meta["file"])
        lesson.update(
            {
                "number": meta["number"],
                "level": meta["level"],
                "bookTitle": meta["bookTitle"],
                "bookRef": meta["bookRef"],
                "description": meta["description"],
                "homework": parse_homework(SRC / meta["homework"]),
            }
        )
        lessons.append(lesson)

    payload = {"lessons": lessons, "tests": [t for t in [parse_a2_test(SRC / "a2-test.html")] if t]}

    out = SRC / "lessons.json"
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Записано: {out.relative_to(ROOT)}")
    for lesson in lessons:
        kinds = ", ".join(f"{b['kind']}" for b in lesson["blocks"])
        print(
            f"  Урок {lesson['number']}: {lesson['topic']}\n"
            f"    блоков {len(lesson['blocks'])} [{kinds}]\n"
            f"    слов {len(lesson['words'])}, заданий в ДЗ {len(lesson['homework']['tasks'])}"
        )
    for test in payload["tests"]:
        print(f"  Тест: {test['title']} — вопросов {len(test['questions'])}")


if __name__ == "__main__":
    main()
