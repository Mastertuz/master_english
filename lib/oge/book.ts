import { demo2027 } from "./demo-2027";
import type {
  ChoiceQuestion,
  Explanation,
  GapLine,
  Letter,
  Matching,
  Strategy,
  TimedTranscript,
  WordRow,
} from "./types";

/**
 * Варианты 2 и 3 из сборника «ОГЭ. Типовые экзаменационные варианты»:
 * в книге есть задания, ключи и тексты записей, но нет пояснений к ответам.
 * Пояснения написаны отдельно (lib/oge/explain.ts), а пустые — интерфейс просто не показывает.
 */

export const NO_EXPLANATION: Explanation = { why: "" };
export const NO_STRATEGY: Strategy = { checks: "", steps: [], mistakes: [] };

/** Единые для всех вариантов формулировки заданий и критерии оценивания */
export const COMMON = {
  listening: {
    part1Intro: demo2027.listening.part1.intro,
    part5Intro: demo2027.listening.part5.intro,
    part6Intro: demo2027.listening.part6.intro,
  },
  reading: {
    part12Intro: demo2027.reading.part12.intro,
    part13Intro: demo2027.reading.part13.intro,
  },
  grammar: {
    part20Intro: demo2027.grammar.part20.intro,
    part29Intro: demo2027.grammar.part29.intro,
  },
  writing: {
    intro: demo2027.writing.intro,
    criteria: demo2027.writing.criteria,
    rules: demo2027.writing.rules,
    template: demo2027.writing.template,
  },
  speaking: {
    task1: {
      instruction: demo2027.speaking.task1.instruction,
      prepSec: demo2027.speaking.task1.prepSec,
      answerSec: demo2027.speaking.task1.answerSec,
      criteria: demo2027.speaking.task1.criteria,
    },
    task2: {
      instruction: demo2027.speaking.task2.instruction,
      answerSec: demo2027.speaking.task2.answerSec,
      criteria: demo2027.speaking.task2.criteria,
    },
    task3: {
      prepSec: demo2027.speaking.task3.prepSec,
      answerSec: demo2027.speaking.task3.answerSec,
      criteria: demo2027.speaking.task3.criteria,
    },
  },
};

/* ─────────────── Тексты записей и таймкоды (генерирует scripts/generate-oge-audio.mjs) ─────────────── */

export type ScriptItem = {
  title: string;
  voice?: string;
  text?: string;
  lines?: { who: string; text: string }[];
};

export type AudioScript = {
  part1: ScriptItem[];
  part5: { presenter: string; speakers: ScriptItem[] };
  part6: { who: string; text: string }[];
  speaking: { intro: string; questions: string[]; outro: string };
};

type Mark = { label: string; at: number };

export type AudioMarks = {
  listening: {
    marks: Mark[];
    part1: { timecodes: Mark[]; starts: number[] };
    part5: { timecodes: Mark[]; presenterAt: number; starts: number[] };
    part6: { timecodes: Mark[]; transcriptAt: number };
  };
  speaking: {
    questions: { start: number; end: number }[];
    outro: { start: number; end: number };
  };
};

function itemText(item: ScriptItem): string {
  if (item.lines) return item.lines.map((line) => `${line.who}: ${line.text}`).join("\n");
  return item.text ?? "";
}

export function timedTranscripts(items: ScriptItem[], starts: number[]): TimedTranscript[] {
  return items.map((item, index) => ({
    title: item.title,
    at: starts[index] ?? 0,
    text: itemText(item),
  }));
}

export function dialogueText(lines: { who: string; text: string }[]): string {
  return lines.map((line) => `${line.who}: ${line.text}`).join("\n");
}

/* ─────────────── Конструкторы заданий ─────────────── */

export function choice(
  n: number,
  prompt: string,
  options: string[],
  answer: string,
): ChoiceQuestion {
  return { n, prompt, options, answer, explanation: NO_EXPLANATION };
}

const TRUE_FALSE = ["True", "False", "Not stated"];

export function statement(n: number, prompt: string, answer: string): ChoiceQuestion {
  return choice(n, prompt, TRUE_FALSE, answer);
}

export function wordRow(n: number, label: string, answer: string): WordRow {
  return { n, label, answer, explanation: NO_EXPLANATION };
}

export function gap(
  n: number,
  before: string,
  word: string,
  after: string,
  answer: string,
): GapLine {
  return { n, before, after, word, answer, explanation: NO_EXPLANATION };
}

export function matching(
  base: Pick<Matching, "n" | "intro" | "letters" | "options" | "answer"> & {
    extraWhy: string;
  },
): Matching {
  const explanations = Object.fromEntries(
    base.letters.map((letter) => [letter, NO_EXPLANATION]),
  ) as Partial<Record<Letter, Explanation>>;
  const used = new Set(base.answer.split("").map(Number));
  const extra = base.options.findIndex((_, index) => !used.has(index + 1)) + 1;
  return {
    n: base.n,
    intro: base.intro,
    letters: base.letters,
    options: base.options,
    answer: base.answer,
    explanations,
    extra: { option: extra, why: base.extraWhy },
  };
}
