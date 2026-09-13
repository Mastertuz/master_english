import { NextResponse } from "next/server";
import { canUseOge, getVariant } from "@/lib/oge";
import { isRecordingKey } from "@/lib/oge/scoring";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

/**
 * Две минуты речи в opus на 48 кбит/с — около 700 КБ. Потолок ниже
 * ограничения Vercel на тело запроса (4,5 МБ), чтобы ошибка была понятной.
 */
const MAX_BYTES = 4 * 1024 * 1024;

/** Сохраняет запись устного ответа, заменяя прежнюю по этому заданию */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !canUseOge(user)) {
    return NextResponse.json({ error: "Нет доступа к ОГЭ" }, { status: 403 });
  }

  const form = await request.formData();
  const variant = String(form.get("variant") ?? "");
  const taskKey = String(form.get("taskKey") ?? "");
  const duration = Math.round(Number(form.get("duration") ?? 0));
  const file = form.get("file");

  if (!getVariant(variant) || !isRecordingKey(taskKey)) {
    return NextResponse.json({ error: "Неизвестное задание" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Запись пустая" }, { status: 400 });
  }

  const mimeType = file.type.split(";")[0] || "audio/webm";
  if (!mimeType.startsWith("audio/")) {
    return NextResponse.json({ error: "Это не аудиозапись" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Запись слишком большая — ответьте короче" },
      { status: 413 },
    );
  }

  const attempt = await prisma.ogeAttempt.upsert({
    where: { userId_variant: { userId: user.id, variant } },
    create: { userId: user.id, variant },
    update: {},
    select: { id: true, submittedAt: true },
  });
  if (attempt.submittedAt) {
    return NextResponse.json(
      { error: "Работа уже отправлена на проверку" },
      { status: 409 },
    );
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const durationSec = Number.isFinite(duration) ? Math.max(duration, 0) : 0;

  const recording = await prisma.ogeRecording.upsert({
    where: { attemptId_taskKey: { attemptId: attempt.id, taskKey } },
    create: { attemptId: attempt.id, taskKey, mimeType, data, durationSec },
    update: { mimeType, data, durationSec, createdAt: new Date() },
    select: { id: true, durationSec: true, createdAt: true },
  });

  return NextResponse.json({
    id: recording.id,
    durationSec: recording.durationSec,
    createdAt: recording.createdAt.toISOString(),
  });
}
