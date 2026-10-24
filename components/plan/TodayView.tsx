"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { drillById } from "@/lib/study/drills";
import { WEEKS, dayPlan, type DayKind, type DayTask } from "@/lib/study/schedule";
import { speakingTask } from "@/lib/study/speaking";
import {
  addDays,
  diffDays,
  exportState,
  importState,
  mondayOf,
  todayIso,
  useHydrated,
  useStudy,
  weekNumber,
  type StudyState,
} from "./study-store";

const SHORT_DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const ICONS: Record<DayKind, string> = {
  cards: "🗂",
  book: "📘",
  drill: "🧩",
  listen: "🎧",
  speak: "🎙",
  read: "📖",
  write: "✍️",
  errors: "🎯",
  immerse: "🎬",
  review: "📋",
  test: "📝",
};

function isDone(state: StudyState, task: DayTask, weekStart: string): boolean {
  if (state.done[task.id]) return true;
  const auto = task.auto ? state.done[task.auto] : undefined;
  return Boolean(auto && auto >= weekStart);
}

function weekCompletion(state: StudyState, weekIndex: number, start: string) {
  const week = WEEKS[weekIndex];
  const weekStart = addDays(start, weekIndex * 7);
  let total = 0;
  let done = 0;
  for (let day = 0; day < 7; day += 1) {
    for (const task of dayPlan(week, day).tasks) {
      total += 1;
      if (isDone(state, task, weekStart)) done += 1;
    }
  }
  return { total, done };
}

function streak(state: StudyState, today: string): number {
  const days = new Set<string>();
  Object.values(state.done).forEach((value) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) days.add(value);
  });
  let cursor = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

function StartCard() {
  const [, update] = useStudy();
  const today = todayIso();
  // С четверга по воскресенье проще начать с ближайшего понедельника, чем с уже прошедшей недели
  const [date, setDate] = useState(() => (diffDays(mondayOf(today), today) >= 3 ? addDays(mondayOf(today), 7) : today));

  function start() {
    update((old) => ({ ...old, startDate: mondayOf(date) }));
  }

  return (
    <section className="card mx-auto max-w-xl space-y-4 p-6">
      <h2 className="text-[20px] font-semibold text-ink-900">Начать план на 24 недели</h2>
      <p className="text-[14.5px] leading-relaxed text-ink-700">
        Выберите дату старта. Неделя плана считается с понедельника, поэтому начало сдвинется на понедельник выбранной недели. Сегодняшний день, список заданий
        на неделю и прогресс будут считаться отсюда.
      </p>
      <label className="block">
        <span className="text-[13px] text-ink-500">Дата старта</span>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="field mt-1" />
      </label>
      <button type="button" onClick={start} disabled={!date} className="btn-primary">
        Начать
      </button>
      <p className="text-[13px] text-ink-500">
        Весь прогресс (отметки, ошибки, карточки, тексты) хранится в этом браузере. Резервную копию можно скачать внизу этой страницы.
      </p>
    </section>
  );
}

