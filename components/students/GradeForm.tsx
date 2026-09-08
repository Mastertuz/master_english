"use client";

import { useActionState } from "react";
import { gradeAnswerAction, type LessonState } from "@/app/actions/lessons";
import { Alert } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function GradeForm({
  answerId,
  grade,
  comment,
  withGrade = true,
}: {
  answerId: string;
  grade: number | null;
  comment: string | null;
  /** У заданий с автопроверкой оценка не нужна — только комментарий */
  withGrade?: boolean;
}) {
  const [state, action] = useActionState<LessonState, FormData>(
    gradeAnswerAction,
    null,
  );

  return (
    <form action={action} className="mt-3 space-y-2" noValidate>
      <input type="hidden" name="answerId" value={answerId} />

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div
        className={`grid gap-2 sm:items-end ${
          withGrade ? "sm:grid-cols-[90px_1fr_auto]" : "sm:grid-cols-[1fr_auto]"
        }`}
      >
        {withGrade ? (
          <div>
            <label className="label" htmlFor={`grade-${answerId}`}>
              Оценка
            </label>
            <input
              id={`grade-${answerId}`}
              name="grade"
              inputMode="numeric"
              defaultValue={grade ?? ""}
              placeholder="1–5"
              className={`field ${state?.errors?.grade ? "field-error" : ""}`}
            />
          </div>
        ) : null}
        <div>
          <label className="label" htmlFor={`comment-${answerId}`}>
            Комментарий
          </label>
          <input
            id={`comment-${answerId}`}
            name="comment"
            defaultValue={comment ?? ""}
            placeholder="Что поправить"
            className="field"
          />
        </div>
        <SubmitButton pendingLabel="…" className="btn-ghost">
          {withGrade ? "Оценить" : "Сохранить"}
        </SubmitButton>
      </div>
    </form>
  );
}
