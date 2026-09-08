"use client";

import { useActionState } from "react";
import { adminUpdateUserAction, type AdminState } from "@/app/actions/admin";
import { Alert, Field } from "@/components/ui/Field";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { LEVELS, LEVEL_LABELS } from "@/lib/lesson-content";

export function EditUserForm({
  user,
}: {
  user: {
    id: string;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "STUDENT";
    level: string;
  };
}) {
  const [state, action] = useActionState<AdminState, FormData>(
    adminUpdateUserAction,
    null,
  );

  return (
    <form
      action={action}
      className="card space-y-4 p-5"
      autoComplete="off"
      noValidate
    >
      <input type="hidden" name="id" value={user.id} />

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Логин"
          name="login"
          autoComplete="off"
          defaultValue={user.login}
          error={state?.errors?.login}
        />
        <Field
          label="Почта"
          name="email"
          autoComplete="off"
          required={false}
          hint="Необязательно. Без неё не будет писем и восстановления пароля"
          type="email"
          defaultValue={user.email}
          error={state?.errors?.email}
        />
        <Field
          label="Имя"
          name="firstName"
          autoComplete="off"
          defaultValue={user.firstName}
          error={state?.errors?.firstName}
        />
        <Field
          label="Фамилия"
          name="lastName"
          autoComplete="off"
          required={false}
          defaultValue={user.lastName}
          error={state?.errors?.lastName}
        />
        <Field
          label="Новый пароль"
          name="password"
          autoComplete="new-password"
          type="password"
          required={false}
          hint="Оставьте пустым, чтобы не менять"
          error={state?.errors?.password}
        />
        <div>
          <label className="label" htmlFor="role">
            Роль
          </label>
          <select
            id="role"
            name="role"
            className="field"
            defaultValue={user.role}
          >
            <option value="STUDENT">Ученик</option>
            <option value="ADMIN">Администратор</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="level">
            Уровень английского
          </label>
          <select
            id="level"
            name="level"
            className="field"
            defaultValue={user.level ?? ""}
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

      <div className="flex justify-end">
        <ConfirmSubmit
          className="btn-primary"
          pendingLabel="Сохраняем…"
          title="Сохранить изменения?"
          message="Данные пользователя будут перезаписаны."
          confirmLabel="Сохранить"
          danger={false}
        >
          Сохранить изменения
        </ConfirmSubmit>
      </div>
    </form>
  );
}
