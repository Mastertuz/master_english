"use client";

import Link from "next/link";
import { useState } from "react";
import type { Drill } from "@/lib/study/types";
import { isCorrect, QuestionCard } from "./QuestionCard";
import { todayIso, useStudy, addDays } from "./study-store";

export function DrillRunner({ drill, nextId }: { drill: Drill; nextId?: string }) {
  const [state, update] = useStudy();
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showRule, setShowRule] = useState(true);

  const total = drill.items.length;
  const answered = Object.keys(answers).length;
  const score = drill.items.filter((item) => answers[item.id] !== undefined && isCorrect(item, answers[item.id])).length;
  const finished = answered === total;
  const history = state.drills[drill.id] ?? [];
  const best = history.reduce((max, run) => Math.max(max, run.score), 0);

  function answer(itemId: string, value: string) {
    const item = drill.items.find((entry) => entry.id === itemId);
    if (!item || answers[itemId] !== undefined) return;
    const next = { ...answers, [itemId]: value };
    const right = isCorrect(item, value);
    const complete = Object.keys(next).length === total;
    const finalScore = complete
      ? drill.items.filter((entry) => isCorrect(entry, next[entry.id])).length
      : 0;
    setAnswers(next);

    update((old) => {
      let errors = old.errors;
      if (!right) {
        const existing = errors[item.id];
        errors = {
          ...errors,
          [item.id]: {
            id: item.id,
            source: drill.title,
            prompt: item.q,
            options: item.options,
            answer: item.answer,
            why: item.why,
            box: 0,
            due: addDays(todayIso(), 1),
            wrong: (existing?.wrong ?? 0) + 1,
            added: existing?.added ?? todayIso(),
          },
        };
      }
      const drills = complete
        ? {
            ...old.drills,
            [drill.id]: [
              ...(old.drills[drill.id] ?? []),
              { at: new Date().toISOString(), score: finalScore, total },
            ],
          }
        : old.drills;
      return { ...old, errors, drills };
    });
  }

  function restart() {
    setAnswers({});
    setRound((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <Link href="/plan/grammar" className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800">
        ← Все упражнения
      </Link>

      <div>
        <span className="chip bg-brand-50 text-brand-700">{drill.tag}</span>
        <h1 className="page-title mt-2">{drill.title}</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          {total} заданий · лучший результат: {best ? `${best} из ${total}` : "ещё не проходили"}
          {history.length > 0 ? ` · попыток: ${history.length}` : ""}
        </p>
      </div>

      <section className="card space-y-3 p-5">
        <button
          type="button"
          onClick={() => setShowRule((value) => !value)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-[15px] font-semibold text-ink-900">Правило</h2>
          <span className="text-[13px] text-brand-700">{showRule ? "Скрыть" : "Показать"}</span>
        </button>
        {showRule ? (
          <div className="space-y-2.5">
            {drill.rule.map((paragraph) => (
              <p key={paragraph} className="text-[14.5px] leading-relaxed text-ink-800">
                {paragraph}
              </p>
            ))}
            <ul className="space-y-1 rounded-xl bg-brand-50/70 px-4 py-3">
              {drill.examples.map((example) => (
                <li key={example} className="text-[14.5px] italic text-ink-800">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <div className="flex items-center gap-3 text-[14px] text-ink-600">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${(answered / total) * 100}%` }} />
        </div>
        <span className="tabular-nums">
          {answered} / {total}
        </span>
      </div>

      <div className="space-y-4">
        {drill.items.map((item, index) => (
          <QuestionCard
            key={`${round}-${item.id}`}
            item={item}
            number={index + 1}
            value={answers[item.id] ?? null}
            onAnswer={(value) => answer(item.id, value)}
            seed={`${drill.id}-${round}`}
          />
        ))}
      </div>

      {finished ? (
        <section className="card space-y-3 border-brand-300 p-6 text-center">
          <p className="text-[22px] font-semibold text-ink-900">
            Результат: {score} из {total}
          </p>
          <p className="text-[14.5px] text-ink-600">
            {score === total
              ? "Без ошибок. Вернитесь к теме через неделю, чтобы закрепить."
              : `Ошибки (${total - score}) добавлены в журнал: они вернутся на повторение завтра и дальше с растущими интервалами.`}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={restart} className="btn-ghost">
              Пройти ещё раз
            </button>
            <Link href="/plan/errors" className="btn-ghost">
              Журнал ошибок
            </Link>
            {nextId ? (
              <Link href={`/plan/grammar/${nextId}`} className="btn-primary">
                Следующая тема →
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
