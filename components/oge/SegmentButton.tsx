"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Проигрывает кусок общей записи — один вопрос телефонного опроса.
 * Файл один на все вопросы, поэтому останавливаемся сами по отметке end.
 */
export function SegmentButton({
  src,
  start,
  end,
  label,
  onEnded,
}: {
  src: string;
  start: number;
  end: number;
  label: string;
  /** Вопрос прозвучал до конца (не остановлен вручную) */
  onEnded?: () => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const endedCallback = useRef(onEnded);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    endedCallback.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;

    const finish = () => {
      element.pause();
      endedCallback.current?.();
    };
    const onTime = () => {
      if (!element.paused && element.currentTime >= end) finish();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      endedCallback.current?.();
    };

    element.addEventListener("timeupdate", onTime);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    element.addEventListener("ended", onEnd);
    return () => {
      element.removeEventListener("timeupdate", onTime);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("pause", onPause);
      element.removeEventListener("ended", onEnd);
    };
  }, [end]);

  function toggle() {
    const element = audio.current;
    if (!element) return;

    if (!element.paused) {
      element.pause();
      return;
    }

    // play() вызываем сразу, в обработчике нажатия: иначе Safari не даст
    // включить звук. Перемотку ставим, как только известны метаданные.
    if (element.readyState >= 1) {
      element.currentTime = start;
    } else {
      element.addEventListener(
        "loadedmetadata",
        () => {
          element.currentTime = start;
        },
        { once: true },
      );
    }
    void element.play();
  }

  return (
    <>
      <audio ref={audio} src={src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        className={playing ? "btn-primary btn-sm" : "btn-ghost btn-sm"}
      >
        {playing ? "❚❚ Остановить" : label}
      </button>
    </>
  );
}
