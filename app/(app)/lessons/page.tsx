import { LessonForm } from "@/components/lessons/LessonForm";
import {
  LessonsList,
  type LessonCard,
} from "@/components/lessons/LessonsList";
import { listBooks } from "@/lib/books";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function LessonsPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const books = isAdmin ? await listBooks() : [];

  // Администратор видит всю библиотеку, ученик — только назначенные уроки
  const lessons = await prisma.lesson.findMany({
    where: isAdmin ? {} : { assignments: { some: { userId: user.id } } },
    orderBy: { number: "asc" },
    select: {
      id: true,
      number: true,
      topic: true,
      description: true,
      level: true,
      bookTitle: true,
      durationMin: true,
      homework: { select: { id: true } },
      _count: { select: { words: true, tests: true, assignments: true } },
    },
  });

  const nextNumber = (lessons.at(-1)?.number ?? 0) + 1;

  const cards: LessonCard[] = lessons.map((lesson) => ({
    id: lesson.id,
    number: lesson.number,
    topic: lesson.topic,
    description: lesson.description,
    level: lesson.level,
    bookTitle: lesson.bookTitle,
    durationMin: lesson.durationMin,
    hasHomework: Boolean(lesson.homework),
    words: lesson._count.words,
    tests: lesson._count.tests,
    assignments: lesson._count.assignments,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Уроки</h1>
          <p className="mt-1 text-[14.5px] text-ink-500">
            {isAdmin
              ? "Библиотека уроков. Назначайте их ученикам во вкладке «Ученики»."
              : "Ваши уроки: материал, слова и домашнее задание"}
          </p>
        </div>
        {isAdmin ? <LessonForm nextNumber={nextNumber} books={books} /> : null}
      </div>

      {cards.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl">📚</p>
          <p className="mt-4 text-[15px] text-ink-600">
            {isAdmin
              ? "Библиотека пуста. Создайте урок или импортируйте готовые."
              : "Вам пока не назначили ни одного урока."}
          </p>
        </div>
      ) : (
        <LessonsList lessons={cards} isAdmin={isAdmin} />
      )}
    </div>
  );
}
