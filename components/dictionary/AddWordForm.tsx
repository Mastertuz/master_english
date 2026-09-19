"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { addWordAction, type WordState } from "@/app/actions/words";
import { Alert } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { UploadField } from "@/components/ui/UploadField";
import type { DictionarySense, SensesResult } from "@/lib/dictionary";
import { SenseCard } from "./SenseCard";

export type WordOwner = { id: string; name: string };

/**
 * Выбранные значения складываем в одну карточку. У ученика слово хранится
 * один раз, поэтому «book — книга» и «book — бронировать» нельзя завести
 * отдельно; а перевод через запятую тренировка засчитывает любой.
 */
function mergeSenses(senses: DictionarySense[]) {
  const unique = (values: string[], separator: string) =>
    [...new Set(values.map((value) => value.trim()).filter(Boolean))].join(separator);

  return {
    word: senses[0]?.word ?? "",
    russian: unique(senses.map((sense) => sense.russian), ", "),
    partOfSpeech: unique(senses.map((sense) => sense.partOfSpeech), ", "),
    definition: unique(senses.map((sense) => sense.definition), "; "),
    example: senses.find((sense) => sense.example)?.example ?? "",
    transcription: senses.find((sense) => sense.transcription)?.transcription ?? "",
    audioUrl: senses.find((sense) => sense.audioUrl)?.audioUrl ?? "",
  };
}

/**
 * Поиск в Cambridge и добавление слова. Администратор выбирает, в чей
 * словарь добавить, и может поставить картинку; ученик пополняет свой словарь.
 */
