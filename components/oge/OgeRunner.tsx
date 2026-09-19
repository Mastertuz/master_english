"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  clearOgeAnswersAction,
  saveOgeAnswersAction,
  submitOgeAction,
} from "@/app/actions/oge";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { Timecodes } from "@/components/ui/SeekButton";
import { formatTime } from "@/lib/audio-seek";
import {
  countWords,
  RECORDING_KEYS,
  type OgeAnswers,
  type OgeReview,
} from "@/lib/oge/scoring";
import type { TeacherNote, TeacherNotes } from "@/lib/oge/teacher";
import type { TimedTranscript } from "@/lib/oge/types";
import type { ExamGapLine, ExamView } from "@/lib/oge/view";
import { ExamTimer } from "./ExamTimer";
import { InlineGrading, ReviewedScore, useGrading, type Part } from "./Grading";
import { ExplanationView, Transcript } from "./Razbor";
import {
  Recorder,
  type RecorderHandle,
  type RecordingInfo,
} from "./Recorder";
import { SegmentButton } from "./SegmentButton";

/** Ключ и баллы по каждому заданию с кратким ответом — после отправки */
export type CheckMap = Record<
  string,
  { expected: string; points: number; max: number }
>;

type Tab = "listening" | "reading" | "grammar" | "writing" | "speaking";

const TABS: { id: Tab; label: string; tasks: string }[] = [
  { id: "listening", label: "Аудирование", tasks: "1–11" },
  { id: "reading", label: "Чтение", tasks: "12–19" },
  { id: "grammar", label: "Грамматика и лексика", tasks: "20–34" },
  { id: "writing", label: "Письмо", tasks: "35" },
  { id: "speaking", label: "Устная часть", tasks: "1–3" },
];

export type Ctx = {
  answers: OgeAnswers;
  update: (key: string, value: string) => void;
  readOnly: boolean;
  checks: CheckMap | null;
  /** Ответы, правила и тексты записей — только у преподавателя */
  teacher: TeacherNotes | null;
  /** Баллы преподавателя за развёрнутые ответы и проверена ли работа */
  review: OgeReview | null;
  checked: boolean;
  /** Заголовок блоков с ответом: в тренировке разбор видит и ученик */
  noteHeading?: string;
};

function writtenKeys(exam: ExamView): Record<Exclude<Tab, "speaking">, string[]> {
  const cells = (n: number, letters: string[]) =>
    letters.map((letter) => `${n}${letter}`);
  const gaps = (lines: ExamGapLine[]) =>
    lines.flatMap((line) => ("n" in line ? [String(line.n)] : []));

  return {
    listening: [
      ...exam.listening.part1.questions.map((q) => String(q.n)),
      ...cells(exam.listening.part5.n, exam.listening.part5.letters),
      ...exam.listening.part6.rows.map((row) => String(row.n)),
    ],
    reading: [
      ...cells(exam.reading.part12.n, exam.reading.part12.letters),
      ...exam.reading.part13.statements.map((q) => String(q.n)),
    ],
    grammar: [
      ...gaps(exam.grammar.part20.lines),
      ...gaps(exam.grammar.part29.lines),
    ],
    writing: ["35"],
  };
}

