"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WeekVideo } from "@/lib/study/videos";
import { LocalRecorder } from "./LocalRecorder";
import { SubmitForReview } from "./SubmitForReview";
import { todayIso, useHydrated, useStudy } from "./study-store";

function count(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function Editor({ video, week, initial, phrases }: { video: WeekVideo; week: number; initial: string; phrases: string }) {
  const [state, update] = useStudy();
  const [text, setText] = useState(initial);
  const [notes, setNotes] = useState(phrases);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = `vid:${video.id}`;
  const notesKey = `vidnotes:${video.id}`;
  const done = state.done[`vd:${video.id}`];

  function save(value: string, noteValue: string) {
    update((old) => ({
      ...old,
      writing: {
        ...old.writing,
        [key]: { text: value, at: new Date().toISOString() },
        [notesKey]: { text: noteValue, at: new Date().toISOString() },
      },
    }));
  }

  function schedule(value: string, noteValue: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save(value, noteValue), 1200);
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function finish() {
    save(text, notes);
    const today = todayIso();
    update((old) => ({
      ...old,
      done: { ...old.done, [`vd:${video.id}`]: today },
      minutes: { ...old.minutes, [today]: (old.minutes[today] ?? 0) + 45 },
    }));
  }

  const prompt = `Watch «${video.title}» by ${video.speaker} (${video.url}). Write a summary of 100–130 words in your own words: who is speaking, the main idea, two arguments or examples, and your opinion. Do not copy phrases from the subtitles.`;

  return (
    <div className="space-y-6">
      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Шаг 1. Посмотрите видео</h2>
        <p className="text-[14.5px] leading-relaxed text-ink-700">
          Откройте доклад, включите английские субтитры (кнопка «CC» в плеере). Первый раз просто смотрите и старайтесь понять общий смысл. Паузами не
          пользуйтесь.
        </p>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn-primary self-start">
          ▶ Открыть видео на TED
        </a>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Шаг 2. Посмотрите второй раз и выпишите фразы</h2>
        <p className="text-[14px] text-ink-600">
          Теперь можно ставить на паузу. Выпишите 5–8 выражений, которые вы бы хотели использовать сами (с кусочком контекста). Потом добавьте их в журнал
          ошибок или словарь.
        </p>
        <textarea
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value);
            schedule(text, event.target.value);
          }}
          rows={5}
          className="field w-full"
          placeholder={"Например:\nto bring a sense of … — привнести ощущение …"}
        />
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-ink-900">Шаг 3. Напишите краткое содержание (100–130 слов)</h2>
          <span className="text-[13.5px] tabular-nums text-ink-600">
            Слов: <b className={count(text) >= 100 ? "text-emerald-700" : "text-ink-900"}>{count(text)}</b>
          </span>
        </div>
        <p className="rounded-xl bg-brand-50/70 px-4 py-3 text-[14.5px] leading-relaxed text-ink-800">
          Закройте видео и субтитры. Напишите: кто говорит, главная мысль, два довода или примера, ваше мнение. Своими словами, не копируя субтитры.
        </p>
        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            schedule(event.target.value, notes);
          }}
          rows={9}
          className="field w-full leading-relaxed"
          placeholder="Write your summary here…"
        />
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-[15px] font-semibold text-ink-900">Шаг 4. Ответьте вслух на три вопроса (по минуте на каждый)</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-[14.5px] text-ink-800">
          {video.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
        <LocalRecorder taskId={`video-${video.id}`} targetSec={180} />
      </section>

      <SubmitForReview taskId={`video-${video.id}`} title={`Видео недели ${week}: ${video.title}`} prompt={prompt} text={text} kind="video" minWords={80} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/plan/today" className="btn-ghost btn-sm">
          ← К заданиям дня
        </Link>
        <button type="button" onClick={finish} disabled={count(text) < 60} className="btn-primary">
          {done ? "Отметить ещё раз" : "✓ Задание выполнено"}
        </button>
      </div>
    </div>
  );
}

export function VideoTaskView({ video, week }: { video: WeekVideo; week: number }) {
  const hydrated = useHydrated();
  const [state] = useStudy();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-brand-600 font-semibold text-white">Видео недели {week}</span>
          <span className="chip bg-ink-100 text-ink-600">TED · ≈ 10–20 мин</span>
          {state.done[`vd:${video.id}`] ? <span className="chip bg-emerald-50 text-emerald-700">✓ готово</span> : null}
        </div>
        <h1 className="page-title mt-2">{video.title}</h1>
        <p className="mt-1 text-[14.5px] text-ink-600">
          {video.speaker} · {video.why}
        </p>
      </div>
      {hydrated ? (
        <Editor
          video={video}
          week={week}
          initial={state.writing[`vid:${video.id}`]?.text ?? ""}
          phrases={state.writing[`vidnotes:${video.id}`]?.text ?? ""}
        />
      ) : null}
    </div>
  );
}
