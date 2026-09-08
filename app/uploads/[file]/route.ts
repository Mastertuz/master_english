import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

/**
 * Отдаёт файлы из public/uploads.
 *
 * Само по себе это статика, но next start раздаёт из public только то, что
 * лежало там на момент сборки: всё загруженное позже отдавалось 404. В dev
 * статика по-прежнему перехватывает этот путь раньше — контент тот же.
 *
 * Поддерживаем Range, иначе в аудио нельзя перемотать запись.
 */
const TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/** Имена задаёт сам загрузчик: 24 hex-символа и известное расширение */
const NAME = /^[0-9a-f]{24}\.(mp3|m4a|wav|ogg|jpg|png|webp|gif)$/;

function stream(file: string, start?: number, end?: number) {
  return Readable.toWeb(
    createReadStream(file, start === undefined ? {} : { start, end }),
  ) as ReadableStream;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!NAME.test(file)) {
    return new Response("Not found", { status: 404 });
  }

  const full = path.join(process.cwd(), "public", "uploads", file);

  let size: number;
  try {
    const info = await stat(full);
    if (!info.isFile()) throw new Error("not a file");
    size = info.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const type = TYPES[path.extname(file)] ?? "application/octet-stream";
  const headers = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    // Имя файла случайное и не переиспользуется, поэтому кэшируем надолго
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");

  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;

    if (start >= size || start > end) {
      return new Response("Range not satisfiable", {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }

    return new Response(stream(full, start, end), {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  return new Response(stream(full), {
    status: 200,
    headers: { ...headers, "Content-Length": String(size) },
  });
}