export function OgeRunner({
  exam,
  initialAnswers,
  initialRecordings,
  readOnly,
  checks,
  teacher,
  review,
  checked,
  savedAt,
}: {
  exam: ExamView;
  initialAnswers: OgeAnswers;
  initialRecordings: Record<string, RecordingInfo>;
  /** Работа отправлена или её открыл учитель — менять ничего нельзя */
  readOnly: boolean;
  checks: CheckMap | null;
  /** Объяснения и тексты записей для администратора; ученику — null */
  teacher: TeacherNotes | null;
  review: OgeReview | null;
  checked: boolean;
  savedAt: string | null;
}) {
  const [tab, setTab] = useState<Tab>("listening");
  const [answers, setAnswers] = useState<OgeAnswers>(initialAnswers);
  const [recordings, setRecordings] =
    useState<Record<string, RecordingInfo>>(initialRecordings);
  const [status, setStatus] = useState<"saved" | "dirty" | "saving" | "error">(
    "saved",
  );
  const [lastSaved, setLastSaved] = useState<string | null>(savedAt);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [, startSaving] = useTransition();

  // Последние ответы и номер правки: сохранение, которое закончилось после
  // новых изменений, не должно показывать «сохранено»
  const latest = useRef(answers);
  const version = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Не даём закрыть вкладку с несохранёнными ответами
  useEffect(() => {
    if (status !== "dirty" && status !== "saving") return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  function save() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;

    const saving = version.current;
    setStatus("saving");
    startSaving(async () => {
      const result = await saveOgeAnswersAction(exam.id, latest.current);
      if (version.current !== saving) return; // пока сохраняли, ответы изменились

      if (result.ok) {
        setStatus("saved");
        setSaveError(null);
        setLastSaved(result.savedAt ?? null);
      } else {
        setStatus("error");
        setSaveError(result.message ?? "Не удалось сохранить");
      }
    });
  }

  function update(key: string, value: string) {
    if (readOnly) return;
    const next = { ...latest.current, [key]: value };
    latest.current = next;
    version.current += 1;
    setAnswers(next);
    setStatus("dirty");

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 1500);
  }

  function setRecording(key: string, recording: RecordingInfo | null) {
    setRecordings((current) => {
      const next = { ...current };
      if (recording) next[key] = recording;
      else delete next[key];
      return next;
    });
  }

  const ctx: Ctx = { answers, update, readOnly, checks, teacher, review, checked };
  const keys = writtenKeys(exam);
  const filled = (list: string[]) =>
    list.filter((key) => (answers[key] ?? "").trim()).length;
  const recorded = RECORDING_KEYS.filter((key) => recordings[key]).length;

  const totalFields = Object.values(keys).flat().length;
  const filledFields = filled(Object.values(keys).flat());

  return (
    <div className="space-y-5">
      {!readOnly ? (
        <div className="card sticky top-[4.5rem] z-30 flex flex-wrap items-center gap-3 p-3">
          <span className="text-[13.5px] text-ink-500">
            {status === "saving"
              ? "Сохраняем…"
              : status === "dirty"
                ? "Есть несохранённые изменения"
                : status === "error"
                  ? `⚠ ${saveError}`
                  : lastSaved
                    ? `✓ Сохранено в ${new Date(lastSaved).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`
                    : "Ответы сохраняются автоматически"}
          </span>
          <button
            type="button"
            onClick={save}
            className="btn-ghost btn-sm"
            aria-label="Сохранить ответы"
          >
            💾 Сохранить
          </button>
          <div className="ml-auto">
            <ExamTimer id={exam.id} />
          </div>
        </div>
      ) : null}

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist">
        {TABS.map((item) => {
          const count =
            item.id === "speaking"
              ? `${recorded}/${RECORDING_KEYS.length}`
              : `${filled(keys[item.id])}/${keys[item.id].length}`;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`shrink-0 cursor-pointer rounded-xl border px-3 py-2 text-left transition ${
                tab === item.id
                  ? "border-brand-300 bg-brand-50 text-brand-800"
                  : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"
              }`}
            >
              <span className="block text-[14px] font-semibold">{item.label}</span>
              <span className="block text-[12px] text-ink-500">
                задания {item.tasks} · {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Все разделы остаются в DOM: переключение вкладки не должно
          останавливать аудио и обрывать запись ответа */}
      <ListeningTab exam={exam} ctx={ctx} hidden={tab !== "listening"} />
      <ReadingTab exam={exam} ctx={ctx} hidden={tab !== "reading"} />
      <GrammarTab exam={exam} ctx={ctx} hidden={tab !== "grammar"} />
      <WritingTab exam={exam} ctx={ctx} hidden={tab !== "writing"} />
      <SpeakingTab
        exam={exam}
        readOnly={readOnly}
        teacher={teacher}
        review={review}
        checked={checked}
        recordings={recordings}
        onRecording={setRecording}
        hidden={tab !== "speaking"}
      />

      <div className="flex flex-wrap justify-between gap-2">
        <button
          type="button"
          disabled={tab === TABS[0].id}
          onClick={() =>
            setTab(TABS[Math.max(TABS.findIndex((t) => t.id === tab) - 1, 0)].id)
          }
          className="btn-ghost btn-sm"
        >
          ← Предыдущий раздел
        </button>
        <button
          type="button"
          disabled={tab === TABS[TABS.length - 1].id}
          onClick={() =>
            setTab(
              TABS[Math.min(TABS.findIndex((t) => t.id === tab) + 1, TABS.length - 1)]
                .id,
            )
          }
          className="btn-ghost btn-sm"
        >
          Следующий раздел →
        </button>
      </div>

      {!readOnly ? (
        <div className="card space-y-3 p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">
            Отправка на проверку
          </h2>
          <p className="text-[14px] text-ink-600">
            Заполнено {filledFields} из {totalFields} полей письменной части,
            записано {recorded} из {RECORDING_KEYS.length} устных ответов. После
            отправки задания 1–34 проверятся сразу, письмо и устную часть оценит
            преподаватель. Изменить ответы после отправки нельзя.
          </p>
          <div className="flex flex-wrap gap-2">
            <form action={submitOgeAction}>
              <input type="hidden" name="variant" value={exam.id} />
              <input type="hidden" name="answers" value={JSON.stringify(answers)} />
              <ConfirmSubmit
                className="btn-primary"
                danger={false}
                pendingLabel="Отправляем…"
                title="Отправить вариант на проверку?"
                message={
                  filledFields < totalFields || recorded < RECORDING_KEYS.length
                    ? `Не заполнено полей: ${totalFields - filledFields}, не записано устных ответов: ${RECORDING_KEYS.length - recorded}. Пустые задания получат 0 баллов. Изменить ответы после отправки нельзя.`
                    : "Все задания выполнены. Изменить ответы после отправки нельзя."
                }
                confirmLabel="Отправить"
              >
                📨 Отправить на проверку
              </ConfirmSubmit>
            </form>

            <form
              action={clearOgeAnswersAction}
              onSubmit={() => {
                if (timer.current) clearTimeout(timer.current);
                version.current += 1;
                latest.current = {};
                setAnswers({});
                setRecordings({});
                setStatus("saved");
                setLastSaved(null);
              }}
            >
              <input type="hidden" name="variant" value={exam.id} />
              <ConfirmSubmit
                className="btn-ghost"
                pendingLabel="Очищаем…"
                title="Начать вариант заново?"
                message="Все ответы и записи устной части будут удалены."
                confirmLabel="Удалить ответы"
              >
                Начать заново
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────── Элементы ─────────────────────────────── */

export function TaskNumber({ n }: { n: number | string }) {
  return (
    <span className="mr-1 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md bg-brand-600 px-1.5 text-[12.5px] font-semibold text-white">
      {n}
    </span>
  );
}

function Verdict({ points, max }: { points: number; max: number }) {
  const tone =
    points === max
      ? "bg-emerald-50 text-emerald-700"
      : points === 0
        ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span className={`chip shrink-0 ${tone}`}>
      {points} из {max}
    </span>
  );
}

/** Блок, который видит только преподаватель */
const TEACHER_HEADING = "🔑 Для преподавателя";

function TeacherBox({
  title,
  heading = TEACHER_HEADING,
  children,
}: {
  title: string;
  heading?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-[14px] leading-relaxed text-ink-800">
      <p className="mb-1 text-[12.5px] font-semibold text-amber-700">
        {heading} · {title}
      </p>
      {children}
    </div>
  );
}

/** Верный ответ с объяснением: почему, по какому правилу, где ловушка */
export function TeacherNoteView({
  note,
  label,
  heading = TEACHER_HEADING,
}: {
  note?: TeacherNote;
  label?: string;
  heading?: string;
}) {
  if (!note) return null;
  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
      <p className="text-[12.5px] font-semibold text-amber-700">
        {heading}{label ? ` · ${label}` : ""} · верный ответ:{" "}
        <span className="text-emerald-700">{note.answer}</span>
      </p>
      <ExplanationView explanation={note.explanation} />
    </div>
  );
}

/** Тексты записей с таймкодами — только преподавателю */
export function TeacherTranscripts({
  src,
  items,
  heading,
}: {
  src: string;
  items?: TimedTranscript[];
  heading?: string;
}) {
  if (!items?.length) return null;
  return (
    <TeacherBox title="транскрипция записи" heading={heading}>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <Transcript
            key={item.title}
            title={`${item.title} · ${formatTime(item.at)}`}
            text={item.text}
            src={src}
            at={item.at}
          />
        ))}
      </div>
    </TeacherBox>
  );
}

function SectionCard({
  title,
  note,
  points,
  auto = false,
  children,
}: {
  title: string;
  note?: string;
  /** Сколько баллов даёт задание: «по 1 баллу», «до 10 баллов» */
  points?: string;
  /** Баллы ставит автопроверка, иначе — преподаватель */
  auto?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="card min-w-0 space-y-4 p-5">
      <div className="min-w-0">
        <h3 className="break-words text-[16px] font-semibold text-ink-900">{title}</h3>
        {points ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="chip bg-ink-100 text-ink-700">{points}</span>
            <span
              className={`chip ${
                auto ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {auto ? "⚙️ баллы ставятся автоматически" : "✍️ баллы ставит преподаватель"}
            </span>
          </div>
        ) : null}
        {note ? (
          <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{note}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function Choice({
  ctx,
  n,
  prompt,
  options,
  inline = false,
}: {
  ctx: Ctx;
  n: number;
  prompt: string;
  options: string[];
  inline?: boolean;
}) {
  const key = String(n);
  const value = ctx.answers[key] ?? "";
  const check = ctx.checks?.[key];

  return (
    <div className="rounded-xl border border-ink-200 p-4">
      <div className="flex items-start gap-2">
        <TaskNumber n={n} />
        <p className="min-w-0 flex-1 break-words text-[14.5px] leading-relaxed text-ink-800">
          {prompt}
        </p>
        {check ? <Verdict points={check.points} max={check.max} /> : null}
      </div>

      <div className={`mt-3 grid gap-2 ${inline ? "sm:grid-cols-3" : ""}`}>
        {options.map((option, index) => {
          const optionValue = String(index + 1);
          const chosen = value === optionValue;
          const correct = check?.expected === optionValue;
          const tone = check
            ? correct
              ? "border-emerald-300 bg-emerald-50"
              : chosen
                ? "border-rose-300 bg-rose-50"
                : "border-ink-200"
            : chosen
              ? "border-brand-400 bg-brand-50"
              : "border-ink-200 hover:bg-ink-50";

          return (
            <label
              key={optionValue}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[14px] ${
                ctx.readOnly ? "" : "cursor-pointer"
              } ${tone}`}
            >
              <input
                type="radio"
                name={`oge-${n}`}
                value={optionValue}
                checked={chosen}
                onChange={() => ctx.update(key, optionValue)}
                className="accent-brand-600"
              />
              <span className="font-medium text-ink-500">{optionValue})</span>
              <span className="min-w-0 break-words text-ink-800">{option}</span>
              {check && correct ? (
                <span className="ml-auto text-[12.5px] text-emerald-700">✓</span>
              ) : null}
            </label>
          );
        })}
      </div>

      <TeacherNoteView note={ctx.teacher?.answers[key]} heading={ctx.noteHeading} />
    </div>
  );
}

