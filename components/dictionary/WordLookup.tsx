"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Field";
import { SpeakButton } from "@/components/ui/SpeakButton";
import type { LookupResult } from "@/lib/dictionary";
import { partOfSpeechRu } from "@/lib/part-of-speech";

/** Поиск слова в Cambridge — без добавления в словарь (режим ученика) */
export function WordLookup() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    const word = query.trim();
    if (!word) return;

    setLoading(true);
    setError(null);
    setFound(null);

    try {
      const response = await fetch(
        `/api/dictionary/lookup?word=${encodeURIComponent(word)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Слово не найдено");
        return;
      }
      setFound(data as LookupResult);
    } catch {
      setError("Не удалось связаться со словарём. Проверьте интернет.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="text-[15px] font-semibold text-ink-900">Найти слово</h2>
      <p className="mt-1 text-[13.5px] text-ink-500">
        Перевод, определение, пример и произношение из Cambridge Dictionary
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void lookup();
            }
          }}
          placeholder="например, achieve"
          autoComplete="off"
          className="field flex-1"
        />
        {/*
          disabled зависит только от loading: на сервере и при первой
          отрисовке в браузере он одинаково false, поэтому расхождения
          при гидратации возникнуть не может. Пустой запрос отсекает
          сам lookup(), а не заблокированная кнопка.
        */}
        <button
          type="button"
          onClick={lookup}
          disabled={loading}
          className="btn-primary sm:w-40"
        >
          {loading ? "Ищем…" : "🔍 Найти"}
        </button>
      </div>

      {error ? (
        <div className="mt-3">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {found ? (
        <div className="mt-4 rounded-xl border border-ink-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <SpeakButton text={found.word} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[19px] font-semibold text-ink-900">
                {found.word}
                {found.transcription ? (
                  <span className="ml-2 text-[14px] font-normal text-ink-400">
                    {found.transcription}
                  </span>
                ) : null}
                {found.partOfSpeech ? (
                  <span className="ml-2 rounded bg-ink-100 px-1.5 py-0.5 text-[12px] font-normal text-ink-500">
                    {partOfSpeechRu(found.partOfSpeech)}
                  </span>
                ) : null}
              </p>

              {found.russian ? (
                <p className="mt-1 text-[15px] text-ink-700">{found.russian}</p>
              ) : null}

              {found.definition ? (
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                  {found.definition}
                </p>
              ) : null}

              {found.example ? (
                <p className="mt-2 text-[14px] italic text-ink-500">
                  {found.example}
                </p>
              ) : null}

              <p className="mt-3 text-[12.5px] text-ink-400">
                Источник:{" "}
                {found.source === "cambridge"
                  ? "Cambridge Dictionary"
                  : "резервный словарь"}
                . Чтобы слово попало в тренировки, попросите преподавателя
                добавить его в ваш словарь.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
