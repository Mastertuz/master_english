import Link from "next/link";
import { notFound } from "next/navigation";
import { type Mode, type TrainingWord } from "@/components/training/Trainer";
import { TrainingSession } from "@/components/training/TrainingSession";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const SLUGS: Record<string, Mode> = {
  translate: "TRANSLATE",
  image: "IMAGE",
  definition: "DEFINITION",
};

export default async function TrainingModePage({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>;
  /** ?lesson=<id> — прийти из урока с уже отмеченными словами */
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { mode: slug } = await params;
  const mode = SLUGS[slug];
  if (!mode) notFound();

  const { lesson: lessonId } = await searchParams;
  const user = await requireUser();

  const where =
    mode === "IMAGE"
      ? { userId: user.id, NOT: { imageUrl: "" } }
      : mode === "DEFINITION"
        ? {
            userId: user.id,
            OR: [{ NOT: { definition: "" } }, { NOT: { definitionRu: "" } }],
          }
        : { userId: user.id };

  // Берём весь подходящий словарь — нужный набор пользователь отмечает сам
  const words = await prisma.word.findMany({
    where,
    take: 500,
    orderBy: [{ lastTrainedAt: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      english: true,
      russian: true,
      example: true,
      definition: true,
      definitionRu: true,
      transcription: true,
      partOfSpeech: true,
      imageUrl: true,
      audioUrl: true,
    },
  });

  const lesson = lessonId ? await lessonWords(lessonId, user) : null;

  // Слова урока сопоставляем по написанию: копия в личном словаре может быть
  // не связана с уроком, если её добавили руками, а не при назначении
  const fromLesson = new Set(
    lesson?.words.map((word) => word.english.toLowerCase()) ?? [],
  );
  const preselectedIds = words
    .filter((word) => fromLesson.has(word.english.toLowerCase()))
    .map((word) => word.id);

  return (
    <div className="space-y-5">
      {/* Из урока даём оба пути назад: к самому уроку и ко всем режимам */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px]">
        {lesson ? (
          <>
            <Link
              href={`/lessons/${lessonId}`}
              prefetch
              className="text-ink-500 hover:text-ink-800"
            >
              ← К уроку «{lesson.topic}»
            </Link>
            <span className="text-ink-300">·</span>
          </>
        ) : null}
        <Link
          href="/training"
          prefetch
          className="text-ink-500 hover:text-ink-800"
        >
          {lesson ? "Все режимы тренировки" : "← Все режимы"}
        </Link>
      </div>
      <TrainingSession
        mode={mode}
        words={words as TrainingWord[]}
        preselectedIds={preselectedIds}
        lessonTopic={lesson?.topic ?? ""}
      />
    </div>
  );
}

/** Словарь урока — только если урок назначен ученику */
async function lessonWords(
  lessonId: string,
  user: { id: string; role: string },
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      topic: true,
      words: { select: { english: true } },
      assignments: { where: { userId: user.id }, select: { id: true } },
    },
  });

  if (!lesson) return null;
  if (user.role !== "ADMIN" && lesson.assignments.length === 0) return null;

  return lesson;
}
