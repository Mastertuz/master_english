"use client";

/**
 * Переключатель светлой и тёмной темы.
 *
 * Состояния в React нет намеренно: тему держит атрибут data-theme на <html>,
 * который выставляет инлайн-скрипт из app/layout.tsx ещё до первой отрисовки.
 * Нужную иконку показывает CSS, поэтому серверная разметка и клиентская
 * совпадают — расхождения при гидратации возникнуть не может.
 */
export function ThemeToggle({
  className = "",
  label = false,
}: {
  className?: string;
  /** Подпись рядом с иконкой — для бокового меню на телефоне */
  label?: boolean;
}) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Приватный режим — тема просто не запомнится до следующего захода
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title="Светлая или тёмная тема"
      aria-label="Переключить тему"
      className={`inline-flex cursor-pointer items-center justify-center transition ${className}`}
    >
      <span className="theme-light-only" aria-hidden>
        🌙
      </span>
      <span className="theme-dark-only" aria-hidden>
        ☀️
      </span>

      {label ? (
        <>
          <span className="theme-light-only">Тёмная тема</span>
          <span className="theme-dark-only">Светлая тема</span>
        </>
      ) : null}
    </button>
  );
}
