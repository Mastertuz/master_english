"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  answerHomeworkAction,
  resetHomeworkAction,
  resetHomeworkTaskAction,
  saveHomeworkAnswersAction,
  submitHomeworkAction,
} from "@/app/actions/lessons";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { GradeForm } from "@/components/students/GradeForm";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { isAnswerCorrect } from "@/lib/answer";

export type HomeworkTaskView = {
  id: string;
  order: number;
  section: string;
  kind: "CHOICE" | "FILL" | "READING" | "LISTENING" | "TEACHER";
  prompt: string;
  text: string;
  audioUrl: string;
  transcript: string;
  options: string[];
  answer: string;
  explanation: string;
  rule: string;
  /** Скрыто от ученика: попадает сюда только для преподавателя */
  hidden?: boolean;
  saved: {
    /** id ответа — по нему преподаватель ставит оценку и пишет комментарий */
    id: string;
    value: string;
    isCorrect: boolean | null;
    grade: number | null;
    comment: string | null;
    /** Ученик сохранил ответ сам — тогда он переживает выход из задания */
    saved: boolean;
  } | null;
};

type Local = {
  value: string;
  checked: boolean;
  isCorrect: boolean | null;
  saving: boolean;
  /** Ответ сохранён и не пропадёт при следующем заходе */
  kept: boolean;
};

