/**
 * Готовые заготовки для конструктора урока.
 *
 * Каждый шаблон — обычный блок или задание с заполненным примером: педагог
 * добавляет его и правит текст под себя, а не собирает структуру с нуля.
 */
import type { LessonBlock, LessonBlockKind, LessonTask } from "./lesson-content";

/** Пустой блок: все поля на месте, чтобы не проверять undefined в редакторе */
export function emptyBlock(kind: LessonBlockKind): LessonBlock {
  return {
    kind,
    title: "",
    paragraphs: [],
    rules: [],
    formulas: [],
    examples: [],
    prompts: [],
    vocab: [],
    audioUrl: "",
    audioTitle: "",
    videoUrl: "",
    videoTitle: "",
    subtitlesUrl: "",
    sample: "",
    transcript: "",
    imageUrl: "",
    hidden: false,
    text: "",
    tasks: [],
  };
}

/** Короткий id задания: уникальности внутри урока достаточно */
export function taskId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyTask(kind: LessonTask["kind"] = "choice"): LessonTask {
  return {
    id: taskId(),
    kind,
    prompt: "",
    options: kind === "choice" ? ["", "", "", ""] : [],
    optionValues: [],
    answer: "",
    explanation: "",
    x: -1,
    y: -1,
    w: 0,
  };
}

export type BlockTemplate = {
  id: string;
  label: string;
  hint: string;
  build: () => LessonBlock;
};

export const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    id: "page",
    label: "Страница учебника",
    hint: "Скан страницы и задания, привязанные к местам на ней",
    build: () => ({
      ...emptyBlock("page"),
      title: "Работа по учебнику",
      text: "Open World Key (A2), Unit 3, стр. 42",
      tasks: [
        {
          id: taskId(),
          kind: "fill",
          prompt: "Упражнение 1: вставьте пропущенное слово в первом предложении",
          options: [],
          optionValues: [],
          answer: "",
          explanation: "",
          x: -1,
          y: -1,
          w: 0,
        },
        {
          id: taskId(),
          kind: "choice",
          prompt: "Упражнение 2: выберите правильный вариант",
          options: ["", "", ""],
          optionValues: [],
          answer: "",
          explanation: "",
          x: -1,
          y: -1,
          w: 0,
        },
      ],
    }),
  },
  {
    id: "warmup",
    label: "Разогрев",
    hint: "Вопросы в начале занятия, чтобы разговорить ученика",
    build: () => ({
      ...emptyBlock("speaking"),
      title: "Warm-up",
      prompts: [
        "How was your week?",
        "What did you do yesterday evening?",
        "What are your plans for the weekend?",
      ],
    }),
  },
  {
    id: "rule",
    label: "Правило",
    hint: "Формула, объяснение и примеры",
    build: () => ({
      ...emptyBlock("rule"),
      title: "Present Simple",
      rules: [
        "Регулярные действия и факты: то, что происходит обычно.",
        "В третьем лице единственного числа к глаголу добавляется -s.",
      ],
      formulas: ["I / you / we / they + V", "he / she / it + V-s"],
      examples: [
        "I usually leave home at eight.",
        "She works at the airport.",
      ],
    }),
  },
  {
    id: "material",
    label: "Материал",
    hint: "Объяснение или текст от преподавателя",
    build: () => ({
      ...emptyBlock("text"),
      title: "Как это работает",
      paragraphs: [
        "Короткое объяснение темы простыми словами.",
        "Второй абзац: типичная ошибка и как её избежать.",
      ],
    }),
  },
  {
    id: "choice",
    label: "Задания: выбор варианта",
    hint: "Автопроверка, ученик выбирает правильную форму",
    build: () => ({
      ...emptyBlock("tasks"),
      title: "Выберите правильную форму",
      tasks: [
        {
          id: taskId(),
          kind: "choice",
          prompt: "She ___ to work by bus every day.",
          options: ["go", "goes", "is going", "went"],
          optionValues: [],
          answer: "goes",
          explanation: "Регулярное действие, третье лицо → goes.",
          x: -1,
          y: -1,
          w: 0,
        },
        {
          id: taskId(),
          kind: "choice",
          prompt: "They ___ at the hotel right now.",
          options: ["stay", "stays", "are staying", "stayed"],
          optionValues: [],
          answer: "are staying",
          explanation: "Действие происходит сейчас → Present Continuous.",
          x: -1,
          y: -1,
          w: 0,
        },
      ],
    }),
  },
  {
    id: "fill",
    label: "Задания: вписать слово",
    hint: "Автопроверка, ученик печатает ответ",
    build: () => ({
      ...emptyBlock("tasks"),
      title: "Вставьте пропущенное слово",
      tasks: [
        {
          id: taskId(),
          kind: "fill",
          prompt: "I would like to make a ___ for Friday evening.",
          options: [],
          optionValues: [],
          answer: "reservation",
          explanation: "Бронь столика или номера — reservation.",
          x: -1,
          y: -1,
          w: 0,
        },
      ],
    }),
  },
  {
    id: "vocab",
    label: "Лексика",
    hint: "Слова урока с переводом",
    build: () => ({
      ...emptyBlock("vocab"),
      title: "Слова урока",
      vocab: [
        { en: "boarding pass", ru: "посадочный талон" },
        { en: "gate", ru: "выход на посадку" },
      ],
    }),
  },
  {
    id: "reading",
    label: "Чтение",
    hint: "Текст и вопросы на понимание",
    build: () => ({
      ...emptyBlock("reading"),
      title: "Reading",
      text:
        "Anna arrives at the airport two hours before her flight. " +
        "She checks in, drops her suitcase at the desk and goes through security.",
      tasks: [
        {
          id: taskId(),
          kind: "choice",
          prompt: "When does Anna arrive at the airport?",
          options: [
            "An hour before the flight",
            "Two hours before the flight",
            "After the flight",
          ],
          optionValues: [],
          answer: "Two hours before the flight",
          explanation: "В первом предложении: two hours before her flight.",
          x: -1,
          y: -1,
          w: 0,
        },
      ],
    }),
  },
  {
    id: "listening",
    label: "Аудирование",
    hint: "Аудио, расшифровка и вопросы",
    build: () => ({
      ...emptyBlock("listening"),
      title: "Listening",
      audioTitle: "Диалог на ресепшене",
      audioUrl: "",
      transcript:
        "— Good evening, I have a reservation. — What's your name, please?",
      tasks: [
        {
          id: taskId(),
          kind: "choice",
          prompt: "Where does the dialogue take place?",
          options: ["At the airport", "At the hotel", "In a shop"],
          optionValues: [],
          answer: "At the hotel",
          explanation: "Речь о брони номера и стойке регистрации.",
          x: -1,
          y: -1,
          w: 0,
        },
      ],
    }),
  },
  {
    id: "speaking",
    label: "Говорение",
    hint: "Вопросы для разговорной практики",
    build: () => ({
      ...emptyBlock("speaking"),
      title: "Speaking",
      prompts: [
        "Describe your last trip.",
        "What do you usually take in your carry-on bag?",
      ],
    }),
  },
];

