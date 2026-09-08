import Link from "next/link";
import { notFound } from "next/navigation";
import { TestRunner } from "@/components/tests/TestRunner";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { testAccessWhere } from "@/lib/test-access";

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  // Условие доступа встроено в запрос — список тестов отбирает их так же
  const test = await prisma.test.findFirst({
    where: { id, ...testAccessWhere(user) },
    include: {
      lesson: { select: { id: true, number: true, topic: true } },
      questions: {
        orderBy: { order: "asc" },
        select: { id: true, text: true, options: true, explanation: true },
      },
    },
  });

  if (!test) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap gap-2">
        {test.lesson ? (
          <Link
            href={`/lessons/${test.lesson.id}`}
            prefetch
            className="btn-ghost btn-sm"
          >
            ← Вернуться в урок №{test.lesson.number}
          </Link>
        ) : null}
        <Link href="/tests" prefetch className="btn-ghost btn-sm">
          Все тесты
        </Link>
      </div>

      <div>
        {test.lesson ? (
          <Link
            href={`/lessons/${test.lesson.id}`}
            className="chip bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            Урок №{test.lesson.number} — {test.lesson.topic}
          </Link>
        ) : null}
        <h1 className="page-title mt-2">{test.title}</h1>
        {test.description ? (
          <p className="mt-1.5 text-[14.5px] text-ink-500">
            {test.description}
          </p>
        ) : null}
      </div>

      {test.questions.length === 0 ? (
        <div className="card p-8 text-center text-[14px] text-ink-500">
          В тесте нет вопросов.
        </div>
      ) : (
        <TestRunner testId={test.id} questions={test.questions} />
      )}
    </div>
  );
}
