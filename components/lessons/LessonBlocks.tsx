"use client";

import { useState, useTransition } from "react";
import {
  keepLessonAnswersAction,
  resetLessonAnswersAction,
  saveLessonAnswersAction,
} from "@/app/actions/lesson-answers";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { AnswerComment } from "@/components/students/AnswerComment";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { isAnswerCorrect } from "@/lib/answer";
import { taskKey, type LessonBlock, type LessonTask } from "@/lib/lesson-content";

const BLOCK_STYLES: Record<string, string> = {
  rule: "bg-brand-50 text-brand-700",
  vocab: "bg-sky-50 text-sky-700",
  listening: "bg-emerald-50 text-emerald-700",
  reading: "bg-violet-50 text-violet-700",
  speaking: "bg-amber-50 text-amber-700",
  tasks: "bg-ink-100 text-ink-700",
  text: "bg-ink-100 text-ink-700",
  video: "bg-indigo-50 text-indigo-700",
  page: "bg-rose-50 text-rose-700",
};

const BLOCK_NAMES: Record<string, string> = {
  rule: "Правило",
  vocab: "Лексика",
  listening: "Аудирование",
  reading: "Чтение",
  speaking: "Говорение",
  tasks: "Задания",
  text: "Материал",
  video: "Видео",
  page: "Страница учебника",
};

/** Что сейчас происходит с одним заданием урока */
type Status = { checked: boolean; correct: boolean; kept: boolean };

