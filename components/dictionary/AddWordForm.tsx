"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addWordAction, type WordState } from "@/app/actions/words";
import { Alert } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { UploadField } from "@/components/ui/UploadField";
import type { LookupResult } from "@/lib/dictionary";

export type WordOwner = { id: string; name: string };

/** Добавление слова — только для администратора */
export function AddWordForm({ owners }: { owners: WordOwner[] }) {
  const [state, action] = useActionState<WordState, FormData>(
    addWordAction,
    null,
  );

  const [english, setEnglish] = useState("");
  const [found, setFound] = useState<LookupResult | null>(null);
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
    setFound(null);
    setEnglish("");
    setLookupError(null);
    setSaved((value) => value + 1);
  }, [state]);

  async function lookup() {
    const query = english.trim();
    if (!query) return;

    setLoading(true);
    setLookupError(null);
    setFound(null);

    try {
      const response = await fetch(
        `/api/dictionary/lookup?word=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setLookupError(data.error ?? "Не удалось найти слово");
        return;
      }
      setFound(data as LookupResult);
      setOpen(true);
    } catch {
      setLookupError("Не удалось связаться со словарём. Проверьте интернет.");
    } finally {
      setLoading(false);
    }
  }

  const key = `${saved}-${found?.word ?? ""}`;

  return (
    <form action={action} className="card p-5" noValidate>
      <h2 className="text-[15px] font-semibold text-ink-900">Добавить слово</h2>
      <p className="mt-1 text-[13.5px] text-ink-500">
        Введите слово и нажмите «Найти» — перевод, определение, пример и
        произношение подтянутся из Cambridge Dictionary.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          name="english"
          value={english}
          onChange={(event) => setEnglish(event.target.value)}
          placeholder="например, achieve"
          autoComplete="off"
          className={`field flex-1 ${state?.errors?.english ? "field-error" : ""}`}
        />
        <button
          type="button"
          onClick={lookup}
          disabled={loading}
          className="btn-ghost sm:w-40"
        >
          {loading ? "Ищем…" : "🔍 Найти"}
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

      {found ? (
        <div className="mt-3">
          <Alert kind="info">
            Найдено в{" "}
            {found.source === "cambridge"
              ? "Cambridge Dictionary"
              : "резервном словаре"}
            {found.transcription ? ` · ${found.transcription}` : ""}
            {found.partOfSpeech ? ` · ${found.partOfSpeech}` : ""}
          </Alert>
        </div>
      ) : null}

      {state?.message ? (
        <div className="mt-3">
          <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mt-4 text-[13.5px] font-medium text-brand-600 hover:text-brand-700"
      >
        {open ? "Свернуть поля" : "Заполнить поля вручную ▾"}
      </button>

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

        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <Row
            label="Перевод на русский"
            name="russian"
            key={`ru-${key}`}
            defaultValue={found?.russian ?? ""}
            error={state?.errors?.russian}
            placeholder="достигать"
          />
          <Row
            label="Часть речи"
            name="partOfSpeech"
            key={`pos-${key}`}
            defaultValue={found?.partOfSpeech ?? ""}
            placeholder="verb"
          />
        </div>

        <Row
          label="Пример использования"
          name="example"
          key={`ex-${key}`}
          defaultValue={found?.example ?? ""}
          placeholder="She achieved her goal."
          textarea
        />
        <Row
          label="Определение (англ.)"
          name="definition"
          key={`def-${key}`}
          defaultValue={found?.definition ?? ""}
          placeholder="to succeed in finishing something"
          textarea
        />
        <Row
          label="Определение по-русски"
          name="definitionRu"
          placeholder="добиться результата, к которому стремился"
          hint="Используется в тренировке «слово по определению»"
          textarea
        />
        <Row
          label="Транскрипция"
          name="transcription"
          key={`ipa-${key}`}
          defaultValue={found?.transcription ?? ""}
          placeholder="/əˈtʃiːv/"
        />

        <UploadField
          key={`img-${key}`}
          label="Картинка для тренировки"
          name="imageUrl"
          hint="Ссылка или файл до 8 МБ — используется в режиме «карточка-картинка»"
        />
      </div>

      <input
        type="hidden"
        name="audioUrl"
        key={`audio-${key}`}
        defaultValue={found?.audioUrl ?? ""}
      />
      <input type="hidden" name="source" value={found?.source ?? "manual"} />

      <div className="mt-5">
        <SubmitButton pendingLabel="Добавляем…" className="btn-primary">
          Добавить в словарь
        </SubmitButton>
      </div>
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
