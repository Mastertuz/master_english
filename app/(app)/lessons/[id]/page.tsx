import Link from "next/link";
import { notFound } from "next/navigation";
import { trainLessonWordsAction } from "@/app/actions/lessons";
import { LessonBlocks } from "@/components/lessons/LessonBlocks";
import { LessonForm } from "@/components/lessons/LessonForm";
import { SeenOnView } from "@/components/notifications/SeenOnView";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { asBlocks, asTimeline } from "@/lib/lesson-content";
import { listBooks } from "@/lib/books";
import { partOfSpeechRu } from "@/lib/part-of-speech";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ student?: string }>;
}) {
  const { id } = await params;
  const { student: studentId } = await searchParams;
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      words: { orderBy: { order: "asc" } },
      tests: {
        select: {
          id: true,
          title: true,
          _count: { select: { questions: true } },
        },
      },
      homework: {
        select: { id: true, title: true, _count: { select: { tasks: true } } },
      },
      assignments: {
        where: { userId: user.id },
        select: { id: true, completedAt: true },
      },
    },
  });

  if (!lesson) notFound();
  if (!isAdmin && lesson.assignments.length === 0) notFound();

  const books = isAdmin ? await listBooks() : [];

  /**
   * Режим проверки: преподаватель открыл урок из карточки ученика. Тогда
   * показываем ответы ученика, а не свои, и даём их прокомментировать.
   */
  const student =
    isAdmin && studentId
      ? await prisma.user.findUnique({
          where: { id: studentId },
          select: { id: true, firstName: true, lastName: true },
        })
      : null;
  const readerId = student?.id ?? user.id;

  // Что ученик уже писал в заданиях урока — подставим в поля
  const previous = await prisma.lessonTaskAnswer.findMany({
    where: { lessonId: lesson.id, userId: readerId },
    select: {
      id: true,
      taskKey: true,
      value: true,
      isCorrect: true,
      saved: true,
      comment: true,
      commentSeenAt: true,
    },
  });
  const unseen = student
    ? 0
    : previous.filter((answer) => answer.comment && !answer.commentSeenAt).length;
  // Возвращаем только те ответы, которые ученик сохранил сам: остальное —
  // черновик, и урок начинается с чистого листа. Комментарии показываем всегда.
  const comments = Object.fromEntries(
    previous
      .filter((answer) => answer.comment)
      .map((answer) => [answer.taskKey, answer.comment]),
  );
  // Преподавателю в режиме проверки показываем всё, что ученик написал,
  // включая черновики: он их видел на экране, пока решал
  const answers = Object.fromEntries(
    previous
      .filter((answer) => answer.saved || student)
      .map((answer) => [
        answer.taskKey,
        { value: answer.value, isCorrect: answer.isCorrect },
      ]),
  );
  const answerIds = Object.fromEntries(
    previous.map((answer) => [answer.taskKey, answer.id]),
  );
  const studentName = student
    ? `${student.firstName} ${student.lastName}`.trim()
    : "";

  // Урок, отмеченный преподавателем как пройденный, можно открыть
  // с правильными ответами
  const completed = Boolean(lesson.assignments[0]?.completedAt);
  // Образцы развёрнутых ответов ученику не отдаём вовсе: LessonBlocks —
  // клиентский компонент, и всё, что мы ему передали, видно в исходниках
  // страницы, даже если на экране оно не нарисовано
  const blocks = asBlocks(lesson.blocks).map((block) =>
    isAdmin ? block : { ...block, sample: "" },
  );
  const timeline = asTimeline(lesson.timeline);

  return (
    <div className="space-y-6">
      <Link
        href="/lessons"
        prefetch
        className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800"
      >
        ← Все уроки
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-brand-50 text-brand-700">
              Урок №{lesson.number}
            </span>
            <span className="chip bg-emerald-50 text-emerald-700">
              {lesson.level}
            </span>
            <span className="chip bg-ink-100 text-ink-600">
              ⏱ {lesson.durationMin} мин
            </span>
          </div>

          <h1 className="page-title mt-2">{lesson.topic}</h1>

          {lesson.goal ? (
            <p className="mt-1.5 max-w-2xl text-[15px] text-ink-600">
              <span className="font-medium text-ink-700">Цель:</span>{" "}
              {lesson.goal}
            </p>
          ) : null}

          {lesson.bookTitle ? (
            <p className="mt-2 text-[13.5px] text-ink-500">
              📖 Урок собран по учебнику{" "}
              <span className="font-medium text-ink-700">
                {lesson.bookTitle}
              </span>
              {lesson.bookRef ? ` · ${lesson.bookRef}` : ""}
            </p>
          ) : null}
        </div>

        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/lessons/${lesson.id}/edit`}
              prefetch
              className="btn-primary btn-sm"
            >
              🧩 Конструктор урока
            </Link>
            <LessonForm
              lesson={{
                id: lesson.id,
                number: lesson.number,
                topic: lesson.topic,
                description: lesson.description,
                goal: lesson.goal,
                level: lesson.level,
                bookTitle: lesson.bookTitle,
                bookRef: lesson.bookRef,
                durationMin: lesson.durationMin,
              }}
              books={books}
            />
          </div>
        ) : null}
      </div>

      {timeline.length > 0 ? (
        <section className="card p-5">
          <h2 className="mb-3 text-[15px] font-semibold text-ink-900">
            План занятия
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {timeline.map((slot, index) => (
              <div
                key={index}
                className="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5"
              >
                <p className="text-[12.5px] font-medium text-brand-600">
                  {slot.time} мин
                </p>
                <p className="text-[14.5px] font-medium text-ink-900">
                  {slot.title}
                </p>
                {slot.note ? (
                  <p className="text-[13px] text-ink-500">{slot.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.homework ? (
        <Link
          href={`/homework/${lesson.homework.id}`}
          prefetch
          className="card flex items-center justify-between gap-4 p-5 transition hover:border-amber-300"
        >
          <div>
            <span className="chip bg-amber-50 text-amber-700">
              Домашнее задание
            </span>
            <p className="mt-2 text-[15px] font-semibold text-ink-900">
              {lesson.homework.title}
            </p>
            <p className="text-[13.5px] text-ink-500">
              Заданий: {lesson.homework._count.tasks}
            </p>
          </div>
          <span className="text-ink-400">→</span>
        </Link>
      ) : null}

      {student ? (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-amber-200 bg-amber-50/70 p-4">
          <p className="text-[14px] text-amber-900">
            Урок с ответами ученика: <b>{studentName}</b>. Под заданиями можно
            оставить комментарий.
          </p>
          <Link href={`/students/${student.id}`} className="btn-ghost btn-sm">
            ← К карточке ученика
          </Link>
        </div>
      ) : null}

      <SeenOnView lessonId={lesson.id} unseen={unseen} />
      <LessonBlocks
        blocks={blocks}
        lessonId={lesson.id}
        answers={answers}
        comments={comments}
        completed={completed}
        // При проверке работы скрытые блоки не показываем: ученик их не
        // видел, и проверять в них нечего
        canSeeHidden={isAdmin && !student}
        isTeacher={isAdmin}
        review={student ? answerIds : undefined}
      />

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-200 p-4">
          <h2 className="text-[15px] font-semibold text-ink-900">
            Слова урока ({lesson.words.length})
          </h2>
          <form action={trainLessonWordsAction}>
            <input type="hidden" name="lessonId" value={lesson.id} />
            <SubmitButton pendingLabel="Готовим…" className="btn-ghost btn-sm">
              🎯 Тренировать
            </SubmitButton>
          </form>
        </div>

        {lesson.words.length === 0 ? (
          <p className="p-6 text-center text-[14px] text-ink-500">
            К уроку не привязано ни одного слова.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {lesson.words.map((word) => (
              <li key={word.id} className="flex items-start gap-3 px-4 py-3">
                <SpeakButton text={word.english} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-ink-900">
                    {word.english}
                    {word.transcription ? (
                      <span className="ml-2 text-[13px] font-normal text-ink-400">
                        {word.transcription}
                      </span>
                    ) : null}
                    {word.partOfSpeech ? (
                      <span className="ml-2 rounded bg-ink-100 px-1.5 py-0.5 text-[11.5px] font-normal text-ink-500">
                        {partOfSpeechRu(word.partOfSpeech)}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-[14px] text-ink-600">{word.russian}</p>
                  {word.definition ? (
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">
                      {word.definition}
                    </p>
                  ) : null}
                  {word.example ? (
                    <p className="mt-1 text-[13.5px] italic text-ink-500">
                      {word.example}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lesson.tests.length > 0 ? (
        <section className="card p-5">
          <h2 className="mb-3 text-[15px] font-semibold text-ink-900">
            Тесты по уроку
          </h2>
          <ul className="space-y-2">
            {lesson.tests.map((test) => (
              <li key={test.id}>
                <Link
                  href={`/tests/${test.id}`}
                  prefetch
                  className="flex items-center justify-between rounded-xl border border-ink-200 px-4 py-3 transition hover:border-brand-400 hover:bg-brand-50/40"
                >
                  <span className="text-[14.5px] font-medium text-ink-800">
                    {test.title}
                  </span>
                  <span className="text-[13px] text-ink-500">
                    {test._count.questions} вопросов →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
