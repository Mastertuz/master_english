"use client";

import Link from "next/link";
import type { WritingTask } from "@/lib/study/types";
import { useStudy } from "./study-store";

export function WritingHub({ tasks }: { tasks: WritingTask[] }) {
  const [state] = useStudy();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Письмо</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Пишите без словаря, на время, потом проверяйте по списку и сравнивайте с образцом. Тексты хранятся в вашем браузере, а кнопка «Скопировать» поможет
          отправить работу на проверку человеку.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => {
          const done = state.done[`wr:${task.id}`];
          const draft = state.writing[task.id]?.text;
          return (
            <Link key={task.id} href={`/plan/writing/${task.id}`} prefetch className="card flex flex-col p-4 transition hover:border-brand-300">
              <div className="flex flex-wrap gap-1.5">
                <span className="chip bg-brand-50 text-brand-700">{task.type}</span>
                <span className="chip bg-ink-100 text-ink-600">{task.words}</span>
                {done ? <span className="chip bg-emerald-50 text-emerald-700">✓ готово</span> : draft ? <span className="chip bg-amber-50 text-amber-700">черновик</span> : null}
              </div>
              <p className="mt-2 text-[15px] font-semibold leading-snug text-ink-900">{task.title}</p>
              <p className="mt-1 line-clamp-3 text-[13.5px] leading-relaxed text-ink-600">{task.task}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
