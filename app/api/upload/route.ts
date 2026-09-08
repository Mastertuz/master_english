import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

/**
 * Картинки держим лёгкими, а запись занятия и в 20 МБ укладывается не
 * всегда: часовой mp3 на 128 кбит/с — это около 55 МБ.
 */
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_AUDIO_BYTES = 64 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/mpeg": ".mp3",
  "audio/mp4": ".m4a",
  "audio/wav": ".wav",
  "audio/ogg": ".ogg",
};

/**
 * Куда складывать файлы. UploadThing включается сам, как только в .env
 * появляется UPLOADTHING_TOKEN: клиент спрашивает это одним запросом и
 * дальше грузит файл напрямую в хранилище, минуя наш сервер (на бессерверном
 * хостинге тело запроса всё равно ограничено несколькими мегабайтами).
 * Без токена работает прежняя загрузка в public/uploads.
 */
export function GET() {
  return NextResponse.json({
    provider: process.env.UPLOADTHING_TOKEN ? "uploadthing" : "local",
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Загружать файлы может только администратор" },
      { status: 403 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Поддерживаются картинки (jpg, png, webp, gif) и аудио (mp3, m4a, wav, ogg)" },
      { status: 415 },
    );
  }

  const isAudio = file.type.startsWith("audio/");
  const limit = isAudio ? MAX_AUDIO_BYTES : MAX_IMAGE_BYTES;

  if (file.size > limit) {
    const mb = Math.round(limit / 1024 / 1024);
    return NextResponse.json(
      { error: `Файл больше ${mb} МБ — сожмите его или вставьте ссылку` },
      { status: 413 },
    );
  }

  const name = `${randomBytes(12).toString("hex")}${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");

  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, name),
    Buffer.from(await file.arrayBuffer()),
  );

  return NextResponse.json({ url: `/uploads/${name}` });
}
