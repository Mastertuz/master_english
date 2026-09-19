"use client";

import { useState, useTransition } from "react";
import { checkOgeTrainingAction } from "@/app/actions/oge";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { Timecodes } from "@/components/ui/SeekButton";
import type { OgeAnswers } from "@/lib/oge/scoring";
import type { TrainingCheck, TrainingView } from "@/lib/oge/training";
import {
  Choice,
  GapText,
  MatchingTable,
  TaskNumber,
  TeacherNoteView,
  TeacherTranscripts,
  WordAnswer,
  type Ctx,
} from "./OgeRunner";

const HEADING = "📖 Разбор";

/**
 * Один блок заданий из одного варианта. Ответы не сохраняются: проверили,
 * посмотрели разбор — и можно решить блок заново.
 */
export function TrainingBlock({
  variantId,
  variantTitle,
  groupId,
  tasks,
  points,
  view,
}: {
  variantId: string;
  variantTitle: string;
  groupId: string;
  tasks: string;
  points: string;
  view: TrainingView;
}) {
  const [answers, setAnswers] = useState<OgeAnswers>({});
  const [result, setResult] = useState<TrainingCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startChecking] = useTransition();

  const ctx: Ctx = {
    answers,
    update: (key, value) => {
      // После проверки ответы не меняем, пока не начали заново
      if (result) return;
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    readOnly: Boolean(result),
    checks: result?.checks ?? null,
    teacher: result?.notes ?? null,
    review: null,
    checked: false,
    noteHeading: HEADING,
  };

  const filled = Object.values(answers).filter((value) => value.trim()).length;

  function check() {
    setError(null);
    startChecking(async () => {
      const response = await checkOgeTrainingAction({
        variant: variantId,
        group: groupId,
        answers,
      });
      if ("error" in response) setError(response.error);
      else setResult(response);
    });
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setError(null);
  }

  return (
    <div className="card min-w-0 space-y-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-ink-900">
            Задания {tasks}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="chip bg-brand-50 text-brand-700">
              📄 Вариант: {variantTitle}
            </span>
            <span className="chip bg-ink-100 text-ink-700">{points}</span>
          </div>
        </div>
        {result ? <Score points={result.points} max={result.max} /> : null}
      </div>

      <p className="break-words text-[14px] leading-relaxed text-ink-600">{view.intro}</p>

      {"audio" in view && view.audio ? (
        <div className="space-y-2">
          <AudioPlayer src={view.audio.src} title={`Запись к заданиям ${tasks}`} />
          <Timecodes src={view.audio.src} items={view.audio.timecodes} />
        </div>
      ) : null}

      <Tasks view={view} ctx={ctx} />

      {/* После проверки — текст записи; заполнен только кусок этой группы */}
      {result && "audio" in view && view.audio ? (
        <TeacherTranscripts
          src={view.audio.src}
          heading={HEADING}
          items={[
            ...result.notes.transcripts.part1,
            ...result.notes.transcripts.part5,
            ...result.notes.transcripts.part6,
          ]}
        />
      ) : null}

      {error ? <p className="text-[14px] text-rose-600">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-4">
        {result ? (
          <>
            <p className="text-[14px] text-ink-700">
              Верно {result.points} из {result.max}. Ниже каждого задания — верный
              ответ и разбор.
            </p>
            <button type="button" onClick={restart} className="btn-primary">
              ↺ Решить заново
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={check}
              disabled={pending}
              className="btn-primary"
            >
              {pending ? "Проверяем…" : "✓ Проверить"}
            </button>
            <p className="text-[13px] text-ink-500">
              {filled ? `Заполнено ответов: ${filled}` : "Ответы можно проверить в любой момент"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Score({ points, max }: { points: number; max: number }) {
  const tone =
    points === max
      ? "bg-emerald-50 text-emerald-700"
      : points * 2 >= max
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";
  return (
    <span className={`chip text-[14px] font-semibold ${tone}`}>
      {points} из {max}
    </span>
  );
}

function Tasks({ view, ctx }: { view: TrainingView; ctx: Ctx }) {
  switch (view.kind) {
    case "choice":
      return (
        <div className="space-y-3">
          {view.questions.map((question) => (
            <Choice key={question.n} ctx={ctx} {...question} />
          ))}
        </div>
      );

    case "matching":
      return (
        <div className="space-y-4">
          {view.texts.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {view.texts.map((text) => (
                <div key={text.letter} className="rounded-xl border border-ink-200 p-4">
                  <p className="text-[15px] font-semibold text-brand-700">{text.letter}</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink-800">
                    {text.text}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          <MatchingTable
            ctx={ctx}
            n={view.n}
            letters={view.letters}
            options={view.options}
            rowLabel={view.rowLabel}
            cellLabel={view.cellLabel}
          />
        </div>
      );

    case "words":
      return (
        <div className="divide-y divide-ink-100 rounded-xl border border-ink-200">
          {view.rows.map((row) => (
            <div key={row.n} className="flex flex-wrap items-center justify-between gap-2 p-3">
              <p className="min-w-0 break-words text-[14.5px] text-ink-800">
                <TaskNumber n={row.n} /> {row.label}
              </p>
              <WordAnswer ctx={ctx} n={row.n} />
              {ctx.teacher ? (
                <div className="w-full">
                  <TeacherNoteView
                    note={ctx.teacher.answers[String(row.n)]}
                    heading={HEADING}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      );

    case "reading":
      return (
        <div className="space-y-3">
          <article className="rounded-xl bg-ink-50/80 p-5">
            <h4 className="text-center text-[16px] font-semibold text-ink-900">{view.title}</h4>
            <div className="mt-3 space-y-3 text-[14.5px] leading-relaxed text-ink-800">
              {view.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
          {view.statements.map((statement) => (
            <Choice key={statement.n} ctx={ctx} inline {...statement} />
          ))}
        </div>
      );

    case "gaps":
      return (
        <div className="space-y-3">
          <GapText ctx={ctx} lines={view.lines} />
          <p className="px-1 text-[13px] text-ink-500">
            Пишите без ошибок: ответ с опечаткой не засчитывается. Регистр и
            пробелы значения не имеют.
          </p>
        </div>
      );
  }
}

