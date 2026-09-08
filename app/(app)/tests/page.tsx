import Link from "next/link";
import { deleteTestAction } from "@/app/actions/tests";
import { GenerateTestForm } from "@/components/tests/GenerateTestForm";
import { TestBuilder } from "@/components/tests/TestBuilder";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { testAccessWhere } from "@/lib/test-access";

export default async function TestsPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const where = testAccessWhere(user);

  const [tests, lessons] = await Promise.all([
    prisma.test.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        lesson: { select: { id: true, number: true, topic: true } },
        _count: { select: { questions: true } },
        attempts: {
          where: { userId: user.id },
          orderBy: { finishedAt: "desc" },
          take: 1,
        },
      },
    }),
    isAdmin
      ? prisma.lesson.findMany({
          orderBy: { number: "asc" },
          select: {
            id: true,
            number: true,
            topic: true,
            _count: { select: { words: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  const lessonOptions = lessons.map((lesson) => ({
    id: lesson.id,
    number: lesson.number,
    topic: lesson.topic,
    words: lesson._count.words,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Тесты</h1>
          <p className="mt-1 text-[14.5px] text-ink-500">
            Проверьте, насколько хорошо усвоен материал
          </p>
        </div>
        {isAdmin ? <TestBuilder lessons={lessonOptions} /> : null}
      </div>

      {isAdmin ? <GenerateTestForm lessons={lessonOptions} /> : null}

      {tests.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl">📝</p>
          <p className="mt-4 text-[15px] text-ink-600">
            {isAdmin
              ? "Тестов пока нет. Создайте вручную или соберите из слов урока."
              : "Тестов для вас пока нет."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => {
            const last = test.attempts[0];

            return (
              <div key={test.id} className="card rise flex flex-col p-5">
                <div className="flex flex-wrap gap-1.5">
                  {test.lesson ? (
                    <span className="chip bg-brand-50 text-brand-700">
                      Урок №{test.lesson.number}
                    </span>
                  ) : (
                    <span className="chip bg-ink-100 text-ink-600">
                      Свободный тест
                    </span>
                  )}
                  {test.level ? (
                    <span className="chip bg-emerald-50 text-emerald-700">
                      {test.level}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-[16px] font-semibold text-ink-900">
                  {test.title}
                </h2>
                {test.description ? (
                  <p className="mt-1.5 flex-1 text-[13.5px] text-ink-500">
                    {test.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                <p className="mt-3 text-[13px] text-ink-500">
                  {test._count.questions} вопросов
                  {last && last.total > 0
                    ? ` · последний результат ${Math.round((last.score / last.total) * 100)}%`
                    : " · ещё не пройден"}
                </p>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/tests/${test.id}`}
                    prefetch
                    className="btn-primary btn-sm flex-1"
                  >
                    {last ? "Пройти снова" : "Начать"}
                  </Link>
                  {isAdmin ? (
                    <Link
                      href={`/tests/${test.id}/edit`}
                      prefetch
                      className="btn-ghost btn-sm"
                    >
                      Изменить
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <form action={deleteTestAction}>
                      <input type="hidden" name="id" value={test.id} />
                      <ConfirmSubmit
                        title="Удалить тест?"
                        message={`«${test.title}» удалится вместе с ${test._count.questions} вопросами и результатами учеников.`}
                      >
                        Удалить
                      </ConfirmSubmit>
                    </form>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
