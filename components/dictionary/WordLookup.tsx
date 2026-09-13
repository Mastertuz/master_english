"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Field";
import type { SensesResult } from "@/lib/dictionary";
import { SenseCard } from "./SenseCard";

/** Поиск слова в Cambridge — без добавления в словарь (режим ученика) */
export function WordLookup() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SensesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    const word = query.trim();
    if (!word) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/dictionary/senses?word=${encodeURIComponent(word)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Слово не найдено");
        return;
      }
      setResult(data as SensesResult);
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
        Все значения слова с переводом, определением, примером и
        произношением из Cambridge Dictionary
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
          placeholder="например, book"
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
          className="btn-primary sm:w-44"
        >
          {loading ? "Ищем…" : "🔍 Найти слово"}
        </button>
      </div>

      {error ? (
        <div className="mt-3">
          <Alert kind="error">{error}</Alert>
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 space-y-2">
          <p className="text-[13.5px] text-ink-500">
            Найдено значений: {result.senses.length}
            {result.source === "cambridge"
              ? " · Cambridge Dictionary"
              : " · резервный словарь"}
          </p>
          {result.senses.map((sense, index) => (
            <SenseCard key={index} sense={sense} />
          ))}
          <p className="text-[12.5px] text-ink-400">
            Чтобы слово попало в тренировки, попросите преподавателя добавить
            его в ваш словарь.
          </p>
        </div>
      ) : null}
    </div>
  );
}
