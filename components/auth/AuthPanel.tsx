"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  loginAction,
  registerAction,
  type ActionState,
} from "@/app/actions/auth";
import { Alert, Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

type Tab = "login" | "register";

export function AuthPanel() {
  const [tab, setTab] = useState<Tab>("login");

  const [loginState, login] = useActionState<ActionState, FormData>(
    loginAction,
    null,
  );
  const [registerState, register] = useActionState<ActionState, FormData>(
    registerAction,
    null,
  );

  return (
    <div className="card rise w-full max-w-md p-6 sm:p-8">
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1">
        <TabButton
          active={tab === "login"}
          onClick={() => setTab("login")}
          label="Вход"
        />
        <TabButton
          active={tab === "register"}
          onClick={() => setTab("register")}
          label="Регистрация"
        />
      </div>

      {tab === "login" ? (
        <form action={login} className="space-y-4" noValidate>
          <h1 className="text-xl font-semibold text-ink-900">
            С возвращением
          </h1>
          <p className="-mt-2 text-[14px] text-ink-500">
            Войдите, чтобы продолжить обучение
          </p>

          {loginState && !loginState.ok && loginState.message ? (
            <Alert kind="error">{loginState.message}</Alert>
          ) : null}

          <Field
            label="Логин или почта"
            name="identifier"
            autoComplete="username"
            placeholder="ivan или ivan@mail.ru"
            error={loginState?.errors?.identifier}
          />
          <Field
            label="Пароль"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••"
            error={loginState?.errors?.password}
          />

          <SubmitButton pendingLabel="Входим…">Войти</SubmitButton>

          <p className="text-center text-[13.5px] text-ink-500">
            <Link
              href="/forgot"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Забыли пароль?
            </Link>
          </p>
        </form>
      ) : (
        <form action={register} className="space-y-4" noValidate>
          <h1 className="text-xl font-semibold text-ink-900">
            Создать аккаунт
          </h1>
          <p className="-mt-2 text-[14px] text-ink-500">
            Пара минут — и можно приступать к урокам
          </p>

          {registerState && !registerState.ok && registerState.message ? (
            <Alert kind="error">{registerState.message}</Alert>
          ) : null}

          <Field
            label="Логин"
            name="login"
            autoComplete="username"
            placeholder="ivan_petrov"
            error={registerState?.errors?.login}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Имя"
              name="firstName"
              autoComplete="given-name"
              placeholder="Иван"
              error={registerState?.errors?.firstName}
            />
            <Field
              label="Фамилия"
              name="lastName"
              autoComplete="family-name"
              placeholder="Петров"
              error={registerState?.errors?.lastName}
            />
          </div>

          <Field
            label="Почта"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ivan@mail.ru"
            error={registerState?.errors?.email}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Пароль"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              hint={`Минимум ${PASSWORD_MIN_LENGTH} символов`}
              error={registerState?.errors?.password}
            />
            <Field
              label="Повторите пароль"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              error={registerState?.errors?.passwordConfirm}
            />
          </div>

          <SubmitButton pendingLabel="Создаём…">
            Зарегистрироваться
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-[14px] font-medium transition ${
        active
          ? "bg-white text-ink-900 shadow-sm"
          : "text-ink-500 hover:text-ink-700"
      }`}
    >
      {label}
    </button>
  );
}
