"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import {
  resetStudentVersionAction,
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
  type HomeworkTaskDraft,
} from "@/lib/lesson-templates";
import { BlockEditor } from "./BlockEditor";
import { HomeworkEditor, type HomeworkDraft } from "./HomeworkEditor";
import { IconButton } from "./fields";

type Tab = "blocks" | "words" | "homework";

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

/** Значок вида блока в оглавлении */
const KIND_ICON: Record<LessonBlockKind, string> = {
  page: "📄",
  text: "📝",
  rule: "📘",
  tasks: "✅",
  vocab: "🗂",
  listening: "🎧",
  reading: "📖",
  speaking: "🗣",
  video: "🎬",
};

export type WordDraft = { english: string; russian: string };

export type StudentOption = {
  id: string;
  name: string;
  /** Урок назначен ученику */
  assigned: boolean;
  /** Для ученика уже есть личная версия урока */
  personalized: boolean;
};

export type EditedStudent = StudentOption & {
  hasVersion: boolean;
  overrides: number;
  personalTasks: number;
};

/** Блок с собственным ключом: по нему помним, какие блоки свёрнуты */
type Item = { key: string; block: LessonBlock };

let keySeq = 0;
const newKey = () => `b${++keySeq}`;

export function LessonBuilder({
  lessonId,
  lessonNumber,
  lessonTopic,
  initialBlocks,
  initialTimeline,
  initialWords,
  initialHomework,
  students,
  student,
  baseTasks,
  hasHomework,
}: {
  lessonId: string;
  lessonNumber: number;
  lessonTopic: string;
  initialBlocks: LessonBlock[];
  initialTimeline: TimelineSlot[];
  initialWords: WordDraft[];
  initialHomework: HomeworkDraft;
  /** Все ученики — для переключателя «кому правим» */
  students: StudentOption[];
  /** Ученик, для которого правим урок; null — правим для всех */
  student: EditedStudent | null;
  /** Общие задания: сравниваем с ними личные правки */
  baseTasks: HomeworkTaskDraft[];
  /** У урока уже есть общая домашняя работа */
  hasHomework: boolean;
}) {
  const router = useRouter();
  const personal = student !== null;

  const [tab, setTab] = useState<Tab>("blocks");
  const [items, setItems] = useState<Item[]>(() =>
    initialBlocks.map((block) => ({ key: newKey(), block })),
  );
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineSlot[]>(initialTimeline);
  const [words, setWords] = useState<WordDraft[]>(initialWords);
  const [homework, setHomework] = useState<HomeworkDraft>(initialHomework);

  const [state, action] = useActionState<BuilderState, FormData>(
    saveLessonContentAction,
    null,
  );

  const blocks = items.map((item) => item.block);
  const payload = JSON.stringify({ blocks, timeline, words, homework });

  // Что было при открытии: по этому понимаем, есть ли несохранённые правки
  const [initialPayload] = useState(payload);
  const dirty = payload !== initialPayload;

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "blocks", label: "Содержание урока", count: blocks.length },
    { id: "words", label: "Слова урока", count: words.length },
    { id: "homework", label: "Домашнее задание", count: homework.tasks.length },
  ];

  /* ───────────── Блоки: добавление, перемещение, сворачивание ───────────── */

  function addBlocks(added: LessonBlock[]) {
    const next = added.map((block) => ({ key: newKey(), block }));
    setItems((prev) => [...prev, ...next]);
    // Показываем, куда встал новый блок
    const first = next[0]?.key;
    if (first) setTimeout(() => goTo(first, false), 80);
  }

  function updateBlock(key: string, block: LessonBlock) {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, block } : item)));
  }

  function removeBlock(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleCollapsed(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  /** Перейти к блоку из оглавления; свёрнутый блок сначала разворачиваем */
  function goTo(key: string, expand = true) {
    if (expand) {
      setCollapsed((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
    setTimeout(
      () =>
        document
          .getElementById(`block-${key}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      expand ? 60 : 0,
    );
  }

  /** Скелет занятия: разогрев, правило, задания, лексика, говорение */
  function applyLessonTemplate() {
    addBlocks(
      LESSON_TEMPLATE_IDS.flatMap((id) => {
        const template = BLOCK_TEMPLATES.find((item) => item.id === id);
        return template ? [template.build()] : [];
      }),
    );
  }

  // Какой блок сейчас на экране — подсвечиваем его в оглавлении
  useEffect(() => {
    if (tab !== "blocks" || items.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = (entry.target as HTMLElement).dataset.blockKey;
          if (!key) continue;
          if (entry.isIntersecting) visible.add(key);
          else visible.delete(key);
        }
        const first = items.find((item) => visible.has(item.key));
        if (first) setActiveKey(first.key);
      },
      // Верхняя полоса занята закреплённой шапкой, нижняя — не в счёт
      { rootMargin: "-210px 0px -55% 0px" },
    );

    for (const item of items) {
      const el = document.getElementById(`block-${item.key}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items, tab]);

  /* ───────────────────────────── Для кого правим ───────────────────────────── */

  function switchScope(value: string) {
    if (dirty && !window.confirm("Есть несохранённые правки — они пропадут. Перейти?")) {
      return;
    }
    router.push(`/lessons/${lessonId}/edit${value ? `?student=${value}` : ""}`);
  }

  const viewHref = personal
    ? `/lessons/${lessonId}?student=${student.id}`
    : `/lessons/${lessonId}`;

  const saveMessage = personal
    ? `Личная версия урока №${lessonNumber} для «${student.name}»: ${blocks.length} блок(ов) и правки домашней работы. Другие ученики ничего не увидят.`
    : `Содержание урока №${lessonNumber} будет перезаписано: ${blocks.length} блок(ов), ${words.length} слов, ${homework.tasks.length} заданий в домашней работе.`;

  return (
    <>
      <form action={action} className="space-y-5">
        <input type="hidden" name="lessonId" value={lessonId} />
        <input type="hidden" name="payload" value={payload} />
        {personal ? <input type="hidden" name="studentId" value={student.id} /> : null}

        {/* Закреплённая шапка: название, кому правим, кнопки и вкладки */}
        <div
          className={`sticky top-16 z-30 -mx-2 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur ${
            personal
              ? "border-amber-300 bg-amber-50/95"
              : "border-ink-200 bg-white/95"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <h1 className="text-[19px] font-semibold leading-tight text-ink-900">
                Конструктор урока
              </h1>
              <p className="truncate text-[13px] text-ink-500">
                Урок №{lessonNumber} — {lessonTopic}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-[13px] text-ink-600">
                <span className="hidden whitespace-nowrap sm:inline">Кому правим:</span>
                <select
                  value={student?.id ?? ""}
                  onChange={(event) => switchScope(event.target.value)}
                  className="field !h-9 !py-0 bg-white text-[13.5px]"
                  aria-label="Кому правим урок"
                >
                  <option value="">Всем ученикам (общая версия)</option>
                  <optgroup label="Только одному ученику">
                    {students.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                        {item.personalized ? " ✎" : ""}
                        {item.assigned ? "" : " (урок не назначен)"}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>

              <Link href={viewHref} prefetch className="btn-ghost btn-sm">
                Посмотреть урок
              </Link>
              <ConfirmSubmit
                className="btn-primary btn-sm"
                pendingLabel="Сохраняем…"
                title={personal ? "Сохранить для ученика?" : "Сохранить урок?"}
                message={saveMessage}
                confirmLabel="Сохранить"
                danger={false}
              >
                {personal ? "Сохранить для ученика" : "Сохранить урок"}
              </ConfirmSubmit>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                  tab === item.id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "border border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                }`}
              >
                {item.label} ({item.count})
              </button>
            ))}
            {dirty ? (
              <span className="ml-auto text-[12.5px] font-medium text-amber-700">
                ● есть несохранённые правки
              </span>
            ) : null}
          </div>
        </div>

        {personal ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13.5px] leading-relaxed text-amber-900">
            <p className="font-semibold">Личная версия для: {student.name}</p>
            <p className="mt-1">
              Всё, что вы измените здесь, увидит только этот ученик. Общий урок
              и другие ученики не затрагиваются.{" "}
              {student.hasVersion
                ? "Для него уже есть личная версия урока — правки общего урока в неё не попадают."
                : "Сейчас открыта копия общего урока: пока вы не сохраните, у ученика всё по-прежнему."}
              {hasHomework
                ? ` Домашняя работа: личных правок ${student.overrides}, личных заданий ${student.personalTasks}; общие задания, которых вы не касались, продолжают обновляться вместе с общей версией.`
                : ""}
            </p>
            {student.hasVersion || student.overrides > 0 || student.personalTasks > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {student.hasVersion ? (
                  <ConfirmSubmit
                    formId="reset-lesson"
                    className="btn-ghost btn-sm"
                    title="Вернуть общую версию урока?"
                    message={`Личная версия урока для «${student.name}» будет удалена, и он снова увидит общий урок. Его ответы в заданиях сохранятся.`}
                    confirmLabel="Вернуть общую"
                    danger={false}
                  >
                    ↩ Вернуть общую версию урока
                  </ConfirmSubmit>
                ) : null}
                {student.overrides > 0 || student.personalTasks > 0 ? (
                  <ConfirmSubmit
                    formId="reset-homework"
                    className="btn-ghost btn-sm"
                    title="Сбросить личные правки ДЗ?"
                    message={`Личные правки и личные задания «${student.name}» будут удалены вместе с ответами ученика на личные задания. Ответы на общие задания сохранятся.`}
                    confirmLabel="Сбросить"
                  >
                    ↩ Сбросить правки ДЗ
                  </ConfirmSubmit>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {state?.message ? (
          <Alert kind={state.ok ? "success" : "error"}>{state.message}</Alert>
        ) : null}

        {tab === "blocks" ? (
          <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
            {/* Оглавление: на широком экране закреплено сбоку */}
            <aside className="lg:sticky lg:top-[184px] lg:max-h-[calc(100vh-204px)] lg:self-start lg:overflow-y-auto">
              <div className="hidden lg:block">
                <Outline
                  items={items}
                  collapsed={collapsed}
                  activeKey={activeKey}
                  onGo={(key) => goTo(key)}
                  onCollapseAll={() => setCollapsed(new Set(items.map((item) => item.key)))}
                  onExpandAll={() => setCollapsed(new Set())}
                />
              </div>
              <details className="card p-3 lg:hidden">
                <summary className="cursor-pointer text-[14px] font-semibold text-ink-800">
                  Оглавление ({items.length})
                </summary>
                <div className="mt-3">
                  <Outline
                    items={items}
                    collapsed={collapsed}
                    activeKey={activeKey}
                    onGo={(key) => goTo(key)}
                    onCollapseAll={() => setCollapsed(new Set(items.map((item) => item.key)))}
                    onExpandAll={() => setCollapsed(new Set())}
                  />
                </div>
              </details>
            </aside>

            <div className="card min-w-0 space-y-5 p-5">
              <div>
                <p className="label">Добавить блок из шаблона</p>
                <div className="flex flex-wrap gap-2">
                  {BLOCK_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => addBlocks([template.build()])}
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
                      onClick={() => addBlocks([emptyBlock(kind)])}
                      className="cursor-pointer rounded-full border border-dashed border-ink-300 px-3 py-1.5 text-[13px] text-ink-500 transition hover:border-brand-400 hover:text-brand-700"
                    >
                      + {BLOCK_LABELS[kind]}
                    </button>
                  ))}
                </div>
              </div>

              <TimelineEditor timeline={timeline} onChange={setTimeline} />

              {items.length === 0 ? (
                <p className="rounded-xl bg-ink-50 px-4 py-8 text-center text-[14px] text-ink-500">
                  В уроке пока нет блоков. Начните с каркаса занятия — потом
                  поправите тексты под себя.
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.key}
                      id={`block-${item.key}`}
                      data-block-key={item.key}
                      className="scroll-mt-[190px]"
                    >
                      <BlockEditor
                        block={item.block}
                        index={index}
                        total={items.length}
                        collapsed={collapsed.has(item.key)}
                        onToggleCollapsed={() => toggleCollapsed(item.key)}
                        onChange={(next) => updateBlock(item.key, next)}
                        onMove={(direction) => moveBlock(index, direction)}
                        onRemove={() => removeBlock(item.key)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {tab === "words" ? (
          <div className="card space-y-4 p-5">
            {personal ? (
              <p className="rounded-xl bg-amber-50 px-3 py-3 text-[13.5px] text-amber-900">
                Слова урока общие для всех. Чтобы дать этому ученику свои слова,
                назначьте их к следующему уроку на его карточке — там же можно
                добавить слово из Cambridge.{" "}
                <Link href={`/students/${student.id}`} className="font-medium underline">
                  Открыть карточку ученика
                </Link>
              </p>
            ) : (
              <>
                <p className="text-[13.5px] text-ink-500">
                  Эти слова попадают в личный словарь ученика при назначении
                  урока и участвуют в тренировках. Перевод можно оставить пустым —
                  его подтянет{" "}
                  <code className="text-ink-600">npm run words:backfill</code>.
                </p>

                <div className="space-y-2">
                  {words.map((word, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        value={word.english}
                        onChange={(event) =>
                          setWords((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, english: event.target.value } : item,
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
                              i === index ? { ...item, russian: event.target.value } : item,
                            ),
                          )
                        }
                        placeholder="посадочный талон"
                        className="field"
                      />
                      <IconButton
                        title="Убрать слово"
                        onClick={() => setWords((prev) => prev.filter((_, i) => i !== index))}
                        danger
                      >
                        ✕
                      </IconButton>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setWords((prev) => [...prev, { english: "", russian: "" }])}
                  className="btn-ghost btn-sm"
                >
                  + Слово
                </button>
              </>
            )}
          </div>
        ) : null}

        {tab === "homework" ? (
          <div className="card space-y-4 p-5">
            {personal && !hasHomework ? (
              <p className="rounded-xl bg-amber-50 px-3 py-3 text-[13.5px] text-amber-900">
                У этого урока ещё нет общей домашней работы. Сначала создайте её
                в общей версии («Кому правим» → «Всем ученикам»), а потом
                подстройте под ученика.
              </p>
            ) : (
              <>
                {personal ? null : (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-700">
                    Если удалить задание, к которому ученик уже прислал ответ,
                    ответ пропадёт вместе с ним.
                  </p>
                )}
                <HomeworkEditor
                  homework={homework}
                  onChange={setHomework}
                  personal={personal}
                  baseTasks={baseTasks}
                />
              </>
            )}
          </div>
        ) : null}
      </form>

      {/* Формы сброса стоят вне основной формы: вложенные формы недопустимы */}
      {personal ? (
        <>
          <form id="reset-lesson" action={resetStudentVersionAction} className="hidden">
            <input type="hidden" name="lessonId" value={lessonId} />
            <input type="hidden" name="studentId" value={student.id} />
            <input type="hidden" name="what" value="lesson" />
          </form>
          <form id="reset-homework" action={resetStudentVersionAction} className="hidden">
            <input type="hidden" name="lessonId" value={lessonId} />
            <input type="hidden" name="studentId" value={student.id} />
            <input type="hidden" name="what" value="homework" />
          </form>
        </>
      ) : null}
    </>
  );
}

/** Оглавление блоков урока: переход по щелчку, подсветка текущего, свернуть/развернуть всё */
function Outline({
  items,
  collapsed,
  activeKey,
  onGo,
  onCollapseAll,
  onExpandAll,
}: {
  items: Item[];
  collapsed: Set<string>;
  activeKey: string | null;
  onGo: (key: string) => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
}) {
  return (
    <nav className="card p-3" aria-label="Оглавление урока">
      <p className="mb-2 px-1 text-[13px] font-semibold text-ink-800">
        Оглавление ({items.length})
      </p>

      <div className="mb-2 flex flex-wrap gap-1.5 border-b border-ink-100 pb-2">
        <button
          type="button"
          onClick={onCollapseAll}
          disabled={items.length === 0}
          className="btn-ghost btn-sm"
        >
          Свернуть все
        </button>
        <button
          type="button"
          onClick={onExpandAll}
          disabled={items.length === 0}
          className="btn-ghost btn-sm"
        >
          Развернуть все
        </button>
      </div>

      {items.length === 0 ? (
        <p className="px-1 text-[12.5px] text-ink-400">Блоков пока нет.</p>
      ) : (
        <ol className="space-y-0.5">
          {items.map((item, index) => {
            const active = item.key === activeKey;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onGo(item.key)}
                  className={`flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] leading-snug transition ${
                    active
                      ? "bg-brand-50 font-medium text-brand-700"
                      : "text-ink-600 hover:bg-ink-50"
                  } ${item.block.hidden ? "opacity-60" : ""}`}
                >
                  <span className="mt-px w-5 shrink-0 text-right text-[12px] text-ink-400">
                    {index + 1}
                  </span>
                  <span aria-hidden>{KIND_ICON[item.block.kind]}</span>
                  <span className="min-w-0 flex-1 break-words">
                    {item.block.title || "Без названия"}
                    {collapsed.has(item.key) ? (
                      <span className="ml-1 text-ink-400">▸</span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

    </nav>
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
