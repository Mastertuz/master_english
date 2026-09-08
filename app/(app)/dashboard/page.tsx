import Link from "next/link";
import { newComments } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const SECTIONS = [
  {
    href: "/lessons",
    icon: "📚",
    title: "Уроки",
    text: "Материал, слова урока и план занятия",
    accent: "bg-brand-100",
  },
  {
    href: "/homework",
    icon: "✍️",
    title: "Домашние задания",
    text: "Задания с автопроверкой, аудирование и работы на проверку",
    accent: "bg-violet-100",
  },
  {
    href: "/dictionary",
    icon: "🗂",
    title: "Словарь",
    text: "Перевод, примеры и определения из Cambridge",
    accent: "bg-sky-100",
  },
  {
    href: "/training",
    icon: "🎯",
    title: "Тренировка слов",
    text: "Три режима: со звуком, по картинке и по определению",
    accent: "bg-emerald-100",
  },
  {
    href: "/tests",
    icon: "📝",
    title: "Тесты",
    text: "Проверьте, что материал действительно усвоен",
    accent: "bg-amber-100",
  },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const scope = isAdmin ? {} : { assignments: { some: { userId: user.id } } };

  const comments = isAdmin ? [] : await newComments(user.id);

  const [lessons, words, recent, pendingHomework] = await Promise.all([
    prisma.lesson.count({ where: scope }),
    prisma.word.count({ where: { userId: user.id } }),
    prisma.lesson.findMany({
      where: scope,
      orderBy: { number: "desc" },
      take: 3,
      select: { id: true, number: true, topic: true, level: true },
    }),
    prisma.homeworkTask.count({
      where: {
        homework: { lesson: scope },
        answers: { none: { userId: user.id } },
      },
    }),
  ]);

  const sections = isAdmin
    ? [
        ...SECTIONS,
        {
          href: "/students",
          icon: "🎓",
          title: "Ученики",
          text: "Уроки, ответы и уровень каждого ученика",
          accent: "bg-rose-100",
        },
      ]
    : SECTIONS;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Привет, {user.firstName}! 👋</h1>
        <p className="mt-1.5 text-[15px] text-ink-500">
          {pendingHomework > 0
            ? `Невыполненных заданий: ${pendingHomework}. Хороший повод начать.`
            : "Выберите, чем займётесь сегодня."}
        </p>
      </div>

      {comments.length > 0 ? (
        <section className="card border-amber-200 bg-amber-50/70 p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">
            💬 Новые комментарии преподавателя ({comments.length})
          </h2>

          <div className="mt-3 space-y-2">
            {comments.map((notice) => (
              <Link
                key={notice.id}
                href={notice.href}
                prefetch
                className="block rounded-xl border border-amber-200 bg-white px-4 py-3 transition hover:border-amber-300"
              >
                <p className="text-[12.5px] text-ink-400">
                  {notice.where} · {notice.at.toLocaleDateString("ru-RU")}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[13.5px] text-ink-600">
                  {notice.task}
                </p>
                <p className="mt-1 text-[14.5px] text-ink-800">
                  {notice.comment}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Уроков" value={lessons} />
        <Stat label="Слов в словаре" value={words} />
        <Stat
          label={user.level ? "Ваш уровень" : "Уровень"}
          value={user.level ?? "не задан"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            prefetch
            className="card rise group flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${section.accent}`}
            >
              {section.icon}
            </span>
            <span>
              <span className="block text-[16px] font-semibold text-ink-900 group-hover:text-brand-700">
                {section.title}
              </span>
              <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-500">
                {section.text}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {recent.length > 0 ? (
        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-ink-900">
            Последние уроки
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {recent.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                prefetch
                className="card p-4 transition hover:border-brand-300"
              >
                <div className="flex gap-1.5">
                  <span className="chip bg-brand-50 text-brand-700">
                    №{lesson.number}
                  </span>
                  <span className="chip bg-emerald-50 text-emerald-700">
                    {lesson.level}
                  </span>
                </div>
                <p className="mt-2 text-[15px] font-medium text-ink-900">
                  {lesson.topic}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
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
