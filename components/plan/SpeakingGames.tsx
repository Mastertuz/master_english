"use client";

import { useEffect, useRef, useState } from "react";
import { stableOrder, shuffle } from "@/lib/answer";
import {
  CIRCUMLOCUTION_WORDS,
  REGISTER_ITEMS,
  SPEED_QUESTIONS,
} from "@/lib/study/speaking-games";
import { clock } from "./LocalRecorder";
import { useCountdown } from "./useCountdown";

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
      <div
        className={`h-full rounded-full transition-all ${value < 20 ? "bg-rose-500" : "bg-brand-600"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/** Блиц: вопрос за вопросом, по 45 секунд, само переключается */
export function SpeedRound({ rounds = 20, seconds = 45 }: { rounds?: number; seconds?: number }) {
  const [order, setOrder] = useState(() =>
    stableOrder("speed", SPEED_QUESTIONS.length).slice(0, rounds),
  );
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  // Таймер вызывает «дальше» по окончании времени; сама функция знает о таймере,
  // поэтому передаём её через ref, а не напрямую
  const advanceRef = useRef<() => void>(() => {});
  const timer = useCountdown(seconds, () => advanceRef.current());

  function advance(from: number) {
    if (from + 1 >= order.length) {
      setFinished(true);
      return;
    }
    setIndex(from + 1);
    timer.restart(seconds);
  }

  useEffect(() => {
    advanceRef.current = () => advance(index);
  });

  function reshuffle() {
    setOrder(shuffle(Array.from({ length: SPEED_QUESTIONS.length }, (_, i) => i)).slice(0, rounds));
    setIndex(0);
    setFinished(false);
    timer.reset(seconds);
  }

  if (finished) {
    return (
      <div className="card space-y-3 p-6 text-center">
        <p className="text-[18px] font-semibold text-ink-900">Раунд пройден: {order.length} вопросов 🎉</p>
        <p className="text-[14.5px] text-ink-600">Запишите на диктофон следующий круг, чтобы сравнить беглость.</p>
        <button type="button" onClick={reshuffle} className="btn-primary">
          Новый раунд
        </button>
      </div>
    );
  }

  return (
    <div className="card space-y-4 p-6">
      <div className="flex items-center justify-between text-[13px] text-ink-500">
        <span>
          Вопрос {index + 1} из {order.length}
        </span>
        <button type="button" onClick={reshuffle} className="hover:text-brand-700">
          🔀 Перемешать
        </button>
      </div>
      <p className="min-h-[3.5rem] text-[22px] font-semibold leading-snug text-ink-900">
        {SPEED_QUESTIONS[order[index]]}
      </p>
      <Bar value={(timer.left / seconds) * 100} />
      <div className="flex flex-wrap items-center gap-2">
        {timer.running ? (
          <button type="button" onClick={timer.pause} className="btn-ghost">
            ⏸ Пауза
          </button>
        ) : (
          <button type="button" onClick={timer.start} className="btn-primary">
            ▶ {timer.left < seconds ? "Продолжить" : "Старт"}
          </button>
        )}
        <button type="button" onClick={() => advance(index)} className="btn-ghost">
          Следующий вопрос →
        </button>
        <span className="ml-auto text-[18px] font-medium tabular-nums text-ink-700">{clock(timer.left)}</span>
      </div>
      <p className="text-[13px] text-ink-500">
        Не ищите идеальный ответ: если застряли, скажите «Let me think…» и продолжайте.
      </p>
    </div>
  );
}

/** Объяснить слово, не называя его */
export function CircumlocutionGame({ seconds = 30 }: { seconds?: number }) {
  const [order, setOrder] = useState(() => stableOrder("circum", CIRCUMLOCUTION_WORDS.length));
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState(false);
  const timer = useCountdown(seconds);

  const [word, gloss] = CIRCUMLOCUTION_WORDS[order[index % order.length]];

  function next() {
    setIndex((value) => value + 1);
    setHint(false);
    timer.reset(seconds);
  }

  return (
    <div className="card space-y-4 p-6">
      <div className="flex items-center justify-between text-[13px] text-ink-500">
        <span>Карточка {index + 1}</span>
        <button
          type="button"
          onClick={() => {
            setOrder(shuffle(Array.from({ length: CIRCUMLOCUTION_WORDS.length }, (_, i) => i)));
            setIndex(0);
            setHint(false);
            timer.reset(seconds);
          }}
          className="hover:text-brand-700"
        >
          🔀 Перемешать
        </button>
      </div>
      <p className="text-[13px] uppercase tracking-wide text-ink-500">Объясните это слово, не называя его:</p>
      <p className="text-[34px] font-bold text-brand-700">{word}</p>
      {hint ? <p className="text-[14.5px] text-ink-600">По-русски: {gloss}</p> : null}
      <Bar value={(timer.left / seconds) * 100} />
      <div className="flex flex-wrap items-center gap-2">
        {timer.running ? (
          <button type="button" onClick={timer.pause} className="btn-ghost">
            ⏸ Пауза
          </button>
        ) : (
          <button type="button" onClick={timer.start} className="btn-primary">
            ▶ Старт
          </button>
        )}
        <button type="button" onClick={() => setHint(true)} className="btn-ghost">
          Подсказка
        </button>
        <button type="button" onClick={next} className="btn-ghost">
          Следующее слово →
        </button>
        <span className="ml-auto text-[18px] font-medium tabular-nums text-ink-700">{clock(timer.left)}</span>
      </div>
      <p className="text-[13px] text-ink-500">
        Нельзя: называть слово и однокоренные, переводить на русский. Можно: «it&apos;s a kind of…», «you use it to…», «it looks like… but…».
      </p>
    </div>
  );
}

/** Одна и та же мысль в трёх регистрах */
export function RegisterGame() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const item = REGISTER_ITEMS[index % REGISTER_ITEMS.length];

  return (
    <div className="card space-y-4 p-6">
      <p className="text-[13px] text-ink-500">
        Фраза {(index % REGISTER_ITEMS.length) + 1} из {REGISTER_ITEMS.length}
      </p>
      <p className="text-[13px] uppercase tracking-wide text-ink-500">Нейтрально:</p>
      <p className="text-[24px] font-semibold text-ink-900">{item.neutral}</p>
      <p className="text-[14.5px] text-ink-700">
        Скажите вслух эту мысль <b>разговорно</b>, затем <b>формально</b>. Потом нажмите «Показать образцы».
      </p>
      {show ? (
        <div className="space-y-2">
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[15px] text-emerald-700">
            <b>Разговорно:</b> {item.casual}
          </p>
          <p className="rounded-xl bg-brand-50 px-4 py-3 text-[15px] text-brand-700">
            <b>Формально:</b> {item.formal}
          </p>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {!show ? (
          <button type="button" onClick={() => setShow(true)} className="btn-primary">
            Показать образцы
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setIndex((value) => value + 1);
            setShow(false);
          }}
          className="btn-ghost"
        >
          Следующая фраза →
        </button>
      </div>
    </div>
  );
}
