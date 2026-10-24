import { redirect } from "next/navigation";
import { PlanNav } from "@/components/plan/PlanNav";
import { canUseSelfStudy } from "@/lib/self-study-access";
import { requireUser } from "@/lib/session";

/** Весь раздел «Мой английский» — личный: только владельцу, не всем администраторам */
export default async function PlanLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (!canUseSelfStudy(user)) redirect("/dashboard");

  return (
    <>
      <PlanNav />
      {children}
    </>
  );
}
