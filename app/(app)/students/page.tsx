import Link from "next/link";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { prisma } from "@/lib/prisma";
import { initialsOf, requireAdmin } from "@/lib/session";

export default async function StudentsPage() {
  await requireAdmin();

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: [{ level: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      login: true,
      email: true,
      firstName: true,
      lastName: true,
      level: true,
      _count: { select: { assignments: true, words: true } },
      homeworkAnswers: {
        where: { task: { kind: "TEACHER" }, grade: null },
        select: { id: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Ученики</h1>
          <p className="mt-1 text-[14.5px] text-ink-500">
            Уроки, ответы на задания и уровень каждого ученика
          </p>
        </div>
        <CreateUserForm studentOnly />
      </div>

      {students.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl">🎓</p>
          <p className="mt-4 text-[15px] text-ink-600">
            Учеников пока нет. Заведите первого — кнопка «Новый ученик» сверху.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              prefetch
              className="card rise group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[14px] font-semibold text-white">
                  {initialsOf(student)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-ink-900 group-hover:text-brand-700">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="truncate text-[12.5px] text-ink-500">
                    {student.login}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span
                  className={`chip ${
                    student.level
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {student.level ?? "уровень не задан"}
                </span>
                {student.homeworkAnswers.length > 0 ? (
                  <span className="chip bg-amber-50 text-amber-700">
                    На проверке: {student.homeworkAnswers.length}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex gap-3 border-t border-ink-100 pt-3 text-[12.5px] text-ink-500">
                <span>📚 {student._count.assignments} уроков</span>
                <span>🗂 {student._count.words} слов</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
