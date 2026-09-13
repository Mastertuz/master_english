/**
 * Вариант ОГЭ по английскому. Задания, ключи и разбор живут в коде: вариант
 * меняется раз в год, а ответы учеников хранятся в OgeAttempt по ключам
 * заданий — «1», «5A», «12F», «20», «35».
 */

/** Разбор задания: почему ответ верный и где ловушка */
export type Explanation = {
  /** Цитата из текста или записи, в которой спрятан ответ */
  proof?: string;
  /** Почему именно так */
  why: string;
  /** На какой вариант чаще всего ошибаются и почему он не подходит */
  trap?: string;
  /** Правило, по которому выбирается ответ (подставляется из OgeVariant.rules) */
  rule?: string;
};

/** Место в аудиозаписи: секунды от начала */
export type Timecode = { label: string; at: number };

/** Текст записи и где он звучит в первый раз */
export type TimedTranscript = { title: string; text: string; at: number };

export type ChoiceQuestion = {
  n: number;
  prompt: string;
  options: string[];
  /** Номер верного варианта: «1», «2» или «3» */
  answer: string;
  explanation: Explanation;
};

export type WordRow = {
  n: number;
  label: string;
  /** Допустимые варианты через «;» */
  answer: string;
  explanation: Explanation;
};

/** Строка текста с пропуском или без него (заданиям 20–34) */
export type GapLine =
  | { text: string }
  | {
      n: number;
      before: string;
      after: string;
      /** Слово, которое нужно преобразовать, как в бланке — заглавными */
      word: string;
      answer: string;
      explanation: Explanation;
    };

export type Letter = "A" | "B" | "C" | "D" | "E" | "F";

export type Matching = {
  n: number;
  intro: string;
  /** Буквы, к которым подбирают номер: говорящие A–E или тексты A–F */
  letters: Letter[];
  /** Список номеров 1–6 (рубрики) или 1–7 (вопросы) */
  options: string[];
  /** Ключ в порядке букв, например «32614» */
  answer: string;
  explanations: Partial<Record<Letter, Explanation>>;
  /** Номер, который остаётся лишним, и почему */
  extra: { option: number; why: string };
};

export type Strategy = {
  /** Что проверяет задание — одной фразой */
  checks: string;
  /** Как выполнять: пошагово */
  steps: string[];
  /** Типичные ошибки */
  mistakes: string[];
};

export type Criterion = {
  code: string;
  title: string;
  max: number;
  /** Что нужно для максимального балла */
  full: string;
};

export type OgeVariant = {
  id: string;
  title: string;
  subtitle: string;
  /** Правило к каждому заданию по его ключу: «1», «5A», «12F», «20» */
  rules: Record<string, string>;

  listening: {
    audioUrl: string;
    /** Где в записи начинается каждое задание */
    marks: Timecode[];
    part1: {
      /** Тексты A–D, первое и второе прослушивание */
      timecodes: Timecode[];
      intro: string;
      questions: ChoiceQuestion[];
      transcripts: TimedTranscript[];
      strategy: Strategy;
    };
    part5: Matching & {
      timecodes: Timecode[];
      transcripts: TimedTranscript[];
      strategy: Strategy;
    };
    part6: {
      timecodes: Timecode[];
      intro: string;
      rows: WordRow[];
      transcript: string;
      transcriptAt: number;
      strategy: Strategy;
    };
  };

  reading: {
    part12: Matching & {
      texts: { letter: Letter; text: string }[];
      strategy: Strategy;
    };
    part13: {
      intro: string;
      title: string;
      paragraphs: string[];
      statements: ChoiceQuestion[];
      strategy: Strategy;
    };
  };

  grammar: {
    part20: { intro: string; lines: GapLine[]; strategy: Strategy };
    part29: { intro: string; lines: GapLine[]; strategy: Strategy };
  };

  writing: {
    n: 35;
    intro: string;
    email: { from: string; to: string; subject: string; body: string[] };
    task: string[];
    criteria: Criterion[];
    rules: string[];
    plan: string[];
    /** Шаблон письма: готовые фразы для каждой части */
    template: { part: string; phrases: string }[];
    sample: string;
    strategy: Strategy;
  };

  speaking: {
    audioUrl: string;
    task1: {
      instruction: string;
      text: string;
      prepSec: number;
      answerSec: number;
      hardWords: { word: string; tip: string }[];
      criteria: string;
      strategy: Strategy;
    };
    task2: {
      instruction: string;
      answerSec: number;
      /** Расшифровка вступления и завершения опроса */
      introText: string;
      outroText: string;
      /** Отрезки записи с вопросами; первый включает вступление автоответчика */
      questions: { text: string; start: number; end: number; sample: string }[];
      outro: { start: number; end: number };
      criteria: string;
      strategy: Strategy;
    };
    task3: {
      instruction: string;
      points: string[];
      prepSec: number;
      answerSec: number;
      criteria: Criterion[];
      sample: string;
      strategy: Strategy;
    };
  };
};
