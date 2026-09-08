import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { getCurrentUser } from "@/lib/session";

const features = [
  {
    icon: "📚",
    title: "Уроки с темами",
    text: "Пронумерованные карточки уроков и материалы к каждому",
  },
  {
    icon: "🗂",
    title: "Личный словарь",
    text: "Перевод, определение и пример употребления из Cambridge",
  },
  {
    icon: "🎧",
    title: "Три режима тренировки",
    text: "Со звуком, по картинке и по определению слова",
  },
  {
    icon: "📝",
    title: "Тесты и домашние задания",
    text: "К каждому уроку — задание и проверочный тест",
  },
];

export default async function AuthPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-12 px-5 py-12 lg:flex-row lg:gap-16">
      <section className="w-full max-w-xl lg:flex-1">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[13px] font-medium text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Платформа изучения английского
        </div>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
          Master&nbsp;English
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-600">
          Уроки, личный словарь, тренировки слов и тесты — всё в одном месте.
          Заведите аккаунт и начните заниматься уже сегодня.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="card rise p-4">
              <div className="text-xl">{f.icon}</div>
              <p className="mt-2 text-[14.5px] font-semibold text-ink-900">
                {f.title}
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-ink-500">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full max-w-md justify-center lg:flex-1">
        <AuthPanel />
      </section>
    </main>
  );
}
