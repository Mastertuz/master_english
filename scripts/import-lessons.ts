/**
 * Загружает уроки из content/lessons/lessons.json в базу.
 *
 *   npm run lessons:import
 *
 * Файл собирается конвертером из исходных HTML-уроков:
 *   python3 scripts/convert-lessons.py
 *
 * Импорт идемпотентный: урок ищется по номеру, содержимое и домашнее
 * задание перезаписываются, ответы учеников не трогаются.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Level, PrismaClient, TaskKind } from "@prisma/client";

type RawTask = {
  section?: string;
  kind?: string;
  prompt?: string;
  options?: string[];
  optionValues?: string[];
  answer?: string;
  explanation?: string;
  rule?: string;
  audioUrl?: string;
  transcript?: string;
  text?: string;
};

type RawLesson = {
  number: number;
  topic: string;
  description?: string;
  goal?: string;
  durationMin?: number;
  level?: string;
  bookTitle?: string;
  bookRef?: string;
  heroImage?: string;
  timeline?: unknown;
  blocks?: unknown;
  words?: { english: string; russian: string }[];
  homework?: { title?: string; intro?: string; tasks?: RawTask[] };
};

type RawTest = {
  title: string;
  description?: string;
  level?: string;
  questions: {
    text: string;
    options: string[];
    correct: number;
    explanation?: string;
  }[];
};

const TASK_KINDS: TaskKind[] = [
  "CHOICE",
  "FILL",
  "READING",
  "LISTENING",
  "TEACHER",
];

function asTaskKind(value: string | undefined): TaskKind {
  return TASK_KINDS.includes(value as TaskKind) ? (value as TaskKind) : "FILL";
}

function asLevel(value: string | undefined): Level {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return levels.includes(value ?? "") ? (value as Level) : "A2";
}

/** Часть речи по эвристике — уточняется при поиске слова в Cambridge */
function guessPartOfSpeech(english: string): string {
  if (english.includes(" ")) return "phrase";
  if (/^(to )/.test(english)) return "verb";
  return "";
}

/**
 * Какие уроки переносить: `--lesson=0 --lesson=2` берёт только их.
 * Полный импорт заново проставляет словам уроков часть речи по грубой
 * догадке, поэтому точечный перенос безопаснее для уже выверенных данных.
 */
function onlyLessons(): Set<number> | null {
  const numbers = process.argv
    .filter((arg) => arg.startsWith("--lesson="))
    .map((arg) => Number(arg.slice("--lesson=".length)))
    .filter((value) => Number.isInteger(value));

  return numbers.length > 0 ? new Set(numbers) : null;
}

