import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

/**
 * Отдаёт запись владельцу и администратору. Safari проигрывает звук
 * только с поддержкой Range — без ответа 206 плеер не стартует.
 */
export async function GET(request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const { id } = await params;
  const recording = await prisma.ogeRecording.findUnique({
    where: { id },
    select: { data: true, mimeType: true, attempt: { select: { userId: true } } },
  });

  if (
    !recording ||
    (recording.attempt.userId !== user.id && user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  }

  const bytes = new Uint8Array(recording.data);
  const total = bytes.length;
  const headers = {
    "Content-Type": recording.mimeType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
  };

  const match = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) {
    return new Response(bytes, {
      headers: { ...headers, "Content-Length": String(total) },
    });
  }

  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : total - 1;
  if (!match[1] && match[2]) {
    // «bytes=-500» — последние 500 байт
    start = Math.max(total - Number(match[2]), 0);
    end = total - 1;
  }
  end = Math.min(end, total - 1);

  if (start > end || start >= total) {
    return new Response(null, {
      status: 416,
      headers: { ...headers, "Content-Range": `bytes */${total}` },
    });
  }

  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    headers: {
      ...headers,
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Content-Length": String(end - start + 1),
    },
  });
}

/** Ученик удаляет свою запись, пока работа не отправлена */
export async function DELETE(_request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const { id } = await params;
  const recording = await prisma.ogeRecording.findUnique({
    where: { id },
    select: { attempt: { select: { userId: true, submittedAt: true } } },
  });

  if (!recording || recording.attempt.userId !== user.id) {
    return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  }
  if (recording.attempt.submittedAt) {
    return NextResponse.json(
      { error: "Работа уже отправлена на проверку" },
      { status: 409 },
    );
  }

  await prisma.ogeRecording.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
