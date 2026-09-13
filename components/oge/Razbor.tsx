import { SeekButton } from "@/components/ui/SeekButton";
import type { Criterion, Explanation, Strategy } from "@/lib/oge/types";

/** Что проверяет задание, как его выполнять и где ошибаются */
export function StrategyCard({ strategy }: { strategy: Strategy }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-brand-700">
          Как выполнять
        </p>
        <p className="mt-1 text-[13.5px] text-ink-600">{strategy.checks}</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[14px] leading-relaxed text-ink-800">
          {strategy.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-amber-700">
          Типичные ошибки
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-ink-800">
          {strategy.mistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ExplanationView({ explanation }: { explanation: Explanation }) {
  return (
    <div className="mt-2 space-y-1.5 text-[14px] leading-relaxed">
      {explanation.proof ? (
        <blockquote className="rounded-r-lg border-l-4 border-emerald-300 bg-emerald-50/60 px-3 py-1.5 italic text-ink-700">
          {explanation.proof}
        </blockquote>
      ) : null}
      <p className="text-ink-800">{explanation.why}</p>
      {explanation.rule ? (
        <p className="rounded-lg bg-brand-50/70 px-3 py-2 text-ink-800">
          <span className="font-semibold text-brand-700">Правило: </span>
          {explanation.rule}
        </p>
      ) : null}
      {explanation.trap ? (
        <p className="text-ink-600">
          <span className="font-semibold text-amber-700">Ловушка: </span>
          {explanation.trap}
        </p>
      ) : null}
    </div>
  );
}

export function AnswerCard({
  n,
  title,
  answer,
  explanation,
  children,
}: {
  n: number | string;
  title: React.ReactNode;
  answer: string;
  explanation: Explanation;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-200 p-4">
      <div className="flex flex-wrap items-start gap-2">
        <span className="chip bg-brand-50 text-brand-700">№ {n}</span>
        <div className="min-w-0 flex-1 text-[14.5px] font-medium text-ink-900">
          {title}
        </div>
        <span className="chip bg-emerald-50 text-emerald-700">Ответ: {answer}</span>
      </div>
      {children}
      <ExplanationView explanation={explanation} />
    </div>
  );
}

/** Текст записи; с src и at — ещё и таймкод, где он звучит */
export function Transcript({
  title,
  text,
  src,
  at,
  open = false,
}: {
  title: string;
  text: string;
  src?: string;
  at?: number;
  open?: boolean;
}) {
  return (
    <details open={open} className="rounded-xl border border-ink-200 bg-ink-50/60 px-4 py-2">
      <summary className="cursor-pointer text-[14px] font-medium text-ink-700">
        {title}
      </summary>
      {src && at !== undefined ? (
        <div className="mt-2">
          <SeekButton src={src} at={at} label="слушать с этого места" />
        </div>
      ) : null}
      <p className="mt-2 whitespace-pre-wrap pb-2 text-[14px] leading-relaxed text-ink-700">
        {text}
      </p>
    </details>
  );
}

export function CriteriaTable({ criteria }: { criteria: Criterion[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-ink-200 text-ink-500">
            <th className="py-2 pr-3 font-medium">Критерий</th>
            <th className="py-2 pr-3 font-medium">Макс.</th>
            <th className="py-2 font-medium">Что нужно для максимума</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {criteria.map((criterion) => (
            <tr key={criterion.code}>
              <td className="py-2 pr-3 align-top text-ink-900">
                <b>{criterion.code}</b> {criterion.title}
              </td>
              <td className="py-2 pr-3 align-top font-semibold text-ink-900">
                {criterion.max}
              </td>
              <td className="py-2 align-top text-ink-700">{criterion.full}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Locked({ href }: { href: string }) {
  return (
    <div className="rounded-xl border border-dashed border-ink-300 bg-ink-50/60 p-4 text-[14px] text-ink-600">
      🔒 Правильные ответы, тексты записей, образцы и разбор каждого задания
      откроются после того, как вы отправите вариант на проверку. Стратегии и
      критерии оценивания доступны уже сейчас.{" "}
      <a href={href} className="font-medium text-brand-700 hover:underline">
        Перейти к варианту →
      </a>
    </div>
  );
}
