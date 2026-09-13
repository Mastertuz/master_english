"use client";

import { formatTime, seekAudio } from "@/lib/audio-seek";

/** Таймкод: перематывает плеер с этим src и включает звук */
export function SeekButton({
  src,
  at,
  label,
}: {
  src: string;
  at: number;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => seekAudio(src, at)}
      title="Перейти к этому месту записи"
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-ink-200 px-2 py-1 text-[12.5px] text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
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
