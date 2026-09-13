import {
  markFor,
  sanitizeReview,
  scoreWritten,
  speakingPoints,
  writingPoints,
  type OgeAnswers,
  type OgeReview,
} from "./scoring";
import type { OgeVariant } from "./types";

export type OgeStatus = "new" | "progress" | "submitted" | "checked";

export const STATUS_LABEL: Record<OgeStatus, string> = {
  new: "Не начат",
  progress: "В процессе",
  submitted: "Ждёт проверки",
  checked: "Проверен",
};

export const STATUS_STYLE: Record<OgeStatus, string> = {
  new: "bg-ink-100 text-ink-500",
  progress: "bg-brand-50 text-brand-700",
  submitted: "bg-amber-50 text-amber-700",
  checked: "bg-emerald-50 text-emerald-700",
};

/** Разделы экзамена: баллы и рекомендуемое время */
export const STRUCTURE = [
  { part: "Аудирование", tasks: "1–11", max: 15, time: "30 мин" },
  { part: "Чтение", tasks: "12–19", max: 13, time: "30 мин" },
  { part: "Грамматика и лексика", tasks: "20–34", max: 15, time: "30 мин" },
  { part: "Письмо", tasks: "35", max: 10, time: "30 мин" },
  { part: "Устная часть", tasks: "1–3", max: 15, time: "15 мин" },
] as const;

export function asAnswers(value: unknown): OgeAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

export function asReview(value: unknown): OgeReview | null {
  return value && typeof value === "object" ? sanitizeReview(value) : null;
}

type AttemptLike = {
  answers: unknown;
  review: unknown;
  submittedAt: Date | null;
  checkedAt: Date | null;
} | null;

/** Статус и баллы попытки — для списков, карточки ученика и результатов */
export function summarize(variant: OgeVariant, attempt: AttemptLike) {
  const answers = asAnswers(attempt?.answers);
  const review = asReview(attempt?.review);
  const written = scoreWritten(variant, answers);

  const auto =
    written.listening.points + written.reading.points + written.grammar.points;
  const autoMax =
    written.listening.max + written.reading.max + written.grammar.max;
  const writing = writingPoints(review);
  const speaking = speakingPoints(review);
  const total = auto + (writing ?? 0) + (speaking ?? 0);

  const status: OgeStatus = !attempt
    ? "new"
    : attempt.checkedAt
      ? "checked"
      : attempt.submittedAt
        ? "submitted"
        : "progress";

  return {
    status,
    answers,
    review,
    written,
    answered: Object.values(answers).filter((value) => value.trim()).length,
    auto,
    autoMax,
    writing,
    speaking,
    total,
    mark: markFor(total),
  };
}

/** Сколько полей в письменной части: клетки 5 и 12 считаются по одной */
export function fieldCount(variant: OgeVariant): number {
  const { listening, reading, grammar } = variant;
  const gaps = [...grammar.part20.lines, ...grammar.part29.lines].filter(
    (line) => "n" in line,
  ).length;

  return (
    listening.part1.questions.length +
    listening.part5.letters.length +
    listening.part6.rows.length +
    reading.part12.letters.length +
    reading.part13.statements.length +
    gaps +
    1
  );
}
