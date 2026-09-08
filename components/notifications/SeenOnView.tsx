"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  markHomeworkCommentsSeenAction,
  markLessonCommentsSeenAction,
} from "@/app/actions/lesson-answers";

/**
 * Снимает пометку «новый комментарий», когда ученик действительно открыл
 * страницу. Делаем это на клиенте, а не при рендере на сервере: ссылки в
 * приложении с prefetch, и серверный рендер срабатывает уже при наведении
 * мыши — комментарий пометился бы прочитанным, хотя его никто не читал.
 */
export function SeenOnView({
  lessonId,
  homeworkId,
  unseen,
}: {
  lessonId?: string;
  homeworkId?: string;
  /** Сколько новых комментариев на этой странице; 0 — ничего не делаем */
  unseen: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (unseen === 0) return;

    const mark = lessonId
      ? markLessonCommentsSeenAction(lessonId)
      : homeworkId
        ? markHomeworkCommentsSeenAction(homeworkId)
        : null;

    // Обновляем шапку, чтобы значок с числом пропал сразу
    void mark?.then(() => router.refresh());
  }, [lessonId, homeworkId, unseen, router]);

  return null;
}
