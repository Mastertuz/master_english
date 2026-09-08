import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "@/lib/session";

const f = createUploadthing();

/**
 * Файлы уроков: сканы страниц учебника, картинки к словам и аудиозаписи.
 * Загружает только преподаватель — проверяем это до выдачи ссылки на заливку.
 */
export const uploadRouter = {
  lessonMedia: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    audio: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user || user.role !== "ADMIN") {
        throw new UploadThingError("Загружать файлы может только администратор");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      // Возвращается на клиент вместе с результатом загрузки
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
