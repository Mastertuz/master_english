"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addWordFromTextAction } from "@/app/actions/words";
import { SpeakButton } from "@/components/ui/SpeakButton";
import type { DictionarySense } from "@/lib/dictionary";
import { partOfSpeechRu } from "@/lib/part-of-speech";

const MAX_CHARS = 60;
const MAX_WORDS = 5;
const PANEL_WIDTH = 340;

type Found = {
  word: string;
  source: string;
  senses: DictionarySense[];
  best: number;
  /** Машинный перевод, если у Cambridge нет русского ни для одного значения */
  machineRussian?: string;
};

/** range — копия выделения: по нему окно едет за словом при прокрутке */
type Selected = { text: string; sentence: string; rect: DOMRect; range: Range };

type Load =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: Found };

/** Предложение вокруг выделения — по нему выбираем значение слова */
function sentenceAround(range: Range): string {
  const start = range.startContainer;
  const element =
    start.nodeType === Node.ELEMENT_NODE ? (start as Element) : start.parentElement;
  const block =
    element?.closest("p, li, td, th, blockquote, label, h1, h2, h3, h4, dd, summary") ??
    element;
  if (!block) return "";

  const before = document.createRange();
  before.selectNodeContents(block);
  before.setEnd(range.startContainer, range.startOffset);

  const full = block.textContent ?? "";
  const offset = before.toString().length;
  const selected = range.toString();

  const marks = [".", "!", "?", "…", "\n"];
  const from =
    Math.max(...marks.map((mark) => full.lastIndexOf(mark, offset - 1))) + 1;
  const ends = marks
    .map((mark) => full.indexOf(mark, offset + selected.length))
    .filter((index) => index >= 0);
  let to = ends.length ? Math.min(...ends) + 1 : full.length;
  // Многоточие и «?!» — один конец предложения, а не обрыв на первой точке
  while (to < full.length && /[.!?…]/.test(full[to])) to += 1;

  return full.slice(from, to).replace(/\s+/g, " ").trim().slice(0, 400);
}

/** Выделение, которое имеет смысл переводить, или null */
function readSelection(panel: HTMLElement | null): Selected | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;

  const text = selection
    .toString()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
  if (
    !text ||
    text.length > MAX_CHARS ||
    text.split(" ").length > MAX_WORDS ||
    !/^[A-Za-z][A-Za-z'’ -]*$/.test(text)
  ) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const host = range.commonAncestorContainer;
  const element =
    host.nodeType === Node.ELEMENT_NODE ? (host as Element) : host.parentElement;

  // Только содержимое страницы: не шапка, не поля ввода и не само окно
  if (
    !element ||
    !element.closest("main") ||
    element.closest("input, textarea, select, [contenteditable='true'], [data-no-translate]") ||
    panel?.contains(element)
  ) {
    return null;
  }

  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;

  return {
    text: text.replace(/’/g, "'"),
    sentence: sentenceAround(range),
    rect,
    range: range.cloneRange(),
  };
}

/**
 * Перевод выделенного слова: всплывающее окно с переводом по контексту,
 * другими значениями и добавлением в словарь. Работает на всех страницах.
 */
