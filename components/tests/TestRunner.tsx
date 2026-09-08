"use client";

import Link from "next/link";
import { useState } from "react";
import { submitTestAction } from "@/app/actions/tests";

export type TestQuestion = {
  id: string;
  text: string;
  options: string[];
  explanation: string;
};

export function TestRunner({
  testId,
  questions,
}: {
  testId: string;
  questions: TestQuestion[];
}) {
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(-1),
  );
  const [result, setResult] = useState<{
    score: number;
    total: number;
    correct: number[];
  } | null>(null);
  const [sending, setSending] = useState(false);

  const answered = answers.filter((value) => value >= 0).length;

  async function finish() {
    setSending(true);
    try {
      const data = await submitTestAction({ testId, answers });
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      {result ? (
        <div className="card rise p-6 text-center">
          <p className="text-5xl">
            {result.score / Math.max(result.total, 1) >= 0.8 ? "🎉" : "📘"}
          </p>
          <h2 className="mt-3 text-xl font-semibold text-ink-900">
            Результат: {result.score} из {result.total}
          </h2>
          <p className="mt-1 text-[14.5px] text-ink-500">
            {Math.round((result.score / Math.max(result.total, 1)) * 100)}%
            правильных ответов
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAnswers(Array(questions.length).fill(-1));
                setResult(null);
              }}
              className="btn-ghost"
            >
              Пройти заново
            </button>
            <Link href="/tests" className="btn-primary">
              К списку тестов
            </Link>
          </div>
        </div>
      ) : (
        <div className="card flex items-center justify-between p-4">
          <p className="text-[14px] text-ink-600">
            Отвечено {answered} из {questions.length}
          </p>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink-200">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${(answered / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {questions.map((question, index) => (
        <div key={question.id} className="card p-5">
          <p className="text-[15px] font-medium text-ink-900">
            {index + 1}. {question.text}
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {question.options.map((option, optionIndex) => {
              const selected = answers[index] === optionIndex;
              const isCorrect = result?.correct[index] === optionIndex;
              const isWrongPick = Boolean(result) && selected && !isCorrect;

              return (
                <label
                  key={optionIndex}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[14.5px] transition ${
                    isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : isWrongPick
                        ? "border-rose-300 bg-rose-50 text-rose-700"
                        : selected
                          ? "border-brand-400 bg-brand-50 text-ink-900"
                          : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    disabled={Boolean(result)}
                    checked={selected}
                    onChange={() =>
                      setAnswers((prev) =>
                        prev.map((value, i) =>
                          i === index ? optionIndex : value,
                        ),
                      )
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  {option}
                </label>
              );
            })}
          </div>

          {result && result.correct[index] !== answers[index] && question.explanation ? (
            <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[13.5px] text-rose-700">
              {question.explanation}
            </p>
          ) : null}
        </div>
      ))}

      {!result ? (
        <button
          type="button"
          onClick={finish}
          disabled={answered < questions.length || sending}
          className="btn-primary w-full"
        >
          {sending
            ? "Проверяем…"
            : answered < questions.length
              ? `Ответьте на все вопросы (${answered}/${questions.length})`
              : "Завершить тест"}
        </button>
      ) : null}
    </div>
  );
}
