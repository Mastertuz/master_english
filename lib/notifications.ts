import { asBlocks, taskKey } from "./lesson-content";
import { newCommentEmail, sendMail } from "./mail";
import { prisma } from "./prisma";

export type CommentNotice = {
  id: string;
  /** Куда вести ученика, чтобы он увидел комментарий в контексте */
  href: string;
  where: string;
  task: string;
  comment: string;
  at: Date;
};

/**
 * Новые комментарии преподавателя.
 *
 * Комментарий считается новым, пока ученик не открыл страницу, где он
 * написан: отметку ставит сама страница. Правка комментария снова делает
 * его новым — иначе ученик пропустил бы уточнение.
 */
export async function newComments(userId: string): Promise<CommentNotice[]> {
  const [lessonAnswers, homeworkAnswers] = await Promise.all([
    prisma.lessonTaskAnswer.findMany({
      where: { userId, NOT: { comment: "" }, commentSeenAt: null },
      orderBy: { commentedAt: "desc" },
      take: 20,
      select: {
        id: true,
        taskKey: true,
        comment: true,
        commentedAt: true,
        lesson: { select: { id: true, number: true, topic: true, blocks: true } },
      },
    }),
    prisma.homeworkAnswer.findMany({
      where: { userId, NOT: { comment: null }, commentSeenAt: null },
      orderBy: { gradedAt: "desc" },
      take: 20,
      select: {
        id: true,
        comment: true,
        gradedAt: true,
        task: {
          select: {
            prompt: true,
            section: true,
            homework: {
              select: { id: true, title: true, lesson: { select: { number: true } } },
            },
          },
        },
      },
    }),
  ]);

  const fromLessons: CommentNotice[] = lessonAnswers.map((answer) => {
    const task = findTask(answer.lesson.blocks, answer.taskKey);

    return {
      id: answer.id,
      href: `/lessons/${answer.lesson.id}`,
      where: `Урок №${answer.lesson.number} · ${answer.lesson.topic}`,
      task: task?.prompt ?? "Задание урока",
      comment: answer.comment,
      at: answer.commentedAt ?? new Date(0),
    };
  });

  const fromHomework: CommentNotice[] = homeworkAnswers.map((answer) => ({
    id: answer.id,
    href: `/homework/${answer.task.homework.id}`,
    where: `Домашнее задание к уроку ${answer.task.homework.lesson.number}`,
    task: answer.task.section || answer.task.prompt,
    comment: answer.comment ?? "",
    at: answer.gradedAt ?? new Date(0),
  }));

  return [...fromLessons, ...fromHomework].sort(
    (a, b) => b.at.getTime() - a.at.getTime(),
  );
}

/** Сколько новых комментариев ждёт ученика */
export async function countNewComments(userId: string): Promise<number> {
  const [lessons, homework] = await Promise.all([
    prisma.lessonTaskAnswer.count({
      where: { userId, NOT: { comment: "" }, commentSeenAt: null },
    }),
    prisma.homeworkAnswer.count({
      where: { userId, NOT: { comment: null }, commentSeenAt: null },
    }),
  ]);

  return lessons + homework;
}

/** Находит задание урока по ключу ответа: собственный id или позиция */
function findTask(blocks: unknown, key: string) {
  for (const [blockIndex, block] of asBlocks(blocks).entries()) {
    for (const [taskIndex, task] of block.tasks.entries()) {
      if (taskKey(blockIndex, taskIndex, task) === key) return task;
    }
  }
  return null;
}

/**
 * Письмо ученику о комментарии.
 *
 * Пишем только про первый непрочитанный комментарий: преподаватель за один
 * заход проверяет несколько заданий, и отдельное письмо на каждое превратило
 * бы почту в спам. Как только ученик открыл страницу и отметки снялись,
 * следующий комментарий снова придёт письмом.
 *
 * Ошибку почты глушим: комментарий уже сохранён, и падать из-за письма
 * форме преподавателя незачем.
 */
export async function notifyAboutComment(input: {
  userId: string;
  where: string;
  task: string;
  comment: string;
  href: string;
}): Promise<void> {
  try {
    if ((await countNewComments(input.userId)) !== 1) return;

    const student = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { email: true, firstName: true },
    });
    if (!student?.email) return;

    const mail = newCommentEmail({
      name: student.firstName,
      where: input.where,
      task: input.task,
      comment: input.comment,
      href: input.href,
    });

    await sendMail({ ...mail, to: student.email });
  } catch (error) {
    console.error(
      "[mail] не удалось отправить письмо о комментарии:",
      error instanceof Error ? error.message : error,
    );
  }
}

/* ─────────── Уведомления преподавателю: ученик отправил работу ─────────── */

export type SubmissionNotice = {
  id: string;
  /** Работа ученика в режиме проверки */
  href: string;
  student: string;
  title: string;
  at: Date;
};

/**
 * Новые отправленные домашние работы.
 *
 * Работа считается новой, пока преподаватель не открыл её на проверку:
 * отметку ставит сама страница. Повторная отправка снова делает её новой.
 */
export async function newSubmissions(): Promise<SubmissionNotice[]> {
  const rows = await prisma.homeworkSubmission.findMany({
    where: { seenByTeacherAt: null },
    orderBy: { submittedAt: "desc" },
    take: 20,
    select: {
      id: true,
      userId: true,
      submittedAt: true,
      user: { select: { firstName: true, lastName: true } },
      homework: {
        select: { id: true, title: true, lesson: { select: { number: true } } },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    href: `/homework/${row.homework.id}?student=${row.userId}`,
    student: `${row.user.firstName} ${row.user.lastName}`.trim(),
    title: `Урок №${row.homework.lesson.number} · ${row.homework.title}`,
    at: row.submittedAt,
  }));
}

/** Сколько новых работ ждёт преподавателя */
export async function countNewSubmissions(): Promise<number> {
  return prisma.homeworkSubmission.count({ where: { seenByTeacherAt: null } });
}
