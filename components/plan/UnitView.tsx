import Link from "next/link";
import { SpeakButton } from "@/components/ui/SpeakButton";
import type { UnitCues } from "@/lib/study/cues";
import { drillById } from "@/lib/study/drills";
import { WEEKS, unitDrillIds } from "@/lib/study/schedule";
import { SPEAKING_TASKS } from "@/lib/study/speaking";
import type { EmpowerUnit } from "@/lib/study/types";
import { ListeningPractice } from "./ListeningPractice";

/** Страница юнита: уроки в книге, записи с упражнениями, слова, письмо, грамматика */
export function UnitView({ unit, cues }: { unit: EmpowerUnit; cues: UnitCues }) {
  const weeks = WEEKS.filter((week) => week.unit === unit.n);
  const speakingIds = Array.from(new Set(weeks.flatMap((week) => week.speaking)));
  const speaking = speakingIds.map((id) => SPEAKING_TASKS.find((task) => task.id === id)).filter(Boolean);
  const drills = unitDrillIds(unit.n).map((id) => drillById(id)).filter(Boolean);

  return (
    <div className="space-y-8">
      <Link href="/plan/units" className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800">
        ← Все юниты
      </Link>

      <div>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-brand-600 font-semibold text-white">Юнит {unit.n}</span>
          <span className="chip bg-ink-100 text-ink-600">недели {weeks.map((week) => week.n).join("–")}</span>
        </div>
        <h1 className="page-title mt-2">{unit.title}</h1>
        <p className="mt-1 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">{unit.about}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Уроки в книге</h2>
        <p className="text-[13.5px] text-ink-500">
          Empower 2nd C1 Student&apos;s Book: страницы совпадают с номерами, которые напечатаны в книге.
        </p>
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="bg-ink-50 text-[12.5px] uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Урок</th>
                <th className="px-4 py-3 font-medium">Цель</th>
                <th className="px-4 py-3 font-medium">Страницы</th>
                <th className="px-4 py-3 font-medium">Грамматика и лексика</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {unit.lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-4 py-2.5 font-medium text-ink-900">
                    {lesson.id}
                    <span className="block text-[12.5px] font-normal text-ink-500">{lesson.title}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-700">{lesson.goal}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-ink-700">{lesson.pages}</td>
                  <td className="px-4 py-2.5 text-ink-600">
                    {lesson.grammar ? <span className="block">{lesson.grammar}</span> : null}
                    {lesson.vocabulary ? <span className="block">{lesson.vocabulary}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">Записи с упражнениями</h2>
        <p className="text-[14px] leading-relaxed text-ink-600">
          Это настоящие записи из учебника. Порядок такой: послушали без текста, ответили, прочитали текст, повторили фразы вслух и пересказали своими словами.
        </p>
        {unit.tracks.map((track) => (
          <div key={track.track} id={`track-${track.track}`} className="scroll-mt-24">
            <ListeningPractice track={track} cues={cues[track.track] ?? []} />
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-ink-900">Слова и фразы юнита</h2>
        <p className="text-[13.5px] text-ink-500">
          Все эти слова и фразы из записей автоматически попадают в карточки: раздел «Слова». Нажмите на динамик, чтобы услышать произношение.
        </p>
        <div className="card p-0">
          <ul className="divide-y divide-ink-100">
            {unit.vocab.map((item) => (
              <li key={item.en} className="flex items-start gap-3 px-4 py-3">
                <SpeakButton text={item.en.replace(/…/g, "").replace(/\s*\/\s*/g, ", ")} />
                <div>
                  <p className="text-[15px] font-medium text-ink-900">
                    {item.en} <span className="font-normal text-ink-500">— {item.ru}</span>
                  </p>
                  <p className="text-[13.5px] italic text-ink-500">{item.example}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="card space-y-2 p-5">
          <h2 className="text-[16px] font-semibold text-ink-900">Грамматика на этих неделях</h2>
          <ul className="space-y-1.5">
            {drills.map((drill) => (
              <li key={drill!.id}>
                <Link href={`/plan/grammar/${drill!.id}`} className="text-[14.5px] text-brand-700 hover:underline">
                  {drill!.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card space-y-2 p-5">
          <h2 className="text-[16px] font-semibold text-ink-900">Письмо</h2>
          <Link href={`/plan/writing/${unit.writing.id}`} className="text-[14.5px] text-brand-700 hover:underline">
            {unit.writing.title} ({unit.writing.type}, {unit.writing.words})
          </Link>
          <h2 className="pt-2 text-[16px] font-semibold text-ink-900">Говорение</h2>
          <ul className="space-y-1.5">
            {speaking.map((task) => (
              <li key={task!.id}>
                <Link href={`/plan/speaking/${task!.id}`} className="text-[14.5px] text-brand-700 hover:underline">
                  {task!.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
