"use server";

import { revalidatePath } from "next/cache";
import { shuffle } from "@/lib/answer";
import { isLevel } from "@/lib/lesson-content";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { FieldErrors } from "@/lib/validation";

export type TestState = {
  ok: boolean;
  message?: string;
  errors?: FieldErrors;
  testId?: string;
} | null;

type QuestionInput = {
  text: string;
  options: string[];
  correct: number;
};

/** Создаёт тест вручную. Вопросы приходят JSON-строкой из формы. */
export async function createTestAction(
  _prev: TestState,
  formData: FormData,
): Promise<TestState> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    return { ok: false, message: "Тесты создаёт администратор" };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const lessonId = String(formData.get("lessonId") ?? "").trim();
  const raw = String(formData.get("questions") ?? "[]");

  if (!title) {
    return {
      ok: false,
      message: "Укажите название теста",
      errors: { title: "Обязательное поле" },
    };
  }

  let questions: QuestionInput[];
  try {
    questions = JSON.parse(raw) as QuestionInput[];
  } catch {
    return { ok: false, message: "Не удалось прочитать вопросы" };
  }

  const valid = questions.filter(
    (question) =>
      question.text.trim() &&
      question.options.filter((option) => option.trim()).length >= 2 &&
      question.correct >= 0,
  );

  if (valid.length === 0) {
    return { ok: false, message: "Добавьте хотя бы один заполненный вопрос" };
  }

  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });
    if (!lesson) return { ok: false, message: "Урок не найден" };
  }

  const test = await prisma.test.create({
    data: {
      title,
      description,
      authorId: user.id,
      lessonId: lessonId || null,
      questions: {
        create: valid.map((question, index) => ({
          text: question.text.trim(),
          options: question.options
            .map((option) => option.trim())
            .filter(Boolean),
          correct: question.correct,
          order: index,
        })),
      },
    },
    select: { id: true },
  });

  revalidatePath("/tests");
  return { ok: true, message: "Тест создан", testId: test.id };
}

/** Собирает тест автоматически из слов урока (перевод EN → RU) */
export async function generateTestAction(
  _prev: TestState,
  formData: FormData,
): Promise<TestState> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    return { ok: false, message: "Тесты создаёт администратор" };
  }
  const lessonId = String(formData.get("lessonId") ?? "").trim();

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: {
      id: true,
      number: true,
      topic: true,
      words: { select: { english: true, russian: true } },
    },
  });

  if (!lesson) return { ok: false, message: "Урок не найден" };
  if (lesson.words.length < 4) {
    return {
      ok: false,
      message: "Нужно минимум 4 слова в уроке, чтобы собрать тест",
    };
  }

  const pool = lesson.words.map((word) => word.russian).filter(Boolean);

  const questions = shuffle(lesson.words)
    .slice(0, 15)
    .map((word, index) => {
      const distractors = shuffle(
        pool.filter((value) => value !== word.russian),
      ).slice(0, 3);
      const options = shuffle([word.russian, ...distractors]);

      return {
        text: `Как переводится «${word.english}»?`,
        options,
        correct: options.indexOf(word.russian),
        order: index,
      };
    });

  const test = await prisma.test.create({
    data: {
      title: `Тест к уроку №${lesson.number} — ${lesson.topic}`,
      description: "Автоматически собран из слов урока",
      authorId: user.id,
      lessonId: lesson.id,
      questions: { create: questions },
    },
    select: { id: true },
  });

  revalidatePath("/tests");
  revalidatePath(`/lessons/${lesson.id}`);
  return { ok: true, message: "Тест собран", testId: test.id };
}

/** Сохраняет результат прохождения теста */
export async function submitTestAction(input: {
  testId: string;
  answers: number[];
}): Promise<{ score: number; total: number; correct: number[] }> {
  const user = await requireUser();

  const test = await prisma.test.findUnique({
    where: { id: input.testId },
    select: {
      id: true,
      questions: { orderBy: { order: "asc" }, select: { correct: true } },
    },
  });

  if (!test) return { score: 0, total: 0, correct: [] };

  const correct = test.questions.map((question) => question.correct);
  const score = correct.reduce(
    (sum, expected, index) => sum + (input.answers[index] === expected ? 1 : 0),
    0,
  );

  await prisma.testAttempt.create({
    data: {
      testId: test.id,
      userId: user.id,
      score,
      total: correct.length,
    },
  });

  revalidatePath("/tests");
  return { score, total: correct.length, correct };
}

/** Меняет существующий тест: поля и вопросы приходят так же, как при создании */
export async function updateTestAction(
  _prev: TestState,
  formData: FormData,
): Promise<TestState> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    return { ok: false, message: "Тесты меняет администратор" };
  }

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const lessonId = String(formData.get("lessonId") ?? "").trim();
  const level = String(formData.get("level") ?? "").trim();

  if (!title) {
    return {
      ok: false,
      message: "Укажите название теста",
      errors: { title: "Обязательное поле" },
    };
  }

  const existing = await prisma.test.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { ok: false, message: "Тест не найден" };

  let questions: QuestionInput[];
  try {
    questions = JSON.parse(
      String(formData.get("questions") ?? "[]"),
    ) as QuestionInput[];
  } catch {
    return { ok: false, message: "Не удалось прочитать вопросы" };
  }

  const valid = questions.filter(
    (question) =>
      question.text.trim() &&
      question.options.filter((option) => option.trim()).length >= 2 &&
      question.correct >= 0,
  );

  if (valid.length === 0) {
    return { ok: false, message: "Добавьте хотя бы один заполненный вопрос" };
  }

  // Вопросы пересобираем целиком: у них нет собственных ответов учеников,
  // результаты попыток хранятся отдельно в TestAttempt и не пострадают
  await prisma.question.deleteMany({ where: { testId: id } });

  await prisma.test.update({
    where: { id },
    data: {
      title,
      description,
      lessonId: lessonId || null,
      level: isLevel(level) ? level : null,
      questions: {
        create: valid.map((question, index) => ({
          text: question.text.trim(),
          options: question.options
            .map((option) => option.trim())
            .filter(Boolean),
          correct: question.correct,
          order: index,
        })),
      },
    },
  });

  revalidatePath("/tests");
  revalidatePath(`/tests/${id}`);
  return { ok: true, message: "Тест сохранён", testId: id };
}

export async function deleteTestAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  if (user.role !== "ADMIN") return;

  const test = await prisma.test.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!test) return;

  await prisma.test.delete({ where: { id } });
  revalidatePath("/tests");
}

/* ───────────────── Назначение тестов ученикам ───────────────── */

/** Выдаёт тест конкретному ученику, независимо от уроков и уровня */
export async function assignTestAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  if (user.role !== "ADMIN") return;

  const testId = String(formData.get("testId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!testId || !userId) return;

  await prisma.testAssignment.upsert({
    where: { testId_userId: { testId, userId } },
    create: { testId, userId },
    update: {},
  });

  revalidatePath(`/students/${userId}`);
  revalidatePath("/tests");
}

/** Убирает выданный тест. Результаты пройденных попыток остаются */
export async function unassignTestAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  if (user.role !== "ADMIN") return;

  const testId = String(formData.get("testId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!testId || !userId) return;

  await prisma.testAssignment
    .delete({ where: { testId_userId: { testId, userId } } })
    .catch(() => undefined);

  revalidatePath(`/students/${userId}`);
  revalidatePath("/tests");
}
