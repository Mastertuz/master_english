"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  updateProfileAction,
  type ActionState,
} from "@/app/actions/auth";
import { Alert, Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

export function ProfileForm({
  user,
}: {
  user: { firstName: string; lastName: string; email: string };
}) {
  const [state, action] = useActionState<ActionState, FormData>(
    updateProfileAction,
    null,
  );

  return (
    <form action={action} className="card space-y-4 p-5" noValidate>
      <h2 className="text-[15px] font-semibold text-ink-900">
        Личные данные
      </h2>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Имя"
          name="firstName"
          defaultValue={user.firstName}
          error={state?.errors?.firstName}
        />
        <Field
          label="Фамилия"
          name="lastName"
          defaultValue={user.lastName}
          error={state?.errors?.lastName}
        />
      </div>
      <Field
        label="Почта"
        name="email"
        type="email"
        defaultValue={user.email}
        error={state?.errors?.email}
      />

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Сохраняем…" className="btn-primary">
          Сохранить
        </SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(
    changePasswordAction,
    null,
  );

  return (
    <form action={action} className="card space-y-4 p-5" noValidate>
      <h2 className="text-[15px] font-semibold text-ink-900">Смена пароля</h2>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <Field
        label="Текущий пароль"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        error={state?.errors?.currentPassword}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Новый пароль"
          name="password"
          type="password"
          autoComplete="new-password"
          hint={`Минимум ${PASSWORD_MIN_LENGTH} символов`}
          error={state?.errors?.password}
        />
        <Field
          label="Повторите пароль"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          error={state?.errors?.passwordConfirm}
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Меняем…" className="btn-primary">
          Изменить пароль
        </SubmitButton>
      </div>
    </form>
  );
}