/** Скелет занятия целиком — с него удобно начинать новый урок */
export const LESSON_TEMPLATE_IDS = [
  "warmup",
  "rule",
  "choice",
  "vocab",
  "speaking",
];

export type HomeworkTaskDraft = {
  id?: string;
  section: string;
  kind: "CHOICE" | "FILL" | "READING" | "LISTENING" | "TEACHER";
  prompt: string;
  text: string;
  audioUrl: string;
  transcript: string;
  options: string[];
  answer: string;
  explanation: string;
  rule: string;
  /** Скрыто от ученика: задание видит только преподаватель */
  hidden: boolean;
};

export function emptyHomeworkTask(
  kind: HomeworkTaskDraft["kind"] = "CHOICE",
): HomeworkTaskDraft {
  return {
    section: "",
    kind,
    prompt: "",
    text: "",
    audioUrl: "",
    transcript: "",
    options: kind === "CHOICE" ? ["", "", "", ""] : [],
    answer: "",
    explanation: "",
    rule: "",
    hidden: false,
  };
}

export const HOMEWORK_KIND_LABELS: Record<HomeworkTaskDraft["kind"], string> = {
  CHOICE: "Выбор варианта",
  FILL: "Вписать ответ",
  READING: "Чтение",
  LISTENING: "Аудирование",
  TEACHER: "Ответ преподавателю",
};

export type HomeworkTemplate = {
  id: string;
  label: string;
  hint: string;
  build: () => HomeworkTaskDraft;
};

export const HOMEWORK_TEMPLATES: HomeworkTemplate[] = [
  {
    id: "grammar-choice",
    label: "Грамматика: выбор формы",
    hint: "Проверяется автоматически",
    build: () => ({
      ...emptyHomeworkTask("CHOICE"),
      section: "1. Grammar",
      prompt: "My parents ___ at home now.",
      options: ["is", "are", "am", "be"],
      answer: "are",
      explanation: "Подлежащее во множественном числе → are.",
      rule: "to be в Present Simple",
    }),
  },
  {
    id: "vocab-fill",
    label: "Лексика: вписать слово",
    hint: "Проверяется автоматически",
    build: () => ({
      ...emptyHomeworkTask("FILL"),
      section: "2. Vocabulary",
      prompt: "Show your ___ at the gate before boarding.",
      answer: "boarding pass",
      explanation: "Документ на посадку — boarding pass.",
    }),
  },
  {
    id: "reading",
    label: "Чтение с вопросом",
    hint: "Текст и вопрос с автопроверкой",
    build: () => ({
      ...emptyHomeworkTask("READING"),
      section: "3. Reading",
      text:
        "The shop accepts returns within 14 days. You need the receipt " +
        "and the item must be unused.",
      prompt: "How many days do you have to return an item?",
      options: ["7", "14", "30"],
      answer: "14",
      explanation: "В тексте: within 14 days.",
    }),
  },
  {
    id: "listening",
    label: "Аудирование",
    hint: "Ссылка на аудио и вопрос",
    build: () => ({
      ...emptyHomeworkTask("LISTENING"),
      section: "4. Listening",
      audioUrl: "",
      transcript: "— Is the flight on time? — No, it's delayed by an hour.",
      prompt: "Is the flight on time?",
      options: ["Yes", "No, it's delayed"],
      answer: "No, it's delayed",
      explanation: "В диалоге: it's delayed by an hour.",
    }),
  },
  {
    id: "writing",
    label: "Письменный ответ",
    hint: "Проверяет преподаватель вручную",
    build: () => ({
      ...emptyHomeworkTask("TEACHER"),
      section: "5. Writing",
      prompt:
        "Напишите 5–7 предложений о своём последнем путешествии: " +
        "куда, с кем и что запомнилось.",
    }),
  },
];
