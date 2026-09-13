"use client";

import { useEffect, useState } from "react";

const LIMIT_SEC = 120 * 60;

function format(seconds: number): string {
  const whole = Math.max(0, seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = whole % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

/**
 * Таймер письменной части — 120 минут, как на экзамене. Время старта
 * хранится в браузере, поэтому переживает перезагрузку страницы.
 * Ничего не блокирует: это ориентир для ученика.
 */
export function ExamTimer({ id }: { id: string }) {
  const storageKey = `oge-timer-${id}`;
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = () => {
      let value: number | null = null;
      try {
        const stored = Number(localStorage.getItem(storageKey));
        value = stored > 0 ? stored : null;
      } catch {
        value = null;
      }
      setStartedAt(value);
      setNow(Date.now());
    };

    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [storageKey]);

  function start() {
    const value = Date.now();
    try {
      localStorage.setItem(storageKey, String(value));
    } catch {
      // без хранилища таймер просто не переживёт перезагрузку
    }
    setStartedAt(value);
    setNow(value);
  }

  function reset() {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // нечего удалять
    }
    setStartedAt(null);
  }

  if (!startedAt) {
    return (
      <button type="button" onClick={start} className="btn-ghost btn-sm">
        ⏱ Засечь 120 минут
      </button>
    );
  }

  const left = LIMIT_SEC - Math.floor((now - startedAt) / 1000);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`chip tabular-nums ${
          left <= 0
            ? "bg-rose-50 text-rose-700"
            : left < 10 * 60
              ? "bg-amber-50 text-amber-700"
              : "bg-ink-100 text-ink-700"
        }`}
      >
        {left <= 0 ? "Время вышло" : `Осталось ${format(left)}`}
      </span>
      <button type="button" onClick={reset} className="btn-ghost btn-sm">
        Сбросить
      </button>
    </div>
  );
}
