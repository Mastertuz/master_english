"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";

/**
 * Кнопка отправки формы, которая сначала спрашивает подтверждение.
 *
 * Стоит на удалении и на сохранении изменений — там, где отмена невозможна.
 * Форму отправляем через requestSubmit самой кнопкой, чтобы серверное
 * действие получило те же данные, что и при обычном нажатии.
 */
export function ConfirmSubmit({
  children,
  className = "btn-danger btn-sm",
  pendingLabel = "Выполняем…",
  title,
  message,
  confirmLabel = "Удалить",
  danger = true,
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
  /** Заголовок окна: «Удалить слово?» */
  title: string;
  /** Что именно произойдёт — с названием объекта */
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const [asking, setAsking] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!asking) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAsking(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [asking]);

  function submit() {
    setAsking(false);
    const element = button.current;
    element?.form?.requestSubmit(element);
  }

  return (
    <>
      <button
        ref={button}
        type="submit"
        disabled={pending}
        onClick={(event) => {
          // Первое нажатие только открывает вопрос; отправит нас submit()
          if (asking) return;
          event.preventDefault();
          setAsking(true);
        }}
        className={className}
      >
        {pending ? pendingLabel : children}
      </button>

      {/*
        asking включается только по клику, то есть document уже есть.
        Окно рендерим порталом в body. Внутри формы оно не годится: у карточек
        стоит backdrop-blur, а backdrop-filter делает элемент точкой отсчёта
        для position: fixed — окно оказывалось внутри прокручиваемой карточки
        и уезжало за её край.
      */}
      {asking
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[100] flex items-center justify-center overlay p-4"
              onClick={() => setAsking(false)}
            >
              <div
                className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-5 text-left shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 className="text-[16px] font-semibold text-ink-900">
                  {title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                  {message}
                </p>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAsking(false)}
                    className="btn-ghost btn-sm"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    autoFocus
                    onClick={submit}
                    className={
                      danger ? "btn-danger btn-sm" : "btn-primary btn-sm"
                    }
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
