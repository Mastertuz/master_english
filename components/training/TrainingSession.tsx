"use client";

import { useMemo, useState } from "react";
import {
  Trainer,
  type Mode,
  type TrainingWord,
} from "@/components/training/Trainer";
import { TopicButton } from "@/components/dictionary/WordsTable";
import { partOfSpeechRu } from "@/lib/part-of-speech";

/** Сколько слов отмечено по умолчанию — как раньше, самые «забытые» */
const DEFAULT_PICK = 40;

/** Папки, как в словаре: все слова, урок по номеру или свои слова */
const ALL = "all";
const OWN = "own";

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
  const [topic, setTopic] = useState<string>(ALL);
  // Пришли из урока с готовым набором — начинаем сразу, без экрана выбора
  const [started, setStarted] = useState(preselectedIds.length > 0);
  // Меняется при каждом старте, чтобы Trainer пересобрал колоду заново
  const [run, setRun] = useState(0);

  const picked = useMemo(
    () => words.filter((word) => selected.has(word.id)),
    [words, selected],
  );

  // Папки словаря: урок №N и «свои слова» — в том же порядке, что в словаре
  const topics = useMemo(() => {
    const map = new Map<number, string>();
    for (const word of words) {
      if (word.lesson) map.set(word.lesson.number, word.lesson.topic);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [words]);

  const ownCount = words.filter((word) => !word.lesson).length;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return words.filter((word) => {
      const inTopic =
        topic === ALL
          ? true
          : topic === OWN
            ? !word.lesson
            : String(word.lesson?.number) === topic;
      if (!inTopic) return false;
      if (!needle) return true;
      return (
        word.english.toLowerCase().includes(needle) ||
        word.russian.toLowerCase().includes(needle)
      );
    });
  }, [words, query, topic]);

  /** Видимые слова по папкам: заголовок папки и её слова */
  const groups = useMemo(() => {
    const byFolder = new Map<string, { label: string; words: TrainingWord[] }>();
    for (const word of visible) {
      const key = word.lesson ? String(word.lesson.number) : OWN;
      const label = word.lesson
        ? `№${word.lesson.number} · ${word.lesson.topic}`
        : "Свои слова";
      const folder = byFolder.get(key) ?? { label, words: [] };
      folder.words.push(word);
      byFolder.set(key, folder);
    }
    return [...byFolder.entries()]
      .sort(([a], [b]) =>
        a === OWN ? 1 : b === OWN ? -1 : Number(a) - Number(b),
      )
      .map(([key, folder]) => ({ key, ...folder }));
  }, [visible]);

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

  /** Отметить/снять всё, что сейчас видно с учётом поиска и папки */
  function setAll(value: boolean, items: TrainingWord[] = visible) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const word of items) {
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

        {topics.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <TopicButton
              active={topic === ALL}
              onClick={() => setTopic(ALL)}
              label={`Все (${words.length})`}
            />
            {topics.map(([number, name]) => (
              <TopicButton
                key={number}
                active={topic === String(number)}
                onClick={() => setTopic(String(number))}
                label={`№${number} · ${name} (${
                  words.filter((word) => word.lesson?.number === number).length
                })`}
              />
            ))}
            {ownCount > 0 ? (
              <TopicButton
                active={topic === OWN}
                onClick={() => setTopic(OWN)}
                label={`Свои слова (${ownCount})`}
              />
            ) : null}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="btn-ghost btn-sm"
          >
            Выбрать все{query.trim() || topic !== ALL ? " показанные" : ""}
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="btn-ghost btn-sm"
          >
            Снять выбор
          </button>
        </div>

        <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {visible.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-ink-500">
              Ничего не найдено
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.key} className="space-y-1.5">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-white/95 py-1 backdrop-blur">
                  <p className="min-w-0 truncate text-[13px] font-semibold text-ink-500">
                    {group.label} ({group.words.length})
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setAll(
                        !group.words.every((word) => selected.has(word.id)),
                        group.words,
                      )
                    }
                    className="shrink-0 text-[12.5px] font-medium text-brand-600 hover:text-brand-700"
                  >
                    {group.words.every((word) => selected.has(word.id))
                      ? "снять папку"
                      : "выбрать папку"}
                  </button>
                </div>

                {group.words.map((word) => {
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
                })}
              </div>
            ))
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
