import { PasswordForm, ProfileForm } from "@/components/profile/ProfileForms";
import { LEVEL_LABELS, type LevelCode } from "@/lib/lesson-content";
import { prisma } from "@/lib/prisma";
import { initialsOf, requireUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await requireUser();

  const [lessons, words, attempts, correct, tests] = await Promise.all([
    prisma.lessonAssignment.count({ where: { userId: user.id } }),
    prisma.word.count({ where: { userId: user.id } }),
    prisma.trainingAttempt.count({ where: { userId: user.id } }),
    prisma.trainingAttempt.count({
      where: { userId: user.id, isCorrect: true },
    }),
    prisma.testAttempt.count({ where: { userId: user.id } }),
  ]);

  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card flex flex-wrap items-center gap-4 p-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white">
          {initialsOf(user)}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-ink-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-[14px] text-ink-500">
            {user.login}
            {user.email ? ` · ${user.email}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className={`chip ${
                user.role === "ADMIN"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-brand-50 text-brand-700"
              }`}
            >
              {user.role === "ADMIN" ? "Администратор" : "Ученик"}
            </span>
            {user.role === "STUDENT" ? (
              <span
                className={`chip ${
                  user.level
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-ink-100 text-ink-500"
                }`}
              >
                {user.level
                  ? LEVEL_LABELS[user.level as LevelCode]
                  : "Уровень пока не определён"}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        <Stat label="Уроков" value={lessons} />
        <Stat label="Слов" value={words} />
        <Stat label="Ответов" value={attempts} />
        <Stat label="Точность" value={`${accuracy}%`} />
        <Stat label="Тестов пройдено" value={tests} />
      </div>

      {user.role === "STUDENT" ? (
        <div className="card p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">
            Уровень английского
          </h2>
          <p className="mt-1.5 text-[14px] text-ink-600">
            {user.level
              ? LEVEL_LABELS[user.level as LevelCode]
              : "Преподаватель ещё не определил ваш уровень."}
          </p>
          <p className="mt-2 text-[13px] text-ink-400">
            Уровень ставит преподаватель — по нему подбираются уроки и тесты.
          </p>
        </div>
      ) : null}

      <ProfileForm user={user} />
      <PasswordForm />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-4">
      <p className="text-[12.5px] text-ink-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}
