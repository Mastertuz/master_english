"use client";

import { createContext, useActionState, useContext, useState } from "react";
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

/**
 * Оценка развёрнутых ответов прямо у заданий. Баллы за письмо и устную
 * часть выбираются рядом с ответом ученика, а сохраняет их общая форма
 * внизу страницы — у всех полей один источник состояния.
 */

export const GRADING_FORM_ID = "oge-grading-form";

const FIELD_NAMES = [
  "w35_k1",
  "w35_k2",
  "w35_k3",
  "w35_k4",
  "s1",
  "s2_1",
  "s2_2",
  "s2_3",
  "s2_4",
  "s2_5",
  "s2_6",
  "s3_k1",
  "s3_k2",
  "s3_k3",
];

type Fields = Record<string, string>;

type Grading = {
  fields: Fields;
  set: (name: string, value: string) => void;
  review: OgeReview;
  state: OgeReviewState;
  action: (formData: FormData) => void;
};

const GradingContext = createContext<Grading | null>(null);

/** null — страницу открыл не проверяющий преподаватель */
export function useGrading() {
  return useContext(GradingContext);
}

function initialFields(review: OgeReview | null): Fields {
  const value = (number: number | undefined) =>
    number === undefined ? "" : String(number);
  return {
    w35_k1: value(review?.w35?.k1),
    w35_k2: value(review?.w35?.k2),
    w35_k3: value(review?.w35?.k3),
    w35_k4: value(review?.w35?.k4),
    s1: value(review?.s1),
    ...Object.fromEntries(
      Array.from({ length: 6 }, (_, index) => [
        `s2_${index + 1}`,
        value(review?.s2?.[index]),
      ]),
    ),
    s3_k1: value(review?.s3?.k1),
    s3_k2: value(review?.s3?.k2),
    s3_k3: value(review?.s3?.k3),
  };
}

export function GradingProvider({
  review,
  children,
}: {
  review: OgeReview | null;
  children: React.ReactNode;
}) {
  const [fields, setFields] = useState<Fields>(() => initialFields(review));
  const [state, action] = useActionState<OgeReviewState, FormData>(
    saveOgeReviewAction,
    null,
  );

  return (
    <GradingContext.Provider
      value={{
        fields,
        set: (name, value) => setFields((current) => ({ ...current, [name]: value })),
        review: reviewFromFields((name) => fields[name] ?? ""),
        state,
        action,
      }}
    >
      {children}
    </GradingContext.Provider>
  );
}

function ScoreSelect({
  name,
  label,
  max,
}: {
  name: string;
  label: string;
  max: number;
}) {
  const grading = useGrading();
  if (!grading) return null;

  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[12.5px] leading-tight text-ink-600">{label}</span>
      <select
        value={grading.fields[name] ?? ""}
        onChange={(event) => grading.set(name, event.target.value)}
        className="field py-1.5"
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

export type Part =
  | { part: "w35"; words: number }
  | { part: "s1" }
  | { part: "s2"; index: number }
  | { part: "s3" };

/** Баллы преподавателя у самого задания — выбор (учитель) */
export function InlineGrading(props: Part) {
  const grading = useGrading();
  if (!grading) return null;

  const { review, state } = grading;
  const s3 = review.s3;
  const total =
    props.part === "w35"
      ? `${writingPoints(review) ?? "—"} из ${WRITING_MAX}`
      : props.part === "s1"
        ? `${review.s1 ?? "—"} из 2`
        : props.part === "s2"
          ? `${review.s2?.[props.index] ?? "—"} из 1`
          : `${s3 ? (s3.k1 === 0 ? 0 : s3.k1 + s3.k2 + s3.k3) : "—"} из 7`;

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="text-[13px] font-semibold text-brand-700">
          ✍️ Оценка преподавателя · {total}
        </p>
        <button
          type="submit"
          form={GRADING_FORM_ID}
          className="btn-primary btn-sm ml-auto"
        >
          💾 Сохранить оценку
        </button>
      </div>

      {props.part === "w35" ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <ScoreSelect name="w35_k1" label="К1 · содержание (0–3)" max={3} />
            <ScoreSelect name="w35_k2" label="К2 · организация (0–2)" max={2} />
            <ScoreSelect name="w35_k3" label="К3 · лексика и грамматика (0–3)" max={3} />
            <ScoreSelect name="w35_k4" label="К4 · орфография (0–2)" max={2} />
          </div>
          <p className={`mt-2 text-[12.5px] ${props.words < 90 ? "text-rose-600" : "text-ink-500"}`}>
            В письме {props.words} слов.
            {props.words < 90 ? " Меньше 90 — по правилам 0 баллов." : ""}
            {props.words > 132 ? " Больше 132 — оцениваются первые 120 слов." : ""} 0 по К1
            обнуляет всё задание.
          </p>
        </>
      ) : props.part === "s1" ? (
        <div className="max-w-[12rem]">
          <ScoreSelect name="s1" label="Чтение вслух (0–2)" max={2} />
        </div>
      ) : props.part === "s2" ? (
        <div className="max-w-[12rem]">
          <ScoreSelect
            name={`s2_${props.index + 1}`}
            label="Полный ответ (0–1)"
            max={1}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <ScoreSelect name="s3_k1" label="К1 · содержание (0–3)" max={3} />
            <ScoreSelect name="s3_k2" label="К2 · организация (0–2)" max={2} />
            <ScoreSelect name="s3_k3" label="К3 · язык (0–2)" max={2} />
          </div>
          <p className="mt-2 text-[12.5px] text-ink-500">0 по К1 — 0 за всё задание.</p>
        </>
      )}

      {state?.message ? (
        <div className="mt-2">
          <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
        </div>
      ) : null}
    </div>
  );
}

