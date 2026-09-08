import Link from "next/link";
import { notFound } from "next/navigation";
import { TestBuilder } from "@/components/tests/TestBuilder";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function TestEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();

  const [test, lessons] = await Promise.all([
    prisma.test.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        level: true,
        lessonId: true,
        questions: {
          orderBy: { order: "asc" },
          select: { text: true, options: true, correct: true },
        },
      },
    }),
    prisma.lesson.findMany({
      orderBy: { number: "asc" },
      select: { id: true, number: true, topic: true },
    }),
  ]);

  if (!test) notFound();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 text-[13.5px]">
        <Link
          href={`/tests/${test.id}`}
          prefetch
          className="text-ink-500 hover:text-ink-800"
        >
          ← К тесту
        </Link>
        <span className="text-ink-300">·</span>
        <Link href="/tests" prefetch className="text-ink-500 hover:text-ink-800">
          Все тесты
        </Link>
      </div>

      <TestBuilder
        lessons={lessons}
        test={{
          id: test.id,
          title: test.title,
          description: test.description,
          lessonId: test.lessonId ?? "",
          level: test.level ?? "",
          questions: test.questions.map((question) => ({
            text: question.text,
            options: question.options,
            correct: question.correct,
          })),
        }}
      />
    </div>
  );
}
