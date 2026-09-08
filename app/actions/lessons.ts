"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { isAnswerCorrect } from "@/lib/answer";
import { isLevel } from "@/lib/lesson-content";
import { notifyAboutComment } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireUser } from "@/lib/session";
import { collect, type FieldErrors } from "@/lib/validation";

export type LessonState = {
  ok: boolean;
  message?: string;
  errors?: FieldErrors;
  /** id созданного урока — форма сразу открывает его конструктор */
  lessonId?: string;
} | null;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

async function requireAdminUser() {
  const me = await getCurrentUser();
  return me && me.role === "ADMIN" ? me : null;
}

/* ─────────────────────────── Уроки ─────────────────────────── */

export async function createLessonAction(
  _prev: LessonState,
  formData: FormData,
): Promise<LessonState> {
  const me = await requireAdminUser();
  if (!me) return { ok: false, message: "Уроки создаёт администратор" };

  const topic = str(formData, "topic");
  const numberRaw = str(formData, "number");
  const level = str(formData, "level");

  const errors = collect({
    topic: topic ? null : "Укажите тему урока",
    number:
      numberRaw && (!/^\d+$/.test(numberRaw) || Number(numberRaw) < 0)
        ? "Номер — целое число"
        : null,
    level: isLevel(level) ? null : "Выберите уровень",
  });
  if (errors) return { ok: false, message: "Проверьте поля", errors };

  let number = Number(numberRaw);
  if (!numberRaw) {
    const last = await prisma.lesson.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });
    number = (last?.number ?? 0) + 1;
  }

  const taken = await prisma.lesson.findUnique({
    where: { number },
    select: { id: true },
  });
  if (taken) {
    return {
      ok: false,
      message: `Урок №${number} уже существует`,
      errors: { number: "Такой номер занят" },
    };
  }

  const durationRaw = str(formData, "durationMin");

  const lesson = await prisma.lesson.create({
    data: {
      number,
      topic,
      description: str(formData, "description"),
      goal: str(formData, "goal"),
      level: isLevel(level) ? level : "A2",
      bookTitle: str(formData, "bookTitle"),
      bookRef: str(formData, "bookRef"),
      durationMin: /^\d+$/.test(durationRaw) ? Number(durationRaw) : 60,
      authorId: me.id,
    },
    select: { id: true },
  });

  revalidatePath("/lessons");
  revalidatePath("/students");
  return {
    ok: true,
    message: `Урок №${number} создан`,
    lessonId: lesson.id,
  };
}

export async function updateLessonAction(
  _prev: LessonState,
  formData: FormData,
): Promise<LessonState> {
  const me = await requireAdminUser();
  if (!me) return { ok: false, message: "Уроки меняет администратор" };

  const id = str(formData, "id");
  const topic = str(formData, "topic");
  const level = str(formData, "level");

  const errors = collect({
    topic: topic ? null : "Укажите тему урока",
    level: isLevel(level) ? null : "Выберите уровень",
  });
  if (errors) return { ok: false, message: "Проверьте поля", errors };

  const durationRaw = str(formData, "durationMin");

  await prisma.lesson.update({
    where: { id },
    data: {
      topic,
      description: str(formData, "description"),
      goal: str(formData, "goal"),
      level: isLevel(level) ? level : "A2",
      bookTitle: str(formData, "bookTitle"),
      bookRef: str(formData, "bookRef"),
      durationMin: /^\d+$/.test(durationRaw) ? Number(durationRaw) : 60,
    },
  });

  revalidatePath("/lessons");
  revalidatePath(`/lessons/${id}`);
  return { ok: true, message: "Урок сохранён" };
}

export async function deleteLessonAction(formData: FormData): Promise<void> {
  const me = await requireAdminUser();
  if (!me) return;

  await prisma.lesson
    .delete({ where: { id: String(formData.get("id") ?? "") } })
    .catch(() => undefined);

  revalidatePath("/lessons");
  revalidatePath("/students");
}

/* ───────────────────── Назначение уроков ───────────────────── */

/**
 * Копирует словарь урока в личный словарь пользователя.
 * Уже существующие слова не перезаписываются: у ученика мог быть свой
 * перевод или картинка — обновляем только связь с уроком.
 */
async function copyLessonWords(lessonId: string, userId: string) {
  const words = await prisma.lessonWord.findMany({ where: { lessonId } });

  for (const word of words) {
    await prisma.word.upsert({
      where: { userId_english: { userId, english: word.english } },
      create: {
        userId,
        lessonWordId: word.id,
        english: word.english,
        russian: word.russian,
        partOfSpeech: word.partOfSpeech,
        transcription: word.transcription,
        example: word.example,
        definition: word.definition,
        definitionRu: word.definitionRu,
        audioUrl: word.audioUrl,
        imageUrl: word.imageUrl,
        source: "lesson",
      },
      update: { lessonWordId: word.id },
    });
  }

  return words.length;
}

