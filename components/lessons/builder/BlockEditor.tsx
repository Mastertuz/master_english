"use client";

import {
  BLOCK_LABELS,
  type LessonBlock,
  type LessonTask,
} from "@/lib/lesson-content";
import { emptyTask } from "@/lib/lesson-templates";
import { useState } from "react";
import {
  AreaField,
  AudioField,
  IconButton,
  ImageField,
  ListField,
  TextField,
  VideoField,
} from "./fields";

/** Какие поля показывать для каждого вида блока */
const SHOWS: Record<
  LessonBlock["kind"],
  {
    paragraphs?: boolean;
    rules?: boolean;
    formulas?: boolean;
    examples?: boolean;
    prompts?: boolean;
    vocab?: boolean;
    audio?: boolean;
    video?: boolean;
    image?: boolean;
    text?: boolean;
    tasks?: boolean;
  }
> = {
  text: { paragraphs: true, examples: true },
  rule: { rules: true, formulas: true, examples: true },
  tasks: { tasks: true },
  vocab: { vocab: true },
  listening: { audio: true, tasks: true },
  reading: { text: true, tasks: true },
  speaking: { prompts: true },
  video: { video: true, tasks: true },
  page: { image: true, tasks: true },
};

export function BlockEditor({
  block,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  block: LessonBlock;
  index: number;
  total: number;
  onChange: (block: LessonBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const shows = SHOWS[block.kind];
  const patch = (part: Partial<LessonBlock>) => onChange({ ...block, ...part });

  // Номер задания, метку которого сейчас ставим щелчком по странице
  const [placing, setPlacing] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="chip bg-brand-50 text-brand-700">
            {BLOCK_LABELS[block.kind]}
          </span>
          <span className="text-[12.5px] text-ink-400">
            блок {index + 1} из {total}
          </span>
          {block.hidden ? (
            <span className="chip bg-ink-100 text-ink-500">скрыт</span>
          ) : null}
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => patch({ hidden: !block.hidden })}
            title={
              block.hidden
                ? "Показать блок ученику"
                : "Скрыть блок от ученика"
            }
            className={`cursor-pointer rounded-full px-3 py-1 text-[12.5px] font-medium transition ${
              block.hidden
                ? "bg-ink-200 text-ink-700 hover:bg-ink-300"
                : "border border-ink-200 bg-white text-ink-500 hover:bg-ink-50"
            }`}
          >
            {block.hidden ? "🙈 Скрыт" : "Скрыть"}
          </button>

          <IconButton
            title="Выше"
            onClick={() => onMove(-1)}
            disabled={index === 0}
          >
            ↑
          </IconButton>
          <IconButton
            title="Ниже"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
          >
            ↓
          </IconButton>
          <IconButton title="Удалить блок" onClick={onRemove} danger>
            ✕
          </IconButton>
        </div>
      </div>

      <div className="space-y-4">
        <TextField
          label="Заголовок блока"
          value={block.title}
          onChange={(title) => patch({ title })}
          placeholder="Present Simple"
        />

        {shows.paragraphs ? (
          <ListField
            label="Абзацы"
            items={block.paragraphs}
            onChange={(paragraphs) => patch({ paragraphs })}
            placeholder="Объяснение простыми словами"
            addLabel="+ Абзац"
            multiline
          />
        ) : null}

        {shows.rules ? (
          <ListField
            label="Правила"
            items={block.rules}
            onChange={(rules) => patch({ rules })}
            placeholder="Регулярные действия и факты"
            addLabel="+ Правило"
            multiline
          />
        ) : null}

        {shows.formulas ? (
          <ListField
            label="Формулы"
            items={block.formulas}
            onChange={(formulas) => patch({ formulas })}
            placeholder="he / she / it + V-s"
            addLabel="+ Формула"
          />
        ) : null}

        {shows.examples ? (
          <ListField
            label="Примеры"
            items={block.examples}
            onChange={(examples) => patch({ examples })}
            placeholder="She works at the airport."
            addLabel="+ Пример"
          />
        ) : null}

        {shows.prompts ? (
          <ListField
            label="Вопросы для говорения"
            items={block.prompts}
            onChange={(prompts) => patch({ prompts })}
            placeholder="Describe your last trip."
            addLabel="+ Вопрос"
          />
        ) : null}

        {shows.text ? (
          <AreaField
            label="Текст для чтения"
            value={block.text}
            onChange={(text) => patch({ text })}
            rows={5}
            placeholder="Anna arrives at the airport two hours before her flight…"
          />
        ) : null}

        {shows.audio ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Название записи"
              value={block.audioTitle}
              onChange={(audioTitle) => patch({ audioTitle })}
              placeholder="Диалог на ресепшене"
            />
            <div className="sm:col-span-2">
              <AudioField
                label="Аудио"
                value={block.audioUrl}
                onChange={(audioUrl) => patch({ audioUrl })}
              />
            </div>
            <div className="sm:col-span-2">
              <AreaField
                label="Расшифровка"
                value={block.transcript}
                onChange={(transcript) => patch({ transcript })}
                rows={4}
                placeholder="— Good evening, I have a reservation…"
              />
            </div>
          </div>
        ) : null}

        {shows.video ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Название видео"
              value={block.videoTitle}
              onChange={(videoTitle) => patch({ videoTitle })}
              placeholder="Empower 1C, Part 1"
            />
            <TextField
              label="Субтитры (файл .vtt)"
              value={block.subtitlesUrl}
              onChange={(subtitlesUrl) => patch({ subtitlesUrl })}
              placeholder="/video/empower/unit1/part-1.vtt"
            />
            <div className="sm:col-span-2">
              <VideoField
                label="Видео"
                value={block.videoUrl}
                onChange={(videoUrl) => patch({ videoUrl })}
              />
            </div>
            <div className="sm:col-span-2">
              <AreaField
                label="Расшифровка"
                value={block.transcript}
                onChange={(transcript) => patch({ transcript })}
                rows={4}
                placeholder="Annie? — Rachel! Long time no see!"
              />
            </div>
          </div>
        ) : null}

        {shows.image ? (
          <PageCanvas
            block={block}
            patch={patch}
            placing={placing}
            setPlacing={setPlacing}
          />
        ) : null}

        {shows.vocab ? <VocabEditor block={block} patch={patch} /> : null}

        <AreaField
          label="Пример ответа для преподавателя"
          value={block.sample}
          onChange={(sample) => patch({ sample })}
          rows={4}
          placeholder="Образец монолога или диалога: ученик его не увидит"
          hint="Виден только на вашем аккаунте — ученику не показывается"
        />

        {shows.tasks ? (
          <TasksEditor
            block={block}
            patch={patch}
            pinnable={Boolean(shows.image)}
            placing={placing}
            setPlacing={setPlacing}
          />
        ) : null}
      </div>
    </div>
  );
}