/** Баллы преподавателя у задания — просмотр (ученик) */
export function ReviewedScore({
  review,
  checked,
  ...props
}: Part & { review: OgeReview | null; checked: boolean }) {
  const pending = (
    <p className="rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2 text-[13.5px] text-amber-700">
      ✍️ Баллы за это задание ставит преподаватель — ждёт проверки
    </p>
  );
  if (!checked || !review) return pending;

  let details: string;
  let result: string;

  if (props.part === "w35") {
    const w = review.w35;
    if (!w) return pending;
    details = `К1 ${w.k1}/3 · К2 ${w.k2}/2 · К3 ${w.k3}/3 · К4 ${w.k4}/2`;
    result = `${writingPoints(review)} из ${WRITING_MAX}`;
  } else if (props.part === "s1") {
    if (review.s1 === undefined) return pending;
    details = "чтение вслух";
    result = `${review.s1} из 2`;
  } else if (props.part === "s2") {
    const value = review.s2?.[props.index];
    if (value === undefined) return pending;
    details = value ? "дан полный ответ" : "ответ не засчитан";
    result = `${value} из 1`;
  } else {
    const s3 = review.s3;
    if (!s3) return pending;
    details = `К1 ${s3.k1}/3 · К2 ${s3.k2}/2 · К3 ${s3.k3}/2`;
    result = `${s3.k1 === 0 ? 0 : s3.k1 + s3.k2 + s3.k3} из 7`;
  }

  return (
    <p className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-2 text-[13.5px] text-ink-700">
      <b className="text-emerald-700">✍️ Оценка преподавателя: {result}</b> · {details}
    </p>
  );
}

/** Итог и сохранение оценки — внизу страницы проверки */
export function GradingPanel({
  attemptId,
  comment,
  autoPoints,
  autoMax,
}: {
  attemptId: string;
  comment: string;
  autoPoints: number;
  autoMax: number;
}) {
  const grading = useGrading();
  if (!grading) return null;

  const { fields, review, state, action } = grading;
  const writing = writingPoints(review);
  const speaking = speakingPoints(review);
  const total = autoPoints + (writing ?? 0) + (speaking ?? 0);

  return (
    <form id={GRADING_FORM_ID} action={action} className="space-y-4" noValidate>
      <input type="hidden" name="attemptId" value={attemptId} />
      {FIELD_NAMES.map((name) => (
        <input key={name} type="hidden" name={name} value={fields[name] ?? ""} />
      ))}

      <div className="grid gap-2 sm:grid-cols-4">
        <Summary label="Автопроверка (1–34)" value={`${autoPoints} из ${autoMax}`} note="выставлено автоматически" />
        <Summary label="Письмо (35)" value={writing === null ? "не оценено" : `${writing} из ${WRITING_MAX}`} note="вкладка «Письмо»" />
        <Summary label="Устная часть" value={speaking === null ? "не оценено" : `${speaking} из ${SPEAKING_MAX}`} note="вкладка «Устная часть»" />
        <Summary label={`Итого · отметка ${markFor(total)}`} value={`${total} из ${TOTAL_MAX}`} accent />
      </div>

      <p className="text-[13px] text-ink-500">
        Задания 1–34 проверены автоматически. Баллы за письмо и устную часть
        выставляйте у самих заданий — во вкладках «Письмо» и «Устная часть».
      </p>

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

      <SubmitButton pendingLabel="Сохраняем…" className="btn-primary">
        Сохранить оценку
      </SubmitButton>
    </form>
  );
}

function Summary({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        accent ? "border-brand-200 bg-brand-50/70" : "border-ink-200"
      }`}
    >
      <p className="text-[12.5px] text-ink-500">{label}</p>
      <p className="mt-0.5 text-[16px] font-semibold text-ink-900">{value}</p>
      {note ? <p className="text-[11.5px] text-ink-400">{note}</p> : null}
    </div>
  );
}
