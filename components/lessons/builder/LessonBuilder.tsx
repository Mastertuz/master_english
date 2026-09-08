"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveLessonContentAction,
  type BuilderState,
} from "@/app/actions/lesson-builder";
import { Alert } from "@/components/ui/Field";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import {
  BLOCK_LABELS,
  type LessonBlock,
  type LessonBlockKind,
  type TimelineSlot,
} from "@/lib/lesson-content";
import {
  BLOCK_TEMPLATES,
  LESSON_TEMPLATE_IDS,
  emptyBlock,
} from "@/lib/lesson-templates";
import { BlockEditor } from "./BlockEditor";
import { HomeworkEditor, type HomeworkDraft } from "./HomeworkEditor";
import { IconButton } from "./fields";

type Tab = "blocks" | "words" | "homework";

const TABS: { id: Tab; label: string }[] = [
  { id: "blocks", label: "Содержание урока" },
  { id: "words", label: "Слова урока" },
  { id: "homework", label: "Домашнее задание" },
];

const BLOCK_KINDS: LessonBlockKind[] = [
  "page",
  "text",
  "rule",
  "tasks",
  "vocab",
  "listening",
  "reading",
  "speaking",
];

export type WordDraft = { english: string; russian: string };

export function LessonBuilder({
  lessonId,
  lessonNumber,
  lessonTopic,
  initialBlocks,
  initialTimeline,
  initialWords,
  initialHomework,
}: {
  lessonId: string;
  lessonNumber: number;
  lessonTopic: string;
  initialBlocks: LessonBlock[];
  initialTimeline: TimelineSlot[];
  initialWords: WordDraft[];
  initialHomework: HomeworkDraft;
}) {
  const [tab, setTab] = useState<Tab>("blocks");
  const [blocks, setBlocks] = useState<LessonBlock[]>(initialBlocks);
  const [timeline, setTimeline] = useState<TimelineSlot[]>(initialTimeline);
  const [words, setWords] = useState<WordDraft[]>(initialWords);
  const [homework, setHomework] = useState<HomeworkDraft>(initialHomework);

  const [state, action] = useActionState<BuilderState, FormData>(
    saveLessonContentAction,
    null,
  );

  const payload = JSON.stringify({ blocks, timeline, words, homework });

  function moveBlock(index: number, direction: -1 | 1) {
    const next = [...blocks];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  }

  /** Скелет занятия: разогрев, правило, задания, лексика, говорение */
  function applyLessonTemplate() {
    const built = LESSON_TEMPLATE_IDS.flatMap((id) => {
      const template = BLOCK_TEMPLATES.find((item) => item.id === id);
      return template ? [template.build()] : [];
    });
    setBlocks((prev) => [...prev, ...built]);
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="payload" value={payload} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Конструктор урока</h1>
          <p className="mt-1 text-[14.5px] text-ink-500">
            Урок №{lessonNumber} — {lessonTopic}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/lessons/${lessonId}`} prefetch className="btn-ghost">
            Посмотреть урок
          </Link>
          <ConfirmSubmit
            className="btn-primary"
            pendingLabel="Сохраняем…"
            title="Сохранить урок?"
            message={`Содержание урока №${lessonNumber} будет перезаписано: ${blocks.length} блок(ов), ${words.length} слов, ${homework.tasks.length} заданий в домашней работе.`}
            confirmLabel="Сохранить"
            danger={false}
          >
            Сохранить урок
          </ConfirmSubmit>
        </div>
      </div>

      {state?.message ? (
        <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`cursor-pointer rounded-full px-4 py-2 text-[13.5px] font-medium transition ${
              tab === item.id
                ? "bg-brand-600 text-white shadow-sm"
                : "border border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
            }`}
          >
            {item.label}
            {item.id === "blocks" ? ` (${blocks.length})` : ""}
            {item.id === "words" ? ` (${words.length})` : ""}
            {item.id === "homework" ? ` (${homework.tasks.length})` : ""}
          </button>
        ))}
      </div>

      {tab === "blocks" ? (
        <div className="card space-y-5 p-5">
          <div>
            <p className="label">Добавить блок из шаблона</p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setBlocks((prev) => [...prev, template.build()])}
                  title={template.hint}
                  className="cursor-pointer rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[13px] font-medium text-ink-600 transition hover:border-brand-400 hover:text-brand-700"
                >
                  + {template.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={applyLessonTemplate}
                className="btn-ghost btn-sm"
              >
                ✨ Собрать каркас занятия
              </button>
              <span className="text-[12.5px] text-ink-400">
                разогрев → правило → задания → лексика → говорение
              </span>
            </div>
          </div>

          <div className="border-t border-ink-100 pt-4">
            <p className="label">Или пустой блок</p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_KINDS.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() =>
                    setBlocks((prev) => [...prev, emptyBlock(kind)])
                  }
                  className="cursor-pointer rounded-full border border-dashed border-ink-300 px-3 py-1.5 text-[13px] text-ink-500 transition hover:border-brand-400 hover:text-brand-700"
                >
                  + {BLOCK_LABELS[kind]}
                </button>
              ))}
            </div>
          </div>

          <TimelineEditor timeline={timeline} onChange={setTimeline} />

          {blocks.length === 0 ? (
            <p className="rounded-xl bg-ink-50 px-4 py-8 text-center text-[14px] text-ink-500">
              В уроке пока нет блоков. Начните с каркаса занятия — потом
              поправите тексты под себя.
            </p>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <BlockEditor
                  key={index}
                  block={block}
                  index={index}
                  total={blocks.length}
                  onChange={(next) =>
                    setBlocks((prev) =>
                      prev.map((item, i) => (i === index ? next : item)),
                    )
                  }
                  onMove={(direction) => moveBlock(index, direction)}
                  onRemove={() =>
                    setBlocks((prev) => prev.filter((_, i) => i !== index))
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "words" ? (
        <div className="card space-y-4 p-5">
          <p className="text-[13.5px] text-ink-500">
            Эти слова попадают в личный словарь ученика при назначении урока и
            участвуют в тренировках. Перевод можно оставить пустым — его
            подтянет <code className="text-ink-600">npm run words:backfill</code>.
          </p>

          <div className="space-y-2">
            {words.map((word, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={word.english}
                  onChange={(event) =>
                    setWords((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, english: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="boarding pass"
                  className="field"
                />
                <input
                  value={word.russian}
                  onChange={(event) =>
                    setWords((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, russian: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="посадочный талон"
                  className="field"
                />
                <IconButton
                  title="Убрать слово"
                  onClick={() =>
                    setWords((prev) => prev.filter((_, i) => i !== index))
                  }
                  danger
                >
                  ✕
                </IconButton>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setWords((prev) => [...prev, { english: "", russian: "" }])
            }
            className="btn-ghost btn-sm"
          >
            + Слово
          </button>
        </div>
      ) : null}

      {tab === "homework" ? (
        <div className="card space-y-4 p-5">
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-700">
            Если удалить задание, к которому ученик уже прислал ответ, ответ
            пропадёт вместе с ним.
          </p>
          <HomeworkEditor homework={homework} onChange={setHomework} />
        </div>
      ) : null}
    </form>
  );
}

/** Тайминг занятия: во сколько какой этап. Показывается на странице урока */
function TimelineEditor({
  timeline,
  onChange,
}: {
  timeline: TimelineSlot[];
  onChange: (timeline: TimelineSlot[]) => void;
}) {
  function update(index: number, part: Partial<TimelineSlot>) {
    onChange(
      timeline.map((slot, i) => (i === index ? { ...slot, ...part } : slot)),
    );
  }

  return (
    <div className="border-t border-ink-100 pt-4">
      <p className="label">Тайминг занятия</p>

      <div className="space-y-2">
        {timeline.map((slot, index) => (
          <div
            key={index}
            className="grid gap-2 sm:grid-cols-[90px_1fr_1fr_auto]"
          >
            <input
              value={slot.time}
              onChange={(event) => update(index, { time: event.target.value })}
              placeholder="0–10"
              className="field"
            />
            <input
              value={slot.title}
              onChange={(event) => update(index, { title: event.target.value })}
              placeholder="Разогрев"
              className="field"
            />
            <input
              value={slot.note}
              onChange={(event) => update(index, { note: event.target.value })}
              placeholder="Что делаем на этом этапе"
              className="field"
            />
            <IconButton
              title="Убрать строку"
              onClick={() => onChange(timeline.filter((_, i) => i !== index))}
              danger
            >
              ✕
            </IconButton>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...timeline, { time: "", title: "", note: "" }])}
        className="mt-2 cursor-pointer text-[13px] font-medium text-brand-600 hover:text-brand-700"
      >
        + Этап
      </button>
    </div>
  );
}
