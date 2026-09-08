import Link from "next/link";
import {
  adminDeleteUserAction,
  adminSetRoleAction,
} from "@/app/actions/admin";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { prisma } from "@/lib/prisma";
import { initialsOf, requireAdmin } from "@/lib/session";

export default async function AdminPage() {
  const me = await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      login: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      level: true,
      createdAt: true,
      _count: { select: { assignments: true, words: true } },
    },
  });

  const admins = users.filter((user) => user.role === "ADMIN").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Панель администратора</h1>
          <p className="mt-1 text-[14.5px] text-ink-500">
            Всего аккаунтов: {users.length} · администраторов: {admins}
          </p>
        </div>
        <CreateUserForm />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[14px]">
            <thead className="bg-ink-50 text-[12.5px] uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Пользователь</th>
                <th className="px-4 py-3 font-medium">Логин</th>
                <th className="px-4 py-3 font-medium">Почта</th>
                <th className="px-4 py-3 font-medium">Роль</th>
                <th className="px-4 py-3 font-medium">Уровень</th>
                <th className="px-4 py-3 font-medium">Контент</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white ${
                          user.role === "ADMIN"
                            ? "bg-amber-500"
                            : "bg-brand-600"
                        }`}
                      >
                        {initialsOf(user)}
                      </span>
                      <div>
                        <p className="font-medium text-ink-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[12.5px] text-ink-400">
                          с {user.createdAt.toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{user.login}</td>
                  <td className="px-4 py-3 text-ink-600">
                    {user.email ?? (
                      <span className="text-ink-400">не указана</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <form action={adminSetRoleAction} className="inline">
                      <input type="hidden" name="id" value={user.id} />
                      <input
                        type="hidden"
                        name="role"
                        value={user.role === "ADMIN" ? "STUDENT" : "ADMIN"}
                      />
                      <ConfirmSubmit
                        title="Сменить роль?"
                        message={
                          user.role === "ADMIN"
                            ? `${user.firstName} ${user.lastName} станет учеником и потеряет доступ к админке.`
                            : `${user.firstName} ${user.lastName} станет администратором: полный доступ к урокам, тестам и пользователям.`
                        }
                        confirmLabel="Сменить роль"
                        danger={false}
                        pendingLabel="Меняем…"
                        className={`chip cursor-pointer ${
                          user.role === "ADMIN"
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-brand-50 text-brand-700 hover:bg-brand-100"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Администратор" : "Ученик"} ⇄
                      </ConfirmSubmit>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`chip ${
                        user.level
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-ink-100 text-ink-400"
                      }`}
                    >
                      {user.level ?? "—"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-ink-500">
                    📚 {user._count.assignments} · 🗂 {user._count.words}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="btn-ghost btn-sm"
                    >
                      Изменить
                    </Link>{" "}
                    {user.id === me.id ? (
                      <span className="text-[12.5px] text-ink-400">
                        это вы
                      </span>
                    ) : (
                      <form className="inline" action={adminDeleteUserAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <ConfirmSubmit
                          title="Удалить пользователя?"
                          message={`${user.firstName} ${user.lastName} удалится вместе со словарём, назначенными уроками и результатами. Отменить это нельзя.`}
                        >
                          Удалить
                        </ConfirmSubmit>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[13px] text-ink-400">
        Удаление аккаунта удаляет и все его уроки, слова, тесты и результаты.
      </p>
    </div>
  );
}
