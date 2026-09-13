import type { GrammarGuide, GuideTable } from "@/lib/oge/grammar-guide";

function Table({ table, caption }: { table: GuideTable; caption?: string }) {
  return (
    <div className="space-y-1.5">
      {caption ? (
        <p className="text-[13px] font-semibold text-ink-700">{caption}</p>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-ink-200">
        <table className="w-full min-w-[480px] text-left text-[13.5px]">
          <thead className="bg-ink-50 text-ink-600">
            <tr>
              {table.head.map((cell) => (
                <th key={cell} className="px-3 py-2 font-medium">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 text-ink-800">
            {table.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, column) => (
                  <td
                    key={column}
                    className={`px-3 py-1.5 align-top ${column === 0 ? "font-medium text-ink-900" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Подробная теория к заданиям 20–28: алгоритм, правила по частям речи,
 * таблицы, частые ошибки и тренировка с ответами под спойлером.
 */
export function GrammarGuideView({
  guide,
  taskLinks,
}: {
  guide: GrammarGuide;
  /** Номера заданий демоверсии на каждую тему — только после отправки варианта */
  taskLinks: Record<string, number[]> | null;
}) {
  return (
    <div className="card space-y-5 p-5">
      <div>
        <h3 className="text-[16px] font-semibold text-ink-900">{guide.title}</h3>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{guide.intro}</p>
      </div>

      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-brand-700">
          Алгоритм для каждого пропуска
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[14px] leading-relaxed text-ink-800">
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {guide.sections.map((section, index) => (
          <a
            key={section.id}
            href={`#guide-${section.id}`}
            className="chip bg-ink-100 text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
          >
            {index + 1}. {section.title.split(" → ")[0]}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {guide.sections.map((section, index) => {
          const tasks = taskLinks?.[section.id] ?? [];
          return (
            <details
              key={section.id}
              id={`guide-${section.id}`}
              className="scroll-mt-24 rounded-xl border border-ink-200 px-4 py-3"
            >
              <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">
                {index + 1}. {section.title}
                {tasks.length ? (
                  <span className="chip ml-2 bg-emerald-50 align-middle text-emerald-700">
                    в демоверсии: № {tasks.join(", ")}
                  </span>
                ) : null}
              </summary>

              <div className="mt-3 space-y-4 text-[14px] leading-relaxed text-ink-800">
                <p className="rounded-lg bg-ink-50 px-3 py-2 text-ink-700">
                  <span className="font-semibold text-ink-900">Когда это нужно: </span>
                  {section.when}
                </p>

                <ul className="list-disc space-y-1 pl-5">
                  {section.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>

                {section.tables.map((item, tableIndex) => (
                  <Table key={tableIndex} table={item.table} caption={item.caption} />
                ))}

                {section.tips.length ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2">
                    {section.tips.map((tip) => (
                      <p key={tip} className="text-ink-700">
                        <span className="font-semibold text-amber-700">Важно: </span>
                        {tip}
                      </p>
                    ))}
                  </div>
                ) : null}

                <div>
                  <p className="text-[13px] font-semibold text-ink-700">Потренируйтесь</p>
                  <div className="mt-1.5 space-y-1.5">
                    {section.practice.map((item) => (
                      <details
                        key={item.task}
                        className="rounded-lg border border-ink-200 bg-white/60 px-3 py-2"
                      >
                        <summary className="cursor-pointer break-words text-ink-900">
                          {item.task}
                        </summary>
                        <p className="mt-1 text-ink-700">
                          <b className="text-emerald-700">Ответ: {item.answer}.</b> {item.why}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-rose-700">
          Из-за чего теряют баллы
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-ink-800">
          {guide.mistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </div>

      <p className="text-[12.5px] text-ink-400">
        Разбор составлен по темам видео{" "}
        <a
          href={guide.source.url}
          target="_blank"
          rel="noreferrer"
          className="text-brand-700 hover:underline"
        >
          {guide.source.title}
        </a>
        .
      </p>
    </div>
  );
}
