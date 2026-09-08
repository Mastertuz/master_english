import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HomeworkRunner,
  type HomeworkTaskView,
} from "@/components/homework/HomeworkRunner";
import { SeenOnView } from "@/components/notifications/SeenOnView";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function HomeworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const homework = await prisma.homework.findUnique({
    where: { id },
    include: {
      lesson: {
        select: {
          id: true,
          number: true,
          topic: true,
          level: true,
          assignments: { where: { userId: user.id }, select: { id: true } },
        },
      },
      tasks: {
        orderBy: { order: "asc" },
        include: {
          answers: {
            where: { userId: user.id },
            select: {
              value: true,
              isCorrect: true,
              grade: true,
              comment: true,
              commentSeenAt: true,
              saved: true,
            },
          },
        },
      },
    },
  });

  if (!homework) notFound();
  if (!isAdmin && homework.lesson.assignments.length === 0) notFound();

  const submitted = Boolean(
    await prisma.homeworkSubmission.findUnique({
      where: { homeworkId_userId: { homeworkId: homework.id, userId: user.id } },
      select: { id: true },
    }),
  );

  const unseenComments = homework.tasks.filter(
    (task) => task.answers[0]?.comment && !task.answers[0]?.commentSeenAt,
  ).length;

  // Скрытые задания видит только преподаватель — с пометкой на карточке.
  // Ответы привязаны к id задания, поэтому убрать их из списка безопасно.
  const visible = isAdmin
    ? homework.tasks
    : homework.tasks.filter((task) => !task.hidden);

  const tasks: HomeworkTaskView[] = visible.map((task) => ({
    id: task.id,
    order: task.order,
    section: task.section,
    kind: task.kind,
    prompt: task.prompt,
    text: task.text,
    audioUrl: task.audioUrl,
    transcript: task.transcript,
    options: task.options,
    answer: task.answer,
    explanation: task.explanation,
    rule: task.rule,
    hidden: task.hidden,
    saved: task.answers[0] ?? null,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href={`/lessons/${homework.lesson.id}`}
        prefetch
        className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800"
      >
        ← К уроку №{homework.lesson.number}
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-amber-50 text-amber-700">
            Домашнее задание
          </span>
          <span className="chip bg-emerald-50 text-emerald-700">
            {homework.lesson.level}
          </span>
        </div>
        <h1 className="page-title mt-2">{homework.title}</h1>
        {homework.intro ? (
          <p className="mt-1.5 text-[14.5px] text-ink-500">{homework.intro}</p>
        ) : null}
      </div>

      <SeenOnView homeworkId={homework.id} unseen={unseenComments} />

      {tasks.length === 0 ? (
        <div className="card p-8 text-center text-[14px] text-ink-500">
          В задании пока нет упражнений.
        </div>
      ) : (
        <HomeworkRunner
          tasks={tasks}
          homeworkId={homework.id}
          submitted={submitted}
          canSeeHidden={isAdmin}
        />
      )}
    </div>
  );
}
