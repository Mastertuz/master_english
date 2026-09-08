"use client";

import { useMemo, useState } from "react";
import {
  Trainer,
  type Mode,
  type TrainingWord,
} from "@/components/training/Trainer";
import { partOfSpeechRu } from "@/lib/part-of-speech";

/** Сколько слов отмечено по умолчанию — как раньше, самые «забытые» */
const DEFAULT_PICK = 40;

export function TrainingSession({
  mode,
  words,
  preselectedIds = [],
  lessonTopic = "",
}: {
  mode: Mode;
  words: TrainingWord[];
  /** Слова, отмеченные заранее — например, при переходе из урока */
  preselectedIds?: string[];
  /** Тема урока, из которого пришли: показываем, что именно отмечено */
  lessonTopic?: string;
}) {
  // Пришли из урока — берём ровно его слова, даже если их не нашлось ни одного:
  // подставлять вместо них случайные было бы неожиданно
  const fromLesson = lessonTopic.length > 0;

  const [selected, setSelected] = useState<Set<string>>(() =>
    fromLesson
      ? new Set(preselectedIds)
      : new Set(words.slice(0, DEFAULT_PICK).map((word) => word.id)),
  );
  const [query, setQuery] = useState("");
  // Пришли из урока с готовым набором — начинаем сразу, без экрана выбора
  const [started, setStarted] = useState(preselectedIds.length > 0);
  // Меняется при каждом старте, чтобы Trainer пересобрал колоду заново
  const [run, setRun] = useState(0);

  const picked = useMemo(
    () => words.filter((word) => selected.has(word.id)),
    [words, selected],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return words;
    return words.filter(
      (word) =>
        word.english.toLowerCase().includes(needle) ||
        word.russian.toLowerCase().includes(needle),
    );
  }, [words, query]);

  if (started && picked.length > 0) {
    return (
      <div className="space-y-3">
        <div className="mx-auto flex max-w-xl justify-end">
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="btn-ghost btn-sm"
          >
            ← Выбрать другие слова
          </button>
        </div>
        <Trainer key={run} mode={mode} words={picked} />
      </div>
    );
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /** Отметить/снять всё, что сейчас видно с учётом поиска */
  function setAllVisible(value: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const word of visible) {
        if (value) next.add(word.id);
        else next.delete(word.id);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card p-5">
        <h2 className="text-[16px] font-semibold text-ink-900">
          Выберите слова для тренировки
        </h2>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Отмечено {picked.length} из {words.length}.{" "}
          {!fromLesson
            ? "По умолчанию выбраны те, которые вы давно не повторяли."
            : preselectedIds.length > 0
              ? `Отмечены слова из урока «${lessonTopic}».`
              : null}
        </p>

        {fromLesson && preselectedIds.length === 0 ? (
          <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-700">
            Слов из урока «{lessonTopic}» в вашем словаре пока нет — отметьте
            нужные вручную или попросите преподавателя добавить их.
          </p>
        ) : null}

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по слову или переводу…"
          autoComplete="off"
          className="field mt-4"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAllVisible(true)}
            className="btn-ghost btn-sm"
          >
            Выбрать все{query.trim() ? " найденные" : ""}
          </button>
          <button
            type="button"
            onClick={() => setAllVisible(false)}
            className="btn-ghost btn-sm"
          >
            Снять выбор
          </button>
        </div>

        <div className="mt-4 max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
          {visible.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-ink-500">
              Ничего не найдено
            </p>
          ) : (
            visible.map((word) => {
              const checked = selected.has(word.id);
              const partOfSpeech = partOfSpeechRu(word.partOfSpeech);

              return (
                <label
                  key={word.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                    checked
                      ? "border-brand-400 bg-brand-50"
                      : "border-ink-200 bg-white hover:bg-ink-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(word.id)}
                    className="h-4 w-4 shrink-0 accent-brand-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium text-ink-900">
                      {word.english}
                      {word.russian ? (
                        <span className="font-normal text-ink-500">
                          {" "}
                          — {word.russian}
                        </span>
                      ) : null}
                    </span>
                    {partOfSpeech ? (
                      <span className="mt-0.5 block text-[12.5px] text-ink-400">
                        {partOfSpeech}
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <button
          type="button"
          disabled={picked.length === 0}
          onClick={() => {
            setRun((value) => value + 1);
            setStarted(true);
          }}
          className="btn-primary mt-5 w-full"
        >
          {picked.length === 0
            ? "Отметьте хотя бы одно слово"
            : `Начать тренировку (${picked.length})`}
        </button>
      </div>
    </div>
  );
}
