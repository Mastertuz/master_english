import { notFound } from "next/navigation";
import { LessonBuilder } from "@/components/lessons/builder/LessonBuilder";
import { asBlocks, asTimeline } from "@/lib/lesson-content";
import type { HomeworkTaskDraft } from "@/lib/lesson-templates";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      topic: true,
      blocks: true,
      timeline: true,
      words: {
        orderBy: { order: "asc" },
        select: { english: true, russian: true },
      },
      homework: {
        select: {
          title: true,
          intro: true,
          tasks: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              section: true,
              kind: true,
              prompt: true,
              text: true,
              audioUrl: true,
              transcript: true,
              options: true,
              answer: true,
              explanation: true,
              rule: true,
              hidden: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  return (
    <LessonBuilder
      lessonId={lesson.id}
      lessonNumber={lesson.number}
      lessonTopic={lesson.topic}
      initialBlocks={asBlocks(lesson.blocks)}
      initialTimeline={asTimeline(lesson.timeline)}
      initialWords={lesson.words.map((word) => ({
        english: word.english,
        russian: word.russian,
      }))}
      initialHomework={{
        title: lesson.homework?.title ?? "",
        intro: lesson.homework?.intro ?? "",
        tasks: (lesson.homework?.tasks ?? []) as HomeworkTaskDraft[],
      }}
    />
  );
}
