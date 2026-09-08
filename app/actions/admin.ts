"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isLevel } from "@/lib/lesson-content";
import {
  collect,
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  type FieldErrors,
} from "@/lib/validation";

export type AdminState = {
  ok: boolean;
  message?: string;
  errors?: FieldErrors;
} | null;

async function ensureAdmin() {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") return null;
  return me;
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function normalizeRole(value: string): "ADMIN" | "STUDENT" {
  return value === "ADMIN" ? "ADMIN" : "STUDENT";
}

/** Уровень CEFR; пустая строка означает «не задан» */
function normalizeLevel(value: string) {
  return isLevel(value) ? value : null;
}

/* ──────────────────────── Создание аккаунта ──────────────────────── */

export async function adminCreateUserAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const me = await ensureAdmin();
  if (!me) return { ok: false, message: "Нужны права администратора" };

  const login = str(formData, "login");
  const email = str(formData, "email").toLowerCase();
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const password = str(formData, "password");
  const role = normalizeRole(str(formData, "role"));

  // Почта и фамилия необязательны: аккаунт ученика заводят и без них
  const errors = collect({
    login: validateLogin(login),
    email: validateEmail(email, { optional: true }),
    firstName: validateName(firstName, "Имя"),
    lastName: validateName(lastName, "Фамилия", { optional: true }),
    password: validatePassword(password),
  });
  if (errors) return { ok: false, message: "Проверьте поля", errors };

  const existing = await prisma.user.findFirst({
    where: email ? { OR: [{ login }, { email }] } : { login },
    select: { login: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "Логин или почта уже заняты",
      errors:
        existing.login === login
          ? { login: "Логин занят" }
          : { email: "Почта занята" },
    };
  }

  await prisma.user.create({
    data: {
      login,
      // Пустую строку писать нельзя: поле уникальное, второй такой аккаунт
      // уже не создался бы. NULL уникальности не мешает
      email: email || null,
      firstName,
      lastName,
      role,
      level: normalizeLevel(str(formData, "level")),
      password: await hashPassword(password),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/students");
  return { ok: true, message: `Аккаунт «${login}» создан` };
}

/* ─────────────────────── Изменение аккаунта ─────────────────────── */

export async function adminUpdateUserAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const me = await ensureAdmin();
  if (!me) return { ok: false, message: "Нужны права администратора" };

  const id = str(formData, "id");
  const login = str(formData, "login");
  const email = str(formData, "email").toLowerCase();
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const password = str(formData, "password");
  const role = normalizeRole(str(formData, "role"));

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });
  if (!target) return { ok: false, message: "Аккаунт не найден" };

  const errors = collect({
    login: validateLogin(login),
    email: validateEmail(email, { optional: true }),
    firstName: validateName(firstName, "Имя"),
    lastName: validateName(lastName, "Фамилия", { optional: true }),
    password: password ? validatePassword(password) : null,
  });
  if (errors) return { ok: false, message: "Проверьте поля", errors };

  const taken = await prisma.user.findFirst({
    where: {
      ...(email ? { OR: [{ login }, { email }] } : { login }),
      NOT: { id },
    },
    select: { login: true },
  });
  if (taken) {
    return {
      ok: false,
      message: "Логин или почта уже заняты",
      errors:
        taken.login === login
          ? { login: "Логин занят" }
          : { email: "Почта занята" },
    };
  }

  // Нельзя снять с себя роль администратора, если он единственный
  if (me.id === id && role !== "ADMIN") {
    const admins = await prisma.user.count({ where: { role: "ADMIN" } });
    if (admins <= 1) {
      return {
        ok: false,
        message: "Нельзя снять роль с единственного администратора",
      };
    }
  }

  await prisma.user.update({
    where: { id },
    data: {
      login,
      email: email || null,
      firstName,
      lastName,
      role,
      level: normalizeLevel(str(formData, "level")),
      ...(password ? { password: await hashPassword(password) } : {}),
    },
  });

  // Смена пароля администратором завершает чужие сессии
  if (password) {
    await prisma.session.deleteMany({ where: { userId: id } });
  }

  revalidatePath("/admin");
  revalidatePath("/students");
  revalidatePath(`/admin/users/${id}`);
  revalidatePath(`/students/${id}`);
  return { ok: true, message: "Изменения сохранены" };
}

/* ─────────────────────── Быстрая смена роли ─────────────────────── */

export async function adminSetRoleAction(formData: FormData): Promise<void> {
  const me = await ensureAdmin();
  if (!me) return;

  const id = String(formData.get("id") ?? "");
  const role = normalizeRole(String(formData.get("role") ?? ""));

  if (me.id === id && role !== "ADMIN") {
    const admins = await prisma.user.count({ where: { role: "ADMIN" } });
    if (admins <= 1) return;
  }

  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin");
}

/* ─────────────────────── Удаление аккаунта ─────────────────────── */

export async function adminDeleteUserAction(formData: FormData): Promise<void> {
  const me = await ensureAdmin();
  if (!me) return;

  const id = String(formData.get("id") ?? "");
  if (id === me.id) return; // себя удалить нельзя

  await prisma.user.delete({ where: { id } }).catch(() => undefined);
  revalidatePath("/admin");
  revalidatePath("/students");

  // С карточки ученика возвращаемся к списку: страница удалённого
  // пользователя иначе отдала бы «не найдено»
  const back = String(formData.get("redirectTo") ?? "");
  if (back.startsWith("/")) redirect(back);
}
