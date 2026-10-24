"use client";

import Link from "next/link";
import { SPEAKING_GROUPS, SPEAKING_TASKS } from "@/lib/study/speaking";
import { useStudy } from "./study-store";

export function SpeakingHub() {
  const [state] = useStudy();
  const total = SPEAKING_TASKS.length;
  const finished = SPEAKING_TASKS.filter((task) => state.done[`sp:${task.id}`]).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Говорение и мышление</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Здесь тренировка речи: не ответы на вопросы теста, а настоящие монологи. Включаете запись, говорите, слушаете себя,
          отмечаете, что исправить. Начните с «Прогулки по квартире»: это самый простой способ начать говорить каждый день.
        </p>
        <p className="mt-2 text-[14px] text-ink-500">
          Выполнено заданий: <b className="text-ink-800">{finished}</b> из {total}
        </p>
      </div>

      <div className="rounded-xl bg-brand-50/70 px-5 py-4 text-[14px] leading-relaxed text-ink-700">
        <b className="text-ink-900">Как заниматься.</b> 1) Прочитайте задание и 30–60 секунд подумайте. 2) Запишите ответ, не останавливаясь.
        3) Прослушайте и отметьте в самопроверке. 4) Откройте образец и повторите его вслух. 5) Через пару дней сделайте то же задание ещё раз:
        на второй раз будет заметно лучше.
      </div>

      {SPEAKING_GROUPS.map((group) => {
        const tasks = SPEAKING_TASKS.filter((task) => task.group === group.id);
        return (
          <section key={group.id} className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                <span aria-hidden>{group.icon}</span> {group.title}
              </h2>
              <p className="mt-0.5 text-[14px] text-ink-600">{group.text}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => {
                const doneOn = state.done[`sp:${task.id}`];
                const times = state.speaking[task.id]?.times ?? 0;
                return (
                  <Link
                    key={task.id}
                    href={`/plan/speaking/${task.id}`}
                    prefetch
                    className="card flex flex-col p-4 transition hover:border-brand-300"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="chip bg-brand-50 text-brand-700">{task.level}</span>
                      <span className="chip bg-ink-100 text-ink-600">≈ {task.minutes} мин</span>
                      {doneOn ? <span className="chip bg-emerald-50 text-emerald-700">✓ {times > 1 ? `${times} раз` : "сделано"}</span> : null}
                    </div>
                    <p className="mt-2 text-[15px] font-semibold leading-snug text-ink-900">{task.title}</p>
                    <p className="mt-1 line-clamp-3 text-[13.5px] leading-relaxed text-ink-600">{task.task}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