export function AddWordForm({
  owners,
  canSetImage,
}: {
  owners: WordOwner[];
  canSetImage: boolean;
}) {
  const [state, action] = useActionState<WordState, FormData>(
    addWordAction,
    null,
  );

  const [english, setEnglish] = useState("");
  const [result, setResult] = useState<SensesResult | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // Растёт после каждого сохранения — по нему пересоздаём поля пустыми
  const [saved, setSaved] = useState(0);

  // useActionState отдаёт новый объект на каждую отправку, поэтому
  // сравниваем по ссылке: иначе форма сбрасывалась бы на каждый рендер
  const handled = useRef<WordState>(null);

  useEffect(() => {
    if (!state?.ok || state === handled.current) return;

    handled.current = state;
    setOpen(false);
    setResult(null);
    setSelected([]);
    setEnglish("");
    setLookupError(null);
    setSaved((value) => value + 1);
  }, [state]);

  const merged = useMemo(() => {
    const chosen = selected
      .map((index) => result?.senses[index])
      .filter((sense): sense is DictionarySense => Boolean(sense));
    return chosen.length ? mergeSenses(chosen) : null;
  }, [selected, result]);

  async function lookup() {
    const query = english.trim();
    if (!query) return;

    setLoading(true);
    setLookupError(null);
    setResult(null);
    setSelected([]);

    try {
      const response = await fetch(
        `/api/dictionary/senses?word=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setLookupError(data.error ?? "Не удалось найти слово");
        return;
      }

      const found = data as SensesResult;
      setResult(found);
      // Первое значение отмечаем сразу: чаще всего нужно именно оно
      setSelected(found.senses.length ? [0] : []);
      // Cambridge приводит слово к начальной форме: booked → book
      if (found.senses[0]?.word) setEnglish(found.senses[0].word);
    } catch {
      setLookupError("Не удалось связаться со словарём. Проверьте интернет.");
    } finally {
      setLoading(false);
    }
  }

  function toggle(index: number) {
    const word = result?.senses[index]?.word;
    const current = selected.map((item) => result?.senses[item]?.word);

    if (selected.includes(index)) {
      setSelected(selected.filter((item) => item !== index));
    } else if (word && current.some((item) => item !== word)) {
      // В статье «achieve» есть и «achievable» — это другое слово, в одну
      // карточку с «achieve» его не складываем, а выбираем отдельно
      setSelected([index]);
    } else {
      setSelected([...selected, index].sort((a, b) => a - b));
    }
    // В словарь попадёт именно выбранное слово, а не то, что искали
    if (word) setEnglish(word);
  }

  // Примеры меток для пояснения над списком — из найденных значений
  const guide = result?.senses.find((sense) => sense.guideword)?.guideword.toLowerCase() ?? "";
  const level = result?.senses.find((sense) => sense.level)?.level ?? "";

  // Поля пересоздаются, когда меняется выбор значений
  const key = `${saved}-${result?.word ?? ""}-${selected.join(".")}`;

  return (
    <form action={action} className="card p-5" noValidate>
      <h2 className="text-[15px] font-semibold text-ink-900">
        🌐 Поиск в Cambridge Dictionary и добавление слова
      </h2>
      <p className="mt-1 text-[13.5px] text-ink-500">
        Введите слово и нажмите «Найти слово» — появятся все его значения из
        Cambridge Dictionary. Отметьте нужные и добавьте, заполнять поля
        вручную не нужно.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          name="english"
          value={english}
          onChange={(event) => setEnglish(event.target.value)}
          onKeyDown={(event) => {
            // Enter ищет слово, а не отправляет пустую форму
            if (event.key === "Enter") {
              event.preventDefault();
              void lookup();
            }
          }}
          placeholder="например, book"
          autoComplete="off"
          className={`field flex-1 ${state?.errors?.english ? "field-error" : ""}`}
        />
        <button
          type="button"
          onClick={lookup}
          disabled={loading}
          className="btn-ghost sm:w-44"
        >
          {loading ? "Ищем…" : "🔍 Найти в Cambridge"}
        </button>
      </div>

      {state?.errors?.english ? (
        <p className="hint">{state.errors.english}</p>
      ) : null}

      {lookupError ? (
        <div className="mt-3">
          <Alert kind="error">{lookupError}</Alert>
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 space-y-2">
          <p className="text-[13.5px] text-ink-500">
            Найдено значений: {result.senses.length}
            {result.senses.length > 1
              ? " · можно выбрать несколько — они сложатся в одну карточку"
              : ""}
            {result.source === "cambridge" ? "" : " · резервный словарь"}
          </p>
          {guide || level ? (
            <p className="text-[12.5px] text-ink-400">
              {guide ? (
                <>
                  <span className="chip bg-amber-50 text-amber-700">{guide}</span>{" "}
                  — подсказка Cambridge, о каком значении слова речь
                  {level ? "; " : ""}
                </>
              ) : null}
              {level ? (
                <>
                  <span className="chip bg-emerald-50 text-emerald-700">{level}</span>{" "}
                  — уровень слова в этом значении (от A1 до C2)
                </>
              ) : null}
            </p>
          ) : null}

          {result.senses.map((sense, index) => (
            <SenseCard
              key={index}
              sense={sense}
              selected={selected.includes(index)}
              onToggle={() => toggle(index)}
            />
          ))}

          <div className="rounded-xl bg-ink-50 px-4 py-3">
            {merged ? (
              <p className="text-[14px] text-ink-700">
                В словарь попадёт: <b>{merged.word}</b> —{" "}
                {merged.russian || (
                  <span className="text-rose-600">перевод нужно вписать</span>
                )}
              </p>
            ) : (
              <p className="text-[14px] text-ink-500">
                Отметьте хотя бы одно значение.
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {merged?.russian ? (
                <SubmitButton pendingLabel="Добавляем…" className="btn-primary">
                  ➕ Добавить в словарь
                </SubmitButton>
              ) : merged ? (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="btn-primary"
                >
                  Вписать перевод и добавить
                </button>
              ) : null}
              {merged ? (
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  className="btn-ghost"
                >
                  {open ? "Скрыть поля" : "Изменить перед добавлением"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {state?.message ? (
        <div className="mt-3">
          <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
        </div>
      ) : null}

      {result ? null : (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-4 text-[13.5px] font-medium text-brand-600 hover:text-brand-700"
        >
          {open ? "Свернуть поля" : "Заполнить поля вручную ▾"}
        </button>
      )}

      <div className={`mt-4 grid gap-4 ${open ? "" : "hidden"}`}>
        {owners.length > 0 ? (
          <div>
            <label className="label" htmlFor="userId">
              В чей словарь добавить
            </label>
            <select id="userId" name="userId" className="field">
              <option value="">Мой словарь</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <Row
            label="Перевод на русский"
            name="russian"
            key={`ru-${key}`}
            defaultValue={merged?.russian ?? ""}
            error={state?.errors?.russian}
            placeholder="книга, бронировать"
            hint="Несколько переводов — через запятую, тренировка примет любой"
          />
          <Row
            label="Часть речи"
            name="partOfSpeech"
            key={`pos-${key}`}
            defaultValue={merged?.partOfSpeech ?? ""}
            placeholder="noun, verb"
          />
        </div>

        <Row
          label="Пример использования"
          name="example"
          key={`ex-${key}`}
          defaultValue={merged?.example ?? ""}
          placeholder="I've just read a great book."
          textarea
        />
        <Row
          label="Определение (англ.)"
          name="definition"
          key={`def-${key}`}
          defaultValue={merged?.definition ?? ""}
          placeholder="a written text that can be published"
          textarea
        />
        <Row
          label="Определение по-русски"
          name="definitionRu"
          placeholder="напечатанный текст, который можно издать"
          hint="Используется в тренировке «слово по определению»"
          textarea
        />
        <Row
          label="Транскрипция"
          name="transcription"
          key={`ipa-${key}`}
          defaultValue={merged?.transcription ?? ""}
          placeholder="/bʊk/"
        />

        {canSetImage ? (
          <UploadField
            key={`img-${key}`}
            label="Картинка для тренировки"
            name="imageUrl"
            hint="Ссылка или файл до 8 МБ — используется в режиме «карточка-картинка». Если оставить пустым, фото подберётся само"
          />
        ) : null}
      </div>

      <input
        type="hidden"
        name="audioUrl"
        key={`audio-${key}`}
        defaultValue={merged?.audioUrl ?? ""}
      />
      <input
        type="hidden"
        name="source"
        value={merged ? (result?.source ?? "cambridge") : "manual"}
      />

      {/* Без результата поиска или с открытыми полями — обычная кнопка внизу */}
      {!result || open ? (
        <div className="mt-5">
          <SubmitButton pendingLabel="Добавляем…" className="btn-primary">
            Добавить в словарь
          </SubmitButton>
        </div>
      ) : null}
    </form>
  );
}

function Row({
  label,
  name,
  defaultValue,
  placeholder,
  error,
  hint,
  textarea = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={2}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`field resize-y ${error ? "field-error" : ""}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          className={`field ${error ? "field-error" : ""}`}
        />
      )}
      {error ? <p className="hint">{error}</p> : null}
      {!error && hint ? (
        <p className="mt-1.5 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}
