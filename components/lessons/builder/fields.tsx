"use client";

import { useRef } from "react";
import { useUpload } from "@/components/ui/useUpload";

/** Мелкие поля конструктора: подпись, строка, многострочник, список строк */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="field bg-white"
      />
      {hint ? (
        <p className="mt-1 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="field resize-y bg-white"
      />
      {hint ? (
        <p className="mt-1 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

/** Список строк: абзацы, правила, примеры, вопросы для говорения */
export function ListField({
  label,
  items,
  onChange,
  placeholder,
  addLabel = "+ Добавить",
  multiline = false,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  multiline?: boolean;
}) {
  function update(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  return (
    <div>
      <label className="label">{label}</label>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                value={item}
                onChange={(event) => update(index, event.target.value)}
                placeholder={placeholder}
                rows={2}
                className="field resize-y bg-white"
              />
            ) : (
              <input
                value={item}
                onChange={(event) => update(index, event.target.value)}
                placeholder={placeholder}
                className="field bg-white"
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="mt-1 shrink-0 cursor-pointer px-1 text-[15px] text-ink-400 hover:text-rose-600"
              aria-label="Убрать строку"
              title="Убрать строку"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 cursor-pointer text-[13px] font-medium text-brand-600 hover:text-brand-700"
      >
        {addLabel}
      </button>
    </div>
  );
}

/** Кнопка-иконка для перестановки и удаления карточек */
export function IconButton({
  onClick,
  title,
  children,
  disabled = false,
  danger = false,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-ink-200 bg-white text-[13px] transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "text-rose-600 hover:bg-rose-50"
          : "text-ink-500 hover:bg-ink-50"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Аудио: либо ссылка на файл, либо загрузка с компьютера. Загруженный файл
 * уходит в /public/uploads, и в поле подставляется путь к нему.
 */
export function AudioField({
  label,
  value,
  onChange,
  hint = "Ссылка на файл или загрузка с компьютера: mp3, m4a, wav, ogg до 64 МБ",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const { upload, uploading, error } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  async function pick(file: File) {
    const url = await upload(file);
    if (url) onChange(url);
    // сбрасываем input, иначе повторный выбор того же файла не сработает
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label className="label">{label}</label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/audio/track-002.mp3 или загрузите файл"
          autoComplete="off"
          className="field bg-white"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-ghost sm:w-40"
        >
          {uploading ? "Загружаем…" : "📎 Загрузить"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void pick(file);
        }}
      />

      {error ? <p className="hint">{error}</p> : null}
      {!error && hint ? (
        <p className="mt-1 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}

      {value ? (
        <div className="mt-2 flex items-center gap-2">
          <audio controls src={value} className="w-full" />
          <IconButton title="Убрать аудио" onClick={() => onChange("")} danger>
            ✕
          </IconButton>
        </div>
      ) : null}
    </div>
  );
}

/** Видео: ссылка или загрузка файла, с предпросмотром */
export function VideoField({
  label,
  value,
  onChange,
  hint = "Ссылка на файл или загрузка с компьютера: mp4, webm, mov",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const { upload, uploading, error } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  async function pick(file: File) {
    const url = await upload(file);
    if (url) onChange(url);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label className="label">{label}</label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/video/empower/unit1/part-1.mp4 или загрузите файл"
          autoComplete="off"
          className="field bg-white"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-ghost sm:w-40"
        >
          {uploading ? "Загружаем…" : "📎 Загрузить"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void pick(file);
        }}
      />

      {error ? <p className="hint">{error}</p> : null}
      {!error && hint ? (
        <p className="mt-1 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}

      {value ? (
        <div className="mt-2 flex items-start gap-2">
          <video controls src={value} className="w-full rounded-lg bg-black" />
          <IconButton title="Убрать видео" onClick={() => onChange("")} danger>
            ✕
          </IconButton>
        </div>
      ) : null}
    </div>
  );
}

/** Картинка: ссылка или загрузка файла, с предпросмотром */
export function ImageField({
  label,
  value,
  onChange,
  hint = "Ссылка или файл: jpg, png, webp, gif до 8 МБ",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const { upload, uploading, error } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  async function pick(file: File) {
    const url = await upload(file);
    if (url) onChange(url);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label className="label">{label}</label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ссылка на изображение или загрузите файл"
          autoComplete="off"
          className="field bg-white"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-ghost sm:w-40"
        >
          {uploading ? "Загружаем…" : "📎 Загрузить"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void pick(file);
        }}
      />

      {error ? <p className="hint">{error}</p> : null}
      {!error && hint ? (
        <p className="mt-1 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}
