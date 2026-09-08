"use client";

import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

/**
 * Хелперы UploadThing. Своя кнопка загрузки уже есть, поэтому берём только
 * useUploadThing — он грузит файл напрямую в хранилище, минуя наш сервер.
 */
export const { useUploadThing } = generateReactHelpers<UploadRouter>();
