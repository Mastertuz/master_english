import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AnswerCard,
  CriteriaTable,
  Locked,
  StrategyCard,
  Transcript,
} from "@/components/oge/Razbor";
import { GrammarGuideView } from "@/components/oge/GrammarGuide";
import {
  HomelandIdeasView,
  LetterPhrasesView,
  MonologueBankView,
  VocabularyView,
} from "@/components/oge/Materials";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { grammarGuide } from "@/lib/oge/grammar-guide";
import { SeekButton, Timecodes } from "@/components/ui/SeekButton";
import { getVariant, requireOgeUser } from "@/lib/oge";
import { countWords, gapItems, MARK_SCALE } from "@/lib/oge/scoring";
import { STRUCTURE } from "@/lib/oge/summary";
import type { Explanation, GapLine, Matching } from "@/lib/oge/types";
import { prisma } from "@/lib/prisma";

const TOC = [
  { id: "listening", label: "Аудирование · 1–11" },
  { id: "reading", label: "Чтение · 12–19" },
  { id: "grammar", label: "Грамматика и лексика · 20–34" },
  { id: "writing", label: "Письмо · 35" },
  { id: "speaking", label: "Устная часть · 1–3" },
  { id: "vocabulary", label: "Лексика по темам и слова-ловушки" },
];

function option(options: string[], answer: string) {
  return `${answer}) ${options[Number(answer) - 1] ?? ""}`;
}

