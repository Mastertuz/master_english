"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Длительность бывает NaN или Infinity, пока метаданные не прочитаны */
function safeDuration(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Плеер для заданий на аудирование: перемотка, скорость, повтор */
export function AudioPlayer({
  src,
  title,
}: {
  src: string;
  title?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Пока ползунок тянут, время из аудио не подставляем: иначе бегунок
  // дёргался бы назад между событиями timeupdate
  const scrubbing = useRef(false);

  /**
   * Подписываемся на события кодом, а не через пропсы JSX.
   *
   * Браузер начинает грузить дорожку сразу с разметкой, поэтому
   * loadedmetadata часто случается ещё до гидратации — обработчик в JSX
   * такое событие просто не увидит, и длительность остаётся нулевой,
   * а с ней и ползунок: max = 0. Поэтому при подписке сразу считываем
   * то, что аудио уже знает о себе.
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (!scrubbing.current) setCurrent(audio.currentTime);
    };
    const onMeta = () => setDuration(safeDuration(audio.duration));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrent(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("seeked", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    // Метаданные могли прийти до того, как мы подписались
    onMeta();
    onTime();

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("seeked", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, [rate]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    // playing переключат сами события play/pause
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  /** Ставим время и в аудио, и на экран — ползунок управляемый */
  const moveTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const limit = safeDuration(audio.duration);
    if (limit === 0) return; // метаданные ещё не прочитаны, перематывать некуда

    const next = Math.min(Math.max(seconds, 0), limit);

    audio.currentTime = next;
    setCurrent(next);
  }, []);

  const format = (value: number) => {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-4">
      {title ? (
        <p className="mb-3 text-[13.5px] font-medium text-ink-700">{title}</p>
      ) : null}

      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Пауза" : "Слушать"}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
        >
          {playing ? "❚❚" : "▶"}
        </button>

        <button
          type="button"
          onClick={() => moveTo(current - 5)}
          className="btn-ghost btn-sm"
          title="Назад на 5 секунд"
        >
          −5с
        </button>
        <button
          type="button"
          onClick={() => moveTo(current + 5)}
          className="btn-ghost btn-sm"
          title="Вперёд на 5 секунд"
        >
          +5с
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[12.5px] tabular-nums text-ink-500">
            {format(current)} / {format(duration)}
          </span>
          <select
            value={rate}
            onChange={(event) => setRate(Number(event.target.value))}
            aria-label="Скорость воспроизведения"
            className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-[12.5px] text-ink-700"
          >
            <option value={0.75}>0.75×</option>
            <option value={1}>1×</option>
            <option value={1.25}>1.25×</option>
          </select>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 1}
        step={0.05}
        value={current}
        onPointerDown={() => {
          scrubbing.current = true;
        }}
        onPointerUp={() => {
          scrubbing.current = false;
        }}
        onKeyDown={() => {
          scrubbing.current = true;
        }}
        onKeyUp={() => {
          scrubbing.current = false;
        }}
        onChange={(event) => moveTo(Number(event.target.value))}
        aria-label="Позиция воспроизведения"
        /*
          Атрибут disabled здесь не ставим, хотя до чтения метаданных тянуть
          нечего: некоторые браузеры и расширения вырезают его из разметки до
          гидратации, и React падает с ошибкой несовпадения. Пока длительность
          неизвестна, ползунок просто бледный, а moveTo всё равно упрётся в 0.
        */
        className={`mt-3 w-full accent-brand-600 ${
          duration === 0 ? "cursor-default opacity-50" : "cursor-pointer"
        }`}
      />
    </div>
  );
}
