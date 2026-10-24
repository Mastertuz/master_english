"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SpeakButton } from "@/components/ui/SpeakButton";
import type { Cue } from "@/lib/study/cues";
import type { ListeningTrack } from "@/lib/study/types";
import { LocalRecorder } from "./LocalRecorder";
import { QuestionCard } from "./QuestionCard";
import { todayIso, useStudy } from "./study-store";

const RATES = [0.75, 0.9, 1, 1.15];

type Paragraph = { speaker: string; cues: { cue: Cue; index: number }[] };

function paragraphs(cues: Cue[]): Paragraph[] {
  const result: Paragraph[] = [];
  cues.forEach((cue, index) => {
    const last = result[result.length - 1];
    if (last && last.speaker === cue[2]) last.cues.push({ cue, index });
    else result.push({ speaker: cue[2], cues: [{ cue, index }] });
  });
  return result;
}

/**
 * Тренировка по записи из учебника: сначала слушаем и отвечаем без текста,
 * потом читаем транскрипт, повторяем фразы и пересказываем.
 */
export function ListeningPractice({ track, cues }: { track: ListeningTrack; cues: Cue[] }) {
  const [state, update] = useStudy();
  const audio = useRef<HTMLAudioElement>(null);
  const loop = useRef<number | null>(null);
  const [now, setNow] = useState(0);
  const [rate, setRate] = useState(1);
  const [showText, setShowText] = useState(false);
  const [loopIndex, setLoopIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const saved = state.listening[track.track];
  const finishedAt = state.done[`ls:${track.track}`];
  const blocks = useMemo(() => paragraphs(cues), [cues]);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    const onTime = () => {
      setNow(element.currentTime);
      const index = loop.current;
      if (index !== null && cues[index] && element.currentTime >= cues[index][1] - 0.05) {
        element.currentTime = cues[index][0];
      }
    };
    element.addEventListener("timeupdate", onTime);
    return () => element.removeEventListener("timeupdate", onTime);
  }, [cues]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

  function seek(index: number) {
    const element = audio.current;
    if (!element) return;
    element.currentTime = cues[index][0];
    element.playbackRate = rate;
    void element.play();
  }

  function toggleLoop(index: number) {
    const next = loopIndex === index ? null : index;
    loop.current = next;
    setLoopIndex(next);
    if (next !== null) seek(next);
  }

  function answer(questionIndex: number, value: string) {
    const next = { ...answers, [questionIndex]: value };
    setAnswers(next);
    if (Object.keys(next).length === track.questions.length) {
      const score = track.questions.filter(
        (item, index) => next[index] === item.options[item.answer],
      ).length;
      update((old) => ({
        ...old,
        listening: {
          ...old.listening,
          [track.track]: { score, total: track.questions.length, at: todayIso() },
        },
      }));
    }
  }

  function markDone() {
    const today = todayIso();
    update((old) => ({
      ...old,
      done: { ...old.done, [`ls:${track.track}`]: today },
      minutes: { ...old.minutes, [today]: (old.minutes[today] ?? 0) + 20 },
    }));
  }

  const answered = Object.keys(answers).length;
  const score = track.questions.filter((item, index) => answers[index] === item.options[item.answer]).length;
  const activeIndex = cues.findIndex((cue) => now >= cue[0] && now < cue[1]);

  return (
    <article className="card space-y-5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12.5px] font-medium uppercase tracking-wide text-brand-700">Запись {track.track.replace("-", ".")}</p>
          <h3 className="text-[17px] font-semibold text-ink-900">{track.title}</h3>
          <p className="text-[13px] text-ink-500">{track.where}</p>
        </div>
        {finishedAt ? <span className="chip bg-emerald-50 text-emerald-700">✓ пройдено</span> : null}
      </div>

      <p className="rounded-xl bg-brand-50/70 px-4 py-3 text-[14px] leading-relaxed text-ink-700">
        <b className="text-ink-900">Как слушать.</b> {track.focus}
      </p>

      <div className="space-y-2">
        <audio ref={audio} controls preload="metadata" src={track.audio} className="w-full" />
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-500">
          <span>Скорость:</span>
          {RATES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRate(value)}
              className={`rounded-lg border px-2.5 py-1 ${
                rate === value ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 bg-white hover:border-brand-300"
              }`}
            >
              ×{value}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        <h4 className="text-[15px] font-semibold text-ink-900">Шаг 1. Послушайте без текста и ответьте</h4>
        <div className="space-y-3">
          {track.questions.map((item, index) => (
            <QuestionCard
              key={item.q}
              number={index + 1}
              item={{
                id: `${track.track}-${index}`,
                q: item.q,
                options: item.options,
                answer: item.options[item.answer],
                why: item.why,
              }}
              value={answers[index] ?? null}
              onAnswer={(value) => answer(index, value)}
              seed={`ls-${track.track}`}
            />
          ))}
        </div>
        {answered === track.questions.length ? (
          <p className="text-[14.5px] font-medium text-ink-800">
            Результат: {score} из {track.questions.length}
            {saved && saved.score > score ? ` (лучший: ${saved.score})` : ""}
          </p>
        ) : saved ? (
          <p className="text-[13px] text-ink-500">Лучший прошлый результат: {saved.score} из {saved.total}</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-[15px] font-semibold text-ink-900">Шаг 2. Читайте текст и повторяйте вслух (шэдоуинг)</h4>
          <button type="button" onClick={() => setShowText((value) => !value)} className="btn-ghost btn-sm">
            {showText ? "Скрыть текст" : "Показать текст"}
          </button>
        </div>
        {showText ? (
          <div className="space-y-3 rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-[13px] text-ink-500">
              Нажмите на фразу — запись перемотается. Значок ⟳ включает повтор одной фразы: говорите вместе с диктором, пока не получится в том же темпе.
            </p>
            {blocks.map((block, blockIndex) => (
              <p key={blockIndex} className="text-[15px] leading-relaxed text-ink-800">
                {block.speaker ? <b className="mr-1.5 text-brand-700">{block.speaker}:</b> : null}
                {block.cues.map(({ cue, index }) => (
                  <span key={index} className="group">
                    <button
                      type="button"
                      onClick={() => seek(index)}
                      className={`rounded px-0.5 text-left transition hover:bg-brand-50 ${
                        activeIndex === index ? "bg-brand-100 text-ink-900" : ""
                      } ${loopIndex === index ? "underline decoration-brand-600 decoration-2" : ""}`}
                    >
                      {cue[3]}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLoop(index)}
                      title="Повторять эту фразу"
                      aria-label="Повторять эту фразу"
                      className={`mx-0.5 rounded px-1 text-[12px] ${
                        loopIndex === index
                          ? "inline-block bg-brand-600 text-white"
                          : activeIndex === index
                            ? "inline-block text-brand-700"
                            : "hidden text-ink-400 hover:text-brand-700 group-hover:inline-block"
                      }`}
                    >
                      ⟳
                    </button>{" "}
                  </span>
                ))}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-[13.5px] text-ink-500">Сначала ответьте на вопросы выше, потом открывайте текст.</p>
        )}
      </section>

      <section className="space-y-2">
        <h4 className="text-[15px] font-semibold text-ink-900">Фразы из записи</h4>
        <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {track.phrases.map(([en, ru]) => (
            <li key={en} className="flex items-start gap-2 text-[14.5px]">
              <SpeakButton text={en.replace(/…/g, "").trim()} />
              <span>
                <b className="font-medium text-ink-900">{en}</b>
                <span className="text-ink-500"> — {ru}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[12.5px] text-ink-400">Эти фразы автоматически попадают в карточки для повторения («Слова»).</p>
      </section>

      <section className="space-y-3">
        <h4 className="text-[15px] font-semibold text-ink-900">Шаг 3. Перескажите своими словами</h4>
        <p className="text-[14px] text-ink-600">
          Не глядя в текст, расскажите за 1–2 минуты, о чём была запись: кто говорил, что сказал, какую позицию занял. Используйте хотя бы три фразы из списка.
        </p>
        <LocalRecorder taskId={`listen-${track.track}`} targetSec={90} />
      </section>

      <div className="flex justify-end">
        <button type="button" onClick={markDone} className="btn-primary">
          {finishedAt ? "Отметить ещё раз" : "✓ Запись пройдена"}
        </button>
      </div>
    </article>
  );
}
