"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { asBlocks, taskKey } from "@/lib/lesson-content";
import { notifyAboutComment } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type LessonAnswerInput = {
  taskKey: string;
  value: string;
  isCorrect: boolean;
};

/**
 * Сохраняет ответы ученика на задания внутри урока — в том числе на поля
 * поверх скана учебника. Вызывается при проверке, поэтому пишем сразу
 * несколько ответов за раз.
 *
 * Ответ перезаписывается: в уроке задание можно решать сколько угодно раз,
 * и преподавателю нужна последняя попытка.
 */
export async function saveLessonAnswersAction(
  lessonId: string,
  answers: LessonAnswerInput[],
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || answers.length === 0) return;

  // Отвечать можно только по своему уроку
  if (user.role !== "ADMIN") {
    const assigned = await prisma.lessonAssignment.findUnique({
      where: { lessonId_userId: { lessonId, userId: user.id } },
      select: { id: true },
    });
    if (!assigned) return;
  }

  const clean = answers
    .filter((answer) => answer.taskKey)
    .slice(0, 100)
    .map((answer) => ({
      taskKey: answer.taskKey.slice(0, 64),
      value: answer.value.slice(0, 500),
      isCorrect: answer.isCorrect,
    }));

  await prisma.$transaction(
    clean.map((answer) =>
      prisma.lessonTaskAnswer.upsert({
        where: {
          lessonId_userId_taskKey: {
            lessonId,
            userId: user.id,
            taskKey: answer.taskKey,
          },
        },
        create: { lessonId, userId: user.id, ...answer },
        // Новый ответ снова черновик, пока ученик не сохранит его сам
        update: { value: answer.value, isCorrect: answer.isCorrect, saved: false },
      }),
    ),
  );
}

/**
 * Ученик сохраняет ответы урока: сохранённые не сбрасываются при следующем
 * заходе. Как и в домашней работе, сохраняем только перечисленные задания —
 * в базе могут лежать брошенные черновики прошлых заходов.
 */
export async function keepLessonAnswersAction(
  lessonId: string,
  taskKeys: string[],
): Promise<{ ok: boolean; saved: number }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, saved: 0 };

  const keys = taskKeys.filter(Boolean).slice(0, 200);
  if (keys.length === 0) return { ok: true, saved: 0 };

  const { count } = await prisma.lessonTaskAnswer.updateMany({
    where: { lessonId, userId: user.id, taskKey: { in: keys } },
    data: { saved: true },
  });

  revalidatePath(`/lessons/${lessonId}`);
  return { ok: true, saved: count };
}

/**
 * Сброс ответов урока: одного задания (с taskKey) или всех сразу.
 * Комментарии преподавателя уходят вместе с ответом — комментировать
 * удалённую попытку всё равно нечего.
 */
export async function resetLessonAnswersAction(
  lessonId: string,
  taskKey?: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.lessonTaskAnswer.deleteMany({
    where: {
      lessonId,
      userId: user.id,
      ...(taskKey ? { taskKey } : {}),
    },
  });

  revalidatePath(`/lessons/${lessonId}`);
}

export type CommentState = { ok: boolean; message?: string } | null;

/**
 * Комментарий преподавателя к ответу ученика в уроке. Ученик увидит его
 * рядом со своим ответом, когда снова откроет урок.
 */
export async function commentLessonAnswerAction(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") {
    return { ok: false, message: "Комментирует преподаватель" };
  }

  const answerId = String(formData.get("answerId") ?? "");
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1000);

  const answer = await prisma.lessonTaskAnswer.findUnique({
    where: { id: answerId },
    select: {
      userId: true,
      taskKey: true,
      lesson: { select: { id: true, number: true, topic: true, blocks: true } },
    },
  });
  if (!answer) return { ok: false, message: "Ответ не найден" };

  await prisma.lessonTaskAnswer.update({
    where: { id: answerId },
    data: {
      comment,
      // Пустой комментарий — это снятие пометки, а не «прокомментировано»
      commentedAt: comment ? new Date() : null,
      // Правка комментария снова делает его новым для ученика
      commentSeenAt: null,
    },
  });

  if (comment) {
    // after() отправляет письмо уже после ответа: SMTP отвечает секунды,
    // и держать из-за него кнопку преподавателя незачем
    after(() =>
      notifyAboutComment({
        userId: answer.userId,
        where: `Урок №${answer.lesson.number} · ${answer.lesson.topic}`,
        task: findPrompt(answer.lesson.blocks, answer.taskKey),
        comment,
        href: `/lessons/${answer.lesson.id}`,
      }),
    );
  }

  revalidatePath(`/students/${answer.userId}`);
  return { ok: true, message: comment ? "Комментарий сохранён" : "Комментарий убран" };
}

/** Ученик открыл урок — комментарии к его заданиям больше не новые */
export async function markLessonCommentsSeenAction(
  lessonId: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.lessonTaskAnswer.updateMany({
    where: { lessonId, userId: user.id, commentSeenAt: null, NOT: { comment: "" } },
    data: { commentSeenAt: new Date() },
  });
}

/** То же для домашней работы */
export async function markHomeworkCommentsSeenAction(
  homeworkId: string,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.homeworkAnswer.updateMany({
    where: {
      userId: user.id,
      commentSeenAt: null,
      NOT: { comment: null },
      task: { homeworkId },
    },
    data: { commentSeenAt: new Date() },
  });
}

/** Формулировка задания по ключу ответа — для письма и списка уведомлений */
function findPrompt(blocks: unknown, key: string): string {
  for (const [blockIndex, block] of asBlocks(blocks).entries()) {
    for (const [taskIndex, task] of block.tasks.entries()) {
      if (taskKey(blockIndex, taskIndex, task) === key) return task.prompt;
    }
  }
  return "Задание урока";
}
