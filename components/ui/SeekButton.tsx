"use client";

import { formatTime, seekAudio } from "@/lib/audio-seek";

/** Таймкод: перематывает плеер с этим src и включает звук */
export function SeekButton({
  src,
  at,
  label,
  active = false,
}: {
  src: string;
  at: number;
  label?: string;
  /** Сейчас звучит именно это место */
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => seekAudio(src, at)}
      title="Перейти к этому месту записи"
      aria-current={active ? "true" : undefined}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-1 text-[12.5px] transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 ${
        active
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-ink-200 text-ink-700"
      }`}
    >
      <span aria-hidden className="text-[10px] text-brand-600">▶</span>
      <span className="font-medium tabular-nums">{formatTime(at)}</span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}

/** Ряд таймкодов под заданием */
export function Timecodes({
  src,
  items,
}: {
  src: string;
  items: { label: string; at: number }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[12.5px] text-ink-500">Таймкоды:</span>
      {items.map((item) => (
        <SeekButton key={`${item.at}-${item.label}`} src={src} at={item.at} label={item.label} />
      ))}
    </div>
  );
}
