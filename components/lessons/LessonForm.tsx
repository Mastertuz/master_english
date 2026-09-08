"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import {
  createLessonAction,
  deleteLessonAction,
  updateLessonAction,
  type LessonState,
} from "@/app/actions/lessons";
import { Alert } from "@/components/ui/Field";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { LEVELS, LEVEL_LABELS } from "@/lib/lesson-content";

type LessonDraft = {
  id: string;
  number: number;
  topic: string;
  description: string;
  goal: string;
  level: string;
  bookTitle: string;
  bookRef: string;
  durationMin: number;
};

export function LessonForm({
  lesson,
  nextNumber,
  books = [],
  compact = false,
}: {
  lesson?: LessonDraft;
  nextNumber?: number;
  /** Файлы из папки books в корне проекта — подсказка для поля «Учебник» */
  books?: string[];
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const editing = Boolean(lesson);

  const [state, action] = useActionState<LessonState, FormData>(
    editing ? updateLessonAction : createLessonAction,
    null,
  );

  // Урок создан пустым — сразу открываем конструктор, чтобы наполнить его
  useEffect(() => {
    if (!editing && state?.ok && state.lessonId) {
      router.push(`/lessons/${state.lessonId}/edit`);
    }
  }, [editing, state, router]);

  if (!open) {
    return editing ? (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-ghost btn-sm"
        >
          ✏️ Редактировать
        </button>
        <form action={deleteLessonAction}>
          <input type="hidden" name="id" value={lesson!.id} />
          <ConfirmSubmit
            title="Удалить урок?"
            message={`Урок №${lesson!.number} «${lesson!.topic}» удалится вместе со словами, домашним заданием и тестами урока.`}
            confirmLabel="Удалить урок"
          >
            Удалить урок
          </ConfirmSubmit>
        </form>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={compact ? "btn-ghost btn-sm" : "btn-primary"}
      >
        + Новый урок
      </button>
    );
  }

  return (
    <form action={action} className="card w-full space-y-4 p-5" noValidate>
      {editing ? <input type="hidden" name="id" value={lesson!.id} /> : null}

      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink-900">
          {editing ? "Редактирование урока" : "Новый урок"}
        </h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="cursor-pointer text-ink-400 hover:text-ink-700"
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[110px_1fr_140px]">
        {editing ? null : (
          <div>
            <label className="label" htmlFor="number">
              Номер
            </label>
            <input
              id="number"
              name="number"
              inputMode="numeric"
              defaultValue={String(nextNumber ?? "")}
              className={`field ${state?.errors?.number ? "field-error" : ""}`}
            />
            {state?.errors?.number ? (
              <p className="hint">{state.errors.number}</p>
            ) : null}
          </div>
        )}

        <div>
          <label className="label" htmlFor="topic">
            Тема урока
          </label>
          <input
            id="topic"
            name="topic"
            defaultValue={lesson?.topic}
            placeholder="Airport & first arrival"
            className={`field ${state?.errors?.topic ? "field-error" : ""}`}
          />
          {state?.errors?.topic ? (
            <p className="hint">{state.errors.topic}</p>
          ) : null}
        </div>

        <div>
          <label className="label" htmlFor="level">
            Уровень
          </label>
          <select
            id="level"
            name="level"
            defaultValue={lesson?.level ?? "A2"}
            className="field"
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          Краткое описание
        </label>
        <input
          id="description"
          name="description"
          defaultValue={lesson?.description}
          placeholder="Первое прибытие: аэропорт, документы, объявления"
          className="field"
        />
      </div>

      <div>
        <label className="label" htmlFor="goal">
          Цель урока
        </label>
        <input
          id="goal"
          name="goal"
          defaultValue={lesson?.goal}
          placeholder="Уверенно спросить дорогу и понять простое объявление"
          className="field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
        <div>
          <label className="label" htmlFor="bookTitle">
            Учебник
          </label>
          <input
            id="bookTitle"
            name="bookTitle"
            defaultValue={lesson?.bookTitle}
            placeholder="Open World Key (A2), Cambridge"
            list="books-list"
            className="field"
          />
          <datalist id="books-list">
            {books.map((book) => (
              <option key={book} value={book} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label" htmlFor="bookRef">
            Место в учебнике
          </label>
          <input
            id="bookRef"
            name="bookRef"
            defaultValue={lesson?.bookRef}
            placeholder="Unit 1, аудио Track 002"
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor="durationMin">
            Минут
          </label>
          <input
            id="durationMin"
            name="durationMin"
            inputMode="numeric"
            defaultValue={String(lesson?.durationMin ?? 60)}
            className="field"
          />
        </div>
      </div>

      <p className="text-[12.5px] text-ink-400">
        {editing
          ? "Материал урока, слова и домашнее задание правятся в конструкторе — кнопка «Конструктор урока» на странице урока."
          : "После создания откроется конструктор: блоки, слова и домашнее задание собираются из готовых шаблонов."}
      </p>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-ghost"
        >
          Отмена
        </button>
        {editing ? (
          <ConfirmSubmit
            className="btn-primary"
            pendingLabel="Сохраняем…"
            title="Сохранить изменения?"
            message={`Урок №${lesson!.number} «${lesson!.topic}» будет перезаписан.`}
            confirmLabel="Сохранить"
            danger={false}
          >
            Сохранить
          </ConfirmSubmit>
        ) : (
          <SubmitButton pendingLabel="Создаём…" className="btn-primary">
            Создать урок
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
