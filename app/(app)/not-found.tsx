import Link from "next/link";

/**
 * Страница для notFound(): урок или тест не существует либо не назначен.
 * Без неё Next отдаёт пустой шаблон без единого слова.
 */
export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <p className="text-4xl">🔍</p>
      <h1 className="mt-4 text-xl font-semibold text-ink-900">
        Страница не найдена
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">
        Возможно, материал удалили или он ещё не назначен вам преподавателем.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/dashboard" prefetch className="btn-primary">
          На главную
        </Link>
        <Link href="/lessons" prefetch className="btn-ghost">
          К урокам
        </Link>
      </div>
    </div>
  );
}