export default async function RazborPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const user = await requireOgeUser();
  const { variant: id } = await params;

  const variant = getVariant(id);
  if (!variant) notFound();

  const attempt =
    user.role === "ADMIN"
      ? null
      : await prisma.ogeAttempt.findUnique({
          where: { userId_variant: { userId: user.id, variant: id } },
          select: { submittedAt: true },
        });

  const isAdmin = user.role === "ADMIN";
  // Ученику ответы открываются только после отправки варианта,
  // а тексты аудиозаписей не открываются вовсе — они для преподавателя
  const reveal = isAdmin || Boolean(attempt?.submittedAt);
  const withRule = (key: number | string, explanation: Explanation): Explanation => ({
    ...explanation,
    rule: variant.rules[String(key)] ?? explanation.rule,
  });
  const examHref = `/oge/${variant.id}`;
  const { listening, reading, grammar, writing, speaking } = variant;

  return (
    <div className="space-y-8">
      <Link
        href="/oge"
        prefetch
        className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800"
      >
        ← ОГЭ
      </Link>

      <div>
        <h1 className="page-title">Разбор заданий · {variant.title}</h1>
        <p className="mt-1 text-[14.5px] text-ink-500">
          Что проверяет каждое задание, как его выполнять, где ловушки и почему
          верен именно этот ответ
        </p>
      </div>

      {!reveal ? <Locked href={examHref} /> : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <nav className="card p-5">
          <p className="text-[15px] font-semibold text-ink-900">Содержание</p>
          <ul className="mt-2 space-y-1 text-[14.5px]">
            {TOC.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-brand-700 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="card p-5">
          <p className="text-[15px] font-semibold text-ink-900">Баллы и отметка</p>
          <ul className="mt-2 space-y-0.5 text-[14px] text-ink-700">
            {STRUCTURE.map((row) => (
              <li key={row.part}>
                {row.part} ({row.tasks}) — {row.max} б., {row.time}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13.5px] text-ink-500">
            Всего 68 баллов.{" "}
            {MARK_SCALE.map((row) => `«${row.mark}» — ${row.range}`).join(", ")}.
            Задания с кратким ответом засчитываются, только если ответ совпадает
            с ключом без единой ошибки.
          </p>
        </div>
      </div>

      {/* ─────────────────────────── Аудирование ─────────────────────────── */}

      <section id="listening" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">
          Раздел 1. Аудирование · 15 баллов
        </h2>

        {reveal ? (
          <div className="card space-y-2 p-5">
            <AudioPlayer src={listening.audioUrl} title="Запись к заданиям 1–11" />
            <Timecodes src={listening.audioUrl} items={listening.marks} />
          </div>
        ) : null}

        <Block title="Задания 1–4 · по 1 баллу" intro={listening.part1.intro}>
          <StrategyCard strategy={listening.part1.strategy} />
          {reveal ? (
            <>
              <Timecodes src={listening.audioUrl} items={listening.part1.timecodes} />
              {listening.part1.questions.map((question) => (
                <AnswerCard
                  key={question.n}
                  n={question.n}
                  title={question.prompt}
                  answer={option(question.options, question.answer)}
                  explanation={withRule(question.n, question.explanation)}
                />
              ))}
              {isAdmin
                ? listening.part1.transcripts.map((item) => (
                    <Transcript
                      key={item.title}
                      title={`🔑 Текст записи · ${item.title}`}
                      text={item.text}
                      src={listening.audioUrl}
                      at={item.at}
                    />
                  ))
                : null}
            </>
          ) : null}
        </Block>

        <Block
          title="Задание 5 · до 5 баллов"
          intro={`${listening.part5.intro} За каждого говорящего с неверной рубрикой — минус 1 балл.`}
        >
          <OptionList options={listening.part5.options} />
          <StrategyCard strategy={listening.part5.strategy} />
          {reveal ? (
            <>
              <Timecodes src={listening.audioUrl} items={listening.part5.timecodes} />
              <MatchingAnswers
                task={listening.part5}
                label="Говорящий"
                rules={variant.rules}
              />
              {isAdmin
                ? listening.part5.transcripts.map((item) => (
                    <Transcript
                      key={item.title}
                      title={`🔑 Текст записи · ${item.title}`}
                      text={item.text}
                      src={listening.audioUrl}
                      at={item.at}
                    />
                  ))
                : null}
            </>
          ) : null}
        </Block>

        <Block title="Задания 6–11 · по 1 баллу" intro={listening.part6.intro}>
          <StrategyCard strategy={listening.part6.strategy} />
          {reveal ? (
            <>
              <Timecodes src={listening.audioUrl} items={listening.part6.timecodes} />
              {listening.part6.rows.map((row) => (
                <AnswerCard
                  key={row.n}
                  n={row.n}
                  title={row.label}
                  answer={row.answer.split(";").join(" / ")}
                  explanation={withRule(row.n, row.explanation)}
                />
              ))}
              {isAdmin ? (
                <Transcript
                  title="🔑 Текст записи · интервью"
                  text={listening.part6.transcript}
                  src={listening.audioUrl}
                  at={listening.part6.transcriptAt}
                />
              ) : null}
            </>
          ) : null}
        </Block>
      </section>

      {/* ────────────────────────────── Чтение ────────────────────────────── */}

      <section id="reading" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">Раздел 2. Чтение · 13 баллов</h2>

        <Block
          title="Задание 12 · до 6 баллов"
          intro={`${reading.part12.intro} За каждый текст с неверным вопросом — минус 1 балл.`}
        >
          <OptionList options={reading.part12.options} />
          <StrategyCard strategy={reading.part12.strategy} />
          {reveal ? (
            <>
              <MatchingAnswers task={reading.part12} label="Текст" rules={variant.rules} />
              <Transcript
                title="Тексты A–F"
                text={reading.part12.texts
                  .map((text) => `${text.letter}. ${text.text}`)
                  .join("\n\n")}
              />
            </>
          ) : null}
        </Block>

        <Block title="Задания 13–19 · по 1 баллу" intro={reading.part13.intro}>
          <StrategyCard strategy={reading.part13.strategy} />
          {reveal ? (
            <>
              {reading.part13.statements.map((statement) => (
                <AnswerCard
                  key={statement.n}
                  n={statement.n}
                  title={statement.prompt}
                  answer={option(statement.options, statement.answer)}
                  explanation={withRule(statement.n, statement.explanation)}
                />
              ))}
              <Transcript
                title={`Текст «${reading.part13.title}»`}
                text={reading.part13.paragraphs.join("\n\n")}
              />
            </>
          ) : null}
        </Block>
      </section>

      {/* ─────────────────────── Грамматика и лексика ─────────────────────── */}

      <section id="grammar" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">
          Раздел 3. Грамматика и лексика · 15 баллов
        </h2>

        <GrammarGuideView
          guide={grammarGuide}
          taskLinks={reveal ? grammar.part20.guideTasks ?? null : null}
        />

        <Block title="Задания 20–28 · грамматика, по 1 баллу" intro={grammar.part20.intro}>
          <StrategyCard strategy={grammar.part20.strategy} />
          {reveal ? <GapAnswers lines={grammar.part20.lines} rules={variant.rules} /> : null}
        </Block>

        <Block title="Задания 29–34 · словообразование, по 1 баллу" intro={grammar.part29.intro}>
          <StrategyCard strategy={grammar.part29.strategy} />
          {reveal ? <GapAnswers lines={grammar.part29.lines} rules={variant.rules} /> : null}
        </Block>
      </section>

      {/* ────────────────────────────── Письмо ────────────────────────────── */}

      <section id="writing" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">Раздел 4. Письмо · 10 баллов</h2>

        <Block title="Задание 35 · электронное письмо" intro={writing.intro}>
          <div className="rounded-xl border border-ink-200 bg-ink-50/80 p-4 text-[14.5px] leading-relaxed text-ink-800">
            <p className="text-[13px] text-ink-500">
              From: {writing.email.from} · Subject: {writing.email.subject}
            </p>
            {writing.email.body.map((line) => (
              <p key={line} className="mt-2">
                {line}
              </p>
            ))}
            <p className="mt-3 font-medium">{writing.task.join(" ")}</p>
          </div>

          <CriteriaTable criteria={writing.criteria} />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-ink-200 p-4">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-500">
                Важные правила
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-ink-800">
                {writing.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-ink-200 p-4">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-ink-500">
                План письма
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-[14px] leading-relaxed text-ink-800">
                {writing.plan.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-brand-700">
              Шаблон письма
            </p>
            <p className="mt-1 text-[13.5px] text-ink-600">
              Каждая часть — с новой строки. Имя в обращении берите из письма-стимула
              (в этом варианте — Mary), подпись — только своё имя. Через «/»
              даны варианты: выберите один.
            </p>
            <ol className="mt-3 space-y-2">
              {writing.template.map((line, index) => (
                <li
                  key={line.part}
                  className="grid gap-x-3 gap-y-0.5 rounded-lg bg-white/60 px-3 py-2 sm:grid-cols-[14rem_minmax(0,1fr)]"
                >
                  <span className="text-[13px] text-ink-500">
                    {index + 1}. {line.part}
                  </span>
                  <span className="break-words text-[14.5px] font-medium text-ink-900">
                    {line.phrases}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[13px] text-ink-500">
              Ответы на три вопроса пишите между 3-й и 4-й частями — отдельными
              абзацами.
            </p>
          </div>

          <LetterPhrasesView />

          <StrategyCard strategy={writing.strategy} />

          {reveal ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-emerald-700">
                Образец ответа · {countWords(writing.sample)} слов
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink-800">
                {writing.sample}
              </p>
            </div>
          ) : null}

          {reveal ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-emerald-700">
                Пример готового письма по шаблону · {countWords(writing.templateSample)} слов
              </p>
              <p className="mt-1 text-[13px] text-ink-500">
                Обращение, благодарность, ответы на три вопроса одним абзацем со
                связками (Well, As for…, By the way), завершение и подпись — каждое
                на своей строке.
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink-800">
                {writing.templateSample}
              </p>
            </div>
          ) : null}
        </Block>
      </section>

      {/* ─────────────────────────── Устная часть ─────────────────────────── */}

      <section id="speaking" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">Устная часть · 15 баллов</h2>

        <Block title="Задание 1 · чтение вслух, до 2 баллов" intro={speaking.task1.instruction}>
          <blockquote className="rounded-xl bg-ink-50/80 p-4 text-[15px] leading-relaxed text-ink-900">
            {speaking.task1.text}
          </blockquote>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-ink-200 text-ink-500">
                  <th className="py-2 pr-3 font-medium">Трудное место</th>
                  <th className="py-2 font-medium">Как прочитать</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {speaking.task1.hardWords.map((item) => (
                  <tr key={item.word}>
                    <td className="py-1.5 pr-3 font-medium text-ink-900">{item.word}</td>
                    <td className="py-1.5 text-ink-700">{item.tip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] text-ink-700">{speaking.task1.criteria}</p>
          <StrategyCard strategy={speaking.task1.strategy} />
        </Block>

        <Block title="Задание 2 · диалог-расспрос, до 6 баллов" intro={speaking.task2.instruction}>
          <p className="text-[14px] text-ink-700">{speaking.task2.criteria}</p>
          <StrategyCard strategy={speaking.task2.strategy} />
          {reveal ? (
            <>
              <AudioPlayer src={speaking.audioUrl} title="Запись телефонного опроса" />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[12.5px] text-ink-500">Таймкоды:</span>
                {speaking.task2.questions.map((question, index) => (
                  <SeekButton
                    key={question.start}
                    src={speaking.audioUrl}
                    at={question.start}
                    label={`Вопрос ${index + 1}`}
                  />
                ))}
              </div>
              {isAdmin ? (
                <Transcript
                  title="🔑 Транскрипция опроса"
                  text={[
                    speaking.task2.introText,
                    ...speaking.task2.questions.map(
                      (question) => `Electronic assistant: ${question.text}\nStudent: …`,
                    ),
                    speaking.task2.outroText,
                  ].join("\n\n")}
                  src={speaking.audioUrl}
                  at={0}
                />
              ) : null}
              {speaking.task2.questions.map((question, index) => (
                <AnswerCard
                  key={question.text}
                  n={index + 1}
                  title={isAdmin ? question.text : `Вопрос ${index + 1}`}
                  answer="полный ответ"
                  explanation={{
                    proof: question.sample,
                    why: "Образец: прямой ответ на вопрос и одна-две подробности. Ответ одним словом получил бы 0 баллов.",
                  }}
                />
              ))}
            </>
          ) : null}
        </Block>

        <Block title="Задание 3 · монолог, до 7 баллов" intro={speaking.task3.instruction}>
          <div className="rounded-xl bg-ink-50/80 p-4 text-[14.5px] text-ink-800">
            <p className="font-medium">Remember to say:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {speaking.task3.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <CriteriaTable criteria={speaking.task3.criteria} />
          <p className="text-[13.5px] text-ink-500">
            0 баллов по К1 — 0 за всё задание. Объём для максимума — 10–12 фраз,
            6–7 фраз дают не больше 1 балла по К1.
          </p>
          <StrategyCard strategy={speaking.task3.strategy} />
          {reveal ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-emerald-700">
                Образец монолога
              </p>
              <div className="mt-2 space-y-1.5 text-[14.5px] leading-relaxed text-ink-800">
                {speaking.task3.sample.split("\n").map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ) : null}

          <MonologueBankView />
          <HomelandIdeasView />
        </Block>
      </section>

      {/* ─────────────────────── Лексика и слова-ловушки ─────────────────────── */}

      <section id="vocabulary" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold text-ink-900">
          Лексика по темам и слова-ловушки
        </h2>
        <VocabularyView />
      </section>

      {!reveal ? <Locked href={examHref} /> : null}
    </div>
  );
}

function Block({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card space-y-4 p-5">
      <div>
        <h3 className="text-[16px] font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{intro}</p>
      </div>
      {children}
    </div>
  );
}

function OptionList({ options }: { options: string[] }) {
  return (
    <ol className="space-y-1 rounded-xl bg-ink-50/80 p-4 text-[14px] text-ink-800">
      {options.map((item, index) => (
        <li key={item} className="flex gap-2">
          <span className="w-5 shrink-0 font-semibold text-ink-500">{index + 1}.</span>
          {item}
        </li>
      ))}
    </ol>
  );
}

function MatchingAnswers({
  task,
  label,
  rules,
}: {
  task: Matching;
  label: string;
  rules: Record<string, string>;
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1 text-center text-[14px]">
          <tbody>
            <tr>
              <th className="px-2 text-left font-medium text-ink-500">{label}</th>
              {task.letters.map((letter) => (
                <th key={letter} className="w-10 font-semibold text-ink-900">
                  {letter}
                </th>
              ))}
            </tr>
            <tr>
              <td className="px-2 text-left text-ink-500">Ответ</td>
              {task.letters.map((letter, index) => (
                <td
                  key={letter}
                  className="rounded-md bg-emerald-50 py-1 font-semibold text-emerald-700"
                >
                  {task.answer[index]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {task.letters.map((letter, index) => {
        const explanation = task.explanations[letter];
        const digit = task.answer[index];
        return explanation ? (
          <AnswerCard
            key={letter}
            n={`${task.n}${letter}`}
            title={`${label} ${letter}`}
            answer={`${digit} — ${task.options[Number(digit) - 1]}`}
            explanation={{
              ...explanation,
              rule: rules[`${task.n}${letter}`] ?? explanation.rule,
            }}
          />
        ) : null;
      })}

      <div className="rounded-xl border border-ink-200 p-4 text-[14px] text-ink-700">
        <span className="font-semibold text-ink-900">
          Лишний вариант: {task.extra.option}. {task.options[task.extra.option - 1]}
        </span>{" "}
        — {task.extra.why}
      </div>
    </>
  );
}

function GapAnswers({
  lines,
  rules,
}: {
  lines: GapLine[];
  rules: Record<string, string>;
}) {
  return (
    <>
      {gapItems(lines).map((gap) => (
        <AnswerCard
          key={gap.n}
          n={gap.n}
          title={
            <>
              {gap.before} <span className="rounded bg-brand-50 px-1.5 text-brand-700">___</span>{" "}
              {gap.after}{" "}
              <span className="chip bg-ink-100 font-semibold text-ink-700">{gap.word}</span>
            </>
          }
          answer={gap.answer.split(";").join(" / ")}
          explanation={{
            ...gap.explanation,
            rule: rules[String(gap.n)] ?? gap.explanation.rule,
          }}
        />
      ))}
    </>
  );
}
