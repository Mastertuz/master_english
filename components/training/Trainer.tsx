"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { recordAttemptAction } from "@/app/actions/words";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { isAnswerCorrect, shuffle } from "@/lib/answer";
import { partOfSpeechRu } from "@/lib/part-of-speech";

export type TrainingWord = {
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
};

export type Mode = "TRANSLATE" | "IMAGE" | "DEFINITION";
type Direction = "EN_RU" | "RU_EN";

type Mistake = {
  word: TrainingWord;
  given: string;
  expected: string;
};

const MODE_TITLES: Record<Mode, string> = {
  TRANSLATE: "Слово и перевод",
  IMAGE: "Слово по картинке",
  DEFINITION: "Слово по определению",
};

/** Подписи переключателя направления; у режима с картинкой его нет */
const DIRECTION_LABELS: Record<Mode, [string, string] | null> = {
  TRANSLATE: ["EN → RU", "RU → EN"],
  IMAGE: null,
  DEFINITION: ["Определение по-англ.", "Определение по-русски"],
};

export function Trainer({
  mode,
  words,
}: {
  mode: Mode;
  words: TrainingWord[];
}) {
  const [direction, setDirection] = useState<Direction>("EN_RU");
  const [deck, setDeck] = useState<TrainingWord[]>(() => shuffle(words));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [verdict, setVerdict] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [finished, setFinished] = useState(false);

  function restart(nextDirection?: Direction) {
    if (nextDirection) setDirection(nextDirection);
    setDeck(shuffle(words));
    setIndex(0);
    setAnswer("");
    setVerdict(null);
    setScore({ correct: 0, total: 0 });
    setMistakes([]);
    setFinished(false);
  }

  const current = deck[index];
  const partOfSpeech = current ? partOfSpeechRu(current.partOfSpeech) : "";

  const task = useMemo(() => {
    if (!current) return null;

    if (mode === "TRANSLATE") {
      return direction === "EN_RU"
        ? {
            prompt: current.english,
            sub: current.transcription,
            expected: current.russian,
            hint: "Напишите перевод на русском",
            speakable: current.english,
          }
        : {
            prompt: current.russian,
            sub: "",
            expected: current.english,
            hint: "Напишите слово на английском",
            speakable: "",
          };
    }

    if (mode === "IMAGE") {
      // Режим только на английский — русский вариант убран
      return {
        prompt: "",
        sub: "",
        expected: current.english,
        hint: "Что изображено? Напишите по-английски",
        speakable: "",
      };
    }

    // Определение: язык подсказки меняется, ответ всегда английский
    const definition =
      direction === "RU_EN"
        ? current.definitionRu || current.definition
        : current.definition;

    return {
      prompt: definition || "(определение не заполнено)",
      // транскрипцию в этом режиме не показываем — она выдаёт ответ
      sub: "",
      expected: current.english,
      hint: "Какое это слово? Напишите по-английски",
      speakable: "",
    };
  }, [current, mode, direction]);

  if (words.length === 0) {
    return (
      <EmptyState
        text={
          mode === "IMAGE"
            ? "Для этого режима нужны слова с картинками — их добавляет преподаватель в словаре."
            : mode === "DEFINITION"
              ? "Для этого режима нужны слова с определением. Найдите слово через Cambridge — определение подставится автоматически."
              : "В словаре пока нет слов."
        }
      />
    );
  }

  if (finished || !current || !task) {
    return (
      <Summary
        score={score}
        mistakes={mistakes}
        onRestart={() => restart()}
      />
    );
  }

  function check() {
    if (!current || !task || verdict) return;

    const correct = isAnswerCorrect(answer, task.expected);
    setVerdict(correct ? "correct" : "wrong");
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    if (!correct) {
      setMistakes((prev) => [
        ...prev,
        { word: current, given: answer, expected: task.expected },
      ]);
    }

    void recordAttemptAction({
      wordId: current.id,
      mode,
      direction,
      isCorrect: correct,
      answer,
    });
  }

  function skip() {
    if (!current || !task) return;

    setVerdict("wrong");
    setScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
    setMistakes((prev) => [
      ...prev,
      { word: current, given: "", expected: task.expected },
    ]);

    void recordAttemptAction({
      wordId: current.id,
      mode,
      direction,
      isCorrect: false,
      answer: "",
    });
  }

  function next() {
    setVerdict(null);
    setAnswer("");
    if (index + 1 >= deck.length) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
  }

  const directionLabels = DIRECTION_LABELS[mode];

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] uppercase tracking-wide text-ink-400">
            {MODE_TITLES[mode]}
          </p>
          <p className="text-[14px] text-ink-600">
            Карточка {index + 1} из {deck.length} · правильно {score.correct}
          </p>
        </div>

        {directionLabels ? (
          <div className="flex rounded-xl bg-ink-100 p-1 text-[13px]">
            <DirectionButton
              active={direction === "EN_RU"}
              onClick={() => restart("EN_RU")}
              label={directionLabels[0]}
            />
            <DirectionButton
              active={direction === "RU_EN"}
              onClick={() => restart("RU_EN")}
              label={directionLabels[1]}
            />
          </div>
        ) : null}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-ink-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${((index + 1) / deck.length) * 100}%` }}
        />
      </div>

      <div className="card rise p-6 sm:p-8">
        {mode === "IMAGE" ? (
          <div className="mb-5 overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.imageUrl}
              alt="Что изображено?"
              className="mx-auto max-h-64 w-full object-contain"
            />
          </div>
        ) : (
          <div className="mb-5 text-center">
            <p
              className={
                mode === "DEFINITION"
                  ? "text-[17px] leading-relaxed text-ink-800"
                  : "text-3xl font-semibold tracking-tight text-ink-900"
              }
            >
              {task.prompt}
            </p>
            {task.sub ? (
              <p className="mt-1 text-[14px] text-ink-400">{task.sub}</p>
            ) : null}
            {partOfSpeech ? (
              <p className="mt-2">
                <span className="chip bg-ink-100 text-ink-600">
                  {partOfSpeech}
                </span>
              </p>
            ) : null}
            {task.speakable ? (
              <div className="mt-3 flex justify-center">
                <SpeakButton text={task.speakable} size="lg" />
              </div>
            ) : null}
          </div>
        )}

        {/* В режиме с картинкой слова на экране нет — часть речи показываем отдельно */}
        {mode === "IMAGE" && partOfSpeech ? (
          <p className="mb-3 text-center">
            <span className="chip bg-ink-100 text-ink-600">
              {partOfSpeech}
            </span>
          </p>
        ) : null}

        <label className="label" htmlFor="training-answer">
          {task.hint}
        </label>
        <input
          id="training-answer"
          value={answer}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (verdict) next();
            else check();
          }}
          placeholder="Ваш ответ…"
          className={`field text-center text-[17px] ${
            verdict === "correct"
              ? "border-emerald-400 focus:border-emerald-500"
              : verdict === "wrong"
                ? "field-error"
                : ""
          }`}
        />

        {verdict ? (
          <>
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-[14.5px] ${
                verdict === "correct"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {verdict === "correct" ? (
                <span>✓ Верно!</span>
              ) : (
                <span>
                  ✕ Правильный ответ: <b>{task.expected}</b>
                </span>
              )}
            </div>

            {/* Определение и пример показываем после ответа — до него они подсказка */}
            <WordDetails word={current} mode={mode} />
          </>
        ) : null}

        <div className="mt-5 flex gap-2">
          {verdict ? (
            <button type="button" onClick={next} className="btn-primary flex-1">
              {index + 1 >= deck.length ? "Завершить" : "Дальше →"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={check}
                disabled={!answer.trim()}
                className="btn-primary flex-1"
              >
                Проверить
              </button>
              <button type="button" onClick={skip} className="btn-ghost">
                Не знаю
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Итог тренировки: статистика и разбор каждой ошибки */
function Summary({
  score,
  mistakes,
  onRestart,
}: {
  score: { correct: number; total: number };
  mistakes: Mistake[];
  onRestart: () => void;
}) {
  const percent =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card rise p-8 text-center">
        <p className="text-5xl">{percent >= 80 ? "🎉" : "💪"}</p>
        <h2 className="mt-4 text-xl font-semibold text-ink-900">
          Тренировка завершена
        </h2>
        <p className="mt-2 text-[15px] text-ink-600">
          Правильно {score.correct} из {score.total} ({percent}%)
        </p>

        <div className="mx-auto mt-4 flex max-w-xs gap-3">
          <div className="flex-1 rounded-xl bg-emerald-50 px-3 py-2">
            <p className="text-[12.5px] text-emerald-700">Верно</p>
            <p className="text-xl font-semibold text-emerald-800">
              {score.correct}
            </p>
          </div>
          <div className="flex-1 rounded-xl bg-rose-50 px-3 py-2">
            <p className="text-[12.5px] text-rose-700">Ошибок</p>
            <p className="text-xl font-semibold text-rose-800">
              {mistakes.length}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <button type="button" className="btn-primary" onClick={onRestart}>
            Ещё раз
          </button>
          <Link href="/training" prefetch className="btn-ghost">
            К режимам
          </Link>
        </div>
      </div>

      {mistakes.length > 0 ? (
        <section className="card p-5">
          <h3 className="mb-3 text-[15px] font-semibold text-ink-900">
            Разбор ошибок
          </h3>

          <div className="space-y-3">
            {mistakes.map((mistake, index) => (
              <div
                key={`${mistake.word.id}-${index}`}
                className="rounded-xl border border-ink-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <SpeakButton text={mistake.word.english} />
                  <span className="text-[15px] font-semibold text-ink-900">
                    {mistake.word.english}
                  </span>
                  {mistake.word.transcription ? (
                    <span className="text-[13px] text-ink-400">
                      {mistake.word.transcription}
                    </span>
                  ) : null}
                  {mistake.word.partOfSpeech ? (
                    <span className="chip bg-ink-100 text-ink-600">
                      {partOfSpeechRu(mistake.word.partOfSpeech)}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-[14px] text-ink-700">
                  {mistake.given ? (
                    <>
                      Ваш ответ:{" "}
                      <span className="text-rose-600 line-through">
                        {mistake.given}
                      </span>{" "}
                    </>
                  ) : (
                    <>Ответа не было. </>
                  )}
                  Верно:{" "}
                  <span className="font-medium text-emerald-700">
                    {mistake.expected}
                  </span>
                </p>

                {mistake.word.definition || mistake.word.definitionRu ? (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                    <span className="font-medium">Почему так: </span>
                    {mistake.word.definitionRu || mistake.word.definition}
                  </p>
                ) : null}

                {mistake.word.example ? (
                  <p className="mt-1.5 text-[13.5px] italic text-ink-500">
                    {mistake.word.example}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Определение по-английски и пример в предложении — показываем после
 * ответа, чтобы слово запоминалось в контексте, а не списком переводов.
 * В режиме определения сам вопрос и есть определение, его не повторяем.
 */
function WordDetails({ word, mode }: { word: TrainingWord; mode: Mode }) {
  const definition = mode === "DEFINITION" ? "" : word.definition;
  if (!definition && !word.example) return null;

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
      {definition ? (
        <p className="text-[13.5px] leading-relaxed text-ink-700">
          <span className="font-medium text-ink-500">Definition: </span>
          {definition}
        </p>
      ) : null}

      {word.example ? (
        <p className="text-[13.5px] italic leading-relaxed text-ink-600">
          <span className="not-italic font-medium text-ink-500">Example: </span>
          {word.example}
        </p>
      ) : null}
    </div>
  );
}

function DirectionButton({
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
      className={`cursor-pointer rounded-lg px-3 py-1.5 font-medium transition ${
        active ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <p className="text-4xl">🗂</p>
      <p className="mt-4 text-[15px] text-ink-600">{text}</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/dictionary" prefetch className="btn-primary">
          Открыть словарь
        </Link>
        <Link href="/training" prefetch className="btn-ghost">
          К режимам
        </Link>
      </div>
    </div>
  );
}