function Backup() {
  const [, update] = useStudy();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  function download() {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `moy-angliyskiy-${todayIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    setMessage(importState(await file.text()) ? "Копия загружена." : "Не удалось прочитать файл.");
  }

  function changeStart() {
    const value = window.prompt("Новая дата старта (ГГГГ-ММ-ДД). Прогресс останется, но недели пересчитаются.");
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      update((old) => ({ ...old, startDate: mondayOf(value) }));
    }
  }

  return (
    <details className="card p-5">
      <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">Резервная копия и дата старта</summary>
      <div className="mt-3 space-y-3 text-[14px] text-ink-700">
        <p>
          Прогресс хранится в этом браузере. Чтобы не потерять его (смена устройства, очистка данных) или перенести на другое устройство, скачайте копию и потом
          загрузите её там же.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={download} className="btn-ghost btn-sm">
            ⬇ Скачать копию
          </button>
          <button type="button" onClick={() => input.current?.click()} className="btn-ghost btn-sm">
            ⬆ Загрузить копию
          </button>
          <button type="button" onClick={changeStart} className="btn-ghost btn-sm">
            📅 Изменить дату старта
          </button>
          <input ref={input} type="file" accept="application/json" hidden onChange={(event) => upload(event.target.files?.[0])} />
        </div>
        {message ? <p className="text-emerald-700">{message}</p> : null}
        <p className="text-[12.5px] text-ink-500">Записи голоса в копию не входят: они лежат в браузере отдельно.</p>
      </div>
    </details>
  );
}

function TaskRow({ task, done, auto, onToggle }: { task: DayTask; done: boolean; auto: boolean; onToggle: () => void }) {
  return (
    <li className={`card flex flex-wrap items-start gap-3 p-4 ${done ? "bg-emerald-50/40" : ""}`}>
      <input
        type="checkbox"
        checked={done}
        disabled={auto}
        onChange={onToggle}
        aria-label={`Отметить: ${task.title}`}
        className="mt-1 h-5 w-5 shrink-0 accent-brand-600"
      />
      <div className="min-w-0 flex-1">
        <p className={`text-[15.5px] font-medium ${done ? "text-ink-500 line-through" : "text-ink-900"}`}>
          <span aria-hidden className="mr-1.5">
            {ICONS[task.kind]}
          </span>
          {task.title}
        </p>
        {task.detail ? <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-600">{task.detail}</p> : null}
        <p className="mt-1 text-[12.5px] text-ink-400">
          ≈ {task.minutes} мин{auto ? " · выполнено на платформе" : ""}
        </p>
      </div>
      {task.href ? (
        <Link href={task.href} className={`${done ? "btn-ghost" : "btn-primary"} btn-sm shrink-0`}>
          {done ? "Открыть снова" : "Открыть"}
        </Link>
      ) : null}
    </li>
  );
}

export function TodayView() {
  const hydrated = useHydrated();
  const [state, update] = useStudy();
  const today = todayIso();
  const [picked, setPicked] = useState<number | null>(null);

  if (!hydrated) return <div className="h-64" />;
  if (!state.startDate) return <StartCard />;

  const weekNo = weekNumber(state.startDate, today) ?? 0;

  if (weekNo < 1) {
    return (
      <div className="space-y-6">
        <section className="card space-y-3 p-6">
          <h1 className="text-[20px] font-semibold text-ink-900">План начнётся {new Date(state.startDate).toLocaleDateString("ru-RU")}</h1>
          <p className="text-[14.5px] text-ink-700">Хотите начать сегодня?</p>
          <button type="button" onClick={() => update((old) => ({ ...old, startDate: mondayOf(today) }))} className="btn-primary self-start">
            Начать с этой недели
          </button>
        </section>
        <Backup />
      </div>
    );
  }

  if (weekNo > WEEKS.length) {
    return (
      <div className="space-y-6">
        <section className="card space-y-3 p-6">
          <h1 className="text-[22px] font-semibold text-ink-900">24 недели позади 🎉</h1>
          <p className="text-[14.5px] leading-relaxed text-ink-700">
            Пройдите контрольный тест и сравните с первым результатом, потом выберите следующую цель: сертификат C1 Advanced, C2 или узкая профессиональная тема.
          </p>
          <div className="flex gap-2">
            <Link href="/plan#tests" className="btn-primary">
              К тесту
            </Link>
            <Link href="/plan" className="btn-ghost">
              К плану
            </Link>
          </div>
        </section>
        <Backup />
      </div>
    );
  }

  const week = WEEKS[weekNo - 1];
  const weekStart = addDays(state.startDate, (weekNo - 1) * 7);
  const todayIndex = Math.min(6, Math.max(0, diffDays(weekStart, today)));
  const dayIndex = picked ?? todayIndex;
  const day = dayPlan(week, dayIndex);
  const dayDate = addDays(weekStart, dayIndex);

  const rows = day.tasks.map((task) => ({
    task,
    manual: Boolean(state.done[task.id]),
    auto: !state.done[task.id] && isDone(state, task, weekStart),
  }));
  const doneCount = rows.filter((row) => row.manual || row.auto).length;
  const doneMinutes = rows.filter((row) => row.manual || row.auto).reduce((sum, row) => sum + row.task.minutes, 0);
  const totalMinutes = day.tasks.reduce((sum, task) => sum + task.minutes, 0);

  function toggle(task: DayTask) {
    update((old) => {
      const done = { ...old.done };
      if (done[task.id]) delete done[task.id];
      else done[task.id] = todayIso();
      return { ...old, done };
    });
  }

  const completion = weekCompletion(state, weekNo - 1, state.startDate);
  const dueErrors = Object.values(state.errors).filter((card) => card.box < 5 && card.due <= today).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wide text-brand-700">
            Неделя {weekNo} из {WEEKS.length}
          </p>
          <h1 className="page-title">{week.title}</h1>
          <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">{week.focus}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-amber-50 text-amber-700">🔥 серия: {streak(state, today)} дн.</span>
          <span className="chip bg-brand-50 text-brand-700">
            неделя: {completion.done} из {completion.total}
          </span>
          {dueErrors > 0 ? (
            <Link href="/plan/errors" className="chip bg-rose-50 text-rose-700">
              🎯 ошибок к повторению: {dueErrors}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {Array.from({ length: 7 }, (_, index) => {
          const date = addDays(weekStart, index);
          const plan = dayPlan(week, index);
          const done = plan.tasks.filter((task) => isDone(state, task, weekStart)).length;
          const active = index === dayIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setPicked(index)}
              className={`flex min-w-[6.5rem] shrink-0 flex-col rounded-xl border px-3 py-2 text-left transition ${
                active ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-brand-300"
              }`}
            >
              <span className="text-[13px] font-semibold">
                {SHORT_DAYS[index]}
                {date === today ? " · сегодня" : ""}
              </span>
              <span className={`text-[12px] ${active ? "text-white/80" : "text-ink-500"}`}>{plan.focus}</span>
              <span className={`mt-1 text-[12px] tabular-nums ${active ? "text-white/90" : "text-ink-500"}`}>
                {done} / {plan.tasks.length}
              </span>
            </button>
          );
        })}
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold text-ink-900">
            {day.name}, {new Date(dayDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}: {day.focus}
          </h2>
          <p className="text-[13.5px] text-ink-500">
            Сделано {doneCount} из {day.tasks.length} · ≈ {doneMinutes} из {totalMinutes} мин
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${(doneMinutes / Math.max(totalMinutes, 1)) * 100}%` }} />
        </div>
        <ul className="space-y-3">
          {rows.map(({ task, manual, auto }) => (
            <TaskRow key={task.id} task={task} done={manual || auto} auto={auto} onToggle={() => toggle(task)} />
          ))}
        </ul>
      </section>

      <section className="card space-y-2 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Вся неделя в одном месте</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {week.unit ? (
            <Link href={`/plan/units/${week.unit}`} className="rounded-xl border border-ink-200 p-3 hover:border-brand-300">
              <p className="text-[12.5px] text-ink-500">Юнит</p>
              <p className="text-[14.5px] font-medium text-ink-900">Empower C1, юнит {week.unit}</p>
            </Link>
          ) : null}
          {week.drills.map((id) => (
            <Link key={id} href={`/plan/grammar/${id}`} className="rounded-xl border border-ink-200 p-3 hover:border-brand-300">
              <p className="text-[12.5px] text-ink-500">Грамматика</p>
              <p className="text-[14.5px] font-medium text-ink-900">{drillById(id)?.title ?? id}</p>
            </Link>
          ))}
          {week.speaking.map((id) => (
            <Link key={id} href={`/plan/speaking/${id}`} className="rounded-xl border border-ink-200 p-3 hover:border-brand-300">
              <p className="text-[12.5px] text-ink-500">Говорение</p>
              <p className="text-[14.5px] font-medium text-ink-900">{speakingTask(id)?.title ?? id}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card space-y-2 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Все 24 недели</h2>
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
          {WEEKS.map((item, index) => {
            const stats = weekCompletion(state, index, state.startDate!);
            const percent = stats.total ? stats.done / stats.total : 0;
            const current = item.n === weekNo;
            return (
              <div
                key={item.n}
                title={`Неделя ${item.n}: ${item.title} — ${stats.done} из ${stats.total}`}
                className={`rounded-lg border px-1 py-1.5 text-center text-[12px] ${current ? "border-brand-600 ring-1 ring-brand-300" : "border-ink-200"}`}
                style={{ background: percent > 0 ? `color-mix(in oklab, var(--color-brand-500) ${Math.round(percent * 60)}%, transparent)` : undefined }}
              >
                <span className="font-semibold text-ink-900">{item.n}</span>
                <span className="block text-ink-500">{Math.round(percent * 100)}%</span>
              </div>
            );
          })}
        </div>
      </section>

      <Backup />
    </div>
  );
}