/** Назначает урок ученику и копирует словарь урока в его личный словарь */
export async function assignLessonAction(formData: FormData): Promise<void> {
  const me = await requireAdminUser();
  if (!me) return;

  const lessonId = String(formData.get("lessonId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  if (!lessonId || !userId) return;

  await prisma.lessonAssignment.upsert({
    where: { lessonId_userId: { lessonId, userId } },
    create: { lessonId, userId },
    update: {},
  });

  await copyLessonWords(lessonId, userId);

  revalidatePath(`/students/${userId}`);
  revalidatePath("/lessons");
}

export async function unassignLessonAction(formData: FormData): Promise<void> {
  const me = await requireAdminUser();
  if (!me) return;

  const lessonId = String(formData.get("lessonId") ?? "");
  const userId = String(formData.get("userId") ?? "");

  await prisma.lessonAssignment
    .delete({ where: { lessonId_userId: { lessonId, userId } } })
    .catch(() => undefined);

  revalidatePath(`/students/${userId}`);
  revalidatePath("/lessons");
}

/* ───────────────────── Домашние задания ───────────────────── */

/** Сохраняет ответ ученика; задания с автопроверкой проверяются сразу */
export async function answerHomeworkAction(input: {
  taskId: string;
  value: string;
}): Promise<{ ok: boolean; isCorrect: boolean | null; explanation: string }> {
  const me = await requireUser();

  const task = await prisma.homeworkTask.findUnique({
    where: { id: input.taskId },
    select: {
      id: true,
      kind: true,
      answer: true,
      explanation: true,
      homework: { select: { lessonId: true } },
    },
  });
  if (!task) return { ok: false, isCorrect: null, explanation: "" };

  // Ученик отвечает только на задания назначенного ему урока
  const assigned = await prisma.lessonAssignment.findUnique({
    where: {
      lessonId_userId: { lessonId: task.homework.lessonId, userId: me.id },
    },
    select: { id: true },
  });
  if (!assigned && me.role !== "ADMIN") {
    return { ok: false, isCorrect: null, explanation: "" };
  }

  const isCorrect =
    task.kind === "TEACHER"
      ? null
      : isAnswerCorrect(input.value, task.answer);

  await prisma.homeworkAnswer.upsert({
    where: { taskId_userId: { taskId: task.id, userId: me.id } },
    create: {
      taskId: task.id,
      userId: me.id,
      value: input.value.slice(0, 4000),
      isCorrect,
    },
    update: {
      value: input.value.slice(0, 4000),
      isCorrect,
      answeredAt: new Date(),
      grade: null,
      gradedAt: null,
      // Переотвеченное задание снова черновик, пока его не сохранят
      saved: false,
    },
  });

  return {
    ok: true,
    isCorrect,
    explanation: task.explanation,
  };
}

/** Оценка развёрнутого ответа преподавателем */
export async function gradeAnswerAction(
  _prev: LessonState,
  formData: FormData,
): Promise<LessonState> {
  const me = await requireAdminUser();
  if (!me) return { ok: false, message: "Нужны права администратора" };

  const answerId = str(formData, "answerId");
  const gradeRaw = str(formData, "grade");
  const grade = Number(gradeRaw);

  if (!/^\d+$/.test(gradeRaw) || grade < 1 || grade > 5) {
    return {
      ok: false,
      message: "Оценка — число от 1 до 5",
      errors: { grade: "От 1 до 5" },
    };
  }

  const answer = await prisma.homeworkAnswer.findUnique({
    where: { id: answerId },
    select: {
      userId: true,
      task: {
        select: {
          prompt: true,
          section: true,
          homework: {
            select: { id: true, lesson: { select: { number: true } } },
          },
        },
      },
    },
  });
  if (!answer) return { ok: false, message: "Ответ не найден" };

  const comment = str(formData, "comment");

  await prisma.homeworkAnswer.update({
    where: { id: answerId },
    data: {
      grade,
      comment: comment || null,
      gradedAt: new Date(),
      // Ученик ещё не видел эту проверку
      commentSeenAt: null,
    },
  });

  if (comment) {
    // Письмо уходит после ответа — см. комментарий в lesson-answers.ts
    after(() =>
      notifyAboutComment({
        userId: answer.userId,
        where: `Домашнее задание к уроку ${answer.task.homework.lesson.number}`,
        task: answer.task.section || answer.task.prompt,
        comment,
        href: `/homework/${answer.task.homework.id}`,
      }),
    );
  }

  revalidatePath(`/students/${answer.userId}`);
  return { ok: true, message: "Оценка выставлена" };
}

/* ─────────── Отправка домашней работы и сброс ответов ─────────── */

/**
 * Ученик отправляет работу на проверку. С этого момента его ответы
 * сохраняются между заходами: до отправки задание каждый раз начинается
 * с чистого листа, чтобы можно было прорешать заново.
 */
export async function submitHomeworkAction(homeworkId: string): Promise<void> {
  const me = await requireUser();

  const homework = await prisma.homework.findUnique({
    where: { id: homeworkId },
    select: { lessonId: true },
  });
  if (!homework) return;

  const assigned = await prisma.lessonAssignment.findUnique({
    where: { lessonId_userId: { lessonId: homework.lessonId, userId: me.id } },
    select: { id: true },
  });
  if (!assigned && me.role !== "ADMIN") return;

  await prisma.homeworkSubmission.upsert({
    where: { homeworkId_userId: { homeworkId, userId: me.id } },
    create: { homeworkId, userId: me.id },
    update: { submittedAt: new Date() },
  });

  revalidatePath(`/homework/${homeworkId}`);
  revalidatePath("/homework");
  revalidatePath(`/students/${me.id}`);
}

/**
 * Ученик сохраняет ответы, не отправляя работу преподавателю.
 *
 * Несохранённый ответ — черновик: при следующем заходе задание снова чистое.
 * Сохранённые ответы остаются на месте, работу можно дорешать в другой день.
 * Сохраняем только перечисленные задания: в базе могут лежать брошенные
 * черновики прошлых заходов, и «сохранить всё» не должно их воскрешать.
 */
export async function saveHomeworkAnswersAction(input: {
  homeworkId: string;
  taskIds: string[];
}): Promise<{ ok: boolean; saved: number }> {
  const me = await requireUser();

  const homework = await prisma.homework.findUnique({
    where: { id: input.homeworkId },
    select: { lessonId: true },
  });
  if (!homework) return { ok: false, saved: 0 };

  const assigned = await prisma.lessonAssignment.findUnique({
    where: { lessonId_userId: { lessonId: homework.lessonId, userId: me.id } },
    select: { id: true },
  });
  if (!assigned && me.role !== "ADMIN") return { ok: false, saved: 0 };

  const taskIds = input.taskIds.filter(Boolean);
  if (taskIds.length === 0) return { ok: true, saved: 0 };

  const { count } = await prisma.homeworkAnswer.updateMany({
    where: {
      userId: me.id,
      taskId: { in: taskIds },
      task: { homeworkId: input.homeworkId },
    },
    data: { saved: true },
  });

  revalidatePath(`/homework/${input.homeworkId}`);
  revalidatePath("/homework");

  return { ok: true, saved: count };
}

/** Ученик очищает свои ответы и начинает работу заново */
export async function resetHomeworkAction(homeworkId: string): Promise<void> {
  const me = await requireUser();

  await prisma.homeworkAnswer.deleteMany({
    where: { userId: me.id, task: { homeworkId } },
  });
  await prisma.homeworkSubmission
    .delete({ where: { homeworkId_userId: { homeworkId, userId: me.id } } })
    .catch(() => undefined);

  revalidatePath(`/homework/${homeworkId}`);
  revalidatePath("/homework");
  revalidatePath(`/students/${me.id}`);
}

/**
 * Ученик очищает ответ на одном задании, чтобы решить его заново.
 *
 * Отдельная кнопка на карточке задания: сбрасывать всю работу ради одного
 * пункта не нужно. Отправленную работу поштучно не трогаем — её уже видит
 * преподаватель, для неё есть общий сброс.
 */
export async function resetHomeworkTaskAction(taskId: string): Promise<void> {
  const me = await requireUser();

  const task = await prisma.homeworkTask.findUnique({
    where: { id: taskId },
    select: { homeworkId: true },
  });
  if (!task) return;

  const submitted = await prisma.homeworkSubmission.findUnique({
    where: {
      homeworkId_userId: { homeworkId: task.homeworkId, userId: me.id },
    },
    select: { id: true },
  });
  if (submitted) return;

  await prisma.homeworkAnswer.deleteMany({ where: { taskId, userId: me.id } });

  revalidatePath(`/homework/${task.homeworkId}`);
  revalidatePath(`/students/${me.id}`);
}

/** Преподаватель отмечает урок пройденным (или снимает отметку) */
export async function setLessonCompletionAction(
  formData: FormData,
): Promise<void> {
  const me = await requireAdminUser();
  if (!me) return;

  const lessonId = str(formData, "lessonId");
  const userId = str(formData, "userId");
  const done = str(formData, "done") === "1";

  await prisma.lessonAssignment
    .update({
      where: { lessonId_userId: { lessonId, userId } },
      data: { completedAt: done ? new Date() : null },
    })
    .catch(() => undefined);

  revalidatePath(`/students/${userId}`);
  revalidatePath(`/lessons/${lessonId}`);
}

/**
 * «Тренировать» из урока: сначала докладываем слова урока в личный словарь,
 * потом открываем тренировку с ними.
 *
 * Раньше слова попадали в словарь только при назначении урока, и если их
 * там не оказывалось (урок открыл преподаватель, слово удалили, слова
 * добавили в урок позже) — тренировка открывалась пустой.
 *
 * Копируем в действии, а не при отрисовке страницы: ссылки в приложении
 * с prefetch, и при заходе на страницу словарь пополнялся бы уже от
 * наведения мыши.
 */
export async function trainLessonWordsAction(formData: FormData): Promise<void> {
  const me = await requireUser();
  const lessonId = str(formData, "lessonId");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      assignments: { where: { userId: me.id }, select: { id: true } },
    },
  });

  if (lesson && (me.role === "ADMIN" || lesson.assignments.length > 0)) {
    await copyLessonWords(lessonId, me.id);
    revalidatePath("/dictionary");
  }

  redirect(`/training/translate?lesson=${lessonId}`);
}
