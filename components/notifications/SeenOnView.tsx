"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  markHomeworkCommentsSeenAction,
  markLessonCommentsSeenAction,
  markSubmissionSeenAction,
} from "@/app/actions/lesson-answers";

/**
 * Снимает пометку «новый комментарий» (или, у преподавателя, «новая работа»),
 * когда страницу действительно открыли. Делаем это на клиенте, а не при рендере на сервере: ссылки в
 * приложении с prefetch, и серверный рендер срабатывает уже при наведении
 * мыши — комментарий пометился бы прочитанным, хотя его никто не читал.
 */
export function SeenOnView({
  lessonId,
  homeworkId,
  submissionOf,
  unseen,
}: {
  lessonId?: string;
  homeworkId?: string;
  /** Ученик, чью отправленную работу проверяет преподаватель */
  submissionOf?: string;
  /** Сколько новых пометок на этой странице; 0 — ничего не делаем */
  unseen: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (unseen === 0) return;

    const mark = lessonId
      ? markLessonCommentsSeenAction(lessonId)
      : homeworkId && submissionOf
        ? markSubmissionSeenAction(homeworkId, submissionOf)
        : homeworkId
          ? markHomeworkCommentsSeenAction(homeworkId)
          : null;

    // Обновляем шапку, чтобы значок с числом пропал сразу
    void mark?.then(() => router.refresh());
  }, [lessonId, homeworkId, submissionOf, unseen, router]);

  return null;
}
