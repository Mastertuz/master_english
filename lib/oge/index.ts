import { redirect } from "next/navigation";
import { requireUser, type SessionUser } from "@/lib/session";
import { demo2027 } from "./demo-2027";
import { variant2 } from "./variant-2";
import { variant3 } from "./variant-3";
import { variant4 } from "./variant-4";
import { variant5 } from "./variant-5";
import { variant6 } from "./variant-6";

/** Все варианты ОГЭ на сайте — новые добавляются сюда */
export const OGE_VARIANTS = [demo2027, variant2, variant3, variant4, variant5, variant6];

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