export async function importLessons(prisma: PrismaClient, authorId?: string) {
  const file = path.join(process.cwd(), "content", "lessons", "lessons.json");
  const payload = JSON.parse(await readFile(file, "utf8")) as {
    lessons: RawLesson[];
    tests: RawTest[];
  };

  let createdLessons = 0;
  let createdWords = 0;
  let createdTasks = 0;

  const wanted = onlyLessons();

  for (const raw of payload.lessons) {
    if (wanted && !wanted.has(raw.number)) continue;

    const data = {
      topic: raw.topic,
      description: raw.description ?? "",
      goal: raw.goal ?? "",
      durationMin: raw.durationMin ?? 60,
      level: asLevel(raw.level),
      bookTitle: raw.bookTitle ?? "",
      bookRef: raw.bookRef ?? "",
      heroImage: raw.heroImage ?? "",
      timeline: (raw.timeline ?? []) as object,
      blocks: (raw.blocks ?? []) as object,
      authorId: authorId ?? null,
    };

    const lesson = await prisma.lesson.upsert({
      where: { number: raw.number },
      create: { number: raw.number, ...data },
      update: data,
      select: { id: true },
    });
    createdLessons += 1;

    // Словарь урока
    let order = 0;
    for (const word of raw.words ?? []) {
      const fields = {
        russian: word.russian,
        partOfSpeech: guessPartOfSpeech(word.english),
        order: order++,
      };
      await prisma.lessonWord.upsert({
        where: {
          lessonId_english: { lessonId: lesson.id, english: word.english },
        },
        create: { lessonId: lesson.id, english: word.english, ...fields },
        update: fields,
      });
      createdWords += 1;
    }

    // Домашнее задание пересобираем целиком
    const homeworkRaw = raw.homework;
    if (homeworkRaw?.tasks?.length) {
      const homework = await prisma.homework.upsert({
        where: { lessonId: lesson.id },
        create: {
          lessonId: lesson.id,
          title: homeworkRaw.title ?? `Домашнее задание к уроку ${raw.number}`,
          intro: homeworkRaw.intro ?? "",
        },
        update: {
          title: homeworkRaw.title ?? `Домашнее задание к уроку ${raw.number}`,
          intro: homeworkRaw.intro ?? "",
        },
        select: { id: true },
      });

      await prisma.homeworkTask.deleteMany({ where: { homeworkId: homework.id } });

      await prisma.homeworkTask.createMany({
        data: homeworkRaw.tasks.map((task, index) => ({
          homeworkId: homework.id,
          order: index,
          section: task.section ?? "",
          kind: asTaskKind(task.kind),
          prompt: task.prompt ?? "",
          text: task.text ?? "",
          audioUrl: task.audioUrl ?? "",
          transcript: task.transcript ?? "",
          // ученику показываем подписи, сверяем по значениям
          options: task.options?.length ? task.options : [],
          answer: task.answer ?? "",
          explanation: task.explanation ?? "",
          rule: task.rule ?? "",
        })),
      });
      createdTasks += homeworkRaw.tasks.length;
    }
  }

  await importTests(prisma, authorId);

  return { createdLessons, createdWords, createdTasks };
}

/**
 * Отдельные тесты, не привязанные к уроку (например, универсальный A2).
 * Вынесено отдельно, чтобы восстанавливать удалённый тест, не перезаписывая
 * уроки: полный импорт заново проставляет словам уроков часть речи по грубой
 * догадке и стёр бы выверенные значения из content/word-details.json.
 *
 *   npm run tests:restore
 */
export async function importTests(prisma: PrismaClient, authorId?: string) {
  const file = path.join(process.cwd(), "content", "lessons", "lessons.json");
  const payload = JSON.parse(await readFile(file, "utf8")) as {
    tests?: RawTest[];
  };

  let restored = 0;

  for (const test of payload.tests ?? []) {
    const questions = {
      create: test.questions.map((question, index) => ({
        text: question.text,
        options: question.options,
        correct: question.correct,
        explanation: question.explanation ?? "",
        order: index,
      })),
    };

    const existing = await prisma.test.findFirst({
      where: { title: test.title, lessonId: null },
      select: { id: true },
    });

    if (existing) {
      // Вопросы пересобираем целиком, попытки учеников не трогаем
      await prisma.question.deleteMany({ where: { testId: existing.id } });
      await prisma.test.update({
        where: { id: existing.id },
        data: {
          description: test.description ?? "",
          level: asLevel(test.level),
          questions,
        },
      });
    } else {
      await prisma.test.create({
        data: {
          title: test.title,
          description: test.description ?? "",
          level: asLevel(test.level),
          authorId: authorId ?? null,
          questions,
        },
      });
    }

    restored += 1;
    console.log(`  ✓ ${test.title} — вопросов: ${test.questions.length}`);
  }

  return restored;
}

async function main() {
  const { closeDb, prisma } = await import("../lib/prisma");

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  if (process.argv.includes("--tests-only")) {
    const restored = await importTests(prisma, admin?.id);
    console.log(`\n✅ Восстановлено тестов: ${restored}\n`);
    await closeDb();
    return;
  }

  const stats = await importLessons(prisma, admin?.id);

  console.log("");
  console.log(`✅ Импортировано уроков: ${stats.createdLessons}`);
  console.log(`   слов в словарях уроков: ${stats.createdWords}`);
  console.log(`   заданий в домашних работах: ${stats.createdTasks}`);
  console.log("");

  await closeDb();
}

if (process.argv[1] && process.argv[1].includes("import-lessons")) {
  main().catch((error) => {
    console.error("❌ Импорт не удался:");
    console.error(error);
    process.exit(1);
  });
}
