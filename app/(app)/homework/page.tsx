import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function HomeworkListPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const homework = await prisma.homework.findMany({
    where: isAdmin
      ? {}
      : { lesson: { assignments: { some: { userId: user.id } } } },
    orderBy: { lesson: { number: "asc" } },
    select: {
      id: true,
      title: true,
      intro: true,
      lesson: { select: { id: true, number: true, topic: true, level: true } },
      // Скрытые задания в счётчик ученика не идут — он их не видит
      tasks: {
        where: isAdmin ? {} : { hidden: false },
        select: {
          kind: true,
          hidden: true,
          answers: {
            where: { userId: user.id },
            select: { isCorrect: true, grade: true, saved: true },
          },
        },
      },
      // Отправленная работа сохранена целиком, флаг saved у ответов не нужен
      submissions: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Домашние задания</h1>
        <p className="mt-1 text-[14.5px] text-ink-500">
          Задания с автопроверкой и развёрнутые ответы для преподавателя
        </p>
      </div>

      {homework.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl">✍️</p>
          <p className="mt-4 text-[15px] text-ink-600">
            Домашних заданий пока нет.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {homework.map((item) => {
            /**
             * Считаем ровно то же, что показывает сама работа: задания с
             * автопроверкой, кроме скрытых. Развёрнутые ответы идут отдельной
             * строкой «на проверке».
             */
            const submitted = item.submissions.length > 0;

            /** Черновик пропадёт при следующем заходе, поэтому за ответ не считаем */
            const kept = (answer?: { saved: boolean }) =>
              Boolean(answer) && (submitted || answer!.saved);

            const auto = item.tasks.filter(
              (task) => task.kind !== "TEACHER" && !task.hidden,
            );
            const total = auto.length;
            const done = auto.filter((task) => kept(task.answers[0])).length;
            const correct = auto.filter(
              (task) => kept(task.answers[0]) && task.answers[0]?.isCorrect === true,
            ).length;
            const waiting = item.tasks.filter(
              (task) =>
                task.kind === "TEACHER" &&
                !task.hidden &&
                kept(task.answers[0]) &&
                task.answers[0]?.grade == null,
            ).length;

            // Бывает работа из одних развёрнутых ответов — «0 из 0» там ни о чём
            const open = item.tasks.filter(
              (task) => task.kind === "TEACHER" && !task.hidden,
            ).length;

            return (
              <Link
                key={item.id}
                href={`/homework/${item.id}`}
                prefetch
                className="card rise group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip bg-brand-50 text-brand-700">
                    Урок №{item.lesson.number}
                  </span>
                  <span className="chip bg-emerald-50 text-emerald-700">
                    {item.lesson.level}
                  </span>
                  {waiting > 0 ? (
                    <span className="chip bg-amber-50 text-amber-700">
                      На проверке: {waiting}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-[16px] font-semibold text-ink-900 group-hover:text-brand-700">
                  {item.title}
                </h2>
                <p className="mt-1 flex-1 text-[13.5px] text-ink-500">
                  {item.lesson.topic}
                </p>

                <div className="mt-3">
                  <div className="mb-1.5 flex justify-between text-[12.5px] text-ink-500">
                    <span>
                      {total > 0
                        ? `Выполнено ${done} из ${total}`
                        : `Развёрнутых ответов: ${open}`}
                    </span>
                    <span>
                      {total > 0
                        ? `верно ${correct}`
                        : waiting > 0
                          ? `на проверке ${waiting}`
                          : ""}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-200">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(done / Math.max(total, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
