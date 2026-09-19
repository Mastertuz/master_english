import { scoreWritten, type OgeAnswers } from "./scoring";
import { teacherNotes, type TeacherNotes } from "./teacher";
import type { OgeVariant, Strategy } from "./types";
import { examView } from "./view";

/**
 * Тренировка по группам заданий: одна группа — один блок экзамена
 * (задания 20–28, 29–34…) из каждого варианта на сайте. Ответы проверяются
 * сразу, после проверки ученик видит верные ответы и разбор.
 */

export type TrainingGroupId = "1-4" | "5" | "6-11" | "12" | "13-19" | "20-28" | "29-34";

export type TrainingGroup = {
  id: TrainingGroupId;
  /** Номера заданий, как в КИМ: «20–28» */
  tasks: string;
  section: "Аудирование" | "Чтение" | "Грамматика и лексика";
  title: string;
  /** Что нужно сделать — одной фразой для карточки группы */
  description: string;
  points: string;
  from: number;
  to: number;
};

export const TRAINING_GROUPS: TrainingGroup[] = [
  {
    id: "1-4",
    tasks: "1–4",
    section: "Аудирование",
    title: "Короткие диалоги",
    description: "Четыре диалога — к каждому выбрать ответ 1, 2 или 3",
    points: "по 1 баллу",
    from: 1,
    to: 4,
  },
  {
    id: "5",
    tasks: "5",
    section: "Аудирование",
    title: "Высказывания и рубрики",
    description: "Пять высказываний — подобрать к каждому рубрику, одна лишняя",
    points: "до 5 баллов",
    from: 5,
    to: 5,
  },
  {
    id: "6-11",
    tasks: "6–11",
    section: "Аудирование",
    title: "Интервью и таблица",
    description: "Заполнить таблицу одним словом из прозвучавшего интервью",
    points: "по 1 баллу",
    from: 6,
    to: 11,
  },
  {
    id: "12",
    tasks: "12",
    section: "Чтение",
    title: "Тексты и вопросы",
    description: "Найти, в каком из текстов A–F ответ на каждый вопрос",
    points: "до 6 баллов",
    from: 12,
    to: 12,
  },
  {
    id: "13-19",
    tasks: "13–19",
    section: "Чтение",
    title: "True / False / Not stated",
    description: "Определить, верно ли утверждение, неверно или об этом не сказано",
    points: "по 1 баллу",
    from: 13,
    to: 19,
  },
  {
    id: "20-28",
    tasks: "20–28",
    section: "Грамматика и лексика",
    title: "Грамматика",
    description: "Поставить слово в нужную грамматическую форму",
    points: "по 1 баллу",
    from: 20,
    to: 28,
  },
  {
    id: "29-34",
    tasks: "29–34",
    section: "Грамматика и лексика",
    title: "Словообразование",
    description: "Образовать однокоренное слово нужной части речи",
    points: "по 1 баллу",
    from: 29,
    to: 34,
  },
];

export function getTrainingGroup(id: string): TrainingGroup | null {
  return TRAINING_GROUPS.find((group) => group.id === id) ?? null;
}

/** Номер задания из ключа ответа: «5B» → 5, «12F» → 12, «20» → 20 */
function taskNumber(key: string): number {
  return Number.parseInt(key, 10);
}

function inGroup(group: TrainingGroup, key: string): boolean {
  const n = taskNumber(key);
  return n >= group.from && n <= group.to;
}

/** Блок варианта для тренировки — без ключей, как на экзамене */
export function trainingView(variant: OgeVariant, group: TrainingGroup) {
  const exam = examView(variant);
  const { listening, reading, grammar } = exam;
  const audio = (timecodes: { label: string; at: number }[]) => ({
    src: listening.audioUrl,
    timecodes,
  });

  switch (group.id) {
    case "1-4":
      return {
        kind: "choice" as const,
        audio: audio(listening.part1.timecodes),
        intro: listening.part1.intro,
        questions: listening.part1.questions,
      };
    case "5":
      return {
        kind: "matching" as const,
        audio: audio(listening.part5.timecodes),
        intro: listening.part5.intro,
        texts: [],
        n: listening.part5.n,
        letters: listening.part5.letters,
        options: listening.part5.options,
        rowLabel: "Говорящий",
        cellLabel: "Рубрика",
      };
    case "6-11":
      return {
        kind: "words" as const,
        audio: audio(listening.part6.timecodes),
        intro: listening.part6.intro,
        rows: listening.part6.rows,
      };
    case "12":
      return {
        kind: "matching" as const,
        audio: null,
        intro: reading.part12.intro,
        texts: reading.part12.texts,
        n: reading.part12.n,
        letters: reading.part12.letters,
        options: reading.part12.options,
        rowLabel: "Текст",
        cellLabel: "Вопрос",
      };
    case "13-19":
      return {
        kind: "reading" as const,
        intro: reading.part13.intro,
        title: reading.part13.title,
        paragraphs: reading.part13.paragraphs,
        statements: reading.part13.statements,
      };
    case "20-28":
      return { kind: "gaps" as const, intro: grammar.part20.intro, lines: grammar.part20.lines };
    case "29-34":
      return { kind: "gaps" as const, intro: grammar.part29.intro, lines: grammar.part29.lines };
  }
}

export type TrainingView = ReturnType<typeof trainingView>;

/** Как выполнять задания группы — из разбора варианта */
export function trainingStrategy(variant: OgeVariant, group: TrainingGroup): Strategy {
  const { listening, reading, grammar } = variant;
  const byGroup: Record<TrainingGroupId, Strategy> = {
    "1-4": listening.part1.strategy,
    "5": listening.part5.strategy,
    "6-11": listening.part6.strategy,
    "12": reading.part12.strategy,
    "13-19": reading.part13.strategy,
    "20-28": grammar.part20.strategy,
    "29-34": grammar.part29.strategy,
  };
  return byGroup[group.id];
}

export type TrainingCheck = {
  checks: Record<string, { expected: string; points: number; max: number }>;
  /** Верные ответы с разбором, лишний вариант и текст записи */
  notes: TeacherNotes;
  points: number;
  max: number;
};

/** Проверка ответов группы и разбор, который открывается после проверки */
export function checkTraining(
  variant: OgeVariant,
  group: TrainingGroup,
  answers: OgeAnswers,
): TrainingCheck {
  const written = scoreWritten(variant, answers);
  const items = [
    ...written.listening.items,
    ...written.reading.items,
    ...written.grammar.items,
  ].filter((item) => inGroup(group, item.key));

  const all = teacherNotes(variant);
  const pick = <T,>(record: Record<string, T>) =>
    Object.fromEntries(Object.entries(record).filter(([key]) => inGroup(group, key)));

  return {
    checks: Object.fromEntries(
      items.map((item) => [
        item.key,
        { expected: item.expected, points: item.points, max: item.max },
      ]),
    ),
    // Образцы письма и устных ответов к группе не относятся — не отдаём
    notes: {
      writing: { sample: "", plan: [] },
      speaking: { hardWords: [], task2: { intro: "", outro: "", samples: [] }, task3Sample: "" },
      answers: pick(all.answers),
      extras: pick(all.extras),
      transcripts: {
        part1: group.id === "1-4" ? all.transcripts.part1 : [],
        part5: group.id === "5" ? all.transcripts.part5 : [],
        part6: group.id === "6-11" ? all.transcripts.part6 : [],
      },
    },
    points: items.reduce((sum, item) => sum + item.points, 0),
    max: items.reduce((sum, item) => sum + item.max, 0),
  };
}
