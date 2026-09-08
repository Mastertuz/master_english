"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type LessonCard = {
  id: string;
  number: number;
  topic: string;
  description: string;
  level: string;
  bookTitle: string;
  durationMin: number;
  hasHomework: boolean;
  words: number;
  tests: number;
  assignments: number;
};

const ALL = "ALL";

/**
 * Список уроков с фильтром по уровню. Фильтруем на клиенте: уроки уже
 * пришли вместе со страницей, и переключение не ждёт ответа сервера.
 */
export function LessonsList({
  lessons,
  isAdmin,
}: {
  lessons: LessonCard[];
  isAdmin: boolean;
}) {
  const [level, setLevel] = useState(ALL);

  // Показываем только те уровни, которые есть в списке, в порядке A1…C2
  const levels = useMemo(
    () => [...new Set(lessons.map((lesson) => lesson.level))].sort(),
    [lessons],
  );

  const visible = useMemo(
    () =>
      level === ALL
        ? lessons
        : lessons.filter((lesson) => lesson.level === level),
    [lessons, level],
  );

  return (
    <div className="space-y-4">
      {levels.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-ink-500">Уровень:</span>
          <FilterButton
            active={level === ALL}
            onClick={() => setLevel(ALL)}
            label={`Все (${lessons.length})`}
          />
          {levels.map((value) => (
            <FilterButton
              key={value}
              active={level === value}
              onClick={() => setLevel(value)}
              label={`${value} (${
                lessons.filter((lesson) => lesson.level === value).length
              })`}
            />
          ))}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl">📚</p>
          <p className="mt-4 text-[15px] text-ink-600">
            Уроков уровня {level} нет.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              prefetch
              className="card rise group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-[15px] font-semibold text-brand-700">
                  №{lesson.number}
                </span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <span className="chip bg-emerald-50 text-emerald-700">
                    {lesson.level}
                  </span>
                  {lesson.hasHomework ? (
                    <span className="chip bg-amber-50 text-amber-700">ДЗ</span>
                  ) : null}
                </div>
              </div>

              <h2 className="mt-4 text-[16px] font-semibold text-ink-900 group-hover:text-brand-700">
                {lesson.topic}
              </h2>
              {lesson.description ? (
                <p className="mt-1.5 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-ink-500">
                  {lesson.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}

              {lesson.bookTitle ? (
                <p className="mt-3 line-clamp-1 text-[12.5px] text-ink-400">
                  📖 {lesson.bookTitle}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-3 border-t border-ink-100 pt-3 text-[12.5px] text-ink-500">
                <span>⏱ {lesson.durationMin} мин</span>
                <span>🗂 {lesson.words}</span>
                <span>📝 {lesson.tests}</span>
                {isAdmin ? <span>🎓 {lesson.assignments}</span> : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
        active
          ? "bg-brand-600 text-white shadow-sm"
          : "border border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
      }`}
    >
      {label}
    </button>
  );
}