function VocabEditor({
  block,
  patch,
}: {
  block: LessonBlock;
  patch: (part: Partial<LessonBlock>) => void;
}) {
  const vocab = block.vocab;

  function update(index: number, part: Partial<{ en: string; ru: string }>) {
    patch({
      vocab: vocab.map((item, i) => (i === index ? { ...item, ...part } : item)),
    });
  }

  return (
    <div>
      <label className="label">Слова блока</label>

      <div className="space-y-2">
        {vocab.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={item.en}
              onChange={(event) => update(index, { en: event.target.value })}
              placeholder="boarding pass"
              className="field bg-white"
            />
            <input
              value={item.ru}
              onChange={(event) => update(index, { ru: event.target.value })}
              placeholder="посадочный талон"
              className="field bg-white"
            />
            <IconButton
              title="Убрать слово"
              onClick={() => patch({ vocab: vocab.filter((_, i) => i !== index) })}
              danger
            >
              ✕
            </IconButton>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => patch({ vocab: [...vocab, { en: "", ru: "" }] })}
        className="mt-2 cursor-pointer text-[13px] font-medium text-brand-600 hover:text-brand-700"
      >
        + Слово
      </button>
    </div>
  );
}

function TasksEditor({
  block,
  patch,
  pinnable = false,
  placing = null,
  setPlacing,
}: {
  block: LessonBlock;
  patch: (part: Partial<LessonBlock>) => void;
  /** Можно ли привязывать задание к точке на странице учебника */
  pinnable?: boolean;
  placing?: number | null;
  setPlacing?: (index: number | null) => void;
}) {
  const tasks = block.tasks;

  function update(index: number, part: Partial<LessonTask>) {
    patch({
      tasks: tasks.map((task, i) => (i === index ? { ...task, ...part } : task)),
    });
  }

  return (
    <div>
      <label className="label">Задания</label>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="rounded-xl border border-ink-200 bg-white p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <select
                value={task.kind}
                onChange={(event) =>
                  update(index, {
                    kind: event.target.value as LessonTask["kind"],
                    options:
                      event.target.value === "choice" && task.options.length === 0
                        ? ["", "", "", ""]
                        : task.options,
                  })
                }
                className="field h-9 w-44 py-1 text-[13.5px]"
              >
                <option value="choice">Выбор варианта</option>
                <option value="fill">Вписать ответ</option>
              </select>

              <div className="flex items-center gap-2">
                {pinnable ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPlacing?.(placing === index ? null : index)
                    }
                    className={`cursor-pointer rounded-full px-3 py-1 text-[12.5px] font-medium transition ${
                      placing === index
                        ? "bg-brand-600 text-white"
                        : task.x >= 0
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "border border-ink-200 text-ink-500 hover:bg-ink-50"
                    }`}
                  >
                    {placing === index
                      ? "Щёлкните по странице"
                      : task.x >= 0
                        ? "📍 Поле на странице"
                        : "Поставить поле"}
                  </button>
                ) : null}

                {pinnable && task.x >= 0 ? (
                  <>
                    <label className="flex items-center gap-1 text-[12.5px] text-ink-500">
                      ширина
                      <input
                        type="number"
                        min={4}
                        max={100}
                        value={task.w || FIELD_WIDTH}
                        onChange={(event) =>
                          update(index, { w: Number(event.target.value) })
                        }
                        className="w-14 rounded-lg border border-ink-200 px-1.5 py-0.5 text-[12.5px]"
                      />
                      %
                    </label>
                    <IconButton
                      title="Убрать поле со страницы"
                      onClick={() => update(index, { x: -1, y: -1 })}
                    >
                      ⊘
                    </IconButton>
                  </>
                ) : null}

                <IconButton
                  title="Удалить задание"
                  onClick={() => {
                    patch({ tasks: tasks.filter((_, i) => i !== index) });
                    setPlacing?.(null);
                  }}
                  danger
                >
                  ✕
                </IconButton>
              </div>
            </div>

            <input
              value={task.prompt}
              onChange={(event) => update(index, { prompt: event.target.value })}
              placeholder="She ___ to work by bus every day."
              className="field mb-2"
            />

            {task.kind === "choice" ? (
              <ListField
                label="Варианты"
                items={task.options}
                onChange={(options) => update(index, { options })}
                placeholder="goes"
                addLabel="+ Вариант"
              />
            ) : null}

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={task.answer}
                onChange={(event) => update(index, { answer: event.target.value })}
                placeholder="Правильный ответ"
                className="field"
              />
              <input
                value={task.explanation}
                onChange={(event) =>
                  update(index, { explanation: event.target.value })
                }
                placeholder="Почему так"
                className="field"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => patch({ tasks: [...tasks, emptyTask()] })}
        className="mt-2 cursor-pointer text-[13px] font-medium text-brand-600 hover:text-brand-700"
      >
        + Задание
      </button>
    </div>
  );
}

