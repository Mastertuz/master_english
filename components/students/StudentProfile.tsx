"use client";

import { useState } from "react";
import { adminDeleteUserAction } from "@/app/actions/admin";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";

/**
 * Профиль ученика прямо в его карточке: правка данных и удаление.
 * Раньше за этим приходилось уходить в админку.
 */
export function StudentProfile({
  student,
}: {
  student: {
    id: string;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "STUDENT";
    level: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full sm:w-auto">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn-ghost btn-sm"
        >
          {open ? "Свернуть профиль" : "✏️ Изменить профиль"}
        </button>

        <form action={adminDeleteUserAction}>
          <input type="hidden" name="id" value={student.id} />
          <input type="hidden" name="redirectTo" value="/students" />
          <ConfirmSubmit
            title="Удалить ученика?"
            message={`${student.firstName} ${student.lastName} удалится вместе со своим словарём, назначенными уроками, ответами и результатами тестов. Отменить это нельзя.`}
          >
            Удалить ученика
          </ConfirmSubmit>
        </form>
      </div>

      {open ? (
        <div className="mt-3 w-full sm:w-[36rem]">
          <EditUserForm user={student} />
        </div>
      ) : null}
    </div>
  );
}