export function HomeworkRunner({
  tasks,
  homeworkId = "",
  submitted = false,
  readOnly = false,
  canSeeHidden = false,
  review = false,
}: {
  tasks: HomeworkTaskView[];
  homeworkId?: string;
  /** Работа отправлена на проверку — ответы сохраняются между заходами */
  submitted?: boolean;
  readOnly?: boolean;
  /** Преподавателю показываем и скрытые задания — с пометкой */
  canSeeHidden?: boolean;
  /** Проверка работы ученика: ответы чужие, зато можно оценить и написать */
  review?: boolean;
}) {
  const router = useRouter();

  /**
   * Возвращаем ответ на экран, если работа уже сдана или ученик сохранил
   * ответ сам. Всё остальное — черновик: при новом заходе задание чистое,
   * чтобы работу можно было прорешать ещё раз.
   */
  const [state, setState] = useState<Record<string, Local>>(() =>
    Object.fromEntries(
      tasks.map((task) => {
        const keep = submitted || readOnly || task.saved?.saved === true;

        return [
          task.id,
          keep && task.saved
            ? {
                value: task.saved.value,
                checked: true,
                isCorrect: task.saved.isCorrect,
                saving: false,
                kept: task.saved.saved,
              }
            : {
                value: "",
                checked: false,
                isCorrect: null,
                saving: false,
                kept: false,
              },
        ];
      }),
    ),
  );
  const [, startTransition] = useTransition();

  // После отправки задания только для чтения: работа ушла преподавателю.
  // В режиме проверки — тем более: ответы принадлежат ученику
  const locked = readOnly || submitted || review;

  /** Пустое состояние — им же начинается работа до отправки */
  function blank(): Record<string, Local> {
    return Object.fromEntries(
      tasks.map((task) => [
        task.id,
        { value: "", checked: false, isCorrect: null, saving: false, kept: false },
      ]),
    );
  }

  const sections = useMemo(() => {
    const map = new Map<string, HomeworkTaskView[]>();
    for (const task of tasks) {
      const list = map.get(task.section) ?? [];
      list.push(task);
      map.set(task.section, list);
    }
    return [...map.entries()];
  }, [tasks]);

  const auto = tasks.filter(
    (task) => task.kind !== "TEACHER" && !task.hidden,
  );
  const answered = auto.filter((task) => state[task.id]?.checked).length;
  const correct = auto.filter((task) => state[task.id]?.isCorrect === true).length;

  // Для сохранения считаем все ответы, в том числе развёрнутые
  const visible = tasks.filter((task) => !task.hidden);
  const answeredAll = visible.filter((task) => state[task.id]?.checked).length;
  const keptAll = visible.filter((task) => state[task.id]?.kept).length;

  function update(id: string, patch: Partial<Local>) {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function submit(task: HomeworkTaskView, rawValue?: string) {
    const value = rawValue ?? state[task.id]?.value ?? "";
    if (!value.trim() || locked) return;

    const isCorrect =
      task.kind === "TEACHER" ? null : isAnswerCorrect(value, task.answer);

    update(task.id, { value, checked: true, isCorrect, saving: true, kept: false });

    startTransition(async () => {
      await answerHomeworkAction({ taskId: task.id, value });
      update(task.id, { saving: false });
    });
  }

  /**
   * Сохранение одного ответа: он переживёт выход из задания.
   *
   * У развёрнутых ответов кнопки «Проверить» нет, поэтому текст сначала
   * записываем, а потом помечаем сохранённым — за одно нажатие.
   */
  function keep(task: HomeworkTaskView) {
    const value = state[task.id]?.value ?? "";
    const needsWrite = task.kind === "TEACHER";
    if (locked || !value.trim()) return;
    if (!needsWrite && !state[task.id]?.checked) return;

    update(task.id, { saving: true, checked: true, isCorrect: needsWrite ? null : state[task.id]?.isCorrect ?? null });

    startTransition(async () => {
      if (needsWrite) await answerHomeworkAction({ taskId: task.id, value });
      await saveHomeworkAnswersAction({ homeworkId, taskIds: [task.id] });
      update(task.id, { saving: false, kept: true });
    });
  }

  /** Сохранение всей работы разом — тем же способом, одним запросом */
  function keepAll() {
    if (locked || answeredAll === 0) return;

    const taskIds = visible
      .filter((task) => state[task.id]?.checked && !state[task.id]?.kept)
      .map((task) => task.id);

    startTransition(async () => {
      await saveHomeworkAnswersAction({ homeworkId, taskIds });
      setState((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([id, item]) => [
            id,
            item.checked ? { ...item, kept: true } : item,
          ]),
        ),
      );
    });
  }

  /** Сброс одного задания: поле снова пустое, сохранённый ответ удаляем */
  function reset(task: HomeworkTaskView) {
    if (locked) return;

    update(task.id, {
      value: "",
      checked: false,
      isCorrect: null,
      saving: false,
      kept: false,
    });

    startTransition(async () => {
      await resetHomeworkTaskAction(task.id);
    });
  }

  return (
    <div className="space-y-5">
      {auto.length > 0 ? (
        <div className="card sticky top-[72px] z-30 flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[14px] text-ink-600">
            Выполнено {answered} из {auto.length} · верно {correct}
          </p>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink-200">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${(answered / Math.max(auto.length, 1)) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      {sections.map(([section, sectionTasks]) => {
        const audio = sectionTasks.find((task) => task.audioUrl)?.audioUrl;
        const transcript = sectionTasks.find((task) => task.transcript)?.transcript;
        const reading = sectionTasks.find((task) => task.text)?.text;

        return (
          <section key={section} className="card p-5 sm:p-6">
            {section ? (
              <h2 className="mb-3 text-[16px] font-semibold text-ink-900">
                {section}
              </h2>
            ) : null}

            {audio ? (
              <div className="mb-4">
                <AudioPlayer src={audio} title="Прослушайте запись" />
              </div>
            ) : null}

            {reading ? (
              <div className="mb-4 whitespace-pre-wrap rounded-xl border border-ink-200 bg-white px-4 py-3 text-[15px] leading-relaxed text-ink-800">
                {reading}
              </div>
            ) : null}

            {transcript ? (
              <details className="mb-4 rounded-xl border border-ink-200 bg-ink-50/60 px-4 py-3">
                <summary className="cursor-pointer text-[13.5px] font-medium text-ink-600">
                  Показать транскрипцию (только для проверки)
                </summary>
                <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-700">
                  {transcript}
                </p>
              </details>
            ) : null}

            <div className="space-y-3">
              {sectionTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  local={state[task.id]}
                  readOnly={locked}
                  onChange={(value) => update(task.id, { value, kept: false })}
                  onSubmit={(value) => submit(task, value)}
                  onReset={() => reset(task)}
                  onKeep={() => keep(task)}
                  canSeeHidden={canSeeHidden}
                  review={review}
                />
              ))}
            </div>
          </section>
        );
      })}

      {homeworkId && !readOnly ? (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[14px] text-ink-600">
            {submitted
              ? "Работа отправлена преподавателю. Ответы сохранены."
              : keptAll > 0
                ? `Сохранено ответов: ${keptAll} из ${answeredAll}. Сохранённые не пропадут, когда вы выйдете.`
                : "Ответы можно сохранить и дорешать работу позже — несохранённые пропадут при выходе."}
          </p>

          <div className="flex flex-wrap gap-2">
            {submitted ? null : (
              <button
                type="button"
                disabled={answeredAll === 0 || keptAll === answeredAll}
                onClick={keepAll}
                className="btn-ghost btn-sm"
              >
                {keptAll === answeredAll && answeredAll > 0
                  ? "Всё сохранено"
                  : "Сохранить ответы"}
              </button>
            )}

            {submitted ? null : (
              <button
                type="button"
                disabled={answered === 0 && auto.length > 0}
                onClick={() =>
                  startTransition(async () => {
                    await submitHomeworkAction(homeworkId);
                    router.refresh();
                  })
                }
                className="btn-primary btn-sm"
              >
                Отправить на проверку
              </button>
            )}

            <form
              action={async () => {
                await resetHomeworkAction(homeworkId);
                // Чистим и то, что уже набрано на экране: иначе ответы
                // исчезли бы только из базы, а поля остались бы заполненными
                setState(blank());
                router.refresh();
              }}
            >
              <ConfirmSubmit
                className="btn-ghost btn-sm"
                pendingLabel="Сбрасываем…"
                title="Сбросить ответы?"
                message={
                  submitted
                    ? "Отправленная работа будет удалена вместе с ответами, и задание можно будет пройти заново."
                    : "Все ответы в этом задании будут удалены, и вы начнёте с чистого листа."
                }
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

function TaskCard({
  task,
  index,
  local,
  readOnly,
  onChange,
  onSubmit,
  onReset,
  onKeep,
  canSeeHidden,
  review,
}: {
  task: HomeworkTaskView;
  index: number;
  local: Local;
  readOnly: boolean;
  onChange: (value: string) => void;
  onSubmit: (value?: string) => void;
  onReset: () => void;
  onKeep: () => void;
  canSeeHidden: boolean;
  review: boolean;
}) {
  const checked = local?.checked ?? false;
  const isCorrect = local?.isCorrect ?? null;
  const kept = local?.kept ?? false;
  const [showSample, setShowSample] = useState(false);

  if (task.kind === "TEACHER") {
    return (
      <div
        className={`rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-4 ${
          task.hidden ? "opacity-70" : ""
        }`}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="chip bg-amber-100 text-amber-800">
            Проверяет преподаватель
          </span>
          {task.hidden && canSeeHidden ? (
            <span className="chip bg-ink-100 text-ink-500">
              скрыто от ученика
            </span>
          ) : null}
          {task.rule ? (
            <span className="chip bg-ink-100 text-ink-600">{task.rule}</span>
          ) : null}
          {task.saved?.grade != null ? (
            <span className="chip bg-emerald-100 text-emerald-800">
              Оценка: {task.saved.grade}
            </span>
          ) : task.saved?.comment ? (
            // Преподаватель ответил комментарием без оценки — работа проверена
            <span className="chip bg-emerald-100 text-emerald-800">Проверено</span>
          ) : readOnly ? (
            <span className="chip bg-brand-50 text-brand-700">На проверке</span>
          ) : kept ? (
            <span className="chip bg-emerald-50 text-emerald-700">Сохранено</span>
          ) : null}
        </div>

        <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink-800">
          {task.prompt}
        </p>

        <textarea
          value={local?.value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          disabled={readOnly}
          rows={5}
          placeholder="Ваш ответ…"
          className="field mt-3 resize-y bg-white"
        />

        {task.saved?.comment && !review ? (
          <div className="mt-3 rounded-xl bg-white px-3.5 py-2.5 text-[14px] text-ink-700">
            <span className="font-medium">Комментарий преподавателя: </span>
            {task.saved.comment}
          </div>
        ) : null}

        {review && task.saved ? (
          <GradeForm
            answerId={task.saved.id}
            grade={task.saved.grade}
            comment={task.saved.comment}
          />
        ) : null}

        {review && !task.saved ? (
          <p className="mt-3 text-[13.5px] text-ink-500">Ученик пока не отвечал.</p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Кнопка появляется, только когда есть что сохранять */}
          {!readOnly && (local?.value ?? "").trim() ? (
            <button
              type="button"
              onClick={onKeep}
              disabled={kept || local?.saving}
              className={kept ? "btn-ghost btn-sm" : "btn-primary btn-sm"}
            >
              {local?.saving
                ? "Сохраняем…"
                : kept
                  ? "✓ Ответ сохранён"
                  : "Сохранить ответ"}
            </button>
          ) : null}
          {task.explanation ? (
            <button
              type="button"
              onClick={() => setShowSample((value) => !value)}
              className="btn-ghost btn-sm"
            >
              {showSample ? "Скрыть пример" : "Показать пример ответа"}
            </button>
          ) : null}
          {checked && !readOnly ? (
            <button
              type="button"
              onClick={onReset}
              disabled={local?.saving}
              className="btn-ghost btn-sm"
            >
              Сбросить ответ
            </button>
          ) : null}
        </div>

        {showSample && task.explanation ? (
          <div className="mt-3 rounded-xl bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-ink-600">
            {task.explanation}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border bg-white p-4 ${
        task.hidden ? "border-dashed border-ink-300 opacity-70" : "border-ink-200"
      }`}
    >
      {task.hidden && canSeeHidden ? (
        <span className="chip mb-2 bg-ink-100 text-ink-500">
          скрыто от ученика
        </span>
      ) : null}
      <p className="text-[14.5px] font-medium text-ink-900">
        {index + 1}. {task.prompt}
      </p>

      {task.options.length > 0 ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {task.options.map((option, i) => {
            const picked = local?.value === option;
            const right = checked && isAnswerCorrect(option, task.answer);

            return (
              <button
                key={i}
                type="button"
                disabled={checked || readOnly}
                onClick={() => onSubmit(option)}
                className={`rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition ${
                  right
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : picked
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 disabled:opacity-60"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={local?.value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
            disabled={checked || readOnly}
            placeholder="Ваш ответ…"
            autoComplete="off"
            className={`field flex-1 ${
              checked ? (isCorrect ? "border-emerald-400" : "field-error") : ""
            }`}
          />
          {readOnly ? null : (
            <button
              type="button"
              onClick={() => onSubmit()}
              disabled={checked || !(local?.value ?? "").trim()}
              className="btn-ghost sm:w-32"
            >
              Проверить
            </button>
          )}
        </div>
      )}

      {checked ? (
        <div
          className={`mt-3 rounded-xl px-3.5 py-2.5 text-[14px] ${
            isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {isCorrect ? "✓ Верно. " : `✕ Правильный ответ: ${task.answer}. `}
          {task.explanation}
        </div>
      ) : null}

      {review ? (
        task.saved ? (
          <GradeForm
            answerId={task.saved.id}
            grade={task.saved.grade}
            comment={task.saved.comment}
            withGrade={false}
          />
        ) : (
          <p className="mt-3 text-[13.5px] text-ink-500">Ученик пока не отвечал.</p>
        )
      ) : null}

      {checked && !readOnly ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onKeep}
            disabled={kept || local?.saving}
            className="btn-ghost btn-sm"
          >
            {kept ? "✓ Ответ сохранён" : "Сохранить ответ"}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={local?.saving}
            className="btn-ghost btn-sm"
          >
            Сбросить ответ
          </button>
        </div>
      ) : null}
    </div>
  );
}
