import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const MODES = [
  {
    slug: "translate",
    icon: "🎧",
    title: "Слово и перевод",
    text: "Карточка со словом на английском — можно прослушать произношение. Вписываете перевод на русском или наоборот.",
    accent: "bg-brand-100 text-brand-700",
  },
  {
    slug: "image",
    icon: "🖼",
    title: "Карточка-картинка",
    text: "Показываем картинку — вы пишете по-английски, что на ней изображено.",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    slug: "definition",
    icon: "💡",
    title: "Слово по определению",
    text: "Определение на английском или русском — нужно вспомнить само слово и написать его по-английски.",
    accent: "bg-amber-100 text-amber-700",
  },
];

export default async function TrainingPage() {
  const user = await requireUser();

  const [total, withImage, withDefinition, attempts, correct, assigned] =
    await Promise.all([
      prisma.word.count({ where: { userId: user.id } }),
      prisma.word.count({
        where: { userId: user.id, NOT: { imageUrl: "" } },
      }),
      prisma.word.count({
        where: {
          userId: user.id,
          OR: [{ NOT: { definition: "" } }, { NOT: { definitionRu: "" } }],
        },
      }),
      prisma.trainingAttempt.count({ where: { userId: user.id } }),
      prisma.trainingAttempt.count({
        where: { userId: user.id, isCorrect: true },
      }),
      // Назначенные преподавателем к следующему уроку — по режимам, где они годятся
      prisma.word.findMany({
        where: { userId: user.id, assigned: true },
        select: { imageUrl: true, definition: true, definitionRu: true },
      }),
    ]);

  const assignedAvailable: Record<string, number> = {
    translate: assigned.length,
    image: assigned.filter((word) => word.imageUrl).length,
    definition: assigned.filter((word) => word.definition || word.definitionRu).length,
  };

  const available: Record<string, number> = {
    translate: total,
    image: withImage,
    definition: withDefinition,
  };

  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Тренировка слов</h1>
        <p className="mt-1 text-[14.5px] text-ink-500">
          Три режима на выбор — перед стартом отмечаете слова из своего словаря
        </p>
      </div>

      {assigned.length > 0 ? (
        <section className="card border-amber-200 bg-amber-50/70 p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">
            📌 Слова к следующему уроку ({assigned.length})
          </h2>
          <p className="mt-1 text-[13.5px] text-ink-600">
            Их назначил преподаватель — они уже отмечены, остаётся выбрать режим.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MODES.filter((mode) => assignedAvailable[mode.slug] > 0).map((mode) => (
              <Link
                key={mode.slug}
                href={`/training/${mode.slug}?assigned=1`}
                className="btn-primary btn-sm"
              >
                {mode.icon} {mode.title} · {assignedAvailable[mode.slug]}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Слов в словаре" value={total} />
        <Stat label="Всего ответов" value={attempts} />
        <Stat label="Точность" value={`${accuracy}%`} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {MODES.map((mode) => {
          const count = available[mode.slug] ?? 0;
          const disabled = count === 0;

          return (
            <div key={mode.slug} className="card rise flex flex-col p-5">
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${mode.accent}`}
              >
                {mode.icon}
              </div>
              <h2 className="text-[16px] font-semibold text-ink-900">
                {mode.title}
              </h2>
              <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-500">
                {mode.text}
              </p>
              <p className="mt-3 text-[13px] text-ink-400">
                Доступно слов: {count}
              </p>

              {disabled ? (
                <span className="btn-ghost mt-4 opacity-60">
                  Нужны подходящие слова
                </span>
              ) : (
                <Link
                  href={`/training/${mode.slug}`}
                  className="btn-primary mt-4"
                >
                  Выбрать слова
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-4">
      <p className="text-[13px] text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}
