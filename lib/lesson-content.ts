/**
 * Структура содержимого урока. Блоки лежат в Lesson.blocks (JSON),
 * тайминг — в Lesson.timeline. Исходники уроков в content/lessons,
 * конвертер — scripts/convert-lessons.py.
 */

export type LessonTaskKind = "choice" | "fill";

export type LessonTask = {
  /**
   * Собственный id задания. Нужен, чтобы ответы учеников оставались
   * привязанными к своему заданию после перестановки блоков. У уроков,
   * которые ещё не открывали в конструкторе, он пустой — тогда работает
   * запасной ключ по позиции, см. taskKey().
   */
  id: string;
  kind: LessonTaskKind;
  prompt: string;
  /** Подписи вариантов, которые видит ученик */
  options: string[];
  /** Значения вариантов, по ним сверяется ответ */
  optionValues: string[];
  answer: string;
  explanation: string;
  /**
   * Поле ответа на странице учебника: положение в процентах от размера
   * картинки. -1 означает, что задание к странице не привязано и показывается
   * обычным списком под ней.
   */
  x: number;
  y: number;
  /** Ширина поля в процентах от ширины страницы; 0 — ширина по умолчанию */
  w: number;
};

export type LessonBlockKind =
  | "text"
  | "rule"
  | "tasks"
  | "vocab"
  | "listening"
  | "reading"
  | "speaking"
  /** Видеоклип из учебника с заданиями к нему */
  | "video"
  /** Скан страницы учебника с заданиями поверх него */
  | "page";

export type LessonBlock = {
  kind: LessonBlockKind;
  title: string;
  paragraphs: string[];
  rules: string[];
  formulas: string[];
  examples: string[];
  prompts: string[];
  vocab: { en: string; ru: string }[];
  audioUrl: string;
  audioTitle: string;
  /** Видео из учебника: клип к уроку */
  videoUrl: string;
  videoTitle: string;
  /** Дорожка субтитров WebVTT к видео */
  subtitlesUrl: string;
  /**
   * Образец развёрнутого ответа: монолог, диалог, письмо. Виден только
   * преподавателю — ученик должен построить ответ сам.
   */
  sample: string;
  transcript: string;
  /** Скан страницы учебника */
  imageUrl: string;
  /**
   * Блок скрыт от ученика. Преподаватель его видит с пометкой: например,
   * разбор вопросов с прошлого занятия нужен на самом уроке, а в материалах
   * для повторения только мешает.
   */
  hidden: boolean;
  text: string;
  tasks: LessonTask[];
};

export type TimelineSlot = { time: string; title: string; note: string };

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Ширина поля в процентах; вне разумных границ — значение по умолчанию */
function width(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  if (value < 4 || value > 100) return 0;
  return Math.round(value * 10) / 10;
}

/** Координата метки в процентах; всё непонятное считаем «не отмечено» */
function coordinate(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return -1;
  if (value < 0 || value > 100) return -1;
  return Math.round(value * 10) / 10;
}

/** Безопасно приводит JSON из БД к массиву блоков */
export function asBlocks(value: unknown): LessonBlock[] {
  if (!Array.isArray(value)) return [];

  return value.map((raw) => {
    const item = (raw ?? {}) as Record<string, unknown>;

    const tasks: LessonTask[] = Array.isArray(item.tasks)
      ? item.tasks.map((rawTask) => {
          const task = (rawTask ?? {}) as Record<string, unknown>;
          return {
            id: text(task.id),
            kind: task.kind === "choice" ? "choice" : "fill",
            prompt: text(task.prompt),
            options: strings(task.options),
            optionValues: strings(task.optionValues),
            answer: text(task.answer),
            explanation: text(task.explanation),
            x: coordinate(task.x),
            y: coordinate(task.y),
            w: width(task.w),
          };
        })
      : [];

    const vocab = Array.isArray(item.vocab)
      ? item.vocab.flatMap((rawWord) => {
          const word = (rawWord ?? {}) as Record<string, unknown>;
          const en = text(word.en);
          const ru = text(word.ru);
          return en && ru ? [{ en, ru }] : [];
        })
      : [];

    const kinds: LessonBlockKind[] = [
      "text",
      "rule",
      "tasks",
      "vocab",
      "listening",
      "reading",
      "speaking",
      "video",
      "page",
    ];
    const kind = kinds.includes(item.kind as LessonBlockKind)
      ? (item.kind as LessonBlockKind)
      : "text";

    return {
      kind,
      title: text(item.title),
      paragraphs: strings(item.paragraphs),
      rules: strings(item.rules),
      formulas: strings(item.formulas),
      examples: strings(item.examples),
      prompts: strings(item.prompts),
      vocab,
      audioUrl: text(item.audioUrl),
      audioTitle: text(item.audioTitle),
      videoUrl: text(item.videoUrl),
      videoTitle: text(item.videoTitle),
      subtitlesUrl: text(item.subtitlesUrl),
      sample: text(item.sample),
      transcript: text(item.transcript),
      imageUrl: text(item.imageUrl),
      hidden: item.hidden === true,
      text: text(item.text),
      tasks,
    };
  });
}

/** Безопасно приводит JSON из БД к таймингу занятия */
export function asTimeline(value: unknown): TimelineSlot[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((raw) => {
    const slot = (raw ?? {}) as Record<string, unknown>;
    const time = text(slot.time);
    const title = text(slot.title);
    if (!time && !title) return [];
    return [{ time, title, note: text(slot.note) }];
  });
}

/** Чем помечен ответ ученика: id задания, а без него — позиция в уроке */
export function taskKey(
  blockIndex: number,
  taskIndex: number,
  task: LessonTask,
): string {
  return task.id || `${blockIndex}-${taskIndex}`;
}

export const BLOCK_LABELS: Record<LessonBlockKind, string> = {
  text: "Материал",
  rule: "Правило",
  tasks: "Задания",
  vocab: "Лексика",
  listening: "Аудирование",
  reading: "Чтение",
  speaking: "Говорение",
  video: "Видео",
  page: "Страница учебника",
};

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type LevelCode = (typeof LEVELS)[number];

export const LEVEL_LABELS: Record<LevelCode, string> = {
  A1: "A1 — Beginner",
  A2: "A2 — Elementary",
  B1: "B1 — Intermediate",
  B2: "B2 — Upper-Intermediate",
  C1: "C1 — Advanced",
  C2: "C2 — Proficiency",
};

export function isLevel(value: string): value is LevelCode {
  return (LEVELS as readonly string[]).includes(value);
}
