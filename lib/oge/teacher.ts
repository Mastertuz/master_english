import { gapItems } from "./scoring";
import type {
  Explanation,
  Matching,
  OgeVariant,
  TimedTranscript,
} from "./types";

export type TeacherNote = { answer: string; explanation: Explanation };

/**
 * Всё, что видит в варианте только преподаватель: верные ответы с
 * объяснением и правилом, тексты записей, образцы письма и устных ответов.
 * Ученику это в браузер не отправляется.
 */
export type TeacherNotes = {
  answers: Record<string, TeacherNote>;
  /** Лишний вариант в заданиях на соответствие: «5», «12» */
  extras: Record<string, string>;
  transcripts: {
    part1: TimedTranscript[];
    part5: TimedTranscript[];
    part6: TimedTranscript[];
  };
  writing: { sample: string; plan: string[] };
  speaking: {
    hardWords: { word: string; tip: string }[];
    task2: { intro: string; outro: string; samples: string[] };
    task3Sample: string;
  };
};

export function teacherNotes(variant: OgeVariant): TeacherNotes {
  const { listening, reading, grammar, writing, speaking, rules } = variant;
  const answers: Record<string, TeacherNote> = {};
  const extras: Record<string, string> = {};

  const withRule = (key: string, explanation: Explanation): Explanation => ({
    ...explanation,
    rule: rules[key] ?? explanation.rule,
  });
  const option = (options: string[], answer: string) =>
    `${answer}) ${options[Number(answer) - 1] ?? ""}`;
  const variants = (answer: string) => answer.split(";").join(" / ");

  const matching = (task: Matching) => {
    task.letters.forEach((letter, index) => {
      const explanation = task.explanations[letter];
      const digit = task.answer[index];
      const key = `${task.n}${letter}`;
      if (explanation) {
        answers[key] = {
          answer: `${digit} — ${task.options[Number(digit) - 1] ?? ""}`,
          explanation: withRule(key, explanation),
        };
      }
    });
    extras[String(task.n)] =
      `${task.extra.option}. ${task.options[task.extra.option - 1]} — ${task.extra.why}`;
  };

  for (const question of [
    ...listening.part1.questions,
    ...reading.part13.statements,
  ]) {
    answers[String(question.n)] = {
      answer: option(question.options, question.answer),
      explanation: withRule(String(question.n), question.explanation),
    };
  }
  for (const row of listening.part6.rows) {
    answers[String(row.n)] = {
      answer: variants(row.answer),
      explanation: withRule(String(row.n), row.explanation),
    };
  }
  for (const gap of [
    ...gapItems(grammar.part20.lines),
    ...gapItems(grammar.part29.lines),
  ]) {
    answers[String(gap.n)] = {
      answer: variants(gap.answer),
      explanation: withRule(String(gap.n), gap.explanation),
    };
  }
  matching(listening.part5);
  matching(reading.part12);

  return {
    answers,
    extras,
    transcripts: {
      part1: listening.part1.transcripts,
      part5: listening.part5.transcripts,
      part6: [
        {
          title: "Интервью",
          text: listening.part6.transcript,
          at: listening.part6.transcriptAt,
        },
      ],
    },
    writing: { sample: writing.sample, plan: writing.plan },
    speaking: {
      hardWords: speaking.task1.hardWords,
      task2: {
        intro: speaking.task2.introText,
        outro: speaking.task2.outroText,
        samples: speaking.task2.questions.map((question) => question.sample),
      },
      task3Sample: speaking.task3.sample,
    },
  };
}
