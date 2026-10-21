import { notFound } from "next/navigation";
import { LessonBuilder } from "@/components/lessons/builder/LessonBuilder";
import { effectiveTasks, overridesFor, tasksFor } from "@/lib/homework-personal";
import { asBlocks, asTimeline } from "@/lib/lesson-content";
import type { HomeworkTaskDraft } from "@/lib/lesson-templates";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const TASK_SELECT = {
  id: true,
  order: true,
  forUserId: true,
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
} as const;

function draftOf(task: {
  id: string;
  section: string;
  kind: HomeworkTaskDraft["kind"];
  prompt: string;
  text: string;
  audioUrl: string;
  transcript: string;
  options: string[];
  answer: string;
  explanation: string;
  rule: string;
  hidden: boolean;
  forUserId?: string | null;
}): HomeworkTaskDraft {
  return {
    id: task.id,
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
    ...(task.forUserId ? { personal: true } : {}),
  };
}

export default async function LessonEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  /** ?student=<id> — править урок и ДЗ только для этого ученика */
  searchParams: Promise<{ student?: string }>;
}) {
  const { id } = await params;
  const { student: studentId } = await searchParams;
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
      homework: { select: { id: true, title: true, intro: true } },
    },
  });
  if (!lesson) notFound();

  // Ученики для переключателя «кому правим»: у кого урок назначен — первыми
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      assignments: { where: { lessonId: id }, select: { id: true } },
      lessonVersions: { where: { lessonId: id }, select: { id: true } },
    },
  });
  const options = students.map((item) => ({
    id: item.id,
    name: `${item.firstName} ${item.lastName}`.trim(),
    assigned: item.assignments.length > 0,
    personalized: item.lessonVersions.length > 0,
  }));

  const target = studentId ? options.find((item) => item.id === studentId) : null;
  if (studentId && !target) notFound();

  // Общее ДЗ — всегда без личных заданий учеников
  const commonTasks = lesson.homework
    ? await prisma.homeworkTask.findMany({
        where: { homeworkId: lesson.homework.id, forUserId: null },
        orderBy: { order: "asc" },
        select: TASK_SELECT,
      })
    : [];

  let blocks = asBlocks(lesson.blocks);
  let timeline = asTimeline(lesson.timeline);
  let tasks = commonTasks.map(draftOf);
  const personalStats = { hasVersion: false, overrides: 0, personalTasks: 0 };

  if (target && lesson.homework) {
    // Общие задания с личными правками ученика + его личные задания
    const mine = await prisma.homeworkTask.findMany({
      where: { homeworkId: lesson.homework.id, ...tasksFor(target.id) },
      select: { ...TASK_SELECT, overrides: overridesFor(target.id) },
    });
    tasks = effectiveTasks(mine).map(draftOf);
    personalStats.overrides = mine.filter((task) => task.overrides.length > 0).length;
    personalStats.personalTasks = mine.filter((task) => task.forUserId).length;
  }

  if (target) {
    const version = await prisma.lessonStudentVersion.findUnique({
      where: { lessonId_userId: { lessonId: lesson.id, userId: target.id } },
      select: { blocks: true, timeline: true },
    });
    if (version) {
      blocks = asBlocks(version.blocks);
      timeline = asTimeline(version.timeline ?? lesson.timeline);
      personalStats.hasVersion = true;
    }
  }

  return (
    <LessonBuilder
      // Другой «адресат» — другое состояние формы
      key={target?.id ?? "all"}
      lessonId={lesson.id}
      lessonNumber={lesson.number}
      lessonTopic={lesson.topic}
      initialBlocks={blocks}
      initialTimeline={timeline}
      initialWords={lesson.words.map((word) => ({
        english: word.english,
        russian: word.russian,
      }))}
      initialHomework={{
        title: lesson.homework?.title ?? "",
        intro: lesson.homework?.intro ?? "",
        tasks,
      }}
      students={options}
      student={target ? { ...target, ...personalStats } : null}
      baseTasks={target ? commonTasks.map(draftOf) : []}
      hasHomework={Boolean(lesson.homework)}
    />
  );
}
