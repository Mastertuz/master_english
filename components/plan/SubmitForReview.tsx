"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmissionWithReview } from "@/lib/study/inbox";
import { todayIso, useStudy } from "./study-store";

function when(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Текст для чата: на случай, когда файловая отправка недоступна (сайт на хостинге) */
function chatText(title: string, prompt: string, text: string): string {
  return `Проверь мою работу из плана «Мой английский».\n\nЗадание: ${title}\n${prompt}\n\nМой текст:\n${text}\n\nДай: общий вывод, оценку по уровню, исправленный вариант, 3–5 главных ошибок (неверно / верно / почему) и что делать дальше.`;
}

/**
 * Отправка работы на проверку проверяющему (Claude): файл ложится в папку проекта,
 * потом вы пишете в чат «проверь мои работы», и отзыв появляется здесь же.
 */
export function SubmitForReview({
  taskId,
  title,
  prompt,
  text,
  kind,
  minWords = 0,
}: {
  taskId: string;
  title: string;
  prompt: string;
  text: string;
  kind: "writing" | "video" | "speaking";
  minWords?: number;
}) {
  const [, update] = useStudy();
  const [items, setItems] = useState<SubmissionWithReview[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/plan/reviews?taskId=${encodeURIComponent(taskId)}`, { cache: "no-store" });
      if (response.ok) setItems(((await response.json()) as { items: SubmissionWithReview[] }).items);
    } catch {
      // нет связи: список просто не обновится
    }
  }, [taskId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- загрузка с сервера при открытии страницы
    load();
  }, [load]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function send() {
    setStatus("sending");
    try {
      const response = await fetch("/api/plan/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, title, prompt, text, kind }),
      });
      if (response.ok) {
        setStatus("sent");
        await load();
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(chatText(title, prompt, text));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер обмена недоступен
    }
  }

  function addErrors(item: SubmissionWithReview) {
    if (!item.review) return;
    const today = todayIso();
    update((old) => {
      const errors = { ...old.errors };
      item.review!.errors.forEach((error, index) => {
        const id = `rev-${item.id}-${index}`;
        if (errors[id]) return;
        errors[id] = {
          id,
          source: `Отзыв: ${title}`,
          prompt: `Исправьте ошибку: ${error.wrong}`,
          answer: error.right,
          exact: true,
          why: error.why,
          box: 0,
          due: today,
          wrong: 1,
          added: today,
        };
      });
      return { ...old, errors };
    });
    setAdded((old) => ({ ...old, [item.id]: true }));
  }

  return (
    <section className="card space-y-4 p-5">
      <div>
        <h2 className="text-[15px] font-semibold text-ink-900">Отправить на проверку</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-600">
          Нажмите «Отправить», потом напишите мне в чат Claude Code: «проверь мои работы». Отзыв с исправлениями и ошибками для журнала появится ниже.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={send}
          disabled={status === "sending" || words < Math.max(minWords, 10)}
          className="btn-primary"
        >
          {status === "sending" ? "Отправляем…" : "📨 Отправить на проверку"}
        </button>
        <button type="button" onClick={copy} className="btn-ghost">
          {copied ? "Скопировано" : "Скопировать для чата"}
        </button>
        {words < Math.max(minWords, 10) ? (
          <span className="text-[13px] text-ink-500">Нужно хотя бы {Math.max(minWords, 10)} слов (сейчас {words}).</span>
        ) : null}
      </div>
      {status === "sent" ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[13.5px] text-emerald-700">
          Отправлено. Теперь напишите в чат: «проверь мои работы».
        </p>
      ) : null}
      {status === "failed" ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-[13.5px] text-amber-700">
          Отправка работает только на вашем компьютере, когда сайт запущен из папки проекта. Нажмите «Скопировать для чата» и вставьте текст мне в чат.
        </p>
      ) : null}

      {items.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-[14px] font-semibold text-ink-900">Ваши отправки</h3>
          {items.map((item) => (
            <div key={item.id} className="space-y-2 rounded-xl border border-ink-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-500">
                <span>{when(item.at)}</span>
                <span className={`chip ${item.review ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {item.review ? "проверено" : "ждёт проверки"}
                </span>
              </div>
              {item.review ? (
                <div className="space-y-3 text-[14.5px] leading-relaxed text-ink-800">
                  <p>
                    <b className="text-ink-900">Вывод:</b> {item.review.summary}
                    {item.review.score ? (
                      <>
                        {" "}
                        <b className="text-ink-900">Оценка:</b> {item.review.score}
                      </>
                    ) : null}
                  </p>
                  {item.review.notes.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {item.review.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : null}
                  {item.review.errors.length > 0 ? (
                    <div className="space-y-1.5 rounded-lg bg-ink-50 p-3">
                      {item.review.errors.map((error) => (
                        <p key={error.wrong} className="text-[14px]">
                          <span className="text-rose-700 line-through">{error.wrong}</span> → <span className="font-medium text-emerald-700">{error.right}</span>
                          <span className="block text-[13px] text-ink-500">{error.why}</span>
                        </p>
                      ))}
                      <button type="button" onClick={() => addErrors(item)} disabled={added[item.id]} className="btn-ghost btn-sm mt-1">
                        {added[item.id] ? "Добавлено в журнал" : "+ Добавить эти ошибки в журнал"}
                      </button>
                    </div>
                  ) : null}
                  {item.review.corrected ? (
                    <details>
                      <summary className="cursor-pointer text-[13.5px] font-medium text-brand-700">Исправленный вариант</summary>
                      <p className="mt-2 whitespace-pre-line">{item.review.corrected}</p>
                    </details>
                  ) : null}
                  {item.review.next ? (
                    <p>
                      <b className="text-ink-900">Дальше:</b> {item.review.next}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="line-clamp-3 whitespace-pre-line text-[14px] text-ink-600">{item.text}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
