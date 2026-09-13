import { redirect } from "next/navigation";
import { requireUser, type SessionUser } from "@/lib/session";
import { demo2027 } from "./demo-2027";

/** Все варианты ОГЭ на сайте — новые добавляются сюда */
export const OGE_VARIANTS = [demo2027];

export function getVariant(id: string) {
  return OGE_VARIANTS.find((variant) => variant.id === id) ?? null;
}

/** Вкладка «ОГЭ» есть у администратора и у учеников, которым он её открыл */
export function canUseOge(user: Pick<SessionUser, "role" | "ogeAccess">) {
  return user.role === "ADMIN" || user.ogeAccess;
}

export async function requireOgeUser(): Promise<SessionUser> {
  const user = await requireUser();
  if (!canUseOge(user)) redirect("/dashboard");
  return user;
}
