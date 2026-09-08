"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Длительность бывает NaN или Infinity, пока метаданные не прочитаны */
function safeDuration(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function format(value: number): string {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Плеер для видео из учебника: перемотка, скорость, субтитры, полный экран.
 *
 * Собственные кнопки вместо нативных: так плеер выглядит одинаково во всех
 * браузерах и повторяет управление аудиоплеером, к которому ученик привык.
 */
export function VideoPlayer({
  src,
  title,
  subtitlesUrl = "",
}: {
  src: string;
  title?: string;
  /** Дорожка WebVTT рядом с видео; без неё кнопка субтитров не появляется */
  subtitlesUrl?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [subtitles, setSubtitles] = useState(false);

  // Пока ползунок тянут, время из видео не подставляем: иначе бегунок
  // дёргался бы назад между событиями timeupdate
  const scrubbing = useRef(false);

  /**
   * Подписываемся на события кодом: метаданные часто успевают загрузиться
   * до гидратации, и обработчик, повешенный пропсом JSX, такое событие уже
   * не увидит — длительность осталась бы нулевой вместе с ползунком.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (!scrubbing.current) setCurrent(video.currentTime);
    };
    const onMeta = () => setDuration(safeDuration(video.duration));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrent(video.duration || 0);
    };

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("seeked", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    onMeta();
    onTime();

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("seeked", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = rate;
  }, [rate]);

  // Дорожкой субтитров управляем через API: атрибут default сработал бы
  // только один раз, при первой загрузке
  useEffect(() => {
    const video = videoRef.current;
    const track = video?.textTracks?.[0];
    if (track) track.mode = subtitles ? "showing" : "hidden";
  }, [subtitles, subtitlesUrl]);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  /** Ставим время и в видео, и на экран — ползунок управляемый */
  const moveTo = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const limit = safeDuration(video.duration);
    if (limit === 0) return; // метаданные ещё не прочитаны, перематывать некуда

    const next = Math.min(Math.max(seconds, 0), limit);
    video.currentTime = next;
    setCurrent(next);
  }, []);

  function fullscreen() {
    const video = videoRef.current;
    if (!video) return;

    // На iPhone полноэкранный режим только у самого видео, а не у контейнера
    const webkit = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (video.requestFullscreen) void video.requestFullscreen();
    else webkit.webkitEnterFullscreen?.();
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-4">
      {title ? (
        <p className="mb-3 text-[13.5px] font-medium text-ink-700">{title}</p>
      ) : null}

      <div className="overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          playsInline
          onClick={toggle}
          className="mx-auto block max-h-[60vh] w-full cursor-pointer"
        >
          {subtitlesUrl ? (
            <track
              kind="subtitles"
              srcLang="en"
              label="English"
              src={subtitlesUrl}
            />
          ) : null}
        </video>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Пауза" : "Смотреть"}
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

        {subtitlesUrl ? (
          <button
            type="button"
            onClick={() => setSubtitles((value) => !value)}
            aria-pressed={subtitles}
            className={subtitles ? "btn-primary btn-sm" : "btn-ghost btn-sm"}
            title="Субтитры на английском"
          >
            Субтитры
          </button>
        ) : null}

        <button
          type="button"
          onClick={fullscreen}
          className="btn-ghost btn-sm"
          title="Во весь экран"
        >
          ⛶
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
        /* disabled не ставим: его вырезают некоторые браузеры, и React
           падает с ошибкой несовпадения разметки — см. AudioPlayer */
        className={`mt-3 w-full accent-brand-600 ${
          duration === 0 ? "cursor-default opacity-50" : "cursor-pointer"
        }`}
      />
    </div>
  );
}
