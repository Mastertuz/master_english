import { Header } from "@/components/layout/Header";
import { countNewComments } from "@/lib/notifications";
import { requireUser } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // Преподавателю сообщать не о чем: комментарии пишет он сам
  const newComments =
    user.role === "ADMIN" ? 0 : await countNewComments(user.id);

  return (
    <div className="min-h-dvh">
      <Header user={user} newComments={newComments} />
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
