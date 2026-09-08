"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import {
  createTestAction,
  updateTestAction,
  type TestState,
} from "@/app/actions/tests";
import { Alert } from "@/components/ui/Field";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { LEVELS } from "@/lib/lesson-content";

type Draft = { text: string; options: string[]; correct: number };

const emptyQuestion = (): Draft => ({
  text: "",
  options: ["", "", "", ""],
  correct: 0,
});

/** Заготовки вопросов: берём и правим под свою тему */
const QUESTION_TEMPLATES: { label: string; build: () => Draft }[] = [
  {
    label: "Перевод слова",
    build: () => ({
      text: "Как переводится «refund»?",
      options: ["возврат денег", "скидка", "чек", "обмен"],
      correct: 0,
    }),
  },
  {
    label: "Выбор формы",
    build: () => ({
      text: "She ___ at the hotel right now.",
      options: ["stay", "stays", "is staying", "stayed"],
      correct: 2,
    }),
  },
  {
    label: "Пропуск в предложении",
    build: () => ({
      text: "Show your ___ at the gate before boarding.",
      options: ["receipt", "boarding pass", "deposit", "size"],
      correct: 1,
    }),
  },
  {
    label: "Вопрос по смыслу",
    build: () => ({
      text: "Where do you get your suitcase after landing?",
      options: ["At the gate", "At baggage claim", "At the front desk"],
      correct: 1,
    }),
  },
];

export type TestDraft = {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  level: string;
  questions: Draft[];
};

export function TestBuilder({
  lessons,
  test,
}: {
  lessons: { id: string; number: number; topic: string }[];
  /** Передан — редактируем существующий тест, иначе создаём новый */
  test?: TestDraft;
}) {
  const editing = Boolean(test);
  const router = useRouter();
  const [open, setOpen] = useState(editing);
  const [questions, setQuestions] = useState<Draft[]>(
    test?.questions.length ? test.questions : [emptyQuestion()],
  );
  const [state, action] = useActionState<TestState, FormData>(
    editing ? updateTestAction : createTestAction,
    null,
  );

  useEffect(() => {
    // После создания сразу открываем готовый тест; при правке остаёмся здесь
    if (!editing && state?.ok && state.testId) {
      router.push(`/tests/${state.testId}`);
    }
  }, [editing, state, router]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary"
      >
        + Создать тест
      </button>
    );
  }

  function update(index: number, patch: Partial<Draft>) {
    setQuestions((prev) =>
      prev.map((question, i) => (i === index ? { ...question, ...patch } : question)),
    );
  }

  return (
    <form action={action} className="card w-full space-y-5 p-5" noValidate>
      {editing ? <input type="hidden" name="id" value={test!.id} /> : null}

      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink-900">
          {editing ? "Редактирование теста" : "Новый тест"}
        </h2>
        {editing ? null : (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer text-ink-400 hover:text-ink-700"
            aria-label="Закрыть"
          >
            ✕
          </button>
        )}
      </div>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="test-title">
            Название теста
          </label>
          <input
            id="test-title"
            name="title"
            defaultValue={test?.title ?? ""}
            placeholder="Проверка лексики урока 1"
            className={`field ${state?.errors?.title ? "field-error" : ""}`}
          />
          {state?.errors?.title ? (
            <p className="hint">{state.errors.title}</p>
          ) : null}
        </div>
        <div>
          <label className="label" htmlFor="test-lesson">
            Урок (необязательно)
          </label>
          <select
            id="test-lesson"
            name="lessonId"
            defaultValue={test?.lessonId ?? ""}
            className="field"
          >
            <option value="">Без урока</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                Урок {lesson.number} — {lesson.topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
        <div>
          <label className="label" htmlFor="test-description">
            Описание
          </label>
          <input
            id="test-description"
            name="description"
            defaultValue={test?.description ?? ""}
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor="test-level">
            Уровень
          </label>
          <select
            id="test-level"
            name="level"
            defaultValue={test?.level ?? ""}
            className="field"
          >
            <option value="">Любой</option>
            {LEVELS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="label">Добавить вопрос из шаблона</p>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TEMPLATES.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() =>
                setQuestions((prev) => [...prev, template.build()])
              }
              className="cursor-pointer rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[13px] font-medium text-ink-600 transition hover:border-brand-400 hover:text-brand-700"
            >
              + {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="rounded-xl border border-ink-200 bg-ink-50/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13.5px] font-medium text-ink-600">
                Вопрос {index + 1}
              </p>
              {questions.length > 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setQuestions((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="cursor-pointer text-[13px] text-rose-600 hover:text-rose-700"
                >
                  Удалить
                </button>
              ) : null}
            </div>

            <input
              value={question.text}
              onChange={(event) => update(index, { text: event.target.value })}
              placeholder="Текст вопроса"
              className="field mb-3 bg-white"
            />

            <div className="grid gap-2 sm:grid-cols-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2"
                >
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={question.correct === optionIndex}
                    onChange={() => update(index, { correct: optionIndex })}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <input
                    value={option}
                    onChange={(event) =>
                      update(index, {
                        options: question.options.map((value, i) =>
                          i === optionIndex ? event.target.value : value,
                        ),
                      })
                    }
                    placeholder={`Вариант ${optionIndex + 1}`}
                    className="w-full bg-transparent text-[14px] outline-none"
                  />
                </label>
              ))}
            </div>
            <p className="mt-2 text-[12.5px] text-ink-400">
              Отметьте кружком правильный вариант
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
        className="btn-ghost btn-sm"
      >
        + Добавить вопрос
      </button>

      <input
        type="hidden"
        name="questions"
        value={JSON.stringify(questions)}
      />

      <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
        {editing ? (
          <ConfirmSubmit
            className="btn-primary"
            pendingLabel="Сохраняем…"
            title="Сохранить тест?"
            message={`Вопросы теста «${test!.title}» будут перезаписаны (${questions.length} шт.). Результаты пройденных попыток сохранятся.`}
            confirmLabel="Сохранить"
            danger={false}
          >
            Сохранить тест
          </ConfirmSubmit>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-ghost"
            >
              Отмена
            </button>
            <SubmitButton pendingLabel="Создаём…" className="btn-primary">
              Создать тест
            </SubmitButton>
          </>
        )}
      </div>
    </form>
  );
}
