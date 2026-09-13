import Link from "next/link";
import { OgeAccessForm } from "@/components/oge/OgeAccessForm";
import { OGE_VARIANTS, requireOgeUser } from "@/lib/oge";
import { MARK_SCALE, TOTAL_MAX } from "@/lib/oge/scoring";
import {
  fieldCount,
  STATUS_LABEL,
  STATUS_STYLE,
  STRUCTURE,
  summarize,
} from "@/lib/oge/summary";
import { prisma } from "@/lib/prisma";

export default async function OgePage() {
  const user = await requireOgeUser();
  const isAdmin = user.role === "ADMIN";

  const attemptSelect = {
    variant: true,
    answers: true,
    review: true,
    submittedAt: true,
    checkedAt: true,
  } as const;

  const [attempts, students] = await Promise.all([
    prisma.ogeAttempt.findMany({
      where: { userId: user.id },
      select: attemptSelect,
    }),
    isAdmin
      ? prisma.user.findMany({
          where: { role: "STUDENT" },
          orderBy: [{ ogeAccess: "desc" }, { firstName: "asc" }],
          select: {
            id: true,
            firstName: true,
            lastName: true,
            login: true,
            ogeAccess: true,
            ogeAttempts: { select: attemptSelect },
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">ОГЭ по английскому</h1>
        <p className="mt-1 text-[14.5px] text-ink-500">
          Варианты в формате экзамена: ответы вписываются прямо на сайте, устные
          задания записываются с микрофона
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {OGE_VARIANTS.map((variant) => {
          const summary = summarize(
            variant,
            attempts.find((attempt) => attempt.variant === variant.id) ?? null,
          );

          return (
            <div key={variant.id} className="card rise flex flex-col p-5">
              <div className="flex flex-wrap gap-1.5">
                <span className={`chip ${STATUS_STYLE[summary.status]}`}>
                  {STATUS_LABEL[summary.status]}
                </span>
                {summary.status === "checked" ? (
                  <span className="chip bg-emerald-50 text-emerald-700">
                    {summary.total} из {TOTAL_MAX} · отметка {summary.mark}
                  </span>
                ) : summary.status === "submitted" ? (
                  <span className="chip bg-ink-100 text-ink-600">
                    Автопроверка: {summary.auto} из {summary.autoMax}
                  </span>
                ) : summary.status === "progress" ? (
                  <span className="chip bg-ink-100 text-ink-600">
                    Заполнено {summary.answered} из {fieldCount(variant)}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-3 text-[17px] font-semibold text-ink-900">
                {variant.title}
              </h2>
              <p className="mt-1 flex-1 text-[14px] leading-relaxed text-ink-600">
                {variant.subtitle}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/oge/${variant.id}`}
                  prefetch
                  className="btn-primary btn-sm"
                >
                  {summary.status === "new"
                    ? "Начать вариант"
                    : summary.status === "progress"
                      ? "Продолжить"
                      : "Результаты и ответы"}
                </Link>
                <Link
                  href={`/oge/${variant.id}/razbor`}
                  prefetch
                  className="btn-ghost btn-sm"
                >
                  📖 Разбор заданий
                </Link>
              </div>
            </div>
          );
        })}

        <div className="card p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">Как устроен экзамен</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[360px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-ink-200 text-ink-500">
                  <th className="py-1.5 pr-3 font-medium">Раздел</th>
                  <th className="py-1.5 pr-3 font-medium">Задания</th>
                  <th className="py-1.5 pr-3 font-medium">Баллы</th>
                  <th className="py-1.5 font-medium">Время</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 text-ink-800">
                {STRUCTURE.map((row) => (
                  <tr key={row.part}>
                    <td className="py-1.5 pr-3">{row.part}</td>
                    <td className="py-1.5 pr-3">{row.tasks}</td>
                    <td className="py-1.5 pr-3">{row.max}</td>
                    <td className="py-1.5">{row.time}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-1.5 pr-3">Всего</td>
                  <td className="py-1.5 pr-3">38</td>
                  <td className="py-1.5 pr-3">{TOTAL_MAX}</td>
                  <td className="py-1.5">2 ч 15 мин</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-ink-500">
            Перевод в отметку (шкала последних лет):{" "}
            {MARK_SCALE.map((row) => `«${row.mark}» — ${row.range}`).join(", ")}.
          </p>
        </div>
      </div>

      {isAdmin ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">Ученики</h2>
            <p className="text-[13px] text-ink-500">
              Вкладка «ОГЭ» появляется у ученика, когда вы открываете ему доступ.
              Работы проверяются здесь же: письмо и устную часть оцениваете вы.
            </p>
          </div>

          {students.length === 0 ? (
            <div className="card p-6 text-center text-[14px] text-ink-500">
              Учеников пока нет.
            </div>
          ) : (
            <div className="card divide-y divide-ink-100">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-wrap items-center gap-3 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/students/${student.id}`}
                      prefetch
                      className="text-[14.5px] font-medium text-ink-900 hover:text-brand-700"
                    >
                      {student.firstName} {student.lastName}
                    </Link>
                    <p className="text-[12.5px] text-ink-500">{student.login}</p>
                  </div>

                  {OGE_VARIANTS.map((variant) => {
                    const attempt =
                      student.ogeAttempts.find((item) => item.variant === variant.id) ??
                      null;
                    const summary = summarize(variant, attempt);

                    return (
                      <div key={variant.id} className="flex flex-wrap items-center gap-2">
                        <span className={`chip ${STATUS_STYLE[summary.status]}`}>
                          {STATUS_LABEL[summary.status]}
                          {summary.status === "checked"
                            ? ` · ${summary.total}/${TOTAL_MAX}`
                            : ""}
                        </span>
                        {attempt ? (
                          <Link
                            href={`/oge/${variant.id}?student=${student.id}`}
                            prefetch
                            className={
                              summary.status === "submitted"
                                ? "btn-primary btn-sm"
                                : "btn-ghost btn-sm"
                            }
                          >
                            {summary.status === "submitted" ? "Проверить" : "Открыть работу"}
                          </Link>
                        ) : null}
                      </div>
                    );
                  })}

                  <OgeAccessForm userId={student.id} access={student.ogeAccess} />
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
