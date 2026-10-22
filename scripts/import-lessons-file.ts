/**
 * Загружает уроки из JSON-файла с контентом в базу (урок, слова, домашнее задание):
 *
 *   npx tsx --env-file=.env scripts/import-lessons-file.ts content/lessons/lessons-8-9.json
 *
 * Урок ищется по номеру. Если он уже есть, блоки и слова обновляются, а домашнее
 * задание пересобирается: личные задания учеников и их ответы не трогаются (удаляются
 * только общие задания, forUserId = null). Слова, которых нет в файле, удаляются.
 * Соединение одно — удалённый пулер базы плохо переносит прогрев нескольких.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Level, type TaskKind } from "@prisma/client";
import { Pool } from "pg";
import { pgConnectionString } from "../lib/db-url";

type RawWord = {
  english: string;
  russian: string;
  partOfSpeech?: string;
  transcription?: string;
  example?: string;
  definition?: string;
  definitionRu?: string;
  audioUrl?: string;
  imageUrl?: string;
  order?: number;
};

type RawTask = {
  section?: string;
  kind?: string;
  prompt?: string;
  text?: string;
  audioUrl?: string;
  transcript?: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  rule?: string;
  hidden?: boolean;
  order?: number;
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
  timeline?: unknown;
  blocks?: unknown;
  words?: RawWord[];
  homework?: { title?: string; intro?: string; tasks?: RawTask[] };
};

const KINDS: TaskKind[] = ["CHOICE", "FILL", "READING", "LISTENING", "TEACHER"];
const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Укажите файл: scripts/import-lessons-file.ts content/lessons/lessons-8-9.json");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан");

  const { lessons } = JSON.parse(await readFile(file, "utf8")) as { lessons: RawLesson[] };

  const pool = new Pool({ connectionString: pgConnectionString(url), max: 1, connectionTimeoutMillis: 30_000 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });

    for (const raw of lessons) {
      const data = {
        topic: raw.topic,
        description: raw.description ?? "",
        goal: raw.goal ?? "",
        durationMin: raw.durationMin ?? 60,
        level: (LEVELS.includes(raw.level as Level) ? raw.level : "B1") as Level,
        bookTitle: raw.bookTitle ?? "",
        bookRef: raw.bookRef ?? "",
        timeline: (raw.timeline ?? []) as object,
        blocks: (raw.blocks ?? []) as object,
      };
      const lesson = await prisma.lesson.upsert({
        where: { number: raw.number },
        create: { number: raw.number, authorId: admin?.id ?? null, ...data },
        update: data,
        select: { id: true },
      });

      for (const [index, word] of (raw.words ?? []).entries()) {
        const fields = {
          russian: word.russian,
          partOfSpeech: word.partOfSpeech ?? "",
          transcription: word.transcription ?? "",
          example: word.example ?? "",
          definition: word.definition ?? "",
          definitionRu: word.definitionRu ?? "",
          audioUrl: word.audioUrl ?? "",
          imageUrl: word.imageUrl ?? "",
          order: word.order ?? index,
        };
        await prisma.lessonWord.upsert({
          where: { lessonId_english: { lessonId: lesson.id, english: word.english } },
          create: { lessonId: lesson.id, english: word.english, ...fields },
          update: fields,
        });
      }

      // Слов, которых больше нет в файле, в уроке быть не должно (у учеников копии остаются)
      await prisma.lessonWord.deleteMany({
        where: { lessonId: lesson.id, english: { notIn: (raw.words ?? []).map((word) => word.english) } },
      });

      const homeworkRaw = raw.homework;
      if (homeworkRaw?.tasks?.length) {
        const homeworkData = {
          title: homeworkRaw.title ?? `Домашнее задание к уроку ${raw.number}`,
          intro: homeworkRaw.intro ?? "",
        };
        const homework = await prisma.homework.upsert({
          where: { lessonId: lesson.id },
          create: { lessonId: lesson.id, ...homeworkData },
          update: homeworkData,
          select: { id: true },
        });
        await prisma.homeworkTask.deleteMany({ where: { homeworkId: homework.id, forUserId: null } });
        await prisma.homeworkTask.createMany({
          data: homeworkRaw.tasks.map((task, index) => ({
            homeworkId: homework.id,
            order: task.order ?? index,
            section: task.section ?? "",
            kind: (KINDS.includes(task.kind as TaskKind) ? task.kind : "FILL") as TaskKind,
            prompt: task.prompt ?? "",
            text: task.text ?? "",
            audioUrl: task.audioUrl ?? "",
            transcript: task.transcript ?? "",
            options: task.options ?? [],
            answer: task.answer ?? "",
            explanation: task.explanation ?? "",
            rule: task.rule ?? "",
            hidden: task.hidden ?? false,
          })),
        });
      }
      console.log(
        `✓ урок ${raw.number}: ${raw.topic} — слов ${raw.words?.length ?? 0}, заданий ДЗ ${homeworkRaw?.tasks?.length ?? 0}`,
      );
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("❌ Импорт не удался:", error);
  process.exit(1);
});
