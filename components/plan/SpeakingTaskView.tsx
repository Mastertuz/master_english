"use client";

import Link from "next/link";
import { useState } from "react";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { GENERAL_CHECKS } from "@/lib/study/speaking";
import type { SpeakingTask } from "@/lib/study/types";
import { CircumlocutionGame, RegisterGame, SpeedRound } from "./SpeakingGames";
import { clock, LocalRecorder } from "./LocalRecorder";
import { todayIso, useStudy } from "./study-store";
import { useCountdown } from "./useCountdown";

function PrepTimer({ seconds }: { seconds: number }) {
  const timer = useCountdown(seconds);
  if (seconds <= 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
      <span className="text-[14px] text-amber-700">
        ⏳ Подготовка: <b>{clock(timer.left)}</b> — подумайте, не пишите
      </span>
      {timer.running ? (
        <button type="button" onClick={timer.pause} className="btn-ghost btn-sm">
          Пауза
        </button>
      ) : (
        <button type="button" onClick={timer.start} className="btn-ghost btn-sm">
          {timer.left < seconds ? "Продолжить" : "Старт"}
        </button>
      )}
      <button type="button" onClick={() => timer.reset()} className="text-[13px] text-amber-700 hover:underline">
        Сбросить
      </button>
    </div>
  );
}

