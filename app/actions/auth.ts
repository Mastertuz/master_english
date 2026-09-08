"use server";

import { randomInt } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { resetCodeEmail, sendMail } from "@/lib/mail";
import {
  createSession,
  destroySession,
  getCurrentUser,
} from "@/lib/session";
import {
  collect,
  validateEmail,
  validateIdentifier,
  validateLogin,
  validateName,
  validatePassword,
  validateResetCode,
  type FieldErrors,
} from "@/lib/validation";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: FieldErrors;
} | null;

const RESET_TTL_MINUTES = 15;

function fail(message: string, errors?: FieldErrors): ActionState {
  return { ok: false, message, errors };
}

/* ─────────────────────────── Вход ─────────────────────────── */

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors = collect({
    identifier: validateIdentifier(identifier),
    password: validatePassword(password),
  });
  if (errors) return fail("Проверьте заполнение полей", errors);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { login: identifier },
        { email: identifier.toLowerCase() },
      ],
    },
    select: { id: true, password: true },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    return fail("Неверный логин/почта или пароль");
  }

  await createSession(user.id);
  redirect("/dashboard");
}

/* ────────────────────────── Регистрация ────────────────────────── */

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const login = String(formData.get("login") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const errors = collect({
    login: validateLogin(login),
    email: validateEmail(email),
    firstName: validateName(firstName, "Имя"),
    lastName: validateName(lastName, "Фамилия"),
    password: validatePassword(password),
    passwordConfirm:
      password !== passwordConfirm ? "Пароли не совпадают" : null,
  });
  if (errors) return fail("Проверьте заполнение полей", errors);

  const existing = await prisma.user.findFirst({
    where: { OR: [{ login }, { email }] },
    select: { login: true, email: true },
  });

  if (existing) {
    return fail(
      "Такой аккаунт уже существует",
      existing.login === login
        ? { login: "Этот логин уже занят" }
        : { email: "Эта почта уже зарегистрирована" },
    );
  }

  // Самый первый аккаунт в системе становится администратором
  const isFirstUser = (await prisma.user.count()) === 0;

  const user = await prisma.user.create({
    data: {
      login,
      email,
      firstName,
      lastName,
      password: await hashPassword(password),
      role: isFirstUser ? "ADMIN" : "STUDENT",
    },
    select: { id: true },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

/* ──────────────────────────── Выход ──────────────────────────── */

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

/* ───────────────────── Восстановление пароля ───────────────────── */

export async function requestResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const errors = collect({ email: validateEmail(email) });
  if (errors) return fail("Проверьте адрес почты", errors);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, firstName: true, email: true },
  });

  // Ответ одинаковый вне зависимости от того, есть аккаунт или нет,
  // чтобы нельзя было перебором узнать чужие адреса.
  if (user) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");

    await prisma.passwordResetCode.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetCode.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000),
      },
    });

    const mail = resetCodeEmail(code, user.firstName);
    if (user.email) await sendMail({ ...mail, to: user.email });
  }

  return {
    ok: true,
    message: "Если аккаунт с такой почтой существует, код отправлен на неё.",
  };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const errors = collect({
    email: validateEmail(email),
    code: validateResetCode(code),
    password: validatePassword(password),
    passwordConfirm:
      password !== passwordConfirm ? "Пароли не совпадают" : null,
  });
  if (errors) return fail("Проверьте заполнение полей", errors);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return fail("Неверный код или почта");

  const record = await prisma.passwordResetCode.findFirst({
    where: { userId: user.id, code, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return fail("Неверный код или почта");
  if (record.expiresAt.getTime() < Date.now()) {
    return fail("Срок действия кода истёк — запросите новый");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(password) },
    }),
    prisma.passwordResetCode.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // все старые сессии становятся недействительными
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);

  return { ok: true, message: "Пароль обновлён. Теперь можно войти." };
}

/* ────────────────── Смена пароля из профиля ────────────────── */

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await getCurrentUser();
  if (!me) return fail("Нужно войти в аккаунт");

  const current = String(formData.get("currentPassword") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const errors = collect({
    currentPassword: current ? null : "Укажите текущий пароль",
    password: validatePassword(password),
    passwordConfirm:
      password !== passwordConfirm ? "Пароли не совпадают" : null,
  });
  if (errors) return fail("Проверьте заполнение полей", errors);

  const user = await prisma.user.findUnique({
    where: { id: me.id },
    select: { password: true },
  });
  if (!user || !(await verifyPassword(current, user.password))) {
    return fail("Текущий пароль указан неверно", {
      currentPassword: "Неверный пароль",
    });
  }

  await prisma.user.update({
    where: { id: me.id },
    data: { password: await hashPassword(password) },
  });

  return { ok: true, message: "Пароль изменён" };
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await getCurrentUser();
  if (!me) return fail("Нужно войти в аккаунт");

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const errors = collect({
    firstName: validateName(firstName, "Имя"),
    lastName: validateName(lastName, "Фамилия", { optional: true }),
    email: validateEmail(email, { optional: true }),
  });
  if (errors) return fail("Проверьте заполнение полей", errors);

  const taken = email
    ? await prisma.user.findFirst({
        where: { email, NOT: { id: me.id } },
        select: { id: true },
      })
    : null;
  if (taken) return fail("Эта почта уже занята", { email: "Почта занята" });

  await prisma.user.update({
    where: { id: me.id },
    data: { firstName, lastName, email: email || null },
  });

  return { ok: true, message: "Профиль сохранён" };
}
