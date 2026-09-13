"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { canUseOge, getVariant } from "@/lib/oge";
import { reviewFromFields, type OgeAnswers } from "@/lib/oge/scoring";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

/** Ключи ответов письменной части: «1»…«35», клетки «5A», «12F» */
const ANSWER_KEY = /^(?:[1-9]|[12]\d|3[0-5])[A-F]?$/;

function cleanAnswers(raw: unknown): OgeAnswers {
  const result: OgeAnswers = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return result;

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!ANSWER_KEY.test(key) || typeof value !== "string") continue;
    // Письмо — до 120 слов, остальное — одно-два слова или цифра
    const text = value.slice(0, key === "35" ? 5000 : 60);
    if (text.trim()) result[key] = text;
  }
  return result;
}

async function ogeUser() {
  const user = await getCurrentUser();
  return user && canUseOge(user) ? user : null;
}

async function admin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN" ? user : null;
}

function refresh(variant: string) {
  revalidatePath("/oge");
  revalidatePath(`/oge/${variant}`);
  revalidatePath(`/oge/${variant}/razbor`);
}

/* ─────────────────────────────── Ученик ─────────────────────────────── */

/** Автосохранение ответов; отправленную работу менять нельзя */
export async function saveOgeAnswersAction(
  variantId: string,
  answers: OgeAnswers,
): Promise<{ ok: boolean; message?: string; savedAt?: string }> {
  const user = await ogeUser();
  if (!user) return { ok: false, message: "Нет доступа к ОГЭ" };
  if (!getVariant(variantId)) return { ok: false, message: "Вариант не найден" };

  const existing = await prisma.ogeAttempt.findUnique({
    where: { userId_variant: { userId: user.id, variant: variantId } },
    select: { submittedAt: true },
  });
  if (existing?.submittedAt) {
    return { ok: false, message: "Работа уже отправлена на проверку" };
  }

  const clean = cleanAnswers(answers);
  const saved = await prisma.ogeAttempt.upsert({
    where: { userId_variant: { userId: user.id, variant: variantId } },
    create: { userId: user.id, variant: variantId, answers: clean },
    update: { answers: clean },
    select: { updatedAt: true },
  });

  return { ok: true, savedAt: saved.updatedAt.toISOString() };
}

/** Отправка на проверку: письменная часть проверяется сразу */
export async function submitOgeAction(formData: FormData): Promise<void> {
  const user = await ogeUser();
  if (!user) return;

  const variant = String(formData.get("variant") ?? "");
  if (!getVariant(variant)) return;

  let parsed: unknown = {};
  try {
    parsed = JSON.parse(String(formData.get("answers") ?? "{}"));
  } catch {
    parsed = {};
  }
  const answers = cleanAnswers(parsed);

  const existing = await prisma.ogeAttempt.findUnique({
    where: { userId_variant: { userId: user.id, variant } },
    select: { submittedAt: true },
  });
  if (existing?.submittedAt) return;

  await prisma.ogeAttempt.upsert({
    where: { userId_variant: { userId: user.id, variant } },
    create: { userId: user.id, variant, answers, submittedAt: new Date() },
    update: { answers, submittedAt: new Date() },
  });

  refresh(variant);
}

/** Ученик начинает вариант заново — пока работа не отправлена */
export async function clearOgeAnswersAction(formData: FormData): Promise<void> {
  const user = await ogeUser();
  if (!user) return;

  const variant = String(formData.get("variant") ?? "");
  await prisma.ogeAttempt.deleteMany({
    where: { userId: user.id, variant, submittedAt: null },
  });

  refresh(variant);
}

/* ─────────────────────────── Администратор ─────────────────────────── */

export async function setOgeAccessAction(formData: FormData): Promise<void> {
  if (!(await admin())) return;

  const userId = String(formData.get("userId") ?? "");
  const access = String(formData.get("access") ?? "") === "1";

  await prisma.user
    .update({ where: { id: userId }, data: { ogeAccess: access } })
    .catch(() => undefined);

  revalidatePath("/oge");
  revalidatePath("/students");
  revalidatePath(`/students/${userId}`);
}

export type OgeReviewState = { ok: boolean; message: string } | null;

export async function saveOgeReviewAction(
  _prev: OgeReviewState,
  formData: FormData,
): Promise<OgeReviewState> {
  if (!(await admin())) return { ok: false, message: "Нужны права администратора" };

  const attemptId = String(formData.get("attemptId") ?? "");
  const attempt = await prisma.ogeAttempt.findUnique({
    where: { id: attemptId },
    select: { variant: true, userId: true },
  });
  if (!attempt) return { ok: false, message: "Работа не найдена" };

  const review = reviewFromFields((name) => String(formData.get(name) ?? ""));
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 3000);

  await prisma.ogeAttempt.update({
    where: { id: attemptId },
    data: {
      review: review as Prisma.InputJsonObject,
      comment,
      checkedAt: new Date(),
    },
  });

  refresh(attempt.variant);
  revalidatePath(`/students/${attempt.userId}`);
  return { ok: true, message: "Оценка сохранена — ученик увидит баллы и комментарий" };
}

/** Вернуть работу ученику: он снова сможет менять ответы */
export async function adminReopenOgeAction(formData: FormData): Promise<void> {
  if (!(await admin())) return;

  const attemptId = String(formData.get("attemptId") ?? "");
  const attempt = await prisma.ogeAttempt
    .update({
      where: { id: attemptId },
      data: { submittedAt: null, checkedAt: null },
      select: { variant: true, userId: true },
    })
    .catch(() => null);

  if (attempt) {
    refresh(attempt.variant);
    revalidatePath(`/students/${attempt.userId}`);
  }
}

/** Удалить работу вместе с записями — ученик начнёт вариант с нуля */
export async function adminDeleteOgeAttemptAction(
  formData: FormData,
): Promise<void> {
  if (!(await admin())) return;

  const attemptId = String(formData.get("attemptId") ?? "");
  const attempt = await prisma.ogeAttempt
    .delete({ where: { id: attemptId }, select: { variant: true, userId: true } })
    .catch(() => null);

  if (attempt) {
    refresh(attempt.variant);
    revalidatePath(`/students/${attempt.userId}`);
  }
}
