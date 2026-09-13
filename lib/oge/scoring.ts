import type { GapLine, Letter, Matching, OgeVariant } from "./types";

/** Ответы ученика по ключам заданий: «1», «5A», «20», «35» */
export type OgeAnswers = Record<string, string>;

/**
 * Баллы преподавателя за развёрнутые ответы.
 * w35 — письмо (К1–К4), s1 — чтение вслух, s2 — шесть ответов по 0/1,
 * s3 — монолог (К1–К3).
 */
export type OgeReview = {
  w35?: { k1: number; k2: number; k3: number; k4: number };
  s1?: number;
  s2?: number[];
  s3?: { k1: number; k2: number; k3: number };
};

export const WRITING_MAX = 10;
export const SPEAKING_MAX = 15;
export const TOTAL_MAX = 68;

/** Ключи записей устной части — в том порядке, в котором их выполняют */
export const RECORDING_KEYS = [
  "s1",
  "s2-1",
  "s2-2",
  "s2-3",
  "s2-4",
  "s2-5",
  "s2-6",
  "s3",
] as const;

export function isRecordingKey(value: string): boolean {
  return (RECORDING_KEYS as readonly string[]).includes(value);
}

/**
 * Как в бланке ответов: регистр, пробелы и типографский апостроф
 * не важны, а орфография важна — «didn't mind» и «didnotmind» оба верны.
 */
export function normalizeShort(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, "")
    .replace(/[.,!?;:]+$/g, "");
}

export function isShortCorrect(given: string, expected: string): boolean {
  const answer = normalizeShort(given);
  if (!answer) return false;
  return expected
    .split(";")
    .map(normalizeShort)
    .some((variant) => variant === answer);
}

/** Строка проверки одного задания с кратким ответом */
export type ScoredItem = {
  key: string;
  n: number;
  given: string;
  expected: string;
  points: number;
  max: number;
};

export type SectionScore = { points: number; max: number; items: ScoredItem[] };

function single(
  answers: OgeAnswers,
  n: number,
  expected: string,
  compare: (given: string, expected: string) => boolean,
): ScoredItem {
  const given = (answers[String(n)] ?? "").trim();
  return {
    key: String(n),
    n,
    given,
    expected,
    points: compare(given, expected) ? 1 : 0,
    max: 1,
  };
}

/**
 * Задания на соответствие (5 и 12): за каждую неверную или пустую позицию
 * минус балл. Ответ собираем из клеток «5A», «5B»…
 */
export function scoreMatching(answers: OgeAnswers, task: Matching): ScoredItem {
  const cells = task.letters.map(
    (letter) => (answers[`${task.n}${letter}`] ?? "").trim(),
  );
  const wrong = cells.filter((cell, index) => cell !== task.answer[index]).length;
  const filled = cells.some(Boolean);

  return {
    key: String(task.n),
    n: task.n,
    given: filled ? cells.map((cell) => cell || "·").join("") : "",
    expected: task.answer,
    points: Math.max(task.letters.length - wrong, 0),
    max: task.letters.length,
  };
}

export function gapItems(lines: GapLine[]) {
  return lines.filter(
    (line): line is Extract<GapLine, { n: number }> => "n" in line,
  );
}

function section(items: ScoredItem[]): SectionScore {
  return {
    items,
    points: items.reduce((sum, item) => sum + item.points, 0),
    max: items.reduce((sum, item) => sum + item.max, 0),
  };
}

const exact = (given: string, expected: string) => given === expected;

/** Автопроверка заданий 1–34 */
export function scoreWritten(variant: OgeVariant, answers: OgeAnswers) {
  const { listening, reading, grammar } = variant;

  const listeningScore = section([
    ...listening.part1.questions.map((q) => single(answers, q.n, q.answer, exact)),
    scoreMatching(answers, listening.part5),
    ...listening.part6.rows.map((row) =>
      single(answers, row.n, row.answer, isShortCorrect),
    ),
  ]);

  const readingScore = section([
    scoreMatching(answers, reading.part12),
    ...reading.part13.statements.map((q) => single(answers, q.n, q.answer, exact)),
  ]);

  const grammarScore = section(
    [...gapItems(grammar.part20.lines), ...gapItems(grammar.part29.lines)].map(
      (gap) => single(answers, gap.n, gap.answer, isShortCorrect),
    ),
  );

  return {
    listening: listeningScore,
    reading: readingScore,
    grammar: grammarScore,
  };
}

