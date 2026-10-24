import Link from "next/link";
import { redirect } from "next/navigation";
import { StudyChecklist } from "@/components/admin/StudyChecklist";
import {
  DAILY_RULES,
  GOAL,
  PHASES,
  PLATFORM_TIPS,
  PROGRESS,
  RESOURCES,
  TECHNIQUES,
  TYPICAL_ERRORS,
  WEEK,
} from "@/lib/self-study";
import { prisma } from "@/lib/prisma";
import { canUseSelfStudy, SELF_STUDY_TEST_TITLES } from "@/lib/self-study-access";
import { requireUser } from "@/lib/session";

const TOC = [
  { id: "goal", label: "Цель" },
  { id: "plan", label: "План на 24 недели" },
  { id: "tests", label: "Тесты и уроки" },
  { id: "week", label: "Неделя и день" },
  { id: "techniques", label: "Техники" },
  { id: "resources", label: "Учебники и материалы" },
  { id: "errors", label: "Типичные ошибки" },
  { id: "progress", label: "Как измерять прогресс" },
  { id: "site", label: "Как использовать сайт" },
];

export default async function PlanPage() {
  // Раздел личный: только владельцу, а не всем администраторам
  const user = await requireUser();
  if (!canUseSelfStudy(user)) redirect("/dashboard");

  // Личные тесты: на общей странице «Тесты» их нет, всё собрано здесь
  const tests = await prisma.test.findMany({
    where: { title: { in: SELF_STUDY_TEST_TITLES } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
      _count: { select: { questions: true } },
      attempts: {
        where: { userId: user.id },
        orderBy: { finishedAt: "desc" },
        take: 5,
        select: { score: true, total: true, finishedAt: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Мой английский: план роста</h1>
        <p className="mt-1 text-[14.5px] text-ink-500">
          Личный план преподавателя: от уровня между B2 и C1 к уверенному C1 с заделом на C2. Страница
          видна только вам.
        </p>
      </div>

      <nav className="card flex flex-wrap gap-x-4 gap-y-1.5 p-4 text-[14px]">
        {TOC.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="text-brand-700 hover:underline">
            {item.label}
          </a>
        ))}
      </nav>

      <section id="goal" className="card scroll-mt-24 space-y-3 p-5">
        <h2 className="text-xl font-semibold text-ink-900">{GOAL.title}</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[14.5px] leading-relaxed text-ink-800">
          {GOAL.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="rounded-xl bg-brand-50/70 px-4 py-3 text-[13.5px] leading-relaxed text-ink-700">
          {GOAL.note}
        </p>
      </section>

      <section id="plan" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">План на 24 недели</h2>
        <p className="text-[14.5px] leading-relaxed text-ink-600">
          Четыре этапа: диагностика, база, беглость, экзаменный режим. Отмечайте выполненное галочками.
        </p>
        <StudyChecklist phases={PHASES} />
      </section>

      <section id="tests" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Тесты и уроки</h2>
        <p className="text-[14.5px] leading-relaxed text-ink-600">
          Всё, что относится к вашему обучению, лежит здесь, а не в общих разделах «Тесты» и «Уроки».
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          {tests.map((test) => {
            const last = test.attempts[0];
            return (
              <div key={test.id} className="card flex flex-col p-5">
                <div className="flex flex-wrap gap-1.5">
                  <span className="chip bg-brand-50 text-brand-700">Тест</span>
                  {test.level ? (
                    <span className="chip bg-emerald-50 text-emerald-700">{test.level}</span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-[16px] font-semibold text-ink-900">{test.title}</h3>
                {test.description ? (
                  <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-600">
                    {test.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                <p className="mt-3 text-[13px] text-ink-500">
                  {test._count.questions} вопросов
                  {last && last.total > 0
                    ? ` · последний результат ${last.score} из ${last.total} (${Math.round((last.score / last.total) * 100)}%)`
                    : " · ещё не пройден"}
                </p>
                {test.attempts.length > 1 ? (
                  <p className="mt-1 text-[12.5px] text-ink-400">
                    Предыдущие:{" "}
                    {test.attempts
                      .slice(1)
                      .map((attempt) => `${attempt.score}/${attempt.total}`)
                      .join(", ")}
                  </p>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <Link href={`/tests/${test.id}`} prefetch className="btn-primary btn-sm flex-1">
                    {last ? "Пройти снова" : "Начать"}
                  </Link>
                  <Link href={`/tests/${test.id}/edit`} prefetch className="btn-ghost btn-sm">
                    Изменить
                  </Link>
                </div>
              </div>
            );
          })}

          <div className="card flex flex-col border-dashed p-5">
            <div className="flex flex-wrap gap-1.5">
              <span className="chip bg-ink-100 text-ink-600">Уроки</span>
            </div>
            <h3 className="mt-3 text-[16px] font-semibold text-ink-900">Ваши уроки появятся здесь</h3>
            <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-600">
              Когда вы пришлёте учебники для плана, уроки и задания по ним будут собраны на этой странице,
              отдельно от уроков учеников.
            </p>
          </div>
        </div>
      </section>

      <section id="week" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Неделя и день</h2>
        <div className="card p-5">
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px] leading-relaxed text-ink-800">
            {DAILY_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {WEEK.map((day) => (
            <div key={day.day} className="card p-4">
              <div className="flex items-center gap-2">
                <span className="chip bg-brand-600 font-semibold text-white">{day.day}</span>
                <p className="text-[15px] font-semibold text-ink-900">{day.focus}</p>
              </div>
              <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[14px] text-ink-700">
                {day.blocks.map((block) => (
                  <li key={block}>{block}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="techniques" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Техники, которые работают</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {TECHNIQUES.map((technique) => (
            <div key={technique.title} className="card space-y-2 p-5">
              <h3 className="text-[15.5px] font-semibold text-ink-900">{technique.title}</h3>
              <p className="text-[14px] leading-relaxed text-ink-800">
                <b className="text-ink-900">Как: </b>
                {technique.how}
              </p>
              <p className="text-[14px] leading-relaxed text-ink-600">
                <b className="text-ink-700">Зачем: </b>
                {technique.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="resources" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">Учебники и материалы</h2>
        {RESOURCES.map((group) => (
          <div key={group.group} className="card space-y-3 p-5">
            <h3 className="text-[15.5px] font-semibold text-ink-900">{group.group}</h3>
            <ul className="divide-y divide-ink-100">
              {group.items.map((item) => (
                <li key={item.title} className="py-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14.5px] font-medium text-ink-900">{item.title}</p>
                    <span className="chip bg-ink-100 text-ink-600">{item.level}</span>
                  </div>
                  {item.by !== "—" ? (
                    <p className="text-[13px] text-ink-500">{item.by}</p>
                  ) : null}
                  <p className="mt-0.5 text-[14px] leading-relaxed text-ink-700">{item.why}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="errors" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Типичные ошибки русскоговорящих на уровне C1</h2>
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="bg-ink-50 text-[12.5px] uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Неверно</th>
                <th className="px-4 py-3 font-medium">Верно</th>
                <th className="px-4 py-3 font-medium">Почему</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {TYPICAL_ERRORS.map((item) => (
                <tr key={item.wrong}>
                  <td className="px-4 py-2.5 text-rose-700">{item.wrong}</td>
                  <td className="px-4 py-2.5 text-emerald-700">{item.right}</td>
                  <td className="px-4 py-2.5 text-ink-700">{item.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="progress" className="card scroll-mt-24 space-y-2 p-5">
        <h2 className="text-xl font-semibold text-ink-900">Как измерять прогресс</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[14.5px] leading-relaxed text-ink-800">
          {PROGRESS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="site" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Как использовать сайт</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {PLATFORM_TIPS.map((tip) => (
            <Link
              key={tip.href}
              href={tip.href}
              prefetch
              className="card flex flex-col p-5 transition hover:border-brand-300"
            >
              <h3 className="text-[15.5px] font-semibold text-ink-900">{tip.title}</h3>
              <p className="mt-1 flex-1 text-[14px] leading-relaxed text-ink-700">{tip.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
