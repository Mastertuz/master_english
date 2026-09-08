"use client";

import { useActionState } from "react";
import { generateTestAction, type TestState } from "@/app/actions/tests";
import { Alert } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function GenerateTestForm({
  lessons,
}: {
  lessons: { id: string; number: number; topic: string; words: number }[];
}) {
  const [state, action] = useActionState<TestState, FormData>(
    generateTestAction,
    null,
  );

  const ready = lessons.filter((lesson) => lesson.words >= 4);
  if (ready.length === 0) return null;

  return (
    <form action={action} className="card space-y-3 p-5" noValidate>
      <h2 className="text-[15px] font-semibold text-ink-900">
        Собрать тест автоматически
      </h2>
      <p className="text-[13.5px] text-ink-500">
        Возьмём слова урока и составим вопросы на перевод с вариантами ответа.
      </p>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <select name="lessonId" className="field flex-1" required>
          {ready.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              Урок {lesson.number} — {lesson.topic} ({lesson.words} слов)
            </option>
          ))}
        </select>
        <SubmitButton pendingLabel="Собираем…" className="btn-ghost sm:w-44">
          ⚡ Сгенерировать
        </SubmitButton>
      </div>
    </form>
  );
}
