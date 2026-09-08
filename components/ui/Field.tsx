type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  inputMode?: "text" | "email" | "numeric";
  maxLength?: number;
};

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
  required = true,
  error,
  hint,
  inputMode,
  maxLength,
}: FieldProps) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? true : undefined}
        className={`field ${error ? "field-error" : ""}`}
      />
      {error ? <p className="hint">{error}</p> : null}
      {!error && hint ? (
        <p className="mt-1.5 text-[12.5px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function Alert({
  kind,
  children,
}: {
  kind: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-brand-200 bg-brand-50 text-brand-700",
  }[kind];

  return (
    <div className={`rounded-xl border px-3.5 py-2.5 text-[14px] ${styles}`}>
      {children}
    </div>
  );
}
