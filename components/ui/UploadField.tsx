"use client";

import { useRef, useState } from "react";
import { useUpload } from "./useUpload";

/**
 * Поле «ссылка или файл»: администратор может вставить URL либо загрузить
 * файл — он уйдёт в /public/uploads и подставится сюда ссылкой.
 */
export function UploadField({
  label,
  name,
  defaultValue = "",
  accept = "image/*",
  preview = "image",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  accept?: string;
  preview?: "image" | "audio" | "none";
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const { upload, uploading, error } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  async function pick(file: File) {
    const url = await upload(file);
    if (url) setValue(url);
    // сбрасываем input, иначе повторный выбор того же файла не сработает
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={name}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://… или загрузите файл"
          autoComplete="off"
          className="field flex-1"
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
        accept={accept}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void pick(file);
        }}
      />

      {error ? <p className="hint">{error}</p> : null}
      {!error && hint ? (
        <p className="mt-1.5 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}

      {value && preview === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Предпросмотр"
          className="mt-2 max-h-32 rounded-xl border border-ink-200 object-contain"
        />
      ) : null}

      {value && preview === "audio" ? (
        <audio controls src={value} className="mt-2 w-full" />
      ) : null}
    </div>
  );
}
