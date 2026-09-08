"use client";

import { assignTestAction } from "@/app/actions/tests";
import { SubmitButton } from "@/components/ui/SubmitButton";

export type AssignableTest = {
  id: string;
  title: string;
  level: string | null;
  lesson: string;
  questions: number;
};

/** Выдача теста ученику отдельно от урока */
export function AssignTest({
  userId,
  tests,
}: {
  userId: string;
  tests: AssignableTest[];
}) {
  if (tests.length === 0) {
    return (
      <p className="text-[13.5px] text-ink-400">
        Все тесты уже выданы этому ученику.
      </p>
    );
  }

  return (
    <form
      action={assignTestAction}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input type="hidden" name="userId" value={userId} />
      <select name="testId" className="field flex-1" required>
        {tests.map((test) => (
          <option key={test.id} value={test.id}>
            {test.title}
            {test.level ? ` · ${test.level}` : ""}
            {test.lesson ? ` · ${test.lesson}` : ""} · {test.questions} вопр.
          </option>
        ))}
      </select>
      <SubmitButton pendingLabel="Выдаём…" className="btn-primary sm:w-44">
        Выдать тест
      </SubmitButton>
    </form>
  );
}
