"use client";

import { useSyncExternalStore } from "react";
import type { StudyPhase } from "@/lib/self-study";

const STORAGE_KEY = "self-study-progress-v1";
const EVENT = "self-study-progress";

/** Отметки хранятся в браузере: ничего не пишем в базу, отметки видны только здесь */
function read(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function parse(raw: string): Record<string, boolean> {
  try {
    const value = JSON.parse(raw) as unknown;
    return value && typeof value === "object" ? (value as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function StudyChecklist({ phases }: { phases: StudyPhase[] }) {
  const raw = useSyncExternalStore(subscribe, read, () => "{}");
  const done = parse(raw);

  function toggle(id: string) {
    const next = { ...done, [id]: !done[id] };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // приватный режим: отметка просто не сохранится
    }
    window.dispatchEvent(new Event(EVENT));
  }

  const total = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const finished = phases.reduce(
    (sum, phase) => sum + phase.tasks.filter((task) => done[task.id]).length,
    0,
  );
  const percent = total ? Math.round((finished / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-[15px] font-semibold text-ink-900">Общий прогресс</p>
          <p className="text-[14px] text-ink-600">
            {finished} из {total} · {percent}%
          </p>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-[12.5px] text-ink-500">
          Отметки сохраняются в этом браузере.
        </p>
      </div>

      {phases.map((phase) => {
        const count = phase.tasks.filter((task) => done[task.id]).length;
        return (
          <section key={phase.id} className="card space-y-3 p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-[16px] font-semibold text-ink-900">{phase.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{phase.focus}</p>
              </div>
              <span className="chip bg-brand-50 text-brand-700">
                {count} / {phase.tasks.length}
              </span>
            </div>
            <ul className="space-y-1.5">
              {phase.tasks.map((task) => (
                <li key={task.id}>
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-[14.5px] leading-relaxed text-ink-800 hover:bg-ink-50">
                    <input
                      type="checkbox"
                      checked={Boolean(done[task.id])}
                      onChange={() => toggle(task.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                    />
                    <span className={done[task.id] ? "text-ink-400 line-through" : ""}>
                      {task.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
