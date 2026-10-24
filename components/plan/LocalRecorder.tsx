"use client";

import { useEffect, useRef, useState } from "react";
import { deleteTake, listTakes, saveTake, type Take } from "./recordings-db";

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", "audio/webm"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export function clock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function when(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Запись монолога с микрофона. Записи остаются только на этом устройстве */
export function LocalRecorder({
  taskId,
  targetSec,
  onSaved,
}: {
  taskId: string;
  targetSec: number;
  onSaved?: () => void;
}) {
  const [takes, setTakes] = useState<Take[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);

  async function reload() {
    try {
      const list = await listTakes(taskId);
      setTakes(list);
      setUrls((old) => {
        Object.values(old).forEach((url) => URL.revokeObjectURL(url));
        return Object.fromEntries(list.map((take) => [take.id, URL.createObjectURL(take.blob)]));
      });
    } catch {
      setError("Браузер не даёт сохранить записи (приватный режим?). Запись всё равно можно прослушать сразу.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- читаем IndexedDB, пока он доступен только в браузере
    reload();
    return () => {
      if (ticker.current) clearInterval(ticker.current);
      stream.current?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  async function start() {
    setError(null);
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Этот браузер не умеет записывать звук. Откройте страницу в Chrome, Safari или Firefox.");
      return;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      stream.current = media;
      const mime = pickMimeType();
      const rec = new MediaRecorder(media, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      rec.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      rec.onstop = async () => {
        const duration = (Date.now() - startedAt.current) / 1000;
        const blob = new Blob(chunks.current, { type: rec.mimeType || mime || "audio/webm" });
        stream.current?.getTracks().forEach((track) => track.stop());
        stream.current = null;
        if (blob.size === 0) return;
        const take: Take = {
          id: `${taskId}:${Date.now()}`,
          taskId,
          at: new Date().toISOString(),
          durationSec: Math.round(duration),
          mime: blob.type,
          blob,
        };
        try {
          await saveTake(take);
        } catch {
          setError("Не удалось сохранить запись на устройстве.");
        }
        await reload();
        onSaved?.();
      };
      recorder.current = rec;
      startedAt.current = Date.now();
      setElapsed(0);
      rec.start();
      setRecording(true);
      ticker.current = setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 250);
    } catch {
      setError("Нет доступа к микрофону. Разрешите его в настройках браузера (значок слева от адреса сайта) и попробуйте снова.");
    }
  }

  function stop() {
    if (ticker.current) clearInterval(ticker.current);
    ticker.current = null;
    setRecording(false);
    if (recorder.current && recorder.current.state !== "inactive") recorder.current.stop();
  }

  async function remove(id: string) {
    await deleteTake(id);
    await reload();
  }

  const progress = Math.min(100, (elapsed / targetSec) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {recording ? (
          <button type="button" onClick={stop} className="btn-danger">
            ⏹ Остановить
          </button>
        ) : (
          <button type="button" onClick={start} className="btn-primary">
            🎙 Начать запись
          </button>
        )}
        <span className="text-[14px] tabular-nums text-ink-600">
          {recording ? (
            <>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" aria-hidden />
              {clock(elapsed)} из {clock(targetSec)}
            </>
          ) : (
            <>Цель: около {clock(targetSec)}</>
          )}
        </span>
      </div>

      {recording ? (
        <div className="h-2 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-rose-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13.5px] text-rose-700">{error}</p> : null}

      {takes.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[13px] font-medium uppercase tracking-wide text-ink-500">Ваши записи (только на этом устройстве)</p>
          <ul className="space-y-2">
            {takes.map((take, index) => (
              <li key={take.id} className="rounded-xl border border-ink-200 bg-white p-3">
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-500">
                  <span>
                    Попытка {takes.length - index} · {when(take.at)} · {clock(take.durationSec)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(take.id)}
                    className="text-ink-400 hover:text-rose-600"
                  >
                    Удалить
                  </button>
                </div>
                {urls[take.id] ? <audio controls preload="metadata" src={urls[take.id]} className="w-full" /> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