export function SpeakingTaskView({
  task,
  prevId,
  nextId,
}: {
  task: SpeakingTask;
  prevId?: string;
  nextId?: string;
}) {
  const [state, update] = useStudy();
  const [showSample, setShowSample] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [visited, setVisited] = useState<Record<number, boolean>>({});

  const progress = state.speaking[task.id];
  const checks = progress?.checks ?? {};
  const allChecks = [...GENERAL_CHECKS, ...(task.checks ?? [])];
  const finished = Boolean(state.done[`sp:${task.id}`]);

  function toggleCheck(text: string) {
    update((old) => {
      const current = old.speaking[task.id] ?? { times: 0, last: "", checks: {}, note: "" };
      return {
        ...old,
        speaking: {
          ...old.speaking,
          [task.id]: { ...current, checks: { ...current.checks, [text]: !current.checks[text] } },
        },
      };
    });
  }

  function saveNote(note: string) {
    update((old) => {
      const current = old.speaking[task.id] ?? { times: 0, last: "", checks: {}, note: "" };
      return { ...old, speaking: { ...old.speaking, [task.id]: { ...current, note } } };
    });
  }

  function markDone() {
    const today = todayIso();
    update((old) => {
      const current = old.speaking[task.id] ?? { times: 0, last: "", checks: {}, note: "" };
      return {
        ...old,
        done: { ...old.done, [`sp:${task.id}`]: today },
        speaking: {
          ...old.speaking,
          [task.id]: { ...current, times: current.times + 1, last: today },
        },
        minutes: { ...old.minutes, [today]: (old.minutes[today] ?? 0) + task.minutes },
      };
    });
  }

  return (
    <div className="space-y-6">
      <Link href="/plan/speaking" className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800">
        ← Все задания на говорение
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-brand-50 text-brand-700">{task.level}</span>
          <span className="chip bg-ink-100 text-ink-600">⏱ около {task.minutes} мин</span>
          {finished ? <span className="chip bg-emerald-50 text-emerald-700">✓ выполнено</span> : null}
          {progress && progress.times > 1 ? (
            <span className="chip bg-ink-100 text-ink-600">выполнено раз: {progress.times}</span>
          ) : null}
        </div>
        <h1 className="page-title mt-2">{task.title}</h1>
      </div>

      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Что делать</h2>
        <p className="text-[14.5px] leading-relaxed text-ink-700">{task.brief}</p>
        <div className="rounded-xl bg-brand-50/70 px-4 py-3">
          <p className="text-[12.5px] font-medium uppercase tracking-wide text-brand-700">Задание</p>
          <p className="mt-1 flex items-start gap-2 text-[16px] leading-relaxed text-ink-900">
            <span className="flex-1">{task.task}</span>
            <SpeakButton text={task.task} />
          </p>
        </div>
        <PrepTimer seconds={task.prepSec} />
      </section>

      {task.steps ? (
        <section className="space-y-3">
          <h2 className="text-[15px] font-semibold text-ink-900">Маршрут: идите по порядку</h2>
          <ol className="space-y-2">
            {task.steps.map((step, index) => {
              const open = openStep === index;
              return (
                <li key={step.title} className="card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenStep(open ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold ${
                          visited[index] ? "bg-emerald-600 text-white" : "bg-brand-50 text-brand-700"
                        }`}
                      >
                        {visited[index] ? "✓" : index + 1}
                      </span>
                      <span className="text-[15px] font-semibold text-ink-900">{step.title}</span>
                    </span>
                    <span className="text-ink-400">{open ? "▲" : "▼"}</span>
                  </button>
                  {open ? (
                    <div className="space-y-3 border-t border-ink-100 px-5 py-4">
                      <p className="text-[15px] leading-relaxed text-ink-800">{step.ask}</p>
                      {step.words ? (
                        <div className="flex flex-wrap gap-1.5">
                          {step.words.map(([en, ru]) => (
                            <span key={en} className="rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-[13px] text-ink-700">
                              <b className="font-medium text-ink-900">{en}</b>
                              <span className="text-ink-400"> — {ru}</span>
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVisited((old) => ({ ...old, [index]: true }));
                            setOpenStep(index + 1 < (task.steps?.length ?? 0) ? index + 1 : null);
                          }}
                          className="btn-primary btn-sm"
                        >
                          {index + 1 < task.steps!.length ? "Эта комната готова — дальше" : "Готово"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      {task.mode === "speed" ? <SpeedRound /> : null}
      {task.mode === "circumlocution" ? <CircumlocutionGame /> : null}
      {task.mode === "register" ? <RegisterGame /> : null}

      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Фразы, которые стоит использовать</h2>
        <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {task.phrases.map(([en, ru]) => (
            <li key={en} className="text-[14.5px] leading-snug">
              <span className="font-medium text-ink-900">{en}</span>
              <span className="text-ink-500"> — {ru}</span>
            </li>
          ))}
        </ul>
        {task.grammar ? (
          <div className="rounded-xl bg-amber-50/70 px-4 py-3 text-[13.5px] text-amber-700">
            <b>Грамматика в фокусе:</b> {task.grammar.join(" · ")}
          </div>
        ) : null}
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Запись</h2>
        <p className="text-[13.5px] text-ink-500">
          Нажмите «Начать запись» и говорите. Потом прослушайте и ответьте на вопросы самопроверки. Записи хранятся только в вашем браузере.
        </p>
        <LocalRecorder taskId={task.id} targetSec={task.minutes * 60} />
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Самопроверка после прослушивания</h2>
        <ul className="space-y-1">
          {allChecks.map((text) => (
            <li key={text}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-[14.5px] text-ink-800 hover:bg-ink-50">
                <input
                  type="checkbox"
                  checked={Boolean(checks[text])}
                  onChange={() => toggleCheck(text)}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                />
                <span>{text}</span>
              </label>
            </li>
          ))}
        </ul>
        <label className="block">
          <span className="text-[13px] text-ink-500">Что исправить в следующий раз (запомнится в этом браузере):</span>
          <textarea
            defaultValue={progress?.note ?? ""}
            onBlur={(event) => saveNote(event.target.value)}
            rows={2}
            className="field mt-1 w-full"
            placeholder="Например: пропускаю артикли, слишком долго думаю перед wish…"
          />
        </label>
      </section>

      <section className="card space-y-3 p-5">
        <button
          type="button"
          onClick={() => setShowSample((value) => !value)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-[15px] font-semibold text-ink-900">Образец ответа</h2>
          <span className="text-[13px] text-brand-700">{showSample ? "Скрыть" : "Показать (после своей записи)"}</span>
        </button>
        {showSample ? (
          <div className="space-y-2">
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-800">{task.sample}</p>
            <div className="flex items-center gap-2 text-[13px] text-ink-500">
              <SpeakButton text={task.sample.replace(/^[^:]*:\s*/, "")} />
              <span>Послушайте образец и повторите вслух вместе с диктором (шэдоуинг).</span>
            </div>
          </div>
        ) : (
          <p className="text-[13.5px] text-ink-500">
            Сначала запишите свой вариант, образец потом: иначе вы не узнаете, что у вас получается без подсказки.
          </p>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {prevId ? (
            <Link href={`/plan/speaking/${prevId}`} className="btn-ghost btn-sm">
              ← Предыдущее
            </Link>
          ) : null}
          {nextId ? (
            <Link href={`/plan/speaking/${nextId}`} className="btn-ghost btn-sm">
              Следующее →
            </Link>
          ) : null}
        </div>
        <button type="button" onClick={markDone} className="btn-primary">
          {finished ? "Отметить ещё раз" : "✓ Задание выполнено"}
        </button>
      </div>
    </div>
  );
}