function clamp(value: unknown, max: number): number {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return 0;
  return Math.min(Math.max(number, 0), max);
}

/** Приводит присланные баллы к допустимым значениям */
export function sanitizeReview(raw: unknown): OgeReview {
  const source = (raw ?? {}) as Record<string, unknown>;
  const review: OgeReview = {};

  const w35 = source.w35 as Record<string, unknown> | undefined;
  if (w35) {
    review.w35 = {
      k1: clamp(w35.k1, 3),
      k2: clamp(w35.k2, 2),
      k3: clamp(w35.k3, 3),
      k4: clamp(w35.k4, 2),
    };
  }
  if (source.s1 !== undefined && source.s1 !== null && source.s1 !== "") {
    review.s1 = clamp(source.s1, 2);
  }
  if (Array.isArray(source.s2)) {
    review.s2 = Array.from({ length: 6 }, (_, index) =>
      clamp(source.s2 && (source.s2 as unknown[])[index], 1),
    );
  }
  const s3 = source.s3 as Record<string, unknown> | undefined;
  if (s3) {
    review.s3 = {
      k1: clamp(s3.k1, 3),
      k2: clamp(s3.k2, 2),
      k3: clamp(s3.k3, 2),
    };
  }
  return review;
}

/**
 * Баллы из полей формы учителя: «w35_k1», «s1», «s2_3», «s3_k2».
 * Пустое поле — «ещё не оценено»; раздел засчитывается, если заполнено
 * хотя бы одно его поле. Общая функция для формы и сервера.
 */
export function reviewFromFields(get: (name: string) => string): OgeReview {
  const number = (name: string) => {
    const value = get(name).trim();
    return value === "" ? undefined : Number(value);
  };
  const some = (values: (number | undefined)[]) =>
    values.some((value) => value !== undefined);

  const raw: Record<string, unknown> = {};

  const w35 = ["k1", "k2", "k3", "k4"].map((k) => number(`w35_${k}`));
  if (some(w35)) {
    raw.w35 = { k1: w35[0] ?? 0, k2: w35[1] ?? 0, k3: w35[2] ?? 0, k4: w35[3] ?? 0 };
  }

  const s1 = number("s1");
  if (s1 !== undefined) raw.s1 = s1;

  const s2 = Array.from({ length: 6 }, (_, index) => number(`s2_${index + 1}`));
  if (some(s2)) raw.s2 = s2.map((value) => value ?? 0);

  const s3 = ["k1", "k2", "k3"].map((k) => number(`s3_${k}`));
  if (some(s3)) raw.s3 = { k1: s3[0] ?? 0, k2: s3[1] ?? 0, k3: s3[2] ?? 0 };

  return sanitizeReview(raw);
}

/** Письмо: 0 по К1 обнуляет всё задание */
export function writingPoints(review: OgeReview | null): number | null {
  const w = review?.w35;
  if (!w) return null;
  return w.k1 === 0 ? 0 : w.k1 + w.k2 + w.k3 + w.k4;
}

/** Устная часть; null — ещё ничего не оценено */
export function speakingPoints(review: OgeReview | null): number | null {
  if (!review) return null;
  const { s1, s2, s3 } = review;
  if (s1 === undefined && !s2 && !s3) return null;

  const monologue = s3 ? (s3.k1 === 0 ? 0 : s3.k1 + s3.k2 + s3.k3) : 0;
  const dialogue = (s2 ?? []).reduce((sum, value) => sum + value, 0);
  return (s1 ?? 0) + dialogue + monologue;
}

/**
 * Перевод первичного балла в отметку. Шкалу ФИПИ ежегодно рекомендует
 * отдельным письмом; здесь — шкала последних лет.
 */
export function markFor(total: number): 2 | 3 | 4 | 5 {
  if (total >= 58) return 5;
  if (total >= 46) return 4;
  if (total >= 29) return 3;
  return 2;
}

export const MARK_SCALE = [
  { mark: 2, range: "0–28" },
  { mark: 3, range: "29–45" },
  { mark: 4, range: "46–57" },
  { mark: 5, range: "58–68" },
] as const;

/**
 * Слова в письме по правилам ОГЭ: I've и doesn't — одно слово, числа
 * цифрами — одно слово, pop-singer — одно слово, обращение и подпись
 * тоже считаются.
 */
export function countWords(text: string): number {
  return text
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

/** Все клетки одного задания на соответствие */
export function matchingKeys(task: { n: number; letters: Letter[] }): string[] {
  return task.letters.map((letter) => `${task.n}${letter}`);
}
