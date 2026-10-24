/**
 * Загружает личный тест из JSON и выдаёт его одному пользователю:
 *
 *   npx tsx --env-file=.env scripts/import-test-file.ts content/tests/placement-b2-c1.json mastertuz
 *
 * Тест, выданный лично, другим как «свободный» не показывается (см. lib/test-access.ts).
 * Повторный запуск обновляет вопросы того же теста, попытки не трогает.
 */
import { readFile } from "node:fs/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Level } from "@prisma/client";
import { Pool } from "pg";
import { pgConnectionString } from "../lib/db-url";

type RawTest = {
  title: string;
  description?: string;
  level?: string;
  questions: { text: string; options: string[]; correct: number; explanation?: string }[];
};

async function main() {
  const [file, login] = process.argv.slice(2);
  if (!file || !login) throw new Error("Укажите файл и логин: import-test-file.ts <файл.json> <логин>");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан");

  const raw = JSON.parse(await readFile(file, "utf8")) as RawTest;
  const pool = new Pool({ connectionString: pgConnectionString(url), max: 1, connectionTimeoutMillis: 30_000 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const user = await prisma.user.findUnique({ where: { login }, select: { id: true, firstName: true, lastName: true } });
    if (!user) throw new Error(`Пользователь «${login}» не найден`);

    const questions = raw.questions.map((question, index) => ({
      text: question.text,
      options: question.options,
      correct: question.correct,
      explanation: question.explanation ?? "",
      order: index,
    }));
    const data = {
      description: raw.description ?? "",
      level: (raw.level ?? null) as Level | null,
    };

    const existing = await prisma.test.findFirst({
      where: { title: raw.title, authorId: user.id, lessonId: null },
      select: { id: true },
    });

    let testId: string;
    if (existing) {
      await prisma.question.deleteMany({ where: { testId: existing.id } });
      await prisma.test.update({ where: { id: existing.id }, data: { ...data, questions: { create: questions } } });
      testId = existing.id;
    } else {
      const created = await prisma.test.create({
        data: { title: raw.title, ...data, authorId: user.id, questions: { create: questions } },
        select: { id: true },
      });
      testId = created.id;
    }

    await prisma.testAssignment.upsert({
      where: { testId_userId: { testId, userId: user.id } },
      create: { testId, userId: user.id },
      update: {},
    });
    console.log(`✓ «${raw.title}» — вопросов ${questions.length}, выдан: ${user.firstName} ${user.lastName}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("❌", error);
  process.exit(1);
});
