import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "me_session";
const SESSION_TTL_DAYS = 30;

export type SessionUser = {
  id: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STUDENT";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null;
};

const userSelect = {
  id: true,
  login: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  level: true,
} as const;

/** Создаёт сессию в БД и ставит httpOnly-куку */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.session.create({ data: { token, userId, expiresAt } });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Удаляет текущую сессию и куку */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  store.delete(SESSION_COOKIE);
}

/** Текущий пользователь или null. Кэшируется на время одного запроса. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    select: { expiresAt: true, user: { select: userSelect } },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.deleteMany({ where: { token } });
    return null;
  }

  return session.user as SessionUser;
});

/** Требует авторизации, иначе — на страницу входа */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/?next=auth");
  return user;
}

/** Требует роли администратора */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

/** Инициалы для аватара в шапке */
export function initialsOf(user: {
  firstName: string;
  lastName: string;
}): string {
  // Фамилия необязательна — тогда в кружке остаётся одна буква
  const first = user.firstName.trim().charAt(0);
  const last = user.lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}
