"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WritingTask } from "@/lib/study/types";
import { clock } from "./LocalRecorder";
import { todayIso, useHydrated, useStudy } from "./study-store";
import { useCountdown } from "./useCountdown";

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function minWords(range: string): number {
  const match = /(\d+)/.exec(range);
  return match ? Number(match[1]) : 100;
}

function Editor({ task, initial }: { task: WritingTask; initial: string }) {
  const [state, update] = useStudy();
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(true);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [showSample, setShowSample] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useCountdown(40 * 60);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);

  const words = wordCount(text);
  const target = minWords(task.words);
  const done = state.done[`wr:${task.id}`];

  function persist(value: string) {
    update((old) => ({
      ...old,
      writing: { ...old.writing, [task.id]: { text: value, at: new Date().toISOString() } },
    }));
    setSaved(true);
  }

  function change(value: string) {
    setText(value);
    setSaved(false);
    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(() => persist(value), 1500);
  }

  useEffect(() => {
    return () => {
      if (pending.current) clearTimeout(pending.current);
    };
  }, []);

  function finish() {
    if (pending.current) clearTimeout(pending.current);
    persist(text);
    const today = todayIso();
    update((old) => ({
      ...old,
      done: { ...old.done, [`wr:${task.id}`]: today },
      minutes: { ...old.minutes, [today]: (old.minutes[today] ?? 0) + 30 },
    }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // буфер обмена недоступен: текст всё равно сохранён
    }
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Задание</h2>
        <p className="rounded-xl bg-brand-50/70 px-4 py-3 text-[15.5px] leading-relaxed text-ink-900">{task.task}</p>
        <ul className="list-disc space-y-1 pl-5 text-[14.5px] leading-relaxed text-ink-800">
          {task.plan.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wide text-ink-500">Полезные фразы</p>
          <ul className="mt-1 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {task.phrases.map(([en, ru]) => (
              <li key={en} className="text-[14.5px]">
                <span className="font-medium text-ink-900">{en}</span>
                <span className="text-ink-500"> — {ru}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink-900">Ваш текст</h2>
          <div className="flex flex-wrap items-center gap-3 text-[13.5px] text-ink-600">
            <span className="tabular-nums">
              Слов: <b className={words >= target ? "text-emerald-700" : "text-ink-900"}>{words}</b> ({task.words})
            </span>
            <span className="flex items-center gap-1.5">
              ⏱ <b className="tabular-nums">{clock(timer.left)}</b>
              {timer.running ? (
                <button type="button" onClick={timer.pause} className="text-brand-700 hover:underline">
                  пауза
                </button>
              ) : (
                <button type="button" onClick={timer.start} className="text-brand-700 hover:underline">
                  {timer.left < 40 * 60 ? "продолжить" : "40 минут"}
                </button>
              )}
            </span>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(event) => change(event.target.value)}
          onBlur={() => {
            if (!saved) persist(text);
          }}
          rows={16}
          spellCheck
          className="field w-full leading-relaxed"
          placeholder="Пишите здесь. Текст сохраняется на этом устройстве автоматически."
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-500">
          <span>{saved ? "Сохранено на этом устройстве" : "Сохраняется…"}</span>
          <button type="button" onClick={copy} className="text-brand-700 hover:underline">
            {copied ? "Скопировано" : "Скопировать текст (чтобы отправить на проверку)"}
          </button>
        </div>
      </section>

      <section className="card space-y-2 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Проверка перед сдачей</h2>
        <ul className="space-y-1">
          {task.checklist.map((item) => (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-[14.5px] text-ink-800 hover:bg-ink-50">
                <input
                  type="checkbox"
                  checked={Boolean(checks[item])}
                  onChange={() => setChecks((old) => ({ ...old, [item]: !old[item] }))}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-ink-500">
          Совет: найденные ошибки добавьте в «Журнал ошибок» (кнопка «Добавить свою ошибку»), чтобы они возвращались на повторение.
        </p>
      </section>

      {task.sample ? (
        <section className="card space-y-3 p-5">
          <button
            type="button"
            onClick={() => setShowSample((value) => !value)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="text-[15px] font-semibold text-ink-900">Образец</h2>
            <span className="text-[13px] text-brand-700">{showSample ? "Скрыть" : "Показать (после своего текста)"}</span>
          </button>
          {showSample ? (
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-800">{task.sample}</p>
          ) : (
            <p className="text-[13.5px] text-ink-500">Сначала напишите свой текст. Образец показывает уровень и структуру, а не единственно верный ответ.</p>
          )}
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/plan/writing" className="btn-ghost btn-sm">
          ← Все задания
        </Link>
        <button type="button" onClick={finish} disabled={words < Math.round(target * 0.6)} className="btn-primary">
          {done ? "Отметить ещё раз" : "✓ Текст готов"}
        </button>
      </div>
    </div>
  );
}

export function WritingTaskView({ task }: { task: WritingTask }) {
  const hydrated = useHydrated();
  const [state] = useStudy();

  return (
    <div className="space-y-6">
      <Link href="/plan/writing" className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800">
        ← Все задания на письмо
      </Link>
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-brand-50 text-brand-700">{task.type}</span>
          <span className="chip bg-ink-100 text-ink-600">{task.words}</span>
          {state.done[`wr:${task.id}`] ? <span className="chip bg-emerald-50 text-emerald-700">✓ готово</span> : null}
        </div>
        <h1 className="page-title mt-2">{task.title}</h1>
      </div>
      {hydrated ? <Editor task={task} initial={state.writing[task.id]?.text ?? ""} /> : null}
    </div>
  );
}
