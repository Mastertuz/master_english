import Link from "next/link";
import { notFound } from "next/navigation";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      login: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      level: true,
      createdAt: true,
      assignments: {
        orderBy: { lesson: { number: "asc" } },
        select: {
          lesson: { select: { id: true, number: true, topic: true, level: true } },
        },
      },
      _count: { select: { words: true, tests: true, attempts: true } },
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800"
      >
        ← К списку аккаунтов
      </Link>

      <div>
        <h1 className="page-title">
          {user.firstName} {user.lastName}
        </h1>
        <p className="mt-1 text-[14.5px] text-ink-500">
          {user.login}
          {user.email ? ` · ${user.email}` : ""} · зарегистрирован{" "}
          {user.createdAt.toLocaleDateString("ru-RU")}
        </p>
        <span
          className={`chip mt-2 ${
            user.level
              ? "bg-emerald-50 text-emerald-700"
              : "bg-ink-100 text-ink-500"
          }`}
        >
          Уровень: {user.level ?? "не задан"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Уроков" value={user.assignments.length} />
        <Stat label="Слов" value={user._count.words} />
        <Stat label="Тестов" value={user._count.tests} />
        <Stat label="Тренировок" value={user._count.attempts} />
      </div>

      <EditUserForm
        user={{
          id: user.id,
          login: user.login,
          email: user.email ?? "",
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          level: user.level ?? "",
        }}
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink-900">
            Назначенные уроки
          </h2>
          <Link href={`/students/${user.id}`} prefetch className="btn-ghost btn-sm">
            Открыть карточку ученика
          </Link>
        </div>

        {user.assignments.length === 0 ? (
          <div className="card p-6 text-center text-[14px] text-ink-500">
            У этого аккаунта пока нет уроков.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {user.assignments.map(({ lesson }) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="card p-4 transition hover:border-brand-300"
              >
                <span className="chip bg-brand-50 text-brand-700">
                  №{lesson.number}
                </span>
                <p className="mt-2 text-[15px] font-medium text-ink-900">
                  {lesson.topic}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-[13px] text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}