export function MatchingTable({
  ctx,
  n,
  letters,
  options,
  rowLabel,
  cellLabel,
}: {
  ctx: Ctx;
  n: number;
  letters: string[];
  options: string[];
  rowLabel: string;
  cellLabel: string;
}) {
  const check = ctx.checks?.[String(n)];

  return (
    <div className="space-y-3">
      <ol className="space-y-1 rounded-xl bg-ink-50/80 p-4 text-[14px] text-ink-800">
        {options.map((option, index) => (
          <li key={index} className="flex gap-2">
            <span className="w-5 shrink-0 font-semibold text-ink-500">
              {index + 1}.
            </span>
            {option}
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-3">
        <TaskNumber n={n} />
        {check ? <Verdict points={check.points} max={check.max} /> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1 text-[14px]">
          <thead>
            <tr>
              <th className="px-2 text-left font-medium text-ink-500">{rowLabel}</th>
              {letters.map((letter) => (
                <th key={letter} className="w-16 text-center font-semibold text-ink-800">
                  {letter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 text-ink-500">{cellLabel}</td>
              {letters.map((letter, index) => {
                const key = `${n}${letter}`;
                const value = ctx.answers[key] ?? "";
                const expected = check?.expected[index];
                const tone = check
                  ? value === expected
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-rose-400 bg-rose-50"
                  : "";

                return (
                  <td key={letter} className="align-top">
                    <select
                      value={value}
                      onChange={(event) => ctx.update(key, event.target.value)}
                      aria-label={`${rowLabel} ${letter}`}
                      className={`field w-16 px-2 text-center ${tone}`}
                    >
                      <option value="">—</option>
                      {options.map((_, optionIndex) => (
                        <option key={optionIndex} value={String(optionIndex + 1)}>
                          {optionIndex + 1}
                        </option>
                      ))}
                    </select>
                    {check && value !== expected ? (
                      <p className="mt-0.5 text-center text-[12px] text-emerald-700">
                        верно: {expected}
                      </p>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {ctx.teacher ? (
        <div>
          {letters.map((letter) => (
            <TeacherNoteView
              key={letter}
              heading={ctx.noteHeading}
              label={`${rowLabel} ${letter}`}
              note={ctx.teacher?.answers[`${n}${letter}`]}
            />
          ))}
          {ctx.teacher.extras[String(n)] ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-[14px] text-ink-700">
              <b className="text-amber-700">
                {ctx.noteHeading ?? TEACHER_HEADING} · лишний вариант:
              </b>{" "}
              {ctx.teacher.extras[String(n)]}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function WordAnswer({ ctx, n }: { ctx: Ctx; n: number }) {
  const key = String(n);
  const check = ctx.checks?.[key];
  const tone = check
    ? check.points
      ? "border-emerald-400 bg-emerald-50"
      : "border-rose-400 bg-rose-50"
    : "";

  return (
    <span className="inline-flex max-w-full flex-col align-middle">
      <input
        value={ctx.answers[key] ?? ""}
        onChange={(event) => ctx.update(key, event.target.value)}
        readOnly={ctx.readOnly}
        aria-label={`Ответ на задание ${n}`}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`field h-8 w-40 max-w-full py-0.5 ${tone}`}
      />
      {check && !check.points ? (
        <span className="mt-0.5 text-[12px] leading-tight text-emerald-700">
          верно: {check.expected.split(";").join(" / ")}
        </span>
      ) : null}
    </span>
  );
}

export function GapText({ ctx, lines }: { ctx: Ctx; lines: ExamGapLine[] }) {
  return (
    <div className="space-y-2.5">
      {lines.map((line, index) =>
        "n" in line ? (
          <div key={index} className="min-w-0 rounded-xl border border-ink-200 p-3">
            {/* Номер, текст и слово-подсказка в своих колонках: перенесённая
                строка текста не уходит под номер и не наезжает на подсказку */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
              <span className="pt-2">
                <TaskNumber n={line.n} />
              </span>
              <p className="min-w-0 break-words text-[14.5px] leading-10 text-ink-800">
                {line.before} <WordAnswer ctx={ctx} n={line.n} /> {line.after}
              </p>
              <span className="chip col-start-2 h-fit justify-self-start bg-ink-100 font-semibold tracking-wide text-ink-800 sm:col-start-3 sm:mt-2">
                {line.word}
              </span>
            </div>
            {ctx.teacher ? (
              <TeacherNoteView
                note={ctx.teacher.answers[String(line.n)]}
                heading={ctx.noteHeading}
              />
            ) : null}
          </div>
        ) : (
          <p
            key={index}
            className="break-words rounded-xl bg-ink-50/70 px-3 py-2 text-[14.5px] leading-relaxed text-ink-600"
          >
            {line.text}
          </p>
        ),
      )}
    </div>
  );
}

/* ─────────────────────────────── Разделы ─────────────────────────────── */

type TabProps = { exam: ExamView; ctx: Ctx; hidden: boolean };

function ListeningTab({ exam, ctx, hidden }: TabProps) {
  const { listening } = exam;

  return (
    <section hidden={hidden} className="space-y-5">
      <SectionCard
        title="Раздел 1. Аудирование"
        note="Рекомендуемое время — 30 минут. На экзамене запись идёт без остановок: каждый текст звучит дважды, паузы на ответ уже внутри записи."
      >
        <AudioPlayer src={listening.audioUrl} title="Запись к заданиям 1–11" />
        <Timecodes src={listening.audioUrl} items={listening.marks} />
      </SectionCard>

      <SectionCard title="Задания 1–4" note={listening.part1.intro} points="по 1 баллу" auto>
        <Timecodes src={listening.audioUrl} items={listening.part1.timecodes} />
        {listening.part1.questions.map((question) => (
          <Choice key={question.n} ctx={ctx} {...question} />
        ))}
        <TeacherTranscripts
          src={listening.audioUrl}
          items={ctx.teacher?.transcripts.part1}
        />
      </SectionCard>

      <SectionCard
        title="Задание 5"
        note={listening.part5.intro}
        points="до 5 баллов: минус 1 за каждую ошибку"
        auto
      >
        <Timecodes src={listening.audioUrl} items={listening.part5.timecodes} />
        <MatchingTable
          ctx={ctx}
          n={listening.part5.n}
          letters={listening.part5.letters}
          options={listening.part5.options}
          rowLabel="Говорящий"
          cellLabel="Рубрика"
        />
        <TeacherTranscripts
          src={listening.audioUrl}
          items={ctx.teacher?.transcripts.part5}
        />
      </SectionCard>

      <SectionCard title="Задания 6–11" note={listening.part6.intro} points="по 1 баллу" auto>
        <Timecodes src={listening.audioUrl} items={listening.part6.timecodes} />
        <div className="divide-y divide-ink-100 rounded-xl border border-ink-200">
          {listening.part6.rows.map((row) => (
            <div
              key={row.n}
              className="flex flex-wrap items-center justify-between gap-2 p-3"
            >
              <p className="min-w-0 break-words text-[14.5px] text-ink-800">
                <TaskNumber n={row.n} /> {row.label}
              </p>
              <WordAnswer ctx={ctx} n={row.n} />
              {ctx.teacher ? (
                <div className="w-full">
                  <TeacherNoteView
                    note={ctx.teacher.answers[String(row.n)]}
                    heading={ctx.noteHeading}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <TeacherTranscripts
          src={listening.audioUrl}
          items={ctx.teacher?.transcripts.part6}
        />
      </SectionCard>
    </section>
  );
}

function ReadingTab({ exam, ctx, hidden }: TabProps) {
  const { part12, part13 } = exam.reading;

  return (
    <section hidden={hidden} className="space-y-5">
      <SectionCard
        title="Раздел 2. Чтение · задание 12"
        points="до 6 баллов: минус 1 за каждую ошибку"
        auto
        note={`Рекомендуемое время на раздел — 30 минут. ${part12.intro}`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {part12.texts.map((text) => (
            <div key={text.letter} className="rounded-xl border border-ink-200 p-4">
              <p className="text-[15px] font-semibold text-brand-700">{text.letter}</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-800">
                {text.text}
              </p>
            </div>
          ))}
        </div>
        <MatchingTable
          ctx={ctx}
          n={part12.n}
          letters={part12.letters}
          options={part12.options}
          rowLabel="Текст"
          cellLabel="Вопрос"
        />
      </SectionCard>

      <SectionCard title="Задания 13–19" note={part13.intro} points="по 1 баллу" auto>
        <article className="rounded-xl bg-ink-50/80 p-5">
          <h4 className="text-center text-[16px] font-semibold text-ink-900">
            {part13.title}
          </h4>
          <div className="mt-3 space-y-3 text-[14.5px] leading-relaxed text-ink-800">
            {part13.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
        {part13.statements.map((statement) => (
          <Choice key={statement.n} ctx={ctx} inline {...statement} />
        ))}
      </SectionCard>
    </section>
  );
}

function GrammarTab({ exam, ctx, hidden }: TabProps) {
  const { part20, part29 } = exam.grammar;

  return (
    <section hidden={hidden} className="space-y-5">
      <SectionCard
        title="Раздел 3. Грамматика и лексика · задания 20–28"
        points="по 1 баллу"
        auto
        note={`Рекомендуемое время на раздел — 30 минут. ${part20.intro}`}
      >
        <GapText ctx={ctx} lines={part20.lines} />
      </SectionCard>
      <SectionCard title="Задания 29–34" note={part29.intro} points="по 1 баллу" auto>
        <GapText ctx={ctx} lines={part29.lines} />
      </SectionCard>
      <p className="px-1 text-[13px] text-ink-500">
        Пишите без ошибок: ответ с опечаткой не засчитывается. Регистр и пробелы
        значения не имеют — «didn’t mind» и «didnotmind» оба верны.
      </p>
    </section>
  );
}

function WritingTab({ exam, ctx, hidden }: TabProps) {
  const { writing } = exam;
  const key = String(writing.n);
  const text = ctx.answers[key] ?? "";
  const words = countWords(text);
  const grading = useGrading();

  const [tone, hint] =
    words === 0
      ? ["text-ink-400", "Нужно 100–120 слов"]
      : words < 90
        ? ["text-rose-600", "Меньше 90 слов — письмо оценят в 0 баллов"]
        : words < 100
          ? ["text-amber-600", "Чуть меньше нормы — добавьте предложение"]
          : words <= 120
            ? ["text-emerald-600", "Объём в норме"]
            : words <= 132
              ? ["text-amber-600", "Больше 120 слов, но письмо проверят целиком"]
              : ["text-rose-600", "Больше 132 слов — проверят только первые 120"];

  return (
    <section hidden={hidden} className="space-y-5">
      <SectionCard
        title="Раздел 4. Письмо · задание 35"
        points="до 10 баллов по критериям К1–К4"
        note={`Рекомендуемое время — 30 минут. ${writing.intro}`}
      >
        <div className="rounded-xl border border-ink-200 bg-ink-50/80 p-4 text-[14.5px] text-ink-800">
          <p className="text-[13px] text-ink-500">
            From: {writing.email.from}
            <br />
            To: {writing.email.to}
            <br />
            Subject: {writing.email.subject}
          </p>
          <div className="mt-3 space-y-2 leading-relaxed">
            {writing.email.body.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
        <ul className="space-y-0.5 text-[14.5px] font-medium text-ink-800">
          {writing.task.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <details className="rounded-xl border border-ink-200 px-4 py-2 text-[14px] text-ink-600">
          <summary className="cursor-pointer font-medium text-ink-700">
            Как считают слова и объём
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {writing.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </details>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label className="label mb-0" htmlFor="oge-35">
              Ваше письмо
            </label>
            <span className={`text-[13px] font-medium ${tone}`}>
              {words} {words % 10 === 1 && words % 100 !== 11 ? "слово" : words % 10 >= 2 && words % 10 <= 4 && (words % 100 < 12 || words % 100 > 14) ? "слова" : "слов"} · {hint}
            </span>
          </div>
          <textarea
            id="oge-35"
            value={text}
            onChange={(event) => ctx.update(key, event.target.value)}
            readOnly={ctx.readOnly}
            rows={16}
            spellCheck={false}
            placeholder={"Dear Mary,\n\nThanks for your email! …"}
            className="field min-h-[22rem] leading-relaxed"
          />
        </div>

        {grading ? (
          <InlineGrading part="w35" words={words} />
        ) : ctx.readOnly ? (
          <ReviewedScore part="w35" words={words} review={ctx.review} checked={ctx.checked} />
        ) : null}

        {ctx.teacher ? (
          <TeacherBox title={`план и образец ответа (${countWords(ctx.teacher.writing.sample)} слов)`}>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-[13.5px] text-ink-700">
              {ctx.teacher.writing.plan.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 whitespace-pre-wrap">{ctx.teacher.writing.sample}</p>
          </TeacherBox>
        ) : null}
      </SectionCard>
    </section>
  );
}

function SpeakingTab({
  exam,
  readOnly,
  teacher,
  review,
  checked,
  recordings,
  onRecording,
  hidden,
}: {
  exam: ExamView;
  readOnly: boolean;
  teacher: TeacherNotes | null;
  review: OgeReview | null;
  checked: boolean;
  recordings: Record<string, RecordingInfo>;
  onRecording: (key: string, recording: RecordingInfo | null) => void;
  hidden: boolean;
}) {
  const { speaking } = exam;
  const [autoRecord, setAutoRecord] = useState(true);
  const grading = useGrading();

  // Учитель выставляет баллы у задания, ученик видит их там же
  const scoreFor = (part: Part) =>
    grading ? (
      <InlineGrading {...part} />
    ) : readOnly ? (
      <ReviewedScore {...part} review={review} checked={checked} />
    ) : null;
  const recorders = useRef<Record<string, RecorderHandle | null>>({});

  return (
    <section hidden={hidden} className="space-y-5">
      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-[14px] leading-relaxed text-ink-700">
        <p className="font-semibold text-ink-900">Устная часть · 3 задания, 15 минут</p>
        {readOnly
          ? "Записи устных ответов ученика."
          : "Ответы записываются с микрофона и сразу сохраняются. При первой записи браузер спросит разрешение на микрофон. Задание 2 удобнее выполнять в наушниках, чтобы вопрос не попал в запись."}
      </div>

      <SectionCard
        title="Задание 1. Чтение вслух"
        note={speaking.task1.instruction}
        points="до 2 баллов"
      >
        <blockquote className="rounded-xl bg-ink-50/80 p-5 text-[15.5px] leading-relaxed text-ink-900">
          {speaking.task1.text}
        </blockquote>
        {teacher ? (
          <TeacherBox title="трудные места для чтения вслух">
            <ul className="mt-1 space-y-0.5 text-[13.5px]">
              {teacher.speaking.hardWords.map((item) => (
                <li key={item.word}>
                  <b>{item.word}</b> — {item.tip}
                </li>
              ))}
            </ul>
          </TeacherBox>
        ) : null}
        <Recorder
          variantId={exam.id}
          taskKey="s1"
          prepSec={speaking.task1.prepSec}
          maxSec={speaking.task1.answerSec}
          recording={recordings.s1 ?? null}
          readOnly={readOnly}
          onChange={(recording) => onRecording("s1", recording)}
        />
        {scoreFor({ part: "s1" })}
      </SectionCard>

      <SectionCard
        title="Задание 2. Телефонный опрос"
        note={speaking.task2.instruction}
        points="до 6 баллов: по 1 за полный ответ"
      >
        {!readOnly ? (
          <label className="flex cursor-pointer items-center gap-2 text-[14px] text-ink-700">
            <input
              type="checkbox"
              checked={autoRecord}
              onChange={(event) => setAutoRecord(event.target.checked)}
              className="accent-brand-600"
            />
            Начинать запись сразу после вопроса, как на экзамене
          </label>
        ) : null}

        {teacher ? (
          <TeacherBox title="транскрипция опроса">
            <p>{teacher.speaking.task2.intro}</p>
            <p className="mt-1 text-[13px] text-ink-500">
              Дальше — шесть вопросов, текст каждого под его записью.
            </p>
            <p className="mt-1">{teacher.speaking.task2.outro}</p>
          </TeacherBox>
        ) : null}

        <div className="space-y-3">
          {speaking.task2.questions.map((question, index) => {
            const key = `s2-${index + 1}`;
            return (
              <div key={key} className="space-y-2 rounded-xl border border-ink-200 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TaskNumber n={index + 1} />
                  <SegmentButton
                    src={speaking.audioUrl}
                    start={question.start}
                    end={question.end}
                    label={index === 0 ? "▶ Вступление и вопрос 1" : `▶ Вопрос ${index + 1}`}
                    onEnded={() => {
                      if (autoRecord && !readOnly && !recordings[key]) {
                        recorders.current[key]?.start();
                      }
                    }}
                  />
                </div>
                {/* На экзамене вопрос звучит только в записи — текст видит учитель */}
                {teacher ? (
                  <TeacherBox title={`вопрос ${index + 1} и образец ответа`}>
                    <p className="font-medium text-ink-900">{question.text}</p>
                    <p className="mt-1 text-ink-700">
                      {teacher.speaking.task2.samples[index]}
                    </p>
                  </TeacherBox>
                ) : null}
                <Recorder
                  ref={(handle) => {
                    recorders.current[key] = handle;
                  }}
                  variantId={exam.id}
                  taskKey={key}
                  maxSec={speaking.task2.answerSec}
                  recording={recordings[key] ?? null}
                  readOnly={readOnly}
                  onChange={(recording) => onRecording(key, recording)}
                />
                {scoreFor({ part: "s2", index })}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Задание 3. Монолог"
        note={speaking.task3.instruction}
        points="до 7 баллов по критериям К1–К3"
      >
        <div className="rounded-xl bg-ink-50/80 p-4 text-[14.5px] text-ink-800">
          <p className="font-medium">Remember to say:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {speaking.task3.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="mt-2 font-medium">You have to talk continuously.</p>
        </div>
        <Recorder
          variantId={exam.id}
          taskKey="s3"
          prepSec={speaking.task3.prepSec}
          maxSec={speaking.task3.answerSec}
          recording={recordings.s3 ?? null}
          readOnly={readOnly}
          onChange={(recording) => onRecording("s3", recording)}
        />
        {scoreFor({ part: "s3" })}
        {teacher ? (
          <TeacherBox title="образец монолога">
            <div className="space-y-1">
              {teacher.speaking.task3Sample.split("\n").map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </TeacherBox>
        ) : null}
      </SectionCard>
    </section>
  );
}
