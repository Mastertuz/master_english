"use client";

import { useEffect, useRef, useState } from "react";
import { formatTime } from "@/lib/audio-seek";
import { fetchRecording, toPlayable } from "@/lib/recording-audio";
import type { RecordingInfo } from "./Recorder";

type Loaded = { url: string; duration: number | null };

export function recordingKey(recording: RecordingInfo): string {
  return `${recording.id}:${recording.createdAt}`;
}

/** Два ответа одновременно не звучат: новый останавливает предыдущий */
let sounding: HTMLAudioElement | null = null;

/** Прослушивание сохранённой записи — и ученику, и учителю */
export function RecordingPlayer({ recording }: { recording: RecordingInfo }) {
  // Перезаписали ответ — плеер начинает с чистого листа
  return <Player key={recordingKey(recording)} recording={recording} />;
}

function Player({ recording }: { recording: RecordingInfo }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [wanted, setWanted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [rate, setRate] = useState(1);

  const key = recordingKey(recording);
  const src = `/api/oge/recordings/${recording.id}?v=${encodeURIComponent(recording.createdAt)}`;

  // Готовим запись заранее, но только когда до неё долистали
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setWanted(true);
      },
      { rootMargin: "600px" },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!wanted) return;
    const abort = new AbortController();
    let url: string | null = null;

    (async () => {
      try {
        const raw = await fetchRecording(key, src, abort.signal);
        const playable = await toPlayable(raw);
        if (abort.signal.aborted) return;
        url = URL.createObjectURL(playable.blob);
        setLoaded({ url, duration: playable.duration });
      } catch {
        if (abort.signal.aborted) return;
        setFailed(true);
        setWaiting(false);
      }
    })();

    return () => {
      abort.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [wanted, attempt, key, src]);

  // Нажали «слушать» раньше, чем запись загрузилась
  useEffect(() => {
    const audio = audioRef.current;
    if (!loaded || !waiting || !audio) return;
    audio
      .play()
      .catch(() => {}) // Safari может попросить нажать ещё раз
      .finally(() => setWaiting(false));
  }, [loaded, waiting]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, [rate, loaded]);

  // Ползунок ведём по кадрам: timeupdate приходит 4 раза в секунду,
  // и на коротком ответе полоска двигалась бы рывками
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) setCurrent(audio.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (sounding === audio) sounding = null;
    };
  }, [loaded]);

  const duration = loaded?.duration ?? recording.durationSec;
  const position = Math.min(current, duration);
  // Длительность округляем, поэтому в конце показываем её же: 0:06 / 0:06, а не 0:05 / 0:06
  const total = Math.round(duration);
  const shown = position >= duration - 0.05 ? total : Math.min(position, total);

  function toggle() {
    if (failed) {
      setFailed(false);
      setWaiting(true);
      setWanted(true);
      setAttempt((value) => value + 1);
      return;
    }
    const audio = audioRef.current;
    if (!loaded || !audio) {
      setWanted(true);
      setWaiting(true);
      return;
    }
    if (audio.paused) void audio.play().catch(() => {});
    else audio.pause();
  }

  function moveTo(seconds: number) {
    const audio = audioRef.current;
    if (!audio || !loaded) return;
    audio.currentTime = seconds;
    setCurrent(seconds);
  }

  return (
    <div ref={boxRef} className="space-y-1">
      <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-3 py-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={
            failed
              ? "Загрузить запись ещё раз"
              : playing
                ? "Пауза"
                : "Слушать ответ"
          }
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-[13px] text-white transition hover:bg-brand-hover"
        >
          {failed ? (
            "↻"
          ) : waiting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : playing ? (
            "❚❚"
          ) : (
            "▶"
          )}
        </button>

        <span className="shrink-0 text-[12.5px] tabular-nums text-ink-500">
          {formatTime(shown)} / {formatTime(total)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.01}
          value={position}
          onChange={(event) => moveTo(Number(event.target.value))}
          aria-label="Позиция воспроизведения"
          className={`min-w-0 flex-1 accent-brand-600 ${
            loaded ? "cursor-pointer" : "cursor-default opacity-50"
          }`}
        />

        <select
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
          aria-label="Скорость воспроизведения"
          className="shrink-0 rounded-lg border border-ink-200 bg-white px-1.5 py-1 text-[12.5px] text-ink-700"
        >
          <option value={0.75}>0.75×</option>
          <option value={1}>1×</option>
          <option value={1.25}>1.25×</option>
          <option value={1.5}>1.5×</option>
        </select>
      </div>

      {failed ? (
        <p className="text-[12.5px] text-rose-600">
          Не удалось загрузить запись. Нажмите ↻, чтобы попробовать ещё раз.
        </p>
      ) : null}

      {loaded ? (
        <audio
          ref={audioRef}
          src={loaded.url}
          preload="auto"
          onPlay={(event) => {
            const audio = event.currentTarget;
            if (sounding && sounding !== audio) sounding.pause();
            sounding = audio;
            audio.playbackRate = rate;
            setPlaying(true);
          }}
          // В фоновой вкладке кадры не идут — там время ведёт само аудио
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onPause={(event) => {
            setPlaying(false);
            setCurrent(event.currentTarget.currentTime);
          }}
          onEnded={() => {
            setPlaying(false);
            setCurrent(duration);
          }}
        />
      ) : null}
    </div>
  );
}
