"use client";

import { useState } from "react";
import { isAnswerCorrect, normalizeAnswer, stableOrder } from "@/lib/answer";

export type QuestionItem = {
  id: string;
  q: string;
  options?: string[];
  answer: string;
  /** Ответ — целая фраза, запятые в ней не разделяют варианты */
  exact?: boolean;
  why: string;
};

export function isCorrect(item: QuestionItem, value: string): boolean {
  if (item.options) return value === item.answer;
  if (item.exact) return normalizeAnswer(value) === normalizeAnswer(item.answer);
  return isAnswerCorrect(value, item.answer);
}

/** Предложение с пропуском: пропуск рисуем линией, как в тесте */
function Sentence({ text }: { text: string }) {
  const parts = text.split("___");
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? (
            <span className="mx-1 inline-block w-14 border-b-2 border-ink-400 align-baseline" />
          ) : null}
        </span>
      ))}
    </>
  );
}

/**
 * Одно задание: варианты или поле для ответа. Результат и объяснение
 * показываются сразу после ответа. Ответ запоминает родитель (value).
 */
export function QuestionCard({
  item,
  number,
  value,
  onAnswer,
  seed,
}: {
  item: QuestionItem;
  number?: number;
  /** Что ответил пользователь; null, пока не ответил */
  value: string | null;
  onAnswer: (value: string) => void;
  seed: string;
}) {
  const [draft, setDraft] = useState("");
  const answered = value !== null;
  const ok = answered && isCorrect(item, value);

  const options = item.options
    ? stableOrder(`${seed}:${item.id}`, item.options.length).map((index) => item.options![index])
    : null;

  return (
    <div className="card space-y-3 p-5">
      <p className="text-[16px] leading-relaxed text-ink-900">
        {number ? <span className="mr-1.5 text-ink-400">{number}.</span> : null}
        <Sentence text={item.q} />
      </p>

      {options ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option) => {
            const chosen = answered && value === option;
            const right = answered && option === item.answer;
            let style = "border-ink-200 bg-white text-ink-800 hover:border-brand-400";
            if (right) style = "border-emerald-500 bg-emerald-50 text-emerald-700";
            else if (chosen) style = "border-rose-400 bg-rose-50 text-rose-700";
            return (
              <button
                key={option}
                type="button"
                disabled={answered}
                onClick={() => onAnswer(option)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-[15px] transition disabled:cursor-default ${style}`}
              >
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                    chosen ? "border-current bg-current/30" : "border-ink-300"
                  }`}
                  aria-hidden
                />
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!answered && draft.trim()) onAnswer(draft.trim());
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            value={answered ? value : draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={answered}
            placeholder="Впишите ответ"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            className={`field min-w-[12rem] flex-1 ${
              answered ? (ok ? "border-emerald-500" : "border-rose-400") : ""
            }`}
          />
          {!answered ? (
            <button type="submit" className="btn-primary btn-sm" disabled={!draft.trim()}>
              Проверить
            </button>
          ) : null}
        </form>
      )}

      {answered ? (
        <div
          className={`rounded-xl px-4 py-3 text-[14px] leading-relaxed ${
            ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          <p className="font-medium">
            {ok ? "Верно" : "Неверно"}
            {!ok ? (
              <>
                {" "}
                · правильно: <b>{item.exact ? item.answer : item.answer.split("|")[0]}</b>
              </>
            ) : null}
          </p>
          {item.why ? <p className="mt-0.5">{item.why}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
