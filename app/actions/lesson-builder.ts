"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { asBlocks, asTimeline, taskKey, type LessonBlock } from "@/lib/lesson-content";
import { PATCH_KEYS, type TaskPatch } from "@/lib/homework-personal";
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

  const studentId = String(formData.get("studentId") ?? "");
  if (studentId) {
    return savePersonal(lesson.id, lesson.number, studentId, payload);
  }

  // Заданиям без id выдаём его при первом же сохранении: по нему потом
  // находятся ответы учеников
  const blocks = await prepareBlocks(payload.blocks, lessonId);

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
    where: {
      homeworkId: homework.id,
      forUserId: null,
      id: { notIn: kept.length ? kept : ["-"] },
    },
  });
}

/**
 * Приводит блоки к безопасному виду (asBlocks чистит лишние поля) и выдаёт id
 * заданиям, у которых его ещё нет. Ответы, записанные до появления id,
 * переносим на новый ключ — иначе работа ученика отвязалась бы от задания.
 * Для личной версии переносим ответы только этого ученика.
 */
async function prepareBlocks(
  raw: unknown,
  lessonId: string,
  onlyUserId?: string,
): Promise<LessonBlock[]> {
  const parsed = asBlocks(raw);
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

  for (const { from, to } of renamed) {
    await prisma.lessonTaskAnswer
      .updateMany({
        where: { lessonId, taskKey: from, ...(onlyUserId ? { userId: onlyUserId } : {}) },
        data: { taskKey: to },
      })
      .catch(() => undefined);
  }
  return blocks;
}

/* ───────────────────── Личная версия для одного ученика ───────────────────── */

const FIELDS = [...PATCH_KEYS] as const;

type TaskRow = {
  id: string;
  order: number;
  section: string;
  prompt: string;
  text: string;
  audioUrl: string;
  transcript: string;
  options: string[];
  answer: string;
  explanation: string;
  rule: string;
  hidden: boolean;
};

/** Что в черновике отличается от общего задания — это и есть личная правка */
function diffFromBase(base: TaskRow, draft: HomeworkTaskDraft): TaskPatch {
  const patch: TaskPatch = {};
  const clean = {
    section: draft.section?.trim() ?? "",
    prompt: draft.prompt?.trim() ?? "",
    text: draft.text?.trim() ?? "",
    audioUrl: draft.audioUrl?.trim() ?? "",
    transcript: draft.transcript?.trim() ?? "",
    options: (draft.options ?? []).map((o) => o.trim()).filter(Boolean),
    answer: draft.answer?.trim() ?? "",
    explanation: draft.explanation?.trim() ?? "",
    rule: draft.rule?.trim() ?? "",
    hidden: draft.hidden === true,
  };

  for (const key of FIELDS) {
    const mine = clean[key];
    const theirs = base[key];
    const same = Array.isArray(mine)
      ? JSON.stringify(mine) === JSON.stringify(theirs)
      : mine === theirs;
    if (!same) (patch as Record<string, unknown>)[key] = mine;
  }
  return patch;
}

/** Сохраняет правки для одного ученика: блоки и тайминг урока и его домашнюю работу */
async function savePersonal(
  lessonId: string,
  lessonNumber: number,
  studentId: string,
  payload: Payload,
): Promise<BuilderState> {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { id: true, role: true, firstName: true, lastName: true },
  });
  if (!student || student.role !== "STUDENT") {
    return { ok: false, message: "Ученик не найден" };
  }

  const blocks = await prepareBlocks(payload.blocks, lessonId, studentId);
  const timeline =
    payload.timeline === undefined ? undefined : asTimeline(payload.timeline);

  await prisma.lessonStudentVersion.upsert({
    where: { lessonId_userId: { lessonId, userId: studentId } },
    create: { lessonId, userId: studentId, blocks, ...(timeline ? { timeline } : {}) },
    update: { blocks, ...(timeline ? { timeline } : {}) },
  });

  await savePersonalHomework(lessonId, studentId, payload.homework ?? null);

  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath("/homework");
  revalidatePath(`/students/${studentId}`);

  const name = `${student.firstName} ${student.lastName}`.trim();
  return {
    ok: true,
    message: `Личная версия урока №${lessonNumber} для ученика «${name}» сохранена`,
  };
}

