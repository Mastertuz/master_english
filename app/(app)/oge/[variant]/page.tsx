import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adminDeleteOgeAttemptAction,
  adminReopenOgeAction,
} from "@/app/actions/oge";
import { OgeReviewForm } from "@/components/oge/OgeReviewForm";
import { OgeRunner, type CheckMap } from "@/components/oge/OgeRunner";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { getVariant, requireOgeUser } from "@/lib/oge";
import {
  countWords,
  SPEAKING_MAX,
  TOTAL_MAX,
  WRITING_MAX,
} from "@/lib/oge/scoring";
import { STATUS_LABEL, STATUS_STYLE, summarize } from "@/lib/oge/summary";
import { teacherNotes } from "@/lib/oge/teacher";
import { examView } from "@/lib/oge/view";
import { prisma } from "@/lib/prisma";

export default async function OgeVariantPage({
  params,
  searchParams,
}: {
  params: Promise<{ variant: string }>;
  searchParams: Promise<{ student?: string }>;
}) {
  const user = await requireOgeUser();
  const [{ variant: id }, { student }] = await Promise.all([params, searchParams]);

  const variant = getVariant(id);
  if (!variant) notFound();

  // Учитель открывает работу ученика по ссылке ?student=
  const studentId =
    user.role === "ADMIN" && student && student !== user.id ? student : null;

  const owner = studentId
    ? await prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, firstName: true, lastName: true },
      })
    : null;
  if (studentId && !owner) notFound();

  const attempt = await prisma.ogeAttempt.findUnique({
    where: { userId_variant: { userId: studentId ?? user.id, variant: id } },
    select: {
      id: true,
      answers: true,
      review: true,
      comment: true,
      submittedAt: true,
      checkedAt: true,
      updatedAt: true,
      recordings: {
        select: { id: true, taskKey: true, durationSec: true, createdAt: true },
      },
    },
  });

  const summary = summarize(variant, attempt);
  const reviewing = Boolean(studentId);
  const readOnly = reviewing || Boolean(attempt?.submittedAt);

  // Ключи уходят в браузер только тогда, когда менять ответы уже нельзя
  const checks: CheckMap | null = readOnly
    ? Object.fromEntries(
        [
          ...summary.written.listening.items,
          ...summary.written.reading.items,
          ...summary.written.grammar.items,
        ].map((item) => [
          item.key,
          { expected: item.expected, points: item.points, max: item.max },
        ]),
      )
    : null;

  const recordings = Object.fromEntries(
    (attempt?.recordings ?? []).map((recording) => [
      recording.taskKey,
      {
        id: recording.id,
        durationSec: recording.durationSec,
        createdAt: recording.createdAt.toISOString(),
      },
    ]),
  );

  return (
    <div className="space-y-6">
      <Link
        href={owner ? `/students/${owner.id}` : "/oge"}
        prefetch
        className="inline-block text-[13.5px] text-ink-500 hover:text-ink-800"
      >
        ← {owner ? `${owner.firstName} ${owner.lastName}` : "ОГЭ"}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{variant.title}</h1>
          <p className="mt-1 text-[14.5px] text-ink-500">
            {owner
              ? `Работа ученика: ${owner.firstName} ${owner.lastName}`
              : "Письменная часть — 2 часа, устная — 15 минут"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip ${STATUS_STYLE[summary.status]}`}>
            {STATUS_LABEL[summary.status]}
          </span>
          <Link
            href={`/oge/${variant.id}/razbor`}
            prefetch
            className="btn-ghost btn-sm"
          >
            📖 Разбор заданий
          </Link>
        </div>
      </div>

      {reviewing && !attempt ? (
        <div className="card p-8 text-center text-[14.5px] text-ink-500">
          Ученик ещё не приступал к этому варианту.
        </div>
      ) : null}

      {!readOnly ? (
        <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-[14px] leading-relaxed text-ink-700">
          Выполняйте разделы в любом порядке — ответы сохраняются автоматически,
          можно закрыть страницу и вернуться. Когда закончите, нажмите «Отправить
          на проверку» внизу страницы: задания 1–34 проверятся сразу, письмо и
          устную часть оценит преподаватель. Правильные ответы и разбор откроются
          после отправки.
        </div>
      ) : null}

      {readOnly && attempt ? (
        <div className="card space-y-4 p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">Результаты</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat
              label="Аудирование"
              value={`${summary.written.listening.points} / ${summary.written.listening.max}`}
            />
            <Stat
              label="Чтение"
              value={`${summary.written.reading.points} / ${summary.written.reading.max}`}
            />
            <Stat
              label="Грамматика и лексика"
              value={`${summary.written.grammar.points} / ${summary.written.grammar.max}`}
            />
            <Stat
              label="Письмо"
              value={summary.writing === null ? "ждёт проверки" : `${summary.writing} / ${WRITING_MAX}`}
            />
            <Stat
              label="Устная часть"
              value={summary.speaking === null ? "ждёт проверки" : `${summary.speaking} / ${SPEAKING_MAX}`}
            />
            <Stat
              label={summary.status === "checked" ? `Итого · отметка ${summary.mark}` : "Итого"}
              value={`${summary.total} / ${TOTAL_MAX}`}
              accent
            />
          </div>
          {!attempt.submittedAt ? (
            <p className="text-[13.5px] text-amber-700">
              Ученик ещё не отправил работу — видны сохранённые черновые ответы.
            </p>
          ) : null}
          {attempt.checkedAt && attempt.comment ? (
            <div className="rounded-xl bg-brand-50/70 px-4 py-3 text-[14.5px] leading-relaxed text-ink-800">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-brand-700">
                Комментарий преподавателя
              </p>
              <p className="mt-1 whitespace-pre-wrap">{attempt.comment}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {!reviewing || attempt ? (
        <OgeRunner
          key={attempt?.id ?? "empty"}
          exam={examView(variant)}
          initialAnswers={summary.answers}
          initialRecordings={recordings}
          readOnly={readOnly}
          checks={checks}
          teacher={user.role === "ADMIN" ? teacherNotes(variant) : null}
          savedAt={attempt?.updatedAt.toISOString() ?? null}
        />
      ) : null}

      {reviewing && attempt ? (
        <section className="card space-y-5 p-5">
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">Оценка преподавателя</h2>
            <p className="mt-1 text-[13px] text-ink-500">
              Задания 1–34 проверены автоматически. Письмо и устную часть оцените
              по критериям — подробности в разборе заданий.
            </p>
          </div>

          <OgeReviewForm
            attemptId={attempt.id}
            review={summary.review}
            comment={attempt.comment}
            autoPoints={summary.auto}
            autoMax={summary.autoMax}
            words={countWords(summary.answers["35"] ?? "")}
          />

          <div className="flex flex-wrap gap-2 border-t border-ink-100 pt-4">
            {attempt.submittedAt ? (
              <form action={adminReopenOgeAction}>
                <input type="hidden" name="attemptId" value={attempt.id} />
                <ConfirmSubmit
                  className="btn-ghost btn-sm"
                  danger={false}
                  title="Вернуть работу ученику?"
                  message="Ученик снова сможет менять ответы и перезаписывать устные задания, а затем отправит работу ещё раз. Оценка сбросится до повторной проверки."
                  confirmLabel="Вернуть"
                >
                  Вернуть на доработку
                </ConfirmSubmit>
              </form>
            ) : null}
            <form action={adminDeleteOgeAttemptAction}>
              <input type="hidden" name="attemptId" value={attempt.id} />
              <ConfirmSubmit
                title="Удалить работу ученика?"
                message="Все ответы, записи устной части и оценка будут удалены — ученик начнёт вариант с нуля."
                confirmLabel="Удалить"
              >
                Удалить работу
              </ConfirmSubmit>
            </form>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        accent ? "border-brand-200 bg-brand-50/70" : "border-ink-200"
      }`}
    >
      <p className="text-[12.5px] text-ink-500">{label}</p>
      <p className="mt-0.5 text-[17px] font-semibold text-ink-900">{value}</p>
    </div>
  );
}
