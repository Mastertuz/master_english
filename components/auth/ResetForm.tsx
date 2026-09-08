"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "@/app/actions/auth";
import { Alert, Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

export function ResetForm({ email }: { email?: string }) {
  const [state, action] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    null,
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <h1 className="text-xl font-semibold text-ink-900">Новый пароль</h1>
      <p className="-mt-2 text-[14px] text-ink-500">
        Введите код из письма и придумайте новый пароль
      </p>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <Field
        label="Почта"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        defaultValue={email}
        placeholder="ivan@mail.ru"
        error={state?.errors?.email}
      />
      <Field
        label="Код из письма"
        name="code"
        inputMode="numeric"
        maxLength={6}
        placeholder="123456"
        autoComplete="one-time-code"
        error={state?.errors?.code}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Новый пароль"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••"
          hint={`Минимум ${PASSWORD_MIN_LENGTH} символов`}
          error={state?.errors?.password}
        />
        <Field
          label="Повторите пароль"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••"
          error={state?.errors?.passwordConfirm}
        />
      </div>

      <SubmitButton pendingLabel="Сохраняем…">Сменить пароль</SubmitButton>

      <div className="flex items-center justify-between text-[13.5px]">
        <Link href="/" className="text-ink-500 hover:text-ink-700">
          ← Ко входу
        </Link>
        <Link
          href="/forgot"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Запросить код заново
        </Link>
      </div>
    </form>
  );
}