async function savePersonalHomework(
  lessonId: string,
  studentId: string,
  input: Payload["homework"],
) {
  const homework = await prisma.homework.findUnique({
    where: { lessonId },
    select: { id: true },
  });
  if (!homework || !input) return;

  const common = await prisma.homeworkTask.findMany({
    where: { homeworkId: homework.id, forUserId: null },
    select: {
      id: true,
      order: true,
      section: true,
      prompt: true,
      text: true,
      audioUrl: true,
      transcript: true,
      options: true,
      answer: true,
      explanation: true,
      rule: true,
      hidden: true,
    },
  });
  const byId = new Map(common.map((task) => [task.id, task]));
  const drafts = input.tasks ?? [];

  // Общие задания: сохраняем только отличия от общей версии
  for (const draft of drafts) {
    const base = draft.id && !draft.personal ? byId.get(draft.id) : undefined;
    if (!base) continue;

    const patch = diffFromBase(base, draft);
    if (Object.keys(patch).length === 0) {
      await prisma.homeworkTaskOverride
        .deleteMany({ where: { taskId: base.id, userId: studentId } })
        .catch(() => undefined);
    } else {
      await prisma.homeworkTaskOverride.upsert({
        where: { taskId_userId: { taskId: base.id, userId: studentId } },
        create: { taskId: base.id, userId: studentId, patch },
        update: { patch },
      });
    }
  }

  // Личные задания: создаём, обновляем, лишние убираем
  const mine = await prisma.homeworkTask.findMany({
    where: { homeworkId: homework.id, forUserId: studentId },
    select: { id: true },
  });
  const mineIds = new Set(mine.map((task) => task.id));
  const kept: string[] = [];
  let lastCommonOrder = 0;

  for (const draft of drafts) {
    const base = draft.id && !draft.personal ? byId.get(draft.id) : undefined;
    if (base) {
      lastCommonOrder = base.order;
      continue;
    }
    if (!draft.personal || !draft.prompt?.trim()) continue;

    const data = {
      section: draft.section?.trim() ?? "",
      kind: asKind(draft.kind),
      prompt: draft.prompt.trim(),
      text: draft.text?.trim() ?? "",
      audioUrl: draft.audioUrl?.trim() ?? "",
      transcript: draft.transcript?.trim() ?? "",
      options: (draft.options ?? []).map((o) => o.trim()).filter(Boolean),
      answer: draft.answer?.trim() ?? "",
      explanation: draft.explanation?.trim() ?? "",
      rule: draft.rule?.trim() ?? "",
      hidden: draft.hidden === true,
      // Встаёт после общих заданий с тем же номером
      order: lastCommonOrder,
    };

    if (draft.id && mineIds.has(draft.id)) {
      await prisma.homeworkTask.update({ where: { id: draft.id }, data });
      kept.push(draft.id);
    } else {
      const created = await prisma.homeworkTask.create({
        data: { ...data, homeworkId: homework.id, forUserId: studentId },
        select: { id: true },
      });
      kept.push(created.id);
    }
  }

  await prisma.homeworkTask.deleteMany({
    where: {
      homeworkId: homework.id,
      forUserId: studentId,
      id: { notIn: kept.length ? kept : ["-"] },
    },
  });
}

/**
 * Возвращает ученику общую версию: удаляет его личную версию урока и/или
 * личные правки домашней работы (вместе с личными заданиями и ответами на них).
 */
export async function resetStudentVersionAction(formData: FormData): Promise<void> {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") return;

  const lessonId = String(formData.get("lessonId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  const what = String(formData.get("what") ?? "all");
  if (!lessonId || !studentId) return;

  if (what === "all" || what === "lesson") {
    await prisma.lessonStudentVersion.deleteMany({ where: { lessonId, userId: studentId } });
  }
  if (what === "all" || what === "homework") {
    const homework = await prisma.homework.findUnique({ where: { lessonId }, select: { id: true } });
    if (homework) {
      await prisma.homeworkTaskOverride.deleteMany({
        where: { userId: studentId, task: { homeworkId: homework.id } },
      });
      await prisma.homeworkTask.deleteMany({
        where: { homeworkId: homework.id, forUserId: studentId },
      });
    }
  }

  revalidatePath(`/lessons/${lessonId}`);
  revalidatePath("/homework");
  revalidatePath(`/students/${studentId}`);
  redirect(`/lessons/${lessonId}/edit?student=${studentId}`);
}
