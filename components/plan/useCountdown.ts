"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Обратный отсчёт в секундах: старт, пауза, сброс; по нулю вызывает onDone */
export function useCountdown(seconds: number, onDone?: () => void) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endsAt = useRef(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const rest = Math.max(0, (endsAt.current - Date.now()) / 1000);
      setLeft(rest);
      if (rest <= 0) {
        clearInterval(timer);
        setRunning(false);
        doneRef.current?.();
      }
    }, 200);
    return () => clearInterval(timer);
  }, [running]);

  const start = useCallback(() => {
    endsAt.current = Date.now() + left * 1000;
    setRunning(true);
  }, [left]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(
    (next?: number) => {
      setRunning(false);
      setLeft(next ?? seconds);
    },
    [seconds],
  );

  const restart = useCallback(
    (next?: number) => {
      const total = next ?? seconds;
      endsAt.current = Date.now() + total * 1000;
      setLeft(total);
      setRunning(true);
    },
    [seconds],
  );

  return { left, running, start, pause, reset, restart };
}
