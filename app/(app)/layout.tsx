import { SelectionTranslator } from "@/components/dictionary/SelectionTranslator";
import { Header } from "@/components/layout/Header";
import { countNewComments, countNewSubmissions } from "@/lib/notifications";
import { requireUser } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // Ученику — новые комментарии преподавателя, преподавателю — работы,
  // которые ученики отправили на проверку
  const notices =
    user.role === "ADMIN"
      ? await countNewSubmissions()
      : await countNewComments(user.id);

  return (
    <div className="min-h-dvh">
      <Header user={user} notices={notices} />
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      {/* Выделил слово в любом тексте — получил перевод и кнопку «в словарь» */}
      <SelectionTranslator />
    </div>
  );
}
