"use client";

import { useActionState } from "react";
import {
  commentLessonAnswerAction,
  type CommentState,
} from "@/app/actions/lesson-answers";
import { SubmitButton } from "@/components/ui/SubmitButton";

/** Комментарий преподавателя к ответу ученика в уроке */
export function AnswerComment({
  answerId,
  comment,
}: {
  answerId: string;
  comment: string;
}) {
  const [state, action] = useActionState<CommentState, FormData>(
    commentLessonAnswerAction,
    null,
  );

  return (
    <form action={action} className="mt-2 flex flex-wrap items-end gap-2">
      <input type="hidden" name="answerId" value={answerId} />

      <div className="min-w-[220px] flex-1">
        <label className="label" htmlFor={`comment-${answerId}`}>
          Комментарий ученику
        </label>
        <input
          id={`comment-${answerId}`}
          name="comment"
          defaultValue={comment}
          placeholder="Что поправить или на что обратить внимание"
          className="field"
        />
      </div>

      <SubmitButton pendingLabel="…" className="btn-ghost">
        Сохранить
      </SubmitButton>

      {state?.message ? (
        <span
          className={`text-[13px] ${
            state.ok ? "text-emerald-700" : "text-rose-600"
          }`}
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
