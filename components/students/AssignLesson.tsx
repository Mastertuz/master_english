"use client";

import { assignLessonAction } from "@/app/actions/lessons";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function AssignLesson({
  userId,
  lessons,
}: {
  userId: string;
  lessons: { id: string; number: number; topic: string; level: string }[];
}) {
  if (lessons.length === 0) {
    return (
      <p className="text-[13.5px] text-ink-400">
        Все уроки библиотеки уже назначены этому ученику.
      </p>
    );
  }

  return (
    <form action={assignLessonAction} className="flex flex-col gap-2 sm:flex-row">
      <input type="hidden" name="userId" value={userId} />
      <select name="lessonId" className="field flex-1" required>
        {lessons.map((lesson) => (
          <option key={lesson.id} value={lesson.id}>
            №{lesson.number} · {lesson.level} · {lesson.topic}
          </option>
        ))}
      </select>
      <SubmitButton pendingLabel="Назначаем…" className="btn-primary sm:w-44">
        Назначить урок
      </SubmitButton>
    </form>
  );
}
