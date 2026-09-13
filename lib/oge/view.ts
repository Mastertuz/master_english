import type { GapLine, OgeVariant } from "./types";

export type ExamGapLine =
  | { text: string }
  | { n: number; before: string; after: string; word: string };

function gaps(lines: GapLine[]): ExamGapLine[] {
  return lines.map((line) =>
    "n" in line
      ? { n: line.n, before: line.before, after: line.after, word: line.word }
      : { text: line.text },
  );
}

/**
 * Вариант без ключей, разборов, текстов записей и образцов ответов.
 * Всё, что уходит в браузер, ученик может прочитать в коде страницы,
 * поэтому ответы отдаём только после отправки работы.
 */
export function examView(variant: OgeVariant) {
  const { listening, reading, grammar, writing, speaking } = variant;

  return {
    id: variant.id,
    title: variant.title,
    listening: {
      audioUrl: listening.audioUrl,
      marks: listening.marks,
      part1: {
        timecodes: listening.part1.timecodes,
        intro: listening.part1.intro,
        questions: listening.part1.questions.map(({ n, prompt, options }) => ({
          n,
          prompt,
          options,
        })),
      },
      part5: {
        n: listening.part5.n,
        timecodes: listening.part5.timecodes,
        intro: listening.part5.intro,
        letters: listening.part5.letters,
        options: listening.part5.options,
      },
      part6: {
        timecodes: listening.part6.timecodes,
        intro: listening.part6.intro,
        rows: listening.part6.rows.map(({ n, label }) => ({ n, label })),
      },
    },
    reading: {
      part12: {
        n: reading.part12.n,
        intro: reading.part12.intro,
        letters: reading.part12.letters,
        options: reading.part12.options,
        texts: reading.part12.texts,
      },
      part13: {
        intro: reading.part13.intro,
        title: reading.part13.title,
        paragraphs: reading.part13.paragraphs,
        statements: reading.part13.statements.map(({ n, prompt, options }) => ({
          n,
          prompt,
          options,
        })),
      },
    },
    grammar: {
      part20: { intro: grammar.part20.intro, lines: gaps(grammar.part20.lines) },
      part29: { intro: grammar.part29.intro, lines: gaps(grammar.part29.lines) },
    },
    writing: {
      n: writing.n,
      intro: writing.intro,
      email: writing.email,
      task: writing.task,
      rules: writing.rules,
    },
    speaking: {
      audioUrl: speaking.audioUrl,
      task1: {
        instruction: speaking.task1.instruction,
        text: speaking.task1.text,
        prepSec: speaking.task1.prepSec,
        answerSec: speaking.task1.answerSec,
      },
      task2: {
        instruction: speaking.task2.instruction,
        answerSec: speaking.task2.answerSec,
        questions: speaking.task2.questions.map(({ text, start, end }) => ({
          text,
          start,
          end,
        })),
      },
      task3: {
        instruction: speaking.task3.instruction,
        points: speaking.task3.points,
        prepSec: speaking.task3.prepSec,
        answerSec: speaking.task3.answerSec,
      },
    },
  };
}

export type ExamView = ReturnType<typeof examView>;
