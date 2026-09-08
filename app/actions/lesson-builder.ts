"use server";

import { revalidatePath } from "next/cache";
import { asBlocks, asTimeline, taskKey } from "@/lib/lesson-content";
import type { HomeworkTaskDraft } from "@/lib/lesson-templates";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type BuilderState = {
  ok: boolean;
  message?: string;
} | null;

type Payload = {
  blocks?: unknown;
  timeline?: unknown;
  words?: { english?: string; russian?: string }[];
  homework?: {
    title?: string;
    intro?: string;
    tasks?: HomeworkTaskDraft[];
  } | null;
};

const KINDS = ["CHOICE", "FILL", "READING", "LISTENING", "TEACHER"] as const;

function asKind(value: string): (typeof KINDS)[number] {
  return (KINDS as readonly string[]).includes(value)
    ? (value as (typeof KINDS)[number])
    : "CHOICE";
}

/**
 * Сохраняет содержимое урока из конструктора: блоки, тайминг, словарь урока
 * и домашнее задание. Всё приходит одной JSON-строкой из скрытого поля.
 *
 * Задания домашней работы обновляются по id, а не пересоздаются: к ним
 * привязаны ответы учеников, и полная пересборка стёрла бы проверенные работы.
 */
export async function saveLessonContentAction(
  _prev: BuilderState,
  formData: FormData,
): Promise<BuilderState> {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") {
    return { ok: false, message: "Урок редактирует администратор" };
  }

  const lessonId = String(formData.get("lessonId") ?? "");
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, number: true },
  });
  if (!lesson) return { ok: false, message: "Урок не найден" };

  let payload: Payload;
  try {
    payload = JSON.parse(String(formData.get("payload") ?? "{}")) as Payload;
  } catch {
    return { ok: false, message: "Не удалось прочитать содержимое урока" };
  }

  // asBlocks/asTimeline заодно чистят структуру от лишних полей.
  // Тайминг переписываем только если он пришёл: иначе форма без этого поля
  // молча стёрла бы расписание занятия.
  // Заданиям без id выдаём его при первом же сохранении: по нему потом
  // находятся ответы учеников
  const parsed = asBlocks(payload.blocks);
  const renamed: { from: string; to: string }[] = [];

  const blocks = parsed.map((block, blockIndex) => ({
    ...block,
    tasks: block.tasks.map((task, taskIndex) => {
      if (task.id) return task;

      const id = Math.random().toString(36).slice(2, 10);
      renamed.push({ from: taskKey(blockIndex, taskIndex, task), to: id });
      return { ...task, id };
    }),
  }));

  // Ответы, записанные до появления id, переносим на новый ключ — иначе
  // работа ученика отвязалась бы от задания
  for (const { from, to } of renamed) {
    await prisma.lessonTaskAnswer
      .updateMany({
        where: { lessonId, taskKey: from },
        data: { taskKey: to },
      })
      .catch(() => undefined);
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      blocks,
      ...(payload.timeline === undefined
        ? {}
        : { timeline: asTimeline(payload.timeline) }),
    },
  });

  await saveWords(lessonId, payload.words ?? []);
  await saveHomework(lessonId, lesson.number, payload.homework ?? null);

  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath("/lessons");
  revalidatePath("/homework");
  return { ok: true, message: "Урок сохранён" };
}

/** Словарь урока: добавляем новые, обновляем перевод, лишние убираем */
async function saveWords(
  lessonId: string,
  words: { english?: string; russian?: string }[],
) {
  const clean = words
    .map((word) => ({
      english: (word.english ?? "").trim().toLowerCase(),
      russian: (word.russian ?? "").trim(),
    }))
    .filter((word) => word.english);

  const existing = await prisma.lessonWord.findMany({
    where: { lessonId },
    select: { id: true, english: true },
  });

  const keep = new Set(clean.map((word) => word.english));
  const extra = existing.filter((word) => !keep.has(word.english));

  if (extra.length > 0) {
    // Копии в личных словарях учеников остаются: связь обнуляется (SetNull)
    await prisma.lessonWord.deleteMany({
      where: { id: { in: extra.map((word) => word.id) } },
    });
  }

  let order = 0;
  for (const word of clean) {
    await prisma.lessonWord.upsert({
      where: { lessonId_english: { lessonId, english: word.english } },
      create: { lessonId, english: word.english, russian: word.russian, order },
      update: { russian: word.russian, order },
    });
    order += 1;
  }
}

/** Домашнее задание: задания с id обновляем, остальные создаём заново */
async function saveHomework(
  lessonId: string,
  lessonNumber: number,
  input: Payload["homework"],
) {
  if (!input || !(input.tasks ?? []).length) return;

  const homework = await prisma.homework.upsert({
    where: { lessonId },
    create: {
      lessonId,
      title: input.title?.trim() || `Домашнее задание к уроку ${lessonNumber}`,
      intro: input.intro?.trim() ?? "",
    },
    update: {
      title: input.title?.trim() || `Домашнее задание к уроку ${lessonNumber}`,
      intro: input.intro?.trim() ?? "",
    },
    select: { id: true },
  });

  const tasks = (input.tasks ?? []).filter((task) => task.prompt?.trim());
  const kept: string[] = [];

  let order = 0;
  for (const task of tasks) {
    const data = {
      section: task.section?.trim() ?? "",
      kind: asKind(task.kind),
      prompt: task.prompt.trim(),
      text: task.text?.trim() ?? "",
      audioUrl: task.audioUrl?.trim() ?? "",
      transcript: task.transcript?.trim() ?? "",
      options: (task.options ?? []).map((o) => o.trim()).filter(Boolean),
      answer: task.answer?.trim() ?? "",
      explanation: task.explanation?.trim() ?? "",
      rule: task.rule?.trim() ?? "",
      hidden: task.hidden === true,
      order,
    };

    if (task.id) {
      await prisma.homeworkTask.update({ where: { id: task.id }, data });
      kept.push(task.id);
    } else {
      const created = await prisma.homeworkTask.create({
        data: { ...data, homeworkId: homework.id },
        select: { id: true },
      });
      kept.push(created.id);
    }
    order += 1;
  }

  // Удалённые в конструкторе задания уносят с собой ответы учеников —
  // об этом предупреждает сам конструктор
  await prisma.homeworkTask.deleteMany({
    where: { homeworkId: homework.id, id: { notIn: kept.length ? kept : ["-"] } },
  });
}
