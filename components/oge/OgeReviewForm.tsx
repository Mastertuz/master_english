"use client";

import { useActionState, useState } from "react";
import { saveOgeReviewAction, type OgeReviewState } from "@/app/actions/oge";
import { Alert } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  markFor,
  reviewFromFields,
  speakingPoints,
  SPEAKING_MAX,
  TOTAL_MAX,
  writingPoints,
  WRITING_MAX,
  type OgeReview,
} from "@/lib/oge/scoring";

type Fields = Record<string, string>;

function initialFields(review: OgeReview | null): Fields {
  const fields: Fields = {};
  const put = (name: string, value: number | undefined) => {
    fields[name] = value === undefined ? "" : String(value);
  };

  put("w35_k1", review?.w35?.k1);
  put("w35_k2", review?.w35?.k2);
  put("w35_k3", review?.w35?.k3);
  put("w35_k4", review?.w35?.k4);
  put("s1", review?.s1);
  for (let index = 0; index < 6; index += 1) {
    put(`s2_${index + 1}`, review?.s2?.[index]);
  }
  put("s3_k1", review?.s3?.k1);
  put("s3_k2", review?.s3?.k2);
  put("s3_k3", review?.s3?.k3);
  return fields;
}

/** Баллы учителя за письмо и устную часть по критериям ФИПИ */
export function OgeReviewForm({
  attemptId,
  review,
  comment,
  autoPoints,
  autoMax,
  words,
}: {
  attemptId: string;
  review: OgeReview | null;
  comment: string;
  autoPoints: number;
  autoMax: number;
  words: number;
}) {
  const [state, action] = useActionState<OgeReviewState, FormData>(
    saveOgeReviewAction,
    null,
  );
  const [fields, setFields] = useState<Fields>(() => initialFields(review));

  const live = reviewFromFields((name) => fields[name] ?? "");
  const writing = writingPoints(live);
  const speaking = speakingPoints(live);
  const total = autoPoints + (writing ?? 0) + (speaking ?? 0);

  function score(name: string, label: string, max: number) {
    return (
      <label className="block">
        <span className="label">{label}</span>
        <select
          name={name}
          value={fields[name] ?? ""}
          onChange={(event) =>
            setFields((current) => ({ ...current, [name]: event.target.value }))
          }
          className="field"
        >
          <option value="">—</option>
          {Array.from({ length: max + 1 }, (_, value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="attemptId" value={attemptId} />

      <fieldset className="space-y-3 rounded-xl border border-ink-200 p-4">
        <legend className="px-1 text-[14.5px] font-semibold text-ink-900">
          Письмо (35) · {writing ?? "—"} из {WRITING_MAX}
        </legend>
        <p className={`text-[13px] ${words < 90 ? "text-rose-600" : "text-ink-500"}`}>
          В письме {words} слов.
          {words < 90
            ? " Меньше 90 — по правилам задание оценивается в 0 баллов."
            : words > 132
              ? " Больше 132 — оцениваются только первые 120 слов."
              : ""}{" "}
          0 по К1 обнуляет всё задание.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {score("w35_k1", "К1 · содержание (0–3)", 3)}
          {score("w35_k2", "К2 · организация (0–2)", 2)}
          {score("w35_k3", "К3 · лексика и грамматика (0–3)", 3)}
          {score("w35_k4", "К4 · орфография (0–2)", 2)}
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-ink-200 p-4">
        <legend className="px-1 text-[14.5px] font-semibold text-ink-900">
          Устная часть · {speaking ?? "—"} из {SPEAKING_MAX}
        </legend>
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          {score("s1", "Задание 1 · чтение (0–2)", 2)}
        </div>
        <div>
          <p className="label">Задание 2 · по 1 баллу за полный ответ</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>{score(`s2_${index + 1}`, `Вопрос ${index + 1}`, 1)}</div>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Задание 3 · монолог (0 по К1 — 0 за задание)</p>
          <div className="grid grid-cols-3 gap-3">
            {score("s3_k1", "К1 (0–3)", 3)}
            {score("s3_k2", "К2 (0–2)", 2)}
            {score("s3_k3", "К3 (0–2)", 2)}
          </div>
        </div>
      </fieldset>

      <div>
        <label className="label" htmlFor={`oge-comment-${attemptId}`}>
          Комментарий для ученика
        </label>
        <textarea
          id={`oge-comment-${attemptId}`}
          name="comment"
          defaultValue={comment}
          rows={4}
          placeholder="Что получилось, над чем поработать"
          className="field"
        />
      </div>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Сохраняем…" className="btn-primary">
          Сохранить оценку
        </SubmitButton>
        <p className="text-[14px] text-ink-600">
          Автопроверка {autoPoints} из {autoMax} · итого{" "}
          <b className="text-ink-900">
            {total} из {TOTAL_MAX}
          </b>{" "}
          · отметка {markFor(total)}
        </p>
      </div>
    </form>
  );
}
