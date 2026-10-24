"use client";

import Link from "next/link";
import { WEEKS } from "@/lib/study/schedule";
import { UNITS } from "@/lib/study/units";
import { todayIso, useStudy, weekNumber } from "./study-store";

export function UnitsHub() {
  const [state] = useStudy();
  const week = weekNumber(state.startDate, todayIso());
  const current = week && week >= 1 && week <= WEEKS.length ? WEEKS[week - 1].unit : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Empower C1: десять юнитов</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Основной курс плана. На каждый юнит две недели: первая — уроки A и B, вторая — C, D и повторение. В книге вы делаете упражнения, а на платформе:
          записи с вопросами и текстом, шэдоуинг, слова, письмо и грамматика.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {UNITS.map((unit) => {
          const listened = unit.tracks.filter((track) => state.done[`ls:${track.track}`]).length;
          const wrote = state.done[`wr:${unit.writing.id}`];
          const isCurrent = current === unit.n;
          const weeks = WEEKS.filter((item) => item.unit === unit.n).map((item) => item.n);
          return (
            <Link
              key={unit.n}
              href={`/plan/units/${unit.n}`}
              prefetch
              className={`card flex flex-col p-5 transition hover:border-brand-300 ${isCurrent ? "border-brand-500 ring-1 ring-brand-300" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="chip bg-brand-600 font-semibold text-white">Юнит {unit.n}</span>
                <span className="chip bg-ink-100 text-ink-600">недели {weeks.join("–")}</span>
                {isCurrent ? <span className="chip bg-amber-50 text-amber-700">сейчас</span> : null}
              </div>
              <h2 className="mt-3 text-[17px] font-semibold text-ink-900">{unit.title}</h2>
              <p className="mt-1 flex-1 text-[13.5px] leading-relaxed text-ink-600">{unit.about}</p>
              <p className="mt-3 text-[13px] text-ink-500">
                Записи: {listened} из {unit.tracks.length} · письмо: {wrote ? "готово" : "ещё нет"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
