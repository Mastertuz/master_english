"use client";

import { useMemo, useState, useTransition } from "react";
import {
  clearAssignedWordsAction,
  setWordsAssignedAction,
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
 * Слова ученика, назначенные к следующему уроку. Галочки только отмечают
 * слова, а назначает отдельная кнопка: так можно спокойно отобрать десяток
 * слов из разных папок и применить выбор одним нажатием.
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
  // Отмеченные галочкой, но ещё не применённые
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string>(ALL);
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

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

  function toggle(id: string) {
    setNotice("");
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function pickShown(value: boolean) {
    setNotice("");
    setPicked((prev) => {
      const next = new Set(prev);
      for (const word of visible) {
        if (value) next.add(word.id);
        else next.delete(word.id);
      }
      return next;
    });
  }

  /** Применить выбор: назначить отмеченные слова или убрать с них назначение */
  function apply(value: boolean) {
    const ids = [...picked];
    if (ids.length === 0) return;

    setAssigned((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (value) next.add(id);
        else next.delete(id);
      }
      return next;
    });
    setPicked(new Set());
    setNotice(
      value
        ? `К следующему уроку назначено слов: ${ids.length}`
        : `Назначение снято со слов: ${ids.length}`,
    );

    startTransition(async () => {
      await setWordsAssignedAction(studentId, ids, value);
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

  const pickedAssigned = [...picked].filter((id) => assigned.has(id)).length;
  const pickedNew = picked.size - pickedAssigned;

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

      {/* Панель действий: выбор слов и отдельная кнопка «назначить» */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-ink-50 px-3 py-2.5">
        <button
          type="button"
          disabled={picked.size === 0 || pickedNew === 0 || pending}
          onClick={() => apply(true)}
          className="btn-primary btn-sm"
        >
          📌 Назначить к следующему уроку{pickedNew > 0 ? ` (${pickedNew})` : ""}
        </button>
        <button
          type="button"
          disabled={pickedAssigned === 0 || pending}
          onClick={() => apply(false)}
          className="btn-ghost btn-sm"
        >
          Убрать назначение{pickedAssigned > 0 ? ` (${pickedAssigned})` : ""}
        </button>

        <span className="mx-1 hidden h-5 w-px bg-ink-200 sm:block" />

        <button type="button" onClick={() => pickShown(true)} className="btn-ghost btn-sm">
          Отметить все показанные
        </button>
        <button
          type="button"
          disabled={picked.size === 0}
          onClick={() => pickShown(false)}
          className="btn-ghost btn-sm"
        >
          Снять отметки
        </button>

        {assigned.size > 0 ? (
          <form
            className="ml-auto"
            action={async () => {
              setAssigned(new Set());
              setPicked(new Set());
              setNotice("Назначение снято со всех слов");
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

      {notice ? (
        <p className="text-[13px] font-medium text-emerald-700">✓ {notice}</p>
      ) : (
        <p className="text-[12.5px] text-ink-400">
          Отметьте слова галочками и нажмите «Назначить к следующему уроку».
          {picked.size > 0 ? ` Отмечено: ${picked.size}.` : ""}
        </p>
      )}

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
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-ink-50 ${
                picked.has(word.id) ? "bg-brand-50/70" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={picked.has(word.id)}
                onChange={() => toggle(word.id)}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-[14px] font-medium text-ink-900">
                {word.english}
              </span>
              <span className="text-[14px] text-ink-500">— {word.russian}</span>
              {assigned.has(word.id) ? (
                <span className="chip ml-auto bg-amber-50 text-amber-700">
                  📌 назначено
                </span>
              ) : null}
            </label>
          ))
        )}
      </div>
    </div>
  );
}
