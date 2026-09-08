"use client";

import { useActionState, useMemo, useState } from "react";
import {
  deleteWordAction,
  updateWordAction,
  type WordState,
} from "@/app/actions/words";
import { Alert } from "@/components/ui/Field";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { partOfSpeechRu } from "@/lib/part-of-speech";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { UploadField } from "@/components/ui/UploadField";

/** Значения фильтра, которые не являются номером урока */
const ALL = "ALL";
const OWN = "OWN";

export type WordRow = {
  id: string;
  english: string;
  russian: string;
  example: string;
  definition: string;
  definitionRu: string;
  transcription: string;
  partOfSpeech: string;
  imageUrl: string;
  audioUrl: string;
  correctCount: number;
  wrongCount: number;
  /** Урок, из которого слово попало в словарь; null — добавлено вручную */
  lesson: { number: number; topic: string } | null;
};

export function WordsTable({
  words,
  canEdit,
}: {
  words: WordRow[];
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState<WordRow | null>(null);

  // Фильтр по теме урока: ALL — все слова, OWN — добавленные вручную
  const [topic, setTopic] = useState<string>(ALL);

  const topics = useMemo(() => {
    const map = new Map<number, string>();
    for (const word of words) {
      if (word.lesson) map.set(word.lesson.number, word.lesson.topic);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [words]);

  const own = words.filter((word) => !word.lesson).length;

  const visible = useMemo(() => {
    if (topic === ALL) return words;
    if (topic === OWN) return words.filter((word) => !word.lesson);
    return words.filter((word) => String(word.lesson?.number) === topic);
  }, [words, topic]);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-200 p-4">
        <h2 className="text-[15px] font-semibold text-ink-900">Мой словарь</h2>
        <p className="text-[13px] text-ink-500">
          {words.length} {plural(words.length, "слово", "слова", "слов")}
          {topic === ALL ? "" : ` · показано ${visible.length}`}
        </p>

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
            {own > 0 ? (
              <TopicButton
                active={topic === OWN}
                onClick={() => setTopic(OWN)}
                label={`Свои слова (${own})`}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {words.length === 0 ? (
        <p className="p-8 text-center text-[14px] text-ink-500">
          Словарь пуст. Слова появятся, когда преподаватель назначит урок или
          добавит их вручную.
        </p>
      ) : visible.length === 0 ? (
        <p className="p-8 text-center text-[14px] text-ink-500">
          В этой теме слов нет.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[14px]">
            <thead className="bg-ink-50 text-[12.5px] uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Английский</th>
                <th className="px-4 py-3 font-medium">Перевод</th>
                <th className="px-4 py-3 font-medium">Пример в предложении</th>
                <th className="px-4 py-3 font-medium">Определение</th>
                <th className="px-4 py-3 font-medium">Статистика</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {visible.map((word) => (
                <tr key={word.id} className="align-top hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <SpeakButton text={word.english} />
                      <div>
                        <p className="font-medium text-ink-900">
                          {word.english}
                        </p>
                        {word.transcription ? (
                          <p className="text-[12.5px] text-ink-400">
                            {word.transcription}
                          </p>
                        ) : null}
                        {word.partOfSpeech ? (
                          <span className="mt-1 inline-block rounded bg-ink-100 px-1.5 py-0.5 text-[11.5px] text-ink-500">
                            {partOfSpeechRu(word.partOfSpeech)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-800">{word.russian}</td>
                  <td className="max-w-xs px-4 py-3 text-ink-600 italic">
                    {word.example || "—"}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-ink-600">
                    {word.definition || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Accuracy
                      correct={word.correctCount}
                      wrong={word.wrongCount}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {canEdit ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditing(word)}
                          className="btn-ghost btn-sm"
                        >
                          Изменить
                        </button>{" "}
                        <form className="inline" action={deleteWordAction}>
                          <input type="hidden" name="id" value={word.id} />
                          <ConfirmSubmit
                            title="Удалить слово?"
                            message={`«${word.english}» пропадёт из словаря вместе со статистикой ответов. Отменить это нельзя.`}
                          >
                            Удалить
                          </ConfirmSubmit>
                        </form>
                      </>
                    ) : (
                      <span className="text-[12.5px] text-ink-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && canEdit ? (
        <EditDialog word={editing} onClose={() => setEditing(null)} />
      ) : null}
    </div>
  );
}

function EditDialog({
  word,
  onClose,
}: {
  word: WordRow;
  onClose: () => void;
}) {
  const [state, action] = useActionState<WordState, FormData>(
    updateWordAction,
    null,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overlay p-4">
      <div className="card rise max-h-[90dvh] w-full max-w-lg overflow-y-auto p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-[16px] font-semibold text-ink-900">
            Редактирование слова
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-ink-400 hover:text-ink-700"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <form action={action} className="space-y-4" noValidate>
          <input type="hidden" name="id" value={word.id} />
          <input type="hidden" name="audioUrl" value={word.audioUrl} />

          {state?.message ? (
            <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="edit-english">
                Английский
              </label>
              <input
                id="edit-english"
                name="english"
                defaultValue={word.english}
                className={`field ${state?.errors?.english ? "field-error" : ""}`}
              />
              {state?.errors?.english ? (
                <p className="hint">{state.errors.english}</p>
              ) : null}
            </div>
            <div>
              <label className="label" htmlFor="edit-russian">
                Перевод
              </label>
              <input
                id="edit-russian"
                name="russian"
                defaultValue={word.russian}
                className={`field ${state?.errors?.russian ? "field-error" : ""}`}
              />
              {state?.errors?.russian ? (
                <p className="hint">{state.errors.russian}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="edit-example">
              Пример использования
            </label>
            <textarea
              id="edit-example"
              name="example"
              rows={2}
              defaultValue={word.example}
              className="field resize-y"
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-definition">
              Определение
            </label>
            <textarea
              id="edit-definition"
              name="definition"
              rows={2}
              defaultValue={word.definition}
              className="field resize-y"
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-definitionRu">
              Определение по-русски
            </label>
            <textarea
              id="edit-definitionRu"
              name="definitionRu"
              rows={2}
              defaultValue={word.definitionRu}
              placeholder="Для тренировки «слово по определению»"
              className="field resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="edit-transcription">
                Транскрипция
              </label>
              <input
                id="edit-transcription"
                name="transcription"
                defaultValue={word.transcription}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="edit-partOfSpeech">
                Часть речи
              </label>
              <input
                id="edit-partOfSpeech"
                name="partOfSpeech"
                defaultValue={word.partOfSpeech}
                placeholder="noun, verb, adjective"
                className="field"
              />
            </div>
          </div>

          <UploadField
            label="Картинка для тренировки"
            name="imageUrl"
            defaultValue={word.imageUrl}
            hint="Ссылка или файл до 8 МБ"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Отмена
            </button>
            <ConfirmSubmit
              className="btn-primary"
              pendingLabel="Сохраняем…"
              title="Сохранить изменения?"
              message={`Карточка слова «${word.english}» будет перезаписана.`}
              confirmLabel="Сохранить"
              danger={false}
            >
              Сохранить
            </ConfirmSubmit>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Доля верных ответов: проценты, под ними — сколько всего попыток */
function Accuracy({ correct, wrong }: { correct: number; wrong: number }) {
  const total = correct + wrong;

  if (total === 0) {
    return <span className="text-[13px] text-ink-400">нет ответов</span>;
  }

  const percent = Math.round((correct / total) * 100);
  const tone =
    percent >= 80
      ? "text-emerald-600"
      : percent >= 50
        ? "text-amber-600"
        : "text-rose-500";

  return (
    <>
      <span className={`text-[15px] font-semibold ${tone}`}>{percent}%</span>
      <span className="ml-1.5 text-[12.5px] text-ink-400">
        {total} {plural(total, "ответ", "ответа", "ответов")}
      </span>
    </>
  );
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

/** Кнопка фильтра по теме урока */
function TopicButton({
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
