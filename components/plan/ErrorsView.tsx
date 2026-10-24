"use client";

import Link from "next/link";
import { useState } from "react";
import { TYPICAL_ERRORS } from "@/lib/self-study";
import { DRILLS } from "@/lib/study/drills";
import { isCorrect, QuestionCard } from "./QuestionCard";
import { nextReview, todayIso, useStudy, type ErrorCard } from "./study-store";

const MASTERED_BOX = 5;

/** Задания упражнений, которые повторяют ваши 12 ошибок в тесте B2–C1 (вопросы 4, 7, 10, 13, 16, 17, 18, 31, 35, 37, 38, 40) */
const TEST_MISTAKE_IDS = [
  "wish-1", "wish-2", "inv-1", "ph-1", "inv-2", "cond-1", "wish-3", "vp-1", "ph-6", "pr-1", "mod-1", "wd-1",
];

function dueLabel(card: ErrorCard, today: string): string {
  if (card.box >= MASTERED_BOX) return "освоено";
  if (card.due <= today) return "сегодня";
  return new Date(card.due).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function asItem(card: ErrorCard) {
  return {
    id: card.id,
    q: card.prompt,
    options: card.options,
    answer: card.answer,
    exact: card.exact,
    why: card.why,
  };
}

function ReviewSession({ cards, onClose }: { cards: ErrorCard[]; onClose: () => void }) {
  const [, update] = useStudy();
  // Очередь фиксируем в начале занятия: иначе после ответа карточка пропала бы из списка
  const [queue] = useState(cards);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState<string | null>(null);
  const [right, setRight] = useState(0);

  const card = queue[index];

  if (!card) {
    return (
      <section className="card space-y-3 p-6 text-center">
        <p className="text-[20px] font-semibold text-ink-900">
          Повторение окончено: верно {right} из {queue.length}
        </p>
        <button type="button" onClick={onClose} className="btn-primary">
          Готово
        </button>
      </section>
    );
  }

  function answer(given: string) {
    const ok = isCorrect(asItem(card), given);
    setValue(given);
    if (ok) setRight((count) => count + 1);
    update((old) => {
      const current = old.errors[card.id];
      if (!current) return old;
      const next = nextReview(current.box, ok);
      return {
        ...old,
        errors: {
          ...old.errors,
          [card.id]: { ...current, ...next, wrong: current.wrong + (ok ? 0 : 1) },
        },
      };
    });
  }

  return (
    <section className="space-y-3">
      <p className="text-[13px] text-ink-500">
        Повторение: {index + 1} из {queue.length} · {card.source}
      </p>
      <QuestionCard
        key={card.id}
        item={asItem(card)}
        value={value}
        onAnswer={answer}
        seed={`review-${todayIso()}`}
      />
      {value !== null ? (
        <button
          type="button"
          onClick={() => {
            setValue(null);
            setIndex((position) => position + 1);
          }}
          className="btn-primary"
        >
          {index + 1 < queue.length ? "Дальше →" : "Закончить"}
        </button>
      ) : null}
    </section>
  );
}

export function ErrorsView() {
  const [state, update] = useStudy();
  const [reviewing, setReviewing] = useState<ErrorCard[] | null>(null);
  const [wrong, setWrong] = useState("");
  const [fixed, setFixed] = useState("");
  const [rule, setRule] = useState("");

  const today = todayIso();
  const cards = Object.values(state.errors).sort((a, b) => a.due.localeCompare(b.due));
  const active = cards.filter((card) => card.box < MASTERED_BOX);
  const due = active.filter((card) => card.due <= today);
  const mastered = cards.length - active.length;

  function addOwn() {
    if (!wrong.trim() || !fixed.trim()) return;
    const id = `own-${Date.now()}`;
    update((old) => ({
      ...old,
      errors: {
        ...old.errors,
        [id]: {
          id,
          source: "Моя ошибка",
          prompt: `Исправьте ошибку: ${wrong.trim()}`,
          answer: fixed.trim(),
          exact: true,
          why: rule.trim(),
          box: 0,
          due: today,
          wrong: 1,
          added: today,
        },
      },
    }));
    setWrong("");
    setFixed("");
    setRule("");
  }

  const testItems = DRILLS.flatMap((drill) => drill.items).filter((item) => TEST_MISTAKE_IDS.includes(item.id));
  const testAdded = testItems.every((item) => state.errors[item.id]);

  function addTestMistakes() {
    update((old) => {
      const errors = { ...old.errors };
      for (const item of testItems) {
        if (errors[item.id]) continue;
        errors[item.id] = {
          id: item.id,
          source: "Мой тест B2–C1",
          prompt: item.q,
          options: item.options,
          answer: item.answer,
          why: item.why,
          box: 0,
          due: today,
          wrong: 1,
          added: today,
        };
      }
      return { ...old, errors };
    });
  }

  function addTypical() {
    update((old) => {
      const errors = { ...old.errors };
      TYPICAL_ERRORS.forEach((item, index) => {
        const id = `typical-${index}`;
        if (errors[id]) return;
        errors[id] = {
          id,
          source: "Типичные ошибки русскоговорящих",
          prompt: `Исправьте ошибку: ${item.wrong}`,
          answer: item.right.replace(/\s*\([^)]*\)/g, ""),
          exact: true,
          why: item.why,
          box: 0,
          due: today,
          wrong: 0,
          added: today,
        };
      });
      return { ...old, errors };
    });
  }

  function remove(id: string) {
    update((old) => {
      const errors = { ...old.errors };
      delete errors[id];
      return { ...old, errors };
    });
  }

  if (reviewing) {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Повторение ошибок</h1>
        <ReviewSession cards={reviewing} onClose={() => setReviewing(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Журнал ошибок</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Сюда автоматически попадает всё, в чём вы ошиблись в упражнениях. Каждая ошибка возвращается на повторение через 1, 3, 7, 16 и 35 дней.
          Если отвечаете верно — интервал растёт, ошибаетесь — начинается заново. Через пять верных ответов подряд ошибка считается освоенной.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-[13px] text-ink-500">Нужно повторить сегодня</p>
          <p className="mt-1 text-[28px] font-semibold text-ink-900">{due.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[13px] text-ink-500">В работе</p>
          <p className="mt-1 text-[28px] font-semibold text-ink-900">{active.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[13px] text-ink-500">Освоено</p>
          <p className="mt-1 text-[28px] font-semibold text-emerald-700">{mastered}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setReviewing(due)}
          disabled={due.length === 0}
          className="btn-primary"
        >
          ▶ Повторить сейчас ({due.length})
        </button>
        {!testAdded ? (
          <button type="button" onClick={addTestMistakes} className="btn-ghost">
            + Добавить мои 12 ошибок из теста B2–C1
          </button>
        ) : null}
        <button type="button" onClick={addTypical} className="btn-ghost">
          + Добавить типичные ошибки русскоговорящих
        </button>
        <Link href="/plan/grammar" className="btn-ghost">
          К упражнениям
        </Link>
      </div>

      <section className="card space-y-3 p-5">
        <h2 className="text-[16px] font-semibold text-ink-900">Добавить свою ошибку</h2>
        <p className="text-[13.5px] text-ink-500">
          Услышали или написали фразу с ошибкой — запишите её здесь, и она вернётся на повторение.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-[13px] text-ink-500">Как было (с ошибкой)</span>
            <input value={wrong} onChange={(e) => setWrong(e.target.value)} className="field mt-1 w-full" placeholder="I have been to London last year." />
          </label>
          <label className="block">
            <span className="text-[13px] text-ink-500">Как правильно</span>
            <input value={fixed} onChange={(e) => setFixed(e.target.value)} className="field mt-1 w-full" placeholder="I went to London last year." />
          </label>
        </div>
        <label className="block">
          <span className="text-[13px] text-ink-500">Почему (по-русски, коротко)</span>
          <input value={rule} onChange={(e) => setRule(e.target.value)} className="field mt-1 w-full" placeholder="С last year — Past Simple." />
        </label>
        <button type="button" onClick={addOwn} disabled={!wrong.trim() || !fixed.trim()} className="btn-primary btn-sm">
          Добавить в журнал
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Все ошибки ({cards.length})</h2>
        {cards.length === 0 ? (
          <p className="card p-6 text-center text-[14.5px] text-ink-500">
            Пока пусто. Пройдите любое упражнение по грамматике: ошибки появятся здесь.
          </p>
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="bg-ink-50 text-[12.5px] uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Задание</th>
                  <th className="px-4 py-3 font-medium">Верно</th>
                  <th className="px-4 py-3 font-medium">Повтор</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {cards.map((card) => (
                  <tr key={card.id}>
                    <td className="px-4 py-2.5 text-ink-800">
                      {card.prompt.replace(/___/g, "…")}
                      <span className="block text-[12.5px] text-ink-400">{card.source}</span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-emerald-700">{card.exact ? card.answer : card.answer.split("|")[0]}</td>
                    <td className="px-4 py-2.5 text-ink-600">
                      {dueLabel(card, today)}
                      <span className="block text-[12.5px] text-ink-400">ошибок: {card.wrong}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button type="button" onClick={() => remove(card.id)} className="text-[13px] text-ink-400 hover:text-rose-600">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
