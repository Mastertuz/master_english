import Link from "next/link";
import { notFound } from "next/navigation";
import {
  setLessonCompletionAction,
  unassignLessonAction,
} from "@/app/actions/lessons";
import { unassignTestAction } from "@/app/actions/tests";
import { AssignLesson } from "@/components/students/AssignLesson";
import { AssignTest } from "@/components/students/AssignTest";
import { StudentProfile } from "@/components/students/StudentProfile";
import { GradeForm } from "@/components/students/GradeForm";
import { OgeAccessForm } from "@/components/oge/OgeAccessForm";
import { OGE_VARIANTS } from "@/lib/oge";
import { TOTAL_MAX } from "@/lib/oge/scoring";
import { STATUS_LABEL, STATUS_STYLE, summarize } from "@/lib/oge/summary";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { prisma } from "@/lib/prisma";
import { initialsOf, requireAdmin } from "@/lib/session";

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();

  const student = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      login: true,
      email: true,
      firstName: true,
      lastName: true,
      level: true,
      createdAt: true,
      ogeAccess: true,
      ogeAttempts: {
        select: {
          variant: true,
          answers: true,
          review: true,
          submittedAt: true,
          checkedAt: true,
        },
      },
      _count: { select: { words: true, testResults: true, attempts: true } },
      assignments: {
        orderBy: { lesson: { number: "asc" } },
        select: {
          completedAt: true,
          lesson: {
            select: {
              id: true,
              number: true,
              topic: true,
              level: true,
              homework: { select: { id: true, title: true } },
              tests: { select: { id: true, title: true } },
            },
          },
        },
      },
    },
  });

  if (!student) notFound();

  const assignedIds = student.assignments.map((item) => item.lesson.id);

  const available = await prisma.lesson.findMany({
    where: { id: { notIn: assignedIds.length ? assignedIds : ["-"] } },
    orderBy: { number: "asc" },
    select: { id: true, number: true, topic: true, level: true },
  });

  // Тесты, выданные ученику лично, и что ещё можно выдать
  const assignedTests = await prisma.testAssignment.findMany({
    where: { userId: student.id },
    orderBy: { assignedAt: "desc" },
    select: {
      test: {
        select: {
          id: true,
          title: true,
          level: true,
          lesson: { select: { number: true, topic: true } },
          _count: { select: { questions: true } },
          attempts: {
            where: { userId: student.id },
            orderBy: { finishedAt: "desc" },
            take: 1,
            select: { score: true, total: true },
          },
        },
      },
    },
  });

  const assignedTestIds = assignedTests.map((item) => item.test.id);

  const availableTests = await prisma.test.findMany({
    where: { id: { notIn: assignedTestIds.length ? assignedTestIds : ["-"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      level: true,
      lesson: { select: { number: true } },
      _count: { select: { questions: true } },
    },
  });

  // Домашние задания выданных уроков — считаем так же, как их видит ученик
  const homework = await prisma.homework.findMany({
    where: { lesson: { assignments: { some: { userId: student.id } } } },
    orderBy: { lesson: { number: "asc" } },
    select: {
      id: true,
      title: true,
      dueDate: true,
      lesson: { select: { number: true, topic: true } },
      tasks: {
        where: { hidden: false },
        select: {
          kind: true,
          answers: {
            where: { userId: student.id },
            select: { isCorrect: true, grade: true, saved: true },
          },
        },
      },
      submissions: {
        where: { userId: student.id },
        select: { submittedAt: true },
      },
    },
  });

  const homeworkRows = homework.map((item) => {
    const submittedAt = item.submissions[0]?.submittedAt ?? null;
    // Черновик, который ученик не сохранил, за ответ не считаем
    const kept = (answer?: { saved: boolean }) =>
      Boolean(answer) && (Boolean(submittedAt) || answer!.saved);

    const total = item.tasks.length;
    const done = item.tasks.filter((task) => kept(task.answers[0])).length;
    const correct = item.tasks.filter(
      (task) =>
        task.kind !== "TEACHER" &&
        kept(task.answers[0]) &&
        task.answers[0]?.isCorrect === true,
    ).length;
    const waiting = item.tasks.filter(
      (task) =>
        task.kind === "TEACHER" &&
        kept(task.answers[0]) &&
        task.answers[0]?.grade == null,
    ).length;

    return { ...item, submittedAt, total, done, correct, waiting };
  });

  const answers = await prisma.homeworkAnswer.findMany({
    where: { userId: student.id },
    orderBy: { answeredAt: "desc" },
    select: {
      id: true,
      value: true,
      isCorrect: true,
      grade: true,
      comment: true,
      answeredAt: true,
      task: {
        select: {
          kind: true,
          section: true,
          prompt: true,
          answer: true,
          homework: {
            select: { title: true, lesson: { select: { number: true } } },
          },
        },
      },
    },
  });

  const teacherAnswers = answers.filter((item) => item.task.kind === "TEACHER");
  const autoAnswers = answers.filter((item) => item.task.kind !== "TEACHER");
  const correct = autoAnswers.filter((item) => item.isCorrect).length;

  return (
    <div className="space-y-6">
      <Link
        href="/students"
        prefetch
        className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800"
      >
        ← Все ученики
      </Link>

      <div className="card flex flex-wrap items-center gap-4 p-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white">
          {initialsOf(student)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-ink-900">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-[14px] text-ink-500">
            {student.login}
            {student.email ? ` · ${student.email}` : ""}
          </p>
          <span
            className={`chip mt-2 ${
              student.level
                ? "bg-emerald-50 text-emerald-700"
                : "bg-ink-100 text-ink-500"
            }`}
          >
            Уровень: {student.level ?? "не задан"}
          </span>
        </div>
        <StudentProfile
          student={{
            id: student.id,
            login: student.login,
            email: student.email ?? "",
            firstName: student.firstName,
            lastName: student.lastName,
            role: "STUDENT",
            level: student.level ?? "",
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Уроков" value={student.assignments.length} />
        <Stat label="Слов" value={student._count.words} />
        <Stat
          label="Автопроверка"
          value={`${correct}/${autoAnswers.length}`}
        />
        <Stat label="Тестов пройдено" value={student._count.testResults} />
      </div>

      <section className="card p-5">
        <h2 className="mb-3 text-[15px] font-semibold text-ink-900">
          Назначить урок
        </h2>
        <AssignLesson userId={student.id} lessons={available} />
      </section>

      <section className="card p-5">
        <h2 className="mb-1 text-[15px] font-semibold text-ink-900">
          Выдать тест
        </h2>
        <p className="mb-3 text-[13px] text-ink-500">
          Тест появится у ученика во вкладке «Тесты» независимо от уроков и
          уровня.
        </p>
        <AssignTest
          userId={student.id}
          tests={availableTests.map((test) => ({
            id: test.id,
            title: test.title,
            level: test.level,
            lesson: test.lesson ? `урок №${test.lesson.number}` : "",
            questions: test._count.questions,
          }))}
        />
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">ОГЭ</h2>
            <p className="text-[13px] text-ink-500">
              {student.ogeAccess
                ? "Вкладка «ОГЭ» открыта: ученик решает варианты и смотрит разбор."
                : "Вкладка «ОГЭ» у ученика скрыта."}
            </p>
          </div>
          <OgeAccessForm userId={student.id} access={student.ogeAccess} />
        </div>

        {OGE_VARIANTS.map((variant) => {
          const attempt =
            student.ogeAttempts.find((item) => item.variant === variant.id) ?? null;
          const summary = summarize(variant, attempt);

          return (
            <div
              key={variant.id}
              className="flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3"
            >
              <span className="text-[14px] font-medium text-ink-900">
                {variant.title}
              </span>
              <span className={`chip ${STATUS_STYLE[summary.status]}`}>
                {STATUS_LABEL[summary.status]}
              </span>
              {summary.status === "checked" ? (
                <span className="chip bg-emerald-50 text-emerald-700">
                  {summary.total} из {TOTAL_MAX} · отметка {summary.mark}
                </span>
              ) : null}
              {attempt ? (
                <Link
                  href={`/oge/${variant.id}?student=${student.id}`}
                  prefetch
                  className={
                    summary.status === "submitted"
                      ? "btn-primary btn-sm ml-auto"
                      : "btn-ghost btn-sm ml-auto"
                  }
                >
                  {summary.status === "submitted" ? "Проверить работу" : "Открыть работу"}
                </Link>
              ) : null}
            </div>
          );
        })}
      </section>

      {assignedTests.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-[15px] font-semibold text-ink-900">
            Выданные тесты ({assignedTests.length})
          </h2>

          <div className="space-y-2">
            {assignedTests.map(({ test }) => {
              const last = test.attempts[0];

              return (
                <div
                  key={test.id}
                  className="card flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-ink-900">
                      {test.title}
                    </p>
                    <p className="text-[13px] text-ink-500">
                      {test._count.questions} вопросов
                      {test.lesson ? ` · урок №${test.lesson.number}` : ""}
                      {last && last.total > 0
                        ? ` · результат ${Math.round((last.score / last.total) * 100)}%`
                        : " · ещё не пройден"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/tests/${test.id}`}
                      prefetch
                      className="btn-ghost btn-sm"
                    >
                      Открыть
                    </Link>
                    <form action={unassignTestAction}>
                      <input type="hidden" name="userId" value={student.id} />
                      <input type="hidden" name="testId" value={test.id} />
                      <ConfirmSubmit
                        title="Убрать тест у ученика?"
                        message={`«${test.title}» пропадёт из его списка. Уже пройденные попытки сохранятся.`}
                        confirmLabel="Убрать"
                      >
                        Убрать
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold text-ink-900">
          Домашние задания ({homeworkRows.length})
        </h2>

        {homeworkRows.length === 0 ? (
          <div className="card p-6 text-center text-[14px] text-ink-500">
            У выданных уроков пока нет домашних заданий.
          </div>
        ) : (
          <div className="card divide-y divide-ink-100">
            {homeworkRows.map((item) => {
              const status = item.submittedAt
                ? {
                    label: `✓ сдано ${item.submittedAt.toLocaleDateString("ru-RU")}`,
                    style: "bg-emerald-50 text-emerald-700",
                  }
                : item.done > 0
                  ? { label: "в процессе", style: "bg-amber-50 text-amber-700" }
                  : { label: "не начато", style: "bg-ink-100 text-ink-600" };

              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip bg-brand-50 text-brand-700">
                        Урок №{item.lesson.number}
                      </span>
                      <span className={`chip ${status.style}`}>{status.label}</span>
                      {item.waiting > 0 ? (
                        <span className="chip bg-amber-50 text-amber-700">
                          ждёт проверки: {item.waiting}
                        </span>
                      ) : null}
                      {item.dueDate && !item.submittedAt ? (
                        <span className="text-[12.5px] text-ink-400">
                          срок до {item.dueDate.toLocaleDateString("ru-RU")}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[14.5px] font-medium text-ink-900">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-ink-500">
                      Выполнено {item.done} из {item.total} · верно {item.correct}
                    </p>
                  </div>

                  <Link
                    href={`/homework/${item.id}?student=${student.id}`}
                    prefetch
                    className="btn-ghost btn-sm"
                  >
                    ДЗ с ответами
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold text-ink-900">
          Уроки ученика ({student.assignments.length})
        </h2>

        {student.assignments.length === 0 ? (
          <div className="card p-6 text-center text-[14px] text-ink-500">
            Ученику пока не назначено ни одного урока.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {student.assignments.map(({ lesson, completedAt }) => (
              <div key={lesson.id} className="card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip bg-brand-50 text-brand-700">
                    №{lesson.number}
                  </span>
                  <span className="chip bg-emerald-50 text-emerald-700">
                    {lesson.level}
                  </span>
                  {completedAt ? (
                    <span className="chip bg-emerald-50 text-emerald-700">
                      ✓ пройден {completedAt.toLocaleDateString("ru-RU")}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-[15px] font-medium text-ink-900">
                  {lesson.topic}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Открываем в режиме проверки: с ответами этого ученика */}
                  <Link
                    href={`/lessons/${lesson.id}?student=${student.id}`}
                    prefetch
                    className="btn-ghost btn-sm"
                  >
                    Урок с ответами
                  </Link>
                  {lesson.homework ? (
                    <Link
                      href={`/homework/${lesson.homework.id}?student=${student.id}`}
                      prefetch
                      className="btn-ghost btn-sm"
                    >
                      ДЗ с ответами
                    </Link>
                  ) : null}
                  {lesson.tests.map((test) => (
                    <Link
                      key={test.id}
                      href={`/tests/${test.id}`}
                      prefetch
                      className="btn-ghost btn-sm"
                    >
                      Тест
                    </Link>
                  ))}
                  <form action={setLessonCompletionAction}>
                    <input type="hidden" name="userId" value={student.id} />
                    <input type="hidden" name="lessonId" value={lesson.id} />
                    <input
                      type="hidden"
                      name="done"
                      value={completedAt ? "0" : "1"}
                    />
                    <SubmitButton
                      pendingLabel="…"
                      className={
                        completedAt ? "btn-ghost btn-sm" : "btn-primary btn-sm"
                      }
                    >
                      {completedAt ? "Снять отметку" : "Отметить пройденным"}
                    </SubmitButton>
                  </form>

                  <form action={unassignLessonAction}>
                    <input type="hidden" name="userId" value={student.id} />
                    <input type="hidden" name="lessonId" value={lesson.id} />
                    <ConfirmSubmit
                      title="Снять урок с ученика?"
                      message={`Урок №${lesson.number} «${lesson.topic}» пропадёт у ученика. Слова урока останутся в его словаре.`}
                      confirmLabel="Убрать"
                    >
                      Убрать
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[13px] text-ink-400">
          Тесты создаются во вкладке «Тесты» — там же их можно привязать к уроку.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold text-ink-900">
          Ответы на проверку ({teacherAnswers.length})
        </h2>

        {teacherAnswers.length === 0 ? (
          <div className="card p-6 text-center text-[14px] text-ink-500">
            Развёрнутых ответов пока нет.
          </div>
        ) : (
          teacherAnswers.map((answer) => (
            <div key={answer.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-brand-50 text-brand-700">
                  Урок №{answer.task.homework.lesson.number}
                </span>
                <span className="chip bg-ink-100 text-ink-600">
                  {answer.task.section}
                </span>
                {answer.grade != null ? (
                  <span className="chip bg-emerald-50 text-emerald-700">
                    Оценка: {answer.grade}
                  </span>
                ) : (
                  <span className="chip bg-amber-50 text-amber-700">
                    Ждёт проверки
                  </span>
                )}
                <span className="text-[12.5px] text-ink-400">
                  {answer.answeredAt.toLocaleString("ru-RU")}
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-[14px] text-ink-600">
                {answer.task.prompt}
              </p>

              <div className="mt-3 whitespace-pre-wrap rounded-xl bg-ink-50 px-4 py-3 text-[14.5px] leading-relaxed text-ink-800">
                {answer.value}
              </div>

              <GradeForm
                answerId={answer.id}
                grade={answer.grade}
                comment={answer.comment}
              />
            </div>
          ))
        )}
      </section>

      {autoAnswers.length > 0 ? (
        <section className="card overflow-hidden">
          <h2 className="border-b border-ink-200 p-4 text-[15px] font-semibold text-ink-900">
            Задания с автопроверкой ({correct} из {autoAnswers.length} верно)
          </h2>
          <ul className="max-h-96 divide-y divide-ink-100 overflow-y-auto">
            {autoAnswers.map((answer) => (
              <li key={answer.id} className="flex gap-3 px-4 py-2.5">
                <span
                  className={
                    answer.isCorrect ? "text-emerald-600" : "text-rose-500"
                  }
                >
                  {answer.isCorrect ? "✓" : "✕"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] text-ink-700">
                    {answer.task.prompt}
                  </p>
                  <p className="text-[12.5px] text-ink-500">
                    Ответ: {answer.value}
                    {answer.isCorrect
                      ? ""
                      : ` · верно: ${answer.task.answer}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-4">
      <p className="text-[13px] text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}