export function LessonBlocks({
  blocks,
  lessonId = "",
  answers = {},
  comments = {},
  completed = false,
  canSeeHidden = false,
  isTeacher = false,
  review,
}: {
  blocks: LessonBlock[];
  /** Без него ответы не сохраняются: например, в предпросмотре */
  lessonId?: string;
  /** Сохранённые ответы ученика по ключу задания */
  answers?: Record<string, { value: string; isCorrect: boolean }>;
  /** Комментарии преподавателя по ключу задания */
  comments?: Record<string, string>;
  /**
   * Урок отмечен пройденным — тогда можно открыть его с правильными
   * ответами и повторить материал.
   */
  completed?: boolean;
  /** Преподаватель видит и скрытые блоки — с пометкой */
  canSeeHidden?: boolean;
  /** Преподавателю показываем образцы развёрнутых ответов */
  isTeacher?: boolean;
  /**
   * Проверка работы ученика: id ответа по ключу задания. В этом режиме
   * задания только для чтения, зато под каждым можно написать комментарий.
   */
  review?: Record<string, string>;
}) {
  // Показ правильных ответов пересоздаёт задания через key
  const [filled, setFilled] = useState(false);
  const [, startTransition] = useTransition();

  /**
   * Что уже отвечено и что сохранено. Несохранённый ответ — черновик: при
   * следующем заходе задание снова чистое, как и в домашней работе.
   */
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(
      Object.entries(answers).map(([key, answer]) => [
        key,
        { checked: true, correct: answer.isCorrect, kept: true },
      ]),
    ),
  );

  // Сброс делаем пересозданием задания: так очищаются и поля, и разбор
  const [resets, setResets] = useState<Record<string, number>>({});
  const [allReset, setAllReset] = useState(0);

  /** Ученик проверил задание — ответ уходит в базу черновиком */
  function check(key: string, value: string, correct: boolean) {
    if (!key) return;
    setStatus((prev) => ({ ...prev, [key]: { checked: true, correct, kept: false } }));
    if (!lessonId) return;

    startTransition(async () => {
      await saveLessonAnswersAction(lessonId, [
        { taskKey: key, value, isCorrect: correct },
      ]);
    });
  }

  /** Сохранение ответов: одного задания или сразу всех отвеченных */
  function keep(keys: string[]) {
    const list = keys.filter((key) => status[key]?.checked && !status[key]?.kept);
    if (!lessonId || list.length === 0) return;

    setStatus((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, item]) => [
          key,
          list.includes(key) ? { ...item, kept: true } : item,
        ]),
      ),
    );

    startTransition(async () => {
      await keepLessonAnswersAction(lessonId, list);
    });
  }

  /** Сброс одного задания */
  function resetTask(key: string) {
    setStatus((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setResets((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));

    if (!lessonId) return;
    startTransition(async () => {
      await resetLessonAnswersAction(lessonId, key);
    });
  }

  /** Сброс всего урока */
  function resetAll() {
    setStatus({});
    setAllReset((value) => value + 1);

    if (!lessonId) return;
    startTransition(async () => {
      await resetLessonAnswersAction(lessonId);
    });
  }

  // Скрытые блоки ученику не показываем. Из массива их не убираем:
  // ответы старых уроков привязаны к позиции блока, и сдвиг нумерации
  // отвязал бы работу ученика от задания.
  const visibleCount = canSeeHidden
    ? blocks.length
    : blocks.filter((b) => !b.hidden).length;
  const allKeys = blocks.flatMap((block, index) =>
    block.hidden && !canSeeHidden
      ? []
      : block.tasks.map((task, i) => taskKey(index, i, task)),
  );
  const answered = allKeys.filter((key) => status[key]?.checked).length;
  const correct = allKeys.filter((key) => status[key]?.correct).length;
  const kept = allKeys.filter((key) => status[key]?.kept).length;

  if (visibleCount === 0) {
    return (
      <div className="card p-8 text-center text-[14px] text-ink-500">
        В уроке пока нет материала.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allKeys.length > 0 ? (
        <div className="card sticky top-[72px] z-30 flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[14px] text-ink-600">
            Выполнено {answered} из {allKeys.length} · верно {correct}
          </p>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink-200">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{
                width: `${(answered / Math.max(allKeys.length, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      {completed ? (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[14px] text-ink-600">
            {filled
              ? "Показаны правильные ответы — пройдитесь по уроку и повторите материал."
              : "Урок пройден. Можно открыть его с правильными ответами."}
          </p>
          <button
            type="button"
            onClick={() => setFilled((value) => !value)}
            className={filled ? "btn-ghost btn-sm" : "btn-primary btn-sm"}
          >
            {filled ? "Очистить ответы" : "Заполнить ответы"}
          </button>
        </div>
      ) : null}

      {blocks.map((block, index) =>
        block.hidden && !canSeeHidden ? null : (
        <section
          key={index}
          className={`card p-5 sm:p-6 ${
            block.hidden ? "border-dashed opacity-60" : ""
          }`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`chip ${BLOCK_STYLES[block.kind]}`}>
              {BLOCK_NAMES[block.kind] ?? "Материал"}
            </span>
            {block.title ? (
              <h2 className="text-[17px] font-semibold text-ink-900">
                {block.title}
              </h2>
            ) : null}
            {block.hidden ? (
              <span className="chip bg-ink-100 text-ink-500">
                скрыт от ученика
              </span>
            ) : null}
          </div>

          {block.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="mb-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink-700"
            >
              {paragraph}
            </p>
          ))}

          {block.formulas.length > 0 ? (
            <div className="my-3 space-y-2">
              {block.formulas.map((formula, i) => (
                <div
                  key={i}
                  className="whitespace-pre-wrap rounded-xl border-l-4 border-brand-400 bg-brand-50/60 px-4 py-3 text-[14.5px] leading-relaxed text-ink-800"
                >
                  {formula}
                </div>
              ))}
            </div>
          ) : null}

          {block.rules.length > 0 ? (
            <ul className="my-3 space-y-1.5">
              {block.rules.map((rule, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[14.5px] leading-relaxed text-ink-700"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  {rule}
                </li>
              ))}
            </ul>
          ) : null}

          {block.prompts.length > 0 ? (
            <div className="my-3 flex flex-wrap gap-2">
              {block.prompts.map((prompt, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-[13.5px] text-ink-700"
                >
                  {prompt}
                </span>
              ))}
            </div>
          ) : null}

          {block.examples.map((example, i) => (
            <div
              key={i}
              className="my-3 rounded-xl bg-ink-50 px-4 py-3 text-[14px] italic text-ink-600"
            >
              {example}
            </div>
          ))}

          {block.audioUrl ? (
            <div className="my-4">
              <AudioPlayer src={block.audioUrl} title={block.audioTitle} />
            </div>
          ) : null}

          {block.videoUrl ? (
            <div className="my-4">
              <VideoPlayer
                src={block.videoUrl}
                title={block.videoTitle}
                subtitlesUrl={block.subtitlesUrl}
              />
            </div>
          ) : null}

          {/* У страницы учебника text — это подпись, её печатает TextbookPage */}
          {block.text && block.kind !== "page" ? (
            <div className="my-3 whitespace-pre-wrap rounded-xl border border-ink-200 bg-white px-4 py-3 text-[15px] leading-relaxed text-ink-800">
              {block.text}
            </div>
          ) : null}

          {block.transcript ? (
            <details className="my-3 rounded-xl border border-ink-200 bg-ink-50/60 px-4 py-3">
              <summary className="cursor-pointer text-[13.5px] font-medium text-ink-600">
                {/* Без аудио это не расшифровка, а текст для чтения вслух */}
                {block.audioUrl || block.videoUrl
                  ? "Показать транскрипцию"
                  : "Текст для чтения вслух"}
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-700">
                {block.transcript}
              </p>
            </details>
          ) : null}

          {block.vocab.length > 0 ? (
            <div className="my-2 grid gap-2 sm:grid-cols-2">
              {block.vocab.map((word, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border border-ink-200 bg-white px-3 py-2"
                >
                  <SpeakButton text={word.en} />
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-medium text-ink-900">
                      {word.en}
                    </p>
                    <p className="truncate text-[13.5px] text-ink-500">
                      {word.ru}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {block.kind === "page" && block.imageUrl ? (
            <TextbookPage
              key={`page-${filled ? "filled" : "empty"}-${allReset}`}
              block={block}
              blockIndex={index}
              answers={answers}
              status={status}
              canSave={Boolean(lessonId) && !review}
              review={review}
              comments={comments}
              filled={filled}
              onCheck={check}
              onKeep={keep}
              onReset={(keys: string[]) => keys.forEach(resetTask)}
            />
          ) : null}

          {isTeacher && block.sample ? (
            <details className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
              <summary className="cursor-pointer text-[13.5px] font-medium text-amber-900">
                Пример ответа · виден только преподавателю
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-amber-900">
                {block.sample}
              </p>
            </details>
          ) : null}

          {/* Задания, вынесенные на скан, снизу не повторяем */}
          {block.tasks.some((task) => task.x < 0) ? (
            <div className="mt-4 space-y-3">
              {block.tasks.map((task, i) =>
                block.kind === "page" && task.x >= 0 ? null : (
                  <PracticeTask
                    key={`${i}-${filled ? "filled" : "empty"}-${allReset}-${
                      resets[taskKey(index, i, task)] ?? 0
                    }`}
                    task={task}
                    index={i}
                    filled={filled}
                    initial={answers[taskKey(index, i, task)]}
                    kept={status[taskKey(index, i, task)]?.kept ?? false}
                    canSave={Boolean(lessonId) && !review}
                    answerId={review?.[taskKey(index, i, task)]}
                    review={Boolean(review)}
                    comment={comments[taskKey(index, i, task)] ?? ""}
                    onCheck={(value, ok) =>
                      check(taskKey(index, i, task), value, ok)
                    }
                    onKeep={() => keep([taskKey(index, i, task)])}
                    onReset={() => resetTask(taskKey(index, i, task))}
                  />
                ),
              )}
            </div>
          ) : null}
        </section>
        ),
      )}

      {lessonId && allKeys.length > 0 && !review ? (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[14px] text-ink-600">
            {kept > 0
              ? `Сохранено ответов: ${kept} из ${answered}. Сохранённые не пропадут, когда вы выйдете.`
              : "Ответы можно сохранить и вернуться к уроку позже — несохранённые пропадут при выходе."}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={answered === 0 || kept === answered}
              onClick={() => keep(allKeys)}
              className="btn-ghost btn-sm"
            >
              {answered > 0 && kept === answered
                ? "Всё сохранено"
                : "Сохранить ответы"}
            </button>

            <form action={resetAll}>
              <ConfirmSubmit
                className="btn-ghost btn-sm"
                pendingLabel="Сбрасываем…"
                title="Сбросить ответы?"
                message="Все ваши ответы в этом уроке будут удалены, и вы начнёте с чистого листа."
                confirmLabel="Сбросить"
              >
                Сбросить ответы
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Ширина поля по умолчанию — в процентах от ширины страницы */
const FIELD_WIDTH = 14;

/**
 * Скан страницы учебника с полями ответа прямо на нём.
 *
 * Ученик печатает в клетку упражнения, как в бумажном учебнике: поле стоит
 * там, где преподаватель поставил его в конструкторе. Координаты хранятся в
 * процентах, поэтому поля не разъезжаются на любом размере экрана.
 */
function TextbookPage({
  block,
  blockIndex,
  answers: saved,
  status,
  canSave,
  review,
  comments,
  filled,
  onCheck,
  onKeep,
  onReset,
}: {
  block: LessonBlock;
  blockIndex: number;
  /** Сохранённые ответы ученика по ключу задания */
  answers: Record<string, { value: string; isCorrect: boolean }>;
  status: Record<string, Status>;
  canSave: boolean;
  /** Проверка работы ученика: id ответа по ключу задания */
  review?: Record<string, string>;
  comments: Record<string, string>;
  /** Показать правильные ответы — для повторения пройденного урока */
  filled: boolean;
  onCheck: (key: string, value: string, correct: boolean) => void;
  onKeep: (keys: string[]) => void;
  onReset: (keys: string[]) => void;
}) {
  const placed = block.tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => task.x >= 0 && task.y >= 0);

  const keys = placed.map(({ task, index }) => taskKey(blockIndex, index, task));

  // Поля пустые, если ученик не сохранял ответы: урок можно прорешать заново.
  // Заполняем их также, когда он попросил показать ответы пройденного урока.
  const [answers, setAnswers] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      placed.map(({ task, index }) => [
        index,
        filled
          ? task.answer
          : (saved[taskKey(blockIndex, index, task)]?.value ?? ""),
      ]),
    ),
  );
  const [checked, setChecked] = useState(
    filled || keys.some((key) => saved[key]),
  );
  const kept = keys.length > 0 && keys.every((key) => status[key]?.kept);

  if (placed.length === 0) {
    return (
      <figure className="my-3">
        <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.imageUrl}
            alt={block.text || "Страница учебника"}
            className="block max-h-[720px] w-auto max-w-full"
          />
        </div>
        {block.text ? (
          <figcaption className="mt-2 text-[13px] text-ink-500">
            {block.text}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  const wrong = placed.filter(
    ({ task, index }) => !isAnswerCorrect(answers[index] ?? "", task.answer),
  );

  // Комментарии преподавателя показываем сразу, не дожидаясь проверки
  const notes = placed.flatMap(({ task, index }) => {
    const comment = comments[taskKey(blockIndex, index, task)] ?? "";
    return comment ? [{ index, comment }] : [];
  });

  return (
    <figure className="my-3">
      <div className="relative inline-block max-w-full overflow-hidden rounded-xl border border-ink-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.imageUrl}
          alt={block.text || "Страница учебника"}
          className="block max-h-[720px] w-auto max-w-full"
        />

        {placed.map(({ task, index }) => (
          <PageField
            key={index}
            task={task}
            number={index + 1}
            value={answers[index] ?? ""}
            checked={checked}
            onChange={(value) =>
              setAnswers((prev) => ({ ...prev, [index]: value }))
            }
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const next = !checked;
            setChecked(next);
            // Сохраняем при проверке: так в базу попадает осознанный ответ,
            // а не каждая буква по дороге
            if (next) {
              placed.forEach(({ task, index }) =>
                onCheck(
                  taskKey(blockIndex, index, task),
                  answers[index] ?? "",
                  isAnswerCorrect(answers[index] ?? "", task.answer),
                ),
              );
            }
          }}
          className="btn-ghost btn-sm"
        >
          {checked ? "Скрыть проверку" : "Проверить страницу"}
        </button>

        {checked && canSave && !filled ? (
          <>
            <button
              type="button"
              onClick={() => onKeep(keys)}
              disabled={kept}
              className="btn-ghost btn-sm"
            >
              {kept ? "✓ Страница сохранена" : "Сохранить страницу"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setChecked(false);
                onReset(keys);
              }}
              className="btn-ghost btn-sm"
            >
              Сбросить страницу
            </button>
          </>
        ) : null}

        {checked ? (
          <span
            className={`text-[13.5px] ${
              wrong.length === 0 ? "text-emerald-700" : "text-ink-600"
            }`}
          >
            {wrong.length === 0
              ? "✓ Все ответы верные"
              : `Верно ${placed.length - wrong.length} из ${placed.length}`}
          </span>
        ) : null}
      </div>

      {notes.length > 0 && !review ? (
        <div className="mt-3 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-[12.5px] font-medium text-amber-800">
            Комментарий преподавателя
          </p>
          {notes.map(({ index, comment }) => (
            <p key={index} className="text-[13.5px] text-amber-900">
              <b>{index + 1}.</b> {comment}
            </p>
          ))}
        </div>
      ) : null}

      {review ? (
        <div className="mt-3 space-y-3 rounded-xl border border-ink-200 bg-white px-4 py-3">
          {placed.map(({ task, index }) => {
            const key = taskKey(blockIndex, index, task);
            const value = answers[index] ?? "";

            return (
              <div key={index} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
                <p className="text-[13.5px] text-ink-700">
                  <b>{index + 1}.</b> ответ ученика:{" "}
                  {value ? (
                    <span
                      className={
                        isAnswerCorrect(value, task.answer)
                          ? "text-emerald-700"
                          : "text-rose-600"
                      }
                    >
                      {value}
                    </span>
                  ) : (
                    <span className="text-ink-400">пусто</span>
                  )}
                  {task.answer ? (
                    <span className="text-ink-400"> · верно: {task.answer}</span>
                  ) : null}
                </p>
                {review[key] ? (
                  <AnswerComment
                    answerId={review[key]}
                    comment={comments[key] ?? ""}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {checked && wrong.length > 0 ? (
        <div className="mt-2 space-y-1.5 rounded-xl bg-rose-50 px-4 py-3">
          {wrong.map(({ task, index }) => (
            <p key={index} className="text-[13.5px] text-rose-700">
              <b>{index + 1}.</b> правильный ответ: {task.answer || "—"}
              {task.explanation ? ` · ${task.explanation}` : ""}
            </p>
          ))}
        </div>
      ) : null}

      {block.text ? (
        <figcaption className="mt-2 text-[13px] text-ink-500">
          {block.text}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Одно поле ответа поверх скана: строка ввода или выпадающий список */
function PageField({
  task,
  number,
  value,
  checked,
  onChange,
}: {
  task: LessonTask;
  number: number;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  const correct = isAnswerCorrect(value, task.answer);

  const tone = !checked
    ? "border-brand-400 bg-white/95"
    : correct
      ? "border-emerald-500 bg-emerald-50/95 text-emerald-800"
      : "border-rose-400 bg-rose-50/95 text-rose-700";

  const options = task.options.filter(Boolean);

  return (
    <span
      style={{
        left: `${task.x}%`,
        top: `${task.y}%`,
        width: `${task.w || FIELD_WIDTH}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <span className="pointer-events-none absolute -left-5 top-1/2 hidden -translate-y-1/2 text-[11.5px] font-semibold text-brand-600 sm:block">
        {number}
      </span>

      {task.kind === "choice" && options.length > 0 ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          title={task.prompt}
          className={`w-full rounded-md border-2 px-1 py-0.5 text-[13px] shadow-sm outline-none ${tone}`}
        >
          <option value="">—</option>
          {options.map((option, i) => (
            <option key={i} value={task.optionValues[i] ?? option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          title={task.prompt}
          placeholder="…"
          autoComplete="off"
          className={`w-full rounded-md border-2 px-1.5 py-0.5 text-center text-[13px] shadow-sm outline-none ${tone}`}
        />
      )}
    </span>
  );
}

/** Задание внутри урока: проверяется на месте, ответ уходит в базу */
function PracticeTask({
  task,
  index,
  filled = false,
  initial,
  kept = false,
  canSave = false,
  comment = "",
  answerId,
  review = false,
  onCheck,
  onKeep,
  onReset,
}: {
  task: LessonTask;
  index: number;
  /** Показать правильный ответ — для повторения пройденного урока */
  filled?: boolean;
  /** Сохранённый ответ ученика: с ним задание открывается заполненным */
  initial?: { value: string; isCorrect: boolean };
  /** Ответ уже сохранён и переживёт выход из урока */
  kept?: boolean;
  /** Есть ли куда сохранять: в предпросмотре кнопок нет */
  canSave?: boolean;
  comment?: string;
  /** id ответа ученика — в режиме проверки под заданием появится поле */
  answerId?: string;
  review?: boolean;
  onCheck: (value: string, correct: boolean) => void;
  onKeep: () => void;
  onReset: () => void;
}) {
  const [value, setValue] = useState(
    filled ? task.answer : (initial?.value ?? ""),
  );
  const [checked, setChecked] = useState(filled || Boolean(initial));

  const correct = checked && isAnswerCorrect(value, task.answer);

  /** Сохраняем ответ в момент проверки — по нему преподаватель видит работу */
  function check(answer: string) {
    setChecked(true);
    onCheck(answer, isAnswerCorrect(answer, task.answer));
  }

  function pick(optionValue: string) {
    if (checked) return;
    setValue(optionValue);
    check(optionValue);
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4">
      <p className="text-[14.5px] font-medium text-ink-900">
        {index + 1}. {task.prompt}
      </p>

      {task.kind === "choice" ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {task.options.map((label, i) => {
            const optionValue = task.optionValues[i] ?? label;
            const picked = value === optionValue;
            const isRight =
              checked && isAnswerCorrect(optionValue, task.answer);

            return (
              <button
                key={i}
                type="button"
                disabled={checked}
                onClick={() => pick(optionValue)}
                className={`rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition ${
                  isRight
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : picked
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 disabled:opacity-60"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                check(value);
              }
            }}
            disabled={checked}
            placeholder="Ваш ответ…"
            autoComplete="off"
            className={`field flex-1 ${
              checked
                ? correct
                  ? "border-emerald-400"
                  : "field-error"
                : ""
            }`}
          />
          <button
            type="button"
            onClick={() => check(value)}
            disabled={checked || !value.trim()}
            className="btn-ghost sm:w-32"
          >
            Проверить
          </button>
        </div>
      )}

      {comment && !review ? (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13.5px] text-amber-900">
          <span className="font-medium">Комментарий преподавателя: </span>
          {comment}
        </p>
      ) : null}

      {review ? (
        answerId ? (
          <AnswerComment answerId={answerId} comment={comment} />
        ) : (
          <p className="mt-3 text-[13.5px] text-ink-500">
            Ученик пока не отвечал.
          </p>
        )
      ) : null}

      {checked ? (
        <div
          className={`mt-3 rounded-xl px-3.5 py-2.5 text-[14px] ${
            correct
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {correct ? "✓ Верно. " : `✕ Правильный ответ: ${task.answer}. `}
          {task.explanation}
        </div>
      ) : null}

      {checked && canSave && !filled ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onKeep}
            disabled={kept}
            className="btn-ghost btn-sm"
          >
            {kept ? "✓ Ответ сохранён" : "Сохранить ответ"}
          </button>
          <button
            type="button"
            onClick={() => {
              setChecked(false);
              setValue("");
              onReset();
            }}
            className="btn-ghost btn-sm"
          >
            Сбросить ответ
          </button>
        </div>
      ) : null}
    </div>
  );
}