export function SelectionTranslator() {
  const panel = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const current = useRef("");

  const [selected, setSelected] = useState<Selected | null>(null);
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [chosen, setChosen] = useState(0);
  const [sentenceRu, setSentenceRu] = useState<string | null>(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ ok: boolean; message: string } | null>(null);

  const close = useCallback(() => {
    request.current?.abort();
    current.current = "";
    setSelected(null);
    // Снимаем выделение: иначе проверка после отпускания кнопки мыши
    // (или selectionchange) нашла бы то же слово и открыла окно снова
    window.getSelection()?.removeAllRanges();
  }, []);

  const open = useCallback(async (next: Selected) => {
    const key = `${next.text}|${next.sentence}`;
    setSelected(next);
    if (current.current === key) return;
    current.current = key;

    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;

    setLoad({ status: "loading" });
    setSentenceRu(null);
    setSaved(null);

    try {
      const response = await fetch("/api/dictionary/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: next.text, sentence: next.sentence }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (controller.signal.aborted) return;

      if (!response.ok) {
        setLoad({ status: "error", message: data.error ?? "Перевод не найден" });
        return;
      }
      setChosen((data as Found).best);
      setLoad({ status: "ready", data: data as Found });
    } catch {
      if (!controller.signal.aborted) {
        setLoad({ status: "error", message: "Не удалось связаться со словарём" });
      }
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let pointerDown = false;
    // Где началось касание: тап закрывает окно, а прокрутка пальцем — нет
    let touchStart: { x: number; y: number } | null = null;

    const check = () => {
      const next = readSelection(panel.current);
      if (next) void open(next);
    };

    const insidePanel = (event: Event) =>
      Boolean(panel.current?.contains(event.target as Node));

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = true;
      if (event.pointerType === "touch") {
        touchStart = { x: event.clientX, y: event.clientY };
        return;
      }
      // Полоса прокрутки страницы — тоже прокрутка, окно не закрываем
      const onScrollbar =
        event.target === document.documentElement ||
        event.clientX >= document.documentElement.clientWidth;
      if (onScrollbar) return;
      // Мышью: клик мимо окна закрывает его (и начинает новое выделение)
      if (!insidePanel(event)) close();
    };
    const onPointerUp = (event: PointerEvent) => {
      pointerDown = false;
      // Нажатия внутри окна (крестик, «Добавить», другие значения) —
      // не новое выделение, проверять нечего
      if (insidePanel(event)) {
        touchStart = null;
        return;
      }
      if (event.pointerType === "touch" && touchStart && !insidePanel(event)) {
        const moved = Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y);
        touchStart = null;
        // Короткий тап мимо окна — закрыть; если было выделение, check откроет снова
        if (moved < 10 && !readSelection(panel.current)) {
          close();
          return;
        }
      }
      clearTimeout(timer);
      timer = setTimeout(check, 10);
    };
    // Телефоны меняют выделение ручками без pointerup — ждём, пока успокоится
    const onSelectionChange = () => {
      if (pointerDown) return;
      clearTimeout(timer);
      timer = setTimeout(check, 450);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    // Прокрутка не закрывает окно: оно едет за выделенным словом.
    // Пересчёт — не чаще раза за кадр
    const follow = (event: Event) => {
      if (event.type === "scroll" && insidePanel(event)) return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setSelected((current) =>
          current ? { ...current, rect: current.range.getBoundingClientRect() } : current,
        );
      });
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", follow, { capture: true, passive: true });
    window.addEventListener("resize", follow);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", follow, { capture: true });
      window.removeEventListener("resize", follow);
    };
  }, [open, close]);

  async function translateSentence() {
    if (!selected?.sentence) return;
    setSentenceLoading(true);
    try {
      const response = await fetch("/api/dictionary/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "sentence", sentence: selected.sentence }),
      });
      const data = await response.json();
      setSentenceRu(response.ok ? data.sentenceRu : "Переводчик сейчас недоступен");
    } catch {
      setSentenceRu("Переводчик сейчас недоступен");
    } finally {
      setSentenceLoading(false);
    }
  }

  async function addToDictionary() {
    if (load.status !== "ready") return;
    const sense = load.data.senses[chosen];
    const russian = sense?.russian || load.data.machineRussian || "";
    if (!sense || !russian) return;

    setSaving(true);
    try {
      const sentence = selected?.sentence ?? "";
      const result = await addWordFromTextAction({
        english: sense.word || load.data.word,
        russian,
        partOfSpeech: sense.partOfSpeech,
        definition: sense.definition,
        // Пример — то самое предложение, где слово встретилось
        example: sentence && sentence.length <= 300 ? sentence : sense.example,
        transcription: sense.transcription,
        audioUrl: sense.audioUrl,
        source: load.data.source,
      });
      setSaved(result);
    } catch {
      setSaved({ ok: false, message: "Не удалось добавить слово" });
    } finally {
      setSaving(false);
    }
  }

  if (!selected) return null;

  // Окно под выделением, а если снизу не помещается — над ним
  const width = Math.min(PANEL_WIDTH, window.innerWidth - 16);
  const left = Math.min(
    Math.max(selected.rect.left + selected.rect.width / 2 - width / 2, 8),
    window.innerWidth - width - 8,
  );
  const below = selected.rect.bottom + 8;
  const placeAbove =
    below + 320 > window.innerHeight && selected.rect.top > window.innerHeight / 2;
  // Окно всегда остаётся на экране, даже если выделение частично ушло за край
  const style: React.CSSProperties = placeAbove
    ? {
        left,
        width,
        bottom: Math.min(
          Math.max(window.innerHeight - selected.rect.top + 8, 8),
          window.innerHeight - 160,
        ),
      }
    : { left, width, top: Math.max(8, Math.min(below, window.innerHeight - 160)) };

  const sense = load.status === "ready" ? load.data.senses[chosen] : null;
  const machine = load.status === "ready" && !sense?.russian ? load.data.machineRussian ?? "" : "";
  const russian = sense?.russian || machine;
  // В словарь — словарная форма: «boxes» → «box», «designed» → «design»
  const headword = sense?.word || (load.status === "ready" ? load.data.word : selected.text);
  const others =
    load.status === "ready"
      ? load.data.senses
          .map((item, index) => ({ item, index }))
          .filter(({ index }) => index !== chosen)
      : [];

  return (
    <div
      ref={panel}
      role="dialog"
      aria-label={`Перевод «${selected.text}»`}
      data-no-translate
      style={style}
      className="fixed z-[90] flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white text-left shadow-2xl"
    >
      <div className="flex items-start gap-2 border-b border-ink-100 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="break-words text-[16px] font-semibold text-ink-900">
            {headword}
          </p>
          {headword.toLowerCase() !== selected.text.toLowerCase() ? (
            <p className="text-[12px] text-ink-400">в тексте: {selected.text}</p>
          ) : null}
          {sense?.transcription ? (
            <p className="text-[13px] text-ink-500">{sense.transcription}</p>
          ) : null}
        </div>
        <SpeakButton text={headword} />
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть перевод"
          title="Закрыть (Esc)"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-ink-200 bg-ink-50 text-[15px] font-semibold text-ink-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
        >
          ✕
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 text-[14px]">
        {load.status === "loading" ? (
          <p className="text-ink-500">Ищем перевод…</p>
        ) : load.status === "error" ? (
          <p className="text-rose-600">{load.message}</p>
        ) : sense ? (
          <>
            <div>
              <div className="flex flex-wrap gap-1.5">
                {sense.partOfSpeech ? (
                  <span className="chip bg-ink-100 text-ink-600">
                    {partOfSpeechRu(sense.partOfSpeech)}
                  </span>
                ) : null}
                {chosen === load.data.best && load.data.senses.length > 1 ? (
                  <span className="chip bg-brand-50 text-brand-700">по контексту</span>
                ) : null}
                {machine ? (
                  <span className="chip bg-amber-50 text-amber-700">машинный перевод</span>
                ) : null}
              </div>
              <p className="mt-1.5 break-words text-[17px] font-semibold text-ink-900">
                {russian || "Перевода в словаре нет"}
              </p>
              {sense.definition ? (
                <p className="mt-1 break-words text-[13.5px] text-ink-600">
                  {sense.definition}
                </p>
              ) : null}
            </div>

            {selected.sentence ? (
              <div className="rounded-xl bg-ink-50 px-3 py-2">
                <p className="break-words text-[13px] italic text-ink-600">
                  «{selected.sentence}»
                </p>
                {sentenceRu ? (
                  <p className="mt-1 break-words text-[13px] text-ink-800">{sentenceRu}</p>
                ) : (
                  <button
                    type="button"
                    onClick={translateSentence}
                    disabled={sentenceLoading}
                    className="mt-1 cursor-pointer text-[12.5px] font-medium text-brand-700 hover:underline"
                  >
                    {sentenceLoading ? "Переводим…" : "Перевести предложение"}
                  </button>
                )}
              </div>
            ) : null}

            {others.length ? (
              <details>
                <summary className="cursor-pointer text-[13px] font-medium text-ink-600">
                  Другие значения ({others.length})
                </summary>
                <ul className="mt-2 space-y-1">
                  {others.map(({ item, index }) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => {
                          setChosen(index);
                          setSaved(null);
                        }}
                        className="w-full cursor-pointer rounded-lg px-2 py-1.5 text-left transition hover:bg-ink-50"
                      >
                        <span className="text-ink-900">{item.russian || item.definition}</span>
                        {item.partOfSpeech ? (
                          <span className="ml-1.5 text-[12px] text-ink-400">
                            {partOfSpeechRu(item.partOfSpeech)}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </>
        ) : null}
      </div>

      {load.status === "ready" && sense ? (
        <div className="border-t border-ink-100 px-4 py-3">
          {saved ? (
            <p
              className={`text-[13.5px] font-medium ${
                saved.ok ? "text-emerald-600" : "text-amber-700"
              }`}
            >
              {saved.ok ? "✓ " : ""}
              {saved.message}
            </p>
          ) : (
            <button
              type="button"
              onClick={addToDictionary}
              disabled={saving || !russian}
              className="btn-primary btn-sm w-full"
            >
              {saving ? "Добавляем…" : "➕ Добавить в словарь"}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
