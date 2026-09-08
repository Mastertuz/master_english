"use client";

import { useActionState, useState } from "react";
import { adminCreateUserAction, type AdminState } from "@/app/actions/admin";
import { Alert, Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { LEVELS, LEVEL_LABELS } from "@/lib/lesson-content";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

export function CreateUserForm({
  studentOnly = false,
}: {
  /** На странице «Ученики» роль не выбирают — создаём именно ученика */
  studentOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<AdminState, FormData>(
    adminCreateUserAction,
    null,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary"
      >
        {studentOnly ? "+ Новый ученик" : "+ Добавить аккаунт"}
      </button>
    );
  }

  return (
    <form
      action={action}
      className="card w-full space-y-4 p-5"
      autoComplete="off"
      noValidate
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink-900">
          {studentOnly ? "Новый ученик" : "Новый аккаунт"}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Логин"
          name="login"
          autoComplete="off"
          placeholder="ivan_petrov"
          error={state?.errors?.login}
        />
        <Field
          label="Почта"
          name="email"
          autoComplete="off"
          required={false}
          hint="Необязательно. Без неё не будет писем и восстановления пароля"
          type="email"
          placeholder="ivan@mail.ru"
          error={state?.errors?.email}
        />
        <Field
          label="Имя"
          name="firstName"
          autoComplete="off"
          placeholder="Иван"
          error={state?.errors?.firstName}
        />
        <Field
          label="Фамилия"
          name="lastName"
          autoComplete="off"
          required={false}
          placeholder="Петров"
          error={state?.errors?.lastName}
        />
        <Field
          label="Пароль"
          name="password"
          autoComplete="new-password"
          type="password"
          hint={`Минимум ${PASSWORD_MIN_LENGTH} символов`}
          error={state?.errors?.password}
        />
        {studentOnly ? (
          <input type="hidden" name="role" value="STUDENT" />
        ) : (
          <div>
            <label className="label" htmlFor="role">
              Роль
            </label>
            <select
              id="role"
              name="role"
              className="field"
              defaultValue="STUDENT"
            >
              <option value="STUDENT">Ученик</option>
              <option value="ADMIN">Администратор</option>
            </select>
          </div>
        )}

        <div>
          <label className="label" htmlFor="level">
            Уровень английского
          </label>
          <select
            id="level"
            name="level"
            className="field"
            defaultValue=""
          >
            <option value="">Не задан</option>
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-ghost"
        >
          Отмена
        </button>
        <SubmitButton pendingLabel="Создаём…" className="btn-primary">
          Создать
        </SubmitButton>
      </div>
    </form>
  );
}
