"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestResetAction, type ActionState } from "@/app/actions/auth";
import { Alert, Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ForgotForm() {
  const [state, action] = useActionState<ActionState, FormData>(
    requestResetAction,
    null,
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <h1 className="text-xl font-semibold text-ink-900">
        Восстановление пароля
      </h1>
      <p className="-mt-2 text-[14px] text-ink-500">
        Пришлём шестизначный код на вашу почту
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
        placeholder="ivan@mail.ru"
        error={state?.errors?.email}
      />

      <SubmitButton pendingLabel="Отправляем…">Отправить код</SubmitButton>

      <div className="flex items-center justify-between text-[13.5px]">
        <Link href="/" className="text-ink-500 hover:text-ink-700">
          ← Ко входу
        </Link>
        <Link
          href="/reset"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          У меня уже есть код
        </Link>
      </div>
    </form>
  );
}
