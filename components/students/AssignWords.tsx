"use client";

import { useMemo, useState, useTransition } from "react";
import {
  clearAssignedWordsAction,
  setWordAssignedAction,
} from "@/app/actions/words";
import { TopicButton } from "@/components/dictionary/WordsTable";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";

/** Папки списка: как в словаре ученика, плюс «назначено» */
const ALL = "all";
const ASSIGNED = "assigned";
const OWN = "own";

export type StudentWord = {
  id: string;
  english: string;
  russian: string;
  assigned: boolean;
  /** Урок, из которого слово попало в словарь; null — добавлено вручную */
  lesson: { number: number; topic: string } | null;
};

/**
 * Слова ученика, отмеченные к следующему уроку. Галочка сохраняется сразу:
 * у ученика такие слова попадают в отдельную тренировку.
 */
export function AssignWords({
  studentId,
  words,
}: {
  studentId: string;
  words: StudentWord[];
}) {
  const [assigned, setAssigned] = useState(
    () => new Set(words.filter((word) => word.assigned).map((word) => word.id)),
  );
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string>(ALL);
  const [, startTransition] = useTransition();

  const topics = useMemo(() => {
    const map = new Map<number, string>();
    for (const word of words) {
      if (word.lesson) map.set(word.lesson.number, word.lesson.topic);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [words]);

  const own = words.filter((word) => !word.lesson).length;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return words.filter((word) => {
      const inFolder =
        folder === ALL
          ? true
          : folder === ASSIGNED
            ? assigned.has(word.id)
            : folder === OWN
              ? !word.lesson
              : String(word.lesson?.number) === folder;
      if (!inFolder) return false;
      if (!needle) return true;
      return (
        word.english.toLowerCase().includes(needle) ||
        word.russian.toLowerCase().includes(needle)
      );
    });
  }, [words, query, folder, assigned]);

  function toggle(word: StudentWord) {
    const value = !assigned.has(word.id);

    setAssigned((prev) => {
      const next = new Set(prev);
      if (value) next.add(word.id);
      else next.delete(word.id);
      return next;
    });
    startTransition(async () => {
      await setWordAssignedAction(word.id, value);
    });
  }

  if (words.length === 0) {
    return (
      <p className="text-[14px] text-ink-500">
        В словаре ученика пока нет слов. Добавьте слово через форму выше — его
        можно сразу назначить к уроку.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по слову или переводу…"
          autoComplete="off"
          className="field min-w-0 flex-1"
        />
        <span className="text-[13px] text-ink-500">
          Назначено: {assigned.size} из {words.length}
        </span>
        {assigned.size > 0 ? (
          <form
            action={async () => {
              setAssigned(new Set());
              await clearAssignedWordsAction(studentId);
            }}
          >
            <ConfirmSubmit
              className="btn-ghost btn-sm"
              pendingLabel="Снимаем…"
              title="Снять назначение со всех слов?"
              message="Слова останутся в словаре ученика, но пропадут из тренировки к следующему уроку. Удобно после того, как урок прошёл."
              confirmLabel="Снять"
              danger={false}
            >
              Снять со всех
            </ConfirmSubmit>
          </form>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <TopicButton
          active={folder === ALL}
          onClick={() => setFolder(ALL)}
          label={`Все (${words.length})`}
        />
        <TopicButton
          active={folder === ASSIGNED}
          onClick={() => setFolder(ASSIGNED)}
          label={`📌 Назначено (${assigned.size})`}
        />
        {topics.map(([number, name]) => (
          <TopicButton
            key={number}
            active={folder === String(number)}
            onClick={() => setFolder(String(number))}
            label={`№${number} · ${name} (${
              words.filter((word) => word.lesson?.number === number).length
            })`}
          />
        ))}
        {own > 0 ? (
          <TopicButton
            active={folder === OWN}
            onClick={() => setFolder(OWN)}
            label={`Свои слова (${own})`}
          />
        ) : null}
      </div>

      <div className="max-h-96 divide-y divide-ink-100 overflow-y-auto rounded-xl border border-ink-200">
        {visible.length === 0 ? (
          <p className="p-4 text-center text-[14px] text-ink-500">
            {folder === ASSIGNED && !query.trim()
              ? "Пока ничего не назначено."
              : "Ничего не найдено."}
          </p>
        ) : (
          visible.map((word) => (
            <label
              key={word.id}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-ink-50"
            >
              <input
                type="checkbox"
                checked={assigned.has(word.id)}
                onChange={() => toggle(word)}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-[14px] font-medium text-ink-900">
                {word.english}
              </span>
              <span className="text-[14px] text-ink-500">— {word.russian}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
