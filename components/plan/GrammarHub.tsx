"use client";

import Link from "next/link";
import { DRILL_GROUPS, drillById } from "@/lib/study/drills";
import { useStudy } from "./study-store";

export function GrammarHub() {
  const [state] = useStudy();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Грамматика и лексика: упражнения с проверкой</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          В каждой теме: короткое правило и 12–13 заданий. Ответ проверяется сразу, а ошибки автоматически попадают в журнал и возвращаются на повторение через
          1, 3, 7, 16 и 35 дней.
        </p>
      </div>

      {DRILL_GROUPS.map((group) => (
        <section key={group.title} className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-ink-900">{group.title}</h2>
            <p className="text-[14px] text-ink-600">{group.text}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {group.ids.map((id) => {
              const drill = drillById(id);
              if (!drill) return null;
              const runs = state.drills[id] ?? [];
              const last = runs[runs.length - 1];
              const best = runs.reduce((max, run) => Math.max(max, run.score), 0);
              const percent = last ? Math.round((best / last.total) * 100) : 0;
              return (
                <Link
                  key={id}
                  href={`/plan/grammar/${id}`}
                  prefetch
                  className="card flex flex-col p-4 transition hover:border-brand-300"
                >
                  <span className="chip self-start bg-brand-50 text-brand-700">{drill.tag}</span>
                  <p className="mt-2 text-[15px] font-semibold leading-snug text-ink-900">{drill.title}</p>
                  <p className="mt-2 text-[13px] text-ink-500">
                    {drill.items.length} заданий ·{" "}
                    {last ? `лучший результат ${best} из ${last.total}, попыток: ${runs.length}` : "не проходили"}
                  </p>
                  {last ? (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full ${percent >= 90 ? "bg-emerald-500" : "bg-brand-600"}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