/** Ширина поля по умолчанию — в процентах от ширины страницы */
const FIELD_WIDTH = 14;

/**
 * Страница учебника: скан и поля ответов поверх него.
 *
 * Логика как в Edvibe — берём фотографию разворота и ставим поля ответа
 * прямо в нужные места: ученик печатает в клетку упражнения.
 */
function PageCanvas({
  block,
  patch,
  placing,
  setPlacing,
}: {
  block: LessonBlock;
  patch: (part: Partial<LessonBlock>) => void;
  placing: number | null;
  setPlacing: (index: number | null) => void;
}) {
  function place(event: React.MouseEvent<HTMLImageElement>) {
    if (placing === null) return;

    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;

    patch({
      tasks: block.tasks.map((task, i) =>
        i === placing ? { ...task, x, y } : task,
      ),
    });
    setPlacing(null);
  }

  return (
    <div className="space-y-3">
      <ImageField
        label="Страница учебника"
        value={block.imageUrl}
        onChange={(imageUrl) => patch({ imageUrl })}
        hint="Фотография или скан страницы: jpg, png, webp до 8 МБ"
      />

      <TextField
        label="Что за страница"
        value={block.text}
        onChange={(text) => patch({ text })}
        placeholder="Open World Key, Unit 3, стр. 42"
      />

      {block.imageUrl ? (
        <div>
          <p className="mb-2 text-[12.5px] text-ink-400">
            {placing === null
              ? "Нажмите «Поставить поле» у задания, чтобы разместить его прямо на скане."
              : `Щёлкните по странице — там появится поле для задания ${placing + 1}.`}
          </p>

          <div className="relative inline-block max-w-full overflow-hidden rounded-xl border border-ink-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.imageUrl}
              alt="Страница учебника"
              onClick={place}
              className={`block max-h-[520px] w-auto max-w-full ${
                placing === null ? "" : "cursor-crosshair"
              }`}
            />

            {/* Показываем поля так, как их увидит ученик */}
            {block.tasks.map((task, index) =>
              task.x >= 0 && task.y >= 0 ? (
                <span
                  key={index}
                  style={{
                    left: `${task.x}%`,
                    top: `${task.y}%`,
                    width: `${task.w || FIELD_WIDTH}%`,
                  }}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border-2 bg-white/95 px-1 py-0.5 text-[12px] shadow-sm ${
                    placing === index ? "border-brand-600" : "border-brand-400"
                  }`}
                >
                  <span className="absolute -left-4 text-[11px] font-semibold text-brand-600">
                    {index + 1}
                  </span>
                  <span className="truncate text-ink-400">
                    {task.kind === "choice" ? "выбор" : "ответ"}
                  </span>
                </span>
              ) : null,
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
