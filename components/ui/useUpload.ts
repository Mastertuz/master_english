"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

/**
 * Загрузка файла. Хранилище выбирается на сервере: если задан
 * UPLOADTHING_TOKEN, файл уходит прямо в UploadThing, иначе — в public/uploads
 * через /api/upload. Спрашиваем об этом один раз на всё приложение.
 */
let providerRequest: Promise<"uploadthing" | "local"> | null = null;

function provider() {
  providerRequest ??= fetch("/api/upload")
    .then((response) => response.json())
    .then((data) => (data.provider === "uploadthing" ? "uploadthing" : "local"))
    .catch(() => "local" as const);

  return providerRequest;
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("lessonMedia");

  async function uploadHere(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Не удалось загрузить файл");
      return null;
    }
    return data.url as string;
  }

  async function uploadThere(file: File): Promise<string | null> {
    const result = await startUpload([file]);
    const url = result?.[0]?.ufsUrl ?? result?.[0]?.url;

    if (!url) {
      setError("Хранилище не приняло файл");
      return null;
    }
    return url;
  }

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);

    try {
      return (await provider()) === "uploadthing"
        ? await uploadThere(file)
        : await uploadHere(file);
    } catch (cause) {
      // UploadThing отдаёт понятный текст ошибки — показываем его как есть
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Не удалось загрузить файл",
      );
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}
