"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";

export type RecordingInfo = { id: string; durationSec: number; createdAt: string };
export type RecorderHandle = { start: () => void };

type Phase = "idle" | "prep" | "recording" | "uploading";

/** Chrome и Firefox пишут webm/opus, Safari — mp4 */
function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export function clock(seconds: number): string {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** Прослушивание сохранённой записи — и ученику, и учителю */
export function RecordingPlayer({ recording }: { recording: RecordingInfo }) {
  return (
    <div className="space-y-1">
      {/*
        Нативный плеер: у записей из MediaRecorder в webm нет длительности
        в заголовке, и собственный ползунок AudioPlayer там не работает.
      */}
      <audio
        controls
        preload="metadata"
        src={`/api/oge/recordings/${recording.id}?v=${encodeURIComponent(recording.createdAt)}`}
        className="w-full"
      />
      <p className="text-[12.5px] text-ink-400">
        Длительность ответа: {clock(recording.durationSec)}
      </p>
    </div>
  );
}

/**
 * Запись устного ответа с микрофона: подготовка с обратным отсчётом,
 * запись с ограничением по времени, как на экзамене, и сохранение на сервер.
 */
export function Recorder({
  ref,
  variantId,
  taskKey,
  maxSec,
  prepSec = 0,
  recording,
  readOnly,
  onChange,
}: {
  ref?: React.Ref<RecorderHandle>;
  variantId: string;
  taskKey: string;
  maxSec: number;
  prepSec?: number;
  recording: RecordingInfo | null;
  readOnly: boolean;
  onChange: (recording: RecordingInfo | null) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Запись, которую не удалось отправить, — чтобы не пришлось отвечать заново
  const [pending, setPending] = useState<{ blob: Blob; duration: number } | null>(
    null,
  );

  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);

  // Уход со страницы посреди записи: отпускаем микрофон и таймер
  useEffect(() => {
    return () => {
      if (ticker.current) clearInterval(ticker.current);
      const active = recorder.current;
      if (active && active.state !== "inactive") {
        active.onstop = null;
        active.stop();
      }
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function stopTicker() {
    if (ticker.current) clearInterval(ticker.current);
    ticker.current = null;
  }

  function releaseMic() {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }

  async function getMic(): Promise<MediaStream | null> {
    if (
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError(
        "Этот браузер не умеет записывать звук. Откройте страницу в Chrome, Safari или Firefox.",
      );
      return null;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      stream.current = media;
      return media;
    } catch {
      setError(
        "Нет доступа к микрофону. Разрешите его в настройках браузера (значок слева от адреса сайта) и попробуйте снова.",
      );
      return null;
    }
  }

  function countdown(seconds: number, onDone: () => void) {
    stopTicker();
    const endsAt = Date.now() + seconds * 1000;
    setLeft(seconds);
    ticker.current = setInterval(() => {
      const rest = (endsAt - Date.now()) / 1000;
      setLeft(rest);
      if (rest <= 0) {
        stopTicker();
        onDone();
      }
    }, 200);
  }

  async function upload(blob: Blob, duration: number) {
    setPhase("uploading");
    setError(null);

    const extension = blob.type.includes("mp4")
      ? "m4a"
      : blob.type.includes("ogg")
        ? "ogg"
        : "webm";
    const body = new FormData();
    body.append("variant", variantId);
    body.append("taskKey", taskKey);
    body.append("duration", String(duration));
    body.append("file", blob, `${taskKey}.${extension}`);

    try {
      const response = await fetch("/api/oge/recordings", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Не удалось сохранить запись");
        setPending({ blob, duration });
        return;
      }
      setPending(null);
      onChange(data as RecordingInfo);
    } catch {
      setError("Не удалось отправить запись. Проверьте интернет.");
      setPending({ blob, duration });
    } finally {
      setPhase("idle");
    }
  }

  function begin(media: MediaStream) {
    stopTicker();
    const mimeType = pickMimeType();

    let active: MediaRecorder;
    try {
      active = new MediaRecorder(media, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 48000,
      });
    } catch {
      setError("Не удалось начать запись");
      releaseMic();
      setPhase("idle");
      return;
    }

    const chunks: Blob[] = [];
    const startedAt = Date.now();

    active.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    active.onstop = () => {
      stopTicker();
      releaseMic();
      const blob = new Blob(chunks, {
        type: active.mimeType || mimeType || "audio/webm",
      });
      if (blob.size === 0) {
        setError("Запись получилась пустой — проверьте микрофон");
        setPhase("idle");
        return;
      }
      void upload(blob, Math.round((Date.now() - startedAt) / 1000));
    };

    recorder.current = active;
    active.start(1000);
    setError(null);
    setPhase("recording");
    countdown(maxSec, () => {
      if (active.state !== "inactive") active.stop();
    });
  }

  async function startPrep() {
    setError(null);
    const media = await getMic();
    if (!media) return;
    setPhase("prep");
    countdown(prepSec, () => begin(media));
  }

  async function startNow() {
    if (phase === "recording" || phase === "uploading") return;
    setError(null);
    const media = stream.current ?? (await getMic());
    if (media) begin(media);
  }

  function stop() {
    const active = recorder.current;
    if (active && active.state !== "inactive") active.stop();
  }

  function cancelPrep() {
    stopTicker();
    releaseMic();
    setPhase("idle");
  }

  async function remove() {
    if (!recording) return;
    const response = await fetch(`/api/oge/recordings/${recording.id}`, {
      method: "DELETE",
    });
    if (response.ok) onChange(null);
    else setError("Не удалось удалить запись");
  }

  // Задание 2: запись стартует сама, когда закончился вопрос
  useImperativeHandle(ref, () => ({
    start: () => {
      void startNow();
    },
  }));

  if (readOnly) {
    return recording ? (
      <RecordingPlayer recording={recording} />
    ) : (
      <p className="text-[13.5px] text-ink-400">Запись не сделана</p>
    );
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-3">
      {phase === "prep" ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip bg-amber-50 text-amber-700">Подготовка</span>
          <span className="text-2xl font-semibold tabular-nums text-ink-900">
            {clock(left)}
          </span>
          <button type="button" onClick={startNow} className="btn-primary btn-sm">
            🎙 Начать отвечать сейчас
          </button>
          <button type="button" onClick={cancelPrep} className="btn-ghost btn-sm">
            Отмена
          </button>
        </div>
      ) : phase === "recording" ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip gap-2 bg-rose-50 text-rose-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
            Идёт запись
          </span>
          <span className="text-2xl font-semibold tabular-nums text-ink-900">
            {clock(left)}
          </span>
          <button type="button" onClick={stop} className="btn-primary btn-sm">
            ■ Закончить ответ
          </button>
        </div>
      ) : phase === "uploading" ? (
        <p className="text-[14px] text-ink-500">Сохраняем запись…</p>
      ) : (
        <div className="space-y-2">
          {recording ? <RecordingPlayer recording={recording} /> : null}
          <div className="flex flex-wrap gap-2">
            {prepSec > 0 ? (
              <button
                type="button"
                onClick={startPrep}
                className={recording ? "btn-ghost btn-sm" : "btn-primary btn-sm"}
              >
                ⏱ Подготовка {clock(prepSec)}, затем запись
              </button>
            ) : null}
            <button
              type="button"
              onClick={startNow}
              className={
                recording || prepSec > 0 ? "btn-ghost btn-sm" : "btn-primary btn-sm"
              }
            >
              🎙 {recording ? "Перезаписать" : "Записать сразу"} (до {clock(maxSec)})
            </button>
            {recording ? (
              <button
                type="button"
                onClick={remove}
                className="btn-ghost btn-sm text-rose-600"
              >
                Удалить запись
              </button>
            ) : null}
          </div>
        </div>
      )}

      {pending && phase === "idle" ? (
        <button
          type="button"
          onClick={() => void upload(pending.blob, pending.duration)}
          className="btn-primary btn-sm mt-2"
        >
          Отправить запись ещё раз
        </button>
      ) : null}

      {error ? <p className="mt-2 text-[13px] text-rose-600">{error}</p> : null}
    </div>
  );
}
