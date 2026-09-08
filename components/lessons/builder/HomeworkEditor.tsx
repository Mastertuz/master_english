"use client";

import {
  HOMEWORK_KIND_LABELS,
  HOMEWORK_TEMPLATES,
  emptyHomeworkTask,
  type HomeworkTaskDraft,
} from "@/lib/lesson-templates";
import {
  AreaField,
  AudioField,
  IconButton,
  ListField,
  TextField,
} from "./fields";

export type HomeworkDraft = {
  title: string;
  intro: string;
  tasks: HomeworkTaskDraft[];
};

export function HomeworkEditor({
  homework,
  onChange,
}: {
  homework: HomeworkDraft;
  onChange: (homework: HomeworkDraft) => void;
}) {
  const tasks = homework.tasks;

  function setTasks(next: HomeworkTaskDraft[]) {
    onChange({ ...homework, tasks: next });
  }

  function update(index: number, part: Partial<HomeworkTaskDraft>) {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, ...part } : task)));
  }

  /** Скрыть или показать сразу весь раздел — им обычно и оперируют */
  function setSectionHidden(section: string, hidden: boolean) {
    setTasks(
      tasks.map((task) => (task.section === section ? { ...task, hidden } : task)),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...tasks];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    setTasks(next);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Название работы"
          value={homework.title}
          onChange={(title) => onChange({ ...homework, title })}
          placeholder="Домашнее задание к уроку 1"
        />
        <TextField
          label="Вступление"
          value={homework.intro}
          onChange={(intro) => onChange({ ...homework, intro })}
          placeholder="Выполните задания до следующего занятия"
        />
      </div>

      <div>
        <p className="label">Добавить задание из шаблона</p>
        <div className="flex flex-wrap gap-2">
          {HOMEWORK_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setTasks([...tasks, template.build()])}
              title={template.hint}
              className="cursor-pointer rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[13px] font-medium text-ink-600 transition hover:border-brand-400 hover:text-brand-700"
            >
              + {template.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTasks([...tasks, emptyHomeworkTask()])}
            className="cursor-pointer rounded-full border border-dashed border-ink-300 px-3 py-1.5 text-[13px] font-medium text-ink-500 transition hover:border-brand-400 hover:text-brand-700"
          >
            + Пустое задание
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-xl bg-ink-50 px-4 py-6 text-center text-[14px] text-ink-500">
          Заданий пока нет. Возьмите шаблон выше — потом поправите текст.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => {
            // Раздел начинается там, где меняется его название
            const startsSection = task.section !== tasks[index - 1]?.section;
            const sectionTasks = tasks.filter((t) => t.section === task.section);
            const sectionHidden = sectionTasks.every((t) => t.hidden);

            return (
            <div key={task.id ?? `new-${index}`}>
            {startsSection ? (
              <div className="mb-2 mt-4 flex flex-wrap items-center justify-between gap-2 first:mt-0">
                <p className="text-[13.5px] font-semibold text-ink-700">
                  {task.section || "Без раздела"}
                  <span className="ml-2 font-normal text-ink-400">
                    {sectionTasks.length} зад.
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setSectionHidden(task.section, !sectionHidden)
                  }
                  title={
                    sectionHidden
                      ? "Показать весь раздел ученику"
                      : "Скрыть весь раздел от ученика"
                  }
                  className={`cursor-pointer rounded-full px-3 py-1 text-[12.5px] font-medium transition ${
                    sectionHidden
                      ? "bg-ink-200 text-ink-700 hover:bg-ink-300"
                      : "border border-ink-200 bg-white text-ink-500 hover:bg-ink-50"
                  }`}
                >
                  {sectionHidden ? "🙈 Раздел скрыт" : "Скрыть раздел"}
                </button>
              </div>
            ) : null}

            <div
              className={`rounded-2xl border bg-ink-50/60 p-4 ${
                task.hidden ? "border-dashed border-ink-300 opacity-70" : "border-ink-200"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="chip bg-violet-50 text-violet-700">
                    {HOMEWORK_KIND_LABELS[task.kind]}
                  </span>
                  <span className="text-[12.5px] text-ink-400">
                    задание {index + 1}
                    {task.id ? "" : " · новое"}
                  </span>
                  {task.hidden ? (
                    <span className="chip bg-ink-100 text-ink-500">скрыто</span>
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => update(index, { hidden: !task.hidden })}
                    title={
                      task.hidden
                        ? "Показать задание ученику"
                        : "Скрыть задание от ученика"
                    }
                    className={`cursor-pointer rounded-full px-3 py-1 text-[12.5px] font-medium transition ${
                      task.hidden
                        ? "bg-ink-200 text-ink-700 hover:bg-ink-300"
                        : "border border-ink-200 bg-white text-ink-500 hover:bg-ink-50"
                    }`}
                  >
                    {task.hidden ? "🙈 Скрыто" : "Скрыть"}
                  </button>

                  <IconButton
                    title="Выше"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    title="Ниже"
                    onClick={() => move(index, 1)}
                    disabled={index === tasks.length - 1}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    title="Удалить задание"
                    onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                    danger
                  >
                    ✕
                  </IconButton>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
                  <div>
                    <label className="label">Тип</label>
                    <select
                      value={task.kind}
                      onChange={(event) =>
                        update(index, {
                          kind: event.target.value as HomeworkTaskDraft["kind"],
                          options:
                            event.target.value === "CHOICE" &&
                            task.options.length === 0
                              ? ["", "", "", ""]
                              : task.options,
                        })
                      }
                      className="field bg-white"
                    >
                      {Object.entries(HOMEWORK_KIND_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <TextField
                    label="Раздел"
                    value={task.section}
                    onChange={(section) => update(index, { section })}
                    placeholder="1. Grammar"
                  />
                </div>

                <AreaField
                  label="Задание"
                  value={task.prompt}
                  onChange={(prompt) => update(index, { prompt })}
                  rows={2}
                  placeholder="My parents ___ at home now."
                />

                {task.kind === "READING" ? (
                  <AreaField
                    label="Текст"
                    value={task.text}
                    onChange={(text) => update(index, { text })}
                    rows={4}
                  />
                ) : null}

                {task.kind === "LISTENING" ? (
                  <div className="space-y-3">
                    <AudioField
                      label="Аудио"
                      value={task.audioUrl}
                      onChange={(audioUrl) => update(index, { audioUrl })}
                    />
                    <TextField
                      label="Расшифровка"
                      value={task.transcript}
                      onChange={(transcript) => update(index, { transcript })}
                    />
                  </div>
                ) : null}

                {task.kind === "CHOICE" ||
                task.kind === "READING" ||
                task.kind === "LISTENING" ? (
                  <ListField
                    label="Варианты ответа"
                    items={task.options}
                    onChange={(options) => update(index, { options })}
                    placeholder="are"
                    addLabel="+ Вариант"
                  />
                ) : null}

                {task.kind === "TEACHER" ? (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-700">
                    Ответ проверяет преподаватель вручную — правильный ответ
                    указывать не нужно.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField
                      label="Правильный ответ"
                      value={task.answer}
                      onChange={(answer) => update(index, { answer })}
                      hint="Несколько вариантов — через запятую"
                    />
                    <TextField
                      label="Правило"
                      value={task.rule}
                      onChange={(rule) => update(index, { rule })}
                      placeholder="to be в Present Simple"
                    />
                  </div>
                )}

                <TextField
                  label="Пояснение"
                  value={task.explanation}
                  onChange={(explanation) => update(index, { explanation })}
                  placeholder="Подлежащее во множественном числе → are"
                />
              </div>
            </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
