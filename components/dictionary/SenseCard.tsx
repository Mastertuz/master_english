"use client";

import { SpeakButton } from "@/components/ui/SpeakButton";
import type { DictionarySense } from "@/lib/dictionary";
import { partOfSpeechRu } from "@/lib/part-of-speech";

/** Уровни CEFR, как их отмечает Cambridge */
const LEVELS: Record<string, string> = {
  A1: "начальный",
  A2: "элементарный",
  B1: "средний",
  B2: "выше среднего",
  C1: "продвинутый",
  C2: "в совершенстве",
};

/**
 * Одно значение слова из Cambridge: часть речи, подсказка к значению,
 * уровень, перевод, определение и пример. С onToggle карточку можно выбрать.
 */
export function SenseCard({
  sense,
  selected = false,
  onToggle,
}: {
  sense: DictionarySense;
  selected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        selected ? "border-brand-400 bg-brand-50/60" : "border-ink-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <SpeakButton text={sense.word} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[16px] font-semibold text-ink-900">
              {sense.word}
            </span>
            {sense.transcription ? (
              <span className="text-[13px] text-ink-400">
                {sense.transcription}
              </span>
            ) : null}
            {sense.partOfSpeech ? (
              <span className="chip bg-ink-100 text-ink-600">
                {partOfSpeechRu(sense.partOfSpeech)}
              </span>
            ) : null}
            {sense.guideword ? (
              <span
                className="chip cursor-help bg-amber-50 text-amber-700"
                title={`Подсказка Cambridge: это значение слова — «${sense.guideword.toLowerCase()}». Помогает отличить одно значение многозначного слова от другого`}
              >
                {sense.guideword.toLowerCase()}
              </span>
            ) : null}
            {sense.level ? (
              <span
                className="chip cursor-help bg-emerald-50 text-emerald-700"
                title={`Уровень слова в этом значении: ${sense.level} — ${LEVELS[sense.level] ?? ""}`}
              >
                {sense.level}
              </span>
            ) : null}
          </div>

          <p
            className={`mt-1 text-[15px] ${
              sense.russian ? "font-medium text-ink-800" : "text-ink-400"
            }`}
          >
            {sense.russian || "Перевода в англо-русском словаре нет"}
          </p>

          {sense.definition ? (
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">
              {sense.definition}
            </p>
          ) : null}

          {sense.example ? (
            <p className="mt-1 text-[13.5px] italic text-ink-500">
              {sense.example}
            </p>
          ) : null}
        </div>

        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={selected}
            className={`shrink-0 ${selected ? "btn-primary btn-sm" : "btn-ghost btn-sm"}`}
          >
            {selected ? "✓ Выбрано" : "Выбрать"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
